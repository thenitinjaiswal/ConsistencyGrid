"use client";
import { useEffect } from "react";
import { Toaster } from "react-hot-toast";
import Sidebar from "@/components/dashboard/Sidebar";
import BottomNav from "@/components/dashboard/BottomNav";

export default function DashboardLayout({ children, active = "Dashboard" }) {
    useEffect(() => {
        // Initialize Android background updates if bridge is available
        if (typeof window !== "undefined" && window.Android && window.Android.setAutoUpdateEnabled) {
            try {
                window.Android.setAutoUpdateEnabled(true);
                console.log("📱 Android Auto-Update initialized successfully");
            } catch (error) {
                console.error("📱 Android bridge error:", error);
            }
        }
    }, []);

    return (
        <main className="flex min-h-screen bg-[#fffaf1]">
            {/* 
                Toast Notification System
                Displays success/error messages in bottom-right corner
            */}
            <Toaster
                position="bottom-right"
                toastOptions={{
                    duration: 3000,
                    style: {
                        background: '#ffffff',
                        color: '#1f2937',
                        fontSize: '14px',
                    },
                    success: {
                        iconTheme: {
                            primary: '#f97316',
                            secondary: '#ffffff',
                        },
                    },
                }}
            />

            {/* 
                Desktop Sidebar Navigation
                Hidden on mobile, visible on lg screens and up
            */}
            <div className="hidden lg:block">
                <Sidebar active={active} />
            </div>

            {/* 
                Main Content Area
                Flexible column layout that grows to fill available space
            */}
            <section className="flex-1 flex flex-col min-w-0">
                {/* 
                    Mobile Header Bar
                    Only visible on mobile (< lg breakpoint)
                    Contains logo (hamburger removed for bottom nav)
                */}
                <div className="flex items-center justify-center bg-[#fffaf1] p-4 border-b border-gray-200/50 lg:hidden sticky top-0 z-30">
                    <div className="flex items-center gap-2">
                        <img
                            src="/images/logo.png"
                            alt="ConsistencyGrid Logo"
                            className="h-6 w-6"
                        />
                        <span className="text-sm font-semibold text-gray-900">
                            ConsistencyGrid
                        </span>
                    </div>
                </div>

                {/* 
                    Page Content Area
                    Includes bottom padding on mobile for BottomNav
                */}
                <div className="flex-1 p-4 sm:p-5 lg:p-6 overflow-x-hidden pb-24 lg:pb-6">
                    {children}
                </div>
            </section>

            {/* 
                Mobile Bottom Navigation
                Visible only on mobile screens
            */}
            <BottomNav active={active} />
        </main>
    );
}
