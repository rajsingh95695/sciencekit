import Link from "next/link";
import { ArrowRight, BadgeCheck, Cpu, Rocket, ShieldCheck, Sparkles, Truck } from "lucide-react";

import { HeroCarousel } from "@/components/hero-carousel";
import { ProductCarousel } from "@/components/product-carousel";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { siteConfig } from "@/config/site";
import { connectToDB } from "@/lib/db";
import { getHomePageData } from "@/lib/data";

export default async function HomePage() {
  let data = {
    featuredProducts: [] as Array<Record<string, any>>,
    trendingProducts: [] as Array<Record<string, any>>,
    banners: [] as Array<Record<string, any>>,
    blogPosts: [] as Array<Record<string, any>>,
    faqs: [] as Array<Record<string, any>>,
    categories: [] as Array<Record<string, any>>
  };

  try {
    await connectToDB();
    data = await getHomePageData();
  } catch {
    // Render empty states when the database is not configured yet.
  }

  const heroBanners =
    (data.banners.length > 0
      ? data.banners
      : [
          {
            title: "Science projects, electronics kits, and working models ready to order",
            subtitle:
              "Explore categorized science projects, Arduino kits, ESP32 models, robotics systems, and readymade academic builds for schools, colleges, resellers, and exhibitions.",
            link: "/products"
          }
        ]
    ).map((banner) => ({
      _id: typeof banner._id === "string" ? banner._id : undefined,
      title: typeof banner.title === "string" ? banner.title : "Featured ScienceKit launch",
      subtitle: typeof banner.subtitle === "string" ? banner.subtitle : undefined,
      image: typeof banner.image === "string" ? banner.image : undefined,
      link: typeof banner.link === "string" ? banner.link : "/products"
    }));
  const categories =
    data.categories.length > 0
      ? data.categories
      : [
          { name: "Arduino", slug: "arduino" },
          { name: "ESP32", slug: "esp32" },
          { name: "IoT", slug: "iot" },
          { name: "Robotics", slug: "robotics" }
        ];
  const blogPosts =
    data.blogPosts.length > 0
      ? data.blogPosts
      : [
          {
            slug: "choose-final-year-electronics-project",
            title: "How to choose the right science or electronics project for your requirement",
            excerpt: "A practical guide to selecting the right project category, budget, and difficulty level."
          }
        ];
  const faqs =
    data.faqs.length > 0
      ? data.faqs
      : [
          {
            _id: "delivery",
            question: "Do the kits come assembled?",
            answer: "Yes. ScienceKit focuses on readymade and dispatch-ready science and electronics projects."
          },
          {
            _id: "custom",
            question: "Can I request custom changes?",
            answer: "Yes. Use the contact page for modifications or bulk institution orders."
          }
        ];
  const trustSignals = [
    {
      icon: BadgeCheck,
      label: "10,000+ projects listed",
      detail: "A large searchable catalog across science models, electronics kits, and category-specific builds."
    },
    {
      icon: Truck,
      label: "Fast dispatch flow",
      detail: "Single-vendor coordination keeps communication clear for retail and bulk orders."
    },
    {
      icon: ShieldCheck,
      label: "Tested before packing",
      detail: "Products are listed with practical descriptions, category structure, and quality-focused presentation."
    },
    {
      icon: Cpu,
      label: "Modern project mix",
      detail: "Arduino, ESP32, IoT, automation, and robotics in one storefront."
    }
  ];
  const categoryStyles = [
    "from-[#0f7d8a] via-[#125f83] to-[#103b69]",
    "from-[#ff9a3d] via-[#ffb458] to-[#ff7d54]",
    "from-[#3a7bff] via-[#5c92ff] to-[#8768ff]",
    "from-[#2e9f6b] via-[#59c27d] to-[#90d95d]"
  ];
  const whyScienceKit = [
    {
      icon: Sparkles,
      title: "Storefront-first catalog",
      description: "Built to help customers browse, compare, and buy projects quickly."
    },
    {
      icon: Rocket,
      title: "Faster project selection",
      description: "Category-wise browsing and search suggestions reduce confusion for customers."
    },
    {
      icon: BadgeCheck,
      title: "Single point of support",
      description: "One business, one catalog, one support channel for product and order queries."
    }
  ];

  return (
    <div className="space-y-20 pb-12 pt-8">
      <section className="page-shell">
        <HeroCarousel banners={heroBanners} />
      </section>

      <section className="page-shell grid gap-4 lg:grid-cols-4">
        {trustSignals.map((item) => (
          <Card
            key={item.label}
            className="spotlight-card border-white/30 bg-[linear-gradient(180deg,rgba(255,255,255,0.95),rgba(244,248,255,0.92))] hover:-translate-y-1"
          >
            <CardContent className="space-y-4 p-6">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[linear-gradient(135deg,var(--primary),var(--color-sky),var(--accent))] text-white shadow-[0_18px_30px_rgba(10,107,117,0.18)]">
                <item.icon className="h-5 w-5" />
              </div>
              <div className="space-y-2">
                <CardTitle className="text-xl">{item.label}</CardTitle>
                <CardDescription className="text-sm leading-6">{item.detail}</CardDescription>
              </div>
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="page-shell grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <Card className="mesh-card ambient-grid overflow-hidden text-white">
          <CardContent className="relative z-10 space-y-6 p-8 md:p-10">
            <div className="space-y-3">
              <p className="text-sm uppercase tracking-[0.24em] text-white/70">Shop by category</p>
              <h2 className="font-[var(--font-display)] text-4xl font-bold text-balance">
                Find science projects and electronics models through a categorized storefront.
              </h2>
              <p className="max-w-2xl text-white/82">
                Browse product families for Arduino, IoT, robotics, school models, college projects, and science experiments.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button asChild variant="secondary">
                <Link href="/products">
                  View all kits
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="border-white/20 bg-white/10 text-white hover:bg-white/18 hover:text-white"
              >
                <Link href="/contact">Get a recommendation</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
        <div className="grid gap-4 sm:grid-cols-2">
          {categories.slice(0, 4).map((category, index) => (
            <Link key={category.slug} href={`/category/${category.slug}`}>
              <Card
                className={`spotlight-card h-full overflow-hidden border-0 bg-gradient-to-br ${categoryStyles[index % categoryStyles.length]} text-white hover:-translate-y-1.5 hover:shadow-[0_24px_50px_rgba(7,18,37,0.16)]`}
              >
                <CardContent className="relative flex h-full flex-col justify-between gap-8 p-6">
                  <div className="space-y-3">
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/70">Category</p>
                    <CardTitle className="text-2xl text-white">{category.name}</CardTitle>
                    <CardDescription className="max-w-xs text-white/80">
                      Explore category-wise products with searchable titles, descriptions, and structured listings.
                    </CardDescription>
                  </div>
                  <div className="inline-flex items-center gap-2 text-sm font-semibold text-white">
                    Explore {category.name}
                    <ArrowRight className="h-4 w-4" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      <section className="page-shell space-y-6">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-[var(--muted-foreground)]">Featured</p>
            <h2 className="font-[var(--font-display)] text-3xl font-bold">Best selling project kits</h2>
          </div>
          <Button asChild variant="outline">
            <Link href="/products">Browse all</Link>
          </Button>
        </div>
        <ProductCarousel products={data.featuredProducts} />
      </section>

      <section className="page-shell space-y-6">
        <div>
          <p className="text-sm uppercase tracking-[0.24em] text-[var(--muted-foreground)]">Trending</p>
          <h2 className="font-[var(--font-display)] text-3xl font-bold">Popular now in labs and exhibitions</h2>
        </div>
        <ProductCarousel products={data.trendingProducts} />
      </section>

      <section className="page-shell grid gap-6 md:grid-cols-3">
        {whyScienceKit.map((item) => (
          <Card
            key={item.title}
            className="spotlight-card overflow-hidden border-white/35 bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(241,246,255,0.92))]"
          >
            <CardContent className="space-y-4 p-7">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[linear-gradient(135deg,var(--primary),var(--accent))] text-white">
                <item.icon className="h-5 w-5" />
              </div>
              <div className="space-y-2">
                <CardTitle>{item.title}</CardTitle>
                <CardDescription className="leading-6">{item.description}</CardDescription>
              </div>
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="page-shell grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
        <Card className="mesh-card ambient-grid overflow-hidden text-white">
          <CardContent className="space-y-5 p-8 md:p-10">
            <p className="text-sm uppercase tracking-[0.24em] text-white/70">For Institutions</p>
            <h2 className="font-[var(--font-display)] text-4xl font-bold">
              Bulk project supply and category-based sourcing support
            </h2>
            <p className="max-w-2xl text-white/80">
              Need 20 smart irrigation systems, 100 school science models, or a full batch of electronics kits?
              ScienceKit can support repeat orders, category-wise supply, and custom bulk requirements from one place.
            </p>
            <Button asChild variant="secondary">
              <Link href="/contact">Talk to us</Link>
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="space-y-4 p-8">
            <p className="text-sm uppercase tracking-[0.24em] text-[var(--muted-foreground)]">SEO Growth</p>
            <h3 className="font-[var(--font-display)] text-2xl font-bold">Latest from the blog</h3>
            <div className="space-y-4">
              {blogPosts.map((post) => (
                <Link key={post.slug} href={`/blog/${post.slug}`} className="block rounded-3xl p-4 hover:bg-[var(--muted)]">
                  <p className="font-semibold">{post.title}</p>
                  <p className="mt-2 text-sm text-[var(--muted-foreground)]">{post.excerpt}</p>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="page-shell space-y-6">
        <div>
          <p className="text-sm uppercase tracking-[0.24em] text-[var(--muted-foreground)]">Need Help?</p>
          <h2 className="font-[var(--font-display)] text-3xl font-bold">Frequently asked before buying</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {faqs.map((faq) => (
            <Card key={faq._id}>
              <CardContent className="space-y-3 p-6">
                <CardTitle className="text-xl">{faq.question}</CardTitle>
                <CardDescription>{faq.answer}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="page-shell">
        <Card className="spotlight-card overflow-hidden border-white/35 bg-[linear-gradient(120deg,rgba(255,255,255,0.94),rgba(236,246,255,0.96),rgba(255,245,235,0.98))]">
          <CardContent className="flex flex-col gap-6 p-8 md:flex-row md:items-center md:justify-between">
            <div className="space-y-2">
              <p className="text-sm uppercase tracking-[0.24em] text-[var(--muted-foreground)]">Support</p>
              <h2 className="font-[var(--font-display)] text-3xl font-bold">
                Questions about a specific project? <span className="gradient-text">We can help you choose the right category.</span>
              </h2>
              <p className="text-[var(--muted-foreground)]">{siteConfig.email}</p>
              <p className="text-[var(--muted-foreground)]">+91 {siteConfig.phone}</p>
            </div>
            <Button asChild>
              <Link href="/contact">Get expert guidance</Link>
            </Button>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
