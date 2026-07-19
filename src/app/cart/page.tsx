"use client";

import Link from "next/link";
import { Minus, Plus, X, ShoppingBag, ArrowRight, Trash2, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { useCartStore, useCouponStore } from "@/lib/stores";
import { formatINR } from "@/lib/format";
import { useHydrated } from "@/lib/use-hydrated";
import { coupons } from "@/lib/data";
import { useState } from "react";
import { toast } from "sonner";

export default function CartPage() {
  const hydrated = useHydrated();
  const { items, updateQuantity, removeItem, subtotal } = useCartStore();
  const { code: appliedCoupon, discount, setCoupon, clear: clearCoupon } = useCouponStore();
  const [couponInput, setCouponInput] = useState("");

  const sub = hydrated ? subtotal() : 0;
  const shipping = sub >= 999 || sub === 0 ? 0 : 99;
  const tax = Math.round(sub * 0.03); // 3% GST mock
  const total = sub - discount + shipping + tax;

  const applyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    const code = couponInput.trim().toUpperCase();
    if (!code) return;
    const coupon = coupons.find((c) => c.code.toUpperCase() === code && c.isActive);
    if (!coupon) {
      toast.error("Invalid coupon code");
      return;
    }
    if (sub < coupon.minOrderValue) {
      toast.error(`Minimum order value is ₹${coupon.minOrderValue} for this coupon`);
      return;
    }
    let disc = 0;
    if (coupon.type === "percentage") {
      disc = Math.round((sub * coupon.value) / 100);
      if (coupon.maxDiscount && disc > coupon.maxDiscount) disc = coupon.maxDiscount;
    } else {
      disc = coupon.value;
    }
    setCoupon(coupon.code, disc);
    toast.success(`Coupon ${coupon.code} applied — you save ${formatINR(disc)}`);
    setCouponInput("");
  };

  if (hydrated && items.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-16 lg:py-24 text-center">
        <div className="w-24 h-24 mx-auto rounded-full bg-muted flex items-center justify-center mb-6">
          <ShoppingBag className="h-10 w-10 text-muted-foreground" />
        </div>
        <h1 className="font-serif text-3xl font-bold">Your Bag is Empty</h1>
        <p className="text-muted-foreground mt-2 max-w-md mx-auto">
          Looks like you haven't added anything yet. Let's fix that — explore our handcrafted pieces.
        </p>
        <Button asChild className="mt-6">
          <Link href="/collections">Start Shopping <ArrowRight className="h-4 w-4 ml-2" /></Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8 lg:py-12">
      <h1 className="font-serif text-3xl sm:text-4xl font-bold mb-1">Your Bag</h1>
      <p className="text-sm text-muted-foreground mb-8">
        {hydrated ? `${items.reduce((s, i) => s + i.quantity, 0)} items` : ""}
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Items */}
        <div className="lg:col-span-2 space-y-4">
          {!hydrated ? (
            <div className="space-y-4">
              {[1, 2].map((i) => (
                <div key={i} className="flex gap-4 shimmer h-32 rounded-lg" />
              ))}
            </div>
          ) : (
            items.map((item) => (
              <div
                key={`${item.productId}-${item.variantId ?? "_"}-${item.size ?? "_"}`}
                className="flex gap-4 border rounded-lg p-4"
              >
                <Link href={`/product/${item.snapshot.slug}`} className="shrink-0">
                  <div className="w-24 h-28 rounded-md overflow-hidden bg-muted">
                    { }
                    <img src={item.snapshot.image} alt={item.snapshot.name} className="w-full h-full object-cover" />
                  </div>
                </Link>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between gap-4">
                    <div>
                      <Link href={`/product/${item.snapshot.slug}`} className="font-medium hover:text-primary line-clamp-1">
                        {item.snapshot.name}
                      </Link>
                      {item.snapshot.variantLabel && (
                        <p className="text-xs text-muted-foreground mt-0.5">{item.snapshot.variantLabel}</p>
                      )}
                      {item.size && <p className="text-xs text-muted-foreground">Size: {item.size}</p>}
                    </div>
                    <button
                      onClick={() => removeItem(item.productId, item.variantId, item.size)}
                      className="text-muted-foreground hover:text-destructive p-1"
                      aria-label="Remove item"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="flex items-end justify-between mt-3">
                    <div className="flex items-center border rounded-md">
                      <button
                        onClick={() => updateQuantity(item.productId, item.variantId, item.size, item.quantity - 1)}
                        className="p-2 hover:bg-muted"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="px-3 text-sm font-medium min-w-[2ch] text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.productId, item.variantId, item.size, item.quantity + 1)}
                        className="p-2 hover:bg-muted"
                        aria-label="Increase quantity"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{formatINR(item.snapshot.price * item.quantity)}</p>
                      <p className="text-xs text-muted-foreground">{formatINR(item.snapshot.price)} each</p>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="border rounded-lg p-5 sticky top-32 space-y-4">
            <h2 className="font-semibold text-lg">Order Summary</h2>

            {/* Coupon */}
            <div>
              {appliedCoupon ? (
                <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-md p-3">
                  <div className="flex items-center gap-2">
                    <Tag className="h-4 w-4 text-green-700" />
                    <div>
                      <p className="text-sm font-medium text-green-800">{appliedCoupon}</p>
                      <p className="text-xs text-green-700">You save {formatINR(discount)}</p>
                    </div>
                  </div>
                  <button onClick={clearCoupon} className="text-green-700 hover:text-green-900">
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <form onSubmit={applyCoupon} className="flex gap-2">
                  <Input
                    type="text"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    placeholder="Coupon code"
                    className="flex-1"
                  />
                  <Button type="submit" variant="secondary" size="sm">Apply</Button>
                </form>
              )}
              <p className="text-xs text-muted-foreground mt-1">
                Try <button onClick={() => setCouponInput("AURORA15")} className="underline">AURORA15</button> for 15% off
              </p>
            </div>

            <Separator />

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium">{formatINR(sub)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-green-700">
                  <span>Discount</span>
                  <span>−{formatINR(discount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span className="font-medium">{shipping === 0 ? "FREE" : formatINR(shipping)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Taxes (GST 3%)</span>
                <span className="font-medium">{formatINR(tax)}</span>
              </div>
            </div>

            <Separator />

            <div className="flex justify-between font-semibold text-lg">
              <span>Total</span>
              <span>{formatINR(total)}</span>
            </div>

            <Button asChild className="w-full" size="lg">
              <Link href="/checkout">Proceed to Checkout <ArrowRight className="h-4 w-4 ml-2" /></Link>
            </Button>

            <div className="text-center text-xs text-muted-foreground">
              <p>🔒 Secure checkout via Razorpay</p>
              <p className="mt-1">Free shipping on prepaid orders above ₹999</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
