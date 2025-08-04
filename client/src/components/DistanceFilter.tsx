import React from 'react';
import { MapPin } from 'lucide-react';

interface DistanceFilterProps {
  maxDistance: number;
  onDistanceChange: (distance: number) => void;
  userLocation?: { latitude: number; longitude: number };
}

const DistanceFilter: React.FC<DistanceFilterProps> = ({ 
  maxDistance, 
  onDistanceChange, 
  userLocation 
}) => {
  const distanceOptions = [
    { value: 1, label: '1 mile' },
    { value: 5, label: '5 miles' },
    { value: 10, label: '10 miles' },
    { value: 25, label: '25 miles' },
    { value: 50, label: '50 miles' },
    { value: 100, label: '100 miles' }
  ];

  if (!userLocation) {
    return (
      <div className="bg-gray-800 rounded-lg p-4">
        <div className="flex items-center text-gray-400">
          <MapPin className="h-5 w-5 mr-2" />
          <span>Set your location to filter by distance</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-lg p-4">
      <div className="flex items-center mb-3">
        <MapPin className="h-5 w-5 text-blue-500 mr-2" />
        <h3 className="text-white font-medium">Distance Filter</h3>
      </div>
      
      <div className="space-y-2">
        {distanceOptions.map((option) => (
          <label key={option.value} className="flex items-center cursor-pointer">
            <input
              type="radio"
              name="distance"
              value={option.value}
              checked={maxDistance === option.value}
              onChange={(e) => onDistanceChange(Number(e.target.value))}
              className="mr-3 text-blue-500 focus:ring-blue-500"
            />
            <span className="text-white">{option.label}</span>
          </label>
        ))}
      </div>
      
      <div className="mt-3 pt-3 border-t border-gray-700">
        <p className="text-gray-400 text-sm">
          Showing robots within {maxDistance} mile{maxDistance !== 1 ? 's' : ''} of your location
        </p>
      </div>
    </div>
  );
};

export default DistanceFilter; 