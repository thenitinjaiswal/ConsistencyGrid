import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/authOptions";
import prisma from "@/lib/prisma";

/**
 * GET /api/generator/data
 * 
 * Fetches all data needed for client-side wallpaper rendering
 * This eliminates the need for server roundtrips on every form change
 * 
 * Returns:
 * - User settings
 * - Active habits with recent logs
 * - Active goals
 * - Active reminders
 * - Activity map (for heatmap rendering)
 */
export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return Response.json({ error: "Unauthorized" }, { status: 401 });
        }

        const userId = session.user.id;

        // Fetch last 60 days of data (enough for rendering)
        const sixtyDaysAgo = new Date();
        sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

        // Parallel data fetching for performance
        const [user, habits, goals, reminders] = await Promise.all([
            // User settings
            prisma.user.findUnique({
                where: { id: userId },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    publicToken: true,
                    plan: true,
                    settings: true
                }
            }),

            // Active habits with recent logs
            prisma.habit.findMany({
                where: {
                    userId,
                    isActive: true
                },
                select: {
                    id: true,
                    title: true,
                    color: true,
                    logs: {
                        where: {
                            date: { gte: sixtyDaysAgo }
                        },
                        select: {
                            date: true,
                            done: true
                        },
                        orderBy: { date: 'desc' }
                    }
                }
            }),

            // Active goals
            prisma.goal.findMany({
                where: {
                    userId,
                    isCompleted: false,
                    category: { not: "LifeMilestone" }
                },
                select: {
                    id: true,
                    title: true,
                    category: true,
                    createdAt: true,
                    isPinned: true
                },
                orderBy: [
                    { isPinned: 'desc' },
                    { createdAt: 'desc' }
                ],
                take: 5
            }),

            // Active reminders
            prisma.reminder.findMany({
                where: {
                    userId,
                    isActive: true
                },
                select: {
                    id: true,
                    title: true,
                    priority: true,
                    startDate: true
                },
                orderBy: [
                    { priority: 'desc' },
                    { startDate: 'asc' }
                ],
                take: 10
            })
        ]);

        if (!user) {
            return Response.json({ error: "User not found" }, { status: 404 });
        }

        // Build activity map from habit logs
        const activityMap = {};
        habits.forEach(habit => {
            habit.logs.forEach(log => {
                if (log.done) {
                    const dayKey = formatDateToDayString(log.date);
                    activityMap[dayKey] = (activityMap[dayKey] || 0) + 1;
                }
            });
        });

        // Calculate growth history (last 7 days)
        const currentDate = new Date();
        const growthHistory = [];
        for (let offset = 6; offset >= 0; offset--) {
            const date = new Date(currentDate);
            date.setDate(date.getDate() - offset);
            growthHistory.push(activityMap[formatDateToDayString(date)] || 0);
        }

        // Today's completion percentage
        const currentDayKey = formatDateToDayString(currentDate);
        const todayCompletionPercentage = habits.length > 0
            ? Math.round(((activityMap[currentDayKey] || 0) / habits.length) * 100)
            : 0;

        // Calculate current streak
        let currentStreak = 0;
        let tempDate = new Date(currentDate);
        const todayLogged = (activityMap[formatDateToDayString(tempDate)] || 0) > 0;

        if (todayLogged) {
            currentStreak++;
        }

        tempDate = new Date(currentDate);
        tempDate.setDate(tempDate.getDate() - 1);

        while ((activityMap[formatDateToDayString(tempDate)] || 0) > 0) {
            currentStreak++;
            tempDate.setDate(tempDate.getDate() - 1);
        }

        return Response.json({
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                publicToken: user.publicToken,
                plan: user.plan
            },
            settings: user.settings || {},
            habits: habits.map(h => ({
                id: h.id,
                title: h.title,
                color: h.color,
                logs: h.logs
            })),
            goals,
            reminders,
            activityMap,
            stats: {
                totalHabits: habits.length,
                growthHistory,
                todayCompletionPercentage,
                currentStreak,
                streakActiveToday: todayLogged
            }
        });

    } catch (error) {
        console.error("Error fetching generator data:", error);
        return Response.json(
            { error: "Failed to fetch data" },
            { status: 500 }
        );
    }
}

// Helper function to format date consistently
function formatDateToDayString(date) {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}
