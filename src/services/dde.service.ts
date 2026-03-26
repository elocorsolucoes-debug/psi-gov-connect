import {
  collection, addDoc, query, where, orderBy, limit,
  getDocs, serverTimestamp, Timestamp,
} from 'firebase/firestore';
import { db } from './firebase';
import { DDEEntry } from '../types';

export const saveDDEEntry = async (entry: Omit<DDEEntry, 'id' | 'createdAt'>) => {
  const ref = await addDoc(collection(db, 'ddeEntries'), {
    ...entry,
    createdAt: serverTimestamp(),
  });
  return ref.id;
};

export const getMyDDEEntries = async (userId: string, days = 7): Promise<DDEEntry[]> => {
  const since = new Date();
  since.setDate(since.getDate() - days);
  const q = query(
    collection(db, 'ddeEntries'),
    where('userId', '==', userId),
    where('createdAt', '>=', Timestamp.fromDate(since)),
    orderBy('createdAt', 'desc'),
    limit(50),
  );
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as DDEEntry));
};
