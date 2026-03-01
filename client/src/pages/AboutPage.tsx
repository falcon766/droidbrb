import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { C } from '../design';

const values = [
  { title: 'Community Driven', desc: 'Connect with robotics enthusiasts in your local area. Share knowledge, experiences, and passion for robotics.' },
  { title: 'Easy to Use', desc: 'List your robot in minutes. Browse and rent with just a few clicks. Simple, fast, and intuitive.' },
  { title: 'Safe & Secure', desc: 'Verified users, secure messaging, and trusted community guidelines keep everyone safe.' },
  { title: 'Passion for Robotics', desc: 'Built by robot enthusiasts, for robot enthusiasts. We understand your love for automation and innovation.' },
  { title: 'Local Focus', desc: 'Find robots near you. Meet owners in person. Build real connections in your community.' },
  { title: 'All Types Welcome', desc: 'Educational, industrial, hobby, service robots, and more. Every robot has a place here.' },
];

const Label = ({ children }: { children: React.ReactNode }) => (
  <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: "0.18em", textTransform: "uppercase", color: C.gray400, marginBottom: 24 }}>{children}</div>
);

const AboutPage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>About DroidBRB - Share, Rent, and Discover Robots</title>
        <meta name="description" content="Learn about DroidBRB, the community-driven platform for sharing and renting robots locally." />
      </Helmet>

      <div style={{ fontFamily: "'Satoshi', sans-serif", color: C.black }}>
        <Navbar />

        {/* Hero */}
        <section style={{ background: C.black, color: C.pureWhite, padding: "160px 48px 100px" }}>
          <div style={{ maxWidth: 1100, margin: "0 auto" }}>
            <Label>About</Label>
            <h1 style={{ fontSize: "clamp(44px, 5.5vw, 72px)", fontWeight: 400, lineHeight: 1.08, letterSpacing: "-0.03em", marginBottom: 28, maxWidth: 700 }}>
              We're making robotics accessible to everyone.
            </h1>
            <p style={{ fontSize: 18, lineHeight: 1.7, color: C.gray400, maxWidth: 520 }}>
              The world's first peer-to-peer robotics sharing platform. A place where enthusiasts connect, share, and explore together.
            </p>
          </div>
        </section>

        {/* Mission */}
        <section style={{ background: C.white, padding: "100px 48px", borderBottom: `1px solid ${C.gray100}` }}>
          <div style={{ maxWidth: 1100, margin: "0 auto" }}>
            <Label>Our Mission</Label>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80 }}>
              <h2 style={{ fontSize: "clamp(30px, 3.5vw, 44px)", fontWeight: 400, lineHeight: 1.15, letterSpacing: "-0.025em" }}>
                Hands-on robotics shouldn't cost thousands.
              </h2>
              <div>
                <p style={{ fontSize: 16, lineHeight: 1.75, color: C.gray500, marginBottom: 20 }}>
                  Whether you're a student learning programming, a hobbyist exploring automation, or a professional testing new technology — you shouldn't have to spend thousands of dollars to get hands-on experience.
                </p>
                <p style={{ fontSize: 16, lineHeight: 1.75, color: C.gray500 }}>
                  DroidBRB makes robotics accessible by connecting people who own robots with those who want to learn, experiment, or simply try before they buy. We're fostering a community where knowledge and resources are shared freely.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Values Grid */}
        <section style={{ background: C.gray50, padding: "100px 48px", borderBottom: `1px solid ${C.gray100}` }}>
          <div style={{ maxWidth: 1100, margin: "0 auto" }}>
            <Label>Why DroidBRB</Label>
            <h2 style={{ fontSize: "clamp(30px, 3.5vw, 44px)", fontWeight: 400, lineHeight: 1.15, letterSpacing: "-0.025em", marginBottom: 56 }}>Built with the community in mind.</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)" }}>
              {values.map((v, i) => (
                <div key={i}
                  style={{
                    padding: "28px 24px", borderTop: `1px solid ${C.gray200}`,
                    borderRight: (i % 3 !== 2) ? `1px solid ${C.gray200}` : "none",
                    transition: "background 0.25s",
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = C.pureWhite)}
                  onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                >
                  <h3 style={{ fontSize: 18, fontWeight: 500, letterSpacing: "-0.01em", marginBottom: 8 }}>{v.title}</h3>
                  <p style={{ fontSize: 14, lineHeight: 1.55, color: C.gray500 }}>{v.desc}</p>
                </div>
              ))}
            </div>
            <div style={{ borderTop: `1px solid ${C.gray200}` }} />
          </div>
        </section>

        {/* How It Works */}
        <section style={{ background: C.white, padding: "100px 48px", borderBottom: `1px solid ${C.gray100}` }}>
          <div style={{ maxWidth: 1100, margin: "0 auto" }}>
            <Label>How It Works</Label>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80 }}>
              <h2 style={{ fontSize: "clamp(30px, 3.5vw, 44px)", fontWeight: 400, lineHeight: 1.15, letterSpacing: "-0.025em" }}>Getting started is simple.</h2>
              <div>
                {[
                  { num: "01", title: "Create your account", body: "Sign up in seconds with your email or Google account." },
                  { num: "02", title: "List your robot or browse", body: "Share your robot with the community or search for robots near you." },
                  { num: "03", title: "Connect & arrange", body: "Message owners directly to discuss details and arrange meetups or rentals." },
                ].map((s, i) => (
                  <div key={i} style={{ borderTop: `1px solid ${C.gray200}`, padding: "24px 0" }}>
                    <div style={{ display: "flex", alignItems: "baseline", gap: 16 }}>
                      <span style={{ fontSize: 12, fontWeight: 500, color: C.blue, letterSpacing: "0.05em", minWidth: 24 }}>{s.num}</span>
                      <div>
                        <h3 style={{ fontSize: 20, fontWeight: 500, letterSpacing: "-0.01em", marginBottom: 6 }}>{s.title}</h3>
                        <p style={{ fontSize: 15, lineHeight: 1.65, color: C.gray500 }}>{s.body}</p>
                      </div>
                    </div>
                  </div>
                ))}
                <div style={{ borderTop: `1px solid ${C.gray200}` }} />
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section style={{ background: C.gray50, padding: "100px 48px", borderTop: `1px solid ${C.gray100}` }}>
          <div style={{ maxWidth: 800, margin: "0 auto", textAlign: "center" }}>
            <h2 style={{ fontSize: "clamp(30px, 4vw, 48px)", fontWeight: 400, lineHeight: 1.15, letterSpacing: "-0.025em", marginBottom: 16 }}>Ready to join the community?</h2>
            <p style={{ fontSize: 17, lineHeight: 1.7, color: C.gray500, maxWidth: 480, margin: "0 auto 36px" }}>Start sharing and exploring robots today.</p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
              <Link to="/register" style={{
                padding: "12px 28px", borderRadius: 100, fontSize: 14, fontWeight: 500,
                background: C.blue, color: C.pureWhite, border: `1.5px solid ${C.blue}`,
                textDecoration: "none", transition: "all 0.25s",
              }}>Get Started Free</Link>
              <Link to="/robots" style={{
                padding: "12px 28px", borderRadius: 100, fontSize: 14, fontWeight: 500,
                background: "transparent", color: C.gray700, border: `1.5px solid ${C.gray200}`,
                textDecoration: "none", transition: "all 0.25s",
              }}>Browse Robots</Link>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
};

export default AboutPage;
