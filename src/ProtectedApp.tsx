import { useEffect, useState } from 'react';
import { useAuth } from './firebase/AuthContext';
import App from './App';
import AuthModal from './components/AuthModal';

export default function ProtectedApp() {
  const { user } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    // If user is not authenticated, show auth modal
    if (!user) {
      setShowAuthModal(true);
    }
  }, [user]);

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

  // User is authenticated, show the app
  return <App />;
}
