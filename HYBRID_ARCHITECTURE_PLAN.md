# 🏗️ Hybrid Wallpaper Architecture: Server API + Client Rendering + Android Automation

This document outlines the architecture to move image generation from the server (Node.js/Canvas) to the client (Browser/WebView), solving all font and rendering persistence issues.

## 1. 📂 Folder Structure

### Server (Next.js)
```
src/
├── app/
│   ├── api/
│   │   └── wallpaper-data/       # JSON Data Endpoint
│   │       └── route.js          # GET /api/wallpaper-data?token=...
│   └── wallpaper-renderer/       # Rendering Page (No API logic)
│       └── page.js               # Visual Canvas Renderer
├── components/
│   └── wallpaper/
│       ├── ClientCanvas.js       # Main <canvas> Logic
│       ├── useWallpaperData.js   # React Hook to fetch API
│       └── renderers/            # Shared rendering logic (ported to Client)
│           ├── grid.js
│           ├── header.js
│           └── ...
```

### Android App (Kotlin)
```
app/
├── src/main/java/com/consistencygrid/
│   ├── workers/
│   │   └── WallpaperWorker.kt    # WorkManager implementation (Daily)
│   ├── service/
│   │   └── WebInterface.kt       # JavaScript Interface (@JavascriptInterface)
│   └── MainActivity.kt
```

---

## 2. ⚡ Server API: JSON Data Layer
**Endpoint:** `GET /api/wallpaper-data?token=USER_TOKEN`

**Response Shape:**
```json
{
  "user": {
    "name": "Nitin",
    "theme": "dark-minimal"
  },
  "stats": {
    "streak": 12,
    "streakActiveToday": true,
    "lifeProgress": 34.5,
    "yearProgress": 15.2
  },
  "grid": {
    "mode": "weeks",
    "totalCells": 52,
    "filledCells": 12,
    "activeCells": [
      { "index": 0, "color": "#ffffff", "opacity": 1.0 },
      { "index": 1, "color": "#a1a1aa", "opacity": 0.5 }
    ]
  },
  "graph": {
    "dataPoints": [2, 5, 3, 8, 4, 7, 6]
  },
  "quote": {
    "text": "Consistency is key.",
    "author": "Unknown"
  },
  "reminders": [
    { "title": "Gym", "time": "08:00", "isDone": false }
  ]
}
```

---

## 3. 🎨 Client Renderer (Browser/WebView)

**File:** `src/app/wallpaper-renderer/page.js`

```javascript
'use client';
import { useEffect, useRef } from 'react';

export default function WallpaperRenderer() {
  const canvasRef = useRef(null);

  // 1. Get Token from URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    if(token) fetchDataAndRender(token);
  }, []);

  async function fetchDataAndRender(token) {
    // 2. Fetch Data
    const res = await fetch(`/api/wallpaper-data?token=${token}`);
    const data = await res.json();

    // 3. Draw on Canvas
    const ctx = canvasRef.current.getContext('2d');
    drawWallpaper(ctx, data);

    // 4. Signal Android (if present)
    if (window.Android) {
       // Short delay to ensure rendering finishes
       setTimeout(() => {
          const base64 = canvasRef.current.toDataURL("image/png");
          // Remove "data:image/png;base64," prefix for Android
          const cleanBase64 = base64.split(',')[1];
          window.Android.saveWallpaper(cleanBase64);
       }, 500);
    }
  }

  return (
    <canvas 
      ref={canvasRef} 
      width={1080} 
      height={2400} 
      style={{ width: '100%', maxWidth: '360px' }} // Preview size
    />
  );
}
```

---

## 4. 🤖 Android Automation Code

### A. JavaScript Interface (`WebInterface.kt`)
This allows the webpage to send data back to Kotlin.
```kotlin
class WebInterface(private val context: Context, private val workerCallback: (Boolean) -> Unit) {
    @JavascriptInterface
    fun saveWallpaper(base64Image: String) {
        try {
            // 1. Decode Base64
            val decodedString = Base64.decode(base64Image, Base64.DEFAULT)
            val bitmap = BitmapFactory.decodeByteArray(decodedString, 0, decodedString.size)

            // 2. Set Wallpaper
            val wallpaperManager = WallpaperManager.getInstance(context)
            wallpaperManager.setBitmap(bitmap)

            // 3. Success
            workerCallback(true)
        } catch (e: Exception) {
            e.printStackTrace()
            workerCallback(false)
        }
    }
}
```

### B. Worker Logic (`WallpaperWorker.kt`)
Runs in background (Headless WebView).
```kotlin
class WallpaperWorker(ctx: Context, params: WorkerParameters) : CoroutineWorker(ctx, params) {

    override suspend fun doWork(): Result {
        return withContext(Dispatchers.Main) {
            val token = inputData.getString("USER_TOKEN") ?: return@withContext Result.failure()
            
            // Create Invisible WebView
            val webView = WebView(applicationContext)
            webView.settings.javaScriptEnabled = true
            
            val completionSignal = CompletableDeferred<Result>()

            // Add Bridge
            webView.addJavascriptInterface(WebInterface(applicationContext) { success ->
                if (success) completionSignal.complete(Result.success())
                else completionSignal.complete(Result.failure())
            }, "Android")

            // Load Renderer Page
            webView.loadUrl("https://consistencygrid.com/wallpaper-renderer?token=$token")

            // Wait for completion (max 30s)
            try {
                withTimeout(30000) { completionSignal.await() }
            } catch (e: Exception) {
                Result.retry()
            }
        }
    }
}
```

---

## 5. 🔍 Why this solves Vercel Font Issues?

| Issue | Server-Side Canvas (Old) | Hybrid Client-Side (New) |
| :--- | :--- | :--- |
| **Fonts** | Vercel (Linux) doesn't have fonts. Needs manual bundling/tracing. | **WebView (Android)** uses system fonts or properly loaded WebFonts via CSS (`@font-face`). |
| **Rendering** | Text rendering differs from OS to OS. | **Pixel-perfect** consistency with Web Dashboard. |
| **Updates** | Passive. | **Active Automation** by Android app. |
| **Compute** | Heavy Canvas operations on Vercel ($$). | **Zero Server Load.** Rendering happens on user's device. |

---

## 6. ✅ Implementation Checklist

1. [ ] **API:** Create `GET /api/wallpaper-data`
2. [ ] **Page:** Create `src/app/wallpaper-renderer/page.js`
3. [ ] **Android:** Initial setup of WebView & Worker
4. [ ] **Testing:** Verify API returns JSON, Page renders canvas, Button exports PNG.
