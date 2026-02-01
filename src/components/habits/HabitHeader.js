"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import UpgradePrompt from "@/components/payment/UpgradePrompt";
import { PRICING_PLANS } from "@/lib/payment/payment-config";

export default function HabitHeader({ onHabitAdded, isFreeUser, habitCount }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [showUpgradePrompt, setShowUpgradePrompt] = useState(false);

  const handleHabitAdded = (newHabit) => {
    setOpen(false);
    if (onHabitAdded) {
      onHabitAdded(newHabit);
    } else {
      // Fallback: reload the page
      router.refresh();
    }
  };

  const handleAddClick = () => {
    // Habits limit for free plan
    const habitLimit = PRICING_PLANS.free.features.habits;

    if (isFreeUser && habitCount >= habitLimit) {
      setShowUpgradePrompt(true);
    } else {
      setOpen(true);
    }
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Habit Tracker</h1>
          <p className="text-sm text-gray-600 mt-1">
            Track your daily habits and build consistency
          </p>
        </div>

        <button
          onClick={handleAddClick}
          className="w-full sm:w-auto rounded-lg bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white shadow hover:bg-orange-600 transition-all active:scale-95"
        >
          + Add Habit
        </button>
      </div>

      <AddHabitModal open={open} onClose={() => setOpen(false)} onHabitAdded={handleHabitAdded} />

      <UpgradePrompt
        isOpen={showUpgradePrompt}
        onClose={() => setShowUpgradePrompt(false)}
        title="Habit Limit Reached"
        message={`You've reached the limit of ${PRICING_PLANS.free.features.habits} habits on the Free plan.`}
        feature="habits"
        limit={PRICING_PLANS.free.features.habits}
        currentCount={habitCount}
      />
    </>
  );
}
