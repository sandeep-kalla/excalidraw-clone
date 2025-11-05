import { useState } from 'react';
import { ChevronDown, ChevronUp, Edit2, Check, X } from 'lucide-react';
import { useEditorStore, useCanvasStore } from '../../store';
import ColorPicker from './ColorPicker';
import StrokeWidthPicker from './StrokeWidthPicker';
import OpacitySlider from './OpacitySlider';
import LayerControls from './LayerControls';
import AlignmentTools from './AlignmentTools';
import ActionButtons from './ActionButtons';
import FontFamilyPicker from './FontFamilyPicker';

/**
 * Left Sidebar - Collapsible Properties Panel
 * Includes app name, canvas name, and properties
 */
export default function Sidebar({ isOpen, onToggle }) {
  const [isEditingName, setIsEditingName] = useState(false);
  const [editName, setEditName] = useState('');
  const { 
    strokeColor, 
    fillColor, 
    strokeWidth, 
    opacity,
    fontFamily,
    selectedElementIds,
    setStrokeColor,
    setFillColor,
    setStrokeWidth,
    setOpacity,
    setFontFamily,
  } = useEditorStore();

  const { currentCanvas, updateElement, renameCanvas } = useCanvasStore();
  const [expandedSections, setExpandedSections] = useState({
    stroke: true,
    background: true,
    text: false,
    advanced: false,
  });

  // Get selected elements
  const selectedElements = currentCanvas?.elements?.filter(
    el => selectedElementIds.includes(el.id)
  ) || [];

  const hasSelection = selectedElements.length > 0;
  const hasTextSelection = selectedElements.some(el => el.type === 'text');

  // Apply style changes to selected elements
  const applyStyleToSelected = (updates) => {
    if (!hasSelection) return;
    
    selectedElementIds.forEach(id => {
      updateElement(id, updates);
    });
  };

  // Handle stroke color change
  const handleStrokeColorChange = (color) => {
    setStrokeColor(color);
    applyStyleToSelected({ stroke: color });
  };

  // Handle fill color change
  const handleFillColorChange = (color) => {
    setFillColor(color);
    applyStyleToSelected({ fill: color });
  };

  // Handle stroke width change
  const handleStrokeWidthChange = (width) => {
    setStrokeWidth(width);
    applyStyleToSelected({ strokeWidth: width });
  };

  // Handle opacity change
  const handleOpacityChange = (newOpacity) => {
    setOpacity(newOpacity);
    applyStyleToSelected({ opacity: newOpacity });
  };

  // Handle font family change
  const handleFontFamilyChange = (newFontFamily) => {
    setFontFamily(newFontFamily);
    applyStyleToSelected({ fontFamily: newFontFamily });
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

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

  if (!isOpen) return null;

  return (
    <aside className="fixed left-0 top-[65px] bottom-0 w-60 bg-white border-r border-gray-200 overflow-y-auto flex flex-col z-30 shadow-xl">
      {/* Sidebar Header */}
      <div className="border-b border-gray-200 p-3">
        {/* Canvas Name */}
        {currentCanvas && (
          <div className="pl-1">
            {isEditingName ? (
              <div className="flex items-center gap-1">
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSaveName();
                    if (e.key === 'Escape') handleCancelEdit();
                  }}
                  className="flex-1 px-2 py-1 text-xs border border-blue-500 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                  autoFocus
                />
                <button
                  onClick={handleSaveName}
                  className="p-1 rounded hover:bg-green-50 text-green-600"
                >
                  <Check size={14} />
                </button>
                <button
                  onClick={handleCancelEdit}
                  className="p-1 rounded hover:bg-red-50 text-red-600"
                >
                  <X size={14} />
                </button>
              </div>
            ) : (
              <button
                onClick={handleStartEdit}
                className="flex items-center gap-1.5 px-2 py-1 rounded hover:bg-gray-100 text-gray-600 transition-colors group w-full"
                title="Click to rename"
              >
                <span className="text-xs font-medium truncate flex-1 text-left">
                  {currentCanvas.name}
                </span>
                <Edit2 size={12} className="text-gray-400 group-hover:text-gray-600 flex-shrink-0" />
              </button>
            )}
          </div>
        )}
      </div>

      {/* Properties Panel */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {/* Stroke Color - Compact */}
        <div>
          <button
            onClick={() => toggleSection('stroke')}
            className="flex items-center justify-between w-full text-xs font-medium text-gray-700 mb-2 hover:text-gray-900"
          >
            <span>Stroke</span>
            {expandedSections.stroke ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
          {expandedSections.stroke && (
            <ColorPicker
              color={strokeColor}
              onChange={handleStrokeColorChange}
              compact
            />
          )}
        </div>

        {/* Fill Color - Compact */}
        <div className="border-t border-gray-100 pt-3">
          <button
            onClick={() => toggleSection('background')}
            className="flex items-center justify-between w-full text-xs font-medium text-gray-700 mb-2 hover:text-gray-900"
          >
            <span>Background</span>
            {expandedSections.background ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
          {expandedSections.background && (
            <ColorPicker
              color={fillColor}
              onChange={handleFillColorChange}
              allowTransparent
              compact
            />
          )}
        </div>

        {/* Stroke Width - Always visible, compact */}
        <div className="border-t border-gray-100 pt-3">
          <label className="block text-xs font-medium text-gray-700 mb-2">
            Stroke width
          </label>
          <StrokeWidthPicker
            width={strokeWidth}
            onChange={handleStrokeWidthChange}
          />
        </div>

        {/* Opacity - Compact */}
        <div className="border-t border-gray-100 pt-3">
          <label className="block text-xs font-medium text-gray-700 mb-2">
            Opacity
          </label>
          <OpacitySlider
            opacity={opacity}
            onChange={handleOpacityChange}
          />
        </div>

        {/* Font Family - Only show for text elements or when text is selected */}
        {hasTextSelection && (
          <div className="border-t border-gray-100 pt-3">
            <button
              onClick={() => toggleSection('text')}
              className="flex items-center justify-between w-full text-xs font-medium text-gray-700 mb-2 hover:text-gray-900"
            >
              <span>Font</span>
              {expandedSections.text ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>
            {expandedSections.text && (
              <FontFamilyPicker
                fontFamily={fontFamily}
                onChange={handleFontFamilyChange}
              />
            )}
          </div>
        )}

        {/* Advanced options - Only show when elements are selected */}
        {hasSelection && (
          <div className="border-t border-gray-100 pt-3">
            <button
              onClick={() => toggleSection('advanced')}
              className="flex items-center justify-between w-full text-xs font-medium text-gray-700 mb-2 hover:text-gray-900"
            >
              <span>Advanced {hasSelection && `(${selectedElements.length})`}</span>
              {expandedSections.advanced ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>
            
            {expandedSections.advanced && (
              <div className="space-y-3">
                {/* Layer Controls */}
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">
                    Layers
                  </label>
                  <LayerControls selectedElements={selectedElements} />
                </div>

                {/* Alignment Tools */}
                {selectedElements.length > 1 && (
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1.5">
                      Align
                    </label>
                    <AlignmentTools selectedElements={selectedElements} />
                  </div>
                )}

                {/* Action Buttons */}
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">
                    Actions
                  </label>
                  <ActionButtons selectedElements={selectedElements} />
                </div>
              </div>
            )}
          </div>
        )}

        {/* No selection message */}
        {!hasSelection && (
          <div className="text-center py-6 border-t border-gray-100 mt-3">
            <p className="text-xs text-gray-400">
              Select an element to view properties
            </p>
          </div>
        )}
      </div>
    </aside>
  );
}
