import { initializeApp } from 'firebase/app';
import { getAuth, setPersistence, browserSessionPersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics } from 'firebase/analytics';

// Check if environment variables are set
const requiredEnvVars = [
  'REACT_APP_FIREBASE_API_KEY',
  'REACT_APP_FIREBASE_AUTH_DOMAIN',
  'REACT_APP_FIREBASE_PROJECT_ID',
  'REACT_APP_FIREBASE_STORAGE_BUCKET',
  'REACT_APP_FIREBASE_MESSAGING_SENDER_ID',
  'REACT_APP_FIREBASE_APP_ID'
];

const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
  console.error('Missing Firebase environment variables:', missingVars);
  console.error('Please set up your Firebase environment variables in a .env file');
}

// Debug: Log all environment variables
console.log('=== ENVIRONMENT VARIABLES DEBUG ===');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('REACT_APP_FIREBASE_API_KEY exists:', !!process.env.REACT_APP_FIREBASE_API_KEY);
console.log('REACT_APP_FIREBASE_API_KEY length:', process.env.REACT_APP_FIREBASE_API_KEY?.length);
console.log('REACT_APP_FIREBASE_API_KEY first 10 chars:', process.env.REACT_APP_FIREBASE_API_KEY?.substring(0, 10));
console.log('REACT_APP_FIREBASE_API_KEY last 10 chars:', process.env.REACT_APP_FIREBASE_API_KEY?.substring(-10));
console.log('REACT_APP_FIREBASE_API_KEY full value:', process.env.REACT_APP_FIREBASE_API_KEY);
console.log('REACT_APP_FIREBASE_PROJECT_ID:', process.env.REACT_APP_FIREBASE_PROJECT_ID);
console.log('REACT_APP_FIREBASE_AUTH_DOMAIN:', process.env.REACT_APP_FIREBASE_AUTH_DOMAIN);
console.log('REACT_APP_GOOGLE_PLACES_API_KEY exists:', !!process.env.REACT_APP_GOOGLE_PLACES_API_KEY);
console.log('REACT_APP_GOOGLE_PLACES_API_KEY length:', process.env.REACT_APP_GOOGLE_PLACES_API_KEY?.length);
console.log('=== END DEBUG ===');

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || 'missing-api-key',
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || 'missing-auth-domain',
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || 'missing-project-id',
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || 'missing-storage-bucket',
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || 'missing-sender-id',
  appId: process.env.REACT_APP_FIREBASE_APP_ID || 'missing-app-id',
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID || undefined,
};

// Simple debug to see what's actually loaded
console.log('Firebase Config Debug:', {
  apiKey: firebaseConfig.apiKey.substring(0, 10) + '...',
  appId: firebaseConfig.appId,
  projectId: firebaseConfig.projectId
});

// Initialize Firebase only if config is valid
let app: any;
let auth: any;
let db: any;
let storage: any;

try {
  // Check if we have valid Firebase config
  const hasValidConfig = firebaseConfig.apiKey !== 'missing-api-key' && 
                        firebaseConfig.projectId !== 'missing-project-id' &&
                        firebaseConfig.authDomain !== 'missing-auth-domain';
  
  if (hasValidConfig) {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    
    // Set Firebase Auth to use session-only persistence (clears when browser closes)
    setPersistence(auth, browserSessionPersistence)
      .then(() => {
        console.log('Firebase Auth set to session-only persistence');
      })
      .catch((error) => {
        console.error('Error setting auth persistence:', error);
      });
    
    db = getFirestore(app);
    storage = getStorage(app);
  } else {
    console.warn('Firebase not initialized - missing or invalid environment variables');
    // Create mock objects to prevent crashes
    auth = null;
    db = null;
    storage = null;
  }
} catch (error) {
  console.error('Error initializing Firebase:', error);
  auth = null;
  db = null;
  storage = null;
}

export { auth, db, storage };

// Initialize Analytics (only in production)
export const analytics = process.env.NODE_ENV === 'production' 
  ? getAnalytics(app) 
  : null;

export default app; 