export function sendWallpaperToAndroid(wallpaperUrl) {
    if (typeof window !== "undefined") {
        if (window.Android && window.Android.saveWallpaperUrl) {
            // console.log("📱 Sending wallpaper URL to Android:", wallpaperUrl);
            window.Android.saveWallpaperUrl(wallpaperUrl);
        } else {
            // console.log("🌐 Not running inside Android app or bridge not found");
        }
    }
}
