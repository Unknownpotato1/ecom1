// ============================================================================
// Aurora & Co. — Client-side Firebase initialization.
// Real Firebase Auth — Google sign-in only.
// ============================================================================

import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  type Auth,
  type User as FirebaseUser,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

let app: FirebaseApp | null = null;
let auth: Auth | null = null;

export function getFirebaseApp(): FirebaseApp | null {
  if (typeof window === "undefined") return null;
  if (!firebaseConfig.apiKey || !firebaseConfig.authDomain) return null;
  if (!app) {
    app = getApps().length > 0 ? getApps()[0]! : initializeApp(firebaseConfig);
  }
  return app;
}

export function getFirebaseAuth(): Auth | null {
  if (typeof window === "undefined") return null;
  const a = getFirebaseApp();
  if (!a) return null;
  if (!auth) auth = getAuth(a);
  return auth;
}

export function isFirebaseConfigured(): boolean {
  return Boolean(firebaseConfig.apiKey && firebaseConfig.authDomain);
}

const googleProvider = new GoogleAuthProvider();
// Always prompt for account selection — important so the admin can pick
// the correct Google account (shahbazahmad9783@gmail.com) every time.
googleProvider.setCustomParameters({ prompt: "select_account" });

// Real Google sign-in via Firebase Auth popup.
export async function signInWithGoogle(): Promise<FirebaseUser> {
  const auth = getFirebaseAuth();
  if (!auth) throw new Error("Firebase Auth is not configured. Check NEXT_PUBLIC_FIREBASE_* env vars.");
  const result = await signInWithPopup(auth, googleProvider);
  return result.user;
}

export async function signOutFirebase(): Promise<void> {
  const auth = getFirebaseAuth();
  if (!auth) return;
  await signOut(auth);
}

export function subscribeToAuthChanges(callback: (user: FirebaseUser | null) => void): () => void {
  const auth = getFirebaseAuth();
  if (!auth) {
    callback(null);
    return () => {};
  }
  return onAuthStateChanged(auth, callback);
}

// The single email that gets admin access. Nothing in the UI mentions admin
// unless the signed-in user's email matches this exactly.
export const ADMIN_EMAIL = "shahbazahmad9783@gmail.com";

export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  return email.trim().toLowerCase() === ADMIN_EMAIL;
}
