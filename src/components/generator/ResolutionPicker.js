"use client";

import { useState } from "react";

const PRESETS = [
    { label: "Samsung S24 / Pixel 8", w: 1080, h: 2340 },
    { label: "iPhone 15 Pro Max", w: 1290, h: 2796 },
    { label: "iPhone 14/15", w: 1170, h: 2532 },
    { label: "Standard HD", w: 1080, h: 1920 },
];

export default function ResolutionPicker({ width, height, onChange }) {
    const [custom, setCustom] = useState(false);

    function handlePreset(e) {
        const val = e.target.value;
        if (val === "custom") {
            setCustom(true);
        } else {
            setCustom(false);
            const [w, h] = val.split("x").map(Number);
            onChange("width", w);
            onChange("height", h);
        }
    }

    const activePreset = PRESETS.find((p) => p.w === width && p.h === height);

    return (
        <div className="space-y-3">
            <label className="text-sm font-bold text-gray-900">Wallpaper Size</label>

            <select
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-orange-500 bg-white"
                onChange={handlePreset}
                value={custom ? "custom" : activePreset ? `${activePreset.w}x${activePreset.h}` : "custom"}
            >
                {PRESETS.map((p) => (
                    <option key={p.label} value={`${p.w}x${p.h}`}>
                        {p.label} ({p.w}×{p.h})
                    </option>
                ))}
                <option value="custom">Custom Resolution...</option>
            </select>

            {custom && (
                <div className="grid grid-cols-2 gap-3 animate-in fade-in slide-in-from-top-1">
                    <div>
                        <label className="text-xs text-gray-500">Width</label>
                        <input
                            type="number"
                            value={width}
                            onChange={(e) => onChange("width", Number(e.target.value))}
                            className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                        />
                    </div>
                    <div>
                        <label className="text-xs text-gray-500">Height</label>
                        <input
                            type="number"
                            value={height}
                            onChange={(e) => onChange("height", Number(e.target.value))}
                            className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
