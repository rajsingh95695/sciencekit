import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="page-shell py-12">
      <Skeleton className="mb-6 h-72 w-full rounded-[2rem]" />
      <div className="grid gap-6 md:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <Skeleton className="h-80 w-full rounded-[2rem]" key={index} />
        ))}
      </div>
    </div>
  );
}
