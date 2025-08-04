#!/bin/bash

# Set all Firebase environment variables correctly
echo "Setting Firebase environment variables..."

# Remove old API key first
netlify env:unset REACT_APP_FIREBASE_API_KEY --context production --force

# Set all variables with correct values
netlify env:set REACT_APP_FIREBASE_API_KEY "AIzaSyBIcwHrQMmIBWHNIRLNw9vl5Sbzxjs9k1A" --context production --force
netlify env:set REACT_APP_FIREBASE_AUTH_DOMAIN "droidbrb-v3.firebaseapp.com" --context production --force
netlify env:set REACT_APP_FIREBASE_PROJECT_ID "droidbrb-v3" --context production --force
netlify env:set REACT_APP_FIREBASE_STORAGE_BUCKET "droidbrb-v3.firebasestorage.app" --context production --force
netlify env:set REACT_APP_FIREBASE_MESSAGING_SENDER_ID "268735809128" --context production --force
netlify env:set REACT_APP_FIREBASE_APP_ID "1:268735809128:web:8701a414245ac4f80edddd" --context production --force
netlify env:set REACT_APP_FIREBASE_MEASUREMENT_ID "G-LJR7BG7VJT" --context production --force
netlify env:set REACT_APP_GOOGLE_PLACES_API_KEY "AIzaSyCsOEpjELO7WNyWBpVDjqPA2bS3VdBJNfo" --context production --force

echo "Environment variables set successfully!"
echo "Now redeploying..."

# Clean build and deploy
rm -rf build
npm run build
netlify deploy --prod --dir=build --message="Fresh deploy with corrected environment variables" 