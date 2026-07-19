"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { XCircle, RefreshCw, Phone, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function OrderFailedPage() {
  const params = useSearchParams();
  const orderNumber = params.get("order");

  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6 py-12 lg:py-20 text-center">
      <div className="w-20 h-20 mx-auto rounded-full bg-red-100 flex items-center justify-center mb-6">
        <XCircle className="h-12 w-12 text-red-600" />
      </div>
      <h1 className="font-serif text-3xl sm:text-4xl font-bold">Payment Failed</h1>
      <p className="text-muted-foreground mt-3 max-w-md mx-auto">
        We couldn't process your payment. Don't worry — your items are still in your bag.
        Please try again or use a different payment method.
      </p>

      {orderNumber && (
        <p className="mt-4 text-sm text-muted-foreground">
          Reference: <span className="font-mono font-medium text-foreground">{orderNumber}</span>
        </p>
      )}

      <div className="mt-8 bg-amber-50 border border-amber-200 rounded-lg p-4 text-left">
        <h3 className="font-semibold text-sm text-amber-900">Possible reasons:</h3>
        <ul className="text-xs text-amber-800 mt-2 space-y-1 list-disc list-inside">
          <li>Insufficient funds or exceeded card limit</li>
          <li>Network connectivity issue</li>
          <li>Payment session expired</li>
          <li>Bank server temporarily unavailable</li>
        </ul>
      </div>

      <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
        <Button asChild size="lg">
          <Link href="/checkout">
            <RefreshCw className="h-4 w-4 mr-2" /> Try Again
          </Link>
        </Button>
        <Button asChild variant="outline" size="lg">
          <Link href="/cart">Back to Bag</Link>
        </Button>
      </div>

      <div className="mt-8 text-xs text-muted-foreground">
        If the issue persists, please contact us:
        <div className="flex items-center justify-center gap-4 mt-2">
          <a href="tel:+918000000000" className="inline-flex items-center gap-1 underline">
            <Phone className="h-3 w-3" /> +91 80000 00000
          </a>
          <a href="mailto:hello@aurora-co.in" className="inline-flex items-center gap-1 underline">
            <Mail className="h-3 w-3" /> hello@aurora-co.in
          </a>
        </div>
      </div>
    </div>
  );
}
