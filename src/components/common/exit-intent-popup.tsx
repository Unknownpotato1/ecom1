"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { X, Gift } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUIStore } from "@/lib/stores";
import { toast } from "sonner";

// Exit intent popup — fires once when cursor leaves the viewport (desktop)
// or after 25s of inactivity (mobile).
export function ExitIntentPopup() {
  const { exitIntentShown, setExitIntentShown } = useUIStore();
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (exitIntentShown) return;
    let fired = false;
    const fire = () => {
      if (fired) return;
      fired = true;
      setOpen(true);
      setExitIntentShown(true);
    };
    const onMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0) fire();
    };
    const onTouchIdle = setTimeout(() => {
      if (!fired) fire();
    }, 35000);
    document.addEventListener("mouseleave", onMouseLeave);
    return () => {
      document.removeEventListener("mouseleave", onMouseLeave);
      clearTimeout(onTouchIdle);
    };
  }, [exitIntentShown, setExitIntentShown]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes("@")) {
      toast.error("Please enter a valid email");
      return;
    }
    toast.success("Code AURORA15 is yours! Check your inbox.");
    setOpen(false);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setOpen(false)}
        >
          <motion.div
            className="relative bg-background rounded-2xl max-w-md w-full overflow-hidden shadow-2xl"
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-muted z-10"
              aria-label="Close popup"
            >
              <X className="h-4 w-4" />
            </button>
            <div className="grid sm:grid-cols-2">
              <div className="hidden sm:block">
                { }
                <img
                  src="https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=600&q=80"
                  alt="Aurora jewelry"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-8 text-center">
                <div className="w-12 h-12 rounded-full bg-gold/15 flex items-center justify-center mx-auto mb-4">
                  <Gift className="h-6 w-6 text-gold" />
                </div>
                <h3 className="font-serif text-2xl font-bold mb-2">Wait — get 15% off!</h3>
                <p className="text-sm text-muted-foreground mb-5">
                  Join the Aurora Circle and unlock <span className="font-semibold text-foreground">15% off</span> your first order, plus early access to new drops.
                </p>
                <form onSubmit={onSubmit} className="space-y-2">
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="text-center"
                    autoFocus
                  />
                  <Button type="submit" className="w-full" size="lg">
                    Claim My 15% Off
                  </Button>
                </form>
                <p className="text-xs text-muted-foreground mt-3">
                  By signing up you agree to our{" "}
                  <Link href="/privacy-policy" className="underline">Privacy Policy</Link>.
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
