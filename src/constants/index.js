/**
 * Constants for Excalidraw Clone
 */

// Tool types
export const TOOLS = {
  SELECT: 'select',
  RECTANGLE: 'rectangle',
  ELLIPSE: 'ellipse',
  ARROW: 'arrow',
  DRAW: 'draw',
  TEXT: 'text',
  ERASER: 'eraser',
};

// Element types
export const ELEMENT_TYPES = {
  RECTANGLE: 'rectangle',
  ELLIPSE: 'ellipse',
  ARROW: 'arrow',
  DRAW: 'draw',
  TEXT: 'text',
};

// Color palette (Excalidraw-style)
export const COLORS = {
  // Grayscale
  BLACK: '#000000',
  GRAY_1: '#343a40',
  GRAY_2: '#495057',
  GRAY_3: '#868e96',
  GRAY_4: '#adb5bd',
  GRAY_5: '#ced4da',
  WHITE: '#ffffff',
  
  // Reds
  RED_1: '#c92a2a',
  RED_2: '#e03131',
  RED_3: '#fa5252',
  RED_4: '#ff6b6b',
  RED_5: '#ffc9c9',
  
  // Pinks
  PINK_1: '#a61e4d',
  PINK_2: '#c2255c',
  PINK_3: '#e64980',
  PINK_4: '#f06595',
  PINK_5: '#fcc2d7',
  
  // Purples
  PURPLE_1: '#862e9c',
  PURPLE_2: '#9c36b5',
  PURPLE_3: '#be4bdb',
  PURPLE_4: '#da77f2',
  PURPLE_5: '#f3d9fa',
  
  // Indigos
  INDIGO_1: '#3b5bdb',
  INDIGO_2: '#4c6ef5',
  INDIGO_3: '#5c7cfa',
  INDIGO_4: '#748ffc',
  INDIGO_5: '#dbe4ff',
  
  // Blues
  BLUE_1: '#1864ab',
  BLUE_2: '#1971c2',
  BLUE_3: '#228be6',
  BLUE_4: '#339af0',
  BLUE_5: '#a5d8ff',
  
  // Cyans
  CYAN_1: '#0b7285',
  CYAN_2: '#0c8599',
  CYAN_3: '#15aabf',
  CYAN_4: '#22b8cf',
  CYAN_5: '#99e9f2',
  
  // Teals
  TEAL_1: '#087f5b',
  TEAL_2: '#099268',
  TEAL_3: '#0ca678',
  TEAL_4: '#20c997',
  TEAL_5: '#96f2d7',
  
  // Greens
  GREEN_1: '#2b8a3e',
  GREEN_2: '#2f9e44',
  GREEN_3: '#37b24d',
  GREEN_4: '#51cf66',
  GREEN_5: '#b2f2bb',
  
  // Limes
  LIME_1: '#5c940d',
  LIME_2: '#66a80f',
  LIME_3: '#74b816',
  LIME_4: '#8ce99a',
  LIME_5: '#d8f5a2',
  
  // Yellows
  YELLOW_1: '#e67700',
  YELLOW_2: '#f08c00',
  YELLOW_3: '#fd7e14',
  YELLOW_4: '#ffa94d',
  YELLOW_5: '#ffe066',
  
  // Oranges
  ORANGE_1: '#d9480f',
  ORANGE_2: '#e8590c',
  ORANGE_3: '#f76707',
  ORANGE_4: '#ff8787',
  ORANGE_5: '#ffd8a8',
  
  // Special
  TRANSPARENT: 'transparent',
};

// Color palette organized for UI display
export const COLOR_PALETTE = [
  [COLORS.BLACK, COLORS.GRAY_1, COLORS.GRAY_2, COLORS.GRAY_3, COLORS.GRAY_4],
  [COLORS.RED_1, COLORS.RED_2, COLORS.RED_3, COLORS.RED_4, COLORS.RED_5],
  [COLORS.PINK_1, COLORS.PINK_2, COLORS.PINK_3, COLORS.PINK_4, COLORS.PINK_5],
  [COLORS.PURPLE_1, COLORS.PURPLE_2, COLORS.PURPLE_3, COLORS.PURPLE_4, COLORS.PURPLE_5],
  [COLORS.INDIGO_1, COLORS.INDIGO_2, COLORS.INDIGO_3, COLORS.INDIGO_4, COLORS.INDIGO_5],
  [COLORS.BLUE_1, COLORS.BLUE_2, COLORS.BLUE_3, COLORS.BLUE_4, COLORS.BLUE_5],
  [COLORS.CYAN_1, COLORS.CYAN_2, COLORS.CYAN_3, COLORS.CYAN_4, COLORS.CYAN_5],
  [COLORS.TEAL_1, COLORS.TEAL_2, COLORS.TEAL_3, COLORS.TEAL_4, COLORS.TEAL_5],
  [COLORS.GREEN_1, COLORS.GREEN_2, COLORS.GREEN_3, COLORS.GREEN_4, COLORS.GREEN_5],
  [COLORS.LIME_1, COLORS.LIME_2, COLORS.LIME_3, COLORS.LIME_4, COLORS.LIME_5],
  [COLORS.YELLOW_1, COLORS.YELLOW_2, COLORS.YELLOW_3, COLORS.YELLOW_4, COLORS.YELLOW_5],
  [COLORS.ORANGE_1, COLORS.ORANGE_2, COLORS.ORANGE_3, COLORS.ORANGE_4, COLORS.ORANGE_5],
];

// Stroke widths
export const STROKE_WIDTHS = {
  THIN: 1,
  MEDIUM: 2,
  THICK: 4,
  EXTRA_THICK: 8,
};

// Font sizes
export const FONT_SIZES = {
  SMALL: 16,
  MEDIUM: 20,
  LARGE: 28,
  EXTRA_LARGE: 36,
};

// Zoom levels
export const ZOOM = {
  MIN: 0.1,
  MAX: 3,
  STEP: 0.1,
  DEFAULT: 1,
};

// Canvas settings
export const CANVAS = {
  MIN_WIDTH: 10,
  MIN_HEIGHT: 10,
  SELECTION_PADDING: 8,
  RESIZE_HANDLE_SIZE: 8,
  GRID_SIZE: 20,
};

// LocalStorage keys
export const STORAGE_KEYS = {
  CANVASES: 'excalidraw_canvases',
  SETTINGS: 'excalidraw_settings',
  LAST_CANVAS: 'excalidraw_last_canvas_id',
};

// Keyboard shortcuts
export const SHORTCUTS = {
  SELECT: 'v',
  RECTANGLE: 'r',
  ELLIPSE: 'o',
  ARROW: 'a',
  DRAW: 'p',
  TEXT: 't',
  ERASER: 'e',
  DELETE: ['delete', 'backspace'],
  UNDO: 'ctrl+z',
  REDO: ['ctrl+shift+z', 'ctrl+y'],
  COPY: 'ctrl+c',
  PASTE: 'ctrl+v',
  CUT: 'ctrl+x',
  DUPLICATE: 'ctrl+d',
  SELECT_ALL: 'ctrl+a',
  ZOOM_IN: 'ctrl+=',
  ZOOM_OUT: 'ctrl+-',
  ZOOM_RESET: 'ctrl+0',
};

// Auto-save settings
export const AUTO_SAVE = {
  DEBOUNCE_MS: 500,
  ENABLED: true,
};

// Default element properties
export const DEFAULT_ELEMENT = {
  STROKE: COLORS.BLACK,
  FILL: COLORS.TRANSPARENT,
  STROKE_WIDTH: STROKE_WIDTHS.MEDIUM,
  OPACITY: 100,
  ROUGHNESS: 1,
  FONT_SIZE: FONT_SIZES.MEDIUM,
  FONT_FAMILY: 'Arial',
};
