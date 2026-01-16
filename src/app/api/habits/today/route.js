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

  const today = getTodayDateOnly();

  const habits = await prisma.habit.findMany({
    where: { userId: user.id, isActive: true },
    orderBy: { createdAt: "asc" },
  });

  const logs = await prisma.habitLog.findMany({
    where: { userId: user.id, date: today },
  });

  const logMap = new Map(logs.map((l) => [l.habitId, l.done]));

  const todayHabits = habits.map((h) => ({
    id: h.id,
    title: h.title,
    done: logMap.get(h.id) || false,
  }));

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
