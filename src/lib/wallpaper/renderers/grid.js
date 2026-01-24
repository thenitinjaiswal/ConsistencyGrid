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

  // Enhanced title with better typography
  let titleText = "";
  let subtitleText = "";
  
  if (mode === "days") {
    titleText = "365 DAYS";
    const year = now.getFullYear();
    const isLeap = (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
    subtitleText = `${year} • ${isLeap ? '366' : '365'} days to make count`;
  } else if (mode === "weeks") {
    titleText = now.getFullYear() + " PROGRESS";
    subtitleText = "52 weeks of opportunity";
  } else if (mode === "life") {
    titleText = "LIFE PROGRESS";
    const birthDate = new Date(dob);
    const age = Math.floor((now - birthDate) / (365.25 * 24 * 60 * 60 * 1000));
    subtitleText = `${age} years • ${lifeExpectancy} years life expectancy`;
  } else {
    const monthName = now.toLocaleString("default", { month: "long" }).toUpperCase();
    titleText = monthName + " " + now.getFullYear();
    const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    subtitleText = `${daysInMonth} days in this month`;
  }

  // Draw main title with premium gradient effect and shadow
  context.save();
  context.shadowColor = "rgba(0, 0, 0, 0.5)";
  context.shadowBlur = 12;
  context.shadowOffsetY = 4;
  
  const gradient = context.createLinearGradient(
    xCoordinate, 
    currentY - 20, 
    xCoordinate + 300, 
    currentY + 10
  );
  gradient.addColorStop(0, theme.TEXT_PRIMARY || "#ffffff");
  gradient.addColorStop(0.5, theme.TEXT_PRIMARY || "#fafafa");
  gradient.addColorStop(1, theme.TEXT_SUB || "#a1a1aa");
  
  drawSafeText(context, titleText, xCoordinate, currentY, {
    font: "bold 44px Inter, sans-serif",
    color: gradient,
    shadow: false,
  });

  currentY += 50;

  // Draw decorative line under title
  context.strokeStyle = theme.ACCENT || "rgba(255, 255, 255, 0.15)";
  context.lineWidth = 2;
  context.beginPath();
  context.moveTo(xCoordinate, currentY - 8);
  context.lineTo(xCoordinate + 120, currentY - 8);
  context.stroke();
  
  context.shadowBlur = 0;
  context.shadowOffsetY = 0;

  // Draw subtitle with enhanced styling
  drawSafeText(context, subtitleText, xCoordinate, currentY + 18, {
    font: "500 14px Inter, sans-serif",
    color: theme.TEXT_SUB || "#71717a",
    shadow: false,
  });

  currentY += 50;
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

  if (reminders && reminders.length > 0) {
    const toLocalYMD = (d) =>
      `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
        d.getDate()
      ).padStart(2, "0")}`;

    const todayYMD = toLocalYMD(now);
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    targetReminders = reminders.filter((r) => {
      const rDate = new Date(r.startDate);
      if (toLocalYMD(rDate) !== todayYMD) return false;
      if (r.isFullDay) return true;
      if (!r.startTime) return true;

      const [sH, sM] = r.startTime.split(":").map(Number);
      const startMinutes = sH * 60 + sM;
      if (currentMinutes < startMinutes) return false;

      if (r.endTime) {
        const [eH, eM] = r.endTime.split(":").map(Number);
        const endMinutes = eH * 60 + eM;
        if (currentMinutes > endMinutes) return false;
      }
      return true;
    });

    targetReminders.sort((a, b) =>
      (a.startTime || "00:00").localeCompare(b.startTime || "00:00")
    );
    targetReminders = targetReminders.slice(0, 4);
  }

  // Enhanced heatmap palettes with better gradients
  const HEATMAP_PALETTES = {
    "minimal-dark": {
      light: "#52525b",
      medium: "#71717a",
      dark: "#a1a1aa",
      full: "#ffffff",
      glow: "rgba(255, 255, 255, 0.4)",
    },
    "dark-minimal": {
      light: "#52525b",
      medium: "#71717a",
      dark: "#a1a1aa",
      full: "#ffffff",
      glow: "rgba(255, 255, 255, 0.4)",
    },
    "sunset-orange": {
      light: "#fed7aa",
      medium: "#fb923c",
      dark: "#f97316",
      full: "#ea580c",
      glow: "rgba(234, 88, 12, 0.5)",
    },
    "orange-glow": {
      light: "#fed7aa",
      medium: "#fb923c",
      dark: "#f97316",
      full: "#ea580c",
      glow: "rgba(234, 88, 12, 0.5)",
    },
    "ocean-blue": {
      light: "#bfdbfe",
      medium: "#60a5fa",
      dark: "#3b82f6",
      full: "#2563eb",
      glow: "rgba(37, 99, 235, 0.5)",
    },
    "forest-green": {
      light: "#bbf7d0",
      medium: "#4ade80",
      dark: "#22c55e",
      full: "#16a34a",
      glow: "rgba(22, 163, 74, 0.5)",
    },
    "purple-haze": {
      light: "#e9d5ff",
      medium: "#c084fc",
      dark: "#a855f7",
      full: "#9333ea",
      glow: "rgba(147, 51, 234, 0.5)",
    },
    "monochrome": {
      light: "#71717a",
      medium: "#52525b",
      dark: "#3f3f46",
      full: "#27272a",
      glow: "rgba(39, 39, 42, 0.5)",
    },
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

  // Enhanced box drawing with premium visual effects
  const drawEnhancedBox = (x, y, size, fillColor, isHighlight, borderRadius = 4) => {
    context.save();
    
    if (isHighlight) {
      const palette = HEATMAP_PALETTES[themeName] || HEATMAP_PALETTES["dark-minimal"];
      
      // Multiple glow rings for premium effect
      for (let i = 3; i > 0; i--) {
        context.globalAlpha = 0.15 / i;
        context.fillStyle = palette.full || palette.glow;
        drawRoundedRect(context, x - i*2, y - i*2, size + i*4, size + i*4, borderRadius + 2);
      }
      
      context.globalAlpha = 1;
    }
    
    // Main box with enhanced shadow
    const isInactive = fillColor === (theme.GRID_INACTIVE || "#27272a") || fillColor === "#18181b";
    
    // Shadow for depth
    if (!isInactive) {
      context.shadowColor = "rgba(0, 0, 0, 0.4)";
      context.shadowBlur = 8;
      context.shadowOffsetY = 2;
    }
    
    const borderColor = isHighlight 
      ? (HEATMAP_PALETTES[themeName] || HEATMAP_PALETTES["dark-minimal"]).full
      : isInactive 
        ? "#2a2a2d" 
        : fillColor;
    
    context.fillStyle = fillColor;
    drawRoundedRect(context, x, y, size, size, borderRadius, fillColor, borderColor);
    
    // Inner highlight/shine for premium look
    if (!isInactive) {
      context.shadowBlur = 0;
      const highlightGradient = context.createLinearGradient(x + 1, y + 1, x + size - 2, y + size - 2);
      highlightGradient.addColorStop(0, "rgba(255, 255, 255, 0.15)");
      highlightGradient.addColorStop(0.5, "rgba(255, 255, 255, 0.05)");
      highlightGradient.addColorStop(1, "rgba(0, 0, 0, 0.05)");
      context.fillStyle = highlightGradient;
      drawRoundedRect(context, x + 1, y + 1, size - 2, size - 2, borderRadius - 1);
    }
    
    context.restore();
  };

  let finalHeight = 0;

  // Days mode - 365 day grid
  if (mode === "days") {
    const gridCols = 25;
    const gap = 10;
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

        if (targetReminders.length > 0) {
          const anchorDateStr = getDayString(new Date(targetReminders[0].startDate));
          if (dayDateStr === anchorDateStr) {
            anchorPoint = { x: boxX, y: boxY, size: boxSize };
          }
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
    finalHeight = rows * (boxSize + gap) + 120;
  } 
  // Weeks mode - 52 week grid
  else if (mode === "weeks") {
    const columns = 13;
    const rows = 4;
    const gap = 14;
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

        drawEnhancedBox(boxX, boxY, boxSize, fillColor, isCurrentWeek, 8);
      }
    }
    finalHeight = rows * (boxSize + gap) + 170;
  } 
  // Life mode - entire life grid
  else if (mode === "life") {
    const gridCols = 52;
    const gap = 4;
    const totalWeeks = Number(lifeExpectancy) * 52;
    const rowsNeeded = Math.ceil(totalWeeks / gridCols);
    const weeksLived = weeksBetween(new Date(dob), now);
    const availableHeight = Math.max(400, height - currentY - 150);
    const sizeByWidth = (contentWidth - gap * (gridCols - 1)) / gridCols;
    const sizeByHeight = (availableHeight - gap * (rowsNeeded - 1)) / rowsNeeded;
    const boxSize = Math.max(3, Math.min(sizeByWidth, sizeByHeight));

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

      drawEnhancedBox(boxX, boxY, boxSize, fillColor, isCurrentWeek, Math.max(2, boxSize / 3));
    }

    finalHeight = rowsNeeded * (boxSize + gap) + 100;
  } 
  // Monthly calendar mode
  else {
    const columns = 7;
    const rows = 6;
    const gap = 18;
    const boxSize = (contentWidth - gap * (columns - 1)) / columns;
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const dayOffset = startOfMonth.getDay();

    // Day labels with enhanced styling
    const dayLabels = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
    const labelY = currentY + 2;
    
    for (let i = 0; i < 7; i++) {
      const labelX = xCoordinate + i * (boxSize + gap) + boxSize / 2;
      
      // Subtle background for day labels
      context.fillStyle = "rgba(255, 255, 255, 0.05)";
      drawRoundedRect(context, labelX - boxSize / 2 - 2, labelY - 14, boxSize + 4, 24, 6);
      
      context.textAlign = "center";
      drawSafeText(context, dayLabels[i], labelX, labelY + 8, {
        font: "700 10px Inter, sans-serif",
        color: theme.TEXT_SUB || "#71717a",
        shadow: false,
      });
      context.textAlign = "left";
    }
    currentY += 35;

    for (let rowIndex = 0; rowIndex < rows; rowIndex++) {
      for (let columnIndex = 0; columnIndex < columns; columnIndex++) {
        const dayIndex = rowIndex * 7 + columnIndex;
        const date = new Date(startOfMonth);
        date.setDate(1 + dayIndex - dayOffset);

        const boxX = xCoordinate + columnIndex * (boxSize + gap);
        const boxY = currentY + rowIndex * (boxSize + gap);

        if (targetReminders.length > 0) {
          const anchorDateStr = getDayString(new Date(targetReminders[0].startDate));
          if (getDayString(date) === anchorDateStr) {
            anchorPoint = { x: boxX, y: boxY, size: boxSize };
          }
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

        drawEnhancedBox(boxX, boxY, boxSize, fillColor, isToday, 10);

        // Draw date number with enhanced styling
        if (isInMonth) {
          context.textAlign = "center";
          const textColor = isToday ? "#09090b" : logCount > 0 ? "#fafafa" : "#71717a";
          
          if (isToday) {
            // Premium text styling for today
            drawSafeText(
              context,
              date.getDate().toString(),
              boxX + boxSize / 2,
              boxY + boxSize / 2 + 7,
              {
                font: "bold 18px Inter, sans-serif",
                color: textColor,
                shadow: false,
              }
            );
          } else if (logCount > 0) {
            // White text for completed days
            drawSafeText(
              context,
              date.getDate().toString(),
              boxX + boxSize / 2,
              boxY + boxSize / 2 + 6,
              {
                font: "700 15px Inter, sans-serif",
                color: textColor,
                shadow: false,
              }
            );
          } else {
            // Dimmed text for empty days
            drawSafeText(
              context,
              date.getDate().toString(),
              boxX + boxSize / 2,
              boxY + boxSize / 2 + 6,
              {
                font: "600 14px Inter, sans-serif",
                color: textColor,
                shadow: false,
              }
            );
          }
          context.textAlign = "left";
        }
      }
    }
    finalHeight = rows * (boxSize + gap) + 130;
  }

  // Enhanced reminder callout with premium design
  if (anchorPoint && targetReminders.length > 0) {
    const boxWidth = 360;
    const itemHeight = 52;
    const headerHeight = 50;
    const displayedReminders = targetReminders.slice(0, 4);
    const listHeight = displayedReminders.length * itemHeight;
    const boxHeight = headerHeight + listHeight + 24;

    const calloutX = (width - boxWidth) / 2 + xCoordinate;
    const calloutY = yCoordinate + 10;

    const anchorCenterX = anchorPoint.x + anchorPoint.size / 2;
    const anchorCenterY = anchorPoint.y + anchorPoint.size / 2;
    const boxLeft = calloutX;
    const boxCenterY = calloutY + boxHeight / 2;

    // Connection line with enhanced gradient
    context.save();
    const lineGradient = context.createLinearGradient(
      anchorCenterX, anchorCenterY,
      boxLeft, boxCenterY
    );
    lineGradient.addColorStop(0, "rgba(255, 255, 255, 0.9)");
    lineGradient.addColorStop(0.5, "rgba(255, 255, 255, 0.5)");
    lineGradient.addColorStop(1, "rgba(255, 255, 255, 0.2)");
    
    context.strokeStyle = lineGradient;
    context.lineWidth = 3;
    context.setLineDash([]);
    context.beginPath();
    context.moveTo(anchorCenterX, anchorCenterY);
    context.lineTo(anchorCenterX, boxCenterY);
    context.lineTo(boxLeft, boxCenterY);
    context.stroke();

    // Anchor dot with premium glow
    context.shadowColor = "rgba(255, 255, 255, 0.9)";
    context.shadowBlur = 16;
    context.fillStyle = "#ffffff";
    context.beginPath();
    context.arc(anchorCenterX, anchorCenterY, 5, 0, 2 * Math.PI);
    context.fill();
    
    // Outer glow ring
    context.strokeStyle = "rgba(255, 255, 255, 0.4)";
    context.lineWidth = 2;
    context.beginPath();
    context.arc(anchorCenterX, anchorCenterY, 9, 0, 2 * Math.PI);
    context.stroke();
    context.restore();

    // Premium callout box with enhanced styling
    context.save();
    context.shadowColor = "rgba(0, 0, 0, 0.8)";
    context.shadowBlur = 40;
    context.shadowOffsetY = 20;
    
    // Background with sophisticated gradient
    const bgGradient = context.createLinearGradient(calloutX, calloutY, calloutX, calloutY + boxHeight);
    bgGradient.addColorStop(0, "#131315");
    bgGradient.addColorStop(1, "#0a0a0b");
    drawRoundedRect(context, calloutX, calloutY, boxWidth, boxHeight, 18, bgGradient, "#3f3f46");
    
    context.shadowBlur = 0;

    // Header with enhanced styling
    drawSafeText(context, "📌 REMINDERS", calloutX + 28, calloutY + 32, {
      font: "bold 14px Inter, sans-serif",
      color: "#d4d4d8",
      shadow: false,
    });

    // Separator line with gradient
    const separatorGradient = context.createLinearGradient(calloutX + 28, calloutY + headerHeight, calloutX + boxWidth - 28, calloutY + headerHeight);
    separatorGradient.addColorStop(0, "rgba(255, 255, 255, 0)");
    separatorGradient.addColorStop(0.5, "rgba(255, 255, 255, 0.15)");
    separatorGradient.addColorStop(1, "rgba(255, 255, 255, 0)");
    
    context.strokeStyle = separatorGradient;
    context.lineWidth = 1.5;
    context.beginPath();
    context.moveTo(calloutX + 28, calloutY + headerHeight);
    context.lineTo(calloutX + boxWidth - 28, calloutY + headerHeight);
    context.stroke();

    // Reminder items with premium layout
    let currentItemY = calloutY + headerHeight + 22;
    displayedReminders.forEach((rem, idx) => {
      const rowX = calloutX + 28;
      const rowHeight = itemHeight;

      // Subtle background for each item
      const itemBg = context.createLinearGradient(calloutX + 12, currentItemY - 18, calloutX + boxWidth - 12, currentItemY - 18 + 42);
      itemBg.addColorStop(0, "rgba(255, 255, 255, 0.03)");
      itemBg.addColorStop(1, "rgba(255, 255, 255, 0)");
      
      context.fillStyle = itemBg;
      drawRoundedRect(context, calloutX + 12, currentItemY - 18, boxWidth - 24, 42, 10);

      // Colored marker with glow
      context.shadowColor = rem.markerColor || "#ff7a00";
      context.shadowBlur = 12;
      context.fillStyle = rem.markerColor || "#ff7a00";
      context.beginPath();
      context.arc(rowX, currentItemY + 2, 6, 0, 2 * Math.PI);
      context.fill();
      context.shadowBlur = 0;

      // Title with better color
      const text = rem.title.length > 30 ? rem.title.substring(0, 30) + "…" : rem.title;
      drawSafeText(context, text, rowX + 20, currentItemY + 3, {
        font: "600 16px Inter, sans-serif",
        color: "#f4f4f5",
        shadow: false,
      });

      // Time badge with enhanced styling
      let timeLabel = "All Day";
      if (rem.startTime) {
        timeLabel = rem.startTime;
      } else if (new Date(rem.startDate).getDate() !== now.getDate()) {
        timeLabel = new Date(rem.startDate).toLocaleDateString(undefined, {
          month: "short",
          day: "numeric",
        });
      }
      
      // Time background pill with gradient
      const timeWidth = context.measureText(timeLabel).width + 18;
      const pillX = calloutX + boxWidth - 28 - timeWidth;
      const pillY = currentItemY - 8;
      
      const pillGradient = context.createLinearGradient(pillX, pillY, pillX, pillY + 28);
      pillGradient.addColorStop(0, "#1a1a1d");
      pillGradient.addColorStop(1, "#141416");
      
      drawRoundedRect(context, pillX, pillY, timeWidth, 28, 14, pillGradient, "#3f3f46");
      
      context.textAlign = "center";
      drawSafeText(context, timeLabel, pillX + timeWidth / 2, currentItemY + 3, {
        font: "600 12px Inter, sans-serif",
        color: "#b4b4b8",
        shadow: false,
      });
      context.textAlign = "left";

      currentItemY += rowHeight;
    });

    context.restore();
  }

  context.restore();
  return finalHeight;
}