/**
 * API Route: /api/reminders/[id]
 * 
 * Handles individual reminder operations (GET, PATCH, DELETE)
 */

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";

/**
 * GET /api/reminders/[id]
 * Fetch a specific reminder by ID
 */
export async function GET(request, { params }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
        });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const { id } = params;

        const reminder = await prisma.reminder.findFirst({
            where: {
                id,
                userId: user.id,
            },
        });

        if (!reminder) {
            return NextResponse.json({ error: "Reminder not found" }, { status: 404 });
        }

        return NextResponse.json({ reminder });
    } catch (error) {
        console.error("GET /api/reminders/[id] error:", error);
        return NextResponse.json(
            { error: "Failed to fetch reminder" },
            { status: 500 }
        );
    }
}

/**
 * PATCH /api/reminders/[id]
 * Update a specific reminder
 */
export async function PATCH(request, { params }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
        });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const { id } = params;
        const body = await request.json();

        // Verify ownership
        const existing = await prisma.reminder.findFirst({
            where: {
                id,
                userId: user.id,
            },
        });

        if (!existing) {
            return NextResponse.json({ error: "Reminder not found" }, { status: 404 });
        }

        // Build update data
        const updateData = {};

        if (body.title !== undefined) updateData.title = body.title;
        if (body.description !== undefined) updateData.description = body.description;
        if (body.startDate !== undefined) updateData.startDate = new Date(body.startDate);
        if (body.endDate !== undefined) updateData.endDate = new Date(body.endDate);
        if (body.startTime !== undefined) updateData.startTime = body.startTime;
        if (body.endTime !== undefined) updateData.endTime = body.endTime;
        if (body.isFullDay !== undefined) updateData.isFullDay = body.isFullDay;
        if (body.markerType !== undefined) updateData.markerType = body.markerType;
        if (body.markerColor !== undefined) updateData.markerColor = body.markerColor;
        if (body.markerIcon !== undefined) updateData.markerIcon = body.markerIcon;
        if (body.priority !== undefined) updateData.priority = body.priority;
        if (body.isImportant !== undefined) updateData.isImportant = body.isImportant;
        if (body.enableNotifications !== undefined) updateData.enableNotifications = body.enableNotifications;
        if (body.notifyOnStart !== undefined) updateData.notifyOnStart = body.notifyOnStart;
        if (body.notifyDaily !== undefined) updateData.notifyDaily = body.notifyDaily;
        if (body.isRecurring !== undefined) updateData.isRecurring = body.isRecurring;
        if (body.recurrenceRule !== undefined) updateData.recurrenceRule = body.recurrenceRule;
        if (body.isActive !== undefined) updateData.isActive = body.isActive;

        // Update reminder
        const reminder = await prisma.reminder.update({
            where: { id },
            data: updateData,
        });

        return NextResponse.json({ reminder });
    } catch (error) {
        console.error("PATCH /api/reminders/[id] error:", error);
        return NextResponse.json(
            { error: "Failed to update reminder" },
            { status: 500 }
        );
    }
}

/**
 * DELETE /api/reminders/[id]
 * Delete a specific reminder
 */
export async function DELETE(request, { params }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
        });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const { id } = params;

        // Verify ownership
        const existing = await prisma.reminder.findFirst({
            where: {
                id,
                userId: user.id,
            },
        });

        if (!existing) {
            return NextResponse.json({ error: "Reminder not found" }, { status: 404 });
        }

        // Delete reminder
        await prisma.reminder.delete({
            where: { id },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("DELETE /api/reminders/[id] error:", error);
        return NextResponse.json(
            { error: "Failed to delete reminder" },
            { status: 500 }
        );
    }
}
