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
      // Load streaks data
      const streaksRes = await fetch("/api/streaks", { cache: "no-store" });
      const streaksData = streaksRes.ok ? await streaksRes.json() : {};

      // Load habits for today
      const habitsRes = await fetch("/api/habits", { cache: "no-store" });
      const habitsArray = habitsRes.ok ? await habitsRes.json() : [];
      
      // Load goals
      const goalsRes = await fetch("/api/goals", { cache: "no-store" });
      const goalsArray = goalsRes.ok ? await goalsRes.json() : [];

      // Calculate today's habits using local date
      const today = getLocalDateString(new Date());
      let todayCompleted = 0;
      let totalActiveHabits = 0;
      
      habitsArray.forEach((habit) => {
        if (habit.isActive) {
          totalActiveHabits++;
          const todayLog = habit.logs?.find(
            (log) => getLocalDateString(new Date(log.date)) === today && log.done
          );
          if (todayLog) todayCompleted++;
        }
      });

      // Count active goals (not completed)
      const activeGoalsCount = goalsArray.filter(
        (g) => !g.isCompleted || g.isCompleted === false
      ).length;

      setStats({
        currentStreak: streaksData.currentStreak || 0,
        bestStreak: streaksData.bestStreak || 0,
        todayHabitsCompleted: todayCompleted,
        todayHabitsTotal: totalActiveHabits,
        activeGoals: activeGoalsCount,
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
