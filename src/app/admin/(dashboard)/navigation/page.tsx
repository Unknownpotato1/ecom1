"use client";

import { useState } from "react";
import {
  Compass,
  Plus,
  Pencil,
  Trash2,
  ChevronUp,
  ChevronDown,
  Menu,
  Link as LinkIcon,
  Megaphone,
  Eye,
  EyeOff,
  Save,
} from "lucide-react";
import { AdminPageHeader } from "@/components/admin/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { announcements as initialAnnouncements } from "@/lib/data";
import { toast } from "sonner";

interface NavLink {
  id: string;
  label: string;
  href: string;
}

interface FooterLinkGroup {
  id: string;
  label: string;
  links: NavLink[];
}

const initialHeaderLinks: NavLink[] = [
  { id: "h1", label: "Necklaces", href: "/collections?category=necklaces" },
  { id: "h2", label: "Earrings", href: "/collections?category=earrings" },
  { id: "h3", label: "Bracelets", href: "/collections?category=bracelets" },
  { id: "h4", label: "Rings", href: "/collections?category=rings" },
  { id: "h5", label: "Bridal Edit", href: "/collections/bridal-collection" },
  { id: "h6", label: "Gift Hampers", href: "/collections/curated-hampers" },
  { id: "h7", label: "About", href: "/about" },
];

const initialFooterGroups: FooterLinkGroup[] = [
  {
    id: "g1",
    label: "Shop",
    links: [
      { id: "f1", label: "Necklaces", href: "/collections?category=necklaces" },
      { id: "f2", label: "Earrings", href: "/collections?category=earrings" },
      { id: "f3", label: "Bracelets", href: "/collections?category=bracelets" },
      { id: "f4", label: "Gift Hampers", href: "/collections/curated-hampers" },
    ],
  },
  {
    id: "g2",
    label: "Help",
    links: [
      { id: "f5", label: "Contact Us", href: "/contact" },
      { id: "f6", label: "FAQ", href: "/faq" },
      { id: "f7", label: "Shipping Policy", href: "/shipping-policy" },
      { id: "f8", label: "Refund Policy", href: "/refund-policy" },
    ],
  },
  {
    id: "g3",
    label: "Company",
    links: [
      { id: "f9", label: "About Us", href: "/about" },
      { id: "f10", label: "Privacy Policy", href: "/privacy-policy" },
      { id: "f11", label: "Terms of Service", href: "/terms" },
    ],
  },
];

function uid(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 8)}`;
}

export default function AdminNavigationPage() {
  const [headerLinks, setHeaderLinks] = useState<NavLink[]>(initialHeaderLinks);
  const [footerGroups, setFooterGroups] = useState<FooterLinkGroup[]>(initialFooterGroups);
  const [announcements, setAnnouncements] = useState(initialAnnouncements);
  const [editing, setEditing] = useState<{ kind: "header" | "footer" | "announcement"; id?: string; groupId?: string } | null>(null);

  // --- Header link ops ---
  const moveHeader = (id: string, dir: -1 | 1) => {
    setHeaderLinks((items) => {
      const idx = items.findIndex((i) => i.id === id);
      const target = idx + dir;
      if (idx < 0 || target < 0 || target >= items.length) return items;
      const next = [...items];
      [next[idx], next[target]] = [next[target]!, next[idx]!];
      return next;
    });
  };
  const deleteHeader = (id: string) => {
    setHeaderLinks((items) => items.filter((i) => i.id !== id));
    toast.error("Link removed");
  };
  const upsertHeader = (link: NavLink) => {
    setHeaderLinks((items) => {
      const exists = items.find((i) => i.id === link.id);
      if (exists) return items.map((i) => (i.id === link.id ? link : i));
      return [...items, link];
    });
  };

  // --- Footer link ops ---
  const moveFooter = (groupId: string, id: string, dir: -1 | 1) => {
    setFooterGroups((groups) =>
      groups.map((g) => {
        if (g.id !== groupId) return g;
        const idx = g.links.findIndex((i) => i.id === id);
        const target = idx + dir;
        if (idx < 0 || target < 0 || target >= g.links.length) return g;
        const next = [...g.links];
        [next[idx], next[target]] = [next[target]!, next[idx]!];
        return { ...g, links: next };
      }),
    );
  };
  const deleteFooter = (groupId: string, id: string) => {
    setFooterGroups((groups) =>
      groups.map((g) =>
        g.id === groupId ? { ...g, links: g.links.filter((l) => l.id !== id) } : g,
      ),
    );
    toast.error("Link removed");
  };
  const upsertFooter = (groupId: string, link: NavLink) => {
    setFooterGroups((groups) =>
      groups.map((g) => {
        if (g.id !== groupId) return g;
        const exists = g.links.find((l) => l.id === link.id);
        const links = exists
          ? g.links.map((l) => (l.id === link.id ? link : l))
          : [...g.links, link];
        return { ...g, links };
      }),
    );
  };

  // --- Announcement ops ---
  const moveAnnouncement = (id: string, dir: -1 | 1) => {
    setAnnouncements((items) => {
      const idx = items.findIndex((i) => i.id === id);
      const target = idx + dir;
      if (idx < 0 || target < 0 || target >= items.length) return items;
      const next = [...items];
      [next[idx], next[target]] = [next[target]!, next[idx]!];
      return next;
    });
  };
  const toggleAnnouncement = (id: string) => {
    setAnnouncements((items) =>
      items.map((a) => (a.id === id ? { ...a, enabled: !a.enabled } : a)),
    );
  };
  const deleteAnnouncement = (id: string) => {
    setAnnouncements((items) => items.filter((i) => i.id !== id));
    toast.error("Announcement removed");
  };

  const handleSave = () => {
    toast.success("Navigation saved (demo)", {
      description: `${headerLinks.length} header links · ${footerGroups.reduce((s, g) => s + g.links.length, 0)} footer links · ${announcements.length} announcements`,
    });
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Navigation"
        description="Edit header links, footer groups, and announcement bar."
        icon={<Compass className="size-5" />}
        actions={
          <Button onClick={handleSave}>
            <Save className="size-4" />
            Save
          </Button>
        }
      />

      <Tabs defaultValue="header">
        <TabsList>
          <TabsTrigger value="header">
            <Menu className="size-4" />
            Header
          </TabsTrigger>
          <TabsTrigger value="footer">
            <LinkIcon className="size-4" />
            Footer
          </TabsTrigger>
          <TabsTrigger value="announcements">
            <Megaphone className="size-4" />
            Announcements
          </TabsTrigger>
        </TabsList>

        {/* Header links */}
        <TabsContent value="header" className="space-y-4">
          <Card>
            <CardHeader className="flex-row items-center justify-between space-y-0">
              <div>
                <CardTitle>Header Navigation</CardTitle>
                <CardDescription>Top-level links shown in the storefront header.</CardDescription>
              </div>
              <Button size="sm" onClick={() => setEditing({ kind: "header" })}>
                <Plus className="size-4" />
                Add Link
              </Button>
            </CardHeader>
            <CardContent className="space-y-2">
              {headerLinks.map((link, idx) => (
                <div key={link.id} className="flex items-center gap-3 rounded-md border bg-background p-3">
                  <div className="flex flex-col gap-0.5">
                    <Button variant="ghost" size="icon" className="size-6" disabled={idx === 0} onClick={() => moveHeader(link.id, -1)}>
                      <ChevronUp className="size-3.5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="size-6" disabled={idx === headerLinks.length - 1} onClick={() => moveHeader(link.id, 1)}>
                      <ChevronDown className="size-3.5" />
                    </Button>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{link.label}</p>
                    <p className="font-mono text-[11px] text-muted-foreground">{link.href}</p>
                  </div>
                  <Button variant="ghost" size="icon" className="size-8" onClick={() => setEditing({ kind: "header", id: link.id })}>
                    <Pencil className="size-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="size-8 text-destructive hover:text-destructive" onClick={() => deleteHeader(link.id)}>
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              ))}
              {headerLinks.length === 0 && (
                <p className="rounded-md border border-dashed p-6 text-center text-sm text-muted-foreground">
                  No header links. Add one to populate your storefront header.
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Footer groups */}
        <TabsContent value="footer" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            {footerGroups.map((group) => (
              <Card key={group.id}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">{group.label}</CardTitle>
                  <CardDescription>{group.links.length} links</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  {group.links.map((link, idx) => (
                    <div key={link.id} className="flex items-center gap-2 rounded-md border bg-background p-2">
                      <div className="flex flex-col gap-0.5">
                        <Button variant="ghost" size="icon" className="size-5" disabled={idx === 0} onClick={() => moveFooter(group.id, link.id, -1)}>
                          <ChevronUp className="size-3" />
                        </Button>
                        <Button variant="ghost" size="icon" className="size-5" disabled={idx === group.links.length - 1} onClick={() => moveFooter(group.id, link.id, 1)}>
                          <ChevronDown className="size-3" />
                        </Button>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">{link.label}</p>
                        <p className="truncate font-mono text-[10px] text-muted-foreground">{link.href}</p>
                      </div>
                      <Button variant="ghost" size="icon" className="size-6" onClick={() => setEditing({ kind: "footer", id: link.id, groupId: group.id })}>
                        <Pencil className="size-3" />
                      </Button>
                      <Button variant="ghost" size="icon" className="size-6 text-destructive hover:text-destructive" onClick={() => deleteFooter(group.id, link.id)}>
                        <Trash2 className="size-3" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full"
                    onClick={() => setEditing({ kind: "footer", groupId: group.id })}
                  >
                    <Plus className="size-3.5" />
                    Add Link
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Announcements */}
        <TabsContent value="announcements" className="space-y-4">
          <Card>
            <CardHeader className="flex-row items-center justify-between space-y-0">
              <div>
                <CardTitle>Announcement Bar</CardTitle>
                <CardDescription>Rotating promo messages at the top of the storefront.</CardDescription>
              </div>
              <Button size="sm" onClick={() => setEditing({ kind: "announcement" })}>
                <Plus className="size-4" />
                Add Announcement
              </Button>
            </CardHeader>
            <CardContent className="space-y-2">
              {announcements.map((a, idx) => (
                <div key={a.id} className="flex items-center gap-3 rounded-md border bg-background p-3">
                  <div className="flex flex-col gap-0.5">
                    <Button variant="ghost" size="icon" className="size-6" disabled={idx === 0} onClick={() => moveAnnouncement(a.id, -1)}>
                      <ChevronUp className="size-3.5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="size-6" disabled={idx === announcements.length - 1} onClick={() => moveAnnouncement(a.id, 1)}>
                      <ChevronDown className="size-3.5" />
                    </Button>
                  </div>
                  <div className="flex size-9 items-center justify-center rounded-md bg-primary/10 text-primary">
                    <Megaphone className="size-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{a.text}</p>
                    {a.url && <p className="truncate font-mono text-[11px] text-muted-foreground">{a.url}</p>}
                  </div>
                  <Badge variant="outline" className="text-[10px]">#{a.sortOrder}</Badge>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-8"
                    onClick={() => toggleAnnouncement(a.id)}
                    aria-label={a.enabled ? "Disable" : "Enable"}
                  >
                    {a.enabled ? <Eye className="size-4" /> : <EyeOff className="size-4" />}
                  </Button>
                  <Button variant="ghost" size="icon" className="size-8" onClick={() => setEditing({ kind: "announcement", id: a.id })}>
                    <Pencil className="size-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="size-8 text-destructive hover:text-destructive" onClick={() => deleteAnnouncement(a.id)}>
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              ))}
              {announcements.length === 0 && (
                <p className="rounded-md border border-dashed p-6 text-center text-sm text-muted-foreground">
                  No announcements. Add one to display a promo bar.
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Separator />

      <EditNavigationDialog
        editing={editing}
        onClose={() => setEditing(null)}
        onSubmit={(payload) => {
          if (editing?.kind === "header") {
            upsertHeader(payload as NavLink);
          } else if (editing?.kind === "footer" && editing.groupId) {
            upsertFooter(editing.groupId, payload as NavLink);
          } else if (editing?.kind === "announcement") {
            const existing = announcements.find((a) => a.id === editing.id);
            const updated = {
              id: editing.id ?? uid("a"),
              text: (payload as { text: string }).text,
              url: (payload as { url?: string }).url || undefined,
              enabled: existing?.enabled ?? true,
              sortOrder: existing?.sortOrder ?? announcements.length + 1,
            };
            if (existing) {
              setAnnouncements((items) => items.map((a) => (a.id === existing.id ? updated : a)));
            } else {
              setAnnouncements((items) => [...items, updated]);
            }
          }
          toast.success("Saved (demo)");
          setEditing(null);
        }}
        // Pass current values for editing
        getCurrentValue={() => {
          if (!editing) return null;
          if (editing.kind === "header") {
            return headerLinks.find((l) => l.id === editing.id) ?? null;
          }
          if (editing.kind === "footer" && editing.groupId) {
            return footerGroups.find((g) => g.id === editing.groupId)?.links.find((l) => l.id === editing.id) ?? null;
          }
          if (editing.kind === "announcement") {
            const a = announcements.find((x) => x.id === editing.id);
            return a ? { label: a.text, href: a.url ?? "" } : null;
          }
          return null;
        }}
      />
    </div>
  );
}

function EditNavigationDialog({
  editing,
  onClose,
  onSubmit,
  getCurrentValue,
}: {
  editing: { kind: "header" | "footer" | "announcement"; id?: string; groupId?: string } | null;
  onClose: () => void;
  onSubmit: (payload: NavLink | { text: string; url?: string }) => void;
  getCurrentValue: () => NavLink | { label: string; href: string } | null;
}) {
  // Force remount via key when editing target changes.
  return (
    <EditNavDialogInner
      key={`${editing?.kind ?? "none"}-${editing?.id ?? "new"}-${editing?.groupId ?? ""}`}
      editing={editing}
      onClose={onClose}
      onSubmit={onSubmit}
      getCurrentValue={getCurrentValue}
    />
  );
}

function EditNavDialogInner({
  editing,
  onClose,
  onSubmit,
  getCurrentValue,
}: {
  editing: { kind: "header" | "footer" | "announcement"; id?: string; groupId?: string } | null;
  onClose: () => void;
  onSubmit: (payload: NavLink | { text: string; url?: string }) => void;
  getCurrentValue: () => NavLink | { label: string; href: string } | null;
}) {
  const current = getCurrentValue();
  const [label, setLabel] = useState(current?.label ?? "");
  const [href, setHref] = useState((current && "href" in current ? current.href : "") ?? "");
  const [enabled, setEnabled] = useState(true);

  if (!editing) return null;

  const isAnnouncement = editing.kind === "announcement";
  const isNew = !editing.id;

  const handleSave = () => {
    if (!label.trim()) {
      toast.error("Label is required.");
      return;
    }
    if (isAnnouncement) {
      onSubmit({ text: label, url: href || undefined });
    } else {
      const id = editing.id ?? uid(editing.kind === "header" ? "h" : "f");
      onSubmit({ id, label, href });
    }
  };

  return (
    <Dialog open={!!editing} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isNew ? "Add" : "Edit"} {isAnnouncement ? "Announcement" : "Link"}
          </DialogTitle>
          <DialogDescription>
            {isAnnouncement
              ? "Promo message that rotates in the storefront announcement bar."
              : "Navigation link shown in the storefront header or footer."}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-2">
          <div className="grid gap-2">
            <Label htmlFor="nv-label">{isAnnouncement ? "Text" : "Label"}</Label>
            <Input
              id="nv-label"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder={isAnnouncement ? "✦ Free shipping on prepaid orders above ₹999" : "Necklaces"}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="nv-href">{isAnnouncement ? "URL (optional)" : "URL"}</Label>
            <Input
              id="nv-href"
              value={href}
              onChange={(e) => setHref(e.target.value)}
              placeholder={isAnnouncement ? "/shipping-policy" : "/collections?category=necklaces"}
            />
          </div>
          {isAnnouncement && (
            <label className="flex cursor-pointer items-center justify-between rounded-md border bg-background p-3">
              <div>
                <p className="text-sm font-medium leading-tight">Enabled</p>
                <p className="text-[11px] text-muted-foreground">Show in announcement bar rotation</p>
              </div>
              <Switch checked={enabled} onCheckedChange={setEnabled} aria-label="Enabled" />
            </label>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave}>
            {isNew ? "Add" : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
