import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/authOptions";
import prisma from "@/lib/prisma";
import { getDashboardStats } from "@/lib/dashboard-cache";

/**
 * GET /api/dashboard/stats
 * 
 * Fetch dashboard statistics (today's progress and streaks)
 * 
 * PERFORMANCE:
 * - Uses server-side caching via unstable_cache
 * - First request: Fetches from database (cached internally)
 * - Subsequent requests within 60s: Returns cached data
 * - After 60s: Automatic revalidation
 * 
 * Response:
 * {
 *   todayProgress: { todayCompleted, totalHabits, progressPercentage },
 *   streaks: { currentStreak, bestStreak }
 * }
 */
export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.email) {
            return Response.json({ message: "Unauthorized" }, { status: 401 });
        }

        // Get user to retrieve userId
        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
        });

        if (!user) {
            return Response.json({ message: "User not found" }, { status: 404 });
        }

        // Get cached dashboard stats
        const stats = await getDashboardStats(user.id);

        return Response.json(stats, { status: 200 });
    } catch (error) {
        console.error("[Dashboard Stats] Error fetching stats:", error);
        return Response.json(
            { message: "Internal Server Error", error: error.message },
            { status: 500 }
        );
    }
}
