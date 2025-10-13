import { Undo, Redo } from 'lucide-react';
import { useCanvasStore, useEditorStore } from '../../store';
import { useHistoryStore } from '../../store/historyStore';

/**
 * Undo/Redo Controls with Zoom Display
 * Positioned at bottom-center
 */
export default function UndoRedo() {
  const { undo, redo } = useCanvasStore();
  const { canUndo, canRedo } = useHistoryStore();
  const zoom = useEditorStore((state) => state.zoom);

  const canUndoNow = canUndo();
  const canRedoNow = canRedo();

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 flex items-center gap-3">
      {/* Undo Button */}
      <button
        onClick={undo}
        disabled={!canUndoNow}
        className="p-2.5 bg-white rounded-lg shadow-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        title="Undo (Ctrl+Z)"
      >
        <Undo size={18} className="text-gray-700" />
      </button>

      {/* Zoom Percentage Display */}
      <div className="bg-white border border-gray-300 rounded-lg px-4 py-2 shadow-lg">
        <span className="text-sm font-medium text-gray-700">
          {Math.round(zoom * 100)}%
        </span>
      </div>

      {/* Redo Button */}
      <button
        onClick={redo}
        disabled={!canRedoNow}
        className="p-2.5 bg-white rounded-lg shadow-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        title="Redo (Ctrl+Shift+Z or Ctrl+Y)"
      >
        <Redo size={18} className="text-gray-700" />
      </button>
    </div>
  );
}
