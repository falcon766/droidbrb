import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { MessageCircle, Send, Search, User, Check, CheckCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { messageService } from '../services/messageService';
import { Message, User as UserType } from '../types';
import Navbar from '../components/Navbar';
import { C } from '../design';
import toast from 'react-hot-toast';

const MessagesPage: React.FC = () => {
  const { currentUser } = useAuth();
  const location = useLocation();

  // Read ?to= from React Router's location (primary) or window.location (fallback)
  const [initialRecipientId] = useState<string | null>(() => {
    const fromRouter = new URLSearchParams(location.search).get('to');
    if (fromRouter) return fromRouter;
    return new URLSearchParams(window.location.search).get('to');
  });

  const [conversations, setConversations] = useState<Message[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(initialRecipientId);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [recipientInfo, setRecipientInfo] = useState<UserType | null>(null);
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  // Clean up URL param on mount (cosmetic only — we already captured the value)
  useEffect(() => {
    if (initialRecipientId) {
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, [initialRecipientId]);

  // Look up recipient info from Firestore
  useEffect(() => {
    if (initialRecipientId) {
      messageService.getUserById(initialRecipientId).then(user => {
        if (user) setRecipientInfo(user);
      });
    }
  }, [initialRecipientId]);

  const fetchConversations = useCallback(async () => {
    if (!currentUser) return;
    try { setConversations(await messageService.getUserConversations(currentUser.uid)); }
    catch { toast.error('Failed to load conversations'); }
    finally { setLoading(false); }
  }, [currentUser]);

  useEffect(() => {
    if (currentUser) {
      fetchConversations();
      const unsubscribe = messageService.subscribeToMessages(currentUser.uid, () => {
        fetchConversations();
        if (selectedConversation) loadMessages(selectedConversation, false);
      });
      return () => unsubscribe();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser]);

  // When user clicks/selects a conversation, fetch messages AND mark as read
  useEffect(() => {
    if (selectedConversation && currentUser) {
      // Initial load: fetch and mark as read
      loadMessages(selectedConversation, true);
      // Polling: only fetch messages, do NOT mark as read (so badge stays until user re-selects)
      const intervalId = setInterval(() => loadMessages(selectedConversation, false), 3000);
      return () => clearInterval(intervalId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedConversation]);

  // Only auto-scroll if user is near the bottom (not browsing history)
  useEffect(() => {
    if (shouldAutoScroll && messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [messages, shouldAutoScroll]);

  const loadMessages = async (otherUserId: string, markRead: boolean) => {
    if (!currentUser) return;
    try {
      setMessages(await messageService.getConversation(currentUser.uid, otherUserId));
      if (markRead) {
        console.log('[MessagesPage] Marking conversation as read:', otherUserId);
        await messageService.markConversationAsRead(currentUser.uid, otherUserId);
      }
    } catch {
      // Silently handle — might be a new conversation with no messages yet
    }
  };

  const sendMessage = async () => {
    if (!currentUser || !selectedConversation || !newMessage.trim()) return;
    setSending(true);
    try {
      const conversation = conversations.find(c => c.senderId === selectedConversation || c.receiverId === selectedConversation);
      let receiverId: string;
      let receiverName: string;
      let receiverEmail: string;

      if (conversation) {
        receiverId = conversation.senderId === currentUser.uid ? conversation.receiverId : conversation.senderId;
        receiverName = conversation.senderId === currentUser.uid ? conversation.receiverName : conversation.senderName;
        receiverEmail = conversation.receiverEmail || '';
      } else if (recipientInfo) {
        receiverId = recipientInfo.id;
        receiverName = `${recipientInfo.firstName} ${recipientInfo.lastName}`;
        receiverEmail = recipientInfo.email || '';
      } else {
        receiverId = selectedConversation;
        receiverName = 'User';
        receiverEmail = '';
      }

      await messageService.createMessage(currentUser.uid, currentUser.displayName || 'User', {
        content: newMessage.trim(), receiverId, receiverName, receiverEmail,
      });
      setNewMessage('');
      setShouldAutoScroll(true);
      await fetchConversations();
      await loadMessages(selectedConversation, false);
      toast.success('Message sent!');
    } catch { toast.error('Failed to send message'); }
    finally { setSending(false); }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  const getConversationPartner = (m: Message) => m.senderId === currentUser?.uid ? m.receiverName : m.senderName;
  const getConversationPartnerId = (m: Message) => m.senderId === currentUser?.uid ? m.receiverId : m.senderId;

  const filteredConversations = conversations.filter(c => getConversationPartner(c).toLowerCase().includes(searchTerm.toLowerCase()));

  // Force re-render every 30 seconds so relative timestamps stay fresh
  const [, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick(t => t + 1), 30000);
    return () => clearInterval(id);
  }, []);

  const formatTime = (date: Date) => {
    const diff = Date.now() - date.getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    const h = Math.floor(diff / 3600000);
    if (h < 24) return `${h}h ago`;
    return date.toLocaleDateString();
  };

  const getSelectedPartnerName = () => {
    const c = conversations.find(c => getConversationPartnerId(c) === selectedConversation);
    if (c) return getConversationPartner(c);
    if (recipientInfo) return `${recipientInfo.firstName} ${recipientInfo.lastName}`;
    return 'User';
  };

  return (
    <div style={{ fontFamily: "'Satoshi', sans-serif", color: C.black, height: "100vh", display: "flex", flexDirection: "column" }}>
      <Helmet><title>Messages - DroidBRB</title></Helmet>
      <Navbar />

      <div style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0, overflow: "hidden" }}>
        {/* Header */}
        <div style={{ padding: "84px 48px 20px", background: C.black, flexShrink: 0 }}>
          <h1 style={{ fontSize: 24, fontWeight: 400, letterSpacing: "-0.02em", color: C.pureWhite }}>Messages</h1>
        </div>

        {/* Chat Layout */}
        <div style={{ flex: 1, display: "grid", gridTemplateColumns: "340px 1fr", overflow: "hidden", minHeight: 0 }}>
          {/* Conversations List */}
          <div style={{ borderRight: `1px solid ${C.gray100}`, background: C.pureWhite, display: "flex", flexDirection: "column" }}>
            <div style={{ padding: 16, borderBottom: `1px solid ${C.gray100}` }}>
              <div style={{ position: "relative" }}>
                <Search size={16} color={C.gray400} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)" }} />
                <input type="text" placeholder="Search conversations..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                  style={{ width: "100%", padding: "10px 14px 10px 38px", background: C.gray50, border: `1px solid ${C.gray100}`, borderRadius: 100, fontSize: 14, fontFamily: "inherit", color: C.black, outline: "none" }} />
              </div>
            </div>
            <div style={{ flex: 1, overflowY: "auto" }}>
              {loading ? (
                <div style={{ padding: 32, textAlign: "center" }}>
                  <div style={{ width: 32, height: 32, border: `3px solid ${C.gray200}`, borderTopColor: C.blue, borderRadius: "50%", margin: "0 auto", animation: "spin 0.8s linear infinite" }} />
                  <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                </div>
              ) : filteredConversations.length === 0 ? (
                <div style={{ padding: 32, textAlign: "center" }}>
                  <MessageCircle size={32} color={C.gray300} style={{ margin: "0 auto 12px" }} />
                  <h3 style={{ fontSize: 16, fontWeight: 500, marginBottom: 4 }}>No conversations</h3>
                  <p style={{ fontSize: 13, color: C.gray400 }}>Start by messaging a robot owner!</p>
                </div>
              ) : (
                filteredConversations.map((conversation) => {
                  const partnerId = getConversationPartnerId(conversation);
                  const partnerName = getConversationPartner(conversation);
                  const isSelected = selectedConversation === partnerId;
                  const isUnread = !conversation.isRead && conversation.senderId !== currentUser?.uid;
                  return (
                    <div key={conversation.id}
                      style={{
                        padding: "14px 16px", borderBottom: `1px solid ${C.gray100}`, cursor: "pointer",
                        background: isSelected ? C.gray50 : (isUnread ? "#f0f7ff" : "transparent"),
                        borderLeft: isUnread ? "3px solid #3b82f6" : "3px solid transparent",
                        transition: "background 0.15s",
                      }}
                      onClick={() => { setShouldAutoScroll(true); setSelectedConversation(partnerId); }}
                      onMouseEnter={e => { if (!isSelected) e.currentTarget.style.background = C.gray50; }}
                      onMouseLeave={e => { if (!isSelected) e.currentTarget.style.background = isUnread ? "#f0f7ff" : "transparent"; }}
                    >
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                          <div style={{ width: 36, height: 36, borderRadius: "50%", background: isUnread ? "#dbeafe" : C.gray50, border: `1px solid ${isUnread ? "#93c5fd" : C.gray100}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                            <User size={16} color={isUnread ? "#3b82f6" : C.gray400} />
                          </div>
                          <div style={{ minWidth: 0 }}>
                            <div style={{ fontSize: 14, fontWeight: isUnread ? 700 : 500, color: C.black }}>{partnerName}</div>
                            <div style={{ fontSize: 13, color: isUnread ? C.gray500 : C.gray400, fontWeight: isUnread ? 500 : 400, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: 180 }}>{conversation.content}</div>
                          </div>
                        </div>
                        <div style={{ textAlign: "right", flexShrink: 0, marginLeft: 8 }}>
                          <div style={{ fontSize: 11, color: isUnread ? "#3b82f6" : C.gray400, fontWeight: isUnread ? 600 : 400 }}>{formatTime(conversation.createdAt)}</div>
                          {isUnread && <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#ef4444", marginTop: 4, marginLeft: "auto" }} />}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Chat Area */}
          <div style={{ display: "flex", flexDirection: "column", background: C.white, minHeight: 0, overflow: "hidden" }}>
            {selectedConversation ? (
              <>
                {/* Chat Header */}
                <div style={{ padding: "14px 24px", borderBottom: `1px solid ${C.gray100}`, display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 36, height: 36, borderRadius: "50%", background: C.gray50, border: `1px solid ${C.gray100}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <User size={16} color={C.gray400} />
                  </div>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 500 }}>{getSelectedPartnerName()}</div>
                    <div style={{ fontSize: 12, color: C.gray400 }}>Online</div>
                  </div>
                </div>

                {/* Messages */}
                <div ref={messagesContainerRef} onScroll={() => {
                  const el = messagesContainerRef.current;
                  if (el) {
                    const nearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 80;
                    setShouldAutoScroll(nearBottom);
                  }
                }} style={{ flex: 1, overflowY: "auto", padding: 24, display: "flex", flexDirection: "column", gap: 12 }}>
                  {messages.length === 0 && (
                    <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <div style={{ textAlign: "center", padding: 32 }}>
                        <div style={{ width: 64, height: 64, borderRadius: "50%", background: C.gray50, border: `1px solid ${C.gray100}`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                          <MessageCircle size={28} color={C.gray400} />
                        </div>
                        <h3 style={{ fontSize: 17, fontWeight: 500, marginBottom: 6 }}>New conversation with {getSelectedPartnerName()}</h3>
                        <p style={{ fontSize: 14, color: C.gray400, marginBottom: 4 }}>Type your message below to get started</p>
                      </div>
                    </div>
                  )}
                  {messages.map((message) => {
                    const isOwn = message.senderId === currentUser?.uid;
                    return (
                      <div key={message.id} style={{ display: "flex", justifyContent: isOwn ? "flex-end" : "flex-start" }}>
                        <div style={{
                          maxWidth: 400, padding: "10px 16px", borderRadius: 16,
                          background: isOwn ? C.blue : C.gray50,
                          color: isOwn ? C.pureWhite : C.black,
                        }}>
                          <p style={{ fontSize: 14, lineHeight: 1.5 }}>{message.content}</p>
                          <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 4, marginTop: 4 }}>
                            <span style={{ fontSize: 11, color: isOwn ? "rgba(255,255,255,0.6)" : C.gray400 }}>{formatTime(message.createdAt)}</span>
                            {isOwn && <span style={{ color: "rgba(255,255,255,0.6)" }}>{message.isRead ? <CheckCheck size={13} /> : <Check size={13} />}</span>}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div style={{ padding: "16px 24px", borderTop: `1px solid ${C.gray100}`, display: "flex", gap: 12, alignItems: "flex-end" }}>
                  <textarea value={newMessage} onChange={e => setNewMessage(e.target.value)} onKeyPress={handleKeyPress}
                    placeholder="Type your message..." rows={1} disabled={sending}
                    style={{ flex: 1, padding: "12px 16px", background: C.gray50, border: `1px solid ${C.gray100}`, borderRadius: 100, fontSize: 14, fontFamily: "inherit", color: C.black, outline: "none", resize: "none" }} />
                  <button onClick={sendMessage} disabled={!newMessage.trim() || sending}
                    style={{
                      width: 44, height: 44, borderRadius: "50%", background: (!newMessage.trim() || sending) ? C.gray200 : C.blue,
                      color: C.pureWhite, border: "none", cursor: (!newMessage.trim() || sending) ? "not-allowed" : "pointer",
                      display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.25s", flexShrink: 0,
                    }}>
                    <Send size={16} />
                  </button>
                </div>
              </>
            ) : (
              <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div style={{ textAlign: "center" }}>
                  <MessageCircle size={48} color={C.gray300} style={{ margin: "0 auto 16px" }} />
                  <h3 style={{ fontSize: 20, fontWeight: 500, marginBottom: 8 }}>Select a conversation</h3>
                  <p style={{ fontSize: 14, color: C.gray400 }}>Choose from the list to start messaging</p>
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
