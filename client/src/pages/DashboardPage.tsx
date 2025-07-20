import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Bot, 
  Plus,
  Calendar,
  DollarSign,
  Star,
  MessageCircle,
  Settings,
  LogOut,
  User,
  MapPin,
  Heart
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const DashboardPage: React.FC = () => {
  const { currentUser, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  const myRobots = [
    {
      id: '1',
      name: 'Loona Pet Robot',
      category: 'Educational',
      price: 25,
      location: 'Manhattan Beach, CA',
      status: 'available',
      earnings: 150,
      rentals: 6
    },
    {
      id: '2',
      name: 'LOOI Robot',
      category: 'Educational',
      price: 15,
      location: 'Los Angeles, CA',
      status: 'rented',
      earnings: 75,
      rentals: 5
    }
  ];

  const recentRentals = [
    {
      id: '1',
      robotName: 'Loona Pet Robot',
      renter: 'Alex Chen',
      startDate: '2024-01-15',
      endDate: '2024-01-17',
      total: 75,
      status: 'completed'
    },
    {
      id: '2',
      robotName: 'LOOI Robot',
      renter: 'Maria Rodriguez',
      startDate: '2024-01-20',
      endDate: '2024-01-22',
      total: 45,
      status: 'active'
    }
  ];

  const stats = [
    { label: 'Total Earnings', value: '$225', icon: DollarSign, color: 'text-green-400' },
    { label: 'Active Rentals', value: '2', icon: Calendar, color: 'text-blue-400' },
    { label: 'Total Rentals', value: '11', icon: Bot, color: 'text-purple-400' },
    { label: 'Average Rating', value: '4.8', icon: Star, color: 'text-yellow-400' }
  ];

  const tabs = [
    { id: 'overview', name: 'Overview', icon: Bot },
    { id: 'my-robots', name: 'My Robots', icon: Bot },
    { id: 'rentals', name: 'Rentals', icon: Calendar },
    { id: 'messages', name: 'Messages', icon: MessageCircle },
    { id: 'settings', name: 'Settings', icon: Settings }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-gray-800 rounded-lg p-6"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">{stat.label}</p>
                      <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                    </div>
                    <stat.icon className={`h-8 w-8 ${stat.color}`} />
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Recent Activity */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Recent Activity</h3>
              <div className="space-y-4">
                {recentRentals.slice(0, 3).map((rental) => (
                  <div key={rental.id} className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                    <div>
                      <p className="text-white font-medium">{rental.robotName}</p>
                      <p className="text-gray-400 text-sm">Rented by {rental.renter}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-white font-medium">${rental.total}</p>
                      <span className={`text-xs px-2 py-1 rounded ${
                        rental.status === 'completed' 
                          ? 'bg-green-600 text-white' 
                          : 'bg-blue-600 text-white'
                      }`}>
                        {rental.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'my-robots':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-white">My Robots</h3>
              <Link
                to="/create-robot"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Robot
              </Link>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              {myRobots.map((robot) => (
                <div key={robot.id} className="bg-gray-800 rounded-lg p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="text-white font-semibold">{robot.name}</h4>
                      <div className="flex items-center text-gray-400 text-sm mt-1">
                        <MapPin className="h-4 w-4 mr-1" />
                        {robot.location}
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs ${
                      robot.status === 'available' 
                        ? 'bg-green-600 text-white' 
                        : 'bg-orange-600 text-white'
                    }`}>
                      {robot.status}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-400">Daily Rate:</span>
                      <p className="text-white font-medium">${robot.price}</p>
                    </div>
                    <div>
                      <span className="text-gray-400">Total Earnings:</span>
                      <p className="text-white font-medium">${robot.earnings}</p>
                    </div>
                    <div>
                      <span className="text-gray-400">Total Rentals:</span>
                      <p className="text-white font-medium">{robot.rentals}</p>
                    </div>
                    <div>
                      <span className="text-gray-400">Category:</span>
                      <p className="text-white font-medium">{robot.category}</p>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <button className="flex-1 bg-gray-700 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors">
                      Edit
                    </button>
                    <button className="flex-1 bg-gray-700 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors">
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'rentals':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-white">Rental History</h3>
            <div className="bg-gray-800 rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Robot
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Renter
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Dates
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Total
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                    {recentRentals.map((rental) => (
                      <tr key={rental.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-white font-medium">{rental.robotName}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-gray-300">{rental.renter}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-gray-300">
                            {rental.startDate} - {rental.endDate}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-white font-medium">${rental.total}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 rounded text-xs ${
                            rental.status === 'completed' 
                              ? 'bg-green-600 text-white' 
                              : 'bg-blue-600 text-white'
                          }`}>
                            {rental.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      case 'messages':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-white">Messages</h3>
            <div className="bg-gray-800 rounded-lg p-6">
              <p className="text-gray-400">No new messages</p>
            </div>
          </div>
        );

      case 'settings':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-white">Settings</h3>
            <div className="bg-gray-800 rounded-lg p-6">
              <p className="text-gray-400">Settings coming soon...</p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-white">Dashboard</h1>
              <p className="text-gray-300">Welcome back, {currentUser?.displayName || 'User'}!</p>
            </div>
            <button
              onClick={logout}
              className="flex items-center text-gray-400 hover:text-white transition-colors"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-gray-800 rounded-lg p-6">
              {/* User Info */}
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center mr-3">
                  <User className="h-6 w-6 text-gray-400" />
                </div>
                <div>
                  <p className="text-white font-medium">{currentUser?.displayName || 'User'}</p>
                  <p className="text-gray-400 text-sm">{currentUser?.email}</p>
                </div>
              </div>

              {/* Navigation Tabs */}
              <nav className="space-y-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors ${
                      activeTab === tab.id
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-400 hover:text-white hover:bg-gray-700'
                    }`}
                  >
                    <tab.icon className="h-5 w-5 mr-3" />
                    {tab.name}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {renderTabContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage; 