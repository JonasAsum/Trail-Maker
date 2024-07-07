import React, { useState, useEffect, useRef, useCallback } from 'react';

interface Coordinate {
  x: number;
  y: number;
}

interface Coordinates {
  [key: string]: Coordinate;
}

interface TrailRendererProps {
  width?: number;
  color?: string;
  gridSize: { width: number; height: number };
  coordinates: Coordinates;
  setCoordinates: React.Dispatch<React.SetStateAction<Coordinates>>;
  isFullScreen: boolean;
  containerRef: React.RefObject<HTMLDivElement>;
  contentRef: React.RefObject<HTMLDivElement>;
}

const TrailRenderer: React.FC<TrailRendererProps> = ({
  width = 2,
  color = 'green',
  gridSize,
  coordinates,
  setCoordinates,
  isFullScreen,
  containerRef,
  contentRef
}) => {
  const [path, setPath] = useState('');
  const svgRef = useRef<SVGSVGElement>(null);
  const [debugInfo, setDebugInfo] = useState<string>('');
  const [svgDimensions, setSvgDimensions] = useState({ width: 0, height: 0, top: 0, left: 0 });
  const [scrollTop, setScrollTop] = useState(0);
  const [viewportHeight, setViewportHeight] = useState(0);

  const updateSvgDimensions = useCallback(() => {
    if (containerRef.current && contentRef.current) {
      const gridArea = contentRef.current.querySelector('.grid-area') as HTMLElement;
      if (gridArea) {
        const rect = gridArea.getBoundingClientRect();
        const containerRect = containerRef.current.getBoundingClientRect();
        setSvgDimensions({ 
          width: rect.width, 
          height: rect.height,
          top: rect.top - containerRect.top,
          left: rect.left - containerRect.left
        });
        setScrollTop(containerRef.current.scrollTop);
        setViewportHeight(containerRef.current.clientHeight);
      }
    }
  }, [containerRef, contentRef]);

  useEffect(() => {
    updateSvgDimensions();
    window.addEventListener('resize', updateSvgDimensions);
    if (containerRef.current) {
      containerRef.current.addEventListener('scroll', updateSvgDimensions);
    }
    return () => {
      window.removeEventListener('resize', updateSvgDimensions);
      if (containerRef.current) {
        containerRef.current.removeEventListener('scroll', updateSvgDimensions);
      }
    };
  }, [updateSvgDimensions, containerRef]);

  useEffect(() => {
    updateSvgDimensions();
  }, [isFullScreen, updateSvgDimensions]);

  const calculatePosition = useCallback((point: Coordinate): Coordinate => {
    return {
      x: point.x * svgDimensions.width,
      y: point.y * svgDimensions.height
    };
  }, [svgDimensions]);

  const updatePath = useCallback(() => {
    const points = Object.values(coordinates).map(point => calculatePosition(point));
    
    if (points.length < 2) {
      setPath('');
      setDebugInfo('Not enough points to draw a path');
      return;
    }

    const newPath = points.reduce((path, point, index) => {
      return index === 0 ? `M${point.x},${point.y}` : `${path} L${point.x},${point.y}`;
    }, '');

    setPath(newPath);

    const debugPoints = Object.entries(coordinates).map(([key, point]) => 
      `${key}: (${point.x.toFixed(2)}, ${point.y.toFixed(2)})`
    ).join(', ');

    setDebugInfo(`Points: ${debugPoints}`);
  }, [coordinates, calculatePosition]);

  useEffect(() => {
    updatePath();
  }, [updatePath, coordinates, svgDimensions]);

  return (
    <div 
      className="absolute inset-0" 
      style={{pointerEvents: 'none'}}
    >
      <svg 
        ref={svgRef} 
        width={svgDimensions.width}
        height={svgDimensions.height}
        style={{
          position: 'absolute',
          top: svgDimensions.top,
          left: svgDimensions.left,
          pointerEvents: 'none'
        }}
      >
        <defs>
          <clipPath id="viewportClip">
            <rect x="0" y={scrollTop} width={svgDimensions.width} height={viewportHeight} />
          </clipPath>
        </defs>
        <g clipPath="url(#viewportClip)">
          <path
            d={path}
            fill="none"
            stroke={color}
            strokeWidth={width}
          />
        </g>
      </svg>
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        background: 'rgba(255,255,255,0.8)',
        padding: '5px',
        pointerEvents: 'none'
      }}>
        {debugInfo}
      </div>
    </div>
  );
};

export default TrailRenderer;