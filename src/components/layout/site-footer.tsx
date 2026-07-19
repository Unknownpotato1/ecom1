"use client";

import Link from "next/link";
import { Instagram, Facebook, Youtube, Mail, Phone, MapPin, Shield, Truck, RefreshCw, CreditCard } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";

const footerLinks = {
  shop: [
    { label: "Necklaces", href: "/collections?category=necklaces" },
    { label: "Earrings", href: "/collections?category=earrings" },
    { label: "Bracelets", href: "/collections?category=bracelets" },
    { label: "Rings", href: "/collections?category=rings" },
    { label: "Gift Hampers", href: "/collections/curated-hampers" },
    { label: "New Arrivals", href: "/collections?sort=new" },
  ],
  help: [
    { label: "Contact Us", href: "/contact" },
    { label: "FAQ", href: "/faq" },
    { label: "Order Tracking", href: "/order-tracking" },
    { label: "Shipping Policy", href: "/shipping-policy" },
    { label: "Refund Policy", href: "/refund-policy" },
  ],
  company: [
    { label: "About Us", href: "/about" },
    { label: "Privacy Policy", href: "/privacy-policy" },
    { label: "Terms of Service", href: "/terms" },
  ],
};

const trustBadges = [
  { icon: Shield, label: "Secure Checkout" },
  { icon: Truck, label: "Free Shipping ₹999+" },
  { icon: RefreshCw, label: "7-Day Returns" },
  { icon: CreditCard, label: "COD Available" },
];

export function SiteFooter() {
  const [email, setEmail] = useState("");
  const onSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes("@")) {
      toast.error("Please enter a valid email");
      return;
    }
    toast.success("Welcome to the Aurora Circle! Check your inbox for 10% off.");
    setEmail("");
  };

  return (
    <footer className="mt-auto bg-foreground text-background pb-16 lg:pb-0">
      {/* Trust badges */}
      <div className="border-b border-background/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8 grid grid-cols-2 md:grid-cols-4 gap-6">
          {trustBadges.map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-3 justify-center md:justify-start">
              <Icon className="h-6 w-6 text-gold" />
              <span className="text-sm font-medium">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Main footer */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Brand + newsletter */}
          <div className="lg:col-span-4 space-y-6">
            <Link href="/" className="font-serif text-3xl font-bold">
              Aurora <span className="text-gold-gradient">& Co.</span>
            </Link>
            <p className="text-sm text-background/70 max-w-xs leading-relaxed">
              Handcrafted artificial jewelry and curated gift hampers. Made in India, shipped with love across the country.
            </p>
            <div>
              <h4 className="text-sm font-semibold mb-3 uppercase tracking-wider">Join the Aurora Circle</h4>
              <form onSubmit={onSubscribe} className="flex gap-2 max-w-sm">
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="bg-background/10 border-background/20 text-background placeholder:text-background/50"
                />
                <Button type="submit" variant="secondary" className="shrink-0">
                  Subscribe
                </Button>
              </form>
              <p className="text-xs text-background/50 mt-2">Get 10% off your first order + early access to drops.</p>
            </div>
          </div>

          {/* Links */}
          <div className="lg:col-span-2">
            <h4 className="text-sm font-semibold mb-4 uppercase tracking-wider">Shop</h4>
            <ul className="space-y-2.5">
              {footerLinks.shop.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-background/70 hover:text-gold transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="lg:col-span-2">
            <h4 className="text-sm font-semibold mb-4 uppercase tracking-wider">Help</h4>
            <ul className="space-y-2.5">
              {footerLinks.help.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-background/70 hover:text-gold transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="lg:col-span-2">
            <h4 className="text-sm font-semibold mb-4 uppercase tracking-wider">Company</h4>
            <ul className="space-y-2.5">
              {footerLinks.company.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-background/70 hover:text-gold transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-sm font-semibold mb-4 uppercase tracking-wider">Contact</h4>
            <a href="tel:+918000000000" className="flex items-center gap-2 text-sm text-background/70 hover:text-gold">
              <Phone className="h-4 w-4" /> +91 80000 00000
            </a>
            <a href="mailto:hello@aurora-co.in" className="flex items-center gap-2 text-sm text-background/70 hover:text-gold">
              <Mail className="h-4 w-4" /> hello@aurora-co.in
            </a>
            <p className="flex items-start gap-2 text-sm text-background/70">
              <MapPin className="h-4 w-4 mt-0.5 shrink-0" /> Mumbai, Maharashtra, India
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram" className="text-background/70 hover:text-gold">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook" className="text-background/70 hover:text-gold">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noreferrer" aria-label="YouTube" className="text-background/70 hover:text-gold">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Payment icons + copyright */}
      <div className="border-t border-background/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-background/60 text-center md:text-left">
            © {new Date().getFullYear()} Aurora & Co. All rights reserved. • GSTIN: 27ABCDE1234F1Z5 • Made with care in India
          </p>
          <div className="flex items-center gap-2">
            {["VISA", "MC", "UPI", "RuPay", "COD"].map((p) => (
              <span
                key={p}
                className="text-[10px] font-bold tracking-wider px-2 py-1 bg-background/10 rounded text-background/80"
              >
                {p}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
