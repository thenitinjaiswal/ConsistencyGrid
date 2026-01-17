/**
 * ReminderList Component
 * 
 * Displays reminders in a beautiful list format
 * with visual indicators, priority badges, and quick actions
 */

"use client";

import { useState } from "react";
import toast from "react-hot-toast";

export default function ReminderList({ reminders, onEdit, onDelete, onRefresh }) {
    const [deletingId, setDeletingId] = useState(null);

    const handleDelete = async (id) => {
        if (!confirm("Are you sure you want to delete this reminder?")) {
            return;
        }

        setDeletingId(id);
        try {
            const res = await fetch(`/api/reminders/${id}`, {
                method: "DELETE",
            });

            if (!res.ok) throw new Error("Failed to delete");

            toast.success("Reminder deleted");
            onRefresh?.();
        } catch (error) {
            console.error("Delete error:", error);
            toast.error("Failed to delete reminder");
        } finally {
            setDeletingId(null);
        }
    };

    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
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

    const getPriorityBadge = (priority) => {
        const badges = {
            1: { label: "Low", color: "bg-gray-100 text-gray-600" },
            2: { label: "Medium", color: "bg-blue-100 text-blue-600" },
            3: { label: "High", color: "bg-amber-100 text-amber-600" },
            4: { label: "Critical", color: "bg-red-100 text-red-600" },
        };
        return badges[priority] || badges[1];
    };

    const getMarkerIcon = (markerType) => {
        const icons = {
            dot: "●",
            border: "○",
            fill: "■",
            badge: "◆",
        };
        return icons[markerType] || "●";
    };

    if (!reminders || reminders.length === 0) {
        return (
            <div className="text-center py-12">
                <div className="text-6xl mb-4">📅</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    No reminders yet
                </h3>
                <p className="text-gray-500">
                    Create your first reminder to see it on your timeline
                </p>
            </div>
        );
    }

    // Group reminders by date
    const groupedReminders = {};
    reminders.forEach((reminder) => {
        const dateKey = reminder.startDate.split("T")[0];
        if (!groupedReminders[dateKey]) {
            groupedReminders[dateKey] = [];
        }
        groupedReminders[dateKey].push(reminder);
    });

    const sortedDates = Object.keys(groupedReminders).sort();

    return (
        <div className="space-y-6">
            {sortedDates.map((dateKey) => {
                const dateReminders = groupedReminders[dateKey];
                const isToday = dateKey === new Date().toISOString().split("T")[0];
                const isPast = new Date(dateKey) < new Date(new Date().toISOString().split("T")[0]);

                return (
                    <div key={dateKey} className="space-y-3">
                        {/* Date Header */}
                        <div className="flex items-center gap-3">
                            <h3 className={`text-sm font-semibold ${isToday ? "text-orange-600" : "text-gray-700"}`}>
                                {formatDate(dateKey)}
                                {isToday && (
                                    <span className="ml-2 px-2 py-0.5 bg-orange-100 text-orange-600 text-xs rounded-full">
                                        Today
                                    </span>
                                )}
                                {isPast && !isToday && (
                                    <span className="ml-2 text-gray-400 text-xs">Past</span>
                                )}
                            </h3>
                            <div className="flex-1 h-px bg-gray-200" />
                        </div>

                        {/* Reminders for this date */}
                        <div className="space-y-2">
                            {dateReminders.map((reminder) => {
                                const priorityBadge = getPriorityBadge(reminder.priority);
                                const isMultiDay = reminder.startDate !== reminder.endDate;

                                return (
                                    <div
                                        key={reminder.id}
                                        className={`group relative bg-white border-2 rounded-xl p-4 transition-all hover:shadow-md ${isPast ? "opacity-60" : ""
                                            }`}
                                        style={{ borderColor: reminder.markerColor + "40" }}
                                    >
                                        {/* Marker Indicator */}
                                        <div
                                            className="absolute left-0 top-0 bottom-0 w-1 rounded-l-xl"
                                            style={{ backgroundColor: reminder.markerColor }}
                                        />

                                        <div className="flex items-start gap-4">
                                            {/* Icon/Marker */}
                                            <div
                                                className="flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center text-2xl"
                                                style={{ backgroundColor: reminder.markerColor + "20" }}
                                            >
                                                {reminder.markerIcon || getMarkerIcon(reminder.markerType)}
                                            </div>

                                            {/* Content */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-start justify-between gap-3">
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <h4 className="font-semibold text-gray-900">
                                                                {reminder.title}
                                                            </h4>
                                                            {reminder.isImportant && (
                                                                <span className="text-amber-500">⭐</span>
                                                            )}
                                                        </div>

                                                        {reminder.description && (
                                                            <p className="text-sm text-gray-600 mb-2">
                                                                {reminder.description}
                                                            </p>
                                                        )}

                                                        <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500">
                                                            {/* Time Range */}
                                                            {!reminder.isFullDay && reminder.startTime && (
                                                                <span className="flex items-center gap-1 px-2 py-1 bg-gray-100 rounded">
                                                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                                    </svg>
                                                                    {formatTime(reminder.startTime)}
                                                                    {reminder.endTime && ` - ${formatTime(reminder.endTime)}`}
                                                                </span>
                                                            )}

                                                            {reminder.isFullDay && (
                                                                <span className="px-2 py-1 bg-gray-100 rounded">
                                                                    All Day
                                                                </span>
                                                            )}

                                                            {/* Multi-day indicator */}
                                                            {isMultiDay && (
                                                                <span className="px-2 py-1 bg-purple-100 text-purple-600 rounded">
                                                                    Until {formatDate(reminder.endDate)}
                                                                </span>
                                                            )}

                                                            {/* Priority Badge */}
                                                            <span className={`px-2 py-1 rounded ${priorityBadge.color}`}>
                                                                {priorityBadge.label}
                                                            </span>

                                                            {/* Notifications */}
                                                            {reminder.enableNotifications && (
                                                                <span className="flex items-center gap-1">
                                                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                                                    </svg>
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>

                                                    {/* Actions */}
                                                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <button
                                                            onClick={() => onEdit?.(reminder)}
                                                            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                            title="Edit"
                                                        >
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                            </svg>
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(reminder.id)}
                                                            disabled={deletingId === reminder.id}
                                                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                                                            title="Delete"
                                                        >
                                                            {deletingId === reminder.id ? (
                                                                <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                                                            ) : (
                                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                                </svg>
                                                            )}
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
