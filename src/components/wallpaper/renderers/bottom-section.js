import { drawRoundedRect, drawSafeText } from "./utils";

export function drawBottomSection(
    context,
    {
        xCoordinate,
        yCoordinate,
        width,
        height,
        theme,
        habits,
        goals = [],
        settings,
        reminders = [],
        nowDay,
        now,
        streak,
    }
) {
    const cardPadding = 24;
    const cardWidth = width;

    // We want to pin this to the bottom of the available height if possible
    // But for now we just draw it where yCoordinate starts, expecting yCoordinate to be correct

    context.save();

    // Glassmorphism Card Background
    drawRoundedRect(
        context,
        xCoordinate,
        yCoordinate,
        cardWidth,
        height > 0 ? height : 400, // Fallback if height is not passed correctly
        24,
        "rgba(255, 255, 255, 0.02)",
        "rgba(255, 255, 255, 0.05)"
    );

    const contentWidth = cardWidth - (cardPadding * 2);
    const columnGap = 40;
    const columnWidth = (contentWidth - columnGap) / 2;

    const leftColumnX = xCoordinate + cardPadding;
    const rightColumnX = xCoordinate + cardPadding + columnWidth + columnGap;

    const getDayString = (date) => {
        const y = date.getFullYear();
        const m = String(date.getMonth() + 1).padStart(2, "0");
        const d = String(date.getDate()).padStart(2, "0");
        return `${y}-${m}-${d}`;
    };

    /* ---------------- LEFT COLUMN : HABITS ---------------- */

    let currentY = yCoordinate + cardPadding;

    if (habits && habits.length > 0 && settings.showHabitLayer !== false) {
        // Label with tiny indicator
        context.fillStyle = theme.ACCENT || "#ffffff";
        context.beginPath();
        context.roundRect(leftColumnX, currentY, 3, 16, 1.5);
        context.fill();

        drawSafeText(context, "DAILY HABITS", leftColumnX + 12, currentY + 12, {
            font: "900 12px Inter, sans-serif",
            color: theme.TEXT_SUB || "rgba(255,255,255,0.4)",
            letterSpacing: 2
        });

        currentY += 40;

        const maxHabits = 5;
        const habitSpacing = 52; // More compact
        const habitColors = [
            "#34d399", "#fbbf24", "#22d3ee", "#a78bfa", "#f472b6", "#818cf8",
        ];

        habits.slice(0, maxHabits).forEach((habit, index) => {
            const habitColor = habitColors[index % habitColors.length];
            const logs = habit.logs || [];
            const isDone = logs.some(
                (log) => getDayString(new Date(log.date)) === nowDay
            );

            const dotSize = 10;
            const itemX = leftColumnX;
            const itemY = currentY;

            // Status Circle
            context.beginPath();
            context.arc(itemX + dotSize, itemY + 10, dotSize, 0, Math.PI * 2);
            if (isDone) {
                context.fillStyle = habitColor;
                context.fill();
                // Glow
                context.shadowColor = habitColor;
                context.shadowBlur = 10;
                context.stroke();
                context.shadowBlur = 0;
            } else {
                context.strokeStyle = "rgba(255,255,255,0.1)";
                context.lineWidth = 2;
                context.stroke();
            }

            // Habit Title
            const title = habit.title || "Untitled";
            const truncatedTitle = title.length > 18 ? title.slice(0, 18) + "…" : title;

            drawSafeText(context, truncatedTitle.toUpperCase(), itemX + 32, itemY + 14, {
                font: "800 15px Inter, sans-serif",
                color: isDone ? "#ffffff" : "rgba(255,255,255,0.7)",
                letterSpacing: 0.5
            });

            currentY += habitSpacing;
        });
    }

    /* ---------------- RIGHT COLUMN : FOCUS ---------------- */

    let focusY = yCoordinate + cardPadding;

    if (goals && goals.length > 0) {
        const goal = goals[0];

        // Label
        context.fillStyle = theme.ACCENT || "#ffffff";
        context.beginPath();
        context.roundRect(rightColumnX, focusY, 3, 16, 1.5);
        context.fill();

        drawSafeText(context, "ACTIVE FOCUS", rightColumnX + 12, focusY + 12, {
            font: "900 12px Inter, sans-serif",
            color: theme.TEXT_SUB || "rgba(255,255,255,0.4)",
            letterSpacing: 2
        });

        focusY += 40;

        // Goal Title
        const gTitle = goal.title || "Goal";
        const truncatedGTitle = gTitle.length > 20 ? gTitle.slice(0, 20) + "…" : gTitle;

        drawSafeText(context, truncatedGTitle.toUpperCase(), rightColumnX, focusY + 15, {
            font: "900 18px Inter, sans-serif",
            color: theme.TEXT_MAIN,
            letterSpacing: 0.5
        });

        focusY += 45;

        // Progress Bar Track
        const barWidth = columnWidth;
        const barHeight = 8;
        drawRoundedRect(context, rightColumnX, focusY, barWidth, barHeight, 4, "rgba(255,255,255,0.05)");

        let progress = goal.progress || 0;
        if (goal.subGoals && goal.subGoals.length > 0) {
            const done = goal.subGoals.filter((g) => g.isCompleted).length;
            progress = Math.round((done / goal.subGoals.length) * 100);
        }

        if (progress > 0) {
            // Gradient for progress bar
            const grad = context.createLinearGradient(rightColumnX, 0, rightColumnX + barWidth, 0);
            grad.addColorStop(0, theme.ACCENT);
            grad.addColorStop(1, "#ffffff");

            drawRoundedRect(context, rightColumnX, focusY, (barWidth * progress) / 100, barHeight, 4, grad);
        }

        drawSafeText(context, `${progress}% COMPLETE`, rightColumnX + barWidth, focusY + 30, {
            font: "900 11px Inter, sans-serif",
            color: theme.ACCENT,
            align: "right",
            shadow: false,
        });

        // Subgoal preview (compact)
        if (goal.subGoals && goal.subGoals.length > 0) {
            focusY += 60;
            const nextSubgoal = goal.subGoals.find(s => !s.isCompleted);
            if (nextSubgoal) {
                drawSafeText(context, "NEXT STEP:", rightColumnX, focusY, {
                    font: "700 10px Inter, sans-serif",
                    color: "rgba(255,255,255,0.3)",
                    letterSpacing: 1
                });
                drawSafeText(context, nextSubgoal.title.toUpperCase(), rightColumnX, focusY + 20, {
                    font: "800 13px Inter, sans-serif",
                    color: "rgba(255,255,255,0.6)",
                });
            }
        }
    }

    context.restore();
}
