import { getFirestore, enableIndexedDbPersistence } from 'firebase/firestore';
import app from './config';

// Initialize Firestore
export const db = getFirestore(app);

// Enable offline persistence for better UX
try {
  enableIndexedDbPersistence(db).catch((err) => {
    if (err.code === 'failed-precondition') {
      console.warn('Firestore persistence failed: Multiple tabs open');
    } else if (err.code === 'unimplemented') {
      console.warn('Firestore persistence not available in this browser');
    }
  });
} catch (error) {
  console.error('Error enabling Firestore persistence:', error);
}

// Collection names
export const COLLECTIONS = {
  USERS: 'users',
  PROJECTS: 'projects',
} as const;
