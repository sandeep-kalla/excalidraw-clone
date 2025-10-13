import { useState } from 'react';
import { Plus } from 'lucide-react';
import Modal from '../UI/Modal';
import ConfirmDialog from '../UI/ConfirmDialog';
import NewCanvasDialog from './NewCanvasDialog';
import CanvasList from './CanvasList';
import { useCanvasStore } from '../../store';

/**
 * Main Canvas Manager component
 * Handles creating, opening, renaming, deleting, and duplicating canvases
 */
export default function CanvasManager({ isOpen, onClose }) {
  const [showNewCanvasDialog, setShowNewCanvasDialog] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState({ show: false, canvasId: null, canvasName: '' });

  const {
    getAllCanvases,
    currentCanvas,
    createCanvas,
    loadCanvas,
    renameCanvas,
    deleteCanvas,
    duplicateCanvas,
  } = useCanvasStore();

  const canvases = getAllCanvases();

  const handleCreateCanvas = (name) => {
    createCanvas(name);
    setShowNewCanvasDialog(false);
  };

  const handleOpenCanvas = (canvasId) => {
    loadCanvas(canvasId);
    onClose();
  };

  const handleDeleteCanvas = (canvasId) => {
    // Get canvas name for confirmation dialog
    const canvas = canvases.find(c => c.id === canvasId);
    setDeleteConfirm({
      show: true,
      canvasId: canvasId,
      canvasName: canvas?.name || 'this canvas'
    });
  };

  const confirmDelete = () => {
    if (deleteConfirm.canvasId) {
      deleteCanvas(deleteConfirm.canvasId);
    }
    setDeleteConfirm({ show: false, canvasId: null, canvasName: '' });
  };

  const cancelDelete = () => {
    setDeleteConfirm({ show: false, canvasId: null, canvasName: '' });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="My Canvases">
      <div className="space-y-4">
        {/* Header with New Canvas Button */}
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-base font-medium text-gray-900">
              All Canvases ({canvases.length})
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              Manage your saved canvases
            </p>
          </div>
          <button
            onClick={() => setShowNewCanvasDialog(true)}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
          >
            <Plus size={16} />
            New Canvas
          </button>
        </div>

        {/* New Canvas Dialog */}
        {showNewCanvasDialog && (
          <NewCanvasDialog
            onCreateCanvas={handleCreateCanvas}
            onCancel={() => setShowNewCanvasDialog(false)}
          />
        )}

        {/* Canvas List */}
        <CanvasList
          canvases={canvases}
          currentCanvasId={currentCanvas?.id}
          onOpenCanvas={handleOpenCanvas}
          onRenameCanvas={renameCanvas}
          onDeleteCanvas={handleDeleteCanvas}
          onDuplicateCanvas={duplicateCanvas}
        />
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteConfirm.show}
        title="Delete Canvas?"
        message={`Are you sure you want to delete "${deleteConfirm.canvasName}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
    </Modal>
  );
}
