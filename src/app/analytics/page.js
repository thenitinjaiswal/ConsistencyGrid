"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import Card from "@/components/ui/Card";

export default function AnalyticsPage() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadAnalytics() {
            try {
                const res = await fetch("/api/analytics");
                if (res.ok) {
                    const json = await res.json();
                    setData(json);
                }
            } catch (err) {
                console.error("Failed to load analytics:", err);
            } finally {
                setLoading(false);
            }
        }
        loadAnalytics();
    }, []);

    if (loading) {
        return (
            <DashboardLayout active="Analytics">
                <div className="flex items-center justify-center py-20">
                    <p className="text-sm text-gray-500">Loading analytics...</p>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout active="Analytics">
            <div className="mx-auto max-w-6xl space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
                    <p className="text-sm text-gray-500">
                        Insights and trends about your habit performance
                    </p>
                </div>

                {/* Overview Stats */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                    <Card className="p-5">
                        <p className="text-sm text-gray-500">Completion Rate</p>
                        <h2 className="mt-1 text-3xl font-bold text-gray-900">
                            {data?.completionRate || 0}%
                        </h2>
                        <p className="mt-1 text-xs text-gray-400">Last 30 days</p>
                    </Card>

                    <Card className="p-5">
                        <p className="text-sm text-gray-500">Total Habits</p>
                        <h2 className="mt-1 text-3xl font-bold text-gray-900">
                            {data?.totalHabits || 0}
                        </h2>
                        <p className="mt-1 text-xs text-gray-400">Active</p>
                    </Card>

                    <Card className="p-5">
                        <p className="text-sm text-gray-500">Best Day</p>
                        <h2 className="mt-1 text-3xl font-bold text-gray-900">
                            {data?.bestDay || "-"}
                        </h2>
                        <p className="mt-1 text-xs text-gray-400">Of the week</p>
                    </Card>

                    <Card className="p-5">
                        <p className="text-sm text-gray-500">Avg. Per Day</p>
                        <h2 className="mt-1 text-3xl font-bold text-gray-900">
                            {data?.avgPerDay || 0}
                        </h2>
                        <p className="mt-1 text-xs text-gray-400">Habits completed</p>
                    </Card>
                </div>

                {/* Completion Trend */}
                <Card className="p-6">
                    <h2 className="text-lg font-bold text-gray-900">Completion Trend</h2>
                    <p className="text-sm text-gray-500">
                        Your habit completion over the last 30 days
                    </p>

                    <div className="mt-6">
                        <div className="flex h-48 items-end gap-1">
                            {data?.trendData?.map((day, index) => (
                                <div
                                    key={index}
                                    className="flex-1 bg-orange-500 rounded-t transition-all hover:bg-orange-600"
                                    style={{ height: `${day.percentage}%` }}
                                    title={`${day.date}: ${day.percentage}%`}
                                />
                            ))}
                        </div>
                        <div className="mt-2 flex justify-between text-xs text-gray-500">
                            <span>30 days ago</span>
                            <span>Today</span>
                        </div>
                    </div>
                </Card>

                {/* Habit Performance */}
                <Card className="p-6">
                    <h2 className="text-lg font-bold text-gray-900">Habit Performance</h2>
                    <p className="text-sm text-gray-500">
                        Which habits you complete most consistently
                    </p>

                    <div className="mt-6 space-y-3">
                        {data?.habitPerformance && data.habitPerformance.length > 0 ? (
                            data.habitPerformance.map((habit) => (
                                <div
                                    key={habit.id}
                                    className="rounded-xl border border-gray-200 bg-gray-50 p-4"
                                >
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="font-semibold text-gray-900">
                                                {habit.title}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {habit.completed} of {habit.total} days
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-2xl font-bold text-gray-900">
                                                {habit.percentage}%
                                            </p>
                                            <p className="text-xs text-gray-500">completion</p>
                                        </div>
                                    </div>
                                    <div className="mt-3 h-2 w-full rounded-full bg-gray-200">
                                        <div
                                            style={{ width: `${habit.percentage}%` }}
                                            className="h-2 rounded-full bg-orange-500 transition-all"
                                        />
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="rounded-xl border border-dashed border-gray-300 bg-white p-8 text-center">
                                <p className="text-sm text-gray-500">
                                    No habit data yet. Start tracking habits to see analytics!
                                </p>
                            </div>
                        )}
                    </div>
                </Card>

                {/* Weekly Breakdown */}
                <Card className="p-6">
                    <h2 className="text-lg font-bold text-gray-900">Weekly Breakdown</h2>
                    <p className="text-sm text-gray-500">
                        Your performance by day of the week
                    </p>

                    <div className="mt-6 grid grid-cols-7 gap-2">
                        {data?.weeklyBreakdown?.map((day) => (
                            <div key={day.day} className="text-center">
                                <p className="text-xs font-semibold text-gray-600">
                                    {day.day}
                                </p>
                                <div className="mt-2 flex h-24 items-end justify-center rounded-lg bg-gray-50 p-2">
                                    <div
                                        className="w-full rounded-t bg-orange-500 transition-all"
                                        style={{ height: `${day.percentage}%` }}
                                    />
                                </div>
                                <p className="mt-1 text-xs text-gray-500">{day.percentage}%</p>
                            </div>
                        ))}
                    </div>
                </Card>

                {/* Insights */}
                {data && data.completionRate > 0 && (
                    <Card className="p-6 bg-purple-50 border-purple-200">
                        <div className="flex items-start gap-3">
                            <span className="text-2xl">📊</span>
                            <div>
                                <h3 className="font-semibold text-gray-900">Insights</h3>
                                <ul className="mt-2 space-y-1 text-sm text-gray-600">
                                    {data.completionRate >= 80 && (
                                        <li>
                                            🎉 Excellent! You're completing {data.completionRate}% of
                                            your habits.
                                        </li>
                                    )}
                                    {data.completionRate < 80 && data.completionRate >= 50 && (
                                        <li>
                                            👍 Good progress! You're at {data.completionRate}%
                                            completion.
                                        </li>
                                    )}
                                    {data.completionRate < 50 && (
                                        <li>
                                            💪 Keep pushing! Small improvements lead to big results.
                                        </li>
                                    )}
                                    {data.bestDay !== "-" && (
                                        <li>
                                            📅 {data.bestDay} is your most productive day of the
                                            week!
                                        </li>
                                    )}
                                    {data.avgPerDay > 0 && (
                                        <li>
                                            ⭐ You complete an average of {data.avgPerDay} habits per
                                            day.
                                        </li>
                                    )}
                                </ul>
                            </div>
                        </div>
                    </Card>
                )}
            </div>
        </DashboardLayout>
    );
}
