import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  query,
  orderBy,
  Timestamp,
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from '../firebase/config';
import { Robot, User, HeroImage } from '../types';

export const adminService = {
  // ── Featured Robots ───────────────────────────────────────

  async getAllRobots(): Promise<Robot[]> {
    if (!db) return [];
    try {
      const q = query(collection(db, 'robots'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(d => ({
        id: d.id,
        ...d.data(),
        createdAt: d.data().createdAt?.toDate() || new Date(),
        updatedAt: d.data().updatedAt?.toDate() || new Date(),
      } as Robot));
    } catch {
      return [];
    }
  },

  async toggleFeatured(robotId: string, featured: boolean): Promise<void> {
    if (!db) throw new Error('Firebase not initialized');
    await updateDoc(doc(db, 'robots', robotId), {
      isFeatured: featured,
      updatedAt: Timestamp.now(),
    });
  },

  // ── Homepage Images ───────────────────────────────────────

  async getHomepageContent(): Promise<{ heroImages: HeroImage[] }> {
    if (!db) return { heroImages: [] };
    try {
      const snap = await getDoc(doc(db, 'siteContent', 'homepage'));
      if (!snap.exists()) return { heroImages: [] };
      return { heroImages: snap.data().heroImages || [] };
    } catch {
      return { heroImages: [] };
    }
  },

  async updateHeroImages(images: HeroImage[]): Promise<void> {
    if (!db) throw new Error('Firebase not initialized');
    await setDoc(doc(db, 'siteContent', 'homepage'), {
      heroImages: images,
      updatedAt: Timestamp.now(),
    });
  },

  async uploadHeroImage(file: File): Promise<string> {
    if (!storage) throw new Error('Firebase Storage not initialized');
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
    const storageRef = ref(storage, `site/hero/${Date.now()}_${safeName}`);
    await uploadBytes(storageRef, file);
    return getDownloadURL(storageRef);
  },

  async deleteHeroImage(url: string): Promise<void> {
    if (!storage) return;
    try {
      const imageRef = ref(storage, url);
      await deleteObject(imageRef);
    } catch {
      // Image may have already been deleted from storage
    }
  },

  // ── Users ─────────────────────────────────────────────────

  async getAllUsers(): Promise<User[]> {
    if (!db) return [];
    try {
      const q = query(collection(db, 'users'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(d => ({
        id: d.id,
        ...d.data(),
        createdAt: d.data().createdAt?.toDate() || new Date(),
        updatedAt: d.data().updatedAt?.toDate() || new Date(),
      } as User));
    } catch {
      // Fallback without orderBy if index doesn't exist
      try {
        const snapshot = await getDocs(collection(db!, 'users'));
        return snapshot.docs.map(d => ({
          id: d.id,
          ...d.data(),
          createdAt: d.data().createdAt?.toDate() || new Date(),
          updatedAt: d.data().updatedAt?.toDate() || new Date(),
        } as User));
      } catch {
        return [];
      }
    }
  },

  async setUserRole(userId: string, role: 'user' | 'admin'): Promise<void> {
    if (!db) throw new Error('Firebase not initialized');
    await updateDoc(doc(db, 'users', userId), {
      role,
      updatedAt: Timestamp.now(),
    });
  },
};
