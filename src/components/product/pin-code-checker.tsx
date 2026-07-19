"use client";

import { useState } from "react";
import { MapPin, Check, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { isValidIndianPin, lookupIndianPin, estimatedDeliveryLabel } from "@/lib/format";
import { format } from "date-fns";

export function PinCodeChecker() {
  const [pin, setPin] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ valid: boolean; city: string; state: string } | null>(null);

  const onCheck = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidIndianPin(pin)) {
      setResult({ valid: false, city: "", state: "" });
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setResult(lookupIndianPin(pin));
      setLoading(false);
    }, 600);
  };

  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + 5);

  return (
    <div className="border rounded-lg p-4 bg-secondary/30">
      <div className="flex items-center gap-2 mb-2">
        <MapPin className="h-4 w-4 text-primary" />
        <h4 className="text-sm font-semibold">Check Delivery</h4>
      </div>
      <p className="text-xs text-muted-foreground mb-3">
        Enter your PIN code to check delivery options and estimated delivery date.
      </p>
      <form onSubmit={onCheck} className="flex gap-2">
        <Input
          type="text"
          inputMode="numeric"
          maxLength={6}
          value={pin}
          onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
          placeholder="6-digit PIN code"
          className="flex-1"
        />
        <Button type="submit" disabled={loading || pin.length !== 6} size="sm">
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Check"}
        </Button>
      </form>

      {result && (
        <div className="mt-3 text-sm">
          {result.valid ? (
            <div className="space-y-1.5">
              <div className="flex items-start gap-2 text-green-700">
                <Check className="h-4 w-4 mt-0.5 shrink-0" />
                <div>
                  <p className="font-medium">Delivery available!</p>
                  <p className="text-xs text-muted-foreground">
                    {result.city && `${result.city}, `}{result.state}
                  </p>
                </div>
              </div>
              <div className="bg-background rounded-md p-2.5 border">
                <p className="text-xs text-muted-foreground">Estimated delivery by</p>
                <p className="text-sm font-semibold">
                  {format(deliveryDate, "EEE, dd MMM yyyy")}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  COD available • Free shipping on prepaid orders
                </p>
              </div>
            </div>
          ) : (
            <p className="text-destructive text-xs">
              Please enter a valid 6-digit Indian PIN code.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
