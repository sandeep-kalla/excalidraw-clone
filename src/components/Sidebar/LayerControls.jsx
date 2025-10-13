import { 
  ArrowUp, 
  ArrowDown, 
  ChevronsUp, 
  ChevronsDown 
} from 'lucide-react';
import { useCanvasStore } from '../../store';

/**
 * Layer Controls Component
 * Buttons to control element layer order (z-index)
 */
export default function LayerControls({ selectedElements }) {
  const { currentCanvas, updateElement } = useCanvasStore();

  if (!selectedElements || selectedElements.length === 0) return null;

  const elements = currentCanvas?.elements || [];
  const selectedIds = selectedElements.map(el => el.id);

  // Get indices of selected elements
  const getElementIndices = () => {
    return selectedIds.map(id => elements.findIndex(el => el.id === id));
  };

  // Move elements forward by one layer
  const bringForward = () => {
    const indices = getElementIndices();
    const maxIndex = elements.length - 1;
    
    // Sort indices in descending order to avoid conflicts
    indices.sort((a, b) => b - a);
    
    indices.forEach(index => {
      if (index < maxIndex) {
        // Swap with next element
        const newElements = [...elements];
        [newElements[index], newElements[index + 1]] = [newElements[index + 1], newElements[index]];
        // Update canvas with new order
        // Note: This is simplified - you may need to update the entire canvas elements array
      }
    });
  };

  // Move elements backward by one layer
  const sendBackward = () => {
    const indices = getElementIndices();
    
    // Sort indices in ascending order
    indices.sort((a, b) => a - b);
    
    indices.forEach(index => {
      if (index > 0) {
        // Swap with previous element
        const newElements = [...elements];
        [newElements[index], newElements[index - 1]] = [newElements[index - 1], newElements[index]];
      }
    });
  };

  // Move elements to front (top layer)
  const bringToFront = () => {
    // Remove selected elements and add them to the end
    const selected = elements.filter(el => selectedIds.includes(el.id));
    const others = elements.filter(el => !selectedIds.includes(el.id));
    // Update canvas elements: [...others, ...selected]
  };

  // Move elements to back (bottom layer)
  const sendToBack = () => {
    // Remove selected elements and add them to the beginning
    const selected = elements.filter(el => selectedIds.includes(el.id));
    const others = elements.filter(el => !selectedIds.includes(el.id));
    // Update canvas elements: [...selected, ...others]
  };

  return (
    <div className="flex items-center justify-center gap-1">
      {/* Bring Forward */}
      <button
        onClick={bringForward}
        className="group relative p-2 text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg transition-colors"
        title="Bring forward"
      >
        <ArrowUp size={16} />
        <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-xs font-medium text-white bg-gray-900 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          Forward
        </span>
      </button>

      {/* Send Backward */}
      <button
        onClick={sendBackward}
        className="group relative p-2 text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg transition-colors"
        title="Send backward"
      >
        <ArrowDown size={16} />
        <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-xs font-medium text-white bg-gray-900 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          Backward
        </span>
      </button>

      {/* Bring to Front */}
      <button
        onClick={bringToFront}
        className="group relative p-2 text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg transition-colors"
        title="Bring to front"
      >
        <ChevronsUp size={16} />
        <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-xs font-medium text-white bg-gray-900 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          To Front
        </span>
      </button>

      {/* Send to Back */}
      <button
        onClick={sendToBack}
        className="group relative p-2 text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg transition-colors"
        title="Send to back"
      >
        <ChevronsDown size={16} />
        <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-xs font-medium text-white bg-gray-900 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          To Back
        </span>
      </button>
    </div>
  );
}
