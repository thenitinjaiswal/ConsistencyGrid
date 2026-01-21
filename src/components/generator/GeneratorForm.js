"use client";

import { useState } from "react";
import ThemeSelector from "./ThemeSelector";
import ToggleRow from "./ToggleRow";
import ResolutionPicker from "./ResolutionPicker";
import GoalSettings from "./GoalSettings";
import GridModeSelector from "./GridModeSelector";

export default function GeneratorForm({ form, setForm, onSave }) {
    const [saving, setSaving] = useState(false);

    function handleChange(e) {
        const { name, value, type, checked } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    }

    function handleThemeChange(themeId) {
        setForm((prev) => ({ ...prev, theme: themeId }));
    }

    function handleSizeChange(dimension, value) {
        setForm((prev) => ({ ...prev, [dimension]: value }));
    }

    async function handleSaveClick() {
        setSaving(true);
        await onSave();
        setSaving(false);
    }

    // Calculate life progress
    const lived = Math.floor(
        (new Date() - new Date(form.dob || "2000-01-01")) / (1000 * 60 * 60 * 24 * 7)
    );
    const total = (form.lifeExpectancyYears || 80) * 52;
    const progress = Math.min(100, Math.max(0, (lived / total) * 100)).toFixed(1);
    const remaining = total - lived;

    return (
        <div className="space-y-4 pb-20">
            {/* 1. Basic Info */}
            <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                <h2 className="mb-4 text-sm font-bold text-gray-900">
                    Basic Information
                </h2>

                <div className="space-y-4">
                    <div>
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                            Date of Birth
                        </label>
                        <input
                            type="date"
                            name="dob"
                            value={form.dob}
                            onChange={handleChange}
                            className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-orange-500 bg-gray-50 focus:bg-white transition-all"
                        />
                    </div>

                    <div>
                        <div className="flex justify-between text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                            <span>Life Expectancy</span>
                            <span>{form.lifeExpectancyYears} years</span>
                        </div>
                        <input
                            type="range"
                            min="50"
                            max="100"
                            name="lifeExpectancyYears"
                            value={form.lifeExpectancyYears}
                            onChange={handleChange}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-orange-500"
                        />
                    </div>

                    {/* Progress Bar */}
                    <div>
                        <div className="flex justify-between text-xs mb-1">
                            <span className="font-medium text-gray-600">Life Progress</span>
                            <span className="font-bold text-orange-600">{progress}%</span>
                        </div>
                        <div className="h-3 w-full rounded-full bg-gray-100 overflow-hidden">
                            <div
                                className="h-full bg-orange-500 rounded-full"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-3 gap-2 pt-2">
                        <div className="bg-gray-50 rounded-xl p-3 text-center">
                            <div className="text-lg font-bold text-gray-900">{lived.toLocaleString()}</div>
                            <div className="text-[10px] text-gray-500 uppercase font-semibold">Weeks Lived</div>
                        </div>
                        <div className="bg-gray-50 rounded-xl p-3 text-center">
                            <div className="text-lg font-bold text-gray-900">{total.toLocaleString()}</div>
                            <div className="text-[10px] text-gray-500 uppercase font-semibold">Total Weeks</div>
                        </div>
                        <div className="bg-orange-50 rounded-xl p-3 text-center">
                            <div className="text-lg font-bold text-orange-600">{remaining.toLocaleString()}</div>
                            <div className="text-[10px] text-orange-600/70 uppercase font-semibold">Remaining</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 2. Theme */}
            <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                <ThemeSelector activeTheme={form.theme} onChange={handleThemeChange} />
            </div>

            {/* Advanced Settings Progressive Disclosure */}
            <details className="group space-y-4">
                <summary className="list-none cursor-pointer py-4 flex items-center justify-between text-sm font-bold text-gray-800 hover:text-orange-600 transition-colors">
                    <span>Advanced Settings</span>
                    <span className="text-xs text-gray-400 font-normal group-open:rotate-180 transition-transform">↓</span>
                </summary>

                <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
                    {/* 3. Resolution */}
                    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                        <ResolutionPicker
                            width={form.width}
                            height={form.height}
                            onChange={handleSizeChange}
                        />
                    </div>

                    {/* 4. Layout Toggles */}
                    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm space-y-6">
                        <h2 className="text-sm font-bold text-gray-900">Layout Options</h2>

                        {/* Grid Mode Selector */}
                        <GridModeSelector
                            mode={form.yearGridMode || "weeks"}
                            onChange={(val) => setForm(prev => ({ ...prev, yearGridMode: val }))}
                        />

                        {/* Wallpaper Type */}
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-900">Wallpaper Type</label>
                            <select
                                name="wallpaperType"
                                value={form.wallpaperType || "lockscreen"}
                                onChange={handleChange}
                                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-orange-500 bg-white"
                            >
                                <option value="lockscreen">Lock Screen (Life Grid)</option>
                                <option value="homescreen">Home Screen (Minimal)</option>
                                <option value="calendar">Monthly Calendar</option>
                            </select>
                        </div>

                        <div className="divide-y divide-gray-50 pt-2">
                            <ToggleRow
                                label="Show Progress Bar"
                                subLabel="Life journey percentage at top"
                                name="showAgeStats"
                                checked={form.showAgeStats}
                                onChange={handleChange}
                            />
                            <ToggleRow
                                label="Show Missed Days"
                                subLabel="Red dotted outline for skipped habits"
                                name="showMissedDays"
                                checked={form.showMissedDays}
                                onChange={handleChange}
                            />
                            <ToggleRow
                                label="Show Life Grid"
                                name="showLifeGrid"
                                checked={form.showLifeGrid}
                                onChange={handleChange}
                            />
                            <ToggleRow
                                label="Show Year Grid"
                                name="showYearGrid"
                                checked={form.showYearGrid}
                                onChange={handleChange}
                            />
                            <ToggleRow
                                label="Show Age Stats"
                                name="showAgeDetail" // Renamed from showAgeStats to avoid conflict if needed, or keep same
                                checked={form.showAgeStats} // Reuse existing for now or add new field
                                onChange={handleChange}
                            />
                            <ToggleRow
                                label="Show Quote"
                                name="showQuote"
                                checked={form.showQuote}
                                onChange={handleChange}
                            />
                            <ToggleRow
                                label="Show Goal Layer"
                                name="goalEnabled"
                                checked={form.goalEnabled}
                                onChange={handleChange}
                            />
                            <ToggleRow
                                label="Show Habit Layer"
                                name="showHabitLayer"
                                checked={form.showHabitLayer}
                                onChange={handleChange}
                            />
                            <ToggleRow
                                label="Show Legend"
                                name="showLegend"
                                checked={form.showLegend}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    {/* 5. Goal */}
                    <GoalSettings />

                    {/* 6. Quote Input */}
                    {form.showQuote && (
                        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm animate-in fade-in slide-in-from-top-2">
                            <label className="text-sm font-bold text-gray-900 block mb-2">Quote</label>
                            <input
                                type="text"
                                name="quote"
                                value={form.quote}
                                onChange={handleChange}
                                placeholder="Make every week count."
                                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-orange-500 bg-gray-50 focus:bg-white transition-all"
                            />
                        </div>
                    )}

                </div>
            </details>

            {/* Sticky Save Bar */}
            <div className="fixed bottom-0 left-0 lg:left-[240px] right-0 p-4 bg-white/80 backdrop-blur-md border-t border-gray-200 z-30">
                <div className="w-full max-w-6xl mx-auto flex items-center justify-between">
                    <p className="text-xs text-gray-500 font-medium italic hidden sm:block">
                        “This is what you’ll see every time you unlock your phone.”
                    </p>
                    <button
                        onClick={handleSaveClick}
                        disabled={saving}
                        className="bg-gray-900 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:bg-black transition-all flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {saving ? (
                            <>Saving...</>
                        ) : (
                            <>Save Changes</>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
