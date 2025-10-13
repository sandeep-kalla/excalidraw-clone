/**
 * Eraser Tool
 * Click on element to delete it, or drag to delete multiple elements
 */
class EraserTool {
  constructor() {
    this.name = 'eraser';
    this.cursor = 'crosshair';
    this.isDragging = false;
    this.deletedElements = new Set();
    this.eraserPath = [];
    this.eraserRadius = 20; // Radius for eraser detection
  }

  onMouseDown(e, state) {
    const { x, y } = this.getCanvasCoordinates(e, state);
    this.isDragging = true;
    this.deletedElements.clear();
    this.eraserPath = [{ x, y }];
    
    // Check if clicking on an element
    const elements = state.getElements();
    const clickedElement = this.getElementAtPoint(x, y, elements);
    
    if (clickedElement) {
      this.deletedElements.add(clickedElement.id);
      state.deleteElement(clickedElement.id);
    }
  }

  onMouseMove(e, state) {
    if (!this.isDragging) return;
    
    const { x, y } = this.getCanvasCoordinates(e, state);
    this.eraserPath.push({ x, y });
    
    // Check all elements along the eraser path
    const elements = state.getElements();
    
    elements.forEach(element => {
      // Skip if already deleted
      if (this.deletedElements.has(element.id)) return;
      
      // Check if element intersects with eraser path
      if (this.intersectsWithEraserPath(element)) {
        this.deletedElements.add(element.id);
        state.deleteElement(element.id);
      }
    });
  }

  onMouseUp(e, state) {
    if (this.isDragging && this.deletedElements.size > 0) {
      state.commitChanges();
    }
    
    this.isDragging = false;
    this.deletedElements.clear();
    this.eraserPath = [];
  }

  onKeyDown(e, state) {
    // Eraser tool doesn't need keyboard handling
  }

  /**
   * Check if element intersects with eraser path
   */
  intersectsWithEraserPath(element) {
    // Check if any point in the eraser path is close to the element
    for (const point of this.eraserPath) {
      if (this.isPointNearElement(point.x, point.y, element)) {
        return true;
      }
    }
    return false;
  }

  /**
   * Check if a point is near an element (within eraser radius)
   */
  isPointNearElement(x, y, element) {
    const radius = this.eraserRadius;
    
    switch (element.type) {
      case 'rectangle':
        // Check if point is within or near rectangle bounds
        return (
          x >= element.x - radius &&
          x <= element.x + element.width + radius &&
          y >= element.y - radius &&
          y <= element.y + element.height + radius
        );
        
      case 'ellipse':
        // Check if point is within or near ellipse
        const centerX = element.x + element.width / 2;
        const centerY = element.y + element.height / 2;
        const rx = element.width / 2 + radius;
        const ry = element.height / 2 + radius;
        
        const normalizedX = (x - centerX) / rx;
        const normalizedY = (y - centerY) / ry;
        
        return (normalizedX * normalizedX + normalizedY * normalizedY) <= 1;
        
      case 'arrow':
      case 'line':
        // Check if point is near the line
        return this.distanceToLineSegment(
          x, y,
          element.x, element.y,
          element.x + element.width, element.y + element.height
        ) <= radius;
        
      case 'draw':
      case 'freedraw':
        // Check if point is near any point in the path
        if (!element.points || element.points.length === 0) return false;
        
        for (const point of element.points) {
          // Points are stored as {x, y} objects, not arrays
          const px = point.x;
          const py = point.y;
          const distance = Math.sqrt((x - px) ** 2 + (y - py) ** 2);
          if (distance <= radius) return true;
        }
        return false;
        
      case 'text':
        // Check if point is within text bounds
        return (
          x >= element.x - radius &&
          x <= element.x + element.width + radius &&
          y >= element.y - radius &&
          y <= element.y + element.height + radius
        );
        
      default:
        return false;
    }
  }

  /**
   * Calculate distance from point to line segment
   */
  distanceToLineSegment(px, py, x1, y1, x2, y2) {
    const A = px - x1;
    const B = py - y1;
    const C = x2 - x1;
    const D = y2 - y1;

    const dot = A * C + B * D;
    const lenSq = C * C + D * D;
    let param = -1;

    if (lenSq !== 0) {
      param = dot / lenSq;
    }

    let xx, yy;

    if (param < 0) {
      xx = x1;
      yy = y1;
    } else if (param > 1) {
      xx = x2;
      yy = y2;
    } else {
      xx = x1 + param * C;
      yy = y1 + param * D;
    }

    const dx = px - xx;
    const dy = py - yy;
    return Math.sqrt(dx * dx + dy * dy);
  }

  /**
   * Get element at point
   */
  getElementAtPoint(x, y, elements) {
    // Check in reverse order (top to bottom)
    for (let i = elements.length - 1; i >= 0; i--) {
      const element = elements[i];
      if (this.isPointNearElement(x, y, element)) {
        return element;
      }
    }
    return null;
  }

  render(ctx, state) {
    if (!this.isDragging || this.eraserPath.length === 0) return;
    
    // Draw eraser cursor trail
    ctx.save();
    ctx.strokeStyle = '#ff6b6b';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.globalAlpha = 0.5;
    
    // Draw eraser circle at current position
    const lastPoint = this.eraserPath[this.eraserPath.length - 1];
    ctx.beginPath();
    ctx.arc(lastPoint.x, lastPoint.y, this.eraserRadius, 0, Math.PI * 2);
    ctx.stroke();
    
    ctx.restore();
  }

  reset() {
    this.isDragging = false;
    this.deletedElements.clear();
    this.eraserPath = [];
  }

  // Helper methods
  getCanvasCoordinates(e, state) {
    const rect = e.target.getBoundingClientRect();
    const x = (e.clientX - rect.left - state.scrollX) / state.zoom;
    const y = (e.clientY - rect.top - state.scrollY) / state.zoom;
    return { x, y };
  }
}

export default EraserTool;
