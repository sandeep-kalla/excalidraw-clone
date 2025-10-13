import { useState } from 'react';
import { Plus } from 'lucide-react';
import Button from '../UI/Button';

/**
 * Dialog for creating a new canvas
 * @param {function} onCreateCanvas - Callback with canvas name
 * @param {function} onCancel - Callback to close dialog
 */
export default function NewCanvasDialog({ onCreateCanvas, onCancel }) {
  const [canvasName, setCanvasName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const name = canvasName.trim();
    if (name) {
      onCreateCanvas(name);
      setCanvasName('');
    }
  };

  return (
    <div className="bg-white rounded-lg p-6 border-2 border-blue-500 shadow-lg mb-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <Plus size={20} className="text-blue-600" />
        Create New Canvas
      </h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="canvas-name"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Canvas Name
          </label>
          <input
            id="canvas-name"
            type="text"
            value={canvasName}
            onChange={(e) => setCanvasName(e.target.value)}
            placeholder="e.g., System Architecture, Flowchart..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            autoFocus
          />
        </div>

        <div className="flex gap-3 justify-end">
          <Button
            type="button"
            variant="ghost"
            size="md"
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="md"
            disabled={!canvasName.trim()}
          >
            Create Canvas
          </Button>
        </div>
      </form>
    </div>
  );
}
