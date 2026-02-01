"use client";

import { useState } from "react";
import { AlertCircle, CheckCircle2, ExternalLink } from "lucide-react";
import ThemeSelector from "./ThemeSelector";
import ToggleRow from "./ToggleRow";
import ResolutionPicker from "./ResolutionPicker";
import GoalSettings from "./GoalSettings";
import GridModeSelector from "./GridModeSelector";

/**
 * GeneratorForm Component - Enhanced Version
 * 
 * Comprehensive wallpaper generator form with the following features:
 * ✨ Responsive design (mobile-first)
 * ✨ Real-time preview updates
 * ✨ Advanced settings with collapsible sections
 * ✨ Life progress visualization
 * ✨ Form validation and error handling
 * ✨ Save status feedback
 * ✨ Organized code structure with clear comments
 * 
 * @param {Object} form - Form state object
 * @param {Function} setForm - State setter for form
 * @param {Function} onSave - Callback function when saving
 * @param {string} publicToken - Public token for sharing wallpaper
 */
export default function GeneratorForm({ form, setForm, onSave, publicToken }) {
    // ============================================================================
    // STATE MANAGEMENT
    // ============================================================================
    
    const [saving, setSaving] = useState(false);
    const [saveStatus, setSaveStatus] = useState(null); // 'success' or 'error'

    // ============================================================================
    // EVENT HANDLERS
    // ============================================================================

    /**
     * Handle input changes for text, number, and checkbox inputs
     * Automatically detects input type and updates state accordingly
     */
    function handleChange(e) {
        const { name, value, type, checked } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    }

    /**
     * Handle theme selection from ThemeSelector component
     */
    function handleThemeChange(themeId) {
        setForm((prev) => ({ ...prev, theme: themeId }));
    }

    /**
     * Handle resolution/size changes from ResolutionPicker
     */
    function handleSizeChange(dimension, value) {
        setForm((prev) => ({ ...prev, [dimension]: value }));
    }

    /**
     * Handle save button click with:
     * - Loading state management
     * - Error handling
     * - Success/failure feedback
     * - Auto-dismiss after 3 seconds
     */
    async function handleSaveClick() {
        if (!isDobValid) return; // Prevent save if DOB is invalid
        
        setSaving(true);
        setSaveStatus(null);
        try {
            await onSave();
            setSaveStatus('success');
            setTimeout(() => setSaveStatus(null), 3000);
        } catch (error) {
            console.error('Save error:', error);
            setSaveStatus('error');
            setTimeout(() => setSaveStatus(null), 3000);
        } finally {
            setSaving(false);
        }
    }

    // ============================================================================
    // CALCULATIONS & DERIVED DATA
    // ============================================================================

    /**
     * Calculate life progress metrics
     * - weeks lived: from DOB to today
     * - total weeks: based on life expectancy
     * - progress percentage: visual indicator
     * - remaining weeks: time left
     */
    const lived = Math.floor(
        (new Date() - new Date(form.dob || "2000-01-01")) / (1000 * 60 * 60 * 24 * 7)
    );
    const total = (form.lifeExpectancyYears || 80) * 52;
    const progress = Math.min(100, Math.max(0, (lived / total) * 100)).toFixed(1);
    const remaining = total - lived;

    // Validation: DOB must be set before saving
    const isDobValid = form.dob && form.dob.length > 0;

    // ============================================================================
    // RENDER
    // ============================================================================

    return (
        <div className="space-y-3 sm:space-y-4 pb-6 sm:pb-12 md:pb-8">
            
            {/* ╔═══════════════════════════════════════════════════════════════════════════╗ */}
            {/* ║ SECTION 1: BASIC INFORMATION                                              ║ */}
            {/* ║ - Date of Birth input with validation                                     ║ */}
            {/* ║ - Life Expectancy slider with visual feedback                             ║ */}
            {/* ║ - Life Progress bar with percentage                                       ║ */}
            {/* ║ - Stats grid showing weeks lived, total, remaining                        ║ */}
            {/* ╚═══════════════════════════════════════════════════════════════════════════╝ */}
            <div className="rounded-2xl border border-gray-100 bg-white p-4 sm:p-5 shadow-sm hover:shadow-md transition-shadow">
                <h2 className="mb-4 text-sm font-bold text-gray-900 flex items-center gap-2">
                    <span className="text-lg">📅</span>
                    Basic Information
                </h2>

                <div className="space-y-4">
                    {/* Date of Birth Input */}
                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            Date of Birth
                        </label>
                        <input
                            type="date"
                            name="dob"
                            value={form.dob}
                            onChange={handleChange}
                            className="w-full rounded-xl border border-gray-200 px-3 sm:px-4 py-2.5 sm:py-3 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 bg-gray-50 focus:bg-white transition-all"
                        />
                        {isDobValid && (
                            <p className="text-xs text-green-600 flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3" /> Valid date entered
                            </p>
                        )}
                    </div>

                    {/* Life Expectancy Slider */}
                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                Life Expectancy
                            </label>
                            <span className="text-sm font-bold text-orange-600 bg-orange-50 px-3 py-1 rounded-full">
                                {form.lifeExpectancyYears} years
                            </span>
                        </div>
                        <input
                            type="range"
                            min="50"
                            max="100"
                            name="lifeExpectancyYears"
                            value={form.lifeExpectancyYears}
                            onChange={handleChange}
                            className="w-full h-2 bg-gray-200 rounded-full appearance-none cursor-pointer accent-orange-500"
                        />
                        <div className="flex justify-between text-xs text-gray-500">
                            <span>50 years</span>
                            <span>100 years</span>
                        </div>
                    </div>

                    {/* Life Progress Bar */}
                    <div className="space-y-2 pt-2 border-t border-gray-100">
                        <div className="flex justify-between items-center">
                            <span className="text-sm font-semibold text-gray-700">Life Progress</span>
                            <span className="text-lg font-bold text-orange-600">{progress}%</span>
                        </div>
                        <div className="h-3 w-full rounded-full bg-gray-200 overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-orange-400 to-orange-600 rounded-full transition-all duration-500"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                    </div>

                    {/* Life Stats Grid - Responsive */}
                    <div className="grid grid-cols-3 gap-2 sm:gap-3 pt-4">
                        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-3 sm:p-4 text-center hover:shadow-md transition-shadow">
                            <div className="text-lg sm:text-xl font-bold text-gray-900">
                                {lived.toLocaleString()}
                            </div>
                            <div className="text-[10px] sm:text-xs text-gray-500 uppercase font-semibold mt-1">
                                Weeks Lived
                            </div>
                        </div>
                        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-3 sm:p-4 text-center hover:shadow-md transition-shadow">
                            <div className="text-lg sm:text-xl font-bold text-blue-600">
                                {total.toLocaleString()}
                            </div>
                            <div className="text-[10px] sm:text-xs text-blue-600/70 uppercase font-semibold mt-1">
                                Total Weeks
                            </div>
                        </div>
                        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-3 sm:p-4 text-center hover:shadow-md transition-shadow">
                            <div className="text-lg sm:text-xl font-bold text-orange-600">
                                {remaining.toLocaleString()}
                            </div>
                            <div className="text-[10px] sm:text-xs text-orange-600/70 uppercase font-semibold mt-1">
                                Remaining
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ╔═══════════════════════════════════════════════════════════════════════════╗ */}
            {/* ║ SECTION 2: THEME SELECTION                                                ║ */}
            {/* ║ - Visual theme selector with color previews                               ║ */}
            {/* ║ - 6 theme options with live preview                                       ║ */}
            {/* ╚═══════════════════════════════════════════════════════════════════════════╝ */}
            <div className="rounded-2xl border border-gray-100 bg-white p-4 sm:p-5 shadow-sm hover:shadow-md transition-shadow">
                <h2 className="mb-4 text-sm font-bold text-gray-900 flex items-center gap-2">
                    <span className="text-lg">🎨</span>
                    Visual Theme
                </h2>
                <ThemeSelector activeTheme={form.theme} onChange={handleThemeChange} />
            </div>

            {/* ╔═══════════════════════════════════════════════════════════════════════════╗ */}
            {/* ║ SECTION 3: ADVANCED SETTINGS - Collapsible Details Element                ║ */}
            {/* ║ - Progressively disclose advanced options                                 ║ */}
            {/* ║ - Smooth animations when expanded                                         ║ */}
            {/* ║ - Organized subsections                                                   ║ */}
            {/* ╚═══════════════════════════════════════════════════════════════════════════╝ */}
            <details className="group space-y-4">
                <summary className="list-none cursor-pointer py-3 sm:py-4 flex items-center justify-between text-sm font-bold text-gray-800 hover:text-orange-600 transition-colors bg-gradient-to-r from-orange-50/50 to-transparent rounded-xl px-4 hover:from-orange-100/50">
                    <span className="flex items-center gap-2">
                        <span className="text-lg">⚙️</span>
                        Advanced Settings
                    </span>
                    <span className="text-xs text-gray-400 font-normal group-open:rotate-180 transition-transform duration-300">↓</span>
                </summary>

                <div className="space-y-3 sm:space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                    
                    {/* ─────────────────────────────────────────────────────────────────── */}
                    {/* SUBSECTION 3.1: Resolution Settings                                 */}
                    {/* ─────────────────────────────────────────────────────────────────── */}
                    <div className="rounded-2xl border border-gray-100 bg-white p-4 sm:p-5 shadow-sm hover:shadow-md transition-shadow">
                        <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <span>📱</span>
                            Resolution Settings
                        </h3>
                        <ResolutionPicker
                            width={form.width}
                            height={form.height}
                            onChange={handleSizeChange}
                        />
                        <p className="text-xs text-gray-500 mt-3 p-2 bg-blue-50 rounded-lg">
                            💡 Tip: Choose a preset matching your device for best results
                        </p>
                    </div>

                    {/* ─────────────────────────────────────────────────────────────────── */}
                    {/* SUBSECTION 3.2: Layout & Display Options                            */}
                    {/* ─────────────────────────────────────────────────────────────────── */}
                    <div className="rounded-2xl border border-gray-100 bg-white p-4 sm:p-5 shadow-sm hover:shadow-md transition-shadow space-y-6">
                        <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                            <span>📐</span>
                            Layout Options
                        </h3>

                        {/* Grid Mode Selector */}
                        <div>
                            <GridModeSelector
                                mode={form.yearGridMode || "weeks"}
                                onChange={(val) => setForm(prev => ({ ...prev, yearGridMode: val }))}
                            />
                        </div>

                        {/* Wallpaper Type Selector */}
                        <div className="space-y-2 pb-4 border-b border-gray-100">
                            <label className="text-sm font-bold text-gray-900">Wallpaper Type</label>
                            <select
                                name="wallpaperType"
                                value={form.wallpaperType || "lockscreen"}
                                onChange={handleChange}
                                className="w-full rounded-xl border border-gray-200 px-3 sm:px-4 py-2.5 sm:py-3 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 bg-white transition-all"
                            >
                                <option value="lockscreen">🔒 Lock Screen (Life Grid)</option>
                                <option value="homescreen">🏠 Home Screen (Minimal)</option>
                                <option value="calendar">📅 Monthly Calendar</option>
                            </select>
                        </div>

                        {/* Display Toggles - Organized with Categories */}
                        <div className="space-y-1">
                            <h4 className="text-xs font-bold text-gray-600 uppercase tracking-wider px-2 mb-3">
                                Display Elements
                            </h4>
                            <div className="divide-y divide-gray-100">
                                <ToggleRow
                                    label="Show Progress Bar"
                                    subLabel="Life journey percentage at top"
                                    name="showAgeStats"
                                    checked={form.showAgeStats}
                                    onChange={handleChange}
                                />
                                <ToggleRow
                                    label="Show Life Grid"
                                    subLabel="Weeks visualization of your life"
                                    name="showLifeGrid"
                                    checked={form.showLifeGrid}
                                    onChange={handleChange}
                                />
                                <ToggleRow
                                    label="Show Year Grid"
                                    subLabel="Current year breakdown"
                                    name="showYearGrid"
                                    checked={form.showYearGrid}
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
                                    label="Show Quote"
                                    subLabel="Display custom motivational text"
                                    name="showQuote"
                                    checked={form.showQuote}
                                    onChange={handleChange}
                                />
                                <ToggleRow
                                    label="Show Habit Layer"
                                    subLabel="Overlay your habit tracking"
                                    name="showHabitLayer"
                                    checked={form.showHabitLayer}
                                    onChange={handleChange}
                                />
                                <ToggleRow
                                    label="Show Goal Progress"
                                    subLabel="Display active goal tracking"
                                    name="goalEnabled"
                                    checked={form.goalEnabled}
                                    onChange={handleChange}
                                />
                                <ToggleRow
                                    label="Show Legend"
                                    subLabel="Display color meaning guide"
                                    name="showLegend"
                                    checked={form.showLegend}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                    </div>

                    {/* ─────────────────────────────────────────────────────────────────── */}
                    {/* SUBSECTION 3.3: Goals & Milestones                                  */}
                    {/* ─────────────────────────────────────────────────────────────────── */}
                    <div className="rounded-2xl border border-gray-100 bg-white p-4 sm:p-5 shadow-sm hover:shadow-md transition-shadow">
                        <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <span>🎯</span>
                            Goals & Milestones
                        </h3>
                        <GoalSettings />
                    </div>

                    {/* ─────────────────────────────────────────────────────────────────── */}
                    {/* SUBSECTION 3.4: Custom Quote (Conditional)                          */}
                    {/* ─────────────────────────────────────────────────────────────────── */}
                    {form.showQuote && (
                        <div className="rounded-2xl border border-gray-100 bg-white p-4 sm:p-5 shadow-sm hover:shadow-md transition-shadow animate-in fade-in slide-in-from-top-2 duration-300">
                            <label className="text-sm font-bold text-gray-900 block mb-3 flex items-center gap-2">
                                <span>✨</span>
                                Custom Quote
                            </label>
                            <input
                                type="text"
                                name="quote"
                                value={form.quote}
                                onChange={handleChange}
                                placeholder="Make every week count."
                                maxLength={100}
                                className="w-full rounded-xl border border-gray-200 px-3 sm:px-4 py-2.5 sm:py-3 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 bg-gray-50 focus:bg-white transition-all"
                            />
                            <p className="text-xs text-gray-500 mt-2">
                                {form.quote.length}/100 characters
                            </p>
                        </div>
                    )}
                </div>
            </details>

            {/* ╔═══════════════════════════════════════════════════════════════════════════╗ */}
            {/* ║ SAVE SECTION - Below Advanced Settings                                   ║ */}
            {/* ║ - Save button with public link option                                    ║ */}
            {/* ║ - Real-time save status feedback                                          ║ */}
            {/* ║ - Data persistence confirmation                                           ║ */}
            {/* ╚═══════════════════════════════════════════════════════════════════════════╝ */}
            <div className="mt-8 sm:mt-10 space-y-4">
                {/* Status Message */}
                {saveStatus && (
                    <div className={`text-xs sm:text-sm font-semibold py-3 sm:py-4 px-4 sm:px-5 rounded-xl sm:rounded-2xl flex items-center gap-2 transition-all animate-in fade-in ${
                        saveStatus === 'success' 
                            ? 'bg-gradient-to-r from-green-100 to-green-50 text-green-700 border border-green-200' 
                            : 'bg-gradient-to-r from-red-100 to-red-50 text-red-700 border border-red-200'
                    }`}>
                        {saveStatus === 'success' ? (
                            <>
                                <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0" />
                                <span>✓ Settings saved successfully!</span>
                            </>
                        ) : (
                            <>
                                <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0" />
                                <span>✕ Save failed. Please try again.</span>
                            </>
                        )}
                    </div>
                )}

                {/* Action Buttons Container */}
                <div className="flex flex-col xs:flex-row gap-3 sm:gap-4">
                    {/* Public Link Button */}
                    {publicToken && (
                        <a
                            href={`/w/${publicToken}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            title="Open your public wallpaper link in a new tab"
                            className="
                                w-full xs:w-auto
                                px-4 sm:px-6 md:px-8
                                py-3 sm:py-3.5 md:py-4
                                rounded-xl sm:rounded-2xl
                                font-semibold text-sm sm:text-base
                                flex items-center justify-center gap-2 xs:gap-2.5
                                transition-all duration-300 ease-out
                                bg-gradient-to-r from-blue-100 to-blue-50
                                text-blue-700
                                hover:from-blue-200 hover:to-blue-100
                                hover:shadow-lg
                                border border-blue-200
                                active:scale-95
                                focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-2
                            "
                        >
                            <ExternalLink className="w-5 h-5 sm:w-5 sm:h-5" />
                            <span>Open Public Link</span>
                        </a>
                    )}

                    {/* Save Button */}
                    <button
                        onClick={handleSaveClick}
                        disabled={saving || !isDobValid}
                        title={!isDobValid ? "❌ Please enter a valid date of birth first" : "✅ Save your wallpaper settings"}
                        aria-label={saving ? "Saving changes..." : isDobValid ? "Save changes" : "Please enter date of birth"}
                        aria-disabled={saving || !isDobValid}
                        className={`
                            w-full xs:flex-1
                            px-4 sm:px-6 md:px-8
                            py-3 sm:py-3.5 md:py-4
                            rounded-xl sm:rounded-2xl
                            font-semibold text-sm sm:text-base
                            flex items-center justify-center gap-2 xs:gap-2.5
                            transition-all duration-300 ease-out
                            shadow-md hover:shadow-lg
                            active:scale-95 active:shadow-sm
                            focus:outline-none focus:ring-2 focus:ring-offset-2
                            ${isDobValid && !saving 
                                ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700 cursor-pointer focus:ring-orange-300' 
                                : 'bg-gray-200 text-gray-500 cursor-not-allowed opacity-60 focus:ring-gray-300'
                            }
                        `}
                    >
                        {saving ? (
                            <>
                                <span className="inline-flex animate-spin text-lg">⏳</span>
                                <span>Saving...</span>
                            </>
                        ) : isDobValid ? (
                            <>
                                <span className="text-lg">💾</span>
                                <span>Save Changes</span>
                            </>
                        ) : (
                            <>
                                <span className="text-lg">⚠️</span>
                                <span>Enter Date of Birth</span>
                            </>
                        )}
                    </button>
                </div>

                {/* Helper Text */}
                <p className="text-xs sm:text-sm text-gray-500 text-center italic pt-2">
                    💡 Your changes are auto-saved to your profile
                </p>
            </div>

        </div>
    );
}
