import React, { useState, useEffect } from 'react';
import { MapPin, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { distanceService, Coordinates } from '../services/distanceService';
import { searchService } from '../services/searchService';
import toast from 'react-hot-toast';

interface LocationSettingsProps {
  onLocationUpdate?: (coordinates: Coordinates) => void;
}

const LocationSettings: React.FC<LocationSettingsProps> = ({ onLocationUpdate }) => {
  const { userProfile } = useAuth();
  const [zipcode, setZipcode] = useState(userProfile?.zipcode || '');
  const [address, setAddress] = useState(userProfile?.address || '');
  const [showAddress, setShowAddress] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [coordinates, setCoordinates] = useState<Coordinates | null>(null);

  // Load existing coordinates if available
  useEffect(() => {
    if (userProfile?.latitude && userProfile?.longitude) {
      setCoordinates({
        latitude: userProfile.latitude,
        longitude: userProfile.longitude
      });
    }
  }, [userProfile]);

  const handleZipcodeChange = async (value: string) => {
    setZipcode(value);
    
    if (value.length === 5) {
      setIsLoading(true);
      try {
        const coords = await distanceService.getCoordinatesFromZipcode(value);
        if (coords) {
          setCoordinates(coords);
          onLocationUpdate?.(coords);
          toast.success('Location updated from zipcode!');
        } else {
          toast.error('Could not find coordinates for this zipcode');
        }
      } catch (error) {
        toast.error('Error updating location from zipcode');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleAddressChange = async (value: string) => {
    setAddress(value);
    
    if (value.length > 10) {
      setIsLoading(true);
      try {
        const coords = await distanceService.getCoordinatesFromAddress(value);
        if (coords) {
          setCoordinates(coords);
          onLocationUpdate?.(coords);
          toast.success('Location updated from address!');
        } else {
          toast.error('Could not find coordinates for this address');
        }
      } catch (error) {
        toast.error('Error updating location from address');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const saveLocation = async () => {
    if (!coordinates) {
      toast.error('Please set a valid location first');
      return;
    }

    setIsLoading(true);
    try {
      // Here you would typically save to your backend
      // For now, we'll just show a success message
      toast.success('Location saved successfully!');
    } catch (error) {
      toast.error('Error saving location');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-robot-slate rounded-lg p-6">
      <h3 className="text-xl font-semibold text-white mb-4">Location Settings</h3>
      
      <div className="space-y-4">
        {/* Zipcode Input */}
        <div>
          <label className="block text-white font-medium mb-2">
            Zipcode (Public)
          </label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={zipcode}
              onChange={(e) => handleZipcodeChange(e.target.value)}
              placeholder="Enter your zipcode"
              className="w-full bg-robot-steel text-white rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500"
              maxLength={5}
            />
          </div>
          <p className="text-gray-400 text-sm mt-1">
            This will be used to show your general area to other users
          </p>
        </div>

        {/* Address Input */}
        <div>
          <label className="block text-white font-medium mb-2 flex items-center">
            Street Address (Private)
            <button
              onClick={() => setShowAddress(!showAddress)}
              className="ml-2 text-gray-400 hover:text-white"
            >
              {showAddress ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type={showAddress ? "text" : "password"}
              value={address}
              onChange={(e) => handleAddressChange(e.target.value)}
              placeholder="Enter your street address"
              className="w-full bg-robot-steel text-white rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <p className="text-gray-400 text-sm mt-1">
            This is kept private and only used for distance calculations
          </p>
        </div>

        {/* Current Coordinates Display */}
        {coordinates && (
          <div className="bg-robot-steel rounded-lg p-4">
            <h4 className="text-white font-medium mb-2">Current Location</h4>
            <p className="text-gray-300 text-sm">
              Latitude: {coordinates.latitude.toFixed(6)}
            </p>
            <p className="text-gray-300 text-sm">
              Longitude: {coordinates.longitude.toFixed(6)}
            </p>
          </div>
        )}

        {/* Save Button */}
        <button
          onClick={saveLocation}
          disabled={isLoading || !coordinates}
          className="w-full bg-primary-500 text-white py-3 px-4 rounded-lg font-medium hover:bg-primary-600 disabled:bg-robot-steel disabled:cursor-not-allowed"
        >
          {isLoading ? 'Saving...' : 'Save Location'}
        </button>
      </div>
    </div>
  );
};

export default LocationSettings; 