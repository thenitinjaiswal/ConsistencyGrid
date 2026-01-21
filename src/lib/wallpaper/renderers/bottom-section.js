import { drawRoundedRect } from "./utils";

export function drawBottomSection(context, { xCoordinate, yCoordinate, width, height, theme, habits, goals = [], settings, reminders = [], nowDay, now, streak }) {
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

    // 1. Streak Section
    // if (streak !== undefined) {
    //     context.textAlign = "left";
    //     context.fillStyle = theme.TEXT_SUB;
    //     context.font = "bold 20px Inter, sans-serif";
    //     context.fillText("STREAK", rightColumnX, rightY);

    //     context.fillStyle = theme.TEXT_MAIN;
    //     context.font = "bold 48px Inter, sans-serif";
    //     context.fillText(`${streak}`, rightColumnX, rightY + 55);

    //     const numberWidth = context.measureText(`${streak}`).width;
    //     context.fillStyle = theme.TEXT_SUB;
    //     context.font = "16px Inter, sans-serif";
    //     context.fillText("days", rightColumnX + numberWidth + 10, rightY + 55);

    //     // Add month name to match screenshot-ish mood
    //     const month = now.toLocaleString('default', { month: 'long' });
    //     context.fillStyle = theme.ACCENT; // Use accent color
    //     context.font = "bold 16px Inter, sans-serif";
    //     context.fillText(month, rightColumnX, rightY + 85);

    //     rightY += 120;
    // }

    // 2. Goal Section - Show Real Active Goals
    if (goals && goals.length > 0) {
        const primaryGoal = goals[0]; // Show the first (most recent) goal
        
        context.textAlign = "left";
        context.fillStyle = theme.TEXT_SUB;
        context.font = "bold 20px Inter, sans-serif";
        context.fillText("FOCUS", rightColumnX, rightY);

        context.fillStyle = theme.TEXT_MAIN;
        context.font = "bold 24px Inter, sans-serif";
        const goalTitle = primaryGoal.title || "Goal";
        const maxTitleLength = 16;
        const displayTitle = goalTitle.length > maxTitleLength 
            ? goalTitle.substring(0, maxTitleLength) + "..." 
            : goalTitle;
        context.fillText(displayTitle, rightColumnX, rightY + 40);

        // Calculate progress from sub-goals
        let progressPercentage = primaryGoal.progress || 0;
        if (primaryGoal.subGoals && primaryGoal.subGoals.length > 0) {
            const completedSubGoals = primaryGoal.subGoals.filter(sg => sg.isCompleted).length;
            progressPercentage = Math.round((completedSubGoals / primaryGoal.subGoals.length) * 100);
        }

        const barY = rightY + 60;
        const barHeight = 10;
        const barWidth = columnWidth;

        context.shadowColor = "rgba(0,0,0,0.2)";
        context.shadowBlur = 5;
        context.shadowOffsetY = 2;
        drawRoundedRect(context, rightColumnX, barY, barWidth, barHeight, 5, "rgba(255,255,255,0.1)");
        context.shadowBlur = 0;
        context.shadowOffsetY = 0;

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
        context.fillText(`${progressPercentage}% complete`, rightColumnX + barWidth, barY + 30);

        // Show sub-goals count if available
        if (primaryGoal.subGoals && primaryGoal.subGoals.length > 0) {
            const completed = primaryGoal.subGoals.filter(sg => sg.isCompleted).length;
            context.textAlign = "left";
            context.fillText(`${completed}/${primaryGoal.subGoals.length} tasks`, rightColumnX, barY + 30);
        }

        rightY += 140; // Spacing after Goal
    } else if (settings.goalEnabled) {
        // Fallback to settings-based goal if no real goals exist
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
