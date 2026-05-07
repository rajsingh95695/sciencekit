"use client";

import { createContext, useContext, useEffect, useState } from "react";

import * as authService from "@/services/auth-service";
import type { SessionUser } from "@/types";

type AuthUser = SessionUser & {
  phone?: string;
  addresses?: unknown[];
  wishlist?: unknown[];
  cart?: unknown[];
  saveForLater?: unknown[];
};

type AuthContextValue = {
  user: AuthUser | null;
  loading: boolean;
  refreshUser: () => Promise<void>;
  login: (payload: { email: string; password: string }) => Promise<void>;
  register: (payload: {
    name: string;
    email: string;
    phone?: string;
    password: string;
    confirmPassword: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = async () => {
    try {
      const response = await authService.getCurrentUser();

      if (response.user) {
        setUser(response.user as AuthUser);
      } else {
        const refreshed = await authService.refreshSession().catch(() => null);
        setUser((refreshed?.user as AuthUser | null) ?? null);
      }
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void refreshUser();
  }, []);

  const value: AuthContextValue = {
    user,
    loading,
    async refreshUser() {
      setLoading(true);
      await refreshUser();
    },
    async login(payload) {
      const response = await authService.login(payload);
      setUser(response.user as AuthUser);
    },
    async register(payload) {
      const response = await authService.register(payload);
      setUser(response.user as AuthUser);
    },
    async logout() {
      await authService.logout();
      setUser(null);
    }
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider.");
  }

  return context;
}
