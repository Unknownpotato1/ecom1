"use client";

import { useState } from "react";
import { Plus, FolderTree, Pencil, Trash2, MoreHorizontal, Copy } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
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
import { collections, products } from "@/lib/data";
import { slugify } from "@/lib/format";
import { toast } from "sonner";

export default function AdminCollectionsPage() {
  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Collections"
        description="Group products into themed collections for the storefront."
        icon={<FolderTree className="size-5" />}
        actions={<AddCollectionDialog />}
      />

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {[...collections].sort((a, b) => a.sortOrder - b.sortOrder).map((c) => (
          <Card key={c.id} className="overflow-hidden p-0 gap-0">
            <div className="relative aspect-[16/9] overflow-hidden bg-muted">
              <img
                src={c.bannerImage.url}
                alt={c.bannerImage.alt}
                className="size-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0" />
              <div className="absolute left-3 top-3 flex items-center gap-2">
                {c.isFeatured ? (
                  <Badge className="bg-primary/90 text-primary-foreground">Featured</Badge>
                ) : (
                  <Badge variant="secondary">Standard</Badge>
                )}
              </div>
              <div className="absolute bottom-3 left-3 right-3">
                <h3 className="font-serif text-lg font-semibold text-white drop-shadow-sm">
                  {c.name}
                </h3>
                <p className="mt-0.5 text-[11px] font-medium uppercase tracking-wider text-white/70">
                  Sort order · {c.sortOrder}
                </p>
              </div>
              <div className="absolute right-3 top-3">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="secondary" size="icon" className="size-8 bg-white/90 backdrop-blur hover:bg-white">
                      <MoreHorizontal className="size-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => toast.info("Edit collection (demo)")}>
                      <Pencil className="size-4" /> Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => toast.success("Collection duplicated (demo)")}>
                      <Copy className="size-4" /> Duplicate
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="text-destructive focus:text-destructive"
                      onClick={() => toast.error("Collection deleted (demo)")}
                    >
                      <Trash2 className="size-4" /> Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            <CardContent className="p-4">
              <p className="line-clamp-2 text-sm text-muted-foreground">
                {c.description}
              </p>
              <div className="mt-3 flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Badge variant="outline">{c.productIds.length} products</Badge>
                  <span className="font-mono">/{c.slug}</span>
                </div>
                <Button asChild variant="ghost" size="sm">
                  <a href={`/collections/${c.slug}`} target="_blank" rel="noreferrer">
                    View
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Hint: products available to add */}
      <Card className="border-dashed bg-muted/30">
        <CardContent className="flex items-center gap-3 p-4 text-sm text-muted-foreground">
          <FolderTree className="size-4" />
          {products.length} products available to assign to collections.
        </CardContent>
      </Card>
    </div>
  );
}

function AddCollectionDialog() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [bannerUrl, setBannerUrl] = useState("");
  const [sortOrder, setSortOrder] = useState("1");
  const [isFeatured, setIsFeatured] = useState(false);

  const slug = slugify(name);

  const handleSave = () => {
    if (!name.trim()) {
      toast.error("Collection name is required.");
      return;
    }
    toast.success(`Collection "${name}" created (demo)`);
    setName("");
    setDescription("");
    setBannerUrl("");
    setSortOrder("1");
    setIsFeatured(false);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="size-4" />
          Add Collection
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>New Collection</DialogTitle>
          <DialogDescription>
            Create a themed collection. Products can be assigned after creation.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-2">
          <div className="grid gap-2">
            <Label htmlFor="c-name">Name</Label>
            <Input
              id="c-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Bridal Collection"
            />
            {name && (
              <p className="text-xs text-muted-foreground">
                Slug: <span className="font-mono">{slug}</span>
              </p>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="c-desc">Description</Label>
            <Textarea
              id="c-desc"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Heirloom-inspired jewelry for the modern bride."
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="c-banner">Banner Image URL</Label>
            <Input
              id="c-banner"
              value={bannerUrl}
              onChange={(e) => setBannerUrl(e.target.value)}
              placeholder="https://images.unsplash.com/…"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="c-sort">Sort order</Label>
              <Input
                id="c-sort"
                type="number"
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
              />
            </div>
            <label className="flex cursor-pointer items-center justify-between gap-3 rounded-md border bg-background p-3 self-end">
              <div>
                <p className="text-sm font-medium leading-tight">Featured</p>
                <p className="text-[11px] text-muted-foreground">Show in featured grid</p>
              </div>
              <Switch checked={isFeatured} onCheckedChange={setIsFeatured} aria-label="Featured" />
            </label>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleSave}>
            <Plus className="size-4" />
            Create Collection
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
