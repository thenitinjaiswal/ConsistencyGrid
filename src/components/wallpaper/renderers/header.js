import { drawRoundedRect, drawSafeText } from "./utils";

/**
 * DASHBOARD HEADER
 * -------------------------------------------------
 * Top section containing:
 * - Growth graph
 * - Circular daily goal progress
 */
export function drawDashboardHeader(
    context,
    { xCoordinate, yCoordinate, width, theme, history, todayPercent }
) {
    const contentWidth = width;
    const statsHeight = 380;

    /* ---------------- LEFT COLUMN ---------------- */

    drawSafeText(context, "GOALS", xCoordinate, yCoordinate, {
        font: "bold 40px 'Plus Jakarta Sans', sans-serif",
        color: theme.TEXT_SUB,
    });

    drawSafeText(context, "GROWTH", xCoordinate, yCoordinate + 50, {
        font: "bold 40px 'Plus Jakarta Sans', sans-serif",
        color: theme.TEXT_MAIN,
    });

    // Chart area
    const chartX = xCoordinate;
    const chartY = yCoordinate + 80;
    const chartWidth = contentWidth * 0.5;
    const chartHeight = 120;

    const dataPoints =
        history && history.length > 0 ? history : [2, 4, 3, 5, 4, 6, 5];
    const maxVal = Math.max(...dataPoints, 1);

    const points = dataPoints.map((val, index) => ({
        x: chartX + (index / (dataPoints.length - 1)) * chartWidth,
        y: chartY + chartHeight - (val / maxVal) * chartHeight,
    }));

    // Area fill
    context.save();
    context.beginPath();
    context.moveTo(chartX, chartY + chartHeight);
    context.lineTo(points[0].x, points[0].y);
    for (let i = 0; i < points.length - 1; i++) {
        const xc = (points[i].x + points[i + 1].x) / 2;
        const yc = (points[i].y + points[i + 1].y) / 2;
        context.quadraticCurveTo(points[i].x, points[i].y, xc, yc);
    }
    context.lineTo(points[points.length - 1].x, points[points.length - 1].y);
    context.lineTo(chartX + chartWidth, chartY + chartHeight);
    context.closePath();

    const gradient = context.createLinearGradient(0, chartY, 0, chartY + chartHeight);
    gradient.addColorStop(0, "rgba(255,255,255,0.2)");
    gradient.addColorStop(1, "rgba(255,255,255,0)");

    context.fillStyle = gradient;
    context.fill();

    // Line
    context.shadowColor = theme.ACCENT;
    context.shadowBlur = 20;
    context.beginPath();
    context.moveTo(points[0].x, points[0].y);
    for (let i = 0; i < points.length - 1; i++) {
        const xc = (points[i].x + points[i + 1].x) / 2;
        const yc = (points[i].y + points[i + 1].y) / 2;
        context.quadraticCurveTo(points[i].x, points[i].y, xc, yc);
    }
    context.lineTo(points[points.length - 1].x, points[points.length - 1].y);
    context.strokeStyle = theme.ACCENT;
    context.lineWidth = 6;
    context.lineCap = "round";
    context.stroke();
    context.restore();

    // Points
    points.forEach((p) => {
        context.beginPath();
        context.arc(p.x, p.y, 5, 0, 2 * Math.PI);
        context.fillStyle = theme.ACCENT;
        context.fill();
    });

    /* ---------------- RIGHT COLUMN ---------------- */

    const ringX = xCoordinate + contentWidth - 90;
    const ringY = yCoordinate + 100;
    const radius = 90;

    // Track
    context.beginPath();
    context.arc(ringX, ringY, radius, 0, 2 * Math.PI);
    context.strokeStyle = "#27272a";
    context.lineWidth = 16;
    context.stroke();

    // Progress
    const percent = todayPercent || 0;
    if (percent > 0) {
        context.shadowColor = theme.ACCENT;
        context.shadowBlur = 15;
        context.beginPath();
        context.arc(
            ringX,
            ringY,
            radius,
            -Math.PI / 2,
            -Math.PI / 2 + (percent / 100) * 2 * Math.PI
        );
        context.strokeStyle = theme.ACCENT;
        context.lineWidth = 16;
        context.lineCap = "round";
        context.stroke();
        context.shadowBlur = 0;
    }

    drawSafeText(context, `${percent}%`, ringX, ringY + 18, {
        font: "bold 52px 'Plus Jakarta Sans', sans-serif",
        color: theme.TEXT_MAIN,
        align: "center",
    });

    drawSafeText(context, "DAILY GOAL", ringX, ringY + 135, {
        font: "bold 16px 'Plus Jakarta Sans', sans-serif",
        color: theme.TEXT_SUB,
        align: "center",
        shadow: false,
    });

    return statsHeight;
}

/**
 * STREAK WIDGET
 * -------------------------------------------------
 */
/**
 * Flame Icon (Lucide Style) - 100% Robust Drawing
 */
function drawFlameIcon(ctx, x, y, size, color) {
    ctx.save();

    // Position adjustments
    const ox = x - size;
    const oy = y - size / 2 - 5;
    const scale = size / 24;

    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = 2.5 * scale;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    // Lucide Flame Path Geometry (Converted to manual commands)
    // M 12,2 C 12,2 19,7 19,12 C 19,15.86 15.86,19 12,19 C 8.14,19 5,15.86 5,12 C 5,7 12,2 12,2 Z
    // (Improved shape for clarity)

    const sx = (v) => ox + v * scale;
    const sy = (v) => oy + v * scale;

    ctx.moveTo(sx(12), sy(2));
    ctx.bezierCurveTo(sx(12), sy(2), sx(19), sy(7), sx(19), sy(12));
    ctx.bezierCurveTo(sx(19), sy(16), sx(16), sy(22), sx(12), sy(22));
    ctx.bezierCurveTo(sx(8), sy(22), sx(5), sy(16), sx(5), sy(12));
    ctx.bezierCurveTo(sx(5), sy(7), sx(12), sy(2), sx(12), sy(2));

    // Inner detail
    ctx.moveTo(sx(12), sy(17));
    ctx.quadraticCurveTo(sx(10), sy(17), sx(10), sy(14));
    ctx.quadraticCurveTo(sx(10), sy(11), sx(12), sy(8));

    ctx.stroke();

    // Fill with soft accent
    ctx.fillStyle = color + "22"; // Very light fill
    ctx.fill();

    ctx.restore();
}

export function drawStreakWidget(context, { x, y, theme, streak, streakActiveToday }) {
    if (!streak || streak <= 0) return;

    drawSafeText(context, `${streak}`, x - 70, y, {
        font: "bold 64px 'Plus Jakarta Sans'",
        color: theme.TEXT_MAIN,
        align: "right",
    });

    // Replace Emoji with Lucide-style Path Icon
    const iconColor = streakActiveToday ? theme.ACCENT || "#ff8c42" : "#71717a";
    drawFlameIcon(context, x, y, 48, iconColor);

    const statusText = streakActiveToday ? "DONE TODAY" : "NOT LOGGED";
    const statusColor = streakActiveToday ? "#22c55e" : "#ef4444";

    drawSafeText(context, statusText, x, y + 40, {
        font: "bold 16px 'Plus Jakarta Sans'",
        color: statusColor,
        align: "right",
        shadow: false,
    });
}

/**
 * LIFE HEADER
 * -------------------------------------------------
 */
export function drawLifeHeader(context, { canvasWidth, theme, progress }) {
    if (progress === undefined || progress === null) return;

    const x = canvasWidth / 2;
    const y = 200;

    drawSafeText(context, "LIFE PROGRESS", x, y, {
        font: "bold 18px 'Plus Jakarta Sans', sans-serif",
        color: theme.TEXT_SUB,
        align: "center",
    });

    drawSafeText(context, `${progress.toFixed(1)}%`, x, y + 50, {
        font: "bold 36px 'Plus Jakarta Sans', sans-serif",
        color: theme.TEXT_MAIN,
        align: "center",
    });

    const barWidth = canvasWidth * 0.4;
    const barHeight = 6;
    const barX = x - barWidth / 2;
    const barY = y + 75;

    // Use the safe drawRoundedRect helper instead of ctx.roundRect
    drawRoundedRect(context, barX, barY, barWidth, barHeight, 3, "rgba(255,255,255,0.1)");

    if (progress > 0) {
        context.save();
        context.shadowColor = theme.ACCENT;
        context.shadowBlur = 10;
        drawRoundedRect(context, barX, barY, (progress / 100) * barWidth, barHeight, 3, theme.ACCENT);
        context.restore();
    }
}
