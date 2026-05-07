"use client";

import Image from "next/image";
import type { Route } from "next";
import Link from "next/link";
import useEmblaCarousel from "embla-carousel-react";
import { ArrowRight, Sparkles } from "lucide-react";
import { useEffect } from "react";

import { Button } from "@/components/ui/button";

export function HeroCarousel({
  banners
}: {
  banners: Array<{ _id?: string; title: string; subtitle?: string; image?: string; link: string }>;
}) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "start" });

  useEffect(() => {
    if (!emblaApi) {
      return;
    }

    const interval = window.setInterval(() => {
      emblaApi.scrollNext();
    }, 5000);

    return () => {
      window.clearInterval(interval);
    };
  }, [emblaApi]);

  return (
    <div className="overflow-hidden" ref={emblaRef}>
      <div className="flex">
        {banners.map((banner, index) => (
          <section className="min-w-0 flex-[0_0_100%] pr-4" key={banner._id || index}>
            <div className="mesh-card ambient-grid relative overflow-hidden rounded-[2rem] p-8 text-white md:p-12">
              <div className="absolute inset-y-0 right-0 hidden w-[46%] lg:block">
                {banner.image ? (
                  <Image
                    src={banner.image}
                    alt={banner.title}
                    fill
                    sizes="40vw"
                    className="object-cover opacity-35 mix-blend-screen"
                  />
                ) : (
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.24),transparent_26%),radial-gradient(circle_at_72%_55%,rgba(255,181,102,0.38),transparent_24%),radial-gradient(circle_at_50%_85%,rgba(43,198,209,0.34),transparent_22%)]" />
                )}
                <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(6,39,68,0)_0%,rgba(6,39,68,0.12)_24%,rgba(6,39,68,0.55)_100%)]" />
              </div>
              <div className="relative z-10 grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
                <div className="max-w-2xl space-y-6">
                  <div className="flex flex-wrap gap-3">
                    <span className="hero-chip text-sm font-semibold">
                      <Sparkles className="h-4 w-4" />
                      Ready-to-ship catalog
                    </span>
                    <span className="hero-chip text-sm">Bulk supply for schools, colleges, labs, and resellers</span>
                  </div>
                  <div className="space-y-5">
                    <p className="text-sm uppercase tracking-[0.24em] text-white/70">Featured Build</p>
                    <h1 className="font-[var(--font-display)] text-4xl font-bold text-balance md:text-6xl">
                      {banner.title}
                    </h1>
                    <p className="max-w-xl text-base leading-7 text-white/82 md:text-lg">
                      {banner.subtitle ||
                        "Browse ready science projects, electronics kits, robotics builds, and academic models with tested hardware and dispatch-ready stock."}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <Button asChild variant="secondary">
                      <Link href={banner.link as Route}>
                        Explore project kits
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button
                      asChild
                      variant="outline"
                      className="border-white/20 bg-white/10 text-white hover:bg-white/18 hover:text-white"
                    >
                      <Link href="/contact">Plan a custom order</Link>
                    </Button>
                  </div>
                  <div className="grid gap-3 pt-2 sm:grid-cols-3">
                    {[
                      ["10k+", "Projects listed"],
                      ["QA", "Quality checked"],
                      ["Bulk", "Institution orders"]
                    ].map(([value, label]) => (
                      <div
                        key={label}
                        className="rounded-[1.35rem] border border-white/14 bg-white/10 px-4 py-4 backdrop-blur-sm"
                      >
                        <p className="font-[var(--font-display)] text-2xl font-bold">{value}</p>
                        <p className="mt-1 text-sm text-white/72">{label}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="hidden lg:flex lg:justify-end">
                  <div className="w-full max-w-md space-y-4">
                    {[
                      "Arduino, ESP32, robotics, IoT, and science model categories",
                      "Single-vendor support from inquiry to dispatch and repeat supply",
                      "Search-ready catalog built for retail, academic, and institutional buyers"
                    ].map((line) => (
                      <div
                        key={line}
                        className="rounded-[1.4rem] border border-white/14 bg-white/10 px-5 py-4 text-sm leading-6 text-white/82 backdrop-blur-sm"
                      >
                        {line}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
