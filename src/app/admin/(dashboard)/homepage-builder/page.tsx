"use client";

import { useEffect, useMemo, useRef, useState } from "react";
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
  Settings2,
  Monitor,
  Smartphone,
  X,
  MousePointerClick,
} from "lucide-react";
import { AdminPageHeader } from "@/components/admin/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ImagePicker } from "@/components/admin/image-picker";
// Homepage section components for the live preview
import { HeroSlider } from "@/components/home/hero-slider";
import {
  FeaturedCollectionsSection,
  ShopByCategorySection,
  FeaturedProductsSection,
  BestSellersSection,
  NewArrivalsSection,
  GiftHampersSection,
  LimitedOffersSection,
  ImageWithTextSection,
  VideoSection,
  TestimonialsSection,
  InstagramGallerySection,
  BrandStorySection,
  NewsletterSection,
  MarqueeSection,
} from "@/components/home/sections";
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
import { useHomepageStore } from "@/lib/stores";
import { useHydrated } from "@/lib/use-hydrated";
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
  marquee: { label: "Marquee", icon: Megaphone, description: "Scrolling text banner", group: "Marketing" },
};

const SECTION_GROUPS: Array<{ label: SectionTypeMeta["group"]; types: HomepageSection["type"][] }> = [
  { label: "Layout", types: ["announcement_bar", "hero_slider"] },
  { label: "Catalog", types: ["featured_collections", "shop_by_category", "featured_products", "best_sellers", "new_arrivals", "gift_hampers"] },
  { label: "Marketing", types: ["limited_offers", "instagram_gallery", "testimonials", "newsletter", "marquee"] },
  { label: "Content", types: ["image_with_text", "video", "brand_story", "custom_html"] },
];

export default function AdminHomepageBuilderPage() {
  const hydrated = useHydrated();
  const savedSections = useHomepageStore((s) => s.sections);
  const customized = useHomepageStore((s) => s.customized);
  const saveToStore = useHomepageStore((s) => s.save);
  const resetStore = useHomepageStore((s) => s.reset);

  // Local working copy — initialized from the saved store (if customized) or defaults.
  // On the server (before hydration), use defaults to avoid SSR mismatch.
  const [sections, setSections] = useState<HomepageSection[]>(() =>
    [...initialSections].sort((a, b) => a.sortOrder - b.sortOrder),
  );

  // After hydration, load saved sections from the store ONCE.
  // We use a ref to ensure this only runs a single time, even if
  // savedSections changes later (which it will, due to auto-save).
  const loadedRef = useRef(false);
  useEffect(() => {
    if (hydrated && !loadedRef.current) {
      loadedRef.current = true;
      if (customized) {
        setSections([...savedSections].sort((a, b) => a.sortOrder - b.sortOrder));
      }
    }
  }, [hydrated, customized, savedSections]);

  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editingSection, setEditingSection] = useState<HomepageSection | null>(null);
  const [viewMode, setViewMode] = useState<"editor" | "preview">("editor");
  const [previewDevice, setPreviewDevice] = useState<"desktop" | "mobile">("desktop");
  const [selectedPreviewSection, setSelectedPreviewSection] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const enabledCount = sections.filter((s) => s.enabled).length;

  // Auto-save: whenever sections change (after hydration + initial load),
  // persist to the store so the storefront homepage picks up the changes.
  // Skip the initial render to avoid overwriting saved data before load.
  const canSave = hydrated && loadedRef.current;
  useEffect(() => {
    if (!canSave) return;
    saveToStore(sections);
  }, [sections, canSave, saveToStore]);

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
    toast.info("Section reordered · saved");
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
    toast.success("Section updated · saved");
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
    toast.success("Section duplicated · saved");
  };

  const deleteSection = (id: string) => {
    setSections((items) => items.filter((i) => i.id !== id).map((s, i) => ({ ...s, sortOrder: i + 1 })));
    toast.error("Section removed · saved");
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
    toast.success(`${SECTION_TYPES[type].label} added · saved`);
  };

  const renameSection = (id: string, title: string) => {
    setSections((items) =>
      items.map((s) => (s.id === id ? { ...s, title: title.trim() || SECTION_TYPES[s.type].label } : s)),
    );
    toast.success("Section renamed · saved");
  };

  const saveSectionEdit = (updated: HomepageSection) => {
    setSections((items) => items.map((s) => (s.id === updated.id ? updated : s)));
    setEditingSection(null);
    toast.success("Section settings saved");
  };

  const handleSave = () => {
    // Explicit save — sections are already auto-saved on every change,
    // but this gives the admin a satisfying confirmation + summary.
    saveToStore(sections);
    toast.success("Homepage published to live store", {
      description: `${sections.length} sections · ${enabledCount} enabled · changes are live`,
    });
  };

  const handleReset = () => {
    const defaults = [...initialSections].sort((a, b) => a.sortOrder - b.sortOrder);
    setSections(defaults);
    resetStore();
    toast.info("Reverted to default layout · saved");
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Homepage Builder"
        description="Drag-and-drop editor. Changes save automatically and apply to your live store."
        icon={<LayoutTemplate className="size-5" />}
        actions={
          <div className="flex items-center gap-2">
            {/* View mode toggle */}
            <div className="flex items-center rounded-md border bg-muted/30 p-0.5">
              <Button
                size="sm"
                variant={viewMode === "editor" ? "default" : "ghost"}
                className="h-7"
                onClick={() => setViewMode("editor")}
              >
                <LayoutTemplate className="size-3.5" /> Editor
              </Button>
              <Button
                size="sm"
                variant={viewMode === "preview" ? "default" : "ghost"}
                className="h-7"
                onClick={() => setViewMode("preview")}
              >
                <Eye className="size-3.5" /> Preview
              </Button>
            </div>
            <Button variant="outline" onClick={handleReset}>
              <RotateCcw className="size-4" />
              Reset
            </Button>
            <Button onClick={handleSave}>
              <Save className="size-4" />
              Publish
            </Button>
          </div>
        }
      />

      {viewMode === "editor" ? (
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
              <p className="text-sm font-medium flex items-center gap-2">
                {sections.length} sections · {enabledCount} enabled
                <Badge className="bg-green-100 text-green-800 hover:bg-green-100 text-[10px]">
                  <span className="size-1.5 rounded-full bg-green-500 animate-pulse" /> Live
                </Badge>
              </p>
              <p className="text-[11px] text-muted-foreground">
                Changes save automatically & apply to the live store instantly.
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
                    onRename={renameSection}
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
      ) : (
        /* Preview mode — live storefront preview with tap-to-edit */
        <StorefrontPreview
          sections={sections}
          device={previewDevice}
          onDeviceChange={setPreviewDevice}
          selectedId={selectedPreviewSection}
          onSelect={setSelectedPreviewSection}
          onEdit={(s) => setEditingSection(s)}
          onToggle={toggleSection}
          onMove={move}
          onDelete={deleteSection}
          onDuplicate={duplicateSection}
          onAddSection={() => setAddDialogOpen(true)}
        />
      )}

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
  onRename,
}: {
  section: HomepageSection;
  index: number;
  total: number;
  onMove: (id: string, dir: -1 | 1) => void;
  onToggle: (id: string) => void;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: () => void;
  onRename: (id: string, title: string) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: section.id,
  });
  const meta = SECTION_TYPES[section.type];
  const Icon = meta.icon;
  const [isRenaming, setIsRenaming] = useState(false);
  const [renameValue, setRenameValue] = useState(section.title ?? meta.label);

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 50 : 1,
  };

  const commitRename = () => {
    onRename(section.id, renameValue);
    setIsRenaming(false);
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
            {isRenaming ? (
              <Input
                value={renameValue}
                onChange={(e) => setRenameValue(e.target.value)}
                onBlur={commitRename}
                onKeyDown={(e) => {
                  if (e.key === "Enter") commitRename();
                  if (e.key === "Escape") {
                    setRenameValue(section.title ?? meta.label);
                    setIsRenaming(false);
                  }
                }}
                className="h-7 text-sm py-0 px-2 max-w-[200px]"
                autoFocus
              />
            ) : (
              <button
                onClick={() => {
                  setRenameValue(section.title ?? meta.label);
                  setIsRenaming(true);
                }}
                className="truncate text-sm font-medium hover:text-primary hover:underline text-left"
                title="Click to rename"
              >
                {section.title ?? meta.label}
              </button>
            )}
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
          <Button variant="ghost" size="icon" className="size-8" onClick={() => setIsRenaming(true)} aria-label="Rename">
            <Pencil className="size-3.5" />
          </Button>
          <Button variant="ghost" size="icon" className="size-8" onClick={onEdit} aria-label="Edit settings">
            <Settings2 className="size-4" />
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
  const [marqueeItems, setMarqueeItems] = useState(
    Array.isArray(cfg.items) ? (cfg.items as string[]).join("\n") : "",
  );
  const [marqueeSpeed, setMarqueeSpeed] = useState((cfg.speed as string) ?? "normal");
  const [marqueeBg, setMarqueeBg] = useState((cfg.background as string) ?? "#6B2D5C");
  const [marqueeText, setMarqueeText] = useState((cfg.text as string) ?? "#FFFFFF");

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
    // Marquee config
    if (section.type === "marquee") {
      next.items = marqueeItems.split("\n").map((s) => s.trim()).filter(Boolean);
      next.speed = marqueeSpeed;
      next.background = marqueeBg;
      next.text = marqueeText;
    }
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
              <ImagePicker
                label="Image"
                value={image}
                onChange={setImage}
                description="Used for the image-with-text or brand-story section"
                aspect="desktop"
              />
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

          {section.type === "marquee" && (
            <>
              <div className="grid gap-2">
                <Label htmlFor="s-mitems">Marquee Items (one per line)</Label>
                <Textarea
                  id="s-mitems"
                  rows={4}
                  value={marqueeItems}
                  onChange={(e) => setMarqueeItems(e.target.value)}
                  placeholder={"✦ Free Shipping\n✦ COD Available\n✦ 7-Day Returns"}
                />
                <p className="text-[11px] text-muted-foreground">
                  Each line becomes a scrolling item. Leave empty to use defaults.
                </p>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="grid gap-2">
                  <Label htmlFor="s-mspeed">Speed</Label>
                  <select
                    id="s-mspeed"
                    value={marqueeSpeed}
                    onChange={(e) => setMarqueeSpeed(e.target.value)}
                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm"
                  >
                    <option value="slow">Slow</option>
                    <option value="normal">Normal</option>
                    <option value="fast">Fast</option>
                  </select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="s-mbg">Background</Label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      id="s-mbg"
                      value={marqueeBg}
                      onChange={(e) => setMarqueeBg(e.target.value)}
                      className="h-9 w-12 rounded-md border border-input cursor-pointer"
                    />
                    <Input
                      value={marqueeBg}
                      onChange={(e) => setMarqueeBg(e.target.value)}
                      className="flex-1 font-mono text-xs"
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="s-mtext">Text Color</Label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      id="s-mtext"
                      value={marqueeText}
                      onChange={(e) => setMarqueeText(e.target.value)}
                      className="h-9 w-12 rounded-md border border-input cursor-pointer"
                    />
                    <Input
                      value={marqueeText}
                      onChange={(e) => setMarqueeText(e.target.value)}
                      className="flex-1 font-mono text-xs"
                    />
                  </div>
                </div>
              </div>
            </>
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

// ---------------------------------------------------------------------------
// StorefrontPreview — live preview of the homepage with tap-to-edit overlays.
// Renders the actual homepage sections inside a device-framed preview pane.
// Clicking a section selects it; a floating toolbar offers edit/hide/move/delete.
// ---------------------------------------------------------------------------
function StorefrontPreview({
  sections,
  device,
  onDeviceChange,
  selectedId,
  onSelect,
  onEdit,
  onToggle,
  onMove,
  onDelete,
  onDuplicate,
  onAddSection,
}: {
  sections: HomepageSection[];
  device: "desktop" | "mobile";
  onDeviceChange: (d: "desktop" | "mobile") => void;
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  onEdit: (s: HomepageSection) => void;
  onToggle: (id: string) => void;
  onMove: (id: string, dir: -1 | 1) => void;
  onDelete: (id: string) => void;
  onDuplicate: (id: string) => void;
  onAddSection: () => void;
}) {
  const enabledSections = sections.filter((s) => s.enabled).sort((a, b) => a.sortOrder - b.sortOrder);
  const selectedIndex = enabledSections.findIndex((s) => s.id === selectedId);

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_300px]">
      {/* Preview pane */}
      <div className="space-y-3">
        {/* Device toggle */}
        <div className="flex items-center justify-between">
          <div className="flex items-center rounded-md border bg-muted/30 p-0.5">
            <Button size="sm" variant={device === "desktop" ? "default" : "ghost"} className="h-7" onClick={() => onDeviceChange("desktop")}>
              <Monitor className="size-3.5" /> Desktop
            </Button>
            <Button size="sm" variant={device === "mobile" ? "default" : "ghost"} className="h-7" onClick={() => onDeviceChange("mobile")}>
              <Smartphone className="size-3.5" /> Mobile
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Tap any section to edit · {enabledSections.length} live
          </p>
        </div>

        {/* Preview frame */}
        <div className="rounded-lg border bg-muted/20 overflow-hidden" style={{ height: "70vh" }}>
          <div
            className="mx-auto h-full bg-background overflow-y-auto transition-all duration-300 no-scrollbar"
            style={{ maxWidth: device === "mobile" ? "375px" : "100%" }}
          >
            {/* Render actual homepage sections with click overlays */}
            {enabledSections.map((section, idx) => {
              const meta = SECTION_TYPES[section.type];
              const isSelected = selectedId === section.id;
              return (
                <div
                  key={section.id}
                  className="relative group cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelect(isSelected ? null : section.id);
                  }}
                >
                  {/* Click overlay — highlights on hover, selected ring */}
                  <div
                    className={`absolute inset-0 z-30 pointer-events-none transition-all ${
                      isSelected
                        ? "ring-2 ring-primary ring-inset"
                        : "ring-1 ring-transparent group-hover:ring-primary/40 group-hover:ring-inset"
                    }`}
                  />
                  {/* Section label badge — visible on hover/selected */}
                  <div
                    className={`absolute top-2 left-2 z-40 pointer-events-none transition-opacity ${
                      isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                    }`}
                  >
                    <Badge className="bg-primary text-primary-foreground text-[10px] gap-1">
                      <meta.icon className="size-2.5" />
                      {section.title ?? meta.label}
                    </Badge>
                  </div>

                  {/* Render the actual section content */}
                  <SectionRenderer section={section} />
                </div>
              );
            })}

            {/* Add section CTA at bottom */}
            <button
              onClick={onAddSection}
              className="w-full p-8 border-2 border-dashed border-muted-foreground/30 hover:border-primary hover:bg-primary/5 transition-colors text-center"
            >
              <Plus className="size-6 mx-auto text-muted-foreground mb-2" />
              <p className="text-sm font-medium">Add Section</p>
              <p className="text-xs text-muted-foreground">Choose from 16 section types</p>
            </button>
          </div>
        </div>
      </div>

      {/* Right sidebar — section actions when selected */}
      <div className="space-y-3">
        <Card className="h-fit lg:sticky lg:top-20">
          <CardContent className="p-4">
            {selectedId && selectedIndex >= 0 ? (
              <SelectedSectionPanel
                section={enabledSections[selectedIndex]!}
                index={selectedIndex}
                total={enabledSections.length}
                onEdit={onEdit}
                onToggle={onToggle}
                onMove={onMove}
                onDelete={onDelete}
                onDuplicate={onDuplicate}
                onDeselect={() => onSelect(null)}
              />
            ) : (
              <div className="text-center py-8">
                <MousePointerClick className="size-8 mx-auto text-muted-foreground mb-2" />
                <p className="text-sm font-medium">No section selected</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Click any section in the preview to edit, hide, move, or delete it.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Section list (quick nav) */}
        <Card>
          <CardContent className="p-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 px-1">
              Sections ({enabledSections.length})
            </p>
            <div className="space-y-1 max-h-64 overflow-y-auto">
              {enabledSections.map((s, i) => {
                const meta = SECTION_TYPES[s.type];
                const Icon = meta.icon;
                return (
                  <button
                    key={s.id}
                    onClick={() => onSelect(selectedId === s.id ? null : s.id)}
                    className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-left text-xs transition-colors ${
                      selectedId === s.id ? "bg-primary/10 text-primary" : "hover:bg-muted"
                    }`}
                  >
                    <Icon className="size-3.5 shrink-0" />
                    <span className="truncate flex-1">{s.title ?? meta.label}</span>
                    <span className="text-muted-foreground">{i + 1}</span>
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Renders a single homepage section for the preview.
// Reuses the actual storefront section components.
function SectionRenderer({ section }: { section: HomepageSection }) {
  const cfg = section.config as Record<string, unknown>;
  switch (section.type) {
    case "hero_slider":
      return <HeroSlider />;
    case "featured_collections":
      return <FeaturedCollectionsSection title={(cfg.title as string) ?? "Featured Collections"} />;
    case "shop_by_category":
      return <ShopByCategorySection title={(cfg.title as string) ?? "Shop by Category"} />;
    case "featured_products":
      return <FeaturedProductsSection title={(cfg.title as string) ?? "Featured Products"} />;
    case "best_sellers":
      return <BestSellersSection title={(cfg.title as string) ?? "Best Sellers"} />;
    case "new_arrivals":
      return <NewArrivalsSection title={(cfg.title as string) ?? "New Arrivals"} />;
    case "gift_hampers":
      return <GiftHampersSection title={(cfg.title as string) ?? "Gift Hampers"} />;
    case "limited_offers":
      return <LimitedOffersSection title={(cfg.title as string) ?? "Limited Time Offers"} />;
    case "image_with_text":
      return (
        <ImageWithTextSection
          image={(cfg.image as string) ?? "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1200&q=80"}
          heading={(cfg.heading as string) ?? "Crafted by hand. Made to last."}
          body={(cfg.body as string) ?? "Every piece is hand-set, hand-polished, and inspected by our master karigars."}
          buttonText={(cfg.buttonText as string) ?? "Our Craft"}
          buttonUrl={(cfg.buttonUrl as string) ?? "/about"}
          alignment={(cfg.alignment as "left" | "right") ?? "left"}
        />
      );
    case "video":
      return (
        <VideoSection
          videoUrl={(cfg.videoUrl as string) ?? "https://videos.pexels.com/video-files/3015526/3015526-uhd_2560_1440_24fps.mp4"}
          poster={(cfg.poster as string) ?? "https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=1920&q=80"}
          heading={(cfg.heading as string) ?? "Behind the craft"}
          subheading={(cfg.subheading as string) ?? "Watch how our jewelry comes to life"}
        />
      );
    case "testimonials":
      return <TestimonialsSection title={(cfg.title as string) ?? "Loved by thousands"} />;
    case "instagram_gallery":
      return <InstagramGallerySection title={(cfg.title as string) ?? "@auroraandco"} handle={(cfg.handle as string) ?? "@auroraandco"} />;
    case "brand_story":
      return (
        <BrandStorySection
          heading={(cfg.heading as string) ?? "Our Story"}
          body={(cfg.body as string) ?? "Aurora & Co. was born in 2019 from a simple belief — that beautiful jewelry shouldn't require a luxury price tag."}
          image={(cfg.image as string) ?? "https://images.unsplash.com/photo-1513885535751-8b9238bd3458?auto=format&fit=crop&w=1200&q=80"}
          stats={(cfg.stats as { value: string; label: string }[]) ?? [
            { value: "50,000+", label: "Happy customers" },
            { value: "4.8★", label: "Average rating" },
            { value: "300+", label: "Unique designs" },
          ]}
        />
      );
    case "newsletter":
      return <NewsletterSection title={(cfg.title as string) ?? "Join the Aurora Circle"} />;
    case "marquee":
      return (
        <MarqueeSection
          items={Array.isArray(cfg.items) ? (cfg.items as string[]) : undefined}
          speed={(cfg.speed as "slow" | "normal" | "fast") ?? "normal"}
          background={(cfg.background as string) ?? "#6B2D5C"}
          text={(cfg.text as string) ?? "#FFFFFF"}
        />
      );
    case "custom_html":
      return (
        <div
          className="mx-auto max-w-7xl px-4 sm:px-6 py-12"
          dangerouslySetInnerHTML={{ __html: (cfg.html as string) ?? "" }}
        />
      );
    case "announcement_bar":
      return null; // rendered in header, not in body
    default:
      return null;
  }
}

// Panel shown when a section is selected in preview mode.
function SelectedSectionPanel({
  section,
  index,
  total,
  onEdit,
  onToggle,
  onMove,
  onDelete,
  onDuplicate,
  onDeselect,
}: {
  section: HomepageSection;
  index: number;
  total: number;
  onEdit: (s: HomepageSection) => void;
  onToggle: (id: string) => void;
  onMove: (id: string, dir: -1 | 1) => void;
  onDelete: (id: string) => void;
  onDuplicate: (id: string) => void;
  onDeselect: () => void;
}) {
  const meta = SECTION_TYPES[section.type];
  const Icon = meta.icon;
  return (
    <div className="space-y-3">
      <div className="flex items-start gap-2">
        <div className="size-8 rounded-md bg-primary/10 text-primary flex items-center justify-center shrink-0">
          <Icon className="size-4" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold truncate">{section.title ?? meta.label}</p>
          <p className="text-[11px] text-muted-foreground">{meta.label} · Position {index + 1} of {total}</p>
        </div>
        <Button size="icon" variant="ghost" className="size-6" onClick={onDeselect}>
          <X className="size-3.5" />
        </Button>
      </div>

      <Separator />

      {/* Actions */}
      <div className="space-y-1.5">
        <Button size="sm" className="w-full justify-start" onClick={() => onEdit(section)}>
          <Settings2 className="size-3.5" /> Customize
        </Button>
        <Button size="sm" variant="outline" className="w-full justify-start" onClick={() => onToggle(section.id)}>
          {section.enabled ? <><EyeOff className="size-3.5" /> Hide from store</> : <><Eye className="size-3.5" /> Show on store</>}
        </Button>
        <div className="grid grid-cols-2 gap-1.5">
          <Button size="sm" variant="outline" disabled={index === 0} onClick={() => onMove(section.id, -1)}>
            <ChevronUp className="size-3.5" /> Move Up
          </Button>
          <Button size="sm" variant="outline" disabled={index === total - 1} onClick={() => onMove(section.id, 1)}>
            <ChevronDown className="size-3.5" /> Move Down
          </Button>
        </div>
        <Button size="sm" variant="outline" className="w-full justify-start" onClick={() => onDuplicate(section.id)}>
          <Copy className="size-3.5" /> Duplicate
        </Button>
        <Button size="sm" variant="outline" className="w-full justify-start text-destructive hover:text-destructive" onClick={() => { onDelete(section.id); onDeselect(); }}>
          <Trash2 className="size-3.5" /> Delete Section
        </Button>
      </div>

      <Separator />

      {/* Quick stats */}
      <div className="text-[11px] text-muted-foreground space-y-1">
        <p className="flex justify-between"><span>Status:</span> <span className={section.enabled ? "text-green-600" : "text-muted-foreground"}>{section.enabled ? "Visible" : "Hidden"}</span></p>
        <p className="flex justify-between"><span>Type:</span> <span>{meta.label}</span></p>
        <p className="flex justify-between"><span>ID:</span> <span className="font-mono">{section.id.slice(0, 12)}</span></p>
      </div>
    </div>
  );
}
