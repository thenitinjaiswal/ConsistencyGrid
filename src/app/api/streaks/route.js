import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/authOptions";
import prisma from "@/lib/prisma";
import { getStreakData } from "@/lib/dashboard-cache";

/**
 * GET /api/streaks
 * 
 * Fetch streak data (current and best streaks) and raw data for heatmap visualization
 * 
 * PERFORMANCE:
 * - Uses server-side caching for read operations
 * - First request: Database query + cache for 60 seconds
 * - Subsequent requests within 60s: Returns cached data
 * - After 60s: Automatic revalidation on next request
 * 
 * Heavy computation offloaded to cached function:
 * - Current streak calculation from logs
 * - Best streak calculation across all time
 */
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

    try {
        // Get cached streak data
        const streaks = await getStreakData(user.id);
        
        // Get raw data for heatmap visualization
        const habits = await prisma.habit.findMany({
            where: { userId: user.id, isActive: true },
            select: {
                id: true,
                title: true,
                scheduledTime: true,
                isActive: true,
                createdAt: true,
            },
        });

        // Get all logs with proper date handling
        const logs = await prisma.habitLog.findMany({
            where: { userId: user.id },
            select: {
                id: true,
                habitId: true,
                date: true,
                done: true,
                createdAt: true,
            },
            orderBy: { date: 'asc' },
        });

        // Ensure dates are properly formatted for frontend
        const formattedLogs = logs.map(log => ({
            ...log,
            date: log.date instanceof Date ? log.date.toISOString() : log.date,
        }));

        const milestones = await prisma.milestone.findMany({
            where: { userId: user.id },
            orderBy: { date: 'asc' },
        });

        return Response.json({
            currentStreak: streaks.currentStreak || 0,
            bestStreak: streaks.bestStreak || 0,
            totalCompletedDays: formattedLogs.filter(l => l.done).length || 0,
            habits: habits || [],
            logs: formattedLogs || [],
            milestones: (milestones || []).map(m => ({
                title: m.title,
                days: m.age || 0,
                unlocked: m.age <= (streaks.currentStreak || 0),
            })),
        });
    } catch (error) {
        console.error("Error fetching streaks:", error);
        return Response.json(
            { message: "Internal Server Error", error: error.message },
            { status: 500 }
        );
    }
}
