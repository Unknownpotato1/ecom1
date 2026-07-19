// ============================================================================
// Aurora & Co. — Domain Types
// Mirrors the requested Firestore schema (see README).
// ============================================================================

export type ID = string;

export interface Money {
  amount: number; // in INR
  currency: "INR";
}

export interface ImageAsset {
  id: ID;
  url: string;
  alt: string;
  width?: number;
  height?: number;
}

export interface ProductVariant {
  id: ID;
  name: string; // e.g. "Color"
  value: string; // e.g. "Rose Gold"
  swatch?: string; // hex color or image url
  sku: string;
  stock: number;
  priceDelta?: number; // extra cost over base price
  imageId?: ID;
}

export interface ProductReview {
  id: ID;
  productId: ID;
  authorName: string;
  authorAvatar?: string;
  rating: number; // 1-5
  title: string;
  body: string;
  images: ImageAsset[];
  isVerified: boolean;
  createdAt: string; // ISO
  helpful?: number;
}

export interface Product {
  id: ID;
  slug: string;
  name: string;
  subtitle?: string;
  description: string;
  highlights: string[];
  specs: { label: string; value: string }[];
  basePrice: number; // INR
  compareAtPrice?: number; // for showing discount
  costPrice?: number;
  sku: string;
  barcode?: string;
  category: string;
  collectionIds: ID[];
  tags: string[];
  images: ImageAsset[];
  videoUrl?: string;
  variants: ProductVariant[];
  hasSizeVariants: boolean;
  sizes: string[];
  rating: number;
  reviewCount: number;
  reviews: ProductReview[];
  inventory: number;
  isPublished: boolean;
  isFeatured: boolean;
  isBestSeller: boolean;
  isNewArrival: boolean;
  isGiftHamper: boolean;
  isLimitedOffer: boolean;
  limitedOfferEndsAt?: string;
  scheduledPublishAt?: string;
  createdAt: string;
  updatedAt: string;
  seo: { title?: string; description?: string; keywords?: string[] };
  relatedProductIds?: ID[];
  frequentlyBoughtTogetherIds?: ID[];
}

export interface Collection {
  id: ID;
  slug: string;
  name: string;
  description: string;
  bannerImage: ImageAsset;
  thumbnail: ImageAsset;
  productIds: ID[];
  sortOrder: number;
  isFeatured: boolean;
  seo: { title?: string; description?: string };
  createdAt: string;
}

export interface Category {
  id: ID;
  slug: string;
  name: string;
  image: ImageAsset;
  productCount: number;
  sortOrder: number;
}

export interface HeroSlide {
  id: ID;
  desktopImage: string;
  mobileImage: string;
  heading: string;
  subheading?: string;
  buttonText?: string;
  buttonUrl?: string;
  overlayOpacity: number; // 0-100
  textAlignment: "left" | "center" | "right";
  sortOrder: number;
  enabled: boolean;
}

export interface AnnouncementItem {
  id: ID;
  text: string;
  url?: string;
  enabled: boolean;
  sortOrder: number;
}

export interface Testimonial {
  id: ID;
  authorName: string;
  authorLocation?: string;
  authorAvatar?: string;
  rating: number;
  body: string;
  productId?: ID;
  createdAt: string;
}

export interface InstagramPost {
  id: ID;
  imageUrl: string;
  caption: string;
  permalink: string;
  likes?: number;
}

export interface Coupon {
  id: ID;
  code: string;
  type: "percentage" | "flat";
  value: number;
  minOrderValue: number;
  maxDiscount?: number;
  usageLimit: number;
  usedCount: number;
  expiresAt?: string;
  isActive: boolean;
  description: string;
  appliesTo: "all" | "collection" | "product";
  targetId?: ID;
}

export interface CartItem {
  productId: ID;
  variantId?: ID;
  quantity: number;
  size?: string;
  // snapshot for fast cart rendering
  snapshot: {
    name: string;
    slug: string;
    image: string;
    price: number;
    variantLabel?: string;
  };
}

export interface Address {
  id: ID;
  fullName: string;
  mobile: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
  type: "home" | "office" | "other";
}

export type OrderStatus =
  | "confirmed"
  | "packed"
  | "shipped"
  | "out_for_delivery"
  | "delivered"
  | "cancelled"
  | "failed";

export interface OrderTimelineEvent {
  status: OrderStatus;
  at: string;
  note?: string;
}

export interface OrderItem {
  productId: ID;
  name: string;
  slug: string;
  image: string;
  variantLabel?: string;
  size?: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Order {
  id: ID;
  orderNumber: string;
  userId?: ID;
  guestEmail: string;
  guestMobile: string;
  items: OrderItem[];
  address: Address;
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  total: number;
  paymentMethod: "prepaid" | "cod" | "partial_cod";
  paymentStatus: "pending" | "paid" | "partial" | "refunded";
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  couponCode?: string;
  giftNote?: string;
  status: OrderStatus;
  timeline: OrderTimelineEvent[];
  estimatedDelivery: string;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: ID;
  email: string;
  name: string;
  mobile?: string;
  avatarUrl?: string;
  role: "customer" | "admin";
  addresses: Address[];
  wishlistProductIds: ID[];
  createdAt: string;
}

export interface MultiBuyOffer {
  id: ID;
  productId?: ID; // undefined = global
  minQty: number;
  discountPercent: number;
  label: string;
}

export interface HomepageSection {
  id: ID;
  type:
    | "hero_slider"
    | "announcement_bar"
    | "featured_collections"
    | "shop_by_category"
    | "featured_products"
    | "best_sellers"
    | "new_arrivals"
    | "gift_hampers"
    | "limited_offers"
    | "image_with_text"
    | "video"
    | "instagram_gallery"
    | "testimonials"
    | "brand_story"
    | "newsletter"
    | "marquee"
    | "custom_html";
  title?: string;
  enabled: boolean;
  config: Record<string, unknown>;
  sortOrder: number;
}

export interface ThemeSettings {
  primaryColor: string;
  accentColor: string;
  fontHeading: string;
  fontBody: string;
  buttonRadius: number;
  containerWidth: number;
  sectionSpacing: number;
  announcement: { enabled: boolean; background: string; text: string };
}

export interface MediaAsset {
  id: ID;
  url: string;
  name: string;
  folder: string;
  size: number;
  width?: number;
  height?: number;
  uploadedAt: string;
  alt?: string;
}
