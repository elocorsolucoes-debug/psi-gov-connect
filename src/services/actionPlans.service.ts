import {
  collection, addDoc, query, where, getDocs,
  serverTimestamp, doc, updateDoc, orderBy,
} from 'firebase/firestore';
import { db } from './firebase';
import { ActionPlan } from '../types';

export const getActionPlans = async (prefectureId: string): Promise<ActionPlan[]> => {
  const q = query(
    collection(db, 'prefeituras', prefectureId, 'actionPlans'),
    orderBy('createdAt', 'desc'),
  );
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as ActionPlan));
};

export const createActionPlan = async (prefectureId: string, data: Omit<ActionPlan, 'id' | 'createdAt'>) => {
  const ref = await addDoc(
    collection(db, 'prefeituras', prefectureId, 'actionPlans'),
    { ...data, createdAt: serverTimestamp() },
  );
  return ref.id;
};

export const updateActionPlan = async (
  prefectureId: string,
  planId: string,
  data: Partial<ActionPlan>,
) => {
  await updateDoc(doc(db, 'prefeituras', prefectureId, 'actionPlans', planId), data);
};
