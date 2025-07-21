import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { 
  Bot, 
  Search, 
  MapPin, 
  Filter,
  MessageCircle,
  Calendar,
  Heart,
  DollarSign,
  Settings,
  Gamepad2,
  Plane,
  ClipboardCheck,
  Heart as HeartIcon,
  Package
} from 'lucide-react';
import { robotService } from '../services/robotService';
import { Robot } from '../types';

const HomePage: React.FC = () => {
  const [featuredRobots, setFeaturedRobots] = useState<Robot[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedRobots = async () => {
      try {
        const robots = await robotService.getFeaturedRobots(6);
        setFeaturedRobots(robots);
      } catch (error) {
        console.error('Error fetching featured robots:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedRobots();
  }, []);

  const features = [
    {
      icon: Search,
      title: 'Find the Perfect Robot',
      description: 'Browse through our extensive catalog of robots. Filter by category, location, or specific capabilities to find exactly what you need.',
      color: 'bg-blue-500'
    },
    {
      icon: MessageCircle,
      title: 'Connect with the Owner',
      description: 'Message directly with robot owners to discuss details, ask questions, and arrange meetups or rentals.',
      color: 'bg-blue-500'
    },
    {
      icon: Calendar,
      title: 'Meet Up or Rent',
      description: 'Schedule a time to meet and see the robot in person, or arrange rental terms if the owner offers rentals.',
      color: 'bg-blue-500'
    }
  ];



  const categories = [
    { name: 'Humanoid', icon: Bot, count: 0 },
    { name: 'Industrial', icon: Settings, count: 0 },
    { name: 'Educational', icon: MessageCircle, count: 2 },
    { name: 'Hobby', icon: Gamepad2, count: 0 },
    { name: 'Drone', icon: Plane, count: 0 },
    { name: 'Service', icon: ClipboardCheck, count: 0 },
    { name: 'Medical', icon: HeartIcon, count: 0 },
    { name: 'Other', icon: Package, count: 1 }
  ];

  return (
    <>
      <Helmet>
        <title>DroidBRB - Connect, Share, and Rent Robots</title>
        <meta name="description" content="Join the world's largest robotics community. Share, rent, and collaborate around robotic devices." />
      </Helmet>

      <div className="min-h-screen bg-gray-900">
        {/* Header */}
        <header className="bg-gray-900 border-b border-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              {/* Logo */}
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                  <Bot className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold text-white">DroidBRB</span>
              </div>

              {/* Navigation */}
              <nav className="hidden md:flex items-center space-x-8">
                <Link to="/robots" className="text-white hover:text-blue-400 transition-colors">
                  Explore Robots
                </Link>
                <Link to="/about" className="text-white hover:text-blue-400 transition-colors">
                  About
                </Link>
                <Link to="/login" className="text-white hover:text-blue-400 transition-colors">
                  Sign In
                </Link>
                <Link to="/register" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  Sign Up
                </Link>
              </nav>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 1.2,
                ease: [0.16, 1, 0.3, 1]
              }}
            >
              <h2 className="text-blue-400 text-lg font-medium mb-4">
                Welcome to DroidBRB
              </h2>
              <h1 className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-blue-300 via-blue-400 to-blue-500 bg-clip-text text-transparent mb-6">
                Share. Rent. Innovate.
              </h1>
              <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto">
                The future of robotics is collaborative. DroidBRB connects you with a community of enthusiasts to rent and share robots, fostering innovation and learning.
              </p>
            </motion.div>

            {/* Search Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 1.2,
                delay: 0.2,
                ease: [0.16, 1, 0.3, 1]
              }}
              className="bg-gray-800 rounded-lg p-4 mb-8"
            >
              <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const query = formData.get('query') as string;
                const location = formData.get('location') as string;
                const params = new URLSearchParams();
                if (query) params.append('query', query);
                if (location) params.append('location', location);
                window.location.href = `/robots?${params.toString()}`;
              }}>
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 flex items-center bg-gray-700 rounded-lg px-4 py-3">
                    <Search className="h-5 w-5 text-gray-400 mr-3" />
                    <input
                      name="query"
                      type="text"
                      placeholder="Search robots..."
                      className="bg-transparent text-white placeholder-gray-400 flex-1 outline-none"
                    />
                  </div>
                  <div className="flex-1 flex items-center bg-gray-700 rounded-lg px-4 py-3">
                    <MapPin className="h-5 w-5 text-gray-400 mr-3" />
                    <input
                      name="location"
                      type="text"
                      placeholder="City, State"
                      className="bg-transparent text-white placeholder-gray-400 flex-1 outline-none"
                    />
                    <Filter className="h-5 w-5 text-gray-400 ml-3" />
                  </div>
                  <button type="submit" className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors">
                    Search
                  </button>
                </div>
              </form>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 1.2,
                delay: 0.4,
                ease: [0.16, 1, 0.3, 1]
              }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link
                to="/robots"
                className="bg-blue-500 text-white px-8 py-3 rounded-lg hover:bg-blue-600 transition-colors"
              >
                Find a Robot
              </Link>
              <Link
                to="/create-robot"
                className="bg-gray-800 text-white px-8 py-3 rounded-lg border border-gray-600 hover:bg-gray-700 transition-colors"
              >
                List Your Robot
              </Link>
            </motion.div>
          </div>
        </section>

        {/* How DroidBRB Works Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-800">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 1.2,
                ease: [0.16, 1, 0.3, 1]
              }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-bold text-white mb-4">
                How DroidBRB Works
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Connecting with robot enthusiasts in your area has never been easier
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ 
                    duration: 1.2,
                    delay: index * 0.1,
                    ease: [0.16, 1, 0.3, 1]
                  }}
                  viewport={{ once: true }}
                  className="bg-gray-700 rounded-lg p-8 text-center"
                >
                  <div className={`w-16 h-16 ${feature.color} rounded-full flex items-center justify-center mx-auto mb-6`}>
                    <feature.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-4">{feature.title}</h3>
                  <p className="text-gray-300 leading-relaxed">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Robots Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 1.2,
                ease: [0.16, 1, 0.3, 1]
              }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-bold text-white mb-4">
                Featured Robots
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Explore some of the most popular robots available in our community
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8 mb-12">
              {loading ? (
                // Loading skeleton
                Array.from({ length: 3 }).map((_, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ 
                      duration: 1.2,
                      delay: index * 0.1,
                      ease: [0.16, 1, 0.3, 1]
                    }}
                    className="bg-gray-800 rounded-lg overflow-hidden shadow-lg"
                  >
                    <div className="h-48 bg-gray-700 flex items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                    </div>
                    <div className="p-6">
                      <div className="h-4 bg-gray-700 rounded mb-4"></div>
                      <div className="h-3 bg-gray-700 rounded mb-2"></div>
                      <div className="h-3 bg-gray-700 rounded mb-4"></div>
                      <div className="h-8 bg-gray-700 rounded"></div>
                    </div>
                  </motion.div>
                ))
              ) : featuredRobots.length === 0 ? (
                <div className="col-span-3 text-center py-12">
                  <Bot className="h-16 w-16 text-gray-500 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">No robots available yet</h3>
                  <p className="text-gray-400 mb-6">Be the first to list a robot in your area!</p>
                  <Link
                    to="/create-robot"
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    List Your Robot
                  </Link>
                </div>
              ) : (
                featuredRobots.map((robot, index) => (
                  <motion.div
                    key={robot.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ 
                      duration: 1.2,
                      delay: index * 0.1,
                      ease: [0.16, 1, 0.3, 1]
                    }}
                    viewport={{ once: true }}
                    className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
                    onClick={() => window.location.href = `/robots/${robot.id}`}
                  >
                    {/* Robot Image */}
                    <div className="h-48 bg-gray-700 flex items-center justify-center">
                      {robot.images && robot.images.length > 0 ? (
                        <img 
                          src={robot.images[0]} 
                          alt={robot.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            target.nextElementSibling?.classList.remove('hidden');
                          }}
                        />
                      ) : null}
                      <Bot className={`h-16 w-16 text-gray-500 ${robot.images && robot.images.length > 0 ? 'hidden' : ''}`} />
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
                        <div className="flex items-center gap-1">
                          <span className="text-yellow-400 text-sm">⭐</span>
                          <span className="text-white text-sm">{robot.rating.toFixed(1)}</span>
                        </div>
                      </div>

                      {/* Robot Details */}
                      <h3 className="text-lg font-semibold text-white mb-2">
                        {robot.name}
                      </h3>
                      <div className="flex items-center text-gray-400 text-sm mb-2">
                        <MapPin className="h-4 w-4 mr-1" />
                        {robot.location}
                      </div>
                      <p className="text-gray-300 text-sm mb-4 line-clamp-2">
                        {robot.description}
                      </p>

                      {/* Rent Button */}
                      <button className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors">
                        Available for Rent
                      </button>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {/* View All Robots Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 1.2,
                ease: [0.16, 1, 0.3, 1]
              }}
              viewport={{ once: true }}
              className="text-center"
            >
              <Link
                to="/robots"
                className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                View All Robots
              </Link>
            </motion.div>
          </div>
        </section>

        {/* Explore by Category Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 1.2,
                ease: [0.16, 1, 0.3, 1]
              }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-bold text-white mb-4">
                Explore by Category
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Discover robots of all types, from industrial arms to educational bots
              </p>
            </motion.div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {categories.map((category, index) => (
                <motion.div
                  key={category.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ 
                    duration: 1.2,
                    delay: index * 0.1,
                    ease: [0.16, 1, 0.3, 1]
                  }}
                  viewport={{ once: true }}
                  className="bg-gray-800 rounded-lg p-6 text-center cursor-pointer hover:bg-gray-700 transition-colors"
                  onClick={() => window.location.href = `/robots?category=${category.name.toLowerCase()}`}
                >
                  <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <category.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-white font-semibold mb-2">{category.name}</h3>
                  <p className="text-gray-400 text-sm">
                    {category.count === 0 ? 'None available' : `${category.count} robot${category.count === 1 ? '' : 's'}`}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default HomePage; 