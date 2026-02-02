import DashboardLayout from "@/components/layout/DashboardLayout";
import TopHeader from "@/components/dashboard/TopHeader";
import StatsRow from "@/components/dashboard/StatsRow";
import WallpaperCard from "@/components/dashboard/WallpaperCard";
import TodayProgressCard from "@/components/dashboard/TodayProgressCard";
import QuickTips from "@/components/dashboard/QuickTips";
import UpcomingReminders from "@/components/dashboard/UpcomingReminders";
import WeeklyStatsCard from "@/components/dashboard/WeeklyStatsCard";
import GoalsProgressCard from "@/components/dashboard/GoalsProgressCard";
import UpgradeBanner from "@/components/payment/UpgradeBanner";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/authOptions";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import AndroidOAuthRedirect from "@/components/auth/AndroidOAuthRedirect";

export const metadata = {
  title: "Dashboard - Consistency Grid",
  description: "View your life calendar wallpaper, track habits, and monitor your progress.",
};

export default async function DashboardPage() {
  // Check if user has completed onboarding
  const session = await getServerSession(authOptions);

  if (!session?.user?.onboarded) {
    redirect("/onboarding");
  }

  // Fetch user plan
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { plan: true }
  });

  const isFreeUser = !user || user.plan === "free" || !user.plan;

  return (
    <DashboardLayout active="Dashboard">
      <AndroidOAuthRedirect />
      <TopHeader />

      {/* Stats Row - 4 columns */}
      <StatsRow />

      {/* Upgrade Banner for Free Users */}
      {isFreeUser && (
        <div className="mt-6">
          <UpgradeBanner variant="compact" showFeatures={false} />
        </div>
      )}

      {/* Main Content Grid: Wallpaper (left) + Today's Progress (right) */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <WallpaperCard />
        </div>
        <div>
          <TodayProgressCard />
        </div>
      </div>

      {/* Additional Sections */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <WeeklyStatsCard />
        <GoalsProgressCard />
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <UpcomingReminders />
        <QuickTips />
      </div>
    </DashboardLayout>
  );
}
