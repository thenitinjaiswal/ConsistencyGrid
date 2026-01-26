"use client";

import { useEffect, useState, useCallback } from "react";
import toast from "react-hot-toast";
import { Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { sendWallpaperToAndroid } from "@/utils/sendWallpaperToAndroid";

function getLocalDateString(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

const HABIT_COLORS = ["#10b981", "#f59e0b", "#06b6d4", "#8b5cf6", "#ec4899", "#ef4444"];

export default function HabitCard() {
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const [savingIds, setSavingIds] = useState(new Set());
  const [publicToken, setPublicToken] = useState("");

  // Load habits
  const loadHabits = useCallback(async () => {
    try {
      const res = await fetch("/api/habits/today", { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to load");
      const json = await res.json();
      setHabits(json.habits || []);

      // Get public token for wallpaper updates
      const settingsRes = await fetch("/api/settings/me");
      if (settingsRes.ok) {
        const settingsData = await settingsRes.json();
        if (settingsData?.user?.publicToken) {
          setPublicToken(settingsData.user.publicToken);
        }
      }
    } catch (error) {
      console.error("Failed to load habits:", error);
      toast.error("Failed to load habits");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadHabits();

    // Auto-refresh every 20 seconds
    const interval = setInterval(loadHabits, 20000);

    // Refresh on page focus
    const handleFocus = () => loadHabits();
    window.addEventListener("focus", handleFocus);

    return () => {
      clearInterval(interval);
      window.removeEventListener("focus", handleFocus);
    };
  }, [loadHabits]);

  const toggleHabit = useCallback(async (habitId, date) => {
    const habit = habits.find(h => h.id === habitId);
    if (!habit) return;

    const targetDate = date || getLocalDateString(new Date());
    const log = habit.logs?.find(l => getLocalDateString(new Date(l.date)) === targetDate);
    const currentStatus = log?.done || false;

    // Optimistic update
    const prevHabits = habits;
    setHabits(prev =>
      prev.map(h => {
        if (h.id === habitId) {
          const newLogs = (h.logs || []).map(l => {
            const logDate = getLocalDateString(new Date(l.date));
            if (logDate === targetDate) {
              return { ...l, done: !l.done };
            }
            return l;
          });

          // If no log exists, create one
          if (!newLogs.find(l => getLocalDateString(new Date(l.date)) === targetDate)) {
            newLogs.push({ date: new Date(targetDate), done: true });
          }

          return { ...h, logs: newLogs };
        }
        return h;
      })
    );

    // Save to backend
    setSavingIds(prev => new Set([...prev, habitId]));
    try {
      const res = await fetch("/api/habits/toggle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ habitId, date: targetDate }),
      });

      if (!res.ok) {
        throw new Error("Failed to save");
      }

      const data = await res.json();
      if (!data?.log) throw new Error("Invalid response");

      toast.success("✓ Updated");

      // Android Bridge: Auto-update wallpaper on habit toggle
      if (publicToken) {
        const wallpaperUrl = `${window.location.origin}/w/${publicToken}/image.png`;
        sendWallpaperToAndroid(wallpaperUrl);
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to update");
      setHabits(prevHabits); // Rollback
    } finally {
      setSavingIds(prev => {
        const next = new Set(prev);
        next.delete(habitId);
        return next;
      });
    }
  }, [habits]);

  const deleteHabit = useCallback(async (habitId) => {
    if (!window.confirm("Delete this habit?")) return;

    try {
      const res = await fetch(`/api/habits/${habitId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");

      setHabits(prev => prev.filter(h => h.id !== habitId));
      toast.success("Habit deleted");
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to delete habit");
    }
  }, []);

  if (loading) {
    return (
      <div className="space-y-3 sm:space-y-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-20 sm:h-24 bg-gray-200 rounded-2xl animate-pulse" />
        ))}
      </div>
    );
  }

  if (habits.length === 0) {
    return (
      <div className="rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 p-8 sm:p-12 text-center">
        <div className="text-4xl mb-3">✨</div>
        <h3 className="text-lg font-semibold text-gray-900">No habits yet</h3>
        <p className="text-sm text-gray-600 mt-1">Click "Add Habit" to start tracking</p>
      </div>
    );
  }

  const today = getLocalDateString(new Date());

  return (
    <div className="space-y-3 sm:space-y-4">
      {habits.map((habit, idx) => {
        const color = HABIT_COLORS[idx % HABIT_COLORS.length];
        const todayLog = habit.logs?.find(l => getLocalDateString(new Date(l.date)) === today);
        const isDone = todayLog?.done || false;
        const isExpanded = expandedId === habit.id;

        // Get current week
        const now = new Date();
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - now.getDay());

        const weekDays = Array.from({ length: 7 }).map((_, i) => {
          const d = new Date(startOfWeek);
          d.setDate(startOfWeek.getDate() + i);
          const dateStr = getLocalDateString(d);
          return {
            date: dateStr,
            label: d.toLocaleDateString("en", { weekday: "narrow" }),
            isToday: dateStr === today,
          };
        });

        return (
          <div
            key={habit.id}
            className="rounded-2xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden"
          >
            {/* Header */}
            <div className="p-3 sm:p-4">
              <div className="flex items-center gap-3 sm:gap-4">
                {/* Checkbox */}
                <button
                  onClick={() => toggleHabit(habit.id, today)}
                  disabled={savingIds.has(habit.id)}
                  className="flex-shrink-0 h-7 w-7 sm:h-8 sm:w-8 rounded-full border-2 flex items-center justify-center transition-all hover:scale-110 disabled:opacity-50"
                  style={{
                    borderColor: isDone ? color : "#d1d5db",
                    backgroundColor: isDone ? color : "transparent",
                  }}
                >
                  {isDone && (
                    <svg className="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </button>

                {/* Title & Time */}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 text-sm sm:text-base truncate">{habit.title}</p>
                  {habit.scheduledTime && (
                    <p className="text-xs text-gray-500 mt-0.5">🕐 {habit.scheduledTime}</p>
                  )}
                </div>

                {/* Status Badge */}
                <div className="flex-shrink-0">
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${isDone ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                    {isDone ? "Done" : "Pending"}
                  </span>
                </div>

                {/* Expand Button */}
                <button
                  onClick={() => setExpandedId(isExpanded ? null : habit.id)}
                  className="flex-shrink-0 p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  {isExpanded ? (
                    <ChevronUp className="h-5 w-5 text-gray-600" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-600" />
                  )}
                </button>

                {/* Delete Button */}
                <button
                  onClick={() => deleteHabit(habit.id)}
                  className="flex-shrink-0 p-1.5 hover:bg-red-50 text-red-500 rounded-lg transition-colors"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>

              {/* Week View - Collapsed */}
              {!isExpanded && (
                <div className="flex gap-1.5 mt-3 sm:mt-4">
                  {weekDays.map(day => {
                    const log = habit.logs?.find(l => getLocalDateString(new Date(l.date)) === day.date);
                    const completed = log?.done;
                    const isClickable = day.isToday;

                    return (
                      <button
                        key={day.date}
                        onClick={() => isClickable && toggleHabit(habit.id, day.date)}
                        disabled={savingIds.has(habit.id) || !isClickable}
                        className={`h-7 w-7 sm:h-8 sm:w-8 rounded-lg font-bold text-xs transition-all flex-shrink-0 ${isClickable
                            ? 'hover:scale-105 cursor-pointer'
                            : 'cursor-not-allowed opacity-40'
                          }`}
                        style={{
                          backgroundColor: completed ? color : "#f3f4f6",
                          color: completed ? "white" : "#9ca3af",
                        }}
                        title={isClickable ? `${day.label} - Today` : `${day.label} - ${day.date} (cannot edit)`}
                      >
                        {day.label}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Expanded View - Week Details */}
            {isExpanded && (
              <div className="border-t border-gray-200 bg-gray-50 p-3 sm:p-4 animate-in slide-in-from-top duration-200">
                <p className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-3">This Week (View Only - Edit Today Only)</p>
                <div className="space-y-2">
                  {weekDays.map(day => {
                    const log = habit.logs?.find(l => getLocalDateString(new Date(l.date)) === day.date);
                    const completed = log?.done;
                    const isClickable = day.isToday;

                    return (
                      <button
                        key={day.date}
                        onClick={() => isClickable && toggleHabit(habit.id, day.date)}
                        disabled={savingIds.has(habit.id) || !isClickable}
                        className={`w-full flex items-center gap-3 p-2.5 rounded-lg transition-colors ${isClickable
                            ? 'hover:bg-white cursor-pointer'
                            : 'cursor-not-allowed opacity-50'
                          }`}
                      >
                        <div
                          className="h-5 w-5 rounded-md flex items-center justify-center flex-shrink-0"
                          style={{
                            backgroundColor: completed ? color : "#e5e7eb",
                            color: completed ? "white" : "#9ca3af",
                          }}
                        >
                          {completed && (
                            <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          )}
                        </div>
                        <div className="flex-1 text-left">
                          <p className={`text-sm font-medium ${isClickable ? 'text-gray-900' : 'text-gray-500'}`}>
                            {day.label} - {day.date}
                          </p>
                        </div>
                        {day.isToday && (
                          <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded">
                            Today - Editable
                          </span>
                        )}
                        {!isClickable && (
                          <span className="text-xs text-gray-500">
                            Read-only
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
