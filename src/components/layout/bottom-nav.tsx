"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Home, LayoutGrid, Heart, User, Menu } from "lucide-react";
import { useUIStore } from "@/lib/stores";
import { cn } from "@/lib/utils";

const items = [
  { label: "Home", href: "/", icon: Home },
  { label: "Shop", href: "/collections", icon: LayoutGrid },
  { label: "Wishlist", href: "/wishlist", icon: Heart },
  { label: "Account", href: "/profile", icon: User },
];

// Bottom navigation — visible only on homepage on mobile.
export function BottomNav() {
  const pathname = usePathname();
  const [hydrated, setHydrated] = useState(false);
  useState(() => setHydrated(true));
  // Show only on / homepage and on mobile (hidden on lg+)
  const show = pathname === "/" || pathname === "/collections" || pathname === "/wishlist" || pathname === "/profile";

  if (!show) return null;

  return (
    <nav
      className={cn(
        "lg:hidden fixed bottom-0 left-0 right-0 z-30 glass border-t border-border",
        "pb-[env(safe-area-inset-bottom)]"
      )}
      aria-label="Bottom navigation"
    >
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
    </nav>
  );
}
