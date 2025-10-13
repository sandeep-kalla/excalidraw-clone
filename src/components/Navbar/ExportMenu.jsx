import { useState, useRef } from 'react';
import {
  Download,
  FileJson,
  Image,
  FileType,
  Upload,
  Copy,
  Check,
  X,
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

/**
 * Export Menu Component
 * Dropdown menu for exporting and importing canvases
 */
export default function ExportMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const fileInputRef = useRef(null);
  
  const { currentCanvas, createCanvas, loadCanvas } = useCanvasStore();

  const handleExportPNG = () => {
    if (!currentCanvas) return;
    
    const filename = `${currentCanvas.name.replace(/\s+/g, '-')}.png`;
    const success = exportToPNG(currentCanvas, filename);
    
    if (success) {
      showSuccessMessage('Exported as PNG!');
    }
    setIsOpen(false);
  };

  const handleExportSVG = () => {
    if (!currentCanvas) return;
    
    const filename = `${currentCanvas.name.replace(/\s+/g, '-')}.svg`;
    const success = exportToSVG(currentCanvas, filename);
    
    if (success) {
      showSuccessMessage('Exported as SVG!');
    }
    setIsOpen(false);
  };

  const handleExportJSON = () => {
    if (!currentCanvas) return;
    
    const filename = `${currentCanvas.name.replace(/\s+/g, '-')}.json`;
    const success = exportToJSON(currentCanvas, filename);
    
    if (success) {
      showSuccessMessage('Exported as JSON!');
    }
    setIsOpen(false);
  };

  const handleCopyToClipboard = async () => {
    if (!currentCanvas) return;
    
    const success = await copyToClipboard(currentCanvas);
    
    if (success) {
      showSuccessMessage('Copied to clipboard!');
    }
    setIsOpen(false);
  };

  const handleImportJSON = () => {
    fileInputRef.current?.click();
    setIsOpen(false);
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    try {
      const importedCanvas = await importFromJSON(file);
      
      if (importedCanvas) {
        // Save the imported canvas directly to storage
        storage.saveCanvas(importedCanvas);
        
        // Load it in the store
        loadCanvas(importedCanvas.id);
        
        showSuccessMessage('Canvas imported successfully!');
      }
    } catch (error) {
      console.error('Import failed:', error);
      alert('Failed to import canvas. Please check the file format.');
    }
    
    // Reset file input
    e.target.value = '';
  };

  const showSuccessMessage = (message) => {
    setSuccessMessage(message);
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
    }, 3000);
  };

  return (
    <div className="relative">
      {/* Export Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={!currentCanvas}
        className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        title="Export canvas"
      >
        <Download size={20} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />

          {/* Menu */}
          <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-20">
            <div className="px-3 py-2 border-b border-gray-200">
              <h3 className="text-sm font-semibold text-gray-700">
                Export Canvas
              </h3>
            </div>

            {/* Export PNG */}
            <button
              onClick={handleExportPNG}
              className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-3 transition-colors"
            >
              <Image size={16} className="text-purple-600" />
              <div>
                <div className="font-medium text-gray-800">Export as PNG</div>
                <div className="text-xs text-gray-500">Image file</div>
              </div>
            </button>

            {/* Export SVG */}
            <button
              onClick={handleExportSVG}
              className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-3 transition-colors"
            >
              <FileType size={16} className="text-blue-600" />
              <div>
                <div className="font-medium text-gray-800">Export as SVG</div>
                <div className="text-xs text-gray-500">Vector image</div>
              </div>
            </button>

            {/* Export JSON */}
            <button
              onClick={handleExportJSON}
              className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-3 transition-colors"
            >
              <FileJson size={16} className="text-green-600" />
              <div>
                <div className="font-medium text-gray-800">Export as JSON</div>
                <div className="text-xs text-gray-500">Editable format</div>
              </div>
            </button>

            {/* Copy to Clipboard */}
            <button
              onClick={handleCopyToClipboard}
              className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-3 transition-colors"
            >
              <Copy size={16} className="text-orange-600" />
              <div>
                <div className="font-medium text-gray-800">Copy to Clipboard</div>
                <div className="text-xs text-gray-500">As JSON</div>
              </div>
            </button>

            <div className="my-2 border-t border-gray-200" />

            <div className="px-3 py-2">
              <h3 className="text-sm font-semibold text-gray-700 mb-1">
                Import Canvas
              </h3>
            </div>

            {/* Import JSON */}
            <button
              onClick={handleImportJSON}
              className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-3 transition-colors"
            >
              <Upload size={16} className="text-indigo-600" />
              <div>
                <div className="font-medium text-gray-800">Import from JSON</div>
                <div className="text-xs text-gray-500">Load saved canvas</div>
              </div>
            </button>

            {/* Hidden file input */}
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

      {/* Success Toast */}
      {showSuccess && (
        <div className="fixed bottom-4 right-4 bg-green-600 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 z-50 animate-slide-up">
          <Check size={20} />
          <span className="font-medium">{successMessage}</span>
          <button
            onClick={() => setShowSuccess(false)}
            className="ml-2 hover:bg-green-700 rounded p-1"
          >
            <X size={16} />
          </button>
        </div>
      )}
    </div>
  );
}
