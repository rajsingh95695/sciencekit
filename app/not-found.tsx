import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="page-shell flex min-h-[60vh] flex-col items-center justify-center gap-6 text-center">
      <p className="text-sm uppercase tracking-[0.24em] text-[var(--muted-foreground)]">404</p>
      <h1 className="font-[var(--font-display)] text-5xl font-bold">Page not found</h1>
      <p className="max-w-xl text-[var(--muted-foreground)]">
        The project, article, or admin resource you requested could not be found.
      </p>
      <Button asChild>
        <Link href="/">Return home</Link>
      </Button>
    </div>
  );
}
