"use client";

import Card from "@/components/ui/Card";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Target, ChevronRight } from "lucide-react";

export default function GoalsProgressCard() {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadGoals = async () => {
    try {
      const res = await fetch("/api/goals", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        
        // Filter for active/incomplete goals and limit to 4
        const allGoals = Array.isArray(data) ? data : data.goals || [];
        const activeGoals = allGoals
          .filter((g) => !g.isCompleted && g.isCompleted !== true) // Only incomplete goals
          .slice(0, 4);
        
        setGoals(activeGoals);
      }
    } catch (err) {
      console.error("Failed to load goals:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGoals();
    // Refresh every 15 seconds for real-time updates
    const interval = setInterval(loadGoals, 15000);
    
    const handleFocus = () => {
      setLoading(true);
      loadGoals();
    };
    
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        setLoading(true);
        loadGoals();
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

  if (loading) {
    return (
      <Card className="p-6 border border-gray-100/50">
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-12 bg-gradient-to-r from-gray-200 to-gray-100 rounded-lg animate-pulse" />
          ))}
        </div>
      </Card>
    );
  }

  if (goals.length === 0) {
    return (
      <Card className="p-6 border border-gray-100/50">
        <div className="flex items-center gap-2 mb-5">
          <Target className="w-5 h-5 text-orange-600" />
          <h2 className="text-lg font-bold text-gray-900">Active Goals</h2>
        </div>
        <div className="text-center py-8">
          <p className="text-sm text-gray-500 mb-4">No goals yet</p>
          <Link href="/goals">
            <button className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm rounded-lg transition-colors font-medium">
              Create Your First Goal
            </button>
          </Link>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 border border-gray-100/50">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <Target className="w-5 h-5 text-orange-600" />
          <h2 className="text-lg font-bold text-gray-900">Active Goals</h2>
        </div>
        <Link href="/goals" className="text-orange-600 hover:text-orange-700 text-sm font-medium">
          View all
        </Link>
      </div>

      <div className="space-y-3">
        {goals.map((goal) => {
          const progress = goal.progress || 0;
          const progressPercent = (progress / (goal.target || 100)) * 100;

          return (
            <Link key={goal.id} href={`/goals/${goal.id}`}>
              <div className="p-4 rounded-lg border border-gray-100 hover:border-orange-200 hover:bg-orange-50/30 transition-all cursor-pointer group">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-sm text-gray-900 group-hover:text-orange-600 transition-colors">
                    {goal.title}
                  </h3>
                  <span className="text-xs font-bold text-orange-600 bg-orange-100 px-2 py-1 rounded-full">
                    {Math.round(progressPercent)}%
                  </span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-orange-400 to-orange-500 transition-all duration-300 rounded-full"
                    style={{ width: `${Math.min(progressPercent, 100)}%` }}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  {progress} of {goal.target || "?"} {goal.unit || ""}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </Card>
  );
}
