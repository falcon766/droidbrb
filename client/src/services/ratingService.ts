import { 
  collection, 
  doc, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  updateDoc,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { Rating } from '../types';

export const ratingService = {
  // Create a new rating
  async createRating(ratingData: Omit<Rating, 'id' | 'createdAt'>): Promise<string> {
    try {
      const ratingDoc = {
        ...ratingData,
        createdAt: serverTimestamp(),
      };

      const docRef = await addDoc(collection(db, 'ratings'), ratingDoc);
      
      // Update robot's average rating
      await this.updateRobotRating(ratingData.robotId);
      
      return docRef.id;
    } catch (error) {
      console.error('Error creating rating:', error);
      throw new Error('Failed to create rating');
    }
  },

  // Get ratings for a robot
  async getRatingsByRobot(robotId: string): Promise<Rating[]> {
    try {
      const q = query(
        collection(db, 'ratings'),
        where('robotId', '==', robotId),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const ratings: Rating[] = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        ratings.push({
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
        } as Rating);
      });
      
      return ratings;
    } catch (error) {
      console.error('Error fetching ratings:', error);
      throw new Error('Failed to fetch ratings');
    }
  },

  // Update robot's average rating
  async updateRobotRating(robotId: string): Promise<void> {
    try {
      const ratings = await this.getRatingsByRobot(robotId);
      
      if (ratings.length === 0) return;

      const totalRating = ratings.reduce((sum, rating) => sum + rating.rating, 0);
      const averageRating = totalRating / ratings.length;

      // Update robot document
      const robotRef = doc(db, 'robots', robotId);
      await updateDoc(robotRef, {
        rating: averageRating,
        reviewCount: ratings.length,
      });
    } catch (error) {
      console.error('Error updating robot rating:', error);
      throw new Error('Failed to update robot rating');
    }
  },

  // Get user's ratings
  async getRatingsByUser(userId: string): Promise<Rating[]> {
    try {
      const q = query(
        collection(db, 'ratings'),
        where('reviewerId', '==', userId),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const ratings: Rating[] = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        ratings.push({
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
        } as Rating);
      });
      
      return ratings;
    } catch (error) {
      console.error('Error fetching user ratings:', error);
      throw new Error('Failed to fetch user ratings');
    }
  },

  // Check if user has already rated a robot
  async hasUserRatedRobot(userId: string, robotId: string): Promise<boolean> {
    try {
      const q = query(
        collection(db, 'ratings'),
        where('reviewerId', '==', userId),
        where('robotId', '==', robotId)
      );
      
      const querySnapshot = await getDocs(q);
      return !querySnapshot.empty;
    } catch (error) {
      console.error('Error checking user rating:', error);
      return false;
    }
  },
}; 