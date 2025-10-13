import { nanoid } from 'nanoid';

/**
 * Rectangle Tool
 * Click and drag to draw rectangles
 */
class RectangleTool {
  constructor() {
    this.name = 'rectangle';
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
      type: 'rectangle',
      x,
      y,
      width: 0,
      height: 0,
      stroke: style.stroke,
      fill: style.fill,
      strokeWidth: style.strokeWidth,
      opacity: style.opacity,
      roughness: 1,
      seed: Math.floor(Math.random() * 1000000),
    };
  }

  onMouseMove(e, state) {
    if (!this.isDrawing || !this.startPoint) return;

    const { x, y } = this.getCanvasCoordinates(e, state);
    
    // Calculate rectangle dimensions
    // Allow drawing in any direction
    const minX = Math.min(this.startPoint.x, x);
    const minY = Math.min(this.startPoint.y, y);
    const maxX = Math.max(this.startPoint.x, x);
    const maxY = Math.max(this.startPoint.y, y);
    
    // Update preview element
    this.previewElement = {
      ...this.previewElement,
      x: minX,
      y: minY,
      width: maxX - minX,
      height: maxY - minY,
    };
  }

  onMouseUp(e, state) {
    if (!this.isDrawing || !this.previewElement) {
      this.reset();
      return;
    }

    // Only add element if it has some size (minimum 5px in either dimension)
    if (this.previewElement.width > 5 || this.previewElement.height > 5) {
      // Create final element with unique ID
      const finalElement = {
        ...this.previewElement,
        id: nanoid(),
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
    if (this.isDrawing && this.previewElement && this.previewElement.width > 0 && this.previewElement.height > 0) {
      const { x, y, width, height, stroke, strokeWidth } = this.previewElement;
      
      ctx.save();
      ctx.strokeStyle = stroke;
      ctx.lineWidth = strokeWidth;
      ctx.setLineDash([5, 5]); // Dashed preview
      ctx.globalAlpha = 0.7; // Slightly transparent
      ctx.strokeRect(x, y, width, height);
      ctx.restore();
    }
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

export default RectangleTool;
