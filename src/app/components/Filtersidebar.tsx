"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import {
  ChevronRight,
  Package,
  DollarSign,
  FileType,
  RotateCcw,
  SlidersHorizontal,
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

  // Price range - local state for immediate UI, separate from URL state
  const [localMinPrice, setLocalMinPrice] = useState<number>(
    searchParams.min_price ? Number(searchParams.min_price) : minPrice
  );
  const [localMaxPrice, setLocalMaxPrice] = useState<number>(
    searchParams.max_price ? Number(searchParams.max_price) : maxPrice
  );

  // Debounce timer ref
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Function to update URL with price (called after debounce)
  const updatePriceInUrl = useCallback(
    (newMin: number, newMax: number) => {
      const params = new URLSearchParams(currentSearchParams.toString());

      if (newMin > minPrice) {
        params.set("min_price", String(newMin));
      } else {
        params.delete("min_price");
      }

      if (newMax < maxPrice) {
        params.set("max_price", String(newMax));
      } else {
        params.delete("max_price");
      }

      params.delete("page");

      const newUrl = params.toString() ? `${pathname}?${params}` : pathname;
      router.push(newUrl, { scroll: false });
    },
    [currentSearchParams, minPrice, maxPrice, pathname, router]
  );

  // Debounced price update
  const debouncedPriceUpdate = useCallback(
    (newMin: number, newMax: number) => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      debounceTimerRef.current = setTimeout(() => {
        updatePriceInUrl(newMin, newMax);
      }, 400);
    },
    [updatePriceInUrl]
  );

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  // Handle min price slider change
  const handleMinPriceChange = (value: number) => {
    // Ensure min doesn't exceed max
    const newMin = Math.min(value, localMaxPrice);
    setLocalMinPrice(newMin);
    debouncedPriceUpdate(newMin, localMaxPrice);
  };

  // Handle max price slider change
  const handleMaxPriceChange = (value: number) => {
    // Ensure max doesn't go below min
    const newMax = Math.max(value, localMinPrice);
    setLocalMaxPrice(newMax);
    debouncedPriceUpdate(localMinPrice, newMax);
  };

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

  const resetAll = () => {
    setSelectedCategories([]);
    setSelectedFileTypes([]);
    setLocalMinPrice(minPrice);
    setLocalMaxPrice(maxPrice);
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    router.push(pathname);
  };

  const resetPriceRange = () => {
    setLocalMinPrice(minPrice);
    setLocalMaxPrice(maxPrice);
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    updatePriceInUrl(minPrice, maxPrice);
  };

  const handleMobileClose = () => {
    setIsMobileFilterOpen(false);
    if (onMobileClose) {
      onMobileClose();
    }
  };

  // Custom Checkbox Component
  const CustomCheckbox = ({
    checked,
    onChange,
    label,
  }: {
    checked: boolean;
    onChange: (checked: boolean) => void;
    label: string;
  }) => (
    <label className="flex items-center gap-3 cursor-pointer flex-1 group min-w-0">
      <button
        type="button"
        role="checkbox"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`w-[18px] h-[18px] rounded-md flex items-center justify-center transition-all duration-200 flex-shrink-0 ${
          checked
            ? "bg-gradient-to-br from-violet-500 to-violet-600 shadow-lg shadow-violet-500/25"
            : "border-2 border-slate-300 bg-white group-hover:border-violet-400"
        }`}
      >
        {checked && (
          <motion.svg
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-3 h-3 text-white"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="3"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M5 13l4 4L19 7"></path>
          </motion.svg>
        )}
      </button>
      <span className="text-sm text-slate-600 select-none group-hover:text-slate-900 truncate transition-colors">
        {label}
      </span>
    </label>
  );

  const renderCategoryTree = (
    node: CategoryApi,
    isExpandedMap: Record<number, boolean>,
    toggleExpandedFn: (id: number) => void,
    level = 0
  ): React.ReactNode => {
    const hasChildren = (node.children_recursive || []).length > 0;
    const isExpanded = isExpandedMap[node.id];
    const isRoot = node.parent_id === null;
    const nodeId = String(node.id);
    const isChecked = selectedCategories.includes(nodeId);

    return (
      <div key={node.id} className="mb-0.5">
        <div
          className={`flex items-center justify-between cursor-pointer py-2.5 px-3 rounded-xl transition-all duration-200 ${
            isRoot
              ? "hover:bg-slate-100/80"
              : isChecked
              ? "bg-violet-50/80"
              : "hover:bg-slate-50"
          }`}
          style={{ paddingLeft: `${12 + level * 12}px` }}
          onClick={() => hasChildren && toggleExpandedFn(node.id)}
        >
          <div className="flex items-center gap-2 flex-1 min-w-0">
            {isRoot ? (
              <span className="font-semibold text-sm text-slate-800 truncate">
                {node.name}
              </span>
            ) : (
              <div
                onClick={(e) => e.stopPropagation()}
                className="flex-1 min-w-0"
              >
                <CustomCheckbox
                  checked={isChecked}
                  onChange={(checked) => handleCategoryChange(nodeId, checked)}
                  label={node.name}
                />
              </div>
            )}
          </div>

          <div className="flex items-center ml-2 flex-shrink-0">
            {hasChildren ? (
              <motion.div
                animate={{ rotate: isExpanded ? 90 : 0 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="p-0.5"
              >
                <ChevronRight className="w-4 h-4 text-violet-500" />
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
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="ml-4 pl-3 border-l-2 border-slate-200/60 overflow-hidden"
            >
              <div className="py-1">
                {(node.children_recursive || []).map((child) =>
                  renderCategoryTree(
                    child,
                    isExpandedMap,
                    toggleExpandedFn,
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
    (localMinPrice !== minPrice || localMaxPrice !== maxPrice ? 1 : 0);

  const isPriceModified = localMinPrice !== minPrice || localMaxPrice !== maxPrice;

  // Calculate percentages for the visual track
  const range = maxPrice - minPrice;
  const minPercent = range > 0 ? ((localMinPrice - minPrice) / range) * 100 : 0;
  const maxPercent = range > 0 ? ((localMaxPrice - minPrice) / range) * 100 : 100;

  const filterContent = (
    <div className="p-5 sm:p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-violet-500 to-violet-600 rounded-xl shadow-lg shadow-violet-500/20">
            <SlidersHorizontal className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-900">Filters</h3>
            {activeFilterCount > 0 && (
              <span className="text-xs text-slate-500">
                {activeFilterCount} active
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {activeFilterCount > 0 && (
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={resetAll}
              className="px-3 py-1.5 text-xs font-medium text-violet-600 hover:text-violet-700 hover:bg-violet-50 rounded-lg transition-all duration-200 flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Clear all
            </motion.button>
          )}
          <button
            onClick={handleMobileClose}
            className="lg:hidden p-2 hover:bg-slate-100 rounded-xl transition-colors"
            aria-label="Close filters"
          >
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>
      </div>

      {/* Categories */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Package className="w-4 h-4 text-violet-500" />
          <h4 className="font-medium text-sm text-slate-800">Categories</h4>
        </div>
        <div className="max-h-72 overflow-y-auto pr-1 -mr-1 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
          {rootCategories.map((cat) =>
            renderCategoryTree(cat, expandedCategories, toggleExpanded)
          )}
        </div>
      </div>

      {/* Price Range */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-violet-500" />
            <h4 className="font-medium text-sm text-slate-800">Price Range</h4>
          </div>
          {isPriceModified && (
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={resetPriceRange}
              className="text-xs text-violet-600 hover:text-violet-700 font-medium transition-colors"
            >
              Reset
            </motion.button>
          )}
        </div>

        <div className="bg-gradient-to-br from-slate-50 to-slate-100/50 rounded-2xl p-4">
          {/* Current values display */}
          <div className="flex items-center gap-3 mb-5">
            <div className="flex-1">
              <div className="bg-white rounded-xl px-3 py-2.5 border-2 border-slate-200 text-center">
                <span className="text-base font-bold text-slate-900">
                  ${localMinPrice}
                </span>
              </div>
              <span className="block text-[10px] uppercase tracking-wider text-slate-400 mt-1.5 text-center">
                Min
              </span>
            </div>

            <div className="text-slate-300 mt-[-18px]">
              <span className="text-lg">—</span>
            </div>

            <div className="flex-1">
              <div className="bg-white rounded-xl px-3 py-2.5 border-2 border-slate-200 text-center">
                <span className="text-base font-bold text-slate-900">
                  ${localMaxPrice}
                </span>
              </div>
              <span className="block text-[10px] uppercase tracking-wider text-slate-400 mt-1.5 text-center">
                Max
              </span>
            </div>
          </div>

          {/* Min Slider */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-slate-500">Minimum Price</span>
              <span className="text-xs font-medium text-slate-700">${localMinPrice}</span>
            </div>
            <div className="relative">
              <div className="absolute inset-0 h-2 bg-slate-200 rounded-full top-1/2 -translate-y-1/2" />
              <div
                className="absolute h-2 bg-gradient-to-r from-violet-500 to-violet-400 rounded-full top-1/2 -translate-y-1/2"
                style={{
                  left: 0,
                  width: `${minPercent}%`,
                }}
              />
              <input
                type="range"
                min={minPrice}
                max={maxPrice}
                step={1}
                value={localMinPrice}
                onChange={(e) => handleMinPriceChange(Number(e.target.value))}
                className="relative w-full h-2 appearance-none bg-transparent cursor-pointer z-10
                  [&::-webkit-slider-thumb]:appearance-none
                  [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5
                  [&::-webkit-slider-thumb]:rounded-full
                  [&::-webkit-slider-thumb]:bg-white
                  [&::-webkit-slider-thumb]:border-[3px] [&::-webkit-slider-thumb]:border-violet-500
                  [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:shadow-violet-500/30
                  [&::-webkit-slider-thumb]:cursor-grab [&::-webkit-slider-thumb]:active:cursor-grabbing
                  [&::-webkit-slider-thumb]:hover:scale-110 [&::-webkit-slider-thumb]:transition-transform
                  [&::-moz-range-thumb]:appearance-none
                  [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5
                  [&::-moz-range-thumb]:rounded-full
                  [&::-moz-range-thumb]:bg-white
                  [&::-moz-range-thumb]:border-[3px] [&::-moz-range-thumb]:border-violet-500
                  [&::-moz-range-thumb]:shadow-lg
                  [&::-moz-range-thumb]:cursor-grab [&::-moz-range-thumb]:active:cursor-grabbing
                  [&::-moz-range-track]:bg-transparent
                  [&::-webkit-slider-runnable-track]:bg-transparent"
              />
            </div>
          </div>

          {/* Max Slider */}
          <div className="mb-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-slate-500">Maximum Price</span>
              <span className="text-xs font-medium text-slate-700">${localMaxPrice}</span>
            </div>
            <div className="relative">
              <div className="absolute inset-0 h-2 bg-slate-200 rounded-full top-1/2 -translate-y-1/2" />
              <div
                className="absolute h-2 bg-gradient-to-r from-violet-400 to-violet-500 rounded-full top-1/2 -translate-y-1/2"
                style={{
                  left: 0,
                  width: `${maxPercent}%`,
                }}
              />
              <input
                type="range"
                min={minPrice}
                max={maxPrice}
                step={1}
                value={localMaxPrice}
                onChange={(e) => handleMaxPriceChange(Number(e.target.value))}
                className="relative w-full h-2 appearance-none bg-transparent cursor-pointer z-10
                  [&::-webkit-slider-thumb]:appearance-none
                  [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5
                  [&::-webkit-slider-thumb]:rounded-full
                  [&::-webkit-slider-thumb]:bg-white
                  [&::-webkit-slider-thumb]:border-[3px] [&::-webkit-slider-thumb]:border-violet-500
                  [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:shadow-violet-500/30
                  [&::-webkit-slider-thumb]:cursor-grab [&::-webkit-slider-thumb]:active:cursor-grabbing
                  [&::-webkit-slider-thumb]:hover:scale-110 [&::-webkit-slider-thumb]:transition-transform
                  [&::-moz-range-thumb]:appearance-none
                  [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5
                  [&::-moz-range-thumb]:rounded-full
                  [&::-moz-range-thumb]:bg-white
                  [&::-moz-range-thumb]:border-[3px] [&::-moz-range-thumb]:border-violet-500
                  [&::-moz-range-thumb]:shadow-lg
                  [&::-moz-range-thumb]:cursor-grab [&::-moz-range-thumb]:active:cursor-grabbing
                  [&::-moz-range-track]:bg-transparent
                  [&::-webkit-slider-runnable-track]:bg-transparent"
              />
            </div>
          </div>

          {/* Range labels */}
          <div className="flex justify-between text-[10px] text-slate-400 font-medium pt-1">
            <span>${minPrice}</span>
            <span>${maxPrice}</span>
          </div>
        </div>
      </div>

      {/* File Types */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <FileType className="w-4 h-4 text-violet-500" />
          <h4 className="font-medium text-sm text-slate-800">File Types</h4>
        </div>
        <div className="flex flex-wrap gap-2">
          {fileTypes.map((type: any) => {
            const isFileTypeChecked = selectedFileTypes.includes(type.type);
            return (
              <motion.button
                key={type.type}
                onClick={() =>
                  handleFileTypeChange(type.type, !isFileTypeChecked)
                }
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`px-4 py-2 text-xs font-semibold uppercase tracking-wide rounded-xl transition-all duration-200 ${
                  isFileTypeChecked
                    ? "bg-gradient-to-br from-violet-500 to-violet-600 text-white shadow-lg shadow-violet-500/25"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                .{type.type}
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Filter Button */}
      <div className="lg:hidden fixed bottom-6 right-6 z-30">
        <motion.button
          onClick={() => setIsMobileFilterOpen(true)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-gradient-to-br from-violet-500 to-violet-600 hover:from-violet-600 hover:to-violet-700 text-white rounded-2xl px-5 py-3.5 shadow-xl shadow-violet-500/30 transition-all duration-200 flex items-center gap-2.5 relative"
          aria-label="Open filters"
        >
          <SlidersHorizontal className="w-5 h-5" />
          <span className="font-semibold">Filters</span>
          {activeFilterCount > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-2 -right-2 bg-white text-violet-600 text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center shadow-lg ring-2 ring-violet-500"
            >
              {activeFilterCount}
            </motion.span>
          )}
        </motion.button>
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-80 flex-shrink-0">
        <div className="sticky top-24">
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-200/60 overflow-hidden">
            {filterContent}
          </div>
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
              className="lg:hidden fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40"
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
              {filterContent}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}