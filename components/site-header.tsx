"use client";

import Link from "next/link";
import { Atom, Heart, LayoutDashboard, Menu, ShoppingCart, User } from "lucide-react";
import { useState } from "react";

import { useAuth } from "@/components/providers/auth-provider";
import { MegaMenu } from "@/components/mega-menu";
import { SearchBar } from "@/components/search-bar";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { mainNavigation } from "@/config/navigation";
import { useCart } from "@/context/cart-context";

export function SiteHeader() {
  const { count } = useCart();
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-white/20 bg-[color-mix(in_srgb,var(--background)_82%,transparent)] backdrop-blur-xl">
      <div className="border-b border-white/20 bg-[linear-gradient(90deg,rgba(10,107,117,0.96),rgba(12,51,99,0.94),rgba(255,154,61,0.92))] text-white">
        <div className="page-shell flex min-h-11 items-center justify-between gap-4 text-xs font-semibold">
          <p className="truncate tracking-[0.16em] text-white/90 uppercase">
            Readymade science projects, electronics kits, robotics models, and bulk supply support
          </p>
          <Link href="/contact" className="hidden rounded-full border border-white/20 px-3 py-1 text-white/90 hover:bg-white/10 md:inline-flex">
            Contact for wholesale and custom orders
          </Link>
        </div>
      </div>
      <div className="page-shell">
        <div className="flex min-h-20 items-center gap-4">
          <Link href="/" className="shrink-0 group">
            <div className="flex items-center gap-3">
              <div className="relative flex h-11 w-11 items-center justify-center overflow-hidden rounded-2xl bg-[linear-gradient(135deg,var(--primary),var(--color-sky),var(--accent))] text-white shadow-[0_8px_30px_rgba(10,107,117,0.3)] transition-all duration-500 group-hover:shadow-[0_8px_30px_rgba(255,154,61,0.4)] group-hover:scale-105">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+PGNpcmNsZSBjeD0iMTAiIGN5PSIxMCIgcj0iMiIgZmlsbD0id2hpdGUiIG9wYWNpdHk9IjAuMiIvPjwvc3ZnPg==')] opacity-30 mix-blend-overlay"></div>
                <Atom className="relative z-10 h-6 w-6 transition-transform duration-700 group-hover:rotate-180" />
              </div>
              <div className="flex flex-col">
                <span className="bg-gradient-to-r from-[var(--primary)] to-[var(--color-sky)] bg-clip-text font-[var(--font-display)] text-xl font-extrabold tracking-tight text-transparent drop-shadow-sm sm:text-2xl">
                  ScienceKit
                </span>
                <span className="text-[9px] font-bold uppercase tracking-[0.25em] text-[var(--muted-foreground)] sm:text-[10px] sm:tracking-[0.3em]">
                  Projects &bull; Models
                </span>
              </div>
            </div>
          </Link>

          <div className="hidden flex-1 lg:block">
            <SearchBar />
          </div>

          <nav className="hidden items-center gap-6 lg:flex">
            <div className="group relative">
              <button className="rounded-full px-3 py-2 text-sm font-semibold transition hover:bg-white/70">
                Discover
              </button>
              <MegaMenu />
            </div>
            {mainNavigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-full px-3 py-2 text-sm font-semibold transition hover:bg-white/70 hover:text-[var(--primary)]"
              >
                {item.title}
              </Link>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-1">
            <ThemeToggle />
            <Link href="/wishlist">
              <Button variant="ghost" size="icon" aria-label="Wishlist">
                <Heart className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/cart">
              <Button variant="ghost" size="icon" aria-label="Cart" className="relative">
                <ShoppingCart className="h-4 w-4" />
                {count ? (
                  <span className="absolute -right-1 -top-1 grid h-5 w-5 place-items-center rounded-full bg-[var(--accent)] text-[10px] font-bold text-[var(--accent-foreground)]">
                    {count}
                  </span>
                ) : null}
              </Button>
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Account">
                  <User className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {user ? (
                  <>
                    <DropdownMenuItem asChild>
                      <Link href="/orders">My Orders</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/wishlist">Wishlist</Link>
                    </DropdownMenuItem>
                    {user.role === "admin" ? (
                      <DropdownMenuItem asChild>
                        <Link href="/admin">
                          <LayoutDashboard className="mr-2 h-4 w-4" />
                          Admin Panel
                        </Link>
                      </DropdownMenuItem>
                    ) : null}
                    <DropdownMenuItem
                      onClick={() => {
                        void logout();
                      }}
                    >
                      Logout
                    </DropdownMenuItem>
                  </>
                ) : (
                  <>
                    <DropdownMenuItem asChild>
                      <Link href="/login">Login</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/register">Create account</Link>
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
            <Dialog open={mobileOpen} onOpenChange={setMobileOpen}>
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open menu">
                  <Menu className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-sm">
                <DialogTitle className="sr-only">Mobile navigation</DialogTitle>
                <DialogDescription className="sr-only">
                  Browse the main navigation links and search from the mobile menu.
                </DialogDescription>
                <div className="space-y-4">
                  <SearchBar />
                  {mainNavigation.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="block rounded-2xl px-4 py-3 font-semibold hover:bg-[var(--muted)]"
                      onClick={() => setMobileOpen(false)}
                    >
                      {item.title}
                    </Link>
                  ))}
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
    </header>
  );
}
