"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ZoomIn } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ImageAsset } from "@/lib/types";

interface ProductGalleryProps {
  images: ImageAsset[];
  name: string;
  videoUrl?: string;
}

interface MediaItem {
  type: "image" | "video";
  url: string;
  alt?: string;
}

export function ProductGallery({ images, name, videoUrl }: ProductGalleryProps) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [showZoom, setShowZoom] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number | null>(null);
  const touchDeltaX = useRef(0);

  const mediaItems: MediaItem[] = [
    ...images.map((img) => ({ type: "image" as const, url: img.url, alt: img.alt })),
    ...(videoUrl ? [{ type: "video" as const, url: videoUrl }] : []),
  ];

  const next = useCallback(() => {
    setActiveIdx((i) => (i + 1) % mediaItems.length);
  }, [mediaItems.length]);

  const prev = useCallback(() => {
    setActiveIdx((i) => (i - 1 + mediaItems.length) % mediaItems.length);
  }, [mediaItems.length]);

  const onMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPos({ x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) });
  };

  // Keyboard navigation
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") next();
      else if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev]);

  // Touch handlers for swipe
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0]?.clientX ?? null;
    touchDeltaX.current = 0;
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    touchDeltaX.current = e.touches[0]!.clientX - touchStartX.current;
  };

  const onTouchEnd = () => {
    const threshold = 50; // px
    if (touchDeltaX.current < -threshold) {
      next();
    } else if (touchDeltaX.current > threshold) {
      prev();
    }
    touchStartX.current = null;
    touchDeltaX.current = 0;
  };

  if (mediaItems.length === 0) return null;

  const current = mediaItems[activeIdx];
  const isVideo = current?.type === "video";
  const progressPct = ((activeIdx + 1) / mediaItems.length) * 100;

  return (
    <div className="flex flex-col gap-3">
      {/* Main image — swipeable */}
      <div
        ref={containerRef}
        className="relative aspect-square rounded-xl overflow-hidden bg-muted cursor-zoom-in group select-none"
        onMouseMove={onMove}
        onMouseEnter={() => setShowZoom(true)}
        onMouseLeave={() => setShowZoom(false)}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={activeIdx}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="absolute inset-0"
          >
            {isVideo ? (
              <video className="w-full h-full object-cover" controls>
                <source src={current?.url} type="video/mp4" />
              </video>
            ) : (
              <>
                { }
                <img
                  src={current?.url}
                  alt={current?.alt ?? name}
                  className="w-full h-full object-cover transition-transform duration-200"
                  style={{
                    transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
                    transform: showZoom ? "scale(2)" : "scale(1)",
                  }}
                  draggable={false}
                />
                {/* Hover-to-zoom hint — desktop only */}
                <div className="hidden sm:block absolute top-3 right-3 bg-background/80 backdrop-blur px-2 py-1 rounded-md text-xs flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  <ZoomIn className="h-3 w-3" /> Hover to zoom
                </div>
              </>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Image counter badge — top-left */}
        <div className="absolute top-3 left-3 bg-black/60 backdrop-blur text-white text-xs font-medium px-2.5 py-1 rounded-full">
          {activeIdx + 1} / {mediaItems.length}
        </div>

        {/* Premium progress bar — bottom */}
        {mediaItems.length > 1 && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/20">
            <motion.div
              className="h-full bg-white/90"
              initial={false}
              animate={{ width: `${progressPct}%` }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            />
          </div>
        )}
      </div>

      {/* Premium dot indicator */}
      {mediaItems.length > 1 && (
        <div className="flex items-center justify-center gap-2 py-1">
          {mediaItems.map((item, i) => (
            <button
              key={i}
              onClick={() => setActiveIdx(i)}
              className={cn(
                "h-2 rounded-full transition-all duration-300",
                i === activeIdx
                  ? "w-8 bg-primary"
                  : "w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50",
              )}
              aria-label={`Go to ${item.type} ${i + 1}`}
            >
              <span className="sr-only">{item.type} {i + 1}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
