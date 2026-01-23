"use client";

import { useEffect, useState } from "react";
import { Flame, Award, Zap } from "lucide-react";

export default function StreakBanner() {
  const [stats, setStats] = useState({ currentStreak: 0, bestStreak: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const res = await fetch("/api/dashboard/stats");
        if (res.ok) {
          const data = await res.json();
          setStats({
            currentStreak: data.currentStreak || 0,
            bestStreak: data.bestStreak || 0,
          });
        }
      } catch (err) {
        console.error("Failed to load stats:", err);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  if (loading) return null;

  if (stats.currentStreak === 0) return null;

  return (
    <div className="bg-gradient-to-r from-orange-500 via-orange-600 to-orange-700 rounded-2xl p-6 text-white shadow-xl mb-8">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Flame className="w-6 h-6" />
            <h2 className="text-2xl font-bold">You're On Fire! 🔥</h2>
          </div>
          <p className="text-orange-100 text-sm">Keep your momentum going</p>
        </div>

        <div className="flex gap-4">
          <div className="text-center bg-white/10 backdrop-blur rounded-lg p-4">
            <div className="text-3xl font-bold text-white">
              {stats.currentStreak}
            </div>
            <div className="text-xs text-orange-100 mt-1">Day Streak</div>
          </div>

          <div className="text-center bg-white/10 backdrop-blur rounded-lg p-4">
            <div className="text-3xl font-bold text-white">
              {stats.bestStreak}
            </div>
            <div className="text-xs text-orange-100 mt-1">Best Ever</div>
          </div>
        </div>
      </div>
    </div>
  );
}
