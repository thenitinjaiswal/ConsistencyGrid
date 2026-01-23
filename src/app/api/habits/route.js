import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/authOptions";
import prisma from "@/lib/prisma";

/**
 * GET /api/habits
 * Fetch all habits for authenticated user with their logs
 */
export async function GET(req) {
    try {
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

        // Fetch habits with logs
        const habits = await prisma.habit.findMany({
            where: { userId: user.id, isActive: true },
            include: { logs: true },
            orderBy: { createdAt: "asc" },
        });

        return Response.json(habits);
    } catch (error) {
        console.error("Error fetching habits:", error);
        return Response.json({ message: "Internal Server Error", error: error.message }, { status: 500 });
    }
}

/**
 * POST /api/habits
 * Create a new habit for authenticated user
 */
export async function POST(req) {
    try {
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

        const body = await req.json();
        const { title, scheduledTime } = body;

        if (!title || String(title).trim().length === 0) {
            return Response.json({ message: "Habit title is required" }, { status: 400 });
        }

        if (String(title).length > 100) {
            return Response.json({ message: "Habit title must be less than 100 characters" }, { status: 400 });
        }

        // Validate scheduled time if provided
        if (scheduledTime && !/^([0-1]\d|2[0-3]):[0-5]\d$/.test(scheduledTime)) {
            return Response.json({ message: "Invalid time format (HH:MM)" }, { status: 400 });
        }

        const habit = await prisma.habit.create({
            data: {
                title: String(title).trim(),
                scheduledTime: scheduledTime || null,
                userId: user.id,
            },
            include: { logs: true },
        });

        return Response.json(habit, { status: 201 });
    } catch (error) {
        console.error("Error creating habit:", error);
        return Response.json({ message: "Internal Server Error", error: error.message }, { status: 500 });
    }
}

/**
 * PUT /api/habits?id=habitId
 * Update a habit
 */
export async function PUT(req) {
    try {
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

        const { searchParams } = new URL(req.url);
        const habitId = searchParams.get("id");

        if (!habitId) {
            return Response.json({ message: "Habit ID is required" }, { status: 400 });
        }

        const body = await req.json();
        const { title, scheduledTime, isActive } = body;

        // Verify habit belongs to user
        const habit = await prisma.habit.findUnique({
            where: { id: habitId },
        });

        if (!habit || habit.userId !== user.id) {
            return Response.json({ message: "Habit not found" }, { status: 404 });
        }

        const updated = await prisma.habit.update({
            where: { id: habitId },
            data: {
                ...(title && { title: String(title).trim() }),
                ...(scheduledTime && { scheduledTime }),
                ...(isActive !== undefined && { isActive }),
            },
            include: { logs: true },
        });

        return Response.json(updated);
    } catch (error) {
        console.error("Error updating habit:", error);
        return Response.json({ message: "Internal Server Error", error: error.message }, { status: 500 });
    }
}

/**
 * DELETE /api/habits?id=habitId
 * Delete a habit
 */
export async function DELETE(req) {
    try {
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

        const { searchParams } = new URL(req.url);
        const habitId = searchParams.get("id");

        if (!habitId) {
            return Response.json({ message: "Habit ID is required" }, { status: 400 });
        }

        // Verify habit belongs to user
        const habit = await prisma.habit.findUnique({
            where: { id: habitId },
        });

        if (!habit || habit.userId !== user.id) {
            return Response.json({ message: "Habit not found" }, { status: 404 });
        }

        await prisma.habit.delete({
            where: { id: habitId },
        });

        return Response.json({ message: "Habit deleted successfully" });
    } catch (error) {
        console.error("Error deleting habit:", error);
        return Response.json({ message: "Internal Server Error", error: error.message }, { status: 500 });
    }
}
