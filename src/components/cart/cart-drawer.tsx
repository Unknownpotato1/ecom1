"use client";

import Link from "next/link";
import { Minus, Plus, X, ShoppingBag, ArrowRight, Trash2 } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useCartStore } from "@/lib/stores";
import { formatINR } from "@/lib/format";
import { useHydrated } from "@/lib/use-hydrated";

export function CartDrawer() {
  // Use individual primitive selectors — inline object selectors return a new
  // object reference every render and cause an infinite update loop in React 19
  // + Zustand v5 because useSyncExternalStore sees the snapshot as "always changing".
  const isOpen = useCartStore((s) => s.isOpen);
  const items = useCartStore((s) => s.items);
  const closeCart = useCartStore((s) => s.closeCart);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const subtotal = useCartStore((s) => s.subtotal);
  const hydrated = useHydrated();
  const total = hydrated ? subtotal() : 0;
  const count = hydrated ? items.reduce((s, i) => s + i.quantity, 0) : 0;

  return (
    <Sheet open={isOpen} onOpenChange={(o) => !o && closeCart()}>
      <SheetContent className="w-full sm:max-w-md p-0 flex flex-col">
        <SheetHeader className="px-6 py-4 border-b flex-row items-center justify-between space-y-0">
          <div>
            <SheetTitle className="font-serif text-xl flex items-center gap-2">
              <ShoppingBag className="h-5 w-5" /> Your Bag
            </SheetTitle>
            <SheetDescription className="text-xs">
              {count} {count === 1 ? "item" : "items"}
            </SheetDescription>
          </div>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center px-6 text-center gap-4">
            <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center">
              <ShoppingBag className="h-8 w-8 text-muted-foreground" />
            </div>
            <div>
              <p className="font-medium">Your bag is empty</p>
              <p className="text-sm text-muted-foreground mt-1">Discover pieces you'll love.</p>
            </div>
            <Button asChild onClick={closeCart}>
              <Link href="/collections">Start Shopping</Link>
            </Button>
          </div>
        ) : (
          <>
            <ScrollArea className="flex-1 px-6">
              <div className="space-y-5 py-6">
                {items.map((item) => (
                  <div
                    key={`${item.productId}-${item.variantId ?? "_"}-${item.size ?? "_"}`}
                    className="flex gap-4"
                  >
                    <Link
                      href={`/product/${item.snapshot.slug}`}
                      onClick={closeCart}
                      className="shrink-0"
                    >
                      <div className="w-20 h-24 rounded-md overflow-hidden bg-muted">
                        { }
                        <img
                          src={item.snapshot.image}
                          alt={item.snapshot.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </Link>
                    <div className="flex-1 min-w-0">
                      <Link
                        href={`/product/${item.snapshot.slug}`}
                        onClick={closeCart}
                        className="text-sm font-medium hover:text-primary line-clamp-1"
                      >
                        {item.snapshot.name}
                      </Link>
                      {item.snapshot.variantLabel && (
                        <p className="text-xs text-muted-foreground mt-0.5">{item.snapshot.variantLabel}</p>
                      )}
                      {item.size && (
                        <p className="text-xs text-muted-foreground">Size: {item.size}</p>
                      )}
                      <p className="text-sm font-semibold mt-1">{formatINR(item.snapshot.price)}</p>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center border rounded-md">
                          <button
                            onClick={() => updateQuantity(item.productId, item.variantId, item.size, item.quantity - 1)}
                            className="p-1.5 hover:bg-muted transition-colors"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="px-3 text-sm font-medium min-w-[2ch] text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.productId, item.variantId, item.size, item.quantity + 1)}
                            className="p-1.5 hover:bg-muted transition-colors"
                            aria-label="Increase quantity"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                        <button
                          onClick={() => removeItem(item.productId, item.variantId, item.size)}
                          className="text-muted-foreground hover:text-destructive transition-colors p-1"
                          aria-label="Remove item"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            <div className="border-t px-6 py-4 space-y-4 bg-card/50">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-semibold">{formatINR(total)}</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Shipping & taxes calculated at checkout.
                </p>
              </div>
              <Separator />
              <div className="space-y-2">
                <Button asChild className="w-full" size="lg" onClick={closeCart}>
                  <Link href="/checkout">
                    Checkout <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full" onClick={closeCart}>
                  <Link href="/cart">View Bag</Link>
                </Button>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
