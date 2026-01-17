"use client";

// ============================================================================
// IMPORTS
// ============================================================================
// React hooks for state management and lifecycle
import { useEffect, useState } from "react";
// Toast notifications for user feedback
import toast from "react-hot-toast";

// ============================================================================
// CONSTANTS
// ============================================================================
// Color palette for habit cards (cycles through these colors)
const HABIT_COLORS = ["#10b981", "#f59e0b", "#06b6d4"];

// ============================================================================
// MAIN COMPONENT
// ============================================================================
export default function HabitCard() {
  // ============================================================================
  // STATE MANAGEMENT
  // ============================================================================
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);

  // ============================================================================
  // DATA FETCHING
  // ============================================================================
  /**
   * Loads all habits from the API
   * Called on component mount and after mutations
   */
  async function loadHabits() {
    try {
      const res = await fetch("/api/habits/today");
      const json = await res.json();
      if (res.ok) setHabits(json.habits || []);
    } catch (error) {
      console.error("Failed to load habits");
    } finally {
      setLoading(false);
    }
  }

  // Load habits when component mounts
  useEffect(() => {
    loadHabits();
  }, []);

  // ============================================================================
  // HABIT ACTIONS
  // ============================================================================
  /**
   * Toggles a habit's completion status for a specific date
   * @param {string} habitId - The ID of the habit to toggle
   * @param {boolean} currentStatus - Current completion status
   * @param {string} date - Target date (defaults to today)
   */
  async function toggleHabit(habitId, currentStatus, date = null) {
    // If no date provided, default to today
    const targetDate = date || new Date().toISOString().split("T")[0];

    // Optimistically update UI
    setHabits((prev) =>
      prev.map((h) => {
        if (h.id === habitId) {
          // Check if log exists for this date
          const logIndex = h.logs?.findIndex((log) => new Date(log.date).toISOString().split("T")[0] === targetDate);

          let newLogs = [...(h.logs || [])];
          let isDone = !currentStatus; // Default new status

          if (logIndex >= 0) {
            // Toggle existing log locally
            newLogs[logIndex] = { ...newLogs[logIndex], done: !newLogs[logIndex].done };
            isDone = newLogs[logIndex].done;
          } else {
            // Add new log locally
            newLogs.push({ date: targetDate, done: true });
            isDone = true;
          }

          // Use 'done' property for today's main checkbox if targetDate is today
          const isToday = targetDate === new Date().toISOString().split("T")[0];

          return {
            ...h,
            logs: newLogs,
            done: isToday ? isDone : h.done
          };
        }
        return h;
      })
    );

    // Persist to backend
    try {
      await fetch("/api/habits/toggle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ habitId, date: targetDate }),
      });

      // Show success toast only when marking as complete
      if (!currentStatus) {
        toast.success("Habit updated! 🔥");
      }
    } catch (error) {
      toast.error("Failed to update habit");
      loadHabits(); // Reload on error to sync state
    }
  }

  /**
   * Deletes a habit after user confirmation
   * @param {string} habitId - The ID of the habit to delete
   */
  async function deleteHabit(habitId) {
    if (!confirm("Are you sure you want to delete this habit?")) return;

    try {
      const res = await fetch(`/api/habits/${habitId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        toast.success("Habit deleted");
        loadHabits();
      }
    } catch (error) {
      toast.error("Error deleting habit");
    }
  }

  // ============================================================================
  // UTILITY FUNCTIONS
  // ============================================================================
  /**
   * Converts 24-hour time format to 12-hour format with AM/PM
   * @param {string} time - Time in HH:MM format
   * @returns {string} Formatted time string
   */
  const formatTime = (time) => {
    if (!time) return "";
    const [hours, minutes] = time.split(":");
    const h = parseInt(hours);
    const ampm = h >= 12 ? "PM" : "AM";
    const hour12 = h % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  // ============================================================================
  // LOADING STATE
  // ============================================================================
  if (loading) {
    return <div className="py-10 text-center text-gray-500">Loading habits...</div>;
  }

  // ============================================================================
  // RENDER
  // ============================================================================
  return (
    <div className="space-y-3">
      {habits.map((habit, index) => {
        // Assign color based on index (cycles through color palette)
        const habitColor = HABIT_COLORS[index % HABIT_COLORS.length];

        // Get today's date
        const todayDate = new Date().toISOString().split("T")[0];

        // Check if today's habit is completed
        const isTodayDone = habit.logs?.some(l => new Date(l.date).toISOString().split("T")[0] === todayDate && l.done);

        // ============================================================================
        // CALCULATE CURRENT WEEK (Sunday -> Saturday)
        // ============================================================================
        const curr = new Date();
        const startOfWeek = new Date(curr.setDate(curr.getDate() - curr.getDay())); // First day is Sunday

        const weekDays = Array.from({ length: 7 }).map((_, i) => {
          const date = new Date(startOfWeek);
          date.setDate(startOfWeek.getDate() + i);

          const dateStr = date.toISOString().split("T")[0];
          return {
            date: dateStr,
            label: date.toLocaleDateString("en", { weekday: "narrow" }),
            isToday: dateStr === todayDate,
            isFuture: dateStr > todayDate
          };
        });

        // ============================================================================
        // HABIT CARD RENDER
        // ============================================================================
        return (
          <div
            key={habit.id}
            className="flex items-center gap-4 rounded-2xl border border-gray-100 bg-white px-5 py-4 shadow-sm hover:shadow-md transition-shadow"
          >
            {/* ============================================================================ */}
            {/* MAIN CHECKBOX (Today's Status) */}
            {/* ============================================================================ */}
            <button
              onClick={() => toggleHabit(habit.id, isTodayDone, todayDate)}
              className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full border-2 transition-all hover:scale-110 active:scale-95"
              style={{
                borderColor: isTodayDone ? habitColor : "#d1d5db",
              }}
            >
              {isTodayDone && (
                <div className="h-full w-full rounded-full flex items-center justify-center" style={{ backgroundColor: habitColor }}>
                  <svg className="h-3 w-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}
            </button>

            {/* ============================================================================ */}
            {/* HABIT INFORMATION & WEEK VIEW */}
            {/* ============================================================================ */}
            <div className="flex-1 min-w-0">
              {/* Title Row */}
              <div className="flex items-center gap-2.5 mb-3">
                <div className="h-2.5 w-2.5 rounded-full shadow-sm" style={{ backgroundColor: habitColor }} />
                <span className="font-semibold text-gray-900 text-base">{habit.title}</span>
                {habit.scheduledTime && (
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{
                    color: habitColor,
                    backgroundColor: habitColor + '15'
                  }}>
                    🕐 {formatTime(habit.scheduledTime)}
                  </span>
                )}
              </div>

              {/* Week Day Buttons (Interactive for past/today, disabled for future) */}
              <div className="flex gap-1.5">
                {weekDays.map((day) => {
                  // Find completion log for this day
                  const log = habit.logs?.find(
                    (log) => new Date(log.date).toISOString().split("T")[0] === day.date
                  );
                  const isCompleted = log?.done;

                  return (
                    <button
                      key={day.date}
                      disabled={!day.isToday} // CHANGED: Disable if not today (Strict Mode)
                      onClick={() => day.isToday && toggleHabit(habit.id, isCompleted, day.date)}
                      className={`h-8 w-8 rounded-lg flex items-center justify-center text-xs font-bold transition-all ${!day.isToday
                          ? (day.isFuture ? 'cursor-not-allowed opacity-40' : 'cursor-default') // Past days static, Future disabled
                          : 'ring-2 ring-offset-1 cursor-pointer hover:scale-105 shadow-sm'
                        }`}
                      style={{
                        backgroundColor: isCompleted ? habitColor : day.isFuture ? "#fafafa" : "#f3f4f6",
                        color: isCompleted ? "white" : day.isFuture ? "#d1d5db" : "#9ca3af",
                        ringColor: day.isToday ? habitColor : 'transparent'
                      }}
                      title={day.isToday ? "Toggle status" : (day.isFuture ? "Cannot edit future" : "Cannot edit past")}
                    >
                      {day.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ============================================================================ */}
            {/* ACTION BUTTONS */}
            {/* ============================================================================ */}
            <div className="flex items-center gap-2.5 flex-shrink-0">
              <button
                onClick={() => deleteHabit(habit.id)}
                className="rounded-lg p-2 text-gray-400 hover:bg-red-50 hover:text-red-500 transition-all"
                title="Delete habit"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
        );
      })}

      {/* ============================================================================ */}
      {/* EMPTY STATE */}
      {/* ============================================================================ */}
      {habits.length === 0 && (
        <div className="rounded-2xl border border-gray-100 bg-white p-12 text-center shadow-sm">
          <div className="mb-4 text-5xl">✨</div>
          <p className="text-gray-900 font-semibold text-lg">No habits yet</p>
          <p className="mt-2 text-sm text-gray-500">Click <b>Add Habit</b> to get started!</p>
        </div>
      )}
    </div>
  );
}