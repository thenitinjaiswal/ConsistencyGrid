"use client";

const THEMES = [
    { id: "minimal-dark", name: "Minimal Dark", colors: ["#000000", "#ffffff", "#333333"] },
    { id: "sunset-orange", name: "Sunset Orange", colors: ["#000000", "#ff7a00", "#333333"] },
    { id: "ocean-blue", name: "Ocean Blue", colors: ["#000000", "#0088ff", "#333333"] },
    { id: "forest-green", name: "Forest Green", colors: ["#000000", "#00cc66", "#333333"] },
    { id: "purple-haze", name: "Purple Haze", colors: ["#000000", "#a855f7", "#333333"] },
    { id: "monochrome", name: "Monochrome", colors: ["#ffffff", "#000000", "#e5e5e5"] },
];

export default function ThemeSelector({ activeTheme, onChange }) {
    return (
        <div className="space-y-3">
            <label className="text-sm font-bold text-gray-900">Theme</label>
            <div className="grid grid-cols-2 gap-3">
                {THEMES.map((theme) => (
                    <button
                        key={theme.id}
                        onClick={() => onChange(theme.id)}
                        className={`group relative flex items-center gap-3 rounded-xl border p-3 text-left transition-all hover:border-orange-200 hover:bg-orange-50 ${activeTheme === theme.id
                            ? "border-orange-500 bg-orange-50 ring-1 ring-orange-500"
                            : "border-gray-200 bg-white"
                            }`}
                    >
                        <div className="flex -space-x-1">
                            <div
                                className="h-6 w-6 rounded-full border border-gray-700 shadow-sm"
                                style={{ backgroundColor: theme.colors[0] }}
                            />
                            <div
                                className="h-6 w-6 rounded-full border border-gray-700 shadow-sm"
                                style={{ backgroundColor: theme.colors[1] }}
                            />
                            <div
                                className="h-6 w-6 rounded-full border border-gray-700 shadow-sm"
                                style={{ backgroundColor: theme.colors[2] }}
                            />
                        </div>
                        <span
                            className={`text-sm font-medium ${activeTheme === theme.id ? "text-orange-700" : "text-gray-700"
                                }`}
                        >
                            {theme.name}
                        </span>
                    </button>
                ))}
            </div>
        </div>
    );
}
