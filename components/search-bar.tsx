"use client";

import Image from "next/image";
import Link from "next/link";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";

import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/use-debounce";
import { fetchProductSuggestions } from "@/services/product-service";

export function SearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Array<Record<string, any>>>([]);
  const [open, setOpen] = useState(false);
  const debouncedQuery = useDebounce(query, 250);

  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setResults([]);
      return;
    }

    let active = true;

    fetchProductSuggestions(debouncedQuery)
      .then((response) => {
        if (active) {
          setResults(response);
        }
      })
      .catch(() => {
        if (active) {
          setResults([]);
        }
      });

    return () => {
      active = false;
    };
  }, [debouncedQuery]);

  return (
    <div className="relative w-full max-w-xl">
      <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted-foreground)]" />
      <Input
        value={query}
        onChange={(event) => {
          setQuery(event.target.value);
          setOpen(true);
        }}
        onBlur={() => {
          window.setTimeout(() => setOpen(false), 150);
        }}
        onFocus={() => setOpen(true)}
        placeholder="Search Arduino, IoT, robotics, sensors..."
        className="pl-11"
      />
      {open && results.length > 0 ? (
        <div className="absolute top-full z-40 mt-2 w-full rounded-[1.5rem] border border-[var(--border)] bg-[var(--card)] p-2 shadow-[var(--shadow-soft)]">
          {results.map((result) => (
            <Link
              key={result.slug}
              href={`/products/${result.slug}`}
              className="flex items-center justify-between gap-3 rounded-2xl px-3 py-3 text-sm hover:bg-[var(--muted)]"
            >
              <div className="flex items-center gap-3">
                <div className="relative h-12 w-12 overflow-hidden rounded-2xl bg-[var(--muted)]">
                  {typeof result.images?.[0]?.url === "string" ? (
                    <Image src={result.images[0].url} alt={String(result.name)} fill sizes="48px" className="object-cover" />
                  ) : null}
                </div>
                <div>
                  <p className="font-semibold">{result.name}</p>
                  <p className="text-xs text-[var(--muted-foreground)]">
                    {result.category}
                    {result.subcategory ? ` • ${result.subcategory}` : ""}
                  </p>
                </div>
              </div>
              <span className="text-xs text-[var(--muted-foreground)]">
                {typeof result.discountPrice === "number"
                  ? `₹${result.discountPrice}`
                  : typeof result.price === "number"
                    ? `₹${result.price}`
                    : "View"}
              </span>
            </Link>
          ))}
          <Link
            href={`/search?q=${encodeURIComponent(query)}`}
            className="mt-1 block rounded-2xl px-3 py-3 text-sm font-semibold text-[var(--primary)] hover:bg-[var(--muted)]"
          >
            See all matching products for "{query}"
          </Link>
        </div>
      ) : null}
    </div>
  );
}
