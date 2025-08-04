// Distance calculation service using Haversine formula
export interface Coordinates {
  latitude: number;
  longitude: number;
}

export const distanceService = {
  // Calculate distance between two points using Haversine formula
  calculateDistance(point1: Coordinates, point2: Coordinates): number {
    const R = 3959; // Earth's radius in miles
    const dLat = this.toRadians(point2.latitude - point1.latitude);
    const dLon = this.toRadians(point2.longitude - point1.longitude);
    
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRadians(point1.latitude)) * Math.cos(this.toRadians(point2.latitude)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    
    return Math.round(distance * 10) / 10; // Round to 1 decimal place
  },

  // Convert degrees to radians
  toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  },

  // Get coordinates from address using Google Geocoding API
  async getCoordinatesFromAddress(address: string): Promise<Coordinates | null> {
    try {
      const response = await fetch(`/.netlify/functions/geocode?address=${encodeURIComponent(address)}`);
      
      if (!response.ok) {
        console.error('Geocoding error:', response.status);
        return null;
      }
      
      const data = await response.json();
      
      if (data.results && data.results.length > 0) {
        const location = data.results[0].geometry.location;
        return {
          latitude: location.lat,
          longitude: location.lng
        };
      }
      
      return null;
    } catch (error) {
      console.error('Error geocoding address:', error);
      return null;
    }
  },

  // Get coordinates from zipcode
  async getCoordinatesFromZipcode(zipcode: string): Promise<Coordinates | null> {
    return this.getCoordinatesFromAddress(zipcode);
  },

  // Format distance for display
  formatDistance(distance: number): string {
    if (distance < 1) {
      return `${Math.round(distance * 5280)} feet`;
    } else if (distance < 10) {
      return `${distance} miles`;
    } else {
      return `${Math.round(distance)} miles`;
    }
  }
}; 