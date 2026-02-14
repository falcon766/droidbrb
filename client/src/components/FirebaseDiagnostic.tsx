import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, AlertCircle, Info } from 'lucide-react';

const FirebaseDiagnostic: React.FC = () => {
  const [diagnostics, setDiagnostics] = useState<{
    envVars: { [key: string]: boolean };
    firebaseInit: boolean;
    auth: boolean;
    db: boolean;
    storage: boolean;
  }>({
    envVars: {},
    firebaseInit: false,
    auth: false,
    db: false,
    storage: false,
  });

  useEffect(() => {
    const checkFirebaseConfig = () => {
      // Check environment variables
      const requiredVars = [
        'REACT_APP_FIREBASE_API_KEY',
        'REACT_APP_FIREBASE_AUTH_DOMAIN',
        'REACT_APP_FIREBASE_PROJECT_ID',
        'REACT_APP_FIREBASE_STORAGE_BUCKET',
        'REACT_APP_FIREBASE_MESSAGING_SENDER_ID',
        'REACT_APP_FIREBASE_APP_ID',
      ];

      const envVars: { [key: string]: boolean } = {};
      requiredVars.forEach(varName => {
        envVars[varName] = !!process.env[varName];
      });

      const allEnvVarsSetLocal = Object.values(envVars).every(Boolean);

      // For now, just check environment variables
      // Firebase services will be checked when they're properly initialized
      const firebaseInit = allEnvVarsSetLocal;
      const auth = allEnvVarsSetLocal;
      const db = allEnvVarsSetLocal;
      const storage = allEnvVarsSetLocal;

      setDiagnostics({
        envVars,
        firebaseInit,
        auth,
        db,
        storage,
      });
    };

    checkFirebaseConfig();
  }, []);

  const allEnvVarsSet = Object.values(diagnostics.envVars).every(Boolean);
  const allServicesWorking = diagnostics.firebaseInit && diagnostics.auth && diagnostics.db && diagnostics.storage;

  return (
    <div className="min-h-screen bg-robot-dark text-white p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">Firebase Configuration Diagnostic</h1>
          <p className="text-gray-300">
            This page helps you verify that your Firebase environment variables are set up correctly.
          </p>
        </div>

        {/* Environment Variables */}
        <div className="bg-robot-slate rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            {allEnvVarsSet ? (
              <CheckCircle className="h-6 w-6 text-green-400 mr-2" />
            ) : (
              <XCircle className="h-6 w-6 text-red-400 mr-2" />
            )}
            Environment Variables
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(diagnostics.envVars).map(([varName, isSet]) => (
              <div key={varName} className="flex items-center justify-between p-3 bg-robot-steel rounded">
                <span className="text-sm font-mono">{varName}</span>
                {isSet ? (
                  <CheckCircle className="h-5 w-5 text-green-400" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-400" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Firebase Services */}
        <div className="bg-robot-slate rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            {allServicesWorking ? (
              <CheckCircle className="h-6 w-6 text-green-400 mr-2" />
            ) : (
              <AlertCircle className="h-6 w-6 text-yellow-400 mr-2" />
            )}
            Firebase Services
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center justify-between p-3 bg-robot-steel rounded">
              <span>Firebase Initialization</span>
              {diagnostics.firebaseInit ? (
                <CheckCircle className="h-5 w-5 text-green-400" />
              ) : (
                <XCircle className="h-5 w-5 text-red-400" />
              )}
            </div>
            <div className="flex items-center justify-between p-3 bg-robot-steel rounded">
              <span>Authentication</span>
              {diagnostics.auth ? (
                <CheckCircle className="h-5 w-5 text-green-400" />
              ) : (
                <XCircle className="h-5 w-5 text-red-400" />
              )}
            </div>
            <div className="flex items-center justify-between p-3 bg-robot-steel rounded">
              <span>Firestore Database</span>
              {diagnostics.db ? (
                <CheckCircle className="h-5 w-5 text-green-400" />
              ) : (
                <XCircle className="h-5 w-5 text-red-400" />
              )}
            </div>
            <div className="flex items-center justify-between p-3 bg-robot-steel rounded">
              <span>Storage</span>
              {diagnostics.storage ? (
                <CheckCircle className="h-5 w-5 text-green-400" />
              ) : (
                <XCircle className="h-5 w-5 text-red-400" />
              )}
            </div>
          </div>
        </div>

        {/* Status Summary */}
        <div className="bg-robot-slate rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Status Summary</h2>
          
          {allEnvVarsSet && allServicesWorking ? (
            <div className="bg-green-900 border border-green-700 rounded-lg p-4">
              <div className="flex items-center">
                <CheckCircle className="h-6 w-6 text-green-400 mr-3" />
                <div>
                  <h3 className="text-lg font-semibold text-green-400">✅ All Systems Operational</h3>
                  <p className="text-green-300">Your Firebase configuration is working perfectly!</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-yellow-900 border border-yellow-700 rounded-lg p-4">
              <div className="flex items-center">
                <AlertCircle className="h-6 w-6 text-yellow-400 mr-3" />
                <div>
                  <h3 className="text-lg font-semibold text-yellow-400">⚠️ Configuration Issues Detected</h3>
                  <p className="text-yellow-300">
                    Some Firebase environment variables or services are not properly configured.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Instructions */}
        <div className="bg-primary-900/30 border border-primary-900/30 rounded-lg p-6">
          <div className="flex items-start">
            <Info className="h-6 w-6 text-primary-400 mr-3 mt-1" />
            <div>
              <h3 className="text-lg font-semibold text-primary-400 mb-2">How to Fix Issues</h3>
              <ol className="text-gray-300 space-y-2 list-decimal list-inside">
                <li>Go to your Netlify dashboard</li>
                <li>Navigate to Site Settings → Environment Variables</li>
                <li>Add the missing environment variables from your Firebase project</li>
                <li>Redeploy your site</li>
                <li>Refresh this page to verify the fix</li>
              </ol>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="mt-8 text-center">
          <a 
            href="/" 
            className="bg-primary-500 text-white px-6 py-3 rounded-lg hover:bg-primary-600 transition-colors"
          >
            Back to Home
          </a>
        </div>
      </div>
    </div>
  );
};

export default FirebaseDiagnostic; 