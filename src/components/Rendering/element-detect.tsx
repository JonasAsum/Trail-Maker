import React, { useEffect, useCallback, RefObject } from 'react';

interface ElementDetectionProps {
  isDetectionMode: boolean;
  onElementClick: (element: HTMLElement) => void;
  onElementHover: (element: HTMLElement | null) => void;
  containerRef: RefObject<HTMLDivElement>;
  contentRef: RefObject<HTMLDivElement>;
}

const ElementDetection: React.FC<ElementDetectionProps> = ({
  isDetectionMode,
  onElementClick,
  onElementHover,
  containerRef,
  contentRef,
}) => {
  const handleElementClick = useCallback(
    (e: MouseEvent) => {
      if (!isDetectionMode) return;
      const clickedElement = e.target as HTMLElement;
      if (contentRef.current && contentRef.current.contains(clickedElement)) {
        onElementClick(clickedElement);
      }
    },
    [isDetectionMode, onElementClick, contentRef]
  );

  const handleMouseOver = useCallback(
    (e: MouseEvent) => {
      if (!isDetectionMode) return;
      const hoveredElement = e.target as HTMLElement;
      if (contentRef.current && contentRef.current.contains(hoveredElement)) {
        onElementHover(hoveredElement);
      }
    },
    [isDetectionMode, onElementHover, contentRef]
  );

  const handleMouseOut = useCallback(
    (e: MouseEvent) => {
      if (!isDetectionMode) return;
      const relatedTarget = e.relatedTarget as HTMLElement;
      if (contentRef.current && !contentRef.current.contains(relatedTarget)) {
        onElementHover(null);
      }
    },
    [isDetectionMode, onElementHover, contentRef]
  );

  useEffect(() => {
    const content = contentRef.current;
    if (content) {
      content.addEventListener('click', handleElementClick);
      content.addEventListener('mouseover', handleMouseOver);
      content.addEventListener('mouseout', handleMouseOut);

      return () => {
        content.removeEventListener('click', handleElementClick);
        content.removeEventListener('mouseover', handleMouseOver);
        content.removeEventListener('mouseout', handleMouseOut);
      };
    }
  }, [handleElementClick, handleMouseOver, handleMouseOut, contentRef]);

  return null;
};

export default ElementDetection;