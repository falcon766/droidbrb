import { useState, useEffect } from "react";

const C = {
  black: "#111111",
  dark: "#1A1A1A",
  gray900: "#222222",
  gray700: "#444444",
  gray500: "#777777",
  gray400: "#999999",
  gray300: "#BBBBBB",
  gray200: "#DDDDDD",
  gray100: "#EEEEEE",
  gray50: "#F5F5F3",
  white: "#FAFAF8",
  pureWhite: "#FFFFFF",
  blue: "#2563EB",
  blueHover: "#1D4FD7",
  blueMuted: "rgba(37,99,235,0.08)",
};

const featured = [
  { name: "Atlas Pro", cat: "Humanoid", price: "$85", unit: "/day", loc: "San Francisco, CA", img: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=500&h=380&fit=crop" },
  { name: "EduBot Mini", cat: "Educational", price: "$15", unit: "/day", loc: "Austin, TX", img: "https://images.unsplash.com/photo-1535378917042-10a22c95931a?w=500&h=380&fit=crop" },
  { name: "CruzServe X1", cat: "Service", price: "$120", unit: "/day", loc: "New York, NY", img: "https://images.unsplash.com/photo-1546776310-eef45dd6d63c?w=500&h=380&fit=crop" },
  { name: "NanoDrone V4", cat: "Drone", price: "$40", unit: "/day", loc: "Seattle, WA", img: "https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=500&h=380&fit=crop" },
];

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

function Label({ children }) {
  return <div style={{ fontSize:11, fontWeight:500, letterSpacing:"0.18em", textTransform:"uppercase", color:C.gray400, marginBottom:24 }}>{children}</div>;
}

function Btn({ children, variant="outline", dark, onClick }) {
  const [h, setH] = useState(false);
  const filled = variant === "filled";
  let bg, color, border;
  if (filled) { bg = h ? C.blueHover : C.blue; color = C.pureWhite; border = `1.5px solid ${bg}`; }
  else if (dark) { bg = h ? "rgba(255,255,255,0.06)" : "transparent"; color = C.gray300; border = "1.5px solid rgba(255,255,255,0.2)"; }
  else { bg = h ? C.gray50 : "transparent"; color = C.gray700; border = `1.5px solid ${C.gray200}`; }
  return (
    <button onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)} onClick={onClick}
      style={{ background:bg, color, border, padding:"12px 28px", borderRadius:100, fontSize:14, fontWeight:500, cursor:"pointer", transition:"all 0.25s", fontFamily:"inherit" }}
    >{children}</button>
  );
}

function RobotLogo({ color=C.black, size=22 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <line x1="12" y1="1" x2="12" y2="5" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
      <circle cx="12" cy="1" r="1" fill={color}/>
      <rect x="4" y="5" width="16" height="13" rx="3" stroke={color} strokeWidth="1.5"/>
      <circle cx="9" cy="12" r="2" fill={color}/>
      <circle cx="15" cy="12" r="2" fill={color}/>
      <line x1="9" y1="16" x2="15" y2="16" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
      <rect x="1" y="9" width="3" height="5" rx="1.5" stroke={color} strokeWidth="1.2"/>
      <rect x="20" y="9" width="3" height="5" rx="1.5" stroke={color} strokeWidth="1.2"/>
    </svg>
  );
}

function HeroCard() {
  const [h, setH] = useState(false);
  return (
    <div onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{ width:300, background:C.pureWhite, borderRadius:10, overflow:"hidden",
        boxShadow:"0 24px 80px rgba(0,0,0,0.4), 0 2px 8px rgba(0,0,0,0.15)",
        transform:`rotate(-2deg) translateY(${h?-6:0}px)`, transition:"transform 0.5s cubic-bezier(0.23,1,0.32,1)", position:"relative" }}>
      <div style={{ width:"100%", height:190, overflow:"hidden" }}>
        <img src="https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=500&h=380&fit=crop" alt="Atlas Pro"
          style={{ width:"100%", height:"100%", objectFit:"cover", transition:"transform 0.5s", transform:h?"scale(1.05)":"scale(1)" }} />
      </div>
      <div style={{ padding:"16px 18px 18px" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"baseline", marginBottom:4 }}>
          <span style={{ fontSize:15, fontWeight:700, color:C.black }}>Atlas Pro</span>
          <span style={{ fontSize:14, fontWeight:700, color:C.black }}>$85<span style={{ fontWeight:400, color:C.gray400, fontSize:12 }}>/day</span></span>
        </div>
        <div style={{ fontSize:11, fontWeight:500, letterSpacing:"0.1em", textTransform:"uppercase", color:C.gray400, marginBottom:4 }}>Humanoid</div>
        <div style={{ fontSize:13, color:C.gray500, marginBottom:10 }}>San Francisco, CA</div>
        <div style={{ borderTop:`1px solid ${C.gray100}`, paddingTop:8, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <span style={{ fontSize:12, fontWeight:500, color:C.gray500 }}>Owner: Alex M.</span>
          <span style={{ fontSize:11, fontWeight:500, color:C.blue }}>Available</span>
        </div>
      </div>
    </div>
  );
}

function HeroCardBack() {
  return (
    <div style={{ width:260, background:C.pureWhite, borderRadius:10, overflow:"hidden", opacity:0.5,
      boxShadow:"0 16px 48px rgba(0,0,0,0.25)", transform:"rotate(3deg) translate(30px, -30px)",
      position:"absolute", top:50, right:-20, zIndex:0 }}>
      <div style={{ width:"100%", height:160, overflow:"hidden" }}>
        <img src="https://images.unsplash.com/photo-1535378917042-10a22c95931a?w=500&h=380&fit=crop" alt="EduBot"
          style={{ width:"100%", height:"100%", objectFit:"cover" }} />
      </div>
      <div style={{ padding:"14px 16px 16px" }}>
        <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
          <span style={{ fontSize:14, fontWeight:700, color:C.black }}>EduBot Mini</span>
          <span style={{ fontSize:13, fontWeight:700, color:C.black }}>$15<span style={{ fontWeight:400, color:C.gray400, fontSize:11 }}>/day</span></span>
        </div>
        <div style={{ fontSize:10, fontWeight:500, letterSpacing:"0.1em", textTransform:"uppercase", color:C.gray400 }}>Educational</div>
      </div>
    </div>
  );
}

export default function DroidBRB() {
  const [search, setSearch] = useState("");
  const [loc, setLoc] = useState("");
  const [activeStep, setActiveStep] = useState(0);
  const [hCard, setHCard] = useState(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const inp = { width:"100%", padding:"14px 20px", background:"transparent", border:`1.5px solid ${C.gray200}`, borderRadius:100, fontSize:15, fontFamily:"inherit", fontWeight:400, color:C.black, outline:"none", transition:"border 0.3s" };

  return (
    <div style={{ fontFamily:"'Satoshi', sans-serif", color:C.black, overflowX:"hidden" }}>
      <style>{`
        @import url('https://api.fontshare.com/v2/css?f[]=satoshi@300,400,500,700&display=swap');
        * { box-sizing:border-box; margin:0; padding:0; }
        ::selection { background:${C.blueMuted}; color:${C.black}; }
        html { scroll-behavior:smooth; }
      `}</style>

      {/* NAV */}
      <nav style={{
        position:"fixed", top:0, left:0, right:0, zIndex:100, padding:"0 48px", height:64,
        display:"flex", alignItems:"center", justifyContent:"space-between",
        background: scrolled ? "rgba(255,255,255,0.92)" : "transparent",
        backdropFilter: scrolled ? "blur(16px)" : "none",
        borderBottom: scrolled ? `1px solid ${C.gray100}` : "1px solid transparent",
        transition:"all 0.4s ease",
      }}>
        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
          <RobotLogo color={scrolled ? C.black : C.pureWhite} />
          <span style={{ fontSize:14, fontWeight:700, letterSpacing:"0.12em", textTransform:"uppercase", color: scrolled ? C.black : C.pureWhite, transition:"color 0.4s" }}>DroidBRB</span>
        </div>
        <div style={{ display:"flex", gap:32, alignItems:"center" }}>
          {["Explore","About","List a Robot"].map((l,i) => (
            <span key={i} style={{ fontSize:13, fontWeight:500, letterSpacing:"0.06em", textTransform:"uppercase", color: scrolled ? C.gray500 : "rgba(255,255,255,0.6)", cursor:"pointer", transition:"color 0.3s" }}
              onMouseEnter={e => e.target.style.color = scrolled ? C.black : C.pureWhite}
              onMouseLeave={e => e.target.style.color = scrolled ? C.gray500 : "rgba(255,255,255,0.6)"}
            >{l}</span>
          ))}
          {scrolled ? <Btn>Sign In</Btn> : <Btn dark>Sign In</Btn>}
        </div>
      </nav>

      {/* HERO */}
      <section style={{ background:C.black, color:C.pureWhite, minHeight:"100vh", position:"relative", display:"flex", flexDirection:"column", justifyContent:"center", padding:"140px 48px 80px" }}>
        <div style={{ maxWidth:1200, margin:"0 auto", width:"100%", display:"grid", gridTemplateColumns:"1fr 1fr", gap:40, alignItems:"center" }}>
          <div>
            <h1 style={{ fontSize:"clamp(44px, 5.5vw, 72px)", fontWeight:400, lineHeight:1.08, letterSpacing:"-0.03em", marginBottom:28 }}>
              The peer-to-peer<br />robot rental<br />platform.
            </h1>
            <p style={{ fontSize:18, lineHeight:1.7, fontWeight:400, color:C.gray400, maxWidth:420, marginBottom:40 }}>
              Connect with robot owners in your area. Rent by the day, learn hands-on, and build together.
            </p>
            <div style={{ display:"flex", gap:16 }}>
              <Btn variant="filled">Browse Robots</Btn>
              <Btn dark>List Your Robot</Btn>
            </div>
          </div>
          <div style={{ display:"flex", justifyContent:"center", alignItems:"center", position:"relative", minHeight:420 }}>
            <HeroCardBack />
            <div style={{ position:"relative", zIndex:1 }}><HeroCard /></div>
          </div>
        </div>
        <div style={{ maxWidth:1200, margin:"60px auto 0", width:"100%" }}>
          <div style={{ display:"flex", gap:0, borderTop:`1px solid ${C.gray700}` }}>
            {stats.map((s,i) => (
              <div key={i} style={{ flex:1, padding:"28px 0", borderRight: i<2 ? `1px solid ${C.gray700}` : "none", paddingRight: i<2?24:0, paddingLeft: i>0?24:0 }}>
                <div style={{ fontSize:28, fontWeight:500, letterSpacing:"-0.02em", marginBottom:4 }}>{s.val}</div>
                <div style={{ fontSize:13, fontWeight:400, color:C.gray500 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SEARCH */}
      <section style={{ background:C.white, padding:"80px 48px 100px" }}>
        <div style={{ maxWidth:1100, margin:"0 auto" }}>
          <Label>Search</Label>
          <h2 style={{ fontSize:"clamp(30px, 3.5vw, 44px)", fontWeight:400, lineHeight:1.15, marginBottom:40, letterSpacing:"-0.025em" }}>Find robots near you.</h2>
          <div style={{ display:"flex", gap:12, alignItems:"center", marginBottom:24 }}>
            <div style={{ flex:1 }}>
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Robot name, type, or keyword" style={inp}
                onFocus={e => e.target.style.borderColor = C.black} onBlur={e => e.target.style.borderColor = C.gray200} />
            </div>
            <div style={{ flex:0.5 }}>
              <input value={loc} onChange={e => setLoc(e.target.value)} placeholder="City or zip code" style={inp}
                onFocus={e => e.target.style.borderColor = C.black} onBlur={e => e.target.style.borderColor = C.gray200} />
            </div>
            <Btn variant="filled">Search</Btn>
          </div>
          <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
            {cats.map((c,i) => (
              <span key={i} style={{ padding:"7px 16px", borderRadius:100, border:`1px solid ${C.gray200}`, fontSize:13, fontWeight:500, color:C.gray500, cursor:"pointer", transition:"all 0.2s" }}
                onMouseEnter={e => { e.target.style.borderColor = C.black; e.target.style.color = C.black; }}
                onMouseLeave={e => { e.target.style.borderColor = C.gray200; e.target.style.color = C.gray500; }}
              >{c}</span>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={{ background:C.gray50, padding:"100px 48px", borderTop:`1px solid ${C.gray100}`, borderBottom:`1px solid ${C.gray100}` }}>
        <div style={{ maxWidth:1100, margin:"0 auto" }}>
          <Label>How It Works</Label>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:80 }}>
            <h2 style={{ fontSize:"clamp(30px, 3.5vw, 44px)", fontWeight:400, lineHeight:1.15, letterSpacing:"-0.025em" }}>Three steps to hands-on robotics.</h2>
            <div>
              {howSteps.map((s,i) => (
                <div key={i} onClick={() => setActiveStep(i)}
                  style={{ borderTop:`1px solid ${activeStep===i?C.black:C.gray200}`, padding:"24px 0", cursor:"pointer", transition:"all 0.3s" }}>
                  <div style={{ display:"flex", alignItems:"baseline", gap:16 }}>
                    <span style={{ fontSize:12, fontWeight:500, color:activeStep===i?C.blue:C.gray300, letterSpacing:"0.05em", transition:"color 0.3s", minWidth:24 }}>{s.num}</span>
                    <div>
                      <h3 style={{ fontSize:20, fontWeight:500, color:activeStep===i?C.black:C.gray400, transition:"color 0.3s", letterSpacing:"-0.01em" }}>{s.title}</h3>
                      <div style={{ maxHeight:activeStep===i?80:0, overflow:"hidden", transition:"max-height 0.4s ease, opacity 0.3s", opacity:activeStep===i?1:0 }}>
                        <p style={{ fontSize:15, lineHeight:1.65, fontWeight:400, color:C.gray500, marginTop:8 }}>{s.body}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              <div style={{ borderTop:`1px solid ${C.gray200}` }} />
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED ROBOTS */}
      <section style={{ background:C.white, padding:"100px 48px" }}>
        <div style={{ maxWidth:1200, margin:"0 auto" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end", marginBottom:48 }}>
            <div>
              <Label>Featured</Label>
              <h2 style={{ fontSize:"clamp(30px, 3.5vw, 44px)", fontWeight:400, lineHeight:1.15, letterSpacing:"-0.025em" }}>Featured robots.</h2>
            </div>
            <Btn>View All →</Btn>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(4, 1fr)", gap:20 }}>
            {featured.map((r,i) => (
              <div key={i} onMouseEnter={() => setHCard(i)} onMouseLeave={() => setHCard(null)}
                style={{ cursor:"pointer", transition:"transform 0.35s cubic-bezier(0.23,1,0.32,1)", transform:hCard===i?"translateY(-3px)":"translateY(0)" }}>
                <div style={{ width:"100%", aspectRatio:"4/3", borderRadius:6, overflow:"hidden", marginBottom:14, border:`1px solid ${C.gray100}` }}>
                  <img src={r.img} alt={r.name} style={{ width:"100%", height:"100%", objectFit:"cover", transition:"transform 0.5s ease", transform:hCard===i?"scale(1.04)":"scale(1)" }} />
                </div>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"baseline", marginBottom:4 }}>
                  <h3 style={{ fontSize:16, fontWeight:700 }}>{r.name}</h3>
                  <span style={{ fontSize:15, fontWeight:700 }}>{r.price}<span style={{ fontWeight:400, color:C.gray400, fontSize:13 }}>{r.unit}</span></span>
                </div>
                <div style={{ fontSize:11, fontWeight:500, letterSpacing:"0.1em", textTransform:"uppercase", color:C.gray400, marginBottom:4 }}>{r.cat}</div>
                <div style={{ fontSize:14, fontWeight:400, color:C.gray500, marginBottom:10 }}>{r.loc}</div>
                <div style={{ borderTop:`1px solid ${C.gray100}`, paddingTop:8, display:"flex", alignItems:"center", justifyContent:"flex-end" }}>
                  <span style={{ fontSize:12, fontWeight:500, color:C.blue }}>Available</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section style={{ background:C.gray50, padding:"100px 48px", borderTop:`1px solid ${C.gray100}` }}>
        <div style={{ maxWidth:1100, margin:"0 auto" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end", marginBottom:48 }}>
            <div>
              <Label>Categories</Label>
              <h2 style={{ fontSize:"clamp(30px, 3.5vw, 44px)", fontWeight:400, lineHeight:1.15, letterSpacing:"-0.025em" }}>Browse by type.</h2>
            </div>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(3, 1fr)" }}>
            {catDetails.map((cat,i) => (
              <div key={i} style={{ padding:"28px 24px", borderTop:`1px solid ${C.gray200}`, borderRight:(i%3!==2)?`1px solid ${C.gray200}`:"none", cursor:"pointer", transition:"background 0.25s" }}
                onMouseEnter={e => e.currentTarget.style.background = C.pureWhite}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"baseline", marginBottom:6 }}>
                  <h3 style={{ fontSize:18, fontWeight:500, letterSpacing:"-0.01em" }}>{cat.name}</h3>
                  <span style={{ fontSize:13, fontWeight:500, color:C.gray400 }}>{cat.count}</span>
                </div>
                <p style={{ fontSize:14, lineHeight:1.55, fontWeight:400, color:C.gray500 }}>{cat.desc}</p>
              </div>
            ))}
          </div>
          <div style={{ borderTop:`1px solid ${C.gray200}` }} />
        </div>
      </section>

      {/* MISSION */}
      <section style={{ background:C.black, color:C.pureWhite, padding:"100px 48px" }}>
        <div style={{ maxWidth:1100, margin:"0 auto" }}>
          <Label>Our Mission</Label>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:80, alignItems:"start" }}>
            <h2 style={{ fontSize:"clamp(30px, 3.5vw, 44px)", fontWeight:400, lineHeight:1.2, letterSpacing:"-0.025em" }}>Robotics should be accessible to everyone.</h2>
            <div>
              <p style={{ fontSize:16, lineHeight:1.75, fontWeight:400, color:C.gray400, marginBottom:20 }}>Whether you're a student learning to code, a hobbyist exploring automation, or a professional evaluating new tools — hands-on time shouldn't cost thousands of dollars.</p>
              <p style={{ fontSize:16, lineHeight:1.75, fontWeight:400, color:C.gray400, marginBottom:32 }}>DroidBRB connects robot owners with people who want to learn, experiment, or try before they buy. No gatekeeping. Just a community sharing what they have.</p>
              <span style={{ fontSize:14, fontWeight:500, color:C.blue, cursor:"pointer", borderBottom:`1px solid ${C.blue}`, paddingBottom:2 }}>Read our story →</span>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background:C.white, padding:"100px 48px", borderTop:`1px solid ${C.gray100}` }}>
        <div style={{ maxWidth:800, margin:"0 auto", textAlign:"center" }}>
          <h2 style={{ fontSize:"clamp(30px, 4vw, 48px)", fontWeight:400, lineHeight:1.15, letterSpacing:"-0.025em", marginBottom:16 }}>Ready to get started?</h2>
          <p style={{ fontSize:17, lineHeight:1.7, fontWeight:400, color:C.gray500, maxWidth:480, margin:"0 auto 36px" }}>Join thousands of robotics enthusiasts sharing, renting, and learning together.</p>
          <div style={{ display:"flex", gap:12, justifyContent:"center" }}>
            <Btn variant="filled">Create Free Account</Btn>
            <Btn>Browse Robots</Btn>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background:C.gray50, padding:"56px 48px 36px", borderTop:`1px solid ${C.gray100}` }}>
        <div style={{ maxWidth:1100, margin:"0 auto" }}>
          <div style={{ display:"grid", gridTemplateColumns:"2.5fr 1fr 1fr 1fr", gap:56, marginBottom:56 }}>
            <div>
              <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:14 }}>
                <RobotLogo size={18} />
                <span style={{ fontSize:13, fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase" }}>DroidBRB</span>
              </div>
              <p style={{ fontSize:14, lineHeight:1.65, fontWeight:400, color:C.gray500, maxWidth:260 }}>Peer-to-peer robot sharing. Connect locally, rent by the day, learn hands-on.</p>
            </div>
            {[
              { title:"Explore", links:["Browse Robots","Categories","Featured","Near Me"] },
              { title:"Community", links:["About","Blog","Events","Help"] },
              { title:"Account", links:["Sign In","Sign Up","List a Robot","Dashboard"] },
            ].map((col,i) => (
              <div key={i}>
                <h4 style={{ fontSize:11, letterSpacing:"0.14em", textTransform:"uppercase", color:C.gray400, marginBottom:18, fontWeight:500 }}>{col.title}</h4>
                {col.links.map((link,j) => (
                  <div key={j} style={{ fontSize:14, fontWeight:400, color:C.gray500, padding:"4px 0", cursor:"pointer", transition:"color 0.2s" }}
                    onMouseEnter={e => e.target.style.color = C.black}
                    onMouseLeave={e => e.target.style.color = C.gray500}
                  >{link}</div>
                ))}
              </div>
            ))}
          </div>
          <div style={{ borderTop:`1px solid ${C.gray200}`, paddingTop:20, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
            <span style={{ fontSize:13, fontWeight:400, color:C.gray400 }}>© 2025 DroidBRB</span>
            <div style={{ display:"flex", gap:20 }}>
              {["Privacy","Terms","Contact"].map((x,i) => (
                <span key={i} style={{ fontSize:13, fontWeight:400, color:C.gray400, cursor:"pointer" }}
                  onMouseEnter={e => e.target.style.color = C.black}
                  onMouseLeave={e => e.target.style.color = C.gray400}
                >{x}</span>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
