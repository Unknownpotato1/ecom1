// ============================================================================
// Aurora & Co. — Formatting utilities
// ============================================================================

export function formatINR(amount: number, opts?: { decimals?: boolean }): string {
  const value = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: opts?.decimals ? 2 : 0,
    minimumFractionDigits: opts?.decimals ? 2 : 0,
  }).format(amount);
  return value;
}

export function formatNumber(n: number): string {
  return new Intl.NumberFormat("en-IN").format(n);
}

export function discountPercent(price: number, compareAt?: number): number {
  if (!compareAt || compareAt <= price) return 0;
  return Math.round(((compareAt - price) / compareAt) * 100);
}

export function formatDate(iso: string, opts?: Intl.DateTimeFormatOptions): string {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    ...opts,
  });
}

export function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const sec = Math.floor(diff / 1000);
  const min = Math.floor(sec / 60);
  const hr = Math.floor(min / 60);
  const day = Math.floor(hr / 24);
  if (day > 30) return formatDate(iso);
  if (day > 0) return `${day}d ago`;
  if (hr > 0) return `${hr}h ago`;
  if (min > 0) return `${min}m ago`;
  return "just now";
}

export function timeLeft(iso: string): { days: number; hours: number; minutes: number; seconds: number; expired: boolean } {
  const diff = new Date(iso).getTime() - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, expired: true };
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);
  return { days, hours, minutes, seconds, expired: false };
}

export function estimatedDeliveryDate(daysFromNow = 5): string {
  const d = new Date();
  d.setDate(d.getDate() + daysFromNow);
  return d.toISOString();
}

export function estimatedDeliveryLabel(daysFromNow = 5): string {
  return formatDate(estimatedDeliveryDate(daysFromNow), { weekday: "short" });
}

export function slugify(s: string): string {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function generateOrderNumber(): string {
  const ts = Date.now().toString(36).toUpperCase().slice(-6);
  const rnd = Math.random().toString(36).toUpperCase().slice(2, 6);
  return `AUR-${ts}${rnd}`;
}

export function truncate(s: string, max: number): string {
  if (s.length <= max) return s;
  return s.slice(0, max - 1) + "…";
}

export function clamp(n: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, n));
}

export function safeText(s: unknown, fallback = ""): string {
  if (typeof s === "string") return s;
  if (typeof s === "number") return String(s);
  return fallback;
}

// PIN code validation — Indian 6-digit
export function isValidIndianPin(pin: string): boolean {
  return /^[1-9][0-9]{5}$/.test(pin.trim());
}

// Mock India Post PIN API — derives city/state from PIN range.
// Real implementation calls https://api.postalpincode.in/pincode/{pin}
export function lookupIndianPin(pin: string): { city: string; state: string; valid: boolean } {
  if (!isValidIndianPin(pin)) return { city: "", state: "", valid: false };
  const first = parseInt(pin[0]!, 10);
  // Rough mapping by first digit (postal region)
  const regions: Record<number, { city: string; state: string }> = {
    1: { city: "Delhi", state: "Delhi" },
    2: { city: "Lucknow", state: "Uttar Pradesh" },
    3: { city: "Jaipur", state: "Rajasthan" },
    4: { city: "Mumbai", state: "Maharashtra" },
    5: { city: "Hyderabad", state: "Telangana" },
    6: { city: "Chennai", state: "Tamil Nadu" },
    7: { city: "Kolkata", state: "West Bengal" },
    8: { city: "Patna", state: "Bihar" },
    9: { city: "Bengaluru", state: "Karnataka" },
  };
  const r = regions[first] ?? { city: "", state: "" };
  // Refine a few well-known PINs
  const known: Record<string, { city: string; state: string }> = {
    "110001": { city: "New Delhi", state: "Delhi" },
    "400001": { city: "Mumbai", state: "Maharashtra" },
    "560001": { city: "Bengaluru", state: "Karnataka" },
    "700001": { city: "Kolkata", state: "West Bengal" },
    "600001": { city: "Chennai", state: "Tamil Nadu" },
    "500001": { city: "Hyderabad", state: "Telangana" },
    "380001": { city: "Ahmedabad", state: "Gujarat" },
    "411001": { city: "Pune", state: "Maharashtra" },
    "226001": { city: "Lucknow", state: "Uttar Pradesh" },
    "302001": { city: "Jaipur", state: "Rajasthan" },
  };
  return { ...r, ...(known[pin] ?? {}) };
}

// Safe HTML sanitizer (very small — for custom sections)
export function sanitizeHtml(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<iframe[\s\S]*?<\/iframe>/gi, "")
    .replace(/ on\w+="[^"]*"/gi, "")
    .replace(/ on\w+='[^']*'/gi, "")
    .replace(/javascript:/gi, "");
}

export function safeJsonParse<T>(s: string | null | undefined, fallback: T): T {
  if (!s) return fallback;
  try { return JSON.parse(s) as T; } catch { return fallback; }
}
