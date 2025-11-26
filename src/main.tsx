import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './index.css';
import '@xyflow/react/dist/style.css';
import { AuthProvider } from './firebase/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import ErrorBoundary from './components/ErrorBoundary';
import LandingPage from './LandingPage';
import ProjectsDashboard from './pages/ProjectsDashboard';
import ProtectedApp from './ProtectedApp';
import ProtectedRoute from './ProtectedRoute';
import SharedProject from './pages/SharedProject';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <AuthProvider>
        <ThemeProvider>
          <Router>
            <Routes>
              {/* Landing page */}
              <Route path="/" element={<LandingPage />} />
              
              {/* Projects dashboard (requires auth) */}
              <Route path="/projects" element={<ProtectedRoute><ProjectsDashboard /></ProtectedRoute>} />
              
              {/* Project editor (requires auth) */}
              <Route path="/editor/:projectId" element={<ProtectedApp />} />

              {/* Public shared project (view-only) */}
              <Route path="/shared/:projectId" element={<SharedProject />} />
              
              {/* Legacy app route redirect */}
              <Route path="/app" element={<Navigate to="/projects" replace />} />
              
              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Router>
        </ThemeProvider>
      </AuthProvider>
    </ErrorBoundary>
  </StrictMode>,
);
