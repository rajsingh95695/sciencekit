"use client";

import { SessionProvider } from "next-auth/react";
import { Toaster } from "sonner";

import { AuthProvider } from "@/components/providers/auth-provider";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { CartProvider } from "@/context/cart-context";
import { RecentlyViewedProvider } from "@/context/recently-viewed-context";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <SessionProvider>
        <AuthProvider>
          <RecentlyViewedProvider>
            <CartProvider>
              {children}
              <Toaster richColors position="top-right" />
            </CartProvider>
          </RecentlyViewedProvider>
        </AuthProvider>
      </SessionProvider>
    </ThemeProvider>
  );
}
