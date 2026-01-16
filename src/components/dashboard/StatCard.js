import Card from "@/components/ui/Card";

export default function StatCard({ title, value, sub }) {
  return (
    <Card className="p-4">
      <p className="text-xs font-semibold text-gray-500">{title}</p>
      <h2 className="mt-1 text-2xl font-bold text-gray-900">{value}</h2>
      {sub && <p className="mt-1 text-xs text-gray-400">{sub}</p>}
    </Card>
  );
}
