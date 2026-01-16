"use client";

import { useState } from "react";
import AddHabitModal from "./AddHabitModal";

export default function HabitHeader() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Habit Tracker</h1>
          <p className="text-sm text-gray-500">
            Track your daily habits and build consistency
          </p>
        </div>

        <button
          onClick={() => setOpen(true)}
          className="rounded-xl bg-orange-500 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-orange-600"
        >
          + Add Habit
        </button>
      </div>

      <AddHabitModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}
