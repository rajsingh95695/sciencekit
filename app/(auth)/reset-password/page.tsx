"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { resetPassword } from "@/services/auth-service";

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  return (
    <div className="page-shell py-14">
      <Card className="mx-auto max-w-md">
        <CardContent className="space-y-6 p-8">
          <div className="space-y-2 text-center">
            <CardTitle className="text-3xl">Reset password</CardTitle>
            <CardDescription>Create a new password for your account.</CardDescription>
          </div>
          <form
            className="space-y-4"
            onSubmit={async (event) => {
              event.preventDefault();
              try {
                setLoading(true);
                const response = await resetPassword({ token, password });
                toast.success(response.message);
                router.push("/login");
              } catch (error) {
                toast.error(error instanceof Error ? error.message : "Unable to reset password.");
              } finally {
                setLoading(false);
              }
            }}
          >
            <Input
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              type="password"
              placeholder="New password"
            />
            <Button className="w-full" disabled={loading || !token}>
              {loading ? "Updating..." : "Update password"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
