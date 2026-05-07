"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { useAuth } from "@/components/providers/auth-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: ""
  });
  const [loading, setLoading] = useState(false);

  return (
    <div className="page-shell py-14">
      <Card className="mx-auto max-w-lg">
        <CardContent className="space-y-6 p-8">
          <div className="space-y-2 text-center">
            <CardTitle className="text-3xl">Create your account</CardTitle>
            <CardDescription>Save projects, track orders, and manage addresses.</CardDescription>
          </div>
          <form
            className="space-y-4"
            onSubmit={async (event) => {
              event.preventDefault();
              try {
                setLoading(true);
                await register(form);
                toast.success("Account created.");
                router.push("/");
              } catch (error) {
                toast.error(error instanceof Error ? error.message : "Registration failed.");
              } finally {
                setLoading(false);
              }
            }}
          >
            <Input
              placeholder="Full name"
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
              placeholder="Password"
              type="password"
              value={form.password}
              onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
            />
            <Input
              placeholder="Confirm password"
              type="password"
              value={form.confirmPassword}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  confirmPassword: event.target.value
                }))
              }
            />
            <Button className="w-full" disabled={loading}>
              {loading ? "Creating account..." : "Create account"}
            </Button>
          </form>
          <p className="text-center text-sm text-[var(--muted-foreground)]">
            Already have an account?{" "}
            <Link className="text-[var(--primary)]" href="/login">
              Login
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
