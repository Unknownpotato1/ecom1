// ============================================================================
// Aurora & Co. — Auth layer.
// Real Firebase Google Authentication. No fake/demo sign-in.
// The admin email check is the ONLY gate to the admin panel.
// ============================================================================

import {
  signInWithGoogle,
  signOutFirebase,
  subscribeToAuthChanges,
  isAdminEmail,
  ADMIN_EMAIL,
  isFirebaseConfigured,
} from "@/lib/firebase";
import type { User as FirebaseUser } from "firebase/auth";

export { ADMIN_EMAIL, isAdminEmail, isFirebaseConfigured };

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  mobile?: string;
  avatarUrl?: string;
  role: "customer" | "admin";
}

const STORAGE_KEY = "aurora-auth-user";

function toAuthUser(fb: FirebaseUser): AuthUser {
  return {
    id: fb.uid,
    email: fb.email ?? "",
    name: fb.displayName ?? fb.email?.split("@")[0] ?? "Customer",
    mobile: fb.phoneNumber ?? undefined,
    avatarUrl: fb.photoURL ?? undefined,
    role: isAdminEmail(fb.email) ? "admin" : "customer",
  };
}

export function getStoredUser(): AuthUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
}

export function setStoredUser(user: AuthUser | null) {
  if (typeof window === "undefined") return;
  if (user) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  else window.localStorage.removeItem(STORAGE_KEY);
}

// Subscribe to Firebase auth state changes.
// Calls the callback with the parsed AuthUser (or null) and persists to localStorage.
export function onAuthChange(callback: (user: AuthUser | null) => void): () => void {
  return subscribeToAuthChanges((fbUser) => {
    if (fbUser) {
      const user = toAuthUser(fbUser);
      setStoredUser(user);
      callback(user);
    } else {
      setStoredUser(null);
      callback(null);
    }
  });
}

// Real Google sign-in via Firebase popup.
export async function signInWithGooglePopup(): Promise<AuthUser> {
  const fbUser = await signInWithGoogle();
  const user = toAuthUser(fbUser);
  setStoredUser(user);
  return user;
}

export async function signOutUser(): Promise<void> {
  await signOutFirebase();
  setStoredUser(null);
}
