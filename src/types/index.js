/**
 * Data Models and Type Definitions for Excalidraw Clone
 * Using JSDoc for type documentation
 */

/**
 * @typedef {'select' | 'rectangle' | 'ellipse' | 'arrow' | 'draw' | 'text' | 'eraser'} ToolType
 */

/**
 * @typedef {Object} Element
 * @property {string} id - Unique identifier
 * @property {'rectangle' | 'ellipse' | 'arrow' | 'draw' | 'text'} type - Element type
 * @property {number} x - X coordinate
 * @property {number} y - Y coordinate
 * @property {number} width - Element width
 * @property {number} height - Element height
 * @property {string} stroke - Stroke color (hex)
 * @property {string} fill - Fill color (hex or 'transparent')
 * @property {number} strokeWidth - Stroke width (1-5)
 * @property {number} roughness - Roughness level (0-3)
 * @property {number} seed - Random seed for consistent rendering
 * @property {number} angle - Rotation angle in degrees
 * @property {number} opacity - Opacity (0-100)
 * @property {Object[]} [points] - For draw/arrow elements
 * @property {string} [text] - For text elements
 * @property {number} [fontSize] - For text elements
 * @property {string} [fontFamily] - For text elements
 */

/**
 * @typedef {Object} AppState
 * @property {ToolType} currentTool - Currently selected tool
 * @property {string} strokeColor - Current stroke color
 * @property {string} fillColor - Current fill color
 * @property {number} strokeWidth - Current stroke width
 * @property {number} opacity - Current opacity (0-100)
 * @property {number} zoom - Zoom level (0.1 - 3)
 * @property {number} scrollX - Pan X offset
 * @property {number} scrollY - Pan Y offset
 * @property {string[]} selectedElementIds - IDs of selected elements
 */

/**
 * @typedef {Object} Canvas
 * @property {string} id - Unique canvas identifier
 * @property {string} name - Canvas name
 * @property {Element[]} elements - Array of elements on canvas
 * @property {AppState} appState - Current app state
 * @property {string} createdAt - ISO timestamp
 * @property {string} updatedAt - ISO timestamp
 */

/**
 * Creates a new element with default values
 * @param {string} type - Element type
 * @param {number} x - X coordinate
 * @param {number} y - Y coordinate
 * @param {Object} options - Additional options
 * @returns {Element}
 */
export const createElement = (type, x, y, options = {}) => {
  return {
    id: options.id || `el_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    type,
    x,
    y,
    width: options.width || 0,
    height: options.height || 0,
    stroke: options.stroke || '#000000',
    fill: options.fill || 'transparent',
    strokeWidth: options.strokeWidth || 2,
    roughness: options.roughness || 1,
    seed: options.seed || Math.floor(Math.random() * 2 ** 31),
    angle: options.angle || 0,
    opacity: options.opacity || 100,
    ...(type === 'draw' || type === 'arrow' ? { points: options.points || [] } : {}),
    ...(type === 'text' ? {
      text: options.text || '',
      fontSize: options.fontSize || 20,
      fontFamily: options.fontFamily || 'Arial'
    } : {}),
  };
};

/**
 * Creates a new canvas with default values
 * @param {string} name - Canvas name
 * @param {string} [id] - Optional canvas ID
 * @returns {Canvas}
 */
export const createCanvas = (name, id = null) => {
  const now = new Date().toISOString();
  return {
    id: id || `canvas_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    name,
    elements: [],
    appState: {
      currentTool: 'select',
      strokeColor: '#000000',
      fillColor: 'transparent',
      strokeWidth: 2,
      opacity: 100,
      zoom: 1,
      scrollX: 0,
      scrollY: 0,
      selectedElementIds: [],
    },
    createdAt: now,
    updatedAt: now,
  };
};

/**
 * Creates default app state
 * @returns {AppState}
 */
export const createDefaultAppState = () => ({
  currentTool: 'select',
  strokeColor: '#000000',
  fillColor: 'transparent',
  strokeWidth: 2,
  opacity: 100,
  zoom: 1,
  scrollX: 0,
  scrollY: 0,
  selectedElementIds: [],
});
