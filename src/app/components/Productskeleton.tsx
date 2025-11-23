import { Card, Skeleton } from "@heroui/react";

interface ProductsSkeletonProps {
  viewMode: "grid" | "list";
  count?: number;
}

export function ProductsSkeleton({ viewMode, count = 6 }: ProductsSkeletonProps) {
  return (
    <div
      className={`grid gap-6 ${
        viewMode === "grid"
          ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
          : "grid-cols-1"
      }`}
    >
      {[...Array(count)].map((_, i) => (
        <Card key={i} className="rounded-2xl overflow-hidden">
          <Skeleton className="h-44" />
          <div className="p-4">
            <Skeleton className="h-5 w-3/4 mb-2" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        </Card>
      ))}
    </div>
  );
}
