import Link from "next/link";

import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";

export function SiteFooter() {
  return (
    <footer className="mt-20 border-t border-white/20 py-12">
      <div className="page-shell space-y-8">
        <div className="mesh-card ambient-grid overflow-hidden rounded-[2rem] px-7 py-8 text-white md:px-10 md:py-10">
          <div className="relative z-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/70">Need a custom build?</p>
              <h2 className="max-w-2xl font-[var(--font-display)] text-3xl font-bold text-balance md:text-4xl">
                Get help with bulk orders, custom science models, and category-wise project sourcing.
              </h2>
              <p className="max-w-2xl text-sm text-white/80 md:text-base">
                Talk to ScienceKit for school, college, retail, coaching, lab, and exhibition supply requirements.
              </p>
            </div>
            <Button asChild variant="secondary" className="self-start">
              <Link href="/contact">
                Contact support
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
        <div className="grid gap-8 rounded-[2rem] border border-white/35 bg-white/60 px-6 py-8 shadow-[var(--shadow-soft)] md:grid-cols-4">
          <div className="space-y-3">
            <p className="font-[var(--font-display)] text-lg font-bold">{siteConfig.name}</p>
            <p className="text-sm text-[var(--muted-foreground)]">{siteConfig.description}</p>
          </div>
          <div>
            <p className="mb-3 font-semibold">Explore</p>
            <div className="space-y-2 text-sm text-[var(--muted-foreground)]">
              <Link className="block transition hover:text-[var(--primary)]" href="/products">
                Products
              </Link>
              <Link className="block transition hover:text-[var(--primary)]" href="/blog">
                Blog
              </Link>
              <Link className="block transition hover:text-[var(--primary)]" href="/faq">
                FAQ
              </Link>
            </div>
          </div>
          <div>
            <p className="mb-3 font-semibold">Support</p>
            <div className="space-y-2 text-sm text-[var(--muted-foreground)]">
              <Link className="block transition hover:text-[var(--primary)]" href="/contact">
                Contact
              </Link>
              <Link className="block transition hover:text-[var(--primary)]" href="/track-order">
                Track Order
              </Link>
              <Link className="block transition hover:text-[var(--primary)]" href="/orders">
                My Orders
              </Link>
            </div>
          </div>
          <div>
            <p className="mb-3 font-semibold">Need help?</p>
            <p className="text-sm text-[var(--muted-foreground)]">{siteConfig.email}</p>
            <p className="mt-2 text-sm text-[var(--muted-foreground)]">+91 {siteConfig.phone}</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
