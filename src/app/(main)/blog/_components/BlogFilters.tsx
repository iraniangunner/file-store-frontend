"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Select, SelectItem, Button } from "@heroui/react";
import { Folder, Tag, Star, Filter } from "lucide-react";
import { useState } from "react";

interface Category {
  id: number;
  name: string;
  slug: string;
  color: string;
  posts_count?: number;
}

interface BlogTag {
  id: number;
  name: string;
  slug: string;
  posts_count?: number;
}

interface BlogFiltersProps {
  categories: Category[];
  tags: BlogTag[];
  currentCategory: string;
  currentTag: string;
  currentFeatured: boolean;
}

export default function BlogFilters({
  categories,
  tags,
  currentCategory,
  currentTag,
  currentFeatured,
}: BlogFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const updateFilter = (key: string, value: string | boolean) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value && value !== "") {
      if (typeof value === "boolean") {
        params.set(key, "true");
      } else {
        params.set(key, value);
      }
    } else {
      params.delete(key);
    }

    // Reset to page 1 when filtering
    params.delete("page");

    router.push(`/blog?${params.toString()}`);
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateFilter("category", e.target.value);
  };

  const handleTagChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateFilter("tag", e.target.value);
  };

  const toggleFeatured = () => {
    updateFilter("featured", !currentFeatured);
  };

  return (
    <>
      {/* Mobile Filter Toggle */}
      <Button
        variant="flat"
        className="h-12 sm:hidden mb-4 w-full"
        onPress={() => setShowMobileFilters(!showMobileFilters)}
        startContent={<Filter className="w-4 h-4" />}
      >
        {showMobileFilters ? "Hide Filters" : "Show Filters"}
      </Button>

      {/* Filter Options */}
      <div
        className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 ${
          showMobileFilters ? "block" : "hidden sm:grid"
        }`}
      >
        {/* Category Filter */}
        <Select
          label="Category"
          placeholder="All Categories"
          selectedKeys={currentCategory ? [currentCategory] : []}
          onChange={handleCategoryChange}
          startContent={<Folder className="w-4 h-4 text-gray-400" />}
          classNames={{
            trigger: "h-14",
          }}
        >
          {categories.map((cat) => (
            <SelectItem key={cat.slug} textValue={cat.name}>
              <div className="flex items-center justify-between">
                <span>{cat.name}</span>
                {cat.posts_count !== undefined && (
                  <span className="text-xs text-gray-400">
                    ({cat.posts_count})
                  </span>
                )}
              </div>
            </SelectItem>
          ))}
        </Select>

        {/* Tag Filter */}
        <Select
          label="Tag"
          placeholder="All Tags"
          selectedKeys={currentTag ? [currentTag] : []}
          onChange={handleTagChange}
          startContent={<Tag className="w-4 h-4 text-gray-400" />}
          classNames={{
            trigger: "h-14",
          }}
        >
          {tags.map((tag) => (
            <SelectItem key={tag.slug} textValue={tag.name}>
              <div className="flex items-center justify-between">
                <span>{tag.name}</span>
                {tag.posts_count !== undefined && (
                  <span className="text-xs text-gray-400">
                    ({tag.posts_count})
                  </span>
                )}
              </div>
            </SelectItem>
          ))}
        </Select>

        {/* Featured Filter */}
        <Button
          variant={currentFeatured ? "solid" : "flat"}
          color={currentFeatured ? "warning" : "default"}
          className="h-14"
          onPress={toggleFeatured}
          startContent={
            <Star
              className={`w-4 h-4 ${currentFeatured ? "fill-white" : ""}`}
            />
          }
        >
          Featured Only
        </Button>

        {/* Clear All - Shows when any filter active */}
        {(currentCategory || currentTag || currentFeatured) && (
          <Button
            variant="flat"
            color="danger"
            className="h-14"
            onPress={() => router.push("/blog")}
          >
            Clear All Filters
          </Button>
        )}
      </div>
    </>
  );
}
