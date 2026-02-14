import React from 'react';
import { Link } from 'react-router-dom';
import { Bot } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-robot-dark border-t border-primary-900/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
                <Bot className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">DroidBRB</span>
            </div>
            <p className="text-gray-400 max-w-md">
              Connecting robotics enthusiasts to share, learn, and rent robots in their local communities. Building the future of peer-to-peer robotics.
            </p>
          </div>

          {/* EXPLORE */}
          <div>
            <h3 className="font-semibold text-white mb-4 uppercase">Explore</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link to="/robots" className="hover:text-white transition-colors">
                  Browse Robots
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-white transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link to="/create-robot" className="hover:text-white transition-colors">
                  List Your Robot
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-white transition-colors">
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* CONNECT */}
          <div>
            <h3 className="font-semibold text-white mb-4 uppercase">Connect</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link to="/messages" className="hover:text-white transition-colors">
                  Messages
                </Link>
              </li>
              <li>
                <a href="mailto:hello@droidbrb.com" className="hover:text-white transition-colors">
                  Contact Us
                </a>
              </li>
              <li>
                <Link to="/login" className="hover:text-white transition-colors">
                  Sign In
                </Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-white transition-colors">
                  Sign Up
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-primary-900/30 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2025 DroidBRB. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 