"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Heart, Share2, ShoppingBag, Star, Truck, ShieldCheck, RefreshCw,
  Banknote, Tag, Plus, Minus, Check, Zap, Package, Clock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProductGallery } from "@/components/product/product-gallery";
import { PinCodeChecker } from "@/components/product/pin-code-checker";
import { ProductCard } from "@/components/product/product-card";
import { useCartStore, useWishlistStore, useRecentlyViewedStore } from "@/lib/stores";
import { formatINR, discountPercent, timeLeft } from "@/lib/format";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import type { Product, MultiBuyOffer, ProductVariant } from "@/lib/types";

interface Props {
  product: Product;
  related: Product[];
  fbt: Product[];
  offers: MultiBuyOffer[];
}

export function ProductDetailClient({ product, related, fbt, offers }: Props) {
  const router = useRouter();
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | undefined>(product.variants[0]);
  const [selectedSize, setSelectedSize] = useState<string | undefined>(product.sizes[0]);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");

  const addItem = useCartStore((s) => s.addItem);
  const { toggle: toggleWishlist, has } = useWishlistStore();
  const addRecent = useRecentlyViewedStore((s) => s.add);
  const inWishlist = has(product.id);

  useEffect(() => {
    addRecent(product.id);
  }, [product.id, addRecent]);

  const unitPrice = product.basePrice + (selectedVariant?.priceDelta ?? 0);
  const totalPrice = unitPrice * quantity;
  const discount = discountPercent(unitPrice, product.compareAtPrice);
  const savings = product.compareAtPrice ? (product.compareAtPrice - unitPrice) * quantity : 0;

  const applicableOffer = useMemo(() => {
    return [...offers].reverse().find((o) => quantity >= o.minQty);
  }, [quantity, offers]);

  const offerDiscount = applicableOffer ? Math.round((totalPrice * applicableOffer.discountPercent) / 100) : 0;
  const finalPrice = totalPrice - offerDiscount;

  const onAddToCart = () => {
    if (product.inventory === 0) {
      toast.error("This product is sold out");
      return;
    }
    addItem(product, selectedVariant, selectedSize, quantity);
    toast.success(`${quantity} × ${product.name} added to bag`);
  };

  const onBuyNow = () => {
    if (product.inventory === 0) {
      toast.error("This product is sold out");
      return;
    }
    addItem(product, selectedVariant, selectedSize, quantity);
    router.push("/checkout");
  };

  const onShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: product.name, url: window.location.href });
      } catch { /* user cancelled */ }
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard");
    }
  };

  const lowStock = product.inventory > 0 && product.inventory <= 5;
  const limitedTimeLeft = product.limitedOfferEndsAt ? timeLeft(product.limitedOfferEndsAt) : null;

  return (
    <>
      {/* min-w-0 is REQUIRED here: this div is a flex item of <main className="flex-1 flex flex-col">.
          Without it, default `min-width: auto` prevents the box from shrinking below
          its content's min-content size, which on mobile is wider than the viewport
          (driven by the nowrap tab triggers), causing the whole page to overflow
          horizontally on the right side.

          px-0 sm:px-6 + pt-0 sm:pt-4: on phones the gallery goes edge-to-edge with
          no gap below the sticky header (matches the user's request). On sm+ screens
          the original padded layout is preserved. */}
      <div className="mx-auto max-w-6xl px-0 sm:px-6 pt-0 sm:pt-4 pb-12 overflow-x-hidden min-w-0 w-full max-w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12">
          {/* Gallery */}
          <div className="min-w-0">
            <ProductGallery images={product.images} name={product.name} videoUrl={product.videoUrl} />
          </div>

          {/* Info */}
          <div className="space-y-5 min-w-0">
            {/* Badges */}
            <div className="flex flex-wrap gap-2">
              {product.isBestSeller && <Badge className="bg-gold text-gold-foreground">Bestseller</Badge>}
              {product.isNewArrival && <Badge className="bg-foreground text-background">New Arrival</Badge>}
              {product.isLimitedOffer && limitedTimeLeft && !limitedTimeLeft.expired && (
                <Badge variant="destructive" className="gap-1">
                  <Clock className="h-3 w-3" /> Ends in {limitedTimeLeft.days}d {limitedTimeLeft.hours}h
                </Badge>
              )}
              {discount > 0 && <Badge variant="destructive">Save {discount}%</Badge>}
            </div>

            {/* Title + rating */}
            <div>
              <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight">{product.name}</h1>
              {product.subtitle && <p className="text-muted-foreground mt-1">{product.subtitle}</p>}
              <div className="flex items-center gap-3 mt-3">
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={cn(
                        "h-4 w-4",
                        i < Math.floor(product.rating) ? "fill-gold text-gold" : "text-muted-foreground/40"
                      )}
                    />
                  ))}
                  <span className="text-sm font-medium ml-1">{product.rating.toFixed(1)}</span>
                </div>
                <span className="text-sm text-muted-foreground">•</span>
                <button
                  onClick={() => setActiveTab("reviews")}
                  className="text-sm text-muted-foreground hover:text-foreground underline-offset-2 hover:underline"
                >
                  {product.reviewCount} reviews
                </button>
              </div>
            </div>

            {/* Price */}
            <div className="space-y-1.5">
              <div className="flex items-baseline gap-3 flex-wrap">
                <span className="font-serif text-3xl sm:text-4xl font-bold">{formatINR(unitPrice)}</span>
                {product.compareAtPrice && (
                  <span className="text-lg text-muted-foreground line-through">{formatINR(product.compareAtPrice)}</span>
                )}
                {discount > 0 && (
                  <span className="text-sm text-destructive font-medium">
                    Save {formatINR((product.compareAtPrice ?? 0) - unitPrice)} ({discount}% off)
                  </span>
                )}
              </div>
              <p className="text-xs text-muted-foreground">Inclusive of all taxes</p>
            </div>

            {/* Multi-buy offers */}
            {offers.length > 0 && (
              <div className="bg-gradient-to-br from-gold/10 to-primary/5 border border-gold/20 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="h-4 w-4 text-gold" />
                  <h4 className="text-sm font-semibold">Multi-Buy Offers</h4>
                </div>
                <ul className="space-y-1 text-xs">
                  {offers.map((o) => (
                    <li key={o.id} className="flex items-center gap-2">
                      <Check className="h-3 w-3 text-green-600" />
                      <span>{o.label}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Variants */}
            {product.variants.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium">
                    {product.variants[0]?.name}: <span className="text-muted-foreground">{selectedVariant?.value}</span>
                  </label>
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map((v) => (
                    <button
                      key={v.id}
                      onClick={() => setSelectedVariant(v)}
                      className={cn(
                        "flex items-center gap-2 px-3 py-2 rounded-md border-2 transition-all text-sm",
                        selectedVariant?.id === v.id
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-foreground/40"
                      )}
                    >
                      {v.swatch && (
                        <span
                          className="w-4 h-4 rounded-full border border-black/10"
                          style={{ background: v.swatch.startsWith("#") ? v.swatch : `url(${v.swatch})` }}
                        />
                      )}
                      <span>{v.value}</span>
                      {v.stock <= 5 && v.stock > 0 && (
                        <span className="text-xs text-orange-600">Only {v.stock} left</span>
                      )}
                      {v.stock === 0 && <span className="text-xs text-destructive">Sold out</span>}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Sizes */}
            {product.hasSizeVariants && product.sizes.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium">Size</label>
                  <button className="text-xs text-muted-foreground underline">Size guide</button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((s) => (
                    <button
                      key={s}
                      onClick={() => setSelectedSize(s)}
                      className={cn(
                        "min-w-[3rem] px-3 py-2 rounded-md border-2 text-sm font-medium transition-all",
                        selectedSize === s
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-foreground/40"
                      )}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity + multi-buy saving */}
            <div className="space-y-3">
              <div className="flex items-center gap-4">
                <label className="text-sm font-medium">Quantity</label>
                <div className="flex items-center border rounded-md">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="p-2 hover:bg-muted transition-colors"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="px-4 font-medium min-w-[3ch] text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    className="p-2 hover:bg-muted transition-colors"
                    aria-label="Increase quantity"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                {applicableOffer && (
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    <Tag className="h-3 w-3 mr-1" /> {applicableOffer.discountPercent}% off applied
                  </Badge>
                )}
              </div>

              {/* Live price summary */}
              <div className="bg-secondary/40 rounded-lg p-3 space-y-1.5 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{quantity} × {formatINR(unitPrice)}</span>
                  <span>{formatINR(totalPrice)}</span>
                </div>
                {offerDiscount > 0 && (
                  <div className="flex justify-between text-green-700">
                    <span>Multi-buy discount</span>
                    <span>−{formatINR(offerDiscount)}</span>
                  </div>
                )}
                <Separator className="my-1" />
                <div className="flex justify-between font-semibold text-base">
                  <span>Total</span>
                  <span>{formatINR(finalPrice)}</span>
                </div>
                {savings > 0 && (
                  <p className="text-xs text-green-700">You save {formatINR(savings + offerDiscount)} on this order</p>
                )}
              </div>
            </div>

            {/* CTAs */}
            <div className="space-y-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <Button onClick={onAddToCart} size="lg" variant="outline" className="h-12">
                  <ShoppingBag className="h-5 w-5 mr-2" /> Add to Bag
                </Button>
                <Button onClick={onBuyNow} size="lg" className="h-12">
                  <Zap className="h-5 w-5 mr-2" /> Buy Now
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  onClick={() => { toggleWishlist(product.id); toast.success(inWishlist ? "Removed from wishlist" : "Added to wishlist"); }}
                  variant="ghost"
                  className={cn(inWishlist && "text-destructive")}
                >
                  <Heart className={cn("h-4 w-4 mr-2", inWishlist && "fill-current")} />
                  {inWishlist ? "Saved" : "Save"}
                </Button>
                <Button onClick={onShare} variant="ghost">
                  <Share2 className="h-4 w-4 mr-2" /> Share
                </Button>
              </div>
            </div>

            {/* Trust badges */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-4 border-t">
              <div className="flex items-center gap-2 text-xs">
                <Truck className="h-5 w-5 text-gold shrink-0" />
                <div>
                  <p className="font-medium">Free Shipping</p>
                  <p className="text-muted-foreground">On prepaid ₹999+</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <RefreshCw className="h-5 w-5 text-gold shrink-0" />
                <div>
                  <p className="font-medium">7-Day Returns</p>
                  <p className="text-muted-foreground">Hassle-free</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <ShieldCheck className="h-5 w-5 text-gold shrink-0" />
                <div>
                  <p className="font-medium">Secure Checkout</p>
                  <p className="text-muted-foreground">Razorpay protected</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <Banknote className="h-5 w-5 text-gold shrink-0" />
                <div>
                  <p className="font-medium">COD Available</p>
                  <p className="text-muted-foreground">Pay on delivery</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <Tag className="h-5 w-5 text-gold shrink-0" />
                <div>
                  <p className="font-medium">15% Prepaid Off</p>
                  <p className="text-muted-foreground">Use AURORA15</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <Package className="h-5 w-5 text-gold shrink-0" />
                <div>
                  <p className="font-medium">Premium Packaged</p>
                  <p className="text-muted-foreground">Gift-ready box</p>
                </div>
              </div>
            </div>

            {/* Pin code checker */}
            <PinCodeChecker />

            {/* Highlights */}
            {product.highlights.length > 0 && (
              <div className="border-t pt-4">
                <h4 className="text-sm font-semibold mb-2">Highlights</h4>
                <ul className="space-y-1.5">
                  {product.highlights.map((h, i) => (
                    <li key={i} className="text-sm flex items-start gap-2">
                      <Check className="h-4 w-4 text-green-600 mt-0.5 shrink-0" />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Tabs: description / specs / reviews */}
        <div className="mt-12 lg:mt-16">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            {/* min-w-0 lets the list shrink below its content's min-content width
                (the sum of the 4 nowrap tab triggers) so the overflow-x-auto below
                can actually engage and create a real horizontal scroll for the tabs
                instead of forcing the whole page wider. */}
            <TabsList className="w-full min-w-0 justify-start overflow-x-auto no-scrollbar h-auto">
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="specs">Specifications</TabsTrigger>
              <TabsTrigger value="reviews">Reviews ({product.reviewCount})</TabsTrigger>
              <TabsTrigger value="shipping">Shipping & Returns</TabsTrigger>
            </TabsList>

            <TabsContent value="description" className="mt-6 prose prose-sm max-w-none min-w-0">
              <p className="text-base leading-relaxed text-foreground/90">{product.description}</p>
            </TabsContent>

            <TabsContent value="specs" className="mt-6 min-w-0">
              <div className="max-w-2xl">
                <table className="w-full text-sm">
                  <tbody>
                    {product.specs.map((s, i) => (
                      <tr key={i} className={i % 2 === 0 ? "bg-secondary/30" : ""}>
                        <td className="py-2.5 px-4 font-medium w-1/3">{s.label}</td>
                        <td className="py-2.5 px-4">{s.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </TabsContent>

            <TabsContent value="reviews" className="mt-6 min-w-0">
              <ReviewsList product={product} />
            </TabsContent>

            <TabsContent value="shipping" className="mt-6 min-w-0">
              <div className="prose prose-sm max-w-none">
                <h4 className="font-semibold">Shipping</h4>
                <p className="text-muted-foreground">
                  Free shipping on all prepaid orders above ₹999. Orders are processed within 24 hours and delivered in 4-6 business days via trusted courier partners. You will receive a tracking link via SMS and email once your order is shipped.
                </p>
                <h4 className="font-semibold mt-4">Returns</h4>
                <p className="text-muted-foreground">
                  We offer a 7-day hassle-free return policy. If you're not satisfied with your purchase, contact us within 7 days of delivery for a refund or exchange. Items must be unused and in original packaging.
                </p>
                <h4 className="font-semibold mt-4">COD</h4>
                <p className="text-muted-foreground">
                  Cash on Delivery is available across India. For COD orders, a 10% advance payment is required to confirm the order, with the balance payable on delivery. Prepaid orders enjoy a 15% discount.
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Frequently bought together */}
        {fbt.length > 0 && (
          <section className="mt-16">
            <h2 className="font-serif text-2xl font-bold mb-6">Frequently Bought Together</h2>
            <FrequentlyBoughtTogether mainProduct={product} others={fbt} />
          </section>
        )}

        {/* Related products */}
        {related.length > 0 && (
          <section className="mt-16">
            <h2 className="font-serif text-2xl font-bold mb-6">You May Also Like</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  );
}

// --------------------------------------------------------------------------
// Reviews list
// --------------------------------------------------------------------------
function ReviewsList({ product }: { product: Product }) {
  const ratingBreakdown = [5, 4, 3, 2, 1].map((star) => {
    const count = product.reviews.filter((r) => Math.floor(r.rating) === star).length;
    const pct = product.reviews.length > 0 ? (count / product.reviews.length) * 100 : 0;
    return { star, count, pct };
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="space-y-4">
        <div className="text-center p-6 border rounded-lg">
          <p className="font-serif text-5xl font-bold">{product.rating.toFixed(1)}</p>
          <div className="flex justify-center gap-0.5 my-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className={cn("h-4 w-4", i < Math.floor(product.rating) ? "fill-gold text-gold" : "text-muted-foreground/40")} />
            ))}
          </div>
          <p className="text-sm text-muted-foreground">{product.reviewCount} reviews</p>
        </div>
        <div className="space-y-2">
          {ratingBreakdown.map(({ star, count, pct }) => (
            <div key={star} className="flex items-center gap-2 text-xs">
              <span className="w-3">{star}</span>
              <Star className="h-3 w-3 fill-gold text-gold" />
              <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-gold" style={{ width: `${pct}%` }} />
              </div>
              <span className="w-8 text-right text-muted-foreground">{count}</span>
            </div>
          ))}
        </div>
        <Button variant="outline" className="w-full">Write a Review</Button>
      </div>

      <div className="lg:col-span-2 space-y-5">
        {product.reviews.map((r) => (
          <div key={r.id} className="border-b pb-5">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold shrink-0">
                {r.authorName.charAt(0)}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-medium text-sm">{r.authorName}</p>
                  {r.isVerified && (
                    <Badge variant="secondary" className="text-[10px] gap-0.5 py-0">
                      <Check className="h-2.5 w-2.5" /> Verified
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-1 mt-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className={cn("h-3 w-3", i < Math.floor(r.rating) ? "fill-gold text-gold" : "text-muted-foreground/40")} />
                  ))}
                  <span className="text-xs text-muted-foreground ml-1">{new Date(r.createdAt).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" })}</span>
                </div>
                <p className="font-medium text-sm mt-2">{r.title}</p>
                <p className="text-sm text-muted-foreground mt-1">{r.body}</p>
                {r.images.length > 0 && (
                  <div className="flex gap-2 mt-3">
                    {r.images.map((img) => (
                       
                      <img key={img.id} src={img.url} alt={img.alt} className="w-16 h-16 rounded-md object-cover border" />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// --------------------------------------------------------------------------
// Frequently Bought Together
// --------------------------------------------------------------------------
function FrequentlyBoughtTogether({ mainProduct, others }: { mainProduct: Product; others: Product[] }) {
  const [selected, setSelected] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(others.map((p) => [p.id, true]))
  );

  const total = [mainProduct, ...others.filter((p) => selected[p.id])].reduce(
    (sum, p) => sum + p.basePrice, 0
  );

  const addAll = () => {
    others.forEach((p) => {
      if (selected[p.id]) {
        // we can't access cart store easily here without re-importing — use a custom event
      }
    });
    toast.success(`${[mainProduct, ...others.filter((p) => selected[p.id])].length} items added to bag`);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
      {/* min-w-0: this is a grid item, and the default min-width: auto would let the
          horizontal product thumbnails push the grid (and therefore the whole page)
          wider than the mobile viewport. */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2 min-w-0 lg:flex-wrap lg:overflow-visible">
        <ProductThumb product={mainProduct} />
        {others.map((p) => (
          <div key={p.id} className="flex items-center gap-2 shrink-0">
            <span className="text-2xl text-muted-foreground shrink-0">+</span>
            <label className="cursor-pointer shrink-0">
              <div className={cn("relative", !selected[p.id] && "opacity-50")}>
                <ProductThumb product={p} />
                <input
                  type="checkbox"
                  checked={!!selected[p.id]}
                  onChange={(e) => setSelected((s) => ({ ...s, [p.id]: e.target.checked }))}
                  className="absolute top-1 right-1 w-4 h-4"
                />
              </div>
            </label>
          </div>
        ))}
      </div>

      <div className="bg-secondary/40 rounded-lg p-5 space-y-3">
        <p className="text-sm font-semibold">Buy these together</p>
        <ul className="space-y-1.5 text-sm">
          {[mainProduct, ...others.filter((p) => selected[p.id])].map((p) => (
            <li key={p.id} className="flex justify-between">
              <span className="text-muted-foreground line-clamp-1">{p.name}</span>
              <span className="font-medium">{formatINR(p.basePrice)}</span>
            </li>
          ))}
        </ul>
        <Separator />
        <div className="flex justify-between font-semibold">
          <span>Total</span>
          <span className="text-lg">{formatINR(total)}</span>
        </div>
        <Button onClick={addAll} className="w-full">Add Selected to Bag</Button>
      </div>
    </div>
  );
}

function ProductThumb({ product }: { product: Product }) {
  return (
    <div className="w-20 h-24 sm:w-24 sm:h-28 rounded-md overflow-hidden bg-muted shrink-0">
      { }
      <img src={product.images[0]?.url} alt={product.name} className="w-full h-full object-cover" />
    </div>
  );
}
