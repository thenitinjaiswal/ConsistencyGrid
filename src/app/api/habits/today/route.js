import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";

function getTodayDateOnly() {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  // Calculate date range (Today - 7 days)
  const now = new Date();
  const pastDate = new Date();
  pastDate.setDate(now.getDate() - 7);

  // Create UTC start/end for query to matching DB storage
  const startQueryDate = new Date(Date.UTC(pastDate.getFullYear(), pastDate.getMonth(), pastDate.getDate()));

  const logs = await prisma.habitLog.findMany({
    where: {
      userId: user.id,
      date: {
        gte: startQueryDate
      }
    },
  });

  const habits = await prisma.habit.findMany({
    where: { userId: user.id, isActive: true },
    orderBy: { createdAt: "asc" },
  });

  const todayHabits = habits.map((h) => {
    // Filter logs for this specific habit
    const habitLogs = logs.filter(l => l.habitId === h.id);

    // Check if done TODAY
    const todayLog = habitLogs.find(l => {
      const lDate = new Date(l.date).toISOString().split('T')[0];
      const tDate = new Date().toISOString().split('T')[0];
      return lDate === tDate;
    });

    return {
      id: h.id,
      title: h.title,
      scheduledTime: h.scheduledTime, // Include scheduledTime
      done: todayLog ? todayLog.done : false,
      logs: habitLogs, // Return all logs for history
      isActive: h.isActive
    };
  });

  const completed = todayHabits.filter((h) => h.done).length;

  return Response.json(
    {
      total: todayHabits.length,
      completed,
      habits: todayHabits,
    },
    { status: 200 }
  );
}
