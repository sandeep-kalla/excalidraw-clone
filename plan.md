---

## 🎯 Project Overview

**Core Goal**: Build a hand-drawn style whiteboard with the ability to create, save, and manage multiple named canvases locally.

**Tech Stack**:
- React + Vite (already set up)
- TailwindCSS (already installed)
- Rough.js (hand-drawn rendering)
- Zustand (state management)
- LocalStorage (multi-canvas persistence)

---

## 📋 Phase-by-Phase Implementation Plan

### **Phase 0: Project Setup & Dependencies** ✅

_Duration: 30 minutes_

**Tasks**:

- [x] Vite + React setup (done)
- [x] TailwindCSS (done)
- [x] Install additional dependencies:
  - `roughjs` - hand-drawn rendering
  - `zustand` - state management
  - `nanoid` - unique IDs
  - `lucide-react` - icons
  - `react-hotkeys-hook` - keyboard shortcuts

**Deliverable**: All dependencies installed and project structure ready. ✅

---

### **Phase 1: Core Data Models & State Management**

_Duration: 1-2 hours_

**Tasks**:

1. **Define data models** (`src/types/`) ✅:

   ```javascript
   - Element: { id, type, x, y, width, height, stroke, fill, ... }
   - Canvas: { id, name, elements[], appState, createdAt, updatedAt }
   - AppState: { tool, strokeColor, fillColor, strokeWidth, zoom, pan }
   - Tool: 'select' | 'rectangle' | 'ellipse' | 'arrow' | 'draw' | 'text'
   - Constants: colors, stroke widths, keyboard shortcuts, etc.
   ```

2. **Create Zustand store** (`src/store/`) ✅:

   - Canvas store: current canvas, all canvases list
   - Editor store: current tool, style settings
   - History store: undo/redo stacks

3. **LocalStorage utilities** (`src/utils/storage.js`) ✅:
   - `saveCanvas(canvas)` - save to localStorage
   - `loadCanvas(id)` - load from localStorage
   - `getAllCanvases()` - get all saved canvases
   - `deleteCanvas(id)` - delete canvas
   - `createNewCanvas(name)` - create blank canvas
   - Plus: import/export, search, duplicate, storage info

**Deliverable**: Complete state management architecture with localStorage integration. ✅

---

### **Phase 2: Canvas Management UI (Your Unique Feature!)**✅

completed phase 2.
_Duration: 2-3 hours_

**Tasks**:

1. **Canvas Manager Component** (`src/components/CanvasManager/`):

   - Modal/sidebar showing all saved canvases
   - List with canvas names, thumbnails (optional), created/updated dates
   - "New Canvas" button with name input
   - "Open", "Rename", "Delete" actions per canvas
   - "Duplicate Canvas" option

2. **Top Navigation Bar** (`src/components/Navbar.jsx`):
   - Current canvas name display (editable inline)
   - "Save" button (with auto-save indicator)
   - "My Canvases" button (opens manager)
   - Export menu (PNG, SVG, JSON)

**UI Structure**:

```
┌─────────────────────────────────────────────┐
│ ☰ [Canvas Name ✏️] | Save | My Canvases | Export │
├─────────────────────────────────────────────┤
│                                             │
│              CANVAS AREA                    │
│                                             │
└─────────────────────────────────────────────┘
```

**Deliverable**: Full canvas management system with create/save/load/delete functionality. ✅ DONE

---

### **Phase 3: Core Canvas Renderer** ✅ COMPLETE

_Duration: 3-4 hours_

**Tasks**:

1. **Canvas Component** (`src/components/Canvas/Canvas.jsx`):✅ DONE

   - Set up HTML5 `<canvas>` element
   - Implement zoom/pan (mouse wheel + space+drag)
   - Handle canvas resizing
   - Render loop with `requestAnimationFrame`

2. **Rough.js Integration** (`src/utils/renderer.js`):✅ DONE

   - Initialize RoughCanvas
   - Render functions for each element type:
     - `renderRectangle(element)`
     - `renderEllipse(element)`
     - `renderArrow(element)`
     - `renderFreeDraw(element)`
     - `renderText(element)`
   - Apply hand-drawn style with roughness/seed

3. **Performance optimizations**:✅ DONE
   - Only redraw changed elements (dirty flag)
   - Viewport culling (don't render off-screen elements)

**Deliverable**: Functional canvas that can render hand-drawn shapes. ✅ COMPLETE

---

### **Phase 4: Drawing Tools Implementation**

_Duration: 4-6 hours_

**Priority order** (implement one tool at a time):

#### **4.1: Selection Tool** ⭐ (most complex)✅ DONE

- Click to select element
- Drag to move
- Multi-select with Shift/Ctrl or drag box
- Resize handles (8 corners/edges)
- Rotation handle
- Delete key support

#### **4.2: Rectangle Tool**✅ DONE

- Click + drag to create
- Live preview while dragging
- Apply current stroke/fill settings

#### **4.3: Ellipse Tool**✅ DONE

- Same as rectangle but circular

#### **4.4: Arrow/Line Tool**✅ DONE

- Click start → drag → release end
- Arrow heads
- Different line styles (solid, dashed)

#### **4.5: Freehand/Draw Tool**✅ DONE

- Capture mouse path as points array
- Render smooth curves (use Rough.js curve)
- Pressure sensitivity (optional)

#### **4.6: Text Tool**✅ DONE

- Double-click to create text box
- Inline editing with contentEditable or textarea overlay
- Font size options
- Text alignment

#### **4.7: Eraser Tool**✅ DONE

- Click element to delete
- Or drag to delete multiple

**Tool Manager** (`src/utils/tools/`):

- Each tool as separate module with:
  - `onMouseDown(e, state)`
  - `onMouseMove(e, state)`
  - `onMouseUp(e, state)`
  - `render(context, previewElement)`

**Deliverable**: All core drawing tools functional.
✅ COMPLETED

---

### **Phase 5: Toolbar & Style Controls**

_Duration: 2-3 hours_

**Components**:

1. **Main Toolbar** (`src/components/Toolbar/Toolbar.jsx`):✅ DONE

   - Tool buttons (select, rectangle, ellipse, arrow, draw, text, eraser)
   - Active tool highlight
   - Keyboard shortcuts display (tooltips)

2. **Left Sidebar** (Properties Panel):✅ DONE

   - **Stroke section**: color palette + hex input
   - **Background section**: color palette + transparent option
   - **Stroke width**: thin/medium/thick buttons
   - **Opacity slider**: 0-100
   - **Layers**: bring forward/backward buttons
   - **Align tools**: left/center/right/top/middle/bottom (for multi-select)
   - **Actions**: duplicate, delete buttons

3. **Color Picker Component**:✅ DONE
   - Preset palette (like screenshots)
   - Color shades (g1-g5 pattern)
   - Custom hex code input

**Deliverable**: Complete UI matching Excalidraw's aesthetic.
✅ COMPLETED

---

### **Phase 6: Undo/Redo System**

_Duration: 2 hours_

**Implementation**:

1. **Command Pattern**:✅ DONE

   - Create `Command` interface: `{ execute(), undo() }`
   - Commands: AddElement, DeleteElement, MoveElement, StyleChange, etc.

2. **History Manager** (`src/utils/history.js`):✅ DONE

   - Two stacks: `undoStack[]`, `redoStack[]`
   - `pushCommand(cmd)` - execute and push to undo stack
   - `undo()` - pop from undo, push to redo
   - `redo()` - pop from redo, push to undo
   - Clear redo stack on new action

3. **Keyboard shortcuts**:✅ DONE
   - Ctrl+Z (undo)
   - Ctrl+Shift+Z or Ctrl+Y (redo)

**Deliverable**: Full undo/redo with keyboard support.
✅ COMPLETED

---

### **Phase 7: Export Functionality**

_Duration: 2-3 hours_

**Export Options**:

1. **Export to PNG**:✅ DONE

   - Render all elements to canvas
   - Use `canvas.toDataURL('image/png')`
   - Download as file

2. **Export to SVG**:✅ DONE

   - Convert elements to SVG elements
   - Use Rough.js SVG mode
   - Download as `.svg` file

3. **Export to JSON**:✅ DONE

   - Serialize current canvas state
   - Download as `.excalidraw.json` (compatible format)

4. **Import from JSON**:✅ DONE
   - File upload
   - Parse and load elements
   - Add to canvas list

**Menu Component** (`src/components/ExportMenu.jsx`):✅ DONE

- Dropdown from hamburger menu
- Export options with icons
- "Copy to clipboard" option

**Deliverable**: Full import/export functionality.
✅ COMPLETED

---

### **Phase 8: Keyboard Shortcuts & UX Polish**

_Duration: 2 hours_

**Shortcuts to implement**:✅ DONE

- Tool shortcuts: V (select), R (rectangle), O (ellipse), A (arrow), P (pen), T (text)
- Edit: Ctrl+C/V/X (copy/paste/cut)
- Delete: Delete/Backspace
- Undo/Redo: Ctrl+Z / Ctrl+Shift+Z
- Zoom: Ctrl++ / Ctrl+- / Ctrl+0 (reset)
- Pan: Space+Drag or Middle mouse drag

**UX Enhancements**:✅ DONE

- Tooltips on hover
- Loading states
- Empty state (when no canvases)
- Confirmation dialogs (delete canvas)
- Toast notifications (saved, exported, etc.)

**Deliverable**: Professional keyboard-driven UX.
✅ COMPLETED

---

### **Phase 9: Auto-Save & Persistence**

_Duration: 1-2 hours_

**Implementation**:

1. **Auto-save logic**:✅ DONE

   - Debounced save (500ms after last change)
   - Save current canvas to localStorage
   - Visual indicator ("Saving..." → "All changes saved")

2. **App initialization**:✅ DONE

   - Load last opened canvas on mount
   - Or show canvas manager if no recent canvas

3. **Data migration/versioning**:✅ DONE
   - Version field in data model
   - Handle schema changes gracefully

**Deliverable**: Reliable auto-save with visual feedback.
✅ COMPLETED

---

### **Phase 10: Advanced Features (Optional)**

_Duration: 4-8 hours_

**Nice-to-haves**:

1. **Canvas thumbnails**:

   - Generate small preview image when saving
   - Show in canvas manager

2. **Search/filter canvases**:

   - Search by name
   - Sort by date/name

3. **Tags/categories**:

   - Add tags to canvases
   - Filter by tag

4. **Templates**:

   - Pre-made canvas templates
   - "Start from template" option

5. **Grid/guides**:

   - Toggle grid overlay
   - Snap to grid option

6. **Arrow binding**:

   - Arrows attach to shapes
   - Move with shapes

7. **Dark mode**:
   - Theme toggle
   - Dark canvas background

**Deliverable**: Enhanced user experience.

---

## 🏗️ Recommended Folder Structure

```
src/
├── components/
│   ├── Canvas/
│   │   ├── Canvas.jsx          # Main canvas component
│   │   ├── CanvasRenderer.js   # Rendering logic
│   │   └── ViewportControls.jsx # Zoom/pan UI
│   ├── CanvasManager/
│   │   ├── CanvasManager.jsx   # Canvas list modal
│   │   ├── CanvasList.jsx      # List of canvases
│   │   └── NewCanvasDialog.jsx # Create new canvas
│   ├── Toolbar/
│   │   ├── Toolbar.jsx         # Main toolbar
│   │   └── ToolButton.jsx      # Individual tool buttons
│   ├── Sidebar/
│   │   ├── PropertiesPanel.jsx # Left sidebar
│   │   ├── ColorPicker.jsx     # Color selection
│   │   └── StyleControls.jsx   # Stroke/fill/opacity
│   ├── Navbar/
│   │   ├── Navbar.jsx          # Top navigation
│   │   └── ExportMenu.jsx      # Export dropdown
│   └── UI/
│       ├── Button.jsx          # Reusable button
│       ├── Slider.jsx          # Opacity slider
│       └── Modal.jsx           # Modal wrapper
├── store/
│   ├── canvasStore.js          # Canvas state (Zustand)
│   ├── editorStore.js          # Editor settings
│   └── historyStore.js         # Undo/redo
├── utils/
│   ├── storage.js              # LocalStorage operations
│   ├── renderer.js             # Rough.js rendering
│   ├── geometry.js             # Math helpers
│   ├── export.js               # Export functions
│   └── history.js              # Command pattern
├── tools/
│   ├── SelectTool.js
│   ├── RectangleTool.js
│   ├── EllipseTool.js
│   ├── ArrowTool.js
│   ├── DrawTool.js
│   ├── TextTool.js
│   └── EraserTool.js
├── types/
│   └── index.js                # Type definitions
├── constants/
│   └── index.js                # Colors, defaults
├── App.jsx
└── main.jsx
```

---

## 🗂️ Data Model (LocalStorage Schema)

```javascript
// LocalStorage structure
{
  "excalidraw_canvases": {
    "canvas_123": {
      id: "canvas_123",
      name: "My Diagram",
      elements: [
        {
          id: "el_456",
          type: "rectangle",
          x: 100,
          y: 100,
          width: 200,
          height: 150,
          stroke: "#2f9e44",
          fill: "transparent",
          strokeWidth: 2,
          roughness: 1,
          seed: 12345,
          angle: 0
        },
        // ... more elements
      ],
      appState: {
        zoom: 1,
        scrollX: 0,
        scrollY: 0,
        currentTool: "select",
        strokeColor: "#2f9e44",
        fillColor: "transparent",
        strokeWidth: 2,
        opacity: 100
      },
      createdAt: "2025-10-13T...",
      updatedAt: "2025-10-13T..."
    },
    // ... more canvases
  },
  "excalidraw_settings": {
    lastOpenedCanvasId: "canvas_123",
    theme: "light"
  }
}
```

---

## 🎨 UI Implementation Priority

### **Must-Have UI (MVP)**:

1. ✅ Top navbar with canvas name + save/open buttons
2. ✅ Tool selection toolbar (top center)
3. ✅ Left sidebar for properties (stroke, fill, width, opacity)
4. ✅ Canvas manager modal
5. ✅ Main canvas area

### **Nice-to-Have UI**:

- Zoom controls (bottom-left: -, %, +)
- Undo/redo buttons (bottom-left)
- Theme toggle
- Export menu (hamburger menu)

---

## 🚀 Implementation Sequence (Step-by-Step)

### **Week 1: Foundation**

**Day 1-2**: Phase 0 + Phase 1

- Install dependencies
- Set up data models and Zustand stores
- Create localStorage utilities

**Day 3-4**: Phase 2

- Build Canvas Manager UI
- Implement create/save/load/delete canvas
- Test multi-canvas workflow

**Day 5**: Phase 3 (Part 1)

- Set up canvas element
- Implement zoom/pan
- Basic Rough.js rendering test

---

### **Week 2: Core Drawing**

**Day 6-7**: Phase 3 (Part 2) + Phase 4.1-4.2

- Complete renderer
- Implement Selection tool
- Implement Rectangle tool

**Day 8-9**: Phase 4.3-4.5

- Ellipse tool
- Arrow tool
- Freehand draw tool

**Day 10**: Phase 4.6-4.7

- Text tool
- Eraser tool

---

### **Week 3: Polish**

**Day 11-12**: Phase 5

- Build complete toolbar
- Style controls sidebar
- Color picker

**Day 13**: Phase 6

- Undo/redo system
- Keyboard shortcuts

**Day 14**: Phase 7

- Export to PNG/SVG/JSON
- Import from JSON

**Day 15**: Phase 8 + Phase 9

- All keyboard shortcuts
- Auto-save
- Final UX polish

---

## 🎯 Success Metrics

**MVP is done when**:

- ✅ Can create multiple named canvases
- ✅ Can draw rectangles, ellipses, arrows, freehand, text
- ✅ Can select, move, resize elements
- ✅ Can change colors, stroke width, opacity
- ✅ Can save/load canvases from localStorage
- ✅ Can export to PNG/JSON
- ✅ Undo/redo works
- ✅ Basic keyboard shortcuts work

---

## 🔧 Technical Decisions & Recommendations

### **1. State Management**: Zustand vs Redux

**Choose Zustand** because:

- Simpler API, less boilerplate
- Perfect for canvas state (flat structure)
- Better performance for frequent updates
- Already pairs well with React

### **2. Rendering**: Canvas vs SVG

**Choose HTML5 Canvas** because:

- Better performance with many elements (100+)
- Easier for freehand drawing
- Rough.js works great with canvas
- Excalidraw uses canvas

### **3. Persistence**: LocalStorage vs IndexedDB

**Start with LocalStorage** because:

- Simpler API
- Sufficient for text/JSON data
- Easy debugging
- Can migrate to IndexedDB later if needed (>5MB data)

### **4. IDs**: UUID vs NanoID

**Choose NanoID** because:

- Smaller size (21 chars vs 36)
- URL-friendly
- Faster than UUID

---

## ⚠️ Important Caveats & Tips

1. **Canvas coordinate system**:

   - Track "world coordinates" vs "screen coordinates"
   - Apply zoom/pan transforms correctly
   - Test edge cases (negative coords, very large canvases)

2. **Performance**:

   - Throttle mouse move events (16ms / 60fps)
   - Use `requestAnimationFrame` for rendering
   - Implement dirty rectangles for partial redraws

3. **LocalStorage limits**:

   - ~5-10MB per domain
   - Compress JSON if needed (pako.js)
   - Show warning when approaching limit

4. **Touch support**:

   - Add touch event listeners
   - Support pinch-to-zoom
   - Prevent default touch behaviors

5. **Text editing**:
   - Position absolutely over canvas
   - Handle zoom transforms
   - Measure text bounds accurately

---

## 📦 Dependencies to Install

```json
{
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "roughjs": "^4.6.6",
    "zustand": "^4.5.0",
    "nanoid": "^5.0.7",
    "lucide-react": "^0.400.0",
    "react-hotkeys-hook": "^4.5.0"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.3.0",
    "autoprefixer": "^10.4.19",
    "postcss": "^8.4.38",
    "tailwindcss": "^3.4.4",
    "vite": "^5.3.0"
  }
}
```

---

## 🎉 Your Unique Value Proposition

**Excalidraw Free**: Single canvas, download to save multiple files manually

**Your Clone**:

- ✅ Unlimited named canvases in one app
- ✅ Quick switching between projects
- ✅ Organized canvas library
- ✅ Search/filter canvases (Phase 10)
- ✅ No file management needed

This is a **genuine improvement** for users who work on multiple diagrams!

---
