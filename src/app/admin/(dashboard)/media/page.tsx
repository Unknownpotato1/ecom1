"use client";

import { useMemo, useState } from "react";
import {
  Image as ImageIcon,
  Upload,
  Search,
  Trash2,
  Copy,
  MoreHorizontal,
  Folder,
  Download,
} from "lucide-react";
import { AdminPageHeader } from "@/components/admin/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { mockMediaItems, type AdminMediaItem } from "@/lib/admin-data";
import { toast } from "sonner";

const FOLDERS = ["All", "Jewelry", "Hampers", "Banners", "Instagram"];

function formatSize(kb: number): string {
  if (kb < 1024) return `${kb} KB`;
  return `${(kb / 1024).toFixed(1)} MB`;
}

export default function AdminMediaPage() {
  const [folder, setFolder] = useState("All");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const filtered = useMemo(() => {
    return mockMediaItems.filter((m) => {
      if (folder !== "All" && m.folder !== folder) return false;
      if (search && !m.name.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [folder, search]);

  const folderCounts = useMemo(() => {
    const counts: Record<string, number> = { All: mockMediaItems.length };
    for (const f of FOLDERS.slice(1)) {
      counts[f] = mockMediaItems.filter((m) => m.folder === f).length;
    }
    return counts;
  }, []);

  const toggleSelect = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Media Library"
        description="Images, banners, and assets used across your storefront."
        icon={<ImageIcon className="size-5" />}
        actions={
          <Button onClick={() => toast.success("Upload started — would upload to Firebase Storage (demo).")}>
            <Upload className="size-4" />
            Upload
          </Button>
        }
      />

      <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
        {/* Folder sidebar */}
        <Card className="h-fit p-2">
          <CardContent className="p-2">
            <p className="px-2 pb-2 pt-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Folders
            </p>
            <div className="space-y-0.5">
              {FOLDERS.map((f) => (
                <button
                  key={f}
                  onClick={() => setFolder(f)}
                  className={`flex w-full items-center justify-between rounded-md px-2 py-1.5 text-sm transition-colors ${
                    folder === f ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <Folder className="size-4" />
                    {f}
                  </span>
                  <span className={`text-[11px] ${folder === f ? "opacity-80" : "text-muted-foreground"}`}>
                    {folderCounts[f] ?? 0}
                  </span>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Grid */}
        <div className="space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by file name…"
                className="h-9 w-full pl-8 sm:w-72"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            {selected.size > 0 && (
              <div className="flex items-center gap-2">
                <Badge variant="secondary">{selected.size} selected</Badge>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    toast.success(`Copied ${selected.size} URLs (demo)`);
                    setSelected(new Set());
                  }}
                >
                  <Copy className="size-4" /> Copy URLs
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-destructive"
                  onClick={() => {
                    toast.error(`Deleted ${selected.size} items (demo)`);
                    setSelected(new Set());
                  }}
                >
                  <Trash2 className="size-4" /> Delete
                </Button>
              </div>
            )}
          </div>

          {filtered.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center p-12 text-center">
                <ImageIcon className="mb-3 size-8 text-muted-foreground" />
                <p className="text-sm font-medium">No media found</p>
                <p className="text-xs text-muted-foreground">Try a different folder or upload new images.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {filtered.map((m) => (
                <MediaCard
                  key={m.id}
                  item={m}
                  selected={selected.has(m.id)}
                  onToggle={() => toggleSelect(m.id)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function MediaCard({
  item,
  selected,
  onToggle,
}: {
  item: AdminMediaItem;
  selected: boolean;
  onToggle: () => void;
}) {
  return (
    <Card
      className={`group relative overflow-hidden p-0 transition-all ${
        selected ? "ring-2 ring-primary" : "hover:ring-1 hover:ring-primary/40"
      }`}
    >
      <div className="relative aspect-square overflow-hidden bg-muted">
        <img
          src={item.url}
          alt={item.alt ?? item.name}
          className="size-full object-cover transition-transform group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 flex items-end justify-between gap-2 bg-gradient-to-t from-black/70 via-black/0 to-black/0 p-2 opacity-0 transition-opacity group-hover:opacity-100">
          <Badge variant="secondary" className="bg-white/90 text-[10px]">
            {item.folder}
          </Badge>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="icon" className="size-7 bg-white/90">
                <MoreHorizontal className="size-3.5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => {
                  navigator.clipboard?.writeText(item.url);
                  toast.success("Image URL copied");
                }}
              >
                <Copy className="size-4" /> Copy URL
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => toast.info("Download started (demo)")}>
                <Download className="size-4" /> Download
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onClick={() => toast.error("Asset deleted (demo)")}
              >
                <Trash2 className="size-4" /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <button
          onClick={onToggle}
          aria-label={selected ? "Deselect" : "Select"}
          className={`absolute left-2 top-2 flex size-5 items-center justify-center rounded border-2 transition-colors ${
            selected ? "border-primary bg-primary text-primary-foreground" : "border-white/80 bg-black/30 text-transparent group-hover:border-white"
          }`}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} className="size-3">
            <path d="M20 6 9 17l-5-5" />
          </svg>
        </button>
      </div>
      <CardContent className="p-2">
        <p className="truncate text-xs font-medium" title={item.name}>{item.name}</p>
        <p className="text-[10px] text-muted-foreground">{formatSize(item.size)}</p>
      </CardContent>
    </Card>
  );
}
