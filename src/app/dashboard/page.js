import DashboardLayout from "@/components/layout/DashboardLayout";
import TopHeader from "@/components/dashboard/TopHeader";
import StatsRow from "@/components/dashboard/StatsRow";
import WallpaperCard from "@/components/dashboard/WallpaperCard";
import TodayProgressCard from "@/components/dashboard/TodayProgressCard";
import QuickTips from "@/components/dashboard/QuickTips";
import UpcomingReminders from "@/components/dashboard/UpcomingReminders";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Dashboard",
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
      <StatsRow />

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Big wallpaper card */}
        <div className="lg:col-span-2">
          <WallpaperCard />
        </div>

        {/* Today progress */}
        <TodayProgressCard />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Upcoming Reminders */}
        <UpcomingReminders />

        {/* Quick Tips */}
        <QuickTips />
      </div>
    </DashboardLayout>
  );
}
