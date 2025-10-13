import { useState } from 'react';
import {
  Menu,
  FolderOpen,
  Save,
  Edit2,
  Check,
  X,
} from 'lucide-react';
import ExportMenu from './ExportMenu';
import { useCanvasStore } from '../../store';

/**
 * Top Navigation Bar component
 * Minimal, compact design inspired by Excalidraw
 */
export default function Navbar({ onOpenCanvasManager }) {
  const { currentCanvas, saveCanvas, renameCanvas } = useCanvasStore();
  const [isEditingName, setIsEditingName] = useState(false);
  const [editName, setEditName] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [showSaveToast, setShowSaveToast] = useState(false);

  const handleStartEdit = () => {
    if (currentCanvas) {
      setEditName(currentCanvas.name);
      setIsEditingName(true);
    }
  };

  const handleSaveName = () => {
    const name = editName.trim();
    if (name && name !== currentCanvas.name) {
      renameCanvas(currentCanvas.id, name);
    }
    setIsEditingName(false);
  };

  const handleCancelEdit = () => {
    setIsEditingName(false);
    setEditName('');
  };

  const handleSaveCanvas = () => {
    if (currentCanvas) {
      setIsSaving(true);
      saveCanvas();
      
      // Show saving indicator briefly
      setTimeout(() => {
        setIsSaving(false);
        // Show success toast
        setShowSaveToast(true);
        setTimeout(() => {
          setShowSaveToast(false);
        }, 3000);
      }, 500);
    }
  };

  return (
    <nav className="bg-white border-b border-gray-200 px-3 py-2">
      <div className="flex items-center justify-between max-w-full">
        {/* Left section: App Name + Canvas Name */}
        <div className="flex items-center gap-3 min-w-0">
          {/* App Logo/Name - Compact */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <Menu size={20} className="text-gray-600" />
            <span className="text-sm font-semibold text-gray-800">
              Excalidraw Clone
            </span>
          </div>

          {/* Canvas Name (editable) */}
          {currentCanvas && (
            <>
              <div className="h-4 w-px bg-gray-300 flex-shrink-0" />
              <div className="flex items-center gap-1 min-w-0">
                {isEditingName ? (
                  <>
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSaveName();
                        if (e.key === 'Escape') handleCancelEdit();
                      }}
                      className="px-2 py-1 text-sm border border-blue-500 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 min-w-[150px]"
                      autoFocus
                    />
                    <button
                      onClick={handleSaveName}
                      className="p-1 rounded hover:bg-green-50 text-green-600"
                      title="Save name"
                    >
                      <Check size={16} />
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="p-1 rounded hover:bg-red-50 text-red-600"
                      title="Cancel"
                    >
                      <X size={16} />
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={handleStartEdit}
                      className="flex items-center gap-1.5 px-2 py-1 rounded hover:bg-gray-100 text-gray-700 transition-colors group max-w-xs"
                      title="Click to rename"
                    >
                      <span className="text-sm font-medium truncate">
                        {currentCanvas.name}
                      </span>
                      <Edit2 size={14} className="text-gray-400 group-hover:text-gray-600 flex-shrink-0" />
                    </button>
                  </>
                )}
              </div>
            </>
          )}
        </div>

        {/* Right section: Action buttons - Compact */}
        <div className="flex items-center gap-2">
          {/* Save indicator */}
          {currentCanvas && (
            <span className="text-xs text-gray-500 mr-1">
              {isSaving ? 'Saving...' : 'Saved'}
            </span>
          )}

          {/* Save Button - Icon only */}
          <button
            onClick={handleSaveCanvas}
            disabled={!currentCanvas || isSaving}
            className="p-2 rounded-lg hover:bg-gray-100 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            title="Save (Ctrl+S)"
          >
            <Save size={18} />
          </button>

          {/* Export Menu */}
          <ExportMenu />

          {/* My Canvases Button */}
          <button
            onClick={onOpenCanvasManager}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
          >
            <FolderOpen size={16} />
            My Canvases
          </button>
        </div>
      </div>

      {/* Save Success Toast */}
      {showSaveToast && (
        <div className="fixed bottom-4 left-4 bg-green-600 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 z-50 animate-slide-up">
          <Check size={20} />
          <span className="font-medium">Canvas saved successfully!</span>
          <button
            onClick={() => setShowSaveToast(false)}
            className="ml-2 hover:bg-green-700 rounded p-1 transition-colors"
          >
            <X size={16} />
          </button>
        </div>
      )}
    </nav>
  );
}
