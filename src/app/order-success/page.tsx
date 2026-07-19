"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, Package, Truck, Mail, Phone, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState, Suspense } from "react";

interface StoredOrder {
  orderNumber: string;
  total: number;
  paymentMethod: string;
  email: string;
  mobile: string;
  estimatedDelivery: string;
  status: string;
  items: { snapshot: { name: string; image: string; price: number }; quantity: number }[];
  address: { fullName: string; line1: string; city: string; state: string; pincode: string };
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-3xl px-4 sm:px-6 py-16 text-center text-muted-foreground">Loading…</div>}>
      <OrderSuccessContent />
    </Suspense>
  );
}

function OrderSuccessContent() {
  const params = useSearchParams();
  const orderNumber = params.get("order");
  const [order, setOrder] = useState<StoredOrder | null>(null);

  useEffect(() => {
    if (!orderNumber) return;
    // Defer to microtask to satisfy react-hooks/set-state-in-effect rule.
    const id = setTimeout(() => {
      try {
        const orders: StoredOrder[] = JSON.parse(localStorage.getItem("aurora-orders") ?? "[]");
        const found = orders.find((o) => o.orderNumber === orderNumber);
        setOrder(found ?? null);
      } catch { /* ignore */ }
    }, 0);
    return () => clearTimeout(id);
  }, [orderNumber]);

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-12 lg:py-20">
      <div className="text-center">
        <div className="w-20 h-20 mx-auto rounded-full bg-green-100 flex items-center justify-center mb-6">
          <CheckCircle2 className="h-12 w-12 text-green-600" />
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold">Order Confirmed!</h1>
        <p className="text-muted-foreground mt-2">
          Thank you for your order. We've sent a confirmation to{" "}
          <span className="font-medium text-foreground">{order?.email ?? "your email"}</span>.
        </p>
        {orderNumber && (
          <p className="mt-4 text-sm">
            Order Number: <span className="font-mono font-semibold">{orderNumber}</span>
          </p>
        )}
      </div>

      {order && (
        <div className="mt-10 border rounded-lg p-5 space-y-4">
          <h2 className="font-semibold">Order Summary</h2>
          <div className="space-y-3">
            {order.items.map((item, i) => (
              <div key={i} className="flex gap-3">
                <div className="w-12 h-14 rounded-md overflow-hidden bg-muted shrink-0">
                  { }
                  <img src={item.snapshot.image} alt={item.snapshot.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{item.snapshot.name}</p>
                  <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                </div>
                <p className="text-sm font-medium">₹{(item.snapshot.price * item.quantity).toLocaleString("en-IN")}</p>
              </div>
            ))}
          </div>
          <div className="border-t pt-3 flex justify-between font-semibold">
            <span>Total Paid ({order.paymentMethod === "prepaid" ? "Prepaid" : order.paymentMethod === "cod" ? "COD" : "Partial COD"})</span>
            <span>₹{order.total.toLocaleString("en-IN")}</span>
          </div>
        </div>
      )}

      {order && (
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="border rounded-lg p-4">
            <h3 className="text-sm font-semibold mb-2">Shipping To</h3>
            <p className="text-sm">{order.address.fullName}</p>
            <p className="text-sm text-muted-foreground">{order.address.line1}</p>
            <p className="text-sm text-muted-foreground">{order.address.city}, {order.address.state} - {order.address.pincode}</p>
          </div>
          <div className="border rounded-lg p-4">
            <h3 className="text-sm font-semibold mb-2">Estimated Delivery</h3>
            <p className="text-sm font-medium">
              {new Date(order.estimatedDelivery).toLocaleDateString("en-IN", {
                weekday: "long", day: "numeric", month: "long"
              })}
            </p>
            <p className="text-xs text-muted-foreground mt-1">Track your order for live updates.</p>
          </div>
        </div>
      )}

      {/* What's next timeline */}
      <div className="mt-8 border rounded-lg p-5">
        <h3 className="font-semibold mb-4">What happens next?</h3>
        <div className="space-y-4">
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center shrink-0">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium">Order Confirmed</p>
              <p className="text-xs text-muted-foreground">We've received your order and are preparing it.</p>
            </div>
          </div>
          <div className="flex gap-3 opacity-50">
            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center shrink-0">
              <Package className="h-4 w-4" />
            </div>
            <div>
              <p className="text-sm font-medium">Packed</p>
              <p className="text-xs text-muted-foreground">Usually within 24 hours</p>
            </div>
          </div>
          <div className="flex gap-3 opacity-50">
            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center shrink-0">
              <Truck className="h-4 w-4" />
            </div>
            <div>
              <p className="text-sm font-medium">Shipped & Delivered</p>
              <p className="text-xs text-muted-foreground">Typically 4-6 business days</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
        <Button asChild>
          <Link href={`/order-tracking?order=${orderNumber}`}>Track My Order <ArrowRight className="h-4 w-4 ml-2" /></Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/collections">Continue Shopping</Link>
        </Button>
      </div>

      {order && (
        <div className="mt-6 text-center text-xs text-muted-foreground">
          Need help? <a href="mailto:hello@aurora-co.in" className="underline inline-flex items-center gap-1"><Mail className="h-3 w-3" /> hello@aurora-co.in</a>
          {" • "}
          <a href="tel:+918000000000" className="underline inline-flex items-center gap-1"><Phone className="h-3 w-3" /> +91 80000 00000</a>
        </div>
      )}
    </div>
  );
}
