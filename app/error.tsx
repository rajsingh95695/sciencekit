"use client";

import { useEffect } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";

export default function GlobalError({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="page-shell py-14">
      <Card className="mx-auto max-w-2xl">
        <CardContent className="space-y-5 p-8 text-center">
          <CardTitle className="text-3xl">Something went wrong</CardTitle>
          <CardDescription>
            The page hit an unexpected error. You can retry without losing your overall session.
          </CardDescription>
          <Button onClick={reset}>Try again</Button>
        </CardContent>
      </Card>
    </div>
  );
}
