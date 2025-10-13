import { nanoid } from 'nanoid';

// Helper to check if point is inside element bounds
const isPointInElement = (x, y, element) => {
  const { x: ex, y: ey, width, height } = element;
  return x >= ex && x <= ex + width && y >= ey && y <= ey + height;
};

// Helper to get element bounds considering rotation
const getElementBounds = (element) => {
  return {
    x: element.x,
    y: element.y,
    width: element.width,
    height: element.height,
  };
};

// Helper to check if point is on resize handle
const HANDLE_SIZE = 8;
const getResizeHandle = (x, y, element) => {
  const { x: ex, y: ey, width, height } = element;
  const handles = {
    nw: { x: ex, y: ey },
    n: { x: ex + width / 2, y: ey },
    ne: { x: ex + width, y: ey },
    e: { x: ex + width, y: ey + height / 2 },
    se: { x: ex + width, y: ey + height },
    s: { x: ex + width / 2, y: ey + height },
    sw: { x: ex, y: ey + height },
    w: { x: ex, y: ey + height / 2 },
  };

  for (const [position, handle] of Object.entries(handles)) {
    const distance = Math.sqrt(
      Math.pow(x - handle.x, 2) + Math.pow(y - handle.y, 2)
    );
    if (distance <= HANDLE_SIZE) {
      return position;
    }
  }
  return null;
};

class SelectTool {
  constructor() {
    this.name = 'select';
    this.cursor = 'default';
    this.isDragging = false;
    this.isResizing = false;
    this.resizeHandle = null;
    this.dragStart = null;
    this.selectionBox = null;
    this.initialElementStates = new Map();
    this.lastClickTime = 0;
    this.lastClickElement = null;
  }

  onMouseDown(e, state) {
    const { x, y } = this.getCanvasCoordinates(e, state);
    const elements = state.getElements();
    const selectedIds = state.getSelectedIds();

    // Check if clicking on resize handle
    if (selectedIds.length === 1) {
      const selectedElement = elements.find(el => el.id === selectedIds[0]);
      if (selectedElement) {
        const handle = getResizeHandle(x, y, selectedElement);
        if (handle) {
          this.isResizing = true;
          this.resizeHandle = handle;
          this.dragStart = { x, y };
          this.initialElementStates.set(selectedElement.id, { ...selectedElement });
          return;
        }
      }
    }

    // Check if clicking on already selected element
    const clickedElement = this.getElementAtPoint(x, y, elements);
    
    if (clickedElement) {
      // Check for double-click on text element
      const currentTime = Date.now();
      const isDoubleClick = 
        this.lastClickElement === clickedElement.id && 
        currentTime - this.lastClickTime < 300;
      
      if (isDoubleClick && clickedElement.type === 'text') {
        // Switch to text tool and start editing
        state.setCurrentTool('text');
        // Need to manually trigger text editing - the text tool will handle this
        const textTool = state.tools?.find(t => t.name === 'text');
        if (textTool) {
          textTool.startEditingExisting(state, clickedElement.id, e);
        }
        this.lastClickTime = 0;
        this.lastClickElement = null;
        return;
      }
      
      this.lastClickTime = currentTime;
      this.lastClickElement = clickedElement.id;
      
      // Multi-select with Ctrl/Shift
      if (e.ctrlKey || e.shiftKey) {
        if (selectedIds.includes(clickedElement.id)) {
          // Deselect
          state.setSelectedIds(selectedIds.filter(id => id !== clickedElement.id));
        } else {
          // Add to selection
          state.setSelectedIds([...selectedIds, clickedElement.id]);
        }
      } else {
        // Single select (if not already selected)
        if (!selectedIds.includes(clickedElement.id)) {
          state.setSelectedIds([clickedElement.id]);
        }
        
        // Start dragging
        this.isDragging = true;
        this.dragStart = { x, y };
        
        // Store initial states for all selected elements
        selectedIds.forEach(id => {
          const element = elements.find(el => el.id === id);
          if (element) {
            this.initialElementStates.set(id, { ...element });
          }
        });
        
        // If clicking on non-selected element, also store its state
        if (!selectedIds.includes(clickedElement.id)) {
          this.initialElementStates.set(clickedElement.id, { ...clickedElement });
        }
      }
    } else {
      // Clicking on empty space
      const currentTime = Date.now();
      const isDoubleClick = 
        this.lastClickElement === null && 
        currentTime - this.lastClickTime < 300;
      
      if (isDoubleClick) {
        // Double-click on empty space - create text element
        state.setCurrentTool('text');
        const textTool = state.tools?.find(t => t.name === 'text');
        if (textTool) {
          // Create new text at click position
          textTool.createNewText(x, y, state, e.target);
        }
        this.lastClickTime = 0;
        this.lastClickElement = null;
        return;
      }
      
      this.lastClickTime = currentTime;
      this.lastClickElement = null;
      
      // Start selection box
      if (!e.ctrlKey && !e.shiftKey) {
        state.setSelectedIds([]);
      }
      this.selectionBox = { startX: x, startY: y, endX: x, endY: y };
    }
  }

  onMouseMove(e, state) {
    const { x, y } = this.getCanvasCoordinates(e, state);
    const elements = state.getElements();
    const selectedIds = state.getSelectedIds();

    // Update cursor based on hover
    if (!this.isDragging && !this.isResizing && !this.selectionBox) {
      if (selectedIds.length === 1) {
        const selectedElement = elements.find(el => el.id === selectedIds[0]);
        if (selectedElement) {
          const handle = getResizeHandle(x, y, selectedElement);
          if (handle) {
            this.cursor = this.getResizeCursor(handle);
            return;
          }
        }
      }
      
      const hoveredElement = this.getElementAtPoint(x, y, elements);
      this.cursor = hoveredElement ? 'move' : 'default';
    }

    // Handle resizing
    if (this.isResizing && this.dragStart && selectedIds.length === 1) {
      const selectedElement = elements.find(el => el.id === selectedIds[0]);
      if (selectedElement) {
        const initial = this.initialElementStates.get(selectedElement.id);
        const dx = x - this.dragStart.x;
        const dy = y - this.dragStart.y;

        const newElement = this.calculateResize(initial, dx, dy, this.resizeHandle);
        state.updateElement(selectedElement.id, newElement);
      }
      return;
    }

    // Handle dragging
    if (this.isDragging && this.dragStart) {
      const dx = x - this.dragStart.x;
      const dy = y - this.dragStart.y;

      selectedIds.forEach(id => {
        const initial = this.initialElementStates.get(id);
        if (initial) {
          const updates = {
            x: initial.x + dx,
            y: initial.y + dy,
          };
          
          // Special handling for draw/freedraw elements - update points array
          if ((initial.type === 'draw' || initial.type === 'freedraw') && initial.points) {
            updates.points = initial.points.map(p => ({
              x: p.x + dx,
              y: p.y + dy
            }));
          }
          
          // Special handling for arrow elements - update x1, y1, x2, y2
          if (initial.type === 'arrow' && initial.x1 !== undefined) {
            updates.x1 = initial.x1 + dx;
            updates.y1 = initial.y1 + dy;
            updates.x2 = initial.x2 + dx;
            updates.y2 = initial.y2 + dy;
          }
          
          state.updateElement(id, updates);
        }
      });
      return;
    }

    // Handle selection box
    if (this.selectionBox) {
      this.selectionBox.endX = x;
      this.selectionBox.endY = y;

      // Find elements within selection box
      const boxBounds = this.getSelectionBoxBounds();
      const elementsInBox = elements.filter(el => 
        this.isElementInBox(el, boxBounds)
      );

      state.setSelectedIds(elementsInBox.map(el => el.id));
    }
  }

  onMouseUp(e, state) {
    if (this.isDragging || this.isResizing) {
      // Add to history for undo/redo
      state.commitChanges();
    }

    this.isDragging = false;
    this.isResizing = false;
    this.resizeHandle = null;
    this.dragStart = null;
    this.selectionBox = null;
    this.initialElementStates.clear();
    this.cursor = 'default';
  }

  onKeyDown(e, state) {
    const selectedIds = state.getSelectedIds();
    
    // Delete selected elements
    if ((e.key === 'Delete' || e.key === 'Backspace') && selectedIds.length > 0) {
      e.preventDefault();
      selectedIds.forEach(id => state.deleteElement(id));
      state.setSelectedIds([]);
      state.commitChanges();
    }

    // Copy (Ctrl+C)
    if (e.ctrlKey && e.key === 'c' && selectedIds.length > 0) {
      e.preventDefault();
      const elements = state.getElements();
      const selectedElements = elements.filter(el => selectedIds.includes(el.id));
      state.setClipboard(selectedElements);
    }

    // Cut (Ctrl+X)
    if (e.ctrlKey && e.key === 'x' && selectedIds.length > 0) {
      e.preventDefault();
      const elements = state.getElements();
      const selectedElements = elements.filter(el => selectedIds.includes(el.id));
      state.setClipboard(selectedElements);
      selectedIds.forEach(id => state.deleteElement(id));
      state.setSelectedIds([]);
      state.commitChanges();
    }

    // Paste (Ctrl+V)
    if (e.ctrlKey && e.key === 'v') {
      e.preventDefault();
      const clipboard = state.getClipboard();
      if (clipboard && clipboard.length > 0) {
        const newIds = [];
        clipboard.forEach(el => {
          const newElement = {
            ...el,
            id: nanoid(),
            x: el.x + 20, // Offset pasted elements
            y: el.y + 20,
          };
          state.addElement(newElement);
          newIds.push(newElement.id);
        });
        state.setSelectedIds(newIds);
        state.commitChanges();
      }
    }

    // Select all (Ctrl+A)
    if (e.ctrlKey && e.key === 'a') {
      e.preventDefault();
      const elements = state.getElements();
      state.setSelectedIds(elements.map(el => el.id));
    }
  }

  render(ctx, state) {
    const selectedIds = state.getSelectedIds();
    if (selectedIds.length === 0 && !this.selectionBox) return;

    const elements = state.getElements();

    // Render selection box
    if (this.selectionBox) {
      const bounds = this.getSelectionBoxBounds();
      ctx.save();
      ctx.strokeStyle = '#1971c2';
      ctx.fillStyle = 'rgba(25, 113, 194, 0.1)';
      ctx.lineWidth = 1;
      ctx.setLineDash([5, 5]);
      ctx.strokeRect(bounds.x, bounds.y, bounds.width, bounds.height);
      ctx.fillRect(bounds.x, bounds.y, bounds.width, bounds.height);
      ctx.restore();
    }

    // Render selection bounds and handles
    selectedIds.forEach(id => {
      const element = elements.find(el => el.id === id);
      if (!element) return;

      const { x, y, width, height } = element;

      // Selection outline
      ctx.save();
      ctx.strokeStyle = '#1971c2';
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);
      ctx.strokeRect(x, y, width, height);
      ctx.restore();

      // Resize handles (only for single selection)
      if (selectedIds.length === 1) {
        this.renderResizeHandles(ctx, element);
      }
    });
  }

  renderResizeHandles(ctx, element) {
    const { x, y, width, height } = element;
    const handles = [
      { x: x, y: y }, // nw
      { x: x + width / 2, y: y }, // n
      { x: x + width, y: y }, // ne
      { x: x + width, y: y + height / 2 }, // e
      { x: x + width, y: y + height }, // se
      { x: x + width / 2, y: y + height }, // s
      { x: x, y: y + height }, // sw
      { x: x, y: y + height / 2 }, // w
    ];

    ctx.save();
    ctx.fillStyle = '#ffffff';
    ctx.strokeStyle = '#1971c2';
    ctx.lineWidth = 2;

    handles.forEach(handle => {
      ctx.fillRect(
        handle.x - HANDLE_SIZE / 2,
        handle.y - HANDLE_SIZE / 2,
        HANDLE_SIZE,
        HANDLE_SIZE
      );
      ctx.strokeRect(
        handle.x - HANDLE_SIZE / 2,
        handle.y - HANDLE_SIZE / 2,
        HANDLE_SIZE,
        HANDLE_SIZE
      );
    });
    ctx.restore();
  }

  // Helper methods
  getCanvasCoordinates(e, state) {
    const rect = e.target.getBoundingClientRect();
    const x = (e.clientX - rect.left - state.scrollX) / state.zoom;
    const y = (e.clientY - rect.top - state.scrollY) / state.zoom;
    return { x, y };
  }

  getElementAtPoint(x, y, elements) {
    // Check in reverse order (top to bottom)
    for (let i = elements.length - 1; i >= 0; i--) {
      if (isPointInElement(x, y, elements[i])) {
        return elements[i];
      }
    }
    return null;
  }

  getSelectionBoxBounds() {
    if (!this.selectionBox) return null;
    const { startX, startY, endX, endY } = this.selectionBox;
    return {
      x: Math.min(startX, endX),
      y: Math.min(startY, endY),
      width: Math.abs(endX - startX),
      height: Math.abs(endY - startY),
    };
  }

  isElementInBox(element, boxBounds) {
    const { x, y, width, height } = element;
    return (
      x >= boxBounds.x &&
      y >= boxBounds.y &&
      x + width <= boxBounds.x + boxBounds.width &&
      y + height <= boxBounds.y + boxBounds.height
    );
  }

  calculateResize(initial, dx, dy, handle) {
    let newProps = { ...initial };

    switch (handle) {
      case 'nw':
        newProps.x = initial.x + dx;
        newProps.y = initial.y + dy;
        newProps.width = initial.width - dx;
        newProps.height = initial.height - dy;
        break;
      case 'n':
        newProps.y = initial.y + dy;
        newProps.height = initial.height - dy;
        break;
      case 'ne':
        newProps.y = initial.y + dy;
        newProps.width = initial.width + dx;
        newProps.height = initial.height - dy;
        break;
      case 'e':
        newProps.width = initial.width + dx;
        break;
      case 'se':
        newProps.width = initial.width + dx;
        newProps.height = initial.height + dy;
        break;
      case 's':
        newProps.height = initial.height + dy;
        break;
      case 'sw':
        newProps.x = initial.x + dx;
        newProps.width = initial.width - dx;
        newProps.height = initial.height + dy;
        break;
      case 'w':
        newProps.x = initial.x + dx;
        newProps.width = initial.width - dx;
        break;
    }

    // Prevent negative dimensions
    if (newProps.width < 10) {
      newProps.width = 10;
      if (handle.includes('w')) {
        newProps.x = initial.x + initial.width - 10;
      }
    }
    if (newProps.height < 10) {
      newProps.height = 10;
      if (handle.includes('n')) {
        newProps.y = initial.y + initial.height - 10;
      }
    }

    // Special handling for text elements - scale font size based on height
    if (initial.type === 'text') {
      const heightRatio = newProps.height / initial.height;
      const currentFontSize = initial.fontSize || 20;
      newProps.fontSize = Math.max(8, Math.round(currentFontSize * heightRatio));
    }

    return newProps;
  }

  getResizeCursor(handle) {
    const cursors = {
      nw: 'nw-resize',
      n: 'n-resize',
      ne: 'ne-resize',
      e: 'e-resize',
      se: 'se-resize',
      s: 's-resize',
      sw: 'sw-resize',
      w: 'w-resize',
    };
    return cursors[handle] || 'default';
  }
}

export default SelectTool;
