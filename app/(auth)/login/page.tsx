"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { useAuth } from "@/components/providers/auth-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { GoogleLoginButton } from "@/components/auth/google-button";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  return (
    <div className="page-shell py-14">
      <Card className="mx-auto max-w-md">
        <CardContent className="space-y-6 p-8">
          <div className="space-y-2 text-center">
            <CardTitle className="text-3xl">Login</CardTitle>
            <CardDescription>Access your orders, wishlist, and saved cart.</CardDescription>
          </div>
          <form
            className="space-y-4"
            onSubmit={async (event) => {
              event.preventDefault();
              try {
                setLoading(true);
                await login({ email, password });
                toast.success("Logged in successfully.");
                router.push("/");
              } catch (error) {
                toast.error(error instanceof Error ? error.message : "Login failed.");
              } finally {
                setLoading(false);
              }
            }}
          >
            <Input placeholder="Email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} />
            <Input
              placeholder="Password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
            <Button className="w-full" disabled={loading}>
              {loading ? "Signing in..." : "Sign in"}
            </Button>
          </form>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
            </div>
          </div>
          <GoogleLoginButton />
          <div className="flex items-center justify-between text-sm">
            <Link className="text-[var(--primary)]" href="/forgot-password">
              Forgot password?
            </Link>
            <Link className="text-[var(--primary)]" href="/register">
              Create account
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
