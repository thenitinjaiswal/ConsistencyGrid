"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Button from "@/components/ui/Button";
import CopyButton from "@/components/ui/CopyButton";
import { LocalCache } from "@/lib/performance";

export default function TopHeader() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadUser = async () => {
    // Try cache first
    const cached = LocalCache.get("cg_user_profile");
    if (cached) {
      setUser({ name: cached.name, publicToken: cached.publicToken });
      setLoading(false);
    }

    try {
      const res = await fetch("/api/settings/me", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        // Sync with shared cache
        LocalCache.set("cg_user_profile", {
          ...cached, // Keep existing stats if any
          name: data.user?.name,
          publicToken: data.user?.publicToken
        }, 60);
      }
    } catch (err) {
      console.error("Failed to load user:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUser();
    // Refresh every 3 minutes in background
    const interval = setInterval(loadUser, 180000);
    const handleFocus = () => {
      // Background refresh only
      if (!document.hidden) loadUser();
    };
    window.addEventListener("focus", handleFocus);
    document.addEventListener("visibilitychange", handleFocus);
    return () => {
      clearInterval(interval);
      window.removeEventListener("focus", handleFocus);
      document.removeEventListener("visibilitychange", handleFocus);
    };
  }, []);

  const wallpaperUrl = user?.publicToken
    ? `${window.location.origin}/w/${user.publicToken}/image.png`
    : "";

  return (
    <header className="flex flex-col gap-4 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-100 md:flex-row md:items-center md:justify-between animate-fade-in">
      {/* Left */}
      <div>
        <h1 className="text-xl font-bold text-gray-900">
          {loading ? (
            <span className="inline-block h-6 w-48 animate-pulse rounded bg-gray-200" />
          ) : (
            `Welcome back, ${user?.name || "User"}!`
          )}
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage your life calendar and habits
        </p>
      </div>

      {/* Right Actions */}
      <div className="flex flex-wrap gap-2">
        <Link href="/generator">
          <Button variant="secondary">Open Generator</Button>
        </Link>

        {wallpaperUrl && (
          <>
            <a href={wallpaperUrl} download="consistencygrid-wallpaper.png">
              <Button variant="primary">Download</Button>
            </a>

            <CopyButton text={wallpaperUrl} label="Copy URL" />
          </>
        )}
      </div>
    </header>
  );
}

