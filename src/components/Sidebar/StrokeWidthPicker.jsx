import { STROKE_WIDTHS } from '../../constants';

/**
 * Stroke Width Picker Component - Compact Version
 * Minimal design with visual preview
 */
export default function StrokeWidthPicker({ width, onChange }) {
  const widthOptions = [
    { value: STROKE_WIDTHS.THIN, label: 'Thin' },
    { value: STROKE_WIDTHS.MEDIUM, label: 'Medium' },
    { value: STROKE_WIDTHS.THICK, label: 'Thick' },
    { value: STROKE_WIDTHS.EXTRA_THICK, label: 'Extra' },
  ];

  return (
    <div className="grid grid-cols-4 gap-1.5">
      {widthOptions.map((option) => (
        <button
          key={option.value}
          onClick={() => onChange(option.value)}
          className={`
            relative flex flex-col items-center justify-center py-2 px-1 rounded border transition-all
            ${width === option.value
              ? 'border-indigo-500 bg-indigo-50'
              : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
            }
          `}
          title={option.label}
        >
          {/* Visual preview line */}
          <div className="mb-1.5">
            <div
              className="bg-gray-700 rounded-full"
              style={{
                width: '20px',
                height: `${option.value}px`,
              }}
            />
          </div>
          
          {/* Label */}
          <span className="text-[10px] text-gray-500">
            {option.label}
          </span>
        </button>
      ))}
    </div>
  );
}
