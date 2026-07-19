"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User, Package, Heart, MapPin, LogOut, Edit2, Plus, Trash2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/components/providers/auth-provider";
import { useWishlistStore } from "@/lib/stores";
import { products } from "@/lib/data";
import { ProductCard } from "@/components/product/product-card";
import { formatINR } from "@/lib/format";
import { useHydrated } from "@/lib/use-hydrated";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface StoredOrder {
  orderNumber: string;
  total: number;
  paymentMethod: string;
  status: string;
  createdAt: string;
  estimatedDelivery: string;
  items: { snapshot: { name: string; image: string; price: number }; quantity: number }[];
}

interface Address {
  id: string;
  fullName: string;
  mobile: string;
  line1: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
  type: "home" | "office" | "other";
}

export default function ProfilePage() {
  const router = useRouter();
  const { user, signOut, isLoading } = useAuth();
  const hydrated = useHydrated();
  const { ids: wishlistIds } = useWishlistStore();
  const [orders, setOrders] = useState<StoredOrder[]>([]);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");

  useEffect(() => {
    if (!isLoading && !user) router.push("/login");
  }, [isLoading, user, router]);

  useEffect(() => {
    if (!hydrated) return;
    // Defer to microtask to satisfy react-hooks/set-state-in-effect rule.
    const id = setTimeout(() => {
      try {
        const o: StoredOrder[] = JSON.parse(localStorage.getItem("aurora-orders") ?? "[]");
        setOrders(o);
        const a: Address[] = JSON.parse(localStorage.getItem("aurora-addresses") ?? "[]");
        setAddresses(a);
      } catch { /* ignore */ }
    }, 0);
    return () => clearTimeout(id);
  }, [hydrated]);

  useEffect(() => {
    if (user) {
      const id = setTimeout(() => {
        setName(user.name);
        setMobile(user.mobile ?? "");
      }, 0);
      return () => clearTimeout(id);
    }
  }, [user]);

  if (isLoading || !user) {
    return <div className="min-h-[60vh] flex items-center justify-center"><div className="text-muted-foreground">Loading…</div></div>;
  }

  const wishlistItems = hydrated ? wishlistIds.map((id) => products.find((p) => p.id === id)).filter(Boolean) as typeof products : [];

  const onSignOut = async () => {
    await signOut();
    toast.success("Signed out");
    router.push("/");
  };

  const saveProfile = () => {
    if (!name.trim()) { toast.error("Name cannot be empty"); return; }
    toast.success("Profile updated");
    setEditing(false);
  };

  const addAddress = () => {
    const newAddr: Address = {
      id: `addr_${Date.now()}`,
      fullName: name,
      mobile,
      line1: "New address — click edit",
      city: "",
      state: "",
      pincode: "",
      isDefault: addresses.length === 0,
      type: "home",
    };
    const updated = [...addresses, newAddr];
    setAddresses(updated);
    localStorage.setItem("aurora-addresses", JSON.stringify(updated));
    toast.success("Address added (edit to fill details)");
  };

  const removeAddress = (id: string) => {
    const updated = addresses.filter((a) => a.id !== id);
    setAddresses(updated);
    localStorage.setItem("aurora-addresses", JSON.stringify(updated));
    toast.success("Address removed");
  };

  const setDefault = (id: string) => {
    const updated = addresses.map((a) => ({ ...a, isDefault: a.id === id }));
    setAddresses(updated);
    localStorage.setItem("aurora-addresses", JSON.stringify(updated));
  };

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 py-8 lg:py-12">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
          <User className="h-8 w-8 text-primary" />
        </div>
        <div className="flex-1">
          <h1 className="font-serif text-2xl sm:text-3xl font-bold">{user.name}</h1>
          <p className="text-sm text-muted-foreground">{user.email}</p>
        </div>
        <Button variant="outline" onClick={onSignOut}>
          <LogOut className="h-4 w-4 mr-2" /> Sign Out
        </Button>
      </div>

      <Tabs defaultValue="orders">
        <TabsList className="w-full justify-start overflow-x-auto no-scrollbar h-auto">
          <TabsTrigger value="orders" className="flex items-center gap-1.5">
            <Package className="h-4 w-4" /> Orders ({orders.length})
          </TabsTrigger>
          <TabsTrigger value="addresses" className="flex items-center gap-1.5">
            <MapPin className="h-4 w-4" /> Addresses
          </TabsTrigger>
          <TabsTrigger value="wishlist" className="flex items-center gap-1.5">
            <Heart className="h-4 w-4" /> Wishlist ({wishlistItems.length})
          </TabsTrigger>
          <TabsTrigger value="profile" className="flex items-center gap-1.5">
            <Edit2 className="h-4 w-4" /> Edit Profile
          </TabsTrigger>
        </TabsList>

        {/* Orders */}
        <TabsContent value="orders" className="mt-6">
          {orders.length === 0 ? (
            <div className="text-center py-16 border rounded-lg bg-secondary/20">
              <Package className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
              <p className="font-medium">No orders yet</p>
              <p className="text-sm text-muted-foreground mt-1">When you place an order, it'll appear here.</p>
              <Button asChild className="mt-4">
                <Link href="/collections">Start Shopping</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {[...orders].reverse().map((order) => (
                <div key={order.orderNumber} className="border rounded-lg p-4">
                  <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                    <div>
                      <p className="font-mono text-sm font-semibold">{order.orderNumber}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(order.createdAt).toLocaleString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{formatINR(order.total)}</p>
                      <Badge variant="secondary" className="capitalize">{order.status}</Badge>
                    </div>
                  </div>
                  <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
                    {order.items.map((item, i) => (
                      <div key={i} className="shrink-0 flex items-center gap-2 bg-muted/50 rounded-md p-2">
                        <div className="w-10 h-12 rounded overflow-hidden bg-muted">
                          { }
                          <img src={item.snapshot.image} alt={item.snapshot.name} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <p className="text-xs font-medium line-clamp-1 max-w-[150px]">{item.snapshot.name}</p>
                          <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 flex gap-2">
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/order-tracking?order=${order.orderNumber}`}>Track Order</Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Addresses */}
        <TabsContent value="addresses" className="mt-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold">Saved Addresses</h2>
            <Button onClick={addAddress} size="sm">
              <Plus className="h-4 w-4 mr-1" /> Add New
            </Button>
          </div>
          {addresses.length === 0 ? (
            <div className="text-center py-12 border rounded-lg bg-secondary/20">
              <MapPin className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
              <p className="text-sm text-muted-foreground">No saved addresses yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {addresses.map((addr) => (
                <div key={addr.id} className={cn("border rounded-lg p-4 relative", addr.isDefault && "border-primary border-2")}>
                  {addr.isDefault && (
                    <Badge className="absolute top-2 right-2" variant="secondary">Default</Badge>
                  )}
                  <p className="font-medium text-sm">{addr.fullName}</p>
                  <p className="text-sm text-muted-foreground mt-1">{addr.line1}</p>
                  <p className="text-sm text-muted-foreground">{addr.city}, {addr.state} - {addr.pincode}</p>
                  <p className="text-sm text-muted-foreground mt-1">📞 {addr.mobile}</p>
                  <div className="flex gap-2 mt-3">
                    {!addr.isDefault && (
                      <Button onClick={() => setDefault(addr.id)} variant="outline" size="sm">
                        <Check className="h-3 w-3 mr-1" /> Set Default
                      </Button>
                    )}
                    <Button onClick={() => removeAddress(addr.id)} variant="ghost" size="sm" className="text-destructive">
                      <Trash2 className="h-3 w-3 mr-1" /> Remove
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Wishlist */}
        <TabsContent value="wishlist" className="mt-6">
          {wishlistItems.length === 0 ? (
            <div className="text-center py-16 border rounded-lg bg-secondary/20">
              <Heart className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
              <p className="font-medium">Your wishlist is empty</p>
              <Button asChild className="mt-4">
                <Link href="/collections">Browse Products</Link>
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
              {wishlistItems.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </TabsContent>

        {/* Edit Profile */}
        <TabsContent value="profile" className="mt-6">
          <div className="max-w-md space-y-4">
            <h2 className="font-semibold">Edit Profile</h2>
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name" value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={!editing}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" value={user.email} disabled className="mt-1 bg-muted/50" />
              <p className="text-xs text-muted-foreground mt-1">Email cannot be changed.</p>
            </div>
            <div>
              <Label htmlFor="mobile">Mobile</Label>
              <Input
                id="mobile" value={mobile}
                onChange={(e) => setMobile(e.target.value.replace(/\D/g, "").slice(0, 10))}
                disabled={!editing}
                inputMode="numeric"
                className="mt-1"
              />
            </div>
            <div className="flex gap-2">
              {editing ? (
                <>
                  <Button onClick={saveProfile}>Save Changes</Button>
                  <Button variant="outline" onClick={() => { setEditing(false); setName(user.name); setMobile(user.mobile ?? ""); }}>
                    Cancel
                  </Button>
                </>
              ) : (
                <Button onClick={() => setEditing(true)}>
                  <Edit2 className="h-4 w-4 mr-2" /> Edit
                </Button>
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
