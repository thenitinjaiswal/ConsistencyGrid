"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import Card from "@/components/ui/Card";
import { TrendingUp, Flame, Target, RefreshCw } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

export default function AnalyticsPage() {
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

    const COLORS = ["#fb923c", "#8b5cf6", "#3b82f6"];

    async function loadAnalyticsData() {
        try {
            setRefreshing(true);
            // Fetch habits and goals
            const [habitsRes, goalsRes] = await Promise.all([
                fetch("/api/habits?_t=" + Date.now()),
                fetch("/api/goals?_t=" + Date.now())
            ]);

            if (!habitsRes.ok || !goalsRes.ok) {
                setLoading(false);
                setRefreshing(false);
                return;
            }

            const habits = await habitsRes.json();
            const goals = await goalsRes.json();

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
                    const last30Logs = habit.logs.filter(log => {
                        const logDate = new Date(log.date).toISOString().split("T")[0];
                        return last30Days.includes(logDate);
                    });
                    totalPossible += last30Days.length;
                    totalCompleted += last30Logs.length;
                });

                const consistencyScore = totalPossible > 0 ? Math.round((totalCompleted / totalPossible) * 100) : 0;

                // Calculate longest streak
                let longestStreak = 0;
                habits.forEach(habit => {
                    if (!habit.logs || habit.logs.length === 0) return;
                    
                    const sortedLogs = habit.logs.sort((a, b) => new Date(a.date) - new Date(b.date));
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
                const completedGoals = goals.filter(g => g.isCompleted).length;
                const lifeCompletion = goals.length > 0 ? Math.round((completedGoals / goals.length) * 100) : 0;

                // Generate consistency over time chart (last 30 days)
                const chartData = [];
                for (let i = 29; i >= 0; i--) {
                    const date = new Date();
                    date.setDate(date.getDate() - i);
                    const dateStr = date.toISOString().split("T")[0];
                    const dayNum = date.getDate();

                    let dayScore = 0;
                    habits.forEach(habit => {
                        const isDone = habit.logs.some(log => 
                            new Date(log.date).toISOString().split("T")[0] === dateStr
                        );
                        if (isDone) dayScore += 100 / Math.max(habits.length, 1);
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
                            if (habit.logs.some(log => 
                                new Date(log.date).toISOString().split("T")[0] === dateStr
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
                setLoading(false);
                setRefreshing(false);
            } catch (error) {
                console.error("Failed to load analytics:", error);
                setLoading(false);
                setRefreshing(false);
            }
        }

    // Load data on mount
    useEffect(() => {
        loadAnalyticsData();
    }, []);

    // Auto-refresh every 10 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            loadAnalyticsData();
        }, 10000);

        return () => clearInterval(interval);
    }, []);

    if (loading) {
        return (
            <DashboardLayout active="Analytics">
                <div className="flex items-center justify-center h-screen">
                    <div className="text-center">
                        <div className="animate-spin h-12 w-12 border-4 border-orange-500 border-t-transparent rounded-full mx-auto mb-4" />
                        <p className="text-gray-500">Loading analytics...</p>
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
                                            className={`w-3 h-3 rounded ${
                                                ["bg-gray-50", "bg-orange-100", "bg-orange-300", "bg-orange-500", "bg-orange-600"][i]
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
