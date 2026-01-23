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
