import Link from "next/link";
import { Home, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6 py-20 lg:py-32 text-center">
      <p className="font-serif text-[10rem] sm:text-[14rem] leading-none font-bold text-gold-gradient">404</p>
      <h1 className="font-serif text-3xl sm:text-4xl font-bold -mt-4">Page Not Found</h1>
      <p className="text-muted-foreground mt-3 max-w-md mx-auto">
        The page you're looking for doesn't exist or has been moved. Let's get you back on track.
      </p>
      <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
        <Button asChild size="lg">
          <Link href="/"><Home className="h-4 w-4 mr-2" /> Back to Home</Link>
        </Button>
        <Button asChild variant="outline" size="lg">
          <Link href="/collections"><Search className="h-4 w-4 mr-2" /> Browse Collections</Link>
        </Button>
      </div>

      <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-4 text-left">
        {[
          { label: "Necklaces", href: "/collections?category=necklaces" },
          { label: "Earrings", href: "/collections?category=earrings" },
          { label: "Gift Hampers", href: "/collections/curated-hampers" },
          { label: "Bridal Edit", href: "/collections/bridal-collection" },
        ].map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className="p-3 border rounded-lg hover:border-primary transition-colors text-sm font-medium text-center"
          >
            {l.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
