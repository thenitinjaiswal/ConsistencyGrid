"use client";

import { useEffect, useState } from "react";
import { signOut } from "next-auth/react";
import Link from "next/link";

const menu = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Generator", href: "/generator" },
  { label: "Habits", href: "/habits" },
  { label: "Goals", href: "/goals" },
  { label: "Streaks", href: "/streaks" },
  { label: "Reminders", href: "/reminders" },
  { label: "Calendar", href: "/calendar" },
  { label: "Analytics", href: "/analytics" },
];

export default function Sidebar({ active = "Dashboard" }) {
  const [user, setUser] = useState(null);

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
      }
    }
    loadUser();
  }, []);

  async function handleLogout() {
    await signOut({ callbackUrl: "/" });
  }

  return (
    <aside className="flex h-screen w-[240px] flex-col border-r border-gray-200 bg-[#fffaf1]">
      {/* Top Logo */}
      <div className="flex items-center gap-2 px-5 py-5">
        <div className="h-9 w-9 rounded-xl bg-orange-500" />
        <span className="text-sm font-bold text-gray-900">ConsistencyGrid</span>
      </div>

      {/* Menu */}
      <nav className="flex-1 px-3">
        <p className="px-2 pb-2 text-[11px] font-semibold text-gray-400">
          MENU
        </p>

        <div className="space-y-1">
          {menu.map((item) => {
            const isActive = item.label === active;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center rounded-xl px-3 py-2 text-sm font-medium ${isActive
                  ? "bg-orange-500 text-white"
                  : "text-gray-700 hover:bg-white/60"
                  }`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Bottom */}
      <div className="border-t border-gray-200 px-3 py-4">
        <Link
          href="/settings"
          className="flex items-center rounded-xl px-3 py-2 text-sm font-medium text-gray-700 hover:bg-white/60"
        >
          Settings
        </Link>

        <Link
          href="/help"
          className="flex items-center rounded-xl px-3 py-2 text-sm font-medium text-gray-700 hover:bg-white/60"
        >
          Help
        </Link>

        <button
          onClick={handleLogout}
          className="flex w-full items-center rounded-xl px-3 py-2 text-sm font-medium text-red-600 hover:bg-white/60"
        >
          Logout
        </button>

        <div className="mt-4 flex items-center gap-3 rounded-xl bg-white p-3">
          <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center text-sm font-bold text-orange-600">
            {user?.name?.[0]?.toUpperCase() || "U"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate">
              {user?.name || "User"}
            </p>
            <p className="text-xs text-gray-500 truncate">
              {user?.email || "Loading..."}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}

