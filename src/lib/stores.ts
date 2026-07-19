"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { CartItem, ID, Product, ProductVariant } from "@/lib/types";

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  addItem: (product: Product, variant: ProductVariant | undefined, size: string | undefined, quantity: number) => void;
  removeItem: (productId: ID, variantId: ID | undefined, size: string | undefined) => void;
  updateQuantity: (productId: ID, variantId: ID | undefined, size: string | undefined, quantity: number) => void;
  clear: () => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  // selectors
  totalItems: () => number;
  subtotal: () => number;
}

function itemKey(productId: ID, variantId: ID | undefined, size: string | undefined) {
  return `${productId}__${variantId ?? "_"}__${size ?? "_"}`;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      addItem: (product, variant, size, quantity) => {
        const items = [...get().items];
        const variantLabel = variant ? `${variant.name}: ${variant.value}` : undefined;
        const unitPrice = product.basePrice + (variant?.priceDelta ?? 0);
        const key = itemKey(product.id, variant?.id, size);
        const idx = items.findIndex((i) => itemKey(i.productId, i.variantId, i.size) === key);
        if (idx >= 0) {
          items[idx] = { ...items[idx]!, quantity: items[idx]!.quantity + quantity };
        } else {
          items.push({
            productId: product.id,
            variantId: variant?.id,
            size,
            quantity,
            snapshot: {
              name: product.name,
              slug: product.slug,
              image: product.images[0]?.url ?? "",
              price: unitPrice,
              variantLabel,
            },
          });
        }
        set({ items, isOpen: true });
      },
      removeItem: (productId, variantId, size) => {
        const items = get().items.filter((i) => itemKey(i.productId, i.variantId, i.size) !== itemKey(productId, variantId, size));
        set({ items });
      },
      updateQuantity: (productId, variantId, size, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId, variantId, size);
          return;
        }
        const items = get().items.map((i) =>
          itemKey(i.productId, i.variantId, i.size) === itemKey(productId, variantId, size)
            ? { ...i, quantity }
            : i
        );
        set({ items });
      },
      clear: () => set({ items: [] }),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set({ isOpen: !get().isOpen }),
      totalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
      subtotal: () => get().items.reduce((sum, i) => sum + i.snapshot.price * i.quantity, 0),
    }),
    {
      name: "aurora-cart",
      storage: createJSONStorage(() => (typeof window !== "undefined" ? localStorage : (undefined as unknown as Storage))),
      partialize: (s) => ({ items: s.items }) as CartState,
    }
  )
);

// ---------------------------------------------------------------------------
// Wishlist
// ---------------------------------------------------------------------------
interface WishlistState {
  ids: ID[];
  isOpen: boolean;
  toggle: (id: ID) => void;
  add: (id: ID) => void;
  remove: (id: ID) => void;
  has: (id: ID) => boolean;
  clear: () => void;
  openDrawer: () => void;
  closeDrawer: () => void;
  setIds: (ids: ID[]) => void;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      ids: [],
      isOpen: false,
      toggle: (id) => {
        const ids = get().ids.includes(id) ? get().ids.filter((x) => x !== id) : [...get().ids, id];
        set({ ids });
      },
      add: (id) => set({ ids: Array.from(new Set([...get().ids, id])) }),
      remove: (id) => set({ ids: get().ids.filter((x) => x !== id) }),
      has: (id) => get().ids.includes(id),
      clear: () => set({ ids: [] }),
      openDrawer: () => set({ isOpen: true }),
      closeDrawer: () => set({ isOpen: false }),
      setIds: (ids) => set({ ids }),
    }),
    {
      name: "aurora-wishlist",
      storage: createJSONStorage(() => (typeof window !== "undefined" ? localStorage : (undefined as unknown as Storage))),
      partialize: (s) => ({ ids: s.ids }) as WishlistState,
    }
  )
);

// ---------------------------------------------------------------------------
// Recently viewed
// ---------------------------------------------------------------------------
interface RecentlyViewedState {
  ids: ID[];
  add: (id: ID) => void;
  clear: () => void;
}

export const useRecentlyViewedStore = create<RecentlyViewedState>()(
  persist(
    (set, get) => ({
      ids: [],
      add: (id) => {
        const ids = [id, ...get().ids.filter((x) => x !== id)].slice(0, 12);
        set({ ids });
      },
      clear: () => set({ ids: [] }),
    }),
    {
      name: "aurora-recently-viewed",
      storage: createJSONStorage(() => (typeof window !== "undefined" ? localStorage : (undefined as unknown as Storage))),
    }
  )
);

// ---------------------------------------------------------------------------
// Recently searched
// ---------------------------------------------------------------------------
interface RecentlySearchedState {
  terms: string[];
  add: (term: string) => void;
  clear: () => void;
}

export const useRecentlySearchedStore = create<RecentlySearchedState>()(
  persist(
    (set, get) => ({
      terms: [],
      add: (term) => {
        const t = term.trim();
        if (!t) return;
        const terms = [t, ...get().terms.filter((x) => x.toLowerCase() !== t.toLowerCase())].slice(0, 8);
        set({ terms });
      },
      clear: () => set({ terms: [] }),
    }),
    {
      name: "aurora-recently-searched",
      storage: createJSONStorage(() => (typeof window !== "undefined" ? localStorage : (undefined as unknown as Storage))),
    }
  )
);

// ---------------------------------------------------------------------------
// UI state — search drawer, mobile menu, etc.
// ---------------------------------------------------------------------------
interface UIState {
  searchOpen: boolean;
  mobileMenuOpen: boolean;
  exitIntentShown: boolean;
  setSearchOpen: (v: boolean) => void;
  setMobileMenuOpen: (v: boolean) => void;
  setExitIntentShown: (v: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
  searchOpen: false,
  mobileMenuOpen: false,
  exitIntentShown: false,
  setSearchOpen: (v) => set({ searchOpen: v }),
  setMobileMenuOpen: (v) => set({ mobileMenuOpen: v }),
  setExitIntentShown: (v) => set({ exitIntentShown: v }),
}));

// ---------------------------------------------------------------------------
// Applied coupon
// ---------------------------------------------------------------------------
interface CouponState {
  code: string | null;
  discount: number;
  setCoupon: (code: string | null, discount: number) => void;
  clear: () => void;
}

export const useCouponStore = create<CouponState>()(
  persist(
    (set) => ({
      code: null,
      discount: 0,
      setCoupon: (code, discount) => set({ code, discount }),
      clear: () => set({ code: null, discount: 0 }),
    }),
    {
      name: "aurora-coupon",
      storage: createJSONStorage(() => (typeof window !== "undefined" ? localStorage : (undefined as unknown as Storage))),
    }
  )
);
