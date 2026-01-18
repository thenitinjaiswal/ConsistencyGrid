import { drawRoundedRect } from "./utils";

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

    // Identify target reminders (Zen Mode: Visible ONLY during scheduled time)
    if (reminders && reminders.length > 0) {
        const toLocalYMD = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
        const todayYMD = toLocalYMD(now);
        const currentMinutes = now.getHours() * 60 + now.getMinutes();

        targetReminders = reminders.filter(r => {
            const rDate = new Date(r.startDate);
            const rYMD = toLocalYMD(rDate);

            if (rYMD !== todayYMD) return false;

            // Rule 4: Time check
            if (r.isFullDay) return true;
            if (!r.startTime) return true;

            const [sH, sM] = r.startTime.split(":").map(Number);
            const startMinutes = sH * 60 + sM;

            if (currentMinutes < startMinutes) return false; // Future

            if (r.endTime) {
                const [eH, eM] = r.endTime.split(":").map(Number);
                const endMinutes = eH * 60 + eM;
                if (currentMinutes > endMinutes) return false; // Past
            }

            return true;
        });

        // Sort by time
        targetReminders.sort((a, b) => {
            const timeA = a.startTime || "00:00";
            const timeB = b.startTime || "00:00";
            return timeA.localeCompare(timeB);
        });

        targetReminders = targetReminders.slice(0, 4);
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
        // Optimized: Uses 52 columns (1 year per row) and scales to fit available height
        const gridCols = 52;
        const gap = 3; // Tighter gap for high density
        const totalWeeks = Number(lifeExpectancy) * 52;
        const rowsNeeded = Math.ceil(totalWeeks / gridCols);
        const weeksLived = weeksBetween(new Date(dob), now);

        // Calculate maximum available height (Canvas - CurrentY - Bottom Buffer)
        // Buffer is for the bottom section (habits/goals) + quote
        const availableHeight = Math.max(400, height - currentY - 150);

        // Dynamic sizing: Fit both width and height constraints
        const sizeByWidth = (contentWidth - gap * (gridCols - 1)) / gridCols;
        const sizeByHeight = (availableHeight - gap * (rowsNeeded - 1)) / rowsNeeded;

        // Choose the constraining dimension
        const boxSize = Math.max(2, Math.min(sizeByWidth, sizeByHeight));

        // Helper: Check if a week has reminders
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

        for (let i = 0; i < totalWeeks; i++) {
            const columnIndex = i % gridCols;
            const rowIndex = Math.floor(i / gridCols);

            const boxX = xCoordinate + columnIndex * (boxSize + gap);
            const boxY = currentY + rowIndex * (boxSize + gap);

            // Calculate date for this life week (Optional: Use for reminders if needed)
            // const weekDate = new Date(birthWeekStart);
            // weekDate.setDate(weekDate.getDate() + (i * 7));

            // Visualization Logic
            if (i === weeksLived) {
                // Current week
                context.shadowColor = "#FFFFFF";
                context.shadowBlur = 8;
                context.fillStyle = "#FFFFFF";
            } else if (i < weeksLived) {
                // Past weeks
                context.fillStyle = theme.GRID_ACTIVE;
            } else {
                // Future weeks
                context.fillStyle = theme.GRID_INACTIVE;
            }

            // Draw box
            drawRoundedRect(context, boxX, boxY, boxSize, boxSize, Math.max(1, boxSize / 3), context.fillStyle);
            context.shadowBlur = 0;
        }

        finalHeight = (rowsNeeded * (boxSize + gap)) + 80;
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
