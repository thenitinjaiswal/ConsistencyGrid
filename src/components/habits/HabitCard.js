"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function HabitCard() {
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    loadHabits();
  }, []);

  async function toggleHabit(habitId, currentStatus) {
    // Optimistic UI update
    setHabits((prev) =>
      prev.map((h) => (h.id === habitId ? { ...h, done: !currentStatus } : h))
    );

    try {
      await fetch("/api/habits/toggle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ habitId }),
      });

      if (!currentStatus) {
        toast.success("Habit completed! Keep it up! 🔥");
      }
    } catch (error) {
      toast.error("Failed to update habit");
      loadHabits(); // Revert on error
    }
  }

  async function deleteHabit(habitId) {
    if (!confirm("Are you sure you want to delete this habit?")) return;

    try {
      const res = await fetch(`/api/habits/${habitId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        toast.success("Habit deleted");
        loadHabits();
      } else {
        toast.error("Failed to delete habit");
      }
    } catch (error) {
      toast.error("Error deleting habit");
    }
  }

  if (loading) {
    return <div className="py-10 text-center text-gray-500">Loading habits...</div>;
  }

  return (
    <div className="space-y-4">
      {habits.map((h) => (
        <div
          key={h.id}
          className="group flex items-center justify-between rounded-2xl border bg-white p-6 shadow-sm transition-all hover:shadow-md"
        >
          <div className="flex items-center gap-4">
            <button
              onClick={() => toggleHabit(h.id, h.done)}
              className={`flex h-8 w-8 items-center justify-center rounded-full border-2 transition-colors ${h.done
                  ? "border-green-500 bg-green-500 text-white"
                  : "border-gray-300 text-transparent hover:border-green-500"
                }`}
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="3"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </button>

            <div>
              <p
                className={`font-semibold text-gray-900 transition-all ${h.done ? "text-gray-400 line-through" : ""
                  }`}
              >
                {h.title}
              </p>
              <p className="text-xs text-gray-500">
                {h.streak > 0 ? `🔥 ${h.streak} day streak` : "Start your streak"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => deleteHabit(h.id)}
              className="invisible rounded-lg p-2 text-gray-400 hover:bg-red-50 hover:text-red-500 group-hover:visible"
              title="Delete Habit"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </button>
          </div>
        </div>
      ))}

      {habits.length === 0 && (
        <div className="rounded-2xl border bg-white p-10 text-center text-sm text-gray-500">
          <div className="mb-3 text-4xl">✨</div>
          <p>No habits yet.</p>
          <p className="mt-1">Click <b>Add Habit</b> to create your first habit!</p>
        </div>
      )}
    </div>
  );
}

