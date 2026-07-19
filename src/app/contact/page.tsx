"use client";

import { useState } from "react";
import { Mail, Phone, MapPin, Clock, Send, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const contactInfo = [
  { icon: Phone, label: "Call Us", value: "+91 80000 00000", href: "tel:+918000000000" },
  { icon: Mail, label: "Email Us", value: "hello@aurora-co.in", href: "mailto:hello@aurora-co.in" },
  { icon: MapPin, label: "Visit Us", value: "Mumbai, Maharashtra, India", href: "#" },
  { icon: Clock, label: "Hours", value: "Mon–Sat, 10 AM – 7 PM IST", href: "#" },
];

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.includes("@") || !form.message.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setLoading(false);
    toast.success("Message sent! We'll reply within 24 hours.");
    setForm({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <>
      <section className="bg-foreground text-background py-12 lg:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.25em] text-gold">We're Here to Help</span>
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold mt-3">Get in Touch</h1>
          <p className="mt-3 text-background/70 max-w-xl mx-auto">
            Questions about an order, a piece, or anything else? We typically reply within 24 hours.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact info */}
          <div>
            <h2 className="font-serif text-2xl font-bold mb-6">Contact Information</h2>
            <div className="space-y-4">
              {contactInfo.map((c) => (
                <a
                  key={c.label}
                  href={c.href}
                  className="flex items-start gap-4 p-4 border rounded-lg hover:border-primary transition-colors"
                >
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <c.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">{c.label}</p>
                    <p className="font-medium">{c.value}</p>
                  </div>
                </a>
              ))}
            </div>

            <div className="mt-8 bg-secondary/40 rounded-lg p-5">
              <h3 className="font-semibold text-sm mb-2">Frequently Asked</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Many questions are answered in our FAQ — order tracking, shipping, returns, and more.
              </p>
              <a href="/faq" className="text-sm text-primary hover:underline">View FAQ →</a>
            </div>
          </div>

          {/* Form */}
          <div>
            <h2 className="font-serif text-2xl font-bold mb-6">Send a Message</h2>
            <form onSubmit={onSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Your Name *</Label>
                <Input id="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="mt-1" />
              </div>
              <div>
                <Label htmlFor="email">Email *</Label>
                <Input id="email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="mt-1" />
              </div>
              <div>
                <Label htmlFor="subject">Subject</Label>
                <Input id="subject" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} className="mt-1" />
              </div>
              <div>
                <Label htmlFor="message">Message *</Label>
                <Textarea
                  id="message"
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  rows={6}
                  className="mt-1"
                />
              </div>
              <Button type="submit" size="lg" disabled={loading} className="w-full sm:w-auto">
                {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Send className="h-4 w-4 mr-2" />}
                Send Message
              </Button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
