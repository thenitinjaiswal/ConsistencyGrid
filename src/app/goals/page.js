"use client";

import { useEffect, useState } from "react";
import { redirect } from "next/navigation";
import DashboardLayout from "@/components/layout/DashboardLayout";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Link from "next/link";
import {
    Target,
    Trophy,
    Flag,
    Lightbulb,
    CheckCircle2,
    Plus
} from "lucide-react";

export default function GoalsPage() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadGoals() {
            try {
                const res = await fetch("/api/goals");
                if (res.ok) {
                    const json = await res.json();
                    setData(json);
                }
            } catch (err) {
                console.error("Failed to load goals:", err);
            } finally {
                setLoading(false);
            }
        }
        loadGoals();
    }, []);

    if (loading) {
        return (
            <DashboardLayout active="Goals">
                <div className="flex items-center justify-center py-20">
                    <p className="text-sm text-gray-500">Loading goals...</p>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout active="Goals">
            <div className="mx-auto max-w-6xl space-y-6">
                {/* Header */}
                <div className="flex items-start justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Goals</h1>
                        <p className="text-sm text-gray-500">
                            Set challenges and track progress on your wallpaper
                        </p>
                    </div>

                    <Link href="/generator">
                        <Button variant="primary" className="flex items-center gap-2">
                            <Plus className="w-4 h-4" /> New Goal
                        </Button>
                    </Link>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <Card className="p-5">
                        <div className="flex items-center gap-3">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-100 text-orange-600">
                                <Target className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Active Goals</p>
                                <h2 className="text-3xl font-bold text-gray-900">
                                    {data?.activeGoals || 0}
                                </h2>
                            </div>
                        </div>
                    </Card>

                    <Card className="p-5">
                        <div className="flex items-center gap-3">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-600">
                                <CheckCircle2 className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Completed</p>
                                <h2 className="text-3xl font-bold text-gray-900">
                                    {data?.completedGoals || 0}
                                </h2>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Active Goals */}
                <div>
                    <h2 className="text-lg font-bold text-gray-900">Active Goals</h2>
                    <p className="text-sm text-gray-500">
                        Your current challenges in progress
                    </p>

                    <div className="mt-4 space-y-4">
                        {data?.currentGoal ? (
                            <Card className="p-6">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-start gap-4">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                                            <Flag className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900">
                                                {data.currentGoal.title}
                                            </h3>
                                            <p className="text-sm text-gray-500">
                                                Started{" "}
                                                {new Date(
                                                    data.currentGoal.startDate
                                                ).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <Link href="/generator">
                                            <button className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50">
                                                Edit
                                            </button>
                                        </Link>
                                    </div>
                                </div>

                                {data.progress && (
                                    <div className="mt-4">
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-gray-600">Progress</span>
                                            <span className="font-semibold text-gray-900">
                                                {data.progress.percentage}%
                                            </span>
                                        </div>
                                        <div className="mt-2 h-2 w-full rounded-full bg-gray-100">
                                            <div
                                                style={{ width: `${data.progress.percentage}%` }}
                                                className="h-2 rounded-full bg-orange-500 transition-all"
                                            />
                                        </div>
                                        <p className="mt-2 text-xs text-gray-500">
                                            Day {data.progress.completed} of {data.progress.total} •{" "}
                                            {data.progress.daysRemaining} days remaining
                                        </p>
                                    </div>
                                )}
                            </Card>
                        ) : (
                            <Card className="p-10 text-center">
                                <div className="flex flex-col items-center">
                                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 text-gray-500">
                                        <Target className="w-8 h-8" />
                                    </div>
                                    <h3 className="mt-4 text-lg font-semibold text-gray-900">
                                        No goals yet
                                    </h3>
                                    <p className="mt-2 text-sm text-gray-500">
                                        Create your first goal to start tracking progress on your
                                        wallpaper
                                    </p>
                                    <Link href="/generator" className="mt-4">
                                        <Button variant="primary" className="flex items-center gap-2">
                                            <Plus className="w-4 h-4" /> Create Goal
                                        </Button>
                                    </Link>
                                </div>
                            </Card>
                        )}
                    </div>
                </div>

                {/* Tips */}
                <Card className="p-6 bg-orange-50 border-orange-200">
                    <div className="flex items-start gap-3">
                        <Lightbulb className="w-6 h-6 text-orange-600 flex-shrink-0" />
                        <div>
                            <h3 className="font-semibold text-gray-900">Pro Tip</h3>
                            <p className="mt-1 text-sm text-gray-600">
                                Goals appear on your wallpaper as a progress grid. Set a
                                meaningful challenge and watch your progress grow every day!
                            </p>
                        </div>
                    </div>
                </Card>
            </div>
        </DashboardLayout>
    );
}
