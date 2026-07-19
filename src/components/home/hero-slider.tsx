"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { heroSlides } from "@/lib/data";
import { cn } from "@/lib/utils";

export function HeroSlider() {
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  const slides = heroSlides.filter((s) => s.enabled);
  const speed = 5000;

  const next = useCallback(() => setIdx((i) => (i + 1) % slides.length), [slides.length]);
  const prev = useCallback(() => setIdx((i) => (i - 1 + slides.length) % slides.length), [slides.length]);

  useEffect(() => {
    if (paused || slides.length <= 1) return;
    const id = setInterval(next, speed);
    return () => clearInterval(id);
  }, [paused, next, slides.length, speed]);

  if (slides.length === 0) return null;

  return (
    <section
      className="relative w-full overflow-hidden bg-foreground"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-roledescription="carousel"
      aria-label="Featured collections"
    >
      <div className="relative h-[60vh] sm:h-[70vh] lg:h-[85vh] min-h-[420px] max-h-[800px]">
        <AnimatePresence mode="sync">
          {slides.map((slide, i) => {
            const active = i === idx;
            if (!active && Math.abs(i - idx) > 1) return null;
            return (
              <motion.div
                key={slide.id}
                className={cn("absolute inset-0", active ? "z-10" : "z-0")}
                initial={{ opacity: 0 }}
                animate={{ opacity: active ? 1 : 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.2, ease: "easeInOut" }}
                aria-hidden={!active}
              >
                {/* Desktop image */}
                <picture>
                  <source media="(max-width: 768px)" srcSet={slide.mobileImage} />
                  { }
                  <img
                    src={slide.desktopImage}
                    alt={slide.heading}
                    className="absolute inset-0 w-full h-full object-cover"
                    fetchPriority="high"
                  />
                </picture>
                {/* Overlay */}
                <div
                  className="absolute inset-0 bg-black"
                  style={{ opacity: slide.overlayOpacity / 100 }}
                />
                {/* Content */}
                <div className="relative h-full mx-auto max-w-7xl px-6 lg:px-8 flex items-center">
                  <div
                    className={cn(
                      "max-w-2xl text-white",
                      slide.textAlignment === "center" && "mx-auto text-center",
                      slide.textAlignment === "right" && "ml-auto text-right"
                    )}
                  >
                    <motion.h2
                      initial={{ y: 30, opacity: 0 }}
                      animate={{ y: active ? 0 : 30, opacity: active ? 1 : 0 }}
                      transition={{ duration: 0.7, delay: 0.2 }}
                      className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight tracking-tight"
                    >
                      {slide.heading}
                    </motion.h2>
                    {slide.subheading && (
                      <motion.p
                        initial={{ y: 30, opacity: 0 }}
                        animate={{ y: active ? 0 : 30, opacity: active ? 1 : 0 }}
                        transition={{ duration: 0.7, delay: 0.35 }}
                        className="mt-4 text-base sm:text-lg lg:text-xl text-white/90 max-w-lg"
                      >
                        {slide.subheading}
                      </motion.p>
                    )}
                    {slide.buttonText && slide.buttonUrl && (
                      <motion.div
                        initial={{ y: 30, opacity: 0 }}
                        animate={{ y: active ? 0 : 30, opacity: active ? 1 : 0 }}
                        transition={{ duration: 0.7, delay: 0.5 }}
                        className="mt-8"
                      >
                        <Button asChild size="lg" className="bg-white text-foreground hover:bg-white/90">
                          <Link href={slide.buttonUrl}>
                            {slide.buttonText}
                          </Link>
                        </Button>
                      </motion.div>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {/* Arrows */}
        {slides.length > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-white/20 backdrop-blur-md text-white hover:bg-white/30 transition-colors flex items-center justify-center"
              aria-label="Previous slide"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={next}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-white/20 backdrop-blur-md text-white hover:bg-white/30 transition-colors flex items-center justify-center"
              aria-label="Next slide"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}

        {/* Dots */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {slides.map((s, i) => (
            <button
              key={s.id}
              onClick={() => setIdx(i)}
              className={cn(
                "h-1.5 rounded-full transition-all",
                i === idx ? "w-8 bg-white" : "w-1.5 bg-white/50 hover:bg-white/70"
              )}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
