import React, { useEffect, useState, RefObject, useCallback } from 'react';

interface GridOverlayProps {
  gridSize: {
    width: number;
    height: number;
  };
  containerWidth: number;
  containerHeight: number;
  color: string;
  targetClass: string;
  containerRef: RefObject<HTMLDivElement>;
  contentRef: RefObject<HTMLDivElement>;
  isFullScreen: boolean;
}

const GridOverlay: React.FC<GridOverlayProps> = ({
  gridSize,
  containerWidth,
  containerHeight,
  color,
  targetClass,
  containerRef,
  contentRef,
  isFullScreen
}) => {
  const [targetDimensions, setTargetDimensions] = useState({ width: 0, height: 0, top: 0, left: 0 });
  const [scrollTop, setScrollTop] = useState(0);

  const updateTargetDimensions = useCallback(() => {
    if (containerRef.current && contentRef.current) {
      const targetElement = contentRef.current.querySelector(`.${targetClass}`) as HTMLElement;
      if (targetElement) {
        const rect = targetElement.getBoundingClientRect();
        const containerRect = containerRef.current.getBoundingClientRect();
        setTargetDimensions({
          width: rect.width,
          height: rect.height,
          top: rect.top - containerRect.top + containerRef.current.scrollTop,
          left: rect.left - containerRect.left
        });
        setScrollTop(containerRef.current.scrollTop);
      }
    }
  }, [targetClass, containerRef, contentRef]);

  useEffect(() => {
    updateTargetDimensions();
    window.addEventListener('resize', updateTargetDimensions);
    if (containerRef.current) {
      containerRef.current.addEventListener('scroll', updateTargetDimensions);
    }
    return () => {
      window.removeEventListener('resize', updateTargetDimensions);
      if (containerRef.current) {
        containerRef.current.removeEventListener('scroll', updateTargetDimensions);
      }
    };
  }, [updateTargetDimensions, containerRef]);

  useEffect(() => {
    updateTargetDimensions();
  }, [isFullScreen, updateTargetDimensions]);

  if (targetDimensions.width === 0 || targetDimensions.height === 0) return null;

  const numColumns = Math.ceil(targetDimensions.width / gridSize.width);
  const numRows = Math.ceil(targetDimensions.height / gridSize.height);

  return (
    <div 
      style={{ 
        position: 'absolute', 
        top: targetDimensions.top - scrollTop,
        left: targetDimensions.left, 
        width: targetDimensions.width, 
        height: targetDimensions.height, 
        pointerEvents: 'none',
        overflow: 'hidden'
      }}
    >
      {Array.from({ length: numColumns + 1 }).map((_, index) => (
        <div
          key={`col-${index}`}
          style={{
            position: 'absolute',
            left: `${index * gridSize.width}px`,
            top: 0,
            bottom: 0,
            width: '1px',
            backgroundColor: color,
          }}
        />
      ))}
      {Array.from({ length: numRows + 1 }).map((_, index) => (
        <div
          key={`row-${index}`}
          style={{
            position: 'absolute',
            top: `${index * gridSize.height}px`,
            left: 0,
            right: 0,
            height: '1px',
            backgroundColor: color,
          }}
        />
      ))}
    </div>
  );
};

export default GridOverlay;