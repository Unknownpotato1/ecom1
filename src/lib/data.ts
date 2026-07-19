// ============================================================================
// Aurora & Co. — Mock seed data layer.
// In production these are replaced by Firestore collections.
// See README.md for the equivalent Firestore schema mapping.
// ============================================================================

import type {
  AnnouncementItem,
  Category,
  Collection,
  Coupon,
  HeroSlide,
  HomepageSection,
  InstagramPost,
  MultiBuyOffer,
  Product,
  ProductReview,
  Testimonial,
  ThemeSettings,
} from "./types";

// Use Unsplash source URLs for high-quality jewelry imagery
const img = (id: string, w = 800) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

// ---------------------------------------------------------------------------
// Categories
// ---------------------------------------------------------------------------
export const categories: Category[] = [
  {
    id: "cat-necklaces",
    slug: "necklaces",
    name: "Necklaces",
    image: { id: "i1", url: img("photo-1599643478518-a784e5dc4c8f"), alt: "Necklaces" },
    productCount: 24,
    sortOrder: 1,
  },
  {
    id: "cat-earrings",
    slug: "earrings",
    name: "Earrings",
    image: { id: "i2", url: img("photo-1535632066927-ab7c11ab949d"), alt: "Earrings" },
    productCount: 32,
    sortOrder: 2,
  },
  {
    id: "cat-bracelets",
    slug: "bracelets",
    name: "Bracelets",
    image: { id: "i3", url: img("photo-1611652022419-a9419f74343d"), alt: "Bracelets" },
    productCount: 18,
    sortOrder: 3,
  },
  {
    id: "cat-rings",
    slug: "rings",
    name: "Rings",
    image: { id: "i4", url: img("photo-1605100804763-247f67b3557e"), alt: "Rings" },
    productCount: 20,
    sortOrder: 4,
  },
  {
    id: "cat-hampers",
    slug: "gift-hampers",
    name: "Gift Hampers",
    image: { id: "i5", url: img("photo-1549465220-1a8b9238cd48"), alt: "Gift Hampers" },
    productCount: 16,
    sortOrder: 5,
  },
  {
    id: "cat-mangalsutra",
    slug: "mangalsutra",
    name: "Mangalsutra",
    image: { id: "i6", url: img("photo-1573883431205-9b09b7b2b8a3"), alt: "Mangalsutra" },
    productCount: 12,
    sortOrder: 6,
  },
];

// ---------------------------------------------------------------------------
// Collections
// ---------------------------------------------------------------------------
export const collections: Collection[] = [
  {
    id: "col-bridal",
    slug: "bridal-collection",
    name: "The Bridal Edit",
    description: "Heirloom-inspired statement pieces for the bride who deserves to shine. Handcrafted with kundan, polki, and pearl detailing.",
    bannerImage: { id: "b1", url: img("photo-1606800052052-a08af7148866", 1600), alt: "Bridal Collection" },
    thumbnail: { id: "t1", url: img("photo-1605100804763-247f67b3557e", 600), alt: "Bridal" },
    productIds: ["p-001", "p-002", "p-006", "p-007"],
    sortOrder: 1,
    isFeatured: true,
    seo: { title: "Bridal Jewelry Collection — Aurora & Co.", description: "Heirloom-inspired bridal jewelry." },
    createdAt: "2025-09-01T00:00:00.000Z",
  },
  {
    id: "col-festive",
    slug: "festive-glow",
    name: "Festive Glow",
    description: "Pieces that catch the light — and every glance. Perfect for Diwali, Karwa Chauth, and celebrations.",
    bannerImage: { id: "b2", url: img("photo-1617038220319-276b5e8a1f42", 1600), alt: "Festive Collection" },
    thumbnail: { id: "t2", url: img("photo-1573883431205-9b09b7b2b8a3", 600), alt: "Festive" },
    productIds: ["p-003", "p-004", "p-005", "p-008"],
    sortOrder: 2,
    isFeatured: true,
    seo: { title: "Festive Jewelry — Aurora & Co." },
    createdAt: "2025-09-15T00:00:00.000Z",
  },
  {
    id: "col-everyday",
    slug: "everyday-elegance",
    name: "Everyday Elegance",
    description: "Minimal, modern, made for daily wear. The kind of pieces you reach for without thinking.",
    bannerImage: { id: "b3", url: img("photo-1588444837495-c6cfeb53f32d", 1600), alt: "Everyday Collection" },
    thumbnail: { id: "t3", url: img("photo-1535632066927-ab7c11ab949d", 600), alt: "Everyday" },
    productIds: ["p-009", "p-010", "p-011", "p-012"],
    sortOrder: 3,
    isFeatured: true,
    seo: { title: "Everyday Jewelry — Aurora & Co." },
    createdAt: "2025-10-01T00:00:00.000Z",
  },
  {
    id: "col-hampers",
    slug: "curated-hampers",
    name: "Curated Hampers",
    description: "Thoughtful gifts, beautifully bundled. For weddings, festivals, and moments that matter.",
    bannerImage: { id: "b4", url: img("photo-1513885535751-8b9238bd3458", 1600), alt: "Hampers" },
    thumbnail: { id: "t4", url: img("photo-1549465220-1a8b9238cd48", 600), alt: "Hampers" },
    productIds: ["p-013", "p-014", "p-015", "p-016"],
    sortOrder: 4,
    isFeatured: true,
    seo: { title: "Gift Hampers — Aurora & Co." },
    createdAt: "2025-10-15T00:00:00.000Z",
  },
];

// ---------------------------------------------------------------------------
// Reviews (shared)
// ---------------------------------------------------------------------------
const sharedReviews: ProductReview[] = [
  {
    id: "r1",
    productId: "shared",
    authorName: "Priya S.",
    rating: 5,
    title: "Stunning in person",
    body: "The photos don't do justice — the piece is heavier, shinier, and more premium than I expected. Got so many compliments at the wedding!",
    images: [{ id: "ri1", url: img("photo-1606800052052-a08af7148866", 400), alt: "Customer photo" }],
    isVerified: true,
    createdAt: "2026-06-10T10:00:00.000Z",
    helpful: 24,
  },
  {
    id: "r2",
    productId: "shared",
    authorName: "Ananya M.",
    rating: 5,
    title: "Perfect for gifting",
    body: "Bought this as a gift for my sister. The packaging is gorgeous — felt like opening a luxury boutique purchase. She absolutely loved it.",
    images: [],
    isVerified: true,
    createdAt: "2026-06-05T10:00:00.000Z",
    helpful: 12,
  },
  {
    id: "r3",
    productId: "shared",
    authorName: "Riya K.",
    rating: 4,
    title: "Beautiful but runs small",
    body: "Quality is excellent, just wish I'd sized up. Customer service helped me exchange hassle-free. Will buy again.",
    images: [{ id: "ri3", url: img("photo-1535632066927-ab7c11ab949d", 400), alt: "Customer photo" }],
    isVerified: true,
    createdAt: "2026-05-28T10:00:00.000Z",
    helpful: 8,
  },
];

// ---------------------------------------------------------------------------
// Products
// ---------------------------------------------------------------------------
function makeProduct(p: Partial<Product> & Pick<Product, "id" | "slug" | "name" | "basePrice" | "category" | "images">): Product {
  const now = new Date().toISOString();
  return {
    subtitle: p.subtitle,
    description: p.description ?? "",
    highlights: p.highlights ?? [],
    specs: p.specs ?? [],
    compareAtPrice: p.compareAtPrice,
    costPrice: p.costPrice,
    sku: p.sku ?? `AUR-${p.id.toUpperCase()}`,
    barcode: p.barcode,
    collectionIds: p.collectionIds ?? [],
    tags: p.tags ?? [],
    videoUrl: p.videoUrl,
    variants: p.variants ?? [],
    hasSizeVariants: p.hasSizeVariants ?? false,
    sizes: p.sizes ?? [],
    rating: p.rating ?? 4.7,
    reviewCount: p.reviewCount ?? Math.floor(Math.random() * 80) + 12,
    reviews: p.reviews ?? sharedReviews.map((r) => ({ ...r, id: `${r.id}-${p.id}`, productId: p.id })),
    inventory: p.inventory ?? 25,
    isPublished: p.isPublished ?? true,
    isFeatured: p.isFeatured ?? false,
    isBestSeller: p.isBestSeller ?? false,
    isNewArrival: p.isNewArrival ?? false,
    isGiftHamper: p.isGiftHamper ?? false,
    isLimitedOffer: p.isLimitedOffer ?? false,
    limitedOfferEndsAt: p.limitedOfferEndsAt,
    scheduledPublishAt: p.scheduledPublishAt,
    createdAt: p.createdAt ?? now,
    updatedAt: p.updatedAt ?? now,
    seo: p.seo ?? {},
    relatedProductIds: p.relatedProductIds,
    frequentlyBoughtTogetherIds: p.frequentlyBoughtTogetherIds,
    ...p,
  } as Product;
}

export const products: Product[] = [
  makeProduct({
    id: "p-001",
    slug: "aurora-kundan-bridal-set",
    name: "Aurora Kundan Bridal Set",
    subtitle: "Necklace + Earrings + Maang Tikka",
    description:
      "A breathtaking 3-piece bridal set inspired by Mughal craftsmanship. Each kundan stone is hand-set in a gold-tone alloy base, with delicate pearl drops that sway with every movement. Designed for the bride who wants to feel like royalty on her big day.",
    highlights: [
      "Hand-set Kundan stones",
      "Gold-tone alloy base",
      "Freshwater-look pearl drops",
      "Includes necklace, earrings, and maang tikka",
      "Adjustable dori for perfect fit",
    ],
    specs: [
      { label: "Material", value: "Brass alloy, gold-plated" },
      { label: "Stones", value: "Kundan + faux pearls" },
      { label: "Weight", value: "180g (set)" },
      { label: "Closure", value: "Adjustable hook" },
      { label: "Packaging", value: "Premium velvet box" },
    ],
    basePrice: 4999,
    compareAtPrice: 8999,
    costPrice: 2200,
    category: "necklaces",
    collectionIds: ["col-bridal"],
    tags: ["bridal", "kundan", "wedding", "statement"],
    images: [
      { id: "p1-1", url: img("photo-1606800052052-a08af7148866", 1200), alt: "Aurora Kundan Bridal Set — main" },
      { id: "p1-2", url: img("photo-1611652022419-a9419f74343d", 1200), alt: "Aurora Kundan Bridal Set — side" },
      { id: "p1-3", url: img("photo-1599643478518-a784e5dc4c8f", 1200), alt: "Aurora Kundan Bridal Set — detail" },
      { id: "p1-4", url: img("photo-1535632066927-ab7c11ab949d", 1200), alt: "Aurora Kundan Bridal Set — model" },
    ],
    variants: [
      { id: "v1-gold", name: "Color", value: "Gold", swatch: "#C9A35B", sku: "AUR-P001-G", stock: 12 },
      { id: "v1-rose", name: "Color", value: "Rose Gold", swatch: "#B76E79", sku: "AUR-P001-R", stock: 8 },
      { id: "v1-silver", name: "Color", value: "Silver", swatch: "#C0C0C0", sku: "AUR-P001-S", stock: 5 },
    ],
    rating: 4.9,
    reviewCount: 142,
    isFeatured: true,
    isBestSeller: true,
    relatedProductIds: ["p-002", "p-006", "p-007"],
    frequentlyBoughtTogetherIds: ["p-006", "p-013"],
  }),
  makeProduct({
    id: "p-002",
    slug: "royal-polki-choker",
    name: "Royal Polki Choker",
    subtitle: "Uncut diamond-inspired choker",
    description:
      "Inspired by the uncut polki jewelry of Rajput royalty, this choker sits close to the neck for a regal, contemporary silhouette. Each stone is foil-backed to maximize brilliance, and the intricate meenakari work on the reverse is a hidden detail you'll love.",
    highlights: ["Foil-backed polki stones", "Reverse meenakari work", "Velvet backing for comfort", "Adjustable thread"],
    specs: [
      { label: "Material", value: "Brass, gold-plated" },
      { label: "Stones", value: "Polki-style glass" },
      { label: "Length", value: "32cm + extender" },
    ],
    basePrice: 3499,
    compareAtPrice: 5999,
    category: "necklaces",
    collectionIds: ["col-bridal", "col-festive"],
    tags: ["choker", "polki", "festive"],
    images: [
      { id: "p2-1", url: img("photo-1617038220319-276b5e8a1f42", 1200), alt: "Royal Polki Choker — main" },
      { id: "p2-2", url: img("photo-1599643478518-a784e5dc4c8f", 1200), alt: "Royal Polki Choker — detail" },
      { id: "p2-3", url: img("photo-1611652022419-a9419f74343d", 1200), alt: "Royal Polki Choker — model" },
    ],
    variants: [
      { id: "v2-gold", name: "Color", value: "Gold", swatch: "#C9A35B", sku: "AUR-P002-G", stock: 15 },
      { id: "v2-emerald", name: "Color", value: "Emerald", swatch: "#0F7B5A", sku: "AUR-P002-E", stock: 6 },
    ],
    rating: 4.8,
    reviewCount: 98,
    isFeatured: true,
    isBestSeller: true,
    relatedProductIds: ["p-001", "p-006"],
  }),
  makeProduct({
    id: "p-003",
    slug: "noor-pearl-jhumkas",
    name: "Noor Pearl Jhumkas",
    subtitle: "Traditional jhumkas with pearl drops",
    description:
      "These timeless jhumkas combine the classic bell shape with cascading pearl drops that catch light beautifully. The perfect finish to a festive saree or anarkali.",
    highlights: ["Bell-shaped jhumka", "Cascading pearl drops", "Lightweight for all-day wear", "Push-back closure"],
    specs: [
      { label: "Material", value: "Brass, gold-plated" },
      { label: "Stones", value: "Pearl + faux ruby" },
      { label: "Drop length", value: "5cm" },
    ],
    basePrice: 1499,
    compareAtPrice: 2499,
    category: "earrings",
    collectionIds: ["col-festive"],
    tags: ["jhumkas", "pearl", "festive", "earrings"],
    images: [
      { id: "p3-1", url: img("photo-1535632066927-ab7c11ab949d", 1200), alt: "Noor Pearl Jhumkas — main" },
      { id: "p3-2", url: img("photo-1611652022419-a9419f74343d", 1200), alt: "Noor Pearl Jhumkas — detail" },
    ],
    variants: [
      { id: "v3-gold", name: "Color", value: "Gold", swatch: "#C9A35B", sku: "AUR-P003-G", stock: 30 },
    ],
    rating: 4.7,
    reviewCount: 65,
    isFeatured: true,
    isNewArrival: true,
  }),
  makeProduct({
    id: "p-004",
    slug: "meena-chandbali",
    name: "Meena Chandbali",
    subtitle: "Crescent moon earrings with meenakari",
    description:
      "These crescent-shaped chandbalis are a love letter to old Hyderabad. Hand-painted meenakari in royal blue and ruby red sits beneath clear stones for a layered, dimensional look.",
    highlights: ["Hand-painted meenakari", "Crescent chandbali shape", "Layered stone work", "Lightweight"],
    specs: [
      { label: "Material", value: "Brass, gold-plated" },
      { label: "Stones", value: "Glass + meenakari" },
      { label: "Drop length", value: "6.5cm" },
    ],
    basePrice: 1899,
    compareAtPrice: 3299,
    category: "earrings",
    collectionIds: ["col-festive"],
    tags: ["chandbali", "meenakari", "festive"],
    images: [
      { id: "p4-1", url: img("photo-1588444837495-c6cfeb53f32d", 1200), alt: "Meena Chandbali — main" },
      { id: "p4-2", url: img("photo-1611652022419-a9419f74343d", 1200), alt: "Meena Chandbali — detail" },
    ],
    variants: [
      { id: "v4-gold", name: "Color", value: "Gold/Blue", swatch: "#1E3A8A", sku: "AUR-P004-GB", stock: 18 },
      { id: "v4-ruby", name: "Color", value: "Gold/Ruby", swatch: "#9B1B30", sku: "AUR-P004-GR", stock: 9 },
    ],
    rating: 4.8,
    reviewCount: 47,
    isNewArrival: true,
  }),
  makeProduct({
    id: "p-005",
    slug: "zoya-statement-ring",
    name: "Zoya Statement Ring",
    subtitle: "Adjustable cocktail ring",
    description:
      "A bold cocktail ring that demands attention. The oval centerpiece is surrounded by clear baguettes that catch light from every angle. Adjustable band fits most sizes.",
    highlights: ["Adjustable band", "Oval center stone", "Baguette halo", "Tarnish-resistant finish"],
    specs: [
      { label: "Material", value: "Brass, gold-plated" },
      { label: "Stones", value: "Cubic zirconia" },
      { label: "Size", value: "Adjustable" },
    ],
    basePrice: 899,
    compareAtPrice: 1499,
    category: "rings",
    collectionIds: ["col-festive", "col-everyday"],
    tags: ["ring", "cocktail", "statement"],
    images: [
      { id: "p5-1", url: img("photo-1605100804763-247f67b3557e", 1200), alt: "Zoya Statement Ring — main" },
      { id: "p5-2", url: img("photo-1606800052052-a08af7148866", 1200), alt: "Zoya Statement Ring — on hand" },
    ],
    variants: [
      { id: "v5-gold", name: "Color", value: "Gold", swatch: "#C9A35B", sku: "AUR-P005-G", stock: 40 },
      { id: "v5-silver", name: "Color", value: "Silver", swatch: "#C0C0C0", sku: "AUR-P005-S", stock: 25 },
    ],
    rating: 4.6,
    reviewCount: 89,
    isBestSeller: true,
  }),
  makeProduct({
    id: "p-006",
    slug: "sita-maang-tikka",
    name: "Sita Maang Tikka",
    subtitle: "Bridal maang tikka with pearl chain",
    description:
      "The centerpiece of any bridal look. This maang tikka features a flat kundan center surrounded by pearl drops and a delicate chain that ends in a small pearl. Comfortable enough to wear all day.",
    highlights: ["Kundan center", "Pearl drop chain", "Comfortable backing", "Adjustable length"],
    specs: [
      { label: "Material", value: "Brass, gold-plated" },
      { label: "Stones", value: "Kundan + faux pearl" },
      { label: "Chain length", value: "18cm" },
    ],
    basePrice: 1199,
    compareAtPrice: 1999,
    category: "necklaces",
    collectionIds: ["col-bridal"],
    tags: ["maang tikka", "bridal", "wedding"],
    images: [
      { id: "p6-1", url: img("photo-1599643478518-a784e5dc4c8f", 1200), alt: "Sita Maang Tikka — main" },
      { id: "p6-2", url: img("photo-1606800052052-a08af7148866", 1200), alt: "Sita Maang Tikka — detail" },
    ],
    variants: [
      { id: "v6-gold", name: "Color", value: "Gold", swatch: "#C9A35B", sku: "AUR-P006-G", stock: 22 },
    ],
    rating: 4.9,
    reviewCount: 53,
    isFeatured: true,
  }),
  makeProduct({
    id: "p-007",
    slug: "ratan-kada-bracelet",
    name: "Ratan Kada Bracelet",
    subtitle: "Pair of statement kadas",
    description:
      "A pair of broad kada bangles with intricate kundan and meenakari work. These are the kind of pieces that anchor an entire look — wear them solo or stack with thinner bangles.",
    highlights: ["Set of 2 kadas", "Broad statement design", "Meenakari + kundan work", "Hinge closure"],
    specs: [
      { label: "Material", value: "Brass, gold-plated" },
      { label: "Stones", value: "Kundan + meenakari" },
      { label: "Diameter", value: "2.4 inches" },
    ],
    basePrice: 2499,
    compareAtPrice: 4499,
    category: "bracelets",
    collectionIds: ["col-bridal"],
    tags: ["kada", "bangle", "bridal"],
    images: [
      { id: "p7-1", url: img("photo-1611652022419-a9419f74343d", 1200), alt: "Ratan Kada Bracelet — main" },
      { id: "p7-2", url: img("photo-1535632066927-ab7c11ab949d", 1200), alt: "Ratan Kada Bracelet — pair" },
    ],
    variants: [
      { id: "v7-gold", name: "Color", value: "Gold", swatch: "#C9A35B", sku: "AUR-P007-G", stock: 14 },
    ],
    rating: 4.7,
    reviewCount: 38,
  }),
  makeProduct({
    id: "p-008",
    slug: "sona-stack-bangles",
    name: "Sona Stack Bangles",
    subtitle: "Set of 6 thin bangles",
    description:
      "A stack of six thin gold-tone bangles with delicate stone accents. Perfect for everyday wear or for layering with statement pieces. Comes as a set of 6.",
    highlights: ["Set of 6 bangles", "Delicate stone accents", "Stackable design", "Everyday comfort"],
    specs: [
      { label: "Material", value: "Brass, gold-plated" },
      { label: "Stones", value: "Cubic zirconia" },
      { label: "Diameter", value: "2.2 inches" },
    ],
    basePrice: 1799,
    compareAtPrice: 2999,
    category: "bracelets",
    collectionIds: ["col-festive", "col-everyday"],
    tags: ["bangles", "stack", "everyday"],
    images: [
      { id: "p8-1", url: img("photo-1611652022419-a9419f74343d", 1200), alt: "Sona Stack Bangles — main" },
      { id: "p8-2", url: img("photo-1535632066927-ab7c11ab949d", 1200), alt: "Sona Stack Bangles — stack" },
    ],
    variants: [
      { id: "v8-gold", name: "Color", value: "Gold", swatch: "#C9A35B", sku: "AUR-P008-G", stock: 28 },
    ],
    rating: 4.6,
    reviewCount: 72,
    isNewArrival: true,
  }),
  makeProduct({
    id: "p-009",
    slug: "minimal-line-bracelet",
    name: "Minimal Line Bracelet",
    subtitle: "Everyday gold-tone chain bracelet",
    description:
      "A delicate chain bracelet with a tiny pearl drop. Goes with everything from a kurta to a t-shirt. Adjustable length for the perfect fit.",
    highlights: ["Delicate chain", "Pearl drop", "Adjustable length", "Tarnish-resistant"],
    specs: [
      { label: "Material", value: "Stainless steel, gold-plated" },
      { label: "Length", value: "16cm + 4cm extender" },
    ],
    basePrice: 699,
    compareAtPrice: 1299,
    category: "bracelets",
    collectionIds: ["col-everyday"],
    tags: ["minimal", "everyday", "bracelet"],
    images: [
      { id: "p9-1", url: img("photo-1588444837495-c6cfeb53f32d", 1200), alt: "Minimal Line Bracelet — main" },
      { id: "p9-2", url: img("photo-1535632066927-ab7c11ab949d", 1200), alt: "Minimal Line Bracelet — on wrist" },
    ],
    variants: [
      { id: "v9-gold", name: "Color", value: "Gold", swatch: "#C9A35B", sku: "AUR-P009-G", stock: 50 },
    ],
    rating: 4.5,
    reviewCount: 124,
    isBestSeller: true,
  }),
  makeProduct({
    id: "p-010",
    slug: "everyday-stud-set",
    name: "Everyday Stud Set",
    subtitle: "Set of 4 minimalist studs",
    description:
      "Four pairs of dainty studs in one set — pearl, clear stone, tiny hoop, and gold ball. The perfect rotation for everyday office wear.",
    highlights: ["4 pairs included", "Hypoallergenic posts", "Everyday rotation", "Compact storage box"],
    specs: [
      { label: "Material", value: "Stainless steel, gold-plated" },
      { label: "Back", value: "Push-back, hypoallergenic" },
    ],
    basePrice: 799,
    compareAtPrice: 1499,
    category: "earrings",
    collectionIds: ["col-everyday"],
    tags: ["studs", "minimal", "everyday", "set"],
    images: [
      { id: "p10-1", url: img("photo-1535632066927-ab7c11ab949d", 1200), alt: "Everyday Stud Set — main" },
      { id: "p10-2", url: img("photo-1611652022419-a9419f74343d", 1200), alt: "Everyday Stud Set — set" },
    ],
    variants: [
      { id: "v10-gold", name: "Color", value: "Gold", swatch: "#C9A35B", sku: "AUR-P010-G", stock: 60 },
    ],
    rating: 4.7,
    reviewCount: 156,
    isBestSeller: true,
    isNewArrival: true,
  }),
  makeProduct({
    id: "p-011",
    slug: "delicate-pendant-necklace",
    name: "Delicate Pendant Necklace",
    subtitle: "Tiny evil-eye pendant",
    description:
      "A barely-there chain with a tiny evil-eye pendant. The kind of necklace you put on and forget about — until the compliments start.",
    highlights: ["Dainty chain", "Tiny evil-eye pendant", "Adjustable length", "Tarnish-resistant"],
    specs: [
      { label: "Material", value: "Stainless steel, gold-plated" },
      { label: "Length", value: "40cm + 5cm extender" },
    ],
    basePrice: 649,
    compareAtPrice: 1199,
    category: "necklaces",
    collectionIds: ["col-everyday"],
    tags: ["pendant", "minimal", "everyday"],
    images: [
      { id: "p11-1", url: img("photo-1599643478518-a784e5dc4c8f", 1200), alt: "Delicate Pendant Necklace — main" },
      { id: "p11-2", url: img("photo-1606800052052-a08af7148866", 1200), alt: "Delicate Pendant Necklace — on neck" },
    ],
    variants: [
      { id: "v11-gold", name: "Color", value: "Gold", swatch: "#C9A35B", sku: "AUR-P011-G", stock: 45 },
      { id: "v11-silver", name: "Color", value: "Silver", swatch: "#C0C0C0", sku: "AUR-P011-S", stock: 35 },
    ],
    rating: 4.6,
    reviewCount: 88,
  }),
  makeProduct({
    id: "p-012",
    slug: "twisted-hoop-earrings",
    name: "Twisted Hoop Earrings",
    subtitle: "Textured medium hoops",
    description:
      "Medium-sized hoops with a twisted rope texture. Polished but not flashy — the kind of earring that becomes your signature.",
    highlights: ["Twisted texture", "Medium 3cm diameter", "Hinged closure", "Lightweight"],
    specs: [
      { label: "Material", value: "Stainless steel, gold-plated" },
      { label: "Diameter", value: "3cm" },
    ],
    basePrice: 599,
    compareAtPrice: 999,
    category: "earrings",
    collectionIds: ["col-everyday"],
    tags: ["hoops", "everyday", "minimal"],
    images: [
      { id: "p12-1", url: img("photo-1588444837495-c6cfeb53f32d", 1200), alt: "Twisted Hoop Earrings — main" },
      { id: "p12-2", url: img("photo-1535632066927-ab7c11ab949d", 1200), alt: "Twisted Hoop Earrings — on ear" },
    ],
    variants: [
      { id: "v12-gold", name: "Color", value: "Gold", swatch: "#C9A35B", sku: "AUR-P012-G", stock: 55 },
      { id: "v12-silver", name: "Color", value: "Silver", swatch: "#C0C0C0", sku: "AUR-P012-S", stock: 40 },
    ],
    rating: 4.5,
    reviewCount: 67,
    isNewArrival: true,
  }),
  // Gift Hampers
  makeProduct({
    id: "p-013",
    slug: "festive-joy-hamper",
    name: "Festive Joy Hamper",
    subtitle: "Necklace + Earrings + Diya + Sweets",
    description:
      "A thoughtfully curated hamper for Diwali and festive gifting. Includes a gold-tone necklace set, a hand-painted diya, artisanal kaju katli, and a personalized note — all packed in a premium reusable box.",
    highlights: ["Necklace + earring set included", "Hand-painted diya", "500g kaju katli", "Personalized gift note", "Premium reusable box"],
    specs: [
      { label: "Hamper contents", value: "Jewelry set, diya, sweets, note" },
      { label: "Box size", value: "30 × 20 × 8 cm" },
      { label: "Weight", value: "1.2kg" },
    ],
    basePrice: 2999,
    compareAtPrice: 4999,
    category: "gift-hampers",
    collectionIds: ["col-hampers"],
    tags: ["hamper", "festive", "diwali", "gift"],
    images: [
      { id: "p13-1", url: img("photo-1549465220-1a8b9238cd48", 1200), alt: "Festive Joy Hamper — main" },
      { id: "p13-2", url: img("photo-1513885535751-8b9238bd3458", 1200), alt: "Festive Joy Hamper — contents" },
      { id: "p13-3", url: img("photo-1606800052052-a08af7148866", 1200), alt: "Festive Joy Hamper — jewelry" },
    ],
    variants: [
      { id: "v13-gold", name: "Color", value: "Gold", swatch: "#C9A35B", sku: "AUR-P013-G", stock: 18 },
    ],
    rating: 4.9,
    reviewCount: 41,
    isGiftHamper: true,
    isFeatured: true,
    isBestSeller: true,
  }),
  makeProduct({
    id: "p-014",
    slug: "bridal-gift-hamper",
    name: "Bridal Gift Hamper",
    subtitle: "Premium jewelry hamper for the bride",
    description:
      "The ultimate bridal gift — a curated hamper with a kundan set, bangles, maang tikka, scented candle, and a silk pouch. Designed for sisters, friends, and family gifting the bride.",
    highlights: ["3-piece jewelry set", "Pair of kadas", "Scented soy candle", "Silk pouch", "Premium gift box"],
    specs: [
      { label: "Hamper contents", value: "Jewelry set, kada, candle, pouch" },
      { label: "Box size", value: "35 × 25 × 10 cm" },
    ],
    basePrice: 5999,
    compareAtPrice: 9999,
    category: "gift-hampers",
    collectionIds: ["col-hampers"],
    tags: ["hamper", "bridal", "wedding-gift", "premium"],
    images: [
      { id: "p14-1", url: img("photo-1513885535751-8b9238bd3458", 1200), alt: "Bridal Gift Hamper — main" },
      { id: "p14-2", url: img("photo-1549465220-1a8b9238cd48", 1200), alt: "Bridal Gift Hamper — contents" },
    ],
    variants: [
      { id: "v14-gold", name: "Color", value: "Gold", swatch: "#C9A35B", sku: "AUR-P014-G", stock: 8 },
    ],
    rating: 5.0,
    reviewCount: 22,
    isGiftHamper: true,
    isFeatured: true,
  }),
  makeProduct({
    id: "p-015",
    slug: "corporate-gift-hamper",
    name: "Corporate Gift Hamper",
    subtitle: "Elegant office gifting — set of 1",
    description:
      "Sleek, professional, and universally appreciated. Includes a minimalist bracelet, premium notebook, metal pen, and artisanal coffee — packed in a matte black box with a custom logo option (bulk orders).",
    highlights: ["Minimalist bracelet", "A5 hardcover notebook", "Metal ball-pen", "100g artisanal coffee", "Custom logo option (bulk)"],
    specs: [
      { label: "Hamper contents", value: "Bracelet, notebook, pen, coffee" },
      { label: "Box size", value: "28 × 22 × 6 cm" },
    ],
    basePrice: 1799,
    compareAtPrice: 2799,
    category: "gift-hampers",
    collectionIds: ["col-hampers"],
    tags: ["hamper", "corporate", "gifting", "bulk"],
    images: [
      { id: "p15-1", url: img("photo-1513885535751-8b9238bd3458", 1200), alt: "Corporate Gift Hamper — main" },
      { id: "p15-2", url: img("photo-1549465220-1a8b9238cd48", 1200), alt: "Corporate Gift Hamper — contents" },
    ],
    variants: [
      { id: "v15-gold", name: "Color", value: "Gold", swatch: "#C9A35B", sku: "AUR-P015-G", stock: 30 },
      { id: "v15-silver", name: "Color", value: "Silver", swatch: "#C0C0C0", sku: "AUR-P015-S", stock: 25 },
    ],
    rating: 4.7,
    reviewCount: 34,
    isGiftHamper: true,
    isNewArrival: true,
  }),
  makeProduct({
    id: "p-016",
    slug: "rakhi-special-hamper",
    name: "Rakhi Special Hamper",
    subtitle: "Rakhi + sweets + bracelet",
    description:
      "A heartfelt Raksha Bandhan hamper — designer rakhi, kaju roll 250g, a minimalist bracelet for the sister, and a personalized note. Ships with roli-chawal pouch.",
    highlights: ["Designer rakhi", "250g kaju roll", "Minimalist bracelet", "Roli-chawal pouch", "Personalized note"],
    specs: [
      { label: "Hamper contents", value: "Rakhi, sweets, bracelet, roli" },
      { label: "Box size", value: "25 × 18 × 6 cm" },
    ],
    basePrice: 1299,
    compareAtPrice: 1999,
    category: "gift-hampers",
    collectionIds: ["col-hampers"],
    tags: ["hamper", "rakhi", "festival", "gift"],
    images: [
      { id: "p16-1", url: img("photo-1549465220-1a8b9238cd48", 1200), alt: "Rakhi Special Hamper — main" },
      { id: "p16-2", url: img("photo-1513885535751-8b9238bd3458", 1200), alt: "Rakhi Special Hamper — contents" },
    ],
    variants: [
      { id: "v16-gold", name: "Color", value: "Gold", swatch: "#C9A35B", sku: "AUR-P016-G", stock: 40 },
    ],
    rating: 4.8,
    reviewCount: 56,
    isGiftHamper: true,
    isLimitedOffer: true,
    limitedOfferEndsAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
  }),
];

// ---------------------------------------------------------------------------
// Hero slider
// ---------------------------------------------------------------------------
export const heroSlides: HeroSlide[] = [
  {
    id: "h1",
    desktopImage: img("photo-1606800052052-a08af7148866", 1920),
    mobileImage: img("photo-1606800052052-a08af7148866", 800),
    heading: "The Bridal Edit",
    subheading: "Heirloom-inspired jewelry, handcrafted for the modern bride.",
    buttonText: "Shop Bridal",
    buttonUrl: "/collections/bridal-collection",
    overlayOpacity: 35,
    textAlignment: "left",
    sortOrder: 1,
    enabled: true,
  },
  {
    id: "h2",
    desktopImage: img("photo-1617038220319-276b5e8a1f42", 1920),
    mobileImage: img("photo-1617038220319-276b5e8a1f42", 800),
    heading: "Festive Glow",
    subheading: "Pieces that catch every light — and every glance.",
    buttonText: "Discover Festive",
    buttonUrl: "/collections/festive-glow",
    overlayOpacity: 40,
    textAlignment: "center",
    sortOrder: 2,
    enabled: true,
  },
  {
    id: "h3",
    desktopImage: img("photo-1513885535751-8b9238bd3458", 1920),
    mobileImage: img("photo-1513885535751-8b9238bd3458", 800),
    heading: "Curated Hampers",
    subheading: "Thoughtful gifts, beautifully bundled. For every occasion.",
    buttonText: "Shop Hampers",
    buttonUrl: "/collections/curated-hampers",
    overlayOpacity: 35,
    textAlignment: "right",
    sortOrder: 3,
    enabled: true,
  },
];

// ---------------------------------------------------------------------------
// Announcement bar
// ---------------------------------------------------------------------------
export const announcements: AnnouncementItem[] = [
  { id: "a1", text: "✦ Free shipping on all prepaid orders above ₹999", url: "/shipping-policy", enabled: true, sortOrder: 1 },
  { id: "a2", text: "✦ Use code AURORA15 for 15% off on prepaid orders", url: "/checkout", enabled: true, sortOrder: 2 },
  { id: "a3", text: "✦ COD available across India • 7-day hassle-free returns", url: "/refund-policy", enabled: true, sortOrder: 3 },
  { id: "a4", text: "✦ New arrivals every week — shop the latest drops", url: "/collections", enabled: true, sortOrder: 4 },
];

// ---------------------------------------------------------------------------
// Testimonials
// ---------------------------------------------------------------------------
export const testimonials: Testimonial[] = [
  {
    id: "t1",
    authorName: "Priya Sharma",
    authorLocation: "Mumbai",
    rating: 5,
    body: "The bridal set was even more beautiful in person. Got endless compliments at my wedding. The packaging itself felt like a luxury experience.",
    productId: "p-001",
    createdAt: "2026-06-15T10:00:00.000Z",
  },
  {
    id: "t2",
    authorName: "Ananya Mehta",
    authorLocation: "Bengaluru",
    rating: 5,
    body: "Ordered the Festive Joy Hamper for my mother — she was thrilled. Quality of jewelry + sweets was top notch. Will be back for more.",
    productId: "p-013",
    createdAt: "2026-06-12T10:00:00.000Z",
  },
  {
    id: "t3",
    authorName: "Riya Kapoor",
    authorLocation: "Delhi",
    rating: 5,
    body: "I've ordered 4 times now and the quality is consistently excellent. The minimal pieces are perfect for everyday office wear.",
    productId: "p-011",
    createdAt: "2026-06-08T10:00:00.000Z",
  },
  {
    id: "t4",
    authorName: "Sneha Reddy",
    authorLocation: "Hyderabad",
    rating: 5,
    body: "Customer service was so helpful when I needed to exchange a size. Quick response, no fuss. This is how online jewelry shopping should be.",
    productId: "p-007",
    createdAt: "2026-06-03T10:00:00.000Z",
  },
  {
    id: "t5",
    authorName: "Kavya Nair",
    authorLocation: "Kochi",
    rating: 5,
    body: "Gifted the corporate hampers to my team — everyone loved them. Premium quality and the customization option was a great touch.",
    productId: "p-015",
    createdAt: "2026-05-28T10:00:00.000Z",
  },
  {
    id: "t6",
    authorName: "Meera Iyer",
    authorLocation: "Pune",
    rating: 5,
    body: "The polki choker is stunning. Wear it with everything — sarees, kurtis, even a plain black dress. Versatile and beautiful.",
    productId: "p-002",
    createdAt: "2026-05-20T10:00:00.000Z",
  },
];

// ---------------------------------------------------------------------------
// Instagram gallery
// ---------------------------------------------------------------------------
export const instagramPosts: InstagramPost[] = [
  { id: "ig1", imageUrl: img("photo-1606800052052-a08af7148866", 600), caption: "Bridal season is here ✨", permalink: "https://instagram.com", likes: 1240 },
  { id: "ig2", imageUrl: img("photo-1617038220319-276b5e8a1f42", 600), caption: "Polki love 💛", permalink: "https://instagram.com", likes: 980 },
  { id: "ig3", imageUrl: img("photo-1535632066927-ab7c11ab949d", 600), caption: "Everyday studs for everyday beauty", permalink: "https://instagram.com", likes: 765 },
  { id: "ig4", imageUrl: img("photo-1549465220-1a8b9238cd48", 600), caption: "Gift hampers that wow 🎁", permalink: "https://instagram.com", likes: 1520 },
  { id: "ig5", imageUrl: img("photo-1611652022419-a9419f74343d", 600), caption: "Stack game strong", permalink: "https://instagram.com", likes: 642 },
  { id: "ig6", imageUrl: img("photo-1588444837495-c6cfeb53f32d", 600), caption: "Minimal Mondays", permalink: "https://instagram.com", likes: 890 },
];

// ---------------------------------------------------------------------------
// Coupons
// ---------------------------------------------------------------------------
export const coupons: Coupon[] = [
  {
    id: "c1",
    code: "AURORA15",
    type: "percentage",
    value: 15,
    minOrderValue: 999,
    maxDiscount: 1500,
    usageLimit: 1000,
    usedCount: 142,
    isActive: true,
    description: "15% off on all prepaid orders. Max discount ₹1500.",
    appliesTo: "all",
  },
  {
    id: "c2",
    code: "FESTIVE10",
    type: "percentage",
    value: 10,
    minOrderValue: 1499,
    maxDiscount: 1000,
    usageLimit: 500,
    usedCount: 67,
    isActive: true,
    description: "10% off on festive collection orders above ₹1499.",
    appliesTo: "collection",
    targetId: "col-festive",
  },
  {
    id: "c3",
    code: "FLAT200",
    type: "flat",
    value: 200,
    minOrderValue: 1999,
    usageLimit: 1000,
    usedCount: 89,
    isActive: true,
    description: "Flat ₹200 off on orders above ₹1999.",
    appliesTo: "all",
  },
  {
    id: "c4",
    code: "WELCOME100",
    type: "flat",
    value: 100,
    minOrderValue: 499,
    usageLimit: 10000,
    usedCount: 245,
    isActive: true,
    description: "Flat ₹100 off on your first order above ₹499.",
    appliesTo: "all",
  },
];

// ---------------------------------------------------------------------------
// Multi-buy offers
// ---------------------------------------------------------------------------
export const multiBuyOffers: MultiBuyOffer[] = [
  { id: "mb1", minQty: 2, discountPercent: 10, label: "Buy 2, get 10% extra off" },
  { id: "mb2", minQty: 3, discountPercent: 15, label: "Buy 3, get 15% extra off" },
];

// ---------------------------------------------------------------------------
// Homepage sections (modular, drag-and-drop reorderable in admin)
// ---------------------------------------------------------------------------
export const homepageSections: HomepageSection[] = [
  { id: "s1", type: "announcement_bar", enabled: true, sortOrder: 1, config: {} },
  { id: "s2", type: "hero_slider", enabled: true, sortOrder: 2, config: { autoplay: true, speed: 5000, fade: true } },
  { id: "s3", type: "featured_collections", enabled: true, sortOrder: 3, config: { title: "Featured Collections" } },
  { id: "s4", type: "shop_by_category", enabled: true, sortOrder: 4, config: { title: "Shop by Category" } },
  { id: "s5", type: "image_with_text", enabled: true, sortOrder: 5, config: {
    image: img("photo-1599643478518-a784e5dc4c8f", 1200),
    heading: "Crafted by hand. Made to last.",
    body: "Every piece is hand-set, hand-polished, and inspected by our master karigars before it reaches you. No mass production. No shortcuts.",
    buttonText: "Our Craft",
    buttonUrl: "/about",
    alignment: "left",
  } },
  { id: "s6", type: "best_sellers", enabled: true, sortOrder: 6, config: { title: "Best Sellers", limit: 8 } },
  { id: "s7", type: "limited_offers", enabled: true, sortOrder: 7, config: { title: "Limited Time Offers" } },
  { id: "s8", type: "featured_products", enabled: true, sortOrder: 8, config: { title: "Featured Products", limit: 8 } },
  { id: "s9", type: "gift_hampers", enabled: true, sortOrder: 9, config: { title: "Gift Hampers" } },
  { id: "s10", type: "new_arrivals", enabled: true, sortOrder: 10, config: { title: "New Arrivals", limit: 8 } },
  { id: "s11", type: "video", enabled: true, sortOrder: 11, config: {
    videoUrl: "https://videos.pexels.com/video-files/3015526/3015526-uhd_2560_1440_24fps.mp4",
    poster: img("photo-1606800052052-a08af7148866", 1920),
    heading: "Behind the craft",
    subheading: "Watch how our jewelry comes to life",
  } },
  { id: "s12", type: "testimonials", enabled: true, sortOrder: 12, config: { title: "Loved by thousands" } },
  { id: "s13", type: "instagram_gallery", enabled: true, sortOrder: 13, config: { title: "@auroraandco", handle: "@auroraandco" } },
  { id: "s14", type: "brand_story", enabled: true, sortOrder: 14, config: {
    heading: "Our Story",
    body: "Aurora & Co. was born in 2019 from a simple belief — that beautiful jewelry shouldn't require a luxury price tag. We work directly with master karigars across India, cutting out the middlemen, so you get heirloom-quality pieces at honest prices.",
    image: img("photo-1513885535751-8b9238bd3458", 1200),
    stats: [{ value: "50,000+", label: "Happy customers" }, { value: "4.8★", label: "Average rating" }, { value: "300+", label: "Unique designs" }],
  } },
  { id: "s15", type: "newsletter", enabled: true, sortOrder: 15, config: { title: "Join the Aurora Circle" } },
];

// ---------------------------------------------------------------------------
// Theme settings
// ---------------------------------------------------------------------------
export const defaultThemeSettings: ThemeSettings = {
  primaryColor: "#6B2D5C",
  accentColor: "#B8956A",
  fontHeading: "Playfair Display",
  fontBody: "Inter",
  buttonRadius: 4,
  containerWidth: 1280,
  sectionSpacing: 64,
  announcement: { enabled: true, background: "#6B2D5C", text: "#FFFFFF" },
};

// ---------------------------------------------------------------------------
// Lookup helpers
// ---------------------------------------------------------------------------
export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug && p.isPublished);
}
export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id && p.isPublished);
}
export function getCollectionBySlug(slug: string): Collection | undefined {
  return collections.find((c) => c.slug === slug);
}
export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}
export function getProductsByCollection(collectionId: string): Product[] {
  const col = collections.find((c) => c.id === collectionId);
  if (!col) return [];
  return col.productIds.map((id) => products.find((p) => p.id === id)).filter(Boolean) as Product[];
}
export function getProductsByCategory(categorySlug: string): Product[] {
  return products.filter((p) => p.category === categorySlug && p.isPublished);
}
export function getRelatedProducts(productId: string, limit = 4): Product[] {
  const p = products.find((x) => x.id === productId);
  if (!p) return [];
  const related = (p.relatedProductIds ?? []).map((id) => products.find((x) => x.id === id)).filter(Boolean) as Product[];
  if (related.length >= limit) return related.slice(0, limit);
  // fill with same-category
  const sameCategory = products.filter((x) => x.id !== productId && x.category === p.category && !related.find((r) => r.id === x.id));
  return [...related, ...sameCategory].slice(0, limit);
}
export function getCouponByCode(code: string): Coupon | undefined {
  return coupons.find((c) => c.code.toLowerCase() === code.toLowerCase() && c.isActive);
}
