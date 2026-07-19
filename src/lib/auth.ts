// ============================================================================
// Aurora & Co. — Mock auth layer.
// In production this is replaced by Firebase Auth (see README).
// The admin email is hard-checked: only shahbazahmad9783@gmail.com is admin.
// ============================================================================

export const ADMIN_EMAIL = "shahbazahmad9783@gmail.com";

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  mobile?: string;
  avatarUrl?: string;
  role: "customer" | "admin";
}

const STORAGE_KEY = "aurora-auth-user";

function generateId() {
  return `u_${Math.random().toString(36).slice(2, 10)}${Date.now().toString(36)}`;
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

export function isAdminEmail(email: string | undefined | null): boolean {
  if (!email) return false;
  return email.trim().toLowerCase() === ADMIN_EMAIL;
}

// Mock sign-in. Real implementation calls Firebase Auth.
export async function mockSignIn(email: string, _password: string): Promise<AuthUser> {
  await new Promise((r) => setTimeout(r, 600)); // simulate latency
  const isAdmin = isAdminEmail(email);
  const name = email.split("@")[0]?.replace(/[._-]/g, " ").replace(/\b\w/g, (m) => m.toUpperCase()) || "Customer";
  const user: AuthUser = {
    id: generateId(),
    email,
    name: isAdmin ? "Shahbaz Ahmad" : name,
    role: isAdmin ? "admin" : "customer",
    avatarUrl: undefined,
  };
  setStoredUser(user);
  return user;
}

export async function mockSignUp(name: string, email: string, _password: string): Promise<AuthUser> {
  await new Promise((r) => setTimeout(r, 600));
  const isAdmin = isAdminEmail(email);
  const user: AuthUser = {
    id: generateId(),
    email,
    name,
    role: isAdmin ? "admin" : "customer",
  };
  setStoredUser(user);
  return user;
}

export async function mockGoogleSignIn(): Promise<AuthUser> {
  await new Promise((r) => setTimeout(r, 800));
  // In real app, opens Google OAuth popup. Here we simulate a normal user.
  // To demo admin, sign in with shahbazahmad9783@gmail.com manually.
  const email = "guest.aurora@gmail.com";
  const user: AuthUser = {
    id: generateId(),
    email,
    name: "Guest User",
    role: "customer",
  };
  setStoredUser(user);
  return user;
}

export async function mockSignOut() {
  setStoredUser(null);
}

export async function mockForgotPassword(email: string): Promise<{ ok: boolean }> {
  await new Promise((r) => setTimeout(r, 800));
  // In real app, calls Firebase sendPasswordResetEmail.
  if (!email.includes("@")) return { ok: false };
  return { ok: true };
}
