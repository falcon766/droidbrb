import {
  collection,
  doc,
  addDoc,
  getDocs,
  updateDoc,
  query,
  orderBy,
  where,
  Timestamp,
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { Report, ReportType, ReportReason } from '../types';

export const reportService = {
  async createReport(data: {
    reporterId: string;
    reporterName: string;
    targetType: ReportType;
    targetId: string;
    targetName: string;
    reason: ReportReason;
    description: string;
  }): Promise<string> {
    if (!db) throw new Error('Firebase not initialized');
    const docRef = await addDoc(collection(db, 'reports'), {
      ...data,
      status: 'pending',
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
    return docRef.id;
  },

  async getReports(status?: string): Promise<Report[]> {
    if (!db) return [];
    try {
      const q = status
        ? query(collection(db, 'reports'), where('status', '==', status), orderBy('createdAt', 'desc'))
        : query(collection(db, 'reports'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(d => ({
        id: d.id,
        ...d.data(),
        createdAt: d.data().createdAt?.toDate() || new Date(),
        updatedAt: d.data().updatedAt?.toDate() || new Date(),
      } as Report));
    } catch {
      return [];
    }
  },

  async updateReportStatus(reportId: string, status: 'reviewed' | 'resolved' | 'dismissed'): Promise<void> {
    if (!db) throw new Error('Firebase not initialized');
    await updateDoc(doc(db, 'reports', reportId), {
      status,
      updatedAt: Timestamp.now(),
    });
  },
};
