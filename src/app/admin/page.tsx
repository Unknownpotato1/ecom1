"use client";

import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Sparkles, Mail, Lock, ArrowRight, ShieldCheck, AlertCircle, Info } from "lucide-react";
import { useAuth } from "@/components/providers/auth-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { ADMIN_EMAIL } from "@/lib/auth";
import { toast } from "sonner";

function AdminLoginPageInner() {
  const { user, isAdmin, isLoading, signIn, googleSignIn } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/admin/dashboard";

  const [email, setEmail] = useState(ADMIN_EMAIL);
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  // Redirect already-signed-in admin to dashboard.
  useEffect(() => {
    if (isLoading) return;
    if (user && isAdmin) {
      router.replace(next);
    }
  }, [isLoading, user, isAdmin, router, next]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please enter email and password");
      return;
    }
    setSubmitting(true);
    try {
      const u = await signIn(email, password);
      if (u.email.trim().toLowerCase() === ADMIN_EMAIL) {
        toast.success("Welcome back, Shahbaz");
        router.replace(next);
      } else {
        toast.error("This account does not have admin access.");
      }
    } catch {
      toast.error("Sign-in failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogle = async () => {
    setGoogleLoading(true);
    try {
      const u = await googleSignIn();
      if (u.email.trim().toLowerCase() === ADMIN_EMAIL) {
        toast.success("Welcome back, Shahbaz");
        router.replace(next);
      } else {
        toast.error("This Google account does not have admin access.");
      }
    } finally {
      setGoogleLoading(false);
    }
  };

  // If already signed in as admin, the redirect will happen via effect.
  if (isLoading) {
    return (
      <div className="flex min-h-svh items-center justify-center bg-background">
        <div className="size-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  // If signed in but not admin → show 403.
  if (user && !isAdmin) {
    return (
      <div className="flex min-h-svh items-center justify-center bg-background p-6">
        <div className="mx-auto max-w-md text-center">
          <div className="mx-auto mb-6 flex size-16 items-center justify-center rounded-full bg-destructive/10 text-destructive">
            <AlertCircle className="size-8" />
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
                Back to store
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid min-h-svh grid-cols-1 lg:grid-cols-2">
      {/* Left — brand imagery */}
      <div className="relative hidden overflow-hidden bg-primary lg:block">
        <img
          src="https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=1600&q=80"
          alt="Aurora & Co. jewelry collection"
          className="absolute inset-0 size-full object-cover opacity-50"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/70 via-primary/50 to-primary/90" />
        <div className="relative flex h-full flex-col justify-between p-12 text-primary-foreground">
          <Link href="/" className="flex items-center gap-2 w-fit">
            <div className="flex size-10 items-center justify-center rounded-md bg-primary-foreground/15 backdrop-blur">
              <Sparkles className="size-5" />
            </div>
            <span className="font-serif text-xl font-semibold tracking-tight">
              Aurora <span className="text-gold-gradient">&amp; Co.</span>
            </span>
          </Link>

          <div className="max-w-md">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-foreground/70">
              Admin Console
            </p>
            <h1 className="mt-3 font-serif text-4xl font-semibold leading-tight">
              Curate the experience.<br />Manage the craft.
            </h1>
            <p className="mt-4 text-sm text-primary-foreground/80">
              Sign in to manage products, orders, collections, and the storefront
              of Aurora &amp; Co. — handcrafted jewelry & premium gift hampers.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs text-primary-foreground/60">
            <ShieldCheck className="size-3.5" />
            Restricted area · Authorized personnel only
          </div>
        </div>
      </div>

      {/* Right — sign-in form */}
      <div className="flex items-center justify-center bg-background p-6 sm:p-12">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <Link href="/" className="mb-8 flex items-center gap-2 lg:hidden">
            <div className="flex size-9 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <Sparkles className="size-5" />
            </div>
            <span className="font-serif text-lg font-semibold tracking-tight">
              Aurora <span className="text-gold-gradient">&amp; Co.</span>
            </span>
          </Link>

          <div className="mb-6">
            <h2 className="font-serif text-2xl font-semibold tracking-tight">
              Welcome back
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Sign in to your admin account to continue.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email">Email address</Label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@aurora.co"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-9"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link href="#" className="text-xs text-muted-foreground hover:text-foreground">
                  Forgot?
                </Link>
              </div>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-9"
                  required
                />
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={submitting}>
              {submitting ? "Signing in…" : "Sign in"}
              {!submitting && <ArrowRight className="size-4" />}
            </Button>
          </form>

          <div className="my-5 flex items-center gap-3">
            <Separator className="flex-1" />
            <span className="text-xs text-muted-foreground">or</span>
            <Separator className="flex-1" />
          </div>

          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={handleGoogle}
            disabled={googleLoading}
          >
            {googleLoading ? (
              "Connecting…"
            ) : (
              <>
                <svg className="size-4" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Sign in with Google
              </>
            )}
          </Button>

          <p className="mt-3 text-center text-xs text-muted-foreground">
            Admin access is restricted to{" "}
            <span className="font-mono">{ADMIN_EMAIL}</span>.
          </p>

          <Card className="mt-6 border-dashed bg-muted/40">
            <CardContent className="flex items-start gap-3 p-4">
              <Info className="mt-0.5 size-4 shrink-0 text-accent-foreground" />
              <div className="text-xs">
                <p className="font-semibold text-foreground">Demo admin</p>
                <p className="mt-0.5 text-muted-foreground">
                  Sign in with{" "}
                  <span className="font-mono text-foreground">{ADMIN_EMAIL}</span>{" "}
                  and any password to access the admin console.
                </p>
              </div>
            </CardContent>
          </Card>

          <p className="mt-6 text-center text-xs text-muted-foreground">
            Not the store owner?{" "}
            <Link href="/" className="font-medium text-primary hover:underline">
              Return to storefront
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-svh items-center justify-center bg-background">
          <div className="size-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      }
    >
      <AdminLoginPageInner />
    </Suspense>
  );
}
