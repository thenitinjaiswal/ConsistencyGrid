"use client";

export default function ToggleRow({ label, subLabel, checked, onChange, name }) {
    return (
        <div className="flex items-center justify-between py-3">
            <div>
                <div className="font-medium text-gray-900 text-sm">{label}</div>
                {subLabel && <div className="text-xs text-gray-500 mt-0.5">{subLabel}</div>}
            </div>

            <label className="relative inline-flex items-center cursor-pointer">
                <input
                    type="checkbox"
                    className="sr-only peer"
                    name={name}
                    checked={checked}
                    onChange={onChange}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
            </label>
        </div>
    );
}
