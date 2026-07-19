"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import { Heart, ShoppingBag, Eye, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCartStore, useWishlistStore } from "@/lib/stores";
import { formatINR, discountPercent } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Product } from "@/lib/types";
import { toast } from "sonner";

interface ProductCardProps {
  product: Product;
  priority?: boolean;
  className?: string;
}

export function ProductCard({ product, priority, className }: ProductCardProps) {
  const [imgIdx, setImgIdx] = useState(0);
  const addItem = useCartStore((s) => s.addItem);
  const { toggle: toggleWishlist, has } = useWishlistStore();
  const inWishlist = has(product.id);

  const discount = discountPercent(product.basePrice, product.compareAtPrice);
  const lowStock = product.inventory > 0 && product.inventory <= 5;

  const quickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product, product.variants[0], undefined, 1);
    toast.success(`${product.name} added to bag`);
  };

  const onWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.id);
    toast.success(inWishlist ? "Removed from wishlist" : "Added to wishlist");
  };

  return (
    <Link
      href={`/product/${product.slug}`}
      className={cn("group block", className)}
      onMouseEnter={() => product.images.length > 1 && setImgIdx(1)}
      onMouseLeave={() => setImgIdx(0)}
    >
      <div className="relative aspect-[4/5] rounded-lg overflow-hidden bg-muted">
        { }
        <img
          src={product.images[imgIdx]?.url ?? product.images[0]?.url}
          alt={product.images[imgIdx]?.alt ?? product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          loading={priority ? "eager" : "lazy"}
          fetchPriority={priority ? "high" : "auto"}
        />

        {/* Top-left badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1.5">
          {discount > 0 && (
            <Badge variant="destructive" className="bg-destructive text-destructive-foreground">
              -{discount}%
            </Badge>
          )}
          {product.isNewArrival && (
            <Badge className="bg-foreground text-background">NEW</Badge>
          )}
          {product.isBestSeller && (
            <Badge className="bg-gold text-gold-foreground">BESTSELLER</Badge>
          )}
          {product.isLimitedOffer && (
            <Badge variant="secondary" className="bg-red-600 text-white">LIMITED</Badge>
          )}
        </div>

        {/* Top-right wishlist */}
        <button
          onClick={onWishlist}
          className={cn(
            "absolute top-2 right-2 w-9 h-9 rounded-full bg-background/80 backdrop-blur flex items-center justify-center transition-all hover:scale-110",
            inWishlist ? "text-destructive" : "text-foreground"
          )}
          aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart className={cn("h-4 w-4", inWishlist && "fill-current")} />
        </button>

        {/* Low stock badge */}
        {lowStock && (
          <div className="absolute bottom-2 left-2">
            <Badge variant="outline" className="bg-background/90 backdrop-blur text-orange-700 border-orange-200">
              Only {product.inventory} left
            </Badge>
          </div>
        )}

        {/* Quick add — appears on hover (desktop) */}
        <div className="hidden sm:block absolute bottom-0 inset-x-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <Button
            onClick={quickAdd}
            className="w-full"
            size="sm"
            disabled={product.inventory === 0}
          >
            <ShoppingBag className="h-4 w-4 mr-1.5" />
            {product.inventory === 0 ? "Sold Out" : "Quick Add"}
          </Button>
        </div>

        {/* Mobile: always-visible compact add button */}
        <button
          onClick={quickAdd}
          className="sm:hidden absolute bottom-2 right-2 w-10 h-10 rounded-full bg-background/90 backdrop-blur shadow flex items-center justify-center"
          aria-label="Add to bag"
        >
          <ShoppingBag className="h-4 w-4" />
        </button>
      </div>

      <div className="mt-3 space-y-1">
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Star className="h-3 w-3 fill-gold text-gold" />
          <span>{product.rating.toFixed(1)}</span>
          <span>•</span>
          <span>{product.reviewCount}</span>
        </div>
        <h3 className="text-sm font-medium leading-snug line-clamp-1 group-hover:text-primary transition-colors">
          {product.name}
        </h3>
        {product.subtitle && (
          <p className="text-xs text-muted-foreground line-clamp-1">{product.subtitle}</p>
        )}
        <div className="flex items-baseline gap-2 pt-0.5">
          <span className="text-sm font-semibold">{formatINR(product.basePrice)}</span>
          {product.compareAtPrice && (
            <span className="text-xs text-muted-foreground line-through">{formatINR(product.compareAtPrice)}</span>
          )}
        </div>
      </div>
    </Link>
  );
}

// Skeleton variant for loading states
export function ProductCardSkeleton() {
  return (
    <div className="block">
      <div className="aspect-[4/5] rounded-lg shimmer" />
      <div className="mt-3 space-y-2">
        <div className="h-3 w-1/3 rounded shimmer" />
        <div className="h-4 w-3/4 rounded shimmer" />
        <div className="h-3 w-1/2 rounded shimmer" />
        <div className="h-4 w-1/3 rounded shimmer" />
      </div>
    </div>
  );
}
