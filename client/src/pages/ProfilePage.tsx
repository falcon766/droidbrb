import React, { useState, useRef, useEffect, useCallback } from 'react';
import { User, Camera, Save, Trash2, Check, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { storage, db } from '../firebase/config';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { doc, updateDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { updateProfile } from 'firebase/auth';
import { Expertise } from '../types';
import { searchService, LocationSuggestion } from '../services/searchService';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { C } from '../design';
import toast from 'react-hot-toast';

const ProfilePage: React.FC = () => {
  const { currentUser, userProfile, updateUserProfile } = useAuth();
  const [firstName, setFirstName] = useState(userProfile?.firstName || '');
  const [lastName, setLastName] = useState(userProfile?.lastName || '');
  const [username, setUsername] = useState(userProfile?.username || '');
  const [bio, setBio] = useState(userProfile?.bio || '');
  const [location, setLocation] = useState(userProfile?.location || '');
  const [expertise, setExpertise] = useState<Expertise>(userProfile?.expertise || Expertise.BEGINNER);
  const [avatarPreview, setAvatarPreview] = useState<string>(userProfile?.avatar || '');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [removingAvatar, setRemovingAvatar] = useState(false);
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Username uniqueness
  const [usernameStatus, setUsernameStatus] = useState<'idle' | 'checking' | 'available' | 'taken'>('idle');
  const usernameTimer = useRef<NodeJS.Timeout | null>(null);

  // Location autocomplete
  const [locationSuggestions, setLocationSuggestions] = useState<LocationSuggestion[]>([]);
  const [showLocationSuggestions, setShowLocationSuggestions] = useState(false);

  const checkUsername = useCallback(async (value: string) => {
    if (!value || value.length < 3 || !db) { setUsernameStatus('idle'); return; }
    // If unchanged from current profile, it's fine
    if (value === userProfile?.username) { setUsernameStatus('available'); return; }
    setUsernameStatus('checking');
    try {
      const q = query(collection(db, 'users'), where('username', '==', value));
      const snap = await getDocs(q);
      // Filter out the current user's own doc
      const taken = snap.docs.some(d => d.id !== currentUser?.uid);
      setUsernameStatus(taken ? 'taken' : 'available');
    } catch {
      setUsernameStatus('idle');
    }
  }, [currentUser?.uid, userProfile?.username]);

  const handleUsernameChange = (value: string) => {
    // Only allow lowercase alphanumeric, underscores, dots
    const sanitized = value.toLowerCase().replace(/[^a-z0-9_.]/g, '');
    setUsername(sanitized);
    setUsernameStatus('idle');
    if (usernameTimer.current) clearTimeout(usernameTimer.current);
    usernameTimer.current = setTimeout(() => checkUsername(sanitized), 500);
  };

  const handleLocationChange = async (value: string) => {
    setLocation(value);
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
    setLocation(suggestion.description);
    setShowLocationSuggestions(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.profile-location-container')) setShowLocationSuggestions(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) { toast.error('Please select an image file'); return; }
    if (file.size > 5 * 1024 * 1024) { toast.error('Image must be under 5MB'); return; }
    setAvatarFile(file); setRemovingAvatar(false);
    const reader = new FileReader();
    reader.onloadend = () => setAvatarPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleRemoveAvatar = () => {
    setAvatarFile(null); setAvatarPreview(''); setRemovingAvatar(true);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSave = async () => {
    if (!currentUser) return;
    if (usernameStatus === 'taken') { toast.error('That username is already taken'); return; }
    if (username && username.length < 3) { toast.error('Username must be at least 3 characters'); return; }
    setSaving(true);
    try {
      let avatarUrl = userProfile?.avatar || '';
      if (avatarFile && storage) {
        const storageRef = ref(storage, `avatars/${currentUser.uid}`);
        await uploadBytes(storageRef, avatarFile);
        avatarUrl = await getDownloadURL(storageRef);
      }
      if (removingAvatar) {
        if (userProfile?.avatar && storage) { try { await deleteObject(ref(storage, `avatars/${currentUser.uid}`)); } catch {} }
        avatarUrl = '';
      }
      await updateUserProfile({ firstName, lastName, username, bio, location, expertise });
      if ((avatarFile || removingAvatar) && db) {
        await updateDoc(doc(db, 'users', currentUser.uid), { avatar: avatarUrl });
        await updateProfile(currentUser, { photoURL: avatarUrl || null });
      }
      setAvatarFile(null); setRemovingAvatar(false);
      toast.success('Profile updated!');
    } catch (error: any) { console.error(error); toast.error('Failed to update profile'); }
    finally { setSaving(false); }
  };

  // Format createdAt — handles both Firestore Timestamps and plain Dates
  const formatMemberSince = () => {
    if (!userProfile?.createdAt) return '—';
    const date = userProfile.createdAt instanceof Date ? userProfile.createdAt : new Date(userProfile.createdAt);
    if (isNaN(date.getTime())) return '—';
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  const inp: React.CSSProperties = {
    width: "100%", padding: "12px 16px", background: C.pureWhite,
    border: `1.5px solid ${C.gray200}`, borderRadius: 10,
    fontSize: 15, fontFamily: "inherit", fontWeight: 400, color: C.black, outline: "none", transition: "border 0.3s",
  };

  const labelStyle: React.CSSProperties = { display: "block", fontSize: 14, fontWeight: 500, color: C.black, marginBottom: 8 };
  const cardStyle: React.CSSProperties = { background: C.pureWhite, border: `1px solid ${C.gray100}`, borderRadius: 12, padding: 28 };

  return (
    <div style={{ fontFamily: "'Satoshi', sans-serif", color: C.black }}>
      <Navbar />

      <section style={{ background: C.black, color: C.pureWhite, padding: "120px 48px 48px" }}>
        <div style={{ maxWidth: 700, margin: "0 auto" }}>
          <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: "0.18em", textTransform: "uppercase", color: C.gray400, marginBottom: 24 }}>Profile</div>
          <h1 style={{ fontSize: "clamp(30px, 3.5vw, 44px)", fontWeight: 400, letterSpacing: "-0.025em" }}>Edit your profile.</h1>
        </div>
      </section>

      <section style={{ background: C.gray50, padding: "48px 48px 100px" }}>
        <div style={{ maxWidth: 700, margin: "0 auto", display: "flex", flexDirection: "column", gap: 24 }}>
          {/* Avatar */}
          <div style={cardStyle}>
            <h2 style={{ fontSize: 18, fontWeight: 500, marginBottom: 20, letterSpacing: "-0.01em" }}>Profile Photo</h2>
            <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
              <div style={{ position: "relative" }}>
                {avatarPreview ? (
                  <img src={avatarPreview} alt="Avatar" style={{ width: 80, height: 80, borderRadius: "50%", objectFit: "cover", border: `1px solid ${C.gray100}` }} />
                ) : (
                  <div style={{ width: 80, height: 80, borderRadius: "50%", background: C.gray50, border: `1px solid ${C.gray100}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <User size={32} color={C.gray300} />
                  </div>
                )}
                <button type="button" onClick={() => fileInputRef.current?.click()}
                  style={{ position: "absolute", bottom: 0, right: 0, width: 28, height: 28, borderRadius: "50%", background: C.blue, color: C.pureWhite, border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Camera size={14} />
                </button>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <button type="button" onClick={() => fileInputRef.current?.click()}
                  style={{ fontSize: 14, fontWeight: 500, color: C.blue, background: "none", border: "none", cursor: "pointer", fontFamily: "inherit", textAlign: "left" }}>Upload new photo</button>
                {avatarPreview && (
                  <button type="button" onClick={handleRemoveAvatar}
                    style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 13, color: "#ef4444", background: "none", border: "none", cursor: "pointer", fontFamily: "inherit" }}>
                    <Trash2 size={13} /> Remove photo
                  </button>
                )}
                <span style={{ fontSize: 12, color: C.gray400 }}>JPG, PNG or GIF &middot; Max 5MB</span>
              </div>
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
            </div>
          </div>

          {/* Personal Info */}
          <div style={cardStyle}>
            <h2 style={{ fontSize: 18, fontWeight: 500, marginBottom: 20, letterSpacing: "-0.01em" }}>Personal Information</h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div>
                <label style={labelStyle}>First Name</label>
                <input type="text" value={firstName} onChange={e => setFirstName(e.target.value)} style={inp}
                  onFocus={e => (e.target.style.borderColor = C.black)} onBlur={e => (e.target.style.borderColor = C.gray200)} />
              </div>
              <div>
                <label style={labelStyle}>Last Name</label>
                <input type="text" value={lastName} onChange={e => setLastName(e.target.value)} style={inp}
                  onFocus={e => (e.target.style.borderColor = C.black)} onBlur={e => (e.target.style.borderColor = C.gray200)} />
              </div>
              <div style={{ gridColumn: "1 / -1" }}>
                <label style={labelStyle}>Username</label>
                <div style={{ position: "relative" }}>
                  <input type="text" value={username} onChange={e => handleUsernameChange(e.target.value)}
                    placeholder="lowercase letters, numbers, _ and ."
                    style={{
                      ...inp,
                      borderColor: usernameStatus === 'taken' ? '#ef4444' : usernameStatus === 'available' ? '#22c55e' : C.gray200,
                      paddingRight: 40,
                    }}
                    onFocus={e => { if (usernameStatus === 'idle') e.target.style.borderColor = C.black; }}
                    onBlur={e => { if (usernameStatus === 'idle') e.target.style.borderColor = C.gray200; }} />
                  {usernameStatus === 'checking' && (
                    <div style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)" }}>
                      <div style={{ width: 16, height: 16, border: `2px solid ${C.gray200}`, borderTopColor: C.blue, borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
                    </div>
                  )}
                  {usernameStatus === 'available' && (
                    <div style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", color: "#22c55e" }}>
                      <Check size={16} />
                    </div>
                  )}
                  {usernameStatus === 'taken' && (
                    <div style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", color: "#ef4444" }}>
                      <AlertCircle size={16} />
                    </div>
                  )}
                </div>
                {usernameStatus === 'taken' && (
                  <p style={{ fontSize: 13, color: "#ef4444", marginTop: 4 }}>This username is already taken</p>
                )}
                {usernameStatus === 'available' && username !== userProfile?.username && (
                  <p style={{ fontSize: 13, color: "#22c55e", marginTop: 4 }}>Username is available</p>
                )}
              </div>
              <div style={{ gridColumn: "1 / -1" }} className="profile-location-container">
                <label style={labelStyle}>Location</label>
                <div style={{ position: "relative" }}>
                  <input type="text" value={location} onChange={e => handleLocationChange(e.target.value)} placeholder="Start typing a city or address..." style={inp}
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
              </div>
              <div style={{ gridColumn: "1 / -1" }}>
                <label style={labelStyle}>Bio</label>
                <textarea value={bio} onChange={e => setBio(e.target.value)} rows={4} placeholder="Tell others about yourself..."
                  style={{ ...inp, borderRadius: 10, resize: "vertical" }}
                  onFocus={e => (e.target.style.borderColor = C.black)} onBlur={e => (e.target.style.borderColor = C.gray200)} />
              </div>
              <div style={{ gridColumn: "1 / -1" }}>
                <label style={labelStyle}>Expertise Level</label>
                <select value={expertise} onChange={e => setExpertise(e.target.value as Expertise)} style={{ ...inp, cursor: "pointer" }}>
                  <option value={Expertise.BEGINNER}>Beginner</option>
                  <option value={Expertise.INTERMEDIATE}>Intermediate</option>
                  <option value={Expertise.ADVANCED}>Advanced</option>
                  <option value={Expertise.EXPERT}>Expert</option>
                </select>
              </div>
            </div>
          </div>

          {/* Account */}
          <div style={cardStyle}>
            <h2 style={{ fontSize: 18, fontWeight: 500, marginBottom: 16, letterSpacing: "-0.01em" }}>Account</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, fontSize: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: C.gray400 }}>Email</span>
                <span>{currentUser?.email}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: C.gray400 }}>Member since</span>
                <span>{formatMemberSince()}</span>
              </div>
            </div>
          </div>

          {/* Save */}
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <button onClick={handleSave} disabled={saving || usernameStatus === 'taken'}
              style={{
                display: "flex", alignItems: "center", gap: 8,
                padding: "14px 32px", borderRadius: 100, fontSize: 14, fontWeight: 500,
                background: (saving || usernameStatus === 'taken') ? C.gray300 : C.blue, color: C.pureWhite,
                border: "none", cursor: (saving || usernameStatus === 'taken') ? "not-allowed" : "pointer", fontFamily: "inherit",
              }}>
              <Save size={16} /> {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </section>

      <Footer />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default ProfilePage;
