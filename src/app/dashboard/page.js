import DashboardLayout from "@/components/layout/DashboardLayout";
import TopHeader from "@/components/dashboard/TopHeader";
import StatsRow from "@/components/dashboard/StatsRow";
import WallpaperCard from "@/components/dashboard/WallpaperCard";
import TodayProgressCard from "@/components/dashboard/TodayProgressCard";
import QuickTips from "@/components/dashboard/QuickTips";

export default async function DashboardPage() {
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

      <div className="mt-6">
        <QuickTips />
      </div>
    </DashboardLayout>
  );
}
