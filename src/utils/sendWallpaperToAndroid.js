export function sendWallpaperToAndroid(data, type = "url") {
    if (typeof window !== "undefined") {
        if (window.Android) {
            if (type === "base64" && window.Android.saveWallpaper) {
                console.log("📱 Sending Base64 wallpaper to Android");
                window.Android.saveWallpaper(data);
            } else if (type === "url" && window.Android.saveWallpaperUrl) {
                console.log("📱 Sending wallpaper URL to Android:", data);
                window.Android.saveWallpaperUrl(data);
            }
        } else {
            console.log("🌐 Not running inside Android app or bridge not found");
        }
    }
}
