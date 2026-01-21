"use client";

import { useEffect, useState } from "react";
import StatCard from "@/components/dashboard/StatCard";

export default function StatsRow() {
  const [stats, setStats] = useState({
    currentStreak: 0,
    bestStreak: 0,
    todayHabitsCompleted: 0,
    todayHabitsTotal: 0,
    activeGoals: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const res = await fetch("/api/dashboard/stats");
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        }
      } catch (err) {
        console.error("Failed to load stats:", err);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
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
