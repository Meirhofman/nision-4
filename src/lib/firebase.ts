import { initializeApp, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth, onAuthStateChanged, type User } from 'firebase/auth';

/** ערכי lazoz-app — גיבוי אם Vite לא טוען .env (חייב להתאים ל-.env) */
const LAZOZ_FIREBASE = {
  apiKey: 'AIzaSyA7uP8T6ddVWOj97TrasVpVPHqWrtm9bsI',
  authDomain: 'lazoz-app.firebaseapp.com',
  projectId: 'lazoz-app',
  storageBucket: 'lazoz-app.firebasestorage.app',
  messagingSenderId: '451924954113',
  appId: '1:451924954113:web:409b6a52fd57fea223c400',
} as const;

function envOr(key: keyof typeof LAZOZ_FIREBASE, envValue: string | undefined): string {
  const v = (envValue || '').trim();
  return v || LAZOZ_FIREBASE[key];
}

export const firebaseConfig = {
  apiKey: envOr('apiKey', import.meta.env.VITE_FIREBASE_API_KEY),
  authDomain: envOr('authDomain', import.meta.env.VITE_FIREBASE_AUTH_DOMAIN),
  projectId: envOr('projectId', import.meta.env.VITE_FIREBASE_PROJECT_ID),
  storageBucket: envOr('storageBucket', import.meta.env.VITE_FIREBASE_STORAGE_BUCKET),
  messagingSenderId: envOr('messagingSenderId', import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID),
  appId: envOr('appId', import.meta.env.VITE_FIREBASE_APP_ID),
};

let app: FirebaseApp | null = null;
let auth: Auth | null = null;

export function getFirebaseAuth(): Auth | null {
  if (!firebaseConfig.apiKey) return null;
  if (!app) {
    console.log('[Firebase] Initializing with Project ID:', firebaseConfig.projectId);
    console.log('[Firebase] Config source:', getFirebaseConfigSource());
    console.log('[Firebase] Auth Domain:', firebaseConfig.authDomain);
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    auth.languageCode = 'he';
    
    // אבחון גלובלי לדיבוג - רק בדפדפן
    if (typeof window !== 'undefined') {
      (window as any).FIREBASE_DIAGNOSTICS = {
        config: { ...firebaseConfig, apiKey: '***' + firebaseConfig.apiKey?.slice(-4) },
        source: getFirebaseConfigSource(),
        url: window.location.href,
        domain: window.location.hostname
      };
    }
  }
  return auth;
}

export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey &&
  firebaseConfig.authDomain &&
  firebaseConfig.projectId &&
  firebaseConfig.appId
);

export function getFirebaseConfigSource(): 'env' | 'fallback' {
  const fromEnv = Boolean((import.meta.env.VITE_FIREBASE_API_KEY || '').trim());
  return fromEnv ? 'env' : 'fallback';
}

export function listenToAuthState(callback: (user: User | null) => void) {
  const auth = getFirebaseAuth();
  if (!auth) return () => {};
  return onAuthStateChanged(auth, callback);
}
