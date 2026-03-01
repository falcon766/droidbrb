import React, { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { searchService, SearchFilters } from '../services/searchService';
import { Robot } from '../types';
import { useAuth } from '../context/AuthContext';
import { distanceService, Coordinates } from '../services/distanceService';
import DistanceFilter from '../components/DistanceFilter';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import RobotLogo from '../components/RobotLogo';
import { C } from '../design';

const categories = [
  { id: 'all', name: 'All' },
  { id: 'humanoid', name: 'Humanoid' },
  { id: 'industrial', name: 'Industrial' },
  { id: 'educational', name: 'Educational' },
  { id: 'hobby', name: 'Hobby' },
  { id: 'drone', name: 'Drone' },
  { id: 'service', name: 'Service' },
  { id: 'medical', name: 'Medical' },
  { id: 'other', name: 'Other' },
];

const RobotsPage: React.FC = () => {
  const { userProfile } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [robots, setRobots] = useState<Robot[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<SearchFilters>({});
  const [showFilters, setShowFilters] = useState(false);
  const [locationSuggestions, setLocationSuggestions] = useState<any[]>([]);
  const [showLocationSuggestions, setShowLocationSuggestions] = useState(false);
  const [maxDistance, setMaxDistance] = useState(25);
  const [userLocation, setUserLocation] = useState<Coordinates | null>(null);
  const [searchLocationCoordinates, setSearchLocationCoordinates] = useState<Coordinates | null>(null);
  const [hCard, setHCard] = useState<string | null>(null);

  useEffect(() => {
    const query = searchParams.get('query') || '';
    const location = searchParams.get('location') || '';
    const category = searchParams.get('category') || '';
    const distance = searchParams.get('distance') || '';
    setFilters({
      query: query || undefined,
      location: location || undefined,
      category: category || undefined,
    });
    if (distance) setMaxDistance(Number(distance));
  }, [searchParams]);

  useEffect(() => {
    if (userProfile?.latitude && userProfile?.longitude) {
      setUserLocation({ latitude: userProfile.latitude, longitude: userProfile.longitude });
    }
  }, [userProfile]);

  useEffect(() => {
    const geocodeSearchLocation = async () => {
      if (filters.location) {
        const coordinates = await distanceService.getCoordinatesFromAddress(filters.location);
        setSearchLocationCoordinates(coordinates);
      } else {
        setSearchLocationCoordinates(null);
      }
    };
    geocodeSearchLocation();
  }, [filters.location]);

  useEffect(() => {
    if (filters.query || filters.location || filters.category) {
      fetchRobots();
    } else {
      setRobots([]);
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, maxDistance]);

  const fetchRobots = async () => {
    setLoading(true);
    try {
      const searchFilters = {
        ...filters,
        userLatitude: userLocation?.latitude,
        userLongitude: userLocation?.longitude,
        maxDistance,
      };
      const results = await searchService.searchRobots(searchFilters);
      setRobots(results);
    } catch (error) {
      console.error('Error fetching robots:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (value: string) => {
    setFilters(prev => ({ ...prev, query: value }));
  };

  const handleLocationChange = async (value: string) => {
    setFilters(prev => ({ ...prev, location: value }));
    if (value.length >= 3) {
      const suggestions = await searchService.getLocationSuggestions(value);
      setLocationSuggestions(suggestions);
      setShowLocationSuggestions(true);
    } else {
      setLocationSuggestions([]);
      setShowLocationSuggestions(false);
    }
  };

  const handleLocationSelect = (suggestion: any) => {
    setFilters(prev => ({ ...prev, location: suggestion.description }));
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

  const handleCategoryChange = (category: string) => {
    setFilters(prev => ({ ...prev, category: category === 'all' ? undefined : category }));
  };

  const clearFilters = () => {
    setFilters({});
    setMaxDistance(25);
    setSearchLocationCoordinates(null);
  };

  const handleDistanceChange = (distance: number) => {
    setMaxDistance(distance);
    setTimeout(() => fetchRobots(), 100);
  };

  const inp: React.CSSProperties = {
    width: "100%", padding: "14px 20px", background: "transparent",
    border: "1.5px solid rgba(255,255,255,0.2)", borderRadius: 100,
    fontSize: 15, fontFamily: "inherit", fontWeight: 400, color: C.pureWhite, outline: "none", transition: "border 0.3s",
  };

  return (
    <div style={{ fontFamily: "'Satoshi', sans-serif", color: C.black }}>
      <Navbar />

      {/* Search Header */}
      <section style={{ background: C.black, color: C.pureWhite, padding: "120px 48px 48px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: "0.18em", textTransform: "uppercase", color: C.gray400, marginBottom: 24 }}>Browse</div>
          <h1 style={{ fontSize: "clamp(30px, 3.5vw, 44px)", fontWeight: 400, lineHeight: 1.15, letterSpacing: "-0.025em", marginBottom: 40 }}>Find robots near you.</h1>

          {/* Search Inputs */}
          <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 24 }}>
            <div style={{ flex: 1 }}>
              <input value={filters.query || ''} onChange={e => handleSearchChange(e.target.value)} placeholder="Robot name, type, or keyword" style={inp}
                onFocus={e => (e.target.style.borderColor = "rgba(255,255,255,0.5)")} onBlur={e => (e.target.style.borderColor = "rgba(255,255,255,0.2)")} />
            </div>
            <div style={{ flex: 0.5, position: "relative" }} className="location-input-container">
              <input value={filters.location || ''} onChange={e => handleLocationChange(e.target.value)} placeholder="City or zip code" style={inp}
                onFocus={e => { e.target.style.borderColor = "rgba(255,255,255,0.5)"; if (locationSuggestions.length > 0) setShowLocationSuggestions(true); }}
                onBlur={e => (e.target.style.borderColor = "rgba(255,255,255,0.2)")} autoComplete="off" />
              {showLocationSuggestions && locationSuggestions.length > 0 && (
                <div style={{
                  position: "absolute", top: "100%", left: 0, right: 0, marginTop: 4,
                  background: C.pureWhite, border: `1px solid ${C.gray100}`, borderRadius: 12,
                  boxShadow: "0 8px 30px rgba(0,0,0,0.08)", zIndex: 20, maxHeight: 200, overflowY: "auto",
                }}>
                  {locationSuggestions.map((suggestion: any) => (
                    <button key={suggestion.place_id} type="button"
                      onClick={() => handleLocationSelect(suggestion)}
                      style={{ display: "block", width: "100%", textAlign: "left", padding: "10px 16px", background: "none", border: "none", borderBottom: `1px solid ${C.gray100}`, cursor: "pointer", fontFamily: "inherit", transition: "background 0.15s" }}
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
            <button onClick={() => fetchRobots()}
              style={{ padding: "12px 28px", borderRadius: 100, fontSize: 14, fontWeight: 500, cursor: "pointer", transition: "all 0.25s", fontFamily: "inherit", background: C.blue, color: C.pureWhite, border: `1.5px solid ${C.blue}` }}
              onMouseEnter={e => { e.currentTarget.style.background = C.blueHover; e.currentTarget.style.borderColor = C.blueHover; }}
              onMouseLeave={e => { e.currentTarget.style.background = C.blue; e.currentTarget.style.borderColor = C.blue; }}
            >Search</button>
          </div>

          {/* Category Pills */}
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
            {categories.map((cat) => {
              const isActive = (filters.category || 'all') === cat.id;
              return (
                <span key={cat.id}
                  style={{
                    padding: "7px 16px", borderRadius: 100,
                    border: `1px solid ${isActive ? C.pureWhite : "rgba(255,255,255,0.2)"}`,
                    fontSize: 13, fontWeight: 500,
                    color: isActive ? C.pureWhite : C.gray400,
                    cursor: "pointer", transition: "all 0.2s",
                    background: isActive ? "rgba(255,255,255,0.1)" : "transparent",
                  }}
                  onMouseEnter={e => { if (!isActive) { e.currentTarget.style.borderColor = "rgba(255,255,255,0.5)"; e.currentTarget.style.color = C.pureWhite; } }}
                  onMouseLeave={e => { if (!isActive) { e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)"; e.currentTarget.style.color = C.gray400; } }}
                  onClick={() => handleCategoryChange(cat.id)}
                >{cat.name}</span>
              );
            })}
          </div>

          {/* Advanced Filters Toggle */}
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <button onClick={() => setShowFilters(!showFilters)}
              style={{ fontSize: 13, fontWeight: 500, color: C.gray400, cursor: "pointer", background: "none", border: "none", fontFamily: "inherit", textDecoration: "underline", transition: "color 0.2s" }}
              onMouseEnter={e => (e.currentTarget.style.color = C.pureWhite)}
              onMouseLeave={e => (e.currentTarget.style.color = C.gray400)}
            >{showFilters ? 'Hide Filters' : 'More Filters'}</button>
            {(filters.query || filters.location || filters.category) && (
              <button onClick={clearFilters}
                style={{ fontSize: 13, fontWeight: 500, color: C.blue, cursor: "pointer", background: "none", border: "none", fontFamily: "inherit" }}
              >Clear All</button>
            )}
          </div>

          {/* Advanced Filters Panel */}
          {showFilters && (
            <div style={{ marginTop: 24, padding: 24, border: `1px solid rgba(255,255,255,0.1)`, borderRadius: 12, background: "rgba(255,255,255,0.05)" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 24 }}>
                <div>
                  <DistanceFilter maxDistance={maxDistance} onDistanceChange={handleDistanceChange} userLocation={userLocation || undefined} />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: C.gray400, marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.1em" }}>Min Price</label>
                  <input type="number" placeholder="$0" value={filters.minPrice || ''}
                    onChange={e => setFilters(prev => ({ ...prev, minPrice: Number(e.target.value) || undefined }))}
                    style={{ ...inp, padding: "10px 16px" }} />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: C.gray400, marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.1em" }}>Max Price</label>
                  <input type="number" placeholder="$999" value={filters.maxPrice || ''}
                    onChange={e => setFilters(prev => ({ ...prev, maxPrice: Number(e.target.value) || undefined }))}
                    style={{ ...inp, padding: "10px 16px" }} />
                </div>
              </div>
            </div>
          )}

          {/* Active filters summary */}
          {(filters.query || filters.location) && !loading && (
            <div style={{ marginTop: 20, fontSize: 14, color: C.gray400 }}>
              {robots.length} robot{robots.length !== 1 ? 's' : ''} found
              {filters.location && maxDistance && ` within ${maxDistance} miles of ${filters.location}`}
            </div>
          )}
        </div>
      </section>

      {/* Results */}
      <section style={{ background: C.gray50, padding: "60px 48px 100px", minHeight: 400 }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          {loading ? (
            <div style={{ textAlign: "center", padding: "80px 0" }}>
              <div style={{ width: 40, height: 40, border: `3px solid ${C.gray200}`, borderTopColor: C.blue, borderRadius: "50%", margin: "0 auto 20px", animation: "spin 0.8s linear infinite" }} />
              <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
              <p style={{ fontSize: 16, color: C.gray500 }}>
                {filters.location && maxDistance ? `Searching within ${maxDistance} miles of ${filters.location}...` : 'Finding available robots...'}
              </p>
            </div>
          ) : robots.length === 0 ? (
            <div style={{ textAlign: "center", padding: "80px 0" }}>
              <RobotLogo color={C.gray300} size={48} />
              <h3 style={{ fontSize: 20, fontWeight: 500, marginTop: 20, marginBottom: 8 }}>No robots found</h3>
              <p style={{ fontSize: 15, color: C.gray500, marginBottom: 28, maxWidth: 400, margin: "0 auto 28px" }}>
                {filters.location && maxDistance
                  ? `No robots found within ${maxDistance} miles. Try expanding your search.`
                  : 'Try adjusting your search or be the first to list a robot!'}
              </p>
              <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
                {filters.location && (
                  <button onClick={() => setMaxDistance(Math.min(maxDistance * 2, 100))}
                    style={{ padding: "12px 28px", borderRadius: 100, fontSize: 14, fontWeight: 500, cursor: "pointer", border: `1.5px solid ${C.gray200}`, background: "transparent", color: C.gray700, fontFamily: "inherit" }}>
                    Expand Search
                  </button>
                )}
                <Link to="/create-robot" style={{ padding: "12px 28px", borderRadius: 100, fontSize: 14, fontWeight: 500, cursor: "pointer", background: C.blue, color: C.pureWhite, border: `1.5px solid ${C.blue}`, textDecoration: "none" }}>
                  List Your Robot
                </Link>
              </div>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
              {robots.map((robot) => (
                <div key={robot.id}
                  onMouseEnter={() => setHCard(robot.id)}
                  onMouseLeave={() => setHCard(null)}
                  style={{ cursor: "pointer", transition: "transform 0.35s cubic-bezier(0.23,1,0.32,1)", transform: hCard === robot.id ? "translateY(-3px)" : "translateY(0)" }}
                  onClick={() => navigate(`/robots/${robot.id}`)}
                >
                  <div style={{ width: "100%", aspectRatio: "4/3", borderRadius: 6, overflow: "hidden", marginBottom: 14, border: `1px solid ${C.gray100}`, background: C.pureWhite, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {robot.images && robot.images.length > 0 ? (
                      <img src={robot.images[0]} alt={robot.name}
                        style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.5s ease", transform: hCard === robot.id ? "scale(1.04)" : "scale(1)" }}
                        onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                    ) : (
                      <RobotLogo color={C.gray300} size={40} />
                    )}
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 4 }}>
                    <h3 style={{ fontSize: 16, fontWeight: 700 }}>{robot.name}</h3>
                    <span style={{ fontSize: 15, fontWeight: 700 }}>${robot.price}<span style={{ fontWeight: 400, color: C.gray400, fontSize: 13 }}>/day</span></span>
                  </div>
                  <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: C.gray400, marginBottom: 4 }}>{robot.category}</div>
                  <div style={{ fontSize: 14, fontWeight: 400, color: C.gray500, marginBottom: 10 }}>
                    {robot.location}
                    {searchLocationCoordinates && robot.latitude && robot.longitude && (
                      <span style={{ color: C.blue, marginLeft: 8 }}>
                        {distanceService.calculateDistance(searchLocationCoordinates, { latitude: robot.latitude, longitude: robot.longitude }).toFixed(1)} mi
                      </span>
                    )}
                  </div>
                  <div style={{ borderTop: `1px solid ${C.gray100}`, paddingTop: 8, display: "flex", alignItems: "center", justifyContent: "flex-end" }}>
                    <span style={{ fontSize: 12, fontWeight: 500, color: robot.isAvailable ? C.blue : C.gray400 }}>
                      {robot.isAvailable ? 'Available' : 'Rented'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default RobotsPage;
