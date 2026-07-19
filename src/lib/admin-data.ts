// ============================================================================
// Admin mock data helpers — generates realistic-looking demo data inline.
// In production these would come from Firestore / your DB.
// ============================================================================

import { products, categories } from "@/lib/data";
import type { Address, Order, OrderStatus, User } from "@/lib/types";
import { generateOrderNumber } from "@/lib/format";

// Deterministic PRNG so the same data renders on every refresh (avoids
// hydration mismatch + keeps the demo coherent).
function mulberry32(seed: number) {
  let a = seed;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const rng = mulberry32(20260620);
function pick<T>(arr: readonly T[]): T {
  return arr[Math.floor(rng() * arr.length)]!;
}
function int(min: number, max: number) {
  return Math.floor(rng() * (max - min + 1)) + min;
}

// ---------------------------------------------------------------------------
// Mock customers
// ---------------------------------------------------------------------------
const firstNames = ["Aarav", "Vivaan", "Aditya", "Vihaan", "Arjun", "Sai", "Reyansh", "Ayaan", "Krishna", "Ishaan", "Ananya", "Diya", "Aadhya", "Saanvi", "Pari", "Myra", "Anika", "Navya", "Aria", "Ira", "Riya", "Sneha", "Kavya", "Priya", "Meera"];
const lastNames = ["Sharma", "Verma", "Gupta", "Singh", "Kumar", "Mehta", "Patel", "Reddy", "Nair", "Iyer", "Kapoor", "Joshi", "Malhotra", "Chopra", "Bose"];
const cities = ["Mumbai", "Delhi", "Bengaluru", "Hyderabad", "Chennai", "Kolkata", "Pune", "Jaipur", "Lucknow", "Ahmedabad", "Kochi", "Surat"];

function makeAddress(name: string, mobile: string): Address {
  const city = pick(cities);
  return {
    id: `addr-${Math.random().toString(36).slice(2, 8)}`,
    fullName: name,
    mobile,
    line1: `${int(1, 200)}, ${pick(["MG Road", "Park Street", "Civil Lines", "Jubilee Hills", "Indira Nagar", "Banjara Hills", "Anna Salai"])}`,
    line2: pick(["Near Metro Station", "Opp. City Mall", "Behind Bus Stand", ""]),
    city,
    state: pick(["Maharashtra", "Delhi", "Karnataka", "Telangana", "Tamil Nadu", "West Bengal", "Rajasthan", "Uttar Pradesh", "Gujarat", "Kerala"]),
    pincode: `${int(1, 8)}${int(0, 9)}${int(0, 9)}${int(0, 9)}${int(0, 9)}${int(0, 9)}`,
    isDefault: true,
    type: pick(["home", "office", "other"]),
  };
}

export const mockCustomers: User[] = Array.from({ length: 24 }).map((_, i) => {
  const first = firstNames[i % firstNames.length]!;
  const last = lastNames[int(0, lastNames.length - 1)]!;
  const name = `${first} ${last}`;
  const emailLocal = `${first.toLowerCase()}.${last.toLowerCase()}${int(1, 999)}`;
  const email = `${emailLocal}@${pick(["gmail.com", "outlook.com", "yahoo.in", "icloud.com"])}`;
  const mobile = `+91 ${int(70, 99)}${int(100, 999)} ${int(10000, 99999)}`;
  const createdAt = new Date(Date.now() - int(1, 280) * 24 * 60 * 60 * 1000).toISOString();
  return {
    id: `u-${(i + 1).toString().padStart(3, "0")}`,
    email,
    name,
    mobile,
    role: "customer",
    addresses: [makeAddress(name, mobile)],
    wishlistProductIds: Array.from({ length: int(0, 4) }).map(() => products[int(0, products.length - 1)]!.id),
    createdAt,
  };
});

// ---------------------------------------------------------------------------
// Mock orders
// ---------------------------------------------------------------------------
const orderStatuses: OrderStatus[] = ["confirmed", "packed", "shipped", "out_for_delivery", "delivered", "cancelled"];

const statusColor: Record<OrderStatus, string> = {
  confirmed: "bg-blue-100 text-blue-700 border-blue-200",
  packed: "bg-violet-100 text-violet-700 border-violet-200",
  shipped: "bg-amber-100 text-amber-700 border-amber-200",
  out_for_delivery: "bg-cyan-100 text-cyan-700 border-cyan-200",
  delivered: "bg-emerald-100 text-emerald-700 border-emerald-200",
  cancelled: "bg-rose-100 text-rose-700 border-rose-200",
  failed: "bg-rose-100 text-rose-700 border-rose-200",
};

export function orderStatusBadgeClass(status: OrderStatus): string {
  return statusColor[status];
}

export function orderStatusLabel(status: OrderStatus): string {
  return status.split("_").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
}

function makeOrder(i: number): Order {
  const customer = mockCustomers[i % mockCustomers.length]!;
  const itemCount = int(1, 4);
  const items = Array.from({ length: itemCount }).map(() => {
    const p = pick(products);
    const qty = int(1, 3);
    const unitPrice = p.basePrice;
    return {
      productId: p.id,
      name: p.name,
      slug: p.slug,
      image: p.images[0]?.url ?? "",
      quantity: qty,
      unitPrice,
      total: unitPrice * qty,
    };
  });
  const subtotal = items.reduce((s, it) => s + it.total, 0);
  const discount = rng() > 0.6 ? Math.round(subtotal * (rng() > 0.5 ? 0.1 : 0.15)) : 0;
  const shipping = subtotal - discount > 999 ? 0 : 49;
  const tax = 0;
  const total = subtotal - discount + shipping + tax;
  const paymentMethod = pick(["prepaid", "cod", "partial_cod"] as const);
  const paymentStatus =
    paymentMethod === "prepaid" ? "paid" : paymentMethod === "partial_cod" ? "partial" : "pending";
  const status = i < 3 ? "delivered" : i < 7 ? pick(["shipped", "out_for_delivery", "delivered"] as OrderStatus[]) : pick(orderStatuses);
  const createdAt = new Date(Date.now() - int(1, 45) * 24 * 60 * 60 * 1000).toISOString();
  const timeline = buildTimeline(status, createdAt);

  return {
    id: `o-${(i + 1).toString().padStart(3, "0")}`,
    orderNumber: `AUR-${(1000 + i).toString().padStart(5, "0")}`,
    userId: customer.id,
    guestEmail: customer.email,
    guestMobile: customer.mobile ?? "",
    items,
    address: customer.addresses[0]!,
    subtotal,
    discount,
    shipping,
    tax,
    total,
    paymentMethod,
    paymentStatus,
    couponCode: discount > 0 ? pick(["AURORA15", "FESTIVE10", "FLAT200", "WELCOME100"]) : undefined,
    status,
    timeline,
    estimatedDelivery: new Date(Date.now() + int(2, 7) * 24 * 60 * 60 * 1000).toISOString(),
    createdAt,
    updatedAt: createdAt,
  };
}

function buildTimeline(status: OrderStatus, createdAt: string) {
  const base = new Date(createdAt).getTime();
  const flow: OrderStatus[] = ["confirmed", "packed", "shipped", "out_for_delivery", "delivered"];
  if (status === "cancelled") {
    return [
      { status: "confirmed", at: createdAt, note: "Order placed" },
      { status: "cancelled", at: new Date(base + 12 * 60 * 60 * 1000).toISOString(), note: "Customer cancelled" },
    ];
  }
  const endIdx = flow.indexOf(status);
  return flow.slice(0, endIdx + 1).map((s, idx) => ({
    status: s,
    at: new Date(base + idx * 18 * 60 * 60 * 1000).toISOString(),
    note: idx === 0 ? "Order placed" : undefined,
  }));
}

// Stable order list (uses the seeded rng via makeOrder).
export const mockOrders: Order[] = (() => {
  // Override generateOrderNumber for stable output.
  const list: Order[] = [];
  for (let i = 0; i < 18; i++) list.push(makeOrder(i));
  return list;
})();

// Re-export so callers can refresh a single order number if needed.
export { generateOrderNumber };

// ---------------------------------------------------------------------------
// Customer lookup helper (so /admin/customers drawer can show orders)
// ---------------------------------------------------------------------------
export function ordersForCustomer(userId: string): Order[] {
  return mockOrders.filter((o) => o.userId === userId);
}

export function totalSpentByCustomer(userId: string): number {
  return ordersForCustomer(userId).reduce((s, o) => s + o.total, 0);
}

export function ordersCountForCustomer(userId: string): number {
  return ordersForCustomer(userId).length;
}

// ---------------------------------------------------------------------------
// Mock activity logs
// ---------------------------------------------------------------------------
const logActions = [
  "PRODUCT_CREATED",
  "PRODUCT_UPDATED",
  "PRODUCT_DELETED",
  "ORDER_STATUS_UPDATED",
  "ORDER_REFUNDED",
  "COUPON_CREATED",
  "COUPON_DISABLED",
  "CUSTOMER_REGISTERED",
  "REVIEW_VERIFIED",
  "REVIEW_DELETED",
  "MEDIA_UPLOADED",
  "HOMEPAGE_UPDATED",
  "THEME_SAVED",
  "SETTINGS_UPDATED",
  "ADMIN_SIGNIN",
] as const;

const logUsers = ["shahbazahmad9783@gmail.com", "system", "guest.aurora@gmail.com"];

export interface ActivityLog {
  id: string;
  timestamp: string;
  action: (typeof logActions)[number];
  user: string;
  ip: string;
  details: string;
}

export const mockActivityLogs: ActivityLog[] = Array.from({ length: 40 }).map((_, i) => {
  const action = logActions[i % logActions.length]!;
  const daysAgo = Math.floor(i / 4);
  const ts = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000 - int(0, 23) * 60 * 60 * 1000).toISOString();
  return {
    id: `log-${(i + 1).toString().padStart(4, "0")}`,
    timestamp: ts,
    action,
    user: pick(logUsers),
    ip: `${int(103, 117)}.${int(0, 255)}.${int(0, 255)}.${int(1, 254)}`,
    details: pick([
      `Edited product "${pick(products).name}"`,
      `Updated order ${pick(mockOrders).orderNumber} to ${orderStatusLabel(pick(orderStatuses))}`,
      `Verified review by ${pick(firstNames)}`,
      `Saved homepage layout`,
      `Created coupon ${pick(["AURORA15", "FESTIVE10", "FLAT200"])}`,
      `Updated store settings`,
      `Uploaded media asset`,
      `Signed in to admin console`,
    ]),
  };
});

// ---------------------------------------------------------------------------
// Mock media library — derive from product image URLs + banners + IG posts
// ---------------------------------------------------------------------------
export interface AdminMediaItem {
  id: string;
  url: string;
  name: string;
  folder: string;
  size: number; // KB
  width?: number;
  height?: number;
  uploadedAt: string;
  alt?: string;
}

const imagePool = Array.from(
  new Set(
    products.flatMap((p) => p.images.map((i) => i.url)).concat(
      categories.map((c) => c.image.url),
    ),
  ),
).slice(0, 24);

export const mockMediaItems: AdminMediaItem[] = imagePool.map((url, i) => {
  const folder = pick(["Jewelry", "Hampers", "Banners", "Instagram"]);
  return {
    id: `media-${(i + 1).toString().padStart(3, "0")}`,
    url,
    name: `aurora-${folder.toLowerCase()}-${(i + 1).toString().padStart(3, "0")}.jpg`,
    folder,
    size: int(120, 2400),
    width: 1200,
    height: 1200,
    uploadedAt: new Date(Date.now() - int(1, 60) * 24 * 60 * 60 * 1000).toISOString(),
    alt: `${folder} image ${i + 1}`,
  };
});

// ---------------------------------------------------------------------------
// Mock KPI totals for the dashboard
// ---------------------------------------------------------------------------
export const dashboardKPIs = {
  totalRevenue: 1284560,
  orders: mockOrders.length,
  customers: mockCustomers.length,
  avgOrderValue: Math.round(
    mockOrders.reduce((s, o) => s + o.total, 0) / Math.max(mockOrders.length, 1),
  ),
};

export const revenueLast7Days = Array.from({ length: 7 }).map((_, i) => {
  const d = new Date();
  d.setDate(d.getDate() - (6 - i));
  const base = 12000 + int(0, 18000);
  return {
    label: d.toLocaleDateString("en-IN", { weekday: "short" }),
    date: d.toISOString().slice(0, 10),
    revenue: base,
    orders: int(8, 28),
  };
});
