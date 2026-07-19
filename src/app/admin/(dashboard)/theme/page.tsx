"use client";

import { useState } from "react";
import {
  Palette,
  Save,
  Type,
  Square,
  Maximize,
  AlignVerticalSpaceAround,
  RotateCcw,
  ShoppingBag,
  Compass,
  PanelBottom,
  Shapes,
  GalleryHorizontalEnd,
  Wand2,
  LayoutGrid,
} from "lucide-react";
import { AdminPageHeader } from "@/components/admin/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { defaultThemeSettings } from "@/lib/data";
import type { ThemeSettings } from "@/lib/types";
import { formatINR } from "@/lib/format";
import { toast } from "sonner";

const HEADING_FONTS = [
  { value: "Playfair Display", label: "Playfair Display", css: "'Playfair Display', Georgia, serif" },
  { value: "Georgia", label: "Georgia", css: "Georgia, serif" },
  { value: "Cormorant Garamond", label: "Cormorant Garamond", css: "'Cormorant Garamond', serif" },
  { value: "Lora", label: "Lora", css: "Lora, Georgia, serif" },
];

const BODY_FONTS = [
  { value: "Inter", label: "Inter", css: "'Inter', system-ui, sans-serif" },
  { value: "system-ui", label: "System UI", css: "system-ui, sans-serif" },
  { value: "Helvetica Neue", label: "Helvetica Neue", css: "'Helvetica Neue', Arial, sans-serif" },
  { value: "Lato", label: "Lato", css: "Lato, sans-serif" },
];

export default function AdminThemePage() {
  const [theme, setTheme] = useState<ThemeSettings>(defaultThemeSettings);

  const update = <K extends keyof ThemeSettings>(key: K, value: ThemeSettings[K]) => {
    setTheme((t) => ({ ...t, [key]: value }));
  };

  const handleSave = () => {
    toast.success("Theme saved (demo)", {
      description: "Changes would apply to the storefront in production.",
    });
  };

  const handleReset = () => {
    setTheme(defaultThemeSettings);
    toast.info("Reset to defaults");
  };

  const headingCss = HEADING_FONTS.find((f) => f.value === theme.fontHeading)?.css ?? "'Playfair Display', serif";
  const bodyCss = BODY_FONTS.find((f) => f.value === theme.fontBody)?.css ?? "'Inter', sans-serif";

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Theme Settings"
        description="Customize colors, typography, and layout for your storefront."
        icon={<Palette className="size-5" />}
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={handleReset}>
              <RotateCcw className="size-4" />
              Reset
            </Button>
            <Button onClick={handleSave}>
              <Save className="size-4" />
              Save Theme
            </Button>
          </div>
        }
      />

      <div className="grid gap-6 lg:grid-cols-[420px_1fr]">
        {/* Controls */}
        <div className="space-y-4">
          {/* Colors */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Palette className="size-4" />
                Colors
              </CardTitle>
              <CardDescription>Brand palette applied across the storefront.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ColorRow
                label="Primary"
                description="Deep plum — used for buttons, links, accents"
                value={theme.primaryColor}
                onChange={(v) => update("primaryColor", v)}
              />
              <ColorRow
                label="Accent (Gold)"
                description="Champagne gold — highlights, badges"
                value={theme.accentColor}
                onChange={(v) => update("accentColor", v)}
              />
              <ColorRow
                label="Announcement BG"
                description="Background of the announcement bar"
                value={theme.announcement.background}
                onChange={(v) =>
                  update("announcement", { ...theme.announcement, background: v })
                }
              />
              <ColorRow
                label="Announcement Text"
                description="Text color of the announcement bar"
                value={theme.announcement.text}
                onChange={(v) =>
                  update("announcement", { ...theme.announcement, text: v })
                }
              />
              <label className="flex cursor-pointer items-center justify-between rounded-md border bg-background p-3">
                <div>
                  <p className="text-sm font-medium leading-tight">Show Announcement Bar</p>
                  <p className="text-[11px] text-muted-foreground">Toggle the top promo bar</p>
                </div>
                <input
                  type="checkbox"
                  checked={theme.announcement.enabled}
                  onChange={(e) =>
                    update("announcement", { ...theme.announcement, enabled: e.target.checked })
                  }
                  className="size-4 accent-[var(--primary)]"
                />
              </label>
            </CardContent>
          </Card>

          {/* Typography */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Type className="size-4" />
                Typography
              </CardTitle>
              <CardDescription>Font families for headings and body text.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label>Heading Font</Label>
                <Select
                  value={theme.fontHeading}
                  onValueChange={(v) => update("fontHeading", v)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {HEADING_FONTS.map((f) => (
                      <SelectItem key={f.value} value={f.value}>
                        <span style={{ fontFamily: f.css }}>{f.label}</span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label>Body Font</Label>
                <Select
                  value={theme.fontBody}
                  onValueChange={(v) => update("fontBody", v)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {BODY_FONTS.map((f) => (
                      <SelectItem key={f.value} value={f.value}>
                        <span style={{ fontFamily: f.css }}>{f.label}</span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Layout */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Square className="size-4" />
                Layout & Spacing
              </CardTitle>
              <CardDescription>Geometry of UI primitives and page width.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="grid gap-2">
                <div className="flex items-center justify-between">
                  <Label className="flex items-center gap-2">
                    <Square className="size-3.5" />
                    Button Radius
                  </Label>
                  <span className="text-xs font-mono text-muted-foreground">{theme.buttonRadius}px</span>
                </div>
                <Slider
                  value={[theme.buttonRadius]}
                  min={0}
                  max={24}
                  step={1}
                  onValueChange={(v) => update("buttonRadius", v[0] ?? 0)}
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center justify-between">
                  <Label className="flex items-center gap-2">
                    <Maximize className="size-3.5" />
                    Container Width
                  </Label>
                  <span className="text-xs font-mono text-muted-foreground">{theme.containerWidth}px</span>
                </div>
                <Slider
                  value={[theme.containerWidth]}
                  min={1024}
                  max={1600}
                  step={16}
                  onValueChange={(v) => update("containerWidth", v[0] ?? 1280)}
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center justify-between">
                  <Label className="flex items-center gap-2">
                    <AlignVerticalSpaceAround className="size-3.5" />
                    Section Spacing
                  </Label>
                  <span className="text-xs font-mono text-muted-foreground">{theme.sectionSpacing}px</span>
                </div>
                <Slider
                  value={[theme.sectionSpacing]}
                  min={32}
                  max={128}
                  step={4}
                  onValueChange={(v) => update("sectionSpacing", v[0] ?? 64)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Header */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Compass className="size-4" />
                Header
              </CardTitle>
              <CardDescription>Header layout and behavior.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <label className="flex items-center justify-between rounded-md border bg-background p-3 cursor-pointer">
                <div>
                  <p className="text-sm font-medium leading-tight">Transparent on top</p>
                  <p className="text-[11px] text-muted-foreground">Header is transparent at top of page, solid on scroll</p>
                </div>
                <input type="checkbox" defaultChecked className="size-4 accent-[var(--primary)]" />
              </label>
              <label className="flex items-center justify-between rounded-md border bg-background p-3 cursor-pointer">
                <div>
                  <p className="text-sm font-medium leading-tight">Sticky header</p>
                  <p className="text-[11px] text-muted-foreground">Header stays visible while scrolling</p>
                </div>
                <input type="checkbox" defaultChecked className="size-4 accent-[var(--primary)]" />
              </label>
              <label className="flex items-center justify-between rounded-md border bg-background p-3 cursor-pointer">
                <div>
                  <p className="text-sm font-medium leading-tight">Show secondary nav row</p>
                  <p className="text-[11px] text-muted-foreground">Desktop only — second row of category links</p>
                </div>
                <input type="checkbox" defaultChecked className="size-4 accent-[var(--primary)]" />
              </label>
              <div className="grid gap-2">
                <Label className="text-xs">Header style</Label>
                <Select defaultValue="modern">
                  <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="modern">Modern (centered logo)</SelectItem>
                    <SelectItem value="classic">Classic (logo left)</SelectItem>
                    <SelectItem value="split">Split (logo center, nav split)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Footer */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <PanelBottom className="size-4" />
                Footer
              </CardTitle>
              <CardDescription>Footer layout and content.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid gap-2">
                <Label className="text-xs">Footer style</Label>
                <Select defaultValue="rich">
                  <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="rich">Rich (4 columns + newsletter)</SelectItem>
                    <SelectItem value="minimal">Minimal (single row)</SelectItem>
                    <SelectItem value="expanded">Expanded (5 columns)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <label className="flex items-center justify-between rounded-md border bg-background p-3 cursor-pointer">
                <div>
                  <p className="text-sm font-medium leading-tight">Show trust badges row</p>
                  <p className="text-[11px] text-muted-foreground">Free shipping, returns, secure checkout icons</p>
                </div>
                <input type="checkbox" defaultChecked className="size-4 accent-[var(--primary)]" />
              </label>
              <label className="flex items-center justify-between rounded-md border bg-background p-3 cursor-pointer">
                <div>
                  <p className="text-sm font-medium leading-tight">Show payment icons</p>
                  <p className="text-[11px] text-muted-foreground">VISA, Mastercard, UPI, RuPay, COD</p>
                </div>
                <input type="checkbox" defaultChecked className="size-4 accent-[var(--primary)]" />
              </label>
              <label className="flex items-center justify-between rounded-md border bg-background p-3 cursor-pointer">
                <div>
                  <p className="text-sm font-medium leading-tight">Show newsletter signup</p>
                  <p className="text-[11px] text-muted-foreground">Email capture form in footer</p>
                </div>
                <input type="checkbox" defaultChecked className="size-4 accent-[var(--primary)]" />
              </label>
            </CardContent>
          </Card>

          {/* Icons */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Shapes className="size-4" />
                Icons
              </CardTitle>
              <CardDescription>Icon style and size.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid gap-2">
                <Label className="text-xs">Icon set</Label>
                <Select defaultValue="lucide">
                  <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="lucide">Lucide (modern, outlined)</SelectItem>
                    <SelectItem value="feather">Feather (minimal)</SelectItem>
                    <SelectItem value="heroicons">Heroicons (clean)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label className="text-xs">Icon size</Label>
                <Select defaultValue="medium">
                  <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="small">Small (16px)</SelectItem>
                    <SelectItem value="medium">Medium (20px)</SelectItem>
                    <SelectItem value="large">Large (24px)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Hero Slider */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <GalleryHorizontalEnd className="size-4" />
                Hero Slider
              </CardTitle>
              <CardDescription>Homepage carousel behavior.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <label className="flex items-center justify-between rounded-md border bg-background p-3 cursor-pointer">
                <div>
                  <p className="text-sm font-medium leading-tight">Autoplay</p>
                  <p className="text-[11px] text-muted-foreground">Automatically advance slides</p>
                </div>
                <input type="checkbox" defaultChecked className="size-4 accent-[var(--primary)]" />
              </label>
              <label className="flex items-center justify-between rounded-md border bg-background p-3 cursor-pointer">
                <div>
                  <p className="text-sm font-medium leading-tight">Fade transition</p>
                  <p className="text-[11px] text-muted-foreground">Fade between slides instead of slide</p>
                </div>
                <input type="checkbox" defaultChecked className="size-4 accent-[var(--primary)]" />
              </label>
              <label className="flex items-center justify-between rounded-md border bg-background p-3 cursor-pointer">
                <div>
                  <p className="text-sm font-medium leading-tight">Show arrows</p>
                  <p className="text-[11px] text-muted-foreground">Previous/next navigation arrows</p>
                </div>
                <input type="checkbox" defaultChecked className="size-4 accent-[var(--primary)]" />
              </label>
              <label className="flex items-center justify-between rounded-md border bg-background p-3 cursor-pointer">
                <div>
                  <p className="text-sm font-medium leading-tight">Show dots</p>
                  <p className="text-[11px] text-muted-foreground">Pagination dots at bottom</p>
                </div>
                <input type="checkbox" defaultChecked className="size-4 accent-[var(--primary)]" />
              </label>
              <div className="grid gap-2">
                <div className="flex items-center justify-between">
                  <Label className="text-xs">Autoplay speed (ms)</Label>
                  <span className="text-xs font-mono text-muted-foreground">5000ms</span>
                </div>
                <Slider defaultValue={[5000]} min={3000} max={10000} step={500} />
              </div>
            </CardContent>
          </Card>

          {/* Animations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Wand2 className="size-4" />
                Animations
              </CardTitle>
              <CardDescription>Motion and transition behavior.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <label className="flex items-center justify-between rounded-md border bg-background p-3 cursor-pointer">
                <div>
                  <p className="text-sm font-medium leading-tight">Enable hover effects</p>
                  <p className="text-[11px] text-muted-foreground">Scale, lift, and color transitions on hover</p>
                </div>
                <input type="checkbox" defaultChecked className="size-4 accent-[var(--primary)]" />
              </label>
              <label className="flex items-center justify-between rounded-md border bg-background p-3 cursor-pointer">
                <div>
                  <p className="text-sm font-medium leading-tight">Scroll-triggered animations</p>
                  <p className="text-[11px] text-muted-foreground">Fade in elements as they enter viewport</p>
                </div>
                <input type="checkbox" defaultChecked className="size-4 accent-[var(--primary)]" />
              </label>
              <label className="flex items-center justify-between rounded-md border bg-background p-3 cursor-pointer">
                <div>
                  <p className="text-sm font-medium leading-tight">Page transitions</p>
                  <p className="text-[11px] text-muted-foreground">Animate between route changes</p>
                </div>
                <input type="checkbox" defaultChecked className="size-4 accent-[var(--primary)]" />
              </label>
              <label className="flex items-center justify-between rounded-md border bg-background p-3 cursor-pointer">
                <div>
                  <p className="text-sm font-medium leading-tight">Animated add-to-cart</p>
                  <p className="text-[11px] text-muted-foreground">Fly-to-cart animation on add</p>
                </div>
                <input type="checkbox" defaultChecked className="size-4 accent-[var(--primary)]" />
              </label>
              <div className="grid gap-2">
                <Label className="text-xs">Animation speed</Label>
                <Select defaultValue="normal">
                  <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="instant">Instant (no animation)</SelectItem>
                    <SelectItem value="fast">Fast (200ms)</SelectItem>
                    <SelectItem value="normal">Normal (400ms)</SelectItem>
                    <SelectItem value="slow">Slow (700ms)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Layouts */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <LayoutGrid className="size-4" />
                Layouts
              </CardTitle>
              <CardDescription>Page-level layout options.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid gap-2">
                <Label className="text-xs">Product grid columns (desktop)</Label>
                <Select defaultValue="4">
                  <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="3">3 columns</SelectItem>
                    <SelectItem value="4">4 columns</SelectItem>
                    <SelectItem value="5">5 columns</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label className="text-xs">Product page layout</Label>
                <Select defaultValue="split">
                  <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="split">Split (image left, info right)</SelectItem>
                    <SelectItem value="stacked">Stacked (image top, info below)</SelectItem>
                    <SelectItem value="gallery">Gallery (full-width image)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label className="text-xs">Collection page layout</Label>
                <Select defaultValue="sidebar">
                  <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sidebar">Sidebar filters</SelectItem>
                    <SelectItem value="topbar">Top filter bar</SelectItem>
                    <SelectItem value="drawer">Drawer filters (mobile-style)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label className="text-xs">Cart style</Label>
                <Select defaultValue="drawer">
                  <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="drawer">Slide-out drawer</SelectItem>
                    <SelectItem value="page">Dedicated cart page</SelectItem>
                    <SelectItem value="modal">Modal popup</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Live preview */}
        <Card className="overflow-hidden">
          <CardHeader className="border-b bg-muted/30">
            <CardTitle className="flex items-center gap-2 text-base">
              <ShoppingBag className="size-4" />
              Live Preview
            </CardTitle>
            <CardDescription>
              Sample product card with your theme applied.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div
              className="mx-auto rounded-xl border p-6"
              style={{
                background: "oklch(0.985 0.008 80)",
                maxWidth: theme.containerWidth,
                fontFamily: bodyCss,
              }}
            >
              {/* Announcement bar mock */}
              {theme.announcement.enabled && (
                <div
                  className="mb-4 rounded-md px-4 py-2 text-center text-sm font-medium"
                  style={{
                    background: theme.announcement.background,
                    color: theme.announcement.text,
                  }}
                >
                  ✦ Free shipping on prepaid orders above ₹999
                </div>
              )}

              <div className="mb-4 flex items-center justify-between">
                <h3
                  className="text-xl font-semibold"
                  style={{ fontFamily: headingCss, color: theme.primaryColor }}
                >
                  Aurora <span style={{ color: theme.accentColor }}>&amp; Co.</span>
                </h3>
                <div
                  className="rounded-full px-4 py-1.5 text-xs font-medium text-white"
                  style={{
                    background: theme.primaryColor,
                    borderRadius: `${theme.buttonRadius}px`,
                  }}
                >
                  Shop Now
                </div>
              </div>

              <Separator className="my-4" />

              {/* Product card mock */}
              <div
                className="overflow-hidden rounded-lg border bg-white"
                style={{ borderRadius: `${theme.buttonRadius + 4}px` }}
              >
                <div className="aspect-[4/3] bg-muted">
                  { }
                  <img
                    src="https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=600&q=80"
                    alt="Aurora Kundan Bridal Set"
                    className="size-full object-cover"
                  />
                </div>
                <div style={{ padding: `${theme.sectionSpacing / 4}px` }}>
                  <p className="text-[11px] font-medium uppercase tracking-wider" style={{ color: theme.accentColor }}>
                    Bridal Edit
                  </p>
                  <h4
                    className="mt-1 text-lg font-semibold"
                    style={{ fontFamily: headingCss, color: "#1a1a1a" }}
                  >
                    Aurora Kundan Bridal Set
                  </h4>
                  <p className="mt-1 text-sm" style={{ color: "#666" }}>
                    Hand-set Kundan stones with delicate pearl drops.
                  </p>
                  <div className="mt-3 flex items-center justify-between">
                    <div>
                      <span className="text-lg font-semibold" style={{ color: theme.primaryColor }}>
                        {formatINR(4999)}
                      </span>
                      <span className="ml-2 text-sm line-through" style={{ color: "#999" }}>
                        {formatINR(8999)}
                      </span>
                    </div>
                    <button
                      className="px-4 py-2 text-xs font-semibold text-white transition-opacity hover:opacity-90"
                      style={{
                        background: theme.primaryColor,
                        borderRadius: `${theme.buttonRadius}px`,
                      }}
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>

              {/* Section spacing preview */}
              <div style={{ marginTop: `${theme.sectionSpacing}px` }} className="rounded-lg border border-dashed bg-white/50 p-4 text-center">
                <p className="text-xs" style={{ color: "#999", fontFamily: bodyCss }}>
                  Section spacing set to <span className="font-mono">{theme.sectionSpacing}px</span> · Container width{" "}
                  <span className="font-mono">{theme.containerWidth}px</span>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function ColorRow({
  label,
  description,
  value,
  onChange,
}: {
  label: string;
  description?: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="min-w-0">
        <p className="text-sm font-medium leading-tight">{label}</p>
        {description && <p className="text-[11px] text-muted-foreground">{description}</p>}
      </div>
      <div className="flex items-center gap-2">
        <span className="font-mono text-[11px] text-muted-foreground">{value.toUpperCase()}</span>
        <div className="relative size-9 overflow-hidden rounded-md border">
          <input
            type="color"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="absolute -inset-2 size-[calc(100%+1rem)] cursor-pointer border-0 p-0"
            aria-label={label}
          />
        </div>
      </div>
    </div>
  );
}
