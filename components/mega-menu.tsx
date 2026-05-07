import Link from "next/link";

import { featuredCollections } from "@/config/navigation";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";

export function MegaMenu() {
  return (
    <div className="absolute left-0 top-full hidden w-[720px] rounded-[1.75rem] border border-white/30 bg-[color-mix(in_srgb,var(--card)_92%,white_8%)] p-4 shadow-[0_30px_70px_rgba(7,18,37,0.16)] backdrop-blur-xl group-hover:block">
      <div className="grid gap-4 md:grid-cols-3">
        {featuredCollections.map((collection) => (
          <Link href={collection.href} key={collection.href}>
            <Card className="spotlight-card h-full border-transparent bg-[linear-gradient(180deg,rgba(255,255,255,0.95),rgba(242,247,255,0.92))] transition hover:-translate-y-1 hover:shadow-[0_24px_48px_rgba(7,18,37,0.12)]">
              <CardContent className="space-y-3 p-5">
                <CardTitle className="text-lg">{collection.title}</CardTitle>
                <CardDescription>{collection.description}</CardDescription>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
