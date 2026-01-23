/**
 * ============================================================================
 * CACHE INVALIDATION INTEGRATION EXAMPLES
 * ============================================================================
 * 
 * Copy-paste ready examples showing how to add cache invalidation
 * to your mutation endpoints (POST, PUT, DELETE)
 * 
 * Pattern: Always call invalidation AFTER data modification,
 * BEFORE returning response.
 * 
 * ============================================================================
 */

// ============================================================================
// EXAMPLE 1: CREATE HABIT
// ============================================================================

// FILE: src/app/api/habits/route.js

/*
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/authOptions";
import prisma from "@/lib/prisma";
import { invalidateHabitsCache } from "@/lib/cache-invalidation";

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

        // ... validation ...

        // CREATE HABIT
        const habit = await prisma.habit.create({
            data: {
                title: String(title).trim(),
                scheduledTime: scheduledTime || null,
                userId: user.id,
            },
            include: { logs: true },
        });

        // ✅ INVALIDATE CACHE - CRITICAL!
        await invalidateHabitsCache(user.id);

        return Response.json(habit, { status: 201 });
    } catch (error) {
        console.error("Error creating habit:", error);
        return Response.json(
            { message: "Internal Server Error", error: error.message },
            { status: 500 }
        );
    }
}
*/

// ============================================================================
// EXAMPLE 2: UPDATE HABIT
// ============================================================================

// FILE: src/app/api/habits/[id]/route.js

/*
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/authOptions";
import prisma from "@/lib/prisma";
import { invalidateHabitsCache } from "@/lib/cache-invalidation";

export async function PUT(req, { params }) {
    const { id } = params;
    
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
        const { title, isActive } = body;

        // UPDATE HABIT
        const updated = await prisma.habit.update({
            where: { id },
            data: {
                title: title ? String(title).trim() : undefined,
                isActive: isActive !== undefined ? isActive : undefined,
            },
            include: { logs: true },
        });

        // ✅ INVALIDATE CACHE - CRITICAL!
        await invalidateHabitsCache(user.id);

        return Response.json(updated);
    } catch (error) {
        console.error("Error updating habit:", error);
        return Response.json(
            { message: "Internal Server Error" },
            { status: 500 }
        );
    }
}
*/

// ============================================================================
// EXAMPLE 3: DELETE HABIT
// ============================================================================

// FILE: src/app/api/habits/[id]/route.js

/*
export async function DELETE(req, { params }) {
    const { id } = params;
    
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

        // DELETE HABIT
        await prisma.habit.delete({
            where: { id },
        });

        // ✅ INVALIDATE CACHE - CRITICAL!
        await invalidateHabitsCache(user.id);

        return Response.json({ success: true });
    } catch (error) {
        console.error("Error deleting habit:", error);
        return Response.json(
            { message: "Internal Server Error" },
            { status: 500 }
        );
    }
}
*/

// ============================================================================
// EXAMPLE 4: CREATE GOAL (with sub-goals)
// ============================================================================

// FILE: src/app/api/goals/route.js

/*
import { invalidateGoalsCache } from "@/lib/cache-invalidation";

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
        const { title, category, targetDeadline, subGoals } = body;

        // CREATE GOAL
        const goal = await prisma.goal.create({
            data: {
                userId: user.id,
                title,
                category: category || "General",
                targetDeadline: targetDeadline ? new Date(targetDeadline) : null,
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

        // ✅ INVALIDATE CACHE - CRITICAL!
        await invalidateGoalsCache(user.id);

        return Response.json(goal, { status: 201 });
    } catch (error) {
        console.error("Error creating goal:", error);
        return Response.json(
            { message: "Internal Server Error" },
            { status: 500 }
        );
    }
}
*/

// ============================================================================
// EXAMPLE 5: COMPLETE SUB-GOAL (marks sub-goal as done)
// ============================================================================

// FILE: src/app/api/subgoals/[id]/route.js

/*
import { invalidateGoalsCache } from "@/lib/cache-invalidation";

export async function PUT(req, { params }) {
    const { id } = params;
    
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
        const { isCompleted } = body;

        // UPDATE SUB-GOAL
        const updated = await prisma.subGoal.update({
            where: { id },
            data: { isCompleted },
        });

        // ✅ INVALIDATE CACHE - CRITICAL!
        await invalidateGoalsCache(user.id);

        return Response.json(updated);
    } catch (error) {
        console.error("Error updating sub-goal:", error);
        return Response.json(
            { message: "Internal Server Error" },
            { status: 500 }
        );
    }
}
*/

// ============================================================================
// EXAMPLE 6: LOG HABIT COMPLETION
// ============================================================================

// FILE: src/app/api/habits/[id]/logs/route.js

/*
import { invalidateHabitsCache } from "@/lib/cache-invalidation";

export async function POST(req, { params }) {
    const { id } = params;
    
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
        const { date, done } = body;

        // CREATE HABIT LOG
        const log = await prisma.habitLog.create({
            data: {
                habitId: id,
                userId: user.id,
                date: new Date(date),
                done,
            },
        });

        // ✅ INVALIDATE CACHE - CRITICAL!
        // Habit logs affect streaks, so invalidate habits cache
        await invalidateHabitsCache(user.id);

        return Response.json(log, { status: 201 });
    } catch (error) {
        console.error("Error creating habit log:", error);
        return Response.json(
            { message: "Internal Server Error" },
            { status: 500 }
        );
    }
}
*/

// ============================================================================
// EXAMPLE 7: SAVE WALLPAPER SETTINGS
// ============================================================================

// FILE: src/app/api/settings/save/route.js

/*
import { invalidateSettingsCache } from "@/lib/cache-invalidation";

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

        // UPDATE WALLPAPER SETTINGS
        const settings = await prisma.wallpaperSettings.upsert({
            where: { userId: user.id },
            update: body,
            create: {
                userId: user.id,
                ...body,
            },
        });

        // ✅ INVALIDATE CACHE - CRITICAL!
        await invalidateSettingsCache(user.id);

        return Response.json(settings);
    } catch (error) {
        console.error("Error saving settings:", error);
        return Response.json(
            { message: "Internal Server Error" },
            { status: 500 }
        );
    }
}
*/

// ============================================================================
// EXAMPLE 8: CREATE REMINDER
// ============================================================================

// FILE: src/app/api/reminders/route.js

/*
import { invalidateDashboardCache } from "@/lib/cache-invalidation";

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

        // CREATE REMINDER
        const reminder = await prisma.reminder.create({
            data: {
                userId: user.id,
                ...body,
            },
        });

        // ✅ INVALIDATE CACHE
        // Use full invalidation since reminders affect multiple APIs
        await invalidateDashboardCache(user.id);

        return Response.json(reminder, { status: 201 });
    } catch (error) {
        console.error("Error creating reminder:", error);
        return Response.json(
            { message: "Internal Server Error" },
            { status: 500 }
        );
    }
}
*/

// ============================================================================
// BEST PRACTICES
// ============================================================================

/**
 * ✅ DO:
 * 
 * 1. Always call invalidation AFTER successful data modification
 * 2. Call it BEFORE returning response
 * 3. Use specific invalidation (invalidateHabitsCache vs invalidateAllCaches)
 * 4. Import from "@/lib/cache-invalidation"
 * 5. Handle errors gracefully (cache invalidation failure shouldn't break request)
 * 
 * ❌ DON'T:
 * 
 * 1. Call invalidation BEFORE data modification
 * 2. Call invalidation if data modification fails
 * 3. Always use invalidateAllCaches - be specific
 * 4. Forget to await the invalidation call
 * 5. Return error response after invalidation (return early!)
 */

// ============================================================================
// QUICK REFERENCE: WHICH INVALIDATION TO USE?
// ============================================================================

/**
 * Habit mutations → invalidateHabitsCache(userId)
 * Goal mutations → invalidateGoalsCache(userId)
 * Settings mutations → invalidateSettingsCache(userId)
 * User profile → invalidateSettingsCache(userId)
 * Reminders/Milestones → invalidateDashboardCache(userId)
 * 
 * Unsure? → invalidateDashboardCache(userId)
 * Multiple endpoints? → invalidateAllCaches(userId)
 * 
 * Performance Impact:
 * - invalidateHabitsCache: ~1ms
 * - invalidateGoalsCache: ~1ms
 * - invalidateSettingsCache: ~1ms
 * - invalidateDashboardCache: ~2ms
 * - invalidateAllCaches: ~3ms
 */

// ============================================================================
// ERROR HANDLING PATTERN
// ============================================================================

/**
 * Recommended error handling:
 * 
 * try {
 *     // Modify data
 *     const created = await prisma.model.create({ ... });
 *     
 *     // Invalidate cache (non-critical)
 *     try {
 *         await invalidateHabitsCache(user.id);
 *     } catch (error) {
 *         console.error("Cache invalidation failed:", error);
 *         // Don't throw - cache will auto-invalidate in 60s
 *     }
 *     
 *     // Return success
 *     return Response.json(created, { status: 201 });
 * } catch (error) {
 *     console.error("Error:", error);
 *     return Response.json({ message: "Internal Server Error" }, { status: 500 });
 * }
 */

export {};
