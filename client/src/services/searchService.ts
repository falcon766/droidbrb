import { robotService } from './robotService';
import { Robot } from '../types';

export interface SearchFilters {
  query?: string;
  location?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  radius?: number; // in miles
  isAvailable?: boolean;
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
      // Note: In a real implementation, you would need to:
      // 1. Set up Google Places API key in environment variables
      // 2. Create a backend endpoint to proxy the request (to hide API key)
      // 3. Or use Google Places Autocomplete widget directly in frontend
      
      // For now, we'll return mock suggestions
      const mockSuggestions: LocationSuggestion[] = [
        {
          place_id: '1',
          description: 'Manhattan Beach, CA, USA',
          structured_formatting: {
            main_text: 'Manhattan Beach',
            secondary_text: 'CA, USA'
          }
        },
        {
          place_id: '2',
          description: 'Los Angeles, CA, USA',
          structured_formatting: {
            main_text: 'Los Angeles',
            secondary_text: 'CA, USA'
          }
        },
        {
          place_id: '3',
          description: 'San Francisco, CA, USA',
          structured_formatting: {
            main_text: 'San Francisco',
            secondary_text: 'CA, USA'
          }
        }
      ];

      return mockSuggestions.filter(suggestion => 
        suggestion.description.toLowerCase().includes(input.toLowerCase())
      );
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