import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/authOptions";
import prisma from "@/lib/prisma";
import { invalidateHabitsCache } from "@/lib/cache-invalidation";

function getLocalDateOnly(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function parseDateString(dateStr) {
  // Parse YYYY-MM-DD and return Date object at midnight in local timezone
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(year, month - 1, day);
}

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return Response.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { habitId, date } = await req.json();

    if (!habitId) {
      return Response.json({ message: "habitId required" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return Response.json({ message: "User not found" }, { status: 404 });
    }

    // Determine target date (default to today)
    let targetDate;
    if (date) {
      // Parse provided date string (YYYY-MM-DD format from frontend)
      targetDate = parseDateString(date);
    } else {
      // Use local date
      const now = new Date();
      targetDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    }

    // ✅ check if log already exists
    const existingLog = await prisma.habitLog.findFirst({
      where: {
        habitId,
        userId: user.id,
        date: targetDate, // Use variable, not 'today'
      },
    });

    if (existingLog) {
      // If it exists, toggle it (or delete it if you prefer un-logging = delete, but toggling 'done' is safer if you track false states)
      // Actually, usually easier to delete the log if unchecked? 
      // The current logic toggles 'done' bool. Let's stick to that for now.
      const updated = await prisma.habitLog.update({
        where: { id: existingLog.id },
        data: { done: !existingLog.done },
      });

      await invalidateHabitsCache(user.id);
      return Response.json({ log: updated }, { status: 200 });
    }

    // ✅ else create new log
    const newLog = await prisma.habitLog.create({
      data: {
        habitId,
        userId: user.id,
        date: targetDate,
        done: true,
      },
    });

    await invalidateHabitsCache(user.id);
    return Response.json({ log: newLog }, { status: 201 });
  } catch (error) {
    console.error("Error toggling habit:", error);
    return Response.json({ message: "Internal Server Error", error: error.message }, { status: 500 });
  }
}
