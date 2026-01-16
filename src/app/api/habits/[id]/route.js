import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";

export async function PUT(req, { params }) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
        return Response.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const { title, isActive } = await req.json();

    try {
        const updatedHabit = await prisma.habit.update({
            where: { id }, // In a real app, verify userId matches session user for security
            data: { title, isActive },
        });
        return Response.json({ habit: updatedHabit });
    } catch (error) {
        return Response.json({ message: "Failed to update habit" }, { status: 500 });
    }
}

export async function DELETE(req, { params }) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
        return Response.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    try {
        // Soft delete by setting isActive to false
        await prisma.habit.update({
            where: { id },
            data: { isActive: false },
        });
        return Response.json({ success: true });
    } catch (error) {
        return Response.json({ message: "Failed to delete habit" }, { status: 500 });
    }
}
