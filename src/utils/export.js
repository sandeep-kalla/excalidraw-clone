import rough from 'roughjs';

/**
 * Export utilities for canvas
 */

/**
 * Export canvas as PNG image
 * @param {Object} canvas - Canvas object with elements
 * @param {string} filename - Filename for download
 */
export const exportToPNG = (canvas, filename = 'canvas.png') => {
  try {
    // Create a temporary canvas element
    const tempCanvas = document.createElement('canvas');
    const ctx = tempCanvas.getContext('2d');
    
    // Calculate canvas bounds based on elements
    const bounds = getCanvasBounds(canvas.elements);
    
    // Set canvas size with some padding
    const padding = 20;
    tempCanvas.width = bounds.width + padding * 2;
    tempCanvas.height = bounds.height + padding * 2;
    
    // Fill with white background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
    
    // Render all elements using Rough.js
    const rc = rough.canvas(tempCanvas);
    
    canvas.elements.forEach(element => {
      const x = element.x - bounds.minX + padding;
      const y = element.y - bounds.minY + padding;
      
      ctx.globalAlpha = element.opacity / 100;
      
      switch (element.type) {
        case 'rectangle':
          rc.rectangle(x, y, element.width, element.height, {
            stroke: element.stroke,
            fill: element.fill,
            strokeWidth: element.strokeWidth,
            roughness: element.roughness,
            seed: element.seed,
          });
          break;
          
        case 'ellipse':
          rc.ellipse(
            x + element.width / 2,
            y + element.height / 2,
            element.width,
            element.height,
            {
              stroke: element.stroke,
              fill: element.fill,
              strokeWidth: element.strokeWidth,
              roughness: element.roughness,
              seed: element.seed,
            }
          );
          break;
          
        case 'arrow':
          if (element.points && element.points.length > 0) {
            const adjustedPoints = element.points.map(p => {
              const px = typeof p === 'object' && 'x' in p ? p.x : p[0];
              const py = typeof p === 'object' && 'y' in p ? p.y : p[1];
              return [px + x, py + y];
            });
            rc.curve(adjustedPoints, {
              stroke: element.stroke,
              strokeWidth: element.strokeWidth,
              roughness: element.roughness,
              seed: element.seed,
            });
          }
          break;
          
        case 'draw':
        case 'freedraw':
          if (element.points && element.points.length > 1) {
            // Use smooth canvas rendering for draw elements (same as renderer.js)
            ctx.save();
            ctx.strokeStyle = element.stroke;
            ctx.lineWidth = element.strokeWidth;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            ctx.globalAlpha = (element.opacity || 100) / 100;
            
            ctx.beginPath();
            const firstPoint = element.points[0];
            const firstX = (typeof firstPoint === 'object' && 'x' in firstPoint ? firstPoint.x : firstPoint[0]) - bounds.minX + padding;
            const firstY = (typeof firstPoint === 'object' && 'y' in firstPoint ? firstPoint.y : firstPoint[1]) - bounds.minY + padding;
            ctx.moveTo(firstX, firstY);
            
            // Use quadratic curves for smooth lines
            for (let i = 1; i < element.points.length - 1; i++) {
              const p = element.points[i];
              const pNext = element.points[i + 1];
              
              const px = (typeof p === 'object' && 'x' in p ? p.x : p[0]) - bounds.minX + padding;
              const py = (typeof p === 'object' && 'y' in p ? p.y : p[1]) - bounds.minY + padding;
              const pxNext = (typeof pNext === 'object' && 'x' in pNext ? pNext.x : pNext[0]) - bounds.minX + padding;
              const pyNext = (typeof pNext === 'object' && 'y' in pNext ? pNext.y : pNext[1]) - bounds.minY + padding;
              
              const xc = (px + pxNext) / 2;
              const yc = (py + pyNext) / 2;
              ctx.quadraticCurveTo(px, py, xc, yc);
            }
            
            // Draw the last segment
            if (element.points.length > 1) {
              const lastPoint = element.points[element.points.length - 1];
              const secondLastPoint = element.points[element.points.length - 2];
              
              const lastX = (typeof lastPoint === 'object' && 'x' in lastPoint ? lastPoint.x : lastPoint[0]) - bounds.minX + padding;
              const lastY = (typeof lastPoint === 'object' && 'y' in lastPoint ? lastPoint.y : lastPoint[1]) - bounds.minY + padding;
              const secondLastX = (typeof secondLastPoint === 'object' && 'x' in secondLastPoint ? secondLastPoint.x : secondLastPoint[0]) - bounds.minX + padding;
              const secondLastY = (typeof secondLastPoint === 'object' && 'y' in secondLastPoint ? secondLastPoint.y : secondLastPoint[1]) - bounds.minY + padding;
              
              ctx.quadraticCurveTo(secondLastX, secondLastY, lastX, lastY);
            }
            
            ctx.stroke();
            ctx.restore();
            ctx.globalAlpha = 1;
          }
          break;
          
        case 'text':
          ctx.font = `${element.fontSize}px ${element.fontFamily}`;
          ctx.fillStyle = element.stroke;
          ctx.fillText(element.text || '', x, y + element.fontSize);
          break;
      }
      
      ctx.globalAlpha = 1;
    });
    
    // Convert to blob and download
    tempCanvas.toBlob((blob) => {
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.download = filename;
      link.href = url;
      link.click();
      URL.revokeObjectURL(url);
    }, 'image/png');
    
    return true;
  } catch (error) {
    console.error('Error exporting to PNG:', error);
    return false;
  }
};

/**
 * Export canvas as SVG
 * @param {Object} canvas - Canvas object with elements
 * @param {string} filename - Filename for download
 */
export const exportToSVG = (canvas, filename = 'canvas.svg') => {
  try {
    const bounds = getCanvasBounds(canvas.elements);
    const padding = 20;
    const width = bounds.width + padding * 2;
    const height = bounds.height + padding * 2;
    
    // Create SVG content
    let svgContent = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <rect width="100%" height="100%" fill="white"/>
  <g id="canvas-elements">
`;
    
    // Create temporary SVG element for Rough.js
    const tempSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    const rc = rough.svg(tempSvg);
    
    canvas.elements.forEach(element => {
      const x = element.x - bounds.minX + padding;
      const y = element.y - bounds.minY + padding;
      
      let node;
      
      switch (element.type) {
        case 'rectangle':
          node = rc.rectangle(x, y, element.width, element.height, {
            stroke: element.stroke,
            fill: element.fill,
            strokeWidth: element.strokeWidth,
            roughness: element.roughness,
            seed: element.seed,
          });
          break;
          
        case 'ellipse':
          node = rc.ellipse(
            x + element.width / 2,
            y + element.height / 2,
            element.width,
            element.height,
            {
              stroke: element.stroke,
              fill: element.fill,
              strokeWidth: element.strokeWidth,
              roughness: element.roughness,
              seed: element.seed,
            }
          );
          break;
          
        case 'arrow':
          if (element.points && element.points.length > 0) {
            const adjustedPoints = element.points.map(p => {
              const px = typeof p === 'object' && 'x' in p ? p.x : p[0];
              const py = typeof p === 'object' && 'y' in p ? p.y : p[1];
              return [px + x, py + y];
            });
            node = rc.curve(adjustedPoints, {
              stroke: element.stroke,
              strokeWidth: element.strokeWidth,
              roughness: element.roughness,
              seed: element.seed,
            });
          }
          break;
          
        case 'draw':
        case 'freedraw':
          if (element.points && element.points.length > 1) {
            // Create smooth SVG path for draw elements
            let pathData = '';
            
            const firstPoint = element.points[0];
            const firstX = (typeof firstPoint === 'object' && 'x' in firstPoint ? firstPoint.x : firstPoint[0]) - bounds.minX + padding;
            const firstY = (typeof firstPoint === 'object' && 'y' in firstPoint ? firstPoint.y : firstPoint[1]) - bounds.minY + padding;
            pathData = `M ${firstX} ${firstY}`;
            
            // Use quadratic curves for smooth lines
            for (let i = 1; i < element.points.length - 1; i++) {
              const p = element.points[i];
              const pNext = element.points[i + 1];
              
              const px = (typeof p === 'object' && 'x' in p ? p.x : p[0]) - bounds.minX + padding;
              const py = (typeof p === 'object' && 'y' in p ? p.y : p[1]) - bounds.minY + padding;
              const pxNext = (typeof pNext === 'object' && 'x' in pNext ? pNext.x : pNext[0]) - bounds.minX + padding;
              const pyNext = (typeof pNext === 'object' && 'y' in pNext ? pNext.y : pNext[1]) - bounds.minY + padding;
              
              const xc = (px + pxNext) / 2;
              const yc = (py + pyNext) / 2;
              pathData += ` Q ${px} ${py} ${xc} ${yc}`;
            }
            
            // Add the last segment
            if (element.points.length > 1) {
              const lastPoint = element.points[element.points.length - 1];
              const secondLastPoint = element.points[element.points.length - 2];
              
              const lastX = (typeof lastPoint === 'object' && 'x' in lastPoint ? lastPoint.x : lastPoint[0]) - bounds.minX + padding;
              const lastY = (typeof lastPoint === 'object' && 'y' in lastPoint ? lastPoint.y : lastPoint[1]) - bounds.minY + padding;
              const secondLastX = (typeof secondLastPoint === 'object' && 'x' in secondLastPoint ? secondLastPoint.x : secondLastPoint[0]) - bounds.minX + padding;
              const secondLastY = (typeof secondLastPoint === 'object' && 'y' in secondLastPoint ? secondLastPoint.y : secondLastPoint[1]) - bounds.minY + padding;
              
              pathData += ` Q ${secondLastX} ${secondLastY} ${lastX} ${lastY}`;
            }
            
            node = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            node.setAttribute('d', pathData);
            node.setAttribute('stroke', element.stroke);
            node.setAttribute('stroke-width', element.strokeWidth);
            node.setAttribute('stroke-linecap', 'round');
            node.setAttribute('stroke-linejoin', 'round');
            node.setAttribute('fill', 'none');
          }
          break;
          
        case 'text':
          node = document.createElementNS('http://www.w3.org/2000/svg', 'text');
          node.setAttribute('x', x);
          node.setAttribute('y', y + element.fontSize);
          node.setAttribute('font-size', element.fontSize);
          node.setAttribute('font-family', element.fontFamily);
          node.setAttribute('fill', element.stroke);
          node.textContent = element.text || '';
          break;
      }
      
      if (node) {
        if (element.opacity !== 100) {
          node.setAttribute('opacity', element.opacity / 100);
        }
        svgContent += '    ' + node.outerHTML + '\n';
      }
    });
    
    svgContent += `  </g>
</svg>`;
    
    // Download SVG
    const blob = new Blob([svgContent], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = filename;
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
    
    return true;
  } catch (error) {
    console.error('Error exporting to SVG:', error);
    return false;
  }
};

/**
 * Export canvas as JSON
 * @param {Object} canvas - Canvas object
 * @param {string} filename - Filename for download
 */
export const exportToJSON = (canvas, filename = 'canvas.json') => {
  try {
    const jsonString = JSON.stringify(canvas, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = filename;
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
    
    return true;
  } catch (error) {
    console.error('Error exporting to JSON:', error);
    return false;
  }
};

/**
 * Import canvas from JSON file
 * @param {File} file - JSON file to import
 * @returns {Promise<Object|null>} Parsed canvas or null
 */
export const importFromJSON = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const canvas = JSON.parse(e.target.result);
        
        // Validate basic canvas structure
        if (!canvas.name || !Array.isArray(canvas.elements)) {
          throw new Error('Invalid canvas structure');
        }
        
        // Generate new ID and timestamps
        const now = new Date().toISOString();
        const importedCanvas = {
          ...canvas,
          id: `canvas_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          name: `${canvas.name} (Imported)`,
          createdAt: now,
          updatedAt: now,
        };
        
        resolve(importedCanvas);
      } catch (error) {
        console.error('Error parsing JSON:', error);
        reject(error);
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Error reading file'));
    };
    
    reader.readAsText(file);
  });
};

/**
 * Copy canvas data to clipboard as JSON
 * @param {Object} canvas - Canvas object
 */
export const copyToClipboard = async (canvas) => {
  try {
    const jsonString = JSON.stringify(canvas, null, 2);
    await navigator.clipboard.writeText(jsonString);
    return true;
  } catch (error) {
    console.error('Error copying to clipboard:', error);
    return false;
  }
};

/**
 * Calculate bounds of all elements
 * @param {Array} elements - Array of elements
 * @returns {Object} Bounds with minX, minY, maxX, maxY, width, height
 */
const getCanvasBounds = (elements) => {
  if (elements.length === 0) {
    return { minX: 0, minY: 0, maxX: 100, maxY: 100, width: 100, height: 100 };
  }
  
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  
  elements.forEach(element => {
    minX = Math.min(minX, element.x);
    minY = Math.min(minY, element.y);
    maxX = Math.max(maxX, element.x + element.width);
    maxY = Math.max(maxY, element.y + element.height);
  });
  
  return {
    minX,
    minY,
    maxX,
    maxY,
    width: maxX - minX,
    height: maxY - minY,
  };
};
