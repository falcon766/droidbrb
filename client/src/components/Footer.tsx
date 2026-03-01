import React from 'react';
import { Link } from 'react-router-dom';
import { C } from '../design';
import RobotLogo from './RobotLogo';

const footerColumns = [
  { title: "Explore", links: [
    { label: "Browse Robots", to: "/robots" },
    { label: "Categories", to: "/robots" },
    { label: "Featured", to: "/robots" },
    { label: "Near Me", to: "/robots" },
  ]},
  { title: "Community", links: [
    { label: "About", to: "/about" },
    { label: "Blog", to: "/about" },
    { label: "Events", to: "/about" },
    { label: "Help", to: "/about" },
  ]},
  { title: "Account", links: [
    { label: "Sign In", to: "/login" },
    { label: "Sign Up", to: "/register" },
    { label: "List a Robot", to: "/create-robot" },
    { label: "Dashboard", to: "/dashboard" },
  ]},
];

const Footer: React.FC = () => {
  return (
    <footer style={{ background: C.gray50, padding: "56px 48px 36px", borderTop: `1px solid ${C.gray100}` }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "2.5fr 1fr 1fr 1fr", gap: 56, marginBottom: 56 }}>
          {/* Brand */}
          <div>
            <Link to="/" style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14, textDecoration: "none" }}>
              <RobotLogo size={18} />
              <span style={{ fontSize: 13, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: C.black }}>DroidBRB</span>
            </Link>
            <p style={{ fontSize: 14, lineHeight: 1.65, fontWeight: 400, color: C.gray500, maxWidth: 260 }}>
              Peer-to-peer robot sharing. Connect locally, rent by the day, learn hands-on.
            </p>
          </div>

          {/* Link Columns */}
          {footerColumns.map((col) => (
            <div key={col.title}>
              <h4 style={{ fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: C.gray400, marginBottom: 18, fontWeight: 500 }}>{col.title}</h4>
              {col.links.map((link) => (
                <Link
                  key={link.label}
                  to={link.to}
                  style={{ display: "block", fontSize: 14, fontWeight: 400, color: C.gray500, padding: "4px 0", textDecoration: "none", transition: "color 0.2s" }}
                  onMouseEnter={e => (e.currentTarget.style.color = C.black)}
                  onMouseLeave={e => (e.currentTarget.style.color = C.gray500)}
                >{link.label}</Link>
              ))}
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div style={{ borderTop: `1px solid ${C.gray200}`, paddingTop: 20, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 13, fontWeight: 400, color: C.gray400 }}>&copy; 2026 DroidBRB</span>
          <div style={{ display: "flex", gap: 20 }}>
            {["Privacy", "Terms", "Contact"].map((x) => (
              <span
                key={x}
                style={{ fontSize: 13, fontWeight: 400, color: C.gray400, cursor: "pointer", transition: "color 0.2s" }}
                onMouseEnter={e => (e.currentTarget.style.color = C.black)}
                onMouseLeave={e => (e.currentTarget.style.color = C.gray400)}
              >{x}</span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
