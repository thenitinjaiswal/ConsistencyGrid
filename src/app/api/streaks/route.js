import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";

function getTodayDateOnly() {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

function getDateOnly(date) {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
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

    const today = getTodayDateOnly();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    // Calculate current streak
    let currentStreak = 0;
    let checkDate = new Date(yesterday);

    while (true) {
        const logsForDate = allLogs.filter(
            (log) => getDateOnly(new Date(log.date)).getTime() === checkDate.getTime()
        );

        const completedForDate = logsForDate.filter((log) => log.done).length;

        if (completedForDate === habits.length && habits.length > 0) {
            currentStreak++;
            checkDate.setDate(checkDate.getDate() - 1);
        } else {
            break;
        }

        if (currentStreak > 365) break; // Safety
    }

    // Calculate best streak
    let bestStreak = 0;
    let tempStreak = 0;
    const dateMap = new Map();

    allLogs.forEach((log) => {
        const dateKey = getDateOnly(new Date(log.date)).toISOString().split("T")[0];
        if (!dateMap.has(dateKey)) {
            dateMap.set(dateKey, []);
        }
        dateMap.get(dateKey).push(log);
    });

    const sortedDates = Array.from(dateMap.keys()).sort();

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
    const startDate = new Date(today);
    startDate.setDate(startDate.getDate() - 89); // 90 days ago

    for (let i = 0; i < 90; i++) {
        const date = new Date(startDate);
        date.setDate(date.getDate() + i);
        const dateKey = getDateOnly(date).toISOString().split("T")[0];

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
