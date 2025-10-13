import rough from 'roughjs';

/**
 * Renderer utility for drawing elements with Rough.js
 * Provides hand-drawn aesthetic to all shapes
 */

let roughCanvas = null;

/**
 * Initialize RoughCanvas instance
 * @param {CanvasRenderingContext2D} ctx - Canvas 2D context
 * @returns {RoughCanvas} - RoughCanvas instance
 */
export const initRoughCanvas = (ctx) => {
  if (!roughCanvas || roughCanvas.ctx !== ctx) {
    roughCanvas = rough.canvas(ctx.canvas);
  }
  return roughCanvas;
};

/**
 * Get default Rough.js options for an element
 * @param {Object} element - Element to get options for
 * @returns {Object} - Rough.js options
 */
const getRoughOptions = (element) => ({
  stroke: element.stroke || '#000000',
  strokeWidth: element.strokeWidth || 2,
  fill: element.fill === 'transparent' ? undefined : element.fill,
  fillStyle: element.fillStyle || 'hachure',
  roughness: element.roughness || 1,
  bowing: element.bowing || 1,
  seed: element.seed || 1,
  strokeLineDash: element.strokeStyle === 'dashed' ? [5, 5] : undefined,
  fillWeight: element.fillWeight || 0.5,
});

/**
 * Render a rectangle element
 * @param {RoughCanvas} rc - RoughCanvas instance
 * @param {Object} element - Rectangle element to render
 */
export const renderRectangle = (rc, element) => {
  const options = getRoughOptions(element);
  
  rc.rectangle(
    element.x,
    element.y,
    element.width,
    element.height,
    options
  );
};

/**
 * Render an ellipse element
 * @param {RoughCanvas} rc - RoughCanvas instance
 * @param {Object} element - Ellipse element to render
 */
export const renderEllipse = (rc, element) => {
  const options = getRoughOptions(element);
  
  const centerX = element.x + element.width / 2;
  const centerY = element.y + element.height / 2;
  
  rc.ellipse(
    centerX,
    centerY,
    element.width,
    element.height,
    options
  );
};

/**
 * Render an arrow/line element
 * @param {RoughCanvas} rc - RoughCanvas instance
 * @param {CanvasRenderingContext2D} ctx - Canvas 2D context for arrow heads
 * @param {Object} element - Arrow element to render
 */
export const renderArrow = (rc, ctx, element) => {
  const options = getRoughOptions(element);
  
  // Support both old format (x, y, width, height) and new format (x1, y1, x2, y2)
  let x1, y1, x2, y2;
  
  if (element.x1 !== undefined && element.y1 !== undefined && 
      element.x2 !== undefined && element.y2 !== undefined) {
    // New format: explicit start/end points
    x1 = element.x1;
    y1 = element.y1;
    x2 = element.x2;
    y2 = element.y2;
  } else {
    // Old format: x, y, width, height (convert to points)
    x1 = element.x;
    y1 = element.y;
    x2 = element.x + element.width;
    y2 = element.y + element.height;
  }
  
  // Draw the line
  rc.line(x1, y1, x2, y2, options);
  
  // Arrow type: 'start', 'end', 'both', 'none'
  const arrowType = element.arrowType || 'end';
  
  // Draw arrow heads based on arrow type
  if (arrowType === 'start' || arrowType === 'both') {
    drawArrowhead(ctx, x2, y2, x1, y1, element.strokeWidth || 2, element.stroke || '#000000');
  }
  if (arrowType === 'end' || arrowType === 'both') {
    drawArrowhead(ctx, x1, y1, x2, y2, element.strokeWidth || 2, element.stroke || '#000000');
  }
};

/**
 * Draw an arrowhead at the end of a line
 * @param {CanvasRenderingContext2D} ctx - Canvas context
 * @param {number} fromX - Line start X
 * @param {number} fromY - Line start Y
 * @param {number} toX - Line end X (where arrow points)
 * @param {number} toY - Line end Y (where arrow points)
 * @param {number} strokeWidth - Line stroke width
 * @param {string} color - Arrow color
 */
const drawArrowhead = (ctx, fromX, fromY, toX, toY, strokeWidth, color) => {
  // Calculate angle of the line
  const angle = Math.atan2(toY - fromY, toX - fromX);
  
  // Arrowhead size based on stroke width
  const headLength = Math.max(10, strokeWidth * 5); // Arrow length
  
  // Calculate arrowhead points (30 degrees angle)
  const angle1 = angle - Math.PI / 6;
  const angle2 = angle + Math.PI / 6;
  
  const point1X = toX - headLength * Math.cos(angle1);
  const point1Y = toY - headLength * Math.sin(angle1);
  
  const point2X = toX - headLength * Math.cos(angle2);
  const point2Y = toY - headLength * Math.sin(angle2);
  
  // Draw filled arrowhead triangle
  ctx.save();
  ctx.fillStyle = color;
  ctx.strokeStyle = color;
  ctx.lineWidth = strokeWidth;
  
  ctx.beginPath();
  ctx.moveTo(toX, toY);
  ctx.lineTo(point1X, point1Y);
  ctx.lineTo(point2X, point2Y);
  ctx.closePath();
  ctx.fill();
  
  ctx.restore();
};

/**
 * Render a freehand drawing element
 * @param {RoughCanvas} rc - RoughCanvas instance (not used for smooth drawing)
 * @param {CanvasRenderingContext2D} ctx - Canvas 2D context
 * @param {Object} element - Freehand element to render
 */
export const renderFreeDraw = (rc, ctx, element) => {
  if (!element.points || element.points.length < 2) return;
  
  // Use Canvas 2D for smooth lines instead of Rough.js
  ctx.save();
  ctx.strokeStyle = element.stroke || '#000000';
  ctx.lineWidth = element.strokeWidth || 2;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.globalAlpha = (element.opacity || 100) / 100;
  
  ctx.beginPath();
  ctx.moveTo(element.points[0].x, element.points[0].y);
  
  // Use quadratic curves for smooth lines
  for (let i = 1; i < element.points.length - 1; i++) {
    const xc = (element.points[i].x + element.points[i + 1].x) / 2;
    const yc = (element.points[i].y + element.points[i + 1].y) / 2;
    ctx.quadraticCurveTo(element.points[i].x, element.points[i].y, xc, yc);
  }
  
  // Draw the last segment
  if (element.points.length > 1) {
    const lastPoint = element.points[element.points.length - 1];
    const secondLastPoint = element.points[element.points.length - 2];
    ctx.quadraticCurveTo(
      secondLastPoint.x,
      secondLastPoint.y,
      lastPoint.x,
      lastPoint.y
    );
  }
  
  ctx.stroke();
  ctx.restore();
};

/**
 * Render a text element
 * @param {CanvasRenderingContext2D} ctx - Canvas 2D context
 * @param {Object} element - Text element to render
 * @param {Number} zoom - Current zoom level
 */
export const renderText = (ctx, element, zoom = 1) => {
  if (!element.text) return;
  
  ctx.save();
  
  // Set text properties
  const fontSize = (element.fontSize || 16) * zoom;
  ctx.font = `${element.fontWeight || 'normal'} ${fontSize}px ${element.fontFamily || 'sans-serif'}`;
  ctx.fillStyle = element.stroke || '#000000';
  ctx.textAlign = element.textAlign || 'left';
  ctx.textBaseline = 'top';
  
  // Handle multi-line text
  const lines = element.text.split('\n');
  const lineHeight = fontSize * 1.2;
  
  lines.forEach((line, index) => {
    ctx.fillText(
      line,
      element.x,
      element.y + (index * lineHeight)
    );
  });
  
  ctx.restore();
};

/**
 * Render an element based on its type
 * @param {RoughCanvas} rc - RoughCanvas instance
 * @param {CanvasRenderingContext2D} ctx - Canvas 2D context
 * @param {Object} element - Element to render
 * @param {Number} zoom - Current zoom level
 */
export const renderElement = (rc, ctx, element, zoom = 1) => {
  if (!element || !element.type) return;
  
  try {
    switch (element.type) {
      case 'rectangle':
        renderRectangle(rc, element);
        break;
      case 'ellipse':
        renderEllipse(rc, element);
        break;
      case 'arrow':
      case 'line':
        renderArrow(rc, ctx, element);
        break;
      case 'draw':
      case 'freedraw':
        renderFreeDraw(rc, ctx, element);
        break;
      case 'text':
        renderText(ctx, element, zoom);
        break;
      default:
        console.warn(`Unknown element type: ${element.type}`);
    }
  } catch (error) {
    console.error(`Error rendering element ${element.id}:`, error);
  }
};

/**
 * Render all elements
 * @param {CanvasRenderingContext2D} ctx - Canvas 2D context
 * @param {Array} elements - Array of elements to render
 * @param {Number} zoom - Current zoom level
 * @param {Object} viewportBounds - Optional viewport bounds for culling
 * @param {String} editingElementId - Optional ID of element being edited (will be hidden)
 */
export const renderElements = (ctx, elements, zoom = 1, viewportBounds = null, editingElementId = null) => {
  if (!elements || elements.length === 0) return;
  
  const rc = initRoughCanvas(ctx);
  
  elements.forEach(element => {
    // Skip rendering the element that's currently being edited
    if (editingElementId && element.id === editingElementId) {
      return;
    }
    
    // Viewport culling optimization (skip off-screen elements)
    if (viewportBounds) {
      const isVisible = !(
        element.x + element.width < viewportBounds.minX ||
        element.x > viewportBounds.maxX ||
        element.y + element.height < viewportBounds.minY ||
        element.y > viewportBounds.maxY
      );
      
      if (!isVisible) return;
    }
    
    renderElement(rc, ctx, element, zoom);
  });
};

/**
 * Calculate viewport bounds for culling
 * @param {Number} scrollX - X scroll position
 * @param {Number} scrollY - Y scroll position
 * @param {Number} width - Canvas width
 * @param {Number} height - Canvas height
 * @param {Number} zoom - Current zoom level
 * @returns {Object} - Viewport bounds {minX, minY, maxX, maxY}
 */
export const getViewportBounds = (scrollX, scrollY, width, height, zoom) => ({
  minX: -scrollX / zoom,
  minY: -scrollY / zoom,
  maxX: (width - scrollX) / zoom,
  maxY: (height - scrollY) / zoom,
});
