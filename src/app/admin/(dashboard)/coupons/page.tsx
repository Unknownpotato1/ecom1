"use client";

import { useState } from "react";
import { Plus, Ticket, Pencil, Trash2, MoreHorizontal, Copy, Check, X } from "lucide-react";
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
import { coupons } from "@/lib/data";
import { formatINR, formatDate } from "@/lib/format";
import { toast } from "sonner";

export default function AdminCouponsPage() {
  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Coupons"
        description="Discount codes & promotions for your storefront."
        icon={<Ticket className="size-5" />}
        actions={<AddCouponDialog />}
      />

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="pl-4">Code</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Value</TableHead>
                <TableHead>Min Order</TableHead>
                <TableHead>Usage</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Expiry</TableHead>
                <TableHead className="text-right pr-4">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {coupons.map((c) => {
                const usagePct = Math.min(100, Math.round((c.usedCount / c.usageLimit) * 100));
                return (
                  <TableRow key={c.id}>
                    <TableCell className="pl-4">
                      <div className="flex items-center gap-2">
                        <code className="rounded bg-primary/10 px-2 py-1 text-xs font-semibold text-primary">
                          {c.code}
                        </code>
                      </div>
                      <p className="mt-1 line-clamp-1 max-w-[280px] text-[11px] text-muted-foreground">
                        {c.description}
                      </p>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize">{c.type}</Badge>
                    </TableCell>
                    <TableCell className="font-medium">
                      {c.type === "percentage" ? `${c.value}%` : formatINR(c.value)}
                    </TableCell>
                    <TableCell className="text-sm">{formatINR(c.minOrderValue)}</TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <span className="text-xs text-muted-foreground">
                          {c.usedCount} / {c.usageLimit}
                        </span>
                        <div className="h-1.5 w-24 overflow-hidden rounded-full bg-muted">
                          <div
                            className={`h-full ${usagePct > 80 ? "bg-rose-500" : "bg-emerald-500"}`}
                            style={{ width: `${usagePct}%` }}
                          />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {c.isActive ? (
                        <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200">
                          <Check className="size-3" /> Active
                        </Badge>
                      ) : (
                        <Badge variant="secondary">
                          <X className="size-3" /> Inactive
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">—</TableCell>
                    <TableCell className="text-right pr-4">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="size-8">
                            <MoreHorizontal className="size-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => toast.info("Edit coupon (demo)")}>
                            <Pencil className="size-4" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              navigator.clipboard?.writeText(c.code);
                              toast.success(`Copied "${c.code}"`);
                            }}
                          >
                            <Copy className="size-4" /> Copy code
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => toast.success(c.isActive ? "Coupon disabled (demo)" : "Coupon enabled (demo)")}
                          >
                            {c.isActive ? <X className="size-4" /> : <Check className="size-4" />}
                            {c.isActive ? "Disable" : "Enable"}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-destructive focus:text-destructive"
                            onClick={() => toast.error("Coupon deleted (demo)")}
                          >
                            <Trash2 className="size-4" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

function AddCouponDialog() {
  const [open, setOpen] = useState(false);
  const [code, setCode] = useState("");
  const [type, setType] = useState<"percentage" | "flat">("percentage");
  const [value, setValue] = useState("");
  const [minOrder, setMinOrder] = useState("");
  const [maxDiscount, setMaxDiscount] = useState("");
  const [usageLimit, setUsageLimit] = useState("");
  const [expiresAt, setExpiresAt] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [description, setDescription] = useState("");

  const handleSave = () => {
    if (!code.trim()) {
      toast.error("Coupon code is required.");
      return;
    }
    if (!value || Number(value) <= 0) {
      toast.error("Please enter a valid value.");
      return;
    }
    toast.success(`Coupon "${code.toUpperCase()}" created (demo)`);
    setCode("");
    setType("percentage");
    setValue("");
    setMinOrder("");
    setMaxDiscount("");
    setUsageLimit("");
    setExpiresAt("");
    setIsActive(true);
    setDescription("");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="size-4" />
          Add Coupon
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>New Coupon</DialogTitle>
          <DialogDescription>Create a discount code for your storefront.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-2">
          <div className="grid gap-2">
            <Label htmlFor="cp-code">Coupon Code</Label>
            <Input
              id="cp-code"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="AURORA15"
              className="font-mono uppercase"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label>Type</Label>
              <Select value={type} onValueChange={(v) => setType(v as "percentage" | "flat")}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="percentage">Percentage (%)</SelectItem>
                  <SelectItem value="flat">Flat (₹)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="cp-value">{type === "percentage" ? "Discount %" : "Discount ₹"}</Label>
              <Input
                id="cp-value"
                type="number"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder={type === "percentage" ? "15" : "200"}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="cp-min">Minimum Order (₹)</Label>
              <Input
                id="cp-min"
                type="number"
                value={minOrder}
                onChange={(e) => setMinOrder(e.target.value)}
                placeholder="999"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="cp-max">Max Discount (₹)</Label>
              <Input
                id="cp-max"
                type="number"
                value={maxDiscount}
                onChange={(e) => setMaxDiscount(e.target.value)}
                placeholder="1500"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="cp-usage">Usage Limit</Label>
              <Input
                id="cp-usage"
                type="number"
                value={usageLimit}
                onChange={(e) => setUsageLimit(e.target.value)}
                placeholder="1000"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="cp-expiry">Expiry Date</Label>
              <Input
                id="cp-expiry"
                type="date"
                value={expiresAt}
                onChange={(e) => setExpiresAt(e.target.value)}
              />
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="cp-desc">Description</Label>
            <Textarea
              id="cp-desc"
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="15% off on all prepaid orders. Max discount ₹1500."
            />
          </div>
          <label className="flex cursor-pointer items-center justify-between rounded-md border bg-background p-3">
            <div>
              <p className="text-sm font-medium leading-tight">Active</p>
              <p className="text-[11px] text-muted-foreground">Customers can use this coupon immediately</p>
            </div>
            <Switch checked={isActive} onCheckedChange={setIsActive} aria-label="Active" />
          </label>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleSave}>
            <Plus className="size-4" />
            Create Coupon
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
