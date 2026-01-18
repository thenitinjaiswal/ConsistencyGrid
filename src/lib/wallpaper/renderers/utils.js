/**
 * Draws a rounded rectangle on the canvas
 * 
 * This utility function handles both modern browsers with native roundRect support
 * and fallback to regular rectangles for older canvas implementations.
 * 
 * @param {CanvasRenderingContext2D} context - The canvas 2D rendering context
 * @param {number} xCoordinate - X position of the top-left corner
 * @param {number} yCoordinate - Y position of the top-left corner
 * @param {number} width - Width of the rectangle
 * @param {number} height - Height of the rectangle
 * @param {number} borderRadius - Radius for rounded corners (ignored if roundRect not supported)
 * @param {string} [fillColor] - Optional fill color (CSS color string or gradient)
 * @param {string} [strokeColor] - Optional stroke color (CSS color string)
 * 
 * @example
 * // Draw a filled blue rounded rectangle
 * drawRoundedRect(ctx, 10, 10, 100, 50, 8, '#3b82f6');
 * 
 * @example
 * // Draw a rounded rectangle with border
 * drawRoundedRect(ctx, 10, 10, 100, 50, 8, '#ffffff', '#000000');
 */
export const drawRoundedRect = (context, xCoordinate, yCoordinate, width, height, borderRadius, fillColor, strokeColor) => {
    context.beginPath();

    // Use native roundRect if available, otherwise fallback to regular rect
    if (context.roundRect) {
        context.roundRect(xCoordinate, yCoordinate, width, height, borderRadius);
    } else {
        context.rect(xCoordinate, yCoordinate, width, height);
    }

    // Fill the rectangle if fill color is provided
    if (fillColor) {
        context.fillStyle = fillColor;
        context.fill();
    }

    // Stroke the rectangle if stroke color is provided
    if (strokeColor) {
        context.strokeStyle = strokeColor;
        context.stroke();
    }
};
