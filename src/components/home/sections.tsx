"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { collections, categories, products, testimonials, instagramPosts } from "@/lib/data";
import { ProductCard } from "@/components/product/product-card";
import { Button } from "@/components/ui/button";
import type { Product } from "@/lib/types";

// --------------------------------------------------------------------------
// Section heading
// --------------------------------------------------------------------------
export function SectionHeading({
  title,
  subtitle,
  align = "left",
  actionLabel,
  actionHref,
}: {
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  actionLabel?: string;
  actionHref?: string;
}) {
  return (
    <div className={`flex items-end justify-between gap-4 mb-8 ${align === "center" ? "flex-col text-center" : "flex-wrap"}`}>
      <div className={align === "center" ? "max-w-2xl mx-auto" : "min-w-0 flex-1"}>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight"
        >
          {title}
        </motion.h2>
        {subtitle && (
          <p className="mt-2 text-muted-foreground text-sm sm:text-base max-w-xl">{subtitle}</p>
        )}
      </div>
      {actionLabel && actionHref && (
        <Button asChild variant="link" className="shrink-0 -mr-2 text-sm font-medium">
          <Link href={actionHref}>
            {actionLabel} <ArrowRight className="h-4 w-4 ml-1" />
          </Link>
        </Button>
      )}
    </div>
  );
}

// --------------------------------------------------------------------------
// Featured Collections
// --------------------------------------------------------------------------
export function FeaturedCollectionsSection({ title = "Featured Collections" }: { title?: string }) {
  const featured = collections.filter((c) => c.isFeatured);
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 py-16 lg:py-24">
      <SectionHeading
        title={title}
        subtitle="Curated edits for every occasion — from bridal grandeur to everyday ease."
        align="center"
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {featured.map((c, idx) => (
          <motion.div
            key={c.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: idx * 0.1 }}
          >
            <Link href={`/collections/${c.slug}`} className="group block">
              <div className="relative aspect-[3/4] rounded-lg overflow-hidden bg-muted">
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
                  <span className="inline-flex items-center mt-3 text-xs font-medium border-b border-white/40 pb-0.5 group-hover:border-white transition-colors">
                    Shop Now <ArrowRight className="h-3 w-3 ml-1" />
                  </span>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

// --------------------------------------------------------------------------
// Shop by Category
// --------------------------------------------------------------------------
export function ShopByCategorySection({ title = "Shop by Category" }: { title?: string }) {
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 py-16 lg:py-24 bg-secondary/30 rounded-3xl my-8">
      <SectionHeading
        title={title}
        subtitle="Find exactly what you're looking for."
        align="center"
      />
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 lg:gap-5">
        {categories.map((c, idx) => (
          <motion.div
            key={c.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-30px" }}
            transition={{ duration: 0.4, delay: idx * 0.05 }}
          >
            <Link href={`/collections?category=${c.slug}`} className="group block text-center">
              <div className="aspect-square rounded-full overflow-hidden bg-muted mb-3 ring-2 ring-transparent group-hover:ring-gold transition-all">
                { }
                <img
                  src={c.image.url}
                  alt={c.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  loading="lazy"
                />
              </div>
              <p className="text-sm font-medium group-hover:text-primary transition-colors">{c.name}</p>
              <p className="text-xs text-muted-foreground">{c.productCount} items</p>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

// --------------------------------------------------------------------------
// Product Row (used for featured / best sellers / new arrivals / hampers)
// --------------------------------------------------------------------------
function ProductRow({
  title,
  subtitle,
  items,
  viewAllHref,
}: {
  title: string;
  subtitle?: string;
  items: Product[];
  viewAllHref?: string;
}) {
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 py-12 lg:py-16">
      <SectionHeading
        title={title}
        subtitle={subtitle}
        actionLabel={viewAllHref ? "View All" : undefined}
        actionHref={viewAllHref}
      />
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
        {items.slice(0, 8).map((p, i) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-30px" }}
            transition={{ duration: 0.4, delay: i * 0.05 }}
          >
            <ProductCard product={p} priority={i < 4} />
          </motion.div>
        ))}
      </div>
    </section>
  );
}

export function FeaturedProductsSection({ title = "Featured Products" }: { title?: string }) {
  return (
    <ProductRow
      title={title}
      subtitle="Handpicked favorites our customers can't stop loving."
      items={products.filter((p) => p.isFeatured)}
      viewAllHref="/collections?filter=featured"
    />
  );
}

export function BestSellersSection({ title = "Best Sellers" }: { title?: string }) {
  return (
    <ProductRow
      title={title}
      subtitle="The pieces that keep flying off our shelves."
      items={products.filter((p) => p.isBestSeller)}
      viewAllHref="/collections?filter=bestseller"
    />
  );
}

export function NewArrivalsSection({ title = "New Arrivals" }: { title?: string }) {
  return (
    <ProductRow
      title={title}
      subtitle="Fresh drops every week — be the first to wear them."
      items={products.filter((p) => p.isNewArrival)}
      viewAllHref="/collections?sort=new"
    />
  );
}

export function GiftHampersSection({ title = "Gift Hampers" }: { title?: string }) {
  return (
    <ProductRow
      title={title}
      subtitle="Thoughtfully curated gifts for every celebration."
      items={products.filter((p) => p.isGiftHamper)}
      viewAllHref="/collections/curated-hampers"
    />
  );
}

// --------------------------------------------------------------------------
// Limited Time Offers
// --------------------------------------------------------------------------
export function LimitedOffersSection({ title = "Limited Time Offers" }: { title?: string }) {
  const offers = products.filter((p) => p.isLimitedOffer);
  if (offers.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 py-12 lg:py-16">
      <div className="bg-gradient-to-br from-primary/5 via-gold/10 to-primary/5 rounded-2xl p-6 lg:p-10 border border-gold/20">
        <SectionHeading
          title={title}
          subtitle="Hurry — these deals won't last."
          align="center"
        />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
          {offers.map((p, i) => (
            <ProductCard key={p.id} product={p} priority={i < 2} />
          ))}
        </div>
      </div>
    </section>
  );
}

// --------------------------------------------------------------------------
// Image with Text
// --------------------------------------------------------------------------
export function ImageWithTextSection({
  image,
  heading,
  body,
  buttonText,
  buttonUrl,
  alignment = "left",
}: {
  image: string;
  heading: string;
  body: string;
  buttonText?: string;
  buttonUrl?: string;
  alignment?: "left" | "right";
}) {
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 py-16 lg:py-24">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, x: alignment === "left" ? -30 : 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
          className={alignment === "right" ? "lg:order-2" : ""}
        >
          <div className="aspect-[4/5] sm:aspect-[4/3] rounded-2xl overflow-hidden bg-muted">
            { }
            <img src={image} alt={heading} className="w-full h-full object-cover" loading="lazy" />
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: alignment === "left" ? 30 : -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
          className={alignment === "right" ? "lg:order-1" : ""}
        >
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">Our Promise</span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold mt-3 tracking-tight">{heading}</h2>
          <p className="mt-5 text-base sm:text-lg text-muted-foreground leading-relaxed">{body}</p>
          {buttonText && buttonUrl && (
            <Button asChild className="mt-8" size="lg">
              <Link href={buttonUrl}>{buttonText}</Link>
            </Button>
          )}
        </motion.div>
      </div>
    </section>
  );
}

// --------------------------------------------------------------------------
// Video section
// --------------------------------------------------------------------------
export function VideoSection({
  videoUrl,
  poster,
  heading,
  subheading,
}: {
  videoUrl: string;
  poster: string;
  heading: string;
  subheading: string;
}) {
  return (
    <section className="relative h-[60vh] lg:h-[80vh] min-h-[400px] overflow-hidden bg-foreground">
      <video
        className="absolute inset-0 w-full h-full object-cover"
        autoPlay
        muted
        loop
        playsInline
        poster={poster}
      >
        <source src={videoUrl} type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-black/40" />
      <div className="relative h-full flex items-center justify-center text-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl text-white"
        >
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold">{heading}</h2>
          <p className="mt-3 text-base sm:text-lg text-white/90">{subheading}</p>
        </motion.div>
      </div>
    </section>
  );
}

// --------------------------------------------------------------------------
// Testimonials
// --------------------------------------------------------------------------
export function TestimonialsSection({ title = "Loved by thousands" }: { title?: string }) {
  return (
    <section className="bg-secondary/40 py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          title={title}
          subtitle="Real reviews from real customers across India."
          align="center"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {testimonials.slice(0, 6).map((t, i) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="bg-background rounded-xl p-6 border shadow-sm"
            >
              <div className="flex items-center gap-1 mb-3">
                {Array.from({ length: 5 }).map((_, idx) => (
                  <svg key={idx} className="h-4 w-4 fill-gold text-gold" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.965a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.367 2.446a1 1 0 00-.364 1.118l1.287 3.965c.3.922-.755 1.688-1.539 1.118l-3.366-2.446a1 1 0 00-1.176 0l-3.366 2.446c-.784.57-1.838-.196-1.539-1.118l1.287-3.965a1 1 0 00-.364-1.118L2.062 9.392c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.287-3.965z" />
                  </svg>
                ))}
              </div>
              <p className="text-sm leading-relaxed text-foreground/90">&ldquo;{t.body}&rdquo;</p>
              <div className="mt-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-sm">
                  {t.authorName.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-medium">{t.authorName}</p>
                  <p className="text-xs text-muted-foreground">{t.authorLocation} • Verified</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// --------------------------------------------------------------------------
// Instagram Gallery
// --------------------------------------------------------------------------
export function InstagramGallerySection({
  title = "@auroraandco",
  handle = "@auroraandco",
}: {
  title?: string;
  handle?: string;
}) {
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 py-16 lg:py-24">
      <SectionHeading title={title} subtitle={`Follow ${handle} on Instagram for daily inspiration.`} align="center" />
      <div className="grid grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3">
        {instagramPosts.map((post, i) => (
          <motion.a
            key={post.id}
            href={post.permalink}
            target="_blank"
            rel="noreferrer"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-30px" }}
            transition={{ duration: 0.4, delay: i * 0.05 }}
            className="group relative aspect-square rounded-md overflow-hidden bg-muted"
          >
            { }
            <img
              src={post.imageUrl}
              alt={post.caption}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-end p-3">
              <p className="text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity line-clamp-2">
                {post.caption}
              </p>
            </div>
          </motion.a>
        ))}
      </div>
    </section>
  );
}

// --------------------------------------------------------------------------
// Brand Story
// --------------------------------------------------------------------------
export function BrandStorySection({
  heading,
  body,
  image,
  stats,
}: {
  heading: string;
  body: string;
  image: string;
  stats: { value: string; label: string }[];
}) {
  return (
    <section className="relative bg-foreground text-background py-16 lg:py-24 overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">Est. 2019</span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold mt-3 tracking-tight">{heading}</h2>
            <p className="mt-5 text-base sm:text-lg text-background/80 leading-relaxed">{body}</p>
            <div className="grid grid-cols-3 gap-6 mt-10 pt-8 border-t border-background/10">
              {stats.map((s) => (
                <div key={s.label}>
                  <p className="font-serif text-2xl sm:text-3xl font-bold text-gold">{s.value}</p>
                  <p className="text-xs text-background/60 mt-1">{s.label}</p>
                </div>
              ))}
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6 }}
            className="relative aspect-[4/5] lg:aspect-[5/6] rounded-2xl overflow-hidden"
          >
            { }
            <img src={image} alt="Aurora & Co. story" className="w-full h-full object-cover" loading="lazy" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// --------------------------------------------------------------------------
// Newsletter
// --------------------------------------------------------------------------
export function NewsletterSection({ title = "Join the Aurora Circle" }: { title?: string }) {
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 py-16 lg:py-24">
      <div className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground rounded-3xl p-10 lg:p-16 text-center">
        <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold">{title}</h2>
        <p className="mt-3 text-primary-foreground/80 max-w-xl mx-auto">
          Get 10% off your first order, early access to new collections, and exclusive subscriber-only offers.
        </p>
        <form
          className="mt-8 flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
          onSubmit={(e) => {
            e.preventDefault();
            const form = e.currentTarget;
            const email = (form.elements.namedItem("email") as HTMLInputElement).value;
            if (email.includes("@")) {
              alert("Thanks for subscribing! Check your inbox for 10% off.");
              form.reset();
            }
          }}
        >
          <input
            type="email"
            name="email"
            placeholder="your@email.com"
            className="flex h-12 w-full rounded-md border border-primary-foreground/30 bg-primary-foreground/10 px-4 py-2 text-sm text-primary-foreground placeholder:text-primary-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary-foreground/40"
            required
          />
          <button
            type="submit"
            className="shrink-0 h-12 px-6 rounded-md bg-background text-foreground hover:bg-background/90 font-medium transition-colors"
          >
            Subscribe
          </button>
        </form>
        <p className="text-xs text-primary-foreground/60 mt-3">No spam, ever. Unsubscribe anytime.</p>
      </div>
    </section>
  );
}
