'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

/**
 * CANVAS-ONLY WALLPAPER ENGINE
 * 
 * Complete replacement for HTML/CSS wallpaper overlays.
 * All rendering is done ONLY with Canvas API - nothing exported to DOM.
 * 
 * Features:
 * - Loads base image from /public (respects Linux case-sensitive paths)
 * - Waits for fonts to load before drawing
 * - Real-time updates (time/date every minute)
 * - Full resolution (1080×2340) with CSS scaling for preview
 * - Deterministic rendering (same output in dev + production)
 * - Clear and redraw on every update (no ghosting)
 * - Fully exportable (what you see is what you get)
 */

const WALLPAPER_DIMENSIONS = {
  WIDTH: 1080,
  HEIGHT: 2340,
};

const THEME_COLORS = {
  'dark-minimal': {
    BG: '#09090b',
    TEXT_PRIMARY: '#fafafa',
    TEXT_SECONDARY: '#a1a1aa',
    ACCENT: '#ffffff',
    GRID_ACTIVE: '#ffffff',
    GRID_INACTIVE: '#27272a',
    GRID_OPACITY: 0.3,
  },
  'sunset-orange': {
    BG: '#09090b',
    TEXT_PRIMARY: '#fafafa',
    TEXT_SECONDARY: '#a1a1aa',
    ACCENT: '#ff8c42',
    GRID_ACTIVE: '#ff8c42',
    GRID_INACTIVE: '#2a2019',
    GRID_OPACITY: 0.3,
  },
  'ocean-blue': {
    BG: '#09090b',
    TEXT_PRIMARY: '#fafafa',
    TEXT_SECONDARY: '#a1a1aa',
    ACCENT: '#3b82f6',
    GRID_ACTIVE: '#3b82f6',
    GRID_INACTIVE: '#1e3a8a',
    GRID_OPACITY: 0.3,
  },
};

/**
 * Load image from /public with error handling
 */
function loadImage(path) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => {
      console.warn(`Failed to load image: ${path}`);
      resolve(null); // Return null instead of rejecting
    };
    img.src = path;
  });
}

/**
 * Wait for fonts to be ready before drawing
 */
async function waitForFonts() {
  try {
    // Font specifications must match what we use in drawText
    await Promise.all([
      document.fonts.load('700 64px Inter, system-ui, -apple-system, sans-serif'),
      document.fonts.load('400 24px Inter, system-ui, -apple-system, sans-serif'),
      document.fonts.load('400 18px Inter, system-ui, -apple-system, sans-serif'),
      document.fonts.load('600 16px Inter, system-ui, -apple-system, sans-serif'),
    ]);
  } catch (err) {
    console.warn('Font loading timeout - proceeding anyway', err);
  }
}

/**
 * Draw background with radial gradient
 */
function drawBackground(ctx, width, height, theme) {
  const gradient = ctx.createRadialGradient(
    width / 2,
    height / 3,
    0,
    width / 2,
    height / 3,
    height
  );

  gradient.addColorStop(0, theme.BG);
  gradient.addColorStop(1, theme.BG === '#09090b' ? '#000000' : theme.BG);

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
}

/**
 * Helper: Draw text with strong shadow for visibility on any background
 */
function drawTextWithShadow(ctx, text, x, y, fontSize, fontWeight, textColor, shadowColor = 'rgba(0, 0, 0, 0.8)', shadowBlur = 12) {
  ctx.save();
  
  // Set font properties
  ctx.font = `${fontWeight} ${fontSize}px Inter, system-ui, -apple-system, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  
  // Draw dark shadow for visibility
  ctx.fillStyle = shadowColor;
  ctx.shadowColor = 'rgba(0, 0, 0, 0.9)';
  ctx.shadowBlur = shadowBlur;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 2;
  
  // Draw text with shadow
  ctx.fillText(text, x, y);
  
  // Draw bright text on top
  ctx.shadowColor = 'transparent';
  ctx.shadowBlur = 0;
  ctx.fillStyle = textColor;
  ctx.fillText(text, x, y);
  
  ctx.restore();
}

/**
 * Draw current time and date at the top
 * CRITICAL: Uses strong shadow for visibility on dark/gradient backgrounds
 */
function drawTimeAndDate(ctx, width, height, theme) {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const timeStr = `${hours}:${minutes}`;

  const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const months = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];
  
  const day = now.getDate();
  const month = months[now.getMonth()];
  const weekday = weekdays[now.getDay()];
  const dateStr = `${weekday}, ${day} ${month}`;

  // Draw time with strong shadow
  drawTextWithShadow(
    ctx,
    timeStr,
    width / 2,
    80,
    '64',
    'bold',
    theme.TEXT_PRIMARY || '#fafafa',
    'rgba(0, 0, 0, 0.95)',
    14
  );

  // Draw date with strong shadow
  drawTextWithShadow(
    ctx,
    dateStr,
    width / 2,
    160,
    '24',
    '400',
    theme.TEXT_SECONDARY || '#a1a1aa',
    'rgba(0, 0, 0, 0.95)',
    12
  );
}

/**
 * Draw a grid of habit/week blocks
 * Represents life weeks or habit completion
 */
function drawGrid(ctx, width, height, theme, gridConfig = {}) {
  const {
    gridSize = 52,
    blockSize = 12,
    spacing = 3,
    rows = 80,
    cols = 52,
    activeIndices = new Set(),
    startY = 250,
  } = gridConfig;

  const totalWidth = cols * (blockSize + spacing);
  const startX = (width - totalWidth) / 2;

  ctx.fillStyle = theme.GRID_INACTIVE;

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      const index = i * cols + j;
      const x = startX + j * (blockSize + spacing);
      const y = startY + i * (blockSize + spacing);

      // Draw block
      if (activeIndices.has(index)) {
        ctx.fillStyle = theme.GRID_ACTIVE;
        ctx.globalAlpha = 1;
      } else {
        ctx.fillStyle = theme.GRID_INACTIVE;
        ctx.globalAlpha = theme.GRID_OPACITY;
      }

      ctx.fillRect(x, y, blockSize, blockSize);
    }
  }

  ctx.globalAlpha = 1; // Reset alpha
}

/**
 * Draw header with age and life stats
 * Uses shadows for visibility
 */
function drawHeader(ctx, width, theme, stats = {}) {
  const { ageYears = 0, lifeExpectancy = 80, currentStreak = 0 } = stats;

  const headerY = 1100;
  ctx.save();
  ctx.textAlign = 'left';

  // Age stat
  drawTextWithShadow(
    ctx,
    `Age: ${ageYears} years`,
    60,
    headerY,
    '16',
    '600',
    theme.TEXT_PRIMARY || '#fafafa',
    'rgba(0, 0, 0, 0.8)',
    8
  );

  // Life expectancy
  drawTextWithShadow(
    ctx,
    `Life expectancy: ${lifeExpectancy} years`,
    60,
    headerY + 30,
    '14',
    '400',
    theme.TEXT_SECONDARY || '#a1a1aa',
    'rgba(0, 0, 0, 0.8)',
    8
  );

  // Streak (if applicable)
  if (currentStreak > 0) {
    drawTextWithShadow(
      ctx,
      `🔥 Streak: ${currentStreak}`,
      60,
      headerY + 60,
      '16',
      '600',
      theme.ACCENT || '#ffffff',
      'rgba(0, 0, 0, 0.8)',
      8
    );
  }

  ctx.restore();
}

/**
 * Draw a progress bar (e.g., for life progress)
 * Uses shadows for label and percentage visibility
 */
function drawProgressBar(ctx, width, theme, config = {}) {
  const {
    x = 60,
    y = 1250,
    barWidth = width - 120,
    barHeight = 8,
    percentage = 50,
    label = 'Life Progress',
  } = config;

  ctx.save();

  // Label with shadow
  drawTextWithShadow(
    ctx,
    label,
    x,
    y - 20,
    '14',
    '600',
    theme.TEXT_PRIMARY || '#fafafa',
    'rgba(0, 0, 0, 0.8)',
    8
  );

  // Background bar
  ctx.fillStyle = theme.GRID_INACTIVE;
  ctx.fillRect(x, y, barWidth, barHeight);

  // Progress bar
  const progressWidth = (barWidth * Math.max(0, Math.min(100, percentage))) / 100;
  ctx.fillStyle = theme.ACCENT;
  ctx.fillRect(x, y, progressWidth, barHeight);

  // Percentage text with shadow
  drawTextWithShadow(
    ctx,
    `${percentage.toFixed(1)}%`,
    x + barWidth + 20,
    y + barHeight / 2 + 4,
    '12',
    '400',
    theme.TEXT_SECONDARY || '#a1a1aa',
    'rgba(0, 0, 0, 0.8)',
    8
  );

  ctx.restore();
}

/**
 * Draw footer with attribution/settings
 * Uses shadows for visibility
 */
function drawFooter(ctx, width, height, theme) {
  ctx.save();
  ctx.textAlign = 'center';

  // App name
  drawTextWithShadow(
    ctx,
    'ConsistencyGrid',
    width / 2,
    height - 60,
    '12',
    '400',
    theme.TEXT_SECONDARY || '#a1a1aa',
    'rgba(0, 0, 0, 0.8)',
    8
  );

  // Subtitle
  drawTextWithShadow(
    ctx,
    'Live Wallpaper',
    width / 2,
    height - 40,
    '12',
    '400',
    theme.TEXT_SECONDARY || '#a1a1aa',
    'rgba(0, 0, 0, 0.8)',
    8
  );

  ctx.restore();
}

/**
 * Main canvas rendering function
 * This is called on every update and renders EVERYTHING
 */
async function renderWallpaper(
  canvas,
  ctx,
  config = {}
) {
  const {
    theme = THEME_COLORS['dark-minimal'],
    baseImagePath = null,
    stats = {},
    gridConfig = {},
  } = config;

  // CRITICAL: Clear entire canvas
  ctx.clearRect(0, 0, WALLPAPER_DIMENSIONS.WIDTH, WALLPAPER_DIMENSIONS.HEIGHT);

  // Wait for fonts before drawing
  await waitForFonts();

  // Draw background
  drawBackground(ctx, WALLPAPER_DIMENSIONS.WIDTH, WALLPAPER_DIMENSIONS.HEIGHT, theme);

  // Draw base image if provided (loaded from /public)
  if (baseImagePath) {
    try {
      const baseImage = await loadImage(baseImagePath);
      if (baseImage) {
        ctx.drawImage(
          baseImage,
          0,
          0,
          WALLPAPER_DIMENSIONS.WIDTH,
          WALLPAPER_DIMENSIONS.HEIGHT
        );
      }
    } catch (err) {
      console.warn('Base image rendering failed:', err);
    }
  }

  // Draw grid
  drawGrid(ctx, WALLPAPER_DIMENSIONS.WIDTH, WALLPAPER_DIMENSIONS.HEIGHT, theme, gridConfig);

  // Draw time and date (REAL-TIME - updates every minute)
  drawTimeAndDate(ctx, WALLPAPER_DIMENSIONS.WIDTH, WALLPAPER_DIMENSIONS.HEIGHT, theme);

  // Draw header stats
  drawHeader(ctx, WALLPAPER_DIMENSIONS.WIDTH, theme, stats);

  // Draw progress bar
  if (stats.lifeProgress !== undefined) {
    drawProgressBar(ctx, WALLPAPER_DIMENSIONS.WIDTH, theme, {
      y: 1350,
      percentage: stats.lifeProgress,
      label: 'Life Progress',
    });
  }

  // Draw footer
  drawFooter(ctx, WALLPAPER_DIMENSIONS.WIDTH, WALLPAPER_DIMENSIONS.HEIGHT, theme);
}

/**
 * React component wrapping the Canvas engine
 */
export default function CanvasWallpaperEngine({
  token,
  theme = 'dark-minimal',
  baseImagePath = null,
  stats = {},
  gridConfig = {},
  showPreview = true,
  onExport = null,
}) {
  const canvasRef = useRef(null);
  const [isReady, setIsReady] = useState(false);
  const [lastRenderTime, setLastRenderTime] = useState(new Date());
  const renderTimeoutRef = useRef(null);
  const animationFrameRef = useRef(null);

  const themeObj = THEME_COLORS[theme] || THEME_COLORS['dark-minimal'];

  /**
   * Core render function - updates canvas completely
   */
  const performRender = useCallback(async () => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      console.error('Failed to get canvas context');
      return;
    }

    try {
      await renderWallpaper(canvas, ctx, {
        theme: themeObj,
        baseImagePath,
        stats,
        gridConfig,
      });

      setLastRenderTime(new Date());

      // Call export callback if provided
      if (onExport) {
        try {
          const dataUrl = canvas.toDataURL('image/png');
          onExport(dataUrl);
        } catch (err) {
          console.warn('Export callback failed:', err);
        }
      }
    } catch (err) {
      console.error('Render failed:', err);
    }
  }, [themeObj, baseImagePath, stats, gridConfig, onExport]);

  /**
   * Update every minute to reflect time changes
   */
  useEffect(() => {
    // Initial render
    performRender();
    setIsReady(true);

    // Schedule next update at top of next minute
    const now = new Date();
    const nextMinute = new Date(now);
    nextMinute.setSeconds(0, 0);
    nextMinute.setMinutes(nextMinute.getMinutes() + 1);
    const msUntilNextMinute = nextMinute.getTime() - now.getTime();

    renderTimeoutRef.current = setTimeout(() => {
      performRender();

      // Then update every 60 seconds
      const interval = setInterval(() => {
        performRender();
      }, 60 * 1000);

      return () => clearInterval(interval);
    }, msUntilNextMinute);

    return () => {
      if (renderTimeoutRef.current) {
        clearTimeout(renderTimeoutRef.current);
      }
    };
  }, [performRender]);

  /**
   * Handle visibility changes (tab switching)
   */
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        performRender();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [performRender]);

  /**
   * Export function for download
   */
  const handleExport = () => {
    if (!canvasRef.current) return;

    const link = document.createElement('a');
    link.href = canvasRef.current.toDataURL('image/png');
    link.download = `wallpaper-${token}-${Date.now()}.png`;
    link.click();
  };

  /**
   * Copy to clipboard
   */
  const handleCopyToClipboard = async () => {
    if (!canvasRef.current) return;

    try {
      canvasRef.current.toBlob(async (blob) => {
        if (navigator.clipboard && navigator.clipboard.write) {
          await navigator.clipboard.write([
            new ClipboardItem({ 'image/png': blob }),
          ]);
          alert('Wallpaper copied to clipboard!');
        } else {
          alert('Copy to clipboard not supported on this browser');
        }
      }, 'image/png');
    } catch (err) {
      console.error('Copy failed:', err);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Full-resolution canvas (hidden for production export) */}
      <canvas
        ref={canvasRef}
        width={WALLPAPER_DIMENSIONS.WIDTH}
        height={WALLPAPER_DIMENSIONS.HEIGHT}
        style={{
          display: showPreview ? 'block' : 'none',
          width: '100%',
          maxWidth: '360px',
          height: 'auto',
          aspectRatio: `${WALLPAPER_DIMENSIONS.WIDTH}/${WALLPAPER_DIMENSIONS.HEIGHT}`,
          border: '2px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '12px',
          backgroundColor: '#000',
        }}
      />

      {/* Controls */}
      {showPreview && (
        <div className="flex gap-2">
          <button
            onClick={handleExport}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium"
          >
            Download
          </button>
          <button
            onClick={handleCopyToClipboard}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium"
          >
            Copy
          </button>
        </div>
      )}

      {/* Status */}
      {showPreview && isReady && (
        <p className="text-xs text-gray-400">
          Last updated: {lastRenderTime.toLocaleTimeString()}
        </p>
      )}
    </div>
  );
}
