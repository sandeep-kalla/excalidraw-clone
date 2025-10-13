import { useState, useRef, useEffect } from 'react';
import {
  FolderOpen,
  Edit2,
  Trash2,
  Copy,
  Calendar,
  Clock,
  MoreVertical,
  Check,
  X as XIcon,
} from 'lucide-react';
import Portal from '../UI/Portal';

/**
 * List item component for a single canvas
 */
function CanvasItem({
  canvas,
  isActive,
  onOpen,
  onRename,
  onDelete,
  onDuplicate,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(canvas.name);
  const [showMenu, setShowMenu] = useState(false);
  const buttonRef = useRef(null);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });

  // Calculate dropdown position when menu opens
  useEffect(() => {
    if (showMenu && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const dropdownWidth = 176; // 44 * 4 (w-44 in Tailwind)
      const dropdownHeight = 180; // approximate height
      
      // Calculate position
      let top = rect.bottom + 4; // 4px gap below button
      let left = rect.right - dropdownWidth; // align right edge
      
      // Check if dropdown would go off bottom of screen
      if (top + dropdownHeight > window.innerHeight) {
        top = rect.top - dropdownHeight - 4; // show above button
      }
      
      // Check if dropdown would go off left of screen
      if (left < 8) {
        left = 8; // minimum 8px from left edge
      }
      
      setMenuPosition({ top, left });
    }
  }, [showMenu]);

  const handleRename = () => {
    const name = editName.trim();
    if (name && name !== canvas.name) {
      onRename(canvas.id, name);
    }
    setIsEditing(false);
    setShowMenu(false);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div
      className={`group relative bg-white border rounded-lg transition-all hover:shadow-md ${
        isActive ? 'border-indigo-400 ring-2 ring-indigo-100' : 'border-gray-200 hover:border-indigo-200'
      }`}
    >
      {/* Canvas Info */}
      <div className="p-3">
        <div className="flex items-start gap-3">
          {/* Icon */}
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg flex items-center justify-center flex-shrink-0">
            <FolderOpen size={20} className="text-indigo-500" />
          </div>

          {/* Details */}
          <div className="flex-1 min-w-0">
            {isEditing ? (
              <div className="flex items-center gap-1">
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleRename();
                    if (e.key === 'Escape') {
                      setIsEditing(false);
                      setEditName(canvas.name);
                    }
                  }}
                  className="flex-1 px-2 py-1 text-sm border border-indigo-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  autoFocus
                />
                <button
                  onClick={handleRename}
                  className="p-1 rounded hover:bg-green-50 text-green-600"
                >
                  <Check size={14} />
                </button>
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setEditName(canvas.name);
                  }}
                  className="p-1 rounded hover:bg-red-50 text-red-600"
                >
                  <XIcon size={14} />
                </button>
              </div>
            ) : (
              <h3
                className="text-sm font-semibold text-gray-800 truncate cursor-pointer hover:text-indigo-600"
                onClick={() => onOpen(canvas.id)}
                title={canvas.name}
              >
                {canvas.name}
              </h3>
            )}

            <div className="mt-1 flex items-center gap-3 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <Calendar size={12} />
                {formatDate(canvas.createdAt)}
              </span>
              <span className="flex items-center gap-1">
                <Clock size={12} />
                {formatTime(canvas.updatedAt)}
              </span>
            </div>

            <div className="mt-1 text-xs text-gray-400">
              {canvas.elements.length} element(s)
            </div>
          </div>

          {/* Actions Menu */}
          <div className="relative flex-shrink-0">
            <button
              ref={buttonRef}
              onClick={() => setShowMenu(!showMenu)}
              className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors opacity-0 group-hover:opacity-100"
              aria-label="More actions"
            >
              <MoreVertical size={16} className="text-gray-600" />
            </button>
          </div>
        </div>

        {/* Quick open button or active indicator */}
        {!isActive ? (
          <button
            onClick={() => onOpen(canvas.id)}
            className="mt-3 w-full py-2 text-xs font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors"
          >
            Open Canvas
          </button>
        ) : (
          <div className="mt-3 py-2 text-xs text-indigo-600 font-medium text-center bg-indigo-50 rounded-lg">
            Currently Active
          </div>
        )}
      </div>

      {/* Dropdown menu - Rendered via Portal to escape modal overflow */}
      {showMenu && (
        <Portal>
          {/* Backdrop to close menu */}
          <div
            className="fixed inset-0 z-[60]"
            onClick={() => setShowMenu(false)}
          />

          {/* Dropdown menu - positioned absolutely to viewport */}
          <div
            style={{
              position: 'fixed',
              top: `${menuPosition.top}px`,
              left: `${menuPosition.left}px`,
              zIndex: 70,
            }}
            className="w-44 bg-white rounded-lg shadow-xl border border-gray-200 py-1 animate-in fade-in duration-100"
          >
            <button
              onClick={() => {
                onOpen(canvas.id);
                setShowMenu(false);
              }}
              className="w-full px-3 py-2 text-left text-xs hover:bg-indigo-50 flex items-center gap-2 text-gray-700"
            >
              <FolderOpen size={14} />
              Open Canvas
            </button>
            <button
              onClick={() => {
                setIsEditing(true);
                setShowMenu(false);
              }}
              className="w-full px-3 py-2 text-left text-xs hover:bg-indigo-50 flex items-center gap-2 text-gray-700"
            >
              <Edit2 size={14} />
              Rename
            </button>
            <button
              onClick={() => {
                onDuplicate(canvas.id);
                setShowMenu(false);
              }}
              className="w-full px-3 py-2 text-left text-xs hover:bg-indigo-50 flex items-center gap-2 text-gray-700"
            >
              <Copy size={14} />
              Duplicate
            </button>
            <hr className="my-1 border-gray-200" />
            <button
              onClick={() => {
                onDelete(canvas.id);
                setShowMenu(false);
              }}
              className="w-full px-3 py-2 text-left text-xs hover:bg-red-50 text-red-600 flex items-center gap-2"
            >
              <Trash2 size={14} />
              Delete
            </button>
          </div>
        </Portal>
      )}
    </div>
  );
}

/**
 * List of all canvases with search and actions
 */
export default function CanvasList({
  canvases,
  currentCanvasId,
  onOpenCanvas,
  onRenameCanvas,
  onDeleteCanvas,
  onDuplicateCanvas,
}) {
  const [searchTerm, setSearchTerm] = useState('');

  // Filter canvases by search term
  const filteredCanvases = canvases.filter((canvas) =>
    canvas.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sort by updated date (most recent first)
  const sortedCanvases = [...filteredCanvases].sort(
    (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
  );

  return (
    <div>
      {/* Search bar */}
      {canvases.length > 0 && (
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search canvases..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>
      )}

      {/* Canvas list */}
      {sortedCanvases.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {sortedCanvases.map((canvas) => (
            <CanvasItem
              key={canvas.id}
              canvas={canvas}
              isActive={canvas.id === currentCanvasId}
              onOpen={onOpenCanvas}
              onRename={onRenameCanvas}
              onDelete={onDeleteCanvas}
              onDuplicate={onDuplicateCanvas}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-gray-500">
          {searchTerm ? (
            <>
              <p className="text-base font-medium">No canvases found</p>
              <p className="text-sm mt-1">
                Try a different search term
              </p>
            </>
          ) : (
            <>
              <FolderOpen size={48} className="mx-auto mb-4 text-gray-400" />
              <p className="text-base font-medium">No canvases yet</p>
              <p className="text-sm mt-1">
                Create your first canvas to get started!
              </p>
            </>
          )}
        </div>
      )}
    </div>
  );
}
