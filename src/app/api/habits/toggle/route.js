import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";

function getTodayDateOnly() {
  const now = new Date();
  return new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()));
}

export async function POST(req) {
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

  // Determine target date (default to today)
  let targetDate;
  if (date) {
    // Parse provided date string (YYYY-MM-DD)
    const [year, month, day] = date.split('-').map(Number);
    // Create UTC date at midnight
    targetDate = new Date(Date.UTC(year, month - 1, day));
  } else {
    targetDate = getTodayDateOnly();
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

  return Response.json({ log: newLog }, { status: 201 });
}
