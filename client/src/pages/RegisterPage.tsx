import React from 'react';
import { Link } from 'react-router-dom';

const RegisterPage: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">Register</h2>
          <p className="mt-2 text-sm text-gray-600">
            Create your DroidBRB account
          </p>
        </div>
        <div className="bg-white py-8 px-6 shadow rounded-lg">
          <p className="text-center text-gray-600">
            Registration form coming soon...
          </p>
          <div className="mt-4 text-center">
            <Link to="/login" className="text-primary-600 hover:text-primary-500">
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage; 