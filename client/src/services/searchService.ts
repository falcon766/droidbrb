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
        return data.suggestions.map((suggestion: any) => ({
          place_id: suggestion.placePrediction.placeId,
          description: suggestion.placePrediction.structuredFormat?.mainText?.text || suggestion.placePrediction.structuredFormat?.fullText?.text || '',
          structured_formatting: {
            main_text: suggestion.placePrediction.structuredFormat?.mainText?.text || '',
            secondary_text: suggestion.placePrediction.structuredFormat?.secondaryText?.text || ''
          }
        }));
      }
      
      // Fallback to legacy format if needed
      if (data.predictions && Array.isArray(data.predictions)) {
        return data.predictions.map((prediction: any) => ({
          place_id: prediction.place_id,
          description: prediction.description,
          structured_formatting: {
            main_text: prediction.structured_formatting?.main_text || '',
            secondary_text: prediction.structured_formatting?.secondary_text || ''
          }
        }));
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
      // Get all available robots first
      let robots = await robotService.getAvailableRobots();

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
        // Geocode the location to get coordinates
        const coordinates = await distanceService.getCoordinatesFromAddress(filters.location);
        
        if (coordinates) {
          const userLocation: Coordinates = {
            latitude: coordinates.latitude,
            longitude: coordinates.longitude
          };

          robots = robots.filter(robot => {
            if (!robot.latitude || !robot.longitude) {
              return false; // Skip robots without coordinates
            }

            const robotLocation: Coordinates = {
              latitude: robot.latitude,
              longitude: robot.longitude
            };

            const distance = distanceService.calculateDistance(userLocation, robotLocation);
            return distance <= filters.maxDistance!;
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
        }
      }
      // Apply distance filter if user coordinates and max distance are provided
      else if (filters.userLatitude && filters.userLongitude && filters.maxDistance) {
        const userLocation: Coordinates = {
          latitude: filters.userLatitude,
          longitude: filters.userLongitude
        };

        robots = robots.filter(robot => {
          if (!robot.latitude || !robot.longitude) {
            return false; // Skip robots without coordinates
          }

          const robotLocation: Coordinates = {
            latitude: robot.latitude,
            longitude: robot.longitude
          };

          const distance = distanceService.calculateDistance(userLocation, robotLocation);
          return distance <= filters.maxDistance!;
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

      if (filters.location) {
        // Simple location filtering - in a real app, you'd use geocoding
        // and distance calculations
        robots = robots.filter(robot => 
          robot.location.toLowerCase().includes(filters.location!.toLowerCase())
        );
      }

      if (filters.isAvailable !== undefined) {
        robots = robots.filter(robot => robot.isAvailable === filters.isAvailable);
      }

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