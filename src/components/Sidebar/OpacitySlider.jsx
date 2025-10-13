import { useState } from 'react';

/**
 * Opacity Slider Component - Compact Version
 * Minimal design for opacity control
 */
export default function OpacitySlider({ opacity, onChange }) {
  const [isDragging, setIsDragging] = useState(false);

  const handleChange = (e) => {
    const value = parseInt(e.target.value);
    onChange(value);
  };

  return (
    <div className="space-y-2">
      {/* Value display and slider combined */}
      <div className="flex items-center gap-2">
        <input
          type="number"
          min="0"
          max="100"
          value={opacity}
          onChange={handleChange}
          className="w-14 px-2 py-1 text-xs text-center border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-indigo-500"
        />
        <span className="text-xs text-gray-500">%</span>
        
        {/* Slider */}
        <div className="flex-1 relative">
          <input
            type="range"
            min="0"
            max="100"
            step="1"
            value={opacity}
            onChange={handleChange}
            onMouseDown={() => setIsDragging(true)}
            onMouseUp={() => setIsDragging(false)}
            className="w-full h-1.5 bg-gray-200 rounded-full appearance-none cursor-pointer opacity-slider"
          />
        </div>
      </div>

      {/* Visual preview - compact */}
      <div className="h-6 border border-gray-200 rounded overflow-hidden relative">
        {/* Checkered background for transparency */}
        <div 
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(45deg, #e5e7eb 25%, transparent 25%, transparent 75%, #e5e7eb 75%, #e5e7eb), linear-gradient(45deg, #e5e7eb 25%, transparent 25%, transparent 75%, #e5e7eb 75%, #e5e7eb)',
            backgroundSize: '6px 6px',
            backgroundPosition: '0 0, 3px 3px'
          }}
        />
        {/* Color with opacity */}
        <div 
          className="absolute inset-0 bg-gray-700"
          style={{ opacity: opacity / 100 }}
        />
      </div>

      <style jsx>{`
        .opacity-slider::-webkit-slider-thumb {
          appearance: none;
          width: 14px;
          height: 14px;
          border-radius: 50%;
          background: #4f46e5;
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 1px 3px rgba(0,0,0,0.2);
        }

        .opacity-slider::-moz-range-thumb {
          width: 14px;
          height: 14px;
          border-radius: 50%;
          background: #4f46e5;
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 1px 3px rgba(0,0,0,0.2);
        }

        .opacity-slider::-webkit-slider-thumb:hover {
          transform: scale(1.1);
        }

        .opacity-slider::-moz-range-thumb:hover {
          transform: scale(1.1);
        }

        .opacity-slider::-webkit-slider-runnable-track {
          background: linear-gradient(to right, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.8) 100%);
          border-radius: 9999px;
        }

        .opacity-slider::-moz-range-track {
          background: linear-gradient(to right, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.8) 100%);
          border-radius: 9999px;
        }
      `}</style>
    </div>
  );
}
