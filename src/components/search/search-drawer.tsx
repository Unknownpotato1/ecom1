"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, X, Clock, TrendingUp } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useUIStore, useRecentlySearchedStore } from "@/lib/stores";
import { products, collections, categories } from "@/lib/data";
import { formatINR, discountPercent } from "@/lib/format";
import { useHydrated } from "@/lib/use-hydrated";

const trendingSearches = ["bridal set", "jhumkas", "kundan", "gift hamper", "choker", "pearl"];

export function SearchDrawer() {
  const { searchOpen, setSearchOpen } = useUIStore();
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const hydrated = useHydrated();
  const { terms: recentTerms, add: addRecent, clear: clearRecent } = useRecentlySearchedStore();

  useEffect(() => {
    if (searchOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
    // Clear query on close — wrap in microtask to avoid setState-in-effect lint
    if (!searchOpen) {
      const id = setTimeout(() => setQuery(""), 0);
      return () => clearTimeout(id);
    }
  }, [searchOpen]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return { products: [], collections: [], categories: [] };
    return {
      products: products
        .filter(
          (p) =>
            p.name.toLowerCase().includes(q) ||
            p.tags.some((t) => t.toLowerCase().includes(q)) ||
            p.description.toLowerCase().includes(q)
        )
        .slice(0, 6),
      collections: collections.filter((c) => c.name.toLowerCase().includes(q) || c.description.toLowerCase().includes(q)).slice(0, 3),
      categories: categories.filter((c) => c.name.toLowerCase().includes(q)).slice(0, 3),
    };
  }, [query]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    addRecent(q);
    setSearchOpen(false);
    router.push(`/search?q=${encodeURIComponent(q)}`);
  };

  const hasResults = results.products.length + results.collections.length + results.categories.length > 0;

  return (
    <Sheet open={searchOpen} onOpenChange={(o) => !o && setSearchOpen(false)}>
      <SheetContent side="top" className="h-[85vh] sm:h-[80vh] p-0 flex flex-col">
        <SheetHeader className="px-6 pt-6 pb-4 border-b">
          <SheetTitle className="sr-only">Search</SheetTitle>
          <form onSubmit={onSubmit} className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              ref={inputRef}
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for jewelry, hampers, collections…"
              className="pl-11 pr-10 h-12 text-base"
              autoComplete="off"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                aria-label="Clear search"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </form>
        </SheetHeader>

        <ScrollArea className="flex-1">
          <div className="px-6 py-4">
            {!query && (
              <div className="space-y-6">
                {hydrated && recentTerms.length > 0 && (
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                        <Clock className="h-3.5 w-3.5" /> Recent Searches
                      </h4>
                      <button onClick={clearRecent} className="text-xs text-muted-foreground hover:text-foreground">
                        Clear
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {recentTerms.map((t) => (
                        <button
                          key={t}
                          onClick={() => setQuery(t)}
                          className="text-sm px-3 py-1.5 rounded-full border hover:border-primary hover:text-primary transition-colors"
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2 mb-3">
                    <TrendingUp className="h-3.5 w-3.5" /> Trending
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {trendingSearches.map((t) => (
                      <button
                        key={t}
                        onClick={() => setQuery(t)}
                        className="text-sm px-3 py-1.5 rounded-full bg-muted hover:bg-accent/30 transition-colors"
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {query && !hasResults && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No results for &ldquo;{query}&rdquo;</p>
                <p className="text-sm text-muted-foreground mt-2">Try a different keyword or browse our collections.</p>
              </div>
            )}

            {query && hasResults && (
              <div className="space-y-6">
                {results.collections.length > 0 && (
                  <div>
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Collections</h4>
                    <div className="space-y-2">
                      {results.collections.map((c) => (
                        <Link
                          key={c.id}
                          href={`/collections/${c.slug}`}
                          onClick={() => setSearchOpen(false)}
                          className="flex items-center gap-3 p-2 hover:bg-accent/20 rounded-lg transition-colors"
                        >
                          <div className="w-12 h-12 rounded-md overflow-hidden bg-muted shrink-0">
                            { }
                            <img src={c.thumbnail.url} alt={c.name} className="w-full h-full object-cover" />
                          </div>
                          <div>
                            <p className="font-medium text-sm">{c.name}</p>
                            <p className="text-xs text-muted-foreground line-clamp-1">{c.description}</p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {results.categories.length > 0 && (
                  <div>
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Categories</h4>
                    <div className="flex flex-wrap gap-2">
                      {results.categories.map((c) => (
                        <Link
                          key={c.id}
                          href={`/collections?category=${c.slug}`}
                          onClick={() => setSearchOpen(false)}
                          className="text-sm px-3 py-1.5 rounded-full border hover:border-primary hover:text-primary transition-colors"
                        >
                          {c.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {results.products.length > 0 && (
                  <div>
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Products</h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {results.products.map((p) => {
                        const discount = discountPercent(p.basePrice, p.compareAtPrice);
                        return (
                          <Link
                            key={p.id}
                            href={`/product/${p.slug}`}
                            onClick={() => setSearchOpen(false)}
                            className="group"
                          >
                            <div className="aspect-[4/5] rounded-md overflow-hidden bg-muted mb-2">
                              { }
                              <img
                                src={p.images[0]?.url}
                                alt={p.name}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              />
                            </div>
                            <p className="text-xs font-medium line-clamp-1">{p.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {formatINR(p.basePrice)}{" "}
                              {discount > 0 && (
                                <span className="text-destructive ml-1">-{discount}%</span>
                              )}
                            </p>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
