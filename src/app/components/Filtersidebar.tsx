// "use client";

// import { useState } from "react";
// import { useRouter, usePathname, useSearchParams } from "next/navigation";
// import { Card, CheckboxGroup, Checkbox, Slider, Button } from "@heroui/react";
// import {
//   ChevronDown,
//   ChevronRight,
//   Package,
//   DollarSign,
//   FileType,
// } from "lucide-react";
// import { CategoryApi } from "@/types";
// import { collectCategoryIds } from "@/lib/category-helpers";
// import { AnimatePresence, motion } from "framer-motion";

// interface FilterSidebarProps {
//   categories: CategoryApi[];
//   priceRange: { min: number; max: number };
//   fileTypes: any[];
//   searchParams: {
//     category_ids?: string;
//     min_price?: string;
//     max_price?: string;
//     file_types?: string;
//   };
// }

// export default function FilterSidebar({
//   categories,
//   priceRange: { min: minPrice, max: maxPrice },
//   fileTypes,
//   searchParams,
// }: FilterSidebarProps) {
//   const router = useRouter();
//   const pathname = usePathname();
//   const currentSearchParams = useSearchParams();

//   // Initialize selected categories from URL params
//   const [selectedCategories, setSelectedCategories] = useState<string[]>(() => {
//     const childIdsFromUrl =
//       searchParams.category_ids?.split(",").filter(Boolean) || [];
//     const selected: string[] = [];

//     categories.forEach((parent) => {
//       if (!parent.children_recursive?.length) return;
//       const childIds = parent.children_recursive.map((c) => String(c.id));

//       const allChildrenSelected = childIds.every((id) =>
//         childIdsFromUrl.includes(id)
//       );

//       if (allChildrenSelected) {
//         selected.push(String(parent.id));
//       } else {
//         selected.push(...childIdsFromUrl.filter((id) => childIds.includes(id)));
//       }
//     });

//     const rootChilds = childIdsFromUrl.filter((id) => {
//       return !categories.some((parent) =>
//         parent.children_recursive?.some((c) => String(c.id) === id)
//       );
//     });
//     selected.push(...rootChilds);

//     return selected;
//   });

//   const [selectedFileTypes, setSelectedFileTypes] = useState<string[]>(
//     searchParams.file_types?.split(",").filter(Boolean) || []
//   );

//   const [priceRangeValue, setPriceRangeValue] = useState<[number, number]>([
//     searchParams.min_price ? Number(searchParams.min_price) : minPrice,
//     searchParams.max_price ? Number(searchParams.max_price) : maxPrice,
//   ]);

//   const [expandedCategories, setExpandedCategories] = useState<
//     Record<number, boolean>
//   >(() => {
//     const expanded: Record<number, boolean> = {};
//     const walk = (nodes: CategoryApi[]) => {
//       nodes.forEach((n) => {
//         if (n.children_recursive?.length) {
//           expanded[n.id] = true;
//           walk(n.children_recursive);
//         }
//       });
//     };
//     walk(categories);
//     return expanded;
//   });

//   const toggleExpanded = (id: number) => {
//     setExpandedCategories((prev) => ({ ...prev, [id]: !prev[id] }));
//   };

//   const updateFilters = (updates: {
//     categories?: string[];
//     fileTypes?: string[];
//     priceRange?: [number, number];
//   }) => {
//     const params = new URLSearchParams(currentSearchParams.toString());

//     if (updates.categories !== undefined) {
//       if (updates.categories.length) {
//         const allIds = collectCategoryIds(categories, updates.categories);
//         params.set("category_ids", allIds.join(","));
//       } else {
//         params.delete("category_ids");
//       }
//     }

//     if (updates.fileTypes !== undefined) {
//       if (updates.fileTypes.length) {
//         params.set("file_types", updates.fileTypes.join(","));
//       } else {
//         params.delete("file_types");
//       }
//     }

//     if (updates.priceRange) {
//       if (updates.priceRange[0] > minPrice) {
//         params.set("min_price", String(updates.priceRange[0]));
//       } else {
//         params.delete("min_price");
//       }

//       if (updates.priceRange[1] < maxPrice) {
//         params.set("max_price", String(updates.priceRange[1]));
//       } else {
//         params.delete("max_price");
//       }
//     }

//     params.delete("page");

//     const newUrl = params.toString() ? `${pathname}?${params}` : pathname;
//     router.push(newUrl);
//   };

//   const handleCategoryChange = (vals: string[]) => {
//     let newSelected = vals as string[];

//     categories.forEach((parent) => {
//       if (!parent.children_recursive?.length) return;

//       const parentId = String(parent.id);
//       const childIds = parent.children_recursive.map((c) => String(c.id));

//       const parentClicked =
//         !selectedCategories.includes(parentId) &&
//         newSelected.includes(parentId);

//       if (parentClicked) {
//         newSelected = newSelected.filter((id) => !childIds.includes(id));
//       }

//       const anyChildCheckedNow = childIds.some((id) =>
//         newSelected.includes(id)
//       );
//       if (anyChildCheckedNow && newSelected.includes(parentId)) {
//         newSelected = newSelected.filter((id) => id !== parentId);
//       }
//     });

//     setSelectedCategories(newSelected);
//     updateFilters({ categories: newSelected });
//   };

//   const handleFileTypeChange = (vals: string[]) => {
//     setSelectedFileTypes(vals);
//     updateFilters({ fileTypes: vals });
//   };

//   const handlePriceChange = (range: number | number[]) => {
//     const newRange = Array.isArray(range)
//       ? (range as [number, number])
//       : [minPrice, range];
//     setPriceRangeValue(newRange as [number, number]);
//     updateFilters({ priceRange: newRange } as any);
//   };

//   const resetAll = () => {
//     setSelectedCategories([]);
//     setSelectedFileTypes([]);
//     setPriceRangeValue([minPrice, maxPrice]);
//     router.push(pathname);
//   };

//   const renderCategoryTree = (
//     node: CategoryApi,
//     isExpandedMap: Record<number, boolean>,
//     toggleExpanded: (id: number) => void,
//     level = 0
//   ): React.ReactNode => {
//     const hasChildren = (node.children_recursive || []).length > 0;
//     const isExpanded = isExpandedMap[node.id];
//     const isRoot = node.parent_id === null;

//     return (
//       <div key={node.id} className="mb-1">
//         <div
//           className="flex items-center justify-between cursor-pointer p-2 rounded-lg hover:bg-gray-50 transition"
//           style={{ paddingLeft: `${level * 8}px` }}
//           onClick={() => hasChildren && toggleExpanded(node.id)}
//         >
//           <div className="flex items-center gap-2">
//             {isRoot ? (
//               <span className="font-semibold text-sm">{node.name}</span>
//             ) : (
//               <Checkbox
//                 value={String(node.id)}
//                 onClick={(e) => e.stopPropagation()}
//               >
//                 <span className="text-sm">{node.name}</span>
//               </Checkbox>
//             )}
//           </div>

//           <div className="flex items-center">
//             {hasChildren ? (
//               <motion.div
//                 animate={{ rotate: isExpanded ? 90 : 0 }}
//                 transition={{ duration: 0.25 }}
//               >
//                 <ChevronRight className="w-4 h-4 text-blue-600" />
//               </motion.div>
//             ) : (
//               <div className="w-4" />
//             )}
//           </div>
//         </div>

//         <AnimatePresence initial={false}>
//           {isExpanded && hasChildren && (
//             <motion.div
//               initial={{ height: 0, opacity: 0 }}
//               animate={{ height: "auto", opacity: 1 }}
//               exit={{ height: 0, opacity: 0 }}
//               transition={{ duration: 0.25 }}
//               className="pl-4 border-l border-gray-200 overflow-hidden"
//             >
//               <div className="mt-2">
//                 {(node.children_recursive || []).map((child) =>
//                   renderCategoryTree(
//                     child,
//                     isExpandedMap,
//                     toggleExpanded,
//                     level + 1
//                   )
//                 )}
//               </div>
//             </motion.div>
//           )}
//         </AnimatePresence>
//       </div>
//     );
//   };

//   // Filter only root categories (parent_id === null)
//   const rootCategories = categories.filter((c) => c.parent_id === null);

//   return (
//     <aside className="w-full lg:w-72 space-y-4">
//       <Card className="p-4 lrounded-2xl shadow-sm sticky top-20">
//         <div className="flex justify-between items-center mb-4">
//           <h3 className="font-semibold text-lg">Filters</h3>
//           <Button size="sm" variant="light" color="primary" onPress={resetAll}>
//             Reset All
//           </Button>
//         </div>

//         {/* Categories */}
//         <div className="mb-6">
//           <h4 className="font-medium mb-3 flex items-center gap-2 text-sm">
//             <Package className="w-4 h-4 text-primary" />
//             Categories
//           </h4>
//           <CheckboxGroup
//             value={selectedCategories}
//             onChange={handleCategoryChange}
//           >
//             <div className="max-h-80 overflow-y-auto pr-2 space-y-1">
//               {rootCategories.map((cat) =>
//                 renderCategoryTree(cat, expandedCategories, toggleExpanded)
//               )}
//             </div>
//           </CheckboxGroup>
//         </div>

//         {/* Price Range */}
//         <div className="mb-6">
//           <h4 className="font-medium mb-3 flex items-center gap-2 text-sm">
//             <DollarSign className="w-4 h-4 text-primary" />
//             Price Range
//           </h4>
//           <Slider
//             value={priceRangeValue}
//             onChange={handlePriceChange}
//             minValue={minPrice}
//             maxValue={maxPrice}
//             step={1}
//             formatOptions={{ style: "currency", currency: "USD" }}
//             className="max-w-full"
//           />
//           <div className="flex justify-between text-xs text-default-500 mt-2">
//             <span>${priceRangeValue[0]}</span>
//             <span>${priceRangeValue[1]}</span>
//           </div>
//         </div>

//         {/* File Types */}
//         <div>
//           <h4 className="font-medium mb-3 flex items-center gap-2 text-sm">
//             <FileType className="w-4 h-4 text-primary" />
//             File Types
//           </h4>
//           <CheckboxGroup
//             value={selectedFileTypes}
//             onChange={handleFileTypeChange}
//           >
//             <div className="space-y-2 flex flex-col">
//               {fileTypes.map((type: any) => (
//                 <Checkbox key={type.type} value={type.type}>
//                   <span>{type.type.toUpperCase()}</span>
//                 </Checkbox>
//               ))}
//             </div>
//           </CheckboxGroup>
//         </div>
//       </Card>
//     </aside>
//   );
// }


"use client";

import { useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import {
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
    
    // Ensure min doesn't exceed max and vice versa
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
          <div className="flex items-center gap-2 flex-1">
            {isRoot ? (
              <span className="font-semibold text-sm text-gray-900">{node.name}</span>
            ) : (
              <label
                className="flex items-center gap-2.5 cursor-pointer flex-1 group"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="relative flex items-center justify-center">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={(e) => handleCategoryChange(nodeId, e.target.checked)}
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
                <span className="text-sm text-gray-700 select-none group-hover:text-gray-900">
                  {node.name}
                </span>
              </label>
            )}
          </div>

          <div className="flex items-center ml-2">
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

  const pricePercentMin = ((priceRangeValue[0] - minPrice) / (maxPrice - minPrice)) * 100;
  const pricePercentMax = ((priceRangeValue[1] - minPrice) / (maxPrice - minPrice)) * 100;

  return (
    <aside className="w-full lg:w-80 space-y-4">
      <div className="p-4 rounded-2xl shadow-sm bg-white border border-gray-200 sticky top-20">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold text-lg text-gray-900">Filters</h3>
          <button
            onClick={resetAll}
            className="px-3 py-1.5 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          >
            Reset All
          </button>
        </div>

        {/* Categories */}
        <div className="mb-6">
          <h4 className="font-medium mb-3 flex items-center gap-2 text-sm text-gray-900">
            <Package className="w-4 h-4 text-blue-600" />
            Categories
          </h4>
          <div className="max-h-80 overflow-y-auto pr-2 space-y-1">
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
                <div className="relative flex items-center justify-center">
                  <input
                    type="checkbox"
                    checked={selectedFileTypes.includes(type.type)}
                    onChange={(e) => handleFileTypeChange(type.type, e.target.checked)}
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
    </aside>
  );
}