import { notFound } from "next/navigation";
import { getProductBySlug, getRelatedProducts, products, multiBuyOffers } from "@/lib/data";
import { ProductDetailClient } from "./product-detail-client";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return { title: "Product not found" };
  return {
    title: product.seo.title ?? product.name,
    description: product.seo.description ?? product.description.slice(0, 160),
    openGraph: {
      title: product.name,
      description: product.description.slice(0, 160),
      images: product.images.map((i) => ({ url: i.url, alt: i.alt })),
    },
  };
}

export async function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();

  const related = getRelatedProducts(product.id, 4);
  const frequentlyBoughtTogether = (product.frequentlyBoughtTogetherIds ?? [])
    .map((id) => products.find((p) => p.id === id))
    .filter(Boolean) ?? [];

  return (
    <ProductDetailClient
      product={product}
      related={related}
      fbt={frequentlyBoughtTogether as typeof products}
      offers={multiBuyOffers}
    />
  );
}
