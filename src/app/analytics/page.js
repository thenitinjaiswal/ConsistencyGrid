"use client";

import { useState, useEffect } from "react";
import { Suspense } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import Card from "@/components/ui/Card";
import { TrendingUp, Flame, Target, RefreshCw, AlertCircle } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import AnalyticsSkeleton from "@/components/analytics/AnalyticsSkeleton";

export const dynamic = "force-dynamic";

function AnalyticsContent() {
    const [stats, setStats] = useState({
        consistencyScore: 0,
        consistencyChange: 0,
        longestStreak: 0,
        lifeCompletion: 0
    });
    const [consistencyData, setConsistencyData] = useState([]);
    const [heatmapData, setHeatmapData] = useState([]);
    const [categoryData, setCategoryData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState(null);
    const [lastRefresh, setLastRefresh] = useState(null);

    const COLORS = ["#fb923c", "#8b5cf6", "#3b82f6"];

    async function loadAnalyticsData() {
        try {
            setRefreshing(true);
            setError(null);

            // Fetch habits and goals with cache busting
            const [habitsRes, goalsRes] = await Promise.all([
                fetch("/api/habits?_t=" + Date.now()),
                fetch("/api/goals?_t=" + Date.now())
            ]);

            if (!habitsRes.ok || !goalsRes.ok) {
                throw new Error(`Failed to fetch analytics data`);
            }

            const habitsData = await habitsRes.json();
            const goalsData = await goalsRes.json();

            // Safely extract arrays - handle both direct arrays and wrapped responses
            const habits = Array.isArray(habitsData)
                ? habitsData
                : (habitsData?.data || habitsData?.habits || []);

            const goals = Array.isArray(goalsData)
                ? goalsData
                : (goalsData?.data || goalsData?.goals || []);

            // If no data, set empty state
            if (habits.length === 0 && goals.length === 0) {
                setStats({
                    consistencyScore: 0,
                    consistencyChange: 0,
                    longestStreak: 0,
                    lifeCompletion: 0
                });
                setConsistencyData([]);
                setHeatmapData([]);
                setCategoryData([]);
                setLastRefresh(new Date().toLocaleTimeString());
                setLoading(false);
                setRefreshing(false);
                return;
            }

            // Calculate consistency score from last 30 days
            const last30Days = [];
            for (let i = 29; i >= 0; i--) {
                const date = new Date();
                date.setDate(date.getDate() - i);
                last30Days.push(date.toISOString().split("T")[0]);
            }

            let totalPossible = 0;
            let totalCompleted = 0;

            // Count habit completions
            habits.forEach(habit => {
                if (!habit.logs || !Array.isArray(habit.logs)) return;
                const last30Logs = habit.logs.filter(log => {
                    const logDate = new Date(log.date).toISOString().split("T")[0];
                    return last30Days.includes(logDate) && log.done;
                });
                totalPossible += last30Days.length;
                totalCompleted += last30Logs.length;
            });

            const consistencyScore = totalPossible > 0 ? Math.round((totalCompleted / totalPossible) * 100) : 0;

            // Calculate longest streak
            let longestStreak = 0;
            habits.forEach(habit => {
                if (!habit.logs || habit.logs.length === 0) return;

                const sortedLogs = [...habit.logs].sort((a, b) => new Date(a.date) - new Date(b.date));
                let currentStreak = 0;
                let lastDate = null;

                sortedLogs.forEach(log => {
                    const logDate = new Date(log.date);
                    if (!lastDate) {
                        currentStreak = 1;
                    } else {
                        const dayDiff = Math.floor((logDate - lastDate) / (1000 * 60 * 60 * 24));
                        if (dayDiff === 1) {
                            currentStreak++;
                        } else if (dayDiff > 1) {
                            currentStreak = 1;
                        }
                    }
                    longestStreak = Math.max(longestStreak, currentStreak);
                    lastDate = logDate;
                });
            });

            // Calculate life completion %
            let totalProgress = 0;
            const completedGoals = goals.filter(g => {
                if (g.isCompleted) return true;
                if (g.progress >= 100) return true;
                if (g.subGoals && g.subGoals.length > 0) {
                    return g.subGoals.every(sg => sg.isCompleted);
                }
                return false;
            }).length;

            if (goals.length > 0) {
                totalProgress = goals.reduce((sum, g) => sum + (g.progress || 0), 0) / goals.length;
            }

            const lifeCompletion = goals.length > 0 ? Math.max(
                Math.round((completedGoals / goals.length) * 100),
                Math.round(totalProgress)
            ) : 0;

            // Generate consistency over time chart (last 30 days)
            const chartData = [];
            for (let i = 29; i >= 0; i--) {
                const date = new Date();
                date.setDate(date.getDate() - i);
                const dateStr = date.toISOString().split("T")[0];
                const dayNum = date.getDate();

                let dayScore = 0;
                habits.forEach(habit => {
                    if (habit.logs && Array.isArray(habit.logs)) {
                        const isDone = habit.logs.some(log =>
                            new Date(log.date).toISOString().split("T")[0] === dateStr && log.done
                        );
                        if (isDone) dayScore += 100 / Math.max(habits.length, 1);
                    }
                });

                chartData.push({
                    date: `${date.getMonth() + 1}/${dayNum}`,
                    consistency: Math.round(dayScore)
                });
            }

            // Generate heatmap data (last 12 weeks x 7 days)
            const heatmap = [];
            const dayNames = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

            for (let week = 11; week >= 0; week--) {
                const weekData = [];
                for (let day = 0; day < 7; day++) {
                    const date = new Date();
                    date.setDate(date.getDate() - (week * 7 + day));
                    const dateStr = date.toISOString().split("T")[0];

                    let intensity = 0;
                    habits.forEach(habit => {
                        if (habit.logs && Array.isArray(habit.logs) && habit.logs.some(log =>
                            new Date(log.date).toISOString().split("T")[0] === dateStr && log.done
                        )) {
                            intensity += 1;
                        }
                    });

                    weekData.push({
                        date: dateStr,
                        day: dayNames[date.getDay()],
                        intensity: Math.min(intensity, habits.length > 0 ? habits.length : 1)
                    });
                }
                heatmap.push(weekData);
            }

            // Category distribution from goals
            const categoryCount = {};
            goals.forEach(goal => {
                const category = goal.category || "General";
                categoryCount[category] = (categoryCount[category] || 0) + 1;
            });

            const totalCategories = Object.values(categoryCount).reduce((a, b) => a + b, 0);
            const catData = Object.entries(categoryCount).map(([name, value]) => ({
                name,
                value: totalCategories > 0 ? Math.round((value / totalCategories) * 100) : 0,
                count: value
            }));

            setStats({
                consistencyScore,
                consistencyChange: 8,
                longestStreak,
                lifeCompletion
            });
            setConsistencyData(chartData);
            setHeatmapData(heatmap);
            setCategoryData(catData);
            setLastRefresh(new Date().toLocaleTimeString());
            setLoading(false);
            setRefreshing(false);
        } catch (error) {
            console.error("Failed to load analytics:", error);
            setError(error.message || "Failed to load analytics data");
            setLoading(false);
            setRefreshing(false);
        }
    }

    // Load data on mount only
    useEffect(() => {
        loadAnalyticsData();
    }, []);

    if (loading) {
        return (
            <DashboardLayout active="Analytics">
                <div className="py-4 sm:py-8">
                    <AnalyticsSkeleton />
                </div>
            </DashboardLayout>
        );
    }

    if (error) {
        return (
            <DashboardLayout active="Analytics">
                <div className="mx-auto max-w-7xl">
                    <div className="flex items-center gap-4 p-6 bg-red-50 border border-red-200 rounded-lg">
                        <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0" />
                        <div className="flex-1">
                            <h3 className="font-semibold text-red-900">Error loading analytics</h3>
                            <p className="text-sm text-red-700 mt-1">{error}</p>
                        </div>
                        <button
                            onClick={loadAnalyticsData}
                            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors text-sm"
                        >
                            Retry
                        </button>
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout active="Analytics">
            <div className="mx-auto max-w-7xl space-y-8">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Analytics</h1>
                        <p className="text-gray-500 mt-1">Your performance insights and trends</p>
                        {lastRefresh && <p className="text-xs text-gray-400 mt-2">Last updated: {lastRefresh}</p>}
                    </div>
                    <button
                        onClick={loadAnalyticsData}
                        disabled={refreshing}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-orange-500 text-white hover:bg-orange-600 disabled:opacity-50 transition-all"
                    >
                        <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
                        {refreshing ? "Updating..." : "Refresh"}
                    </button>
                </div>

                {/* Stat Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Consistency Score */}
                    <Card className="p-6">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Consistency Score</p>
                                <p className="text-4xl font-bold text-gray-900 mt-2">{stats.consistencyScore}%</p>
                                <p className="text-sm text-green-600 mt-2">
                                    ↑ {stats.consistencyChange}% from last month
                                </p>
                            </div>
                            <div className="flex-shrink-0">
                                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-orange-100">
                                    <TrendingUp className="w-8 h-8 text-orange-500" />
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* Longest Streak */}
                    <Card className="p-6">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Longest Streak</p>
                                <p className="text-4xl font-bold text-gray-900 mt-2">{stats.longestStreak}</p>
                                <p className="text-sm text-gray-500 mt-2">Personal record</p>
                            </div>
                            <div className="flex-shrink-0">
                                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-orange-100">
                                    <Flame className="w-8 h-8 text-orange-500" />
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* Life Completion */}
                    <Card className="p-6">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Life Completion %</p>
                                <p className="text-4xl font-bold text-gray-900 mt-2">{stats.lifeCompletion}%</p>
                                <p className="text-sm text-gray-500 mt-2">Goals completed</p>
                            </div>
                            <div className="flex-shrink-0">
                                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-orange-100">
                                    <Target className="w-8 h-8 text-orange-500" />
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Consistency Over Time Chart */}
                <Card className="p-8">
                    <h2 className="text-lg font-bold text-gray-900 mb-2">Consistency Over Time</h2>
                    <p className="text-sm text-gray-500 mb-6">Daily performance metrics across all categories</p>

                    {consistencyData.length > 0 ? (
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={consistencyData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                <XAxis
                                    dataKey="date"
                                    stroke="#9ca3af"
                                    style={{ fontSize: "12px" }}
                                />
                                <YAxis
                                    stroke="#9ca3af"
                                    style={{ fontSize: "12px" }}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: "#fff",
                                        border: "1px solid #e5e7eb",
                                        borderRadius: "8px"
                                    }}
                                />
                                <Legend />
                                <Line
                                    type="monotone"
                                    dataKey="consistency"
                                    stroke="#fb923c"
                                    strokeWidth={2}
                                    dot={false}
                                    name="Consistency"
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="h-80 flex items-center justify-center text-gray-500">
                            No data available
                        </div>
                    )}
                </Card>

                {/* Heatmap and Category Distribution */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Habit Heatmap */}
                    <div className="lg:col-span-2">
                        <Card className="p-8">
                            <h2 className="text-lg font-bold text-gray-900 mb-6">Habit Heatmap</h2>

                            <div className="overflow-x-auto">
                                <div className="flex flex-col gap-1 min-w-max">
                                    {heatmapData.map((week, weekIdx) => (
                                        <div key={weekIdx} className="flex gap-1 items-center">
                                            {week.map((day, dayIdx) => {
                                                const intensityColors = [
                                                    "bg-gray-50",
                                                    "bg-orange-100",
                                                    "bg-orange-300",
                                                    "bg-orange-500",
                                                    "bg-orange-600"
                                                ];
                                                const color = intensityColors[Math.min(day.intensity, 4)];

                                                return (
                                                    <div
                                                        key={dayIdx}
                                                        className={`w-5 h-5 rounded cursor-pointer hover:ring-2 hover:ring-orange-500 transition-all ${color}`}
                                                        title={`${day.date}: ${day.intensity} habit(s)`}
                                                    />
                                                );
                                            })}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="mt-6 flex items-center justify-between">
                                <span className="text-xs text-gray-500">LESS</span>
                                <div className="flex gap-1">
                                    {[0, 1, 2, 3, 4].map(i => (
                                        <div
                                            key={i}
                                            className={`w-3 h-3 rounded ${["bg-gray-50", "bg-orange-100", "bg-orange-300", "bg-orange-500", "bg-orange-600"][i]
                                                }`}
                                        />
                                    ))}
                                </div>
                                <span className="text-xs text-gray-500">MORE</span>
                            </div>
                        </Card>
                    </div>

                    {/* Category Distribution */}
                    <Card className="p-8">
                        <h2 className="text-lg font-bold text-gray-900 mb-6">Category Distribution</h2>

                        {categoryData.length > 0 ? (
                            <>
                                <ResponsiveContainer width="100%" height={250}>
                                    <PieChart>
                                        <Pie
                                            data={categoryData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={90}
                                            paddingAngle={2}
                                            dataKey="value"
                                        >
                                            {categoryData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip formatter={(value) => `${value}%`} />
                                    </PieChart>
                                </ResponsiveContainer>

                                <div className="mt-6 space-y-3">
                                    {categoryData.map((cat, idx) => (
                                        <div key={cat.name} className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <div
                                                    className="w-3 h-3 rounded-full"
                                                    style={{ backgroundColor: COLORS[idx % COLORS.length] }}
                                                />
                                                <span className="text-sm text-gray-600">{cat.name}</span>
                                            </div>
                                            <span className="text-sm font-bold text-gray-900">{cat.value}%</span>
                                        </div>
                                    ))}
                                </div>
                            </>
                        ) : (
                            <div className="h-64 flex items-center justify-center text-gray-500 text-sm">
                                No category data available
                            </div>
                        )}
                    </Card>
                </div>
            </div>
        </DashboardLayout>
    );
}

export default function AnalyticsPage() {
    return (
        <Suspense fallback={
            <DashboardLayout active="Analytics">
                <div className="py-4 sm:py-8">
                    <AnalyticsSkeleton />
                </div>
            </DashboardLayout>
        }>
            <AnalyticsContent />
        </Suspense>
    );
}
