"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Home, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/providers/auth-provider";

function AdminPageContent() {
  const { user, isAdmin, isLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/admin/dashboard";
  const [showNotFound, setShowNotFound] = useState(false);

  useEffect(() => {
    if (isLoading) return;
    // Defer setState to microtask to satisfy react-hooks/set-state-in-effect rule.
    const id = setTimeout(() => {
      if (user && isAdmin) {
        router.replace(next);
      } else {
        setShowNotFound(true);
      }
    }, 0);
    return () => clearTimeout(id);
  }, [user, isAdmin, isLoading, next, router]);

  // While loading auth state, render a blank page (no admin hints leaked).
  if (isLoading && !showNotFound) {
    return <div className="min-h-[60vh]" />;
  }

  // Non-admin or signed-out user — show the standard 404 page.
  // This is intentionally indistinguishable from a real 404.
  if (showNotFound) {
    return (
      <div className="mx-auto max-w-2xl px-4 sm:px-6 py-20 lg:py-32 text-center">
        <p className="font-serif text-[10rem] sm:text-[14rem] leading-none font-bold text-gold-gradient">404</p>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold -mt-4">Page Not Found</h1>
        <p className="text-muted-foreground mt-3 max-w-md mx-auto">
          The page you&rsquo;re looking for doesn&rsquo;t exist or has been moved. Let&rsquo;s get you back on track.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild size="lg">
            <Link href="/"><Home className="h-4 w-4 mr-2" /> Back to Home</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/collections"><Search className="h-4 w-4 mr-2" /> Browse Collections</Link>
          </Button>
        </div>
      </div>
    );
  }

  // Fallback (shouldn't reach here)
  return <div className="min-h-[60vh]" />;
}

export default function AdminPage() {
  return (
    <Suspense fallback={<div className="min-h-[60vh]" />}>
      <AdminPageContent />
    </Suspense>
  );
}
