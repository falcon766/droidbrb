import React, { useState, useEffect, useRef } from 'react';
import { Star, Upload, Trash2, ChevronUp, ChevronDown, Image, Users, Settings } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { adminService } from '../services/adminService';
import { Robot, User as UserType, HeroImage } from '../types';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import RobotLogo from '../components/RobotLogo';
import { C } from '../design';
import toast from 'react-hot-toast';

const AdminPage: React.FC = () => {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState('featured');

  // Featured robots state
  const [robots, setRobots] = useState<Robot[]>([]);
  const [robotsLoading, setRobotsLoading] = useState(true);

  // Hero images state
  const [heroImages, setHeroImages] = useState<HeroImage[]>([]);
  const [imagesLoading, setImagesLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Users state
  const [users, setUsers] = useState<UserType[]>([]);
  const [usersLoading, setUsersLoading] = useState(true);

  useEffect(() => {
    if (activeTab === 'featured' && robotsLoading) fetchRobots();
    if (activeTab === 'images' && imagesLoading) fetchImages();
    if (activeTab === 'users' && usersLoading) fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  const fetchRobots = async () => {
    try { setRobots(await adminService.getAllRobots()); }
    catch { toast.error('Failed to load robots'); }
    finally { setRobotsLoading(false); }
  };

  const fetchImages = async () => {
    try {
      const content = await adminService.getHomepageContent();
      setHeroImages(content.heroImages);
    } catch { toast.error('Failed to load images'); }
    finally { setImagesLoading(false); }
  };

  const fetchUsers = async () => {
    try { setUsers(await adminService.getAllUsers()); }
    catch { toast.error('Failed to load users'); }
    finally { setUsersLoading(false); }
  };

  const handleToggleFeatured = async (robotId: string, current: boolean) => {
    try {
      await adminService.toggleFeatured(robotId, !current);
      setRobots(prev => prev.map(r => r.id === robotId ? { ...r, isFeatured: !current } : r));
      toast.success(current ? 'Removed from featured' : 'Added to featured');
    } catch { toast.error('Failed to update'); }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) { toast.error('Please select an image'); return; }
    if (file.size > 10 * 1024 * 1024) { toast.error('Image must be under 10MB'); return; }

    setUploading(true);
    try {
      const url = await adminService.uploadHeroImage(file);
      const newImage: HeroImage = { url, alt: file.name.replace(/\.[^.]+$/, ''), order: heroImages.length };
      const updated = [...heroImages, newImage];
      await adminService.updateHeroImages(updated);
      setHeroImages(updated);
      toast.success('Image uploaded');
    } catch { toast.error('Upload failed'); }
    finally { setUploading(false); if (fileInputRef.current) fileInputRef.current.value = ''; }
  };

  const handleDeleteImage = async (index: number) => {
    const image = heroImages[index];
    try {
      await adminService.deleteHeroImage(image.url);
      const updated = heroImages.filter((_, i) => i !== index).map((img, i) => ({ ...img, order: i }));
      await adminService.updateHeroImages(updated);
      setHeroImages(updated);
      toast.success('Image removed');
    } catch { toast.error('Failed to remove image'); }
  };

  const handleMoveImage = async (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= heroImages.length) return;
    const updated = [...heroImages];
    [updated[index], updated[newIndex]] = [updated[newIndex], updated[index]];
    const reordered = updated.map((img, i) => ({ ...img, order: i }));
    setHeroImages(reordered);
    try { await adminService.updateHeroImages(reordered); }
    catch { toast.error('Failed to reorder'); }
  };

  const handleRoleChange = async (userId: string, currentRole: string | undefined) => {
    const newRole = currentRole === 'admin' ? 'user' : 'admin';
    if (userId === currentUser?.uid) { toast.error("Can't change your own role"); return; }
    try {
      await adminService.setUserRole(userId, newRole as 'user' | 'admin');
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole as 'user' | 'admin' } : u));
      toast.success(`User ${newRole === 'admin' ? 'promoted to admin' : 'set to regular user'}`);
    } catch { toast.error('Failed to update role'); }
  };

  const tabs = [
    { id: 'featured', name: 'Featured Robots', icon: <Star size={15} /> },
    { id: 'images', name: 'Homepage Images', icon: <Image size={15} /> },
    { id: 'users', name: 'Users', icon: <Users size={15} /> },
  ];

  const cardStyle: React.CSSProperties = { background: C.pureWhite, border: `1px solid ${C.gray100}`, borderRadius: 12, padding: 24 };
  const thStyle: React.CSSProperties = { fontSize: 11, fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: C.gray400, padding: "10px 16px", textAlign: "left", borderBottom: `1px solid ${C.gray100}` };
  const tdStyle: React.CSSProperties = { padding: "14px 16px", borderBottom: `1px solid ${C.gray100}`, fontSize: 14 };

  const renderContent = () => {
    switch (activeTab) {
      case 'featured':
        return (
          <div>
            <div style={{ marginBottom: 24 }}>
              <h3 style={{ fontSize: 18, fontWeight: 500, letterSpacing: "-0.01em", marginBottom: 4 }}>Featured Robots</h3>
              <p style={{ fontSize: 14, color: C.gray400 }}>Toggle which robots appear in the featured section on the homepage.</p>
            </div>
            {robotsLoading ? (
              <div style={{ ...cardStyle, textAlign: "center", padding: 48 }}>
                <div style={{ width: 32, height: 32, border: `3px solid ${C.gray200}`, borderTopColor: C.blue, borderRadius: "50%", margin: "0 auto", animation: "spin 0.8s linear infinite" }} />
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
              </div>
            ) : robots.length === 0 ? (
              <div style={{ ...cardStyle, textAlign: "center", padding: 48 }}>
                <RobotLogo color={C.gray300} size={36} />
                <p style={{ fontSize: 14, color: C.gray400, marginTop: 16 }}>No robots found.</p>
              </div>
            ) : (
              <div style={cardStyle}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr>
                      <th style={thStyle}>Robot</th>
                      <th style={thStyle}>Category</th>
                      <th style={thStyle}>Price</th>
                      <th style={thStyle}>Rating</th>
                      <th style={thStyle}>Status</th>
                      <th style={{ ...thStyle, textAlign: "center" }}>Featured</th>
                    </tr>
                  </thead>
                  <tbody>
                    {robots.map(robot => (
                      <tr key={robot.id}>
                        <td style={tdStyle}>
                          <div style={{ fontWeight: 500 }}>{robot.name}</div>
                          <div style={{ fontSize: 12, color: C.gray400 }}>{robot.location}</div>
                        </td>
                        <td style={tdStyle}>
                          <span style={{ fontSize: 12, fontWeight: 500, padding: "3px 10px", borderRadius: 100, border: `1px solid ${C.gray200}`, color: C.gray500 }}>{robot.category}</span>
                        </td>
                        <td style={tdStyle}>${robot.price}/day</td>
                        <td style={tdStyle}>
                          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                            <Star size={13} fill={robot.rating > 0 ? "#f59e0b" : "none"} color={robot.rating > 0 ? "#f59e0b" : C.gray300} />
                            {robot.rating > 0 ? robot.rating.toFixed(1) : '—'}
                          </div>
                        </td>
                        <td style={tdStyle}>
                          <span style={{ fontSize: 12, fontWeight: 500, color: robot.isAvailable ? C.blue : C.gray400 }}>
                            {robot.isAvailable ? 'Available' : 'Rented'}
                          </span>
                        </td>
                        <td style={{ ...tdStyle, textAlign: "center" }}>
                          <button
                            onClick={() => handleToggleFeatured(robot.id, !!robot.isFeatured)}
                            style={{
                              width: 44, height: 24, borderRadius: 12, border: "none", cursor: "pointer",
                              background: robot.isFeatured ? C.blue : C.gray200,
                              position: "relative", transition: "background 0.2s",
                            }}
                          >
                            <div style={{
                              width: 18, height: 18, borderRadius: "50%", background: C.pureWhite,
                              position: "absolute", top: 3,
                              left: robot.isFeatured ? 23 : 3,
                              transition: "left 0.2s", boxShadow: "0 1px 3px rgba(0,0,0,0.15)",
                            }} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        );

      case 'images':
        return (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
              <div>
                <h3 style={{ fontSize: 18, fontWeight: 500, letterSpacing: "-0.01em", marginBottom: 4 }}>Homepage Images</h3>
                <p style={{ fontSize: 14, color: C.gray400 }}>Manage the hero images shown on the landing page.</p>
              </div>
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                style={{
                  display: "flex", alignItems: "center", gap: 8,
                  padding: "10px 24px", borderRadius: 100, fontSize: 14, fontWeight: 500,
                  background: uploading ? C.gray300 : C.blue, color: C.pureWhite,
                  border: "none", cursor: uploading ? "not-allowed" : "pointer", fontFamily: "inherit",
                }}
              >
                <Upload size={15} /> {uploading ? 'Uploading...' : 'Upload Image'}
              </button>
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
            </div>

            {imagesLoading ? (
              <div style={{ ...cardStyle, textAlign: "center", padding: 48 }}>
                <div style={{ width: 32, height: 32, border: `3px solid ${C.gray200}`, borderTopColor: C.blue, borderRadius: "50%", margin: "0 auto", animation: "spin 0.8s linear infinite" }} />
              </div>
            ) : heroImages.length === 0 ? (
              <div style={{ ...cardStyle, textAlign: "center", padding: 48 }}>
                <Image size={36} color={C.gray300} />
                <p style={{ fontSize: 14, color: C.gray400, marginTop: 16, marginBottom: 20 }}>No hero images configured. The homepage will use default images.</p>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  style={{
                    padding: "10px 24px", borderRadius: 100, fontSize: 14, fontWeight: 500,
                    background: C.blue, color: C.pureWhite, border: "none", cursor: "pointer", fontFamily: "inherit",
                  }}
                >Upload First Image</button>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {heroImages.map((image, index) => (
                  <div key={index} style={{ ...cardStyle, display: "flex", alignItems: "center", gap: 20 }}>
                    <img
                      src={image.url} alt={image.alt}
                      style={{ width: 160, height: 100, objectFit: "cover", borderRadius: 8, border: `1px solid ${C.gray100}`, flexShrink: 0 }}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 4 }}>{image.alt}</div>
                      <div style={{ fontSize: 12, color: C.gray400, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{image.url}</div>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 4, flexShrink: 0 }}>
                      <button onClick={() => handleMoveImage(index, 'up')} disabled={index === 0}
                        style={{ width: 32, height: 32, borderRadius: 8, border: `1px solid ${C.gray200}`, background: "transparent", cursor: index === 0 ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: index === 0 ? C.gray300 : C.gray500 }}>
                        <ChevronUp size={16} />
                      </button>
                      <button onClick={() => handleMoveImage(index, 'down')} disabled={index === heroImages.length - 1}
                        style={{ width: 32, height: 32, borderRadius: 8, border: `1px solid ${C.gray200}`, background: "transparent", cursor: index === heroImages.length - 1 ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: index === heroImages.length - 1 ? C.gray300 : C.gray500 }}>
                        <ChevronDown size={16} />
                      </button>
                    </div>
                    <button onClick={() => handleDeleteImage(index)}
                      style={{ width: 36, height: 36, borderRadius: 8, border: `1px solid ${C.gray200}`, background: "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#ef4444", flexShrink: 0 }}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case 'users':
        return (
          <div>
            <div style={{ marginBottom: 24 }}>
              <h3 style={{ fontSize: 18, fontWeight: 500, letterSpacing: "-0.01em", marginBottom: 4 }}>Users</h3>
              <p style={{ fontSize: 14, color: C.gray400 }}>View registered users and manage admin access.</p>
            </div>
            {usersLoading ? (
              <div style={{ ...cardStyle, textAlign: "center", padding: 48 }}>
                <div style={{ width: 32, height: 32, border: `3px solid ${C.gray200}`, borderTopColor: C.blue, borderRadius: "50%", margin: "0 auto", animation: "spin 0.8s linear infinite" }} />
              </div>
            ) : users.length === 0 ? (
              <div style={{ ...cardStyle, textAlign: "center", padding: 48 }}>
                <Users size={36} color={C.gray300} />
                <p style={{ fontSize: 14, color: C.gray400, marginTop: 16 }}>No users found.</p>
              </div>
            ) : (
              <div style={cardStyle}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr>
                      <th style={thStyle}>User</th>
                      <th style={thStyle}>Email</th>
                      <th style={thStyle}>Joined</th>
                      <th style={thStyle}>Location</th>
                      <th style={{ ...thStyle, textAlign: "center" }}>Role</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(user => (
                      <tr key={user.id}>
                        <td style={tdStyle}>
                          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                            {user.avatar ? (
                              <img src={user.avatar} alt="" style={{ width: 32, height: 32, borderRadius: "50%", objectFit: "cover" }} />
                            ) : (
                              <div style={{ width: 32, height: 32, borderRadius: "50%", background: C.gray50, border: `1px solid ${C.gray100}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                                <Users size={14} color={C.gray400} />
                              </div>
                            )}
                            <div>
                              <div style={{ fontWeight: 500 }}>{user.firstName} {user.lastName}</div>
                              <div style={{ fontSize: 12, color: C.gray400 }}>@{user.username}</div>
                            </div>
                          </div>
                        </td>
                        <td style={tdStyle}>{user.email}</td>
                        <td style={tdStyle}>
                          {user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—'}
                        </td>
                        <td style={tdStyle}>{user.location || '—'}</td>
                        <td style={{ ...tdStyle, textAlign: "center" }}>
                          {user.id === currentUser?.uid ? (
                            <span style={{ fontSize: 12, fontWeight: 500, color: C.blue, padding: "3px 10px", borderRadius: 100, border: `1px solid ${C.blue}` }}>Admin (you)</span>
                          ) : (
                            <button
                              onClick={() => handleRoleChange(user.id, user.role)}
                              style={{
                                fontSize: 12, fontWeight: 500, padding: "3px 10px", borderRadius: 100, cursor: "pointer",
                                background: "transparent", fontFamily: "inherit",
                                color: user.role === 'admin' ? C.blue : C.gray400,
                                border: `1px solid ${user.role === 'admin' ? C.blue : C.gray200}`,
                                transition: "all 0.2s",
                              }}
                            >
                              {user.role === 'admin' ? 'Admin' : 'User'}
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        );

      default: return null;
    }
  };

  return (
    <div style={{ fontFamily: "'Satoshi', sans-serif", color: C.black }}>
      <Navbar />

      {/* Header */}
      <section style={{ background: C.black, color: C.pureWhite, padding: "120px 48px 48px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: "0.18em", textTransform: "uppercase", color: C.gray400, marginBottom: 16 }}>Admin Console</div>
          <h1 style={{ fontSize: "clamp(30px, 3.5vw, 44px)", fontWeight: 400, letterSpacing: "-0.025em" }}>Site Management</h1>
        </div>
      </section>

      <section style={{ background: C.gray50, padding: "48px 48px 100px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "220px 1fr", gap: 32 }}>
          {/* Sidebar */}
          <div>
            <div style={cardStyle}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20, paddingBottom: 16, borderBottom: `1px solid ${C.gray100}` }}>
                <div style={{ width: 36, height: 36, borderRadius: "50%", background: C.blue, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Settings size={16} color={C.pureWhite} />
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 500 }}>Admin</div>
                  <div style={{ fontSize: 12, color: C.gray400 }}>{currentUser?.email}</div>
                </div>
              </div>
              <nav style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                {tabs.map(tab => (
                  <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                    style={{
                      display: "flex", alignItems: "center", gap: 10,
                      padding: "10px 14px", borderRadius: 8, fontSize: 14, fontWeight: 500,
                      background: activeTab === tab.id ? C.gray50 : "transparent",
                      color: activeTab === tab.id ? C.black : C.gray500,
                      border: "none", cursor: "pointer", fontFamily: "inherit",
                      transition: "all 0.15s", textAlign: "left", width: "100%",
                    }}>
                    {tab.icon} {tab.name}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Content */}
          <div>{renderContent()}</div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AdminPage;
