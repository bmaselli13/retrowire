import { doc, getDoc, setDoc, updateDoc, Timestamp, serverTimestamp } from 'firebase/firestore';
import md5 from 'md5';
import { db, COLLECTIONS } from './firestore';
import { 
  UserProfile, 
  CreateUserProfileInput, 
  UpdateUserProfileInput,
  UserPreferences 
} from '../types/user';

/**
 * Generate Gravatar URL from email
 */
export function getGravatarUrl(email: string, size: number = 200): string {
  const hash = md5(email.toLowerCase().trim());
  return `https://www.gravatar.com/avatar/${hash}?s=${size}&d=identicon`;
}

/**
 * Get default user preferences
 */
function getDefaultPreferences(): UserPreferences {
  return {
    theme: 'dark',
    defaultVoltage: '5V',
    autoSave: true,
    autoSaveInterval: 3, // seconds
  };
}

/**
 * Create a new user profile in Firestore
 */
export async function createUserProfile(input: CreateUserProfileInput): Promise<UserProfile> {
  const userRef = doc(db, COLLECTIONS.USERS, input.uid);
  
  const gravatarUrl = getGravatarUrl(input.email);
  
  const profile: UserProfile = {
    uid: input.uid,
    email: input.email,
    displayName: input.displayName,
    photoURL: input.photoURL || gravatarUrl,
    useGravatar: true, // Default to Gravatar
    preferences: getDefaultPreferences(),
    subscription: {
      tier: 'free',
      projectLimit: 2,
    },
    createdAt: Timestamp.now(),
    lastLogin: Timestamp.now(),
  };
  
  await setDoc(userRef, profile);
  return profile;
}

/**
 * Get user profile from Firestore
 */
export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const userRef = doc(db, COLLECTIONS.USERS, uid);
  const userSnap = await getDoc(userRef);
  
  if (!userSnap.exists()) {
    return null;
  }
  
  return userSnap.data() as UserProfile;
}

/**
 * Update user profile
 */
export async function updateUserProfile(
  uid: string, 
  updates: UpdateUserProfileInput
): Promise<void> {
  const userRef = doc(db, COLLECTIONS.USERS, uid);
  
  // If switching to Gravatar, get the URL
  if (updates.useGravatar) {
    const userProfile = await getUserProfile(uid);
    if (userProfile) {
      updates.photoURL = getGravatarUrl(userProfile.email);
    }
  }
  
  await updateDoc(userRef, {
    ...updates,
    lastLogin: serverTimestamp(),
  });
}

/**
 * Update user preferences
 */
export async function updateUserPreferences(
  uid: string,
  preferences: Partial<UserPreferences>
): Promise<void> {
  const userRef = doc(db, COLLECTIONS.USERS, uid);
  
  await updateDoc(userRef, {
    preferences,
    lastLogin: serverTimestamp(),
  });
}

/**
 * Update last login timestamp
 */
export async function updateLastLogin(uid: string): Promise<void> {
  const userRef = doc(db, COLLECTIONS.USERS, uid);
  
  await updateDoc(userRef, {
    lastLogin: serverTimestamp(),
  });
}

/**
 * Check if user has reached project limit
 */
export async function canCreateProject(uid: string, currentProjectCount: number): Promise<boolean> {
  const profile = await getUserProfile(uid);
  
  if (!profile) return false;
  
  // Pro users have unlimited projects
  if (profile.subscription.tier === 'pro') {
    return true;
  }
  
  // Free users are limited
  return currentProjectCount < profile.subscription.projectLimit;
}
