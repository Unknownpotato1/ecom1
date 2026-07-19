"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import {
  type AuthUser,
  onAuthChange,
  signInWithGooglePopup,
  signOutUser,
  isAdminEmail,
  isFirebaseConfigured,
} from "@/lib/auth";

interface AuthCtx {
  user: AuthUser | null;
  isLoading: boolean;
  isAdmin: boolean;
  isConfigured: boolean;
  signInWithGoogle: () => Promise<AuthUser>;
  signOut: () => Promise<void>;
  refresh: () => void;
}

const Ctx = createContext<AuthCtx | null>(null);

export function useAuth() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Subscribe to Firebase auth state changes — real auth, not mock.
    const unsubscribe = onAuthChange((u) => {
      setUser(u);
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const signInWithGoogle = useCallback(async () => {
    const u = await signInWithGooglePopup();
    setUser(u);
    return u;
  }, []);

  const signOut = useCallback(async () => {
    await signOutUser();
    setUser(null);
  }, []);

  const refresh = useCallback(() => {
    // Auth state is managed by Firebase onAuthStateChanged; no manual refresh needed.
  }, []);

  return (
    <Ctx.Provider
      value={{
        user,
        isLoading,
        isAdmin: isAdminEmail(user?.email),
        isConfigured: isFirebaseConfigured(),
        signInWithGoogle,
        signOut,
        refresh,
      }}
    >
      {children}
    </Ctx.Provider>
  );
}
