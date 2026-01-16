"use client";

import { useState } from "react";
import { Toaster } from "react-hot-toast";
import Sidebar from "@/components/dashboard/Sidebar";

export default function DashboardLayout({ children, active = "Dashboard" }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <main className="flex min-h-screen bg-[#fffaf1]">
            <Toaster position="bottom-right" />

            {/* Mobile Sidebar Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/50 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <div
                className={`fixed inset-y-0 left-0 z-50 transform transition-transform duration-200 lg:static lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
                    }`}
            >
                <Sidebar active={active} />
            </div>

            {/* Main Content */}
            <section className="flex-1 flex flex-col min-w-0">
                {/* Mobile Header */}
                <div className="flex items-center gap-4 bg-[#fffaf1] p-4 lg:hidden">
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="rounded-lg bg-white p-2 text-gray-600 shadow-sm"
                    >
                        <svg
                            className="h-6 w-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 6h16M4 12h16M4 18h16"
                            />
                        </svg>
                    </button>
                    <span className="font-bold text-gray-900">ConsistencyGrid</span>
                </div>

                <div className="flex-1 p-4 lg:p-6 overflow-x-hidden">
                    {children}
                </div>
            </section>
        </main>
    );
}

