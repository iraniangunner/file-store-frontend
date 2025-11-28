"use client";

import { useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Card, CheckboxGroup, Checkbox, Slider, Button } from "@heroui/react";
import {
  ChevronDown,
  ChevronRight,
  Package,
  DollarSign,
  FileType,
} from "lucide-react";
import { CategoryApi } from "@/types";
import { collectCategoryIds } from "@/lib/category-helpers";
import { AnimatePresence, motion } from "framer-motion";

interface FilterSidebarProps {
  categories: CategoryApi[];
  priceRange: { min: number; max: number };
  fileTypes: any[];
  searchParams: {
    category_ids?: string;
    min_price?: string;
    max_price?: string;
    file_types?: string;
  };
}

export default function FilterSidebar({
  categories,
  priceRange: { min: minPrice, max: maxPrice },
  fileTypes,
  searchParams,
}: FilterSidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const currentSearchParams = useSearchParams();

  // Initialize selected categories from URL params
  const [selectedCategories, setSelectedCategories] = useState<string[]>(() => {
    const childIdsFromUrl =
      searchParams.category_ids?.split(",").filter(Boolean) || [];
    const selected: string[] = [];

    categories.forEach((parent) => {
      if (!parent.children_recursive?.length) return;
      const childIds = parent.children_recursive.map((c) => String(c.id));

      const allChildrenSelected = childIds.every((id) =>
        childIdsFromUrl.includes(id)
      );

      if (allChildrenSelected) {
        selected.push(String(parent.id));
      } else {
        selected.push(...childIdsFromUrl.filter((id) => childIds.includes(id)));
      }
    });

    const rootChilds = childIdsFromUrl.filter((id) => {
      return !categories.some((parent) =>
        parent.children_recursive?.some((c) => String(c.id) === id)
      );
    });
    selected.push(...rootChilds);

    return selected;
  });

  const [selectedFileTypes, setSelectedFileTypes] = useState<string[]>(
    searchParams.file_types?.split(",").filter(Boolean) || []
  );

  const [priceRangeValue, setPriceRangeValue] = useState<[number, number]>([
    searchParams.min_price ? Number(searchParams.min_price) : minPrice,
    searchParams.max_price ? Number(searchParams.max_price) : maxPrice,
  ]);

  const [expandedCategories, setExpandedCategories] = useState<
    Record<number, boolean>
  >(() => {
    const expanded: Record<number, boolean> = {};
    const walk = (nodes: CategoryApi[]) => {
      nodes.forEach((n) => {
        if (n.children_recursive?.length) {
          expanded[n.id] = true;
          walk(n.children_recursive);
        }
      });
    };
    walk(categories);
    return expanded;
  });

  const toggleExpanded = (id: number) => {
    setExpandedCategories((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const updateFilters = (updates: {
    categories?: string[];
    fileTypes?: string[];
    priceRange?: [number, number];
  }) => {
    const params = new URLSearchParams(currentSearchParams.toString());

    if (updates.categories !== undefined) {
      if (updates.categories.length) {
        const allIds = collectCategoryIds(categories, updates.categories);
        params.set("category_ids", allIds.join(","));
      } else {
        params.delete("category_ids");
      }
    }

    if (updates.fileTypes !== undefined) {
      if (updates.fileTypes.length) {
        params.set("file_types", updates.fileTypes.join(","));
      } else {
        params.delete("file_types");
      }
    }

    if (updates.priceRange) {
      if (updates.priceRange[0] > minPrice) {
        params.set("min_price", String(updates.priceRange[0]));
      } else {
        params.delete("min_price");
      }

      if (updates.priceRange[1] < maxPrice) {
        params.set("max_price", String(updates.priceRange[1]));
      } else {
        params.delete("max_price");
      }
    }

    params.delete("page");

    const newUrl = params.toString() ? `${pathname}?${params}` : pathname;
    router.push(newUrl);
  };

  const handleCategoryChange = (vals: string[]) => {
    let newSelected = vals as string[];

    categories.forEach((parent) => {
      if (!parent.children_recursive?.length) return;

      const parentId = String(parent.id);
      const childIds = parent.children_recursive.map((c) => String(c.id));

      const parentClicked =
        !selectedCategories.includes(parentId) &&
        newSelected.includes(parentId);

      if (parentClicked) {
        newSelected = newSelected.filter((id) => !childIds.includes(id));
      }

      const anyChildCheckedNow = childIds.some((id) =>
        newSelected.includes(id)
      );
      if (anyChildCheckedNow && newSelected.includes(parentId)) {
        newSelected = newSelected.filter((id) => id !== parentId);
      }
    });

    setSelectedCategories(newSelected);
    updateFilters({ categories: newSelected });
  };

  const handleFileTypeChange = (vals: string[]) => {
    setSelectedFileTypes(vals);
    updateFilters({ fileTypes: vals });
  };

  const handlePriceChange = (range: number | number[]) => {
    const newRange = Array.isArray(range)
      ? (range as [number, number])
      : [minPrice, range];
    setPriceRangeValue(newRange as [number, number]);
    updateFilters({ priceRange: newRange } as any);
  };

  const resetAll = () => {
    setSelectedCategories([]);
    setSelectedFileTypes([]);
    setPriceRangeValue([minPrice, maxPrice]);
    router.push(pathname);
  };

  const renderCategoryTree = (
    node: CategoryApi,
    isExpandedMap: Record<number, boolean>,
    toggleExpanded: (id: number) => void,
    level = 0
  ): React.ReactNode => {
    const hasChildren = (node.children_recursive || []).length > 0;
    const isExpanded = isExpandedMap[node.id];
    const isRoot = node.parent_id === null;

    return (
      <div key={node.id} className="mb-1">
        <div
          className="flex items-center justify-between cursor-pointer p-2 rounded-lg hover:bg-gray-50 transition"
          style={{ paddingLeft: `${level * 8}px` }}
          onClick={() => hasChildren && toggleExpanded(node.id)}
        >
          <div className="flex items-center gap-2">
            {isRoot ? (
              <span className="font-semibold text-sm">{node.name}</span>
            ) : (
              <Checkbox
                value={String(node.id)}
                onClick={(e) => e.stopPropagation()}
              >
                <span className="text-sm">{node.name}</span>
              </Checkbox>
            )}
          </div>

          <div className="flex items-center">
            {hasChildren ? (
              <motion.div
                animate={{ rotate: isExpanded ? 90 : 0 }}
                transition={{ duration: 0.25 }}
              >
                <ChevronRight className="w-4 h-4 text-blue-600" />
              </motion.div>
            ) : (
              <div className="w-4" />
            )}
          </div>
        </div>

        <AnimatePresence initial={false}>
          {isExpanded && hasChildren && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="pl-4 border-l border-gray-200 overflow-hidden"
            >
              <div className="mt-2">
                {(node.children_recursive || []).map((child) =>
                  renderCategoryTree(
                    child,
                    isExpandedMap,
                    toggleExpanded,
                    level + 1
                  )
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  // Filter only root categories (parent_id === null)
  const rootCategories = categories.filter((c) => c.parent_id === null);

  return (
    <aside className="w-full lg:w-72 space-y-4">
      <Card className="p-4 lrounded-2xl shadow-sm sticky top-20">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold text-lg">Filters</h3>
          <Button size="sm" variant="light" color="primary" onPress={resetAll}>
            Reset All
          </Button>
        </div>

        {/* Categories */}
        <div className="mb-6">
          <h4 className="font-medium mb-3 flex items-center gap-2 text-sm">
            <Package className="w-4 h-4 text-primary" />
            Categories
          </h4>
          <CheckboxGroup
            value={selectedCategories}
            onChange={handleCategoryChange}
          >
            <div className="max-h-80 overflow-y-auto pr-2 space-y-1">
              {rootCategories.map((cat) =>
                renderCategoryTree(cat, expandedCategories, toggleExpanded)
              )}
            </div>
          </CheckboxGroup>
        </div>

        {/* Price Range */}
        <div className="mb-6">
          <h4 className="font-medium mb-3 flex items-center gap-2 text-sm">
            <DollarSign className="w-4 h-4 text-primary" />
            Price Range
          </h4>
          <Slider
            value={priceRangeValue}
            onChange={handlePriceChange}
            minValue={minPrice}
            maxValue={maxPrice}
            step={1}
            formatOptions={{ style: "currency", currency: "USD" }}
            className="max-w-full"
          />
          <div className="flex justify-between text-xs text-default-500 mt-2">
            <span>${priceRangeValue[0]}</span>
            <span>${priceRangeValue[1]}</span>
          </div>
        </div>

        {/* File Types */}
        <div>
          <h4 className="font-medium mb-3 flex items-center gap-2 text-sm">
            <FileType className="w-4 h-4 text-primary" />
            File Types
          </h4>
          <CheckboxGroup
            value={selectedFileTypes}
            onChange={handleFileTypeChange}
          >
            <div className="space-y-2 flex flex-col">
              {fileTypes.map((type: any) => (
                <Checkbox key={type.type} value={type.type}>
                  <span>{type.type.toUpperCase()}</span>
                </Checkbox>
              ))}
            </div>
          </CheckboxGroup>
        </div>
      </Card>
    </aside>
  );
}


