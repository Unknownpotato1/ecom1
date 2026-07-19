"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, LayoutGrid, Heart, User } from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { label: "Home", href: "/", icon: Home },
  { label: "Collection", href: "/collections", icon: LayoutGrid },
  { label: "Wishlist", href: "/wishlist", icon: Heart },
  { label: "Account", href: "/profile", icon: User },
];

// Bottom navigation — visible on key pages, mobile only.
// The bar background spans full width (standard mobile pattern), but the
// inner grid is constrained to the same max-width + padding as the header
// so icons align with the header content above.
export function BottomNav() {
  const pathname = usePathname();
  const show =
    pathname === "/" ||
    pathname === "/collections" ||
    pathname === "/wishlist" ||
    pathname === "/profile";

  if (!show) return null;

  return (
    <nav
      className={cn(
        "lg:hidden fixed bottom-0 left-0 right-0 z-30 glass border-t border-border",
        "pb-[env(safe-area-inset-bottom)]"
      )}
      aria-label="Bottom navigation"
    >
      {/* Inner container matches the header's max-w-7xl + px-4 sm:px-6 */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid grid-cols-4 h-16">
          {items.map(({ label, href, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex flex-col items-center justify-center gap-0.5 text-[10px] font-medium transition-colors",
                  active ? "text-primary" : "text-muted-foreground"
                )}
              >
                <Icon className={cn("h-5 w-5", active && "fill-primary/15")} />
                <span className="tracking-wide">{label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
