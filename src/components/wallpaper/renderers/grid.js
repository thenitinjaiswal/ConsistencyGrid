import { drawRoundedRect, drawSafeText } from "./utils";

export function drawGrid(
    context,
    {
        xCoordinate,
        yCoordinate,
        width,
        height,
        theme,
        themeName = "dark-minimal",
        mode,
        dob,
        lifeExpectancy,
        activityMap,
        totalHabits = 1,
        reminders = [],
        now,
    }
) {
    let currentY = yCoordinate;

    // Enhanced title with better typography and spacing
    let titleText = "";
    let subtitleText = "";
    let progressMetric = "";

    if (mode === "days") {
        titleText = "365 DAYS";
        const year = now.getFullYear();
        const isLeap = (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
        subtitleText = `${year} • ${isLeap ? '366' : '365'} days to make count`;
        const dayOfYear = getDayOfYear(now);
        const daysPercent = Math.round((dayOfYear / (isLeap ? 366 : 365)) * 100);
        progressMetric = `${daysPercent}% complete`;
    } else if (mode === "weeks") {
        titleText = now.getFullYear() + " PROGRESS";
        subtitleText = "52 weeks of opportunity";
        const weekNum = getWeekNumber(now);
        progressMetric = `Week ${weekNum}/52`;
    } else if (mode === "life") {
        titleText = "LIFE PROGRESS";
        const birthDate = new Date(dob);
        const age = Math.floor((now - birthDate) / (365.25 * 24 * 60 * 60 * 1000));
        subtitleText = `${age} years • ${lifeExpectancy} years life expectancy`;
        const weeksLived = weeksBetween(birthDate, now);
        const totalWeeks = lifeExpectancy * 52;
        const lifePercent = Math.round((weeksLived / totalWeeks) * 100);
        progressMetric = `${lifePercent}% of life lived`;
    } else {
        const monthName = now.toLocaleString("default", { month: "long" }).toUpperCase();
        titleText = monthName + " " + now.getFullYear();
        const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
        const dayOfMonth = now.getDate();
        subtitleText = `${daysInMonth} days in this month`;
        progressMetric = `Day ${dayOfMonth}/${daysInMonth}`;
    }

    // Premium header with improved spacing and styling
    context.save();
    context.shadowColor = "rgba(0, 0, 0, 0.6)";
    context.shadowBlur = 16;
    context.shadowOffsetY = 6;

    const gradient = context.createLinearGradient(
        xCoordinate,
        currentY - 20,
        xCoordinate + 400,
        currentY + 20
    );
    gradient.addColorStop(0, theme.TEXT_PRIMARY || "#ffffff");
    gradient.addColorStop(0.5, theme.TEXT_PRIMARY || "#fafafa");
    gradient.addColorStop(1, theme.TEXT_SUB || "#a1a1aa");

    drawSafeText(context, titleText, xCoordinate, currentY, {
        font: "bold 52px Inter, sans-serif",
        color: gradient,
        shadow: false,
    });

    currentY += 62;

    // Decorative line under title with gradient
    const lineGradient = context.createLinearGradient(xCoordinate, currentY - 8, xCoordinate + 200, currentY - 8);
    lineGradient.addColorStop(0, theme.ACCENT || "rgba(255, 255, 255, 0.3)");
    lineGradient.addColorStop(1, "rgba(255, 255, 255, 0.05)");
    context.strokeStyle = lineGradient;
    context.lineWidth = 3;
    context.beginPath();
    context.moveTo(xCoordinate, currentY - 8);
    context.lineTo(xCoordinate + 140, currentY - 8);
    context.stroke();

    context.shadowBlur = 0;
    context.shadowOffsetY = 0;

    // Enhanced subtitle section with progress metric
    drawSafeText(context, subtitleText, xCoordinate, currentY + 20, {
        font: "500 15px Inter, sans-serif",
        color: theme.TEXT_SUB || "#71717a",
        shadow: false,
    });

    // Progress metric badge
    const badgeX = xCoordinate + 320;
    const badgeY = currentY + 4;
    drawRoundedRect(
        context,
        badgeX,
        badgeY,
        100,
        32,
        12,
        "rgba(255, 255, 255, 0.08)",
        "rgba(255, 255, 255, 0.15)"
    );

    drawSafeText(context, progressMetric, badgeX + 50, badgeY + 21, {
        font: "600 12px Inter, sans-serif",
        color: theme.ACCENT || "rgba(255, 255, 255, 0.7)",
        shadow: false,
    });

    currentY += 68;
    const contentWidth = width;

    // Helper functions
    const getDayString = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
    };

    const getWeekNumber = (dateInstance) => {
        const date = new Date(
            Date.UTC(
                dateInstance.getFullYear(),
                dateInstance.getMonth(),
                dateInstance.getDate()
            )
        );
        date.setUTCDate(date.getUTCDate() + 4 - (date.getUTCDay() || 7));
        const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
        return Math.ceil(((date - yearStart) / 86400000 + 1) / 7);
    };

    const getDayOfYear = (dateInstance) => {
        const start = new Date(dateInstance.getFullYear(), 0, 0);
        const diff = dateInstance - start;
        const oneDay = 1000 * 60 * 60 * 24;
        return Math.floor(diff / oneDay);
    };

    const weeksBetween = (d1, d2) =>
        Math.floor((d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24 * 7));

    // Reminder tracking
    let anchorPoint = null;
    let targetReminders = [];
    let reminderDate = null;

    if (reminders && reminders.length > 0) {
        const toLocalYMD = (d) =>
            `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
                d.getDate()
            ).padStart(2, "0")}`;

        let startDate, endDate;

        if (mode === "month") {
            startDate = new Date(now.getFullYear(), now.getMonth(), 1);
            endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        } else if (mode === "days") {
            startDate = new Date(now.getFullYear(), 0, 1);
            endDate = new Date(now.getFullYear(), 11, 31);
        } else if (mode === "weeks") {
            startDate = new Date(now.getFullYear(), 0, 1);
            endDate = new Date(now.getFullYear(), 11, 31);
        } else {
            startDate = new Date(now.getFullYear(), now.getMonth(), 1);
            endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        }

        const visibleReminders = reminders.filter((r) => {
            const rDate = new Date(r.startDate);
            return rDate >= startDate && rDate <= endDate;
        });

        const remindersByDate = {};
        visibleReminders.forEach((r) => {
            const dateKey = toLocalYMD(new Date(r.startDate));
            if (!remindersByDate[dateKey]) {
                remindersByDate[dateKey] = [];
            }
            remindersByDate[dateKey].push(r);
        });

        const todayYMD = toLocalYMD(now);
        if (remindersByDate[todayYMD]) {
            reminderDate = todayYMD;
            targetReminders = remindersByDate[todayYMD];
        } else {
            const sortedDates = Object.keys(remindersByDate).sort();
            if (sortedDates.length > 0) {
                reminderDate = sortedDates[0];
                targetReminders = remindersByDate[reminderDate];
            }
        }

        targetReminders.sort((a, b) =>
            (a.startTime || "00:00").localeCompare(b.startTime || "00:00")
        );
        targetReminders = targetReminders.slice(0, 4);
    }

    // Enhanced heatmap palettes with better gradients
    const HEATMAP_PALETTES = {
        "dark-minimal": {
            light: "#52525b",
            medium: "#71717a",
            dark: "#a1a1aa",
            full: "#ffffff",
            glow: "rgba(255, 255, 255, 0.4)",
        },
        "sunset-orange": { light: "#fed7aa", medium: "#fb923c", dark: "#f97316", full: "#ea580c", glow: "rgba(234, 88, 12, 0.5)" },
        "ocean-blue": { light: "#bfdbfe", medium: "#60a5fa", dark: "#3b82f6", full: "#2563eb", glow: "rgba(37, 99, 235, 0.5)" },
        "forest-green": { light: "#bbf7d0", medium: "#4ade80", dark: "#22c55e", full: "#16a34a", glow: "rgba(22, 163, 74, 0.5)" },
        "purple-haze": { light: "#e9d5ff", medium: "#c084fc", dark: "#a855f7", full: "#9333ea", glow: "rgba(147, 51, 234, 0.5)" },
        "monochrome": { light: "#71717a", medium: "#52525b", dark: "#3f3f46", full: "#27272a", glow: "rgba(39, 39, 42, 0.5)" },
    };

    const getHeatmapColor = (completionPercentage) => {
        const palette =
            HEATMAP_PALETTES[themeName] || HEATMAP_PALETTES["dark-minimal"];

        if (completionPercentage === 0) return theme.GRID_INACTIVE || "#27272a";
        if (completionPercentage <= 25) return palette.light;
        if (completionPercentage <= 50) return palette.medium;
        if (completionPercentage <= 75) return palette.dark;
        return palette.full;
    };

    // Premium box drawing with enhanced visual effects
    const drawEnhancedBox = (x, y, size, fillColor, isHighlight, borderRadius = 4) => {
        context.save();

        if (isHighlight) {
            const palette = HEATMAP_PALETTES[themeName] || HEATMAP_PALETTES["dark-minimal"];

            // Multiple glow rings for premium effect
            for (let i = 4; i > 0; i--) {
                context.globalAlpha = 0.2 / i;
                context.fillStyle = palette.full || palette.glow;
                drawRoundedRect(context, x - i * 2.5, y - i * 2.5, size + i * 5, size + i * 5, borderRadius + 3);
            }

            context.globalAlpha = 1;
        }

        const isInactive = fillColor === (theme.GRID_INACTIVE || "#27272a") || fillColor === "#18181b";

        if (!isInactive) {
            context.shadowColor = "rgba(0, 0, 0, 0.5)";
            context.shadowBlur = 12;
            context.shadowOffsetY = 4;
        }

        const borderColor = isHighlight
            ? (HEATMAP_PALETTES[themeName] || HEATMAP_PALETTES["dark-minimal"]).full
            : isInactive
                ? "#2a2a2d"
                : fillColor;

        context.fillStyle = fillColor;
        drawRoundedRect(context, x, y, size, size, borderRadius, fillColor, borderColor);

        // Enhanced inner shine effect
        if (!isInactive) {
            context.shadowBlur = 0;
            const highlightGradient = context.createLinearGradient(x + 2, y + 2, x + size - 2, y + size - 2);
            highlightGradient.addColorStop(0, "rgba(255, 255, 255, 0.25)");
            highlightGradient.addColorStop(0.4, "rgba(255, 255, 255, 0.08)");
            highlightGradient.addColorStop(1, "rgba(0, 0, 0, 0.1)");
            context.fillStyle = highlightGradient;
            drawRoundedRect(context, x + 1.5, y + 1.5, size - 3, size - 3, borderRadius - 1);
        }

        context.restore();
    };

    let finalHeight = 0;

    // Days mode - 365 day grid
    if (mode === "days") {
        const gridCols = 25;
        const gap = 12;
        const boxSize = (contentWidth - gap * (gridCols - 1)) / gridCols;
        const year = now.getFullYear();
        const isLeap = (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
        const totalDays = isLeap ? 366 : 365;
        const currentDayNum = getDayOfYear(now);
        const rows = Math.ceil(totalDays / gridCols);

        for (let rowIndex = 0; rowIndex < rows; rowIndex++) {
            for (let columnIndex = 0; columnIndex < gridCols; columnIndex++) {
                const dayNum = rowIndex * gridCols + columnIndex + 1;
                if (dayNum > totalDays) break;

                const dayDate = new Date(year, 0, dayNum);
                const dayDateStr = getDayString(dayDate);
                const boxX = xCoordinate + columnIndex * (boxSize + gap);
                const boxY = currentY + rowIndex * (boxSize + gap);

                if (targetReminders.length > 0 && reminderDate && dayDateStr === reminderDate) {
                    anchorPoint = { x: boxX, y: boxY, size: boxSize };
                }

                let fillColor;
                const isToday = dayNum === currentDayNum;

                if (isToday) {
                    const palette = HEATMAP_PALETTES[themeName] || HEATMAP_PALETTES["dark-minimal"];
                    fillColor = palette.full;
                } else if (dayNum < currentDayNum) {
                    const logCount = activityMap[dayDateStr] || 0;
                    const completionPercentage = totalHabits > 0 ? (logCount / totalHabits) * 100 : 0;
                    fillColor = getHeatmapColor(completionPercentage);
                } else {
                    fillColor = theme.GRID_INACTIVE || "#27272a";
                }

                drawEnhancedBox(boxX, boxY, boxSize, fillColor, isToday, 6);
            }
        }
        finalHeight = rows * (boxSize + gap) + 150;
    }
    // Weeks mode - 52 week grid
    else if (mode === "weeks") {
        const columns = 13;
        const rows = 4;
        const gap = 16;
        const boxSize = (contentWidth - gap * (columns - 1)) / columns;
        const currentWeek = getWeekNumber(now);
        const startOfYear = new Date(now.getFullYear(), 0, 1);
        const simpleWeekOneStart = new Date(startOfYear);
        simpleWeekOneStart.setDate(simpleWeekOneStart.getDate() - simpleWeekOneStart.getDay());

        for (let rowIndex = 0; rowIndex < rows; rowIndex++) {
            for (let columnIndex = 0; columnIndex < columns; columnIndex++) {
                const index = rowIndex * columns + columnIndex;
                const weekNum = index + 1;
                const boxX = xCoordinate + columnIndex * (boxSize + gap);
                const boxY = currentY + rowIndex * (boxSize + gap);

                const weekDate = new Date(simpleWeekOneStart);
                weekDate.setDate(weekDate.getDate() + index * 7);

                let fillColor;
                const isCurrentWeek = weekNum === currentWeek;

                if (isCurrentWeek) {
                    const palette = HEATMAP_PALETTES[themeName] || HEATMAP_PALETTES["dark-minimal"];
                    fillColor = palette.full;
                } else if (weekNum < currentWeek) {
                    let weekActivityCount = 0;
                    for (let i = 0; i < 7; i++) {
                        const dayDate = new Date(weekDate);
                        dayDate.setDate(dayDate.getDate() + i);
                        const dayStr = getDayString(dayDate);
                        weekActivityCount += activityMap[dayStr] || 0;
                    }
                    const completionPercentage = totalHabits > 0
                        ? Math.min(100, (weekActivityCount / (totalHabits * 7)) * 100)
                        : 0;
                    fillColor = getHeatmapColor(completionPercentage);
                } else {
                    fillColor = theme.GRID_INACTIVE || "#27272a";
                }

                drawEnhancedBox(boxX, boxY, boxSize, fillColor, isCurrentWeek, 9);
            }
        }
        finalHeight = rows * (boxSize + gap) + 200;
    }
    // Life mode - entire life grid
    else if (mode === "life") {
        const gridCols = 52;
        const gap = 5;
        const totalWeeks = Number(lifeExpectancy) * 52;
        const rowsNeeded = Math.ceil(totalWeeks / gridCols);
        const weeksLived = weeksBetween(new Date(dob), now);
        const availableHeight = Math.max(400, height - currentY - 150);
        const sizeByWidth = (contentWidth - gap * (gridCols - 1)) / gridCols;
        const sizeByHeight = (availableHeight - gap * (rowsNeeded - 1)) / rowsNeeded;
        const boxSize = Math.max(3.5, Math.min(sizeByWidth, sizeByHeight));

        const birthDate = new Date(dob);
        const birthWeekStart = new Date(birthDate);
        birthWeekStart.setDate(birthWeekStart.getDate() - birthWeekStart.getDay());

        for (let i = 0; i < totalWeeks; i++) {
            const columnIndex = i % gridCols;
            const rowIndex = Math.floor(i / gridCols);
            const boxX = xCoordinate + columnIndex * (boxSize + gap);
            const boxY = currentY + rowIndex * (boxSize + gap);

            const weekDate = new Date(birthWeekStart);
            weekDate.setDate(weekDate.getDate() + i * 7);

            let fillColor;
            const isCurrentWeek = i === weeksLived;

            if (isCurrentWeek) {
                const palette = HEATMAP_PALETTES[themeName] || HEATMAP_PALETTES["dark-minimal"];
                fillColor = palette.full;
            } else if (i < weeksLived) {
                let weekActivityCount = 0;
                for (let j = 0; j < 7; j++) {
                    const dayDate = new Date(weekDate);
                    dayDate.setDate(dayDate.getDate() + j);
                    const dayStr = getDayString(dayDate);
                    weekActivityCount += activityMap[dayStr] || 0;
                }
                const completionPercentage = totalHabits > 0
                    ? Math.min(100, (weekActivityCount / (totalHabits * 7)) * 100)
                    : 0;
                fillColor = getHeatmapColor(completionPercentage);
            } else {
                fillColor = theme.GRID_INACTIVE || "#27272a";
            }

            drawEnhancedBox(boxX, boxY, boxSize, fillColor, isCurrentWeek, Math.max(2, boxSize / 3.5));
        }

        finalHeight = rowsNeeded * (boxSize + gap) + 120;
    }
    // Monthly calendar mode
    else {
        const columns = 7;
        const rows = 6;
        const gap = 20;
        const boxSize = (contentWidth - gap * (columns - 1)) / columns;
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const dayOffset = startOfMonth.getDay();

        // Day labels with enhanced styling
        const dayLabels = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
        const labelY = currentY + 4;

        for (let i = 0; i < 7; i++) {
            const labelX = xCoordinate + i * (boxSize + gap) + boxSize / 2;

            // Enhanced background for day labels
            context.fillStyle = "rgba(255, 255, 255, 0.08)";
            drawRoundedRect(context, labelX - boxSize / 2 - 2, labelY - 16, boxSize + 4, 28, 8);

            context.textAlign = "center";
            drawSafeText(context, dayLabels[i], labelX, labelY + 10, {
                font: "700 11px Inter, sans-serif",
                color: theme.TEXT_SUB || "#71717a",
                shadow: false,
            });
            context.textAlign = "left";
        }
        currentY += 40;

        for (let rowIndex = 0; rowIndex < rows; rowIndex++) {
            for (let columnIndex = 0; columnIndex < columns; columnIndex++) {
                const dayIndex = rowIndex * 7 + columnIndex;
                const date = new Date(startOfMonth);
                date.setDate(1 + dayIndex - dayOffset);

                const boxX = xCoordinate + columnIndex * (boxSize + gap);
                const boxY = currentY + rowIndex * (boxSize + gap);

                if (targetReminders.length > 0 && reminderDate && getDayString(date) === reminderDate) {
                    anchorPoint = { x: boxX, y: boxY, size: boxSize };
                }

                const isToday = getDayString(date) === getDayString(now);
                const isInMonth = date.getMonth() === now.getMonth();
                const logCount = activityMap[getDayString(date)] || 0;

                let fillColor;
                if (!isInMonth) {
                    fillColor = "#18181b";
                } else if (isToday) {
                    const completionPercentage = totalHabits > 0 ? (logCount / totalHabits) * 100 : 0;
                    if (completionPercentage > 0) {
                        fillColor = getHeatmapColor(completionPercentage);
                    } else {
                        const palette = HEATMAP_PALETTES[themeName] || HEATMAP_PALETTES["dark-minimal"];
                        fillColor = palette.full;
                    }
                } else if (logCount > 0) {
                    const completionPercentage = totalHabits > 0 ? (logCount / totalHabits) * 100 : 0;
                    fillColor = getHeatmapColor(completionPercentage);
                } else {
                    fillColor = theme.GRID_INACTIVE || "#27272a";
                }

                drawEnhancedBox(boxX, boxY, boxSize, fillColor, isToday, 11);

                // Draw date number with enhanced styling
                if (isInMonth) {
                    context.textAlign = "center";
                    const textColor = isToday ? "#09090b" : logCount > 0 ? "#fafafa" : "#71717a";

                    if (isToday) {
                        drawSafeText(
                            context,
                            date.getDate().toString(),
                            boxX + boxSize / 2,
                            boxY + boxSize / 2 + 8,
                            {
                                font: "bold 20px Inter, sans-serif",
                                color: textColor,
                                shadow: false,
                            }
                        );
                    } else if (logCount > 0) {
                        drawSafeText(
                            context,
                            date.getDate().toString(),
                            boxX + boxSize / 2,
                            boxY + boxSize / 2 + 7,
                            {
                                font: "700 16px Inter, sans-serif",
                                color: textColor,
                                shadow: false,
                            }
                        );
                    } else {
                        drawSafeText(
                            context,
                            date.getDate().toString(),
                            boxX + boxSize / 2,
                            boxY + boxSize / 2 + 7,
                            {
                                font: "600 15px Inter, sans-serif",
                                color: textColor,
                                shadow: false,
                            }
                        );
                    }
                    context.textAlign = "left";
                }
            }
        }
        finalHeight = rows * (boxSize + gap) + 160;
    }

    // Enhanced reminder callout with improved design
    if (anchorPoint && targetReminders.length > 0) {
        const boxWidth = 360;
        const itemHeight = 64;
        const headerHeight = 52;
        const padding = 20;
        const displayedReminders = targetReminders.slice(0, 4);
        const listHeight = displayedReminders.length * itemHeight;
        const boxHeight = headerHeight + listHeight + padding;

        let calloutX = anchorPoint.x - boxWidth / 2 + anchorPoint.size / 2;
        let calloutY = anchorPoint.y - boxHeight - 60;

        if (calloutX < xCoordinate) {
            calloutX = xCoordinate + 10;
        }
        if (calloutX + boxWidth > xCoordinate + width) {
            calloutX = xCoordinate + width - boxWidth - 10;
        }
        if (calloutY < yCoordinate) {
            calloutY = anchorPoint.y + anchorPoint.size + 20;
        }

        context.save();

        // White connection line with gradient
        const lineGradient = context.createLinearGradient(
            anchorPoint.x + anchorPoint.size / 2,
            anchorPoint.y + anchorPoint.size / 2,
            calloutX + boxWidth / 2,
            calloutY + boxHeight
        );
        lineGradient.addColorStop(0, "rgba(255, 255, 255, 0.9)");
        lineGradient.addColorStop(1, "rgba(255, 255, 255, 0.4)");
        context.strokeStyle = lineGradient;
        context.lineWidth = 2.5;

        context.beginPath();
        const anchorCenterX = anchorPoint.x + anchorPoint.size / 2;
        const anchorCenterY = anchorPoint.y + anchorPoint.size / 2;
        const calloutBottomCenterX = calloutX + boxWidth / 2;
        const calloutBottomY = calloutY + boxHeight;

        context.moveTo(anchorCenterX, anchorCenterY);
        context.lineTo(calloutBottomCenterX, calloutBottomY);
        context.stroke();

        // Card background with enhanced styling
        context.shadowColor = "rgba(0, 0, 0, 0.8)";
        context.shadowBlur = 48;
        context.shadowOffsetY = 24;

        drawRoundedRect(
            context,
            calloutX,
            calloutY,
            boxWidth,
            boxHeight,
            18,
            "rgba(25, 25, 32, 0.99)",
            "rgba(255, 255, 255, 0.15)"
        );

        context.shadowBlur = 0;
        context.shadowOffsetY = 0;

        // Header with icon
        const iconX = calloutX + padding;
        const iconY = calloutY + padding - 2;
        const iconSize = 18;

        drawRoundedRect(
            context,
            iconX,
            iconY,
            iconSize,
            iconSize,
            4,
            "rgba(255, 255, 255, 0.12)"
        );

        context.strokeStyle = "rgba(255, 255, 255, 0.6)";
        context.lineWidth = 1.2;
        context.beginPath();
        context.moveTo(iconX + 3, iconY + 7);
        context.lineTo(iconX + iconSize - 3, iconY + 7);
        context.stroke();
        context.beginPath();
        context.moveTo(iconX + 9, iconY + 7);
        context.lineTo(iconX + 9, iconY + iconSize - 3);
        context.stroke();

        drawSafeText(context, "UPCOMING", iconX + iconSize + 10, calloutY + padding, {
            font: "700 12px Inter, sans-serif",
            color: "rgba(255, 255, 255, 0.7)",
            shadow: false
        });

        // Reminder items
        let itemY = calloutY + headerHeight;

        displayedReminders.forEach((reminder) => {
            const itemX = calloutX + padding;

            const priorityColors = {
                1: "#6b7280",
                2: "#7c3aed",
                3: "#f59e0b",
                4: "#ef4444"
            };
            const dotColor = priorityColors[reminder.priority] || "#7c3aed";

            // Large colored dot (6px radius)
            context.beginPath();
            context.arc(itemX + 8, itemY + 20, 6, 0, Math.PI * 2);
            context.fillStyle = dotColor;
            context.fill();

            // Reminder title with time (first line)
            const timeText = !reminder.isFullDay && reminder.startTime
                ? reminder.startTime.slice(0, 5)
                : "";
            const titleWithTime = timeText
                ? `${reminder.title || "Untitled"} ${timeText}`
                : (reminder.title || "Untitled");

            const maxTitleLength = 28;
            const displayTitle = titleWithTime.length > maxTitleLength
                ? titleWithTime.slice(0, maxTitleLength) + "…"
                : titleWithTime;

            drawSafeText(context, displayTitle, itemX + 24, itemY + 12, {
                font: "600 14px Inter, sans-serif",
                color: "rgba(255, 255, 255, 0.95)",
                shadow: false
            });

            // Second line - same text in accent color
            drawSafeText(context, displayTitle, itemX + 24, itemY + 32, {
                font: "500 13px Inter, sans-serif",
                color: dotColor,
                shadow: false
            });

            // "All Day" badge on the right
            const badgeText = reminder.isFullDay ? "All Day" : (reminder.startTime || "11:23");
            const badgeWidth = reminder.isFullDay ? 60 : 58;
            const badgeX = calloutX + boxWidth - padding - badgeWidth;
            const badgeY = itemY + 15;

            // Badge background
            drawRoundedRect(
                context,
                badgeX,
                badgeY,
                badgeWidth,
                26,
                13,
                reminder.isFullDay ? "rgba(124, 58, 237, 0.3)" : "rgba(255, 255, 255, 0.1)"
            );

            // Badge text
            drawSafeText(context, badgeText, badgeX + (reminder.isFullDay ? 10 : 8), badgeY + 8, {
                font: "600 11px Inter, sans-serif",
                color: reminder.isFullDay ? "rgba(124, 58, 237, 1)" : "rgba(255, 255, 255, 0.7)",
                shadow: false
            });

            itemY += itemHeight;
        });

        context.restore();
    }

    context.restore();
    return finalHeight;
}