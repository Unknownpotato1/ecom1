"use client";

import { useEffect, useState } from "react";
import {
  Code2,
  Plus,
  Trash2,
  Copy,
  Edit2,
  Eye,
  EyeOff,
  Save,
  Code,
  Palette,
  Brain,
  Globe,
  AlertTriangle,
  CheckCircle2,
  Smartphone,
  Monitor,
  Sparkles,
} from "lucide-react";
import { AdminPageHeader } from "@/components/admin/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { sanitizeHtml } from "@/lib/format";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
type Placement = "homepage" | "collection" | "product" | "footer" | "header" | "all";

interface CustomSection {
  id: string;
  name: string;
  html: string;
  css: string;
  js: string;
  placement: Placement;
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
}

const PLACEMENT_LABELS: Record<Placement, string> = {
  homepage: "Homepage",
  collection: "Collection pages",
  product: "Product pages",
  footer: "Footer",
  header: "Header",
  all: "Everywhere",
};

const STORAGE_KEY = "aurora-custom-sections";

// ---------------------------------------------------------------------------
// Default starter templates
// ---------------------------------------------------------------------------
const TEMPLATES: Array<{ name: string; description: string; html: string; css: string; js: string; placement: Placement }> = [
  {
    name: "Promo Banner",
    description: "Simple full-width promo banner with CTA button",
    placement: "homepage",
    html: `<div class="promo-banner">
  <div class="promo-content">
    <h2>🎉 Festive Sale — Up to 40% Off</h2>
    <p>Shop our curated collection of handcrafted jewelry.</p>
    <a href="/collections" class="promo-cta">Shop Now</a>
  </div>
</div>`,
    css: `.promo-banner {
  background: linear-gradient(135deg, #6B2D5C 0%, #B8956A 100%);
  color: white;
  padding: 3rem 1.5rem;
  text-align: center;
  border-radius: 1rem;
  margin: 2rem auto;
  max-width: 1200px;
}
.promo-banner h2 {
  font-size: 2rem;
  margin: 0 0 0.5rem;
  font-weight: 700;
}
.promo-banner p { opacity: 0.9; margin: 0 0 1.5rem; }
.promo-cta {
  display: inline-block;
  background: white;
  color: #6B2D5C;
  padding: 0.75rem 2rem;
  border-radius: 0.5rem;
  text-decoration: none;
  font-weight: 600;
  transition: transform 0.2s;
}
.promo-cta:hover { transform: translateY(-2px); }`,
    js: ``,
  },
  {
    name: "Countdown Timer",
    description: "Live countdown to a sale end date",
    placement: "homepage",
    html: `<div class="countdown-wrap">
  <p class="countdown-label">Sale ends in:</p>
  <div class="countdown-timer" id="countdown-timer">
    <div class="cd-unit"><span id="cd-days">00</span><small>Days</small></div>
    <div class="cd-unit"><span id="cd-hours">00</span><small>Hours</small></div>
    <div class="cd-unit"><span id="cd-mins">00</span><small>Mins</small></div>
    <div class="cd-unit"><span id="cd-secs">00</span><small>Secs</small></div>
  </div>
</div>`,
    css: `.countdown-wrap {
  text-align: center;
  padding: 2rem 1rem;
  background: #fff5eb;
  border-radius: 1rem;
  margin: 2rem auto;
  max-width: 800px;
}
.countdown-label {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #6B2D5C;
}
.countdown-timer {
  display: flex;
  justify-content: center;
  gap: 1rem;
}
.cd-unit {
  background: white;
  border-radius: 0.5rem;
  padding: 1rem;
  min-width: 70px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
}
.cd-unit span {
  display: block;
  font-size: 1.75rem;
  font-weight: 700;
  color: #6B2D5C;
  font-variant-numeric: tabular-nums;
}
.cd-unit small {
  color: #888;
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}`,
    js: `// Set sale end date (7 days from now)
const endDate = new Date();
endDate.setDate(endDate.getDate() + 7);

function updateCountdown() {
  const now = new Date();
  const diff = endDate - now;
  if (diff <= 0) {
    document.getElementById('countdown-timer').innerHTML = '<p>Sale ended!</p>';
    return;
  }
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const mins = Math.floor((diff % 3600000) / 60000);
  const secs = Math.floor((diff % 60000) / 1000);
  const d = document.getElementById('cd-days');
  const h = document.getElementById('cd-hours');
  const m = document.getElementById('cd-mins');
  const s = document.getElementById('cd-secs');
  if (d) d.textContent = String(days).padStart(2, '0');
  if (h) h.textContent = String(hours).padStart(2, '0');
  if (m) m.textContent = String(mins).padStart(2, '0');
  if (s) s.textContent = String(secs).padStart(2, '0');
}
updateCountdown();
setInterval(updateCountdown, 1000);`,
  },
  {
    name: "Trust Badge Row",
    description: "Row of trust badges with icons",
    placement: "homepage",
    html: `<div class="trust-row">
  <div class="trust-item"><span>🚚</span><div><strong>Free Shipping</strong><small>On orders above ₹999</small></div></div>
  <div class="trust-item"><span>↩️</span><div><strong>7-Day Returns</strong><small>Hassle-free</small></div></div>
  <div class="trust-item"><span>🔒</span><div><strong>Secure Payments</strong><small>Razorpay protected</small></div></div>
  <div class="trust-item"><span>📦</span><div><strong>COD Available</strong><small>Across India</small></div></div>
</div>`,
    css: `.trust-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 1rem;
  max-width: 1200px;
  margin: 2rem auto;
  padding: 0 1rem;
}
.trust-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  background: white;
  border: 1px solid #eee;
  border-radius: 0.5rem;
}
.trust-item span { font-size: 1.5rem; }
.trust-item strong { display: block; font-size: 0.9rem; }
.trust-item small { color: #888; font-size: 0.75rem; }`,
    js: ``,
  },
  {
    name: "Custom Footer Block",
    description: "Extra block to add to the footer",
    placement: "footer",
    html: `<div class="custom-footer-block">
  <h4>Visit Our Store</h4>
  <p>123 Jewelry Street, Mumbai 400001</p>
  <p>Mon-Sat, 10AM - 7PM</p>
</div>`,
    css: `.custom-footer-block {
  padding: 1.5rem;
  background: #f8f5f0;
  border-radius: 0.5rem;
  margin-top: 1rem;
}
.custom-footer-block h4 {
  margin: 0 0 0.5rem;
  color: #6B2D5C;
}
.custom-footer-block p {
  margin: 0.25rem 0;
  font-size: 0.875rem;
  color: #555;
}`,
    js: ``,
  },
];

// ---------------------------------------------------------------------------
// Main page component
// ---------------------------------------------------------------------------
export default function CustomSectionsPage() {
  const [sections, setSections] = useState<CustomSection[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [editing, setEditing] = useState<CustomSection | null>(null);
  const [showEditor, setShowEditor] = useState(false);
  const [previewPlacement, setPreviewPlacement] = useState<"mobile" | "desktop">("desktop");

  // Load from localStorage on mount
  useEffect(() => {
    const id = setTimeout(() => {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
          setSections(JSON.parse(raw));
        }
      } catch { /* ignore */ }
      setHydrated(true);
    }, 0);
    return () => clearTimeout(id);
  }, []);

  const persist = (next: CustomSection[]) => {
    setSections(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch { /* ignore */ }
  };

  const createFromTemplate = (template: typeof TEMPLATES[number]) => {
    const now = new Date().toISOString();
    const newSection: CustomSection = {
      id: `cs-${Date.now()}`,
      name: template.name,
      html: template.html,
      css: template.css,
      js: template.js,
      placement: template.placement,
      enabled: true,
      createdAt: now,
      updatedAt: now,
    };
    persist([...sections, newSection]);
    toast.success(`"${template.name}" section created`);
  };

  const createBlank = () => {
    const now = new Date().toISOString();
    const newSection: CustomSection = {
      id: `cs-${Date.now()}`,
      name: "Untitled Section",
      html: "<div class=\"my-section\">\n  <p>Hello, world!</p>\n</div>",
      css: ".my-section {\n  padding: 2rem;\n  text-align: center;\n}",
      js: "",
      placement: "homepage",
      enabled: true,
      createdAt: now,
      updatedAt: now,
    };
    persist([...sections, newSection]);
    setEditing(newSection);
    setShowEditor(true);
    toast.success("Blank section created — start editing!");
  };

  const update = (id: string, patch: Partial<CustomSection>) => {
    const next = sections.map((s) =>
      s.id === id ? { ...s, ...patch, updatedAt: new Date().toISOString() } : s,
    );
    persist(next);
    if (editing?.id === id) setEditing({ ...editing, ...patch });
  };

  const remove = (id: string) => {
    persist(sections.filter((s) => s.id !== id));
    toast.error("Section deleted");
  };

  const duplicate = (id: string) => {
    const orig = sections.find((s) => s.id === id);
    if (!orig) return;
    const now = new Date().toISOString();
    const copy: CustomSection = {
      ...orig,
      id: `cs-${Date.now()}`,
      name: `${orig.name} (copy)`,
      createdAt: now,
      updatedAt: now,
    };
    persist([...sections, copy]);
    toast.success("Section duplicated");
  };

  const toggle = (id: string) => {
    update(id, { enabled: !sections.find((s) => s.id === id)?.enabled });
  };

  if (!hydrated) {
    return <div className="p-8 text-muted-foreground">Loading…</div>;
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Custom Section Builder"
        description="Create reusable sections with custom HTML, CSS, and JavaScript. Place them anywhere on your store."
        icon={<Code2 className="size-5" />}
        actions={
          <Button onClick={createBlank}>
            <Plus className="size-4" />
            New Blank Section
          </Button>
        }
      />

      {/* Templates */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Sparkles className="size-4" /> Start from a template
          </CardTitle>
          <CardDescription>Quick-start with a pre-built section. Customize from there.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {TEMPLATES.map((tpl) => (
              <button
                key={tpl.name}
                onClick={() => createFromTemplate(tpl)}
                className="text-left p-4 border rounded-lg hover:border-primary hover:bg-accent/20 transition-all group"
              >
                <div className="font-medium text-sm group-hover:text-primary">{tpl.name}</div>
                <div className="text-xs text-muted-foreground mt-1 line-clamp-2">{tpl.description}</div>
                <Badge variant="outline" className="mt-2 text-[10px]">
                  {PLACEMENT_LABELS[tpl.placement]}
                </Badge>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Saved sections list */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Your Custom Sections ({sections.length})</CardTitle>
          <CardDescription>Manage and edit your saved custom sections.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {sections.length === 0 ? (
            <div className="text-center py-12">
              <Code2 className="size-10 mx-auto text-muted-foreground mb-3" />
              <p className="text-sm font-medium">No custom sections yet</p>
              <p className="text-xs text-muted-foreground mt-1">Pick a template above or create a blank section.</p>
            </div>
          ) : (
            sections.map((section) => (
              <div
                key={section.id}
                className={`flex items-center gap-3 p-3 border rounded-lg ${!section.enabled ? "opacity-60" : ""}`}
              >
                <div className="flex size-10 items-center justify-center rounded-md bg-primary/10 text-primary shrink-0">
                  <Code className="size-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-medium truncate">{section.name}</p>
                    <Badge variant="outline" className="text-[10px]">{PLACEMENT_LABELS[section.placement]}</Badge>
                    {!section.enabled && (
                      <Badge variant="secondary" className="text-[10px]">
                        <EyeOff className="size-2.5" /> Disabled
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {section.html.length + section.css.length + section.js.length} chars ·
                    Updated {new Date(section.updatedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                  </p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <Switch
                    checked={section.enabled}
                    onCheckedChange={() => toggle(section.id)}
                    aria-label="Toggle"
                  />
                  <Separator orientation="vertical" className="h-6 mx-1" />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-8"
                    onClick={() => { setEditing(section); setShowEditor(true); }}
                    aria-label="Edit"
                  >
                    <Edit2 className="size-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-8"
                    onClick={() => duplicate(section.id)}
                    aria-label="Duplicate"
                  >
                    <Copy className="size-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-8 text-destructive hover:text-destructive"
                    onClick={() => remove(section.id)}
                    aria-label="Delete"
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* Safety notice */}
      <Card className="border-amber-200 bg-amber-50">
        <CardContent className="p-4 flex items-start gap-3">
          <AlertTriangle className="size-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-medium text-amber-900">Safe rendering</p>
            <p className="text-amber-800 mt-1">
              Custom JavaScript runs in a sandboxed manner. HTML is sanitized to remove <code>&lt;script&gt;</code> tags,
              <code>iframe</code> elements, and inline <code>on*</code> event handlers. Use the JS tab for interactive behavior.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Editor dialog */}
      {editing && showEditor && (
        <SectionEditor
          section={editing}
          previewDevice={previewPlacement}
          onPreviewDeviceChange={setPreviewPlacement}
          onChange={(patch) => update(editing.id, patch)}
          onClose={() => { setShowEditor(false); setEditing(null); }}
          onSave={() => { toast.success("Section saved"); setShowEditor(false); setEditing(null); }}
        />
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Section editor dialog
// ---------------------------------------------------------------------------
function SectionEditor({
  section,
  previewDevice,
  onPreviewDeviceChange,
  onChange,
  onClose,
  onSave,
}: {
  section: CustomSection;
  previewDevice: "mobile" | "desktop";
  onPreviewDeviceChange: (d: "mobile" | "desktop") => void;
  onChange: (patch: Partial<CustomSection>) => void;
  onClose: () => void;
  onSave: () => void;
}) {
  const [tab, setTab] = useState<"html" | "css" | "js" | "preview">("html");

  // Build the live preview iframe content
  const previewDoc = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<style>
  body { margin: 0; padding: 1rem; font-family: 'Inter', system-ui, sans-serif; background: #fff; color: #1a1a1a; }
  ${section.css}
</style>
</head>
<body>
${sanitizeHtml(section.html)}
<script>
try {
${section.js}
} catch(e) { console.error('Custom section JS error:', e); }
</script>
</body>
</html>`;

  return (
    <Dialog open onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-6xl w-[95vw] h-[90vh] flex flex-col p-0 gap-0">
        <DialogHeader className="p-4 border-b flex-row items-center justify-between space-y-0">
          <div>
            <DialogTitle className="text-base flex items-center gap-2">
              <Code2 className="size-4" /> {section.name}
            </DialogTitle>
            <DialogDescription className="text-xs">Edit your custom section. Changes save automatically.</DialogDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={onClose}>Close</Button>
            <Button size="sm" onClick={onSave}>
              <Save className="size-3.5" /> Save & Close
            </Button>
          </div>
        </DialogHeader>

        {/* Top: name + placement */}
        <div className="p-4 border-b bg-muted/30 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <Label className="text-xs">Section Name</Label>
            <Input
              value={section.name}
              onChange={(e) => onChange({ name: e.target.value })}
              className="mt-1 h-8"
            />
          </div>
          <div>
            <Label className="text-xs">Placement</Label>
            <Select
              value={section.placement}
              onValueChange={(v) => onChange({ placement: v as Placement })}
            >
              <SelectTrigger className="mt-1 h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="homepage">Homepage</SelectItem>
                <SelectItem value="collection">Collection pages</SelectItem>
                <SelectItem value="product">Product pages</SelectItem>
                <SelectItem value="footer">Footer</SelectItem>
                <SelectItem value="header">Header</SelectItem>
                <SelectItem value="all">Everywhere</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex-1 flex flex-col min-h-0">
          <Tabs value={tab} onValueChange={(v) => setTab(v as typeof tab)} className="flex-1 flex flex-col min-h-0">
            <div className="border-b px-4 flex items-center justify-between">
              <TabsList className="h-auto bg-transparent p-0">
                <TabsTrigger value="html" className="flex items-center gap-1.5 py-3 data-[state=active]:bg-transparent data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-primary rounded-none">
                  <Code className="size-3.5" /> HTML
                </TabsTrigger>
                <TabsTrigger value="css" className="flex items-center gap-1.5 py-3 data-[state=active]:bg-transparent data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-primary rounded-none">
                  <Palette className="size-3.5" /> CSS
                </TabsTrigger>
                <TabsTrigger value="js" className="flex items-center gap-1.5 py-3 data-[state=active]:bg-transparent data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-primary rounded-none">
                  <Brain className="size-3.5" /> JavaScript
                </TabsTrigger>
                <TabsTrigger value="preview" className="flex items-center gap-1.5 py-3 data-[state=active]:bg-transparent data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-primary rounded-none">
                  <Eye className="size-3.5" /> Preview
                </TabsTrigger>
              </TabsList>
              {tab === "preview" && (
                <div className="flex items-center gap-1">
                  <Button
                    variant={previewDevice === "mobile" ? "default" : "outline"}
                    size="sm"
                    className="h-7"
                    onClick={() => onPreviewDeviceChange("mobile")}
                  >
                    <Smartphone className="size-3.5" />
                  </Button>
                  <Button
                    variant={previewDevice === "desktop" ? "default" : "outline"}
                    size="sm"
                    className="h-7"
                    onClick={() => onPreviewDeviceChange("desktop")}
                  >
                    <Monitor className="size-3.5" />
                  </Button>
                </div>
              )}
            </div>

            <TabsContent value="html" className="flex-1 m-0 min-h-0">
              <Textarea
                value={section.html}
                onChange={(e) => onChange({ html: e.target.value })}
                className="w-full h-full rounded-none border-0 font-mono text-xs p-4 resize-none focus-visible:ring-0"
                spellCheck={false}
                placeholder="<div class='my-section'>...</div>"
              />
            </TabsContent>

            <TabsContent value="css" className="flex-1 m-0 min-h-0">
              <Textarea
                value={section.css}
                onChange={(e) => onChange({ css: e.target.value })}
                className="w-full h-full rounded-none border-0 font-mono text-xs p-4 resize-none focus-visible:ring-0"
                spellCheck={false}
                placeholder=".my-section { color: red; }"
              />
            </TabsContent>

            <TabsContent value="js" className="flex-1 m-0 min-h-0">
              <Textarea
                value={section.js}
                onChange={(e) => onChange({ js: e.target.value })}
                className="w-full h-full rounded-none border-0 font-mono text-xs p-4 resize-none focus-visible:ring-0"
                spellCheck={false}
                placeholder="// Optional JS for interactivity"
              />
            </TabsContent>

            <TabsContent value="preview" className="flex-1 m-0 min-h-0 p-4 bg-muted/30 overflow-auto flex justify-center">
              <div
                className="bg-white border rounded-lg shadow-sm overflow-hidden transition-all"
                style={{
                  width: previewDevice === "mobile" ? "375px" : "100%",
                  maxWidth: "100%",
                }}
              >
                <iframe
                  srcDoc={previewDoc}
                  className="w-full h-[400px] border-0"
                  title="Section preview"
                  sandbox="allow-scripts"
                />
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Status bar */}
        <div className="p-3 border-t bg-muted/30 flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <CheckCircle2 className="size-3 text-green-600" /> Auto-saved
            </span>
            <span>HTML: {section.html.length} chars</span>
            <span>CSS: {section.css.length} chars</span>
            {section.js && <span>JS: {section.js.length} chars</span>}
          </div>
          <span>Placement: <strong className="text-foreground">{PLACEMENT_LABELS[section.placement]}</strong></span>
        </div>
      </DialogContent>
    </Dialog>
  );
}
