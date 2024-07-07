import React, { useState } from 'react';

interface Coordinate {
  x: number;
  y: number;
}

interface Coordinates {
  [key: string]: Coordinate;
}

interface CoordinateSetterProps {
  coordinates: Coordinates;
  setCoordinates: React.Dispatch<React.SetStateAction<Coordinates>>;
}

const CoordinateSetter: React.FC<CoordinateSetterProps> = ({ coordinates, setCoordinates }) => {
  const [pointCount, setPointCount] = useState(Object.keys(coordinates).length);

  const handleInputChange = (pointName: string, axis: 'x' | 'y', value: string) => {
    const numValue = parseFloat(value);
    if (!isNaN(numValue)) {
      setCoordinates((prev: Coordinates) => ({
        ...prev,
        [pointName]: {
          ...prev[pointName],
          [axis]: numValue
        }
      }));
    }
  };

  const addNewPoint = () => {
    const newPointName = `point${pointCount + 1}`;
    setCoordinates((prev: Coordinates) => ({
      ...prev,
      [newPointName]: { x: 0.5, y: 0.5 }
    }));
    setPointCount(pointCount + 1);
  };

  const deletePoint = (pointName: string) => {
    setCoordinates((prev: Coordinates) => {
      const newCoordinates = { ...prev };
      delete newCoordinates[pointName];
      
      // Rename remaining points to ensure consistent naming
      const renamedCoordinates = Object.entries(newCoordinates).reduce((acc, [_, value], index) => {
        acc[`point${index + 1}`] = value;
        return acc;
      }, {} as Coordinates);

      return renamedCoordinates;
    });
    setPointCount(pointCount - 1);
  };

  return (
    <div className="p-4 bg-gray-100 rounded-lg">
      <h2 className="text-xl font-bold mb-4">Set Coordinates</h2>
      {Object.keys(coordinates).map((pointName, index) => (
        <div key={pointName} className="mb-4 p-2 border rounded">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-semibold">{`Point ${index + 1}`}</h3>
            {Object.keys(coordinates).length > 2 && (
              <button
                onClick={() => deletePoint(pointName)}
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded text-sm"
              >
                Delete
              </button>
            )}
          </div>
          <div className="flex items-center mb-2">
            <span className="w-8">X:</span>
            <input
              type="number"
              min="0"
              max="1"
              step="0.01"
              value={coordinates[pointName].x}
              onChange={(e) => handleInputChange(pointName, 'x', e.target.value)}
              className="w-20 px-2 py-1 mr-2 border rounded"
            />
            <span className="w-8">Y:</span>
            <input
              type="number"
              min="0"
              max="1"
              step="0.01"
              value={coordinates[pointName].y}
              onChange={(e) => handleInputChange(pointName, 'y', e.target.value)}
              className="w-20 px-2 py-1 border rounded"
            />
          </div>
        </div>
      ))}
      <button
        onClick={addNewPoint}
        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mr-2"
      >
        Add Point
      </button>
    </div>
  );
};

export default CoordinateSetter;