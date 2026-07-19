"use client";

import Link from "next/link";
import { Heart, X, ShoppingBag } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useWishlistStore } from "@/lib/stores";
import { products } from "@/lib/data";
import { formatINR, discountPercent } from "@/lib/format";
import { useHydrated } from "@/lib/use-hydrated";

export function WishlistDrawer() {
  const { isOpen, closeDrawer, ids } = useWishlistStore();
  const hydrated = useHydrated();
  const items = hydrated ? ids.map((id) => products.find((p) => p.id === id)).filter(Boolean) : [];

  return (
    <Sheet open={isOpen} onOpenChange={(o) => !o && closeDrawer()}>
      <SheetContent className="w-full sm:max-w-md p-0 flex flex-col">
        <SheetHeader className="px-6 py-4 border-b">
          <SheetTitle className="font-serif text-xl flex items-center gap-2">
            <Heart className="h-5 w-5" /> Wishlist
          </SheetTitle>
          <SheetDescription className="text-xs">
            {items.length} saved {items.length === 1 ? "item" : "items"}
          </SheetDescription>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center px-6 text-center gap-4">
            <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center">
              <Heart className="h-8 w-8 text-muted-foreground" />
            </div>
            <div>
              <p className="font-medium">No favorites yet</p>
              <p className="text-sm text-muted-foreground mt-1">Tap the heart on any product to save it here.</p>
            </div>
            <Button asChild onClick={closeDrawer}>
              <Link href="/collections">Browse Products</Link>
            </Button>
          </div>
        ) : (
          <ScrollArea className="flex-1">
            <div className="space-y-4 p-6">
              {items.map((p) => {
                if (!p) return null;
                const discount = discountPercent(p.basePrice, p.compareAtPrice);
                return (
                  <Link
                    key={p.id}
                    href={`/product/${p.slug}`}
                    onClick={closeDrawer}
                    className="flex gap-4 group"
                  >
                    <div className="w-20 h-24 rounded-md overflow-hidden bg-muted shrink-0">
                      { }
                      <img
                        src={p.images[0]?.url}
                        alt={p.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium line-clamp-1">{p.name}</p>
                      <p className="text-xs text-muted-foreground line-clamp-1">{p.subtitle}</p>
                      <div className="flex items-baseline gap-2 mt-1">
                        <span className="text-sm font-semibold">{formatINR(p.basePrice)}</span>
                        {p.compareAtPrice && (
                          <span className="text-xs text-muted-foreground line-through">{formatINR(p.compareAtPrice)}</span>
                        )}
                        {discount > 0 && <span className="text-xs text-destructive">-{discount}%</span>}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </ScrollArea>
        )}
      </SheetContent>
    </Sheet>
  );
}
