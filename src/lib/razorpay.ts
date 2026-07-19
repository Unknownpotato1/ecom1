// ============================================================================
// Aurora & Co. — Razorpay integration helpers.
// In production, RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET are set in .env.
// ============================================================================

export const RAZORPAY_KEY_ID = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ?? "rzp_test_mock_key_id";

export interface RazorpayOrderResponse {
  id: string;
  amount: number; // in paise
  currency: "INR";
  status: "created";
  receipt: string;
}

// Server-side: create a Razorpay order via Razorpay's REST API.
// In this mock environment we generate a fake order id — real code calls
// `https://api.razorpay.com/v1/orders` with Basic auth.
export async function createRazorpayOrder(amountInr: number, receipt: string): Promise<RazorpayOrderResponse> {
  // Real implementation:
  // const auth = Buffer.from(`${process.env.RAZORPAY_KEY_ID}:${process.env.RAZORPAY_KEY_SECRET}`).toString("base64");
  // const res = await fetch("https://api.razorpay.com/v1/orders", {
  //   method: "POST",
  //   headers: { Authorization: `Basic ${auth}`, "Content-Type": "application/json" },
  //   body: JSON.stringify({ amount: amountInr * 100, currency: "INR", receipt }),
  // });
  // return res.json();
  await new Promise((r) => setTimeout(r, 500));
  return {
    id: `order_${Math.random().toString(36).slice(2, 14)}${Date.now().toString(36)}`,
    amount: Math.round(amountInr * 100),
    currency: "INR",
    status: "created",
    receipt,
  };
}

export interface RazorpayPaymentResult {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
  success: boolean;
}

// Client-side: open Razorpay checkout modal.
// Loads the Razorpay checkout.js script if not already loaded.
export function loadRazorpayScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined") return reject(new Error("client only"));
    if ((window as unknown as { Razorpay?: unknown }).Razorpay) return resolve();
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Razorpay script"));
    document.body.appendChild(script);
  });
}

export interface OpenCheckoutOptions {
  orderId: string;
  amountInr: number;
  name: string;
  description: string;
  prefill: { name: string; email: string; contact: string };
  onSuccess: (r: RazorpayPaymentResult) => void;
  onFailure?: (err: { code: string; description: string }) => void;
}

export async function openRazorpayCheckout(opts: OpenCheckoutOptions) {
  await loadRazorpayScript();
  const Razorpay = (window as unknown as { Razorpay: new (opts: unknown) => { open: () => void } }).Razorpay;
  const options = {
    key: RAZORPAY_KEY_ID,
    amount: Math.round(opts.amountInr * 100),
    currency: "INR",
    name: opts.name,
    description: opts.description,
    order_id: opts.orderId,
    prefill: opts.prefill,
    theme: { color: "#6B2D5C" },
    handler: (response: { razorpay_payment_id: string; razorpay_order_id: string; razorpay_signature: string }) => {
      opts.onSuccess({
        ...response,
        success: true,
      });
    },
    modal: {
      ondismiss: () => {
        opts.onFailure?.({ code: "DISMISS", description: "Payment cancelled by user" });
      },
    },
  };
  const rzp = new Razorpay(options);
  rzp.open();
}
