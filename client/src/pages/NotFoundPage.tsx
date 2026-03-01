import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Search, ArrowLeft } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import RobotLogo from '../components/RobotLogo';
import { C } from '../design';

const NotFoundPage: React.FC = () => {
  return (
    <div style={{ fontFamily: "'Satoshi', sans-serif", color: C.black }}>
      <Navbar />

      <section style={{ background: C.white, padding: "160px 48px 100px", minHeight: "calc(100vh - 64px)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ maxWidth: 480, width: "100%", textAlign: "center" }}>
          <RobotLogo color={C.gray300} size={48} />

          <div style={{ fontSize: 80, fontWeight: 700, letterSpacing: "-0.04em", color: C.gray200, marginTop: 16, lineHeight: 1 }}>404</div>

          <h1 style={{ fontSize: 28, fontWeight: 400, letterSpacing: "-0.02em", marginTop: 16, marginBottom: 12 }}>
            Page not found
          </h1>

          <p style={{ fontSize: 15, color: C.gray500, lineHeight: 1.6, marginBottom: 36 }}>
            The page you're looking for doesn't exist or has been moved.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: 12, maxWidth: 280, margin: "0 auto" }}>
            <Link to="/" style={{
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              padding: "14px 0", borderRadius: 100, fontSize: 14, fontWeight: 500,
              background: C.blue, color: C.pureWhite, textDecoration: "none",
              transition: "background 0.25s",
            }}>
              <Home size={16} /> Go Home
            </Link>

            <Link to="/robots" style={{
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              padding: "14px 0", borderRadius: 100, fontSize: 14, fontWeight: 500,
              background: "transparent", color: C.gray700, textDecoration: "none",
              border: `1.5px solid ${C.gray200}`, transition: "all 0.25s",
            }}>
              <Search size={16} /> Browse Robots
            </Link>

            <button onClick={() => window.history.back()} style={{
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              padding: "14px 0", borderRadius: 100, fontSize: 14, fontWeight: 500,
              background: "transparent", color: C.gray700,
              border: `1.5px solid ${C.gray200}`, cursor: "pointer",
              fontFamily: "inherit", transition: "all 0.25s",
            }}>
              <ArrowLeft size={16} /> Go Back
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default NotFoundPage;
