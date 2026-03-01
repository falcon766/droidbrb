import React, { useState, useEffect } from 'react';
import { MessageCircle, Send, Search, User, Check, CheckCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { messageService } from '../services/messageService';
import { Message } from '../types';
import Navbar from '../components/Navbar';
import { C } from '../design';
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
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (currentUser) {
      fetchConversations();
      const unsubscribe = messageService.subscribeToMessages(currentUser.uid, () => {
        fetchConversations();
        if (selectedConversation) fetchMessages(selectedConversation);
      });
      return () => unsubscribe();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser]);

  useEffect(() => {
    if (selectedConversation && currentUser) {
      fetchMessages(selectedConversation);
      const intervalId = setInterval(() => fetchMessages(selectedConversation), 3000);
      return () => clearInterval(intervalId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedConversation]);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); }, [messages]);

  const fetchConversations = async () => {
    if (!currentUser) return;
    try { setConversations(await messageService.getUserConversations(currentUser.uid)); }
    catch { toast.error('Failed to load conversations'); }
    finally { setLoading(false); }
  };

  const fetchMessages = async (otherUserId: string) => {
    if (!currentUser) return;
    try {
      setMessages(await messageService.getConversation(currentUser.uid, otherUserId));
      await messageService.markConversationAsRead(currentUser.uid, otherUserId);
    } catch { toast.error('Failed to load messages'); }
  };

  const sendMessage = async () => {
    if (!currentUser || !selectedConversation || !newMessage.trim()) return;
    setSending(true);
    try {
      const conversation = conversations.find(c => c.senderId === selectedConversation || c.receiverId === selectedConversation);
      if (!conversation) { toast.error('Conversation not found'); return; }
      const receiverId = conversation.senderId === currentUser.uid ? conversation.receiverId : conversation.senderId;
      const receiverName = conversation.senderId === currentUser.uid ? conversation.receiverName : conversation.senderName;
      await messageService.createMessage(currentUser.uid, currentUser.displayName || 'User', {
        content: newMessage.trim(), receiverId, receiverName, receiverEmail: conversation.receiverEmail || '',
      });
      setNewMessage('');
      await fetchMessages(selectedConversation);
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

  const formatTime = (date: Date) => {
    const h = (Date.now() - date.getTime()) / 3600000;
    if (h < 1) return 'Just now';
    if (h < 24) return `${Math.floor(h)}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <div style={{ fontFamily: "'Satoshi', sans-serif", color: C.black, height: "100vh", display: "flex", flexDirection: "column" }}>
      <Navbar />

      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {/* Header */}
        <div style={{ padding: "84px 48px 20px", background: C.black }}>
          <h1 style={{ fontSize: 24, fontWeight: 400, letterSpacing: "-0.02em", color: C.pureWhite }}>Messages</h1>
        </div>

        {/* Chat Layout */}
        <div style={{ flex: 1, display: "grid", gridTemplateColumns: "340px 1fr", overflow: "hidden" }}>
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
                        background: isSelected ? C.gray50 : "transparent", transition: "background 0.15s",
                      }}
                      onClick={() => setSelectedConversation(partnerId)}
                      onMouseEnter={e => { if (!isSelected) e.currentTarget.style.background = C.gray50; }}
                      onMouseLeave={e => { if (!isSelected) e.currentTarget.style.background = "transparent"; }}
                    >
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                          <div style={{ width: 36, height: 36, borderRadius: "50%", background: C.gray50, border: `1px solid ${C.gray100}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                            <User size={16} color={C.gray400} />
                          </div>
                          <div style={{ minWidth: 0 }}>
                            <div style={{ fontSize: 14, fontWeight: isUnread ? 700 : 500, color: C.black }}>{partnerName}</div>
                            <div style={{ fontSize: 13, color: C.gray400, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: 180 }}>{conversation.content}</div>
                          </div>
                        </div>
                        <div style={{ textAlign: "right", flexShrink: 0, marginLeft: 8 }}>
                          <div style={{ fontSize: 11, color: C.gray400 }}>{formatTime(conversation.createdAt)}</div>
                          {isUnread && <div style={{ width: 8, height: 8, borderRadius: "50%", background: C.blue, marginTop: 4, marginLeft: "auto" }} />}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Chat Area */}
          <div style={{ display: "flex", flexDirection: "column", background: C.white }}>
            {selectedConversation ? (
              <>
                {/* Chat Header */}
                <div style={{ padding: "14px 24px", borderBottom: `1px solid ${C.gray100}`, display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 36, height: 36, borderRadius: "50%", background: C.gray50, border: `1px solid ${C.gray100}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <User size={16} color={C.gray400} />
                  </div>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 500 }}>
                      {(() => { const c = conversations.find(c => getConversationPartnerId(c) === selectedConversation); return c ? getConversationPartner(c) : 'User'; })()}
                    </div>
                    <div style={{ fontSize: 12, color: C.gray400 }}>Online</div>
                  </div>
                </div>

                {/* Messages */}
                <div style={{ flex: 1, overflowY: "auto", padding: 24, display: "flex", flexDirection: "column", gap: 12 }}>
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
