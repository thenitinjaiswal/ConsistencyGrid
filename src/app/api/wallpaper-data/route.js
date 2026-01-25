import prisma from "@/lib/prisma";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

function calculateWeeksBetween(startDate, endDate) {
    const millisecondsDiff = endDate.getTime() - startDate.getTime();
    return Math.floor(millisecondsDiff / (1000 * 60 * 60 * 24 * 7));
}

const TIMEZONE = "Asia/Kolkata";

function formatDateToDayString(date) {
    // Force formatting in IST to match user's local day
    const formatter = new Intl.DateTimeFormat('en-CA', {
        timeZone: TIMEZONE,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    });
    // canada format 'en-CA' gives YYYY-MM-DD
    return formatter.format(date);
}

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) {
        return new Response(JSON.stringify({ error: "Token required" }), { status: 400 });
    }

    // 1. Fetch User
    const currentUser = await prisma.user.findUnique({
        where: { publicToken: token },
        include: { settings: true },
    });

    if (!currentUser || !currentUser.settings) {
        return new Response(JSON.stringify({ error: "User not found" }), { status: 404 });
    }

    // 2. Fetch Settings
    const databaseSettings = currentUser.settings || {};

    // Helper to get setting value
    const getSettingValue = (key, defaultValue, type = "string") => {
        // Query param override (optional, good for testing)
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
        canvasWidth: 1080, // Standard width
        canvasHeight: 2340, // Standard height
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
        showHabitLayer: getSettingValue("showHabitLayer", true, "boolean"),
    };

    // 3. Fetch Habits & Goals
    const activeHabits = await prisma.habit.findMany({
        where: { userId: currentUser.id, isActive: true },
        include: { logs: true },
    });

    const pinnedGoals = await prisma.goal.findMany({
        where: {
            userId: currentUser.id,
            isCompleted: false,
            isPinned: true,
            category: { not: "LifeMilestone" }
        },
        include: { subGoals: true },
        take: 1
    });

    const activeGoals = pinnedGoals.length > 0
        ? pinnedGoals
        : await prisma.goal.findMany({
            where: {
                userId: currentUser.id,
                isCompleted: false,
                category: { not: "LifeMilestone" }
            },
            include: { subGoals: true },
            orderBy: { createdAt: 'desc' },
            take: 1
        });

    // 4. Calculate Stats
    const activityMap = {};
    activeHabits.forEach(habit => {
        habit.logs.forEach(log => {
            if (log.done) {
                const dayKey = formatDateToDayString(log.date);
                activityMap[dayKey] = (activityMap[dayKey] || 0) + 1;
            }
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

    // Calculate Streak
    let currentStreak = 0;
    let tempDate = new Date(currentDate);
    const todayLogged = (activityMap[formatDateToDayString(tempDate)] || 0) > 0;

    console.log(`[STREAK] Today: ${currentDayKey}, Logged: ${todayLogged}`);

    if (todayLogged) {
        currentStreak++;
    }

    tempDate = new Date(currentDate);
    tempDate.setDate(tempDate.getDate() - 1);

    while (true) {
        const dayStr = formatDateToDayString(tempDate);
        const logged = (activityMap[dayStr] || 0) > 0;

        console.log(`[STREAK] Checking ${dayStr}: ${logged}`);

        if (logged) {
            currentStreak++;
            tempDate.setDate(tempDate.getDate() - 1);
        } else {
            break;
        }
    }

    console.log(`[STREAK] Final: ${currentStreak}`);

    // 5. Fetch Active Reminders
    const activeReminders = await prisma.reminder.findMany({
        where: {
            userId: currentUser.id,
            isActive: true
        },
        orderBy: [
            { priority: 'desc' },
            { startDate: 'asc' }
        ]
    });

    // 6. Construct Response
    return new Response(JSON.stringify({
        meta: {
            generatedAt: new Date().toISOString(),
            timezone: "Asia/Kolkata", // Fixed for now, can be dynamic later
            version: "1.0.0"
        },
        user: {
            name: currentUser.name,
            settings: settings
        },
        stats: {
            streak: currentStreak,
            streakActiveToday: todayLogged,
            todayCompletionPercentage: todayCompletionPercentage,
            growthHistory: growthHistory,
            totalHabits: activeHabits.length
        },
        data: {
            activityMap: activityMap,
            habits: activeHabits,
            goals: activeGoals,
            reminders: activeReminders
        }
    }), {
        headers: {
            "Content-Type": "application/json",
            "Cache-Control": "no-store, max-age=0", // Always fresh
        }
    });
}
