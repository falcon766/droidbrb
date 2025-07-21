import React from 'react';
import { Link } from 'react-router-dom';
import { Bot } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
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
                <button className="hover:text-white transition-colors text-left">
                  Origin Story
                </button>
              </li>
              <li>
                <button className="hover:text-white transition-colors text-left">
                  Contact
                </button>
              </li>
            </ul>
          </div>

          {/* LEGAL */}
          <div>
            <h3 className="font-semibold text-white mb-4 uppercase">Legal</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <button className="hover:text-white transition-colors text-left">
                  Privacy Policy
                </button>
              </li>
              <li>
                <button className="hover:text-white transition-colors text-left">
                  Terms of Service
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2025 DroidBRB. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 