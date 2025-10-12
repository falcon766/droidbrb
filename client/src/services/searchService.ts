import { robotService } from './robotService';
import { Robot } from '../types';
import { distanceService, Coordinates } from './distanceService';

export interface SearchFilters {
  query?: string;
  location?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  radius?: number; // in miles
  isAvailable?: boolean;
  userLatitude?: number;
  userLongitude?: number;
  maxDistance?: number; // in miles
}

export interface LocationSuggestion {
  place_id: string;
  description: string;
  structured_formatting: {
    main_text: string;
    secondary_text: string;
  };
}

export const searchService = {
  // Get location suggestions from Google Places API
  async getLocationSuggestions(input: string): Promise<LocationSuggestion[]> {
    if (!input || input.length < 3) return [];

    try {
      console.log('Calling Netlify function for real Google Places data');
      
      // Call our Netlify function which proxies the Google Places API
      const response = await fetch(`/.netlify/functions/places-autocomplete?input=${encodeURIComponent(input)}`);
      
      if (!response.ok) {
        console.error('Netlify function error:', response.status, response.statusText);
        return [];
      }
      
      const data = await response.json();
      console.log('Google Places API response:', data);
      
      // Handle the newer Places API response format
      if (data.suggestions && Array.isArray(data.suggestions)) {
        const suggestions = data.suggestions.map((suggestion: any) => {
          const placePrediction = suggestion.placePrediction;
          const structuredFormat = placePrediction.structuredFormat;
          
          // Extract the full text description
          const fullText = structuredFormat?.fullText?.text || '';
          const mainText = structuredFormat?.mainText?.text || '';
          const secondaryText = structuredFormat?.secondaryText?.text || '';
          
          return {
            place_id: placePrediction.placeId,
            description: fullText || `${mainText}, ${secondaryText}`.replace(/,\s*$/, ''),
            structured_formatting: {
              main_text: mainText,
              secondary_text: secondaryText
            }
          };
        });
        
        // Sort suggestions by relevance (exact matches first, then by length)
        return suggestions.sort((a: LocationSuggestion, b: LocationSuggestion) => {
          const aDesc = a.description.toLowerCase();
          const bDesc = b.description.toLowerCase();
          const inputLower = input.toLowerCase();
          
          // Exact match gets highest priority
          if (aDesc.startsWith(inputLower) && !bDesc.startsWith(inputLower)) return -1;
          if (bDesc.startsWith(inputLower) && !aDesc.startsWith(inputLower)) return 1;
          
          // Then sort by length (shorter descriptions first for more specific matches)
          return aDesc.length - bDesc.length;
        });
      }
      
      // Fallback to legacy format if needed
      if (data.predictions && Array.isArray(data.predictions)) {
        const suggestions = data.predictions.map((prediction: any) => ({
          place_id: prediction.place_id,
          description: prediction.description,
          structured_formatting: {
            main_text: prediction.structured_formatting?.main_text || '',
            secondary_text: prediction.structured_formatting?.secondary_text || ''
          }
        }));
        
        // Sort legacy format suggestions too
        return suggestions.sort((a: LocationSuggestion, b: LocationSuggestion) => {
          const aDesc = a.description.toLowerCase();
          const bDesc = b.description.toLowerCase();
          const inputLower = input.toLowerCase();
          
          if (aDesc.startsWith(inputLower) && !bDesc.startsWith(inputLower)) return -1;
          if (bDesc.startsWith(inputLower) && !aDesc.startsWith(inputLower)) return 1;
          
          return aDesc.length - bDesc.length;
        });
      }
      
      console.log('No suggestions found in response');
      return [];
    } catch (error) {
      console.error('Error fetching location suggestions:', error);
      return [];
    }
  },

  // Search robots with filters
  async searchRobots(filters: SearchFilters): Promise<Robot[]> {
    try {
      console.log('🔍 Starting robot search with filters:', filters);
      
      // Get all available robots first
      let robots = await robotService.getAvailableRobots();
      console.log(`📦 Found ${robots.length} total robots to filter`);

      // Apply filters
      if (filters.query) {
        const query = filters.query.toLowerCase();
        robots = robots.filter(robot => 
          robot.name.toLowerCase().includes(query) ||
          robot.description.toLowerCase().includes(query) ||
          robot.category.toLowerCase().includes(query)
        );
      }

      // Handle location-based distance filtering
      if (filters.location && filters.maxDistance) {
        console.log('🔍 Location and maxDistance filters found:', { location: filters.location, maxDistance: filters.maxDistance });
        
        // Geocode the location to get coordinates
        console.log('🔍 Attempting to geocode location:', filters.location);
        const coordinates = await distanceService.getCoordinatesFromAddress(filters.location);
        
        if (coordinates) {
          const userLocation: Coordinates = {
            latitude: coordinates.latitude,
            longitude: coordinates.longitude
          };

          console.log('📍 User location coordinates:', coordinates);
          console.log('🔍 Filtering robots within', filters.maxDistance, 'miles of', filters.location);
          console.log('📊 Total robots to filter:', robots.length);

          robots = robots.filter(robot => {
            if (!robot.latitude || !robot.longitude) {
              console.log('❌ Robot', robot.name, 'has no coordinates, skipping');
              return false; // Skip robots without coordinates
            }

            const robotLocation: Coordinates = {
              latitude: robot.latitude,
              longitude: robot.longitude
            };

            const distance = distanceService.calculateDistance(userLocation, robotLocation);
            const isWithinRange = distance <= filters.maxDistance!;
            
            console.log(`📍 ${robot.name}: ${distance.toFixed(1)} miles from ${filters.location} - ${isWithinRange ? '✅ IN RANGE' : '❌ OUT OF RANGE'}`);
            
            return isWithinRange;
          });

          // Sort by distance (closest first)
          robots.sort((a, b) => {
            if (!a.latitude || !a.longitude || !b.latitude || !b.longitude) return 0;
            
            const distanceA = distanceService.calculateDistance(userLocation, {
              latitude: a.latitude,
              longitude: a.longitude
            });
            const distanceB = distanceService.calculateDistance(userLocation, {
              latitude: b.latitude,
              longitude: b.longitude
            });
            
            return distanceA - distanceB;
          });

          console.log(`✅ Found ${robots.length} robots within ${filters.maxDistance} miles of ${filters.location}`);
        } else {
          console.log('❌ Could not geocode location:', filters.location);
          console.log('⚠️ Falling back to showing all robots (no distance filtering)');
          // Don't filter by distance if we can't geocode, but still apply other filters
          // This allows users to see robots even if geocoding fails
        }
      }
      // Apply distance filter if user coordinates and max distance are provided
      else if (filters.userLatitude && filters.userLongitude && filters.maxDistance) {
        const userLocation: Coordinates = {
          latitude: filters.userLatitude,
          longitude: filters.userLongitude
        };

        console.log('📍 User coordinates from profile:', userLocation);
        console.log('🔍 Filtering robots within', filters.maxDistance, 'miles of user location');

        robots = robots.filter(robot => {
          if (!robot.latitude || !robot.longitude) {
            console.log('❌ Robot', robot.name, 'has no coordinates, skipping');
            return false; // Skip robots without coordinates
          }

          const robotLocation: Coordinates = {
            latitude: robot.latitude,
            longitude: robot.longitude
          };

          const distance = distanceService.calculateDistance(userLocation, robotLocation);
          const isWithinRange = distance <= filters.maxDistance!;
          
          console.log(`📍 ${robot.name}: ${distance.toFixed(1)} miles from user - ${isWithinRange ? '✅ IN RANGE' : '❌ OUT OF RANGE'}`);
          
          return isWithinRange;
        });

        // Sort by distance (closest first)
        robots.sort((a, b) => {
          if (!a.latitude || !a.longitude || !b.latitude || !b.longitude) return 0;
          
          const distanceA = distanceService.calculateDistance(userLocation, {
            latitude: a.latitude,
            longitude: a.longitude
          });
          const distanceB = distanceService.calculateDistance(userLocation, {
            latitude: b.latitude,
            longitude: b.longitude
          });
          
          return distanceA - distanceB;
        });

        console.log(`✅ Found ${robots.length} robots within ${filters.maxDistance} miles of user location`);
      }

      if (filters.category && filters.category !== 'all') {
        robots = robots.filter(robot => 
          robot.category.toLowerCase() === filters.category!.toLowerCase()
        );
      }

      if (filters.minPrice !== undefined) {
        robots = robots.filter(robot => robot.price >= filters.minPrice!);
      }

      if (filters.maxPrice !== undefined) {
        robots = robots.filter(robot => robot.price <= filters.maxPrice!);
      }

      // Note: Location filtering is now handled by the distance-based filtering above
      // This prevents robots from being shown outside the specified radius

      if (filters.isAvailable !== undefined) {
        robots = robots.filter(robot => robot.isAvailable === filters.isAvailable);
      }

      console.log(`✅ Search complete! Returning ${robots.length} robots after filtering`);
      return robots;
    } catch (error) {
      console.error('Error searching robots:', error);
      throw new Error('Failed to search robots');
    }
  },

  // Get search suggestions based on popular searches
  getSearchSuggestions(): string[] {
    return [
      'Educational robots',
      'Industrial automation',
      'Drone rentals',
      'Service robots',
      'Hobby robots',
      'ChatGPT robots',
      'Programming robots',
      'Aerial photography'
    ];
  },

  // Get trending categories
  getTrendingCategories(): { name: string; count: number }[] {
    return [
      { name: 'Educational', count: 0 },
      { name: 'Industrial', count: 0 },
      { name: 'Service', count: 0 },
      { name: 'Hobby', count: 0 },
      { name: 'Other', count: 0 }
    ];
  }
}; 