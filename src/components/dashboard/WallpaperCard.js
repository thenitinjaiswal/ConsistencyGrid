"use client";

import { useEffect, useState } from "react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Link from "next/link";
import CopyButton from "@/components/ui/CopyButton";
import { Download, Share2, Sparkles, RefreshCw } from "lucide-react";
import { LocalCache } from "@/lib/performance";

export default function WallpaperCard() {
  const [publicToken, setPublicToken] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(Date.now());
  const [wallpaperStats, setWallpaperStats] = useState({
    percentComplete: 0,
    weeksLived: 0,
  });

  const loadData = async (isManual = false) => {
    // Try to load from cache first for instant UI (Amazon style)
    if (!isManual) {
      const cached = LocalCache.get("cg_user_profile");
      if (cached) {
        setPublicToken(cached.publicToken);
        setWallpaperStats(cached.stats);
        setLoading(false);
      }
    }

    try {
      const res = await fetch("/api/settings/me", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        const newToken = data.user?.publicToken || "";
        const name = data.user?.name || "";

        let stats = { percentComplete: 0, weeksLived: 0 };
        if (data.user?.createdAt) {
          const created = new Date(data.user.createdAt);
          const now = new Date();
          const weeksLived = Math.floor((now - created) / (7 * 24 * 60 * 60 * 1000));
          const percentComplete = Math.min((weeksLived / 1111) * 100, 100).toFixed(1);
          stats = { percentComplete, weeksLived };
        }

        setPublicToken(newToken);
        setWallpaperStats(stats);

        // Update cache for next time - shared across dashboard components
        LocalCache.set("cg_user_profile", { publicToken: newToken, stats, name }, 60);
      }
    } catch (err) {
      console.error("Failed to load:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // Only refresh every 2 minutes in background (performance)
    const interval = setInterval(() => loadData(), 120000);

    const handleFocusOrVisibility = () => {
      // Refresh in background without setting loading=true (SWR style)
      if (!document.hidden) loadData();
    };

    window.addEventListener("focus", handleFocusOrVisibility);
    document.addEventListener("visibilitychange", handleFocusOrVisibility);

    return () => {
      clearInterval(interval);
      window.removeEventListener("focus", handleFocusOrVisibility);
      document.removeEventListener("visibilitychange", handleFocusOrVisibility);
    };
  }, []);

  const publicLink = publicToken ? `/w/${publicToken}` : "";
  const wallpaperPng = publicToken ? `/w/${publicToken}/image.png?t=${refreshKey}` : "";

  const handleManualRefresh = () => {
    setRefreshKey(Date.now());
  };

  if (loading) {
    return (
      <Card className="p-6 border border-gray-100 bg-white">
        <div className="flex items-start justify-between mb-4">
          <div className="space-y-2">
            <div className="h-6 w-32 rounded bg-gray-100 animate-pulse" />
            <div className="h-4 w-48 rounded bg-gray-50 animate-pulse" />
          </div>
          <div className="h-6 w-16 rounded-full bg-gray-100 animate-pulse" />
        </div>
        <div className="flex justify-center py-4">
          <div className="w-56 h-80 rounded-3xl border-8 border-gray-100 bg-gray-50 animate-pulse" />
        </div>
      </Card>
    );
  }

  if (!publicToken) {
    return (
      <Card className="p-6 border-2 border-dashed border-orange-200 bg-gradient-to-br from-orange-50/30 to-transparent">
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 rounded-full bg-orange-100 flex items-center justify-center mb-4">
            <Sparkles className="w-8 h-8 text-orange-600" />
          </div>
          <p className="text-lg font-bold text-gray-900">
            Create Your Wallpaper
          </p>
          <p className="mt-2 text-sm text-gray-600 max-w-xs">
            Generate a personalized life calendar wallpaper to track your goals and habits
          </p>
          <Link href="/generator" className="mt-6">
            <Button variant="primary">
              <Sparkles className="w-4 h-4 mr-2" />
              Open Generator
            </Button>
          </Link>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 border border-gray-200/50">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Your Wallpaper</h2>
          <p className="text-sm text-gray-600">
            {wallpaperStats.percentComplete}% of life lived ({wallpaperStats.weeksLived} weeks)
          </p>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
          <span className="h-1.5 w-1.5 rounded-full bg-green-600 animate-pulse" />
          Live
        </span>
      </div>

      {/* Wallpaper Preview */}
      <div className="mb-6 flex justify-center">
        <div className="w-56 overflow-hidden rounded-3xl border-8 border-gray-900 bg-black shadow-xl relative">
          <img
            key={refreshKey}
            src={wallpaperPng}
            alt="Wallpaper"
            className="h-auto w-full"
            loading="lazy"
          />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mb-6">
        <p className="text-sm font-semibold text-gray-900 mb-3">Quick Actions</p>
        <div className="flex flex-wrap gap-3">
          <Link href="/generator">
            <Button variant="primary" size="sm" className="flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              Open Generator
            </Button>
          </Link>

          <button
            onClick={handleManualRefresh}
            className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>

          <a href={wallpaperPng} download="consistencygrid-wallpaper.png">
            <Button variant="secondary" size="sm" className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              Download PNG
            </Button>
          </a>

          <CopyButton text={wallpaperPng} label="Copy URL" />
        </div>
      </div>

      {/* Public Link */}
      {publicLink && (
        <div className="pt-6 border-t border-gray-200">
          <p className="text-sm font-semibold text-gray-900 mb-2">Public Link</p>
          <div className="flex items-center gap-2 rounded-lg bg-gray-50 px-3 py-2">
            <code className="text-xs text-gray-600 flex-1 break-all">
              {publicLink}
            </code>
            <CopyButton text={`${typeof window !== "undefined" ? window.location.origin : ""}${publicLink}`} label="Copy" />
          </div>
        </div>
      )}
    </Card>
  );
}

