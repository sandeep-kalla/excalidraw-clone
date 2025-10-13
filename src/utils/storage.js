import { STORAGE_KEYS } from '../constants';

/**
 * LocalStorage utilities for canvas persistence
 */

/**
 * Save a canvas to localStorage
 * @param {Object} canvas - Canvas object to save
 * @returns {boolean} Success status
 */
export const saveCanvas = (canvas) => {
  try {
    const canvasesData = getAllCanvases();
    canvasesData[canvas.id] = canvas;
    
    localStorage.setItem(
      STORAGE_KEYS.CANVASES,
      JSON.stringify(canvasesData)
    );
    
    return true;
  } catch (error) {
    console.error('Error saving canvas:', error);
    if (error.name === 'QuotaExceededError') {
      console.warn('LocalStorage quota exceeded. Consider cleaning old canvases.');
    }
    return false;
  }
};

/**
 * Save multiple canvases at once
 * @param {Map} canvasesMap - Map of canvas objects
 * @returns {boolean} Success status
 */
export const saveAllCanvases = (canvasesMap) => {
  try {
    const canvasesData = {};
    canvasesMap.forEach((canvas, id) => {
      canvasesData[id] = canvas;
    });
    
    localStorage.setItem(
      STORAGE_KEYS.CANVASES,
      JSON.stringify(canvasesData)
    );
    
    return true;
  } catch (error) {
    console.error('Error saving canvases:', error);
    if (error.name === 'QuotaExceededError') {
      console.warn('LocalStorage quota exceeded. Consider cleaning old canvases.');
    }
    return false;
  }
};

/**
 * Load a canvas from localStorage by ID
 * @param {string} canvasId - Canvas ID to load
 * @returns {Object|null} Canvas object or null if not found
 */
export const loadCanvas = (canvasId) => {
  try {
    const canvasesData = getAllCanvases();
    return canvasesData[canvasId] || null;
  } catch (error) {
    console.error('Error loading canvas:', error);
    return null;
  }
};

/**
 * Get all canvases from localStorage
 * @returns {Object} Object with canvas IDs as keys
 */
export const getAllCanvases = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.CANVASES);
    return data ? JSON.parse(data) : {};
  } catch (error) {
    console.error('Error getting all canvases:', error);
    return {};
  }
};

/**
 * Get all canvases as an array sorted by update time
 * @returns {Array} Array of canvas objects
 */
export const getAllCanvasesArray = () => {
  const canvasesData = getAllCanvases();
  return Object.values(canvasesData).sort((a, b) => 
    new Date(b.updatedAt) - new Date(a.updatedAt)
  );
};

/**
 * Delete a canvas from localStorage
 * @param {string} canvasId - Canvas ID to delete
 * @returns {boolean} Success status
 */
export const deleteCanvas = (canvasId) => {
  try {
    const canvasesData = getAllCanvases();
    delete canvasesData[canvasId];
    
    localStorage.setItem(
      STORAGE_KEYS.CANVASES,
      JSON.stringify(canvasesData)
    );
    
    // Clear last canvas if it was deleted
    const lastCanvasId = getLastOpenedCanvasId();
    if (lastCanvasId === canvasId) {
      clearLastOpenedCanvasId();
    }
    
    return true;
  } catch (error) {
    console.error('Error deleting canvas:', error);
    return false;
  }
};

/**
 * Create a new blank canvas
 * @param {string} name - Canvas name
 * @returns {Object} New canvas object
 */
export const createNewCanvas = (name = 'Untitled Canvas') => {
  const now = new Date().toISOString();
  return {
    id: `canvas_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
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
 * Check if a canvas exists
 * @param {string} canvasId - Canvas ID to check
 * @returns {boolean} True if canvas exists
 */
export const canvasExists = (canvasId) => {
  const canvasesData = getAllCanvases();
  return canvasId in canvasesData;
};

/**
 * Get canvas count
 * @returns {number} Number of saved canvases
 */
export const getCanvasCount = () => {
  const canvasesData = getAllCanvases();
  return Object.keys(canvasesData).length;
};

/**
 * Save last opened canvas ID
 * @param {string} canvasId - Canvas ID
 */
export const saveLastOpenedCanvasId = (canvasId) => {
  try {
    localStorage.setItem(STORAGE_KEYS.LAST_CANVAS, canvasId);
  } catch (error) {
    console.error('Error saving last opened canvas ID:', error);
  }
};

/**
 * Get last opened canvas ID
 * @returns {string|null} Last canvas ID or null
 */
export const getLastOpenedCanvasId = () => {
  try {
    return localStorage.getItem(STORAGE_KEYS.LAST_CANVAS);
  } catch (error) {
    console.error('Error getting last opened canvas ID:', error);
    return null;
  }
};

/**
 * Clear last opened canvas ID
 */
export const clearLastOpenedCanvasId = () => {
  try {
    localStorage.removeItem(STORAGE_KEYS.LAST_CANVAS);
  } catch (error) {
    console.error('Error clearing last opened canvas ID:', error);
  }
};

/**
 * Save app settings
 * @param {Object} settings - Settings object
 */
export const saveSettings = (settings) => {
  try {
    const currentSettings = getSettings();
    const updatedSettings = { ...currentSettings, ...settings };
    localStorage.setItem(
      STORAGE_KEYS.SETTINGS,
      JSON.stringify(updatedSettings)
    );
  } catch (error) {
    console.error('Error saving settings:', error);
  }
};

/**
 * Get app settings
 * @returns {Object} Settings object
 */
export const getSettings = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    return data ? JSON.parse(data) : {};
  } catch (error) {
    console.error('Error getting settings:', error);
    return {};
  }
};

/**
 * Export canvas as JSON
 * @param {Object} canvas - Canvas to export
 * @returns {string} JSON string
 */
export const exportCanvasAsJSON = (canvas) => {
  return JSON.stringify(canvas, null, 2);
};

/**
 * Import canvas from JSON string
 * @param {string} jsonString - JSON string
 * @returns {Object|null} Parsed canvas or null if invalid
 */
export const importCanvasFromJSON = (jsonString) => {
  try {
    const canvas = JSON.parse(jsonString);
    
    // Validate basic canvas structure
    if (!canvas.id || !canvas.name || !Array.isArray(canvas.elements)) {
      throw new Error('Invalid canvas structure');
    }
    
    // Generate new ID and timestamps for imported canvas
    const now = new Date().toISOString();
    return {
      ...canvas,
      id: `canvas_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: `${canvas.name} (Imported)`,
      createdAt: now,
      updatedAt: now,
    };
  } catch (error) {
    console.error('Error importing canvas:', error);
    return null;
  }
};

/**
 * Get localStorage usage info
 * @returns {Object} Storage info with used and total bytes
 */
export const getStorageInfo = () => {
  try {
    let totalBytes = 0;
    for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        totalBytes += localStorage[key].length + key.length;
      }
    }
    
    const totalMB = (totalBytes / (1024 * 1024)).toFixed(2);
    const limitMB = 5; // Approximate localStorage limit
    const usagePercent = ((totalBytes / (limitMB * 1024 * 1024)) * 100).toFixed(1);
    
    return {
      totalBytes,
      totalMB,
      limitMB,
      usagePercent,
      isNearLimit: usagePercent > 80,
    };
  } catch (error) {
    console.error('Error getting storage info:', error);
    return {
      totalBytes: 0,
      totalMB: 0,
      limitMB: 5,
      usagePercent: 0,
      isNearLimit: false,
    };
  }
};

/**
 * Clear all canvas data (use with caution!)
 * @returns {boolean} Success status
 */
export const clearAllCanvases = () => {
  try {
    localStorage.removeItem(STORAGE_KEYS.CANVASES);
    localStorage.removeItem(STORAGE_KEYS.LAST_CANVAS);
    return true;
  } catch (error) {
    console.error('Error clearing all canvases:', error);
    return false;
  }
};

/**
 * Search canvases by name
 * @param {string} query - Search query
 * @returns {Array} Array of matching canvases
 */
export const searchCanvases = (query) => {
  const allCanvases = getAllCanvasesArray();
  const lowerQuery = query.toLowerCase();
  
  return allCanvases.filter(canvas =>
    canvas.name.toLowerCase().includes(lowerQuery)
  );
};

/**
 * Duplicate a canvas
 * @param {string} canvasId - Canvas ID to duplicate
 * @returns {Object|null} Duplicated canvas or null
 */
export const duplicateCanvas = (canvasId) => {
  try {
    const canvas = loadCanvas(canvasId);
    if (!canvas) return null;
    
    const now = new Date().toISOString();
    const duplicatedCanvas = {
      ...canvas,
      id: `canvas_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: `${canvas.name} (Copy)`,
      createdAt: now,
      updatedAt: now,
    };
    
    saveCanvas(duplicatedCanvas);
    return duplicatedCanvas;
  } catch (error) {
    console.error('Error duplicating canvas:', error);
    return null;
  }
};
