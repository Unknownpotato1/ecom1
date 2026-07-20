"use client";

import { useState } from "react";
import { Image as ImageIcon, Upload, X, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

// A curated set of jewelry-themed stock images for quick selection.
// In production, this would pull from Cloudinary / Firebase Storage.
const GALLERY_IMAGES = [
  { url: "https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=1920&q=80", label: "Bridal set", category: "jewelry" },
  { url: "https://images.unsplash.com/photo-1617038220319-276b5e8a1f42?auto=format&fit=crop&w=1920&q=80", label: "Polki choker", category: "jewelry" },
  { url: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1920&q=80", label: "Kundan", category: "jewelry" },
  { url: "https://images.unsplash.com/photo-1611652022419-a9419f74343d?auto=format&fit=crop&w=1920&q=80", label: "Kada", category: "jewelry" },
  { url: "https://images.unsplash.com/photo-1535632066927-ab7c11ab949d?auto=format&fit=crop&w=1920&q=80", label: "Jhumkas", category: "jewelry" },
  { url: "https://images.unsplash.com/photo-1588444837495-c6cfeb53f32d?auto=format&fit=crop&w=1920&q=80", label: "Minimal", category: "jewelry" },
  { url: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1920&q=80", label: "Ring", category: "jewelry" },
  { url: "https://images.unsplash.com/photo-1513885535751-8b9238bd3458?auto=format&fit=crop&w=1920&q=80", label: "Hamper", category: "hampers" },
  { url: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=1920&q=80", label: "Gift box", category: "hampers" },
  { url: "https://images.unsplash.com/photo-1573883431205-98b5f10aaedb?auto=format&fit=crop&w=1920&q=80", label: "Mangalsutra", category: "jewelry" },
];

interface ImagePickerProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  description?: string;
  // "mobile" shows a 9:16 aspect ratio preview, "desktop" shows 16:9, "square" shows 1:1
  aspect?: "mobile" | "desktop" | "square" | "auto";
}

export function ImagePicker({ label, value, onChange, description, aspect = "auto" }: ImagePickerProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [customUrl, setCustomUrl] = useState("");

  const aspectClass =
    aspect === "mobile" ? "aspect-[9/16]" :
    aspect === "desktop" ? "aspect-[16/9]" :
    aspect === "square" ? "aspect-square" :
    "aspect-[4/3]";

  const filtered = GALLERY_IMAGES.filter(
    (img) =>
      img.label.toLowerCase().includes(search.toLowerCase()) ||
      img.category.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="grid gap-2">
      <Label>{label}</Label>
      {description && <p className="text-[11px] text-muted-foreground -mt-1">{description}</p>}
      <div className="flex gap-2 items-start">
        {/* Preview thumbnail */}
        <div className={cn("relative w-20 h-20 rounded-md overflow-hidden border bg-muted shrink-0", aspect === "mobile" && "w-12 h-20")}>
          {value ? (
            <>
              { }
              <img src={value} alt={label} className="w-full h-full object-cover" />
              <button
                onClick={() => onChange("")}
                className="absolute top-0.5 right-0.5 w-5 h-5 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80"
                aria-label="Remove image"
              >
                <X className="size-3" />
              </button>
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
              <ImageIcon className="size-5" />
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex-1 space-y-2">
          <Button type="button" variant="outline" size="sm" onClick={() => setOpen(true)} className="w-full">
            <ImageIcon className="size-3.5 mr-1.5" /> Choose from Gallery
          </Button>
          <div className="flex gap-2">
            <Input
              type="url"
              value={customUrl || value}
              onChange={(e) => { setCustomUrl(e.target.value); onChange(e.target.value); }}
              placeholder="or paste image URL"
              className="text-xs h-8"
            />
          </div>
        </div>
      </div>

      {/* Gallery dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Choose an Image</DialogTitle>
            <DialogDescription>
              Pick from the gallery below or paste a custom URL. In production, this connects to your Cloudinary media library.
            </DialogDescription>
          </DialogHeader>

          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search images…"
              className="pl-10"
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {filtered.map((img) => (
              <button
                key={img.url}
                onClick={() => {
                  onChange(img.url);
                  setOpen(false);
                  toast.success(`Selected: ${img.label}`);
                }}
                className={cn(
                  "group relative rounded-lg overflow-hidden border-2 transition-all aspect-square",
                  value === img.url ? "border-primary ring-2 ring-primary/20" : "border-transparent hover:border-primary/40",
                )}
              >
                { }
                <img src={img.url} alt={img.label} className="w-full h-full object-cover" loading="lazy" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-end p-2">
                  <span className="text-white text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                    {img.label}
                  </span>
                </div>
                {value === img.url && (
                  <div className="absolute top-1 right-1 w-5 h-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-[10px]">
                    ✓
                  </div>
                )}
              </button>
            ))}
          </div>

          {filtered.length === 0 && (
            <p className="text-center text-sm text-muted-foreground py-8">No images match your search.</p>
          )}

          <div className="mt-4 pt-4 border-t">
            <Label className="text-xs">Custom URL</Label>
            <div className="flex gap-2 mt-1">
              <Input
                type="url"
                value={customUrl}
                onChange={(e) => setCustomUrl(e.target.value)}
                placeholder="https://your-image-url.jpg"
              />
              <Button
                onClick={() => {
                  if (customUrl) {
                    onChange(customUrl);
                    setOpen(false);
                    toast.success("Custom image URL set");
                  }
                }}
              >
                Use URL
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
