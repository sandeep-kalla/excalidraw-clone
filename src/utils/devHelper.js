import { nanoid } from 'nanoid';

/**
 * Development Helper: Add Test Elements
 * 
 * This file provides utilities to quickly add test elements to the canvas
 * for testing the Selection Tool and other drawing tools.
 * 
 * Usage: Call from browser console or temporarily in App.jsx
 */

/**
 * Add sample elements to the current canvas for testing
 */
export const addTestElements = (canvasStore) => {
  const testElements = [
    // Red Rectangle
    {
      id: nanoid(),
      type: 'rectangle',
      x: 100,
      y: 100,
      width: 200,
      height: 150,
      stroke: '#e03131',
      fill: 'transparent',
      strokeWidth: 2,
      opacity: 100,
      roughness: 1,
      seed: Math.floor(Math.random() * 1000000),
    },
    // Green Ellipse
    {
      id: nanoid(),
      type: 'ellipse',
      x: 400,
      y: 120,
      width: 180,
      height: 180,
      stroke: '#2f9e44',
      fill: 'transparent',
      strokeWidth: 2,
      opacity: 100,
      roughness: 1,
      seed: Math.floor(Math.random() * 1000000),
    },
    // Blue Rectangle
    {
      id: nanoid(),
      type: 'rectangle',
      x: 150,
      y: 350,
      width: 250,
      height: 100,
      stroke: '#1971c2',
      fill: 'transparent',
      strokeWidth: 3,
      opacity: 100,
      roughness: 1,
      seed: Math.floor(Math.random() * 1000000),
    },
    // Purple Small Square
    {
      id: nanoid(),
      type: 'rectangle',
      x: 500,
      y: 400,
      width: 100,
      height: 100,
      stroke: '#9c36b5',
      fill: 'transparent',
      strokeWidth: 2,
      opacity: 100,
      roughness: 1,
      seed: Math.floor(Math.random() * 1000000),
    },
    // Orange Ellipse
    {
      id: nanoid(),
      type: 'ellipse',
      x: 700,
      y: 150,
      width: 140,
      height: 200,
      stroke: '#f76707',
      fill: 'transparent',
      strokeWidth: 2,
      opacity: 100,
      roughness: 1,
      seed: Math.floor(Math.random() * 1000000),
    },
  ];

  // Add each test element to the canvas
  testElements.forEach(element => {
    canvasStore.addElement(element);
  });

  // Save the canvas
  canvasStore.saveCanvas();

  console.log('✅ Added 5 test elements to canvas');
  console.log('📝 Try the following:');
  console.log('  - Click to select an element');
  console.log('  - Drag to move it');
  console.log('  - Drag selection box to select multiple');
  console.log('  - Ctrl+Click to multi-select');
  console.log('  - Resize using handles (for single selection)');
  console.log('  - Press Delete to remove');
  console.log('  - Ctrl+C/V to copy/paste');
};

/**
 * Clear all elements from the canvas
 */
export const clearAllElements = (canvasStore) => {
  const currentCanvas = canvasStore.currentCanvas;
  if (currentCanvas) {
    currentCanvas.elements.forEach(el => {
      canvasStore.deleteElement(el.id);
    });
    canvasStore.saveCanvas();
    console.log('✅ Cleared all elements from canvas');
  }
};

/**
 * Add a grid of rectangles for testing
 */
export const addGridTest = (canvasStore) => {
  const colors = ['#e03131', '#2f9e44', '#1971c2', '#f76707', '#9c36b5'];
  const elements = [];

  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 3; col++) {
      elements.push({
        id: nanoid(),
        type: 'rectangle',
        x: 100 + col * 200,
        y: 100 + row * 150,
        width: 150,
        height: 100,
        stroke: colors[(row * 3 + col) % colors.length],
        fill: 'transparent',
        strokeWidth: 2,
        opacity: 100,
        roughness: 1,
        seed: Math.floor(Math.random() * 1000000),
      });
    }
  }

  elements.forEach(element => {
    canvasStore.addElement(element);
  });

  canvasStore.saveCanvas();
  console.log('✅ Added 3x3 grid of test rectangles');
};

/**
 * Switch to a specific tool
 */
export const switchTool = (toolName, editorStore) => {
  const validTools = ['select', 'rectangle', 'ellipse', 'arrow', 'draw', 'text', 'eraser'];
  if (validTools.includes(toolName)) {
    editorStore.setCurrentTool(toolName);
    console.log(`✅ Switched to ${toolName} tool`);
  } else {
    console.error(`❌ Invalid tool: ${toolName}. Valid tools: ${validTools.join(', ')}`);
  }
};

// Export for use in browser console
if (typeof window !== 'undefined') {
  window.addTestElements = addTestElements;
  window.clearAllElements = clearAllElements;
  window.addGridTest = addGridTest;
  window.switchTool = switchTool;
}

export default {
  addTestElements,
  clearAllElements,
  addGridTest,
  switchTool,
};
