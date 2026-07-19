import Link from "next/link";
import type { Metadata } from "next";
import { ChevronRight } from "lucide-react";

interface PolicyPageProps {
  title: string;
  updatedAt?: string;
  sections: { heading: string; body: string[] }[];
}

export function PolicyPage({ title, updatedAt = "July 2026", sections }: PolicyPageProps) {
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-12 lg:py-16">
      <nav className="text-xs text-muted-foreground mb-3 flex items-center gap-1">
        <Link href="/" className="hover:text-foreground">Home</Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-foreground">{title}</span>
      </nav>
      <h1 className="font-serif text-3xl sm:text-4xl font-bold mb-2">{title}</h1>
      <p className="text-sm text-muted-foreground mb-8">Last updated: {updatedAt}</p>

      <div className="space-y-8">
        {sections.map((s, i) => (
          <section key={i}>
            <h2 className="font-serif text-xl font-semibold mb-3">{s.heading}</h2>
            <div className="space-y-3">
              {s.body.map((p, j) => (
                <p key={j} className="text-sm text-muted-foreground leading-relaxed">{p}</p>
              ))}
            </div>
          </section>
        ))}
      </div>

      <div className="mt-12 p-5 bg-secondary/40 rounded-lg border">
        <h3 className="font-semibold mb-1">Need help?</h3>
        <p className="text-sm text-muted-foreground">
          If you have any questions, please contact us at{" "}
          <a href="mailto:hello@aurora-co.in" className="text-primary hover:underline">hello@aurora-co.in</a>
          {" "}or{" "}
          <a href="tel:+918000000000" className="text-primary hover:underline">+91 80000 00000</a>.
        </p>
      </div>
    </div>
  );
}
