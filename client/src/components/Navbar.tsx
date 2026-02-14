import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Menu, X, User, LogOut, MessageSquare, Plus, Settings } from 'lucide-react';
import { messageService } from '../services/messageService';

const Navbar: React.FC = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [scrolled, setScrolled] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (currentUser) {
      const fetchUnreadCount = async () => {
        const count = await messageService.getUnreadCount(currentUser.uid);
        setUnreadCount(count);
      };
      fetchUnreadCount();
      const unsubscribe = messageService.subscribeToMessages(currentUser.uid, () => { fetchUnreadCount(); });
      const intervalId = setInterval(fetchUnreadCount, 10000);
      return () => { unsubscribe(); clearInterval(intervalId); };
    }
  }, [currentUser]);

  return (
    <nav className={`sticky top-0 z-50 border-b transition-all duration-300 ${
      scrolled ? 'navbar-glass border-primary-900/30' : 'bg-robot-dark/95 border-primary-900/20'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2.5 group">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-400 to-primary-600 rounded-lg flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow duration-300">
                <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <rect x="3" y="4" width="18" height="14" rx="3" ry="3" opacity="0.9"/>
                  <rect x="7" y="7" width="3" height="5.5" rx="1.5" fill="#111"/>
                  <rect x="14" y="7" width="3" height="5.5" rx="1.5" fill="#111"/>
                  <rect x="1" y="8" width="2.5" height="5" rx="1.25"/>
                  <rect x="20.5" y="8" width="2.5" height="5" rx="1.25"/>
                </svg>
              </div>
              <span className="text-lg font-semibold text-gray-100 tracking-tight">
                Droid<span className="text-primary-400">BRB</span>
              </span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-1">
            <Link to="/" className="text-gray-400 hover:text-gray-100 px-3 py-2 rounded-lg text-sm font-medium">Home</Link>
            <Link to="/robots" className="text-gray-400 hover:text-gray-100 px-3 py-2 rounded-lg text-sm font-medium">Browse</Link>

            {currentUser ? (
              <>
                <Link to="/create-robot" className="text-gray-400 hover:text-gray-100 px-3 py-2 rounded-lg text-sm font-medium flex items-center space-x-1.5">
                  <Plus className="w-3.5 h-3.5" /><span>List Robot</span>
                </Link>
                <Link to="/messages" className="relative text-gray-400 hover:text-gray-100 px-3 py-2 rounded-lg text-sm font-medium flex items-center space-x-1.5">
                  <MessageSquare className="w-3.5 h-3.5" /><span>Messages</span>
                  {unreadCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] px-1 flex items-center justify-center shadow-sm">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </Link>
                <div className="relative group ml-2">
                  <button className="flex items-center space-x-2 text-gray-400 hover:text-gray-100 px-3 py-2 rounded-lg text-sm font-medium">
                    <div className="w-6 h-6 bg-robot-slate rounded-full flex items-center justify-center border border-primary-900/30">
                      <User className="w-3.5 h-3.5" />
                    </div>
                    <span className="max-w-[120px] truncate">{currentUser.displayName || currentUser.email}</span>
                  </button>
                  <div className="absolute right-0 mt-1 w-52 bg-robot-slate border border-primary-900/30 rounded-xl shadow-xl py-1.5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <Link to="/dashboard" className="flex items-center space-x-2.5 px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-robot-steel/50">
                      <User className="w-4 h-4 text-gray-500" /><span>Dashboard</span>
                    </Link>
                    <Link to="/profile" className="flex items-center space-x-2.5 px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-robot-steel/50">
                      <Settings className="w-4 h-4 text-gray-500" /><span>Edit Profile</span>
                    </Link>
                    <div className="my-1 border-t border-primary-900/30" />
                    <button onClick={handleLogout} className="w-full flex items-center space-x-2.5 px-4 py-2.5 text-sm text-gray-300 hover:text-red-400 hover:bg-robot-steel/50">
                      <LogOut className="w-4 h-4 text-gray-500" /><span>Logout</span>
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-3 ml-2">
                <Link to="/login" className="text-gray-400 hover:text-gray-100 px-3 py-2 rounded-lg text-sm font-medium">Sign In</Link>
                <Link to="/register" className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-md">Get Started</Link>
              </div>
            )}
          </div>

          <div className="md:hidden flex items-center">
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-gray-400 hover:text-gray-100 p-2 rounded-lg">
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-primary-900/30">
          <div className="px-3 py-3 space-y-1 bg-robot-slate/95 backdrop-blur-lg">
            <Link to="/" className="text-gray-300 hover:text-white hover:bg-robot-steel/50 block px-3 py-2.5 rounded-lg text-sm font-medium" onClick={() => setIsMobileMenuOpen(false)}>Home</Link>
            <Link to="/robots" className="text-gray-300 hover:text-white hover:bg-robot-steel/50 block px-3 py-2.5 rounded-lg text-sm font-medium" onClick={() => setIsMobileMenuOpen(false)}>Browse Robots</Link>
            {currentUser ? (
              <>
                <Link to="/create-robot" className="text-gray-300 hover:text-white hover:bg-robot-steel/50 block px-3 py-2.5 rounded-lg text-sm font-medium flex items-center space-x-2" onClick={() => setIsMobileMenuOpen(false)}>
                  <Plus className="w-4 h-4 text-gray-500" /><span>List Robot</span>
                </Link>
                <Link to="/messages" className="text-gray-300 hover:text-white hover:bg-robot-steel/50 block px-3 py-2.5 rounded-lg text-sm font-medium flex items-center space-x-2" onClick={() => setIsMobileMenuOpen(false)}>
                  <MessageSquare className="w-4 h-4 text-gray-500" /><span>Messages</span>
                  {unreadCount > 0 && (<span className="bg-red-500 text-white text-[10px] font-bold rounded-full px-1.5 py-0.5 ml-auto">{unreadCount > 9 ? '9+' : unreadCount}</span>)}
                </Link>
                <Link to="/dashboard" className="text-gray-300 hover:text-white hover:bg-robot-steel/50 block px-3 py-2.5 rounded-lg text-sm font-medium flex items-center space-x-2" onClick={() => setIsMobileMenuOpen(false)}>
                  <User className="w-4 h-4 text-gray-500" /><span>Dashboard</span>
                </Link>
                <Link to="/profile" className="text-gray-300 hover:text-white hover:bg-robot-steel/50 block px-3 py-2.5 rounded-lg text-sm font-medium flex items-center space-x-2" onClick={() => setIsMobileMenuOpen(false)}>
                  <Settings className="w-4 h-4 text-gray-500" /><span>Edit Profile</span>
                </Link>
                <div className="my-1 border-t border-primary-900/30" />
                <button onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }} className="w-full text-left text-gray-300 hover:text-red-400 hover:bg-robot-steel/50 block px-3 py-2.5 rounded-lg text-sm font-medium flex items-center space-x-2">
                  <LogOut className="w-4 h-4 text-gray-500" /><span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-300 hover:text-white hover:bg-robot-steel/50 block px-3 py-2.5 rounded-lg text-sm font-medium" onClick={() => setIsMobileMenuOpen(false)}>Sign In</Link>
                <Link to="/register" className="bg-primary-500 hover:bg-primary-600 text-white block px-3 py-2.5 rounded-lg text-sm font-medium text-center shadow-md" onClick={() => setIsMobileMenuOpen(false)}>Get Started</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
