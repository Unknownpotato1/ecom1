"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { products, categories } from "@/lib/data";
import { ProductCard } from "@/components/product/product-card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { SlidersHorizontal, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

type SortKey = "featured" | "new" | "price-asc" | "price-desc" | "rating";

export function CollectionsClient() {
  const params = useSearchParams();
  const initialCategory = params.get("category") ?? "all";
  const filterParam = params.get("filter"); // featured | bestseller
  const sortParam = params.get("sort") as SortKey | null;

  const [category, setCategory] = useState(initialCategory);
  const [sort, setSort] = useState<SortKey>(sortParam ?? "featured");
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState<{ min: number; max: number }>({ min: 0, max: 10000 });

  const filtered = useMemo(() => {
    let list = [...products];
    if (category !== "all") list = list.filter((p) => p.category === category);
    if (filterParam === "featured") list = list.filter((p) => p.isFeatured);
    if (filterParam === "bestseller") list = list.filter((p) => p.isBestSeller);
    list = list.filter((p) => p.basePrice >= priceRange.min && p.basePrice <= priceRange.max);

    switch (sort) {
      case "new": list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()); break;
      case "price-asc": list.sort((a, b) => a.basePrice - b.basePrice); break;
      case "price-desc": list.sort((a, b) => b.basePrice - a.basePrice); break;
      case "rating": list.sort((a, b) => b.rating - a.rating); break;
      default:
        list.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
    }
    return list;
  }, [category, sort, filterParam, priceRange]);

  const filterContent = (
    <div className="space-y-6">
      <div>
        <h4 className="text-sm font-semibold mb-3">Category</h4>
        <div className="space-y-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <Checkbox
              checked={category === "all"}
              onCheckedChange={() => setCategory("all")}
            />
            <span className="text-sm">All Categories</span>
          </label>
          {categories.map((c) => (
            <label key={c.id} className="flex items-center gap-2 cursor-pointer">
              <Checkbox
                checked={category === c.slug}
                onCheckedChange={() => setCategory(c.slug)}
              />
              <span className="text-sm capitalize">{c.name}</span>
            </label>
          ))}
        </div>
      </div>
      <div>
        <h4 className="text-sm font-semibold mb-3">Price Range</h4>
        <div className="space-y-2">
          {[
            { label: "Under ₹1000", min: 0, max: 999 },
            { label: "₹1000 - ₹2500", min: 1000, max: 2500 },
            { label: "₹2500 - ₹5000", min: 2500, max: 5000 },
            { label: "Above ₹5000", min: 5000, max: 100000 },
          ].map((r) => (
            <label key={r.label} className="flex items-center gap-2 cursor-pointer">
              <Checkbox
                checked={priceRange.min === r.min && priceRange.max === r.max}
                onCheckedChange={() => setPriceRange({ min: r.min, max: r.max })}
              />
              <span className="text-sm">{r.label}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 pb-16">
      <div className="flex items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="font-serif text-2xl font-bold">All Products</h2>
          <p className="text-sm text-muted-foreground">{filtered.length} products</p>
        </div>
        <div className="flex items-center gap-2">
          {/* Mobile filter button */}
          <Sheet open={showFilters} onOpenChange={setShowFilters}>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm" className="lg:hidden">
                <SlidersHorizontal className="h-4 w-4 mr-1" /> Filters
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] overflow-y-auto">
              <SheetHeader>
                <SheetTitle>Filters</SheetTitle>
              </SheetHeader>
              <div className="p-4">{filterContent}</div>
            </SheetContent>
          </Sheet>

          <Select value={sort} onValueChange={(v) => setSort(v as SortKey)}>
            <SelectTrigger className="w-[160px] sm:w-[200px]">
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
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Desktop sidebar */}
        <aside className="hidden lg:block">
          <div className="sticky top-32">{filterContent}</div>
        </aside>

        {/* Grid */}
        <div className="lg:col-span-3">
          {filtered.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-muted-foreground">No products match your filters.</p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => {
                  setCategory("all");
                  setPriceRange({ min: 0, max: 100000 });
                }}
              >
                Clear Filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-5">
              {filtered.map((p, i) => (
                <ProductCard key={p.id} product={p} priority={i < 6} />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
