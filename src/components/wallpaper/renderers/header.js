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
export function drawStreakWidget(context, { x, y, theme, streak, streakActiveToday }) {
    if (!streak || streak <= 0) return;

    // FONT_STACK is injected via drawSafeText automatically now, 
    // but we'll use a slightly safer emoji approach.

    drawSafeText(context, `${streak}`, x - 65, y, {
        font: "bold 64px 'Plus Jakarta Sans'",
        color: theme.TEXT_MAIN,
        align: "right",
    });

    // Fire emoji - sometimes drawing it separately helps browsers
    drawSafeText(context, "🔥", x - 10, y - 5, {
        font: "48px serif", // Using serif as fallback for emojis often works better on mobile
        align: "right",
        shadow: false,
    });

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
