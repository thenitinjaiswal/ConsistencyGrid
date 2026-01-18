/**
 * Bottom Navigation Component
 * 
 * Mobile-only navigation bar that appears at the bottom of the screen.
 * Replaces the sidebar on small screens for a native app-like experience.
 * 
 * Features:
 * - Fixed positioning at bottom
 * - Comprehensive menu items (scrollable)
 * - Stacked icon/label layout
 * - Visual feedback for active state
 */

"use client";
import Link from "next/link";
import {
    LayoutDashboard,
    Wand2,
    ListChecks,
    Target,
    Flame,
    Bell,
    Calendar,
    BarChart3,
    Settings
} from "lucide-react";

/**
 * Full menu items list matching the sidebar
 */
const bottomMenu = [
    { label: "Home", href: "/dashboard", icon: LayoutDashboard },
    { label: "Generator", href: "/generator", icon: Wand2 },
    { label: "Habits", href: "/habits", icon: ListChecks },
    { label: "Goals", href: "/goals", icon: Target },
    { label: "Streaks", href: "/streaks", icon: Flame },
    { label: "Reminders", href: "/reminders", icon: Bell },
    { label: "Calendar", href: "/calendar", icon: Calendar },
    { label: "Analytics", href: "/analytics", icon: BarChart3 },
    { label: "Settings", href: "/settings", icon: Settings },
];

export default function BottomNav({ active = "Dashboard" }) {
    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 lg:hidden shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
            {/* 
        Scrollable Container 
        overflow-x-auto enables horizontal scrolling
        no-scrollbar hides the scrollbar visual (requires CSS utility below)
      */}
            <nav className="flex items-center w-fit mx-auto max-w-full overflow-x-auto no-scrollbar py-2 px-2 scroll-smooth">
                {bottomMenu.map((item) => {
                    // Map "Dashboard" active state to "Home" label if needed
                    const isActive = active === item.label || (active === "Dashboard" && item.label === "Home");
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`
                    flex flex-col items-center justify-center gap-1 min-w-[72px] flex-shrink-0
                    transition-colors duration-200 px-2 py-1 rounded-lg select-none
                    ${isActive ? "text-orange-500 bg-orange-50/50" : "text-gray-500 hover:text-gray-900"}
                `}
                        >
                            <Icon
                                className={`w-6 h-6 ${isActive ? "stroke-[2.5px]" : "stroke-2"}`}
                            />
                            <span className="text-[10px] font-medium leading-none whitespace-nowrap">
                                {item.label}
                            </span>
                        </Link>
                    );
                })}
            </nav>


        </div>
    );
}
