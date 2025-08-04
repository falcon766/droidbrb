import React from 'react';
import { useAuth } from '../context/AuthContext';

const DebugInfo: React.FC = () => {
  const { loading, currentUser } = useAuth();

  if (process.env.NODE_ENV === 'production') {
    return null; // Don't show in production
  }

  return (
    <div className="fixed top-4 right-4 bg-black bg-opacity-75 text-white p-4 rounded-lg text-sm z-50">
      <div>Loading: {loading ? 'true' : 'false'}</div>
      <div>User: {currentUser ? 'logged in' : 'not logged in'}</div>
      <div>Firebase: {process.env.REACT_APP_FIREBASE_API_KEY ? 'configured' : 'not configured'}</div>
    </div>
  );
};

export default DebugInfo; 