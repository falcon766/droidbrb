import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Search, ArrowLeft } from 'lucide-react';

const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-robot-dark py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        <div>
          {/* 404 Icon */}
          <div className="mx-auto h-24 w-24 bg-gradient-to-r from-primary-400 to-primary-600 rounded-full flex items-center justify-center mb-6">
            <span className="text-white text-3xl font-bold">404</span>
          </div>

          <h1 className="text-4xl font-bold text-white mb-4">
            Page Not Found
          </h1>

          <p className="text-lg text-gray-300 mb-8">
            Sorry, we couldn't find the page you're looking for.
            The page might have been moved, deleted, or you entered the wrong URL.
          </p>
        </div>

        <div className="space-y-4">
          <Link
            to="/"
            className="w-full flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-500 hover:bg-primary-600 transition-colors"
          >
            <Home className="w-5 h-5 mr-2" />
            Go Home
          </Link>

          <Link
            to="/robots"
            className="w-full flex items-center justify-center px-4 py-3 border border-primary-900/30 text-base font-medium rounded-md text-gray-300 bg-robot-slate hover:bg-robot-steel transition-colors"
          >
            <Search className="w-5 h-5 mr-2" />
            Browse Robots
          </Link>

          <button
            onClick={() => window.history.back()}
            className="w-full flex items-center justify-center px-4 py-3 border border-primary-900/30 text-base font-medium rounded-md text-gray-300 bg-robot-slate hover:bg-robot-steel transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Go Back
          </button>
        </div>

        <div className="mt-8">
          <p className="text-sm text-gray-400">
            Need help?{' '}
            <Link to="/contact" className="text-primary-400 hover:text-primary-300">
              Contact our support team
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;