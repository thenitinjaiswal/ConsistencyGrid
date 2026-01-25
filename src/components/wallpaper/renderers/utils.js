/**
 * Draws a rounded rectangle on the canvas
 */
export function drawRoundedRect(
    ctx,
    x,
    y,
    width,
    height,
    radius = 8,
    fillColor = "#000",
    strokeColor = null
) {
    ctx.save();
    ctx.beginPath();

    const r = Math.min(radius, width / 2, height / 2);

    ctx.moveTo(x + r, y);
    ctx.lineTo(x + width - r, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + r);
    ctx.lineTo(x + width, y + height - r);
    ctx.quadraticCurveTo(x + width, y + height, x + width - r, y + height);
    ctx.lineTo(x + r, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);

    ctx.closePath();

    if (fillColor) {
        ctx.fillStyle = fillColor;
        ctx.fill();
    }

    if (strokeColor) {
        ctx.strokeStyle = strokeColor;
        ctx.stroke();
    }

    ctx.restore();
}

// Premium font stack with robust emoji support
export const FONT_STACK = "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'";

/**
 * SAFE TEXT DRAW
 */
export function drawSafeText(
    ctx,
    text,
    x,
    y,
    {
        font = `16px ${FONT_STACK}`,
        color = "#ffffff",
        align = "left",
        baseline = "alphabetic",
        shadow = false,
    } = {}
) {
    if (!text) return;

    ctx.save();

    // Fallback to simple font stack if no complex one provided
    let finalFont = font;
    if (!font.includes(",")) {
        finalFont = `${font}, ${FONT_STACK}`;
    }

    ctx.font = finalFont;
    ctx.fillStyle = color;
    ctx.textAlign = align;
    ctx.textBaseline = baseline;

    if (shadow) {
        ctx.shadowColor = "rgba(0,0,0,0.4)";
        ctx.shadowBlur = 4;
        ctx.shadowOffsetY = 2;
    } else {
        ctx.shadowBlur = 0;
    }

    const safeX = Number.isFinite(x) ? x : 0;
    const safeY = Number.isFinite(y) ? y : 0;

    ctx.fillText(String(text), safeX, safeY);
    ctx.restore();
}
