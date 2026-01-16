import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";

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
        include: { logs: true },
    });

    // Get logs from last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentLogs = await prisma.habitLog.findMany({
        where: {
            userId: user.id,
            date: { gte: thirtyDaysAgo },
        },
        orderBy: { date: "asc" },
    });

    // Calculate completion rate (last 30 days)
    const dateMap = new Map();
    recentLogs.forEach((log) => {
        const dateKey = getDateOnly(new Date(log.date)).toISOString().split("T")[0];
        if (!dateMap.has(dateKey)) {
            dateMap.set(dateKey, { total: 0, completed: 0 });
        }
        const dayData = dateMap.get(dateKey);
        dayData.total++;
        if (log.done) dayData.completed++;
    });

    let totalPossible = 0;
    let totalCompleted = 0;
    dateMap.forEach((dayData) => {
        totalPossible += habits.length;
        totalCompleted += dayData.completed;
    });

    const completionRate =
        totalPossible > 0 ? Math.round((totalCompleted / totalPossible) * 100) : 0;

    // Calculate average per day
    const avgPerDay =
        dateMap.size > 0 ? (totalCompleted / dateMap.size).toFixed(1) : 0;

    // Calculate best day of week
    const dayOfWeekMap = new Map();
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    recentLogs.forEach((log) => {
        if (!log.done) return;
        const dayOfWeek = new Date(log.date).getDay();
        dayOfWeekMap.set(dayOfWeek, (dayOfWeekMap.get(dayOfWeek) || 0) + 1);
    });

    let bestDay = "-";
    let maxCount = 0;
    dayOfWeekMap.forEach((count, day) => {
        if (count > maxCount) {
            maxCount = count;
            bestDay = dayNames[day];
        }
    });

    // Habit performance (individual habits)
    const habitPerformance = habits.map((habit) => {
        const habitLogs = recentLogs.filter((log) => log.habitId === habit.id);
        const completed = habitLogs.filter((log) => log.done).length;
        const total = habitLogs.length;
        const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

        return {
            id: habit.id,
            title: habit.title,
            completed,
            total,
            percentage,
        };
    });

    // Weekly breakdown (last 7 days by day of week)
    const weeklyBreakdown = dayNames.map((dayName, dayIndex) => {
        const logsForDay = recentLogs.filter((log) => {
            return new Date(log.date).getDay() === dayIndex;
        });

        const completed = logsForDay.filter((log) => log.done).length;
        const total = logsForDay.length;
        const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

        return {
            day: dayName,
            percentage,
            completed,
            total,
        };
    });

    // Completion trend (last 30 days)
    const trendData = [];
    for (let i = 29; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateKey = getDateOnly(date).toISOString().split("T")[0];

        const dayData = dateMap.get(dateKey);
        const completed = dayData?.completed || 0;
        const total = habits.length;
        const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

        trendData.push({
            date: dateKey,
            percentage,
            completed,
            total,
        });
    }

    return Response.json(
        {
            completionRate,
            totalHabits: habits.length,
            bestDay,
            avgPerDay: parseFloat(avgPerDay),
            habitPerformance,
            weeklyBreakdown,
            trendData,
        },
        { status: 200 }
    );
}
