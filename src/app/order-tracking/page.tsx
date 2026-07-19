"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Search, Package, Truck, CheckCircle2, Clock, MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { formatINR } from "@/lib/format";

interface StoredOrder {
  orderNumber: string;
  total: number;
  paymentMethod: string;
  email: string;
  mobile: string;
  estimatedDelivery: string;
  status: string;
  createdAt: string;
  items: { snapshot: { name: string; image: string; price: number }; quantity: number }[];
  address: { fullName: string; line1: string; line2?: string; city: string; state: string; pincode: string };
}

type Status = "confirmed" | "packed" | "shipped" | "out_for_delivery" | "delivered";

const statusSteps: { key: Status; label: string; icon: typeof Package }[] = [
  { key: "confirmed", label: "Order Confirmed", icon: CheckCircle2 },
  { key: "packed", label: "Packed", icon: Package },
  { key: "shipped", label: "Shipped", icon: Truck },
  { key: "out_for_delivery", label: "Out for Delivery", icon: Truck },
  { key: "delivered", label: "Delivered", icon: CheckCircle2 },
];

function getCurrentStep(order: StoredOrder): number {
  // Mock: based on order age, advance status.
  const age = (Date.now() - new Date(order.createdAt).getTime()) / (1000 * 60 * 60 * 24); // days
  if (age < 0.5) return 0;
  if (age < 1) return 1;
  if (age < 3) return 2;
  if (age < 5) return 3;
  return 4;
}

export default function OrderTrackingPage() {
  const params = useSearchParams();
  const initialOrderNo = params.get("order") ?? "";
  const [orderNo, setOrderNo] = useState(initialOrderNo);
  const [order, setOrder] = useState<StoredOrder | null>(null);
  const [searched, setSearched] = useState(false);

  const search = (no: string) => {
    setSearched(true);
    try {
      const orders: StoredOrder[] = JSON.parse(localStorage.getItem("aurora-orders") ?? "[]");
      const found = orders.find((o) => o.orderNumber.toLowerCase() === no.trim().toLowerCase());
      setOrder(found ?? null);
    } catch {
      setOrder(null);
    }
  };

  useEffect(() => {
    if (!initialOrderNo) return;
    // Defer to microtask to satisfy react-hooks/set-state-in-effect rule.
    const id = setTimeout(() => search(initialOrderNo), 0);
    return () => clearTimeout(id);
  }, [initialOrderNo, search]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    search(orderNo);
  };

  const currentStep = order ? getCurrentStep(order) : 0;

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-8 lg:py-12">
      <div className="text-center mb-8">
        <h1 className="font-serif text-3xl sm:text-4xl font-bold">Track Your Order</h1>
        <p className="text-muted-foreground mt-2">Enter your order number to see real-time status.</p>
      </div>

      <form onSubmit={onSubmit} className="flex gap-2 max-w-md mx-auto mb-8">
        <Input
          type="text"
          value={orderNo}
          onChange={(e) => setOrderNo(e.target.value)}
          placeholder="e.g. AUR-XYZ123"
          className="flex-1"
        />
        <Button type="submit">
          <Search className="h-4 w-4 mr-1" /> Track
        </Button>
      </form>

      {searched && !order && (
        <div className="text-center py-12 border rounded-lg bg-secondary/30">
          <p className="text-muted-foreground">No order found with that number.</p>
          <p className="text-xs text-muted-foreground mt-1">Check your email for the correct order number.</p>
        </div>
      )}

      {order && (
        <div className="space-y-6">
          {/* Order info */}
          <div className="border rounded-lg p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs text-muted-foreground">Order Number</p>
                <p className="font-mono font-semibold">{order.orderNumber}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Placed On</p>
                <p className="text-sm font-medium">
                  {new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Total</p>
                <p className="font-semibold">{formatINR(order.total)}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Payment</p>
                <p className="text-sm font-medium capitalize">{order.paymentMethod.replace("_", " ")}</p>
              </div>
            </div>
          </div>

          {/* Tracking timeline */}
          <div className="border rounded-lg p-5">
            <h2 className="font-semibold mb-2">Tracking Status</h2>
            <p className="text-sm text-muted-foreground mb-6">
              Estimated delivery: <span className="font-medium text-foreground">
                {new Date(order.estimatedDelivery).toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "long" })}
              </span>
            </p>

            <div className="relative">
              {/* Progress line */}
              <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border" />
              <div
                className="absolute left-4 top-0 w-0.5 bg-green-500 transition-all"
                style={{ height: `${(currentStep / (statusSteps.length - 1)) * 100}%` }}
              />

              <div className="space-y-6">
                {statusSteps.map((step, i) => {
                  const Icon = step.icon;
                  const done = i <= currentStep;
                  const current = i === currentStep;
                  return (
                    <div key={step.key} className="relative flex items-start gap-4">
                      <div className={cn(
                        "relative z-10 w-8 h-8 rounded-full flex items-center justify-center shrink-0 border-2",
                        done ? "bg-green-500 border-green-500 text-white" : "bg-background border-border text-muted-foreground",
                        current && "ring-4 ring-green-100"
                      )}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="pt-1">
                        <p className={cn("text-sm font-medium", !done && "text-muted-foreground")}>{step.label}</p>
                        {current && (
                          <p className="text-xs text-green-700 mt-0.5 flex items-center gap-1">
                            <Clock className="h-3 w-3" /> In progress
                          </p>
                        )}
                        {done && !current && (
                          <p className="text-xs text-muted-foreground mt-0.5">Completed</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Shipping address */}
          <div className="border rounded-lg p-5">
            <h2 className="font-semibold mb-2 flex items-center gap-2">
              <MapPin className="h-4 w-4" /> Shipping Address
            </h2>
            <p className="text-sm">{order.address.fullName}</p>
            <p className="text-sm text-muted-foreground">
              {order.address.line1}
              {order.address.line2 && `, ${order.address.line2}`}
            </p>
            <p className="text-sm text-muted-foreground">
              {order.address.city}, {order.address.state} - {order.address.pincode}
            </p>
          </div>

          {/* Items */}
          <div className="border rounded-lg p-5">
            <h2 className="font-semibold mb-3">Items in Order</h2>
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
                  <p className="text-sm font-medium">{formatINR(item.snapshot.price * item.quantity)}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="text-center">
            <Button asChild variant="outline">
              <Link href="/collections">Continue Shopping</Link>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
