import {
  collection, addDoc, query, where, getDocs,
  serverTimestamp, doc, getDoc,
} from 'firebase/firestore';
import { db } from './firebase';
import { Checklist, ChecklistResponse } from '../types';

export const getActiveChecklists = async (prefectureId: string): Promise<Checklist[]> => {
  const q = query(
    collection(db, 'prefeituras', prefectureId, 'checklists'),
    where('isActive', '==', true),
  );
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as Checklist));
};

export const getChecklistById = async (prefectureId: string, checklistId: string): Promise<Checklist | null> => {
  const snap = await getDoc(doc(db, 'prefeituras', prefectureId, 'checklists', checklistId));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() } as Checklist;
};

export const submitChecklistResponse = async (response: Omit<ChecklistResponse, 'id'>) => {
  const ref = await addDoc(collection(db, 'checklistResponses'), {
    ...response,
    submissionDate: serverTimestamp(),
  });
  return ref.id;
};

export const getUserChecklistResponses = async (userId: string, prefectureId: string): Promise<ChecklistResponse[]> => {
  const q = query(
    collection(db, 'checklistResponses'),
    where('userId', '==', userId),
    where('prefectureId', '==', prefectureId),
  );
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as ChecklistResponse));
};

export const hasUserRespondedChecklist = async (
  userId: string,
  checklistId: string,
): Promise<boolean> => {
  const q = query(
    collection(db, 'checklistResponses'),
    where('userId', '==', userId),
    where('checklistId', '==', checklistId),
  );
  const snap = await getDocs(q);
  return !snap.empty;
};
