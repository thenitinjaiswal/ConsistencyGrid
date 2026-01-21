"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import Card from "@/components/ui/Card";
import { Flame, Trophy, BarChart3, Zap, Medal, Gem } from "lucide-react";

export default function StreaksPage() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    const renderMilestoneIcon = (days) => {
        if (days >= 365) return <Gem className="w-8 h-8 text-blue-500" />;
        if (days >= 100) return <Medal className="w-8 h-8 text-yellow-500" />;
        if (days >= 30) return <Medal className="w-8 h-8 text-slate-400" />;
        return <Medal className="w-8 h-8 text-amber-700" />;
    };

    useEffect(() => {
        async function loadStreaks() {
            try {
                const res = await fetch("/api/streaks");
                if (res.ok) {
                    const json = await res.json();
                    setData(json);
                }
            } catch (err) {
                console.error("Failed to load streaks:", err);
            } finally {
                setLoading(false);
            }
        }
        loadStreaks();
    }, []);

    if (loading) {
        return (
            <DashboardLayout active="Streaks">
                <div className="flex items-center justify-center py-20">
                    <p className="text-sm text-gray-500">Loading streaks...</p>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout active="Streaks">
            <div className="mx-auto max-w-6xl space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Streaks</h1>
                    <p className="text-sm text-gray-500">
                        Track your consistency and build momentum
                    </p>
                </div>

                {/* Streak Stats */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <Card className="p-5">
                        <div className="flex items-center gap-3">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-100 text-orange-600">
                                <Flame className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Current Streak</p>
                                <h2 className="text-3xl font-bold text-gray-900">
                                    {data?.currentStreak || 0}
                                </h2>
                                <p className="text-xs text-gray-400">days</p>
                            </div>
                        </div>
                    </Card>

                    <Card className="p-5">
                        <div className="flex items-center gap-3">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-100 text-purple-600">
                                <Trophy className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Best Streak</p>
                                <h2 className="text-3xl font-bold text-gray-900">
                                    {data?.bestStreak || 0}
                                </h2>
                                <p className="text-xs text-gray-400">days</p>
                            </div>
                        </div>
                    </Card>

                    <Card className="p-5">
                        <div className="flex items-center gap-3">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-600">
                                <BarChart3 className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Total Days</p>
                                <h2 className="text-3xl font-bold text-gray-900">
                                    {data?.totalCompletedDays || 0}
                                </h2>
                                <p className="text-xs text-gray-400">kept</p>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Activity Calendar */}
                <Card className="p-6">
                    <h2 className="text-lg font-bold text-gray-900">Activity Calendar</h2>
                    <p className="text-sm text-gray-500">
                        Last 90 days of habit momentum
                    </p>

                    <div className="mt-6 grid grid-cols-10 gap-1">
                        {data?.calendarData?.map((day, index) => (
                            <div
                                key={index}
                                className={`h-8 w-8 rounded ${day.completed
                                    ? "bg-orange-500"
                                    : day.habitCount > 0
                                        ? "bg-orange-200"
                                        : "bg-gray-100"
                                    }`}
                                title={`${day.date}: ${day.habitCount}/${day.totalHabits} habits`}
                            />
                        ))}
                    </div>

                    <div className="mt-4 flex items-center gap-4 text-xs text-gray-500">
                        <div className="flex items-center gap-2">
                            <div className="h-4 w-4 rounded bg-gray-100" />
                            <span>No habits</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="h-4 w-4 rounded bg-orange-200" />
                            <span>Partial</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="h-4 w-4 rounded bg-orange-500" />
                            <span>All kept</span>
                        </div>
                    </div>
                </Card>

                {/* Milestones */}
                <Card className="p-6">
                    <h2 className="text-lg font-bold text-gray-900">Milestones</h2>
                    <p className="text-sm text-gray-500">
                        Unlock achievements as you build consistency
                    </p>

                    <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
                        {data?.milestones?.map((milestone, index) => {
                            const remaining = Math.max(0, milestone.days - (data?.currentStreak || 0));

                            return (
                                <div
                                    key={index}
                                    className={`rounded-xl border p-4 text-center flex flex-col items-center transition-all ${milestone.unlocked
                                        ? "border-orange-200 bg-orange-50 shadow-sm"
                                        : "border-gray-200 bg-gray-50/80" // Removed opacity-50 to make text readable
                                        }`}
                                >
                                    <div className="mb-2">
                                        {renderMilestoneIcon(milestone.days)}
                                    </div>
                                    <p className="mt-1 text-sm font-semibold text-gray-700">
                                        {milestone.title}
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1">
                                        {milestone.unlocked ? (
                                            <span className="text-green-600 font-bold">Unlocked! 🎉</span>
                                        ) : (
                                            <span className="text-orange-600 font-bold">
                                                {remaining} days away
                                            </span>
                                        )}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </Card>

                {/* Motivation */}
                {data && data.currentStreak === 0 && (
                    <Card className="p-6 bg-blue-50 border-blue-200">
                        <div className="flex items-start gap-3">
                            <Zap className="w-6 h-6 text-blue-600 flex-shrink-0" />
                            <div>
                                <h3 className="font-semibold text-gray-900">
                                    Start Your Streak Today!
                                </h3>
                                <p className="mt-1 text-sm text-gray-600">
                                    Keep all your habits today to start building your streak.
                                    Consistency is the key to success!
                                </p>
                            </div>
                        </div>
                    </Card>
                )}

                {data && data.currentStreak > 0 && (
                    <Card className="p-6 bg-green-50 border-green-200">
                        <div className="flex items-start gap-3">
                            <Flame className="w-6 h-6 text-green-600 flex-shrink-0" />
                            <div>
                                <h3 className="font-semibold text-gray-900">
                                    Keep It Going!
                                </h3>
                                <p className="mt-1 text-sm text-gray-600">
                                    You're on a {data.currentStreak}-day streak! Don't break the
                                    chain. Complete your habits today to keep the momentum going.
                                </p>
                            </div>
                        </div>
                    </Card>
                )}
            </div>
        </DashboardLayout>
    );
}
