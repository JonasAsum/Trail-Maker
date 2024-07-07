import React, { useState, useRef } from 'react';
import CodeRenderer from '../components/Rendering/input-code-render';
import TrailRenderer from '../components/Rendering/trail-render';
import CoordinateSetter from '../components/Rendering/coordination-setter';

interface Coordinate {
  x: number;
  y: number;
}

interface Coordinates {
  [key: string]: Coordinate;
}

function App() {
  const gridSize = { width: 10, height: 10 };
  const [isFullScreen, setIsFullScreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const [coordinates, setCoordinates] = useState<Coordinates>({
    point1: { x: 0.1, y: 0.1 },
    point2: { x: 0.9, y: 0.9 },
  });

  const initialCode = `
    <div class='relative bg-blue-900'>
      <div class='max-w-screen-xl mx-auto relative bg-red-500 grid-area '>
        <div class="flex flex-col justify-between h-[1000px] p-8 text-white z-20">
          <div>
            <h2 class="text-4xl font-bold mb-12 ml-8 mt-8">About Me</h2>
          </div>
          <div class="flex justify-end mb-16">
            <div class="bg-purple-800 bg-opacity-50 p-6 rounded-lg max-w-md ml-8">
              <p class="mb-4">Hi, I'm Jonas, a Front-End Developer specializing in React and TailwindCSS.</p>
              <p class="mb-4">I've worked on many projects, including an AI Automation Tool for eBay. User experience is my top priority.</p>
              <p class="mb-4">I have a strong focus on creating intuitive and high-performing web applications.</p>
              <p>Though I'm a full-stack developer, my strength lies in frontend development. I'm eager to bring my skills to a team that values innovation and user-centered design.</p>
            </div>
          </div>
        </div>
        <div>
          <div class="flex justify-start mb-16">
            <div class="bg-purple-800 bg-opacity-50 p-6 rounded-lg max-w-md ml-8">
              <p class="mb-4">Hi, I'm Jonas, a Front-End Developer specializing in React and TailwindCSS.</p>
              <p class="mb-4">I've worked on many projects, including an AI Automation Tool for eBay. User experience is my top priority.</p>
              <p class="mb-4">I have a strong focus on creating intuitive and high-performing web applications.</p>
              <p>Though I'm a full-stack developer, my strength lies in frontend development. I'm eager to bring my skills to a team that values innovation and user-centered design.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  return (
    <div className={`${isFullScreen ? 'fixed inset-0 z-50 bg-white' : 'container mx-auto p-4'} overflow-hidden`}>
      <h1 className="text-3xl font-bold mb-4">Interactive Code Renderer with Trail</h1>
      <div className={`flex flex-col md:flex-row ${isFullScreen ? 'h-full' : ''}`}>
        <div className={`${isFullScreen ? 'w-full h-full' : 'w-full md:w-2/3'} relative mb-4 md:mb-0 md:mr-4`}>
          <div className="relative h-full">
            <CodeRenderer 
              initialCode={initialCode} 
              isFullScreen={isFullScreen}
              setIsFullScreen={setIsFullScreen}
              containerRef={containerRef}
              contentRef={contentRef}
            />
            <TrailRenderer
              width={2}
              color="green"
              gridSize={gridSize}
              coordinates={coordinates} 
              setCoordinates={setCoordinates} 
              isFullScreen={isFullScreen}
              containerRef={containerRef}
              contentRef={contentRef}
            />
          </div>
        </div>
        {!isFullScreen && (
          <div className="w-full md:w-1/3">
            <CoordinateSetter coordinates={coordinates} setCoordinates={setCoordinates} />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;