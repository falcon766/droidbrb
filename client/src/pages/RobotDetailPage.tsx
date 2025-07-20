import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Bot, 
  MapPin, 
  Heart,
  DollarSign,
  Calendar,
  Star,
  MessageCircle,
  ArrowLeft,
  Clock,
  User,
  Shield
} from 'lucide-react';

const RobotDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [isFavorited, setIsFavorited] = useState(false);

  // Mock robot data - in real app this would come from API
  const robot = {
    id: '1',
    name: 'Loona Pet Robot',
    category: 'Educational',
    price: 25,
    location: 'Manhattan Beach, CA',
    description: 'Loona is an advanced pet robot with ChatGPT-enabled conversations. Perfect for learning about robotics and AI interaction.',
    longDescription: 'Loona Pet Robot is a cutting-edge companion robot that combines advanced robotics with artificial intelligence. Features include natural language processing, emotional recognition, and interactive learning capabilities. Perfect for educational purposes, research, or simply experiencing the future of human-robot interaction.',
    image: '/images/loona-robot.jpg',
    isAvailable: true,
    rating: 4.8,
    reviewCount: 127,
    owner: {
      name: 'Sarah Johnson',
      rating: 4.9,
      reviewCount: 45,
      isVerified: true
    },
    specifications: {
      weight: '2.5 kg',
      dimensions: '30 x 20 x 15 cm',
      batteryLife: '8 hours',
      connectivity: 'WiFi, Bluetooth',
      features: ['Voice Recognition', 'Facial Recognition', 'ChatGPT Integration', 'Educational Games']
    },
    availability: {
      minRental: '1 day',
      maxRental: '30 days',
      pickupTime: '9:00 AM - 6:00 PM',
      returnTime: '9:00 AM - 6:00 PM'
    }
  };

  const reviews = [
    {
      id: 1,
      user: 'Alex Chen',
      rating: 5,
      comment: 'Amazing robot! My kids loved learning with Loona. Very responsive and educational.',
      date: '2024-01-15'
    },
    {
      id: 2,
      user: 'Maria Rodriguez',
      rating: 4,
      comment: 'Great experience renting Loona. The owner was very helpful and the robot worked perfectly.',
      date: '2024-01-10'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link 
            to="/robots" 
            className="inline-flex items-center text-blue-400 hover:text-blue-300 transition-colors mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Robots
          </Link>
          <h1 className="text-3xl font-bold text-white">{robot.name}</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Robot Image */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-gray-800 rounded-lg overflow-hidden"
            >
              <div className="h-96 bg-gray-700 flex items-center justify-center">
                <Bot className="h-24 w-24 text-gray-500" />
              </div>
            </motion.div>

            {/* Robot Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-gray-800 rounded-lg p-6"
            >
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">{robot.name}</h2>
                  <div className="flex items-center text-gray-400 mb-4">
                    <MapPin className="h-4 w-4 mr-2" />
                    {robot.location}
                  </div>
                  <div className="flex items-center mb-4">
                    <div className="flex items-center mr-4">
                      <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                      <span className="text-white">{robot.rating}</span>
                      <span className="text-gray-400 ml-1">({robot.reviewCount} reviews)</span>
                    </div>
                    <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded">
                      {robot.category}
                    </span>
                  </div>
                </div>
                <button 
                  onClick={() => setIsFavorited(!isFavorited)}
                  className={`p-2 rounded-lg transition-colors ${
                    isFavorited ? 'text-red-400 bg-red-900/20' : 'text-white hover:text-red-400'
                  }`}
                >
                  <Heart className={`h-6 w-6 ${isFavorited ? 'fill-current' : ''}`} />
                </button>
              </div>

              <p className="text-gray-300 mb-6">{robot.longDescription}</p>

              {/* Specifications */}
              <div className="border-t border-gray-700 pt-6">
                <h3 className="text-lg font-semibold text-white mb-4">Specifications</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-400">Weight:</span>
                    <span className="text-white ml-2">{robot.specifications.weight}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Dimensions:</span>
                    <span className="text-white ml-2">{robot.specifications.dimensions}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Battery Life:</span>
                    <span className="text-white ml-2">{robot.specifications.batteryLife}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Connectivity:</span>
                    <span className="text-white ml-2">{robot.specifications.connectivity}</span>
                  </div>
                </div>
                <div className="mt-4">
                  <span className="text-gray-400">Features:</span>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {robot.specifications.features.map((feature, index) => (
                      <span key={index} className="bg-gray-700 text-white text-xs px-2 py-1 rounded">
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Reviews */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-gray-800 rounded-lg p-6"
            >
              <h3 className="text-lg font-semibold text-white mb-4">Reviews</h3>
              <div className="space-y-4">
                {reviews.map((review) => (
                  <div key={review.id} className="border-b border-gray-700 pb-4 last:border-b-0">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center">
                        <User className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-white font-medium">{review.user}</span>
                      </div>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                        <span className="text-white text-sm">{review.rating}</span>
                      </div>
                    </div>
                    <p className="text-gray-300 text-sm mb-2">{review.comment}</p>
                    <span className="text-gray-500 text-xs">{review.date}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Rental Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-gray-800 rounded-lg p-6 sticky top-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <DollarSign className="h-5 w-5 text-green-400 mr-2" />
                  <span className="text-2xl font-bold text-white">${robot.price}</span>
                  <span className="text-gray-400 ml-1">/day</span>
                </div>
                <span className={`px-2 py-1 rounded text-xs ${
                  robot.isAvailable 
                    ? 'bg-green-600 text-white' 
                    : 'bg-gray-600 text-gray-300'
                }`}>
                  {robot.isAvailable ? 'Available' : 'Rented'}
                </span>
              </div>

              <button 
                className={`w-full py-3 px-4 rounded-lg font-medium transition-colors mb-4 ${
                  robot.isAvailable 
                    ? 'bg-green-600 text-white hover:bg-green-700' 
                    : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                }`}
                disabled={!robot.isAvailable}
              >
                {robot.isAvailable ? 'Rent Now' : 'Currently Rented'}
              </button>

              <button className="w-full py-3 px-4 border border-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors mb-4">
                <MessageCircle className="h-4 w-4 inline mr-2" />
                Contact Owner
              </button>

              {/* Availability Info */}
              <div className="border-t border-gray-700 pt-4">
                <h4 className="text-white font-medium mb-3">Availability</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Min Rental:</span>
                    <span className="text-white">{robot.availability.minRental}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Max Rental:</span>
                    <span className="text-white">{robot.availability.maxRental}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Pickup Time:</span>
                    <span className="text-white">{robot.availability.pickupTime}</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Owner Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-gray-800 rounded-lg p-6"
            >
              <h4 className="text-white font-medium mb-4">Owner</h4>
              <div className="flex items-center mb-3">
                <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center mr-3">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <div>
                  <div className="flex items-center">
                    <span className="text-white font-medium">{robot.owner.name}</span>
                    {robot.owner.isVerified && (
                      <Shield className="h-4 w-4 text-blue-400 ml-2" />
                    )}
                  </div>
                  <div className="flex items-center text-sm">
                    <Star className="h-3 w-3 text-yellow-400 fill-current mr-1" />
                    <span className="text-white">{robot.owner.rating}</span>
                    <span className="text-gray-400 ml-1">({robot.owner.reviewCount} reviews)</span>
                  </div>
                </div>
              </div>
              <button className="w-full py-2 px-4 border border-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
                View Profile
              </button>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RobotDetailPage; 