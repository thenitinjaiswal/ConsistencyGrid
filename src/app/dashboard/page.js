import DashboardLayout from "@/components/layout/DashboardLayout";
import TopHeader from "@/components/dashboard/TopHeader";
import StatsRow from "@/components/dashboard/StatsRow";
import WallpaperCard from "@/components/dashboard/WallpaperCard";
import TodayProgressCard from "@/components/dashboard/TodayProgressCard";
import QuickTips from "@/components/dashboard/QuickTips";
import UpcomingReminders from "@/components/dashboard/UpcomingReminders";
import WeeklyStatsCard from "@/components/dashboard/WeeklyStatsCard";
import GoalsProgressCard from "@/components/dashboard/GoalsProgressCard";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/authOptions";
import { redirect } from "next/navigation";

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

  return (
    <DashboardLayout active="Dashboard">
      <TopHeader />
      
      {/* Stats Row - 4 columns */}
      <StatsRow />

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
