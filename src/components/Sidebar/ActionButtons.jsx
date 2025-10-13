import { Copy, Trash2 } from 'lucide-react';
import { useCanvasStore, useEditorStore } from '../../store';
import { nanoid } from 'nanoid';

/**
 * Action Buttons Component
 * Duplicate and delete buttons for selected elements
 */
export default function ActionButtons({ selectedElements }) {
  const { addElement, deleteElement } = useCanvasStore();
  const { selectedElementIds, setSelectedElements } = useEditorStore();

  if (!selectedElements || selectedElements.length === 0) return null;

  // Duplicate selected elements
  const handleDuplicate = () => {
    const newIds = [];
    
    selectedElements.forEach(element => {
      const newElement = {
        ...element,
        id: nanoid(),
        x: element.x + 20, // Offset to make it visible
        y: element.y + 20,
      };
      
      addElement(newElement);
      newIds.push(newElement.id);
    });

    // Select the new duplicated elements
    setSelectedElements(newIds);
  };

  // Delete selected elements
  const handleDelete = () => {
    selectedElementIds.forEach(id => {
      deleteElement(id);
    });
    
    // Clear selection
    setSelectedElements([]);
  };

  return (
    <div className="grid grid-cols-2 gap-2">
      {/* Duplicate */}
      <button
        onClick={handleDuplicate}
        className="flex items-center justify-center gap-2 px-3 py-2 text-sm bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
        title="Duplicate (Ctrl+D)"
      >
        <Copy size={16} />
        <span>Duplicate</span>
      </button>

      {/* Delete */}
      <button
        onClick={handleDelete}
        className="flex items-center justify-center gap-2 px-3 py-2 text-sm bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
        title="Delete (Del)"
      >
        <Trash2 size={16} />
        <span>Delete</span>
      </button>
    </div>
  );
}
