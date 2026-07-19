"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useRecentlyViewedStore } from "@/lib/stores";
import { products } from "@/lib/data";

// Syncs recently-viewed products to localStorage as the user visits product pages.
export function RecentlyViewedSync() {
  const pathname = usePathname();
  const add = useRecentlyViewedStore((s) => s.add);

  useEffect(() => {
    if (!pathname) return;
    const m = pathname.match(/^\/product\/(.+)$/);
    if (!m) return;
    const slug = decodeURIComponent(m[1]!);
    const product = products.find((p) => p.slug === slug);
    if (product) add(product.id);
  }, [pathname, add]);

  return null;
}
