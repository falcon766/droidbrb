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

// Debug: Check env var presence (no values logged for security)
if (process.env.NODE_ENV === 'development') {
  console.log('Firebase env vars present:', requiredEnvVars.map(v => `${v}: ${!!process.env[v]}`).join(', '));
}

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || 'missing-api-key',
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || 'missing-auth-domain',
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || 'missing-project-id',
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || 'missing-storage-bucket',
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || 'missing-sender-id',
  appId: process.env.REACT_APP_FIREBASE_APP_ID || 'missing-app-id',
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID || undefined,
};

// Verify config is loaded
if (process.env.NODE_ENV === 'development') {
  console.log('Firebase project:', firebaseConfig.projectId);
}

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