"use client";

import { createContext, useContext, useCallback } from "react";

import { useLocalStorage } from "@/hooks/use-local-storage";

type RecentlyViewedContextValue = {
  ids: string[];
  trackProduct: (productId: string) => void;
};

const RecentlyViewedContext = createContext<RecentlyViewedContextValue | undefined>(undefined);

export function RecentlyViewedProvider({ children }: { children: React.ReactNode }) {
  const [ids, setIds] = useLocalStorage<string[]>("sciencekit-recently-viewed", []);

  const trackProduct = useCallback(
    (productId: string) => {
      setIds((current) => {
        const filtered = current.filter((id) => id !== productId);
        return [productId, ...filtered].slice(0, 12);
      });
    },
    [setIds]
  );

  return (
    <RecentlyViewedContext.Provider
      value={{
        ids,
        trackProduct
      }}
    >
      {children}
    </RecentlyViewedContext.Provider>
  );
}

export function useRecentlyViewed() {
  const context = useContext(RecentlyViewedContext);

  if (!context) {
    throw new Error("useRecentlyViewed must be used within RecentlyViewedProvider.");
  }

  return context;
}
