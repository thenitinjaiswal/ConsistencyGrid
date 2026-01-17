"use client";

import { useState } from "react";

export default function AddHabitModal({ open, onClose }) {
  const [title, setTitle] = useState("");
  const [scheduledTime, setScheduledTime] = useState("");
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  async function handleAdd() {
    if (!title.trim()) return;

    setLoading(true);

    await fetch("/api/habits", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, scheduledTime }),
    });

    setLoading(false);
    setTitle("");
    setScheduledTime("");
    onClose();

    // Refresh page quickly
    window.location.reload();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-lg">
        <h2 className="text-lg font-bold text-gray-900">Add Habit</h2>
        <p className="mt-1 text-sm text-gray-500">
          Create a new habit to track daily
        </p>

        <div className="mt-4 space-y-3">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Habit Name</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Gym, Reading"
              className="w-full rounded-xl border px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Scheduled Time (Optional)</label>
            <input
              type="time"
              value={scheduledTime}
              onChange={(e) => setScheduledTime(e.target.value)}
              className="w-full rounded-xl border px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>
        </div>

        <div className="mt-6 flex gap-2">
          <button
            onClick={onClose}
            className="w-full rounded-xl border px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>

          <button
            disabled={loading}
            onClick={handleAdd}
            className="w-full rounded-xl bg-orange-500 px-4 py-3 text-sm font-semibold text-white hover:bg-orange-600 disabled:opacity-50"
          >
            {loading ? "Adding..." : "Add"}
          </button>
        </div>
      </div>
    </div>
  );
}
