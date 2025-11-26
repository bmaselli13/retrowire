import { useEffect, useState } from 'react';
import { useAuth } from '../firebase/AuthContext';
import { 
  getUserProfile, 
  createUserProfile, 
  updateUserProfile as updateUserProfileService,
  updateUserPreferences as updateUserPreferencesService
} from '../firebase/userService';
import { UserProfile, UpdateUserProfileInput, UserPreferences } from '../types/user';

export function useUserProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load user profile when user signs in
  useEffect(() => {
    async function loadProfile() {
      if (!user) {
        setProfile(null);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        let userProfile = await getUserProfile(user.uid);
        
        // Create profile if it doesn't exist (first-time user)
        if (!userProfile) {
          userProfile = await createUserProfile({
            uid: user.uid,
            email: user.email!,
            displayName: user.displayName || user.email?.split('@')[0] || 'User',
            photoURL: user.photoURL || undefined,
          });
        }
        
        setProfile(userProfile);
      } catch (err: any) {
        console.error('Error loading user profile:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, [user]);

  // Update user profile
  const updateProfile = async (updates: UpdateUserProfileInput): Promise<void> => {
    if (!user) throw new Error('No user logged in');
    
    try {
      await updateUserProfileService(user.uid, updates);
      
      // Reload profile
      const updatedProfile = await getUserProfile(user.uid);
      setProfile(updatedProfile);
    } catch (err: any) {
      console.error('Error updating profile:', err);
      throw err;
    }
  };

  // Update user preferences
  const updatePreferences = async (preferences: Partial<UserPreferences>): Promise<void> => {
    if (!user) throw new Error('No user logged in');
    
    try {
      await updateUserPreferencesService(user.uid, preferences);
      
      // Update local state
      if (profile) {
        setProfile({
          ...profile,
          preferences: {
            ...profile.preferences,
            ...preferences,
          },
        });
      }
    } catch (err: any) {
      console.error('Error updating preferences:', err);
      throw err;
    }
  };

  return {
    profile,
    loading,
    error,
    updateProfile,
    updatePreferences,
  };
}
