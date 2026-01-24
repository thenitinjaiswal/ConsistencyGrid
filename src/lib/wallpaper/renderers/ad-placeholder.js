import { drawRoundedRect, drawSafeText } from "./utils";

/**
 * Draws an advertisement placeholder section (Currently Unused)
 * 
 * This function is prepared for future monetization features.
 * It creates a styled rectangle with "ADVERTISEMENT" text centered.
 * The feature is currently disabled in the main wallpaper generation route.
 * 
 * @param {CanvasRenderingContext2D} context - The canvas 2D rendering context
 * @param {Object} params - Drawing parameters
 * @param {number} params.xCoordinate - X position of the ad block
 * @param {number} params.yCoordinate - Y position of the ad block
 * @param {number} params.width - Width of the ad block
 * @param {number} params.height - Height of the ad block
 * @param {Object} params.theme - Theme object containing color definitions
 * @param {string} params.theme.TEXT_SUB - Secondary text color
 * 
 * @example
 * // To enable, uncomment in route.js:
 * // drawAdPlaceholder(ctx, {
 * //   xCoordinate: margin,
 * //   yCoordinate: height - 200,
 * //   width: contentWidth,
 * //   height: 60,
 * //   theme: activeTheme
 * // });
 */
export function drawAdPlaceholder(context, { xCoordinate, yCoordinate, width, height, theme }) {
    // Create a vertical gradient for subtle depth effect
    const gradient = context.createLinearGradient(
        xCoordinate, yCoordinate,           // Start at top
        xCoordinate, yCoordinate + height   // End at bottom
    );
    gradient.addColorStop(0, "#151515");  // Lighter dark gray at top
    gradient.addColorStop(1, "#0a0a0a");  // Darker gray at bottom

    // Draw rounded rectangle with gradient fill and border
    drawRoundedRect(context, xCoordinate, yCoordinate, width, height, 12, gradient, "#333");

    // Draw centered "ADVERTISEMENT" label
    drawSafeText(context, "ADVERTISEMENT", xCoordinate + width / 2, yCoordinate + height / 2 + 5, {
        font: "bold 14px Arial, sans-serif",
        color: theme.TEXT_SUB,
        align: "center",
        baseline: "middle"
    });
}
