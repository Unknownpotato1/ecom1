import type { Metadata } from "next";
import { Inter, Bricolage_Grotesque } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";
import { QueryProvider } from "@/components/providers/query-provider";
import { StoreProvider } from "@/components/providers/store-provider";
import { AuthProvider } from "@/components/providers/auth-provider";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { BottomNav } from "@/components/layout/bottom-nav";
import { CartDrawer } from "@/components/cart/cart-drawer";
import { SearchDrawer } from "@/components/search/search-drawer";
import { WishlistDrawer } from "@/components/wishlist/wishlist-drawer";
import { ExitIntentPopup } from "@/components/common/exit-intent-popup";
import { RecentlyViewedSync } from "@/components/common/recently-viewed-sync";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "Aurora & Co. — Handcrafted Artificial Jewelry & Gift Hampers",
    template: "%s | Aurora & Co.",
  },
  description:
    "Discover handcrafted artificial jewelry, premium gift hampers, and timeless treasures at Aurora & Co. Free shipping, COD available, 7-day hassle-free returns.",
  keywords: [
    "artificial jewelry",
    "gift hampers",
    "imitation jewelry",
    "online jewelry store India",
    "premium gifts",
    "Aurora jewelry",
  ],
  authors: [{ name: "Aurora & Co." }],
  metadataBase: new URL("https://aurora-co.example.com"),
  openGraph: {
    title: "Aurora & Co. — Handcrafted Artificial Jewelry & Gift Hampers",
    description:
      "Discover handcrafted artificial jewelry, premium gift hampers, and timeless treasures. Free shipping, COD available, 7-day hassle-free returns.",
    url: "https://aurora-co.example.com",
    siteName: "Aurora & Co.",
    type: "website",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "Aurora & Co.",
    description: "Handcrafted artificial jewelry & premium gift hampers.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${bricolage.variable} font-sans antialiased bg-background text-foreground min-h-screen min-h-dvh flex flex-col`}
      >
        <QueryProvider>
          <AuthProvider>
            <StoreProvider>
              {/* Skip link for accessibility */}
              <a
                href="#main-content"
                className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:bg-primary focus:text-primary-foreground focus:px-4 focus:py-2 focus:rounded-md"
              >
                Skip to content
              </a>
              <SiteHeader />
              <main id="main-content" className="flex-1 flex flex-col">
                {children}
              </main>
              <SiteFooter />
              <BottomNav />
              <CartDrawer />
              <SearchDrawer />
              <WishlistDrawer />
              <ExitIntentPopup />
              <RecentlyViewedSync />
              <Toaster />
              <SonnerToaster position="bottom-right" richColors closeButton />
            </StoreProvider>
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
