export function drawDashboardHeader(context, { xCoordinate, yCoordinate, width, theme, history, todayPercent, streak, streakActiveToday }) {
    const contentWidth = width;
    const statsHeight = 380; // Increased height for stacked right column

    // LEFT COLUMN: GOALS GROWTH
    context.textAlign = "left";
    context.fillStyle = theme.TEXT_SUB;
    context.font = "bold 40px Inter, sans-serif";
    context.fillText("GOALS", xCoordinate, yCoordinate);
    context.fillStyle = theme.TEXT_MAIN;
    context.fillText("GROWTH", xCoordinate, yCoordinate + 50);

    // Chart Area
    const chartX = xCoordinate;
    const chartY = yCoordinate + 80;
    const chartWidth = contentWidth * 0.5;
    const chartHeight = 120;

    const dataPoints = history.length > 0 ? history : [2, 4, 3, 5, 4, 6, 5];
    const maxVal = Math.max(Math.max(...dataPoints), 1);

    // Spline Points
    const points = dataPoints.map((val, index) => ({
        x: chartX + (index / (dataPoints.length - 1)) * chartWidth,
        y: chartY + chartHeight - (val / maxVal) * chartHeight
    }));

    // ENHANCEMENT: Added glow effect under the line
    context.shadowColor = theme.ACCENT;
    context.shadowBlur = 20;
    context.shadowOffsetX = 0;
    context.shadowOffsetY = 0;

    // Area Fill (Gradient)
    context.beginPath();
    context.moveTo(chartX, chartY + chartHeight);
    if (points.length > 0) {
        context.lineTo(points[0].x, points[0].y);
        for (let i = 0; i < points.length - 1; i++) {
            const xc = (points[i].x + points[i + 1].x) / 2;
            const yc = (points[i].y + points[i + 1].y) / 2;
            context.quadraticCurveTo(points[i].x, points[i].y, xc, yc);
        }
        context.lineTo(points[points.length - 1].x, points[points.length - 1].y);
    }
    context.lineTo(chartX + chartWidth, chartY + chartHeight);
    context.closePath();

    const gradient = context.createLinearGradient(0, chartY, 0, chartY + chartHeight);
    gradient.addColorStop(0, "rgba(255,255,255,0.2)");
    gradient.addColorStop(1, "rgba(255,255,255,0.0)");
    context.fillStyle = gradient;
    context.fill();

    // Line Stroke
    context.beginPath();
    if (points.length > 0) {
        context.moveTo(points[0].x, points[0].y);
        for (let i = 0; i < points.length - 1; i++) {
            const xc = (points[i].x + points[i + 1].x) / 2;
            const yc = (points[i].y + points[i + 1].y) / 2;
            context.quadraticCurveTo(points[i].x, points[i].y, xc, yc);
        }
        context.lineTo(points[points.length - 1].x, points[points.length - 1].y);
    }
    context.strokeStyle = theme.ACCENT;
    context.lineWidth = 6;
    context.lineCap = "round";
    context.stroke();

    // ENHANCEMENT: Reset shadow
    context.shadowBlur = 0;

    // ENHANCEMENT: Added animated data points on the line
    points.forEach((point, i) => {
        context.beginPath();
        context.arc(point.x, point.y, 5, 0, 2 * Math.PI);
        context.fillStyle = theme.ACCENT;
        context.fill();
        context.strokeStyle = theme.BG;
        context.lineWidth = 2;
        context.stroke();
    });

    // Weekday Labels
    context.fillStyle = "#525252";
    context.font = "bold 16px Inter, sans-serif";
    context.textAlign = "center";
    const days = ["S", "M", "T", "W", "T", "F", "S"];
    days.forEach((day, index) => {
        context.fillText(day, chartX + (index / 6) * chartWidth, chartY + chartHeight + 25);
    });

    // RIGHT COLUMN: CIRCULAR PROGRESS
    const ringX = xCoordinate + contentWidth - 90;

    // 2. Goal Ring (Moved up)
    const ringY = yCoordinate + 100;
    const radius = 90;

    // ENHANCEMENT: Added subtle shadow behind ring
    context.shadowColor = "rgba(0,0,0,0.3)";
    context.shadowBlur = 20;
    context.shadowOffsetY = 5;

    // Track
    context.beginPath();
    context.arc(ringX, ringY, radius, 0, 2 * Math.PI);
    context.strokeStyle = "#27272a";
    context.lineWidth = 16;
    context.stroke();

    // ENHANCEMENT: Reset shadow for progress arc
    context.shadowBlur = 0;
    context.shadowOffsetY = 0;

    // Progress
    const percentage = todayPercent || 0;
    const startAngle = -Math.PI / 2;
    const endAngle = startAngle + (percentage / 100) * 2 * Math.PI;

    if (percentage > 0) {
        // ENHANCEMENT: Added glow to progress arc
        context.shadowColor = theme.ACCENT;
        context.shadowBlur = 15;

        context.beginPath();
        context.arc(ringX, ringY, radius, startAngle, endAngle);
        context.strokeStyle = theme.ACCENT;
        context.lineWidth = 16;
        context.lineCap = "round";
        context.stroke();

        context.shadowBlur = 0;
    }

    // Text inside
    context.fillStyle = theme.TEXT_MAIN;
    context.textAlign = "center";
    context.font = "bold 52px Inter, sans-serif";
    context.fillText(`${percentage}%`, ringX, ringY + 18);

    // Label below
    context.fillStyle = theme.TEXT_SUB;
    context.font = "bold 16px Inter, sans-serif";
    context.fillText("DAILY GOAL", ringX, ringY + 135);


    return statsHeight;
}

export function drawStreakWidget(context, { x, y, theme, streak, streakActiveToday }) {
    if (!streak || streak <= 0) return;

    context.save();
    context.textAlign = "right";

    // Streak Number
    context.fillStyle = theme.TEXT_MAIN;
    context.font = "bold 56px Inter, sans-serif";
    context.fillText(`${streak}`, x - 55, y);

    // Icon (Flame)
    context.font = "42px Inter, sans-serif";
    context.fillText("🔥", x, y - 5);

    // Status
    if (streakActiveToday) {
        context.fillStyle = "#22c55e"; // Green
        context.font = "bold 15px Inter, sans-serif";
        context.fillText("✓ Active", x, y + 30);
    } else {
        context.fillStyle = "#ef4444"; // Red
        context.font = "bold 14px Inter, sans-serif";
        context.fillText("⚠ Risk", x, y + 30);
    }
    context.restore();
}
