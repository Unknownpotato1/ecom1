"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Search, ShoppingBag, Heart, User, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useCartStore, useUIStore, useWishlistStore } from "@/lib/stores";
import { useAuth } from "@/components/providers/auth-provider";
import { cn } from "@/lib/utils";

const navLinks = [
  { label: "Necklaces", href: "/collections?category=necklaces" },
  { label: "Earrings", href: "/collections?category=earrings" },
  { label: "Bracelets", href: "/collections?category=bracelets" },
  { label: "Rings", href: "/collections?category=rings" },
  { label: "Bridal Edit", href: "/collections/bridal-collection" },
  { label: "Gift Hampers", href: "/collections/curated-hampers" },
  { label: "About", href: "/about" },
];

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const openCart = useCartStore((s) => s.openCart);
  // IMPORTANT: select the items array, not totalItems() — calling a function
  // inside the selector returns a new value every render and causes an infinite
  // update loop in React 19 + Zustand v5.
  const cartItems = useCartStore((s) => s.items);
  const cartCount = cartItems.reduce((sum, i) => sum + i.quantity, 0);
  const setSearchOpen = useUIStore((s) => s.setSearchOpen);
  const wishlistCount = useWishlistStore((s) => s.ids.length);
  const { user } = useAuth();

  // Skip header on admin routes — admin has its own layout
  const isAdmin = pathname?.startsWith("/admin");

  useEffect(() => {
    if (isAdmin) return;
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isAdmin]);

  useEffect(() => {
    // Close mobile menu when route changes — use a setTimeout to defer state update
    // out of the render commit phase to satisfy react-hooks/set-state-in-effect.
    if (!mobileOpen) return;
    const id = setTimeout(() => setMobileOpen(false), 0);
    return () => clearTimeout(id);
  }, [pathname, mobileOpen]);

  if (isAdmin) return null;

  const isHome = pathname === "/";
  // Header is always solid (glass background) for readability.
  // Previously was transparent on the homepage at top, but that made
  // nav text invisible against light hero images.
  const transparent = false;

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-40 transition-all duration-300",
          transparent
            ? "bg-transparent"
            : "glass border-b border-border/60 shadow-sm"
        )}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Left — hamburger (mobile) + nav (desktop) */}
            <div className="flex items-center gap-6 flex-1">
              <button
                onClick={() => setMobileOpen(true)}
                className="lg:hidden p-2 -ml-2"
                aria-label="Open menu"
              >
                <Menu className="h-5 w-5" />
              </button>
              <nav className="hidden lg:flex items-center gap-6">
                {navLinks.slice(0, 4).map((l) => (
                  <Link
                    key={l.href}
                    href={l.href}
                    className={cn(
                      "text-sm font-medium tracking-wide hover:text-primary transition-colors relative py-1",
                      transparent ? "text-foreground" : "text-foreground"
                    )}
                  >
                    {l.label}
                  </Link>
                ))}
              </nav>
            </div>

            {/* Center — logo */}
            <Link
              href="/"
              className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center"
              aria-label="Aurora & Co. home"
            >
              <span className="font-serif text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight">
                Aurora <span className="text-foreground">& Co.</span>
              </span>
              <span className="hidden sm:block text-[10px] tracking-[0.25em] uppercase text-muted-foreground -mt-1">
                Jewelry & Hampers
              </span>
            </Link>

            {/* Right — search, wishlist, bag, account */}
            <div className="flex items-center gap-1 sm:gap-2 flex-1 justify-end">
              <button
                onClick={() => setSearchOpen(true)}
                className="p-2 hover:bg-accent/20 rounded-full transition-colors"
                aria-label="Search"
              >
                <Search className="h-5 w-5" />
              </button>
              <Link
                href="/wishlist"
                className="p-2 hover:bg-accent/20 rounded-full transition-colors relative hidden sm:block"
                aria-label="Wishlist"
              >
                <Heart className="h-5 w-5" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-primary text-primary-foreground text-[10px] font-semibold rounded-full h-4 min-w-4 px-1 flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </Link>
              <Link
                href={user ? "/profile" : "/login"}
                className="p-2 hover:bg-accent/20 rounded-full transition-colors hidden sm:block"
                aria-label="Account"
              >
                <User className="h-5 w-5" />
              </Link>
              <button
                onClick={openCart}
                className="p-2 hover:bg-accent/20 rounded-full transition-colors relative"
                aria-label="Open cart"
              >
                <ShoppingBag className="h-5 w-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-primary text-primary-foreground text-[10px] font-semibold rounded-full h-4 min-w-4 px-1 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="w-[300px] sm:w-[340px] p-0">
          <SheetHeader className="p-6 border-b">
            <SheetTitle className="font-serif text-2xl">
              Aurora <span className="text-foreground">& Co.</span>
            </SheetTitle>
          </SheetHeader>
          <nav className="flex flex-col p-2">
            {navLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="px-4 py-3 text-base font-medium hover:bg-accent/20 rounded-lg transition-colors"
              >
                {l.label}
              </Link>
            ))}
            <div className="border-t mt-2 pt-2">
              <Link href="/wishlist" className="px-4 py-3 flex items-center gap-3 hover:bg-accent/20 rounded-lg transition-colors">
                <Heart className="h-5 w-5" /> Wishlist
                {wishlistCount > 0 && (
                  <span className="ml-auto bg-primary text-primary-foreground text-xs rounded-full px-2 py-0.5">
                    {wishlistCount}
                  </span>
                )}
              </Link>
              <Link href={user ? "/profile" : "/login"} className="px-4 py-3 flex items-center gap-3 hover:bg-accent/20 rounded-lg transition-colors">
                <User className="h-5 w-5" /> {user ? "My Account" : "Sign In"}
              </Link>
              <Link href="/order-tracking" className="px-4 py-3 flex items-center gap-3 hover:bg-accent/20 rounded-lg transition-colors">
                Track Order
              </Link>
              <Link href="/contact" className="px-4 py-3 flex items-center gap-3 hover:bg-accent/20 rounded-lg transition-colors">
                Contact
              </Link>
            </div>
          </nav>
          <div className="absolute bottom-0 left-0 right-0 p-6 border-t bg-muted/30">
            <p className="text-xs text-muted-foreground">
              Need help? Call <a href="tel:+918000000000" className="text-primary font-medium">+91 80000 00000</a>
            </p>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
