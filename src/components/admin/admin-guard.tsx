"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/components/providers/auth-provider";
import { Button } from "@/components/ui/button";

/**
 * AdminGuard — wraps any admin route.
 *
 * Behavior:
 * - While auth state is loading → minimal spinner (no admin hints leaked).
 * - If not signed in → redirect to /login (the standard customer login page).
 * - If signed in but NOT the admin → show 404 (the page does not exist for them).
 * - If admin → render children.
 *
 * The 404 is intentional: non-admins must never see that an admin area exists.
 */
export function AdminGuard({ children }: { children: React.ReactNode }) {
  const { user, isLoading, isAdmin } = useAuth();
  const router = useRouter();
  const [redirecting, setRedirecting] = useState(false);

  useEffect(() => {
    if (isLoading) return;
    if (!user) {
      // Not signed in — send to the regular login page.
      // No mention of admin anywhere.
      router.replace("/login");
      const id = setTimeout(() => setRedirecting(true), 0);
      return () => clearTimeout(id);
    }
  }, [isLoading, user, router]);

  if (isLoading || redirecting) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="size-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!user) {
    return null; // redirect in progress
  }

  // Signed in but NOT the admin → show 404 (indistinguishable from a real 404).
  if (!isAdmin) {
    return (
      <div className="mx-auto max-w-2xl px-4 sm:px-6 py-20 lg:py-32 text-center">
        <p className="font-serif text-[10rem] sm:text-[14rem] leading-none font-bold text-gold-gradient">404</p>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold -mt-4">Page Not Found</h1>
        <p className="text-muted-foreground mt-3 max-w-md mx-auto">
          The page you&rsquo;re looking for doesn&rsquo;t exist or has been moved.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild size="lg">
            <Link href="/">Back to Home</Link>
          </Button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
