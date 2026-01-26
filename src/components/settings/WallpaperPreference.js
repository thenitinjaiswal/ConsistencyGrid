"use client";

import { useState, useEffect } from "react";

/**
 * Wallpaper Preference Component
 * 
 * Mobile/Tablet Only: Shows where to apply wallpaper (Home, Lock, Both)
 * Sends preference to Android app via bridge
 * Hidden on desktop screens (> 1024px)
 */
export default function WallpaperPreference() {
  const [target, setTarget] = useState("BOTH");
  const [autoUpdate, setAutoUpdate] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [hasAndroidBridge, setHasAndroidBridge] = useState(false);

  // Detect mobile/tablet on mount and window resize
  useEffect(() => {
    const checkMobileView = () => {
      // Check viewport width
      const isMobileWidth = window.innerWidth <= 1024;

      // Check user agent for Android WebView
      const isAndroidWebView = /webview|android/i.test(navigator.userAgent);

      // Show on mobile width OR Android WebView
      const isMobileScreen = isMobileWidth || isAndroidWebView;
      setIsMobile(isMobileScreen);

      // Check for Android bridge
      setHasAndroidBridge(!!(window.Android && window.Android.setWallpaperTarget));
    };

    checkMobileView();
    window.addEventListener("resize", checkMobileView);
    return () => window.removeEventListener("resize", checkMobileView);
  }, []);

  // Send preference to Android app
  const handleTargetChange = (newTarget) => {
    setTarget(newTarget);

    // Send to Android bridge if available
    if (hasAndroidBridge && window.Android.setWallpaperTarget) {
      try {
        window.Android.setWallpaperTarget(newTarget);
        console.log(`[WallpaperPreference] Sent to Android: ${newTarget}`);
      } catch (error) {
        console.error("[WallpaperPreference] Failed to send to Android:", error);
      }
    } else if (!isMobile) {
      // Silent - desktop users won't see this anyway
    }
  };

  // Handle Auto-Update change
  const handleAutoUpdateChange = (enabled) => {
    setAutoUpdate(enabled);

    if (hasAndroidBridge && window.Android.setAutoUpdateEnabled) {
      try {
        window.Android.setAutoUpdateEnabled(enabled);
        console.log(`[WallpaperPreference] Auto-update ${enabled ? "enabled" : "disabled"}`);
      } catch (error) {
        console.error("[WallpaperPreference] Failed to set auto-update:", error);
      }
    }
  };

  // Only render on mobile/tablet
  if (!isMobile) {
    return null;
  }

  return (
    <div className="rounded-lg bg-white p-4 sm:p-6 shadow-sm ring-1 ring-gray-100">
      {/* Header */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Wallpaper Preference</h3>
        <p className="text-sm text-gray-500 mt-1">
          Choose where to apply the wallpaper
        </p>
      </div>

      {/* Options */}
      <div className="space-y-3">
        {/* Home Screen Option */}
        <label className="flex items-center gap-3 p-3 rounded-lg border-2 border-transparent hover:border-orange-200 hover:bg-orange-50/30 cursor-pointer transition-colors"
          style={{
            borderColor: target === "HOME" ? "#fb923c" : "transparent",
            backgroundColor: target === "HOME" ? "#fffaf1" : "transparent"
          }}>
          <input
            type="radio"
            name="wallpaper-target"
            value="HOME"
            checked={target === "HOME"}
            onChange={(e) => handleTargetChange(e.target.value)}
            className="w-4 h-4 text-orange-500 cursor-pointer"
          />
          <div className="flex-1">
            <p className="font-medium text-gray-900">Home Screen</p>
            <p className="text-xs text-gray-500">Apply to home screen only</p>
          </div>
        </label>

        {/* Lock Screen Option */}
        <label className="flex items-center gap-3 p-3 rounded-lg border-2 border-transparent hover:border-orange-200 hover:bg-orange-50/30 cursor-pointer transition-colors"
          style={{
            borderColor: target === "LOCK" ? "#fb923c" : "transparent",
            backgroundColor: target === "LOCK" ? "#fffaf1" : "transparent"
          }}>
          <input
            type="radio"
            name="wallpaper-target"
            value="LOCK"
            checked={target === "LOCK"}
            onChange={(e) => handleTargetChange(e.target.value)}
            className="w-4 h-4 text-orange-500 cursor-pointer"
          />
          <div className="flex-1">
            <p className="font-medium text-gray-900">Lock Screen</p>
            <p className="text-xs text-gray-500">Apply to lock screen only</p>
          </div>
        </label>

        {/* Both Screens Option */}
        <label className="flex items-center gap-3 p-3 rounded-lg border-2 border-transparent hover:border-orange-200 hover:bg-orange-50/30 cursor-pointer transition-colors"
          style={{
            borderColor: target === "BOTH" ? "#fb923c" : "transparent",
            backgroundColor: target === "BOTH" ? "#fffaf1" : "transparent"
          }}>
          <input
            type="radio"
            name="wallpaper-target"
            value="BOTH"
            checked={target === "BOTH"}
            onChange={(e) => handleTargetChange(e.target.value)}
            className="w-4 h-4 text-orange-500 cursor-pointer"
          />
          <div className="flex-1">
            <p className="font-medium text-gray-900">Both Screens</p>
            <p className="text-xs text-gray-500">Apply to both home and lock screens (default)</p>
          </div>
        </label>
      </div>

      {/* Auto Update Section */}
      <div className="mt-8 pt-6 border-t border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <span>⏰</span>
          Daily Auto Update
        </h3>
        <p className="text-sm text-gray-500 mt-1 mb-4">
          Automatically update your wallpaper every day at 12 PM
        </p>

        <label className="flex items-center justify-between p-3 rounded-lg border-2 border-dashed border-gray-200 hover:border-orange-200 bg-gray-50/30 cursor-pointer transition-all">
          <div>
            <p className="font-medium text-gray-900">Background Updates</p>
            <p className="text-xs text-gray-500">Updates even when app is closed</p>
          </div>
          <div className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ring-2 ring-offset-2 ring-transparent">
            <input
              type="checkbox"
              className="sr-only"
              checked={autoUpdate}
              onChange={(e) => handleAutoUpdateChange(e.target.checked)}
            />
            <span
              className={`${autoUpdate ? 'bg-orange-500' : 'bg-gray-200'
                } relative inline-block h-6 w-11 rounded-full transition-colors duration-200 ease-in-out`}
            >
              <span
                className={`${autoUpdate ? 'translate-x-6' : 'translate-x-1'
                  } inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ease-in-out mt-1`}
              />
            </span>
          </div>
        </label>
        <p className="mt-3 text-[10px] text-gray-400 italic">
          Note: This feature requires the Android app to be installed.
        </p>
      </div>

      {/* Bridge Status (for debugging) */}
      {process.env.NODE_ENV === "development" && (
        <div className="mt-4 pt-4 border-t border-gray-200 text-xs text-gray-500">
          <p>Mobile view: {isMobile ? "✅ Yes" : "❌ No"}</p>
          <p>Android bridge: {hasAndroidBridge ? "✅ Available" : "⚠️ Not available"}</p>
        </div>
      )}
    </div>
  );
}
