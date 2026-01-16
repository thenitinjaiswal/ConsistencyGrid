import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";

export async function POST(req) {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
        return Response.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { title } = await req.json();

    if (!title || title.trim().length < 2) {
        return Response.json(
            { message: "Habit title required (min 2 characters)" },
            { status: 400 }
        );
    }

    const dbUser = await prisma.user.findUnique({
        where: { email: session.user.email },
    });

    if (!dbUser) {
        return Response.json({ message: "User not found" }, { status: 404 });
    }

    const habit = await prisma.habit.create({
        data: {
            title: title.trim(),
            userId: dbUser.id,
        },
    });

    return Response.json({ habit }, { status: 201 });
}

export async function GET() {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
        return Response.json({ message: "Unauthorized" }, { status: 401 });
    }

    const dbUser = await prisma.user.findUnique({
        where: { email: session.user.email },
    });

    if (!dbUser) {
        return Response.json({ message: "User not found" }, { status: 404 });
    }

    const habits = await prisma.habit.findMany({
        where: { userId: dbUser.id, isActive: true },
        orderBy: { createdAt: "asc" },
    });

    return Response.json({ habits }, { status: 200 });
}
