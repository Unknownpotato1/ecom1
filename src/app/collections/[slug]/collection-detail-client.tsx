"use client";

import { useMemo, useState } from "react";
import { ProductCard } from "@/components/product/product-card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Product } from "@/lib/types";

type SortKey = "featured" | "new" | "price-asc" | "price-desc" | "rating";

export function CollectionDetailClient({ products, collectionName }: { products: Product[]; collectionName: string }) {
  const [sort, setSort] = useState<SortKey>("featured");

  const sorted = useMemo(() => {
    const list = [...products];
    switch (sort) {
      case "new": list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()); break;
      case "price-asc": list.sort((a, b) => a.basePrice - b.basePrice); break;
      case "price-desc": list.sort((a, b) => b.basePrice - a.basePrice); break;
      case "rating": list.sort((a, b) => b.rating - a.rating); break;
      default:
        list.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
    }
    return list;
  }, [products, sort]);

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 py-10">
      <div className="flex items-center justify-between gap-4 mb-6">
        <p className="text-sm text-muted-foreground">{sorted.length} products in {collectionName}</p>
        <Select value={sort} onValueChange={(v) => setSort(v as SortKey)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="featured">Featured</SelectItem>
            <SelectItem value="new">Newest</SelectItem>
            <SelectItem value="price-asc">Price: Low to High</SelectItem>
            <SelectItem value="price-desc">Price: High to Low</SelectItem>
            <SelectItem value="rating">Top Rated</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {sorted.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-muted-foreground">No products in this collection yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
          {sorted.map((p, i) => (
            <ProductCard key={p.id} product={p} priority={i < 4} />
          ))}
        </div>
      )}
    </section>
  );
}
