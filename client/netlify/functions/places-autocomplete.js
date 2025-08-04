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
    console.log('Function called with event:', JSON.stringify(event, null, 2));
    
    // Get the input from query parameters
    const { input } = event.queryStringParameters || {};
    console.log('Input parameter:', input);
    
    if (!input || input.length < 3) {
      console.log('Input too short, returning error');
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Input must be at least 3 characters long' })
      };
    }

    // Google Places API key (newer API)
    const apiKey = 'AIzaSyCsOEpjELO7WNyWBpVDjqPA2bS3VdBJNfo';
    
    // Build the Google Places API URL (using the newer Places API with proper format)
    const url = `https://places.googleapis.com/v1/places:autocomplete`;
    
    // The newer Places API requires a POST request with JSON body
    const requestBody = {
      input: input
    };
    console.log('Calling Google Places API:', url.replace(apiKey, 'API_KEY_HIDDEN'));
    
    // Make the request to Google Places API (POST with JSON body)
    const response = await fetch(`${url}?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    });
    console.log('Google Places API response status:', response.status);
    
    const data = await response.json();
    console.log('Google Places API response data:', JSON.stringify(data, null, 2));
    
    // Return the response from Google Places API
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(data)
    };
    
  } catch (error) {
    console.error('Error in places-autocomplete function:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error' })
    };
  }
}; 