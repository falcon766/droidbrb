import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Bot, Users, Zap, Shield, Heart, Globe } from 'lucide-react';
import Navbar from '../components/Navbar';

const AboutPage: React.FC = () => {
  const features = [
    {
      icon: Users,
      title: 'Community Driven',
      description: 'Connect with robotics enthusiasts in your local area. Share knowledge, experiences, and passion for robotics.'
    },
    {
      icon: Zap,
      title: 'Easy to Use',
      description: 'List your robot in minutes. Browse and rent robots with just a few clicks. Simple, fast, and intuitive.'
    },
    {
      icon: Shield,
      title: 'Safe & Secure',
      description: 'Verified users, secure messaging, and trusted community guidelines keep everyone safe.'
    },
    {
      icon: Heart,
      title: 'Passion for Robotics',
      description: 'Built by robot enthusiasts, for robot enthusiasts. We understand your love for automation and innovation.'
    },
    {
      icon: Globe,
      title: 'Local Focus',
      description: 'Find robots near you. Meet owners in person. Build real connections in your community.'
    },
    {
      icon: Bot,
      title: 'All Types Welcome',
      description: 'Educational, industrial, hobby, service robots, and more. Every robot has a place here.'
    }
  ];

  return (
    <>
      <Helmet>
        <title>About DroidBRB - Share, Rent, and Discover Robots</title>
        <meta name="description" content="Learn about DroidBRB, the community-driven platform for sharing and renting robots locally." />
      </Helmet>

      <div className="min-h-screen bg-gray-900">
        <Navbar />

        {/* Hero Section */}
        <section className="bg-gradient-to-b from-gray-800 to-gray-900 py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-300 via-blue-400 to-blue-500 bg-clip-text text-transparent mb-6">
                About DroidBRB
              </h1>
              <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                We're building the world's first peer-to-peer robotics sharing platform. 
                A place where robot enthusiasts can connect, share, and explore the fascinating world of robotics together.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-900">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="bg-gray-800 rounded-lg p-8 md:p-12"
            >
              <h2 className="text-3xl font-bold text-white mb-6">Our Mission</h2>
              <p className="text-gray-300 text-lg leading-relaxed mb-4">
                Robotics should be accessible to everyone. Whether you're a student learning programming, 
                a hobbyist exploring automation, or a professional testing new technology, you shouldn't 
                have to spend thousands of dollars to get hands-on experience.
              </p>
              <p className="text-gray-300 text-lg leading-relaxed">
                DroidBRB makes robotics accessible by connecting people who own robots with those who 
                want to learn, experiment, or simply try before they buy. We're fostering a community 
                where knowledge and resources are shared freely.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Why Choose DroidBRB?
              </h2>
              <p className="text-xl text-gray-300">
                Built with the robotics community in mind
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-gray-800 rounded-lg p-6 hover:bg-gray-750 transition-colors"
                >
                  <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-4">
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                  <p className="text-gray-300 leading-relaxed">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-800">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                How It Works
              </h2>
              <p className="text-xl text-gray-300">
                Getting started is simple
              </p>
            </motion.div>

            <div className="space-y-8">
              {[
                {
                  step: '1',
                  title: 'Create Your Account',
                  description: 'Sign up in seconds with your email or Google account.'
                },
                {
                  step: '2',
                  title: 'List Your Robot or Browse',
                  description: 'Share your robot with the community or search for robots near you.'
                },
                {
                  step: '3',
                  title: 'Connect & Arrange',
                  description: 'Message owners directly to discuss details and arrange meetups or rentals.'
                }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.2 }}
                  viewport={{ once: true }}
                  className="flex items-start"
                >
                  <div className="flex-shrink-0 w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl mr-4">
                    {item.step}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">{item.title}</h3>
                    <p className="text-gray-300">{item.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Ready to Join the Community?
              </h2>
              <p className="text-xl text-gray-300 mb-8">
                Start sharing and exploring robots today
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/register"
                  className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors text-lg font-medium"
                >
                  Get Started Free
                </Link>
                <Link
                  to="/robots"
                  className="bg-gray-700 text-white px-8 py-3 rounded-lg hover:bg-gray-600 transition-colors text-lg font-medium"
                >
                  Browse Robots
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
};

export default AboutPage;

