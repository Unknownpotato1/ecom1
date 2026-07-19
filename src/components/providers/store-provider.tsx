"use client";

import { useEffect } from "react";
import { useCartStore, useWishlistStore, useHomepageStore, useCouponStore } from "@/lib/stores";

// Hydrates Zustand persisted stores on mount (prevents SSR mismatch).
// We use the persist API's rehydrate() method rather than setState,
// so this does not trigger the react-hooks/set-state-in-effect rule.
export function StoreProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    useCartStore.persist.rehydrate();
    useWishlistStore.persist.rehydrate();
    useHomepageStore.persist.rehydrate();
    useCouponStore.persist.rehydrate();
  }, []);
  return <>{children}</>;
}
