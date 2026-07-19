"use client";

import { useState } from "react";
import {
  Settings,
  Save,
  Store,
  CreditCard,
  Truck,
  Instagram,
  Facebook,
  Youtube,
  Mail,
  Phone,
  MapPin,
  Download,
  Upload,
  Database,
  ShieldCheck,
} from "lucide-react";
import { AdminPageHeader } from "@/components/admin/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

export default function AdminSettingsPage() {
  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Settings"
        description="Store, payment, shipping, and integration settings."
        icon={<Settings className="size-5" />}
        actions={
          <Button onClick={() => toast.success("Settings saved (demo)")}>
            <Save className="size-4" />
            Save Changes
          </Button>
        }
      />

      <Tabs defaultValue="store">
        <TabsList className="flex-wrap">
          <TabsTrigger value="store">
            <Store className="size-4" />
            Store
          </TabsTrigger>
          <TabsTrigger value="payment">
            <CreditCard className="size-4" />
            Payment
          </TabsTrigger>
          <TabsTrigger value="shipping">
            <Truck className="size-4" />
            Shipping
          </TabsTrigger>
          <TabsTrigger value="social">
            <Instagram className="size-4" />
            Social
          </TabsTrigger>
          <TabsTrigger value="backups">
            <Database className="size-4" />
            Backups
          </TabsTrigger>
        </TabsList>

        <TabsContent value="store">
          <StoreSettings />
        </TabsContent>
        <TabsContent value="payment">
          <PaymentSettings />
        </TabsContent>
        <TabsContent value="shipping">
          <ShippingSettings />
        </TabsContent>
        <TabsContent value="social">
          <SocialSettings />
        </TabsContent>
        <TabsContent value="backups">
          <BackupSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function StoreSettings() {
  const [storeName, setStoreName] = useState("Aurora & Co.");
  const [tagline, setTagline] = useState("Handcrafted Artificial Jewelry & Gift Hampers");
  const [logoUrl, setLogoUrl] = useState("");
  const [email, setEmail] = useState("support@aurora-co.com");
  const [phone, setPhone] = useState("+91 98765 43210");
  const [address, setAddress] = useState("123 Commercial Street, Bengaluru, Karnataka 560001");
  const [gstin, setGstin] = useState("27ABCDE1234F1Z5");

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Store className="size-5" />
          Store Information
        </CardTitle>
        <CardDescription>Public-facing details shown across your storefront and invoices.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="grid gap-2">
            <Label htmlFor="s-name">Store Name</Label>
            <Input id="s-name" value={storeName} onChange={(e) => setStoreName(e.target.value)} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="s-tagline">Tagline</Label>
            <Input id="s-tagline" value={tagline} onChange={(e) => setTagline(e.target.value)} />
          </div>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="s-logo">Logo URL</Label>
          <Input
            id="s-logo"
            value={logoUrl}
            onChange={(e) => setLogoUrl(e.target.value)}
            placeholder="https://… (leave blank to use text logo)"
          />
        </div>
        <Separator />
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="grid gap-2">
            <Label htmlFor="s-email" className="flex items-center gap-1.5">
              <Mail className="size-3.5" /> Contact Email
            </Label>
            <Input id="s-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="s-phone" className="flex items-center gap-1.5">
              <Phone className="size-3.5" /> Phone
            </Label>
            <Input id="s-phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
          </div>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="s-addr" className="flex items-center gap-1.5">
            <MapPin className="size-3.5" /> Business Address
          </Label>
          <Textarea
            id="s-addr"
            rows={2}
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>
        <div className="grid gap-2 sm:max-w-xs">
          <Label htmlFor="s-gstin" className="flex items-center gap-1.5">
            <ShieldCheck className="size-3.5" /> GSTIN
          </Label>
          <Input
            id="s-gstin"
            value={gstin}
            onChange={(e) => setGstin(e.target.value.toUpperCase())}
            className="font-mono uppercase"
            maxLength={15}
          />
        </div>
      </CardContent>
    </Card>
  );
}

function PaymentSettings() {
  const [razorpayKey, setRazorpayKey] = useState("rzp_live_••••••••••••");
  const [enableCod, setEnableCod] = useState(true);
  const [enablePartialCod, setEnablePartialCod] = useState(true);
  const [prepaidDiscount, setPrepaidDiscount] = useState("5");
  const [codAdvance, setCodAdvance] = useState("20");

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="size-5" />
          Payment Settings
        </CardTitle>
        <CardDescription>Razorpay, COD, and prepaid discount configuration.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-5">
        <div className="grid gap-2">
          <Label htmlFor="rzp-key">Razorpay Key ID</Label>
          <div className="flex items-center gap-2">
            <Input
              id="rzp-key"
              value={razorpayKey}
              onChange={(e) => setRazorpayKey(e.target.value)}
              className="font-mono"
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() => toast.success("Key revealed (demo)")}
            >
              Reveal
            </Button>
          </div>
          <p className="text-[11px] text-muted-foreground">
            Stored encrypted. Test mode uses <span className="font-mono">rzp_test_…</span> keys.
          </p>
        </div>

        <Separator />

        <ToggleRow
          label="Enable Cash on Delivery (COD)"
          desc="Allow customers to pay with cash on delivery"
          checked={enableCod}
          onChange={setEnableCod}
        />
        <ToggleRow
          label="Enable Partial COD"
          desc="Collect advance online; balance on delivery"
          checked={enablePartialCod}
          onChange={setEnablePartialCod}
          disabled={!enableCod}
        />

        <Separator />

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="grid gap-2">
            <Label htmlFor="p-disc">Prepaid Discount (%)</Label>
            <Input
              id="p-disc"
              type="number"
              value={prepaidDiscount}
              onChange={(e) => setPrepaidDiscount(e.target.value)}
              placeholder="5"
            />
            <p className="text-[11px] text-muted-foreground">
              Extra discount for prepaid orders to incentivize online payment.
            </p>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="c-adv">COD Advance (%)</Label>
            <Input
              id="c-adv"
              type="number"
              value={codAdvance}
              onChange={(e) => setCodAdvance(e.target.value)}
              placeholder="20"
              disabled={!enablePartialCod}
            />
            <p className="text-[11px] text-muted-foreground">
              Percentage collected upfront for partial COD orders.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function ShippingSettings() {
  const [freeShipThreshold, setFreeShipThreshold] = useState("999");
  const [flatRate, setFlatRate] = useState("49");
  const [codCharges, setCodCharges] = useState("0");

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Truck className="size-5" />
          Shipping Settings
        </CardTitle>
        <CardDescription>Free shipping thresholds and delivery charges.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4 sm:grid-cols-3">
        <div className="grid gap-2">
          <Label htmlFor="sh-free">Free Shipping Above (₹)</Label>
          <Input
            id="sh-free"
            type="number"
            value={freeShipThreshold}
            onChange={(e) => setFreeShipThreshold(e.target.value)}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="sh-flat">Flat Shipping Rate (₹)</Label>
          <Input
            id="sh-flat"
            type="number"
            value={flatRate}
            onChange={(e) => setFlatRate(e.target.value)}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="sh-cod">COD Charges (₹)</Label>
          <Input
            id="sh-cod"
            type="number"
            value={codCharges}
            onChange={(e) => setCodCharges(e.target.value)}
          />
        </div>
      </CardContent>
    </Card>
  );
}

function SocialSettings() {
  const [instagram, setInstagram] = useState("@auroraandco");
  const [facebook, setFacebook] = useState("auroraandco");
  const [youtube, setYoutube] = useState("@auroraandco");
  const [pinterest, setPinterest] = useState("auroraandco");

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Instagram className="size-5" />
          Social Links
        </CardTitle>
        <CardDescription>Connected social media profiles.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4 sm:grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor="soc-ig" className="flex items-center gap-1.5">
            <Instagram className="size-3.5" /> Instagram
          </Label>
          <Input id="soc-ig" value={instagram} onChange={(e) => setInstagram(e.target.value)} />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="soc-fb" className="flex items-center gap-1.5">
            <Facebook className="size-3.5" /> Facebook
          </Label>
          <Input id="soc-fb" value={facebook} onChange={(e) => setFacebook(e.target.value)} />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="soc-yt" className="flex items-center gap-1.5">
            <Youtube className="size-3.5" /> YouTube
          </Label>
          <Input id="soc-yt" value={youtube} onChange={(e) => setYoutube(e.target.value)} />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="soc-pin" className="flex items-center gap-1.5">
            <svg className="size-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.4 0 0 5.4 0 12c0 5 3.1 9.3 7.5 11.1-.1-.9-.2-2.4 0-3.4.2-.9 1.3-5.7 1.3-5.7s-.3-.7-.3-1.7c0-1.6.9-2.7 2.1-2.7 1 0 1.5.7 1.5 1.6 0 1-.6 2.4-.9 3.8-.3 1.1.6 2 1.7 2 2 0 3.5-2.1 3.5-5.2 0-2.7-1.9-4.6-4.7-4.6-3.2 0-5 2.4-5 4.8 0 1 .4 2 .8 2.6.1.1.1.2.1.3-.1.4-.3 1.1-.3 1.3-.1.2-.2.3-.4.2-1.4-.6-2.2-2.6-2.2-4.2 0-3.4 2.5-6.6 7.2-6.6 3.8 0 6.7 2.7 6.7 6.3 0 3.8-2.4 6.8-5.7 6.8-1.1 0-2.2-.6-2.5-1.3l-.7 2.6c-.2.9-.9 2.1-1.4 2.8 1.1.3 2.2.5 3.4.5 6.6 0 12-5.4 12-12S18.6 0 12 0z"/></svg>
            Pinterest
          </Label>
          <Input id="soc-pin" value={pinterest} onChange={(e) => setPinterest(e.target.value)} />
        </div>
      </CardContent>
    </Card>
  );
}

function BackupSettings() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="size-5" />
          Backup & Export
        </CardTitle>
        <CardDescription>Export your store data or restore from a backup.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid gap-3 sm:grid-cols-2">
          <Button
            variant="outline"
            className="h-auto justify-start py-4"
            onClick={() => toast.success("Export started — JSON file will download (demo).")}
          >
            <Download className="size-5" />
            <div className="text-left">
              <p className="text-sm font-medium">Export All Data</p>
              <p className="text-[11px] text-muted-foreground">Products, orders, customers (JSON)</p>
            </div>
          </Button>
          <Button
            variant="outline"
            className="h-auto justify-start py-4"
            onClick={() => toast.success("Export started — CSV file will download (demo).")}
          >
            <Download className="size-5" />
            <div className="text-left">
              <p className="text-sm font-medium">Export Orders (CSV)</p>
              <p className="text-[11px] text-muted-foreground">Spreadsheet-friendly order export</p>
            </div>
          </Button>
          <Button
            variant="outline"
            className="h-auto justify-start py-4"
            onClick={() => toast.success("Backup created (demo)")}
          >
            <Database className="size-5" />
            <div className="text-left">
              <p className="text-sm font-medium">Create Backup</p>
              <p className="text-[11px] text-muted-foreground">Snapshot of full store state</p>
            </div>
          </Button>
          <Button
            variant="outline"
            className="h-auto justify-start py-4"
            onClick={() => toast.info("Select a backup file to restore (demo)")}
          >
            <Upload className="size-5" />
            <div className="text-left">
              <p className="text-sm font-medium">Restore from Backup</p>
              <p className="text-[11px] text-muted-foreground">Upload a .json backup file</p>
            </div>
          </Button>
        </div>
        <Separator />
        <p className="text-[11px] text-muted-foreground">
          Last backup: <span className="font-mono">2026-06-20 03:00 IST</span> · Auto-backup scheduled daily at 03:00 IST.
        </p>
      </CardContent>
    </Card>
  );
}

function ToggleRow({
  label,
  desc,
  checked,
  onChange,
  disabled,
}: {
  label: string;
  desc: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <label
      className={`flex items-center justify-between gap-3 rounded-md border bg-background p-3 ${
        disabled ? "opacity-50" : ""
      }`}
    >
      <div>
        <p className="text-sm font-medium leading-tight">{label}</p>
        <p className="text-[11px] text-muted-foreground">{desc}</p>
      </div>
      <Switch checked={checked} onCheckedChange={onChange} disabled={disabled} aria-label={label} />
    </label>
  );
}
