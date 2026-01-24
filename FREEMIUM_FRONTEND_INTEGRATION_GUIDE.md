# Frontend Integration Guide - Freemium Subscription Checks

## Overview

This guide shows how to add subscription checks to your frontend components using the utilities we've created.

## Basic Pattern

All components should follow this pattern:

```jsx
"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import UpgradePopup from "@/components/modals/UpgradePopup";
import { canAddHabit } from "@/lib/subscription-utils";

export default function HabitForm() {
  const { data: session } = useSession();
  const [showUpgradePopup, setShowUpgradePopup] = useState(false);
  const [popupType, setPopupType] = useState(null);

  const handleAddHabit = async () => {
    // Check subscription on client first (for UX)
    const access = canAddHabit(session?.user);
    
    if (access.limit && access.currentCount >= access.limit) {
      setPopupType("habit-limit");
      setShowUpgradePopup(true);
      return;
    }

    // Proceed with API call
    // The API will also validate, so you're protected either way
  };

  return (
    <>
      <button onClick={handleAddHabit}>Add Habit</button>
      
      <UpgradePopup
        isOpen={showUpgradePopup}
        onClose={() => setShowUpgradePopup(false)}
        type={popupType}
      />
    </>
  );
}
```

## Component-by-Component Implementation

### 1. HabitForm Component

```jsx
"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import UpgradePopup from "@/components/modals/UpgradePopup";
import { canAddHabit } from "@/lib/subscription-utils";
import { Lock } from "lucide-react";

export default function HabitForm({ onSuccess }) {
  const { data: session } = useSession();
  const [title, setTitle] = useState("");
  const [showUpgradePopup, setShowUpgradePopup] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Client-side check (optional but improves UX)
    const access = canAddHabit(session?.user);
    if (access.limit !== null) {
      setShowUpgradePopup(true);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/habits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title }),
      });

      if (res.status === 403) {
        // API returned limit reached
        const data = await res.json();
        if (data.code === "HABIT_LIMIT_REACHED") {
          setShowUpgradePopup(true);
          return;
        }
      }

      if (!res.ok) throw new Error("Failed to create habit");

      const habit = await res.json();
      onSuccess?.(habit);
      setTitle("");
    } catch (error) {
      console.error("Error creating habit:", error);
    } finally {
      setLoading(false);
    }
  };

  // Show lock icon if user is at limit (client-side info)
  const access = canAddHabit(session?.user);
  const isAtLimit = access.limit && access.currentCount >= access.limit;

  return (
    <>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Add a new habit"
          disabled={isAtLimit}
        />
        <button 
          type="submit" 
          disabled={loading || isAtLimit}
          className={isAtLimit ? "opacity-50" : ""}
        >
          {isAtLimit ? (
            <>
              <Lock className="w-4 h-4 inline mr-2" />
              Upgrade to Add More
            </>
          ) : (
            "Add Habit"
          )}
        </button>
      </form>

      <UpgradePopup
        isOpen={showUpgradePopup}
        onClose={() => setShowUpgradePopup(false)}
        type="habit-limit"
      />
    </>
  );
}
```

### 2. GoalForm Component

```jsx
"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import UpgradePopup from "@/components/modals/UpgradePopup";
import { canAddGoal } from "@/lib/subscription-utils";

export default function GoalForm({ onSuccess }) {
  const { data: session } = useSession();
  const [showUpgradePopup, setShowUpgradePopup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "General",
    targetDeadline: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const access = canAddGoal(session?.user);
    if (access.limit !== null) {
      setShowUpgradePopup(true);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/goals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          subGoals: [{ title: "Step 1", completed: false }],
        }),
      });

      if (res.status === 403) {
        const data = await res.json();
        if (data.code === "GOAL_LIMIT_REACHED") {
          setShowUpgradePopup(true);
          return;
        }
      }

      if (!res.ok) throw new Error("Failed to create goal");

      const goal = await res.json();
      onSuccess?.(goal);
      setFormData({ title: "", description: "", category: "General", targetDeadline: "" });
    } catch (error) {
      console.error("Error creating goal:", error);
    } finally {
      setLoading(false);
    }
  };

  const access = canAddGoal(session?.user);
  const isAtLimit = access.limit && access.currentCount >= access.limit;

  return (
    <>
      <form onSubmit={handleSubmit}>
        {/* Form fields */}
        <button type="submit" disabled={loading || isAtLimit}>
          {isAtLimit ? "Upgrade to Add Goal" : "Create Goal"}
        </button>
      </form>

      <UpgradePopup
        isOpen={showUpgradePopup}
        onClose={() => setShowUpgradePopup(false)}
        type="goal-limit"
      />
    </>
  );
}
```

### 3. Analytics Component (with Lock)

```jsx
"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import UpgradePopup from "@/components/modals/UpgradePopup";
import { canAccessAnalytics } from "@/lib/subscription-utils";
import { Lock } from "lucide-react";

export default function Analytics() {
  const { data: session } = useSession();
  const [showUpgradePopup, setShowUpgradePopup] = useState(false);

  const access = canAccessAnalytics(session?.user);

  return (
    <>
      <div className="relative">
        {/* Your analytics content */}
        <div className="p-6 bg-white rounded-lg">
          <h2 className="text-2xl font-bold mb-4">Your Analytics</h2>
          {/* Charts, stats, etc */}
        </div>

        {/* Lock overlay for free users */}
        {!access.allowed && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm rounded-lg">
            <div className="text-center">
              <Lock className="w-12 h-12 text-orange-500 mx-auto mb-2" />
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Advanced Analytics
              </h3>
              <p className="text-gray-600 mb-4 max-w-xs">
                {access.message}
              </p>
              <button
                onClick={() => setShowUpgradePopup(true)}
                className="px-6 py-2 bg-orange-500 text-white rounded-lg font-bold hover:bg-orange-600 transition-colors"
              >
                {access.upgradeText || "Upgrade to Pro"}
              </button>
            </div>
          </div>
        )}
      </div>

      <UpgradePopup
        isOpen={showUpgradePopup}
        onClose={() => setShowUpgradePopup(false)}
        type="analytics"
      />
    </>
  );
}
```

### 4. History/Calendar Component

```jsx
"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import UpgradePopup from "@/components/modals/UpgradePopup";
import { canViewHistory } from "@/lib/subscription-utils";
import { Lock } from "lucide-react";

export default function HistoryCalendar({ habitId }) {
  const { data: session } = useSession();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showUpgradePopup, setShowUpgradePopup] = useState(false);

  const handleDateClick = (date) => {
    const access = canViewHistory(session?.user, date);

    if (!access.allowed) {
      setShowUpgradePopup(true);
      return;
    }

    setSelectedDate(date);
  };

  return (
    <>
      <div className="p-6 bg-white rounded-lg">
        <h2 className="text-xl font-bold mb-4">Habit History</h2>

        <div className="grid grid-cols-7 gap-2">
          {/* Render calendar days */}
          {Array.from({ length: 30 }).map((_, i) => {
            const date = new Date();
            date.setDate(date.getDate() - (30 - i));

            const access = canViewHistory(session?.user, date);
            const isLocked = !access.allowed;

            return (
              <div
                key={i}
                onClick={() => handleDateClick(date)}
                className={`p-3 text-center rounded cursor-pointer relative ${
                  isLocked
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-orange-100 text-orange-700 hover:bg-orange-200"
                }`}
              >
                {date.getDate()}
                {isLocked && (
                  <Lock className="w-3 h-3 absolute top-1 right-1 text-gray-400" />
                )}
              </div>
            );
          })}
        </div>

        {selectedDate && (
          <div className="mt-6 p-4 bg-blue-50 rounded">
            <p className="font-bold">{selectedDate.toDateString()}</p>
            {/* Show history for selected date */}
          </div>
        )}
      </div>

      <UpgradePopup
        isOpen={showUpgradePopup}
        onClose={() => setShowUpgradePopup(false)}
        type="history-limit"
        requestedDaysBack={30}
      />
    </>
  );
}
```

### 5. Theme Selector with Lock

```jsx
"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import UpgradePopup from "@/components/modals/UpgradePopup";
import { getFeatureAccess } from "@/lib/subscription-utils";
import { Lock } from "lucide-react";

const themes = [
  { id: "default", name: "Default", isPremium: false },
  { id: "dark", name: "Dark Mode", isPremium: false },
  { id: "ocean", name: "Ocean Blue", isPremium: true },
  { id: "forest", name: "Forest Green", isPremium: true },
  { id: "sunset", name: "Sunset Orange", isPremium: true },
];

export default function ThemeSelector() {
  const { data: session } = useSession();
  const [selectedTheme, setSelectedTheme] = useState("default");
  const [showUpgradePopup, setShowUpgradePopup] = useState(false);

  const features = getFeatureAccess(session?.user);
  const canAccessPremium = features.themes.limit === null; // Pro has no limit (null)

  const handleThemeChange = (theme) => {
    if (theme.isPremium && !canAccessPremium) {
      setShowUpgradePopup(true);
      return;
    }
    setSelectedTheme(theme.id);
  };

  return (
    <>
      <div className="p-6 bg-white rounded-lg">
        <h2 className="text-xl font-bold mb-4">Choose Your Theme</h2>

        <div className="grid grid-cols-2 gap-4">
          {themes.map((theme) => (
            <div
              key={theme.id}
              className="relative cursor-pointer"
              onClick={() => handleThemeChange(theme)}
            >
              <div
                className={`p-4 rounded-lg border-2 transition-all ${
                  selectedTheme === theme.id
                    ? "border-orange-500 bg-orange-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <p className="font-bold text-gray-900">{theme.name}</p>
                <div className="mt-2 flex gap-1">
                  {/* Theme color preview */}
                </div>
              </div>

              {theme.isPremium && !canAccessPremium && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-lg">
                  <div className="text-center">
                    <Lock className="w-6 h-6 text-white mx-auto" />
                    <p className="text-xs text-white font-bold mt-1">Pro</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <UpgradePopup
        isOpen={showUpgradePopup}
        onClose={() => setShowUpgradePopup(false)}
        type="analytics" // or create a new "feature-lock" type
      />
    </>
  );
}
```

## Using Subscription Utils Directly

For more control, import the utilities directly:

```jsx
import {
  canAddHabit,
  canAddGoal,
  canViewHistory,
  canAccessAnalytics,
  getFeatureAccess,
  hasActiveSubscription,
  getSubscriptionStatus,
  getTrialDaysRemaining,
} from "@/lib/subscription-utils";

// In your component
const featureAccess = getFeatureAccess(user);

console.log(featureAccess.habits.limit); // 3 (free) or null (pro)
console.log(featureAccess.goals.limit); // 3 (free) or null (pro)
console.log(featureAccess.history.maxDaysBack); // 7 (free) or null (pro)
console.log(featureAccess.analytics.allowed); // false (free) or true (pro)
```

## Common Patterns

### Pattern: Show Banner for Near-Limit Users

```jsx
function HabitList({ habits }) {
  const { data: session } = useSession();
  const access = canAddHabit(session?.user);
  const slotsRemaining = access.limit - habits.length;

  return (
    <>
      {/* Show warning when approaching limit */}
      {access.limit && slotsRemaining <= 1 && (
        <div className="bg-yellow-100 border border-yellow-400 p-3 rounded mb-4">
          <p className="text-sm font-bold text-yellow-900">
            You have only {slotsRemaining} habit slot remaining. 
            <a href="/pricing" className="underline ml-2">Upgrade to Pro</a>
          </p>
        </div>
      )}

      {/* Habits list */}
    </>
  );
}
```

### Pattern: Disable Create Button

```jsx
<button
  onClick={handleCreate}
  disabled={isAtLimit || loading}
  className={`px-4 py-2 rounded font-bold transition-colors ${
    isAtLimit
      ? "bg-gray-200 text-gray-500 cursor-not-allowed"
      : "bg-orange-500 text-white hover:bg-orange-600"
  }`}
>
  {isAtLimit ? "Limit Reached - Upgrade to Pro" : "Create New"}
</button>
```

### Pattern: Trial Countdown

```jsx
function TrialBanner() {
  const { data: session } = useSession();
  const daysRemaining = getTrialDaysRemaining(session?.user);

  if (!daysRemaining) return null;

  return (
    <div className="bg-green-100 border border-green-400 p-4 rounded">
      <p className="font-bold text-green-900">
        Your Pro trial ends in {daysRemaining} days
      </p>
      <a href="/pricing" className="text-green-700 font-bold underline">
        Upgrade Now →
      </a>
    </div>
  );
}
```

## Testing Your Implementation

Use this test data in your database:

```sql
-- Free user
INSERT INTO User (id, email, plan) VALUES ('user1', 'free@test.com', 'free');

-- Pro monthly user
INSERT INTO User (id, email, plan, subscriptionStatus)
VALUES ('user2', 'pro@test.com', 'pro_monthly', 'active');

-- Trial user (expires in 5 days)
INSERT INTO User (id, email, plan, trialEndDate)
VALUES ('user3', 'trial@test.com', 'free', DATE_ADD(NOW(), INTERVAL 5 DAY));
```

Then verify each component behaves correctly with each user type.

---

**Ready to integrate?** Pick your component and follow the pattern above!
