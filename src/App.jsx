import { useState, useEffect, useCallback } from 'react';
import { Menu } from 'lucide-react';
import CanvasManager from './components/CanvasManager/CanvasManager';
import Canvas from './components/Canvas';
import Toolbar from './components/Toolbar';
import Sidebar from './components/Sidebar';
import FloatingActions from './components/FloatingActions';
import UndoRedo from './components/UndoRedo';
import { useCanvasStore, useEditorStore } from './store';
import { useToolShortcuts, useUndoRedoShortcuts, useSelectAllShortcut } from './hooks';
import { migrateAllCanvases } from './utils/migration';
import './App.css';

const App = () => {
  const [isCanvasManagerOpen, setIsCanvasManagerOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { currentCanvas, loadLastCanvas, createCanvas, undo, redo } = useCanvasStore();
  const { setCurrentTool, setSelectedElements } = useEditorStore();

  // Enable keyboard shortcuts for tools
  useToolShortcuts(setCurrentTool);
  
  // Enable keyboard shortcuts for undo/redo
  useUndoRedoShortcuts(undo, redo);
  
  // Handle select all (Ctrl+A)
  const handleSelectAll = useCallback(() => {
    // Switch to select tool
    setCurrentTool('select');
    
    // Select all elements on the canvas
    if (currentCanvas && currentCanvas.elements.length > 0) {
      const allElementIds = currentCanvas.elements.map(el => el.id);
      setSelectedElements(allElementIds);
    }
  }, [currentCanvas, setCurrentTool, setSelectedElements]);
  
  // Enable keyboard shortcut for select all
  useSelectAllShortcut(handleSelectAll);

  // Initialize app - load last canvas or show canvas manager
  useEffect(() => {
    // Run data migrations first
    migrateAllCanvases();
    
    // Then load the last canvas
    const initialized = loadLastCanvas();
    
    // If no canvas was loaded, create a default one or show canvas manager
    if (!initialized) {
      // Option 1: Automatically create a default canvas
      createCanvas('Untitled Canvas');
      
      // Option 2: Show canvas manager instead
      // setIsCanvasManagerOpen(true);
    }
  }, [loadLastCanvas, createCanvas]);

  return (
    <div className="h-screen w-screen flex flex-col bg-gray-50 overflow-hidden">
      {/* Toolbar at Top (replaces navbar) */}
      {currentCanvas && <Toolbar />}

      {/* Main Canvas Area */}
      <main className="flex-1 flex min-h-0 overflow-hidden relative">
        {/* App Title - Fixed Position */}
        {currentCanvas && (
          <div className="fixed top-3 left-16 z-40 pointer-events-none flex items-center h-12">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent leading-none px-1" 
                style={{ fontFamily: "'Pacifico', 'Brush Script MT', cursive" }}>
              CanvasX
            </h1>
          </div>
        )}

        {/* Hamburger Toggle Button - Always Fixed in Same Position */}
        {currentCanvas && (
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="fixed top-3 left-3 z-50 p-3 bg-white rounded-lg shadow-lg border border-gray-200 hover:bg-gray-50 transition-colors"
            title={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
          >
            <Menu size={20} className="text-gray-700" />
          </button>
        )}

        {/* Canvas Container - Full width always */}
        <div className="absolute inset-0">
          {currentCanvas ? (
            <Canvas />
          ) : (
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                  No Canvas Loaded
                </h2>
                <p className="text-gray-600">
                  Click "My Canvases" to create or open a canvas
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Left Sidebar - Overlay on top of canvas */}
        {currentCanvas && isSidebarOpen && (
          <Sidebar 
            isOpen={isSidebarOpen}
            onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
          />
        )}
      </main>

      {/* Floating Action Buttons - Top Right */}
      {currentCanvas && (
        <FloatingActions 
          onOpenCanvasManager={() => setIsCanvasManagerOpen(true)}
        />
      )}

      {/* Undo/Redo Controls - Bottom Left */}
      {currentCanvas && <UndoRedo />}

      {/* Canvas Manager Modal */}
      <CanvasManager
        isOpen={isCanvasManagerOpen}
        onClose={() => setIsCanvasManagerOpen(false)}
      />
    </div>
  );
};

export default App;
