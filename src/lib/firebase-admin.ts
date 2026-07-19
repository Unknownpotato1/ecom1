// ============================================================================
// Aurora & Co. — Firebase Admin SDK initialization.
// Uses server-side env vars (never exposed to the client).
// ============================================================================

import type { ServiceAccount } from "firebase-admin/app";

let adminApp: ReturnType<typeof import("firebase-admin/app").initializeApp> | null = null;
let adminDb: ReturnType<typeof import("firebase-admin/firestore").getFirestore> | null = null;
let adminAuth: ReturnType<typeof import("firebase-admin/auth").getAuth> | null = null;
let adminBucket: ReturnType<typeof import("firebase-admin/storage").getBucket> | null = null;

function getServiceAccount(): ServiceAccount | null {
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKeyRaw = process.env.FIREBASE_PRIVATE_KEY;
  if (!projectId || !clientEmail || !privateKeyRaw) return null;
  // The private key stored in env has literal \n — convert to real newlines.
  const privateKey = privateKeyRaw.replace(/\\n/g, "\n");
  return { projectId, clientEmail, privateKey };
}

export async function getFirebaseAdmin() {
  if (adminApp) return { app: adminApp, db: adminDb!, auth: adminAuth!, bucket: adminBucket };

  const serviceAccount = getServiceAccount();
  if (!serviceAccount) {
    throw new Error(
      "Firebase Admin SDK not configured. Set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY in .env"
    );
  }

  const { initializeApp, getApps, cert } = await import("firebase-admin/app");
  const { getFirestore } = await import("firebase-admin/firestore");
  const { getAuth } = await import("firebase-admin/auth");
  const { getStorage } = await import("firebase-admin/storage");

  adminApp = getApps().length > 0 ? getApps()[0]! : initializeApp({
    credential: cert(serviceAccount),
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  });
  adminDb = getFirestore(adminApp);
  adminAuth = getAuth(adminApp);
  adminBucket = getStorage(adminApp).bucket();

  return { app: adminApp, db: adminDb, auth: adminAuth, bucket: adminBucket };
}

export async function verifyIdToken(idToken: string) {
  const { auth } = await getFirebaseAdmin();
  return auth.verifyIdToken(idToken);
}

export async function isUserAdmin(idToken: string | undefined | null): Promise<boolean> {
  if (!idToken) return false;
  try {
    const decoded = await verifyIdToken(idToken);
    return decoded.email === process.env.ADMIN_EMAIL;
  } catch {
    return false;
  }
}

// ---------------------------------------------------------------------------
// Firestore collection helpers — mirrors the Prisma schema.
// ---------------------------------------------------------------------------
export const COLLECTIONS = {
  USERS: "users",
  ADDRESSES: "addresses",
  WISHLIST_ITEMS: "wishlistItems",
  PRODUCTS: "products",
  COLLECTIONS: "collections",
  COLLECTION_PRODUCTS: "collectionProducts",
  CATEGORIES: "categories",
  REVIEWS: "reviews",
  COUPONS: "coupons",
  ORDERS: "orders",
  HERO_SLIDES: "heroSlides",
  ANNOUNCEMENT_ITEMS: "announcementItems",
  HOMEPAGE_SECTIONS: "homepageSections",
  TESTIMONIALS: "testimonials",
  INSTAGRAM_POSTS: "instagramPosts",
  MEDIA_ASSETS: "mediaAssets",
  THEME_SETTINGS: "themeSettings",
} as const;
