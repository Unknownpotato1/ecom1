import { notFound } from "next/navigation";
import Link from "next/link";
import { getCollectionBySlug, getProductsByCollection, collections } from "@/lib/data";
import { CollectionDetailClient } from "./collection-detail-client";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const collection = getCollectionBySlug(slug);
  if (!collection) return { title: "Collection not found" };
  return {
    title: collection.seo.title ?? collection.name,
    description: collection.seo.description ?? collection.description,
  };
}

export async function generateStaticParams() {
  return collections.map((c) => ({ slug: c.slug }));
}

export default async function CollectionDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const collection = getCollectionBySlug(slug);
  if (!collection) notFound();
  const items = getProductsByCollection(collection.id);

  return (
    <>
      {/* Banner */}
      <section className="relative h-[40vh] lg:h-[55vh] min-h-[300px] overflow-hidden bg-foreground">
        { }
        <img
          src={collection.bannerImage.url}
          alt={collection.bannerImage.alt}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        <div className="relative h-full flex items-end">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 pb-10 lg:pb-16 text-white w-full">
            <nav className="text-xs text-white/70 mb-2 flex items-center gap-1">
              <Link href="/" className="hover:text-white">Home</Link>
              <span>/</span>
              <Link href="/collections" className="hover:text-white">Collections</Link>
            </nav>
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold">{collection.name}</h1>
            <p className="mt-3 max-w-2xl text-white/85">{collection.description}</p>
          </div>
        </div>
      </section>

      <CollectionDetailClient products={items} collectionName={collection.name} />
    </>
  );
}
