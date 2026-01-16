"use client";

export default function GridModeSelector({ mode, onChange }) {
    return (
        <div className="space-y-3">
            <label className="text-sm font-bold text-gray-900">Year Grid Mode</label>
            <div className="grid grid-cols-2 gap-3">
                <button
                    onClick={() => onChange("weeks")}
                    className={`flex items-center gap-3 rounded-xl border p-4 text-left transition-all ${mode === "weeks"
                        ? "border-orange-500 bg-orange-50 ring-1 ring-orange-500"
                        : "border-gray-200 bg-white hover:bg-gray-50"
                        }`}
                >
                    <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${mode === "weeks" ? "bg-orange-100 text-orange-600" : "bg-gray-100 text-gray-500"
                        }`}>
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    </div>
                    <div>
                        <div className={`font-semibold ${mode === "weeks" ? "text-orange-900" : "text-gray-900"}`}>Year Weeks</div>
                        <div className="text-xs text-gray-500">52 weeks grid</div>
                    </div>
                </button>

                <button
                    onClick={() => onChange("days")}
                    className={`flex items-center gap-3 rounded-xl border p-4 text-left transition-all ${mode === "days"
                        ? "border-orange-500 bg-orange-50 ring-1 ring-orange-500"
                        : "border-gray-200 bg-white hover:bg-gray-50"
                        }`}
                >
                    <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${mode === "days" ? "bg-orange-100 text-orange-600" : "bg-gray-100 text-gray-500"
                        }`}>
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
                    </div>
                    <div>
                        <div className={`font-semibold ${mode === "days" ? "text-orange-900" : "text-gray-900"}`}>Year Days</div>
                        <div className="text-xs text-gray-500">365 days grid</div>
                    </div>
                </button>

                <button
                    onClick={() => onChange("life")}
                    className={`flex items-center gap-3 rounded-xl border p-4 text-left transition-all ${mode === "life"
                        ? "border-orange-500 bg-orange-50 ring-1 ring-orange-500"
                        : "border-gray-200 bg-white hover:bg-gray-50"
                        }`}
                >
                    <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${mode === "life" ? "bg-orange-100 text-orange-600" : "bg-gray-100 text-gray-500"
                        }`}>
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    </div>
                    <div>
                        <div className={`font-semibold ${mode === "life" ? "text-orange-900" : "text-gray-900"}`}>Life Grid</div>
                        <div className="text-xs text-gray-500">Weeks lived grid</div>
                    </div>
                </button>

                <button
                    onClick={() => onChange("month")}
                    className={`flex items-center gap-3 rounded-xl border p-4 text-left transition-all ${mode === "month"
                        ? "border-orange-500 bg-orange-50 ring-1 ring-orange-500"
                        : "border-gray-200 bg-white hover:bg-gray-50"
                        }`}
                >
                    <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${mode === "month" ? "bg-orange-100 text-orange-600" : "bg-gray-100 text-gray-500"
                        }`}>
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    </div>
                    <div>
                        <div className={`font-semibold ${mode === "month" ? "text-orange-900" : "text-gray-900"}`}>Month</div>
                        <div className="text-xs text-gray-500">Current month calendar</div>
                    </div>
                </button>
            </div>
        </div>
    );
}
