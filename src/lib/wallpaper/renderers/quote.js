/**
 * Draws the motivational quote footer at the bottom of the wallpaper
 * 
 * Renders a centered quote with the app branding below it.
 * Uses text shadows for depth and visual hierarchy.
 * 
 * @param {CanvasRenderingContext2D} context - The canvas 2D rendering context
 * @param {Object} params - Drawing parameters
 * @param {number} params.xCoordinate - X coordinate (not used, quote is centered)
 * @param {number} params.yCoordinate - Y coordinate (not used, positioned from bottom)
 * @param {number} params.width - Canvas width (used for centering)
 * @param {number} params.height - Canvas height (used for bottom positioning)
 * @param {string} params.quote - The quote text to display
 * @param {Object} params.theme - Theme object (currently unused)
 */
export function drawQuote(context, { xCoordinate, yCoordinate, width, height, quote, theme }) {
    // Save current context state to restore later
    context.save();

    // Center-align all text
    context.textAlign = "center";

    // Add subtle text shadow for depth and readability
    context.shadowColor = "rgba(0,0,0,0.3)";  // Semi-transparent black
    context.shadowBlur = 4;                    // Soft blur radius
    context.shadowOffsetY = 2;                 // Slight downward offset

    // Draw the main quote text
    context.fillStyle = "#525252";  // Medium gray color
    context.font = "medium 18px Inter, sans-serif";
    const quoteY = height - 100;    // Position 100px from bottom
    context.fillText(quote.toUpperCase(), width / 2, quoteY);

    // Draw the app branding below the quote
    context.fillStyle = "#333";     // Darker gray for subtle branding
    context.font = "14px Inter, sans-serif";
    context.fillText("CONSISTENCY GRID", width / 2, quoteY + 30);

    // Restore context state (removes shadow effects)
    context.restore();
}
