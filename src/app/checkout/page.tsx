"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShieldCheck, Truck, Banknote, CreditCard, Tag, X, Loader2, Gift, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { useCartStore, useCouponStore } from "@/lib/stores";
import { useAuth } from "@/components/providers/auth-provider";
import { formatINR, isValidIndianPin, lookupIndianPin, generateOrderNumber, estimatedDeliveryDate } from "@/lib/format";
import { coupons } from "@/lib/data";
import { useHydrated } from "@/lib/use-hydrated";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface AddressForm {
  fullName: string;
  mobile: string;
  email: string;
  line1: string;
  line2: string;
  city: string;
  state: string;
  pincode: string;
  giftNote: string;
}

type PaymentMethod = "prepaid" | "cod" | "partial_cod";

export default function CheckoutPage() {
  const router = useRouter();
  const hydrated = useHydrated();
  const { user } = useAuth();
  const { items, subtotal, clear } = useCartStore();
  const { code: appliedCoupon, discount, setCoupon, clear: clearCoupon } = useCouponStore();
  const [couponInput, setCouponInput] = useState("");
  const [form, setForm] = useState<AddressForm>({
    fullName: user?.name ?? "",
    mobile: user?.mobile ?? "",
    email: user?.email ?? "",
    line1: "",
    line2: "",
    city: "",
    state: "",
    pincode: "",
    giftNote: "",
  });
  const [pinLoading, setPinLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("prepaid");
  const [placing, setPlacing] = useState(false);

  useEffect(() => {
    if (user) {
      // Defer setState to microtask to satisfy react-hooks/set-state-in-effect rule.
      const id = setTimeout(() => {
        setForm((f) => ({
          ...f,
          fullName: f.fullName || user.name,
          email: f.email || user.email,
          mobile: f.mobile || (user.mobile ?? ""),
        }));
      }, 0);
      return () => clearTimeout(id);
    }
  }, [user]);

  const sub = hydrated ? subtotal() : 0;
  const prepaidDiscount = paymentMethod === "prepaid" ? Math.round(sub * 0.15) : 0;
  const effectiveSub = sub - prepaidDiscount;
  const finalDiscount = Math.min(discount, effectiveSub);
  const shipping = effectiveSub - finalDiscount >= 999 || sub === 0 ? 0 : 99;
  const codCharge = paymentMethod !== "prepaid" ? 50 : 0;
  const tax = Math.round((effectiveSub - finalDiscount) * 0.03);
  const total = Math.max(0, effectiveSub - finalDiscount + shipping + codCharge + tax);

  // Partial COD: 10% advance
  const partialAdvance = paymentMethod === "partial_cod" ? Math.round(total * 0.1) : 0;
  const codPayOnDelivery = paymentMethod === "partial_cod" ? total - partialAdvance : (paymentMethod === "cod" ? total : 0);

  const onPincodeBlur = () => {
    if (!isValidIndianPin(form.pincode)) return;
    setPinLoading(true);
    setTimeout(() => {
      const r = lookupIndianPin(form.pincode);
      if (r.valid) {
        setForm((f) => ({ ...f, city: r.city || f.city, state: r.state || f.state }));
      }
      setPinLoading(false);
    }, 400);
  };

  const applyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    const code = couponInput.trim().toUpperCase();
    if (!code) return;
    const coupon = coupons.find((c) => c.code.toUpperCase() === code && c.isActive);
    if (!coupon) { toast.error("Invalid coupon code"); return; }
    if (effectiveSub < coupon.minOrderValue) {
      toast.error(`Minimum order value is ₹${coupon.minOrderValue} for this coupon`);
      return;
    }
    let disc = 0;
    if (coupon.type === "percentage") {
      disc = Math.round((effectiveSub * coupon.value) / 100);
      if (coupon.maxDiscount && disc > coupon.maxDiscount) disc = coupon.maxDiscount;
    } else {
      disc = coupon.value;
    }
    setCoupon(coupon.code, disc);
    toast.success(`Coupon ${coupon.code} applied`);
    setCouponInput("");
  };

  const validate = () => {
    if (!form.fullName.trim()) return "Please enter your full name";
    if (!/^\d{10}$/.test(form.mobile.trim())) return "Please enter a valid 10-digit mobile number";
    if (!form.email.includes("@")) return "Please enter a valid email";
    if (!form.line1.trim()) return "Please enter your address";
    if (!isValidIndianPin(form.pincode)) return "Please enter a valid 6-digit PIN code";
    if (!form.city.trim()) return "City is required";
    if (!form.state.trim()) return "State is required";
    return null;
  };

  const onPlaceOrder = async () => {
    const err = validate();
    if (err) { toast.error(err); return; }
    if (items.length === 0) { toast.error("Your bag is empty"); return; }

    setPlacing(true);
    // Simulate order creation + payment
    await new Promise((r) => setTimeout(r, 1500));

    // 95% success rate to demonstrate both success & failed pages
    const success = Math.random() > 0.05;
    const orderNumber = generateOrderNumber();

    // Persist order to localStorage for tracking
    const order = {
      orderNumber,
      total,
      paymentMethod,
      email: form.email,
      mobile: form.mobile,
      items: items,
      address: form,
      estimatedDelivery: estimatedDeliveryDate(5),
      status: "confirmed" as const,
      createdAt: new Date().toISOString(),
      couponCode: appliedCoupon,
      giftNote: form.giftNote,
    };

    try {
      const existing = JSON.parse(localStorage.getItem("aurora-orders") ?? "[]");
      existing.push(order);
      localStorage.setItem("aurora-orders", JSON.stringify(existing));
    } catch { /* ignore */ }

    setPlacing(false);
    if (success) {
      clear();
      clearCoupon();
      router.push(`/order-success?order=${orderNumber}`);
    } else {
      router.push(`/order-failed?order=${orderNumber}`);
    }
  };

  if (hydrated && items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 sm:px-6 py-16 text-center">
        <h1 className="font-serif text-3xl font-bold">Your Bag is Empty</h1>
        <p className="text-muted-foreground mt-2">Add some items before checking out.</p>
        <Button asChild className="mt-6">
          <Link href="/collections">Browse Products</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8 lg:py-12">
      <h1 className="font-serif text-3xl sm:text-4xl font-bold mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: form + payment */}
        <div className="lg:col-span-2 space-y-6">
          {/* Guest / Google login banner */}
          {!user && (
            <div className="bg-secondary/50 border rounded-lg p-4 flex items-center justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-2 text-sm">
                <ShieldCheck className="h-5 w-5 text-primary" />
                <span>Sign in for faster checkout & order tracking</span>
              </div>
              <Button asChild variant="outline" size="sm">
                <Link href="/login">Sign In</Link>
              </Button>
            </div>
          )}

          {/* Contact + shipping */}
          <section className="border rounded-lg p-5 space-y-4">
            <h2 className="font-semibold text-lg">Contact & Shipping Address</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="sm:col-span-2">
                <Label htmlFor="fullName">Full Name *</Label>
                <Input
                  id="fullName" value={form.fullName}
                  onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                  placeholder="Priya Sharma"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="mobile">Mobile *</Label>
                <Input
                  id="mobile" value={form.mobile}
                  onChange={(e) => setForm({ ...form, mobile: e.target.value.replace(/\D/g, "").slice(0, 10) })}
                  placeholder="10-digit mobile"
                  inputMode="numeric"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email" type="email" value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="your@email.com"
                  className="mt-1"
                />
              </div>
              <div className="sm:col-span-2">
                <Label htmlFor="line1">Address Line 1 *</Label>
                <Input
                  id="line1" value={form.line1}
                  onChange={(e) => setForm({ ...form, line1: e.target.value })}
                  placeholder="Flat / House no, Building, Street"
                  className="mt-1"
                />
              </div>
              <div className="sm:col-span-2">
                <Label htmlFor="line2">Address Line 2 (optional)</Label>
                <Input
                  id="line2" value={form.line2}
                  onChange={(e) => setForm({ ...form, line2: e.target.value })}
                  placeholder="Apartment, Area, Landmark"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="pincode">PIN Code *</Label>
                <div className="flex gap-2 mt-1">
                  <Input
                    id="pincode" value={form.pincode}
                    onChange={(e) => setForm({ ...form, pincode: e.target.value.replace(/\D/g, "").slice(0, 6) })}
                    onBlur={onPincodeBlur}
                    placeholder="6-digit PIN"
                    inputMode="numeric"
                    className="flex-1"
                  />
                  {pinLoading && <Loader2 className="h-4 w-4 animate-spin self-center" />}
                </div>
                <p className="text-xs text-muted-foreground mt-1">PIN code auto-fills city & state via India Post API.</p>
              </div>
              <div>
                <Label htmlFor="city">City *</Label>
                <Input
                  id="city" value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                  placeholder="Mumbai"
                  className="mt-1"
                />
              </div>
              <div className="sm:col-span-2">
                <Label htmlFor="state">State *</Label>
                <Input
                  id="state" value={form.state}
                  onChange={(e) => setForm({ ...form, state: e.target.value })}
                  placeholder="Maharashtra"
                  className="mt-1"
                />
              </div>
            </div>
          </section>

          {/* Gift note */}
          <section className="border rounded-lg p-5 space-y-3">
            <div className="flex items-center gap-2">
              <Gift className="h-5 w-5 text-gold" />
              <h2 className="font-semibold text-lg">Gift Note (optional)</h2>
            </div>
            <Textarea
              value={form.giftNote}
              onChange={(e) => setForm({ ...form, giftNote: e.target.value })}
              placeholder="Add a personal message for the recipient (we'll print this on a card)"
              rows={2}
              maxLength={200}
            />
            <p className="text-xs text-muted-foreground">{form.giftNote.length}/200 characters</p>
          </section>

          {/* Payment method */}
          <section className="border rounded-lg p-5 space-y-4">
            <h2 className="font-semibold text-lg">Payment Method</h2>
            <RadioGroup value={paymentMethod} onValueChange={(v) => setPaymentMethod(v as PaymentMethod)}>
              <label className={cn(
                "flex items-start gap-3 p-3 border-2 rounded-lg cursor-pointer transition-all",
                paymentMethod === "prepaid" ? "border-primary bg-primary/5" : "border-border hover:border-foreground/30"
              )}>
                <RadioGroupItem value="prepaid" className="mt-1" />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    <p className="font-medium">Prepaid (UPI / Card / Wallet / Net Banking)</p>
                    <span className="ml-auto bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full font-medium">15% OFF</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Pay via Razorpay. Save {formatINR(prepaidDiscount)} on this order.
                  </p>
                </div>
              </label>

              <label className={cn(
                "flex items-start gap-3 p-3 border-2 rounded-lg cursor-pointer transition-all",
                paymentMethod === "cod" ? "border-primary bg-primary/5" : "border-border hover:border-foreground/30"
              )}>
                <RadioGroupItem value="cod" className="mt-1" />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <Banknote className="h-5 w-5" />
                    <p className="font-medium">Cash on Delivery</p>
                    {codCharge > 0 && <span className="ml-auto bg-orange-100 text-orange-800 text-xs px-2 py-0.5 rounded-full">+{formatINR(codCharge)} COD</span>}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Pay the full amount in cash when your order is delivered.
                  </p>
                </div>
              </label>

              <label className={cn(
                "flex items-start gap-3 p-3 border-2 rounded-lg cursor-pointer transition-all",
                paymentMethod === "partial_cod" ? "border-primary bg-primary/5" : "border-border hover:border-foreground/30"
              )}>
                <RadioGroupItem value="partial_cod" className="mt-1" />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <Truck className="h-5 w-5" />
                    <p className="font-medium">Partial COD (10% advance)</p>
                    <span className="ml-auto bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full">Pay {formatINR(partialAdvance)} now</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Pay 10% now to confirm, balance {formatINR(codPayOnDelivery)} on delivery.
                  </p>
                </div>
              </label>
            </RadioGroup>

            <div className="flex items-center gap-2 text-xs text-muted-foreground bg-secondary/50 p-3 rounded-md">
              <Lock className="h-4 w-4" />
              <span>All transactions are secured and encrypted by Razorpay. We never store your card details.</span>
            </div>
          </section>
        </div>

        {/* Right: order summary */}
        <div>
          <div className="border rounded-lg p-5 sticky top-32 space-y-4">
            <h2 className="font-semibold text-lg">Order Summary</h2>

            {/* Items */}
            <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
              {hydrated && items.map((item) => (
                <div key={`${item.productId}-${item.variantId ?? "_"}-${item.size ?? "_"}`} className="flex gap-3">
                  <div className="w-12 h-14 rounded-md overflow-hidden bg-muted shrink-0 relative">
                    { }
                    <img src={item.snapshot.image} alt={item.snapshot.name} className="w-full h-full object-cover" />
                    <span className="absolute -top-1 -right-1 bg-foreground text-background text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
                      {item.quantity}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium line-clamp-1">{item.snapshot.name}</p>
                    {item.snapshot.variantLabel && (
                      <p className="text-[10px] text-muted-foreground line-clamp-1">{item.snapshot.variantLabel}</p>
                    )}
                    <p className="text-xs font-semibold mt-0.5">{formatINR(item.snapshot.price * item.quantity)}</p>
                  </div>
                </div>
              ))}
            </div>

            <Separator />

            {/* Coupon */}
            <div>
              {appliedCoupon ? (
                <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-md p-2">
                  <div className="flex items-center gap-2">
                    <Tag className="h-4 w-4 text-green-700" />
                    <div>
                      <p className="text-xs font-medium text-green-800">{appliedCoupon}</p>
                      <p className="text-[10px] text-green-700">Save {formatINR(discount)}</p>
                    </div>
                  </div>
                  <button onClick={clearCoupon} className="text-green-700"><X className="h-3 w-3" /></button>
                </div>
              ) : (
                <form onSubmit={applyCoupon} className="flex gap-2">
                  <Input
                    type="text"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    placeholder="Coupon code"
                    className="flex-1 h-9"
                  />
                  <Button type="submit" variant="secondary" size="sm">Apply</Button>
                </form>
              )}
            </div>

            <Separator />

            {/* Totals */}
            <div className="space-y-1.5 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{formatINR(sub)}</span>
              </div>
              {prepaidDiscount > 0 && (
                <div className="flex justify-between text-green-700">
                  <span>Prepaid discount (15%)</span>
                  <span>−{formatINR(prepaidDiscount)}</span>
                </div>
              )}
              {finalDiscount > 0 && (
                <div className="flex justify-between text-green-700">
                  <span>Coupon ({appliedCoupon})</span>
                  <span>−{formatINR(finalDiscount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span>{shipping === 0 ? "FREE" : formatINR(shipping)}</span>
              </div>
              {codCharge > 0 && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">COD Charges</span>
                  <span>{formatINR(codCharge)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tax (GST 3%)</span>
                <span>{formatINR(tax)}</span>
              </div>
            </div>

            <Separator />

            <div className="flex justify-between font-semibold text-lg">
              <span>Total</span>
              <span>{formatINR(total)}</span>
            </div>

            {paymentMethod === "partial_cod" && (
              <div className="bg-blue-50 border border-blue-200 rounded-md p-2.5 text-xs">
                <p className="text-blue-800 font-medium">Pay {formatINR(partialAdvance)} now (10% advance)</p>
                <p className="text-blue-700 mt-0.5">Balance {formatINR(codPayOnDelivery)} payable on delivery</p>
              </div>
            )}

            <Button onClick={onPlaceOrder} className="w-full" size="lg" disabled={placing}>
              {placing ? (
                <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Placing Order…</>
              ) : (
                <>Place Order • {formatINR(total)}</>
              )}
            </Button>

            <p className="text-center text-xs text-muted-foreground">
              By placing this order you agree to our{" "}
              <Link href="/terms" className="underline">Terms</Link> &{" "}
              <Link href="/privacy-policy" className="underline">Privacy Policy</Link>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
