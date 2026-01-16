"use client";

import ToggleRow from "./ToggleRow";

export default function GoalSettings({ form, handleChange }) {
    return (
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <ToggleRow
                label="Show Goal Layer"
                subLabel="Track a specific goal on your grid"
                name="goalEnabled"
                checked={form.goalEnabled}
                onChange={handleChange}
            />

            {form.goalEnabled && (
                <div className="mt-4 space-y-4 border-t border-gray-100 pt-4 animate-in fade-in slide-in-from-top-2">
                    <div>
                        <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            Goal Title
                        </label>
                        <input
                            type="text"
                            name="goalTitle"
                            value={form.goalTitle}
                            onChange={handleChange}
                            placeholder="e.g. Learn Next.js"
                            className="mt-1 w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm outline-none focus:border-orange-500 focus:bg-white transition-all"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                Start Date
                            </label>
                            <input
                                type="date"
                                name="goalStartDate"
                                value={form.goalStartDate}
                                onChange={handleChange}
                                className="mt-1 w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm outline-none focus:border-orange-500 focus:bg-white transition-all"
                            />
                        </div>

                        <div>
                            <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                Duration
                            </label>
                            <div className="flex gap-2">
                                <input
                                    type="number"
                                    name="goalDurationDays"
                                    value={form.goalDurationDays}
                                    onChange={handleChange}
                                    placeholder="30"
                                    className="mt-1 w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm outline-none focus:border-orange-500 focus:bg-white transition-all"
                                />
                                <select
                                    name="goalUnit"
                                    value={form.goalUnit}
                                    onChange={handleChange}
                                    className="mt-1 rounded-lg border border-gray-200 bg-gray-50 px-2 py-2.5 text-sm outline-none focus:border-orange-500 focus:bg-white transition-all"
                                >
                                    <option value="day">Days</option>
                                    <option value="week">Weeks</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
