import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { robotService } from '../services/robotService';
import { searchService, LocationSuggestion } from '../services/searchService';
import { Robot, HeroImage } from '../types';
import { adminService } from '../services/adminService';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { C } from '../design';

const cats = ["Humanoid","Industrial","Educational","Hobby","Drone","Service","Medical","Other"];

const howSteps = [
  { num: "01", title: "Search & discover", body: "Browse by type, location, or keyword. Every listing comes from a real owner in your area." },
  { num: "02", title: "Connect with owners", body: "Message directly, ask questions, discuss specs, and arrange a time that works for both of you." },
  { num: "03", title: "Rent & experience", body: "Meet in person, rent for your project, or try before you buy. Hands-on time without the full price tag." },
];

const catDetails = [
  { name: "Humanoid", count: "340+", desc: "Bipedal robots for research and education" },
  { name: "Industrial", count: "280+", desc: "Arms, welders, and automation units" },
  { name: "Educational", count: "520+", desc: "Kits and STEM platforms for all ages" },
  { name: "Hobby", count: "410+", desc: "Custom builds and DIY creations" },
  { name: "Drone", count: "390+", desc: "Aerial platforms for every use case" },
  { name: "Service", count: "180+", desc: "Delivery, cleaning, and hospitality bots" },
];

const stats = [
  { val: "2,400+", label: "Robots listed" },
  { val: "180", label: "Cities" },
  { val: "15K+", label: "Members" },
];

function HeroCard({ robot, heroImage }: { robot?: Robot; heroImage?: HeroImage }) {
  const [h, setH] = useState(false);
  const name = robot?.name || "Atlas Pro";
  const cat = robot?.category || "Humanoid";
  const price = robot?.price ? `$${robot.price}` : "$85";
  const loc = robot?.location || "San Francisco, CA";
  const img = heroImage?.url || robot?.images?.[0] || "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=500&h=380&fit=crop";

  return (
    <div onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{
        width: 300, background: C.pureWhite, borderRadius: 10, overflow: "hidden",
        boxShadow: "0 24px 80px rgba(0,0,0,0.4), 0 2px 8px rgba(0,0,0,0.15)",
        transform: `translateY(${h ? -6 : 0}px)`,
        transition: "transform 0.5s cubic-bezier(0.23,1,0.32,1)", position: "relative",
      }}>
      <div style={{ width: "100%", height: 190, overflow: "hidden" }}>
        <img src={img} alt={name}
          style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.5s", transform: h ? "scale(1.05)" : "scale(1)" }} />
      </div>
      <div style={{ padding: "16px 18px 18px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 4 }}>
          <span style={{ fontSize: 15, fontWeight: 700, color: C.black }}>{name}</span>
          <span style={{ fontSize: 14, fontWeight: 700, color: C.black }}>{price}<span style={{ fontWeight: 400, color: C.gray400, fontSize: 12 }}>/day</span></span>
        </div>
        <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: C.gray400, marginBottom: 4 }}>{cat}</div>
        <div style={{ fontSize: 13, color: C.gray500, marginBottom: 10 }}>{loc}</div>
        <div style={{ borderTop: `1px solid ${C.gray100}`, paddingTop: 8, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: 12, fontWeight: 500, color: C.gray500 }}>Owner: Alex M.</span>
          <span style={{ fontSize: 11, fontWeight: 500, color: C.blue }}>Available</span>
        </div>
      </div>
    </div>
  );
}

function HeroCardBack({ heroImage }: { heroImage?: HeroImage }) {
  const backImg = heroImage?.url || "https://images.unsplash.com/photo-1535378917042-10a22c95931a?w=500&h=380&fit=crop";
  return (
    <div style={{
      width: 260, background: C.pureWhite, borderRadius: 10, overflow: "hidden", opacity: 0.5,
      boxShadow: "0 16px 48px rgba(0,0,0,0.25)",
    }}>
      <div style={{ width: "100%", height: 160, overflow: "hidden" }}>
        <img src={backImg} alt={heroImage?.alt || "EduBot"}
          style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </div>
      <div style={{ padding: "14px 16px 16px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
          <span style={{ fontSize: 14, fontWeight: 700, color: C.black }}>EduBot Mini</span>
          <span style={{ fontSize: 13, fontWeight: 700, color: C.black }}>$15<span style={{ fontWeight: 400, color: C.gray400, fontSize: 11 }}>/day</span></span>
        </div>
        <div style={{ fontSize: 10, fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: C.gray400 }}>Educational</div>
      </div>
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: "0.18em", textTransform: "uppercase", color: C.gray400, marginBottom: 24 }}>{children}</div>;
}

function Btn({ children, variant = "outline", dark, onClick, to }: {
  children: React.ReactNode; variant?: "filled" | "outline"; dark?: boolean; onClick?: () => void; to?: string;
}) {
  const [h, setH] = useState(false);
  const filled = variant === "filled";
  let bg: string, color: string, border: string;
  if (filled) { bg = h ? C.blueHover : C.blue; color = C.pureWhite; border = `1.5px solid ${bg}`; }
  else if (dark) { bg = h ? "rgba(255,255,255,0.06)" : "transparent"; color = C.gray300; border = "1.5px solid rgba(255,255,255,0.2)"; }
  else { bg = h ? C.gray50 : "transparent"; color = C.gray700; border = `1.5px solid ${C.gray200}`; }

  const style: React.CSSProperties = {
    background: bg, color, border, padding: "12px 28px", borderRadius: 100,
    fontSize: 14, fontWeight: 500, cursor: "pointer", transition: "all 0.25s",
    fontFamily: "inherit", textDecoration: "none", display: "inline-flex", alignItems: "center",
  };

  if (to) {
    return (
      <Link to={to} style={style}
        onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      >{children}</Link>
    );
  }

  return (
    <button onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)} onClick={onClick}
      style={style}
    >{children}</button>
  );
}

const HomePage: React.FC = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [featuredRobots, setFeaturedRobots] = useState<Robot[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [locationValue, setLocationValue] = useState("");
  const [locationSuggestions, setLocationSuggestions] = useState<LocationSuggestion[]>([]);
  const [showLocationSuggestions, setShowLocationSuggestions] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [hCard, setHCard] = useState<number | null>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [heroImages, setHeroImages] = useState<HeroImage[]>([]);

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setScrollProgress(Math.min(window.scrollY / window.innerHeight, 1));
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const fetchFeaturedRobots = async () => {
      const timeoutId = setTimeout(() => setLoading(false), 3000);
      try {
        const robots = await robotService.getFeaturedRobots(4);
        setFeaturedRobots(robots);
      } catch (error) {
        console.error('Error fetching featured robots:', error);
        setFeaturedRobots([]);
      } finally {
        clearTimeout(timeoutId);
        setLoading(false);
      }
    };
    if (loading) fetchFeaturedRobots();
  }, [loading]);

  useEffect(() => {
    adminService.getHomepageContent().then(content => {
      if (content.heroImages.length > 0) setHeroImages(content.heroImages);
    }).catch(() => {});
  }, []);

  const handleLocationChange = async (value: string) => {
    setLocationValue(value);
    if (value.length >= 3) {
      const suggestions = await searchService.getLocationSuggestions(value);
      setLocationSuggestions(suggestions);
      setShowLocationSuggestions(true);
    } else {
      setLocationSuggestions([]);
      setShowLocationSuggestions(false);
    }
  };

  const handleLocationSelect = (suggestion: LocationSuggestion) => {
    setLocationValue(suggestion.description);
    setShowLocationSuggestions(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.location-input-container')) setShowLocationSuggestions(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery) params.append('query', searchQuery);
    if (locationValue) params.append('location', locationValue);
    navigate(`/robots?${params.toString()}`);
  };

  const inp: React.CSSProperties = {
    width: "100%", padding: "14px 20px", background: "transparent",
    border: `1.5px solid ${C.gray200}`, borderRadius: 100,
    fontSize: 15, fontFamily: "inherit", fontWeight: 400, color: C.black, outline: "none", transition: "border 0.3s",
  };

  // Use real robots for the featured grid, fall back to placeholder data
  const displayRobots = featuredRobots.length > 0
    ? featuredRobots.slice(0, 4).map(r => ({
        name: r.name,
        cat: r.category,
        price: `$${r.price}`,
        unit: "/day",
        loc: r.location,
        img: r.images?.[0] || "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=500&h=380&fit=crop",
        id: r.id,
      }))
    : [
        { name: "Atlas Pro", cat: "Humanoid", price: "$85", unit: "/day", loc: "San Francisco, CA", img: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=500&h=380&fit=crop", id: "" },
        { name: "EduBot Mini", cat: "Educational", price: "$15", unit: "/day", loc: "Austin, TX", img: "https://images.unsplash.com/photo-1535378917042-10a22c95931a?w=500&h=380&fit=crop", id: "" },
        { name: "CruzServe X1", cat: "Service", price: "$120", unit: "/day", loc: "New York, NY", img: "https://images.unsplash.com/photo-1546776310-eef45dd6d63c?w=500&h=380&fit=crop", id: "" },
        { name: "NanoDrone V4", cat: "Drone", price: "$40", unit: "/day", loc: "Seattle, WA", img: "https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=500&h=380&fit=crop", id: "" },
      ];

  return (
    <>
      <Helmet>
        <title>DroidBRB - The Peer-to-Peer Robot Rental Platform</title>
        <meta name="description" content="Connect with robot owners in your area. Rent by the day, learn hands-on, and build together." />
      </Helmet>

      <div style={{ fontFamily: "'Satoshi', sans-serif", color: C.black, overflowX: "hidden" }}>
        <Navbar />

        {/* HERO */}
        <section style={{ background: C.black, color: C.pureWhite, position: "relative", display: "flex", flexDirection: "column", justifyContent: "center", padding: "120px 48px 48px" }}>
          <div style={{ maxWidth: 1200, margin: "0 auto", width: "100%", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40, alignItems: "center" }}>
            <div>
              <h1 style={{ fontSize: "clamp(44px, 5.5vw, 72px)", fontWeight: 400, lineHeight: 1.08, letterSpacing: "-0.03em", marginBottom: 28 }}>
                The peer-to-peer<br />robot rental<br />platform.
              </h1>
              <p style={{ fontSize: 18, lineHeight: 1.7, fontWeight: 400, color: C.gray400, maxWidth: 420, marginBottom: 40 }}>
                Connect with robot owners in your area. Rent by the day, learn hands-on, and build together.
              </p>
              <div style={{ display: "flex", gap: 16 }}>
                <Btn variant="filled" to="/robots">Browse Robots</Btn>
                <Btn dark to="/create-robot">List Your Robot</Btn>
              </div>
            </div>
            <div className="hidden md:flex" style={{ justifyContent: "center", alignItems: "center", position: "relative", minHeight: 420 }}>
              <div style={{
                position: "absolute", top: 50, right: -20, zIndex: 0, willChange: "transform",
                transform: `rotate(${3 + scrollProgress * 12}deg) translate(${30 + scrollProgress * 60}px, ${-30 - scrollProgress * 120}px) scale(${1 + scrollProgress * 0.18})`,
              }}>
                <HeroCardBack heroImage={heroImages[1]} />
              </div>
              <div style={{
                position: "relative", zIndex: 1, willChange: "transform",
                transform: `rotate(${-2 - scrollProgress * 5}deg) translateY(${-scrollProgress * 90}px) scale(${1 + scrollProgress * 0.12})`,
              }}>
                <HeroCard robot={featuredRobots[0]} heroImage={heroImages[0]} />
              </div>
            </div>
          </div>
          {/* Stats bar */}
          <div style={{ maxWidth: 1200, margin: "40px auto 0", width: "100%" }}>
            <div style={{ display: "flex", gap: 0, borderTop: `1px solid ${C.gray700}` }}>
              {stats.map((s, i) => (
                <div key={i} style={{ flex: 1, padding: "28px 0", borderRight: i < 2 ? `1px solid ${C.gray700}` : "none", paddingRight: i < 2 ? 24 : 0, paddingLeft: i > 0 ? 24 : 0 }}>
                  <div style={{ fontSize: 28, fontWeight: 500, letterSpacing: "-0.02em", marginBottom: 4 }}>{s.val}</div>
                  <div style={{ fontSize: 13, fontWeight: 400, color: C.gray500 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SEARCH */}
        <section style={{ background: C.white, padding: "64px 48px" }}>
          <div style={{ maxWidth: 1100, margin: "0 auto" }}>
            <Label>Search</Label>
            <h2 style={{ fontSize: "clamp(30px, 3.5vw, 44px)", fontWeight: 400, lineHeight: 1.15, marginBottom: 40, letterSpacing: "-0.025em" }}>Find robots near you.</h2>
            <form onSubmit={handleSearch}>
              <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 24 }}>
                <div style={{ flex: 1 }}>
                  <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Robot name, type, or keyword" style={inp}
                    onFocus={e => (e.target.style.borderColor = C.black)} onBlur={e => (e.target.style.borderColor = C.gray200)} />
                </div>
                <div style={{ flex: 0.5, position: "relative" }} className="location-input-container">
                  <input value={locationValue} onChange={e => handleLocationChange(e.target.value)} placeholder="City or zip code" style={inp}
                    onFocus={e => { e.target.style.borderColor = C.black; if (locationSuggestions.length > 0) setShowLocationSuggestions(true); }}
                    onBlur={e => (e.target.style.borderColor = C.gray200)}
                    autoComplete="off" />
                  {showLocationSuggestions && locationSuggestions.length > 0 && (
                    <div style={{
                      position: "absolute", top: "100%", left: 0, right: 0, marginTop: 4,
                      background: C.pureWhite, border: `1px solid ${C.gray100}`, borderRadius: 12,
                      boxShadow: "0 8px 30px rgba(0,0,0,0.08)", zIndex: 20, maxHeight: 200, overflowY: "auto",
                    }}>
                      {locationSuggestions.map((suggestion) => (
                        <button key={suggestion.place_id} type="button"
                          onClick={() => handleLocationSelect(suggestion)}
                          style={{
                            display: "block", width: "100%", textAlign: "left",
                            padding: "10px 16px", background: "none", border: "none",
                            borderBottom: `1px solid ${C.gray100}`, cursor: "pointer",
                            fontFamily: "inherit", transition: "background 0.15s",
                          }}
                          onMouseEnter={e => (e.currentTarget.style.background = C.gray50)}
                          onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                        >
                          <div style={{ fontSize: 14, fontWeight: 500, color: C.black }}>{suggestion.structured_formatting.main_text}</div>
                          <div style={{ fontSize: 13, color: C.gray400 }}>{suggestion.structured_formatting.secondary_text}</div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <Btn variant="filled" onClick={() => handleSearch({ preventDefault: () => {} } as React.FormEvent)}>Search</Btn>
              </div>
            </form>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {cats.map((c) => (
                <span key={c}
                  style={{ padding: "7px 16px", borderRadius: 100, border: `1px solid ${C.gray200}`, fontSize: 13, fontWeight: 500, color: C.gray500, cursor: "pointer", transition: "all 0.2s" }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = C.black; e.currentTarget.style.color = C.black; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = C.gray200; e.currentTarget.style.color = C.gray500; }}
                  onClick={() => navigate(`/robots?category=${c.toLowerCase()}`)}
                >{c}</span>
              ))}
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section style={{ background: C.gray50, padding: "64px 48px", borderTop: `1px solid ${C.gray100}`, borderBottom: `1px solid ${C.gray100}` }}>
          <div style={{ maxWidth: 1100, margin: "0 auto" }}>
            <Label>How It Works</Label>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80 }}>
              <h2 style={{ fontSize: "clamp(30px, 3.5vw, 44px)", fontWeight: 400, lineHeight: 1.15, letterSpacing: "-0.025em" }}>Three steps to hands-on robotics.</h2>
              <div>
                {howSteps.map((s, i) => (
                  <div key={i} onClick={() => setActiveStep(i)}
                    style={{ borderTop: `1px solid ${activeStep === i ? C.black : C.gray200}`, padding: "24px 0", cursor: "pointer", transition: "all 0.3s" }}>
                    <div style={{ display: "flex", alignItems: "baseline", gap: 16 }}>
                      <span style={{ fontSize: 12, fontWeight: 500, color: activeStep === i ? C.blue : C.gray300, letterSpacing: "0.05em", transition: "color 0.3s", minWidth: 24 }}>{s.num}</span>
                      <div>
                        <h3 style={{ fontSize: 20, fontWeight: 500, color: activeStep === i ? C.black : C.gray400, transition: "color 0.3s", letterSpacing: "-0.01em" }}>{s.title}</h3>
                        <div style={{ maxHeight: activeStep === i ? 80 : 0, overflow: "hidden", transition: "max-height 0.4s ease, opacity 0.3s", opacity: activeStep === i ? 1 : 0 }}>
                          <p style={{ fontSize: 15, lineHeight: 1.65, fontWeight: 400, color: C.gray500, marginTop: 8 }}>{s.body}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                <div style={{ borderTop: `1px solid ${C.gray200}` }} />
              </div>
            </div>
          </div>
        </section>

        {/* FEATURED ROBOTS */}
        <section style={{ background: C.white, padding: "64px 48px" }}>
          <div style={{ maxWidth: 1200, margin: "0 auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 48 }}>
              <div>
                <Label>Featured</Label>
                <h2 style={{ fontSize: "clamp(30px, 3.5vw, 44px)", fontWeight: 400, lineHeight: 1.15, letterSpacing: "-0.025em" }}>Featured robots.</h2>
              </div>
              <Btn to="/robots">View All &rarr;</Btn>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20 }}>
              {loading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} style={{ cursor: "pointer" }}>
                    <div style={{ width: "100%", aspectRatio: "4/3", borderRadius: 6, overflow: "hidden", marginBottom: 14, border: `1px solid ${C.gray100}`, background: C.gray50 }} />
                    <div style={{ height: 16, background: C.gray50, borderRadius: 4, marginBottom: 8, width: "60%" }} />
                    <div style={{ height: 12, background: C.gray50, borderRadius: 4, width: "40%" }} />
                  </div>
                ))
              ) : (
                displayRobots.map((r, i) => (
                  <div key={i}
                    onMouseEnter={() => setHCard(i)} onMouseLeave={() => setHCard(null)}
                    style={{ cursor: "pointer", transition: "transform 0.35s cubic-bezier(0.23,1,0.32,1)", transform: hCard === i ? "translateY(-3px)" : "translateY(0)" }}
                    onClick={() => r.id ? navigate(`/robots/${r.id}`) : navigate('/robots')}
                  >
                    <div style={{ width: "100%", aspectRatio: "4/3", borderRadius: 6, overflow: "hidden", marginBottom: 14, border: `1px solid ${C.gray100}` }}>
                      <img src={r.img} alt={r.name} style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.5s ease", transform: hCard === i ? "scale(1.04)" : "scale(1)" }} />
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 4 }}>
                      <h3 style={{ fontSize: 16, fontWeight: 700 }}>{r.name}</h3>
                      <span style={{ fontSize: 15, fontWeight: 700 }}>{r.price}<span style={{ fontWeight: 400, color: C.gray400, fontSize: 13 }}>{r.unit}</span></span>
                    </div>
                    <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: C.gray400, marginBottom: 4 }}>{r.cat}</div>
                    <div style={{ fontSize: 14, fontWeight: 400, color: C.gray500, marginBottom: 10 }}>{r.loc}</div>
                    <div style={{ borderTop: `1px solid ${C.gray100}`, paddingTop: 8, display: "flex", alignItems: "center", justifyContent: "flex-end" }}>
                      <span style={{ fontSize: 12, fontWeight: 500, color: C.blue }}>Available</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>

        {/* CATEGORIES */}
        <section style={{ background: C.gray50, padding: "64px 48px", borderTop: `1px solid ${C.gray100}` }}>
          <div style={{ maxWidth: 1100, margin: "0 auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 48 }}>
              <div>
                <Label>Categories</Label>
                <h2 style={{ fontSize: "clamp(30px, 3.5vw, 44px)", fontWeight: 400, lineHeight: 1.15, letterSpacing: "-0.025em" }}>Browse by type.</h2>
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)" }}>
              {catDetails.map((cat, i) => (
                <div key={i}
                  style={{ padding: "28px 24px", borderTop: `1px solid ${C.gray200}`, borderRight: (i % 3 !== 2) ? `1px solid ${C.gray200}` : "none", cursor: "pointer", transition: "background 0.25s" }}
                  onMouseEnter={e => (e.currentTarget.style.background = C.pureWhite)}
                  onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                  onClick={() => navigate(`/robots?category=${cat.name.toLowerCase()}`)}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 6 }}>
                    <h3 style={{ fontSize: 18, fontWeight: 500, letterSpacing: "-0.01em" }}>{cat.name}</h3>
                    <span style={{ fontSize: 13, fontWeight: 500, color: C.gray400 }}>{cat.count}</span>
                  </div>
                  <p style={{ fontSize: 14, lineHeight: 1.55, fontWeight: 400, color: C.gray500 }}>{cat.desc}</p>
                </div>
              ))}
            </div>
            <div style={{ borderTop: `1px solid ${C.gray200}` }} />
          </div>
        </section>

        {/* MISSION */}
        <section style={{ background: C.black, color: C.pureWhite, padding: "64px 48px" }}>
          <div style={{ maxWidth: 1100, margin: "0 auto" }}>
            <Label>Our Mission</Label>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "start" }}>
              <h2 style={{ fontSize: "clamp(30px, 3.5vw, 44px)", fontWeight: 400, lineHeight: 1.2, letterSpacing: "-0.025em" }}>Robotics should be accessible to everyone.</h2>
              <div>
                <p style={{ fontSize: 16, lineHeight: 1.75, fontWeight: 400, color: C.gray400, marginBottom: 20 }}>Whether you're a student learning to code, a hobbyist exploring automation, or a professional evaluating new tools — hands-on time shouldn't cost thousands of dollars.</p>
                <p style={{ fontSize: 16, lineHeight: 1.75, fontWeight: 400, color: C.gray400, marginBottom: 32 }}>DroidBRB connects robot owners with people who want to learn, experiment, or try before they buy. No gatekeeping. Just a community sharing what they have.</p>
                <Link to="/about" style={{ fontSize: 14, fontWeight: 500, color: C.blue, cursor: "pointer", borderBottom: `1px solid ${C.blue}`, paddingBottom: 2, textDecoration: "none" }}>Read our story &rarr;</Link>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section style={{ background: C.white, padding: "64px 48px", borderTop: `1px solid ${C.gray100}` }}>
          <div style={{ maxWidth: 800, margin: "0 auto", textAlign: "center" }}>
            <h2 style={{ fontSize: "clamp(30px, 4vw, 48px)", fontWeight: 400, lineHeight: 1.15, letterSpacing: "-0.025em", marginBottom: 16 }}>Ready to get started?</h2>
            <p style={{ fontSize: 17, lineHeight: 1.7, fontWeight: 400, color: C.gray500, maxWidth: 480, margin: "0 auto 36px" }}>Join thousands of robotics enthusiasts sharing, renting, and learning together.</p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
              <Btn variant="filled" to={currentUser ? "/robots" : "/register"}>
                {currentUser ? "Browse Robots" : "Create Free Account"}
              </Btn>
              <Btn to="/robots">Browse Robots</Btn>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
};

export default HomePage;
