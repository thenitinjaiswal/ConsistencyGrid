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
    <Card className="p-5">
      <h2 className="text-sm font-bold text-gray-900">Today's Progress</h2>
      <p className="mt-1 text-xs text-gray-500">
        {doneCount}/{habits.length} habits completed
      </p>

      <div className="mt-4 space-y-3">
        {habits.map((h, i) => (
          <div
            key={i}
            className="flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3"
          >
            <div className="flex items-center gap-2">
              <span
                className={`h-2 w-2 rounded-full ${
                  h.done ? "bg-green-500" : "bg-gray-300"
                }`}
              />
              <p className="text-sm font-medium text-gray-800">{h.title}</p>
            </div>

            <span className="text-xs text-gray-400">
              {h.done ? "Done" : "Pending"}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
}
