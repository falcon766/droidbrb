import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { 
  Upload,
  MapPin,
  DollarSign,
  ArrowLeft,
  Plus,
  X
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { CreateRobotForm } from '../types';
import { robotService } from '../services/robotService';
import { distanceService } from '../services/distanceService';
import { searchService } from '../services/searchService';
import toast from 'react-hot-toast';

const CreateRobotPage: React.FC = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [features, setFeatures] = useState<string[]>([]);
  const [newFeature, setNewFeature] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [locationValue, setLocationValue] = useState('');
  const [locationSuggestions, setLocationSuggestions] = useState<any[]>([]);
  const [showLocationSuggestions, setShowLocationSuggestions] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<string>('');

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<CreateRobotForm>();

  const categories = [
    'Educational',
    'Industrial',
    'Service',
    'Hobby',
    'Other'
  ];

  const addFeature = () => {
    if (newFeature.trim() && !features.includes(newFeature.trim())) {
      setFeatures([...features, newFeature.trim()]);
      setNewFeature('');
    }
  };

  const removeFeature = (index: number) => {
    setFeatures(features.filter((_, i) => i !== index));
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);

    // Validate file types and sizes
    const validFiles = files.filter(file => {
      if (!file.type.startsWith('image/')) {
        toast.error(`"${file.name}" is not an image file`);
        return false;
      }
      if (file.size > 10 * 1024 * 1024) {
        toast.error(`"${file.name}" exceeds 10MB limit`);
        return false;
      }
      return true;
    });

    const newTotal = images.length + validFiles.length;
    if (newTotal > 10) {
      toast.error('Maximum 10 images allowed per robot');
      return;
    }

    setImages([...images, ...validFiles]);
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleLocationChange = async (value: string) => {
    setLocationValue(value);
    setSelectedLocation(''); // Clear selection when typing
    
    if (value.length >= 3) {
      try {
        const suggestions = await searchService.getLocationSuggestions(value);
        setLocationSuggestions(suggestions);
        setShowLocationSuggestions(true);
      } catch (error) {
        console.error('Error fetching location suggestions:', error);
        setLocationSuggestions([]);
        setShowLocationSuggestions(false);
      }
    } else {
      setLocationSuggestions([]);
      setShowLocationSuggestions(false);
    }
  };

  const handleLocationSelect = (suggestion: any) => {
    const locationText = suggestion.description;
    
    // Check if the location is specific enough (should have state/country or be a well-known city)
    const hasStateOrCountry = locationText.includes(',') || locationText.includes('USA') || locationText.includes('United States');
    
    // Allow well-known cities even without state/country if they're from Google Places
    const isWellKnownCity = locationText.length > 5 && (
      locationText.includes('City') || 
      locationText.includes('Town') || 
      locationText.includes('Village') ||
      locationText.includes('County')
    );
    
    if (!hasStateOrCountry && !isWellKnownCity) {
      toast.error('Please select a more specific location (e.g., "Apex, NC" instead of just "Apex")');
      return;
    }
    
    setLocationValue(locationText);
    setSelectedLocation(locationText);
    setShowLocationSuggestions(false);
    setLocationSuggestions([]);
    
    // Show success message
    toast.success(`Location selected: ${locationText}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // Prevent form submission on Enter
    }
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.location-input-container')) {
        setShowLocationSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const onSubmit = async (data: CreateRobotForm) => {
    if (!currentUser) {
      toast.error('You must be logged in to create a robot listing');
      return;
    }

    // Validate that a location was selected from suggestions
    if (!selectedLocation) {
      toast.error('Please select a location from the suggestions to ensure accurate GPS coordinates');
      return;
    }

    setIsLoading(true);
    try {
      // Use the selected location instead of the form data
      const finalLocation = selectedLocation;
      
      // Auto-geocode the location to get coordinates
      let latitude: number | undefined;
      let longitude: number | undefined;
      
      try {
        const coordinates = await distanceService.getCoordinatesFromAddress(finalLocation);
        if (coordinates) {
          latitude = coordinates.latitude;
          longitude = coordinates.longitude;
          console.log('📍 Auto-geocoded location:', finalLocation, '→', coordinates);
        } else {
          console.log('⚠️ Could not geocode location:', finalLocation);
          toast.error(`Could not determine GPS coordinates for "${finalLocation}". This usually means the location is too generic. Please select a more specific location (e.g., "Apex, NC" instead of "Apex").`);
          setIsLoading(false);
          return;
        }
      } catch (geocodeError) {
        console.error('Geocoding error:', geocodeError);
        toast.error(`Geocoding failed for "${finalLocation}". Please try a different, more specific location.`);
        setIsLoading(false);
        return;
      }

      const robotData = {
        ...data,
        location: finalLocation, // Use the validated location
        features,
        latitude,
        longitude,
        specifications: {
          weight: data.specifications?.weight || '',
          dimensions: data.specifications?.dimensions || '',
          batteryLife: data.specifications?.batteryLife || '',
          connectivity: data.specifications?.connectivity || '',
        }
      };

      await robotService.createRobot(robotData, currentUser.uid, images);
      toast.success('Robot listing created successfully with location coordinates!');
      navigate('/dashboard');
    } catch (error: any) {
      toast.error(error.message || 'Failed to create robot listing');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-robot-dark">
      {/* Header */}
      <div className="bg-robot-slate border-b border-primary-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link 
            to="/dashboard" 
            className="inline-flex items-center text-primary-400 hover:text-primary-300 transition-colors mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-white">List Your Robot</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-robot-slate rounded-lg p-8"
        >
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Basic Information */}
            <div>
              <h2 className="text-xl font-semibold text-white mb-6">Basic Information</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-white font-medium mb-2">
                    Robot Name *
                  </label>
                  <input
                    type="text"
                    {...register('name', { required: 'Robot name is required' })}
                    className="w-full bg-robot-steel text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="e.g., Loona Pet Robot"
                  />
                  {errors.name && (
                    <p className="text-red-400 text-sm mt-1">{errors.name.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-white font-medium mb-2">
                    Category *
                  </label>
                  <select
                    {...register('category', { required: 'Category is required' })}
                    className="w-full bg-robot-steel text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="">Select a category</option>
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                  {errors.category && (
                    <p className="text-red-400 text-sm mt-1">{errors.category.message}</p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-white font-medium mb-2">
                    Description *
                  </label>
                  <textarea
                    {...register('description', { required: 'Description is required' })}
                    rows={4}
                    className="w-full bg-robot-steel text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Describe your robot, its capabilities, and what makes it special..."
                  />
                  {errors.description && (
                    <p className="text-red-400 text-sm mt-1">{errors.description.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Pricing & Location */}
            <div>
              <h2 className="text-xl font-semibold text-white mb-6">Pricing & Location</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-white font-medium mb-2">
                    Daily Rate ($) *
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="number"
                      {...register('price', { 
                        required: 'Price is required',
                        min: { value: 1, message: 'Price must be at least $1' }
                      })}
                      className="w-full bg-robot-steel text-white rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="25"
                    />
                  </div>
                  {errors.price && (
                    <p className="text-red-400 text-sm mt-1">{errors.price.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-white font-medium mb-2">
                    Location *
                  </label>
                  <div className="relative location-input-container">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      value={locationValue}
                      onChange={(e) => handleLocationChange(e.target.value)}
                      onKeyDown={handleKeyDown}
                      className="w-full bg-robot-steel text-white rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="Start typing city, state, or zipcode..."
                    />
                    
                    {/* Location Suggestions Dropdown */}
                    {showLocationSuggestions && locationSuggestions.length > 0 && (
                      <div className="absolute top-full left-0 right-0 bg-robot-steel border border-primary-900/30 rounded-lg mt-1 max-h-60 overflow-y-auto z-50">
                        {locationSuggestions.map((suggestion, index) => (
                          <button
                            key={index}
                            type="button"
                            onClick={() => handleLocationSelect(suggestion)}
                            className="w-full text-left px-4 py-3 text-white hover:bg-robot-steel transition-colors border-b border-primary-900/30 last:border-b-0"
                          >
                            <div className="font-medium">{suggestion.structured_formatting.main_text}</div>
                            <div className="text-sm text-gray-300">{suggestion.structured_formatting.secondary_text}</div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  {selectedLocation && (
                    <p className="text-primary-400 text-sm mt-1">
                      ✅ Location selected: {selectedLocation}
                    </p>
                  )}
                  
                  {!selectedLocation && locationValue && (
                    <p className="text-gray-400 text-sm mt-1">
                      ⚠️ Please select a location from the suggestions above
                    </p>
                  )}
                  
                  <p className="text-primary-400 text-sm mt-1">
                    📍 GPS coordinates will be automatically added for distance-based search
                  </p>
                  <p className="text-gray-400 text-sm mt-1">
                    💡 Tip: Select specific locations like "Apex, NC" instead of just "Apex" for better accuracy
                  </p>
                  
                  {errors.location && (
                    <p className="text-red-400 text-sm mt-1">{errors.location.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Availability */}
            <div>
              <h2 className="text-xl font-semibold text-white mb-6">Availability</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-white font-medium mb-2">
                    Minimum Rental (days)
                  </label>
                  <input
                    type="number"
                    {...register('minRental', { min: 1 })}
                    className="w-full bg-robot-steel text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="1"
                  />
                </div>

                <div>
                  <label className="block text-white font-medium mb-2">
                    Maximum Rental (days)
                  </label>
                  <input
                    type="number"
                    {...register('maxRental', { min: 1 })}
                    className="w-full bg-robot-steel text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="30"
                  />
                </div>

                <div>
                  <label className="block text-white font-medium mb-2">
                    Pickup Time
                  </label>
                  <input
                    type="text"
                    {...register('pickupTime')}
                    className="w-full bg-robot-steel text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="9:00 AM - 6:00 PM"
                  />
                </div>

                <div>
                  <label className="block text-white font-medium mb-2">
                    Return Time
                  </label>
                  <input
                    type="text"
                    {...register('returnTime')}
                    className="w-full bg-robot-steel text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="9:00 AM - 6:00 PM"
                  />
                </div>
              </div>
            </div>

            {/* Features */}
            <div>
              <h2 className="text-xl font-semibold text-white mb-6">Features</h2>
              <div className="space-y-4">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newFeature}
                    onChange={(e) => setNewFeature(e.target.value)}
                    className="flex-1 bg-robot-steel text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Add a feature (e.g., Voice Recognition)"
                  />
                  <button
                    type="button"
                    onClick={addFeature}
                    className="bg-primary-500 text-white px-4 py-3 rounded-lg hover:bg-primary-600 transition-colors"
                  >
                    <Plus className="h-5 w-5" />
                  </button>
                </div>
                {features.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {features.map((feature, index) => (
                      <span
                        key={index}
                        className="bg-robot-steel text-white px-3 py-1 rounded-lg flex items-center gap-2"
                      >
                        {feature}
                        <button
                          type="button"
                          onClick={() => removeFeature(index)}
                          className="text-gray-400 hover:text-white"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Images */}
            <div>
              <h2 className="text-xl font-semibold text-white mb-6">Images</h2>
              <div className="space-y-4">
                <div className="border-2 border-dashed border-primary-900/30 rounded-lg p-8 text-center">
                  <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-300 mb-2">Upload robot images</p>
                  <p className="text-gray-500 text-sm mb-4">PNG, JPG up to 10MB each</p>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                  />
                  <label
                    htmlFor="image-upload"
                    className="bg-primary-500 text-white px-6 py-3 rounded-lg hover:bg-primary-600 transition-colors cursor-pointer"
                  >
                    Choose Files
                  </label>
                </div>
                {images.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {images.map((image, index) => (
                      <div key={index} className="relative">
                        <img
                          src={URL.createObjectURL(image)}
                          alt={`Robot ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isLoading}
                className="bg-primary-500 text-white px-8 py-3 rounded-lg hover:bg-primary-600 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Creating...' : 'List Robot'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default CreateRobotPage; 