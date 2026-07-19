"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Search as SearchIcon } from "lucide-react";
import { products, collections } from "@/lib/data";
import { ProductCard } from "@/components/product/product-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState, useMemo } from "react";

export default function SearchPage() {
  const params = useSearchParams();
  const router = useRouter();
  const initialQ = params.get("q") ?? "";
  const [q, setQ] = useState(initialQ);

  const results = useMemo(() => {
    const query = initialQ.trim().toLowerCase();
    if (!query) return { products: [], collections: [] };
    return {
      products: products.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.tags.some((t) => t.toLowerCase().includes(query)) ||
          p.description.toLowerCase().includes(query) ||
          p.category.toLowerCase().includes(query)
      ),
      collections: collections.filter(
        (c) => c.name.toLowerCase().includes(query) || c.description.toLowerCase().includes(query)
      ),
    };
  }, [initialQ]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/search?q=${encodeURIComponent(q)}`);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8 lg:py-12">
      <div className="text-center mb-8">
        <h1 className="font-serif text-3xl sm:text-4xl font-bold mb-3">Search</h1>
        <form onSubmit={onSubmit} className="max-w-md mx-auto relative">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search for jewelry, hampers…"
            className="pl-10"
            autoFocus
          />
        </form>
      </div>

      {!initialQ && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Start typing to search our collections.</p>
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            {["bridal", "jhumkas", "kundan", "hamper", "pearl", "choker"].map((t) => (
              <Button
                key={t}
                variant="outline"
                size="sm"
                onClick={() => router.push(`/search?q=${encodeURIComponent(t)}`)}
              >
                {t}
              </Button>
            ))}
          </div>
        </div>
      )}

      {initialQ && (
        <>
          <p className="text-sm text-muted-foreground mb-6">
            {results.products.length + results.collections.length} results for &ldquo;<span className="font-medium text-foreground">{initialQ}</span>&rdquo;
          </p>

          {results.collections.length > 0 && (
            <section className="mb-10">
              <h2 className="font-serif text-2xl font-bold mb-4">Collections</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {results.collections.map((c) => (
                  <Link key={c.id} href={`/collections/${c.slug}`} className="group block">
                    <div className="relative aspect-[4/3] rounded-lg overflow-hidden bg-muted">
                      { }
                      <img
                        src={c.bannerImage.url}
                        alt={c.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className="absolute bottom-0 p-4 text-white">
                        <p className="font-serif text-lg font-semibold">{c.name}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {results.products.length > 0 && (
            <section>
              <h2 className="font-serif text-2xl font-bold mb-4">Products</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
                {results.products.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </section>
          )}

          {results.products.length === 0 && results.collections.length === 0 && (
            <div className="text-center py-16">
              <SearchIcon className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
              <p className="font-medium">No results found</p>
              <p className="text-sm text-muted-foreground mt-1">Try a different keyword or browse our collections.</p>
              <Button asChild className="mt-4">
                <Link href="/collections">Browse Collections</Link>
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
