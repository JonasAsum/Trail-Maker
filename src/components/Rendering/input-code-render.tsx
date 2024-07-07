import React, { useState, useEffect, useCallback, RefObject } from 'react';
import GridOverlay from '../Trail/grid-overlay';
import ElementDetection from './element-detect';

interface CodeRendererProps {
  initialCode: string;
  isFullScreen: boolean;
  setIsFullScreen: React.Dispatch<React.SetStateAction<boolean>>;
  containerRef: RefObject<HTMLDivElement>;
  contentRef: RefObject<HTMLDivElement>;
}

const gridSize = { width: 10, height: 10 };

function debounce(func: Function, wait: number) {
  let timeout: NodeJS.Timeout;
  return function executedFunction(...args: any[]) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

const CodeRenderer: React.FC<CodeRendererProps> = ({ 
  initialCode, 
  isFullScreen, 
  setIsFullScreen, 
  containerRef, 
  contentRef 
}) => {
  const [containerDimensions, setContainerDimensions] = useState({ width: 0, height: 0 });
  const [isDetectionMode, setIsDetectionMode] = useState(false);
  const [hoveredElement, setHoveredElement] = useState<HTMLElement | null>(null);

  const updateDimensions = useCallback(() => {
    if (contentRef.current) {
      const contentRect = contentRef.current.getBoundingClientRect();
      setContainerDimensions({ width: contentRect.width, height: contentRect.height });
    }
  }, [contentRef]);

  const debouncedUpdateDimensions = useCallback(debounce(updateDimensions, 100), [updateDimensions]);

  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.innerHTML = initialCode;
      debouncedUpdateDimensions();
      const resizeObserver = new ResizeObserver(debouncedUpdateDimensions);
      resizeObserver.observe(contentRef.current);
      return () => resizeObserver.disconnect();
    }
  }, [initialCode, debouncedUpdateDimensions, contentRef]);

  useEffect(() => {
    debouncedUpdateDimensions();
  }, [isFullScreen, debouncedUpdateDimensions]);

  const handleElementClick = (element: HTMLElement) => {
    console.log(`Clicked element: ${element.tagName.toLowerCase()}`);
  };

  const handleElementHover = (element: HTMLElement | null) => {
    setHoveredElement(element);
  };

  const toggleDetectionMode = () => {
    setIsDetectionMode(!isDetectionMode);
    console.log(`Element detection mode: ${!isDetectionMode ? 'ON' : 'OFF'}`);
  };

  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
  };

  return (
    <div className="relative" style={{ height: isFullScreen ? '100vh' : '600px', overflow: 'hidden' }}>
      <div
        ref={containerRef}
        className="rendered-content w-full h-full overflow-auto"
        style={{ cursor: isDetectionMode ? 'pointer' : 'default' }}
      >
        <div ref={contentRef} className="relative">
          {hoveredElement && isDetectionMode && (
            <div
              style={{
                position: 'absolute',
                top: hoveredElement.offsetTop,
                left: hoveredElement.offsetLeft,
                width: hoveredElement.offsetWidth,
                height: hoveredElement.offsetHeight,
                border: '2px solid red',
                pointerEvents: 'none',
                zIndex: 9999,
              }}
            />
          )}
        </div>
      </div>
      <GridOverlay
        gridSize={gridSize}
        containerWidth={containerDimensions.width}
        containerHeight={containerDimensions.height}
        color="rgba(0, 0, 255, 0.2)"
        targetClass="grid-area"
        containerRef={containerRef}
        contentRef={contentRef}
        isFullScreen={isFullScreen}
      />
      <div className="fixed bottom-32 right-4 flex z-50">
        <button
          onClick={toggleFullScreen}
          className="px-4 py-2 bg-green-500 text-white rounded mr-2"
        >
          {isFullScreen ? 'Exit Full Screen' : 'Full Screen'}
        </button>
        <button
          onClick={toggleDetectionMode}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          {isDetectionMode ? 'Turn Off' : 'Turn On'} Element Detection
        </button>
      </div>
      <ElementDetection
        isDetectionMode={isDetectionMode}
        onElementClick={handleElementClick}
        onElementHover={handleElementHover}
        containerRef={containerRef}
        contentRef={contentRef}
      />
    </div>
  );
};

export default CodeRenderer;