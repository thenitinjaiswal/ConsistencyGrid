"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Button from "@/components/ui/Button";
import CopyButton from "@/components/ui/CopyButton";

export default function TopHeader() {
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

  const wallpaperUrl = user?.publicToken
    ? `${window.location.origin}/w/${user.publicToken}/image.png`
    : "";

  return (
    <header className="flex flex-col gap-4 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-100 md:flex-row md:items-center md:justify-between">
      {/* Left */}
      <div>
        <h1 className="text-xl font-bold text-gray-900">
          {loading
            ? "Loading..."
            : `Welcome back, ${user?.name || "User"}!`}
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

