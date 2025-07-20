import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Bot, 
  Search, 
  MapPin, 
  Filter,
  Heart,
  DollarSign,
  SlidersHorizontal
} from 'lucide-react';

const RobotListPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All Categories' },
    { id: 'educational', name: 'Educational' },
    { id: 'industrial', name: 'Industrial' },
    { id: 'service', name: 'Service' },
    { id: 'hobby', name: 'Hobby' },
    { id: 'other', name: 'Other' }
  ];

  const robots = [
    {
      id: '1',
      name: 'Loona Pet Robot',
      category: 'Educational',
      price: 25,
      location: 'Manhattan Beach, CA',
      description: 'ChatGPT-enabled conversations',
      image: '/images/loona-robot.jpg',
      isAvailable: true
    },
    {
      id: '2',
      name: 'LOOI Robot',
      category: 'Educational',
      price: 15,
      location: 'Los Angeles, CA',
      description: 'LOOI Robot base. Connects to your phone. ChatGPT-enabled conversations',
      image: '/images/looi-robot.jpg',
      isAvailable: true
    },
    {
      id: '3',
      name: 'KinderBot',
      category: 'Other',
      price: 10,
      location: 'Manhattan Beach, CA',
      description: 'KinderBot Code \'n Learn. Basic preschool programming lessons',
      image: '/images/kinderbot.jpg',
      isAvailable: true
    },
    {
      id: '4',
      name: 'DJI Mavic Pro',
      category: 'Hobby',
      price: 45,
      location: 'San Francisco, CA',
      description: 'Professional drone for aerial photography and videography',
      image: '/images/dji-mavic.jpg',
      isAvailable: true
    },
    {
      id: '5',
      name: 'Boston Dynamics Spot',
      category: 'Industrial',
      price: 150,
      location: 'Boston, MA',
      description: 'Advanced quadruped robot for industrial applications',
      image: '/images/spot-robot.jpg',
      isAvailable: false
    },
    {
      id: '6',
      name: 'Roomba i7+',
      category: 'Service',
      price: 20,
      location: 'Austin, TX',
      description: 'Smart robot vacuum with automatic dirt disposal',
      image: '/images/roomba.jpg',
      isAvailable: true
    }
  ];

  const filteredRobots = robots.filter(robot => {
    const matchesSearch = robot.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         robot.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || 
                           robot.category.toLowerCase() === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl font-bold text-white mb-4">
              Browse Robots
            </h1>
            <p className="text-xl text-gray-300">
              Discover amazing robots available for rent in your area
            </p>
          </motion.div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Bar */}
            <div className="flex-1 flex items-center bg-gray-700 rounded-lg px-4 py-3">
              <Search className="h-5 w-5 text-gray-400 mr-3" />
              <input
                type="text"
                placeholder="Search robots..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-transparent text-white placeholder-gray-400 flex-1 outline-none"
              />
            </div>

            {/* Category Filter */}
            <div className="flex items-center bg-gray-700 rounded-lg px-4 py-3">
              <SlidersHorizontal className="h-5 w-5 text-gray-400 mr-3" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-transparent text-white outline-none"
              >
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Robots Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {filteredRobots.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <Bot className="h-16 w-16 text-gray-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">
              No robots found
            </h3>
            <p className="text-gray-400">
              Try adjusting your search terms or filters
            </p>
          </motion.div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredRobots.map((robot, index) => (
                              <motion.div
                  key={robot.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
                  onClick={() => window.location.href = `/robots/${robot.id}`}
                >
                {/* Robot Image Placeholder */}
                <div className="h-48 bg-gray-700 flex items-center justify-center">
                  <Bot className="h-16 w-16 text-gray-500" />
                </div>
                
                {/* Robot Info */}
                <div className="p-6">
                  {/* Tags */}
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex gap-2">
                      <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded">
                        {robot.category}
                      </span>
                      <span className="bg-gray-600 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
                        <DollarSign className="h-3 w-3" />
                        ${robot.price}/day
                      </span>
                    </div>
                    <button className="text-white hover:text-red-400 transition-colors">
                      <Heart className="h-5 w-5" />
                    </button>
                  </div>

                  {/* Robot Details */}
                  <h3 className="text-lg font-semibold text-white mb-2">
                    {robot.name}
                  </h3>
                  <div className="flex items-center text-gray-400 text-sm mb-2">
                    <MapPin className="h-4 w-4 mr-1" />
                    {robot.location}
                  </div>
                  <p className="text-gray-300 text-sm mb-4">
                    {robot.description}
                  </p>

                  {/* Rent Button */}
                  <button 
                    className={`w-full py-2 px-4 rounded-lg transition-colors ${
                      robot.isAvailable 
                        ? 'bg-green-600 text-white hover:bg-green-700' 
                        : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                    }`}
                    disabled={!robot.isAvailable}
                  >
                    {robot.isAvailable ? 'Available for Rent' : 'Currently Rented'}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RobotListPage; 