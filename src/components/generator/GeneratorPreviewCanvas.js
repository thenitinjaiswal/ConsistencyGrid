'use client';

import { useEffect, useRef, useState } from 'react';
import CanvasWallpaperEngine from '@/components/CanvasWallpaperEngine';

/**
 * Generator Preview - Canvas-Only Implementation
 * 
 * This component integrates the CanvasWallpaperEngine for the generator page.
 * It handles:
 * - Real-time canvas rendering
 * - Export and download functionality
 * - Responsive preview scaling
 * - No HTML/CSS overlays
 */

export default function GeneratorPreviewCanvas({
  publicToken,
  loading,
  form,
}) {
  const [stats, setStats] = useState({
    ageYears: 0,
    lifeProgress: 0,
    currentStreak: 0,
    lifeExpectancy: 80,
  });

  const [gridConfig, setGridConfig] = useState({
    gridSize: 52,
    blockSize: 12,
    spacing: 3,
    rows: 80,
    cols: 52,
    activeIndices: new Set(),
  });

  /**
   * Calculate stats based on form
   */
  useEffect(() => {
    if (!form.dob) return;

    const birthDate = new Date(form.dob);
    const today = new Date();
    const ageYears = Math.floor(
      (today - birthDate) / (365.25 * 24 * 60 * 60 * 1000)
    );

    const lifeProgress =
      (ageYears / form.lifeExpectancyYears) * 100;

    setStats({
      ageYears,
      lifeProgress: Math.min(100, Math.max(0, lifeProgress)),
      currentStreak: 0,
      lifeExpectancy: form.lifeExpectancyYears,
    });
  }, [form.dob, form.lifeExpectancyYears]);

  /**
   * Generate grid config for life calendar
   */
  useEffect(() => {
    if (!form.dob) return;

    const birthDate = new Date(form.dob);
    const today = new Date();
    
    // Calculate weeks lived
    const weeksLived = Math.floor(
      (today - birthDate) / (7 * 24 * 60 * 60 * 1000)
    );

    // Generate active indices (weeks lived)
    const activeIndices = new Set();
    for (let i = 0; i < Math.min(weeksLived, 80 * 52); i++) {
      activeIndices.add(i);
    }

    setGridConfig((prev) => ({
      ...prev,
      activeIndices,
    }));
  }, [form.dob]);

  if (loading) {
    return (
      <div className="rounded-2xl border border-white/10 bg-black/50 p-6 flex items-center justify-center h-[600px]">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-orange-500 border-t-transparent mb-4" />
          <p className="text-sm text-gray-400">Loading preview...</p>
        </div>
      </div>
    );
  }

  if (!publicToken) {
    return (
      <div className="rounded-2xl border border-white/10 bg-black/50 p-6 flex items-center justify-center h-[600px]">
        <div className="text-center">
          <p className="text-sm text-gray-400">Save your settings first to generate preview</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-black/50 p-6 sticky top-24">
      <h2 className="text-lg font-semibold text-white mb-4">Live Preview</h2>

      {/* Canvas wallpaper engine */}
      <div className="flex justify-center">
        <CanvasWallpaperEngine
          token={publicToken}
          theme={form.theme || 'dark-minimal'}
          baseImagePath={null}
          stats={stats}
          gridConfig={gridConfig}
          showPreview={true}
          onExport={null}
        />
      </div>

      {/* Info text */}
      <div className="mt-6 pt-4 border-t border-white/10">
        <p className="text-xs text-gray-400 text-center">
          💡 Changes appear instantly on canvas. Download your wallpaper when ready.
        </p>
      </div>
    </div>
  );
}
