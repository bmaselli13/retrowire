import React, { createContext, useContext, useEffect, useState } from 'react';
import { useUserProfile } from '../hooks/useUserProfile';

type Theme = 'dark' | 'light';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { profile, updatePreferences } = useUserProfile();
  const [theme, setThemeState] = useState<Theme>('dark');

  // Initialize theme from user profile or localStorage
  useEffect(() => {
    if (profile?.preferences?.theme) {
      setThemeState(profile.preferences.theme);
      applyTheme(profile.preferences.theme);
    } else {
      // Fallback to localStorage for non-authenticated users
      const savedTheme = localStorage.getItem('theme') as Theme;
      if (savedTheme) {
        setThemeState(savedTheme);
        applyTheme(savedTheme);
      }
    }
  }, [profile]);

  // Apply theme to document
  const applyTheme = (newTheme: Theme) => {
    const root = document.documentElement;
    
    if (newTheme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  };

  // Set theme and save to profile/localStorage
  const setTheme = async (newTheme: Theme) => {
    setThemeState(newTheme);
    applyTheme(newTheme);
    
    // Save to localStorage for non-authenticated users
    localStorage.setItem('theme', newTheme);
    
    // Save to user profile if authenticated
    if (profile) {
      try {
        await updatePreferences({ theme: newTheme });
      } catch (error) {
        console.error('Error saving theme preference:', error);
      }
    }
  };

  // Toggle between dark and light
  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
  };

  const value = {
    theme,
    setTheme,
    toggleTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}
