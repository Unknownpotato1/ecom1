"use client";

import { useMemo, useState } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  LayoutTemplate,
  GripVertical,
  ChevronUp,
  ChevronDown,
  Pencil,
  Copy,
  Trash2,
  Plus,
  Eye,
  EyeOff,
  Save,
  Sparkles,
  FolderTree,
  Grid,
  Star,
  Zap,
  Gift,
  Image as ImageIcon,
  Video,
  Instagram,
  BookOpen,
  Mail,
  Megaphone,
  Code2,
  ShoppingBag,
  Layers,
  RotateCcw,
} from "lucide-react";
import { AdminPageHeader } from "@/components/admin/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { homepageSections as initialSections } from "@/lib/data";
import type { HomepageSection } from "@/lib/types";
import { toast } from "sonner";

interface SectionTypeMeta {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  group: "Layout" | "Catalog" | "Marketing" | "Content";
}

const SECTION_TYPES: Record<HomepageSection["type"], SectionTypeMeta> = {
  announcement_bar: { label: "Announcement Bar", icon: Megaphone, description: "Scrolling promo banner", group: "Layout" },
  hero_slider: { label: "Hero Slider", icon: Sparkles, description: "Full-width image carousel", group: "Layout" },
  featured_collections: { label: "Featured Collections", icon: FolderTree, description: "Curated collection cards", group: "Catalog" },
  shop_by_category: { label: "Shop by Category", icon: Grid, description: "Category tiles grid", group: "Catalog" },
  featured_products: { label: "Featured Products", icon: ShoppingBag, description: "Featured product carousel", group: "Catalog" },
  best_sellers: { label: "Best Sellers", icon: Star, description: "Top selling products", group: "Catalog" },
  new_arrivals: { label: "New Arrivals", icon: Zap, description: "Latest products", group: "Catalog" },
  gift_hampers: { label: "Gift Hampers", icon: Gift, description: "Curated gift hampers", group: "Catalog" },
  limited_offers: { label: "Limited Offers", icon: Layers, description: "Time-limited deals", group: "Marketing" },
  image_with_text: { label: "Image with Text", icon: ImageIcon, description: "Split image + copy block", group: "Content" },
  video: { label: "Video", icon: Video, description: "Embedded video block", group: "Content" },
  instagram_gallery: { label: "Instagram Gallery", icon: Instagram, description: "IG feed grid", group: "Marketing" },
  testimonials: { label: "Testimonials", icon: Star, description: "Customer testimonials", group: "Marketing" },
  brand_story: { label: "Brand Story", icon: BookOpen, description: "About / brand narrative", group: "Content" },
  newsletter: { label: "Newsletter", icon: Mail, description: "Email sign-up CTA", group: "Marketing" },
  custom_html: { label: "Custom HTML", icon: Code2, description: "Raw HTML block", group: "Content" },
};

const SECTION_GROUPS: Array<{ label: SectionTypeMeta["group"]; types: HomepageSection["type"][] }> = [
  { label: "Layout", types: ["announcement_bar", "hero_slider"] },
  { label: "Catalog", types: ["featured_collections", "shop_by_category", "featured_products", "best_sellers", "new_arrivals", "gift_hampers"] },
  { label: "Marketing", types: ["limited_offers", "instagram_gallery", "testimonials", "newsletter"] },
  { label: "Content", types: ["image_with_text", "video", "brand_story", "custom_html"] },
];

export default function AdminHomepageBuilderPage() {
  const [sections, setSections] = useState<HomepageSection[]>(() =>
    [...initialSections].sort((a, b) => a.sortOrder - b.sortOrder),
  );
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editingSection, setEditingSection] = useState<HomepageSection | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const enabledCount = sections.filter((s) => s.enabled).length;

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    setSections((items) => {
      const oldIndex = items.findIndex((i) => i.id === active.id);
      const newIndex = items.findIndex((i) => i.id === over.id);
      if (oldIndex < 0 || newIndex < 0) return items;
      const next = arrayMove(items, oldIndex, newIndex);
      return next.map((s, idx) => ({ ...s, sortOrder: idx + 1 }));
    });
    toast.info("Section reordered");
  };

  const move = (id: string, dir: -1 | 1) => {
    setSections((items) => {
      const idx = items.findIndex((i) => i.id === id);
      const target = idx + dir;
      if (idx < 0 || target < 0 || target >= items.length) return items;
      const next = arrayMove(items, idx, target);
      return next.map((s, i) => ({ ...s, sortOrder: i + 1 }));
    });
  };

  const toggleSection = (id: string) => {
    setSections((items) =>
      items.map((s) => (s.id === id ? { ...s, enabled: !s.enabled } : s)),
    );
  };

  const duplicateSection = (id: string) => {
    setSections((items) => {
      const idx = items.findIndex((i) => i.id === id);
      if (idx < 0) return items;
      const copy: HomepageSection = {
        ...items[idx]!,
        id: `s-${Date.now()}`,
        sortOrder: idx + 2,
      };
      const next = [...items.slice(0, idx + 1), copy, ...items.slice(idx + 1)];
      return next.map((s, i) => ({ ...s, sortOrder: i + 1 }));
    });
    toast.success("Section duplicated");
  };

  const deleteSection = (id: string) => {
    setSections((items) => items.filter((i) => i.id !== id).map((s, i) => ({ ...s, sortOrder: i + 1 })));
    toast.error("Section removed");
  };

  const addSection = (type: HomepageSection["type"]) => {
    const newSection: HomepageSection = {
      id: `s-${Date.now()}`,
      type,
      enabled: true,
      sortOrder: sections.length + 1,
      title: SECTION_TYPES[type].label,
      config: {},
    };
    setSections((items) => [...items, newSection]);
    setAddDialogOpen(false);
    toast.success(`${SECTION_TYPES[type].label} added`);
  };

  const saveSectionEdit = (updated: HomepageSection) => {
    setSections((items) => items.map((s) => (s.id === updated.id ? updated : s)));
    setEditingSection(null);
    toast.success("Section updated (demo)");
  };

  const handleSave = () => {
    toast.success("Homepage saved (demo)", {
      description: `${sections.length} sections · ${enabledCount} enabled`,
    });
  };

  const handleReset = () => {
    setSections([...initialSections].sort((a, b) => a.sortOrder - b.sortOrder));
    toast.info("Reverted to default layout");
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Homepage Builder"
        description="Drag-and-drop editor for your storefront homepage sections."
        icon={<LayoutTemplate className="size-5" />}
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={handleReset}>
              <RotateCcw className="size-4" />
              Reset
            </Button>
            <Button onClick={handleSave}>
              <Save className="size-4" />
              Save Layout
            </Button>
          </div>
        }
      />

      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        {/* Sidebar: section library */}
        <Card className="h-fit lg:sticky lg:top-20">
          <CardContent className="p-4">
            <div className="mb-3 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold">Section Library</p>
                <p className="text-[11px] text-muted-foreground">Click to add to bottom</p>
              </div>
              <Button size="sm" variant="ghost" onClick={() => setAddDialogOpen(true)}>
                <Plus className="size-4" />
              </Button>
            </div>
            <Separator className="mb-3" />
            <div className="max-h-[60vh] space-y-4 overflow-y-auto pr-1">
              {SECTION_GROUPS.map((group) => (
                <div key={group.label} className="space-y-1.5">
                  <p className="px-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                    {group.label}
                  </p>
                  {group.types.map((type) => {
                    const meta = SECTION_TYPES[type];
                    const Icon = meta.icon;
                    return (
                      <button
                        key={type}
                        onClick={() => addSection(type)}
                        className="group flex w-full items-center gap-2.5 rounded-md border border-transparent bg-muted/30 p-2 text-left transition-all hover:border-primary/30 hover:bg-primary/5"
                      >
                        <div className="flex size-8 items-center justify-center rounded-md bg-background text-muted-foreground group-hover:text-primary">
                          <Icon className="size-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-xs font-medium">{meta.label}</p>
                          <p className="truncate text-[10px] text-muted-foreground">{meta.description}</p>
                        </div>
                        <Plus className="size-3.5 text-muted-foreground opacity-0 group-hover:opacity-100" />
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Main: sortable list */}
        <div className="space-y-3">
          <div className="flex items-center justify-between rounded-lg border bg-muted/30 p-3">
            <div>
              <p className="text-sm font-medium">
                {sections.length} sections · {enabledCount} enabled
              </p>
              <p className="text-[11px] text-muted-foreground">
                Drag to reorder. Toggle eye icon to enable/disable on storefront.
              </p>
            </div>
            <Button asChild variant="ghost" size="sm">
              <a href="/" target="_blank" rel="noreferrer">
                <Eye className="size-4" />
                Preview
              </a>
            </Button>
          </div>

          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext items={sections.map((s) => s.id)} strategy={verticalListSortingStrategy}>
              <div className="space-y-2">
                {sections.map((section, idx) => (
                  <SortableSectionRow
                    key={section.id}
                    section={section}
                    index={idx}
                    total={sections.length}
                    onMove={move}
                    onToggle={toggleSection}
                    onDuplicate={duplicateSection}
                    onDelete={deleteSection}
                    onEdit={() => setEditingSection(section)}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>

          {sections.length === 0 && (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center p-12 text-center">
                <LayoutTemplate className="mb-3 size-8 text-muted-foreground" />
                <p className="text-sm font-medium">No sections yet</p>
                <p className="text-xs text-muted-foreground">Add a section from the library to get started.</p>
                <Button className="mt-4" size="sm" onClick={() => setAddDialogOpen(true)}>
                  <Plus className="size-4" />
                  Add First Section
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <AddSectionDialog
        open={addDialogOpen}
        onClose={() => setAddDialogOpen(false)}
        onAdd={addSection}
        usedTypes={useMemo(() => new Set(sections.map((s) => s.type)), [sections])}
      />

      <EditSectionDialog
        key={editingSection?.id ?? "none"}
        section={editingSection}
        onClose={() => setEditingSection(null)}
        onSave={saveSectionEdit}
      />
    </div>
  );
}

function SortableSectionRow({
  section,
  index,
  total,
  onMove,
  onToggle,
  onDuplicate,
  onDelete,
  onEdit,
}: {
  section: HomepageSection;
  index: number;
  total: number;
  onMove: (id: string, dir: -1 | 1) => void;
  onToggle: (id: string) => void;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: section.id,
  });
  const meta = SECTION_TYPES[section.type];
  const Icon = meta.icon;

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 50 : 1,
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={`p-0 ${!section.enabled ? "opacity-60" : ""} ${isDragging ? "shadow-lg ring-2 ring-primary" : ""}`}
    >
      <CardContent className="flex items-center gap-3 p-3">
        <button
          {...attributes}
          {...listeners}
          className="flex size-8 cursor-grab items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground active:cursor-grabbing"
          aria-label="Drag handle"
        >
          <GripVertical className="size-4" />
        </button>

        <div className="flex size-9 items-center justify-center rounded-md bg-primary/10 text-primary">
          <Icon className="size-4" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="truncate text-sm font-medium">
              {section.title ?? meta.label}
            </p>
            <Badge variant="outline" className="text-[10px]">
              {meta.label}
            </Badge>
            {!section.enabled && (
              <Badge variant="secondary" className="text-[10px]">
                <EyeOff className="size-2.5" /> Hidden
              </Badge>
            )}
          </div>
          <p className="truncate text-[11px] text-muted-foreground">{meta.description}</p>
        </div>

        <div className="flex items-center gap-0.5">
          <Button
            variant="ghost"
            size="icon"
            className="size-8"
            disabled={index === 0}
            onClick={() => onMove(section.id, -1)}
            aria-label="Move up"
          >
            <ChevronUp className="size-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="size-8"
            disabled={index === total - 1}
            onClick={() => onMove(section.id, 1)}
            aria-label="Move down"
          >
            <ChevronDown className="size-4" />
          </Button>
          <Separator orientation="vertical" className="mx-1 h-6" />
          <Switch
            checked={section.enabled}
            onCheckedChange={() => onToggle(section.id)}
            aria-label="Toggle section visibility"
          />
          <Button variant="ghost" size="icon" className="size-8" onClick={onEdit} aria-label="Edit">
            <Pencil className="size-4" />
          </Button>
          <Button variant="ghost" size="icon" className="size-8" onClick={() => onDuplicate(section.id)} aria-label="Duplicate">
            <Copy className="size-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="size-8 text-destructive hover:text-destructive"
            onClick={() => onDelete(section.id)}
            aria-label="Delete"
          >
            <Trash2 className="size-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function AddSectionDialog({
  open,
  onClose,
  onAdd,
  usedTypes,
}: {
  open: boolean;
  onClose: () => void;
  onAdd: (t: HomepageSection["type"]) => void;
  usedTypes: Set<HomepageSection["type"]>;
}) {
  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-2xl overflow-y-auto max-h-[85vh]">
        <DialogHeader>
          <DialogTitle>Add a Section</DialogTitle>
          <DialogDescription>
            Pick a section type to append to the bottom of your homepage.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          {SECTION_GROUPS.map((group) => (
            <div key={group.label} className="space-y-2">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                {group.label}
              </p>
              <div className="grid grid-cols-2 gap-2">
                {group.types.map((type) => {
                  const meta = SECTION_TYPES[type];
                  const Icon = meta.icon;
                  const used = usedTypes.has(type);
                  return (
                    <button
                      key={type}
                      onClick={() => onAdd(type)}
                      className="group flex items-center gap-3 rounded-md border border-border bg-background p-3 text-left transition-all hover:border-primary hover:bg-primary/5"
                    >
                      <div className="flex size-9 items-center justify-center rounded-md bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary">
                        <Icon className="size-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <p className="truncate text-sm font-medium">{meta.label}</p>
                          {used && <Badge variant="secondary" className="text-[9px]">Added</Badge>}
                        </div>
                        <p className="truncate text-[11px] text-muted-foreground">{meta.description}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function EditSectionDialog({
  section,
  onClose,
  onSave,
}: {
  section: HomepageSection | null;
  onClose: () => void;
  onSave: (s: HomepageSection) => void;
}) {
  // Init from props — the parent uses `key={section.id}` so this component
  // remounts fresh whenever a different section is opened.
  const cfg = (section?.config as Record<string, unknown>) ?? {};
  const [title, setTitle] = useState(section?.title ?? "");
  const [heading, setHeading] = useState((cfg.heading as string) ?? "");
  const [body, setBody] = useState((cfg.body as string) ?? "");
  const [image, setImage] = useState((cfg.image as string) ?? "");
  const [buttonText, setButtonText] = useState((cfg.buttonText as string) ?? "");
  const [buttonUrl, setButtonUrl] = useState((cfg.buttonUrl as string) ?? "");
  const [videoUrl, setVideoUrl] = useState((cfg.videoUrl as string) ?? "");
  const [customHtml, setCustomHtml] = useState((cfg.html as string) ?? "");
  const [limit, setLimit] = useState(String(cfg.limit ?? 8));

  if (!section) return null;
  const meta = SECTION_TYPES[section.type];

  const buildConfig = (): Record<string, unknown> => {
    const next = { ...(section.config as Record<string, unknown>) };
    next.heading = heading;
    next.body = body;
    if (image) next.image = image;
    next.buttonText = buttonText;
    next.buttonUrl = buttonUrl;
    if (videoUrl) next.videoUrl = videoUrl;
    next.html = customHtml;
    next.limit = Number(limit);
    next.title = title;
    return next;
  };

  const handleSave = () => {
    onSave({
      ...section,
      title: title || undefined,
      config: buildConfig(),
    });
  };

  return (
    <Dialog open={!!section} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <meta.icon className="size-4" />
            {meta.label}
          </DialogTitle>
          <DialogDescription>
            Configure how this section appears on the homepage.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-2">
          <div className="grid gap-2">
            <Label htmlFor="s-title">Section Title</Label>
            <Input
              id="s-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Best Sellers"
            />
          </div>

          {/* Per-type fields */}
          {(section.type === "best_sellers" ||
            section.type === "featured_products" ||
            section.type === "new_arrivals" ||
            section.type === "gift_hampers") && (
            <div className="grid gap-2">
              <Label htmlFor="s-limit">Product Limit</Label>
              <Input
                id="s-limit"
                type="number"
                value={limit}
                onChange={(e) => setLimit(e.target.value)}
                placeholder="8"
              />
            </div>
          )}

          {(section.type === "image_with_text" || section.type === "brand_story") && (
            <>
              <div className="grid gap-2">
                <Label htmlFor="s-heading">Heading</Label>
                <Input
                  id="s-heading"
                  value={heading}
                  onChange={(e) => setHeading(e.target.value)}
                  placeholder="Crafted by hand. Made to last."
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="s-body">Body</Label>
                <Textarea
                  id="s-body"
                  rows={3}
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  placeholder="Every piece is hand-set, hand-polished…"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="s-image">Image URL</Label>
                <Input
                  id="s-image"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  placeholder="https://images.unsplash.com/…"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="grid gap-2">
                  <Label htmlFor="s-btn-text">Button Text</Label>
                  <Input
                    id="s-btn-text"
                    value={buttonText}
                    onChange={(e) => setButtonText(e.target.value)}
                    placeholder="Our Craft"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="s-btn-url">Button URL</Label>
                  <Input
                    id="s-btn-url"
                    value={buttonUrl}
                    onChange={(e) => setButtonUrl(e.target.value)}
                    placeholder="/about"
                  />
                </div>
              </div>
            </>
          )}

          {section.type === "video" && (
            <div className="grid gap-2">
              <Label htmlFor="s-video">Video URL</Label>
              <Input
                id="s-video"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                placeholder="https://videos.pexels.com/…"
              />
              <div className="grid gap-2">
                <Label htmlFor="s-vheading">Heading</Label>
                <Input
                  id="s-vheading"
                  value={heading}
                  onChange={(e) => setHeading(e.target.value)}
                  placeholder="Behind the craft"
                />
              </div>
            </div>
          )}

          {section.type === "custom_html" && (
            <div className="grid gap-2">
              <Label htmlFor="s-html">Custom HTML</Label>
              <Textarea
                id="s-html"
                rows={6}
                value={customHtml}
                onChange={(e) => setCustomHtml(e.target.value)}
                placeholder="<div class='my-section'>…</div>"
                className="font-mono text-xs"
              />
              <p className="text-[11px] text-muted-foreground">
                Scripts &amp; iframes are stripped at render for safety.
              </p>
            </div>
          )}

          {(section.type === "hero_slider" ||
            section.type === "featured_collections" ||
            section.type === "shop_by_category" ||
            section.type === "limited_offers" ||
            section.type === "instagram_gallery" ||
            section.type === "testimonials" ||
            section.type === "newsletter" ||
            section.type === "announcement_bar") && (
            <div className="rounded-lg border border-dashed bg-muted/30 p-4 text-sm text-muted-foreground">
              This section pulls content automatically from your catalog / settings.
              Adjust the title above to override the default heading.
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave}>
            <Save className="size-4" />
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
