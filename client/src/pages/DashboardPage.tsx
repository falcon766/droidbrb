import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, MapPin, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { robotService } from '../services/robotService';
import { messageService } from '../services/messageService';
import { Robot } from '../types';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import RobotLogo from '../components/RobotLogo';
import { C } from '../design';

const DashboardPage: React.FC = () => {
  const { currentUser, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [myRobots, setMyRobots] = useState<Robot[]>([]);
  const [loading, setLoading] = useState(true);
  const [unreadMessages, setUnreadMessages] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      if (currentUser) {
        try {
          const [robots, unreadCount] = await Promise.all([
            robotService.getRobotsByOwner(currentUser.uid),
            messageService.getUnreadCount(currentUser.uid),
          ]);
          setMyRobots(robots);
          setUnreadMessages(unreadCount);
        } catch (error) { console.error('Error fetching data:', error); }
        finally { setLoading(false); }
      }
    };
    fetchData();
  }, [currentUser]);

  const stats = [
    { label: 'My Robots', value: myRobots.length.toString() },
    { label: 'Active Rentals', value: '0' },
    { label: 'Total Rentals', value: '0' },
    { label: 'Messages', value: unreadMessages.toString() },
  ];

  const tabs = [
    { id: 'overview', name: 'Overview' },
    { id: 'my-robots', name: 'My Robots' },
    { id: 'rentals', name: 'Rentals' },
    { id: 'messages', name: 'Messages' },
  ];

  const cardStyle: React.CSSProperties = { background: C.pureWhite, border: `1px solid ${C.gray100}`, borderRadius: 12, padding: 24 };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            {/* Stats */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
              {stats.map((stat) => (
                <div key={stat.label} style={cardStyle}>
                  <div style={{ fontSize: 13, fontWeight: 500, color: C.gray400, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>{stat.label}</div>
                  <div style={{ fontSize: 28, fontWeight: 700 }}>{stat.value}</div>
                </div>
              ))}
            </div>
            {/* Recent */}
            <div style={cardStyle}>
              <h3 style={{ fontSize: 18, fontWeight: 500, marginBottom: 20, letterSpacing: "-0.01em" }}>Recent Activity</h3>
              {myRobots.length === 0 ? (
                <p style={{ fontSize: 14, color: C.gray400, textAlign: "center", padding: "32px 0" }}>No robots listed yet. Create your first listing!</p>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {myRobots.slice(0, 3).map((robot) => (
                    <div key={robot.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 16px", background: C.gray50, borderRadius: 10 }}>
                      <div>
                        <div style={{ fontSize: 15, fontWeight: 500 }}>{robot.name}</div>
                        <div style={{ fontSize: 13, color: C.gray400 }}>{robot.category} &middot; ${robot.price}/day</div>
                      </div>
                      <span style={{ fontSize: 12, fontWeight: 500, color: robot.isAvailable ? C.blue : C.gray400, padding: "4px 12px", borderRadius: 100, border: `1px solid ${robot.isAvailable ? C.blue : C.gray200}` }}>
                        {robot.isAvailable ? 'Available' : 'Rented'}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        );

      case 'my-robots':
        return (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
              <h3 style={{ fontSize: 18, fontWeight: 500, letterSpacing: "-0.01em" }}>My Robots</h3>
              <Link to="/create-robot" style={{ padding: "10px 24px", borderRadius: 100, fontSize: 14, fontWeight: 500, background: C.blue, color: C.pureWhite, border: "none", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6 }}>
                <Plus size={16} /> Add Robot
              </Link>
            </div>
            {loading ? (
              <p style={{ color: C.gray400, textAlign: "center", padding: 32 }}>Loading...</p>
            ) : myRobots.length === 0 ? (
              <div style={{ ...cardStyle, textAlign: "center", padding: "48px 24px" }}>
                <RobotLogo color={C.gray300} size={36} />
                <p style={{ fontSize: 15, color: C.gray400, marginTop: 16, marginBottom: 20 }}>You haven't listed any robots yet.</p>
                <Link to="/create-robot" style={{ padding: "10px 24px", borderRadius: 100, fontSize: 14, fontWeight: 500, background: C.blue, color: C.pureWhite, textDecoration: "none" }}>List Your First Robot</Link>
              </div>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                {myRobots.map((robot) => (
                  <div key={robot.id} style={cardStyle}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                      <div>
                        <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>{robot.name}</div>
                        <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 13, color: C.gray400 }}><MapPin size={12} /> {robot.location}</div>
                      </div>
                      <span style={{ fontSize: 12, fontWeight: 500, color: robot.isAvailable ? C.blue : C.gray400, padding: "4px 12px", borderRadius: 100, border: `1px solid ${robot.isAvailable ? C.blue : C.gray200}` }}>
                        {robot.isAvailable ? 'Available' : 'Rented'}
                      </span>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, fontSize: 13, marginBottom: 16 }}>
                      <div><span style={{ color: C.gray400 }}>Rate:</span><div style={{ fontWeight: 500, marginTop: 2 }}>${robot.price}/day</div></div>
                      <div><span style={{ color: C.gray400 }}>Rentals:</span><div style={{ fontWeight: 500, marginTop: 2 }}>{robot.totalRentals}</div></div>
                      <div><span style={{ color: C.gray400 }}>Category:</span><div style={{ fontWeight: 500, marginTop: 2 }}>{robot.category}</div></div>
                    </div>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button style={{ flex: 1, padding: "10px 0", borderRadius: 100, fontSize: 13, fontWeight: 500, background: "transparent", color: C.gray700, border: `1.5px solid ${C.gray200}`, cursor: "pointer", fontFamily: "inherit" }}>Edit</button>
                      <Link to={`/robots/${robot.id}`} style={{ flex: 1, padding: "10px 0", borderRadius: 100, fontSize: 13, fontWeight: 500, background: "transparent", color: C.gray700, border: `1.5px solid ${C.gray200}`, textDecoration: "none", textAlign: "center" }}>View</Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case 'rentals':
        return (
          <div style={cardStyle}>
            <h3 style={{ fontSize: 18, fontWeight: 500, marginBottom: 16 }}>Rental History</h3>
            <p style={{ fontSize: 14, color: C.gray400, textAlign: "center", padding: 32 }}>Rental system coming soon!</p>
          </div>
        );

      case 'messages':
        return (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
              <h3 style={{ fontSize: 18, fontWeight: 500 }}>Messages</h3>
              <Link to="/messages" style={{ padding: "10px 24px", borderRadius: 100, fontSize: 14, fontWeight: 500, background: C.blue, color: C.pureWhite, textDecoration: "none" }}>View All</Link>
            </div>
            <div style={cardStyle}>
              {unreadMessages > 0 ? (
                <div style={{ textAlign: "center", padding: 24 }}>
                  <p style={{ fontSize: 15, marginBottom: 16 }}>You have {unreadMessages} unread message{unreadMessages === 1 ? '' : 's'}</p>
                  <Link to="/messages" style={{ fontSize: 14, fontWeight: 500, color: C.blue, textDecoration: "none", borderBottom: `1px solid ${C.blue}`, paddingBottom: 2 }}>View Messages &rarr;</Link>
                </div>
              ) : (
                <p style={{ fontSize: 14, color: C.gray400, textAlign: "center", padding: 24 }}>No new messages</p>
              )}
            </div>
          </div>
        );

      default: return null;
    }
  };

  return (
    <div style={{ fontFamily: "'Satoshi', sans-serif", color: C.black }}>
      <Navbar />

      {/* Header */}
      <section style={{ background: C.white, padding: "100px 48px 40px", borderBottom: `1px solid ${C.gray100}` }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: "0.18em", textTransform: "uppercase", color: C.gray400, marginBottom: 16 }}>Dashboard</div>
            <h1 style={{ fontSize: "clamp(30px, 3.5vw, 44px)", fontWeight: 400, letterSpacing: "-0.025em", lineHeight: 1.15 }}>
              Welcome back, {currentUser?.displayName?.split(' ')[0] || 'User'}.
            </h1>
          </div>
          <button onClick={logout} style={{ fontSize: 14, fontWeight: 500, color: C.gray500, cursor: "pointer", background: "none", border: "none", fontFamily: "inherit" }}>Logout</button>
        </div>
      </section>

      <section style={{ background: C.gray50, padding: "48px 48px 100px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "220px 1fr", gap: 32 }}>
          {/* Sidebar */}
          <div>
            <div style={cardStyle}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20, paddingBottom: 16, borderBottom: `1px solid ${C.gray100}` }}>
                <div style={{ width: 40, height: 40, borderRadius: "50%", background: C.gray50, border: `1px solid ${C.gray100}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <User size={18} color={C.gray400} />
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 500 }}>{currentUser?.displayName || 'User'}</div>
                  <div style={{ fontSize: 12, color: C.gray400 }}>{currentUser?.email}</div>
                </div>
              </div>
              <nav style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                {tabs.map((tab) => (
                  <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                    style={{
                      display: "flex", alignItems: "center", justifyContent: "space-between",
                      padding: "10px 14px", borderRadius: 8, fontSize: 14, fontWeight: 500,
                      background: activeTab === tab.id ? C.gray50 : "transparent",
                      color: activeTab === tab.id ? C.black : C.gray500,
                      border: "none", cursor: "pointer", fontFamily: "inherit",
                      transition: "all 0.15s", textAlign: "left", width: "100%",
                    }}>
                    {tab.name}
                    {tab.id === 'messages' && unreadMessages > 0 && (
                      <span style={{ background: "#ef4444", color: C.pureWhite, fontSize: 10, fontWeight: 700, borderRadius: 100, padding: "2px 8px" }}>{unreadMessages}</span>
                    )}
                  </button>
                ))}
                <Link to="/profile" style={{
                  display: "block", padding: "10px 14px", borderRadius: 8,
                  fontSize: 14, fontWeight: 500, color: C.gray500,
                  textDecoration: "none", transition: "all 0.15s",
                }}>Edit Profile</Link>
              </nav>
            </div>
          </div>

          {/* Content */}
          <div>{renderTabContent()}</div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default DashboardPage;
