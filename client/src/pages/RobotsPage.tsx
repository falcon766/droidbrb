import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Bot, 
  Search, 
  MapPin, 
  Heart,
  DollarSign,
  SlidersHorizontal,
  Filter,
  X,
  Star,
  ArrowLeft
} from 'lucide-react';
import { searchService, SearchFilters } from '../services/searchService';
import { robotService } from '../services/robotService';
import { Robot } from '../types';
import { useAuth } from '../context/AuthContext';
import { distanceService, Coordinates } from '../services/distanceService';
import DistanceFilter from '../components/DistanceFilter';
import { useNavigate } from 'react-router-dom';

const RobotsPage: React.FC = () => {
  const { userProfile } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [robots, setRobots] = useState<Robot[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<SearchFilters>({});
  const [showFilters, setShowFilters] = useState(false);
  const [locationSuggestions, setLocationSuggestions] = useState<any[]>([]);
  const [showLocationSuggestions, setShowLocationSuggestions] = useState(false);
  const [maxDistance, setMaxDistance] = useState(25); // Default 25 miles
  const [userLocation, setUserLocation] = useState<Coordinates | null>(null);

  const categories = [
    { id: 'all', name: 'All Categories' },
    { id: 'educational', name: 'Educational' },
    { id: 'industrial', name: 'Industrial' },
    { id: 'service', name: 'Service' },
    { id: 'hobby', name: 'Hobby' },
    { id: 'other', name: 'Other' }
  ];

  useEffect(() => {
    // Initialize filters from URL parameters
    const query = searchParams.get('query') || '';
    const location = searchParams.get('location') || '';
    const category = searchParams.get('category') || '';
    const distance = searchParams.get('distance') || '';
    
    setFilters({
      query: query || undefined,
      location: location || undefined,
      category: category || undefined,
    });
    
    // Set distance filter if provided in URL
    if (distance) {
      setMaxDistance(Number(distance));
    }
  }, [searchParams]);

  // Load user location from current user
  useEffect(() => {
    if (userProfile?.latitude && userProfile?.longitude) {
      setUserLocation({
        latitude: userProfile.latitude,
        longitude: userProfile.longitude
      });
    }
  }, [userProfile]);

  useEffect(() => {
    fetchRobots();
  }, [filters]);

  const fetchRobots = async () => {
    setLoading(true);
    try {
      // Add user location and distance filter to search filters
      const searchFilters = {
        ...filters,
        userLatitude: userLocation?.latitude,
        userLongitude: userLocation?.longitude,
        maxDistance: maxDistance // Always pass maxDistance, let the search service handle it
      };
      
      console.log('🔍 Search filters:', searchFilters); // Debug log
      
      const results = await searchService.searchRobots(searchFilters);
      setRobots(results);
    } catch (error) {
      console.error('Error fetching robots:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (value: string) => {
    setFilters(prev => ({ ...prev, query: value }));
  };

  const handleLocationChange = async (value: string) => {
    setFilters(prev => ({ ...prev, location: value }));
    
    if (value.length >= 3) {
      const suggestions = await searchService.getLocationSuggestions(value);
      setLocationSuggestions(suggestions);
      setShowLocationSuggestions(true);
    } else {
      setLocationSuggestions([]);
      setShowLocationSuggestions(false);
    }
  };

  const handleLocationSelect = (suggestion: any) => {
    setFilters(prev => ({ ...prev, location: suggestion.description }));
    setShowLocationSuggestions(false);
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

  const handleCategoryChange = (category: string) => {
    setFilters(prev => ({ ...prev, category }));
  };

  const handlePriceChange = (min?: number, max?: number) => {
    setFilters(prev => ({ 
      ...prev, 
      minPrice: min, 
      maxPrice: max 
    }));
  };

  const clearFilters = () => {
    setFilters({});
  };

  const handleDistanceChange = (distance: number) => {
    setMaxDistance(distance);
    // Refetch robots with new distance filter
    setTimeout(() => fetchRobots(), 100);
  };

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center">
              <button
                onClick={() => navigate(-1)}
                className="mr-4 p-3 text-white bg-gray-700 hover:bg-gray-600 transition-colors rounded-lg border-2 border-gray-500 hover:border-gray-400 shadow-lg"
                title="Go back - Updated"
              >
                <ArrowLeft className="h-8 w-8" />
              </button>
              <div>
                <h1 className="text-3xl font-bold text-white">Browse Robots - FORCE UPDATE</h1>
                <p className="text-gray-300 mt-2">Find the perfect robot for your needs</p>
              </div>
            </div>
            <Link
              to="/create-robot"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              List Your Robot
            </Link>
          </div>

          {/* Search Bar */}
          <div className="bg-gray-700 rounded-lg p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <div className="flex items-center bg-gray-600 rounded-lg px-4 py-3">
                  <Search className="h-5 w-5 text-gray-400 mr-3" />
                  <input
                    type="text"
                    placeholder="Search robots..."
                    value={filters.query || ''}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    className="bg-transparent text-white placeholder-gray-400 flex-1 outline-none"
                  />
                </div>
              </div>
              
              <div className="flex-1 relative location-input-container">
                <div className="flex items-center bg-gray-600 rounded-lg px-4 py-3">
                  <MapPin className="h-5 w-5 text-gray-400 mr-3" />
                  <input
                    type="text"
                    placeholder="City, State"
                    value={filters.location || ''}
                    onChange={(e) => handleLocationChange(e.target.value)}
                    onFocus={() => setShowLocationSuggestions(true)}
                    className="bg-transparent text-white placeholder-gray-400 flex-1 outline-none"
                  />
                </div>
                
                {/* Location Suggestions */}
                {showLocationSuggestions && locationSuggestions.length > 0 && (
                  <div className="absolute top-full left-0 right-0 bg-gray-700 rounded-lg mt-1 z-10 max-h-48 overflow-y-auto">
                    {locationSuggestions.map((suggestion) => (
                      <button
                        key={suggestion.place_id}
                        onClick={() => handleLocationSelect(suggestion)}
                        className="w-full text-left px-4 py-3 hover:bg-gray-600 text-white border-b border-gray-600 last:border-b-0"
                      >
                        <div className="font-medium">{suggestion.structured_formatting.main_text}</div>
                        <div className="text-sm text-gray-400">{suggestion.structured_formatting.secondary_text}</div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="bg-gray-600 text-white px-4 py-3 rounded-lg hover:bg-gray-500 transition-colors flex items-center ml-3"
              >
                <SlidersHorizontal className="h-5 w-5 mr-2" />
                Filters
              </button>
            </div>

            {/* Advanced Filters */}
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 pt-4 border-t border-gray-600"
              >
                <div className="grid md:grid-cols-3 gap-4">
                  {/* Distance Filter */}
                  <div>
                    <DistanceFilter
                      maxDistance={maxDistance}
                      onDistanceChange={handleDistanceChange}
                      userLocation={userLocation || undefined}
                    />
                  </div>
                  {/* Category Filter */}
                  <div>
                    <label className="block text-white text-sm font-medium mb-2">Category</label>
                    <select
                      value={filters.category || 'all'}
                      onChange={(e) => handleCategoryChange(e.target.value)}
                      className="w-full bg-gray-600 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {categories.map(category => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Price Range */}
                  <div>
                    <label className="block text-white text-sm font-medium mb-2">Price Range</label>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        placeholder="Min"
                        value={filters.minPrice || ''}
                        onChange={(e) => handlePriceChange(Number(e.target.value), filters.maxPrice)}
                        className="flex-1 bg-gray-600 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <input
                        type="number"
                        placeholder="Max"
                        value={filters.maxPrice || ''}
                        onChange={(e) => handlePriceChange(filters.minPrice, Number(e.target.value))}
                        className="flex-1 bg-gray-600 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  {/* Clear Filters */}
                  <div className="flex items-end">
                    <button
                      onClick={clearFilters}
                      className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center"
                    >
                      <X className="h-4 w-4 mr-2" />
                      Clear Filters
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Results Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-white">
            {loading ? 'Loading...' : `${robots.length} robot${robots.length === 1 ? '' : 's'} found`}
          </h2>
        </div>

        {/* Robots Grid */}
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="bg-gray-800 rounded-lg overflow-hidden">
                <div className="h-48 bg-gray-700 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                </div>
                <div className="p-6">
                  <div className="h-4 bg-gray-700 rounded mb-4"></div>
                  <div className="h-3 bg-gray-700 rounded mb-2"></div>
                  <div className="h-3 bg-gray-700 rounded mb-4"></div>
                  <div className="h-8 bg-gray-700 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        ) : robots.length === 0 ? (
          <div className="text-center py-12">
            <Bot className="h-16 w-16 text-gray-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No robots found</h3>
            <p className="text-gray-400 mb-6">
              {filters.location && maxDistance ? 
                `No robots found within ${maxDistance} mile${maxDistance !== 1 ? 's' : ''} of ${filters.location}. Try expanding your search radius or adjusting your location.` :
                'Try adjusting your search criteria or be the first to list a robot in your area!'
              }
            </p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => setMaxDistance(Math.min(maxDistance * 2, 100))}
                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
              >
                Expand Search Area
              </button>
              <Link
                to="/create-robot"
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                List Your Robot
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {robots.map((robot) => (
              <motion.div
                key={robot.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
                onClick={() => window.location.href = `/robots/${robot.id}`}
              >
                {/* Robot Image */}
                <div className="h-48 bg-gray-700 flex items-center justify-center">
                  {robot.images && robot.images.length > 0 ? (
                    <img 
                      src={robot.images[0]} 
                      alt={robot.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        target.nextElementSibling?.classList.remove('hidden');
                      }}
                    />
                  ) : null}
                  <Bot className={`h-16 w-16 text-gray-500 ${robot.images && robot.images.length > 0 ? 'hidden' : ''}`} />
                </div>
                
                {/* Robot Info */}
                <div className="p-6">
                  {/* Tags */}
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex gap-2">
                      <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded">
                        {robot.category}
                      </span>
                      <span className="bg-gray-600 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
                        <DollarSign className="h-3 w-3" />
                        ${robot.price}/day
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-400" />
                      <span className="text-white text-sm">{robot.rating.toFixed(1)}</span>
                    </div>
                  </div>

                  {/* Robot Details */}
                  <h3 className="text-lg font-semibold text-white mb-2">
                    {robot.name}
                  </h3>
                  <div className="flex items-center text-gray-400 text-sm mb-2">
                    <MapPin className="h-4 w-4 mr-1" />
                    {robot.location}
                  </div>
                  <p className="text-gray-300 text-sm mb-4 line-clamp-2">
                    {robot.description}
                  </p>

                  {/* Rent Button */}
                  <button className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors">
                    Available for Rent
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RobotsPage; 