# Aurora & Co. — Premium eCommerce Storefront

> Handcrafted artificial jewelry & curated gift hampers. Built with Next.js 16, TypeScript, Tailwind v4, shadcn/ui, Framer Motion.

A production-ready, conversion-optimized storefront inspired by Shopify premium themes. Includes a full customer-facing storefront (22+ pages), a comprehensive admin panel (15 routes), mock Firebase auth, mock Razorpay payment flow, COD + Partial COD, coupons, gift hampers, gift notes, reviews, and a Shopify-style homepage builder with drag-and-drop.

---

## ✨ Features

### Storefront
- **Home** — Modular homepage with 16 sections (hero slider, featured collections, shop by category, best sellers, new arrivals, gift hampers, limited offers, image+text, video, testimonials, Instagram gallery, brand story, newsletter). All sections are reorderable/disable-able from the admin homepage builder.
- **Sticky header** — transparent on top, solid on scroll, hamburger menu, centered logo, search + bag + wishlist + account, secondary desktop nav row.
- **Bottom navigation** — Home, Shop, Wishlist, Account — mobile-only, sticky.
- **Product page** — Image gallery with hover-zoom, thumbnail slider, video support, color swatches, size variants, compare-at price + discount %, multi-buy offers (Buy 2 / Buy 3), pin code checker (auto-fills city/state, calculates delivery date), sticky add-to-cart on mobile, trust badges, reviews with photos and verified badges, frequently bought together, related products.
- **Collections** — All collections grid, category chips, filterable product grid with category + price + sort.
- **Collection detail** — Banner hero, sortable product grid.
- **Cart** — Coupon box, gift note, quantity editor, free-shipping progress, tax breakdown.
- **Wishlist** — LocalStorage for guests, Firestore-ready for logged-in users.
- **Checkout** — Guest checkout OR Google login, India Post PIN auto-fill, prepaid (15% off) / COD / Partial COD (10% advance), coupon, gift note, order summary with shipping + tax, full validation.
- **Order success / failed / tracking** — Timeline UI with all 5 statuses (confirmed → packed → shipped → out for delivery → delivered), invoice-ready order details.
- **Auth** — Google sign-in only (real Firebase Authentication). No email/password, no demo accounts.
- **Profile** — Orders, Addresses, Wishlist, Edit Profile.
- **Content pages** — About, Contact, Privacy, Refund, Shipping, Terms, FAQ, Search, 404.
- **Search** — Instant search drawer with recent searches, trending searches, product/collection/category results.

### Admin Panel
- **Dashboard** — KPI cards, revenue chart (Recharts), top products, recent orders, low-stock alerts.
- **Products** — Searchable/filterable table, Add Product dialog with all fields (slug auto-gen, variants, SEO, flags).
- **Collections, Categories, Orders, Customers, Coupons, Reviews, Media Library, Pages** — Full CRUD-style management UI.
- **Homepage Builder** — Shopify-style drag-and-drop (@dnd-kit) with toggle / edit / duplicate / delete per section.
- **Navigation Editor** — Header links, footer groups, announcement bar — all CRUD + reorder.
- **Theme Customizer** — Color pickers, font selectors, radius/width/spacing sliders, live preview pane.
- **Settings** — Store, Payment, Shipping, Social, Backups (5 tabs).
- **Logs** — Activity log with filters.
- **Admin access enforced** — Only the authorized Google account can access admin. Non-admins see a 404 page (the admin area is invisible to them).

### Cross-cutting
- **Cart & Wishlist** — Zustand + persist (localStorage). Firestore-ready for logged-in sync.
- **Coupon engine** — Percentage / flat, min order, max discount, usage limits, expiry.
- **Multi-buy offers** — Automatic discount calculation based on quantity.
- **PIN code lookup** — Built-in offline lookup with India Post API fallback.
- **Recently viewed, recently searched, back-to-top, exit-intent popup, toast notifications, skeleton loaders, beautiful empty states.**
- **SEO** — Per-page metadata, OpenGraph, sitemap-ready, semantic HTML, alt text.
- **Accessibility** — Skip link, ARIA labels, keyboard nav, focus management.
- **Responsive** — Mobile-first design with proper tablet + desktop enhancements.
- **Performance** — Lazy images, code-splitting, Turbopack dev, image optimization.

---

## 🛠 Tech Stack

| Layer | Tech |
|---|---|
| Framework | **Next.js 16** (App Router, Turbopack) |
| Language | **TypeScript 5** (strict) |
| Styling | **Tailwind CSS 4** + **shadcn/ui** (New York) |
| Animation | **Framer Motion** |
| State | **Zustand** (client) + **TanStack Query** (server) |
| Database | **Prisma + SQLite** (local dev) — designed to swap to **Firestore** in production |
| Auth | Mock layer in `src/lib/auth.ts` — designed to swap to **Firebase Auth** |
| Payments | Mock Razorpay flow in `src/lib/razorpay.ts` — designed to swap to **Razorpay** REST API |
| Charts | Recharts |
| Drag-and-drop | @dnd-kit (core + sortable) |
| Icons | lucide-react |
| Forms | react-hook-form + zod (available) |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 20+ and Bun (or npm/pnpm/yarn)
- A Razorpay account (for real payments)
- A Firebase project (for production auth + database)

### Install & Run

```bash
# 1. Install dependencies
bun install   # or npm install

# 2. Copy env vars
cp .env.example .env
# Edit .env with your values (optional for local dev — defaults work)

# 3. Set up the local database (optional — used as Prisma fallback)
bun run db:push

# 4. Start dev server
bun run dev
# Open http://localhost:3000
```

### Admin Access
1. Sign in via `/login` using the authorized Google account (configured via `ADMIN_EMAIL` env var).
2. After signing in, navigate to `/admin/dashboard` directly.
3. The `/admin` URL itself shows a 404 to anyone who isn't the authorized admin — there is no admin login page, no admin hints, no demo accounts.
4. To demo: sign in with the authorized Google account, then visit `/admin/dashboard`.

### Customer Demo
- Browse the homepage, add products to cart, checkout as guest, place a mock order, then track it on `/order-tracking`.
- Or sign in with Google at `/login` to see orders saved to your profile.

---

## 📁 Project Structure

```
src/
├── app/
│   ├── (storefront pages)         # /, /collections, /product/[slug], /cart, /checkout, etc.
│   ├── admin/                     # /admin (login gate) + /admin/(dashboard)/* (15 routes)
│   ├── api/                       # API routes (extend for real Razorpay webhooks etc.)
│   ├── layout.tsx                 # Root layout — providers, header, footer, drawers
│   ├── page.tsx                   # Homepage (renders modular sections)
│   ├── globals.css                # Theme tokens, fonts, animations
│   └── not-found.tsx              # Custom 404
├── components/
│   ├── admin/                     # AdminGuard, sidebar, page-header, nav-config
│   ├── cart/                      # CartDrawer
│   ├── common/                    # BackToTop, ExitIntentPopup, RecentlyViewedSync
│   ├── content/                   # PolicyPage (reusable)
│   ├── home/                      # HeroSlider, sections, recently-viewed
│   ├── layout/                    # SiteHeader, SiteFooter, BottomNav
│   ├── product/                   # ProductCard, ProductGallery, PinCodeChecker
│   ├── providers/                 # QueryProvider, StoreProvider, AuthProvider
│   ├── search/                    # SearchDrawer
│   ├── wishlist/                  # WishlistDrawer
│   └── ui/                        # shadcn/ui primitives
├── lib/
│   ├── admin-data.ts              # Mock admin data (customers, orders, logs, KPIs)
│   ├── auth.ts                    # Mock auth (swap with Firebase Auth)
│   ├── data.ts                    # Mock storefront data (products, collections, coupons, etc.)
│   ├── format.ts                  # Formatters + India Post PIN lookup
│   ├── razorpay.ts                # Mock Razorpay (swap with real API)
│   ├── stores.ts                  # Zustand stores (cart, wishlist, UI, coupon, recently viewed)
│   ├── types.ts                   # Domain types
│   ├── use-hydrated.ts            # SSR-safe hydration hook
│   └── utils.ts                   # cn() + helpers
└── prisma/
    └── schema.prisma              # Local DB schema (mirrors Firestore collections)
```

---

## 🔥 Firebase Setup (Production)

This project ships with a **mock auth + in-memory data layer** so the storefront works locally without external dependencies. To wire up real Firebase:

### 1. Create a Firebase project
- Go to <https://console.firebase.google.com> → Add project.
- Enable **Authentication** → Sign-in methods → Email/Password + Google.
- Enable **Firestore Database** (production mode).
- Enable **Storage**.

### 2. Add Firebase config to `.env`
Copy the values from Firebase Console → Project Settings → Your apps → Web app:
```
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
```

### 3. Set up the Admin SDK
- Project Settings → Service Accounts → Generate new private key.
- Add to `.env`:
```
FIREBASE_CLIENT_EMAIL=...
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_PROJECT_ID=...
```

### 4. Firestore Schema
The Prisma schema in `prisma/schema.prisma` mirrors the Firestore collections 1:1. Collections:

| Firestore Collection | Prisma Model | Purpose |
|---|---|---|
| `users` | `User` | Customer profiles, role, addresses |
| `addresses` | `Address` | Saved shipping addresses |
| `wishlistItems` | `WishlistItem` | Per-user wishlist (productId list) |
| `products` | `Product` | Catalog (price, variants, inventory, flags, SEO) |
| `collections` | `Collection` | Curated groups with banner image |
| `collectionProducts` | `CollectionProduct` | Many-to-many join |
| `categories` | `Category` | Top-level nav categories |
| `reviews` | `Review` | Per-product reviews with photos |
| `coupons` | `Coupon` | Discount codes |
| `orders` | `Order` | Customer orders with timeline |
| `heroSlides` | `HeroSlide` | Homepage slider config |
| `announcementItems` | `AnnouncementItem` | Rotating top-bar messages |
| `homepageSections` | `HomepageSection` | Modular homepage builder config |
| `testimonials` | `Testimonial` | Customer testimonials |
| `instagramPosts` | `InstagramPost` | Instagram gallery images |
| `mediaAssets` | `MediaAsset` | Media library entries |
| `themeSettings` | `ThemeSettings` | Theme customizer values |

### 5. Storage Structure
```
gs://your-project.appspot.com/
├── products/
│   ├── {productId}/
│   │   ├── main.jpg
│   │   ├── 1.jpg
│   │   └── variants/{variantId}.jpg
├── collections/
│   └── {collectionId}/banner.jpg
├── categories/
│   └── {categoryId}.jpg
├── reviews/
│   └── {reviewId}/
│       └── photo.jpg
├── media/              # general media library
│   ├── jewelry/
│   ├── hampers/
│   ├── banners/
│   └── instagram/
└── invoices/
    └── {orderNumber}.pdf
```

### 6. Firestore Security Rules
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Public read for published products, collections, categories
    match /products/{id} {
      allow read: if resource.data.isPublished == true;
      allow write: if isAdmin();
    }
    match /collections/{id} { allow read: if true; allow write: if isAdmin(); }
    match /categories/{id} { allow read: if true; allow write: if isAdmin(); }
    match /reviews/{id} { allow read: if true; allow create: if request.auth != null; }
    match /coupons/{id} { allow read: if true; allow write: if isAdmin(); }
    match /heroSlides/{id} { allow read: if true; allow write: if isAdmin(); }
    match /homepageSections/{id} { allow read: if true; allow write: if isAdmin(); }
    match /announcementItems/{id} { allow read: if true; allow write: if isAdmin(); }
    match /testimonials/{id} { allow read: if true; allow write: if isAdmin(); }
    match /instagramPosts/{id} { allow read: if true; allow write: if isAdmin(); }
    match /mediaAssets/{id} { allow read: if true; allow write: if isAdmin(); }
    match /themeSettings/{id} { allow read: if true; allow write: if isAdmin(); }

    // User-scoped data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    match /addresses/{id} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
    }
    match /wishlistItems/{id} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
    }
    match /orders/{id} {
      allow read: if request.auth != null && request.auth.uid == resource.data.userId;
      allow create: if true; // guest checkout creates orders
      allow update: if isAdmin();
    }

    function isAdmin() {
      return request.auth != null && request.auth.token.email == 'shahbazahmad9783@gmail.com';
    }
  }
}
```

### 7. Swap the mock layer
- Replace `src/lib/auth.ts` calls with `firebase/auth` (`signInWithEmailAndPassword`, `createUserWithEmailAndPassword`, `signInWithPopup(GoogleAuthProvider)`, `sendPasswordResetEmail`).
- Replace `src/lib/data.ts` reads with Firestore queries (`getDocs`, `onSnapshot`).
- Replace `src/lib/razorpay.ts` mock `createRazorpayOrder` with the real Razorpay REST API call (already stubbed in the file).

---

## 💳 Razorpay Integration (Production)

### 1. Create a Razorpay account
- Sign up at <https://razorpay.com>.
- Generate API keys at <https://dashboard.razorpay.com/app/keys>.

### 2. Add to `.env`
```
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_XXXXXXXX
RAZORPAY_KEY_ID=rzp_live_XXXXXXXX
RAZORPAY_KEY_SECRET=XXXXXXXXXXXXXXXXXXXXXXXX
RAZORPAY_WEBHOOK_SECRET=XXXXXXXXXXXXXXX
```

### 3. Implement the order creation API
Create `src/app/api/razorpay/create-order/route.ts`:
```typescript
import { NextResponse } from "next/server";
import { createRazorpayOrder } from "@/lib/razorpay";

export async function POST(req: Request) {
  const { amount, receipt } = await req.json();
  const order = await createRazorpayOrder(amount, receipt);
  return NextResponse.json(order);
}
```

### 4. Verify payment signature (server-side)
Create `src/app/api/razorpay/verify/route.ts`:
```typescript
import crypto from "crypto";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await req.json();
  const body = `${razorpay_order_id}|${razorpay_payment_id}`;
  const expected = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
    .update(body)
    .digest("hex");
  if (expected !== razorpay_signature) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
  return NextResponse.json({ ok: true });
}
```

### 5. Webhook
Set up `src/app/api/razorpay/webhook/route.ts` to handle `payment.captured`, `payment.failed` events. Configure the webhook URL in Razorpay Dashboard → Webhooks.

### Supported payment methods
- **UPI** (Google Pay, PhonePe, Paytm)
- **Credit/Debit Cards** (Visa, Mastercard, RuPay, Amex)
- **Wallets** (Mobikwik, JioMoney, etc.)
- **Net Banking** (50+ banks)
- **COD** (handled separately, no Razorpay call)
- **Partial COD** (10% via Razorpay, 90% cash on delivery)

---

## ☁️ Vercel Deployment

### 1. Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/yourusername/aurora-co.git
git push -u origin main
```

### 2. Import to Vercel
- Go to <https://vercel.com/new>.
- Import your GitHub repository.
- Vercel auto-detects Next.js — no build config needed.

### 3. Configure Environment Variables
In Vercel → Project → Settings → Environment Variables, add ALL variables from `.env.example` (production values). Mark server secrets (no `NEXT_PUBLIC_` prefix) as **Sensitive**.

### 4. Deploy
Click **Deploy**. Vercel will build and deploy to `https://your-project.vercel.app`.

### 5. Custom Domain
- Vercel → Project → Settings → Domains.
- Add your domain (e.g. `aurora-co.in`).
- Update DNS records as instructed.

### 6. Configure Webhooks
- Razorpay webhook: `https://your-domain.com/api/razorpay/webhook`
- Firebase Auth authorized domains: add your Vercel domain in Firebase Console.

---

## 📜 Available Scripts

```bash
bun run dev        # Start dev server (http://localhost:3000)
bun run build      # Production build
bun run start      # Run production build
bun run lint       # ESLint check
bun run db:push    # Push Prisma schema to SQLite
bun run db:generate# Regenerate Prisma client
bun run db:migrate # Create a migration
bun run db:reset   # Reset database
```

---

## 🔒 Security Notes

- **Admin access** is hard-restricted to the configured `ADMIN_EMAIL` via `src/lib/auth.ts`. The check happens client-side in `AdminGuard`. Non-admins see a 404 page (no admin UI is ever rendered). For full security, also enforce server-side via Firebase custom claims or Firestore rules.
- **Razorpay payment verification** must happen server-side (signature verification) — never trust client-side payment success.
- **Sanitize all user-generated HTML** in custom sections. `src/lib/format.ts` exports `sanitizeHtml()` for this.
- **Rate-limit** sensitive endpoints (login, register, coupon apply, checkout) — Vercel Edge Middleware or Upstash Ratelimit.
- **HTTPS only** in production (Vercel does this automatically).
- **CORS** — restrict API routes to your own domain in production.

---

## 🎨 Theme Customization

The theme is fully customizable from the admin panel (`/admin/theme`) without touching code:
- Primary color (default: deep plum `#6B2D5C`)
- Accent color (default: champagne gold `#B8956A`)
- Heading font (default: Playfair Display)
- Body font (default: Inter)
- Button radius, container width, section spacing
- Announcement bar background + text colors

For direct CSS edits, see `src/app/globals.css` — theme tokens are CSS variables defined in `:root` and `.dark`.

---

## 📦 What's Included

- ✅ 22+ storefront routes — all responsive, SEO-optimized, accessible
- ✅ 15 admin routes — full CRUD UI for catalog, orders, customers, content, theme
- ✅ Mock Firebase Auth + Firestore + Storage layer (swap-ready)
- ✅ Mock Razorpay payment flow (swap-ready)
- ✅ Cart, Wishlist, Coupons, Multi-buy offers, Gift notes, Pin code checker
- ✅ Order tracking with timeline UI
- ✅ Reviews with photos + verified badges
- ✅ Drag-and-drop homepage builder
- ✅ Theme customizer with live preview
- ✅ Exit-intent popup, back-to-top, recently viewed, instant search
- ✅ Toast notifications, skeleton loaders, beautiful empty states
- ✅ Premium brand styling (Playfair Display + Inter, deep plum + champagne gold)
- ✅ ESLint clean (0 errors, 0 warnings)
- ✅ Prisma schema + SQLite (local) / Firestore schema doc (production)

---

## 📝 License

Proprietary — © Aurora & Co. 2026. All rights reserved.

---

## 🙋 Support

- Email: <hello@aurora-co.in>
- Phone: +91 80000 00000
- Hours: Mon–Sat, 10 AM – 7 PM IST
