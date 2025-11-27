import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// Firebase configuration via Vite env vars (set in Netlify UI or local .env)
// Do NOT hardcode keys in the repo. Firebase client keys are not secrets,
// but Netlify's secrets scanner flags literal patterns (e.g. AIza...).
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
} as const;

// Masked debug in production to verify env injection (no secret values logged)
function mask(v?: string) {
  if (!v) return 'missing';
  const s = String(v);
  const start = s.slice(0, 4);
  const end = s.slice(-2);
  return `${start}...${end} (len=${s.length})`;
}
if (import.meta.env.PROD) {
  // eslint-disable-next-line no-console
  console.warn('[FirebaseEnv]', {
    apiKey: mask(firebaseConfig.apiKey),
    authDomain: !!firebaseConfig.authDomain,
    projectId: !!firebaseConfig.projectId,
    storageBucket: !!firebaseConfig.storageBucket,
    messagingSenderId: mask(firebaseConfig.messagingSenderId),
    appId: mask(firebaseConfig.appId),
    measurementId: mask(firebaseConfig.measurementId),
  });
}

// Optional: warn in dev if env vars are missing
if (
  !firebaseConfig.apiKey ||
  !firebaseConfig.authDomain ||
  !firebaseConfig.projectId ||
  !firebaseConfig.appId
) {
  // eslint-disable-next-line no-console
  console.warn(
    'Firebase config is missing required VITE_FIREBASE_* env vars. ' +
      'Set them in your environment (Netlify UI for production, .env for local).'
  );
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication
export const auth = getAuth(app);

export default app;
