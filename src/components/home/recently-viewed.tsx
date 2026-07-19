"use client";

import Link from "next/link";
import { useRecentlyViewedStore } from "@/lib/stores";
import { products } from "@/lib/data";
import { ProductCard } from "@/components/product/product-card";
import { useHydrated } from "@/lib/use-hydrated";
import { ChevronRight } from "lucide-react";

export function RecentlyViewed() {
  const hydrated = useHydrated();
  const ids = useRecentlyViewedStore((s) => s.ids);

  if (!hydrated || ids.length === 0) return null;
  const items = ids.slice(0, 8).map((id) => products.find((p) => p.id === id)).filter(Boolean) as typeof products;
  if (items.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 py-12 lg:py-16">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-serif text-2xl sm:text-3xl font-bold">Recently Viewed</h2>
        <Link href="/collections" className="text-sm text-primary hover:underline flex items-center">
          View All <ChevronRight className="h-4 w-4" />
        </Link>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
        {items.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  );
}
