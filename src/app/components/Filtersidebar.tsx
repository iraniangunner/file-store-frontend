
"use client";

import { useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import {
  ChevronRight,
  Package,
  DollarSign,
  FileType,
  RotateCcw,
  Filter,
  X,
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
  isMobileOpen?: boolean;
  onMobileClose?: () => void;
}

export default function FilterSidebar({
  categories,
  priceRange: { min: minPrice, max: maxPrice },
  fileTypes,
  searchParams,
  isMobileOpen = false,
  onMobileClose,
}: FilterSidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const currentSearchParams = useSearchParams();
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

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

  const handleCategoryChange = (categoryId: string, checked: boolean) => {
    let newSelected = checked
      ? [...selectedCategories, categoryId]
      : selectedCategories.filter((id) => id !== categoryId);

    categories.forEach((parent) => {
      if (!parent.children_recursive?.length) return;

      const parentId = String(parent.id);
      const childIds = parent.children_recursive.map((c) => String(c.id));

      const parentClicked = categoryId === parentId && checked;

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

  const handleFileTypeChange = (fileType: string, checked: boolean) => {
    const newSelected = checked
      ? [...selectedFileTypes, fileType]
      : selectedFileTypes.filter((t) => t !== fileType);

    setSelectedFileTypes(newSelected);
    updateFilters({ fileTypes: newSelected });
  };

  const handlePriceChange = (index: number, value: number) => {
    const newRange: [number, number] = [...priceRangeValue] as [number, number];
    newRange[index] = value;

    if (index === 0 && newRange[0] > newRange[1]) {
      newRange[0] = newRange[1];
    }
    if (index === 1 && newRange[1] < newRange[0]) {
      newRange[1] = newRange[0];
    }

    setPriceRangeValue(newRange);
    updateFilters({ priceRange: newRange });
  };

  const resetAll = () => {
    setSelectedCategories([]);
    setSelectedFileTypes([]);
    setPriceRangeValue([minPrice, maxPrice]);
    router.push(pathname);
  };

  const handleMobileClose = () => {
    setIsMobileFilterOpen(false);
    if (onMobileClose) {
      onMobileClose();
    }
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
    const nodeId = String(node.id);
    const isChecked = selectedCategories.includes(nodeId);

    return (
      <div key={node.id} className="mb-1">
        <div
          className="flex items-center justify-between cursor-pointer p-2 rounded-lg hover:bg-gray-50 transition-colors"
          style={{ paddingLeft: `${level * 8}px` }}
          onClick={() => hasChildren && toggleExpanded(node.id)}
        >
          <div className="flex items-center gap-2 flex-1 min-w-0">
            {isRoot ? (
              <span className="font-semibold text-sm text-gray-900 truncate">
                {node.name}
              </span>
            ) : (
              <label
                className="flex items-center gap-2.5 cursor-pointer flex-1 group min-w-0"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="relative flex items-center justify-center flex-shrink-0">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={(e) =>
                      handleCategoryChange(nodeId, e.target.checked)
                    }
                    className="peer sr-only"
                  />
                  <div className="w-4 h-4 border-2 border-gray-300 rounded bg-white peer-checked:bg-blue-600 peer-checked:border-blue-600 transition-all duration-200 flex items-center justify-center group-hover:border-blue-400">
                    {isChecked && (
                      <svg
                        className="w-3 h-3 text-white"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2.5"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path d="M5 13l4 4L19 7"></path>
                      </svg>
                    )}
                  </div>
                </div>
                <span className="text-sm text-gray-700 select-none group-hover:text-gray-900 truncate">
                  {node.name}
                </span>
              </label>
            )}
          </div>

          <div className="flex items-center ml-2 flex-shrink-0">
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

  const rootCategories = categories.filter((c) => c.parent_id === null);

  // Calculate active filter count
  const activeFilterCount = 
    selectedCategories.length + 
    selectedFileTypes.length + 
    (priceRangeValue[0] !== minPrice || priceRangeValue[1] !== maxPrice ? 1 : 0);

  const pricePercentMin =
    ((priceRangeValue[0] - minPrice) / (maxPrice - minPrice)) * 100;
  const pricePercentMax =
    ((priceRangeValue[1] - minPrice) / (maxPrice - minPrice)) * 100;

  const filterContent = (
    <div className="p-4 sm:p-6">
      <div className="flex justify-between items-center mb-4 sm:mb-6">
        <h3 className="font-semibold flex items-center gap-2 text-lg text-gray-900">
          <Filter className="w-5 h-5 text-primary" /> Filters
        </h3>
        <div className="flex items-center gap-2">
          <button
            onClick={resetAll}
            className="px-3 py-1.5 text-sm flex justify-center items-center font-medium cursor-pointer text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            <span className="ml-1">Reset</span>
          </button>
          <button
            onClick={handleMobileClose}
            className="lg:hidden p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Close filters"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Categories */}
      <div className="mb-6">
        <h4 className="font-medium mb-3 flex items-center gap-2 text-sm text-gray-900">
          <Package className="w-4 h-4 text-blue-600" />
          Categories
        </h4>
        <div className="max-h-60 sm:max-h-80 overflow-y-auto pr-2 space-y-1">
          {rootCategories.map((cat) =>
            renderCategoryTree(cat, expandedCategories, toggleExpanded)
          )}
        </div>
      </div>

      {/* Price Range */}
      <div className="mb-6">
        <h4 className="font-medium mb-3 flex items-center gap-2 text-sm text-gray-900">
          <DollarSign className="w-4 h-4 text-blue-600" />
          Price Range
        </h4>
        <div className="relative pt-1 pb-4">
          <div className="relative h-2 bg-gray-200 rounded-full">
            <div
              className="absolute h-2 bg-blue-600 rounded-full"
              style={{
                left: `${pricePercentMin}%`,
                right: `${100 - pricePercentMax}%`,
              }}
            />
          </div>
          <input
            type="range"
            min={minPrice}
            max={maxPrice}
            value={priceRangeValue[0]}
            onChange={(e) => handlePriceChange(0, Number(e.target.value))}
            className="absolute w-full h-2 top-1 appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-blue-600 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:hover:scale-110 [&::-webkit-slider-thumb]:transition-transform [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-blue-600 [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:shadow-md"
          />
          <input
            type="range"
            min={minPrice}
            max={maxPrice}
            value={priceRangeValue[1]}
            onChange={(e) => handlePriceChange(1, Number(e.target.value))}
            className="absolute w-full h-2 top-1 appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-blue-600 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:hover:scale-110 [&::-webkit-slider-thumb]:transition-transform [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-blue-600 [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:shadow-md"
          />
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-2">
          <span>${priceRangeValue[0]}</span>
          <span>${priceRangeValue[1]}</span>
        </div>
      </div>

      {/* File Types */}
      <div>
        <h4 className="font-medium mb-3 flex items-center gap-2 text-sm text-gray-900">
          <FileType className="w-4 h-4 text-blue-600" />
          File Types
        </h4>
        <div className="space-y-2.5">
          {fileTypes.map((type: any) => (
            <label
              key={type.type}
              className="flex items-center gap-2.5 cursor-pointer group"
            >
              <div className="relative flex items-center justify-center flex-shrink-0">
                <input
                  type="checkbox"
                  checked={selectedFileTypes.includes(type.type)}
                  onChange={(e) =>
                    handleFileTypeChange(type.type, e.target.checked)
                  }
                  className="peer sr-only"
                />
                <div className="w-4 h-4 border-2 border-gray-300 rounded bg-white peer-checked:bg-blue-600 peer-checked:border-blue-600 transition-all duration-200 flex items-center justify-center group-hover:border-blue-400">
                  {selectedFileTypes.includes(type.type) && (
                    <svg
                      className="w-3 h-3 text-white"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2.5"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path d="M5 13l4 4L19 7"></path>
                    </svg>
                  )}
                </div>
              </div>
              <span className="text-sm text-gray-700 select-none group-hover:text-gray-900">
                {type.type.toUpperCase()}
              </span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Filter Button */}
      <div className="lg:hidden fixed bottom-6 right-6 z-30">
        <button
          onClick={() => setIsMobileFilterOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-lg transition-all duration-200 hover:scale-105 active:scale-95 flex items-center gap-2 relative"
          aria-label="Open filters"
        >
          <Filter className="w-5 h-5" />
          <span className="font-medium">Filters</span>
          {activeFilterCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center shadow-md">
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-80 space-y-4">
        <div className="rounded-2xl shadow-sm bg-white border border-gray-200 sticky top-20">
          {filterContent}
        </div>
      </aside>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {(isMobileOpen || isMobileFilterOpen) && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="lg:hidden fixed inset-0 bg-black/50 z-40"
              onClick={handleMobileClose}
            />

            {/* Drawer */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="lg:hidden fixed left-0 top-0 bottom-0 w-[85%] max-w-sm bg-white z-50 overflow-y-auto shadow-2xl"
            >
              <div className="rounded-2xl bg-white">
                {filterContent}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}