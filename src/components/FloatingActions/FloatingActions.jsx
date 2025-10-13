import { useState, useRef } from 'react';
import {
  Download,
  FolderOpen,
  Check,
  X,
  FileJson,
  Image,
  FileType,
  Upload,
  Copy,
} from 'lucide-react';
import { useCanvasStore } from '../../store';
import {
  exportToPNG,
  exportToSVG,
  exportToJSON,
  importFromJSON,
  copyToClipboard,
} from '../../utils/export';
import * as storage from '../../utils/storage';
import AutoSaveIndicator from '../AutoSaveIndicator';

/**
 * Floating Action Buttons
 * Positioned at top-right corner
 */
export default function FloatingActions({ onOpenCanvasManager, onToggleSidebar, isSidebarOpen }) {
  const [isExportMenuOpen, setIsExportMenuOpen] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const fileInputRef = useRef(null);
  
  const { currentCanvas, loadCanvas } = useCanvasStore();

  const handleExportPNG = () => {
    if (!currentCanvas) return;
    
    const filename = `${currentCanvas.name.replace(/\s+/g, '-')}.png`;
    const success = exportToPNG(currentCanvas, filename);
    
    if (success) {
      showSuccessToast('Exported as PNG!');
    }
    setIsExportMenuOpen(false);
  };

  const handleExportSVG = () => {
    if (!currentCanvas) return;
    
    const filename = `${currentCanvas.name.replace(/\s+/g, '-')}.svg`;
    const success = exportToSVG(currentCanvas, filename);
    
    if (success) {
      showSuccessToast('Exported as SVG!');
    }
    setIsExportMenuOpen(false);
  };

  const handleExportJSON = () => {
    if (!currentCanvas) return;
    
    const filename = `${currentCanvas.name.replace(/\s+/g, '-')}.json`;
    const success = exportToJSON(currentCanvas, filename);
    
    if (success) {
      showSuccessToast('Exported as JSON!');
    }
    setIsExportMenuOpen(false);
  };

  const handleCopyToClipboard = async () => {
    if (!currentCanvas) return;
    
    const success = await copyToClipboard(currentCanvas);
    
    if (success) {
      showSuccessToast('Copied to clipboard!');
    }
    setIsExportMenuOpen(false);
  };

  const handleImportJSON = () => {
    fileInputRef.current?.click();
    setIsExportMenuOpen(false);
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    try {
      const importedCanvas = await importFromJSON(file);
      
      if (importedCanvas) {
        storage.saveCanvas(importedCanvas);
        loadCanvas(importedCanvas.id);
        showSuccessToast('Canvas imported successfully!');
      }
    } catch (error) {
      console.error('Import failed:', error);
      alert('Failed to import canvas. Please check the file format.');
    }
    
    e.target.value = '';
  };

  const showSuccessToast = (message) => {
    setSuccessMessage(message);
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
    }, 3000);
  };

  return (
    <>
      {/* Floating Buttons Container */}
      <div className="fixed top-3 right-3 z-50 flex items-center gap-2">
        {/* Auto-Save Status Indicator */}
        <AutoSaveIndicator />

        {/* Export/Download Menu */}
        <div className="relative">
          <button
            onClick={() => setIsExportMenuOpen(!isExportMenuOpen)}
            disabled={!currentCanvas}
            className="p-3 bg-white rounded-lg shadow-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            title="Export canvas"
          >
            <Download size={20} className="text-gray-700" />
          </button>

          {/* Export Dropdown */}
          {isExportMenuOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setIsExportMenuOpen(false)}
              />
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
                <div className="px-3 py-2 border-b border-gray-200">
                  <h3 className="text-xs font-semibold text-gray-700">
                    Export Canvas
                  </h3>
                </div>

                <button
                  onClick={handleExportPNG}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-3"
                >
                  <Image size={16} className="text-purple-600" />
                  <div>
                    <div className="font-medium text-gray-800">Export as PNG</div>
                    <div className="text-xs text-gray-500">Image file</div>
                  </div>
                </button>

                <button
                  onClick={handleExportSVG}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-3"
                >
                  <FileType size={16} className="text-blue-600" />
                  <div>
                    <div className="font-medium text-gray-800">Export as SVG</div>
                    <div className="text-xs text-gray-500">Vector image</div>
                  </div>
                </button>

                <button
                  onClick={handleExportJSON}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-3"
                >
                  <FileJson size={16} className="text-green-600" />
                  <div>
                    <div className="font-medium text-gray-800">Export as JSON</div>
                    <div className="text-xs text-gray-500">Editable format</div>
                  </div>
                </button>

                <button
                  onClick={handleCopyToClipboard}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-3"
                >
                  <Copy size={16} className="text-orange-600" />
                  <div>
                    <div className="font-medium text-gray-800">Copy to Clipboard</div>
                    <div className="text-xs text-gray-500">As JSON</div>
                  </div>
                </button>

                <div className="my-2 border-t border-gray-200" />

                <div className="px-3 py-2">
                  <h3 className="text-xs font-semibold text-gray-700 mb-1">
                    Import Canvas
                  </h3>
                </div>

                <button
                  onClick={handleImportJSON}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-3"
                >
                  <Upload size={16} className="text-indigo-600" />
                  <div>
                    <div className="font-medium text-gray-800">Import from JSON</div>
                    <div className="text-xs text-gray-500">Load saved canvas</div>
                  </div>
                </button>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".json,application/json"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>
            </>
          )}
        </div>

        {/* My Canvases Button */}
        <button
          onClick={onOpenCanvasManager}
          className="flex items-center gap-2 px-4 py-3 bg-indigo-600 text-white rounded-lg shadow-lg hover:bg-indigo-700 transition-colors"
        >
          <FolderOpen size={18} />
          <span className="text-sm font-medium">My Canvases</span>
        </button>
      </div>

      {/* Success Toast */}
      {showSuccess && (
        <div className="fixed bottom-4 right-4 bg-green-600 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 z-50 animate-slide-up">
          <Check size={20} />
          <span className="font-medium">{successMessage}</span>
          <button
            onClick={() => setShowSuccess(false)}
            className="ml-2 hover:bg-green-700 rounded p-1 transition-colors"
          >
            <X size={16} />
          </button>
        </div>
      )}
    </>
  );
}
