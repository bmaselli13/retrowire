import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// Firebase configuration
// IMPORTANT: Replace these with your actual Firebase project credentials
// Get these from: Firebase Console → Project Settings → Your Apps
const firebaseConfig = {
  apiKey: "AIzaSyBEqxyPKJ6IBpKpv0wSUBk98mJA0YhKsmw",
  authDomain: "retro-wire-19f9f.firebaseapp.com",
  projectId: "retro-wire-19f9f",
  storageBucket: "retro-wire-19f9f.firebasestorage.app",
  messagingSenderId: "768113014806",
  appId: "1:768113014806:web:f74c31fecd262c81ac5d37",
  measurementId: "G-X8DY3RNSGL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication
export const auth = getAuth(app);

export default app;
