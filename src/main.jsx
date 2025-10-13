import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { useCanvasStore, useEditorStore } from './store'
import devHelper from './utils/devHelper'

// Expose stores and helpers to window for development/testing
if (import.meta.env.DEV) {
  window.__CANVAS_STORE__ = useCanvasStore;
  window.__EDITOR_STORE__ = useEditorStore;
  window.__DEV_HELPER__ = devHelper;
  window.addTestElements = (store = useCanvasStore.getState()) => devHelper.addTestElements(store);
  window.clearAllElements = (store = useCanvasStore.getState()) => devHelper.clearAllElements(store);
  window.addGridTest = (store = useCanvasStore.getState()) => devHelper.addGridTest(store);
  window.switchTool = (toolName, store = useEditorStore.getState()) => devHelper.switchTool(toolName, store);
  
  console.log('%c🎨 Excalidraw Clone - Dev Mode', 'color: #1971c2; font-size: 16px; font-weight: bold');
  console.log('%cDev helpers available:', 'color: #2f9e44; font-weight: bold');
  console.log('  addTestElements() - Add 5 test shapes');
  console.log('  addGridTest() - Add 3x3 grid of rectangles');
  console.log('  clearAllElements() - Clear all elements');
  console.log('  switchTool(name) - Switch tool (select, rectangle, ellipse, arrow, draw, text, eraser)');
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
