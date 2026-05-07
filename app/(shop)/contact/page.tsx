"use client";

import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { siteConfig } from "@/config/site";
import { apiRequest } from "@/services/api-client";

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: ""
  });
  const [loading, setLoading] = useState(false);

  return (
    <div className="page-shell grid gap-8 py-10 lg:grid-cols-[0.9fr_1.1fr]">
      <Card className="mesh-card text-white">
        <CardContent className="space-y-5 p-8">
          <p className="text-sm uppercase tracking-[0.24em] text-white/70">Contact</p>
          <CardTitle className="text-4xl text-white">Need product help, custom sourcing, or a bulk order?</CardTitle>
          <CardDescription className="text-white/80">
            Share your requirement, category, quantity, and timeline. ScienceKit can help with school projects,
            college models, electronics kits, wholesale orders, and category-wise sourcing.
          </CardDescription>
          <div className="space-y-2 rounded-[1.5rem] border border-white/15 bg-white/10 p-4 text-sm text-white/85">
            <p>Email: {siteConfig.email}</p>
            <p>Phone: +91 {siteConfig.phone}</p>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="space-y-6 p-8">
          <div className="space-y-2">
            <CardTitle className="text-3xl">Send us your requirement</CardTitle>
            <CardDescription>We usually reply within one business day.</CardDescription>
          </div>
          <form
            className="space-y-4"
            onSubmit={async (event) => {
              event.preventDefault();
              try {
                setLoading(true);
                await apiRequest("/api/contact", {
                  method: "POST",
                  body: JSON.stringify(form)
                });
                toast.success("Message sent successfully.");
                setForm({
                  name: "",
                  email: "",
                  phone: "",
                  subject: "",
                  message: ""
                });
              } catch (error) {
                toast.error(error instanceof Error ? error.message : "Unable to send message.");
              } finally {
                setLoading(false);
              }
            }}
          >
            <Input
              placeholder="Name"
              value={form.name}
              onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
            />
            <Input
              placeholder="Email"
              type="email"
              value={form.email}
              onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
            />
            <Input
              placeholder="Phone"
              value={form.phone}
              onChange={(event) => setForm((current) => ({ ...current, phone: event.target.value }))}
            />
            <Input
              placeholder="Subject"
              value={form.subject}
              onChange={(event) => setForm((current) => ({ ...current, subject: event.target.value }))}
            />
            <Textarea
              placeholder="Describe the project requirement, quantity, and timeline"
              value={form.message}
              onChange={(event) => setForm((current) => ({ ...current, message: event.target.value }))}
            />
            <Button disabled={loading}>{loading ? "Sending..." : "Send message"}</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
