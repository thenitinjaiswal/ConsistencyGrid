"use client";

import { useState } from "react";

export default function AddHabitModal({ open, onClose }) {
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  async function handleAdd() {
    if (!title.trim()) return;

    setLoading(true);

    await fetch("/api/habits", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title }),
    });

    setLoading(false);
    setTitle("");
    onClose();

    // Refresh page quickly
    window.location.reload();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-lg">
        <h2 className="text-lg font-bold text-gray-900">Add Habit</h2>
        <p className="mt-1 text-sm text-gray-500">
          Example: Gym, Reading, Meditation
        </p>

        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Habit title..."
          className="mt-4 w-full rounded-xl border px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-orange-400"
        />

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
