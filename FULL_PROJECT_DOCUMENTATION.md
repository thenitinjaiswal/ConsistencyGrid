# ConsistencyGrid - Full Project Documentation

## 1. Executive Summary
**ConsistencyGrid** is a productivity ecosystem designed to keep users consistent through a unique mechanism: **Dynamic Live Wallpapers**. 

Unlike standard habit trackers that live inside an app you have to remember to open, ConsistencyGrid pushes your progress, goals, and reminders directly to your phone's lock screen and home screen. It forces you to see your life's progress every time you unlock your phone.

**Core Value Proposition:** "Consistency is the only way."

---

## 2. Technical Architecture

### **Tech Stack**
- **Framework:** [Next.js 14](https://nextjs.org/) (App Router)
- **Language:** JavaScript / React
- **Styling:** Tailwind CSS (Custom Design System with "Premium" aesthetics)
- **Database:** PostgreSQL (via [Prisma ORM](https://www.prisma.io/))
- **Auth:** NextAuth.js (Google OAuth + Credentials)
- **Canvas Engine:** `node-canvas` (Server-Side Image Generation)
- **Deployment:** Vercel (Edge/Serverless Functions)

### **Hybrid App Model**
ConsistencyGrid operates as a **Hybrid Web Application**.
1.  **The Core:** A responsive Next.js web application running in the cloud.
2.  **The Client:** Users access it via browser or the Native Android Wrapper App.
3.  **The Bridge:** The Android App injects a JavaScript Interface (`window.Android`) into the WebView. The Web App calls this interface to trigger native functions like "Set Wallpaper".

---

## 3. The "Secret Sauce": Wallpaper Engine & Sync

This is the most complex and critical part of the system.

### **A. How the Wallpaper is Generated**
The wallpaper is **not** a static image file stored on a server. It is **generated on-the-fly** via code every time it is requested.

*   **Endpoint:** `/src/app/w/[token]/image.png/route.js`
*   **Mechanism:**
    1.  The route receives a unique `publicToken`.
    2.  It fetches the user's data (Habits, Goals, Reminders, Theme Settings) from Postgres using Prisma.
    3.  It creates a virtual HTML5 `Canvas` on the server using `node-canvas`.
    4.  It draws the wallpaper layer-by-layer:
        *   Background Color (Theme)
        *   Life Grid (Weeks of your life) / Year Grid
        *   Heatmap (Habit consistency)
        *   Dashboard Header (Streak stats)
        *   Quote & Bottom Stats
    5.  It converts the canvas to a PNG buffer and returns it as an image.

### **B. How "Auto-Sync" Works**
When you check off a habit, you don't want to wait 24 hours for the wallpaper to update.

1.  **User Action:** You click a habit checkbox in `HabitCard.js`.
2.  **API Call:** The app saves the change to the database.
3.  **Bridge Call:** The app calls `sendWallpaperToAndroid(url)`.
    *   *Crucial Fix:* We append a timestamp to the URL (`?t=12345`) to bypass caching.
4.  **Native Trigger:** 
    *   The Web App executes `window.Android.saveWallpaperUrl(urlWithTimestamp)`.
    *   The Android App wakes up, downloads the new PNG from the URL, and resets the system wallpaper.
5.  **Visual Feedback:** A "Syncing Wallpaper... 🔄" toast appears on the Web UI.

---

## 4. Directory Structure Guide

### `/src/app` (The Brain)
The routing layer. Each folder is a route.
*   `/dashboard`: The main hub. Shows today's overview.
*   `/habits`: Manage daily routines.
*   `/goals`: Long-term tracking (Active Goals + Life Milestones).
*   `/reminders`: Date-specific tasks that appear on your grid.
*   `/generator`: visual editor to customize wallpaper layout/theme.
*   `/w/[token]`: Public routes for the wallpaper engine (No auth required, relies on token).
*   `/api`: Backend endpoints (e.g., `/api/habits`, `/api/goals`).

### `/src/components` (The Body)
Reusable UI elements.
*   `dashboard/Sidebar.js`: Main navigation.
*   `habits/HabitCard.js`: Interactive habit tracker component.
*   `streaks/StreakHeatmap.js`: GitHub-style contribution graph.
*   `wallpaper/renderers/grid.js`: *Client-side* preview logic (mirrors the server-side logic).

### `/src/lib` (The Tools)
Helper libraries and configurations.
*   `prisma.js`: Database connection client.
*   `wallpaper/components.js`: **Critical File.** Contains the drawing functions (`drawGrid`, `drawHeader`, etc.) used by the Server Endpoint to generate the image.
*   `auth.js` / `session`: User session management.

### `/src/utils` (The Connectors)
*   `sendWallpaperToAndroid.js`: The bridge file. Contains the function that talks to the phone.

---

## 5. Key Feature Workflows

### **1. Habit Tracking**
*   **Input:** User creates a habit (Title, Time).
*   **Storage:** Saved in `Habit` table. Logs stored in `HabitLog` table (date + status).
*   **Visualization:** 
    *   **Dashboard:** Shows today's list.
    *   **Streaks:** Shows heatmap.
    *   **Wallpaper:** Shows up as "Consistency Heatmap" squares.

### **2. Goals & Life Milestones**
*   **Regular Goals:** "Read 10 Books" (Progress bar).
*   **Life Milestones:** "Buy a House by age 30" (Pinned to specific Life Grid box).
*   **Logic:** The system calculates your "Life Progress" (Age / Life Expectancy) and visualizes exactly where you are on the `YearGrid` or `LifeGrid`.

### **3. Smart Reminders**
*   **Difference:** Unlike standard calendar events, these are designed to be "embedded" into your wallpaper grid.
*   **Logic:** A reminder for "Dec 25th" will highlight that specific box on your wallpaper's year grid, acting as a constant visual cue.

---

## 6. Database Schema (Simplified)

*   **User**: `email`, `password`, `publicToken`, `settings` (JSON).
*   **Habit**: `title`, `frequency`, `userId`.
    *   **HabitLog**: `date`, `done`, `habitId`.
*   **Goal**: `title`, `targetDate`, `progress`, `category` (LifeMilestone vs Goal).
    *   **SubGoal**: Broken down tasks for a goal.
*   **Reminder**: `title`, `date`, `isImportant`.

---

## 7. Deployment & Environment

*   **Production:** Hosted on Vercel.
*   **Database:** Hosted PostgreSQL (e.g., Supabase/Neon/Railway).
*   **Environment Variables:**
    *   `DATABASE_URL`: Connection string.
    *   `NEXTAUTH_SECRET`: Encryption key for sessions.
    *   `NEXTAUTH_URL`: Canonical URL.
    *   `GOOGLE_CLIENT_ID` / `SECRET`: OAuth.

---

## 8. Development Tips

*   **Modifying Wallpaper:** If you change how the wallpaper looks, you usually need to edit **TWO** places:
    1.  `src/app/w/[token]/image.png/route.js` (Server-side real generation).
    2.  `src/components/wallpaper/renderers/grid.js` (Client-side preview in /generator).
    *   *Note: They share drawing logic from `src/lib/wallpaper/components.js` to minimize duplication.*

*   **Debugging Sync:**
    *   Open `src/utils/sendWallpaperToAndroid.js`.
    *   The `toast.success` call is your best friend to see if the trigger is firing.
    *   Check Browser Console for "📱 Sending Auto-Sync Update...".

---

**Generated by Antigravity Agent**
