import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import LandingPage from './LandingPage.tsx'
import ErrorBoundary from './components/ErrorBoundary'

// Simple routing based on path
const isAppRoute = window.location.pathname === '/app' || window.location.pathname === '/app/';
const CurrentPage = isAppRoute ? App : LandingPage;

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <CurrentPage />
    </ErrorBoundary>
  </StrictMode>,
)
