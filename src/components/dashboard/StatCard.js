import Card from "@/components/ui/Card";
import Skeleton from "@/components/ui/Skeleton";

export default function StatCard({ title, value, sub, loading = false }) {
  return (
    <Card className="p-4 transition-all hover:shadow-md">
      <p className="text-xs font-semibold text-gray-500">{title}</p>
      {loading ? (
        <Skeleton variant="title" className="mt-1 w-20" />
      ) : (
        <h2 className="mt-1 text-2xl font-bold text-gray-900">{value}</h2>
      )}
      {sub && (
        <p className="mt-1 text-xs text-gray-400">{loading ? <Skeleton variant="text" className="w-16" /> : sub}</p>
      )}
    </Card>
  );
}
