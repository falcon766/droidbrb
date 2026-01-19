import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Bot, 
  MapPin, 
  Heart,
  DollarSign,
  MessageCircle,
  ArrowLeft,
  User
} from 'lucide-react';

import { robotService } from '../services/robotService';
import { Robot, User as UserType } from '../types';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/config';

const RobotDetailPage: React.FC = () => {
  const [isFavorited, setIsFavorited] = useState(false);
  const [robot, setRobot] = useState<Robot | null>(null);
  const [owner, setOwner] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      if (!id) {
        setLoading(false);
        return;
      }
      try {
        const data = await robotService.getRobotById(id);
        setRobot(data);
        
        // Fetch owner information
        if (data && data.ownerId && db) {
          try {
            const ownerDoc = await getDoc(doc(db, 'users', data.ownerId));
            if (ownerDoc.exists()) {
              const ownerData = ownerDoc.data();
              setOwner({
                ...ownerData,
                id: data.ownerId,
                createdAt: ownerData.createdAt?.toDate?.() || new Date(),
                updatedAt: ownerData.updatedAt?.toDate?.() || new Date(),
              } as UserType);
            }
          } catch (error) {
            console.error('Error fetching owner info:', error);
          }
        }
      } catch (e) {
        console.error('Failed to load robot', e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

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

  if (loading) {
    return (
      <div className="min-h-screen bg-robot-dark flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-500 shadow-lg"></div>
      </div>
    );
  }

  if (!robot) {
    return (
      <div className="min-h-screen bg-robot-dark">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <Bot className="h-16 w-16 text-gray-600 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2">Robot not found</h1>
          <p className="text-gray-400 mb-6">The robot you are looking for does not exist or was removed.</p>
          <button onClick={() => navigate(-1)} className="text-primary-400 hover:text-primary-300 underline transition-all">Go back</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-robot-dark">
      {/* Header */}
      <div className="bg-robot-slate border-b border-primary-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center text-primary-400 hover:text-primary-300 transition-all mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </button>
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
              className="bg-robot-slate rounded-lg overflow-hidden shadow-lg"
            >
              <div className="h-96 bg-robot-steel flex items-center justify-center">
                <Bot className="h-24 w-24 text-gray-500" />
              </div>
            </motion.div>

            {/* Robot Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-robot-slate rounded-lg p-6 shadow-lg"
            >
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">{robot.name}</h2>
                  <div className="flex items-center text-gray-400 mb-4">
                    <MapPin className="h-4 w-4 mr-2" />
                    {robot.location}
                  </div>
                  <div className="flex items-center mb-4">
                    <span className="bg-primary-500 text-white text-xs px-2 py-1 rounded">
                      {robot.category}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setIsFavorited(!isFavorited)}
                  className={`p-2 rounded-lg transition-all ${
                    isFavorited ? 'text-red-400 bg-red-900/20' : 'text-white hover:text-red-400'
                  }`}
                >
                  <Heart className={`h-6 w-6 ${isFavorited ? 'fill-current' : ''}`} />
                </button>
              </div>

              <p className="text-gray-300 mb-6">{robot.description}</p>

              {/* Specifications */}
              <div className="border-t border-primary-900/30 pt-6">
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
                {robot.features && robot.features.length > 0 && (
                  <div className="mt-4">
                    <span className="text-gray-400">Features:</span>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {robot.features.map((feature, index) => (
                        <span key={index} className="bg-robot-steel text-white text-xs px-2 py-1 rounded">
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Reviews */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-robot-slate rounded-lg p-6 shadow-lg"
            >
              <h3 className="text-lg font-semibold text-white mb-4">Reviews</h3>
              <div className="space-y-4">
                {reviews.map((review) => (
                  <div key={review.id} className="border-b border-primary-900/30 pb-4 last:border-b-0">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center">
                        <User className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-white font-medium">{review.user}</span>
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
              className="bg-robot-slate rounded-lg p-6 sticky top-6 shadow-lg"
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
                className={`w-full py-3 px-4 rounded-lg font-medium transition-all mb-4 ${
                  robot.isAvailable
                    ? 'bg-green-600 text-white hover:bg-green-700'
                    : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                }`}
                disabled={!robot.isAvailable}
              >
                {robot.isAvailable ? 'Rent Now' : 'Currently Rented'}
              </button>

              <button
                onClick={() => navigate('/messages')}
                className="w-full py-3 px-4 border border-primary-900/30 text-white rounded-lg hover:bg-robot-steel transition-all mb-4"
              >
                <MessageCircle className="h-4 w-4 inline mr-2" />
                Contact Owner
              </button>

              {/* Availability Info */}
              <div className="border-t border-primary-900/30 pt-4">
                <h4 className="text-white font-medium mb-3">Availability</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Min Rental:</span>
                    <span className="text-white">{robot.minRental} day{robot.minRental !== 1 ? 's' : ''}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Max Rental:</span>
                    <span className="text-white">{robot.maxRental} day{robot.maxRental !== 1 ? 's' : ''}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Pickup Time:</span>
                    <span className="text-white">{robot.pickupTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Return Time:</span>
                    <span className="text-white">{robot.returnTime}</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Owner Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-robot-slate rounded-lg p-6 shadow-lg"
            >
              <h4 className="text-white font-medium mb-4">Owner</h4>
              {owner ? (
                <div>
                  <div className="flex items-center mb-4">
                    {owner.avatar ? (
                      <img
                        src={owner.avatar}
                        alt={owner.firstName}
                        className="w-12 h-12 rounded-full object-cover mr-3"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-robot-steel rounded-full flex items-center justify-center mr-3">
                        <User className="h-6 w-6 text-gray-400" />
                      </div>
                    )}
                    <div>
                      <p className="text-white font-medium">
                        {owner.firstName} {owner.lastName}
                      </p>
                      <p className="text-gray-400 text-sm">
                        Member since {new Date(owner.createdAt).getFullYear()}
                      </p>
                    </div>
                  </div>

                  {owner.bio && (
                    <p className="text-gray-300 text-sm mb-4">{owner.bio}</p>
                  )}

                  {owner.location && (
                    <div className="flex items-center text-gray-400 text-sm mb-4">
                      <MapPin className="h-4 w-4 mr-2" />
                      {owner.location}
                    </div>
                  )}

                  <button
                    onClick={() => navigate('/messages')}
                    className="w-full bg-primary-500 text-white py-2 px-4 rounded-lg hover:bg-primary-600 transition-all flex items-center justify-center"
                  >
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Message Owner
                  </button>
                </div>
              ) : (
                <div className="flex items-center text-gray-400">
                  <div className="w-10 h-10 bg-robot-steel rounded-full flex items-center justify-center mr-3">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <div className="text-sm">Owner information unavailable</div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RobotDetailPage; 