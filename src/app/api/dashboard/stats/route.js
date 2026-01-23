import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/authOptions";
import prisma from "@/lib/prisma";

function getTodayDateOnly() {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

function getYesterdayDateOnly() {
    const today = getTodayDateOnly();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    return yesterday;
}

export async function GET() {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
        return Response.json({ message: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        include: { settings: true },
    });

    if (!user) {
        return Response.json({ message: "User not found" }, { status: 404 });
    }

    const today = getTodayDateOnly();
    const yesterday = getYesterdayDateOnly();

    // Get all active habits
    const habits = await prisma.habit.findMany({
        where: { userId: user.id, isActive: true },
    });

    // Get all habit logs
    const allLogs = await prisma.habitLog.findMany({
        where: { userId: user.id },
        orderBy: { date: "asc" },
    });

    // Today's progress
    const todayLogs = allLogs.filter(
        (log) => log.date.getTime() === today.getTime()
    );
    const todayCompleted = todayLogs.filter((log) => log.done).length;

    // Calculate current streak
    let currentStreak = 0;
    let checkDate = yesterday;

    while (true) {
        const logsForDate = allLogs.filter(
            (log) => log.date.getTime() === checkDate.getTime()
        );

        const completedForDate = logsForDate.filter((log) => log.done).length;

        // If all habits were completed on this date
        if (completedForDate === habits.length && habits.length > 0) {
            currentStreak++;
            checkDate = new Date(checkDate);
            checkDate.setDate(checkDate.getDate() - 1);
        } else {
            break;
        }

        // Safety check: don't go back more than 365 days
        if (currentStreak > 365) break;
    }

    // Calculate best streak
    let bestStreak = 0;
    let tempStreak = 0;
    const dateMap = new Map();

    // Group logs by date
    allLogs.forEach((log) => {
        const dateKey = log.date.toISOString().split("T")[0];
        if (!dateMap.has(dateKey)) {
            dateMap.set(dateKey, []);
        }
        dateMap.get(dateKey).push(log);
    });

    // Sort dates
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

    // Active goals count
    const activeGoals = user.settings?.goalEnabled ? 1 : 0;

    return Response.json(
        {
            currentStreak,
            bestStreak,
            todayHabitsCompleted: todayCompleted,
            todayHabitsTotal: habits.length,
            activeGoals,
        },
        { status: 200 }
    );
}
