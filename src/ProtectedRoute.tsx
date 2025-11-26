import { useEffect, useMemo, useState } from 'react';
import { useAuth } from './firebase/AuthContext';
import AuthModal from './components/AuthModal';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const devBypass = useMemo(() => {
    try {
      // Dev-only bypass: enable with "?bypass=1" or localStorage.setItem('dev-auth-bypass','1')
      const isDev = (import.meta as any)?.env?.DEV;
      if (!isDev) return false;
      const url = new URL(window.location.href);
      return url.searchParams.get('bypass') === '1' || localStorage.getItem('dev-auth-bypass') === '1';
    } catch {
      return false;
    }
  }, []);

  useEffect(() => {
    if (!user && !devBypass) {
      setShowAuthModal(true);
    } else {
      setShowAuthModal(false);
    }
  }, [user, devBypass]);

  // If not authenticated, show auth modal
  if (!user && !devBypass) {
    return (
      <>
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

  // Authenticated -> render children
  return <>{children}</>;
}
