"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import {
  type AuthUser,
  getStoredUser,
  setStoredUser,
  mockSignIn,
  mockSignUp,
  mockGoogleSignIn,
  mockSignOut,
  mockForgotPassword,
  isAdminEmail,
} from "@/lib/auth";
import { useWishlistStore } from "@/lib/stores";

interface AuthCtx {
  user: AuthUser | null;
  isLoading: boolean;
  isAdmin: boolean;
  signIn: (email: string, password: string) => Promise<AuthUser>;
  signUp: (name: string, email: string, password: string) => Promise<AuthUser>;
  googleSignIn: () => Promise<AuthUser>;
  signOut: () => Promise<void>;
  forgotPassword: (email: string) => Promise<{ ok: boolean }>;
  refresh: () => void;
}

const Ctx = createContext<AuthCtx | null>(null);

export function useAuth() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // useSyncExternalStore-equivalent for SSR-safe initial user read.
  // We initialize from localStorage on first client render to avoid SSR mismatch.
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const setWishlistIds = useWishlistStore((s) => s.setIds);

  useEffect(() => {
    // Initial sync from localStorage — runs once after mount.
    // We intentionally set state here because we're hydrating from localStorage
    // which is only available in the browser. Deferring via microtask to avoid
    // cascading renders.
    const id = setTimeout(() => {
      const u = getStoredUser();
      if (u !== null) {
        setUser(u);
        if (isAdminEmail(u.email)) {
          setWishlistIds(["p-001", "p-013"]);
        }
      }
      setIsLoading(false);
    }, 0);
    return () => clearTimeout(id);
  }, [setWishlistIds]);

  const signIn = useCallback(async (email: string, password: string) => {
    const u = await mockSignIn(email, password);
    setUser(u);
    if (isAdminEmail(u.email)) setWishlistIds(["p-001", "p-013"]);
    return u;
  }, [setWishlistIds]);

  const signUp = useCallback(async (name: string, email: string, password: string) => {
    const u = await mockSignUp(name, email, password);
    setUser(u);
    return u;
  }, []);

  const googleSignIn = useCallback(async () => {
    const u = await mockGoogleSignIn();
    setUser(u);
    return u;
  }, []);

  const signOut = useCallback(async () => {
    await mockSignOut();
    setUser(null);
    setWishlistIds([]);
  }, [setWishlistIds]);

  const forgotPassword = useCallback(async (email: string) => {
    return mockForgotPassword(email);
  }, []);

  const refresh = useCallback(() => {
    setUser(getStoredUser());
  }, []);

  return (
    <Ctx.Provider
      value={{
        user,
        isLoading,
        isAdmin: isAdminEmail(user?.email),
        signIn,
        signUp,
        googleSignIn,
        signOut,
        forgotPassword,
        refresh,
      }}
    >
      {children}
    </Ctx.Provider>
  );
}
