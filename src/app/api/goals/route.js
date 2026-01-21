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
    });

    if (!user) {
        return Response.json({ message: "User not found" }, { status: 404 });
    }

    try {
        const goals = await prisma.goal.findMany({
            where: { userId: user.id },
            include: {
                subGoals: {
                    orderBy: { createdAt: 'asc' }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        return Response.json(goals);
    } catch (error) {
        console.error("Error fetching goals:", error);
        return Response.json({ message: "Internal Server Error" }, { status: 500 });
    }
}

export async function POST(req) {
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
        const { title, category, targetDeadline, description, age, subGoals } = body;

        if (!title) {
            return Response.json({ message: "Title is required" }, { status: 400 });
        }

        if (!subGoals || subGoals.length === 0) {
            return Response.json({ message: "At least one sub-goal is required" }, { status: 400 });
        }

        const goal = await prisma.goal.create({
            data: {
                userId: user.id,
                title,
                category: category || "General",
                description: description || "",
                targetDeadline: targetDeadline ? new Date(targetDeadline) : null,
                age: age || null,
                progress: 0,
                subGoals: {
                    create: subGoals.map(sg => ({
                        title: sg.title,
                        isCompleted: sg.isCompleted || false
                    }))
                }
            },
            include: {
                subGoals: {
                    orderBy: { createdAt: 'asc' }
                }
            }
        });

        return Response.json(goal, { status: 201 });
    } catch (error) {
        console.error("Error creating goal:", error);
        return Response.json({ message: "Internal Server Error" }, { status: 500 });
    }
}

export async function DELETE(req) {
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
        const { searchParams } = new URL(req.url);
        const goalId = searchParams.get("id");

        if (!goalId) {
            return Response.json({ message: "Goal ID is required" }, { status: 400 });
        }

        // Verify the goal belongs to the user
        const goal = await prisma.goal.findUnique({
            where: { id: goalId },
        });

        if (!goal || goal.userId !== user.id) {
            return Response.json({ message: "Goal not found or unauthorized" }, { status: 404 });
        }

        // Delete sub-goals first
        await prisma.subGoal.deleteMany({
            where: { goalId: goalId },
        });

        // Delete the goal
        await prisma.goal.delete({
            where: { id: goalId },
        });

        return Response.json({ message: "Goal deleted successfully" }, { status: 200 });
    } catch (error) {
        console.error("Error deleting goal:", error);
        return Response.json({ message: "Internal Server Error" }, { status: 500 });
    }
}

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
        const { searchParams } = new URL(req.url);
        const goalId = searchParams.get("id");

        if (!goalId) {
            return Response.json({ message: "Goal ID is required" }, { status: 400 });
        }

        const body = await req.json();
        const { title, category, targetDeadline, description, age, subGoals } = body;

        // Verify the goal belongs to the user
        const goal = await prisma.goal.findUnique({
            where: { id: goalId },
        });

        if (!goal || goal.userId !== user.id) {
            return Response.json({ message: "Goal not found or unauthorized" }, { status: 404 });
        }

        // Update the goal
        const updatedGoal = await prisma.goal.update({
            where: { id: goalId },
            data: {
                title: title || goal.title,
                category: category || goal.category,
                description: description !== undefined ? description : goal.description,
                targetDeadline: targetDeadline ? new Date(targetDeadline) : goal.targetDeadline,
                age: age !== undefined ? age : goal.age,
            },
            include: {
                subGoals: {
                    orderBy: { createdAt: 'asc' }
                }
            }
        });

        // Handle sub-goals updates if provided
        if (subGoals && Array.isArray(subGoals)) {
            // Get existing sub-goals
            const existingSubGoals = await prisma.subGoal.findMany({
                where: { goalId: goalId }
            });

            const existingIds = new Set(existingSubGoals.map(sg => sg.id));
            const newIds = new Set(subGoals.filter(sg => !sg.id.startsWith('new-')).map(sg => sg.id));

            // Delete sub-goals that are no longer in the list
            const toDelete = existingSubGoals.filter(sg => !newIds.has(sg.id)).map(sg => sg.id);
            if (toDelete.length > 0) {
                await prisma.subGoal.deleteMany({
                    where: { id: { in: toDelete } }
                });
            }

            // Create or update sub-goals
            for (const sg of subGoals) {
                if (sg.id.startsWith('new-')) {
                    // Create new sub-goal
                    await prisma.subGoal.create({
                        data: {
                            title: sg.title,
                            isCompleted: sg.isCompleted || false,
                            goalId: goalId
                        }
                    });
                } else if (existingIds.has(sg.id)) {
                    // Update existing sub-goal
                    await prisma.subGoal.update({
                        where: { id: sg.id },
                        data: {
                            title: sg.title,
                            isCompleted: sg.isCompleted || false
                        }
                    });
                }
            }

            // Recalculate progress
            const completedSubGoals = subGoals.filter(sg => sg.isCompleted).length;
            const progress = subGoals.length > 0 ? Math.round((completedSubGoals / subGoals.length) * 100) : 0;

            // Update goal progress
            await prisma.goal.update({
                where: { id: goalId },
                data: { progress }
            });
        }

        // Fetch updated goal with sub-goals
        const finalGoal = await prisma.goal.findUnique({
            where: { id: goalId },
            include: {
                subGoals: {
                    orderBy: { createdAt: 'asc' }
                }
            }
        });

        return Response.json(finalGoal, { status: 200 });
    } catch (error) {
        console.error("Error updating goal:", error);
        return Response.json({ message: "Internal Server Error" }, { status: 500 });
    }
}
