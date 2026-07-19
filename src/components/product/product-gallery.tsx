"use client";

import { useState, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, ZoomIn, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ImageAsset } from "@/lib/types";

interface ProductGalleryProps {
  images: ImageAsset[];
  name: string;
  videoUrl?: string;
}

export function ProductGallery({ images, name, videoUrl }: ProductGalleryProps) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [showZoom, setShowZoom] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
  const imgRef = useRef<HTMLDivElement>(null);

  const onMove = (e: React.MouseEvent) => {
    if (!imgRef.current) return;
    const rect = imgRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPos({ x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) });
  };

  const mediaItems = useMemo(() => {
    const items: { type: "image" | "video"; url: string; alt?: string }[] = images.map((img) => ({
      type: "image" as const,
      url: img.url,
      alt: img.alt,
    }));
    if (videoUrl) items.push({ type: "video", url: videoUrl });
    return items;
  }, [images, videoUrl]);

  if (images.length === 0) return null;

  return (
    <div className="flex flex-col-reverse md:flex-row gap-3">
      {/* Thumbnails */}
      <div className="flex md:flex-col gap-2 overflow-x-auto md:overflow-y-auto md:max-h-[600px] no-scrollbar md:w-20 shrink-0">
        {mediaItems.map((item, i) => (
          <button
            key={i}
            onClick={() => setActiveIdx(i)}
            className={cn(
              "shrink-0 w-16 h-20 md:w-full md:h-24 rounded-md overflow-hidden border-2 transition-all",
              i === activeIdx ? "border-primary" : "border-transparent hover:border-border"
            )}
            aria-label={`View ${item.type} ${i + 1}`}
          >
            {item.type === "image" ? (
               
              <img src={item.url} alt={item.alt ?? name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-foreground flex items-center justify-center text-background text-xs font-medium">
                Video
              </div>
            )}
          </button>
        ))}
      </div>

      {/* Main image */}
      <div className="flex-1">
        <div
          ref={imgRef}
          className="relative aspect-square rounded-xl overflow-hidden bg-muted cursor-zoom-in group"
          onMouseMove={onMove}
          onMouseEnter={() => setShowZoom(true)}
          onMouseLeave={() => setShowZoom(false)}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIdx}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0"
            >
              {mediaItems[activeIdx]?.type === "video" ? (
                <video className="w-full h-full object-cover" controls>
                  <source src={mediaItems[activeIdx]?.url} type="video/mp4" />
                </video>
              ) : (
                <>
                  { }
                  <img
                    src={mediaItems[activeIdx]?.url}
                    alt={mediaItems[activeIdx]?.alt ?? name}
                    className="w-full h-full object-cover transition-transform duration-200"
                    style={{
                      transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
                      transform: showZoom ? "scale(2)" : "scale(1)",
                    }}
                  />
                  <div className="absolute top-3 right-3 bg-background/80 backdrop-blur px-2 py-1 rounded-md text-xs flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <ZoomIn className="h-3 w-3" /> Hover to zoom
                  </div>
                </>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Arrows */}
          {mediaItems.length > 1 && (
            <>
              <button
                onClick={() => setActiveIdx((i) => (i - 1 + mediaItems.length) % mediaItems.length)}
                className="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-background/80 backdrop-blur flex items-center justify-center hover:bg-background"
                aria-label="Previous image"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={() => setActiveIdx((i) => (i + 1) % mediaItems.length)}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-background/80 backdrop-blur flex items-center justify-center hover:bg-background"
                aria-label="Next image"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </>
          )}
        </div>

        {/* Mobile thumbnails (horizontal) */}
        <div className="md:hidden flex gap-2 mt-3 overflow-x-auto no-scrollbar">
          {mediaItems.map((item, i) => (
            <button
              key={i}
              onClick={() => setActiveIdx(i)}
              className={cn(
                "shrink-0 w-16 h-20 rounded-md overflow-hidden border-2 transition-all",
                i === activeIdx ? "border-primary" : "border-transparent"
              )}
              aria-label={`View ${item.type} ${i + 1}`}
            >
              {item.type === "image" ? (
                 
                <img src={item.url} alt={item.alt ?? name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-foreground flex items-center justify-center text-background text-xs">Video</div>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
