"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, Loader2, ArrowLeft, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/components/providers/auth-provider";
import { toast } from "sonner";

export default function ForgotPasswordPage() {
  const { forgotPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes("@")) {
      toast.error("Please enter a valid email");
      return;
    }
    setLoading(true);
    try {
      const r = await forgotPassword(email);
      if (r.ok) {
        setSent(true);
        toast.success("Reset link sent!");
      } else {
        toast.error("Could not send reset link. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-md px-4 sm:px-6 py-12 lg:py-16">
      <div className="text-center mb-8">
        <Link href="/" className="font-serif text-3xl font-bold">
          Aurora <span className="text-gold-gradient">& Co.</span>
        </Link>
      </div>

      {sent ? (
        <div className="text-center">
          <div className="w-16 h-16 mx-auto rounded-full bg-green-100 flex items-center justify-center mb-4">
            <CheckCircle2 className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="font-serif text-2xl font-bold">Check your inbox</h1>
          <p className="text-sm text-muted-foreground mt-2">
            We've sent a password reset link to <span className="font-medium text-foreground">{email}</span>.
            The link is valid for 1 hour.
          </p>
          <Button asChild variant="outline" className="mt-6">
            <Link href="/login"><ArrowLeft className="h-4 w-4 mr-2" /> Back to Sign In</Link>
          </Button>
        </div>
      ) : (
        <>
          <h1 className="font-serif text-3xl font-bold">Forgot Password</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Enter your email and we'll send you a reset link.
          </p>

          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <div className="relative mt-1">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email" type="email" value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="pl-10"
                  autoComplete="email"
                />
              </div>
            </div>
            <Button type="submit" className="w-full" size="lg" disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
              Send Reset Link
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            <Link href="/login" className="text-primary hover:underline inline-flex items-center">
              <ArrowLeft className="h-3 w-3 mr-1" /> Back to Sign In
            </Link>
          </p>
        </>
      )}
    </div>
  );
}
