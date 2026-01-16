import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";

function getTodayDateOnly() {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

export async function POST(req) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { habitId } = await req.json();

  if (!habitId) {
    return Response.json({ message: "habitId required" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  const today = getTodayDateOnly();

  // ✅ check if log already exists
  const existingLog = await prisma.habitLog.findFirst({
    where: {
      habitId,
      userId: user.id,
      date: today,
    },
  });

  if (existingLog) {
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
      date: today,
      done: true,
    },
  });

  return Response.json({ log: newLog }, { status: 201 });
}
