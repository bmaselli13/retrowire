import { Timestamp } from 'firebase/firestore';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string; // Gravatar or custom
  customAvatarURL?: string; // Custom uploaded avatar
  useGravatar: boolean; // Toggle between Gravatar/custom
  preferences: UserPreferences;
  subscription: UserSubscription;
  createdAt: Timestamp;
  lastLogin: Timestamp;
}

export interface UserPreferences {
  theme: 'dark' | 'light';
  defaultVoltage: '5V' | '12V';
  autoSave: boolean;
  autoSaveInterval: number; // seconds (default: 3)
}

export interface UserSubscription {
  tier: 'free' | 'pro';
  projectLimit: number; // 2 for free, unlimited for pro
}

export interface ProjectMetadata {
  id: string;
  userId: string; // Owner
  name: string;
  description?: string;
  preferredVoltage: '5V' | '12V';
  thumbnail?: string; // base64 canvas snapshot
  createdAt: Timestamp;
  updatedAt: Timestamp;
  
  // Sharing
  isPublic: boolean;
  sharedWith: string[]; // Array of user emails
  shareLink?: string; // Public share link (project ID for now)
}

export interface ProjectData extends ProjectMetadata {
  nodes: any[]; // ReactFlow nodes
  edges: any[]; // ReactFlow edges
}

// For creating new users
export interface CreateUserProfileInput {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
}

// For updating user profile
export interface UpdateUserProfileInput {
  displayName?: string;
  photoURL?: string;
  customAvatarURL?: string;
  useGravatar?: boolean;
  preferences?: Partial<UserPreferences>;
}
