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
      // Upload images to Firebase Storage (only if images exist)
      const imageUrls: string[] = [];
      if (images && images.length > 0) {
        for (const image of images) {
          const imageRef = ref(storage, `robots/${ownerId}/${Date.now()}_${image.name}`);
          const snapshot = await uploadBytes(imageRef, image);
          const url = await getDownloadURL(snapshot.ref);
          imageUrls.push(url);
        }
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

      const docRef = await addDoc(collection(db, 'robots'), robotDoc);
      return docRef.id;
    } catch (error) {
      console.error('Error creating robot:', error);
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
      
      return robots;
    } catch (error) {
      console.error('Error fetching available robots:', error);
      throw new Error('Failed to fetch available robots');
    }
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

  // Get featured robots (most popular)
  async getFeaturedRobots(limitCount: number = 6): Promise<Robot[]> {
    try {
      // First try to get robots ordered by rating
      let q = query(
        collection(db, 'robots'),
        where('isAvailable', '==', true),
        orderBy('rating', 'desc'),
        limit(limitCount)
      );
      
      try {
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
      } catch (orderByError) {
        // If orderBy fails (e.g., no documents or missing field), try without orderBy
        console.warn('OrderBy failed, trying without rating sort:', orderByError);
        
        q = query(
          collection(db, 'robots'),
          where('isAvailable', '==', true),
          limit(limitCount)
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
      }
    } catch (error) {
      console.error('Error fetching featured robots:', error);
      // Return empty array instead of throwing error
      return [];
    }
  },
}; 