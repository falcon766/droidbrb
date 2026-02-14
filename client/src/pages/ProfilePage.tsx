import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, User, Camera, Save, Trash2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { storage, db } from '../firebase/config';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { doc, updateDoc } from 'firebase/firestore';
import { updateProfile } from 'firebase/auth';
import { Expertise } from '../types';
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

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be under 5MB');
      return;
    }

    setAvatarFile(file);
    setRemovingAvatar(false);
    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveAvatar = () => {
    setAvatarFile(null);
    setAvatarPreview('');
    setRemovingAvatar(true);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSave = async () => {
    if (!currentUser) return;

    setSaving(true);
    try {
      let avatarUrl = userProfile?.avatar || '';

      // Upload new avatar if selected
      if (avatarFile && storage) {
        const storageRef = ref(storage, `avatars/${currentUser.uid}`);
        await uploadBytes(storageRef, avatarFile);
        avatarUrl = await getDownloadURL(storageRef);
      }

      // Remove avatar if flagged
      if (removingAvatar) {
        if (userProfile?.avatar && storage) {
          try {
            const oldRef = ref(storage, `avatars/${currentUser.uid}`);
            await deleteObject(oldRef);
          } catch (_e) {
            // File may not exist in storage — ignore
          }
        }
        avatarUrl = '';
      }

      // Update profile fields (text data)
      await updateUserProfile({ firstName, lastName, username, bio, location, expertise });

      // Update avatar in Firestore separately (ProfileForm doesn't include avatar)
      if ((avatarFile || removingAvatar) && db) {
        await updateDoc(doc(db, 'users', currentUser.uid), { avatar: avatarUrl });
        // Sync to Firebase Auth photo
        await updateProfile(currentUser, { photoURL: avatarUrl || null });
      }

      setAvatarFile(null);
      setRemovingAvatar(false);
      toast.success('Profile updated successfully');
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-robot-dark">
      {/* Header */}
      <div className="bg-robot-slate border-b border-primary-900/30">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center">
            <Link
              to="/dashboard"
              className="inline-flex items-center text-gray-400 hover:text-primary-400 transition-all mr-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Link>
            <h1 className="text-3xl font-display font-bold text-white">Edit Profile</h1>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-robot-slate border border-primary-900/30 rounded-xl p-6 shadow-elevated space-y-8"
        >
          {/* Avatar */}
          <div>
            <h2 className="font-display text-white font-semibold text-lg mb-4">Profile Photo</h2>
            <div className="flex items-center space-x-6">
              <div className="relative">
                {avatarPreview ? (
                  <img
                    src={avatarPreview}
                    alt="Avatar"
                    className="w-24 h-24 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-24 h-24 bg-robot-steel border border-primary-900/30 rounded-full flex items-center justify-center">
                    <User className="h-10 w-10 text-gray-500" />
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-0 right-0 bg-primary-500 hover:bg-primary-600 text-white p-1.5 rounded-full transition-all"
                  title="Upload photo"
                >
                  <Camera className="h-3.5 w-3.5" />
                </button>
              </div>

              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="block text-sm text-primary-400 hover:text-primary-300 transition-all"
                >
                  Upload new photo
                </button>
                {(avatarPreview) && (
                  <button
                    type="button"
                    onClick={handleRemoveAvatar}
                    className="flex items-center text-sm text-red-400 hover:text-red-300 transition-all"
                  >
                    <Trash2 className="h-3.5 w-3.5 mr-1" />
                    Remove photo
                  </button>
                )}
                <p className="text-gray-500 text-xs">JPG, PNG or GIF · Max 5MB</p>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarChange}
              />
            </div>
          </div>

          {/* Personal Info */}
          <div>
            <h2 className="font-display text-white font-semibold text-lg mb-4">Personal Information</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-400 text-sm mb-1">First Name</label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full bg-robot-steel border border-primary-900/30 text-white placeholder-gray-500 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                />
              </div>
              <div>
                <label className="block text-gray-400 text-sm mb-1">Last Name</label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full bg-robot-steel border border-primary-900/30 text-white placeholder-gray-500 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-gray-400 text-sm mb-1">Username</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-robot-steel border border-primary-900/30 text-white placeholder-gray-500 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-gray-400 text-sm mb-1">Location</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="City, State or Country"
                  className="w-full bg-robot-steel border border-primary-900/30 text-white placeholder-gray-500 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-gray-400 text-sm mb-1">Bio</label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={4}
                  placeholder="Tell others about yourself..."
                  className="w-full bg-robot-steel border border-primary-900/30 text-white placeholder-gray-500 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none transition-all"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-gray-400 text-sm mb-1">Expertise Level</label>
                <select
                  value={expertise}
                  onChange={(e) => setExpertise(e.target.value as Expertise)}
                  className="w-full bg-robot-steel border border-primary-900/30 text-white placeholder-gray-500 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                >
                  <option value={Expertise.BEGINNER}>Beginner</option>
                  <option value={Expertise.INTERMEDIATE}>Intermediate</option>
                  <option value={Expertise.ADVANCED}>Advanced</option>
                  <option value={Expertise.EXPERT}>Expert</option>
                </select>
              </div>
            </div>
          </div>

          {/* Save */}
          <div className="flex justify-end border-t border-primary-900/30 pt-6">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center space-x-2 bg-primary-500 hover:bg-primary-600 btn-glow text-white px-6 py-3 rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              <span>{saving ? 'Saving...' : 'Save Changes'}</span>
            </button>
          </div>
        </motion.div>

        {/* Account Info (read-only) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="bg-robot-slate border border-primary-900/30 rounded-xl p-6 shadow-elevated mt-6"
        >
          <h2 className="font-display text-white font-semibold text-lg mb-4">Account</h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Email</span>
              <span className="text-gray-300">{currentUser?.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Member since</span>
              <span className="text-gray-300">
                {userProfile?.createdAt
                  ? new Date(userProfile.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
                  : '—'}
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ProfilePage;
