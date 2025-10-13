import { useEffect, useRef, useState } from 'react';
import { useCanvasStore } from '../store';

/**
 * Auto-save hook with debouncing
 * Automatically saves canvas after changes with a delay
 * 
 * @param {number} delay - Debounce delay in milliseconds (default: 500ms)
 * @returns {Object} Auto-save status
 */
export const useAutoSave = (delay = 500) => {
  const { currentCanvas, hasUnsavedChanges, saveCanvas, markAsSaved } = useCanvasStore();
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const saveTimeoutRef = useRef(null);
  const lastCanvasRef = useRef(null);

  useEffect(() => {
    // Clear timeout on unmount
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    // Don't auto-save if no canvas
    if (!currentCanvas) {
      return;
    }

    // Don't auto-save if no unsaved changes
    if (!hasUnsavedChanges) {
      return;
    }

    // Clear existing timeout
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    // Set saving indicator
    setIsSaving(true);

    // Debounce the save
    saveTimeoutRef.current = setTimeout(() => {
      const success = saveCanvas();
      
      if (success) {
        setLastSaved(new Date());
        markAsSaved();
      }
      
      setIsSaving(false);
    }, delay);

    // Cleanup
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [currentCanvas, hasUnsavedChanges, delay, saveCanvas, markAsSaved]);

  // Track canvas changes to update last saved time
  useEffect(() => {
    if (currentCanvas && lastCanvasRef.current?.id !== currentCanvas.id) {
      // Canvas switched, update last saved to canvas update time
      if (currentCanvas.updatedAt) {
        setLastSaved(new Date(currentCanvas.updatedAt));
      }
      lastCanvasRef.current = currentCanvas;
    }
  }, [currentCanvas]);

  return {
    isSaving,
    lastSaved,
    hasUnsavedChanges,
  };
};
