"use client";

import { useMemo, useState } from "react";
import {
  Star,
  Plus,
  Search,
  Pencil,
  Trash2,
  MoreHorizontal,
  BadgeCheck,
  ThumbsUp,
} from "lucide-react";
import { AdminPageHeader } from "@/components/admin/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
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
import { products } from "@/lib/data";
import { formatDate } from "@/lib/format";
import { toast } from "sonner";

interface ReviewRow {
  reviewId: string;
  productId: string;
  productName: string;
  authorName: string;
  rating: number;
  title: string;
  body: string;
  isVerified: boolean;
  helpful: number;
  createdAt: string;
}

const flatReviews: ReviewRow[] = products.flatMap((p) =>
  p.reviews.map((r) => ({
    reviewId: r.id,
    productId: p.id,
    productName: p.name,
    authorName: r.authorName,
    rating: r.rating,
    title: r.title,
    body: r.body,
    isVerified: r.isVerified,
    helpful: r.helpful ?? 0,
    createdAt: r.createdAt,
  })),
);

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={`size-3.5 ${i <= rating ? "fill-amber-400 text-amber-400" : "fill-muted text-muted-foreground"}`}
        />
      ))}
    </div>
  );
}

export default function AdminReviewsPage() {
  const [search, setSearch] = useState("");
  const [ratingFilter, setRatingFilter] = useState("all");
  const [verifiedFilter, setVerifiedFilter] = useState("all");

  const filtered = useMemo(() => {
    return flatReviews.filter((r) => {
      if (search) {
        const q = search.toLowerCase();
        if (!r.productName.toLowerCase().includes(q) && !r.authorName.toLowerCase().includes(q) && !r.title.toLowerCase().includes(q)) return false;
      }
      if (ratingFilter !== "all" && r.rating !== Number(ratingFilter)) return false;
      if (verifiedFilter === "verified" && !r.isVerified) return false;
      if (verifiedFilter === "unverified" && r.isVerified) return false;
      return true;
    });
  }, [search, ratingFilter, verifiedFilter]);

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Reviews"
        description="Moderate customer reviews across your catalog."
        icon={<Star className="size-5" />}
        actions={<AddReviewDialog />}
      />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search product, author, title…"
            className="h-9 w-full pl-8 sm:w-72"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Select value={ratingFilter} onValueChange={setRatingFilter}>
            <SelectTrigger className="h-9 w-32">
              <SelectValue placeholder="Rating" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All ratings</SelectItem>
              <SelectItem value="5">5 stars</SelectItem>
              <SelectItem value="4">4 stars</SelectItem>
              <SelectItem value="3">3 stars</SelectItem>
              <SelectItem value="2">2 stars</SelectItem>
              <SelectItem value="1">1 star</SelectItem>
            </SelectContent>
          </Select>
          <Select value={verifiedFilter} onValueChange={setVerifiedFilter}>
            <SelectTrigger className="h-9 w-36">
              <SelectValue placeholder="Verified" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="verified">Verified only</SelectItem>
              <SelectItem value="unverified">Unverified only</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="pl-4">Product</TableHead>
                <TableHead>Author</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Verified</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right pr-4">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.slice(0, 50).map((r) => (
                <TableRow key={r.reviewId}>
                  <TableCell className="pl-4">
                    <p className="text-sm font-medium">{r.productName}</p>
                    <p className="line-clamp-1 max-w-[280px] text-[11px] text-muted-foreground">{r.body}</p>
                  </TableCell>
                  <TableCell className="text-sm">{r.authorName}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5">
                      <Stars rating={r.rating} />
                      <span className="text-[11px] text-muted-foreground">{r.rating}.0</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">{r.title}</TableCell>
                  <TableCell>
                    {r.isVerified ? (
                      <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200">
                        <BadgeCheck className="size-3" /> Verified
                      </Badge>
                    ) : (
                      <Badge variant="outline">Unverified</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{formatDate(r.createdAt)}</TableCell>
                  <TableCell className="text-right pr-4">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="size-8">
                          <MoreHorizontal className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => toast.info("Edit review (demo)")}>
                          <Pencil className="size-4" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => toast.success(r.isVerified ? "Review unverified (demo)" : "Review verified (demo)")}
                        >
                          <BadgeCheck className="size-4" />
                          {r.isVerified ? "Mark Unverified" : "Mark Verified"}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-destructive focus:text-destructive"
                          onClick={() => toast.error("Review deleted (demo)")}
                        >
                          <Trash2 className="size-4" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="h-32 text-center text-sm text-muted-foreground">
                    No reviews match your filters.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {filtered.length > 50 && (
        <p className="text-center text-xs text-muted-foreground">
          Showing first 50 of {filtered.length} reviews.
        </p>
      )}
    </div>
  );
}

function AddReviewDialog() {
  const [open, setOpen] = useState(false);
  const [productId, setProductId] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [rating, setRating] = useState("5");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [isVerified, setIsVerified] = useState(true);
  const [imageUrl, setImageUrl] = useState("");

  const handleSave = () => {
    if (!productId) {
      toast.error("Please select a product.");
      return;
    }
    if (!authorName.trim() || !title.trim()) {
      toast.error("Author name and title are required.");
      return;
    }
    toast.success("Review added (demo)");
    setProductId("");
    setAuthorName("");
    setRating("5");
    setTitle("");
    setBody("");
    setIsVerified(true);
    setImageUrl("");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="size-4" />
          Add Review
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>New Review</DialogTitle>
          <DialogDescription>Add a customer review to a product.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-2">
          <div className="grid gap-2">
            <Label>Product</Label>
            <Select value={productId} onValueChange={setProductId}>
              <SelectTrigger>
                <SelectValue placeholder="Select a product" />
              </SelectTrigger>
              <SelectContent className="max-h-72">
                {products.map((p) => (
                  <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="rv-author">Author Name</Label>
              <Input
                id="rv-author"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                placeholder="Priya S."
              />
            </div>
            <div className="grid gap-2">
              <Label>Rating</Label>
              <Select value={rating} onValueChange={setRating}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[5, 4, 3, 2, 1].map((r) => (
                    <SelectItem key={r} value={String(r)}>{r} stars</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="rv-title">Title</Label>
            <Input
              id="rv-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Stunning in person"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="rv-body">Review</Label>
            <Textarea
              id="rv-body"
              rows={4}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="The photos don't do justice…"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="rv-img">Image URL (optional)</Label>
            <Input
              id="rv-img"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://images.unsplash.com/…"
            />
          </div>
          <label className="flex cursor-pointer items-center justify-between rounded-md border bg-background p-3">
            <div className="flex items-center gap-2">
              <ThumbsUp className="size-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium leading-tight">Verified Purchase</p>
                <p className="text-[11px] text-muted-foreground">Mark as a verified buyer review</p>
              </div>
            </div>
            <Switch checked={isVerified} onCheckedChange={setIsVerified} aria-label="Verified" />
          </label>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleSave}>
            <Plus className="size-4" />
            Add Review
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
