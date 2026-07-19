"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";

const faqs = [
  {
    category: "Orders & Shipping",
    items: [
      { q: "How long will my order take to arrive?", a: "We ship within 24 hours of order placement. Delivery typically takes 3-5 business days for metro cities, 4-6 days for tier-2 cities, and 5-8 days for rural areas. You'll receive tracking updates via SMS and email at each stage." },
      { q: "Do you ship across India?", a: "Yes! We ship to all 19,000+ PIN codes in India. If you can enter your PIN code at checkout, we deliver there." },
      { q: "How can I track my order?", a: "Visit our Order Tracking page and enter your order number (e.g., AUR-XYZ123). You'll see real-time status — confirmed, packed, shipped, out for delivery, or delivered." },
      { q: "Can I change my shipping address after placing an order?", a: "If your order hasn't been shipped yet, we can usually update the address. Contact us immediately at hello@aurora-co.in or +91 80000 00000 with your order number and the correct address." },
      { q: "What are the shipping charges?", a: "Free shipping on prepaid orders above ₹999. Below ₹999, a flat ₹99 shipping charge applies. COD orders incur an additional ₹50 COD charge." },
    ],
  },
  {
    category: "Payment",
    items: [
      { q: "What payment methods do you accept?", a: "We accept UPI (Google Pay, PhonePe, Paytm), all major credit and debit cards (Visa, Mastercard, RuPay), net banking, popular wallets, and Cash on Delivery (COD). All online payments are securely processed by Razorpay." },
      { q: "Is COD available?", a: "Yes, Cash on Delivery is available across India. A 10% advance payment is required to confirm COD orders, with the balance payable in cash on delivery. There's a ₹50 COD charge." },
      { q: "What is Partial COD?", a: "Partial COD lets you pay 10% of the order value online to confirm, and the remaining 90% in cash on delivery. This is useful if you don't have the full amount available online but want to secure your order." },
      { q: "Do you offer prepaid discounts?", a: "Yes! All prepaid orders get an automatic 15% discount at checkout. Use coupon code AURORA15 for additional savings." },
      { q: "Is my payment information secure?", a: "Absolutely. All payments are processed by Razorpay, which uses bank-grade SSL encryption and is PCI-DSS Level 1 certified. We never store your card or banking details on our servers." },
    ],
  },
  {
    category: "Returns & Refunds",
    items: [
      { q: "What is your return policy?", a: "We offer a 7-day hassle-free return policy from the date of delivery. Items must be unused and in original packaging. Some items like customized jewelry and opened gift hampers are non-returnable." },
      { q: "How do I initiate a return?", a: "Email us at hello@aurora-co.in with your order number and reason for return. We'll approve your request and send a return shipping label. Pack the items securely and hand them to the courier." },
      { q: "When will I receive my refund?", a: "Refunds are processed within 5-7 business days after we receive and inspect your returned items. Refunds go to the original payment method. For COD orders, we refund via NEFT/IMPS to your bank account." },
      { q: "Can I exchange my order?", a: "Yes, you can exchange within 7 days of delivery. Contact us to initiate an exchange. The first exchange is free; subsequent exchanges incur standard shipping charges." },
      { q: "What if I receive a damaged item?", a: "Please contact us within 48 hours of delivery with photos. We'll arrange a free pickup and send a replacement or full refund immediately." },
    ],
  },
  {
    category: "Product & Care",
    items: [
      { q: "Is your jewelry real gold?", a: "Our jewelry is artificial/imitation jewelry — made with brass alloy base, gold-plated for a luxurious finish. We use kundan, polki, pearls, and cubic zirconia. This allows us to offer beautiful designs at honest prices." },
      { q: "How do I care for my jewelry?", a: "Keep it away from water, perfumes, and chemicals. Store in a dry, air-tight container (the box we provide is perfect). Wipe with a soft cloth after each wear. With proper care, your jewelry will last for years." },
      { q: "Will the color fade?", a: "With proper care, our gold-plating lasts 1-2 years of regular use. Humidity, sweat, and exposure to perfumes can accelerate fading. Following our care instructions will maximize the life of your pieces." },
      { q: "Are your products hypoallergenic?", a: "Our everyday collection uses stainless steel posts which are hypoallergenic. Statement pieces use brass alloy — if you have sensitive skin, we recommend choosing stainless steel options or applying clear nail polish to earring backs." },
      { q: "Do you offer customization?", a: "Yes! We offer customization on bridal sets and bulk corporate hamper orders. Contact us at hello@aurora-co.in with your requirements." },
    ],
  },
  {
    category: "Account & Privacy",
    items: [
      { q: "Do I need an account to order?", a: "No, you can check out as a guest. However, creating an account lets you track orders, save addresses, maintain a wishlist, and check out faster." },
      { q: "How do I reset my password?", a: "Visit our Forgot Password page, enter your email, and we'll send you a reset link valid for 1 hour." },
      { q: "Is my personal information safe?", a: "Yes. We never sell or rent your personal information to third parties. See our Privacy Policy for full details on how we collect, use, and protect your data." },
      { q: "How do I unsubscribe from emails?", a: "Click the unsubscribe link at the bottom of any marketing email. You'll still receive essential transactional emails (order confirmations, shipping updates) which cannot be unsubscribed from." },
    ],
  },
];

export default function FAQPage() {
  const [query, setQuery] = useState("");

  const filtered = faqs
    .map((cat) => ({
      ...cat,
      items: cat.items.filter(
        (item) =>
          item.q.toLowerCase().includes(query.toLowerCase()) ||
          item.a.toLowerCase().includes(query.toLowerCase())
      ),
    }))
    .filter((cat) => cat.items.length > 0);

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-12 lg:py-16">
      <div className="text-center mb-8">
        <h1 className="font-serif text-3xl sm:text-4xl font-bold">Frequently Asked Questions</h1>
        <p className="text-muted-foreground mt-2">Find quick answers to common questions.</p>
      </div>

      <div className="relative mb-8">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search questions…"
          className="pl-10"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No questions match your search.</p>
          <Button asChild variant="outline" className="mt-4">
            <Link href="/contact">Contact Us</Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-8">
          {filtered.map((cat) => (
            <div key={cat.category}>
              <h2 className="font-serif text-xl font-semibold mb-3">{cat.category}</h2>
              <Accordion type="single" collapsible>
                {cat.items.map((item, i) => (
                  <AccordionItem key={i} value={`${cat.category}-${i}`}>
                    <AccordionTrigger className="text-left text-sm font-medium hover:no-underline">
                      {item.q}
                    </AccordionTrigger>
                    <AccordionContent className="text-sm text-muted-foreground leading-relaxed">
                      {item.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          ))}
        </div>
      )}

      <div className="mt-12 p-5 bg-secondary/40 rounded-lg text-center">
        <h3 className="font-semibold mb-1">Still have questions?</h3>
        <p className="text-sm text-muted-foreground mb-3">Our team is here to help.</p>
        <Button asChild>
          <Link href="/contact">Contact Us</Link>
        </Button>
      </div>
    </div>
  );
}
