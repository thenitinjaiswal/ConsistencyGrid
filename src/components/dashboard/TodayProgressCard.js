"use client";

import Card from "@/components/ui/Card";
import { useEffect, useState } from "react";
import { CheckCircle2, Circle } from "lucide-react";

// Helper function to get date string in local timezone (YYYY-MM-DD)
function getLocalDateString(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export default function TodayProgressCard() {
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadHabits = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/habits", { cache: "no-store" });
      
      if (!res.ok) {
        console.error("API returned status:", res.status);
        setHabits([]);
        return;
      }
      
      const habitsArray = await res.json();
      // Use local date, not UTC
      const today = getLocalDateString(new Date());
      
      // Add today's completion status to each habit
      const habitsWithStatus = (Array.isArray(habitsArray) ? habitsArray : habitsArray.habits || [])
        .filter((h) => h.isActive !== false) // Include habits that are active
        .slice(0, 6)
        .map((habit) => {
          // Properly parse log dates
          const todayLog = habit.logs?.find((log) => {
            const logDate = getLocalDateString(new Date(log.date));
            return logDate === today && log.done === true;
          });
          
          return {
            ...habit,
            done: !!todayLog,
          };
        });
      
      setHabits(habitsWithStatus);
    } catch (err) {
      console.error("Failed to load habits:", err);
      setHabits([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHabits();
    // Refresh every 5 seconds for real-time updates
    const interval = setInterval(loadHabits, 5000);
    
    const handleFocus = () => {
      setLoading(true);
      loadHabits();
    };
    
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        setLoading(true);
        loadHabits();
      }
    };
    
    window.addEventListener("focus", handleFocus);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener("focus", handleFocus);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  const doneCount = habits.filter((h) => h.done).length;
  const progressPercent = habits.length > 0 ? (doneCount / habits.length) * 100 : 0;

  const toggleHabit = async (habitId) => {
    // Store original state for rollback
    const originalHabits = habits;
    
    try {
      const habit = habits.find((h) => h.id === habitId);
      // Use local date, not UTC
      const today = getLocalDateString(new Date());

      // Optimistically update UI
      setHabits(
        habits.map((h) =>
          h.id === habitId ? { ...h, done: !h.done } : h
        )
      );

      // Send to backend
      const res = await fetch("/api/habits/toggle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          habitId,
          date: today,
        }),
      });

      // If request failed, rollback the optimistic update
      if (!res.ok) {
        console.error("Failed to update habit, status:", res.status);
        setHabits(originalHabits); // Rollback
        return;
      }

      // Verify we got valid data back
      const data = await res.json();
      if (!data || !data.log) {
        console.error("Invalid response from toggle endpoint");
        setHabits(originalHabits); // Rollback
      }
    } catch (err) {
      console.error("Failed to update habit:", err);
      setHabits(originalHabits); // Rollback on error
    }
  };

  return (
    <Card className="p-6 border border-gray-200/50">
      <h2 className="text-lg font-semibold text-gray-900 mb-2">Today's Progress</h2>
      <p className="text-sm text-gray-600 mb-4">
        {doneCount}/{habits.length} habits completed
      </p>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-10 bg-gray-100 rounded-lg animate-pulse"
            />
          ))}
        </div>
      ) : habits.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-sm text-gray-500 mb-3">No habits yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {habits.map((habit) => (
            <button
              key={habit.id}
              onClick={() => toggleHabit(habit.id)}
              className="w-full flex items-center gap-3 p-3 rounded-lg bg-gray-50 hover:bg-orange-50/30 border border-gray-100 transition-all group"
            >
              {habit.done ? (
                <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
              ) : (
                <Circle className="w-5 h-5 text-gray-300 group-hover:text-orange-300 flex-shrink-0" />
              )}
              <span
                className={`text-sm flex-1 text-left ${
                  habit.done ? "text-gray-500 line-through" : "text-gray-800"
                }`}
              >
                {habit.title}
              </span>
            </button>
          ))}
        </div>
      )}
    </Card>
  );
}
