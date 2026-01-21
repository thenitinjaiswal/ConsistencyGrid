import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";

export async function PATCH(req) {
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
        const body = await req.json();
        const { goalId, isPinned } = body;

        if (!goalId) {
            return Response.json({ message: "Goal ID is required" }, { status: 400 });
        }

        // Verify the goal belongs to this user
        const goal = await prisma.goal.findFirst({
            where: {
                id: goalId,
                userId: user.id
            }
        });

        if (!goal) {
            return Response.json({ message: "Goal not found" }, { status: 404 });
        }

        // If pinning a goal and it's not a life milestone, unpin other active goals
        if (isPinned && goal.category?.toLowerCase() !== "lifemilestone") {
            await prisma.goal.updateMany({
                where: {
                    userId: user.id,
                    id: { not: goalId },
                    isPinned: true,
                    category: { not: "LifeMilestone" }
                },
                data: { isPinned: false }
            });
        }

        // Update the goal's pin status
        const updatedGoal = await prisma.goal.update({
            where: { id: goalId },
            data: { isPinned: isPinned },
            include: { subGoals: true }
        });

        return Response.json(updatedGoal, { status: 200 });
    } catch (error) {
        console.error("Error updating goal pin status:", error);
        return Response.json({ message: "Internal Server Error" }, { status: 500 });
    }
}
