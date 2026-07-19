"use client";

import { useMemo, useState } from "react";
import {
  ScrollText,
  Search,
  Filter,
  Download,
  ShieldCheck,
  Pencil,
  Package,
  ShoppingCart,
  Ticket,
  Star,
  Image as ImageIcon,
  LayoutTemplate,
  Palette,
  Settings,
  User as UserIcon,
  Trash2,
} from "lucide-react";
import { AdminPageHeader } from "@/components/admin/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { mockActivityLogs, type ActivityLog } from "@/lib/admin-data";
import { formatDateTime } from "@/lib/format";
import { toast } from "sonner";

const ACTION_META: Record<string, { icon: React.ComponentType<{ className?: string }>; color: string }> = {
  PRODUCT_CREATED: { icon: Package, color: "text-emerald-600" },
  PRODUCT_UPDATED: { icon: Pencil, color: "text-blue-600" },
  PRODUCT_DELETED: { icon: Trash2, color: "text-rose-600" },
  ORDER_STATUS_UPDATED: { icon: ShoppingCart, color: "text-amber-600" },
  ORDER_REFUNDED: { icon: ShoppingCart, color: "text-rose-600" },
  COUPON_CREATED: { icon: Ticket, color: "text-emerald-600" },
  COUPON_DISABLED: { icon: Ticket, color: "text-rose-600" },
  CUSTOMER_REGISTERED: { icon: UserIcon, color: "text-violet-600" },
  REVIEW_VERIFIED: { icon: Star, color: "text-amber-600" },
  REVIEW_DELETED: { icon: Trash2, color: "text-rose-600" },
  MEDIA_UPLOADED: { icon: ImageIcon, color: "text-cyan-600" },
  HOMEPAGE_UPDATED: { icon: LayoutTemplate, color: "text-blue-600" },
  THEME_SAVED: { icon: Palette, color: "text-violet-600" },
  SETTINGS_UPDATED: { icon: Settings, color: "text-blue-600" },
  ADMIN_SIGNIN: { icon: ShieldCheck, color: "text-emerald-600" },
};

export default function AdminLogsPage() {
  const [search, setSearch] = useState("");
  const [action, setAction] = useState("all");

  const filtered = useMemo(() => {
    return mockActivityLogs.filter((l) => {
      if (action !== "all" && l.action !== action) return false;
      if (search) {
        const q = search.toLowerCase();
        if (
          !l.details.toLowerCase().includes(q) &&
          !l.user.toLowerCase().includes(q) &&
          !l.action.toLowerCase().includes(q)
        )
          return false;
      }
      return true;
    });
  }, [search, action]);

  const actionOptions = Array.from(new Set(mockActivityLogs.map((l) => l.action)));

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Activity Logs"
        description="Audit trail of admin actions and system events."
        icon={<ScrollText className="size-5" />}
        actions={
          <Button variant="outline" onClick={() => toast.success("Exporting logs as CSV (demo)")}>
            <Download className="size-4" />
            Export
          </Button>
        }
      />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search action, user, details…"
            className="h-9 w-full pl-8 sm:w-72"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="size-4 text-muted-foreground" />
          <Select value={action} onValueChange={setAction}>
            <SelectTrigger className="h-9 w-56">
              <SelectValue placeholder="Filter by action" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All actions</SelectItem>
              {actionOptions.map((a) => (
                <SelectItem key={a} value={a}>
                  {a.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase())}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="pl-4">Action</TableHead>
                <TableHead>Details</TableHead>
                <TableHead>User</TableHead>
                <TableHead>IP Address</TableHead>
                <TableHead>Timestamp</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.slice(0, 50).map((log: ActivityLog) => {
                const meta = ACTION_META[log.action] ?? { icon: ScrollText, color: "text-muted-foreground" };
                const Icon = meta.icon;
                return (
                  <TableRow key={log.id}>
                    <TableCell className="pl-4">
                      <div className="flex items-center gap-2">
                        <Icon className={`size-4 ${meta.color}`} />
                        <Badge variant="outline" className="font-mono text-[10px]">
                          {log.action}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">{log.details}</TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground">{log.user}</TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground">{log.ip}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{formatDateTime(log.timestamp)}</TableCell>
                  </TableRow>
                );
              })}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="h-32 text-center text-sm text-muted-foreground">
                    No log entries match your filters.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {filtered.length > 50 && (
        <p className="text-center text-xs text-muted-foreground">
          Showing first 50 of {filtered.length} log entries.
        </p>
      )}
    </div>
  );
}
