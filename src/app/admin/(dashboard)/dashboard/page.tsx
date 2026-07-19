"use client";

import Link from "next/link";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  LayoutDashboard,
  TrendingUp,
  TrendingDown,
  ShoppingCart,
  Users,
  Wallet,
  ArrowUpRight,
  Package,
  AlertTriangle,
  ChevronRight,
} from "lucide-react";
import { AdminPageHeader } from "@/components/admin/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { products } from "@/lib/data";
import {
  dashboardKPIs,
  revenueLast7Days,
  mockOrders,
  orderStatusBadgeClass,
  orderStatusLabel,
} from "@/lib/admin-data";
import { formatINR, formatNumber, formatDate } from "@/lib/format";

function KpiCard({
  label,
  value,
  delta,
  icon,
  trend,
}: {
  label: string;
  value: string;
  delta: string;
  icon: React.ReactNode;
  trend: "up" | "down";
}) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardDescription className="text-xs font-medium uppercase tracking-wider">
            {label}
          </CardDescription>
          <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
            {icon}
          </div>
        </div>
        <CardTitle className="mt-2 font-serif text-2xl">{value}</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex items-center gap-2 text-xs">
          {trend === "up" ? (
            <TrendingUp className="size-3.5 text-emerald-600" />
          ) : (
            <TrendingDown className="size-3.5 text-rose-600" />
          )}
          <span className={trend === "up" ? "text-emerald-600" : "text-rose-600"}>
            {delta}
          </span>
          <span className="text-muted-foreground">vs last week</span>
        </div>
      </CardContent>
    </Card>
  );
}

export default function AdminDashboardPage() {
  const topProducts = [...products]
    .map((p) => ({ ...p, score: p.reviewCount * p.basePrice }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);
  const maxScore = topProducts[0]?.score ?? 1;
  const recentOrders = mockOrders.slice(0, 5);
  const lowStock = products
    .filter((p) => p.inventory < 10)
    .sort((a, b) => a.inventory - b.inventory);

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Dashboard"
        description="Welcome back, Shahbaz. Here's what's happening with your store today."
        icon={<LayoutDashboard className="size-5" />}
        actions={
          <Button variant="outline" asChild>
            <Link href="/admin/orders">
              View all orders
              <ArrowUpRight className="size-4" />
            </Link>
          </Button>
        }
      />

      {/* KPI cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          label="Total Revenue"
          value={formatINR(dashboardKPIs.totalRevenue)}
          delta="+12.4%"
          trend="up"
          icon={<Wallet className="size-5" />}
        />
        <KpiCard
          label="Orders"
          value={formatNumber(dashboardKPIs.orders)}
          delta="+8.1%"
          trend="up"
          icon={<ShoppingCart className="size-5" />}
        />
        <KpiCard
          label="Customers"
          value={formatNumber(dashboardKPIs.customers)}
          delta="+5.6%"
          trend="up"
          icon={<Users className="size-5" />}
        />
        <KpiCard
          label="Avg Order Value"
          value={formatINR(dashboardKPIs.avgOrderValue)}
          delta="-2.3%"
          trend="down"
          icon={<TrendingUp className="size-5" />}
        />
      </div>

      {/* Revenue chart + Top products */}
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Revenue — last 7 days</CardTitle>
            <CardDescription>
              Daily gross merchandise value across all channels.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={revenueLast7Days}
                  margin={{ top: 8, right: 8, left: 8, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="oklch(0.32 0.08 345)" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="oklch(0.32 0.08 345)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.9 0.012 75)" vertical={false} />
                  <XAxis
                    dataKey="label"
                    tickLine={false}
                    axisLine={false}
                    stroke="oklch(0.5 0.018 60)"
                    fontSize={12}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    stroke="oklch(0.5 0.018 60)"
                    fontSize={12}
                    tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
                    width={56}
                  />
                  <Tooltip
                    formatter={(v: number) => [formatINR(v), "Revenue"]}
                    labelFormatter={(l) => `Day: ${l}`}
                    contentStyle={{
                      borderRadius: 8,
                      border: "1px solid oklch(0.9 0.012 75)",
                      background: "oklch(0.99 0.005 80)",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="oklch(0.32 0.08 345)"
                    strokeWidth={2.5}
                    fill="url(#revGrad)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Selling Products</CardTitle>
            <CardDescription>Ranked by review volume × price.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {topProducts.map((p, idx) => (
              <div key={p.id} className="flex items-center gap-3">
                <span className="text-sm font-mono font-semibold text-muted-foreground w-5">
                  {idx + 1}
                </span>
                <img
                  src={p.images[0]?.url}
                  alt={p.name}
                  className="size-10 rounded-md object-cover ring-1 ring-border"
                />
                <div className="min-w-0 flex-1">
                  <Link
                    href={`/admin/products?focus=${p.id}`}
                    className="truncate text-sm font-medium hover:text-primary"
                  >
                    {p.name}
                  </Link>
                  <Progress
                    value={(p.score / maxScore) * 100}
                    className="mt-1 h-1.5"
                  />
                </div>
                <div className="text-right">
                  <div className="text-xs font-medium">{formatINR(p.basePrice)}</div>
                  <div className="text-[11px] text-muted-foreground">{p.reviewCount} reviews</div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Recent orders + Low stock */}
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle>Recent Orders</CardTitle>
              <CardDescription>Latest activity from your storefront.</CardDescription>
            </div>
            <Button asChild variant="ghost" size="sm">
              <Link href="/admin/orders">
                View all
                <ChevronRight className="size-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentOrders.map((o) => (
                  <TableRow key={o.id}>
                    <TableCell className="font-mono text-xs">{o.orderNumber}</TableCell>
                    <TableCell className="font-medium">{o.address.fullName}</TableCell>
                    <TableCell className="text-muted-foreground">{formatDate(o.createdAt)}</TableCell>
                    <TableCell className="font-medium">{formatINR(o.total)}</TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium ${orderStatusBadgeClass(o.status)}`}
                      >
                        {orderStatusLabel(o.status)}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="size-4 text-amber-500" />
                  Low Stock Alerts
                </CardTitle>
                <CardDescription>Products with inventory below 10.</CardDescription>
              </div>
              <Badge variant="secondary">{lowStock.length}</Badge>
            </div>
          </CardHeader>
          <CardContent className="max-h-72 overflow-y-auto pr-1">
            <div className="space-y-3">
              {lowStock.length === 0 && (
                <p className="py-6 text-center text-sm text-muted-foreground">
                  All products are well-stocked.
                </p>
              )}
              {lowStock.map((p) => (
                <div key={p.id} className="flex items-center gap-3">
                  <img
                    src={p.images[0]?.url}
                    alt={p.name}
                    className="size-10 rounded-md object-cover ring-1 ring-border"
                  />
                  <div className="min-w-0 flex-1">
                    <Link
                      href={`/admin/products?focus=${p.id}`}
                      className="truncate text-sm font-medium hover:text-primary"
                    >
                      {p.name}
                    </Link>
                    <p className="text-[11px] text-muted-foreground font-mono">{p.sku}</p>
                  </div>
                  <Badge
                    variant={p.inventory <= 3 ? "destructive" : "secondary"}
                    className="tabular-nums"
                  >
                    <Package className="size-3" />
                    {p.inventory} left
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
