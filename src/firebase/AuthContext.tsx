import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  deleteUser,
} from 'firebase/auth';
import { auth } from './config';
import { deleteAllUserProjects } from './projectService';
import { deleteUserProfile } from './userService';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  deleteAccount: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  };

  const signInWithEmail = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const signUpWithEmail = async (email: string, password: string) => {
    await createUserWithEmailAndPassword(auth, email, password);
  };

  const logout = async () => {
    await signOut(auth);
  };

  const deleteAccount = async () => {
    const current = auth.currentUser;
    if (!current) throw new Error('No user logged in');
    const uid = current.uid;

    // Best-effort cleanup: delete projects then profile, then auth user
    try {
      await deleteAllUserProjects(uid);
    } catch (e) {
      // continue; surface errors on final delete
      console.error('Failed to delete all projects:', e);
    }

    try {
      await deleteUserProfile(uid);
    } catch (e) {
      console.error('Failed to delete user profile:', e);
    }

    // Delete authentication user (may require recent login)
    try {
      await deleteUser(current);
    } catch (e: any) {
      // If recent login required, bubble up for UI to prompt re-auth
      throw e;
    } finally {
      await signOut(auth);
      setUser(null);
    }
  };

  const value = {
    user,
    loading,
    signInWithGoogle,
    signInWithEmail,
    signUpWithEmail,
    logout,
    deleteAccount,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
