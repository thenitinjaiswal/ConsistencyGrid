import Card from "@/components/ui/Card";

export default function TodayProgressCard() {
  // dummy habits
  const habits = [
    { title: "mornings", done: false },
    { title: "gym", done: false },
    { title: "sad", done: false },
  ];

  const doneCount = habits.filter((h) => h.done).length;

  return (
    <Card className="p-5 border-2 border-orange-100 shadow-lg shadow-orange-50/50">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-sm font-bold text-gray-900">Today's Momentum</h2>
          <p className="text-xs text-orange-600 font-medium">
            {doneCount}/{habits.length} habits kept
          </p>
        </div>
        <button className="px-3 py-1 bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold rounded-lg transition-colors shadow-sm">
          Mark Today
        </button>
      </div>

      <div className="space-y-3">
        {habits.map((h, i) => (
          <div
            key={i}
            className="flex items-center justify-between rounded-xl bg-orange-50/30 border border-orange-100/50 px-4 py-3"
          >
            <div className="flex items-center gap-2">
              <span
                className={`h-2.5 w-2.5 rounded-full ring-2 ring-white ${h.done ? "bg-green-500" : "bg-gray-200"
                  }`}
              />
              <p className="text-sm font-bold text-gray-800">{h.title}</p>
            </div>

            <span className={`text-[10px] uppercase tracking-wider font-bold ${h.done ? "text-green-600" : "text-gray-400"}`}>
              {h.done ? "Kept" : "Due"}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
}
