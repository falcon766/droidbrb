import { 
  collection, 
  doc, 
  addDoc, 
  getDocs, 
  getDoc,
  query, 
  where, 
  orderBy, 
  limit,
  updateDoc,
  serverTimestamp,
  onSnapshot
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { Message, User } from '../types';

export interface CreateMessageData {
  content: string;
  receiverId: string;
  receiverName: string;
  receiverEmail: string;
}

export const messageService = {
  // Create a new message
  async createMessage(senderId: string, senderName: string, messageData: CreateMessageData): Promise<string> {
    try {
      const messageDoc = {
        content: messageData.content,
        senderId,
        senderName,
        receiverId: messageData.receiverId,
        receiverName: messageData.receiverName,
        receiverEmail: messageData.receiverEmail,
        isRead: false,
        createdAt: serverTimestamp(),
      };

      const docRef = await addDoc(collection(db, 'messages'), messageDoc);
      
      // Send email notification
      await this.sendEmailNotification(messageData.receiverEmail, senderName, messageData.content);
      
      return docRef.id;
    } catch (error) {
      console.error('Error creating message:', error);
      throw new Error('Failed to send message');
    }
  },

  // Get conversation between two users
  async getConversation(userId1: string, userId2: string): Promise<Message[]> {
    try {
      const q = query(
        collection(db, 'messages'),
        where('senderId', 'in', [userId1, userId2]),
        where('receiverId', 'in', [userId1, userId2]),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const messages: Message[] = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        messages.push({
          id: doc.id,
          content: data.content,
          senderId: data.senderId,
          senderName: data.senderName,
          receiverId: data.receiverId,
          receiverName: data.receiverName,
          isRead: data.isRead,
          createdAt: data.createdAt?.toDate() || new Date(),
        } as Message);
      });
      
      return messages.reverse(); // Return in chronological order
    } catch (error) {
      console.error('Error fetching conversation:', error);
      throw new Error('Failed to fetch conversation');
    }
  },

  // Get all conversations for a user
  async getUserConversations(userId: string): Promise<Message[]> {
    try {
      const q = query(
        collection(db, 'messages'),
        where('senderId', '==', userId),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const messages: Message[] = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        messages.push({
          id: doc.id,
          content: data.content,
          senderId: data.senderId,
          senderName: data.senderName,
          receiverId: data.receiverId,
          receiverName: data.receiverName,
          isRead: data.isRead,
          createdAt: data.createdAt?.toDate() || new Date(),
        } as Message);
      });
      
      return messages;
    } catch (error) {
      console.error('Error fetching user conversations:', error);
      throw new Error('Failed to fetch conversations');
    }
  },

  // Get unread messages count for a user
  async getUnreadCount(userId: string): Promise<number> {
    try {
      const q = query(
        collection(db, 'messages'),
        where('receiverId', '==', userId),
        where('isRead', '==', false)
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.size;
    } catch (error) {
      console.error('Error fetching unread count:', error);
      return 0;
    }
  },

  // Mark message as read
  async markAsRead(messageId: string): Promise<void> {
    try {
      const messageRef = doc(db, 'messages', messageId);
      await updateDoc(messageRef, {
        isRead: true,
      });
    } catch (error) {
      console.error('Error marking message as read:', error);
      throw new Error('Failed to mark message as read');
    }
  },

  // Mark all messages in a conversation as read
  async markConversationAsRead(userId1: string, userId2: string): Promise<void> {
    try {
      const q = query(
        collection(db, 'messages'),
        where('senderId', 'in', [userId1, userId2]),
        where('receiverId', 'in', [userId1, userId2]),
        where('isRead', '==', false)
      );
      
      const querySnapshot = await getDocs(q);
      const updatePromises = querySnapshot.docs.map(doc => 
        updateDoc(doc.ref, { isRead: true })
      );
      
      await Promise.all(updatePromises);
    } catch (error) {
      console.error('Error marking conversation as read:', error);
      throw new Error('Failed to mark conversation as read');
    }
  },

  // Real-time listener for new messages
  subscribeToMessages(userId: string, callback: (messages: Message[]) => void) {
    const q = query(
      collection(db, 'messages'),
      where('receiverId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    
    return onSnapshot(q, (querySnapshot) => {
      const messages: Message[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        messages.push({
          id: doc.id,
          content: data.content,
          senderId: data.senderId,
          senderName: data.senderName,
          receiverId: data.receiverId,
          receiverName: data.receiverName,
          isRead: data.isRead,
          createdAt: data.createdAt?.toDate() || new Date(),
        } as Message);
      });
      callback(messages);
    });
  },

  // Send email notification (using a simple email service)
  async sendEmailNotification(receiverEmail: string, senderName: string, messageContent: string): Promise<void> {
    try {
      // In a real implementation, you would:
      // 1. Use a service like SendGrid, Mailgun, or AWS SES
      // 2. Create a backend endpoint to handle email sending
      // 3. Include proper email templates
      
      // For now, we'll simulate email sending
      console.log(`Email notification sent to ${receiverEmail}:`);
      console.log(`From: ${senderName}`);
      console.log(`Message: ${messageContent}`);
      
      // You can integrate with services like:
      // - SendGrid: https://sendgrid.com/
      // - Mailgun: https://www.mailgun.com/
      // - AWS SES: https://aws.amazon.com/ses/
      // - Resend: https://resend.com/
      
    } catch (error) {
      console.error('Error sending email notification:', error);
      // Don't throw error here as it shouldn't break the message sending
    }
  },

  // Get user by ID (for messaging)
  async getUserById(userId: string): Promise<User | null> {
    try {
      const userRef = doc(db, 'users', userId);
      const userSnap = await getDoc(userRef);
      
      if (userSnap.exists()) {
        const data = userSnap.data();
        return {
          id: userSnap.id,
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
        } as User;
      }
      
      return null;
    } catch (error) {
      console.error('Error fetching user:', error);
      return null;
    }
  },

  // Search users for messaging
  async searchUsers(query: string, currentUserId: string): Promise<User[]> {
    try {
      // In a real implementation, you would use a more sophisticated search
      // For now, we'll return an empty array as user search would need to be implemented
      return [];
    } catch (error) {
      console.error('Error searching users:', error);
      return [];
    }
  }
}; 