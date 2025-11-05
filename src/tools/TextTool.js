import { nanoid } from 'nanoid';

/**
 * Text Tool
 * Double-click or click to create and edit text elements
 */
class TextTool {
  constructor() {
    this.name = 'text';
    this.cursor = 'text';
    this.isEditing = false;
    this.editingElementId = null;
    this.textareaElement = null;
    this.clickTimeout = null;
    this.clickCount = 0;
  }

  onMouseDown(e, state) {
    const { x, y } = this.getCanvasCoordinates(e, state);
    
    // Don't create new text if already editing
    if (this.isEditing) {
      return;
    }
    
    // Check if clicking on existing text element
    const elements = state.getElements();
    const clickedText = this.getTextElementAtPoint(x, y, elements);
    
    if (clickedText) {
      // Edit existing text (no double-click needed)
      this.startEditing(clickedText, state, e.target);
      return;
    }
    
    // Single click on empty space - create new text
    this.createNewText(x, y, state, e.target);
  }

  onMouseMove(e, state) {
    // Text tool doesn't need mouse move handling
  }

  onMouseUp(e, state) {
    // Text tool doesn't need mouse up handling
  }

  onKeyDown(e, state) {
    // Handle escape to cancel editing
    if (e.key === 'Escape' && this.isEditing) {
      e.preventDefault();
      this.finishEditing(state, true); // true = cancel
    }
  }

  /**
   * Create a new text element at the given position
   */
  createNewText(x, y, state, canvasElement) {
    const style = state.getCurrentStyle ? state.getCurrentStyle() : {
      stroke: '#000000',
      strokeWidth: 2,
      opacity: 100,
      fontFamily: 'Arial, sans-serif',
    };

    const newElement = {
      id: nanoid(),
      type: 'text',
      x,
      y,
      width: 100, // Initial width, will be updated
      height: 24, // Initial height, will be updated
      text: '',
      stroke: style.stroke,
      fontSize: 20,
      fontFamily: style.fontFamily || 'Arial, sans-serif',
      fontWeight: 'normal',
      textAlign: 'left',
      opacity: style.opacity,
    };

    state.addElement(newElement);
    this.startEditing(newElement, state, canvasElement);
  }

  /**
   * Start editing a text element
   */
  startEditing(element, state, canvasElement) {
    if (this.isEditing) {
      this.finishEditing(state);
    }

    this.isEditing = true;
    this.editingElementId = element.id;

    // Create textarea overlay
    const textarea = document.createElement('textarea');
    textarea.value = element.text || '';
    textarea.className = 'excalidraw-text-editor';
    
    // Style the textarea to match the text element
    const zoom = state.zoom || 1;
    const scrollX = state.scrollX || 0;
    const scrollY = state.scrollY || 0;
    
    // Calculate screen position
    const rect = canvasElement.getBoundingClientRect();
    const screenX = element.x * zoom + scrollX + rect.left;
    const screenY = element.y * zoom + scrollY + rect.top;
    
    Object.assign(textarea.style, {
      position: 'fixed',
      left: `${screenX}px`,
      top: `${screenY}px`,
      fontSize: `${element.fontSize * zoom}px`,
      fontFamily: element.fontFamily || 'Arial, sans-serif',
      fontWeight: element.fontWeight || 'normal',
      color: element.stroke || '#000000',
      background: 'transparent',
      border: 'none',
      outline: 'none',
      padding: '2px',
      margin: '0',
      resize: 'none',
      overflow: 'hidden',
      whiteSpace: 'pre-wrap',
      wordWrap: 'break-word',
      minWidth: '20px',
      minHeight: '24px',
      zIndex: '10000',
      lineHeight: '1.4',
      boxShadow: 'none',
      caretColor: element.stroke || '#000000',
    });

    // Add to document
    document.body.appendChild(textarea);
    this.textareaElement = textarea;
    
    // Focus immediately with requestAnimationFrame to ensure it's rendered
    requestAnimationFrame(() => {
      textarea.focus();
      textarea.select();
    });

    // Auto-resize textarea as user types
    const autoResize = () => {
      textarea.style.height = 'auto';
      textarea.style.width = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
      textarea.style.width = `${Math.max(100, textarea.scrollWidth + 10)}px`;
    };

    textarea.addEventListener('input', autoResize);
    autoResize();

    // Handle clicking outside or pressing Enter to finish
    const handleClickOutside = (e) => {
      if (e.target !== textarea) {
        this.finishEditing(state);
        document.removeEventListener('mousedown', handleClickOutside);
      }
    };

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        this.finishEditing(state, true); // Cancel
        textarea.removeEventListener('keydown', handleKeyDown);
      } else if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
        // Ctrl+Enter or Cmd+Enter to finish
        e.preventDefault();
        this.finishEditing(state);
        textarea.removeEventListener('keydown', handleKeyDown);
      }
      // Regular Enter adds a new line (default behavior)
    };

    // Add event listeners
    setTimeout(() => {
      document.addEventListener('mousedown', handleClickOutside);
      textarea.addEventListener('keydown', handleKeyDown);
    }, 100); // Small delay to prevent immediate trigger
  }

  /**
   * Start editing an existing text element (called from SelectTool double-click)
   */
  startEditingExisting(state, elementId, mouseEvent) {
    const elements = state.getElements();
    const element = elements.find(el => el.id === elementId);
    
    if (element && element.type === 'text') {
      const canvasElement = mouseEvent.target;
      this.startEditing(element, state, canvasElement);
    }
  }

  /**
   * Finish editing and update the text element
   */
  finishEditing(state, cancel = false) {
    if (!this.isEditing || !this.textareaElement) {
      return;
    }

    const textarea = this.textareaElement;
    const text = cancel ? '' : textarea.value.trim();

    if (this.editingElementId) {
      if (text === '') {
        // Delete empty text elements
        state.deleteElement(this.editingElementId);
      } else {
        // Get the current element to preserve its fontSize
        const elements = state.getElements();
        const currentElement = elements.find(el => el.id === this.editingElementId);
        const currentFontSize = currentElement?.fontSize || 20;
        const currentFontFamily = currentElement?.fontFamily || 'Arial, sans-serif';
        const currentFontWeight = currentElement?.fontWeight || 'normal';
        
        // Update text content and calculate dimensions using the element's actual font size
        const dimensions = this.measureText(text, {
          fontSize: currentFontSize,
          fontFamily: currentFontFamily,
          fontWeight: currentFontWeight,
        });

        state.updateElement(this.editingElementId, {
          text,
          width: dimensions.width,
          height: dimensions.height,
          // Preserve the fontSize (don't let it be overwritten)
          fontSize: currentFontSize,
        });
      }
      
      state.commitChanges();
      
      // Switch back to select tool after creating/editing text
      if (state.setCurrentTool) {
        state.setCurrentTool('select');
      }
    }

    // Clean up
    if (textarea.parentNode) {
      textarea.parentNode.removeChild(textarea);
    }
    
    this.textareaElement = null;
    this.isEditing = false;
    this.editingElementId = null;
  }

  /**
   * Measure text dimensions
   */
  measureText(text, options) {
    // Create a temporary canvas for text measurement
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    ctx.font = `${options.fontWeight || 'normal'} ${options.fontSize || 20}px ${options.fontFamily || 'Arial'}`;
    
    const lines = text.split('\n');
    let maxWidth = 0;
    
    lines.forEach(line => {
      const metrics = ctx.measureText(line);
      maxWidth = Math.max(maxWidth, metrics.width);
    });
    
    const lineHeight = (options.fontSize || 20) * 1.4;
    const height = lines.length * lineHeight;
    
    return {
      width: Math.max(100, maxWidth + 10), // Add padding
      height: Math.max(24, height),
    };
  }

  /**
   * Get text element at point
   */
  getTextElementAtPoint(x, y, elements) {
    // Check in reverse order (top to bottom)
    for (let i = elements.length - 1; i >= 0; i--) {
      const element = elements[i];
      if (element.type === 'text') {
        if (
          x >= element.x &&
          x <= element.x + element.width &&
          y >= element.y &&
          y <= element.y + element.height
        ) {
          return element;
        }
      }
    }
    return null;
  }

  render(ctx, state) {
    // Text tool doesn't render anything itself
    // Text elements are rendered by the renderer
  }

  reset() {
    if (this.isEditing) {
      this.finishEditing(null, true);
    }
    this.clickCount = 0;
    if (this.clickTimeout) {
      clearTimeout(this.clickTimeout);
      this.clickTimeout = null;
    }
  }

  // Helper methods
  getCanvasCoordinates(e, state) {
    const rect = e.target.getBoundingClientRect();
    const x = (e.clientX - rect.left - state.scrollX) / state.zoom;
    const y = (e.clientY - rect.top - state.scrollY) / state.zoom;
    return { x, y };
  }
}

export default TextTool;
