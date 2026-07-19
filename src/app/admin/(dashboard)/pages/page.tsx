"use client";

import { useState } from "react";
import {
  FileText,
  Plus,
  Pencil,
  Eye,
  MoreHorizontal,
  Trash2,
  Copy,
  Search,
  Globe,
} from "lucide-react";
import { AdminPageHeader } from "@/components/admin/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { formatDate } from "@/lib/format";
import { toast } from "sonner";

interface CmsPage {
  id: string;
  slug: string;
  title: string;
  status: "published" | "draft";
  updatedAt: string;
  description: string;
}

const initialPages: CmsPage[] = [
  { id: "p-about", slug: "about", title: "About Us", status: "published", updatedAt: "2026-06-12T10:00:00.000Z", description: "The story behind Aurora & Co. — handcrafted jewelry since 2019." },
  { id: "p-contact", slug: "contact", title: "Contact Us", status: "published", updatedAt: "2026-06-10T10:00:00.000Z", description: "Email, phone, and WhatsApp support hours." },
  { id: "p-privacy", slug: "privacy-policy", title: "Privacy Policy", status: "published", updatedAt: "2026-05-28T10:00:00.000Z", description: "How we handle and protect customer data." },
  { id: "p-refund", slug: "refund-policy", title: "Refund Policy", status: "published", updatedAt: "2026-05-28T10:00:00.000Z", description: "7-day hassle-free return & exchange policy." },
  { id: "p-shipping", slug: "shipping-policy", title: "Shipping Policy", status: "published", updatedAt: "2026-05-28T10:00:00.000Z", description: "Free shipping thresholds, COD charges, dispatch timelines." },
  { id: "p-terms", slug: "terms", title: "Terms of Service", status: "published", updatedAt: "2026-05-28T10:00:00.000Z", description: "Terms & conditions for using aurora-co.com." },
  { id: "p-faq", slug: "faq", title: "FAQ", status: "published", updatedAt: "2026-06-08T10:00:00.000Z", description: "Frequently asked questions about orders, sizing, and care." },
  { id: "p-track", slug: "order-tracking", title: "Order Tracking", status: "published", updatedAt: "2026-06-01T10:00:00.000Z", description: "Track your order status with order number + email." },
];

export default function AdminPagesPage() {
  const [pages, setPages] = useState<CmsPage[]>(initialPages);
  const [search, setSearch] = useState("");
  const [addOpen, setAddOpen] = useState(false);

  const filtered = pages.filter(
    (p) =>
      !search ||
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.slug.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Pages"
        description="CMS pages — about, policies, FAQ, and other static content."
        icon={<FileText className="size-5" />}
        actions={
          <Button onClick={() => setAddOpen(true)}>
            <Plus className="size-4" />
            Add Page
          </Button>
        }
      />

      <div className="flex items-center justify-between">
        <div className="relative">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search pages…"
            className="h-9 w-full pl-8 sm:w-72"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <p className="text-sm text-muted-foreground">{filtered.length} pages</p>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="pl-4">Page</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Updated</TableHead>
                <TableHead className="text-right pr-4">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="pl-4">
                    <p className="text-sm font-medium">{p.title}</p>
                    <p className="line-clamp-1 max-w-[400px] text-[11px] text-muted-foreground">{p.description}</p>
                  </TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">/{p.slug}</TableCell>
                  <TableCell>
                    <Badge variant={p.status === "published" ? "default" : "outline"}>
                      {p.status === "published" ? "Published" : "Draft"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{formatDate(p.updatedAt)}</TableCell>
                  <TableCell className="text-right pr-4">
                    <div className="flex items-center justify-end gap-1">
                      <Button asChild variant="ghost" size="sm">
                        <a href={`/${p.slug}`} target="_blank" rel="noreferrer">
                          <Eye className="size-4" />
                        </a>
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="size-8">
                            <MoreHorizontal className="size-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => toast.info("Page editor would open (demo).")}>
                            <Pencil className="size-4" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              const copy: CmsPage = { ...p, id: `${p.id}-copy`, slug: `${p.slug}-copy`, title: `${p.title} (Copy)` };
                              setPages((items) => [...items, copy]);
                              toast.success("Page duplicated (demo)");
                            }}
                          >
                            <Copy className="size-4" /> Duplicate
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-destructive focus:text-destructive"
                            onClick={() => {
                              setPages((items) => items.filter((i) => i.id !== p.id));
                              toast.error("Page deleted (demo)");
                            }}
                          >
                            <Trash2 className="size-4" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="h-32 text-center text-sm text-muted-foreground">
                    No pages found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <AddPageDialog
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onAdd={(page) => {
          setPages((items) => [page, ...items]);
          toast.success(`Page "${page.title}" created (demo)`);
          setAddOpen(false);
        }}
      />
    </div>
  );
}

function AddPageDialog({
  open,
  onClose,
  onAdd,
}: {
  open: boolean;
  onClose: () => void;
  onAdd: (p: CmsPage) => void;
}) {
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [body, setBody] = useState("");

  const handleSave = () => {
    if (!title.trim()) {
      toast.error("Title is required.");
      return;
    }
    onAdd({
      id: `p-${Date.now()}`,
      slug: slug || title.toLowerCase().replace(/\s+/g, "-"),
      title,
      status: "draft",
      updatedAt: new Date().toISOString(),
      description: description || "New page.",
    });
    setTitle("");
    setSlug("");
    setDescription("");
    setBody("");
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>New Page</DialogTitle>
          <DialogDescription>Create a new CMS page for your storefront.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-2">
          <div className="grid gap-2">
            <Label htmlFor="pg-title">Title</Label>
            <Input
              id="pg-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="About Us"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="pg-slug">Slug</Label>
            <div className="flex items-center gap-2">
              <Globe className="size-4 text-muted-foreground" />
              <Input
                id="pg-slug"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="about-us"
                className="font-mono"
              />
            </div>
            <p className="text-[11px] text-muted-foreground">
              URL: <span className="font-mono">aurora-co.com/{slug || "…"}</span>
            </p>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="pg-desc">Description</Label>
            <Textarea
              id="pg-desc"
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Short summary shown in the page list."
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="pg-body">Body (Markdown / HTML)</Label>
            <Textarea
              id="pg-body"
              rows={5}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="# Welcome to Aurora & Co.…"
              className="font-mono text-xs"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave}>
            <Plus className="size-4" />
            Create Page
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
