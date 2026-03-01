import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Menu, X, User, LogOut, Settings } from 'lucide-react';
import { messageService } from '../services/messageService';
import { C } from '../design';
import RobotLogo from './RobotLogo';

const Navbar: React.FC = () => {
  const { currentUser, userProfile, logout } = useAuth();
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
    const fn = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
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

  const navColor = scrolled ? C.gray500 : "rgba(255,255,255,0.6)";
  const navHoverColor = scrolled ? C.black : C.pureWhite;
  const logoColor = scrolled ? C.black : C.pureWhite;

  const navLinks = currentUser
    ? [
        { label: "Explore", to: "/robots" },
        { label: "List a Robot", to: "/create-robot" },
        { label: "About", to: "/about" },
      ]
    : [
        { label: "Explore", to: "/robots" },
        { label: "About", to: "/about" },
        { label: "List a Robot", to: "/create-robot" },
      ];

  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
      padding: "0 48px", height: 64,
      display: "flex", alignItems: "center", justifyContent: "space-between",
      background: scrolled ? "rgba(255,255,255,0.92)" : "transparent",
      backdropFilter: scrolled ? "blur(16px)" : "none",
      WebkitBackdropFilter: scrolled ? "blur(16px)" : "none",
      borderBottom: scrolled ? `1px solid ${C.gray100}` : "1px solid transparent",
      transition: "all 0.4s ease",
    }}>
      {/* Logo */}
      <Link to="/" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
        <RobotLogo color={logoColor} />
        <span style={{
          fontSize: 14, fontWeight: 700, letterSpacing: "0.12em",
          textTransform: "uppercase", color: logoColor, transition: "color 0.4s",
        }}>DroidBRB</span>
      </Link>

      {/* Desktop Nav */}
      <div style={{ display: "flex", gap: 32, alignItems: "center" }} className="hidden md:flex">
        {navLinks.map((link) => (
          <Link
            key={link.label}
            to={link.to}
            style={{
              fontSize: 13, fontWeight: 500, letterSpacing: "0.06em",
              textTransform: "uppercase", color: navColor,
              cursor: "pointer", transition: "color 0.3s", textDecoration: "none",
            }}
            onMouseEnter={e => (e.currentTarget.style.color = navHoverColor)}
            onMouseLeave={e => (e.currentTarget.style.color = navColor)}
          >{link.label}</Link>
        ))}

        {currentUser ? (
          <>
            <Link
              to="/messages"
              style={{
                fontSize: 13, fontWeight: 500, letterSpacing: "0.06em",
                textTransform: "uppercase", color: navColor,
                cursor: "pointer", transition: "color 0.3s", textDecoration: "none",
                position: "relative",
              }}
              onMouseEnter={e => (e.currentTarget.style.color = navHoverColor)}
              onMouseLeave={e => (e.currentTarget.style.color = navColor)}
            >
              Messages
              {unreadCount > 0 && (
                <span style={{
                  position: "absolute", top: -8, right: -14,
                  background: "#ef4444", color: C.pureWhite,
                  fontSize: 10, fontWeight: 700, borderRadius: 100,
                  minWidth: 18, height: 18, padding: "0 4px",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </Link>

            {/* User dropdown */}
            <div className="relative group" style={{ marginLeft: 8 }}>
              <button style={{
                display: "flex", alignItems: "center", gap: 8,
                fontSize: 13, fontWeight: 500, color: navColor,
                cursor: "pointer", background: "none", border: "none",
                fontFamily: "inherit", transition: "color 0.3s",
              }}
                onMouseEnter={e => (e.currentTarget.style.color = navHoverColor)}
                onMouseLeave={e => (e.currentTarget.style.color = navColor)}
              >
                <div style={{
                  width: 28, height: 28, borderRadius: 100,
                  border: `1.5px solid ${scrolled ? C.gray200 : "rgba(255,255,255,0.2)"}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <User size={14} />
                </div>
                <span style={{ maxWidth: 100, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {currentUser.displayName?.split(' ')[0] || 'Account'}
                </span>
              </button>
              <div style={{
                position: "absolute", right: 0, top: "100%", marginTop: 4,
                width: 200, background: C.pureWhite,
                border: `1px solid ${C.gray100}`, borderRadius: 12,
                boxShadow: "0 8px 30px rgba(0,0,0,0.08)",
                padding: "6px 0", opacity: 0, visibility: "hidden" as any,
                transition: "all 0.2s",
              }} className="group-hover:!opacity-100 group-hover:!visible">
                <Link to="/dashboard" style={{
                  display: "flex", alignItems: "center", gap: 10,
                  padding: "10px 16px", fontSize: 14, color: C.gray500,
                  textDecoration: "none", transition: "all 0.15s",
                }}
                  onMouseEnter={e => { e.currentTarget.style.background = C.gray50; e.currentTarget.style.color = C.black; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = C.gray500; }}
                >
                  <User size={15} /> Dashboard
                </Link>
                <Link to="/profile" style={{
                  display: "flex", alignItems: "center", gap: 10,
                  padding: "10px 16px", fontSize: 14, color: C.gray500,
                  textDecoration: "none", transition: "all 0.15s",
                }}
                  onMouseEnter={e => { e.currentTarget.style.background = C.gray50; e.currentTarget.style.color = C.black; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = C.gray500; }}
                >
                  <Settings size={15} /> Edit Profile
                </Link>
                {userProfile?.role === 'admin' && (
                  <Link to="/admin" style={{
                    display: "flex", alignItems: "center", gap: 10,
                    padding: "10px 16px", fontSize: 14, color: C.blue,
                    textDecoration: "none", transition: "all 0.15s",
                  }}
                    onMouseEnter={e => { e.currentTarget.style.background = C.gray50; }}
                    onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}
                  >
                    <Settings size={15} /> Admin Console
                  </Link>
                )}
                <div style={{ margin: "4px 0", borderTop: `1px solid ${C.gray100}` }} />
                <button onClick={handleLogout} style={{
                  display: "flex", alignItems: "center", gap: 10, width: "100%",
                  padding: "10px 16px", fontSize: 14, color: C.gray500,
                  background: "none", border: "none", cursor: "pointer",
                  fontFamily: "inherit", transition: "all 0.15s", textAlign: "left",
                }}
                  onMouseEnter={e => { e.currentTarget.style.background = C.gray50; e.currentTarget.style.color = "#ef4444"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = C.gray500; }}
                >
                  <LogOut size={15} /> Logout
                </button>
              </div>
            </div>
          </>
        ) : (
          <Link
            to="/login"
            style={{
              padding: "10px 24px", borderRadius: 100, fontSize: 14, fontWeight: 500,
              cursor: "pointer", transition: "all 0.25s", fontFamily: "inherit",
              textDecoration: "none",
              ...(scrolled
                ? { background: "transparent", color: C.gray700, border: `1.5px solid ${C.gray200}` }
                : { background: "transparent", color: C.gray300, border: "1.5px solid rgba(255,255,255,0.2)" }
              ),
            }}
            onMouseEnter={e => {
              if (scrolled) { e.currentTarget.style.background = C.gray50; }
              else { e.currentTarget.style.background = "rgba(255,255,255,0.06)"; }
            }}
            onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}
          >Sign In</Link>
        )}
      </div>

      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="md:hidden"
        style={{
          background: "none", border: "none", cursor: "pointer",
          color: logoColor, padding: 8,
        }}
      >
        {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
      </button>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div style={{
          position: "absolute", top: 64, left: 0, right: 0,
          background: C.pureWhite, borderBottom: `1px solid ${C.gray100}`,
          padding: "12px 24px",
          boxShadow: "0 8px 30px rgba(0,0,0,0.06)",
        }} className="md:hidden">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              to={link.to}
              onClick={() => setIsMobileMenuOpen(false)}
              style={{
                display: "block", padding: "12px 0",
                fontSize: 14, fontWeight: 500, color: C.gray500,
                textDecoration: "none", borderBottom: `1px solid ${C.gray100}`,
              }}
            >{link.label}</Link>
          ))}
          {currentUser ? (
            <>
              <Link to="/messages" onClick={() => setIsMobileMenuOpen(false)}
                style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 0", fontSize: 14, fontWeight: 500, color: C.gray500, textDecoration: "none", borderBottom: `1px solid ${C.gray100}` }}>
                Messages
                {unreadCount > 0 && <span style={{ background: "#ef4444", color: C.pureWhite, fontSize: 10, fontWeight: 700, borderRadius: 100, padding: "2px 8px" }}>{unreadCount}</span>}
              </Link>
              <Link to="/dashboard" onClick={() => setIsMobileMenuOpen(false)}
                style={{ display: "block", padding: "12px 0", fontSize: 14, fontWeight: 500, color: C.gray500, textDecoration: "none", borderBottom: `1px solid ${C.gray100}` }}>
                Dashboard
              </Link>
              <Link to="/profile" onClick={() => setIsMobileMenuOpen(false)}
                style={{ display: "block", padding: "12px 0", fontSize: 14, fontWeight: 500, color: C.gray500, textDecoration: "none", borderBottom: `1px solid ${C.gray100}` }}>
                Edit Profile
              </Link>
              {userProfile?.role === 'admin' && (
                <Link to="/admin" onClick={() => setIsMobileMenuOpen(false)}
                  style={{ display: "block", padding: "12px 0", fontSize: 14, fontWeight: 500, color: C.blue, textDecoration: "none", borderBottom: `1px solid ${C.gray100}` }}>
                  Admin Console
                </Link>
              )}
              <button onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }}
                style={{ display: "block", width: "100%", textAlign: "left", padding: "12px 0", fontSize: 14, fontWeight: 500, color: "#ef4444", background: "none", border: "none", cursor: "pointer", fontFamily: "inherit" }}>
                Logout
              </button>
            </>
          ) : (
            <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}
              style={{
                display: "block", marginTop: 12, textAlign: "center",
                padding: "12px 28px", borderRadius: 100,
                background: C.blue, color: C.pureWhite,
                fontSize: 14, fontWeight: 500, textDecoration: "none",
              }}>
              Sign In
            </Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
