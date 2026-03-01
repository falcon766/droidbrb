import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { MapPin, Heart, MessageCircle, User } from 'lucide-react';
import { robotService } from '../services/robotService';
import { Robot, User as UserType } from '../types';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import RobotLogo from '../components/RobotLogo';
import { C } from '../design';

const RobotDetailPage: React.FC = () => {
  const [isFavorited, setIsFavorited] = useState(false);
  const [robot, setRobot] = useState<Robot | null>(null);
  const [owner, setOwner] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      if (!id) { setLoading(false); return; }
      try {
        const data = await robotService.getRobotById(id);
        setRobot(data);
        if (data && data.ownerId && db) {
          try {
            const ownerDoc = await getDoc(doc(db, 'users', data.ownerId));
            if (ownerDoc.exists()) {
              const ownerData = ownerDoc.data();
              setOwner({ ...ownerData, id: data.ownerId, createdAt: ownerData.createdAt?.toDate?.() || new Date(), updatedAt: ownerData.updatedAt?.toDate?.() || new Date() } as UserType);
            }
          } catch (error) { console.error('Error fetching owner info:', error); }
        }
      } catch (e) { console.error('Failed to load robot', e); }
      finally { setLoading(false); }
    };
    load();
  }, [id]);

  if (loading) {
    return (
      <div style={{ fontFamily: "'Satoshi', sans-serif", minHeight: "100vh", background: C.white, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: 40, height: 40, border: `3px solid ${C.gray200}`, borderTopColor: C.blue, borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!robot) {
    return (
      <div style={{ fontFamily: "'Satoshi', sans-serif", minHeight: "100vh", background: C.white }}>
        <Navbar />
        <div style={{ maxWidth: 600, margin: "0 auto", padding: "160px 48px 100px", textAlign: "center" }}>
          <RobotLogo color={C.gray300} size={48} />
          <h1 style={{ fontSize: 24, fontWeight: 500, marginTop: 20, marginBottom: 8 }}>Robot not found</h1>
          <p style={{ fontSize: 15, color: C.gray500, marginBottom: 28 }}>The robot you are looking for does not exist or was removed.</p>
          <button onClick={() => navigate(-1)} style={{ fontSize: 14, fontWeight: 500, color: C.blue, cursor: "pointer", background: "none", border: "none", borderBottom: `1px solid ${C.blue}`, paddingBottom: 2, fontFamily: "inherit" }}>Go back</button>
        </div>
        <Footer />
      </div>
    );
  }

  const cardStyle: React.CSSProperties = { background: C.pureWhite, border: `1px solid ${C.gray100}`, borderRadius: 12, padding: 28 };

  return (
    <div style={{ fontFamily: "'Satoshi', sans-serif", color: C.black }}>
      <Navbar />

      {/* Header */}
      <section style={{ background: C.white, padding: "100px 48px 40px", borderBottom: `1px solid ${C.gray100}` }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: "0.18em", textTransform: "uppercase", color: C.gray400, marginBottom: 16 }}>{robot.category}</div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <h1 style={{ fontSize: "clamp(30px, 3.5vw, 44px)", fontWeight: 400, letterSpacing: "-0.025em", lineHeight: 1.15 }}>{robot.name}</h1>
            <button onClick={() => setIsFavorited(!isFavorited)} style={{
              background: "none", border: `1.5px solid ${isFavorited ? "#ef4444" : C.gray200}`, borderRadius: 100,
              padding: "10px 12px", cursor: "pointer", transition: "all 0.25s",
            }}>
              <Heart size={18} fill={isFavorited ? "#ef4444" : "none"} color={isFavorited ? "#ef4444" : C.gray400} />
            </button>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 8, fontSize: 14, color: C.gray500 }}>
            <MapPin size={14} /> {robot.location}
          </div>
        </div>
      </section>

      {/* Content */}
      <section style={{ background: C.gray50, padding: "48px 48px 100px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "2fr 1fr", gap: 32 }}>
          {/* Main */}
          <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
            {/* Image */}
            <div style={{ borderRadius: 12, overflow: "hidden", border: `1px solid ${C.gray100}`, aspectRatio: "16/9", background: C.pureWhite, display: "flex", alignItems: "center", justifyContent: "center" }}>
              {robot.images && robot.images.length > 0 ? (
                <img src={robot.images[0]} alt={robot.name} style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
              ) : (
                <RobotLogo color={C.gray300} size={64} />
              )}
            </div>

            {/* Description */}
            <div style={cardStyle}>
              <h2 style={{ fontSize: 18, fontWeight: 500, marginBottom: 16, letterSpacing: "-0.01em" }}>About this robot</h2>
              <p style={{ fontSize: 16, lineHeight: 1.75, color: C.gray500 }}>{robot.description}</p>
            </div>

            {/* Specifications */}
            <div style={cardStyle}>
              <h2 style={{ fontSize: 18, fontWeight: 500, marginBottom: 16, letterSpacing: "-0.01em" }}>Specifications</h2>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                {[
                  { label: "Weight", value: robot.specifications.weight },
                  { label: "Dimensions", value: robot.specifications.dimensions },
                  { label: "Battery Life", value: robot.specifications.batteryLife },
                  { label: "Connectivity", value: robot.specifications.connectivity },
                ].map((spec) => (
                  <div key={spec.label}>
                    <div style={{ fontSize: 13, fontWeight: 500, color: C.gray400, marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.05em" }}>{spec.label}</div>
                    <div style={{ fontSize: 15, color: C.black }}>{spec.value || "—"}</div>
                  </div>
                ))}
              </div>
              {robot.features && robot.features.length > 0 && (
                <div style={{ marginTop: 20, paddingTop: 16, borderTop: `1px solid ${C.gray100}` }}>
                  <div style={{ fontSize: 13, fontWeight: 500, color: C.gray400, marginBottom: 10, textTransform: "uppercase", letterSpacing: "0.05em" }}>Features</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {robot.features.map((feature, i) => (
                      <span key={i} style={{ padding: "5px 14px", borderRadius: 100, border: `1px solid ${C.gray200}`, fontSize: 13, fontWeight: 500, color: C.gray500 }}>{feature}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            {/* Rental Card */}
            <div style={{ ...cardStyle, position: "sticky", top: 80 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                <div>
                  <span style={{ fontSize: 28, fontWeight: 700 }}>${robot.price}</span>
                  <span style={{ fontSize: 15, fontWeight: 400, color: C.gray400 }}>/day</span>
                </div>
                <span style={{ fontSize: 12, fontWeight: 500, color: robot.isAvailable ? C.blue : C.gray400, padding: "4px 12px", borderRadius: 100, border: `1px solid ${robot.isAvailable ? C.blue : C.gray200}` }}>
                  {robot.isAvailable ? 'Available' : 'Rented'}
                </span>
              </div>

              <button
                disabled={!robot.isAvailable}
                style={{
                  width: "100%", padding: "14px 0", borderRadius: 100, fontSize: 14, fontWeight: 500,
                  cursor: robot.isAvailable ? "pointer" : "not-allowed", transition: "all 0.25s",
                  fontFamily: "inherit", marginBottom: 12, border: "none",
                  background: robot.isAvailable ? C.blue : C.gray200,
                  color: robot.isAvailable ? C.pureWhite : C.gray400,
                }}
              >{robot.isAvailable ? 'Rent Now' : 'Currently Rented'}</button>

              <button onClick={() => navigate('/messages')}
                style={{
                  width: "100%", padding: "14px 0", borderRadius: 100, fontSize: 14, fontWeight: 500,
                  cursor: "pointer", transition: "all 0.25s", fontFamily: "inherit",
                  background: "transparent", color: C.gray700, border: `1.5px solid ${C.gray200}`,
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                }}
                onMouseEnter={e => (e.currentTarget.style.background = C.gray50)}
                onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
              >
                <MessageCircle size={16} /> Contact Owner
              </button>

              {/* Availability details */}
              <div style={{ borderTop: `1px solid ${C.gray100}`, marginTop: 24, paddingTop: 20 }}>
                <div style={{ fontSize: 13, fontWeight: 500, color: C.gray400, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 12 }}>Details</div>
                {[
                  { label: "Min Rental", value: `${robot.minRental} day${robot.minRental !== 1 ? 's' : ''}` },
                  { label: "Max Rental", value: `${robot.maxRental} day${robot.maxRental !== 1 ? 's' : ''}` },
                  { label: "Pickup", value: robot.pickupTime },
                  { label: "Return", value: robot.returnTime },
                ].map(item => (
                  <div key={item.label} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", fontSize: 14 }}>
                    <span style={{ color: C.gray400 }}>{item.label}</span>
                    <span style={{ fontWeight: 500 }}>{item.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Owner */}
            <div style={cardStyle}>
              <div style={{ fontSize: 13, fontWeight: 500, color: C.gray400, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 16 }}>Owner</div>
              {owner ? (
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                    {owner.avatar ? (
                      <img src={owner.avatar} alt={owner.firstName} style={{ width: 44, height: 44, borderRadius: "50%", objectFit: "cover" }} />
                    ) : (
                      <div style={{ width: 44, height: 44, borderRadius: "50%", background: C.gray50, display: "flex", alignItems: "center", justifyContent: "center", border: `1px solid ${C.gray100}` }}>
                        <User size={20} color={C.gray400} />
                      </div>
                    )}
                    <div>
                      <div style={{ fontSize: 15, fontWeight: 500 }}>{owner.firstName} {owner.lastName}</div>
                      <div style={{ fontSize: 13, color: C.gray400 }}>Member since {new Date(owner.createdAt).getFullYear()}</div>
                    </div>
                  </div>
                  {owner.bio && <p style={{ fontSize: 14, color: C.gray500, lineHeight: 1.6, marginBottom: 12 }}>{owner.bio}</p>}
                  {owner.location && (
                    <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: C.gray400, marginBottom: 16 }}>
                      <MapPin size={13} /> {owner.location}
                    </div>
                  )}
                  <button onClick={() => navigate('/messages')}
                    style={{
                      width: "100%", padding: "12px 0", borderRadius: 100, fontSize: 14, fontWeight: 500,
                      cursor: "pointer", background: C.blue, color: C.pureWhite, border: `1.5px solid ${C.blue}`,
                      fontFamily: "inherit", transition: "all 0.25s",
                      display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = C.blueHover; e.currentTarget.style.borderColor = C.blueHover; }}
                    onMouseLeave={e => { e.currentTarget.style.background = C.blue; e.currentTarget.style.borderColor = C.blue; }}
                  >
                    <MessageCircle size={15} /> Message Owner
                  </button>
                </div>
              ) : (
                <div style={{ display: "flex", alignItems: "center", gap: 10, color: C.gray400, fontSize: 14 }}>
                  <div style={{ width: 36, height: 36, borderRadius: "50%", background: C.gray50, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <User size={16} color={C.gray400} />
                  </div>
                  Owner information unavailable
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default RobotDetailPage;
