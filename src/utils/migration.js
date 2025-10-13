/**
 * Data Migration Utilities
 * Handle schema changes and version upgrades gracefully
 */

// Current schema version
export const CURRENT_VERSION = '1.0.0';

/**
 * Migrate canvas data to the latest version
 * @param {Object} canvas - Canvas object to migrate
 * @returns {Object} Migrated canvas
 */
export const migrateCanvas = (canvas) => {
  if (!canvas) return null;

  // If no version, assume it's version 1.0.0
  const version = canvas.version || '1.0.0';

  let migratedCanvas = { ...canvas };

  // Apply migrations in sequence
  if (compareVersions(version, '1.0.0') < 0) {
    migratedCanvas = migrateToV1_0_0(migratedCanvas);
  }

  // Add future migrations here
  // if (compareVersions(version, '1.1.0') < 0) {
  //   migratedCanvas = migrateToV1_1_0(migratedCanvas);
  // }

  // Set current version
  migratedCanvas.version = CURRENT_VERSION;

  return migratedCanvas;
};

/**
 * Migrate to version 1.0.0
 * Ensures all required fields exist
 */
const migrateToV1_0_0 = (canvas) => {
  return {
    id: canvas.id || `canvas_${Date.now()}`,
    name: canvas.name || 'Untitled Canvas',
    elements: Array.isArray(canvas.elements) ? canvas.elements : [],
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
      ...(canvas.appState || {}),
    },
    createdAt: canvas.createdAt || new Date().toISOString(),
    updatedAt: canvas.updatedAt || new Date().toISOString(),
    version: '1.0.0',
  };
};

/**
 * Compare two semantic version strings
 * @param {string} v1 - First version
 * @param {string} v2 - Second version
 * @returns {number} -1 if v1 < v2, 0 if equal, 1 if v1 > v2
 */
const compareVersions = (v1, v2) => {
  const parts1 = v1.split('.').map(Number);
  const parts2 = v2.split('.').map(Number);

  for (let i = 0; i < Math.max(parts1.length, parts2.length); i++) {
    const num1 = parts1[i] || 0;
    const num2 = parts2[i] || 0;

    if (num1 < num2) return -1;
    if (num1 > num2) return 1;
  }

  return 0;
};

/**
 * Migrate all canvases in localStorage
 * @returns {boolean} Success status
 */
export const migrateAllCanvases = () => {
  try {
    const canvasesData = JSON.parse(localStorage.getItem('excalidraw_canvases') || '{}');
    let migrated = false;

    Object.keys(canvasesData).forEach((id) => {
      const canvas = canvasesData[id];
      const currentVersion = canvas.version || '0.0.0';

      if (compareVersions(currentVersion, CURRENT_VERSION) < 0) {
        canvasesData[id] = migrateCanvas(canvas);
        migrated = true;
      }
    });

    if (migrated) {
      localStorage.setItem('excalidraw_canvases', JSON.stringify(canvasesData));
      console.log('Canvases migrated to version', CURRENT_VERSION);
    }

    return true;
  } catch (error) {
    console.error('Migration failed:', error);
    return false;
  }
};

/**
 * Validate canvas structure
 * @param {Object} canvas - Canvas to validate
 * @returns {boolean} True if valid
 */
export const validateCanvas = (canvas) => {
  if (!canvas || typeof canvas !== 'object') return false;
  if (!canvas.id || typeof canvas.id !== 'string') return false;
  if (!canvas.name || typeof canvas.name !== 'string') return false;
  if (!Array.isArray(canvas.elements)) return false;
  if (!canvas.appState || typeof canvas.appState !== 'object') return false;

  return true;
};

/**
 * Get migration info
 * @returns {Object} Migration information
 */
export const getMigrationInfo = () => {
  try {
    const canvasesData = JSON.parse(localStorage.getItem('excalidraw_canvases') || '{}');
    const canvases = Object.values(canvasesData);

    const versionCounts = {};
    canvases.forEach((canvas) => {
      const version = canvas.version || '0.0.0';
      versionCounts[version] = (versionCounts[version] || 0) + 1;
    });

    const needsMigration = canvases.some(
      (canvas) => compareVersions(canvas.version || '0.0.0', CURRENT_VERSION) < 0
    );

    return {
      currentVersion: CURRENT_VERSION,
      totalCanvases: canvases.length,
      versionCounts,
      needsMigration,
    };
  } catch (error) {
    console.error('Error getting migration info:', error);
    return {
      currentVersion: CURRENT_VERSION,
      totalCanvases: 0,
      versionCounts: {},
      needsMigration: false,
    };
  }
};
