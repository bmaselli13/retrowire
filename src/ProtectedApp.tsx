import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from './firebase/AuthContext';
import { useAutoSave } from './hooks/useAutoSave';
import App from './App';
import AuthModal from './components/AuthModal';
import WelcomeModal from './components/WelcomeModal';
import SaveNowButton from './components/SaveNowButton';

export default function ProtectedApp() {
  const { user } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const [hasSeenWelcome, setHasSeenWelcome] = useState(false);

  // Auto-save: only enable when authenticated
  const { projectId } = useParams<{ projectId: string }>();
  const maybeProjectId = user ? projectId : undefined;
  const { status } = useAutoSave(maybeProjectId);

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

      {/* Save Status Pill */}
      {user && projectId && (
        <div
          className={`fixed bottom-4 right-4 text-xs px-3 py-1 rounded-full border ${
            status === 'saving'
              ? 'bg-yellow-900/40 border-yellow-700 text-yellow-300'
              : status === 'saved'
              ? 'bg-green-900/30 border-green-700 text-green-300'
              : status === 'error'
              ? 'bg-red-900/30 border-red-700 text-red-300'
              : status === 'conflict'
              ? 'bg-orange-900/40 border-orange-700 text-orange-300'
              : status === 'off'
              ? 'bg-gray-900/60 border-gray-700 text-gray-300'
              : 'bg-gray-900/60 border-gray-700 text-gray-300'
          }`}
          title="Cloud auto-save status"
        >
          {status === 'saving'
            ? 'Saving…'
            : status === 'saved'
            ? 'Saved'
            : status === 'error'
            ? 'Save error'
            : status === 'conflict'
            ? 'Conflict — remote changes'
            : status === 'off'
            ? 'Autosave off'
            : 'Idle'}
        </div>
      )}
      {user && projectId && <SaveNowButton />}
      
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
