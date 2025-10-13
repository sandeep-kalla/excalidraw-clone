import { useRef, useEffect, useState, useCallback } from 'react';
import { useCanvasStore, useEditorStore } from '../../store';
import { renderElements, getViewportBounds } from '../../utils/renderer';
import { getTool } from '../../tools';
import tools from '../../tools';

const Canvas = () => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const animationFrameRef = useRef(null);
  const isSpacePressed = useRef(false);
  const isPanning = useRef(false);
  const lastMousePos = useRef({ x: 0, y: 0 });
  const isDirty = useRef(true); // Dirty flag for optimization
  const lastRenderState = useRef({ zoom: 1, scrollX: 0, scrollY: 0, elementsCount: 0 });
  const throttleTimeout = useRef(null);
  const currentTool = useRef(null);

  const { 
    currentCanvas, 
    updateElement, 
    deleteElement, 
    addElement,
    commitToHistory
  } = useCanvasStore();
  
  const { 
    currentTool: toolName,
    zoom, 
    scrollX, 
    scrollY, 
    selectedElementIds,
    setSelectedElements,
    clipboard,
    setClipboard,
    getCurrentStyle,
    setZoom, 
    setScroll,
    setCurrentTool
  } = useEditorStore();

  // Handle canvas resizing
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        setDimensions({ width, height });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);

    return () => {
      window.removeEventListener('resize', updateDimensions);
    };
  }, []);

  // Update current tool reference
  useEffect(() => {
    currentTool.current = getTool(toolName);
  }, [toolName]);

  // Create state adapter for tools
  const getToolState = useCallback(() => ({
    zoom,
    scrollX,
    scrollY,
    getElements: () => currentCanvas?.elements || [],
    getSelectedIds: () => selectedElementIds,
    setSelectedIds: setSelectedElements,
    setCurrentTool: setCurrentTool,
    tools: Object.values(tools),
    updateElement: (id, updates) => {
      updateElement(id, updates);
      isDirty.current = true;
    },
    deleteElement: (id) => {
      deleteElement(id);
      isDirty.current = true;
    },
    addElement: (element) => {
      addElement(element);
      isDirty.current = true;
    },
    commitChanges: () => {
      commitToHistory();
    },
    getClipboard: () => clipboard,
    setClipboard: setClipboard,
    getCurrentStyle: getCurrentStyle,
  }), [zoom, scrollX, scrollY, currentCanvas, selectedElementIds, setSelectedElements, setCurrentTool,
      updateElement, deleteElement, addElement, commitToHistory, clipboard, setClipboard, getCurrentStyle]);

  // Handle keyboard events for space key (panning) and tool shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't handle space if user is typing in an input or textarea
      const isTyping = document.activeElement.tagName === 'INPUT' || 
                       document.activeElement.tagName === 'TEXTAREA';
      
      // Space key for panning (only when not typing)
      if (e.code === 'Space' && !isSpacePressed.current && !isTyping) {
        e.preventDefault();
        isSpacePressed.current = true;
        if (containerRef.current) {
          containerRef.current.style.cursor = 'grab';
        }
      }
      
      // Pass keyboard events to tool (only when not typing)
      if (!isTyping && currentTool.current && currentTool.current.onKeyDown) {
        currentTool.current.onKeyDown(e, getToolState());
        isDirty.current = true;
      }
    };

    const handleKeyUp = (e) => {
      // Don't handle space if user is typing in an input or textarea
      const isTyping = document.activeElement.tagName === 'INPUT' || 
                       document.activeElement.tagName === 'TEXTAREA';
      
      if (e.code === 'Space' && !isTyping) {
        e.preventDefault();
        isSpacePressed.current = false;
        isPanning.current = false;
        if (containerRef.current) {
          containerRef.current.style.cursor = 'default';
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [getToolState]);

  // Handle mouse wheel for zooming - using direct DOM event listener to prevent browser zoom
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (e) => {
      // MUST preventDefault to stop browser zoom
      e.preventDefault();
      e.stopPropagation();

      if (e.ctrlKey || e.metaKey) {
        // Zoom with Ctrl/Cmd + wheel
        const delta = e.deltaY > 0 ? -0.1 : 0.1;
        const newZoom = Math.max(0.1, Math.min(5, zoom + delta));
        
        // Zoom towards mouse position
        const rect = canvasRef.current.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        
        // Adjust pan to zoom towards mouse
        const zoomRatio = newZoom / zoom;
        const newScrollX = mouseX - (mouseX - scrollX) * zoomRatio;
        const newScrollY = mouseY - (mouseY - scrollY) * zoomRatio;
        
        setZoom(newZoom);
        setScroll(newScrollX, newScrollY);
      } else {
        // Pan with wheel (without Ctrl)
        setScroll(scrollX - e.deltaX, scrollY - e.deltaY);
      }
    };

    // Add event listener with passive: false to allow preventDefault
    container.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      container.removeEventListener('wheel', handleWheel);
    };
  }, [zoom, scrollX, scrollY, setZoom, setScroll]);

  // Prevent browser zoom globally when over the canvas
  useEffect(() => {
    const preventBrowserZoom = (e) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
      }
    };

    // Listen to wheel events on document to catch all zoom attempts
    document.addEventListener('wheel', preventBrowserZoom, { passive: false });

    return () => {
      document.removeEventListener('wheel', preventBrowserZoom);
    };
  }, []);

  // Handle mouse down
  const handleMouseDown = useCallback(
    (e) => {
      if (isSpacePressed.current || e.button === 1) {
        // Middle mouse button or space+click for panning
        isPanning.current = true;
        lastMousePos.current = { x: e.clientX, y: e.clientY };
        if (containerRef.current) {
          containerRef.current.style.cursor = 'grabbing';
        }
      } else if (currentTool.current && currentTool.current.onMouseDown) {
        // Pass event to current tool
        currentTool.current.onMouseDown(e, getToolState());
        isDirty.current = true;
      }
    },
    [getToolState]
  );

  // Handle mouse move with throttling for better performance
  const handleMouseMove = useCallback(
    (e) => {
      if (isPanning.current) {
        // Throttle pan updates to 60fps (16ms)
        if (throttleTimeout.current) return;
        
        throttleTimeout.current = setTimeout(() => {
          throttleTimeout.current = null;
        }, 16);
        
        const deltaX = e.clientX - lastMousePos.current.x;
        const deltaY = e.clientY - lastMousePos.current.y;
        
        setScroll(scrollX + deltaX, scrollY + deltaY);
        isDirty.current = true; // Mark as dirty for re-render
        
        lastMousePos.current = { x: e.clientX, y: e.clientY };
      } else if (currentTool.current && currentTool.current.onMouseMove) {
        // Pass event to current tool
        currentTool.current.onMouseMove(e, getToolState());
        isDirty.current = true;
        
        // Update cursor based on tool
        if (containerRef.current && currentTool.current.cursor) {
          containerRef.current.style.cursor = currentTool.current.cursor;
        }
      }
    },
    [scrollX, scrollY, setScroll, getToolState]
  );

  // Handle mouse up
  const handleMouseUp = useCallback((e) => {
    if (isPanning.current) {
      isPanning.current = false;
      if (containerRef.current) {
        containerRef.current.style.cursor = isSpacePressed.current ? 'grab' : 'default';
      }
    } else if (currentTool.current && currentTool.current.onMouseUp) {
      // Pass event to current tool
      currentTool.current.onMouseUp(e, getToolState());
      isDirty.current = true;
    }
  }, [getToolState]);

  // Mark canvas as dirty when state changes
  useEffect(() => {
    const currentElementsCount = currentCanvas?.elements?.length || 0;
    const lastState = lastRenderState.current;
    
    // Check if anything changed
    if (
      lastState.zoom !== zoom ||
      lastState.scrollX !== scrollX ||
      lastState.scrollY !== scrollY ||
      lastState.elementsCount !== currentElementsCount
    ) {
      isDirty.current = true;
      lastRenderState.current = {
        zoom,
        scrollX,
        scrollY,
        elementsCount: currentElementsCount,
      };
    }
  }, [zoom, scrollX, scrollY, currentCanvas, selectedElementIds]);

  // Render loop with dirty flag optimization
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let isRunning = true;
    
    const render = () => {
      if (!isRunning) return;
      
      // Only render if dirty flag is set (something changed)
      if (isDirty.current) {
        // Clear canvas
        ctx.clearRect(0, 0, dimensions.width, dimensions.height);
        
        // Save context state
        ctx.save();
        
        // Apply transformations (pan and zoom)
        ctx.translate(scrollX, scrollY);
        ctx.scale(zoom, zoom);
        
        // Draw elements with Rough.js
        if (currentCanvas && currentCanvas.elements.length > 0) {
          // Calculate viewport bounds for culling optimization
          const viewportBounds = getViewportBounds(
            scrollX,
            scrollY,
            dimensions.width,
            dimensions.height,
            zoom
          );
          
          // Get the ID of the element being edited (if any) to hide it during editing
          const editingElementId = currentTool.current?.editingElementId || null;
          
          // Render all elements with hand-drawn style (except the one being edited)
          renderElements(ctx, currentCanvas.elements, zoom, viewportBounds, editingElementId);
        }
        
        // Render tool overlay (selection handles, preview elements, etc.)
        if (currentTool.current && currentTool.current.render) {
          currentTool.current.render(ctx, getToolState());
        }
        
        // Restore context state
        ctx.restore();
        
        // Clear dirty flag after rendering
        isDirty.current = false;
      }
      
      // Continue render loop
      animationFrameRef.current = requestAnimationFrame(render);
    };

    // Mark as dirty initially and start render loop
    isDirty.current = true;
    animationFrameRef.current = requestAnimationFrame(render);

    return () => {
      isRunning = false;
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [dimensions, scrollX, scrollY, zoom, currentCanvas, getToolState]);

  return (
    <div
      ref={containerRef}
      className="w-full h-full relative bg-white overflow-hidden"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      style={{ touchAction: 'none' }}
    >
      <canvas
        ref={canvasRef}
        width={dimensions.width}
        height={dimensions.height}
        className="block"
        style={{ touchAction: 'none' }}
      />
    </div>
  );
};

export default Canvas;
