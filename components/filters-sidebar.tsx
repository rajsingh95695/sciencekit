import Link from "next/link";

import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { difficulties } from "@/constants/filters";

const productCollections = [
  { slug: "arduino", label: "Arduino" },
  { slug: "esp32", label: "ESP32" },
  { slug: "iot", label: "IoT" },
  { slug: "robotics", label: "Robotics" },
  { slug: "school-models", label: "School Models" },
  { slug: "college-projects", label: "College Projects" },
  { slug: "physics-models", label: "Physics Models" },
  { slug: "chemistry-models", label: "Chemistry Models" },
  { slug: "biology-models", label: "Biology Models" },
  { slug: "renewable-energy", label: "Renewable Energy" }
] as const;

export function FiltersSidebar({
  activeCategory,
  activeDifficulty
}: {
  activeCategory?: string;
  activeDifficulty?: string;
}) {
  return (
    <Card className="sticky top-24">
      <CardContent className="space-y-6 p-6">
        <div className="space-y-3">
          <CardTitle className="text-base">Difficulty</CardTitle>
          <div className="flex flex-wrap gap-2">
            {difficulties.map((difficulty) => (
              <Link
                key={difficulty}
                href={`/products?difficulty=${difficulty}`}
                className={`rounded-full px-3 py-2 text-sm ${
                  activeDifficulty === difficulty
                    ? "bg-[var(--primary)] text-[var(--primary-foreground)]"
                    : "bg-[var(--muted)] text-[var(--muted-foreground)]"
                }`}
              >
                {difficulty}
              </Link>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <CardTitle className="text-base">Collections</CardTitle>
          <div className="space-y-2 text-sm text-[var(--muted-foreground)]">
            {productCollections.map((category) => (
              <Link
                key={category.slug}
                href={`/products?category=${category.slug}`}
                className={`block rounded-2xl px-3 py-2 ${
                  activeCategory === category.slug ? "bg-[var(--secondary)] text-[var(--secondary-foreground)]" : "hover:bg-[var(--muted)]"
                }`}
              >
                {category.label}
              </Link>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
