import { useEffect, useState } from 'react';
import { useAuth } from './firebase/AuthContext';
import App from './App';
import AuthModal from './components/AuthModal';
import WelcomeModal from './components/WelcomeModal';

export default function ProtectedApp() {
  const { user } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const [hasSeenWelcome, setHasSeenWelcome] = useState(false);

  useEffect(() => {
    // If user is not authenticated, show auth modal
    if (!user) {
      setShowAuthModal(true);
    }
  }, [user]);

  // Show welcome modal for first-time users (after successful auth)
  useEffect(() => {
    if (user && !hasSeenWelcome) {
      // Check localStorage to see if user has seen welcome before
      const hasSeenBefore = localStorage.getItem(`welcome-${user.uid}`);
      
      if (!hasSeenBefore) {
        // Small delay to let user see they're logged in
        setTimeout(() => setShowWelcome(true), 800);
        localStorage.setItem(`welcome-${user.uid}`, 'true');
        setHasSeenWelcome(true);
      }
    }
  }, [user, hasSeenWelcome]);

  // If not authenticated and modal is closed, redirect to home
  if (!user && !showAuthModal) {
    window.location.href = '/';
    return null;
  }

  // If not authenticated, show auth modal over a blurred app
  if (!user) {
    return (
      <>
        <div className="filter blur-sm pointer-events-none">
          <App />
        </div>
        {showAuthModal && (
          <AuthModal 
            onClose={() => {
              setShowAuthModal(false);
              // Redirect to home after closing without auth
              setTimeout(() => {
                window.location.href = '/';
              }, 100);
            }}
            defaultToSignup={true}
          />
        )}
      </>
    );
  }

  // User is authenticated, show the app (with welcome modal for new users)
  return (
    <>
      <App />
      
      {/* Welcome Modal for First-Time Users */}
      {showWelcome && (
        <WelcomeModal
          onClose={() => setShowWelcome(false)}
          userName={user?.displayName || user?.email?.split('@')[0] || null}
        />
      )}
    </>
  );
}
