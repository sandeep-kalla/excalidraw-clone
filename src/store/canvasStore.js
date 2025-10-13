import { create } from 'zustand';
import { createCanvas } from '../types';
import * as storage from '../utils/storage';
import { useHistoryStore } from './historyStore';

/**
 * Canvas Store - Manages all canvases and current canvas state
 */
export const useCanvasStore = create((set, get) => ({
  // Current active canvas
  currentCanvas: null,
  
  // Map of all canvases (id -> canvas)
  canvases: new Map(),
  
  // Flag to track unsaved changes
  hasUnsavedChanges: false,
  
  // Loading state
  isLoading: false,

  /**
   * Set the current canvas
   */
  setCurrentCanvas: (canvas) => set({ 
    currentCanvas: canvas,
    hasUnsavedChanges: false 
  }),

  /**
   * Create a new canvas
   */
  createNewCanvas: (name = 'Untitled Canvas') => {
    const newCanvas = createCanvas(name);
    const canvases = new Map(get().canvases);
    canvases.set(newCanvas.id, newCanvas);
    
    set({ 
      currentCanvas: newCanvas,
      canvases,
      hasUnsavedChanges: true 
    });
    
    return newCanvas;
  },

  /**
   * Update current canvas
   */
  updateCurrentCanvas: (updates) => {
    const currentCanvas = get().currentCanvas;
    if (!currentCanvas) return;

    const updatedCanvas = {
      ...currentCanvas,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    const canvases = new Map(get().canvases);
    canvases.set(updatedCanvas.id, updatedCanvas);

    set({ 
      currentCanvas: updatedCanvas,
      canvases,
      hasUnsavedChanges: true 
    });
  },

  /**
   * Update canvas name
   */
  updateCanvasName: (canvasId, newName) => {
    const canvases = new Map(get().canvases);
    const canvas = canvases.get(canvasId);
    
    if (canvas) {
      const updatedCanvas = {
        ...canvas,
        name: newName,
        updatedAt: new Date().toISOString(),
      };
      canvases.set(canvasId, updatedCanvas);
      
      set({ 
        canvases,
        currentCanvas: get().currentCanvas?.id === canvasId ? updatedCanvas : get().currentCanvas,
        hasUnsavedChanges: true 
      });
    }
  },

  /**
   * Add element to current canvas
   */
  addElement: (element) => {
    const currentCanvas = get().currentCanvas;
    if (!currentCanvas) return;

    const updatedCanvas = {
      ...currentCanvas,
      elements: [...currentCanvas.elements, element],
      updatedAt: new Date().toISOString(),
    };

    const canvases = new Map(get().canvases);
    canvases.set(updatedCanvas.id, updatedCanvas);

    set({ 
      currentCanvas: updatedCanvas,
      canvases,
      hasUnsavedChanges: true 
    });
    
    // Note: History commit is handled by tools calling commitChanges()
  },

  /**
   * Update element in current canvas
   */
  updateElement: (elementId, updates) => {
    const currentCanvas = get().currentCanvas;
    if (!currentCanvas) return;

    const updatedCanvas = {
      ...currentCanvas,
      elements: currentCanvas.elements.map(el =>
        el.id === elementId ? { ...el, ...updates } : el
      ),
      updatedAt: new Date().toISOString(),
    };

    const canvases = new Map(get().canvases);
    canvases.set(updatedCanvas.id, updatedCanvas);

    set({ 
      currentCanvas: updatedCanvas,
      canvases,
      hasUnsavedChanges: true 
    });
    
    // Note: History commit is handled by tools calling commitChanges()
  },

  /**
   * Delete element from current canvas
   */
  deleteElement: (elementId) => {
    const currentCanvas = get().currentCanvas;
    if (!currentCanvas) return;

    const updatedCanvas = {
      ...currentCanvas,
      elements: currentCanvas.elements.filter(el => el.id !== elementId),
      updatedAt: new Date().toISOString(),
    };

    const canvases = new Map(get().canvases);
    canvases.set(updatedCanvas.id, updatedCanvas);

    set({ 
      currentCanvas: updatedCanvas,
      canvases,
      hasUnsavedChanges: true 
    });
    
    // Note: History commit is handled by tools calling commitChanges()
  },

  /**
   * Delete multiple elements
   */
  deleteElements: (elementIds) => {
    const currentCanvas = get().currentCanvas;
    if (!currentCanvas) return;

    const elementIdSet = new Set(elementIds);
    const updatedCanvas = {
      ...currentCanvas,
      elements: currentCanvas.elements.filter(el => !elementIdSet.has(el.id)),
      updatedAt: new Date().toISOString(),
    };

    const canvases = new Map(get().canvases);
    canvases.set(updatedCanvas.id, updatedCanvas);

    set({ 
      currentCanvas: updatedCanvas,
      canvases,
      hasUnsavedChanges: true 
    });
  },

  /**
   * Delete a canvas
   */
  deleteCanvas: (canvasId) => {
    const canvases = new Map(get().canvases);
    canvases.delete(canvasId);
    
    const currentCanvas = get().currentCanvas;
    const newCurrentCanvas = currentCanvas?.id === canvasId ? null : currentCanvas;
    
    set({ 
      canvases,
      currentCanvas: newCurrentCanvas,
      hasUnsavedChanges: true 
    });
  },

  /**
   * Duplicate a canvas
   */
  duplicateCanvas: (canvasId) => {
    const canvases = new Map(get().canvases);
    const canvas = canvases.get(canvasId);
    
    if (canvas) {
      const duplicatedCanvas = {
        ...canvas,
        id: `canvas_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        name: `${canvas.name} (Copy)`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      canvases.set(duplicatedCanvas.id, duplicatedCanvas);
      
      set({ 
        canvases,
        hasUnsavedChanges: true 
      });
      
      return duplicatedCanvas;
    }
    
    return null;
  },

  /**
   * Load all canvases (from localStorage)
   */
  loadCanvases: (canvasesMap) => {
    set({ 
      canvases: new Map(canvasesMap),
      isLoading: false 
    });
  },

  /**
   * Set loading state
   */
  setLoading: (isLoading) => set({ isLoading }),

  /**
   * Mark changes as saved
   */
  markAsSaved: () => set({ hasUnsavedChanges: false }),

  /**
   * Clear all canvases (for testing)
   */
  clearAll: () => set({ 
    currentCanvas: null,
    canvases: new Map(),
    hasUnsavedChanges: false 
  }),

  /**
   * Create a new canvas and save to localStorage
   */
  createCanvas: (name = 'Untitled Canvas') => {
    const newCanvas = createCanvas(name);
    const canvases = new Map(get().canvases);
    canvases.set(newCanvas.id, newCanvas);
    
    // Save to localStorage
    storage.saveCanvas(newCanvas);
    storage.saveLastOpenedCanvasId(newCanvas.id);
    
    // Initialize history with the new canvas
    useHistoryStore.getState().initializeHistory(newCanvas);
    
    set({ 
      currentCanvas: newCanvas,
      canvases,
      hasUnsavedChanges: false 
    });
    
    return newCanvas;
  },

  /**
   * Load a canvas by ID from localStorage
   */
  loadCanvas: (canvasId) => {
    const canvas = storage.loadCanvas(canvasId);
    if (canvas) {
      const canvases = new Map(get().canvases);
      canvases.set(canvas.id, canvas);
      
      storage.saveLastOpenedCanvasId(canvasId);
      
      // Initialize history with the loaded canvas
      useHistoryStore.getState().initializeHistory(canvas);
      
      set({ 
        currentCanvas: canvas,
        canvases,
        hasUnsavedChanges: false 
      });
      
      return true;
    }
    return false;
  },

  /**
   * Load last opened canvas or initialize from localStorage
   */
  loadLastCanvas: () => {
    const lastCanvasId = storage.getLastOpenedCanvasId();
    
    if (lastCanvasId) {
      const canvas = storage.loadCanvas(lastCanvasId);
      if (canvas) {
        const canvases = new Map();
        
        // Load all canvases
        const allCanvases = storage.getAllCanvases();
        Object.values(allCanvases).forEach(c => {
          canvases.set(c.id, c);
        });
        
        // Initialize history with the loaded canvas
        useHistoryStore.getState().initializeHistory(canvas);
        
        set({ 
          currentCanvas: canvas,
          canvases,
          hasUnsavedChanges: false 
        });
        
        return true;
      }
    }
    
    // Load all canvases even if no last canvas
    const allCanvases = storage.getAllCanvases();
    const canvasesMap = new Map();
    Object.values(allCanvases).forEach(c => {
      canvasesMap.set(c.id, c);
    });
    
    set({ 
      canvases: canvasesMap,
      currentCanvas: null,
      hasUnsavedChanges: false 
    });
    
    return false;
  },

  /**
   * Save current canvas to localStorage
   */
  saveCanvas: () => {
    const currentCanvas = get().currentCanvas;
    if (currentCanvas) {
      const success = storage.saveCanvas(currentCanvas);
      if (success) {
        set({ hasUnsavedChanges: false });
      }
      return success;
    }
    return false;
  },

  /**
   * Rename a canvas
   */
  renameCanvas: (canvasId, newName) => {
    const canvases = new Map(get().canvases);
    const canvas = canvases.get(canvasId);
    
    if (canvas) {
      const updatedCanvas = {
        ...canvas,
        name: newName,
        updatedAt: new Date().toISOString(),
      };
      canvases.set(canvasId, updatedCanvas);
      
      // Save to localStorage
      storage.saveCanvas(updatedCanvas);
      
      set({ 
        canvases,
        currentCanvas: get().currentCanvas?.id === canvasId ? updatedCanvas : get().currentCanvas,
        hasUnsavedChanges: false 
      });
    }
  },

  /**
   * Delete a canvas (with localStorage sync)
   */
  deleteCanvas: (canvasId) => {
    const canvases = new Map(get().canvases);
    canvases.delete(canvasId);
    
    // Delete from localStorage
    storage.deleteCanvas(canvasId);
    
    const currentCanvas = get().currentCanvas;
    const newCurrentCanvas = currentCanvas?.id === canvasId ? null : currentCanvas;
    
    set({ 
      canvases,
      currentCanvas: newCurrentCanvas,
      hasUnsavedChanges: false 
    });
  },

  /**
   * Duplicate a canvas (with localStorage sync)
   */
  duplicateCanvas: (canvasId) => {
    const duplicated = storage.duplicateCanvas(canvasId);
    
    if (duplicated) {
      const canvases = new Map(get().canvases);
      canvases.set(duplicated.id, duplicated);
      
      set({ 
        canvases,
        hasUnsavedChanges: false 
      });
      
      return duplicated;
    }
    
    return null;
  },

  /**
   * Get all canvases as array (helper function)
   */
  getAllCanvases: () => {
    return Array.from(get().canvases.values());
  },

  /**
   * Commit current state to history (for undo/redo)
   */
  commitToHistory: () => {
    const currentCanvas = get().currentCanvas;
    if (currentCanvas) {
      useHistoryStore.getState().pushState(currentCanvas);
    }
  },

  /**
   * Undo last action
   */
  undo: () => {
    const currentCanvas = get().currentCanvas;
    if (!currentCanvas) return;
    
    const { undoStack } = useHistoryStore.getState();
    
    // Need at least 2 states (current + previous) to undo
    if (undoStack.length < 2) {
      return;
    }
    
    const previousState = useHistoryStore.getState().undo(currentCanvas);
    
    if (previousState) {
      // Restore the previous state without triggering history
      const canvases = new Map(get().canvases);
      canvases.set(previousState.id, previousState);
      
      set({
        currentCanvas: previousState,
        canvases,
        hasUnsavedChanges: true
      });
    }
  },

  /**
   * Redo last undone action
   */
  redo: () => {
    const currentCanvas = get().currentCanvas;
    if (!currentCanvas) return;
    
    const nextState = useHistoryStore.getState().redo(currentCanvas);
    
    if (nextState) {
      // Restore the next state without triggering history
      const canvases = new Map(get().canvases);
      canvases.set(nextState.id, nextState);
      
      set({
        currentCanvas: nextState,
        canvases,
        hasUnsavedChanges: true
      });
    }
  },

  /**
   * Check if undo is available
   */
  canUndo: () => {
    return useHistoryStore.getState().canUndo();
  },

  /**
   * Check if redo is available
   */
  canRedo: () => {
    return useHistoryStore.getState().canRedo();
  },
}));
