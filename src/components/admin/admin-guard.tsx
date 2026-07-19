"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { ShieldAlert, Loader2, ArrowLeft } from "lucide-react";
import { useAuth } from "@/components/providers/auth-provider";
import { Button } from "@/components/ui/button";
import { ADMIN_EMAIL } from "@/lib/auth";

/**
 * AdminGuard — wraps any admin route that requires admin privileges.
 * - While auth state is loading → spinner.
 * - If not signed in → redirect to /admin (login gate).
 * - If signed in but not admin → show 403 page.
 * - If admin → render children.
 */
export function AdminGuard({ children }: { children: React.ReactNode }) {
  const { user, isLoading, isAdmin } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [redirecting, setRedirecting] = useState(false);

  useEffect(() => {
    if (isLoading) return;
    if (!user) {
      const target = pathname ? `/admin?next=${encodeURIComponent(pathname)}` : "/admin";
      router.replace(target);
      // Defer the redirecting flag so we don't trigger a cascading render.
      const id = setTimeout(() => setRedirecting(true), 0);
      return () => clearTimeout(id);
    }
  }, [isLoading, user, pathname, router]);

  if (isLoading || redirecting) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3 text-muted-foreground">
        <Loader2 className="size-6 animate-spin text-primary" />
        <p className="text-sm">Verifying admin session…</p>
      </div>
    );
  }

  if (!user) {
    return null; // redirect in progress
  }

  if (!isAdmin) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center p-6">
        <div className="mx-auto max-w-md text-center">
          <div className="mx-auto mb-6 flex size-16 items-center justify-center rounded-full bg-destructive/10 text-destructive">
            <ShieldAlert className="size-8" />
          </div>
          <h1 className="font-serif text-3xl font-semibold tracking-tight">
            Access Restricted
          </h1>
          <p className="mt-3 text-muted-foreground">
            You don&apos;t have permission to access admin. Only the store owner
            can access this area.
          </p>
          <p className="mt-2 text-xs text-muted-foreground">
            Admin access is restricted to{" "}
            <span className="font-mono text-foreground">{ADMIN_EMAIL}</span>.
          </p>
          <div className="mt-6 flex items-center justify-center gap-3">
            <Button asChild>
              <Link href="/">
                <ArrowLeft className="size-4" />
                Back to store
              </Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
