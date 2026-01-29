export function sendWallpaperToAndroid(wallpaperUrl) {
    if (typeof window !== "undefined") {
        if (window.Android && window.Android.saveWallpaperUrl) {
            // Append timestamp to force refresh on Android side (bypassing cache)
            const timestamp = Date.now();
            const connector = wallpaperUrl.includes('?') ? '&' : '?';
            const urlWithTimestamp = `${wallpaperUrl}${connector}t=${timestamp}`;

            console.log("📱 Sending Auto-Sync Update to Android:", urlWithTimestamp);
            window.Android.saveWallpaperUrl(urlWithTimestamp);
        } else {
            // console.log("🌐 Not running inside Android app or bridge not found");
        }
    }
}
