import { homepageSections } from "@/lib/data";
import { HeroSlider } from "@/components/home/hero-slider";
import { RecentlyViewed } from "@/components/home/recently-viewed";
import {
  FeaturedCollectionsSection,
  ShopByCategorySection,
  FeaturedProductsSection,
  BestSellersSection,
  NewArrivalsSection,
  GiftHampersSection,
  LimitedOffersSection,
  ImageWithTextSection,
  VideoSection,
  TestimonialsSection,
  InstagramGallerySection,
  BrandStorySection,
  NewsletterSection,
} from "@/components/home/sections";

export default function HomePage() {
  // Filter + sort enabled sections — admin can reorder / disable / delete.
  const sections = [...homepageSections]
    .filter((s) => s.enabled)
    .sort((a, b) => a.sortOrder - b.sortOrder);

  return (
    <>
      {sections.map((section) => {
        const cfg = section.config as Record<string, unknown>;
        switch (section.type) {
          case "announcement_bar":
            return null; // rendered in SiteHeader
          case "hero_slider":
            return <HeroSlider key={section.id} />;
          case "featured_collections":
            return <FeaturedCollectionsSection key={section.id} title={(cfg.title as string) ?? "Featured Collections"} />;
          case "shop_by_category":
            return <ShopByCategorySection key={section.id} title={(cfg.title as string) ?? "Shop by Category"} />;
          case "featured_products":
            return <FeaturedProductsSection key={section.id} title={(cfg.title as string) ?? "Featured Products"} />;
          case "best_sellers":
            return <BestSellersSection key={section.id} title={(cfg.title as string) ?? "Best Sellers"} />;
          case "new_arrivals":
            return <NewArrivalsSection key={section.id} title={(cfg.title as string) ?? "New Arrivals"} />;
          case "gift_hampers":
            return <GiftHampersSection key={section.id} title={(cfg.title as string) ?? "Gift Hampers"} />;
          case "limited_offers":
            return <LimitedOffersSection key={section.id} title={(cfg.title as string) ?? "Limited Time Offers"} />;
          case "image_with_text":
            return (
              <ImageWithTextSection
                key={section.id}
                image={cfg.image as string}
                heading={cfg.heading as string}
                body={cfg.body as string}
                buttonText={cfg.buttonText as string | undefined}
                buttonUrl={cfg.buttonUrl as string | undefined}
                alignment={(cfg.alignment as "left" | "right") ?? "left"}
              />
            );
          case "video":
            return (
              <VideoSection
                key={section.id}
                videoUrl={cfg.videoUrl as string}
                poster={cfg.poster as string}
                heading={cfg.heading as string}
                subheading={cfg.subheading as string}
              />
            );
          case "testimonials":
            return <TestimonialsSection key={section.id} title={(cfg.title as string) ?? "Loved by thousands"} />;
          case "instagram_gallery":
            return <InstagramGallerySection key={section.id} title={(cfg.title as string) ?? "@auroraandco"} handle={(cfg.handle as string) ?? "@auroraandco"} />;
          case "brand_story":
            return (
              <BrandStorySection
                key={section.id}
                heading={cfg.heading as string}
                body={cfg.body as string}
                image={cfg.image as string}
                stats={cfg.stats as { value: string; label: string }[]}
              />
            );
          case "newsletter":
            return <NewsletterSection key={section.id} title={(cfg.title as string) ?? "Join the Aurora Circle"} />;
          case "custom_html":
            // Admin can inject custom HTML; sanitized server-side.
            return (
              <div
                key={section.id}
                className="mx-auto max-w-7xl px-4 sm:px-6 py-12"
                dangerouslySetInnerHTML={{ __html: (cfg.html as string) ?? "" }}
              />
            );
          default:
            return null;
        }
      })}

      {/* Recently viewed — appended at bottom for users who have browsed products */}
      <RecentlyViewed />
    </>
  );
}
