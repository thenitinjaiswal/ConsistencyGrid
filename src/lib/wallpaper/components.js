
// Canvas Helper Function
const drawRoundedRect = (context, xCoordinate, yCoordinate, width, height, borderRadius, fillColor, strokeColor) => {
    context.beginPath();
    if (context.roundRect) {
        context.roundRect(xCoordinate, yCoordinate, width, height, borderRadius);
    } else {
        context.rect(xCoordinate, yCoordinate, width, height);
    }

    if (fillColor) {
        context.fillStyle = fillColor;
        context.fill();
    }

    if (strokeColor) {
        context.strokeStyle = strokeColor;
        context.stroke();
    }
};

export function drawBackground(context, canvasWidth, canvasHeight, theme) {
    context.fillStyle = theme.BG;
    context.fillRect(0, 0, canvasWidth, canvasHeight);
}

export function drawDashboardHeader(context, { xCoordinate, yCoordinate, width, theme, history, todayPercent }) {
    const contentWidth = width;
    const statsHeight = 300;

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
    const ringY = yCoordinate + 70;
    const radius = 90;

    // Track
    context.beginPath();
    context.arc(ringX, ringY, radius, 0, 2 * Math.PI);
    context.strokeStyle = "#27272a";
    context.lineWidth = 16;
    context.stroke();

    // Progress
    const percentage = todayPercent || 0;
    const startAngle = -Math.PI / 2;
    const endAngle = startAngle + (percentage / 100) * 2 * Math.PI;

    if (percentage > 0) {
        context.beginPath();
        context.arc(ringX, ringY, radius, startAngle, endAngle);
        context.strokeStyle = theme.ACCENT;
        context.lineWidth = 16;
        context.lineCap = "round";
        context.stroke();
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

export function drawGrid(context, { xCoordinate, yCoordinate, width, height, theme, mode, dob, lifeExpectancy, activityMap, now }) {
    let currentY = yCoordinate;

    context.textAlign = "left";
    context.fillStyle = theme.TEXT_SUB;
    context.font = "bold 32px Inter, sans-serif";

    // Dynamic title based on mode
    if (mode === "days") {
        context.fillText("365 DAYS", xCoordinate, currentY);
    } else if (mode === "weeks") {
        context.fillText(now.getFullYear() + " PROGRESS", xCoordinate, currentY);
    } else if (mode === "life") {
        context.fillText("LIFE PROGRESS", xCoordinate, currentY);
    } else {
        const monthName = now.toLocaleString('default', { month: 'long' }).toUpperCase();
        context.fillText(monthName + " " + now.getFullYear(), xCoordinate, currentY);
    }
    currentY += 50;

    const contentWidth = width;

    // Helper Functions
    const getDayString = (date) => date.toISOString().split("T")[0];

    const getWeekNumber = (dateInstance) => {
        const date = new Date(Date.UTC(dateInstance.getFullYear(), dateInstance.getMonth(), dateInstance.getDate()));
        date.setUTCDate(date.getUTCDate() + 4 - (date.getUTCDay() || 7));
        const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
        return Math.ceil((((date - yearStart) / 86400000) + 1) / 7);
    };

    const getDayOfYear = (dateInstance) => {
        const start = new Date(dateInstance.getFullYear(), 0, 0);
        const diff = dateInstance - start;
        const oneDay = 1000 * 60 * 60 * 24;
        return Math.floor(diff / oneDay);
    };

    const weeksBetween = (date1, date2) => Math.floor((date2.getTime() - date1.getTime()) / (1000 * 60 * 60 * 24 * 7));

    if (mode === "days") {
        // 365 DAYS GRID (Current Year)
        const gridCols = 25;
        const gap = 8;
        const boxSize = (contentWidth - (gap * (gridCols - 1))) / gridCols;
        const year = now.getFullYear();
        const isLeap = (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
        const totalDays = isLeap ? 366 : 365;
        const currentDayNum = getDayOfYear(now);
        const rows = Math.ceil(totalDays / gridCols);

        for (let rowIndex = 0; rowIndex < rows; rowIndex++) {
            for (let columnIndex = 0; columnIndex < gridCols; columnIndex++) {
                const dayNum = (rowIndex * gridCols) + columnIndex + 1;
                if (dayNum > totalDays) break;

                const boxX = xCoordinate + columnIndex * (boxSize + gap);
                const boxY = currentY + rowIndex * (boxSize + gap);

                if (dayNum < currentDayNum) context.fillStyle = theme.GRID_ACTIVE;
                else if (dayNum === currentDayNum) context.fillStyle = "#FFFFFF";
                else context.fillStyle = theme.GRID_INACTIVE;

                drawRoundedRect(context, boxX, boxY, boxSize, boxSize, 4, context.fillStyle);
            }
        }
        return (rows * (boxSize + gap)) + 100;

    } else if (mode === "weeks") {
        // YEAR GRID (52 Weeks - Current Year)
        const columns = 13;
        const rows = 4;
        const gap = 12;
        const boxSize = (contentWidth - (gap * (columns - 1))) / columns;
        const currentWeek = getWeekNumber(now);

        for (let rowIndex = 0; rowIndex < rows; rowIndex++) {
            for (let columnIndex = 0; columnIndex < columns; columnIndex++) {
                const index = (rowIndex * columns) + columnIndex;
                const weekNum = index + 1;
                const boxX = xCoordinate + columnIndex * (boxSize + gap);
                const boxY = currentY + rowIndex * (boxSize + gap);

                if (weekNum < currentWeek) context.fillStyle = theme.GRID_ACTIVE;
                else if (weekNum === currentWeek) context.fillStyle = "#FFFFFF";
                else context.fillStyle = theme.GRID_INACTIVE;

                drawRoundedRect(context, boxX, boxY, boxSize, boxSize, 6, context.fillStyle);
            }
        }
        return (rows * (boxSize + gap)) + 150;

    } else if (mode === "life") {
        // LIFE GRID (Whole Life in Weeks) - FULL DISPLAY
        const gridCols = 26;
        const gap = 6;
        const boxSize = (contentWidth - gap * (gridCols - 1)) / gridCols;
        const totalWeeks = Number(lifeExpectancy) * 52;
        const weeksLived = weeksBetween(new Date(dob), now);

        // Calculate max rows to fill available space
        const maxRows = Math.floor((height - currentY - 200) / (boxSize + gap));

        for (let i = 0; i < totalWeeks; i++) {
            const columnIndex = i % gridCols;
            const rowIndex = Math.floor(i / gridCols);

            if (rowIndex >= maxRows) break;

            const boxX = xCoordinate + columnIndex * (boxSize + gap);
            const boxY = currentY + rowIndex * (boxSize + gap);

            if (i < weeksLived) context.fillStyle = theme.GRID_ACTIVE;
            else if (i === weeksLived) context.fillStyle = "#FFFFFF";
            else context.fillStyle = theme.GRID_INACTIVE;

            drawRoundedRect(context, boxX, boxY, boxSize, boxSize, 2, context.fillStyle);
        }

        const drawnRows = Math.min(maxRows, Math.ceil(totalWeeks / gridCols));
        return (drawnRows * (boxSize + gap)) + 100;

    } else {
        // MONTHLY GRID (Current Month calendar)
        const columns = 7;
        const rows = 6;
        const gap = 16;
        const boxSize = (contentWidth - (gap * (columns - 1))) / columns;
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const dayOffset = startOfMonth.getDay();

        for (let rowIndex = 0; rowIndex < rows; rowIndex++) {
            for (let columnIndex = 0; columnIndex < columns; columnIndex++) {
                const dayIndex = (rowIndex * 7) + columnIndex;
                const date = new Date(startOfMonth);
                date.setDate(1 + dayIndex - dayOffset);

                const isToday = getDayString(date) === getDayString(now);
                const isInMonth = date.getMonth() === now.getMonth();
                const logCount = activityMap[getDayString(date)] || 0;
                const boxX = xCoordinate + columnIndex * (boxSize + gap);
                const boxY = currentY + rowIndex * (boxSize + gap);

                if (!isInMonth) context.fillStyle = "#18181b";
                else if (logCount > 0) context.fillStyle = theme.GRID_ACTIVE;
                else if (isToday) context.fillStyle = "#3f3f46";
                else context.fillStyle = theme.GRID_INACTIVE;

                drawRoundedRect(context, boxX, boxY, boxSize, boxSize, 8, context.fillStyle);
            }
        }
        return (rows * (boxSize + gap)) + 100;
    }
}

export function drawBottomSection(context, { xCoordinate, yCoordinate, width, height, theme, habits, settings, nowDay, now }) {
    const contentWidth = width;
    const columnWidth = (contentWidth - 40) / 2;
    const leftColumnX = xCoordinate;
    const rightColumnX = xCoordinate + columnWidth + 40;

    const getDayString = (date) => date.toISOString().split("T")[0];

    // LEFT: HABITS CHECKLIST
    if (habits.length > 0 && settings.showHabitLayer !== false) {
        let itemY = yCoordinate;
        context.textAlign = "left";
        context.fillStyle = theme.TEXT_SUB;
        context.font = "bold 20px Inter, sans-serif";
        context.fillText("HABITS", leftColumnX, itemY);
        itemY += 30;

        habits.slice(0, 4).forEach(habit => {
            const isDone = habit.logs.some(log => getDayString(new Date(log.date)) === nowDay);
            const boxSize = 24;

            context.beginPath();
            if (context.roundRect) context.roundRect(leftColumnX, itemY, boxSize, boxSize, 6);
            else context.rect(leftColumnX, itemY, boxSize, boxSize);

            if (isDone) {
                context.fillStyle = theme.ACCENT;
                context.fill();
                context.strokeStyle = theme.BG;
                context.lineWidth = 2.5;
                context.lineCap = "round";
                context.beginPath();
                context.moveTo(leftColumnX + 6, itemY + 12);
                context.lineTo(leftColumnX + 10, itemY + 16);
                context.lineTo(leftColumnX + 18, itemY + 8);
                context.stroke();
            } else {
                context.fillStyle = "#27272a";
                context.fill();
            }

            context.fillStyle = isDone ? "#52525b" : theme.TEXT_MAIN;
            context.font = "medium 20px Inter, sans-serif";
            const text = habit.title || "Untitled";
            const maxChars = 18;
            const display = text.length > maxChars ? text.substring(0, maxChars) + "..." : text;
            context.fillText(display, leftColumnX + 35, itemY + 19);

            itemY += 50;
        });
    }

    // RIGHT: GOAL SNIPPET
    if (settings.goalEnabled) {
        let cardY = yCoordinate;
        context.textAlign = "left";
        context.fillStyle = theme.TEXT_SUB;
        context.font = "bold 20px Inter, sans-serif";
        context.fillText("FOCUS", rightColumnX, cardY);

        context.fillStyle = theme.TEXT_MAIN;
        context.font = "bold 24px Inter, sans-serif";
        context.fillText(settings.goalTitle || "Goal", rightColumnX, cardY + 40);

        const barY = cardY + 60;
        const barHeight = 10;
        const barWidth = columnWidth;

        drawRoundedRect(context, rightColumnX, barY, barWidth, barHeight, 5, "rgba(255,255,255,0.1)");

        let progressPercentage = 0;
        if (settings.goalStartDate && settings.goalDurationDays) {
            progressPercentage = Math.min(100, Math.max(0, (now - new Date(settings.goalStartDate)) / (1000 * 60 * 60 * 24 * settings.goalDurationDays) * 100));
        }

        if (progressPercentage > 0) {
            const gradient = context.createLinearGradient(rightColumnX, 0, rightColumnX + barWidth, 0);
            gradient.addColorStop(0, theme.ACCENT);
            gradient.addColorStop(1, theme.ACCENT);
            drawRoundedRect(context, rightColumnX, barY, barWidth * (progressPercentage / 100), barHeight, 5, gradient);
        }

        context.fillStyle = theme.TEXT_SUB;
        context.font = "16px Inter, sans-serif";
        context.textAlign = "right";
        context.fillText(`${Math.round(progressPercentage)}% complete`, rightColumnX + barWidth, barY + 30);

        if (settings.goalStartDate && settings.goalDurationDays) {
            const daysPassed = (now - new Date(settings.goalStartDate)) / (1000 * 60 * 60 * 24);
            const daysLeft = Math.max(0, Math.ceil(settings.goalDurationDays - daysPassed));
            context.textAlign = "left";
            context.fillText(`${daysLeft} days left`, rightColumnX, barY + 30);
        }
    }
}

export function drawQuote(context, { xCoordinate, yCoordinate, width, height, quote, theme }) {
    context.save();
    context.textAlign = "center";
    context.fillStyle = "#525252";
    context.font = "medium 18px Inter, sans-serif";
    const quoteY = height - 100;
    context.fillText(quote.toUpperCase(), width / 2, quoteY);

    context.fillStyle = "#333";
    context.font = "14px Inter, sans-serif";
    context.fillText("CONSISTENCY GRID", width / 2, quoteY + 30);
    context.restore();
}

export function drawAdPlaceholder(context, { xCoordinate, yCoordinate, width, height, theme }) {
    drawRoundedRect(context, xCoordinate, yCoordinate, width, height, 12, "#111", "#333");

    context.fillStyle = theme.TEXT_SUB;
    context.textAlign = "center";
    context.font = "bold 14px Inter, sans-serif";
    context.fillText("ADVERTISEMENT", xCoordinate + width / 2, yCoordinate + height / 2 + 5);
}
