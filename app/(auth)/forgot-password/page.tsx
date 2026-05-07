"use client";

import { useState } from "react";
import { toast } from "sonner";

import { forgotPassword } from "@/services/auth-service";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  return (
    <div className="page-shell py-14">
      <Card className="mx-auto max-w-md">
        <CardContent className="space-y-6 p-8">
          <div className="space-y-2 text-center">
            <CardTitle className="text-3xl">Forgot password</CardTitle>
            <CardDescription>We’ll email you a secure reset link.</CardDescription>
          </div>
          <form
            className="space-y-4"
            onSubmit={async (event) => {
              event.preventDefault();
              try {
                setLoading(true);
                const response = await forgotPassword({ email });
                toast.success(response.message);
              } catch (error) {
                toast.error(error instanceof Error ? error.message : "Unable to send reset link.");
              } finally {
                setLoading(false);
              }
            }}
          >
            <Input value={email} onChange={(event) => setEmail(event.target.value)} type="email" placeholder="Email" />
            <Button className="w-full" disabled={loading}>
              {loading ? "Sending..." : "Send reset link"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
