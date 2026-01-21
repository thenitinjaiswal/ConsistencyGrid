"use client";

import { useState, useEffect } from "react";
import { CheckCircle2, Circle, Trash2 } from "lucide-react";

export default function GoalSettings() {
    const [goals, setGoals] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadGoals() {
            try {
                const res = await fetch("/api/goals");
                if (res.ok) {
                    const data = await res.json();
                    setGoals(data || []);
                }
            } catch (error) {
                console.error("Failed to load goals:", error);
            } finally {
                setLoading(false);
            }
        }
        loadGoals();
    }, []);

    const getGoalProgress = (goal) => {
        if (goal.subGoals && goal.subGoals.length > 0) {
            const completed = goal.subGoals.filter(sg => sg.isCompleted).length;
            return Math.round((completed / goal.subGoals.length) * 100);
        }
        return goal.progress || 0;
    };

    return (
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <div className="mb-4">
                <h3 className="text-sm font-bold text-gray-900">Your Goals</h3>
                <p className="text-xs text-gray-500 mt-1">View and manage all your goals and milestones</p>
            </div>

            {loading ? (
                <div className="text-center py-8 text-gray-500">
                    <p className="text-sm">Loading goals...</p>
                </div>
            ) : goals.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                    <p className="text-sm">No goals created yet</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {goals.map((goal) => {
                        const progress = getGoalProgress(goal);
                        const isLifeMilestone = goal.category?.toLowerCase() === "lifemilestone";
                        
                        return (
                            <div key={goal.id} className={`p-3 rounded-lg border ${
                                isLifeMilestone 
                                    ? "border-purple-200 bg-purple-50" 
                                    : "border-blue-200 bg-blue-50"
                            }`}>
                                {/* Header with title and status */}
                                <div className="flex items-start justify-between mb-2">
                                    <div className="flex-1">
                                        <h4 className="text-sm font-semibold text-gray-900">{goal.title}</h4>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className={`text-xs font-medium ${
                                                isLifeMilestone ? "text-purple-600" : "text-blue-600"
                                            }`}>
                                                {isLifeMilestone ? `Age ${goal.age}` : goal.category}
                                            </span>
                                            {goal.isCompleted && (
                                                <span className="bg-green-100 text-green-700 text-xs font-bold px-1.5 py-0.5 rounded">✓ Done</span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Progress Bar */}
                                <div className="mb-2">
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-xs font-semibold text-gray-600">Progress</span>
                                        <span className="text-xs font-bold text-gray-700">{progress}%</span>
                                    </div>
                                    <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                        <div 
                                            className={`h-full transition-all ${
                                                isLifeMilestone 
                                                    ? "bg-purple-500" 
                                                    : "bg-blue-500"
                                            }`}
                                            style={{ width: `${progress}%` }}
                                        />
                                    </div>
                                </div>

                                {/* Sub-goals count */}
                                {goal.subGoals && goal.subGoals.length > 0 && (
                                    <div className="text-xs text-gray-600">
                                        <span className="font-medium">
                                            {goal.subGoals.filter(sg => sg.isCompleted).length}/{goal.subGoals.length}
                                        </span>
                                        {" "}sub-goals completed
                                    </div>
                                )}

                                {/* Description if available */}
                                {goal.description && (
                                    <p className="text-xs text-gray-600 mt-2 line-clamp-2">{goal.description}</p>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
