import DashboardLayout from "@/components/layout/DashboardLayout";
import Card from "@/components/ui/Card";
import Link from "next/link";

export const metadata = {
  title: "Help & Support",
  description: "Get help with ConsistencyGrid features, MacroDroid setup guide, and frequently asked questions.",
};

export default function HelpPage() {
    return (
        <DashboardLayout active="Help">
            <div className="mx-auto max-w-4xl space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Help & Support</h1>
                    <p className="text-sm text-gray-500">
                        Get help with ConsistencyGrid features
                    </p>
                </div>

                {/* Quick Links */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <Card className="p-5 hover:shadow-md transition-shadow cursor-pointer">
                        <div className="flex items-start gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100">
                                <span className="text-xl">📖</span>
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900">Getting Started</h3>
                                <p className="text-sm text-gray-500">
                                    Learn the basics of ConsistencyGrid
                                </p>
                            </div>
                        </div>
                    </Card>

                    <Card className="p-5 hover:shadow-md transition-shadow cursor-pointer">
                        <div className="flex items-start gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                                <span className="text-xl">📱</span>
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900">MacroDroid Setup</h3>
                                <p className="text-sm text-gray-500">
                                    Auto-update wallpaper on Android
                                </p>
                            </div>
                        </div>
                    </Card>

                    <Card className="p-5 hover:shadow-md transition-shadow cursor-pointer">
                        <div className="flex items-start gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                                <span className="text-xl">🎯</span>
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900">Habit Tracking</h3>
                                <p className="text-sm text-gray-500">
                                    Build consistency with habits
                                </p>
                            </div>
                        </div>
                    </Card>

                    <Card className="p-5 hover:shadow-md transition-shadow cursor-pointer">
                        <div className="flex items-start gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100">
                                <span className="text-xl">💬</span>
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900">Contact Support</h3>
                                <p className="text-sm text-gray-500">
                                    Get help from our team
                                </p>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* FAQ */}
                <Card className="p-6">
                    <h2 className="text-lg font-bold text-gray-900">
                        Frequently Asked Questions
                    </h2>

                    <div className="mt-6 space-y-4">
                        {/* FAQ Item */}
                        <div className="rounded-lg border border-gray-200 p-4">
                            <h3 className="font-semibold text-gray-900">
                                How do I create my first wallpaper?
                            </h3>
                            <p className="mt-2 text-sm text-gray-600">
                                Go to the{" "}
                                <Link href="/generator" className="text-orange-500 hover:underline">
                                    Generator
                                </Link>{" "}
                                page, enter your date of birth, customize your settings, and
                                click "Save". Your wallpaper will be generated automatically!
                            </p>
                        </div>

                        <div className="rounded-lg border border-gray-200 p-4">
                            <h3 className="font-semibold text-gray-900">
                                How does the auto-update wallpaper work?
                            </h3>
                            <p className="mt-2 text-sm text-gray-600">
                                Your wallpaper URL (found in the Dashboard) always shows the
                                current day's progress. Use automation apps like MacroDroid to
                                set it as your wallpaper daily at midnight.
                            </p>
                        </div>

                        <div className="rounded-lg border border-gray-200 p-4">
                            <h3 className="font-semibold text-gray-900">
                                What are habits and how do I track them?
                            </h3>
                            <p className="mt-2 text-sm text-gray-600">
                                Habits are daily activities you want to build consistency with.
                                Go to the{" "}
                                <Link href="/habits" className="text-orange-500 hover:underline">
                                    Habits
                                </Link>{" "}
                                page, click "Add Habit", and start tracking your progress!
                            </p>
                        </div>

                        <div className="rounded-lg border border-gray-200 p-4">
                            <h3 className="font-semibold text-gray-900">
                                How are streaks calculated?
                            </h3>
                            <p className="mt-2 text-sm text-gray-600">
                                A streak is maintained when you complete all your active habits
                                for consecutive days. Your current streak shows how many days
                                in a row you've been consistent.
                            </p>
                        </div>

                        <div className="rounded-lg border border-gray-200 p-4">
                            <h3 className="font-semibold text-gray-900">
                                Can I customize the wallpaper design?
                            </h3>
                            <p className="mt-2 text-sm text-gray-600">
                                Yes! In the Generator, you can customize resolution, toggle
                                different elements (life grid, year grid, stats), add custom
                                quotes, and enable goal tracking.
                            </p>
                        </div>

                        <div className="rounded-lg border border-gray-200 p-4">
                            <h3 className="font-semibold text-gray-900">
                                Is my data private and secure?
                            </h3>
                            <p className="mt-2 text-sm text-gray-600">
                                Yes! Your data is stored securely and only accessible to you.
                                Your public wallpaper URL only shows the wallpaper image, not
                                your personal information.
                            </p>
                        </div>
                    </div>
                </Card>

                {/* MacroDroid Guide */}
                <Card className="p-6">
                    <h2 className="text-lg font-bold text-gray-900">
                        MacroDroid Setup Guide
                    </h2>
                    <p className="text-sm text-gray-500">
                        Auto-update your Android wallpaper daily
                    </p>

                    <div className="mt-6 space-y-4">
                        <div className="flex gap-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-500 text-sm font-bold text-white">
                                1
                            </div>
                            <div>
                                <p className="font-semibold text-gray-900">
                                    Install MacroDroid
                                </p>
                                <p className="text-sm text-gray-600">
                                    Download MacroDroid from Google Play Store
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-500 text-sm font-bold text-white">
                                2
                            </div>
                            <div>
                                <p className="font-semibold text-gray-900">Create New Macro</p>
                                <p className="text-sm text-gray-600">
                                    Tap the + button to create a new macro
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-500 text-sm font-bold text-white">
                                3
                            </div>
                            <div>
                                <p className="font-semibold text-gray-900">Set Trigger</p>
                                <p className="text-sm text-gray-600">
                                    Trigger: Time → Daily at 12:00 AM
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-500 text-sm font-bold text-white">
                                4
                            </div>
                            <div>
                                <p className="font-semibold text-gray-900">Add Action</p>
                                <p className="text-sm text-gray-600">
                                    Action: Set Wallpaper → From URL → Paste your wallpaper URL
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-500 text-sm font-bold text-white">
                                5
                            </div>
                            <div>
                                <p className="font-semibold text-gray-900">Save & Enable</p>
                                <p className="text-sm text-gray-600">
                                    Save the macro and make sure it's enabled
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 rounded-lg bg-orange-50 p-4">
                        <p className="text-sm text-orange-800">
                            <strong>Pro Tip:</strong> You can also trigger the wallpaper
                            update when you unlock your phone or at specific times throughout
                            the day!
                        </p>
                    </div>
                </Card>

                {/* Contact Support */}
                <Card className="p-6">
                    <h2 className="text-lg font-bold text-gray-900">Still Need Help?</h2>
                    <p className="text-sm text-gray-500">
                        Can't find what you're looking for? Contact our support team
                    </p>

                    <div className="mt-6 flex gap-3">
                        <button className="rounded-lg bg-orange-500 px-6 py-3 text-sm font-semibold text-white hover:bg-orange-600">
                            Email Support
                        </button>
                        <button className="rounded-lg border border-gray-200 bg-white px-6 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50">
                            Join Discord
                        </button>
                    </div>
                </Card>
            </div>
        </DashboardLayout>
    );
}
