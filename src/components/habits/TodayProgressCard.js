"use client";

import { useEffect, useState } from "react";

export default function TodayProgressCard() {
  const [data, setData] = useState({ total: 0, completed: 0 });

  useEffect(() => {
    async function load() {
      const res = await fetch("/api/habits/today");
      const json = await res.json();
      if (res.ok) setData(json);
    }
    load();
  }, []);

  const percent =
    data.total === 0 ? 0 : Math.round((data.completed / data.total) * 100);

  return (
    <div className="rounded-2xl border bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">Today's Progress</p>
          <h2 className="text-3xl font-bold text-gray-900">
            {data.completed}/{data.total}
          </h2>
        </div>

        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-100">
          ✅
        </div>
      </div>

      <div className="mt-4 h-2 w-full rounded-full bg-gray-100">
        <div
          style={{ width: `${percent}%` }}
          className="h-2 rounded-full bg-orange-500"
        />
      </div>
    </div>
  );
}
