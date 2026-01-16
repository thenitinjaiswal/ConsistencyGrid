import Card from "@/components/ui/Card";
import Link from "next/link";

export default function QuickTips() {
  return (
    <Card className="p-5">
      <h2 className="text-sm font-bold text-gray-900">Quick Tips</h2>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="rounded-xl bg-gray-50 p-4">
          <p className="text-sm font-semibold text-gray-800">
            Set up MacroDroid
          </p>
          <p className="mt-1 text-xs text-gray-500">
            Automatically update wallpaper daily at midnight for a fresh start.
          </p>
          <Link
            href="/help/macrodroid"
            className="mt-2 inline-block text-xs font-semibold text-orange-600 hover:underline"
          >
            Learn how →
          </Link>
        </div>

        <div className="rounded-xl bg-gray-50 p-4">
          <p className="text-sm font-semibold text-gray-800">
            Add a Goal Challenge
          </p>
          <p className="mt-1 text-xs text-gray-500">
            Start a 30-day challenge and track progress on your wallpaper.
          </p>
          <Link
            href="/goals"
            className="mt-2 inline-block text-xs font-semibold text-orange-600 hover:underline"
          >
            Create goal →
          </Link>
        </div>
      </div>
    </Card>
  );
}
