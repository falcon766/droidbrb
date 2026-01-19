import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  MessageCircle,
  Send,
  ArrowLeft,
  Search,
  User,
  Check,
  CheckCheck
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { messageService } from '../services/messageService';
import { Message } from '../types';
import toast from 'react-hot-toast';

const MessagesPage: React.FC = () => {
  const { currentUser } = useAuth();
  const [conversations, setConversations] = useState<Message[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (currentUser) {
      fetchConversations();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser]);

  useEffect(() => {
    if (selectedConversation) {
      fetchMessages(selectedConversation);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedConversation]);

  const fetchConversations = async () => {
    if (!currentUser) return;
    
    try {
      const conversations = await messageService.getUserConversations(currentUser.uid);
      setConversations(conversations);
    } catch (error) {
      console.error('Error fetching conversations:', error);
      toast.error('Failed to load conversations');
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (otherUserId: string) => {
    if (!currentUser) return;
    
    try {
      const messages = await messageService.getConversation(currentUser.uid, otherUserId);
      setMessages(messages);
      
      // Mark conversation as read
      await messageService.markConversationAsRead(currentUser.uid, otherUserId);
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast.error('Failed to load messages');
    }
  };

  const sendMessage = async () => {
    if (!currentUser || !selectedConversation || !newMessage.trim()) return;

    setSending(true);
    try {
      // Find the conversation to get receiver info
      const conversation = conversations.find(c => 
        c.senderId === selectedConversation || c.receiverId === selectedConversation
      );

      if (!conversation) {
        toast.error('Conversation not found');
        return;
      }

      const receiverId = conversation.senderId === currentUser.uid
        ? conversation.receiverId
        : conversation.senderId;

      const receiverName = conversation.senderId === currentUser.uid
        ? conversation.receiverName
        : conversation.senderName;

      await messageService.createMessage(
        currentUser.uid,
        currentUser.displayName || 'User',
        {
          content: newMessage.trim(),
          receiverId,
          receiverName,
          receiverEmail: conversation.receiverEmail || '',
        }
      );

      setNewMessage('');
      
      // Refresh messages
      await fetchMessages(selectedConversation);
      
      toast.success('Message sent!');
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    } finally {
      setSending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const getConversationPartner = (message: Message) => {
    if (message.senderId === currentUser?.uid) {
      return message.receiverName;
    }
    return message.senderName;
  };

  const getConversationPartnerId = (message: Message) => {
    if (message.senderId === currentUser?.uid) {
      return message.receiverId;
    }
    return message.senderId;
  };

  const filteredConversations = conversations.filter(conversation => {
    const partnerName = getConversationPartner(conversation);
    return partnerName.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const formatTime = (date: Date) => {
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <div className="min-h-screen bg-robot-dark">
      {/* Header */}
      <div className="bg-robot-slate border-b border-primary-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Link
                to="/dashboard"
                className="inline-flex items-center text-primary-400 hover:text-primary-300 transition-all mr-4"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Link>
              <h1 className="text-3xl font-bold text-white">Messages</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
          {/* Conversations List */}
          <div className="lg:col-span-1 bg-robot-slate rounded-lg overflow-hidden">
            <div className="p-4 border-b border-primary-900/30">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search conversations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-robot-steel text-white rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                />
              </div>
            </div>

            <div className="overflow-y-auto h-[calc(100%-80px)]">
              {loading ? (
                <div className="p-4 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mx-auto"></div>
                </div>
              ) : filteredConversations.length === 0 ? (
                <div className="p-8 text-center">
                  <MessageCircle className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-2">No conversations yet</h3>
                  <p className="text-gray-400">Start a conversation by messaging another user!</p>
                </div>
              ) : (
                filteredConversations.map((conversation) => {
                  const partnerId = getConversationPartnerId(conversation);
                  const partnerName = getConversationPartner(conversation);
                  const isSelected = selectedConversation === partnerId;

                  return (
                    <motion.div
                      key={conversation.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`p-4 border-b border-primary-900/30 cursor-pointer hover:bg-robot-steel transition-all ${
                        isSelected ? 'bg-robot-steel' : ''
                      }`}
                      onClick={() => setSelectedConversation(partnerId)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center">
                            <User className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <h4 className="text-white font-medium">{partnerName}</h4>
                            <p className="text-gray-400 text-sm truncate max-w-[150px]">
                              {conversation.content}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-gray-400 text-xs">
                            {formatTime(conversation.createdAt)}
                          </p>
                          {!conversation.isRead && conversation.senderId !== currentUser?.uid && (
                            <div className="w-2 h-2 bg-primary-500 rounded-full mt-1 ml-auto shadow-sm"></div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </div>
          </div>

          {/* Chat Area */}
          <div className="lg:col-span-2 bg-robot-slate rounded-lg overflow-hidden flex flex-col">
            {selectedConversation ? (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b border-primary-900/30">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center">
                      <User className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-white font-medium">
                        {(() => {
                          const conv = conversations.find(c =>
                            getConversationPartnerId(c) === selectedConversation
                          );
                          return conv ? getConversationPartner(conv) : 'User';
                        })()}
                      </h3>
                      <p className="text-gray-400 text-sm">Online</p>
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.map((message) => {
                    const isOwnMessage = message.senderId === currentUser?.uid;

                    return (
                      <motion.div
                        key={message.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg transition-all ${
                          isOwnMessage
                            ? 'bg-primary-500 text-white shadow-md'
                            : 'bg-robot-steel text-white'
                        }`}>
                          <p className="text-sm">{message.content}</p>
                          <div className={`flex items-center justify-between mt-1 ${
                            isOwnMessage ? 'text-primary-200' : 'text-gray-400'
                          }`}>
                            <span className="text-xs">
                              {formatTime(message.createdAt)}
                            </span>
                            {isOwnMessage && (
                              <span className="text-xs ml-2">
                                {message.isRead ? <CheckCheck className="h-3 w-3" /> : <Check className="h-3 w-3" />}
                              </span>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Message Input */}
                <div className="p-4 border-t border-primary-900/30">
                  <div className="flex space-x-4">
                    <textarea
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Type your message..."
                      className="flex-1 bg-robot-steel text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none transition-all"
                      rows={1}
                      disabled={sending}
                    />
                    <button
                      onClick={sendMessage}
                      disabled={!newMessage.trim() || sending}
                      className="bg-primary-500 text-white px-6 py-3 rounded-lg hover:bg-primary-600 hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                    >
                      {sending ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      ) : (
                        <Send className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <MessageCircle className="h-16 w-16 text-gray-500 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">Select a conversation</h3>
                  <p className="text-gray-400">Choose a conversation from the list to start messaging</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessagesPage; 