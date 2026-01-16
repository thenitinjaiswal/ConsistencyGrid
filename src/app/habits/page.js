import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

import DashboardLayout from "@/components/layout/DashboardLayout";
import HabitHeader from "@/components/habits/HabitHeader";
import TodayProgressCard from "@/components/habits/TodayProgressCard";
import HabitCard from "@/components/habits/HabitCard";

export default async function HabitsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) redirect("/login");

  return (
    <DashboardLayout active="Habits">
      <div className="mx-auto max-w-6xl space-y-6">
        {/* Header */}
        <HabitHeader />

        {/* Today Progress */}
        <TodayProgressCard />

        {/* Habit List */}
        <HabitCard />
      </div>
    </DashboardLayout>
  );
}
