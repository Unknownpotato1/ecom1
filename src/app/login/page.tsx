"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, ShieldCheck, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/providers/auth-provider";
import { toast } from "sonner";
import { Suspense } from "react";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next");
  const { signInWithGoogle, isConfigured } = useAuth();
  const [loading, setLoading] = useState(false);

  const onGoogle = async () => {
    if (!isConfigured) {
      toast.error("Authentication is not configured. Please contact support.");
      return;
    }
    setLoading(true);
    try {
      const user = await signInWithGoogle();
      toast.success(`Welcome, ${user.name.split(" ")[0]}!`);
      // Only redirect to admin dashboard if the user is the admin AND they
      // explicitly navigated to /admin. Otherwise send them to the homepage
      // or profile — never to admin.
      if (next && next.startsWith("/admin")) {
        router.push(next);
      } else {
        router.push(next || "/");
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Sign in failed";
      // Don't expose admin status in error messages.
      if (msg.includes("popup") || msg.includes("cancelled")) {
        toast.error("Sign in cancelled");
      } else {
        toast.error("Could not sign in. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[calc(100vh-9rem)]">
      {/* Brand panel */}
      <div className="relative hidden lg:block bg-foreground">
        { }
        <img
          src="https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1200&q=80"
          alt="Aurora jewelry"
          className="absolute inset-0 w-full h-full object-cover opacity-90"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        <div className="relative h-full flex flex-col justify-between p-12 text-white">
          <Link href="/" className="font-serif text-3xl font-bold">
            Aurora <span className="text-gold-gradient">& Co.</span>
          </Link>
          <div>
            <h2 className="font-serif text-4xl font-bold mb-3">Welcome back to the circle.</h2>
            <p className="text-white/80 max-w-md">Sign in to track orders, save favorites, and check out faster.</p>
          </div>
        </div>
      </div>

      {/* Form panel */}
      <div className="flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-sm">
          <Link href="/" className="lg:hidden font-serif text-3xl font-bold mb-8 block text-center">
            Aurora <span className="text-gold-gradient">& Co.</span>
          </Link>

          <h1 className="font-serif text-3xl font-bold">Sign In</h1>
          <p className="text-sm text-muted-foreground mt-1">Continue with your Google account.</p>

          <Button
            onClick={onGoogle}
            className="w-full mt-6"
            size="lg"
            disabled={loading || !isConfigured}
          >
            {loading ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
            )}
            Continue with Google
          </Button>

          {!isConfigured && (
            <p className="text-xs text-muted-foreground mt-4 text-center">
              Authentication is being set up. Please check back later.
            </p>
          )}

          <p className="text-xs text-muted-foreground mt-6 text-center">
            By continuing you agree to our{" "}
            <Link href="/terms" className="underline">Terms</Link> &{" "}
            <Link href="/privacy-policy" className="underline">Privacy Policy</Link>.
          </p>

          <div className="mt-8 pt-6 border-t text-center">
            <p className="text-xs text-muted-foreground">
              Just browsing?{" "}
              <Link href="/collections" className="text-primary hover:underline font-medium inline-flex items-center">
                Continue as guest <ArrowRight className="h-3 w-3 ml-1" />
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-md px-4 sm:px-6 py-16 text-center text-muted-foreground">Loading…</div>}>
      <LoginContent />
    </Suspense>
  );
}
