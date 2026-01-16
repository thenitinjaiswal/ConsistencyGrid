import prisma from "@/lib/prisma";
import { createCanvas } from "canvas";
import {
    drawBackground,
    drawDashboardHeader,
    drawGrid,
    drawBottomSection,
    drawQuote,
    drawAdPlaceholder
} from "@/lib/wallpaper/components";

function calculateWeeksBetween(startDate, endDate) {
    const millisecondsDiff = endDate.getTime() - startDate.getTime();
    return Math.floor(millisecondsDiff / (1000 * 60 * 60 * 24 * 7));
}

function formatDateToDayString(date) {
    return date.toISOString().split("T")[0];
}

export async function GET(request, { params }) {
    const { token } = await params;

    // 1. Fetch User
    const currentUser = await prisma.user.findUnique({
        where: { publicToken: token },
        include: { settings: true },
    });

    if (!currentUser || !currentUser.settings) {
        return new Response("Wallpaper not found", { status: 404 });
    }

    // 2. Fetch Settings or Defaults
    const databaseSettings = currentUser.settings || {};
    const { searchParams } = new URL(request.url);

    const getSettingValue = (key, defaultValue, type = "string") => {
        const queryParam = searchParams.get(key);
        if (queryParam !== null) {
            if (type === "boolean") return queryParam === "true";
            if (type === "number") return Number(queryParam);
            return queryParam;
        }
        return databaseSettings[key] !== undefined ? databaseSettings[key] : defaultValue;
    };

    const settings = {
        theme: getSettingValue("theme", "dark-minimal"),
        canvasWidth: getSettingValue("width", 1080, "number"),
        canvasHeight: getSettingValue("height", 2340, "number"),
        dateOfBirth: getSettingValue("dob", "2000-01-01"),
        lifeExpectancyYears: getSettingValue("lifeExpectancyYears", 80, "number"),

        yearGridMode: getSettingValue("yearGridMode", "weeks"),
        wallpaperType: getSettingValue("wallpaperType", "lockscreen"),

        showLifeGrid: getSettingValue("showLifeGrid", true, "boolean"),
        showYearGrid: getSettingValue("showYearGrid", true, "boolean"),
        showAgeStats: getSettingValue("showAgeStats", true, "boolean"),
        showQuote: getSettingValue("showQuote", true, "boolean"),
        quoteText: getSettingValue("quote", "Consistency is the only way"),

        goalEnabled: getSettingValue("goalEnabled", false, "boolean"),
        goalTitle: getSettingValue("goalTitle", ""),
        goalStartDate: getSettingValue("goalStartDate", ""),
        goalDurationDays: getSettingValue("goalDurationDays", 30, "number"),

        showHabitLayer: getSettingValue("showHabitLayer", true, "boolean"),
    };

    const { canvasWidth, canvasHeight } = settings;

    // 3. Fetch Habits for Calculations
    const activeHabits = await prisma.habit.findMany({
        where: { userId: currentUser.id, isActive: true },
        include: { logs: true },
    });

    const activityMap = {};
    activeHabits.forEach(habit => {
        habit.logs.forEach(log => {
            const dayKey = formatDateToDayString(log.date);
            activityMap[dayKey] = (activityMap[dayKey] || 0) + 1;
        });
    });

    const currentDate = new Date();
    const currentDayKey = formatDateToDayString(currentDate);

    // Growth History (Last 7 days)
    const growthHistory = [];
    for (let offset = 6; offset >= 0; offset--) {
        const date = new Date(currentDate);
        date.setDate(date.getDate() - offset);
        growthHistory.push(activityMap[formatDateToDayString(date)] || 0);
    }

    // Today's Completion Percentage
    const todayCompletionPercentage = activeHabits.length > 0
        ? Math.round(((activityMap[currentDayKey] || 0) / activeHabits.length) * 100)
        : 0;

    // --- DRAWING ---
    const canvas = createCanvas(canvasWidth, canvasHeight);
    const canvasContext = canvas.getContext("2d");

    // THEMES - Strict Monochrome / Dark Mode
    const COLOR_THEMES = {
        "minimal-dark": {
            BG: "#09090b",
            CARD: "#121212",
            TEXT_MAIN: "#ffffff",
            TEXT_SUB: "#71717a",
            ACCENT: "#ffffff",
            GRID_ACTIVE: "#ffffff",
            GRID_INACTIVE: "#27272a"
        },
        "sunset-orange": {
            BG: "#09090b",
            CARD: "#121212",
            TEXT_MAIN: "#ffffff",
            TEXT_SUB: "#71717a",
            ACCENT: "#ff7a00",
            GRID_ACTIVE: "#ff7a00",
            GRID_INACTIVE: "#27272a"
        },
        "ocean-blue": {
            BG: "#09090b",
            CARD: "#121212",
            TEXT_MAIN: "#ffffff",
            TEXT_SUB: "#71717a",
            ACCENT: "#0088ff",
            GRID_ACTIVE: "#0088ff",
            GRID_INACTIVE: "#27272a"
        },
        "forest-green": {
            BG: "#09090b",
            CARD: "#121212",
            TEXT_MAIN: "#ffffff",
            TEXT_SUB: "#71717a",
            ACCENT: "#00cc66",
            GRID_ACTIVE: "#00cc66",
            GRID_INACTIVE: "#27272a"
        },
        "purple-haze": {
            BG: "#09090b",
            CARD: "#121212",
            TEXT_MAIN: "#ffffff",
            TEXT_SUB: "#71717a",
            ACCENT: "#a855f7",
            GRID_ACTIVE: "#a855f7",
            GRID_INACTIVE: "#27272a"
        },
        "monochrome": {
            BG: "#ffffff",
            CARD: "#f4f4f5",
            TEXT_MAIN: "#18181b",
            TEXT_SUB: "#71717a",
            ACCENT: "#18181b",
            GRID_ACTIVE: "#18181b",
            GRID_INACTIVE: "#e4e4e7"
        },
        "dark-minimal": {
            BG: "#09090b",
            CARD: "#121212",
            TEXT_MAIN: "#ffffff",
            TEXT_SUB: "#71717a",
            ACCENT: "#ffffff",
            GRID_ACTIVE: "#ffffff",
            GRID_INACTIVE: "#27272a"
        },
        "orange-glow": {
            BG: "#09090b",
            CARD: "#121212",
            TEXT_MAIN: "#ffffff",
            TEXT_SUB: "#71717a",
            ACCENT: "#ff7a00",
            GRID_ACTIVE: "#ff7a00",
            GRID_INACTIVE: "#27272a"
        },
    };
    const activeTheme = COLOR_THEMES[settings.theme] || COLOR_THEMES["minimal-dark"];

    // Layout Constants
    const horizontalMargin = canvasWidth * 0.08;
    const contentWidth = canvasWidth - (horizontalMargin * 2);
    let verticalCursorY = canvasHeight * 0.33; // Start lower to clear Lock Screen Clock

    // 1. Background
    drawBackground(canvasContext, canvasWidth, canvasHeight, activeTheme);

    // 2. Dashboard Header
    if (settings.showAgeStats) {
        verticalCursorY += drawDashboardHeader(canvasContext, {
            xCoordinate: horizontalMargin,
            yCoordinate: verticalCursorY,
            width: contentWidth,
            theme: activeTheme,
            history: growthHistory,
            todayPercent: todayCompletionPercentage
        });
    } else {
        verticalCursorY += 100;
    }

    // 3. Main Grid (Full Display)
    verticalCursorY += drawGrid(canvasContext, {
        xCoordinate: horizontalMargin,
        yCoordinate: verticalCursorY,
        width: contentWidth,
        height: canvasHeight,
        theme: activeTheme,
        mode: settings.yearGridMode,
        dob: settings.dateOfBirth,
        lifeExpectancy: settings.lifeExpectancyYears,
        activityMap: activityMap,
        now: currentDate
    });

    // 4. Bottom Section (Habits & Goals)
    drawBottomSection(canvasContext, {
        xCoordinate: horizontalMargin,
        yCoordinate: verticalCursorY + 50,
        width: contentWidth,
        height: canvasHeight,
        theme: activeTheme,
        habits: activeHabits,
        settings: settings,
        nowDay: currentDayKey,
        now: currentDate
    });

    // 5. Quote
    if (settings.showQuote) {
        drawQuote(canvasContext, {
            xCoordinate: horizontalMargin,
            yCoordinate: 0,
            width: canvasWidth,
            height: canvasHeight,
            theme: activeTheme,
            quote: settings.quoteText
        });
    }

    // 6. AD Placeholder (Optional - Commented out)
    // drawAdPlaceholder(canvasContext, {
    //     xCoordinate: canvasWidth/2 - 150,
    //     yCoordinate: canvasHeight - 150,
    //     width: 300,
    //     height: 60,
    //     theme: activeTheme
    // });

    return new Response(canvas.toBuffer("image/png"), {
        headers: {
            "Content-Type": "image/png",
            "Cache-Control": "no-store, max-age=0"
        }
    });
}
