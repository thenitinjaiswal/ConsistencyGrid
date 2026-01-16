import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";

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

    // Get goal from settings
    const goal = user.settings?.goalEnabled
        ? {
            id: user.settings.id,
            title: user.settings.goalTitle || "My Goal",
            startDate: user.settings.goalStartDate,
            durationDays: user.settings.goalDurationDays || 30,
            unit: user.settings.goalUnit || "day",
            enabled: true,
        }
        : null;

    // Calculate progress if goal exists
    let progress = null;
    if (goal && goal.startDate) {
        const now = new Date();
        const start = new Date(goal.startDate);
        const msPassed = now.getTime() - start.getTime();
        const daysPassed = Math.floor(msPassed / (1000 * 60 * 60 * 24));
        const completed = Math.max(0, Math.min(daysPassed, goal.durationDays));
        const percentage = Math.round((completed / goal.durationDays) * 100);
        const daysRemaining = Math.max(0, goal.durationDays - completed);

        progress = {
            completed,
            total: goal.durationDays,
            percentage,
            daysRemaining,
        };
    }

    return Response.json(
        {
            activeGoals: goal ? 1 : 0,
            completedGoals: 0, // TODO: Track completed goals separately
            currentGoal: goal,
            progress,
        },
        { status: 200 }
    );
}
