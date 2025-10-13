import { nanoid } from 'nanoid';

/**
 * Draw Tool (Freehand/Pen Tool)
 * Click and drag to draw freehand curves
 * Captures mouse path as points array
 */
class DrawTool {
  constructor() {
    this.name = 'draw';
    this.cursor = 'crosshair';
    this.isDrawing = false;
    this.points = [];
    this.previewElement = null;
    this.lastPoint = null;
    this.minDistance = 2; // Minimum distance between points for smoother lines
  }

  onMouseDown(e, state) {
    const { x, y } = this.getCanvasCoordinates(e, state);
    
    this.isDrawing = true;
    this.points = [{ x, y }];
    this.lastPoint = { x, y };
    
    // Create preview element
    const style = state.getCurrentStyle ? state.getCurrentStyle() : {
      stroke: '#1971c2',
      fill: 'transparent',
      strokeWidth: 2,
      opacity: 100,
    };

    this.previewElement = {
      id: 'preview',
      type: 'draw',
      points: [{ x, y }],
      stroke: style.stroke,
      strokeWidth: style.strokeWidth,
      opacity: style.opacity,
      roughness: 1,
      seed: Math.floor(Math.random() * 1000000),
      // Bounding box (will be calculated as we draw)
      x: x,
      y: y,
      width: 0,
      height: 0,
    };
  }

  onMouseMove(e, state) {
    if (!this.isDrawing || !this.lastPoint) return;

    const { x, y } = this.getCanvasCoordinates(e, state);
    
    // Calculate distance from last point
    const distance = Math.sqrt(
      Math.pow(x - this.lastPoint.x, 2) + 
      Math.pow(y - this.lastPoint.y, 2)
    );
    
    // Only add point if it's far enough from the last point
    // This prevents too many points and makes the line smoother
    if (distance >= this.minDistance) {
      this.points.push({ x, y });
      this.lastPoint = { x, y };
      
      // Update preview element with new point
      this.previewElement = {
        ...this.previewElement,
        points: [...this.points],
      };
      
      // Update bounding box
      this.updateBoundingBox();
    }
  }

  onMouseUp(e, state) {
    if (!this.isDrawing || !this.previewElement) {
      this.reset();
      return;
    }

    // Only add element if we have at least 2 points
    if (this.points.length >= 2) {
      // Update bounding box one final time
      this.updateBoundingBox();
      
      // Create final element with unique ID
      const finalElement = {
        ...this.previewElement,
        id: nanoid(),
        points: [...this.points],
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
    if (this.isDrawing && this.previewElement && this.points.length >= 2) {
      const { points, stroke, strokeWidth } = this.previewElement;
      
      ctx.save();
      ctx.strokeStyle = stroke;
      ctx.lineWidth = strokeWidth;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.globalAlpha = 0.8; // Slightly transparent preview
      
      // Draw smooth curve through all points
      ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].y);
      
      // Use quadratic curves for smoother lines
      for (let i = 1; i < points.length - 1; i++) {
        const xc = (points[i].x + points[i + 1].x) / 2;
        const yc = (points[i].y + points[i + 1].y) / 2;
        ctx.quadraticCurveTo(points[i].x, points[i].y, xc, yc);
      }
      
      // Draw the last segment
      if (points.length > 1) {
        const lastPoint = points[points.length - 1];
        const secondLastPoint = points[points.length - 2];
        ctx.quadraticCurveTo(
          secondLastPoint.x,
          secondLastPoint.y,
          lastPoint.x,
          lastPoint.y
        );
      }
      
      ctx.stroke();
      ctx.restore();
    }
  }

  /**
   * Update the bounding box based on all points
   * This is used for hit detection and selection
   */
  updateBoundingBox() {
    if (!this.points || this.points.length === 0) return;
    
    let minX = this.points[0].x;
    let minY = this.points[0].y;
    let maxX = this.points[0].x;
    let maxY = this.points[0].y;
    
    this.points.forEach(point => {
      minX = Math.min(minX, point.x);
      minY = Math.min(minY, point.y);
      maxX = Math.max(maxX, point.x);
      maxY = Math.max(maxY, point.y);
    });
    
    // Add some padding for stroke width
    const padding = (this.previewElement.strokeWidth || 2) / 2;
    
    this.previewElement.x = minX - padding;
    this.previewElement.y = minY - padding;
    this.previewElement.width = maxX - minX + padding * 2;
    this.previewElement.height = maxY - minY + padding * 2;
  }

  reset() {
    this.isDrawing = false;
    this.points = [];
    this.previewElement = null;
    this.lastPoint = null;
  }

  // Helper methods
  getCanvasCoordinates(e, state) {
    const rect = e.target.getBoundingClientRect();
    const x = (e.clientX - rect.left - state.scrollX) / state.zoom;
    const y = (e.clientY - rect.top - state.scrollY) / state.zoom;
    return { x, y };
  }
}

export default DrawTool;
