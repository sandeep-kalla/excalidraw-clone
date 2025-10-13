import { create } from 'zustand';

/**
 * History Store - Manages undo/redo functionality
 * Uses Command Pattern for tracking changes
 */
export const useHistoryStore = create((set, get) => ({
  // Undo stack - array of canvas states
  undoStack: [],
  
  // Redo stack - array of canvas states
  redoStack: [],
  
  // Maximum history size
  maxHistorySize: 50,

  /**
   * Push current state to history
   * @param {Object} canvasState - Current canvas state to save
   */
  pushState: (canvasState) => {
    const { undoStack, maxHistorySize } = get();
    
    // Deep clone the state to avoid reference issues
    const stateCopy = JSON.parse(JSON.stringify(canvasState));
    
    // Add to undo stack
    const newUndoStack = [...undoStack, stateCopy];
    
    // Limit stack size
    if (newUndoStack.length > maxHistorySize) {
      newUndoStack.shift();
    }
    
    set({ 
      undoStack: newUndoStack,
      redoStack: [] // Clear redo stack on new action
    });
  },

  /**
   * Undo last action
   * @param {Object} currentState - Current canvas state to push to redo
   * @returns {Object|null} Previous canvas state or null
   */
  undo: (currentState) => {
    const { undoStack, redoStack } = get();
    
    if (undoStack.length <= 1) {
      // Need at least 2 states to undo (current + previous)
      return null;
    }
    
    // Save current state to redo stack
    const currentStateCopy = JSON.parse(JSON.stringify(currentState));
    
    // Pop from undo stack (remove current state)
    const newUndoStack = [...undoStack];
    newUndoStack.pop(); // Remove current state
    
    // Get previous state (now at the top)
    const previousState = newUndoStack[newUndoStack.length - 1];
    
    set({
      undoStack: newUndoStack,
      redoStack: [...redoStack, currentStateCopy]
    });
    
    return previousState;
  },

  /**
   * Redo last undone action
   * @param {Object} currentState - Current canvas state to push to undo
   * @returns {Object|null} Next canvas state or null
   */
  redo: (currentState) => {
    const { undoStack, redoStack } = get();
    
    if (redoStack.length === 0) {
      return null;
    }
    
    // Save current state back to undo stack
    const currentStateCopy = JSON.parse(JSON.stringify(currentState));
    
    // Pop from redo stack
    const newRedoStack = [...redoStack];
    const nextState = newRedoStack.pop();
    
    set({
      undoStack: [...undoStack, currentStateCopy],
      redoStack: newRedoStack
    });
    
    return nextState;
  },

  /**
   * Check if undo is available
   */
  canUndo: () => {
    return get().undoStack.length > 1; // Need at least 2 states
  },

  /**
   * Check if redo is available
   */
  canRedo: () => {
    return get().redoStack.length > 0;
  },

  /**
   * Clear all history
   */
  clearHistory: () => set({ 
    undoStack: [],
    redoStack: [] 
  }),

  /**
   * Initialize history with initial state
   */
  initializeHistory: (initialState) => {
    const stateCopy = JSON.parse(JSON.stringify(initialState));
    set({ 
      undoStack: [stateCopy],
      redoStack: [] 
    });
  },

  /**
   * Get history stats (for debugging)
   */
  getHistoryStats: () => ({
    undoCount: get().undoStack.length,
    redoCount: get().redoStack.length,
    canUndo: get().undoStack.length > 0,
    canRedo: get().redoStack.length > 0,
  }),
}));
