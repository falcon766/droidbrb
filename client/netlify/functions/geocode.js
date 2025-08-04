exports.handler = async (event, context) => {
  // Enable CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  try {
    console.log('Geocoding function called with event:', JSON.stringify(event, null, 2));
    
    // Get the address from query parameters
    const { address } = event.queryStringParameters || {};
    console.log('Address parameter:', address);
    
    if (!address) {
      console.log('No address provided, returning error');
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Address parameter is required' })
      };
    }

    // Google Geocoding API key
    const apiKey = 'AIzaSyCsOEpjELO7WNyWBpVDjqPA2bS3VdBJNfo';
    
    // Build the Google Geocoding API URL
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`;
    console.log('Calling Google Geocoding API:', url.replace(apiKey, 'API_KEY_HIDDEN'));
    
    // Make the request to Google Geocoding API
    const response = await fetch(url);
    console.log('Google Geocoding API response status:', response.status);
    
    const data = await response.json();
    console.log('Google Geocoding API response data:', JSON.stringify(data, null, 2));
    
    // Return the response from Google Geocoding API
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(data)
    };
    
  } catch (error) {
    console.error('Error in geocode function:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error' })
    };
  }
}; 