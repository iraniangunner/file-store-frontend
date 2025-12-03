"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Chip } from "@heroui/react";

interface ActiveFiltersProps {
  category?: string;
  categorySlug: string;
  tag?: string;
  tagSlug: string;
  search: string;
  featured: boolean;
}

export default function ActiveFilters({
  category,
  categorySlug,
  tag,
  tagSlug,
  search,
  featured,
}: ActiveFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const removeFilter = (key: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete(key);
    params.delete("page"); // Reset pagination
    router.push(`/blog?${params.toString()}`);
  };

  return (
    <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-gray-100">
      <span className="text-sm text-gray-500">Active filters:</span>

      {categorySlug && category && (
        <Chip
          onClose={() => removeFilter("category")}
          variant="flat"
          color="primary"
        >
          {category}
        </Chip>
      )}

      {tagSlug && tag && (
        <Chip
          onClose={() => removeFilter("tag")}
          variant="flat"
          color="secondary"
        >
          #{tag}
        </Chip>
      )}

      {search && (
        <Chip
          onClose={() => removeFilter("search")}
          variant="flat"
          color="default"
        >
          Search: "{search}"
        </Chip>
      )}

      {featured && (
        <Chip
          onClose={() => removeFilter("featured")}
          variant="flat"
          color="warning"
        >
          Featured
        </Chip>
      )}
    </div>
  );
}
