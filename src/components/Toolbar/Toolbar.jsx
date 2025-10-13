import { 
  MousePointer2,
  Hand,
  Square,
  Diamond,
  Circle,
  ArrowRight,
  Pencil,
  Type,
  Eraser,
  Image,
  Lock,
  LockOpen,
} from 'lucide-react';
import ToolButton from './ToolButton';
import { useEditorStore } from '../../store';
import { TOOLS } from '../../constants';
import { useState } from 'react';

/**
 * Main Toolbar Component
 * Displays all drawing tools in a centered horizontal toolbar
 * Inspired by Excalidraw's clean design
 */
export default function Toolbar() {
  const { currentTool, setCurrentTool } = useEditorStore();
  const [isLocked, setIsLocked] = useState(false);

  const tools = [
    {
      id: 'lock',
      icon: isLocked ? Lock : LockOpen,
      label: isLocked ? 'Locked' : 'Unlocked',
      shortcut: 'L',
      description: isLocked 
        ? 'Canvas is locked - click to unlock' 
        : 'Lock canvas to prevent editing',
      special: true,
    },
    {
      type: 'separator',
    },
    {
      id: TOOLS.SELECT,
      icon: MousePointer2,
      label: 'Selection',
      shortcut: 'V',
      description: 'Select, move and resize objects',
    },
    {
      id: 'hand',
      icon: Hand,
      label: 'Hand',
      shortcut: 'H',
      description: 'Pan canvas (or hold Space)',
      disabled: true, // Will implement pan mode later
    },
    {
      type: 'separator',
    },
    {
      id: TOOLS.RECTANGLE,
      icon: Square,
      label: 'Rectangle',
      shortcut: 'R',
      description: 'Draw a rectangle',
    },
    {
      id: TOOLS.ELLIPSE,
      icon: Circle,
      label: 'Ellipse',
      shortcut: 'O',
      description: 'Draw an ellipse',
    },
    {
      id: 'diamond',
      icon: Diamond,
      label: 'Diamond',
      shortcut: 'D',
      description: 'Draw a diamond',
      disabled: true, // Not implemented yet
    },
    {
      id: TOOLS.ARROW,
      icon: ArrowRight,
      label: 'Arrow',
      shortcut: 'A',
      description: 'Draw an arrow',
    },
    {
      id: TOOLS.DRAW,
      icon: Pencil,
      label: 'Draw',
      shortcut: 'P',
      description: 'Draw freehand',
    },
    {
      type: 'separator',
    },
    {
      id: TOOLS.TEXT,
      icon: Type,
      label: 'Text',
      shortcut: 'T',
      description: 'Add text',
    },
    {
      id: 'image',
      icon: Image,
      label: 'Image',
      shortcut: 'I',
      description: 'Insert image',
      disabled: true, // Not implemented yet
    },
    {
      type: 'separator',
    },
    {
      id: TOOLS.ERASER,
      icon: Eraser,
      label: 'Eraser',
      shortcut: 'E',
      description: 'Erase objects',
    },
  ];

  const handleToolClick = (toolId) => {
    // Handle lock button
    if (toolId === 'lock') {
      setIsLocked(!isLocked);
      return;
    }

    // Handle other tools
    if (toolId && toolId !== 'hand' && toolId !== 'diamond' && toolId !== 'image') {
      setCurrentTool(toolId);
    }
  };

  return (
    <div className="bg-white border-b border-gray-200 px-4 py-3">
      <div className="flex items-center justify-center">
        <div className="flex items-center gap-1">
          {tools.map((tool, index) => {
            if (tool.type === 'separator') {
              return (
                <div
                  key={`separator-${index}`}
                  className="w-px h-8 bg-gray-200 mx-1"
                />
              );
            }

            return (
              <ToolButton
                key={tool.id}
                icon={tool.icon}
                label={tool.label}
                shortcut={tool.shortcut}
                description={tool.description}
                isActive={tool.special ? isLocked && tool.id === 'lock' : currentTool === tool.id}
                disabled={tool.disabled}
                onClick={() => handleToolClick(tool.id)}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
