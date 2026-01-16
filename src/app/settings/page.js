"use client";

import { useEffect, useState } from "react";
import { signOut } from "next-auth/react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";

export default function SettingsPage() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadUser() {
            try {
                const res = await fetch("/api/settings/me");
                if (res.ok) {
                    const data = await res.json();
                    setUser(data.user);
                }
            } catch (err) {
                console.error("Failed to load user:", err);
            } finally {
                setLoading(false);
            }
        }
        loadUser();
    }, []);

    async function handleDeleteAccount() {
        if (
            confirm(
                "Are you sure you want to delete your account? This action cannot be undone."
            )
        ) {
            // TODO: Implement delete account API
            alert("Delete account feature coming soon");
        }
    }

    return (
        <DashboardLayout active="Settings">
            <div className="mx-auto max-w-4xl space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
                    <p className="text-sm text-gray-500">
                        Manage your account and preferences
                    </p>
                </div>

                {/* Profile Settings */}
                <Card className="p-6">
                    <h2 className="text-lg font-bold text-gray-900">Profile</h2>
                    <p className="text-sm text-gray-500">
                        Your personal information
                    </p>

                    <div className="mt-6 space-y-4">
                        <div>
                            <label className="text-xs font-medium text-gray-700">Name</label>
                            <input
                                type="text"
                                value={loading ? "Loading..." : user?.name || ""}
                                disabled
                                className="mt-1 w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none"
                            />
                        </div>

                        <div>
                            <label className="text-xs font-medium text-gray-700">Email</label>
                            <input
                                type="email"
                                value={loading ? "Loading..." : user?.email || ""}
                                disabled
                                className="mt-1 w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none"
                            />
                            <p className="mt-1 text-xs text-gray-500">
                                Email cannot be changed
                            </p>
                        </div>

                        <div>
                            <label className="text-xs font-medium text-gray-700">
                                Public Token
                            </label>
                            <input
                                type="text"
                                value={loading ? "Loading..." : user?.publicToken || ""}
                                disabled
                                className="mt-1 w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-mono outline-none"
                            />
                            <p className="mt-1 text-xs text-gray-500">
                                Used for your public wallpaper URL
                            </p>
                        </div>
                    </div>
                </Card>

                {/* Wallpaper Preferences */}
                <Card className="p-6">
                    <h2 className="text-lg font-bold text-gray-900">
                        Wallpaper Preferences
                    </h2>
                    <p className="text-sm text-gray-500">
                        Default settings for wallpaper generation
                    </p>

                    <div className="mt-6 space-y-4">
                        <div>
                            <label className="text-xs font-medium text-gray-700">
                                Default Resolution
                            </label>
                            <select className="mt-1 w-full rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none focus:border-orange-500">
                                <option>1080 x 2400 (Phone)</option>
                                <option>1920 x 1080 (Desktop)</option>
                                <option>2560 x 1440 (2K)</option>
                                <option>3840 x 2160 (4K)</option>
                            </select>
                        </div>

                        <div>
                            <label className="text-xs font-medium text-gray-700">Theme</label>
                            <select className="mt-1 w-full rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none focus:border-orange-500">
                                <option>Dark Minimal</option>
                                <option>Light Clean</option>
                                <option>Colorful</option>
                            </select>
                        </div>
                    </div>

                    <div className="mt-6">
                        <Button variant="primary">Save Preferences</Button>
                    </div>
                </Card>

                {/* Notifications */}
                <Card className="p-6">
                    <h2 className="text-lg font-bold text-gray-900">Notifications</h2>
                    <p className="text-sm text-gray-500">
                        Manage how you receive updates
                    </p>

                    <div className="mt-6 space-y-3">
                        <label className="flex items-center justify-between rounded-lg border border-gray-200 p-4">
                            <div>
                                <p className="font-semibold text-gray-900">Daily Reminders</p>
                                <p className="text-xs text-gray-500">
                                    Get reminded to check your habits
                                </p>
                            </div>
                            <input type="checkbox" className="h-5 w-5" />
                        </label>

                        <label className="flex items-center justify-between rounded-lg border border-gray-200 p-4">
                            <div>
                                <p className="font-semibold text-gray-900">Weekly Summary</p>
                                <p className="text-xs text-gray-500">
                                    Receive weekly progress reports
                                </p>
                            </div>
                            <input type="checkbox" className="h-5 w-5" />
                        </label>

                        <label className="flex items-center justify-between rounded-lg border border-gray-200 p-4">
                            <div>
                                <p className="font-semibold text-gray-900">Streak Alerts</p>
                                <p className="text-xs text-gray-500">
                                    Get notified about streak milestones
                                </p>
                            </div>
                            <input type="checkbox" className="h-5 w-5" />
                        </label>
                    </div>
                </Card>

                {/* Danger Zone */}
                <Card className="border-red-200 p-6">
                    <h2 className="text-lg font-bold text-red-600">Danger Zone</h2>
                    <p className="text-sm text-gray-500">
                        Irreversible and destructive actions
                    </p>

                    <div className="mt-6 space-y-4">
                        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="font-semibold text-gray-900">Delete Account</p>
                                    <p className="text-xs text-gray-600">
                                        Permanently delete your account and all data
                                    </p>
                                </div>
                                <button
                                    onClick={handleDeleteAccount}
                                    className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>

                        <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="font-semibold text-gray-900">Export Data</p>
                                    <p className="text-xs text-gray-600">
                                        Download all your data as JSON
                                    </p>
                                </div>
                                <button className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50">
                                    Export
                                </button>
                            </div>
                        </div>
                    </div>
                </Card>
            </div>
        </DashboardLayout>
    );
}
