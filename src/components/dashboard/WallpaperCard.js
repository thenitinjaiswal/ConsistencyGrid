"use client";

import { useEffect, useState } from "react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Link from "next/link";
import CopyButton from "@/components/ui/CopyButton";

export default function WallpaperCard() {
  const [publicToken, setPublicToken] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadToken() {
      try {
        const res = await fetch("/api/settings/me");
        if (res.ok) {
          const data = await res.json();
          setPublicToken(data.user?.publicToken || "");
        }
      } catch (err) {
        console.error("Failed to load token:", err);
      } finally {
        setLoading(false);
      }
    }
    loadToken();
  }, []);

  const publicLink = publicToken ? `/w/${publicToken}` : "";
  const wallpaperPng = publicToken ? `/w/${publicToken}/image.png` : "";

  if (loading) {
    return (
      <Card className="p-5 animate-pulse">
        <div className="space-y-4">
          <div className="h-4 w-32 rounded bg-gray-200" />
          <div className="h-64 w-full rounded-lg bg-gray-200" />
        </div>
      </Card>
    );
  }

  if (!publicToken) {
    return (
      <Card className="p-5">
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <p className="text-sm font-semibold text-gray-700">
            No wallpaper yet
          </p>
          <p className="mt-2 text-xs text-gray-500">
            Go to Generator to create your first wallpaper
          </p>
          <Link href="/generator" className="mt-4">
            <Button variant="primary">Open Generator</Button>
          </Link>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-5 animate-scale-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-bold text-gray-900">Your Wallpaper</h2>
          <p className="text-xs text-gray-500">Live preview + quick actions</p>
        </div>

        <span className="flex items-center gap-1.5 rounded-full bg-green-100 px-3 py-1 text-[11px] font-semibold text-green-700">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-green-600" />
          Live
        </span>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Preview */}
        <div className="flex items-center justify-center rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 p-5 transition-all hover:shadow-lg">
          <div className="w-[240px] overflow-hidden rounded-[30px] border-2 border-gray-300 bg-black shadow-xl transition-transform hover:scale-105">
            <img
              src={wallpaperPng}
              alt="Wallpaper Preview"
              className="h-auto w-full"
              loading="lazy"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col justify-between gap-4">
          <div>
            <p className="text-xs font-semibold text-gray-700">
              Quick Actions
            </p>

            <div className="mt-2 flex flex-wrap gap-2">
              <Link href="/generator">
                <Button variant="secondary">Open Generator</Button>
              </Link>

              <a href={wallpaperPng} download="consistencygrid-wallpaper.png">
                <Button variant="primary">Download PNG</Button>
              </a>

              <CopyButton text={wallpaperPng} label="Copy URL" />
            </div>
          </div>

          {/* Public Link */}
          <div>
            <p className="text-xs font-semibold text-gray-700">Public Link</p>

            <div className="mt-2 flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2">
              <p className="flex-1 break-all text-sm text-gray-700">
                {publicLink}
              </p>
              <CopyButton text={`${window.location.origin}${publicLink}`} label="Copy" />
            </div>

            <p className="mt-2 text-[11px] text-gray-400">
              Use this URL in MacroDroid / automation apps.
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}

