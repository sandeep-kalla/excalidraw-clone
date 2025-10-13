import { useState } from 'react';
import { COLOR_PALETTE, COLORS } from '../../constants';
import { ChevronDown } from 'lucide-react';

/**
 * Color Picker Component - Compact Version
 * Shows quick colors with expandable full palette
 */
export default function ColorPicker({ color, onChange, allowTransparent = false, compact = false }) {
  const [showAllColors, setShowAllColors] = useState(false);
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customColor, setCustomColor] = useState(color);

  const handleColorClick = (newColor) => {
    onChange(newColor);
    setCustomColor(newColor);
  };

  const handleCustomColorChange = (e) => {
    const value = e.target.value;
    setCustomColor(value);
    
    // Only update if valid hex color
    if (/^#[0-9A-F]{6}$/i.test(value)) {
      onChange(value);
    }
  };

  const isColorSelected = (paletteColor) => {
    return color.toLowerCase() === paletteColor.toLowerCase();
  };

  // Quick access colors (first 3 rows)
  const quickColors = compact ? COLOR_PALETTE.slice(0, 3) : COLOR_PALETTE;

  return (
    <div className="space-y-2">
      {/* Current color display - at top */}
      <div className="flex items-center gap-2">
        <div
          className="w-7 h-7 rounded border-2 border-gray-300 flex-shrink-0"
          style={{
            backgroundColor: color === COLORS.TRANSPARENT ? '#ffffff' : color,
            backgroundImage: color === COLORS.TRANSPARENT
              ? 'linear-gradient(45deg, #ccc 25%, transparent 25%, transparent 75%, #ccc 75%, #ccc), linear-gradient(45deg, #ccc 25%, transparent 25%, transparent 75%, #ccc 75%, #ccc)'
              : 'none',
            backgroundSize: '8px 8px',
            backgroundPosition: '0 0, 4px 4px'
          }}
        />
        <span className="text-xs text-gray-600 font-mono flex-1 truncate">
          {color === COLORS.TRANSPARENT ? 'transparent' : color}
        </span>
      </div>

      {/* Transparent option */}
      {allowTransparent && (
        <button
          onClick={() => handleColorClick(COLORS.TRANSPARENT)}
          className={`
            w-full h-7 rounded border transition-all text-xs font-medium
            ${isColorSelected(COLORS.TRANSPARENT)
              ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
              : 'border-gray-300 hover:border-gray-400 text-gray-600'
            }
          `}
          style={{
            background: isColorSelected(COLORS.TRANSPARENT) ? undefined : 'linear-gradient(45deg, #f3f4f6 25%, transparent 25%, transparent 75%, #f3f4f6 75%, #f3f4f6), linear-gradient(45deg, #f3f4f6 25%, transparent 25%, transparent 75%, #f3f4f6 75%, #f3f4f6)',
            backgroundSize: '8px 8px',
            backgroundPosition: '0 0, 4px 4px'
          }}
          title="Transparent"
        >
          Transparent
        </button>
      )}

      {/* Quick access color palette */}
      <div className="grid grid-cols-6 gap-1">
        {quickColors.map((row, rowIndex) => (
          row.slice(0, 6).map((paletteColor, colIndex) => (
            <button
              key={`${rowIndex}-${colIndex}`}
              onClick={() => handleColorClick(paletteColor)}
              className={`
                w-7 h-7 rounded border transition-all
                hover:scale-110 active:scale-95
                ${isColorSelected(paletteColor)
                  ? 'border-indigo-500 ring-1 ring-indigo-300'
                  : 'border-gray-200 hover:border-gray-400'
                }
              `}
              style={{ backgroundColor: paletteColor }}
              title={paletteColor}
            />
          ))
        ))}
      </div>

      {/* Show more colors toggle */}
      {compact && (
        <button
          onClick={() => setShowAllColors(!showAllColors)}
          className="w-full py-1 text-xs text-gray-600 hover:text-gray-800 flex items-center justify-center gap-1"
        >
          {showAllColors ? 'Show less' : 'More colors'}
          <ChevronDown size={12} className={`transition-transform ${showAllColors ? 'rotate-180' : ''}`} />
        </button>
      )}

      {/* Full color palette - expandable */}
      {showAllColors && compact && (
        <div className="grid grid-cols-6 gap-1 pt-1">
          {COLOR_PALETTE.slice(3).map((row, rowIndex) => (
            row.slice(0, 6).map((paletteColor, colIndex) => (
              <button
                key={`more-${rowIndex}-${colIndex}`}
                onClick={() => handleColorClick(paletteColor)}
                className={`
                  w-7 h-7 rounded border transition-all
                  hover:scale-110 active:scale-95
                  ${isColorSelected(paletteColor)
                    ? 'border-indigo-500 ring-1 ring-indigo-300'
                    : 'border-gray-200 hover:border-gray-400'
                  }
                `}
                style={{ backgroundColor: paletteColor }}
                title={paletteColor}
              />
            ))
          ))}
        </div>
      )}

      {/* Custom color input */}
      <div className="pt-1">
        {showCustomInput ? (
          <div className="flex gap-1">
            <input
              type="text"
              value={customColor}
              onChange={handleCustomColorChange}
              placeholder="#000000"
              className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-indigo-500"
              maxLength={7}
            />
            <button
              onClick={() => setShowCustomInput(false)}
              className="px-2 py-1 text-xs text-gray-600 hover:text-gray-800"
            >
              ✕
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowCustomInput(true)}
            className="w-full py-1 text-xs text-indigo-600 hover:text-indigo-700 font-medium"
          >
            + Custom color
          </button>
        )}
      </div>
    </div>
  );
}
