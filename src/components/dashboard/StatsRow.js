"use client";

import { useEffect, useState } from "react";
import StatCard from "@/components/dashboard/StatCard";

function getLocalDateString(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export default function StatsRow() {
  const [stats, setStats] = useState({
    currentStreak: 0,
    bestStreak: 0,
    todayHabitsCompleted: 0,
    todayHabitsTotal: 0,
    activeGoals: 0,
  });
  const [loading, setLoading] = useState(true);

  const loadStats = async () => {
    try {
      // ✅ Optimized: Single API call to fetch aggregated stats
      const res = await fetch("/api/dashboard/stats", { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to fetch stats");

      const data = await res.json();

      setStats({
        currentStreak: data.streaks?.currentStreak || 0,
        bestStreak: data.streaks?.bestStreak || 0,
        todayHabitsCompleted: data.todayProgress?.todayCompleted || 0,
        todayHabitsTotal: data.todayProgress?.totalHabits || 0,
        activeGoals: data.activeGoals || 0,
      });
    } catch (err) {
      console.error("Failed to load stats:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
    // Refresh every 10 seconds for real-time updates
    const interval = setInterval(loadStats, 10000);

    // Refresh immediately when window gains focus
    const handleFocus = () => {
      setLoading(true);
      loadStats();
    };

    // Also listen for visibility change (tab comes back into view)
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        setLoading(true);
        loadStats();
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

  const displayStats = [
    {
      title: "Current Streak",
      value: loading ? "..." : stats.currentStreak.toString(),
      sub: stats.currentStreak > 0 ? "Skipping today breaks momentum" : "Start your streak today",
    },
    {
      title: "Best Streak",
      value: loading ? "..." : stats.bestStreak.toString(),
      sub: "days",
    },
    {
      title: "Today's Habits",
      value: loading
        ? "..."
        : `${stats.todayHabitsCompleted}/${stats.todayHabitsTotal}`,
      sub: "kept",
    },
    {
      title: "Active Goals",
      value: loading ? "..." : stats.activeGoals.toString(),
      sub: "running",
    },
  ];

  return (
    <section className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 animate-slide-up">
      {displayStats.map((s, i) => (
        <StatCard key={i} title={s.title} value={s.value} sub={s.sub} loading={loading} />
      ))}
    </section>
  );
}
