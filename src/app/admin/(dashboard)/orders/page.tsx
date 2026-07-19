"use client";

import { useMemo, useState } from "react";
import {
  ShoppingCart,
  Search,
  Eye,
  Printer,
  MapPin,
  Phone,
  Mail,
  Package,
  CreditCard,
  Truck,
  CheckCircle2,
  Clock,
  XCircle,
} from "lucide-react";
import { AdminPageHeader } from "@/components/admin/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { mockOrders, orderStatusBadgeClass, orderStatusLabel } from "@/lib/admin-data";
import type { Order, OrderStatus } from "@/lib/types";
import { formatINR, formatDate, formatDateTime } from "@/lib/format";
import { toast } from "sonner";

const STATUS_FILTERS: ("all" | OrderStatus)[] = [
  "all",
  "confirmed",
  "packed",
  "shipped",
  "out_for_delivery",
  "delivered",
  "cancelled",
];

export default function AdminOrdersPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<"all" | OrderStatus>("all");
  const [selected, setSelected] = useState<Order | null>(null);
  const [printMode, setPrintMode] = useState(false);

  const filtered = useMemo(() => {
    return mockOrders.filter((o) => {
      if (status !== "all" && o.status !== status) return false;
      if (search) {
        const q = search.toLowerCase();
        if (
          !o.orderNumber.toLowerCase().includes(q) &&
          !o.guestEmail.toLowerCase().includes(q) &&
          !o.address.fullName.toLowerCase().includes(q)
        )
          return false;
      }
      return true;
    });
  }, [search, status]);

  const [printOrder, setPrintOrder] = useState<Order | null>(null);

  const handlePrint = (order: Order) => {
    setPrintOrder(order);
    setSelected(null);
    // Wait a tick for printable view to render before opening print dialog.
    setTimeout(() => {
      window.print();
      setPrintOrder(null);
    }, 350);
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Orders"
        description="View, filter, and update the status of customer orders."
        icon={<ShoppingCart className="size-5" />}
      />

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-1">
          {STATUS_FILTERS.map((s) => (
            <Button
              key={s}
              variant={status === s ? "default" : "outline"}
              size="sm"
              className="h-8"
              onClick={() => setStatus(s)}
            >
              {s === "all" ? "All" : orderStatusLabel(s)}
            </Button>
          ))}
        </div>
        <div className="relative">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search order #, customer, email…"
            className="h-9 w-full pl-8 sm:w-72"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="pl-4">Order #</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right pr-4">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((o) => (
                <TableRow key={o.id} className="cursor-pointer hover:bg-muted/40" onClick={() => setSelected(o)}>
                  <TableCell className="pl-4 font-mono text-xs font-medium">{o.orderNumber}</TableCell>
                  <TableCell>
                    <div className="text-sm font-medium">{o.address.fullName}</div>
                    <div className="text-[11px] text-muted-foreground">{o.guestEmail}</div>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">{formatDate(o.createdAt)}</TableCell>
                  <TableCell className="text-sm">{o.items.length}</TableCell>
                  <TableCell className="font-medium">{formatINR(o.total)}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-[11px]">
                      {o.paymentMethod === "cod" ? "COD" : o.paymentMethod === "partial_cod" ? "Partial COD" : "Prepaid"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium ${orderStatusBadgeClass(o.status)}`}>
                      {orderStatusLabel(o.status)}
                    </span>
                  </TableCell>
                  <TableCell className="text-right pr-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelected(o);
                      }}
                    >
                      <Eye className="size-4" />
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} className="h-32 text-center text-sm text-muted-foreground">
                    No orders match your filters.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <OrderDetailSheet
        key={selected?.id ?? "none"}
        order={selected}
        onClose={() => setSelected(null)}
        onPrint={handlePrint}
      />

      {/* Printable invoice — hidden on screen */}
      {printOrder && <PrintableInvoice order={printOrder} />}
    </div>
  );
}

function OrderDetailSheet({
  order,
  onClose,
  onPrint,
}: {
  order: Order | null;
  onClose: () => void;
  onPrint: (o: Order) => void;
}) {
  const [currentStatus, setCurrentStatus] = useState<OrderStatus | undefined>(undefined);

  if (!order) return null;
  const status = currentStatus ?? order.status;

  const handleUpdate = (s: OrderStatus) => {
    setCurrentStatus(s);
    toast.success(`Order ${order.orderNumber} updated to "${orderStatusLabel(s)}" (demo)`);
  };

  return (
    <Sheet open={!!order} onOpenChange={(v) => !v && onClose()}>
      <SheetContent side="right" className="w-full overflow-y-auto sm:max-w-xl">
        <SheetHeader className="border-b">
          <SheetTitle className="font-serif text-xl">Order {order.orderNumber}</SheetTitle>
          <SheetDescription>
            Placed on {formatDateTime(order.createdAt)} · {order.items.length} items
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 space-y-5 overflow-y-auto p-4">
          {/* Status row */}
          <div className="flex flex-wrap items-center gap-2">
            <span className={`inline-flex items-center rounded-md border px-2.5 py-1 text-xs font-medium ${orderStatusBadgeClass(status)}`}>
              {orderStatusLabel(status)}
            </span>
            <Badge variant="outline">{order.paymentMethod === "cod" ? "Cash on Delivery" : order.paymentMethod === "partial_cod" ? "Partial COD" : "Prepaid"}</Badge>
            <Badge variant="secondary">{order.paymentStatus}</Badge>
          </div>

          {/* Update status */}
          <div className="grid gap-2">
            <Label>Update status</Label>
            <Select value={status} onValueChange={(v) => handleUpdate(v as OrderStatus)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {(["confirmed", "packed", "shipped", "out_for_delivery", "delivered", "cancelled"] as OrderStatus[]).map((s) => (
                  <SelectItem key={s} value={s}>
                    {orderStatusLabel(s)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Customer */}
          <div className="grid gap-3 rounded-lg border bg-muted/30 p-4">
            <div className="flex items-center gap-2 text-sm font-medium">
              <MapPin className="size-4 text-muted-foreground" />
              Shipping Address
            </div>
            <div className="text-sm text-muted-foreground">
              <p className="font-medium text-foreground">{order.address.fullName}</p>
              <p>{order.address.line1}</p>
              {order.address.line2 && <p>{order.address.line2}</p>}
              <p>{order.address.city}, {order.address.state} {order.address.pincode}</p>
              <p className="mt-1 flex items-center gap-1.5"><Phone className="size-3" />{order.address.mobile}</p>
              <p className="flex items-center gap-1.5"><Mail className="size-3" />{order.guestEmail}</p>
            </div>
          </div>

          {/* Items */}
          <div className="grid gap-2">
            <p className="text-sm font-medium">Items</p>
            {order.items.map((it) => (
              <div key={`${it.productId}-${it.size ?? ""}`} className="flex items-center gap-3 rounded-lg border p-3">
                <img src={it.image} alt={it.name} className="size-12 rounded-md object-cover ring-1 ring-border" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{it.name}</p>
                  <p className="text-[11px] text-muted-foreground">Qty: {it.quantity} × {formatINR(it.unitPrice)}</p>
                </div>
                <div className="text-sm font-medium">{formatINR(it.total)}</div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="grid gap-2 rounded-lg border bg-muted/30 p-4 text-sm">
            <Row label="Subtotal" value={formatINR(order.subtotal)} />
            {order.discount > 0 && <Row label={`Discount${order.couponCode ? ` (${order.couponCode})` : ""}`} value={`− ${formatINR(order.discount)}`} />}
            <Row label="Shipping" value={order.shipping === 0 ? "Free" : formatINR(order.shipping)} />
            <Row label="Tax" value={order.tax === 0 ? "—" : formatINR(order.tax)} />
            <Separator className="my-1" />
            <Row label="Total" value={formatINR(order.total)} bold />
          </div>

          {/* Timeline */}
          <div className="grid gap-2">
            <p className="text-sm font-medium">Order Timeline</p>
            <div className="space-y-3">
              {order.timeline.map((t, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <StatusIcon status={t.status} />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{orderStatusLabel(t.status)}</p>
                    <p className="text-[11px] text-muted-foreground">{formatDateTime(t.at)}</p>
                    {t.note && <p className="text-xs text-muted-foreground">{t.note}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t p-4">
          <Button className="w-full" onClick={() => onPrint(order)}>
            <Printer className="size-4" />
            Print Invoice
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className={bold ? "font-medium" : "text-muted-foreground"}>{label}</span>
      <span className={bold ? "font-semibold" : ""}>{value}</span>
    </div>
  );
}

function StatusIcon({ status }: { status: OrderStatus }) {
  const cls = "mt-0.5 size-4 shrink-0";
  if (status === "delivered") return <CheckCircle2 className={`${cls} text-emerald-600`} />;
  if (status === "cancelled") return <XCircle className={`${cls} text-rose-600`} />;
  if (status === "shipped" || status === "out_for_delivery") return <Truck className={`${cls} text-amber-600`} />;
  if (status === "packed") return <Package className={`${cls} text-violet-600`} />;
  return <Clock className={`${cls} text-blue-600`} />;
}

function PrintableInvoice({ order }: { order: Order }) {
  return (
    <div className="hidden print:block fixed inset-0 bg-white p-8 text-black">
      <div className="mx-auto max-w-2xl">
        <div className="flex items-start justify-between border-b pb-6">
          <div>
            <h1 className="font-serif text-3xl font-bold">Aurora &amp; Co.</h1>
            <p className="text-sm text-gray-600">Handcrafted Jewelry & Premium Gift Hampers</p>
          </div>
          <div className="text-right text-sm">
            <p className="font-semibold">INVOICE</p>
            <p className="text-gray-600">{order.orderNumber}</p>
            <p className="text-gray-600">{formatDate(order.createdAt)}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 py-6 text-sm">
          <div>
            <p className="mb-1 text-xs font-semibold uppercase text-gray-500">Bill To</p>
            <p className="font-medium">{order.address.fullName}</p>
            <p>{order.address.line1}</p>
            {order.address.line2 && <p>{order.address.line2}</p>}
            <p>{order.address.city}, {order.address.state} {order.address.pincode}</p>
            <p>{order.address.mobile}</p>
          </div>
          <div>
            <p className="mb-1 text-xs font-semibold uppercase text-gray-500">Payment</p>
            <p className="font-medium">
              {order.paymentMethod === "cod" ? "Cash on Delivery" : order.paymentMethod === "partial_cod" ? "Partial COD" : "Prepaid"}
            </p>
            <p className="text-gray-600">Status: {order.paymentStatus}</p>
            <p className="text-gray-600">Status: {orderStatusLabel(order.status)}</p>
          </div>
        </div>

        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b bg-gray-100 text-left">
              <th className="p-2">Item</th>
              <th className="p-2 text-center">Qty</th>
              <th className="p-2 text-right">Unit Price</th>
              <th className="p-2 text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((it) => (
              <tr key={it.productId} className="border-b">
                <td className="p-2">{it.name}</td>
                <td className="p-2 text-center">{it.quantity}</td>
                <td className="p-2 text-right">{formatINR(it.unitPrice)}</td>
                <td className="p-2 text-right">{formatINR(it.total)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-4 flex justify-end">
          <div className="w-64 space-y-1 text-sm">
            <div className="flex justify-between"><span>Subtotal</span><span>{formatINR(order.subtotal)}</span></div>
            {order.discount > 0 && <div className="flex justify-between"><span>Discount</span><span>− {formatINR(order.discount)}</span></div>}
            <div className="flex justify-between"><span>Shipping</span><span>{order.shipping === 0 ? "Free" : formatINR(order.shipping)}</span></div>
            <div className="flex justify-between border-t pt-1 font-semibold"><span>Total</span><span>{formatINR(order.total)}</span></div>
          </div>
        </div>

        <div className="mt-12 border-t pt-4 text-center text-xs text-gray-500">
          <p>Thank you for shopping with Aurora &amp; Co.</p>
          <p className="mt-1">GSTIN: 27ABCDE1234F1Z5 · support@aurora-co.com · +91 98765 43210</p>
        </div>
      </div>
    </div>
  );
}
