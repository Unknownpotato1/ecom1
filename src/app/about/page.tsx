import Link from "next/link";
import { Sparkles, Heart, Globe, Award, Truck, RefreshCw } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us",
  description: "Aurora & Co. was born in 2019 from a simple belief — beautiful jewelry shouldn't require a luxury price tag.",
};

const values = [
  { icon: Sparkles, title: "Handcrafted Quality", desc: "Every piece is hand-set and inspected by master karigars across India." },
  { icon: Heart, title: "Made with Love", desc: "We treat every order like a gift — because that's what it often is." },
  { icon: Globe, title: "Pan-India Shipping", desc: "We ship to every PIN code in India, with COD available across the country." },
  { icon: Award, title: "Honest Pricing", desc: "We work directly with artisans, cutting middlemen so you get fair prices." },
];

export default function AboutPage() {
  return (
    <>
      <section className="relative h-[50vh] min-h-[300px] bg-foreground overflow-hidden">
        { }
        <img
          src="https://images.unsplash.com/photo-1513885535751-8b9238bd3458?auto=format&fit=crop&w=1920&q=80"
          alt="Aurora jewelry workshop"
          className="absolute inset-0 w-full h-full object-cover opacity-70"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        <div className="relative h-full flex items-end">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 pb-10 lg:pb-16 text-white">
            <span className="text-xs font-semibold uppercase tracking-[0.25em] text-gold">Est. 2019</span>
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold mt-3">Our Story</h1>
            <p className="mt-3 max-w-2xl text-white/85">
              Aurora & Co. was born from a belief — that beautiful jewelry shouldn't require a luxury price tag.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 sm:px-6 py-12 lg:py-20 prose prose-lg max-w-none">
        <h2 className="font-serif text-3xl font-bold">From a small workshop to your door</h2>
        <p className="text-muted-foreground leading-relaxed">
          It started in 2019 with our founder, sitting in a tiny workshop in Mumbai, watching a karigar hand-set stones into a kundan necklace.
          The piece was exquisite — and the price the boutique would charge for it, eye-watering. There had to be a better way.
        </p>
        <p className="text-muted-foreground leading-relaxed mt-4">
          So we built one. We work directly with master artisans across India — the same hands that craft for luxury houses —
          and bring their work to you without the boutique markup. No middlemen. No inflated prices. Just honest, beautiful jewelry.
        </p>
        <p className="text-muted-foreground leading-relaxed mt-4">
          Today, Aurora & Co. serves over 50,000 customers across India. Every piece is still hand-inspected before it ships.
          Every order is still packed like a gift. And we still answer every customer message personally — because that's how it started.
        </p>
      </section>

      <section className="bg-secondary/40 py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <h2 className="font-serif text-3xl font-bold text-center mb-12">What We Stand For</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v) => (
              <div key={v.title} className="bg-background rounded-xl p-6 text-center border">
                <div className="w-14 h-14 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <v.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">{v.title}</h3>
                <p className="text-sm text-muted-foreground">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-16">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
          <div>
            <p className="font-serif text-4xl lg:text-5xl font-bold text-gold">50,000+</p>
            <p className="text-sm text-muted-foreground mt-1">Happy customers</p>
          </div>
          <div>
            <p className="font-serif text-4xl lg:text-5xl font-bold text-gold">4.8★</p>
            <p className="text-sm text-muted-foreground mt-1">Average rating</p>
          </div>
          <div>
            <p className="font-serif text-4xl lg:text-5xl font-bold text-gold">300+</p>
            <p className="text-sm text-muted-foreground mt-1">Unique designs</p>
          </div>
          <div>
            <p className="font-serif text-4xl lg:text-5xl font-bold text-gold">19,000+</p>
            <p className="text-sm text-muted-foreground mt-1">PIN codes served</p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 sm:px-6 py-12 text-center">
        <h2 className="font-serif text-3xl font-bold">Join the Aurora Circle</h2>
        <p className="text-muted-foreground mt-2">Discover handcrafted jewelry made with love, just for you.</p>
        <Link
          href="/collections"
          className="inline-flex items-center justify-center mt-6 px-8 py-3 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90 transition-colors"
        >
          Explore Collections
        </Link>
      </section>
    </>
  );
}
