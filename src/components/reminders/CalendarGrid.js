/**
 * CalendarGrid Component
 * 
 * A beautiful month/year calendar grid that displays reminders
 * as visual markers. This is where reminders "live on the timeline"
 * instead of just being notifications.
 */

"use client";

import { useState, useEffect } from "react";

export default function CalendarGrid({ year, month, reminders = [], onDateClick }) {
    const [hoveredDate, setHoveredDate] = useState(null);

    // Get days in month
    const getDaysInMonth = (year, month) => {
        return new Date(year, month + 1, 0).getDate();
    };

    // Get first day of month (0 = Sunday, 1 = Monday, etc.)
    const getFirstDayOfMonth = (year, month) => {
        return new Date(year, month, 1).getDay();
    };

    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);

    // Generate calendar days
    const calendarDays = [];

    // Empty cells before first day
    for (let i = 0; i < firstDay; i++) {
        calendarDays.push(null);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
        calendarDays.push(day);
    }

    // Get reminders for a specific date
    const getRemindersForDate = (day) => {
        if (!day) return [];

        const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

        return reminders.filter((reminder) => {
            const startDate = reminder.startDate.split("T")[0];
            const endDate = reminder.endDate.split("T")[0];

            return dateStr >= startDate && dateStr <= endDate;
        });
    };

    // Check if date is today
    const isToday = (day) => {
        if (!day) return false;
        const today = new Date();
        return (
            day === today.getDate() &&
            month === today.getMonth() &&
            year === today.getFullYear()
        );
    };

    // Check if date is in the past
    const isPast = (day) => {
        if (!day) return false;
        const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
        const today = new Date().toISOString().split("T")[0];
        return dateStr < today;
    };

    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            {/* Month/Year Header */}
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                    {monthNames[month]} {year}
                </h2>
            </div>

            {/* Day Names */}
            <div className="grid grid-cols-7 gap-2 mb-2">
                {dayNames.map((day) => (
                    <div
                        key={day}
                        className="text-center text-xs font-semibold text-gray-500 py-2"
                    >
                        {day}
                    </div>
                ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-2">
                {calendarDays.map((day, index) => {
                    const dayReminders = getRemindersForDate(day);
                    const isImportantDay = dayReminders.some((r) => r.isImportant);
                    const highestPriority = Math.max(...dayReminders.map((r) => r.priority), 0);

                    return (
                        <div
                            key={index}
                            className={`relative aspect-square rounded-lg border-2 transition-all ${!day
                                    ? "border-transparent"
                                    : isToday(day)
                                        ? "border-orange-500 bg-orange-50"
                                        : isPast(day)
                                            ? "border-gray-100 bg-gray-50"
                                            : "border-gray-200 bg-white hover:border-orange-300 hover:shadow-md cursor-pointer"
                                }`}
                            onClick={() => day && onDateClick?.(year, month, day)}
                            onMouseEnter={() => day && setHoveredDate(`${year}-${month}-${day}`)}
                            onMouseLeave={() => setHoveredDate(null)}
                        >
                            {day && (
                                <>
                                    {/* Day Number */}
                                    <div className={`absolute top-1 left-1 text-sm font-semibold ${isToday(day)
                                            ? "text-orange-600"
                                            : isPast(day)
                                                ? "text-gray-400"
                                                : "text-gray-700"
                                        }`}>
                                        {day}
                                    </div>

                                    {/* Important Star */}
                                    {isImportantDay && (
                                        <div className="absolute top-1 right-1 text-amber-500 text-sm">
                                            ⭐
                                        </div>
                                    )}

                                    {/* Reminder Markers */}
                                    {dayReminders.length > 0 && (
                                        <div className="absolute bottom-1 left-1 right-1 flex flex-wrap gap-1 justify-center">
                                            {dayReminders.slice(0, 3).map((reminder, idx) => {
                                                const markerIcons = {
                                                    dot: "●",
                                                    border: "○",
                                                    fill: "■",
                                                    badge: "◆",
                                                };

                                                return (
                                                    <div
                                                        key={idx}
                                                        className="text-xs"
                                                        style={{ color: reminder.markerColor }}
                                                        title={reminder.title}
                                                    >
                                                        {reminder.markerIcon || markerIcons[reminder.markerType] || "●"}
                                                    </div>
                                                );
                                            })}
                                            {dayReminders.length > 3 && (
                                                <div className="text-xs text-gray-400">
                                                    +{dayReminders.length - 3}
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* Hover Tooltip */}
                                    {hoveredDate === `${year}-${month}-${day}` && dayReminders.length > 0 && (
                                        <div className="absolute z-10 bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 bg-gray-900 text-white text-xs rounded-lg p-3 shadow-xl pointer-events-none">
                                            <div className="space-y-2">
                                                {dayReminders.map((reminder, idx) => (
                                                    <div key={idx} className="flex items-start gap-2">
                                                        <div style={{ color: reminder.markerColor }}>
                                                            {reminder.markerIcon || "●"}
                                                        </div>
                                                        <div className="flex-1">
                                                            <div className="font-semibold">{reminder.title}</div>
                                                            {reminder.description && (
                                                                <div className="text-gray-300 text-xs mt-0.5">
                                                                    {reminder.description}
                                                                </div>
                                                            )}
                                                            {!reminder.isFullDay && reminder.startTime && (
                                                                <div className="text-gray-400 text-xs mt-0.5">
                                                                    {reminder.startTime}
                                                                    {reminder.endTime && ` - ${reminder.endTime}`}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                            {/* Arrow */}
                                            <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1">
                                                <div className="border-4 border-transparent border-t-gray-900" />
                                            </div>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Legend */}
            <div className="mt-6 pt-6 border-t border-gray-100">
                <div className="flex flex-wrap items-center gap-4 text-xs text-gray-600">
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded border-2 border-orange-500 bg-orange-50" />
                        <span>Today</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded border-2 border-gray-200 bg-white" />
                        <span>Future</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded border-2 border-gray-100 bg-gray-50" />
                        <span>Past</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-amber-500">⭐</span>
                        <span>Important Day</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
