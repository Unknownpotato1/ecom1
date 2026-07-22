"use client";

import { useMemo, useState } from "react";
import { Plus, Search, MoreHorizontal, Pencil, Trash2, Copy, Package, Star, Sparkles, Gift, Zap, X } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { ImagePicker } from "@/components/admin/image-picker";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { products as allProducts, categories } from "@/lib/data";
import { formatINR, slugify } from "@/lib/format";
import { toast } from "sonner";

const PAGE_SIZE = 10;

export default function AdminProductsPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string>("all");
  const [status, setStatus] = useState<string>("all");
  const [page, setPage] = useState(0);

  const filtered = useMemo(() => {
    return allProducts.filter((p) => {
      if (search) {
        const q = search.toLowerCase();
        if (!p.name.toLowerCase().includes(q) && !p.sku.toLowerCase().includes(q)) return false;
      }
      if (category !== "all" && p.category !== category) return false;
      if (status === "published" && !p.isPublished) return false;
      if (status === "draft" && p.isPublished) return false;
      return true;
    });
  }, [search, category, status]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const current = Math.min(page, pageCount - 1);
  const rows = filtered.slice(current * PAGE_SIZE, current * PAGE_SIZE + PAGE_SIZE);

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Products"
        description="Manage your jewelry catalog and gift hampers."
        icon={<Package className="size-5" />}
        actions={<AddProductDialog />}
      />

      <Tabs defaultValue="all">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <TabsList>
            <TabsTrigger value="all">All ({allProducts.length})</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
          </TabsList>

          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search name or SKU…"
                className="h-9 w-full pl-8 sm:w-64"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(0);
                }}
              />
            </div>
            <Select value={category} onValueChange={(v) => { setCategory(v); setPage(0); }}>
              <SelectTrigger className="h-9 w-40">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All categories</SelectItem>
                {categories.map((c) => (
                  <SelectItem key={c.id} value={c.slug}>{c.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={status} onValueChange={(v) => { setStatus(v); setPage(0); }}>
              <SelectTrigger className="h-9 w-32">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <TabsContent value="all" className="mt-4">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="pl-4">Product</TableHead>
                    <TableHead>SKU</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Inventory</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Flags</TableHead>
                    <TableHead className="text-right pr-4">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rows.map((p) => (
                    <TableRow key={p.id} className="hover:bg-muted/40">
                      <TableCell className="pl-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={p.images[0]?.url}
                            alt={p.name}
                            className="size-10 rounded-md object-cover ring-1 ring-border"
                          />
                          <div className="min-w-0">
                            <div className="truncate text-sm font-medium">{p.name}</div>
                            <div className="text-[11px] text-muted-foreground capitalize">{p.category}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-xs">{p.sku}</TableCell>
                      <TableCell>
                        <div className="text-sm font-medium">{formatINR(p.basePrice)}</div>
                        {p.compareAtPrice && (
                          <div className="text-[11px] text-muted-foreground line-through">
                            {formatINR(p.compareAtPrice)}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={p.inventory < 5 ? "destructive" : p.inventory < 10 ? "secondary" : "outline"}
                          className="tabular-nums"
                        >
                          {p.inventory} in stock
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={p.isPublished ? "default" : "outline"}>
                          {p.isPublished ? "Published" : "Draft"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {p.isFeatured && <FlagChip icon={<Sparkles className="size-3" />} label="Featured" color="text-violet-600" />}
                          {p.isBestSeller && <FlagChip icon={<Star className="size-3" />} label="Best" color="text-amber-600" />}
                          {p.isNewArrival && <FlagChip icon={<Zap className="size-3" />} label="New" color="text-emerald-600" />}
                          {p.isGiftHamper && <FlagChip icon={<Gift className="size-3" />} label="Hamper" color="text-rose-600" />}
                        </div>
                      </TableCell>
                      <TableCell className="text-right pr-4">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="size-8">
                              <MoreHorizontal className="size-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => toast.info("Edit dialog would open (demo).")}>
                              <Pencil className="size-4" /> Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => toast.success("Product duplicated (demo).")}>
                              <Copy className="size-4" /> Duplicate
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-destructive focus:text-destructive"
                              onClick={() => toast.error("Product deleted (demo).")}
                            >
                              <Trash2 className="size-4" /> Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                  {rows.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} className="h-32 text-center text-sm text-muted-foreground">
                        No products match your filters.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Pagination */}
          <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
            <p>
              Showing {current * PAGE_SIZE + 1}–{Math.min((current + 1) * PAGE_SIZE, filtered.length)} of {filtered.length}
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={current === 0}
              >
                Previous
              </Button>
              <span className="text-xs">Page {current + 1} of {pageCount}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.min(pageCount - 1, p + 1))}
                disabled={current >= pageCount - 1}
              >
                Next
              </Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="categories" className="mt-4">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="pl-4">Category</TableHead>
                    <TableHead>Slug</TableHead>
                    <TableHead>Products</TableHead>
                    <TableHead>Sort Order</TableHead>
                    <TableHead className="text-right pr-4">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {categories.map((c) => (
                    <TableRow key={c.id}>
                      <TableCell className="pl-4">
                        <div className="flex items-center gap-3">
                          <img src={c.image.url} alt={c.name} className="size-10 rounded-md object-cover ring-1 ring-border" />
                          <span className="text-sm font-medium">{c.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-xs">{c.slug}</TableCell>
                      <TableCell className="text-sm">{c.productCount}</TableCell>
                      <TableCell className="text-sm">{c.sortOrder}</TableCell>
                      <TableCell className="text-right pr-4">
                        <Button variant="ghost" size="sm" onClick={() => toast.info("Edit category (demo)")}>
                          <Pencil className="size-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function FlagChip({ icon, label, color }: { icon: React.ReactNode; label: string; color: string }) {
  return (
    <span className={`inline-flex items-center gap-0.5 rounded border border-border bg-muted/60 px-1.5 py-0.5 text-[10px] font-medium ${color}`}>
      {icon}
      {label}
    </span>
  );
}

function AddProductDialog() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [basePrice, setBasePrice] = useState("");
  const [compareAtPrice, setCompareAtPrice] = useState("");
  const [sku, setSku] = useState("");
  const [category, setCategory] = useState("");
  const [inventory, setInventory] = useState("");
  const [tags, setTags] = useState("");
  const [isFeatured, setIsFeatured] = useState(false);
  const [isBestSeller, setIsBestSeller] = useState(false);
  const [isNewArrival, setIsNewArrival] = useState(false);
  const [isGiftHamper, setIsGiftHamper] = useState(false);
  const [isPublished, setIsPublished] = useState(true);
  const [imageUrl, setImageUrl] = useState("");
  const [additionalImages, setAdditionalImages] = useState<string[]>([]);
  const [seoTitle, setSeoTitle] = useState("");
  const [seoDescription, setSeoDescription] = useState("");
  // Specifications — label/value pairs shown on the product page's Specs tab
  const [specs, setSpecs] = useState<{ label: string; value: string }[]>([
    { label: "", value: "" },
  ]);

  const slug = slugify(name);

  const reset = () => {
    setName("");
    setDescription("");
    setBasePrice("");
    setCompareAtPrice("");
    setSku("");
    setCategory("");
    setInventory("");
    setTags("");
    setIsFeatured(false);
    setIsBestSeller(false);
    setIsNewArrival(false);
    setIsGiftHamper(false);
    setIsPublished(true);
    setImageUrl("");
    setAdditionalImages([]);
    setSeoTitle("");
    setSeoDescription("");
    setSpecs([{ label: "", value: "" }]);
  };

  const handleSave = () => {
    if (!name.trim()) {
      toast.error("Product name is required.");
      return;
    }
    if (!basePrice || Number(basePrice) <= 0) {
      toast.error("Please enter a valid price.");
      return;
    }
    toast.success(`Product "${name}" created (demo)`);
    reset();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) reset(); }}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="size-4" />
          Add Product
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl overflow-y-auto max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>New Product</DialogTitle>
          <DialogDescription>
            Create a new jewelry piece or gift hamper. Changes are demo-only.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-2">
          <div className="grid gap-2">
            <Label htmlFor="p-name">Name</Label>
            <Input
              id="p-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Aurora Kundan Bridal Set"
            />
            {name && (
              <p className="text-xs text-muted-foreground">
                Slug: <span className="font-mono">{slug}</span>
              </p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="p-desc">Description</Label>
            <Textarea
              id="p-desc"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="A breathtaking 3-piece bridal set inspired by Mughal craftsmanship…"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="grid gap-2">
              <Label htmlFor="p-price">Base Price (₹)</Label>
              <Input
                id="p-price"
                type="number"
                value={basePrice}
                onChange={(e) => setBasePrice(e.target.value)}
                placeholder="4999"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="p-compare">Compare at (₹)</Label>
              <Input
                id="p-compare"
                type="number"
                value={compareAtPrice}
                onChange={(e) => setCompareAtPrice(e.target.value)}
                placeholder="8999"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="p-sku">SKU</Label>
              <Input
                id="p-sku"
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                placeholder="AUR-P017"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label>Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((c) => (
                    <SelectItem key={c.id} value={c.slug}>{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="p-inv">Inventory</Label>
              <Input
                id="p-inv"
                type="number"
                value={inventory}
                onChange={(e) => setInventory(e.target.value)}
                placeholder="25"
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="p-tags">Tags (comma separated)</Label>
            <Input
              id="p-tags"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="bridal, kundan, wedding"
            />
          </div>

          <div className="grid gap-2">
            <ImagePicker
              label="Main Image"
              value={imageUrl}
              onChange={setImageUrl}
              description="Primary product image shown first in the gallery"
              aspect="square"
            />
          </div>

          {/* Additional images */}
          <div className="grid gap-2">
            <Label>Additional Images (optional)</Label>
            <p className="text-[11px] text-muted-foreground -mt-1">
              Add more images for the product gallery (swipeable on mobile)
            </p>
            <div className="space-y-2">
              {additionalImages.map((img, i) => (
                <div key={i} className="flex gap-2 items-center">
                  <div className="w-12 h-12 rounded-md overflow-hidden border bg-muted shrink-0">
                    {img && (
                       
                      <img src={img} alt={`Additional ${i + 1}`} className="w-full h-full object-cover" />
                    )}
                  </div>
                  <Input
                    value={img}
                    onChange={(e) => {
                      const next = [...additionalImages];
                      next[i] = e.target.value;
                      setAdditionalImages(next);
                    }}
                    placeholder="Image URL or use the picker below"
                    className="flex-1 text-xs"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="size-8 shrink-0"
                    onClick={() => setAdditionalImages(additionalImages.filter((_, idx) => idx !== i))}
                  >
                    <X className="size-3.5" />
                  </Button>
                </div>
              ))}
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setAdditionalImages([...additionalImages, ""])}
                >
                  <Plus className="size-3.5 mr-1" /> Add Image Slot
                </Button>
              </div>
            </div>
          </div>

          {/* Specifications — shown on product page Specs tab */}
          <div className="rounded-lg border bg-muted/30 p-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Specifications
                </p>
                <p className="text-[11px] text-muted-foreground">
                  Shown in the "Specifications" tab on the product page
                </p>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setSpecs([...specs, { label: "", value: "" }])}
              >
                <Plus className="size-3.5 mr-1" /> Add Row
              </Button>
            </div>
            <div className="space-y-2">
              {specs.map((spec, i) => (
                <div key={i} className="flex gap-2 items-center">
                  <Input
                    value={spec.label}
                    onChange={(e) => {
                      const next = [...specs];
                      next[i] = { ...next[i]!, label: e.target.value };
                      setSpecs(next);
                    }}
                    placeholder="Label (e.g., Material)"
                    className="flex-1 text-xs h-8"
                  />
                  <Input
                    value={spec.value}
                    onChange={(e) => {
                      const next = [...specs];
                      next[i] = { ...next[i]!, value: e.target.value };
                      setSpecs(next);
                    }}
                    placeholder="Value (e.g., Brass, gold-plated)"
                    className="flex-1 text-xs h-8"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="size-8 shrink-0"
                    onClick={() => setSpecs(specs.filter((_, idx) => idx !== i))}
                    disabled={specs.length === 1}
                  >
                    <X className="size-3.5" />
                  </Button>
                </div>
              ))}
            </div>
            <p className="text-[11px] text-muted-foreground mt-2">
              Example: Material → Brass, gold-plated | Weight → 180g | Closure → Adjustable hook
            </p>
          </div>

          <div className="rounded-lg border bg-muted/30 p-4">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Flags & visibility
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              <ToggleRow label="Published" desc="Visible on storefront" checked={isPublished} onChange={setIsPublished} />
              <ToggleRow label="Featured" desc="Show in featured grid" checked={isFeatured} onChange={setIsFeatured} />
              <ToggleRow label="Best Seller" desc="Show in best sellers" checked={isBestSeller} onChange={setIsBestSeller} />
              <ToggleRow label="New Arrival" desc="Show in new arrivals" checked={isNewArrival} onChange={setIsNewArrival} />
              <ToggleRow label="Gift Hamper" desc="This is a hamper, not jewelry" checked={isGiftHamper} onChange={setIsGiftHamper} />
            </div>
          </div>

          <div className="rounded-lg border bg-muted/30 p-4">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              SEO
            </p>
            <div className="grid gap-3">
              <div className="grid gap-2">
                <Label htmlFor="p-seo-title">SEO Title</Label>
                <Input
                  id="p-seo-title"
                  value={seoTitle}
                  onChange={(e) => setSeoTitle(e.target.value)}
                  placeholder="Aurora Kundan Bridal Set — Aurora & Co."
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="p-seo-desc">Meta Description</Label>
                <Textarea
                  id="p-seo-desc"
                  rows={2}
                  value={seoDescription}
                  onChange={(e) => setSeoDescription(e.target.value)}
                  placeholder="Shop the Aurora Kundan Bridal Set…"
                />
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleSave}>
            <Plus className="size-4" />
            Create Product
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function ToggleRow({
  label,
  desc,
  checked,
  onChange,
}: {
  label: string;
  desc: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-3 rounded-md border bg-background p-3">
      <div className="min-w-0">
        <p className="text-sm font-medium leading-tight">{label}</p>
        <p className="text-[11px] text-muted-foreground">{desc}</p>
      </div>
      <Switch checked={checked} onCheckedChange={onChange} aria-label={label} />
    </label>
  );
}
