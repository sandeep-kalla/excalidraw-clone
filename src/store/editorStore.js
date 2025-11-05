import { create } from 'zustand';
import { TOOLS, DEFAULT_ELEMENT, ZOOM } from '../constants';

/**
 * Editor Store - Manages editor state (tool, colors, zoom, selection, etc.)
 */
export const useEditorStore = create((set, get) => ({
  // Current tool
  currentTool: TOOLS.SELECT,
  
  // Style settings
  strokeColor: DEFAULT_ELEMENT.STROKE,
  fillColor: DEFAULT_ELEMENT.FILL,
  strokeWidth: DEFAULT_ELEMENT.STROKE_WIDTH,
  opacity: DEFAULT_ELEMENT.OPACITY,
  fontFamily: DEFAULT_ELEMENT.FONT_FAMILY || 'Arial, sans-serif',
  
  // Viewport settings
  zoom: ZOOM.DEFAULT,
  scrollX: 0,
  scrollY: 0,
  
  // Selection
  selectedElementIds: [],
  
  // Clipboard
  clipboard: [],
  
  // Drawing state
  isDrawing: false,
  isPanning: false,
  
  // Preview element (shown while drawing)
  previewElement: null,

  /**
   * Set current tool
   */
  setCurrentTool: (tool) => set({ 
    currentTool: tool,
    previewElement: null,
    isDrawing: false 
  }),

  /**
   * Set stroke color
   */
  setStrokeColor: (color) => set({ strokeColor: color }),

  /**
   * Set fill color
   */
  setFillColor: (color) => set({ fillColor: color }),

  /**
   * Set stroke width
   */
  setStrokeWidth: (width) => set({ strokeWidth: width }),

  /**
   * Set opacity
   */
  setOpacity: (opacity) => set({ opacity }),

  /**
   * Set font family
   */
  setFontFamily: (fontFamily) => set({ fontFamily }),

  /**
   * Set zoom level
   */
  setZoom: (zoom) => {
    const clampedZoom = Math.max(ZOOM.MIN, Math.min(ZOOM.MAX, zoom));
    set({ zoom: clampedZoom });
  },

  /**
   * Zoom in
   */
  zoomIn: () => {
    const newZoom = Math.min(get().zoom + ZOOM.STEP, ZOOM.MAX);
    set({ zoom: newZoom });
  },

  /**
   * Zoom out
   */
  zoomOut: () => {
    const newZoom = Math.max(get().zoom - ZOOM.STEP, ZOOM.MIN);
    set({ zoom: newZoom });
  },

  /**
   * Reset zoom to default
   */
  resetZoom: () => set({ zoom: ZOOM.DEFAULT }),

  /**
   * Set scroll position
   */
  setScroll: (scrollX, scrollY) => set({ scrollX, scrollY }),

  /**
   * Pan the viewport
   */
  pan: (deltaX, deltaY) => set((state) => ({
    scrollX: state.scrollX + deltaX,
    scrollY: state.scrollY + deltaY,
  })),

  /**
   * Set selected element IDs
   */
  setSelectedElements: (elementIds) => set({ 
    selectedElementIds: Array.isArray(elementIds) ? elementIds : [elementIds] 
  }),

  /**
   * Add to selection
   */
  addToSelection: (elementId) => set((state) => ({
    selectedElementIds: [...state.selectedElementIds, elementId]
  })),

  /**
   * Remove from selection
   */
  removeFromSelection: (elementId) => set((state) => ({
    selectedElementIds: state.selectedElementIds.filter(id => id !== elementId)
  })),

  /**
   * Clear selection
   */
  clearSelection: () => set({ selectedElementIds: [] }),

  /**
   * Set clipboard content
   */
  setClipboard: (elements) => set({ clipboard: elements }),

  /**
   * Get clipboard content
   */
  getClipboard: () => get().clipboard,

  /**
   * Set drawing state
   */
  setIsDrawing: (isDrawing) => set({ isDrawing }),

  /**
   * Set panning state
   */
  setIsPanning: (isPanning) => set({ isPanning }),

  /**
   * Set preview element
   */
  setPreviewElement: (element) => set({ previewElement: element }),

  /**
   * Clear preview element
   */
  clearPreviewElement: () => set({ previewElement: null }),

  /**
   * Apply style to selected elements (updates canvas through canvasStore)
   */
  applyStyleToSelection: (styleUpdates) => {
    // This will be called from components that have access to both stores
    const selectedIds = get().selectedElementIds;
    return { selectedIds, styleUpdates };
  },

  /**
   * Get current style settings
   */
  getCurrentStyle: () => ({
    stroke: get().strokeColor,
    fill: get().fillColor,
    strokeWidth: get().strokeWidth,
    opacity: get().opacity,
    fontFamily: get().fontFamily,
  }),

  /**
   * Reset to default state
   */
  reset: () => set({
    currentTool: TOOLS.SELECT,
    strokeColor: DEFAULT_ELEMENT.STROKE,
    fillColor: DEFAULT_ELEMENT.FILL,
    strokeWidth: DEFAULT_ELEMENT.STROKE_WIDTH,
    opacity: DEFAULT_ELEMENT.OPACITY,
    fontFamily: DEFAULT_ELEMENT.FONT_FAMILY || 'Arial, sans-serif',
    zoom: ZOOM.DEFAULT,
    scrollX: 0,
    scrollY: 0,
    selectedElementIds: [],
    isDrawing: false,
    isPanning: false,
    previewElement: null,
  }),
}));
