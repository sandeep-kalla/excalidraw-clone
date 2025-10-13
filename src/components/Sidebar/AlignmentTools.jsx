import {
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignVerticalJustifyStart,
  AlignVerticalJustifyCenter,
  AlignVerticalJustifyEnd,
} from 'lucide-react';
import { useCanvasStore, useEditorStore } from '../../store';

/**
 * Alignment Tools Component
 * Buttons to align multiple selected elements
 */
export default function AlignmentTools({ selectedElements }) {
  const { updateElement } = useCanvasStore();
  const { selectedElementIds } = useEditorStore();

  if (!selectedElements || selectedElements.length < 2) return null;

  // Get bounding box of all selected elements
  const getBoundingBox = () => {
    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;

    selectedElements.forEach(el => {
      minX = Math.min(minX, el.x);
      minY = Math.min(minY, el.y);
      maxX = Math.max(maxX, el.x + (el.width || 0));
      maxY = Math.max(maxY, el.y + (el.height || 0));
    });

    return { minX, minY, maxX, maxY };
  };

  // Align left
  const alignLeft = () => {
    const { minX } = getBoundingBox();
    selectedElementIds.forEach(id => {
      updateElement(id, { x: minX });
    });
  };

  // Align center (horizontally)
  const alignCenter = () => {
    const { minX, maxX } = getBoundingBox();
    const centerX = (minX + maxX) / 2;
    
    selectedElementIds.forEach(id => {
      const element = selectedElements.find(el => el.id === id);
      const elementWidth = element?.width || 0;
      updateElement(id, { x: centerX - elementWidth / 2 });
    });
  };

  // Align right
  const alignRight = () => {
    const { maxX } = getBoundingBox();
    
    selectedElementIds.forEach(id => {
      const element = selectedElements.find(el => el.id === id);
      const elementWidth = element?.width || 0;
      updateElement(id, { x: maxX - elementWidth });
    });
  };

  // Align top
  const alignTop = () => {
    const { minY } = getBoundingBox();
    selectedElementIds.forEach(id => {
      updateElement(id, { y: minY });
    });
  };

  // Align middle (vertically)
  const alignMiddle = () => {
    const { minY, maxY } = getBoundingBox();
    const centerY = (minY + maxY) / 2;
    
    selectedElementIds.forEach(id => {
      const element = selectedElements.find(el => el.id === id);
      const elementHeight = element?.height || 0;
      updateElement(id, { y: centerY - elementHeight / 2 });
    });
  };

  // Align bottom
  const alignBottom = () => {
    const { maxY } = getBoundingBox();
    
    selectedElementIds.forEach(id => {
      const element = selectedElements.find(el => el.id === id);
      const elementHeight = element?.height || 0;
      updateElement(id, { y: maxY - elementHeight });
    });
  };

  return (
    <div className="space-y-2">
      {/* Horizontal alignment */}
      <div className="grid grid-cols-3 gap-1">
        <button
          onClick={alignLeft}
          className="flex items-center justify-center p-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          title="Align left"
        >
          <AlignLeft size={18} />
        </button>
        <button
          onClick={alignCenter}
          className="flex items-center justify-center p-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          title="Align center"
        >
          <AlignCenter size={18} />
        </button>
        <button
          onClick={alignRight}
          className="flex items-center justify-center p-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          title="Align right"
        >
          <AlignRight size={18} />
        </button>
      </div>

      {/* Vertical alignment */}
      <div className="grid grid-cols-3 gap-1">
        <button
          onClick={alignTop}
          className="flex items-center justify-center p-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          title="Align top"
        >
          <AlignVerticalJustifyStart size={18} />
        </button>
        <button
          onClick={alignMiddle}
          className="flex items-center justify-center p-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          title="Align middle"
        >
          <AlignVerticalJustifyCenter size={18} />
        </button>
        <button
          onClick={alignBottom}
          className="flex items-center justify-center p-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          title="Align bottom"
        >
          <AlignVerticalJustifyEnd size={18} />
        </button>
      </div>
    </div>
  );
}
