import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/authOptions";
import prisma from "@/lib/prisma";

// Get local date string in YYYY-MM-DD format
function getLocalDateString(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// Convert date object to local date string
function dateToLocalDateString(dateObj) {
    return getLocalDateString(new Date(dateObj));
}

export async function GET() {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
        return Response.json({ message: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
    });

    if (!user) {
        return Response.json({ message: "User not found" }, { status: 404 });
    }

    // Get all active habits
    const habits = await prisma.habit.findMany({
        where: { userId: user.id, isActive: true },
    });

    // Get all habit logs
    const allLogs = await prisma.habitLog.findMany({
        where: { userId: user.id },
        orderBy: { date: "asc" },
    });

    const today = getLocalDateString(new Date());
    
    // Build dateMap from logs
    const dateMap = new Map();
    allLogs.forEach((log) => {
        const dateKey = dateToLocalDateString(log.date);
        if (!dateMap.has(dateKey)) {
            dateMap.set(dateKey, []);
        }
        dateMap.get(dateKey).push(log);
    });

    const sortedDates = Array.from(dateMap.keys()).sort();

    // Calculate current streak (check from yesterday backwards)
    let currentStreak = 0;
    const yesterdayObj = new Date();
    yesterdayObj.setDate(yesterdayObj.getDate() - 1);
    const yesterday = getLocalDateString(yesterdayObj);
    
    let checkDateObj = new Date();
    checkDateObj.setDate(checkDateObj.getDate() - 1);
    
    while (true) {
        const checkDateStr = getLocalDateString(checkDateObj);
        const logsForDate = dateMap.get(checkDateStr) || [];
        const completedForDate = logsForDate.filter((log) => log.done).length;

        if (completedForDate === habits.length && habits.length > 0) {
            currentStreak++;
            checkDateObj.setDate(checkDateObj.getDate() - 1);
        } else {
            break;
        }

        if (currentStreak > 365) break; // Safety
    }

    // Calculate best streak
    let bestStreak = 0;
    let tempStreak = 0;

    sortedDates.forEach((dateKey) => {
        const logsForDate = dateMap.get(dateKey);
        const completedCount = logsForDate.filter((log) => log.done).length;

        if (completedCount === habits.length && habits.length > 0) {
            tempStreak++;
            bestStreak = Math.max(bestStreak, tempStreak);
        } else {
            tempStreak = 0;
        }
    });

    // Calculate total completed days
    const completedDays = sortedDates.filter((dateKey) => {
        const logsForDate = dateMap.get(dateKey);
        const completedCount = logsForDate.filter((log) => log.done).length;
        return completedCount === habits.length && habits.length > 0;
    }).length;

    // Generate calendar data (last 90 days)
    const calendarData = [];
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 89); // 90 days ago

    for (let i = 0; i < 90; i++) {
        const date = new Date(startDate);
        date.setDate(date.getDate() + i);
        const dateKey = getLocalDateString(date);

        const logsForDate = dateMap.get(dateKey) || [];
        const completedCount = logsForDate.filter((log) => log.done).length;
        const isComplete = completedCount === habits.length && habits.length > 0;

        calendarData.push({
            date: dateKey,
            completed: isComplete,
            habitCount: completedCount,
            totalHabits: habits.length,
        });
    }

    // Calculate milestones
    const milestones = [
        { days: 7, unlocked: bestStreak >= 7, icon: "🥉", title: "7 Days" },
        { days: 30, unlocked: bestStreak >= 30, icon: "🥈", title: "30 Days" },
        { days: 100, unlocked: bestStreak >= 100, icon: "🥇", title: "100 Days" },
        { days: 365, unlocked: bestStreak >= 365, icon: "💎", title: "365 Days" },
    ];

    return Response.json(
        {
            currentStreak,
            bestStreak,
            totalCompletedDays: completedDays,
            calendarData,
            milestones,
        },
        { status: 200 }
    );
}
