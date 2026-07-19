import Link from "next/link";
import { Suspense } from "react";
import { collections, categories } from "@/lib/data";
import { CollectionsClient } from "./collections-client";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Collections",
  description: "Browse all our handcrafted jewelry collections and gift hampers.",
};

export default function CollectionsPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-foreground text-background py-12 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.25em] text-gold">All Collections</span>
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold mt-3">
            Find Your Perfect Piece
          </h1>
          <p className="mt-3 text-background/70 max-w-xl mx-auto">
            From bridal grandeur to everyday elegance — explore our curated collections.
          </p>
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-12">
        <h2 className="font-serif text-2xl font-bold mb-6">Shop by Category</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {categories.map((c) => (
            <Link
              key={c.id}
              href={`/collections?category=${c.slug}`}
              className="group block text-center"
            >
              <div className="aspect-square rounded-full overflow-hidden bg-muted mb-2 ring-2 ring-transparent group-hover:ring-gold transition-all">
                { }
                <img
                  src={c.image.url}
                  alt={c.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  loading="lazy"
                />
              </div>
              <p className="text-sm font-medium group-hover:text-primary transition-colors">{c.name}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* All collections */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 pb-16">
        <h2 className="font-serif text-2xl font-bold mb-6">All Collections</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {collections.map((c) => (
            <Link key={c.id} href={`/collections/${c.slug}`} className="group block">
              <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-muted">
                { }
                <img
                  src={c.bannerImage.url}
                  alt={c.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
                  <h3 className="font-serif text-xl font-semibold">{c.name}</h3>
                  <p className="text-xs text-white/80 mt-1 line-clamp-1">{c.description}</p>
                  <span className="inline-flex items-center mt-2 text-xs font-medium border-b border-white/40 group-hover:border-white transition-colors">
                    Explore →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Product grid with filters — wrapped in Suspense because
          CollectionsClient uses useSearchParams (requires CSR bailout). */}
      <Suspense fallback={<div className="mx-auto max-w-7xl px-4 sm:px-6 py-16 text-center text-muted-foreground">Loading products…</div>}>
        <CollectionsClient />
      </Suspense>
    </>
  );
}
