"use client";

import { useState, useEffect } from "react";
import Button from "@/components/ui/Button";

export default function GeneratorPreview({ publicToken, loading, form }) {
    const [copied, setCopied] = useState(false);
    const [previewUrl, setPreviewUrl] = useState("");
    const [time, setTime] = useState(new Date());

    // Clock Timer
    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    // Live Preview Debouncer
    useEffect(() => {
        if (!publicToken) return;

        // Set initial URL if empty
        if (!previewUrl) {
            setPreviewUrl(`/w/${publicToken}/image.png?t=${Date.now()}`);
        }

        const timer = setTimeout(() => {
            const params = new URLSearchParams();
            params.set("t", Date.now());

            // Add settings from form (live overrides)
            if (form) {
                Object.entries(form).forEach(([k, v]) => {
                    if (v !== undefined && v !== null && v !== "") {
                        // Only send simple types
                        if (typeof v !== 'object') {
                            params.set(k, v.toString());
                        }
                    }
                });
            }

            setPreviewUrl(`/w/${publicToken}/image.png?${params.toString()}`);
        }, 600);

        return () => {
            clearTimeout(timer);
        };
    }, [form, publicToken]);

    async function handleDownload() {
        if (!publicToken) return;
        // Use current preview URL or base
        const url = previewUrl || `/w/${publicToken}/image.png`;
        const link = document.createElement("a");
        link.href = url;
        link.download = "consistency-grid.png";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    async function handleCopy() {
        if (!publicToken) return;
        const url = `${window.location.origin}/w/${publicToken}/image.png`; // Always copy base URL for sharing
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }

    return (
        <div className="sticky top-6">
            {/* Actions */}
            <div className="mb-4 flex items-center justify-end gap-2">
                <button
                    onClick={() => window.location.reload()}
                    className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-50"
                >
                    ↻ Reset
                </button>
                <button
                    onClick={handleCopy}
                    disabled={!publicToken}
                    className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-50 disabled:opacity-50"
                >
                    {copied ? "✅ Copied" : "📋 Copy URL"}
                </button>
                <Button
                    onClick={handleDownload}
                    disabled={!publicToken}
                    variant="primary"
                    className="py-2 text-xs"
                >
                    ↓ Download
                </Button>
            </div>

            {/* Phone Mockup */}
            <div className="relative mx-auto h-[600px] w-[300px] overflow-hidden rounded-[40px] border-8 border-gray-900 bg-black shadow-2xl">
                {/* Dynamic Island / Notch */}
                <div className="absolute top-0 left-1/2 h-6 w-32 -translate-x-1/2 rounded-b-xl bg-black z-20" />

                {/* Screen Content */}
                <div className="h-full w-full bg-gray-900 text-white flex items-center justify-center relative overflow-hidden">
                    {/* Lock Screen Clock Simulation */}
                    <div className="absolute top-[12%] left-0 right-0 z-10 flex flex-col items-center justify-center pointer-events-none fade-in">
                        <h1 className="text-6xl font-bold tracking-tight text-white/90 drop-shadow-md font-sans">
                            {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
                        </h1>
                        <p className="text-lg font-medium text-white/80 mt-1 drop-shadow-sm">
                            {new Date().toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' })}
                        </p>
                    </div>

                    {loading ? (
                        <div className="text-center p-4">
                            <div className="animate-spin h-8 w-8 border-2 border-orange-500 border-t-transparent rounded-full mx-auto mb-2" />
                            <p className="text-sm text-gray-400">Updating preview...</p>
                        </div>
                    ) : publicToken ? (
                        <img
                            src={previewUrl || `/w/${publicToken}/image.png?t=${Date.now()}`}
                            alt="Wallpaper Preview"
                            className="w-full h-full object-cover transition-opacity duration-300"
                        />
                    ) : (
                        <p className="text-sm text-gray-500 text-center px-4">
                            Save settings to generate preview
                        </p>
                    )}
                </div>
            </div>

            <div className="mt-4 text-center">
                {publicToken && (
                    <a
                        href={`/w/${publicToken}`}
                        target="_blank"
                        className="text-xs text-orange-600 hover:underline font-medium"
                    >
                        Open Public Link ↗
                    </a>
                )}
            </div>
        </div>
    );
}
