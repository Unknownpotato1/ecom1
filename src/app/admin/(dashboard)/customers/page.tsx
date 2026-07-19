"use client";

import { useMemo, useState } from "react";
import {
  Users,
  Search,
  Eye,
  Mail,
  Phone,
  MapPin,
  Heart,
  ShoppingBag,
  Wallet,
  Calendar,
} from "lucide-react";
import { AdminPageHeader } from "@/components/admin/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  mockCustomers,
  ordersForCustomer,
  totalSpentByCustomer,
  ordersCountForCustomer,
  orderStatusBadgeClass,
  orderStatusLabel,
} from "@/lib/admin-data";
import { products } from "@/lib/data";
import { formatINR, formatDate, formatDateTime } from "@/lib/format";
import type { User } from "@/lib/types";

export default function AdminCustomersPage() {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<User | null>(null);

  const filtered = useMemo(() => {
    if (!search) return mockCustomers;
    const q = search.toLowerCase();
    return mockCustomers.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        (c.mobile ?? "").includes(q),
    );
  }, [search]);

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Customers"
        description="Profiles, contact details, and lifetime value of your customers."
        icon={<Users className="size-5" />}
      />

      <div className="flex items-center justify-between">
        <div className="relative">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search name, email, mobile…"
            className="h-9 w-full pl-8 sm:w-72"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <p className="text-sm text-muted-foreground">{filtered.length} customers</p>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="pl-4">Customer</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Orders</TableHead>
                <TableHead>Total Spent</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead className="text-right pr-4">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((c) => {
                const orderCount = ordersCountForCustomer(c.id);
                const spent = totalSpentByCustomer(c.id);
                return (
                  <TableRow key={c.id} className="cursor-pointer hover:bg-muted/40" onClick={() => setSelected(c)}>
                    <TableCell className="pl-4">
                      <div className="flex items-center gap-3">
                        <div className="flex size-10 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                          {c.name.charAt(0)}
                        </div>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium">{c.name}</p>
                          <p className="truncate text-[11px] text-muted-foreground">{c.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground font-mono">{c.mobile ?? "—"}</TableCell>
                    <TableCell className="text-sm">
                      {c.addresses[0]?.city ?? "—"}, {c.addresses[0]?.state ?? ""}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{orderCount}</Badge>
                    </TableCell>
                    <TableCell className="font-medium">{formatINR(spent)}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{formatDate(c.createdAt)}</TableCell>
                    <TableCell className="text-right pr-4">
                      <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); setSelected(c); }}>
                        <Eye className="size-4" />
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <CustomerDetailSheet customer={selected} onClose={() => setSelected(null)} />
    </div>
  );
}

function CustomerDetailSheet({
  customer,
  onClose,
}: {
  customer: User | null;
  onClose: () => void;
}) {
  if (!customer) return null;
  const orders = ordersForCustomer(customer.id);
  const spent = totalSpentByCustomer(customer.id);
  const wishlist = customer.wishlistProductIds
    .map((id) => products.find((p) => p.id === id))
    .filter(Boolean);
  const addr = customer.addresses[0];

  return (
    <Sheet open={!!customer} onOpenChange={(v) => !v && onClose()}>
      <SheetContent side="right" className="w-full overflow-y-auto sm:max-w-xl">
        <SheetHeader className="border-b">
          <SheetTitle className="font-serif text-xl">{customer.name}</SheetTitle>
          <SheetDescription>Customer since {formatDate(customer.createdAt)}</SheetDescription>
        </SheetHeader>

        <div className="flex-1 space-y-5 overflow-y-auto p-4">
          {/* Contact */}
          <div className="grid gap-2 rounded-lg border bg-muted/30 p-4 text-sm">
            <p className="flex items-center gap-2"><Mail className="size-4 text-muted-foreground" />{customer.email}</p>
            <p className="flex items-center gap-2"><Phone className="size-4 text-muted-foreground" />{customer.mobile ?? "—"}</p>
            {addr && (
              <p className="flex items-start gap-2">
                <MapPin className="mt-0.5 size-4 text-muted-foreground" />
                <span>{addr.line1}, {addr.line2 ? `${addr.line2}, ` : ""}{addr.city}, {addr.state} {addr.pincode}</span>
              </p>
            )}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3">
            <StatTile icon={<ShoppingBag className="size-4" />} label="Orders" value={String(orders.length)} />
            <StatTile icon={<Wallet className="size-4" />} label="Total Spent" value={formatINR(spent)} />
            <StatTile icon={<Heart className="size-4" />} label="Wishlist" value={String(wishlist.length)} />
          </div>

          {/* Addresses */}
          {addr && (
            <div className="grid gap-2">
              <p className="text-sm font-medium">Saved Address</p>
              <div className="rounded-lg border p-3 text-sm">
                <p className="font-medium">{addr.fullName}</p>
                <p className="text-muted-foreground">{addr.line1}{addr.line2 ? `, ${addr.line2}` : ""}</p>
                <p className="text-muted-foreground">{addr.city}, {addr.state} {addr.pincode}</p>
                <p className="mt-1 text-muted-foreground">{addr.mobile}</p>
                <Badge variant="outline" className="mt-2 capitalize">{addr.type}</Badge>
              </div>
            </div>
          )}

          {/* Orders */}
          <div className="grid gap-2">
            <p className="text-sm font-medium">Order History ({orders.length})</p>
            {orders.length === 0 ? (
              <p className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
                No orders yet.
              </p>
            ) : (
              <div className="space-y-2">
                {orders.map((o) => (
                  <div key={o.id} className="flex items-center gap-3 rounded-lg border p-3">
                    <div className="flex-1 min-w-0">
                      <p className="truncate text-sm font-medium font-mono">{o.orderNumber}</p>
                      <p className="flex items-center gap-1 text-[11px] text-muted-foreground">
                        <Calendar className="size-3" />
                        {formatDateTime(o.createdAt)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">{formatINR(o.total)}</p>
                      <span className={`mt-0.5 inline-flex items-center rounded border px-1.5 py-0.5 text-[10px] font-medium ${orderStatusBadgeClass(o.status)}`}>
                        {orderStatusLabel(o.status)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Wishlist */}
          {wishlist.length > 0 && (
            <div className="grid gap-2">
              <p className="text-sm font-medium">Wishlist ({wishlist.length})</p>
              <div className="grid grid-cols-4 gap-2">
                {wishlist.map((p) => p && (
                  <div key={p.id} className="overflow-hidden rounded-md border">
                    <img src={p.images[0]?.url} alt={p.name} className="aspect-square w-full object-cover" />
                    <p className="truncate p-1.5 text-[10px] font-medium">{p.name}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <Separator />
          <p className="text-xs text-muted-foreground">
            Customer ID: <span className="font-mono">{customer.id}</span>
          </p>
        </div>
      </SheetContent>
    </Sheet>
  );
}

function StatTile({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-lg border bg-muted/30 p-3 text-center">
      <div className="mx-auto mb-1 flex size-7 items-center justify-center rounded-md bg-background text-muted-foreground">
        {icon}
      </div>
      <p className="text-sm font-semibold">{value}</p>
      <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</p>
    </div>
  );
}
