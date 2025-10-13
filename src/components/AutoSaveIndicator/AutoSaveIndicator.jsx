import React from 'react';
import { Cloud, Loader2 } from 'lucide-react';
import { useAutoSave } from '../../hooks/useAutoSave';

/**
 * Auto-save status indicator
 * Shows saving state with status dot matching button design
 */
const AutoSaveIndicator = () => {
  const { isSaving, lastSaved, hasUnsavedChanges } = useAutoSave();

  // Format last saved time
  const formatLastSaved = (date) => {
    if (!date) return null;
    
    const now = new Date();
    const diff = Math.floor((now - date) / 1000); // seconds

    if (diff < 5) return 'Just now';
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    
    return date.toLocaleDateString();
  };

  // Determine status dot color and tooltip
  const getStatusInfo = () => {
    if (isSaving) {
      return {
        dotColor: 'bg-blue-500',
        tooltip: 'Saving changes...',
        showSpinner: true,
      };
    }

    if (hasUnsavedChanges) {
      return {
        dotColor: 'bg-amber-500',
        tooltip: 'Unsaved changes',
        showSpinner: false,
      };
    }

    const timeText = formatLastSaved(lastSaved);
    return {
      dotColor: 'bg-green-500',
      tooltip: timeText ? `Saved ${timeText}` : 'All changes saved',
      showSpinner: false,
    };
  };

  const status = getStatusInfo();

  return (
    <button
      className="relative p-3 bg-white rounded-lg shadow-lg border border-gray-200 hover:bg-gray-50 transition-colors cursor-default"
      title={status.tooltip}
      disabled
    >
      {status.showSpinner ? (
        <Loader2 size={20} className="text-gray-700 animate-spin" />
      ) : (
        <Cloud size={20} className="text-gray-700" />
      )}
      {/* Status Dot - Blue when saving, Amber for unsaved, Green when saved */}
      <span 
        className={`absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-white transition-colors ${status.dotColor}`}
      />
    </button>
  );
};

export default AutoSaveIndicator;
