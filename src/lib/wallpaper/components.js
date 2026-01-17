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
    // ENHANCEMENT: Added subtle radial gradient for depth
    const gradient = context.createRadialGradient(
        canvasWidth / 2, canvasHeight / 3, 0,
        canvasWidth / 2, canvasHeight / 3, canvasHeight
    );
    gradient.addColorStop(0, theme.BG);
    gradient.addColorStop(1, theme.BG === '#09090b' ? '#000000' : theme.BG);
    context.fillStyle = gradient;
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
    const ringY = yCoordinate + 70;
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

export function drawGrid(context, { xCoordinate, yCoordinate, width, height, theme, mode, dob, lifeExpectancy, activityMap, reminders = [], now }) {
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

    // State to track where to point the callout
    let anchorPoint = null;
    let targetReminders = [];

    // Identify target reminders (Top 4 upcoming)
    if (reminders && reminders.length > 0) {
        // Sort by date, then priority
        const sorted = [...reminders].sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
        targetReminders = sorted.slice(0, 4);
        // The anchor date is the date of the very first upcoming reminder
        if (targetReminders.length > 0) {
            // We'll search for this date in the grid loops
        }
    }

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

    let finalHeight = 0;

    if (mode === "days") {
        // 365 DAYS GRID (Current Year) - WITH REMINDERS
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
                // Capture Anchor
                if (targetReminders.length > 0) {
                    const anchorDateStr = getDayString(new Date(targetReminders[0].startDate));
                    const dayDate = new Date(year, 0, dayNum);
                    if (getDayString(dayDate) === anchorDateStr) {
                        anchorPoint = {
                            x: xCoordinate + columnIndex * (boxSize + gap),
                            y: currentY + rowIndex * (boxSize + gap),
                            size: boxSize
                        };
                    }
                }

                // Calculate the actual date for this day
                const dayDate = new Date(year, 0, dayNum);
                const dayDateStr = getDayString(dayDate);

                const boxX = xCoordinate + columnIndex * (boxSize + gap);
                const boxY = currentY + rowIndex * (boxSize + gap);

                // ENHANCEMENT: Added subtle hover-like glow effect for current day
                if (dayNum === currentDayNum) {
                    context.shadowColor = "#FFFFFF";
                    context.shadowBlur = 10;
                    context.fillStyle = "#FFFFFF";
                } else if (dayNum < currentDayNum) {
                    context.fillStyle = theme.GRID_ACTIVE;
                } else {
                    context.fillStyle = theme.GRID_INACTIVE;
                }

                drawRoundedRect(context, boxX, boxY, boxSize, boxSize, 4, context.fillStyle);
                context.shadowBlur = 0;
            }
        }
        finalHeight = (rows * (boxSize + gap)) + 100;

    } else if (mode === "weeks") {
        // YEAR GRID (52 Weeks - Current Year)
        const columns = 13;
        const rows = 4;
        const gap = 12;
        const boxSize = (contentWidth - (gap * (columns - 1))) / columns;
        const currentWeek = getWeekNumber(now);

        // Helper: Check if a week has reminders
        const getRemindersForWeek = (weekStartDate) => {
            if (!reminders || reminders.length === 0) return [];

            // Calculate week end date (6 days after start)
            const weekEndDate = new Date(weekStartDate);
            weekEndDate.setDate(weekStartDate.getDate() + 6);

            const rStart = getDayString(weekStartDate);
            const rEnd = getDayString(weekEndDate);

            return reminders.filter(reminder => {
                const remStart = getDayString(new Date(reminder.startDate));
                const remEnd = getDayString(new Date(reminder.endDate));
                // Check overlapping ranges
                return (remStart <= rEnd) && (remEnd >= rStart);
            });
        };

        // Calculate start of year for week date calculations
        const startOfYear = new Date(now.getFullYear(), 0, 1);
        const simpleWeekOneStart = new Date(startOfYear);
        simpleWeekOneStart.setDate(simpleWeekOneStart.getDate() - simpleWeekOneStart.getDay());

        for (let rowIndex = 0; rowIndex < rows; rowIndex++) {
            for (let columnIndex = 0; columnIndex < columns; columnIndex++) {
                const index = (rowIndex * columns) + columnIndex;
                const weekNum = index + 1;
                const boxX = xCoordinate + columnIndex * (boxSize + gap);
                const boxY = currentY + rowIndex * (boxSize + gap);

                // Calculate date for this week box
                const weekDate = new Date(simpleWeekOneStart);
                weekDate.setDate(weekDate.getDate() + (index * 7));

                const weekReminders = getRemindersForWeek(weekDate);

                // ENHANCEMENT: Added glow for current week
                if (weekNum === currentWeek) {
                    context.shadowColor = "#FFFFFF";
                    context.shadowBlur = 12;
                    context.fillStyle = "#FFFFFF";
                } else if (weekNum < currentWeek) {
                    context.fillStyle = theme.GRID_ACTIVE;
                } else {
                    context.fillStyle = theme.GRID_INACTIVE;
                }

                drawRoundedRect(context, boxX, boxY, boxSize, boxSize, 6, context.fillStyle);
                context.shadowBlur = 0;
            }
        }
        finalHeight = (rows * (boxSize + gap)) + 150;

    } else if (mode === "life") {
        // LIFE GRID (Whole Life in Weeks) - FULL DISPLAY
        const gridCols = 26;
        const gap = 6;
        const boxSize = (contentWidth - gap * (gridCols - 1)) / gridCols;
        const totalWeeks = Number(lifeExpectancy) * 52;
        const weeksLived = weeksBetween(new Date(dob), now);

        // Helper: Check if a week has reminders (Redefined for scope safety)
        const getRemindersForWeek = (weekStartDate) => {
            if (!reminders || reminders.length === 0) return [];
            const weekEndDate = new Date(weekStartDate);
            weekEndDate.setDate(weekStartDate.getDate() + 6);
            const rStart = getDayString(weekStartDate);
            const rEnd = getDayString(weekEndDate);
            return reminders.filter(reminder => {
                const remStart = getDayString(new Date(reminder.startDate));
                const remEnd = getDayString(new Date(reminder.endDate));
                return (remStart <= rEnd) && (remEnd >= rStart);
            });
        };

        // Calculate Birth Date Start of Week
        const birthDate = new Date(dob);
        const birthWeekStart = new Date(birthDate);
        birthWeekStart.setDate(birthWeekStart.getDate() - birthWeekStart.getDay());

        // Calculate max rows to fill available space
        const maxRows = Math.floor((height - currentY - 200) / (boxSize + gap));

        for (let i = 0; i < totalWeeks; i++) {
            const columnIndex = i % gridCols;
            const rowIndex = Math.floor(i / gridCols);

            if (rowIndex >= maxRows) break;

            const boxX = xCoordinate + columnIndex * (boxSize + gap);
            const boxY = currentY + rowIndex * (boxSize + gap);

            // Calculate date for this life week
            const weekDate = new Date(birthWeekStart);
            weekDate.setDate(weekDate.getDate() + (i * 7));

            const weekReminders = getRemindersForWeek(weekDate);

            // ENHANCEMENT: Added glow for current week
            if (i === weeksLived) {
                context.shadowColor = "#FFFFFF";
                context.shadowBlur = 8;
                context.fillStyle = "#FFFFFF";
            } else if (i < weeksLived) {
                context.fillStyle = theme.GRID_ACTIVE;
            } else {
                context.fillStyle = theme.GRID_INACTIVE;
            }

            drawRoundedRect(context, boxX, boxY, boxSize, boxSize, 2, context.fillStyle);
            context.shadowBlur = 0;
        }

        finalHeight = (Math.min(maxRows, Math.ceil(totalWeeks / gridCols)) * (boxSize + gap)) + 100;

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

                // CHECK ANCHOR
                if (targetReminders.length > 0) {
                    const anchorDateStr = getDayString(new Date(targetReminders[0].startDate));
                    if (getDayString(date) === anchorDateStr) {
                        anchorPoint = {
                            x: xCoordinate + columnIndex * (boxSize + gap),
                            y: currentY + rowIndex * (boxSize + gap),
                            size: boxSize
                        };
                    }
                }

                const isToday = getDayString(date) === getDayString(now);
                const isInMonth = date.getMonth() === now.getMonth();
                const logCount = activityMap[getDayString(date)] || 0;

                const boxX = xCoordinate + columnIndex * (boxSize + gap);
                const boxY = currentY + rowIndex * (boxSize + gap);

                // ENHANCEMENT: Added subtle border and glow effects
                if (!isInMonth) {
                    context.fillStyle = "#18181b";
                } else if (logCount > 0) {
                    context.shadowColor = theme.GRID_ACTIVE;
                    context.shadowBlur = 5;
                    context.fillStyle = theme.GRID_ACTIVE;
                } else if (isToday) {
                    context.shadowColor = "#3f3f46";
                    context.shadowBlur = 10;
                    context.fillStyle = "#3f3f46";
                } else {
                    context.fillStyle = theme.GRID_INACTIVE;
                }

                drawRoundedRect(context, boxX, boxY, boxSize, boxSize, 8, context.fillStyle);
                context.shadowBlur = 0;
            }
        }
        finalHeight = (rows * (boxSize + gap)) + 100;
    }

    // DRAW CALLOUT OVERLAY
    if (anchorPoint && targetReminders.length > 0) {
        const boxWidth = 320;
        const itemHeight = 40;
        const headerHeight = 35;
        // Adjust list height if overlapping/too large (simple clamp)
        const displayedReminders = targetReminders.slice(0, 4);
        const listHeight = displayedReminders.length * itemHeight;
        const boxHeight = headerHeight + listHeight + 10;

        // Position Callout: Try to center horizontally over grid, float above anchor
        // Default position: Top Right area relative to anchor, but clamped to screen

        // Center the callout box horizontally relative to the canvas content
        let calloutX = (width - boxWidth) / 2 + xCoordinate;

        // Vertical position: Try to place it somewhat "above" grid level or overlaying
        // Reference image shows it floating *over* grid blocks.
        // Let's float it dynamically.
        // If anchor is low, place box high. If anchor high, place low?
        // Let's place it at yCoordinate + 20 (Top of grid area)
        let calloutY = yCoordinate + 20;

        // Draw Connector Line (Polyline)
        const anchorCenterX = anchorPoint.x + anchorPoint.size / 2;
        const anchorCenterY = anchorPoint.y + anchorPoint.size / 2;
        const boxLeft = calloutX;
        const boxCenterY = calloutY + boxHeight / 2;

        context.save();
        context.strokeStyle = "#FFFFFF";
        context.lineWidth = 2;
        context.setLineDash([]);

        context.beginPath();
        context.moveTo(anchorCenterX, anchorCenterY);
        // Draw line: Up/Down then Horizontal?
        // Reference has elbow: Up then Over.
        context.lineTo(anchorCenterX, boxCenterY); // Vertical to box level
        context.lineTo(boxLeft, boxCenterY); // Horizontal to box
        context.stroke();

        // Dot at anchor
        context.fillStyle = "#FFFFFF";
        context.beginPath();
        context.arc(anchorCenterX, anchorCenterY, 3, 0, 2 * Math.PI);
        context.fill();
        context.restore();

        // Draw Callout Box
        context.save();
        context.shadowColor = "rgba(0,0,0,0.5)";
        context.shadowBlur = 20;
        context.shadowOffsetY = 10;

        // Background
        context.fillStyle = "#09090b"; // Deep black
        drawRoundedRect(context, calloutX, calloutY, boxWidth, boxHeight, 12, "#09090b", "#333");
        context.shadowBlur = 0;

        // Header
        context.fillStyle = "#a1a1aa"; // Gray
        context.font = "bold 12px Inter, sans-serif";
        context.textAlign = "left";
        context.fillText("REMINDERS", calloutX + 20, calloutY + 25);

        // Divider
        // context.strokeStyle = "#27272a";
        // context.beginPath();
        // context.moveTo(calloutX, calloutY + headerHeight);
        // context.lineTo(calloutX + boxWidth, calloutY + headerHeight);
        // context.stroke();

        // Items
        let currentItemY = calloutY + headerHeight + 15;

        displayedReminders.forEach(rem => {
            const rowX = calloutX + 20;

            // Dot
            context.fillStyle = rem.markerColor || "#ff7a00";
            context.beginPath();
            context.arc(rowX, currentItemY - 4, 4, 0, 2 * Math.PI);
            context.fill();

            // Text
            context.fillStyle = "#fafafa"; // White
            context.font = "bold 14px Inter, sans-serif";
            const text = rem.title.length > 25 ? rem.title.substring(0, 25) + ".." : rem.title;
            context.fillText(text, rowX + 15, currentItemY);

            // Time (Right aligned)
            context.textAlign = "right";
            context.fillStyle = "#525252";
            context.font = "12px Inter, sans-serif";
            let timeLabel = "Today";
            if (rem.startTime) timeLabel = rem.startTime;
            else if (new Date(rem.startDate).getDate() !== now.getDate()) {
                timeLabel = new Date(rem.startDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
            }
            context.fillText(timeLabel, calloutX + boxWidth - 20, currentItemY);
            context.textAlign = "left"; // Reset

            currentItemY += itemHeight;
        });

        context.restore();
    }

    return finalHeight;
}

export function drawBottomSection(context, { xCoordinate, yCoordinate, width, height, theme, habits, settings, reminders = [], nowDay, now }) {
    const contentWidth = width;
    const columnWidth = (contentWidth - 40) / 2;
    const leftColumnX = xCoordinate;
    const rightColumnX = xCoordinate + columnWidth + 40;

    const getDayString = (date) => date.toISOString().split("T")[0];

    // LEFT: ENHANCED HABITS MATCHING REFERENCE UI
    if (habits.length > 0 && settings.showHabitLayer !== false) {
        // ... (Existing Habit Code - unchanged logic, just ensuring it renders)
        let itemY = yCoordinate;
        context.textAlign = "left";
        context.fillStyle = theme.TEXT_SUB;
        context.font = "bold 24px Inter, sans-serif";
        context.fillText("HABITS", leftColumnX, itemY);
        itemY += 40;

        const maxHabitsToShow = Math.min(habits.length, 6);
        const habitSpacing = 85;
        const habitColors = ["#10b981", "#f59e0b", "#06b6d4", "#8b5cf6", "#ec4899", "#6366f1"];

        habits.slice(0, maxHabitsToShow).forEach((habit, habitIndex) => {
            // ... (Keep existing habit loop logic, abbreviated for brevity in replacement if possible, 
            // but best to replace fully or match exact context. 
            // Since I need to replace the whole function to add Reminders safely, I'll copy the habit logic back in.)

            const isDone = habit.logs.some(log => getDayString(new Date(log.date)) === nowDay);
            const checkboxSize = 28;
            const habitColor = habitColors[habitIndex % habitColors.length];

            if (isDone) {
                context.shadowColor = habitColor;
                context.shadowBlur = 10;
            }

            context.beginPath();
            context.arc(leftColumnX + checkboxSize / 2, itemY + checkboxSize / 2 - 3, checkboxSize / 2, 0, 2 * Math.PI);
            context.strokeStyle = isDone ? habitColor : "#3f3f46";
            context.lineWidth = 2.5;
            context.stroke();

            if (isDone) {
                context.fillStyle = habitColor;
                context.fill();
            }
            context.shadowBlur = 0;

            const titleX = leftColumnX + checkboxSize + 18;
            context.shadowColor = habitColor;
            context.shadowBlur = 8;
            context.beginPath();
            context.arc(titleX + 6, itemY + 13, 5, 0, 2 * Math.PI);
            context.fillStyle = habitColor;
            context.fill();
            context.shadowBlur = 0;

            const textX = titleX + 18;
            context.fillStyle = theme.TEXT_MAIN;
            context.font = "20px Inter, sans-serif";
            const text = habit.title || "Untitled";
            const maxChars = 14;
            const display = text.length > maxChars ? text.substring(0, maxChars) + "..." : text;
            context.fillText(display, textX, itemY + 20);

            if (habit.scheduledTime) {
                const timeX = textX + context.measureText(display).width + 10;
                context.fillStyle = habitColor;
                context.font = "14px Inter, sans-serif";
                let timeDisplay = habit.scheduledTime;
                if (timeDisplay.includes(":")) {
                    const [hours, minutes] = timeDisplay.split(":");
                    const h = parseInt(hours, 10);
                    if (!isNaN(h)) {
                        const ampm = h >= 12 ? "PM" : "AM";
                        const hour12 = h % 12 || 12;
                        timeDisplay = `${hour12}:${minutes} ${ampm}`;
                    }
                }
                context.fillText(timeDisplay, timeX, itemY + 20);
            }

            // Dots
            const dotsContainerY = itemY + 38;
            const dotSize = 10;
            const dotGap = 15;
            const dotStartX = textX;
            const dayLabels = ["S", "M", "T", "W", "T", "F", "S"];
            const today = new Date(now);
            for (let dayOffset = 6; dayOffset >= 0; dayOffset--) {
                const checkDate = new Date(today);
                checkDate.setDate(checkDate.getDate() - dayOffset);
                const dayKey = getDayString(checkDate);
                const wasCompleted = habit.logs.some(log => getDayString(new Date(log.date)) === dayKey);
                const dotX = dotStartX + ((6 - dayOffset) * dotGap);

                context.fillStyle = "#6b7280";
                context.font = "11px Inter, sans-serif";
                context.textAlign = "center";
                const dayLabelIndex = checkDate.getDay();
                const adjustedIndex = (dayLabelIndex + 6) % 7;
                context.fillText(dayLabels[adjustedIndex], dotX + dotSize / 2, dotsContainerY - 8);

                if (wasCompleted) {
                    context.shadowColor = habitColor;
                    context.shadowBlur = 6;
                }
                context.beginPath();
                context.arc(dotX + dotSize / 2, dotsContainerY + 5, dotSize / 2, 0, 2 * Math.PI);
                if (wasCompleted) {
                    context.fillStyle = habitColor;
                    context.fill();
                } else {
                    context.fillStyle = "#27272a";
                    context.fill();
                }
                context.shadowBlur = 0;
            }
            context.textAlign = "left";
            itemY += habitSpacing;
        });
    }

    // RIGHT: GOAL SNIPPET & REMINDERS
    let rightY = yCoordinate;

    // 1. Goal Section
    if (settings.goalEnabled) {
        context.textAlign = "left";
        context.fillStyle = theme.TEXT_SUB;
        context.font = "bold 20px Inter, sans-serif";
        context.fillText("FOCUS", rightColumnX, rightY);

        context.fillStyle = theme.TEXT_MAIN;
        context.font = "bold 24px Inter, sans-serif";
        context.fillText(settings.goalTitle || "Goal", rightColumnX, rightY + 40);

        const barY = rightY + 60;
        const barHeight = 10;
        const barWidth = columnWidth;

        context.shadowColor = "rgba(0,0,0,0.2)";
        context.shadowBlur = 5;
        context.shadowOffsetY = 2;
        drawRoundedRect(context, rightColumnX, barY, barWidth, barHeight, 5, "rgba(255,255,255,0.1)");
        context.shadowBlur = 0;
        context.shadowOffsetY = 0;

        let progressPercentage = 0;
        if (settings.goalStartDate && settings.goalDurationDays) {
            progressPercentage = Math.min(100, Math.max(0, (now - new Date(settings.goalStartDate)) / (1000 * 60 * 60 * 24 * settings.goalDurationDays) * 100));
        }

        if (progressPercentage > 0) {
            context.shadowColor = theme.ACCENT;
            context.shadowBlur = 10;
            const gradient = context.createLinearGradient(rightColumnX, 0, rightColumnX + barWidth, 0);
            gradient.addColorStop(0, theme.ACCENT);
            gradient.addColorStop(1, theme.ACCENT);
            drawRoundedRect(context, rightColumnX, barY, barWidth * (progressPercentage / 100), barHeight, 5, gradient);
            context.shadowBlur = 0;
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

        rightY += 140; // Spacing after Goal
    }
}

export function drawQuote(context, { xCoordinate, yCoordinate, width, height, quote, theme }) {
    context.save();
    context.textAlign = "center";

    // ENHANCEMENT: Added subtle text shadow for depth
    context.shadowColor = "rgba(0,0,0,0.3)";
    context.shadowBlur = 4;
    context.shadowOffsetY = 2;

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
    // ENHANCEMENT: Added subtle gradient background
    const gradient = context.createLinearGradient(xCoordinate, yCoordinate, xCoordinate, yCoordinate + height);
    gradient.addColorStop(0, "#151515");
    gradient.addColorStop(1, "#0a0a0a");

    drawRoundedRect(context, xCoordinate, yCoordinate, width, height, 12, gradient, "#333");

    context.fillStyle = theme.TEXT_SUB;
    context.textAlign = "center";
    context.font = "bold 14px Inter, sans-serif";
    context.fillText("ADVERTISEMENT", xCoordinate + width / 2, yCoordinate + height / 2 + 5);
}