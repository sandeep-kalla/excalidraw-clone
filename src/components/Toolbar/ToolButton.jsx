import { useState } from 'react';

/**
 * Individual Tool Button Component
 * Displays a tool icon with hover tooltip
 */
export default function ToolButton({
  icon: Icon,
  label,
  shortcut,
  description,
  isActive = false,
  disabled = false,
  onClick,
}) {
  const [showTooltip, setShowTooltip] = useState(false);

  const handleClick = () => {
    if (!disabled) {
      onClick?.();
    }
  };

  return (
    <div className="relative">
      <button
        onClick={handleClick}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        disabled={disabled}
        className={`
          relative p-2.5 rounded-lg transition-all duration-150
          ${isActive 
            ? 'bg-indigo-100 text-indigo-600 shadow-sm' 
            : 'text-gray-700 hover:bg-gray-100'
          }
          ${disabled 
            ? 'opacity-40 cursor-not-allowed' 
            : 'cursor-pointer active:scale-95'
          }
          focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1
        `}
        aria-label={label}
        aria-pressed={isActive}
        title={`${label} (${shortcut})`}
      >
        <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
      </button>

      {/* Tooltip */}
      {showTooltip && !disabled && (
        <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 z-50 whitespace-nowrap">
          <div className="bg-gray-900 text-white px-3 py-2 rounded-lg shadow-lg text-sm">
            <div className="font-medium mb-0.5">
              {label}
              <span className="ml-2 text-gray-300 font-mono text-xs">
                {shortcut}
              </span>
            </div>
            {description && (
              <div className="text-xs text-gray-400">
                {description}
              </div>
            )}
            {/* Arrow pointer */}
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-[-1px]">
              <div className="w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-gray-900" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
