'use client';
import { useEffect, useRef, useState } from 'react';
import {
    drawBackground,
    drawDashboardHeader,
    drawGrid,
    drawBottomSection,
    drawQuote,
    drawStreakWidget,
    drawLifeHeader
} from "@/components/wallpaper/ClientCanvas";

export default function WallpaperRenderer() {
    const canvasRef = useRef(null);
    const [status, setStatus] = useState('loading'); // loading, success, error
    const [errorMsg, setErrorMsg] = useState('');

    useEffect(() => {
        // Expose render function for Android automation
        window.forceWallpaperRender = async () => {
            console.log('🤖 Android forced render');
            const params = new URLSearchParams(window.location.search);
            const token = params.get('token');
            if (token) await fetchDataAndRender(token);
        };

        // Automatic render on load
        const params = new URLSearchParams(window.location.search);
        const token = params.get('token');

        if (!token) {
            setStatus('error');
            setErrorMsg('Missing token parameter');
            return;
        }

        fetchDataAndRender(token);

        // 🎯 Auto-update wallpaper at 12:00 PM
        let timerId;
        const scheduleNextNoonUpdate = () => {
            const now = new Date();
            const nextNoon = new Date(now);
            nextNoon.setHours(12, 0, 0, 0);

            // If it's already past 12pm today, set for tomorrow
            if (now >= nextNoon) {
                nextNoon.setDate(nextNoon.getDate() + 1);
            }

            const msToWait = nextNoon.getTime() - now.getTime();
            console.log(`⏰ Next auto-update scheduled for 12:00 PM in ${Math.round(msToWait / 1000 / 60)} minutes`);

            timerId = setTimeout(() => {
                console.log('🔔 12:00 PM reached! Auto-updating wallpaper...');
                fetchDataAndRender(token);
                scheduleNextNoonUpdate(); // Reschedule for next day
            }, msToWait);
        };

        scheduleNextNoonUpdate();
        return () => clearTimeout(timerId);
    }, []);

    async function fetchDataAndRender(token) {
        try {
            console.log('🚀 Fetching wallpaper data...');
            const res = await fetch(`/api/wallpaper-data?token=${token}`);

            if (!res.ok) throw new Error(`API Error: ${res.status}`);

            const data = await res.json();
            console.log('✅ Data received:', data);

            const canvas = canvasRef.current;
            if (!canvas) return;

            // Set canvas size (vertical FHD)
            canvas.width = 1080;
            canvas.height = 2340;

            const ctx = canvas.getContext('2d');

            // 🔥 CRITICAL: Wait for fonts with timeout
            if (document.fonts) {
                console.log('🔄 Syncing fonts...');
                await Promise.race([
                    document.fonts.ready,
                    new Promise(resolve => setTimeout(resolve, 2500)) // 2.5s timeout
                ]);
                console.log('✅ Font sync step passed');
            }

            // Draw Everything
            const { settings = {} } = data.user;
            const theme = getThemeColors(settings.theme || 'dark-minimal');
            const cWidth = settings.canvasWidth || 1080;
            const cHeight = settings.canvasHeight || 2340;

            // Re-sync canvas size if needed
            canvas.width = cWidth;
            canvas.height = cHeight;

            // 1. Background
            drawBackground(ctx, cWidth, cHeight, theme);

            // 2. Life Header
            const birthDate = new Date(settings.dateOfBirth);
            const lifeExpectancyMs = settings.lifeExpectancyYears * 365.25 * 24 * 60 * 60 * 1000;
            const ageMs = new Date() - birthDate;
            const lifeProgressPercent = Math.min(100, Math.max(0, (ageMs / lifeExpectancyMs) * 100));

            drawLifeHeader(ctx, {
                canvasWidth: cWidth,
                theme,
                progress: lifeProgressPercent
            });

            // 3. Dashboard Header & Streak
            const verticalCursorY = settings.wallpaperType === "lockscreen" ? cHeight * 0.35 : cHeight * 0.12;

            if (settings.showAgeStats) {
                drawStreakWidget(ctx, {
                    x: cWidth * 0.92, // Right margin
                    y: verticalCursorY - 60,
                    theme,
                    streak: data.stats.streak,
                    streakActiveToday: data.stats.streakActiveToday
                });

                drawDashboardHeader(ctx, {
                    xCoordinate: cWidth * 0.08, // Left margin
                    yCoordinate: verticalCursorY,
                    width: cWidth * 0.84,
                    theme,
                    history: data.stats.growthHistory,
                    todayPercent: data.stats.todayCompletionPercentage,
                    streak: data.stats.streak,
                    streakActiveToday: data.stats.streakActiveToday
                });
            }

            // 4. Grid (Middle Section)
            drawGrid(ctx, {
                xCoordinate: cWidth * 0.08,
                yCoordinate: verticalCursorY + (settings.showAgeStats ? 250 : 0),
                width: cWidth * 0.84,
                height: cHeight,
                theme,
                themeName: settings.theme,
                mode: settings.yearGridMode,
                dob: settings.dateOfBirth,
                lifeExpectancy: settings.lifeExpectancyYears,
                activityMap: data.data.activityMap,
                totalHabits: data.stats.totalHabits,
                reminders: data.data.reminders,
                now: new Date()
            });

            // 5. Quote
            if (settings.showQuote) {
                drawQuote(ctx, {
                    xCoordinate: cWidth * 0.08,
                    yCoordinate: cHeight - 120,
                    width: cWidth * 0.84,
                    height: 100,
                    theme,
                    quote: settings.quoteText
                });
            }

            setStatus('success');
            console.log('✨ Render complete');

            // Signal Android
            if (window.Android) {
                console.log('📱 Sending to Android...');
                const base64 = canvas.toDataURL("image/png");
                const cleanBase64 = base64.split(',')[1];
                window.Android.saveWallpaper(cleanBase64);
            }

        } catch (err) {
            console.error('Render failed:', err);
            setStatus('error');
            setErrorMsg(err.message);
        }
    }

    // Helper: Theme Colors
    function getThemeColors(themeName) {
        const themes = {
            "minimal-dark": { BG: "#09090b", CARD: "#18181b", TEXT_MAIN: "#fafafa", TEXT_SUB: "#a1a1aa", ACCENT: "#ffffff", GRID_ACTIVE: "#ffffff", GRID_INACTIVE: "#27272a" },
            "dark-minimal": { BG: "#09090b", CARD: "#18181b", TEXT_MAIN: "#fafafa", TEXT_SUB: "#a1a1aa", ACCENT: "#ffffff", GRID_ACTIVE: "#ffffff", GRID_INACTIVE: "#27272a" },
            "sunset-orange": { BG: "#09090b", CARD: "#1a0f0a", TEXT_MAIN: "#fafafa", TEXT_SUB: "#a1a1aa", ACCENT: "#ff8c42", GRID_ACTIVE: "#ff8c42", GRID_INACTIVE: "#2a2019" },
            "orange-glow": { BG: "#09090b", CARD: "#1a0f0a", TEXT_MAIN: "#fafafa", TEXT_SUB: "#a1a1aa", ACCENT: "#ff8c42", GRID_ACTIVE: "#ff8c42", GRID_INACTIVE: "#2a2019" },
            "white-clean": { BG: "#ffffff", CARD: "#f4f4f5", TEXT_MAIN: "#09090b", TEXT_SUB: "#71717a", ACCENT: "#09090b", GRID_ACTIVE: "#09090b", GRID_INACTIVE: "#e4e4e7" },
        };
        return themes[themeName] || themes["dark-minimal"];
    }

    return (
        <div style={{ background: '#000', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <link
                href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
                rel="stylesheet"
            />
            {status === 'loading' && <p style={{ color: '#fff' }}>Rendering Wallpaper...</p>}
            {status === 'error' && <p style={{ color: 'red' }}>Error: {errorMsg}</p>}

            <canvas
                ref={canvasRef}
                style={{
                    maxHeight: '90vh',
                    maxWidth: '90vw',
                    border: '1px solid #333',
                    // Hardware acceleration hints
                    transform: 'translateZ(0)',
                    backfaceVisibility: 'hidden'
                }}
            />
        </div>
    );
}
