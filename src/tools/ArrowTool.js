import { nanoid } from 'nanoid';

/**
 * Arrow Tool
 * Click and drag to draw arrows/lines with arrowheads
 */
class ArrowTool {
  constructor() {
    this.name = 'arrow';
    this.cursor = 'crosshair';
    this.isDrawing = false;
    this.startPoint = null;
    this.previewElement = null;
  }

  onMouseDown(e, state) {
    const { x, y } = this.getCanvasCoordinates(e, state);
    
    this.isDrawing = true;
    this.startPoint = { x, y };
    
    // Create preview element
    const style = state.getCurrentStyle ? state.getCurrentStyle() : {
      stroke: '#1971c2',
      fill: 'transparent',
      strokeWidth: 2,
      opacity: 100,
    };

    this.previewElement = {
      id: 'preview',
      type: 'arrow',
      x1: x,
      y1: y,
      x2: x,
      y2: y,
      stroke: style.stroke,
      strokeWidth: style.strokeWidth,
      opacity: style.opacity,
      roughness: 1,
      seed: Math.floor(Math.random() * 1000000),
      // Arrow-specific properties
      arrowType: 'end', // 'start', 'end', 'both', 'none'
      lineStyle: 'solid', // 'solid', 'dashed', 'dotted'
    };
  }

  onMouseMove(e, state) {
    if (!this.isDrawing || !this.startPoint) return;

    const { x, y } = this.getCanvasCoordinates(e, state);
    
    // Update preview element with current mouse position
    this.previewElement = {
      ...this.previewElement,
      x2: x,
      y2: y,
    };
  }

  onMouseUp(e, state) {
    if (!this.isDrawing || !this.previewElement) {
      this.reset();
      return;
    }

    const { x1, y1, x2, y2 } = this.previewElement;
    
    // Calculate line length
    const length = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));

    // Only add element if line is long enough (minimum 5px)
    if (length > 5) {
      // Calculate bounding box for selection and eraser tools
      const minX = Math.min(x1, x2);
      const minY = Math.min(y1, y2);
      const maxX = Math.max(x1, x2);
      const maxY = Math.max(y1, y2);
      
      // Create final element with unique ID
      const finalElement = {
        ...this.previewElement,
        id: nanoid(),
        // Add bounding box properties for selection/eraser
        x: minX,
        y: minY,
        width: maxX - minX,
        height: maxY - minY,
      };

      // Add to canvas
      state.addElement(finalElement);
      state.commitChanges();
    }

    this.reset();
  }

  onKeyDown(e, state) {
    // Escape key cancels drawing
    if (e.key === 'Escape' && this.isDrawing) {
      e.preventDefault();
      this.reset();
    }
  }

  render(ctx, state) {
    // Render preview element while drawing
    if (this.isDrawing && this.previewElement) {
      const { x1, y1, x2, y2, stroke, strokeWidth, arrowType } = this.previewElement;
      
      // Calculate line length
      const length = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
      
      if (length === 0) return; // Don't draw if no movement yet

      ctx.save();
      ctx.strokeStyle = stroke;
      ctx.fillStyle = stroke;
      ctx.lineWidth = strokeWidth;
      ctx.setLineDash([5, 5]); // Dashed preview
      ctx.globalAlpha = 0.7; // Slightly transparent
      
      // Draw the line
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
      
      // Reset line dash for arrowheads
      ctx.setLineDash([]);
      
      // Draw arrowheads
      if (arrowType === 'start' || arrowType === 'both') {
        this.drawArrowhead(ctx, x2, y2, x1, y1, strokeWidth);
      }
      if (arrowType === 'end' || arrowType === 'both') {
        this.drawArrowhead(ctx, x1, y1, x2, y2, strokeWidth);
      }
      
      ctx.restore();
    }
  }

  /**
   * Draw an arrowhead at the end of a line
   * @param {CanvasRenderingContext2D} ctx - Canvas context
   * @param {number} fromX - Line start X
   * @param {number} fromY - Line start Y
   * @param {number} toX - Line end X (where arrow points)
   * @param {number} toY - Line end Y (where arrow points)
   * @param {number} strokeWidth - Line stroke width
   */
  drawArrowhead(ctx, fromX, fromY, toX, toY, strokeWidth) {
    // Calculate angle of the line
    const angle = Math.atan2(toY - fromY, toX - fromX);
    
    // Arrowhead size based on stroke width
    const headLength = Math.max(10, strokeWidth * 5); // Arrow length
    const headWidth = Math.max(8, strokeWidth * 3);   // Arrow width
    
    // Calculate arrowhead points
    const angle1 = angle - Math.PI / 6; // 30 degrees
    const angle2 = angle + Math.PI / 6; // 30 degrees
    
    const point1X = toX - headLength * Math.cos(angle1);
    const point1Y = toY - headLength * Math.sin(angle1);
    
    const point2X = toX - headLength * Math.cos(angle2);
    const point2Y = toY - headLength * Math.sin(angle2);
    
    // Draw filled arrowhead triangle
    ctx.beginPath();
    ctx.moveTo(toX, toY);
    ctx.lineTo(point1X, point1Y);
    ctx.lineTo(point2X, point2Y);
    ctx.closePath();
    ctx.fill();
  }

  reset() {
    this.isDrawing = false;
    this.startPoint = null;
    this.previewElement = null;
  }

  // Helper methods
  getCanvasCoordinates(e, state) {
    const rect = e.target.getBoundingClientRect();
    const x = (e.clientX - rect.left - state.scrollX) / state.zoom;
    const y = (e.clientY - rect.top - state.scrollY) / state.zoom;
    return { x, y };
  }
}

export default ArrowTool;
