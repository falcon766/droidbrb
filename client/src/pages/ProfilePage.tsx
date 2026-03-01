import React, { useState, useRef } from 'react';
import { User, Camera, Save, Trash2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { storage, db } from '../firebase/config';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { doc, updateDoc } from 'firebase/firestore';
import { updateProfile } from 'firebase/auth';
import { Expertise } from '../types';
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

      <section style={{ background: C.white, padding: "100px 48px 40px", borderBottom: `1px solid ${C.gray100}` }}>
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
                <input type="text" value={username} onChange={e => setUsername(e.target.value)} style={inp}
                  onFocus={e => (e.target.style.borderColor = C.black)} onBlur={e => (e.target.style.borderColor = C.gray200)} />
              </div>
              <div style={{ gridColumn: "1 / -1" }}>
                <label style={labelStyle}>Location</label>
                <input type="text" value={location} onChange={e => setLocation(e.target.value)} placeholder="City, State or Country" style={inp}
                  onFocus={e => (e.target.style.borderColor = C.black)} onBlur={e => (e.target.style.borderColor = C.gray200)} />
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
                <span>{userProfile?.createdAt ? new Date(userProfile.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : '—'}</span>
              </div>
            </div>
          </div>

          {/* Save */}
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <button onClick={handleSave} disabled={saving}
              style={{
                display: "flex", alignItems: "center", gap: 8,
                padding: "14px 32px", borderRadius: 100, fontSize: 14, fontWeight: 500,
                background: saving ? C.gray300 : C.blue, color: C.pureWhite,
                border: "none", cursor: saving ? "not-allowed" : "pointer", fontFamily: "inherit",
              }}>
              <Save size={16} /> {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ProfilePage;
