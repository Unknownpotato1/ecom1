"use client";

import { useState, useRef } from "react";
import { Image as ImageIcon, Upload, X, Search, Camera, FolderOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTabs, DialogTabsList, DialogTabsTrigger, DialogTabsContent } from "@/components/ui/dialog";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

// A curated set of jewelry-themed stock images for quick selection.
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
  aspect?: "mobile" | "desktop" | "square" | "auto";
  // If true, allows selecting multiple images at once (returns comma-separated data URLs)
  multiple?: boolean;
  // For multiple mode: callback with array of URLs
  onMultipleChange?: (urls: string[]) => void;
  multipleValue?: string[];
}

// Convert a File to a base64 data URL so it can be previewed and stored.
function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function ImagePicker({
  label,
  value,
  onChange,
  description,
  aspect = "auto",
  multiple = false,
  onMultipleChange,
  multipleValue = [],
}: ImagePickerProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [customUrl, setCustomUrl] = useState("");
  const [activeTab, setActiveTab] = useState<"upload" | "gallery">("upload");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

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

  // Handle file upload from device
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    try {
      const fileArray = Array.from(files);
      const dataUrls = await Promise.all(fileArray.map(fileToDataUrl));

      if (multiple && onMultipleChange) {
        onMultipleChange([...multipleValue, ...dataUrls]);
        toast.success(`${dataUrls.length} image${dataUrls.length > 1 ? "s" : ""} uploaded`);
      } else {
        onChange(dataUrls[0]!);
        toast.success("Image uploaded");
      }
    } catch {
      toast.error("Could not read image file");
    }
    // Reset input so the same file can be selected again
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (cameraInputRef.current) cameraInputRef.current.value = "";
  };

  const triggerFileInput = () => fileInputRef.current?.click();
  const triggerCameraInput = () => cameraInputRef.current?.click();

  return (
    <div className="grid gap-2">
      <Label>{label}</Label>
      {description && <p className="text-[11px] text-muted-foreground -mt-1">{description}</p>}

      {/* Hidden file inputs */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple={multiple}
        onChange={handleFileSelect}
        className="hidden"
      />
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        multiple={multiple}
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Preview + actions */}
      {!multiple ? (
        <div className="flex gap-2 items-start">
          {/* Single image preview */}
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

          <div className="flex-1 space-y-2">
            {/* Upload from device — primary action */}
            <Button type="button" size="sm" onClick={triggerFileInput} className="w-full">
              <Upload className="size-3.5 mr-1.5" /> Upload from Device
            </Button>
            <div className="flex gap-2">
              <Button type="button" variant="outline" size="sm" onClick={triggerCameraInput} className="flex-1">
                <Camera className="size-3.5 mr-1" /> Camera
              </Button>
              <Button type="button" variant="outline" size="sm" onClick={() => { setActiveTab("gallery"); setOpen(true); }} className="flex-1">
                <ImageIcon className="size-3.5 mr-1" /> Gallery
              </Button>
            </div>
            <Input
              type="url"
              value={customUrl || value}
              onChange={(e) => { setCustomUrl(e.target.value); onChange(e.target.value); }}
              placeholder="or paste image URL"
              className="text-xs h-8"
            />
          </div>
        </div>
      ) : (
        /* Multiple image mode */
        <div className="space-y-2">
          {/* Upload buttons */}
          <div className="flex gap-2">
            <Button type="button" size="sm" onClick={triggerFileInput} className="flex-1">
              <Upload className="size-3.5 mr-1.5" /> Upload Images
            </Button>
            <Button type="button" variant="outline" size="sm" onClick={triggerCameraInput}>
              <Camera className="size-3.5" />
            </Button>
            <Button type="button" variant="outline" size="sm" onClick={() => { setActiveTab("gallery"); setOpen(true); }}>
              <ImageIcon className="size-3.5" />
            </Button>
          </div>

          {/* Preview grid of selected images */}
          {multipleValue.length > 0 && (
            <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
              {multipleValue.map((img, i) => (
                <div key={i} className="relative aspect-square rounded-md overflow-hidden border bg-muted group">
                  { }
                  <img src={img} alt={`Image ${i + 1}`} className="w-full h-full object-cover" />
                  <button
                    onClick={() => onMultipleChange?.(multipleValue.filter((_, idx) => idx !== i))}
                    className="absolute top-0.5 right-0.5 w-5 h-5 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity"
                    aria-label="Remove image"
                  >
                    <X className="size-3" />
                  </button>
                  <span className="absolute bottom-0.5 left-0.5 bg-black/60 text-white text-[9px] px-1 rounded">
                    {i + 1}
                  </span>
                </div>
              ))}
            </div>
          )}
          {multipleValue.length === 0 && (
            <p className="text-xs text-muted-foreground text-center py-4 border border-dashed rounded-md">
              No images selected yet. Tap "Upload Images" to pick from your device.
            </p>
          )}
        </div>
      )}

      {/* Gallery dialog (stock images) */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Choose an Image</DialogTitle>
            <DialogDescription>
              Pick from the stock gallery below or switch to Upload tab to use your own images.
            </DialogDescription>
          </DialogHeader>

          {/* Tab switcher */}
          <div className="flex gap-2 border-b pb-3 mb-3">
            <Button
              variant={activeTab === "upload" ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveTab("upload")}
            >
              <Upload className="size-3.5 mr-1" /> Upload from Device
            </Button>
            <Button
              variant={activeTab === "gallery" ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveTab("gallery")}
            >
              <ImageIcon className="size-3.5 mr-1" /> Stock Gallery
            </Button>
          </div>

          {activeTab === "upload" ? (
            <div className="space-y-4">
              <div className="flex gap-2">
                <Button onClick={triggerFileInput} className="flex-1">
                  <FolderOpen className="size-4 mr-2" /> Choose Files
                </Button>
                <Button variant="outline" onClick={triggerCameraInput}>
                  <Camera className="size-4 mr-2" /> Take Photo
                </Button>
              </div>
              <div
                className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:border-primary hover:bg-primary/5 transition-colors"
                onClick={triggerFileInput}
              >
                <Upload className="size-8 mx-auto text-muted-foreground mb-2" />
                <p className="text-sm font-medium">Click to select images</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {multiple ? "Select multiple images at once" : "Select an image from your device"}
                </p>
              </div>
            </div>
          ) : (
            <>
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
                      if (multiple && onMultipleChange) {
                        onMultipleChange([...multipleValue, img.url]);
                      } else {
                        onChange(img.url);
                      }
                      setOpen(false);
                      toast.success(`Selected: ${img.label}`);
                    }}
                    className={cn(
                      "group relative rounded-lg overflow-hidden border-2 transition-all aspect-square",
                      (!multiple && value === img.url) ? "border-primary ring-2 ring-primary/20" : "border-transparent hover:border-primary/40",
                    )}
                  >
                    { }
                    <img src={img.url} alt={img.label} className="w-full h-full object-cover" loading="lazy" />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-end p-2">
                      <span className="text-white text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                        {img.label}
                      </span>
                    </div>
                  </button>
                ))}
              </div>

              {filtered.length === 0 && (
                <p className="text-center text-sm text-muted-foreground py-8">No images match your search.</p>
              )}
            </>
          )}

          {/* Custom URL — always available */}
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
                    if (multiple && onMultipleChange) {
                      onMultipleChange([...multipleValue, customUrl]);
                    } else {
                      onChange(customUrl);
                    }
                    setOpen(false);
                    setCustomUrl("");
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
