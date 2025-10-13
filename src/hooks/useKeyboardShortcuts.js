import { useEffect, useMemo } from 'react';

/**
 * Custom hook for keyboard shortcuts
 * @param {Object} shortcuts - Map of key combinations to handler functions
 * @param {boolean} enabled - Whether shortcuts are enabled
 */
export function useKeyboardShortcuts(shortcuts, enabled = true) {
  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (e) => {
      // Don't trigger shortcuts when typing in input fields
      if (
        e.target.tagName === 'INPUT' ||
        e.target.tagName === 'TEXTAREA' ||
        e.target.isContentEditable
      ) {
        return;
      }

      // Build key combination string
      const key = e.key.toLowerCase();
      const ctrl = e.ctrlKey || e.metaKey;
      const shift = e.shiftKey;
      const alt = e.altKey;

      // Check for exact matches first
      let combination = '';
      if (ctrl) combination += 'ctrl+';
      if (shift) combination += 'shift+';
      if (alt) combination += 'alt+';
      combination += key;

      // Check if this combination has a handler
      // Only fall back to key-only shortcuts if NO modifiers are pressed
      const handler = shortcuts[combination] || 
                      (!ctrl && !shift && !alt ? shortcuts[key] : null);

      if (handler) {
        e.preventDefault();
        e.stopImmediatePropagation(); // Prevent other handlers from firing
        handler(e);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [shortcuts, enabled]);
}

/**
 * Hook for tool keyboard shortcuts
 */
export function useToolShortcuts(setCurrentTool, enabled = true) {
  const shortcuts = useMemo(() => ({
    'v': () => setCurrentTool('select'),
    'r': () => setCurrentTool('rectangle'),
    'o': () => setCurrentTool('ellipse'),
    'a': () => setCurrentTool('arrow'),
    'p': () => setCurrentTool('draw'),
    't': () => setCurrentTool('text'),
    'e': () => setCurrentTool('eraser'),
  }), [setCurrentTool]);

  useKeyboardShortcuts(shortcuts, enabled);
}

/**
 * Hook for undo/redo keyboard shortcuts
 */
export function useUndoRedoShortcuts(undo, redo, enabled = true) {
  const shortcuts = useMemo(() => ({
    'ctrl+z': () => undo(),
    'ctrl+shift+z': () => redo(),
    'ctrl+y': () => redo(),
  }), [undo, redo]);

  useKeyboardShortcuts(shortcuts, enabled);
}

/**
 * Hook for select all keyboard shortcut
 */
export function useSelectAllShortcut(selectAll, enabled = true) {
  const shortcuts = useMemo(() => ({
    'ctrl+a': () => selectAll(),
  }), [selectAll]);

  useKeyboardShortcuts(shortcuts, enabled);
}

export default useKeyboardShortcuts;
