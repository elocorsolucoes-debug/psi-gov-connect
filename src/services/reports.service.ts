import {
  collection, addDoc, query, where, orderBy,
  getDocs, serverTimestamp, collectionGroup, doc, updateDoc,
} from 'firebase/firestore';
import { db } from './firebase';
import { Report } from '../types';

export const createReport = async (data: Omit<Report, 'id' | 'createdAt' | 'status'>) => {
  const ref = await addDoc(
    collection(db, 'prefeituras', data.prefectureId, 'reports'),
    {
      ...data,
      status: 'Enviado',
      createdAt: serverTimestamp(),
    },
  );
  return ref.id;
};

export const getMyReports = async (userId: string, prefectureId: string): Promise<Report[]> => {
  const q = query(
    collection(db, 'prefeituras', prefectureId, 'reports'),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc'),
  );
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as Report));
};

export const getAllReports = async (prefectureId: string): Promise<Report[]> => {
  const q = query(
    collection(db, 'prefeituras', prefectureId, 'reports'),
    orderBy('createdAt', 'desc'),
  );
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as Report));
};

export const updateReportStatus = async (
  prefectureId: string,
  reportId: string,
  status: Report['status'],
  response?: string,
) => {
  const ref = doc(db, 'prefeituras', prefectureId, 'reports', reportId);
  await updateDoc(ref, { status, ...(response ? { response, respondedAt: serverTimestamp() } : {}) });
};
