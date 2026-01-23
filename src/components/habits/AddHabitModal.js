"use client";

import { useState } from "react";
import toast from "react-hot-toast";

export default function AddHabitModal({ open, onClose, onHabitAdded }) {
  const [title, setTitle] = useState("");
  const [scheduledTime, setScheduledTime] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!open) return null;

  async function handleAdd() {
    if (!title.trim()) {
      setError("Please enter a habit name");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/habits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: title.trim(), scheduledTime: scheduledTime || null }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to add habit");
      }

      const newHabit = await res.json();
      toast.success("Habit added successfully! 🎯");
      
      // Reset form
      setTitle("");
      setScheduledTime("");
      setError("");
      
      // Callback to parent to refresh
      if (onHabitAdded) onHabitAdded(newHabit);
      
      onClose();
    } catch (err) {
      console.error("Error adding habit:", err);
      setError(err.message || "Failed to add habit");
      toast.error(err.message || "Failed to add habit");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl animate-in zoom-in-95 duration-200">
        <h2 className="text-xl font-bold text-gray-900">Add New Habit</h2>
        <p className="mt-1 text-sm text-gray-600">
          Create a new habit to track and build consistency
        </p>

        <div className="mt-5 space-y-4">
          {error && (
            <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600 border border-red-200">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Habit Name <span className="text-red-500">*</span>
            </label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
              placeholder="e.g., Exercise, Read, Meditate"
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Scheduled Time <span className="text-gray-400">(Optional)</span>
            </label>
            <input
              type="time"
              value={scheduledTime}
              onChange={(e) => setScheduledTime(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all"
              disabled={loading}
            />
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-all disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            disabled={loading}
            onClick={handleAdd}
            className="flex-1 rounded-lg bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-orange-600 active:scale-95 transition-all disabled:opacity-50"
          >
            {loading ? "Adding..." : "Add Habit"}
          </button>
        </div>
      </div>
    </div>
  );
}
