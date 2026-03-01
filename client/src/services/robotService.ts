import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDocs, 
  getDoc, 
  query, 
  where, 
  orderBy, 
  limit,
  Timestamp 
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../firebase/config';
import { Robot, CreateRobotForm } from '../types';

export const robotService = {
  // Create a new robot listing
  async createRobot(robotData: CreateRobotForm, ownerId: string, images: File[]): Promise<string> {
    try {
      console.log('Creating robot with data:', { robotData, ownerId, imageCount: images?.length });
      
      // Check if Firebase is properly initialized
      if (!db) {
        throw new Error('Firebase database is not initialized');
      }
      
      if (!storage) {
        throw new Error('Firebase storage is not initialized');
      }

      // Upload images to Firebase Storage (only if images exist)
      const imageUrls: string[] = [];
      if (images && images.length > 0) {
        console.log('Uploading images...');
        for (const image of images) {
          try {
            // Sanitize filename to remove special characters that can cause storage issues
            const safeName = image.name.replace(/[^a-zA-Z0-9._-]/g, '_');
            const imageRef = ref(storage, `robots/${ownerId}/${Date.now()}_${safeName}`);
            const snapshot = await uploadBytes(imageRef, image);
            const url = await getDownloadURL(snapshot.ref);
            imageUrls.push(url);
          } catch (uploadError) {
            console.error(`Failed to upload image "${image.name}":`, uploadError);
            throw new Error(`Failed to upload image "${image.name}". Please try again.`);
          }
        }
        console.log('Images uploaded successfully:', imageUrls);
      }

      // Create robot document
      const robotDoc = {
        ...robotData,
        ownerId,
        images: imageUrls,
        isAvailable: true,
        rating: 0,
        reviewCount: 0,
        totalRentals: 0,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      };

      console.log('Adding robot document to Firestore...');
      const docRef = await addDoc(collection(db, 'robots'), robotDoc);
      console.log('Robot created successfully with ID:', docRef.id);
      return docRef.id;
    } catch (error) {
      console.error('Error creating robot:', error);
      if (error instanceof Error) {
        throw new Error(`Failed to create robot listing: ${error.message}`);
      }
      throw new Error('Failed to create robot listing');
    }
  },

  // Get robots by owner
  async getRobotsByOwner(ownerId: string): Promise<Robot[]> {
    try {
      const q = query(
        collection(db, 'robots'),
        where('ownerId', '==', ownerId),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const robots: Robot[] = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        robots.push({
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
        } as Robot);
      });
      
      return robots;
    } catch (error) {
      console.error('Error fetching robots:', error);
      throw new Error('Failed to fetch robots');
    }
  },

  // Get all available robots
  async getAvailableRobots(): Promise<Robot[]> {
    try {
      const q = query(
        collection(db, 'robots'),
        where('isAvailable', '==', true),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const robots: Robot[] = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        robots.push({
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
        } as Robot);
      });

      // If no robots in database, return sample robots for testing
      if (robots.length === 0) {
        console.log('No robots in database, returning sample robots for testing');
        return this.getSampleRobots();
      }
      
      return robots;
    } catch (error) {
      console.error('Error fetching available robots:', error);
      console.log('Returning sample robots due to error');
      return this.getSampleRobots();
    }
  },

  // Get sample robots for testing (remove in production)
  getSampleRobots(): Robot[] {
    // Return empty array - no more dummy robots
    return [];
  },

  // Get robot by ID
  async getRobotById(robotId: string): Promise<Robot | null> {
    try {
      const docRef = doc(db, 'robots', robotId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
        } as Robot;
      }
      
      return null;
    } catch (error) {
      console.error('Error fetching robot:', error);
      throw new Error('Failed to fetch robot');
    }
  },

  // Update robot
  async updateRobot(robotId: string, updates: Partial<Robot>): Promise<void> {
    try {
      const docRef = doc(db, 'robots', robotId);
      await updateDoc(docRef, {
        ...updates,
        updatedAt: Timestamp.now(),
      });
    } catch (error) {
      console.error('Error updating robot:', error);
      throw new Error('Failed to update robot');
    }
  },

  // Delete robot
  async deleteRobot(robotId: string): Promise<void> {
    try {
      const docRef = doc(db, 'robots', robotId);
      await deleteDoc(docRef);
    } catch (error) {
      console.error('Error deleting robot:', error);
      throw new Error('Failed to delete robot');
    }
  },

  // Get featured robots — admin-curated first, then backfill with highest-rated
  async getFeaturedRobots(limitCount: number = 6): Promise<Robot[]> {
    try {
      if (!db) return [];

      const hasValidConfig = process.env.REACT_APP_FIREBASE_API_KEY &&
                            process.env.REACT_APP_FIREBASE_PROJECT_ID &&
                            process.env.REACT_APP_FIREBASE_API_KEY !== 'missing-api-key';
      if (!hasValidConfig) return [];

      const toRobot = (d: any): Robot => ({
        id: d.id,
        ...d.data(),
        createdAt: d.data().createdAt?.toDate() || new Date(),
        updatedAt: d.data().updatedAt?.toDate() || new Date(),
      } as Robot);

      const robots: Robot[] = [];

      // 1. Fetch admin-curated featured robots first
      try {
        const featuredQ = query(
          collection(db, 'robots'),
          where('isFeatured', '==', true),
          where('isAvailable', '==', true),
          limit(limitCount)
        );
        const featuredSnap = await getDocs(featuredQ);
        featuredSnap.forEach(d => robots.push(toRobot(d)));
      } catch {
        // isFeatured field may not exist yet — that's fine
      }

      // 2. If we have fewer than limitCount, backfill with highest-rated
      if (robots.length < limitCount) {
        const remaining = limitCount - robots.length;
        const featuredIds = new Set(robots.map(r => r.id));
        try {
          const ratingQ = query(
            collection(db, 'robots'),
            where('isAvailable', '==', true),
            orderBy('rating', 'desc'),
            limit(remaining + featuredIds.size) // fetch extra to filter dupes
          );
          const ratingSnap = await getDocs(ratingQ);
          ratingSnap.forEach(d => {
            if (robots.length < limitCount && !featuredIds.has(d.id)) {
              robots.push(toRobot(d));
            }
          });
        } catch {
          // Fallback without orderBy
          const fallbackQ = query(
            collection(db, 'robots'),
            where('isAvailable', '==', true),
            limit(remaining + featuredIds.size)
          );
          const fallbackSnap = await getDocs(fallbackQ);
          fallbackSnap.forEach(d => {
            if (robots.length < limitCount && !featuredIds.has(d.id)) {
              robots.push(toRobot(d));
            }
          });
        }
      }

      return robots;
    } catch (error) {
      console.error('Error fetching featured robots:', error);
      return [];
    }
  },
}; 