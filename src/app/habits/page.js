import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

import DashboardLayout from "@/components/layout/DashboardLayout";
import HabitHeader from "@/components/habits/HabitHeader";
import TodayProgressCard from "@/components/habits/TodayProgressCard";
import HabitCard from "@/components/habits/HabitCard";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Habits",
  description: "Track your daily habits and build consistency with streak tracking.",
};

import prisma from "@/lib/prisma";

export default async function HabitsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: {
      plan: true,
      _count: {
        select: { habits: true }
      }
    }
  });

  const isFreeUser = !user || user.plan === "free" || !user.plan;
  const habitCount = user?._count?.habits || 0;

  return (
    <DashboardLayout active="Habits">
      <div className="mx-auto max-w-6xl space-y-4 sm:space-y-6 px-3 sm:px-0">
        {/* Header */}
        <HabitHeader isFreeUser={isFreeUser} habitCount={habitCount} />

        {/* Today Progress */}
        <TodayProgressCard />

        {/* Habit List */}
        <HabitCard />
      </div>
    </DashboardLayout>
  );
}
