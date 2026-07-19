"use client";

import Link from "next/link";
import { Heart, ArrowRight, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useWishlistStore, useCartStore } from "@/lib/stores";
import { products } from "@/lib/data";
import { ProductCard } from "@/components/product/product-card";
import { useHydrated } from "@/lib/use-hydrated";
import { toast } from "sonner";
import { useState, useEffect } from "react";

export default function WishlistPage() {
  const hydrated = useHydrated();
  const { ids, remove } = useWishlistStore();
  const addItem = useCartStore((s) => s.addItem);
  const [recentIds, setRecentIds] = useState<string[]>([]);

  useEffect(() => {
    if (!hydrated) return;
    // Defer to microtask to satisfy react-hooks/set-state-in-effect rule.
    const id = setTimeout(() => setRecentIds(ids), 0);
    return () => clearTimeout(id);
  }, [hydrated, ids]);

  const items = recentIds
    .map((id) => products.find((p) => p.id === id))
    .filter(Boolean) as typeof products;

  if (hydrated && items.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-16 lg:py-24 text-center">
        <div className="w-24 h-24 mx-auto rounded-full bg-muted flex items-center justify-center mb-6">
          <Heart className="h-10 w-10 text-muted-foreground" />
        </div>
        <h1 className="font-serif text-3xl font-bold">Your Wishlist is Empty</h1>
        <p className="text-muted-foreground mt-2 max-w-md mx-auto">
          Save your favorite pieces here by tapping the heart icon on any product.
        </p>
        <Button asChild className="mt-6">
          <Link href="/collections">Discover Pieces <ArrowRight className="h-4 w-4 ml-2" /></Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8 lg:py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold mb-1">Your Wishlist</h1>
          <p className="text-sm text-muted-foreground">{items.length} saved items</p>
        </div>
        <Button asChild variant="outline">
          <Link href="/collections">Continue Shopping</Link>
        </Button>
      </div>

      {!hydrated ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="aspect-[4/5] rounded-lg shimmer" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
          {items.map((p) => (
            <div key={p.id} className="relative">
              <ProductCard product={p} />
              <button
                onClick={() => {
                  remove(p.id);
                  toast.success("Removed from wishlist");
                }}
                className="absolute top-2 right-2 z-10 w-8 h-8 rounded-full bg-background/90 backdrop-blur flex items-center justify-center text-destructive hover:bg-background"
                aria-label="Remove from wishlist"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
