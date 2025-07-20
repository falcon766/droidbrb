import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { 
  Robot, 
  Users, 
  MapPin, 
  Star, 
  MessageCircle, 
  Calendar,
  ArrowRight,
  Play,
  Shield,
  Zap,
  Globe
} from 'lucide-react';

const HomePage: React.FC = () => {
  const features = [
    {
      icon: Robot,
      title: 'Robot Marketplace',
      description: 'Browse and rent robots from enthusiasts worldwide. From drones to humanoids, find the perfect robot for your project.',
      color: 'bg-blue-500'
    },
    {
      icon: Users,
      title: 'Community Hub',
      description: 'Connect with fellow robotics enthusiasts. Share knowledge, join discussions, and attend local meetups.',
      color: 'bg-green-500'
    },
    {
      icon: MapPin,
      title: 'Location-Based',
      description: 'Find robots and events near you. Filter by distance and discover local robotics communities.',
      color: 'bg-purple-500'
    },
    {
      icon: Star,
      title: 'Trust & Safety',
      description: 'Verified users, reviews, and secure payments ensure a safe and reliable experience.',
      color: 'bg-orange-500'
    },
    {
      icon: MessageCircle,
      title: 'Real-time Chat',
      description: 'Communicate directly with robot owners. Ask questions and coordinate rentals seamlessly.',
      color: 'bg-pink-500'
    },
    {
      icon: Calendar,
      title: 'Event Management',
      description: 'Create and join robotics events. From workshops to competitions, never miss an opportunity.',
      color: 'bg-indigo-500'
    }
  ];

  const stats = [
    { number: '1000+', label: 'Active Users' },
    { number: '500+', label: 'Robot Listings' },
    { number: '50+', label: 'Cities Covered' },
    { number: '4.8', label: 'Average Rating' }
  ];

  return (
    <>
      <Helmet>
        <title>DroidBRB - Connect, Share, and Rent Robots</title>
        <meta name="description" content="Join the world's largest robotics community. Share, rent, and collaborate around robotic devices." />
      </Helmet>

      <div className="min-h-screen">
        {/* Navigation */}
        <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-2">
                <Robot className="h-8 w-8 text-primary-600" />
                <span className="text-xl font-bold text-gray-900">DroidBRB</span>
              </div>
              <div className="hidden md:flex items-center space-x-8">
                <Link to="/robots" className="text-gray-600 hover:text-primary-600 transition-colors">
                  Browse Robots
                </Link>
                <Link to="/community" className="text-gray-600 hover:text-primary-600 transition-colors">
                  Community
                </Link>
                <Link to="/events" className="text-gray-600 hover:text-primary-600 transition-colors">
                  Events
                </Link>
                <Link to="/login" className="text-gray-600 hover:text-primary-600 transition-colors">
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
                >
                  Get Started
                </Link>
              </div>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-primary-50 via-white to-accent-50 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >
                <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                  Connect, Share, and{' '}
                  <span className="text-primary-600">Rent Robots</span>
                </h1>
                <p className="mt-6 text-xl text-gray-600 leading-relaxed">
                  Join the world's largest robotics community. Share your robots, discover new technology, 
                  and collaborate with fellow enthusiasts worldwide.
                </p>
                <div className="mt-8 flex flex-col sm:flex-row gap-4">
                  <Link
                    to="/register"
                    className="inline-flex items-center justify-center px-8 py-4 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-all transform hover:scale-105"
                  >
                    Start Sharing Robots
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                  <button className="inline-flex items-center justify-center px-8 py-4 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:border-primary-600 hover:text-primary-600 transition-all">
                    <Play className="mr-2 h-5 w-5" />
                    Watch Demo
                  </button>
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="relative"
              >
                <div className="relative z-10">
                  <div className="bg-white rounded-2xl shadow-2xl p-8 transform rotate-3 hover:rotate-0 transition-transform duration-300">
                    <div className="flex items-center space-x-4 mb-6">
                      <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                        <Robot className="h-6 w-6 text-primary-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">DJI Mavic Pro</h3>
                        <p className="text-sm text-gray-500">Professional Drone</p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Daily Rate</span>
                        <span className="font-semibold text-primary-600">$45</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Location</span>
                        <span className="text-gray-900">San Francisco, CA</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="text-sm text-gray-600">4.9 (127 reviews)</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="absolute -top-4 -right-4 w-32 h-32 bg-accent-200 rounded-full opacity-50"></div>
                <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-primary-200 rounded-full opacity-50"></div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="bg-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="text-3xl md:text-4xl font-bold text-primary-600">{stat.number}</div>
                  <div className="text-gray-600 mt-2">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="bg-gray-50 py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Everything You Need for Robotics
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                From finding the perfect robot to connecting with the community, 
                DroidBRB provides all the tools you need to succeed in robotics.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white rounded-xl p-8 shadow-soft hover:shadow-medium transition-shadow"
                >
                  <div className={`w-12 h-12 ${feature.color} rounded-lg flex items-center justify-center mb-6`}>
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-primary-600 py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold text-white mb-6">
                Ready to Join the Robotics Revolution?
              </h2>
              <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
                Start sharing your robots, discover amazing technology, and connect with 
                the global robotics community today.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center px-8 py-4 bg-white text-primary-600 font-semibold rounded-lg hover:bg-gray-100 transition-all transform hover:scale-105"
                >
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
                <Link
                  to="/robots"
                  className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-primary-600 transition-all"
                >
                  Browse Robots
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-900 text-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-4 gap-8">
              <div>
                <div className="flex items-center space-x-2 mb-4">
                  <Robot className="h-8 w-8 text-primary-400" />
                  <span className="text-xl font-bold">DroidBRB</span>
                </div>
                <p className="text-gray-400">
                  Connecting robotics enthusiasts worldwide through sharing, collaboration, and innovation.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-4">Platform</h3>
                <ul className="space-y-2 text-gray-400">
                  <li><Link to="/robots" className="hover:text-white transition-colors">Browse Robots</Link></li>
                  <li><Link to="/community" className="hover:text-white transition-colors">Community</Link></li>
                  <li><Link to="/events" className="hover:text-white transition-colors">Events</Link></li>
                  <li><Link to="/about" className="hover:text-white transition-colors">About</Link></li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-4">Support</h3>
                <ul className="space-y-2 text-gray-400">
                  <li><Link to="/help" className="hover:text-white transition-colors">Help Center</Link></li>
                  <li><Link to="/contact" className="hover:text-white transition-colors">Contact</Link></li>
                  <li><Link to="/safety" className="hover:text-white transition-colors">Safety</Link></li>
                  <li><Link to="/terms" className="hover:text-white transition-colors">Terms</Link></li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-4">Connect</h3>
                <div className="flex space-x-4">
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    <Globe className="h-5 w-5" />
                  </a>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    <MessageCircle className="h-5 w-5" />
                  </a>
                </div>
              </div>
            </div>
            <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
              <p>&copy; 2024 DroidBRB. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default HomePage; 