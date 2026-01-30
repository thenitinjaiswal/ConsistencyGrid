/**
 * UpcomingReminders Component
 * 
 * Dashboard widget showing upcoming reminders
 * Provides quick overview and links to full reminder system
 */

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { UpcomingRemindersSkeleton } from "@/components/skeletons/DashboardSkeletons";

function getLocalDateString(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

export default function UpcomingReminders() {
    const [reminders, setReminders] = useState([]);
    const [loading, setLoading] = useState(true);

    const loadReminders = async () => {
        try {
            const today = getLocalDateString(new Date());
            const nextWeek = getLocalDateString(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000));

            const res = await fetch(`/api/reminders/range?start=${today}&end=${nextWeek}`);
            const data = await res.json();

            if (data.reminders) {
                // Sort by start date and priority
                const sorted = data.reminders.sort((a, b) => {
                    const dateCompare = new Date(a.startDate) - new Date(b.startDate);
                    if (dateCompare !== 0) return dateCompare;
                    return b.priority - a.priority;
                });

                setReminders(sorted.slice(0, 5)); // Show top 5
            }
        } catch (error) {
            console.error("Load reminders error:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadReminders();
        // Refresh every 10 seconds for real-time updates
        const interval = setInterval(loadReminders, 10000);

        const handleFocus = () => {
            setLoading(true);
            loadReminders();
        };

        const handleVisibilityChange = () => {
            if (!document.hidden) {
                setLoading(true);
                loadReminders();
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

    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const dateOnly = getLocalDateString(date);
        const todayOnly = getLocalDateString(today);
        const tomorrowOnly = getLocalDateString(tomorrow);

        if (dateOnly === todayOnly) return "Today";
        if (dateOnly === tomorrowOnly) return "Tomorrow";

        return date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
        });
    };

    const formatTime = (timeStr) => {
        if (!timeStr) return "";
        const [hours, minutes] = timeStr.split(":");
        const hour = parseInt(hours);
        const ampm = hour >= 12 ? "PM" : "AM";
        const displayHour = hour % 12 || 12;
        return `${displayHour}:${minutes} ${ampm}`;
    };

    if (loading) {
        return <UpcomingRemindersSkeleton />;
    }

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900">Upcoming Reminders</h3>
                <Link
                    href="/reminders"
                    className="text-sm text-orange-600 hover:text-orange-700 font-medium"
                >
                    View All
                </Link>
            </div>

            {reminders.length === 0 ? (
                <div className="text-center py-8">
                    <div className="text-4xl mb-2">📅</div>
                    <p className="text-sm text-gray-500 mb-3">No upcoming reminders</p>
                    <Link
                        href="/reminders"
                        className="inline-block px-4 py-2 bg-orange-500 text-white text-sm rounded-lg hover:bg-orange-600 transition-colors"
                    >
                        Create Your First Reminder
                    </Link>
                </div>
            ) : (
                <div className="space-y-3">
                    {reminders.map((reminder) => {
                        const isToday = formatDate(reminder.startDate) === "Today";
                        const isTomorrow = formatDate(reminder.startDate) === "Tomorrow";

                        return (
                            <div
                                key={reminder.id}
                                className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                {/* Icon/Marker */}
                                <div
                                    className="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center text-lg"
                                    style={{ backgroundColor: reminder.markerColor + "20" }}
                                >
                                    {reminder.markerIcon || "●"}
                                </div>

                                {/* Content */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <h4 className="font-semibold text-sm text-gray-900 truncate">
                                            {reminder.title}
                                        </h4>
                                        {reminder.isImportant && (
                                            <span className="text-amber-500 text-xs">⭐</span>
                                        )}
                                    </div>

                                    <div className="flex items-center gap-2 text-xs text-gray-500">
                                        <span
                                            className={`${isToday
                                                ? "text-orange-600 font-medium"
                                                : isTomorrow
                                                    ? "text-blue-600 font-medium"
                                                    : ""
                                                }`}
                                        >
                                            {formatDate(reminder.startDate)}
                                        </span>

                                        {!reminder.isFullDay && reminder.startTime && (
                                            <>
                                                <span>•</span>
                                                <span>{formatTime(reminder.startTime)}</span>
                                            </>
                                        )}

                                        {reminder.startDate !== reminder.endDate && (
                                            <>
                                                <span>•</span>
                                                <span className="text-purple-600">Multi-day</span>
                                            </>
                                        )}
                                    </div>

                                    {reminder.description && (
                                        <p className="text-xs text-gray-500 mt-1 truncate">
                                            {reminder.description}
                                        </p>
                                    )}
                                </div>

                                {/* Priority Indicator */}
                                {reminder.priority >= 3 && (
                                    <div
                                        className={`flex-shrink-0 w-2 h-2 rounded-full ${reminder.priority === 4
                                            ? "bg-red-500"
                                            : "bg-amber-500"
                                            }`}
                                        title={reminder.priority === 4 ? "Critical" : "High"}
                                    />
                                )}
                            </div>
                        );
                    })}

                    {reminders.length >= 5 && (
                        <Link
                            href="/reminders"
                            className="block text-center text-sm text-orange-600 hover:text-orange-700 font-medium pt-2"
                        >
                            View All Reminders →
                        </Link>
                    )}
                </div>
            )}

            {/* Quick Action */}
            <div className="mt-4 pt-4 border-t border-gray-100">
                <Link
                    href="/calendar"
                    className="flex items-center justify-center gap-2 text-sm text-gray-600 hover:text-orange-600 transition-colors"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                    </svg>
                    View Calendar Grid
                </Link>
            </div>
        </div>
    );
}
