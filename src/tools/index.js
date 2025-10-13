import SelectTool from './SelectTool';
import RectangleTool from './RectangleTool';
import EllipseTool from './EllipseTool';
import ArrowTool from './ArrowTool';
import DrawTool from './DrawTool';
import TextTool from './TextTool';
import EraserTool from './EraserTool';

// Tool registry
export const tools = {
  select: new SelectTool(),
  rectangle: new RectangleTool(),
  ellipse: new EllipseTool(),
  arrow: new ArrowTool(),
  draw: new DrawTool(),
  text: new TextTool(),
  eraser: new EraserTool(),
};

// Get tool by name
export const getTool = (toolName) => {
  return tools[toolName] || tools.select;
};

export default tools;
