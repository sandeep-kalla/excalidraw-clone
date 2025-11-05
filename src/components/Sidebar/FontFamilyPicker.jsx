import { Type } from 'lucide-react';

/**
 * Font Family Picker Component
 * Allows selection of font family for text elements
 */

const FONT_FAMILIES = [
  { value: 'Arial, sans-serif', label: 'Arial', preview: 'Arial' },
  { value: 'Helvetica, sans-serif', label: 'Helvetica', preview: 'Helvetica' },
  { value: 'Times New Roman, serif', label: 'Times New Roman', preview: 'Times New Roman' },
  { value: 'Georgia, serif', label: 'Georgia', preview: 'Georgia' },
  { value: 'Courier New, monospace', label: 'Courier New', preview: 'Courier New' },
  { value: 'Comic Sans MS, cursive', label: 'Comic Sans', preview: 'Comic Sans MS' },
  { value: 'Verdana, sans-serif', label: 'Verdana', preview: 'Verdana' },
  { value: 'Trebuchet MS, sans-serif', label: 'Trebuchet', preview: 'Trebuchet MS' },
  { value: 'Impact, fantasy', label: 'Impact', preview: 'Impact' },
];

export default function FontFamilyPicker({ fontFamily = 'Arial, sans-serif', onChange }) {
  return (
    <div className="space-y-2">
      <div className="relative">
        <Type className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
        <select
          value={fontFamily}
          onChange={(e) => onChange(e.target.value)}
          className="w-full pl-8 pr-2 py-1.5 text-xs border border-gray-300 rounded hover:border-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white cursor-pointer"
        >
          {FONT_FAMILIES.map((font) => (
            <option key={font.value} value={font.value}>
              {font.label}
            </option>
          ))}
        </select>
      </div>
      
      {/* Font preview */}
      <div className="p-2 bg-gray-50 rounded border border-gray-200">
        <p 
          className="text-sm text-gray-700 truncate"
          style={{ fontFamily }}
        >
          The quick brown fox
        </p>
      </div>
    </div>
  );
}
