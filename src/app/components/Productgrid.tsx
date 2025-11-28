// "use client";

// import { useEffect, useState, useCallback, useRef } from "react";
// import debounce from "lodash.debounce";
// import { motion } from "framer-motion";
// import { Pagination, Card } from "@heroui/react";
// import type { Product } from "@/types";
// import { ProductCard } from "./Productcard";
// import { SearchBar } from "./Searchbar";
// import { ViewModeToggle } from "./Viewmodetoggle";
// import { FilterSidebar } from "./Filtersidebar";
// import { ProductsHeader } from "./Productsheader";
// import { ProductsSkeleton } from "./Productskeleton";
// import { EmptyState } from "./Emptystate";
// import { CategoryApi, ProductsResponse } from "@/types";
// import { collectCategoryIds } from "@/lib/category-helpers";

// export default function ProductGrid() {
//   const [initialLoaded, setInitialLoaded] = useState(false);
//   const [products, setProducts] = useState<Product[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   const [fileTypes, setFileTypes] = useState<string[]>([]);
//   const [selectedFileTypes, setSelectedFileTypes] = useState<string[]>([]);

//   const [searchInput, setSearchInput] = useState("");
//   const [searchQuery, setSearchQuery] = useState("");
//   const searchDebouncedRef = useRef(
//     debounce((value: string) => {
//       setSearchQuery(value);
//       setPage(1);
//     }, 500)
//   );

//   useEffect(() => {
//     return () => searchDebouncedRef.current.cancel();
//   }, []);

//   const [page, setPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);

//   const [categories, setCategories] = useState<CategoryApi[]>([]);
//   const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
//   const [expandedCategories, setExpandedCategories] = useState<
//     Record<number, boolean>
//   >({});

//   const [minPrice, setMinPrice] = useState<number | null>(null);
//   const [maxPrice, setMaxPrice] = useState<number | null>(null);
//   const [priceRange, setPriceRange] = useState<[number, number] | null>(null);

//   const [appliedFilters, setAppliedFilters] = useState({
//     categories: [] as string[],
//     priceRange: [0, 0] as [number, number],
//     fileTypes: [] as string[],
//   });

//   const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

//   // Initial URL parse
//   useEffect(() => {
//     if (initialLoaded || typeof window === "undefined") return;
//     if (minPrice === null || maxPrice === null || !categories.length) return;

//     const params = new URLSearchParams(window.location.search);
//     const childIdsFromUrl = params.get("category_ids")?.split(",") || [];
//     const files = params.get("file_types")?.split(",") || [];
//     const search = params.get("search") || "";
//     const pageNum = Number(params.get("page")) || 1;

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

//     setSelectedCategories(selected);
//     setSelectedFileTypes(files);
//     setSearchInput(search);
//     setSearchQuery(search);
//     setPage(pageNum);

//     const min = params.get("min_price")
//       ? Number(params.get("min_price"))
//       : minPrice;
//     const max = params.get("max_price")
//       ? Number(params.get("max_price"))
//       : maxPrice;
//     setPriceRange([min, max]);

//     setAppliedFilters((prev) => ({
//       ...prev,
//       categories: selected,
//       fileTypes: files,
//       priceRange: [min, max],
//     }));

//     setInitialLoaded(true);
//   }, [initialLoaded, minPrice, maxPrice, categories]);

//   // Auto fetch on filters change
//   useEffect(() => {
//     if (!initialLoaded) return;
//     if (!categories.length) return;
//     if (priceRange === null) return;

//     fetchProducts(page);
//   }, [
//     appliedFilters,
//     searchQuery,
//     page,
//     initialLoaded,
//     categories,
//     priceRange,
//   ]);

//   // Fetch categories
//   useEffect(() => {
//     const ctrl = new AbortController();

//     (async () => {
//       try {
//         const res = await fetch("https://filerget.com/api/categories", {
//           signal: ctrl.signal,
//         });
//         if (!res.ok) throw new Error("Failed to fetch categories");

//         const json = await res.json();
//         const data: CategoryApi[] = json.data || [];

//         setCategories(data);

//         const expandedDefault: Record<number, boolean> = {};

//         const walk = (nodes: CategoryApi[]) => {
//           nodes.forEach((n) => {
//             if (n.children_recursive && n.children_recursive.length > 0) {
//               expandedDefault[n.id] = true;
//               walk(n.children_recursive);
//             }
//           });
//         };

//         walk(data);

//         setExpandedCategories(expandedDefault);
//       } catch (e) {
//         if ((e as any).name !== "AbortError") console.error(e);
//       }
//     })();

//     return () => ctrl.abort();
//   }, []);

//   // Fetch price range
//   useEffect(() => {
//     const ctrl = new AbortController();
//     (async () => {
//       try {
//         const res = await fetch(
//           "https://filerget.com/api/products/meta/price-range",
//           { signal: ctrl.signal }
//         );
//         if (!res.ok) throw new Error("Failed to fetch price range");
//         const json = await res.json();
//         const min = Number(json.min_price) || 0;
//         const max = Number(json.max_price) || 1000;
//         setMinPrice(min);
//         setMaxPrice(max);

//         setPriceRange((prev) => prev ?? [min, max]);
//         setAppliedFilters((prev) => ({
//           ...prev,
//           priceRange: prev.priceRange[1] === 0 ? [min, max] : prev.priceRange,
//         }));
//       } catch (e) {
//         if ((e as any).name !== "AbortError") console.error(e);
//       }
//     })();
//     return () => ctrl.abort();
//   }, []);

//   // Fetch file types
//   useEffect(() => {
//     const controller = new AbortController();

//     (async () => {
//       try {
//         const res = await fetch(
//           "https://filerget.com/api/products/meta/file-types",
//           {
//             signal: controller.signal,
//           }
//         );
//         const json = await res.json();
//         setFileTypes(json.data || []);
//       } catch (e) {
//         if ((e as any).name !== "AbortError") console.error(e);
//       }
//     })();

//     return () => controller.abort();
//   }, []);

//   const fetchProducts = useCallback(
//     async (pageNumber = 1) => {
//       if (minPrice === null || maxPrice === null || priceRange === null) return;
//       const ctrl = new AbortController();
//       const signal = ctrl.signal;

//       try {
//         setLoading(true);
//         const params = new URLSearchParams();
//         if (searchQuery) params.append("search", searchQuery);

//         if (appliedFilters.categories.length) {
//           const allIds = collectCategoryIds(
//             categories,
//             appliedFilters.categories
//           );
//           if (allIds.length) params.append("category_ids", allIds.join(","));
//         }

//         if (appliedFilters.priceRange[0] > minPrice)
//           params.append("min_price", String(appliedFilters.priceRange[0]));
//         if (appliedFilters.priceRange[1] < maxPrice)
//           params.append("max_price", String(appliedFilters.priceRange[1]));
//         if (pageNumber > 1) params.append("page", String(pageNumber));

//         if (appliedFilters.fileTypes?.length) {
//           params.append("file_types", appliedFilters.fileTypes.join(","));
//         }

//         const url = `https://filerget.com/api/products${
//           params.toString() ? `?${params.toString()}` : ""
//         }`;
//         const res = await fetch(url, { signal });
//         if (!res.ok) throw new Error(`Failed to fetch products: ${res.status}`);
//         const json: ProductsResponse = await res.json();

//         setProducts(json.data || []);
//         setPage(json.current_page || pageNumber);
//         setTotalPages(json.last_page || 1);

//         if (typeof window !== "undefined") {
//           const newQuery = params.toString();
//           const current = window.location.search.slice(1);
//           if (current !== newQuery) {
//             const newUrl = newQuery ? `/products?${newQuery}` : `/products`;
//             window.history.replaceState({}, "", newUrl);
//           }
//         }

//         setError("");
//       } catch (e) {
//         if ((e as any).name !== "AbortError") {
//           console.error(e);
//           setError("Failed to load products.");
//         }
//       } finally {
//         setLoading(false);
//       }

//       return () => ctrl.abort();
//     },
//     [appliedFilters, searchQuery, minPrice, maxPrice, categories]
//   );

//   const toggleExpanded = (id: number) => {
//     setExpandedCategories((prev) => ({ ...prev, [id]: !prev[id] }));
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

//     setAppliedFilters((prev) => ({
//       ...prev,
//       categories: collectCategoryIds(categories, newSelected),
//     }));

//     setPage(1);
//   };

//   const handlePriceChange = (range: [number, number]) => {
//     setPriceRange(range);
//     setAppliedFilters((prev) => ({
//       ...prev,
//       priceRange: range,
//     }));
//     setPage(1);
//   };

//   const handleFileTypeChange = (vals: string[]) => {
//     setSelectedFileTypes(vals);
//     setAppliedFilters((prev) => ({
//       ...prev,
//       fileTypes: vals,
//     }));
//     setPage(1);
//   };

//   const resetAll = () => {
//     if (minPrice === null || maxPrice === null) return;
//     setSelectedCategories([]);
//     setSelectedFileTypes([]);
//     setPriceRange([minPrice, maxPrice]);
//     setAppliedFilters({
//       categories: [],
//       priceRange: [minPrice, maxPrice],
//       fileTypes: [],
//     });
//     setSearchInput("");
//     setSearchQuery("");
//     setPage(1);
//   };

//   const handleSearchChange = (value: string) => {
//     setSearchInput(value);
//     searchDebouncedRef.current(value);
//   };

//   const handleSearchClear = () => {
//     setSearchInput("");
//     setSearchQuery("");
//   };

//   return (
//     <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12 mt-12">
//        {/* ---------- Fallback HTML for no-js ---------- */}
     
//       {/* Header */}
//       <div className="flex items-center justify-between gap-4 mb-8">
//         <SearchBar
//           value={searchInput}
//           onChange={handleSearchChange}
//           onClear={handleSearchClear}
//         />

//         <ViewModeToggle viewMode={viewMode} onViewModeChange={setViewMode} />
//       </div>

//       <div className="flex flex-col lg:flex-row gap-6 mb-32">
//         {/* Filter Sidebar */}
//         <FilterSidebar
//           categories={categories}
//           selectedCategories={selectedCategories}
//           expandedCategories={expandedCategories}
//           onToggleExpand={toggleExpanded}
//           onCategoryChange={handleCategoryChange}
//           priceRange={priceRange}
//           minPrice={minPrice}
//           maxPrice={maxPrice}
//           onPriceChange={handlePriceChange}
//           fileTypes={fileTypes}
//           selectedFileTypes={selectedFileTypes}
//           onFileTypeChange={handleFileTypeChange}
//           onReset={resetAll}
//         />

//         {/* Main content */}
//         <main className="flex-1">
//           <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
//             <ProductsHeader productsCount={products.length} loading={loading} />
//           </div>

//           {/* Products area */}
//           {loading ? (
//             <ProductsSkeleton viewMode={viewMode} />
//           ) : products.length > 0 ? (
//             <motion.div
//               layout
//               className={`grid gap-6 ${
//                 viewMode === "grid"
//                   ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
//                   : "grid-cols-1"
//               }`}
//             >
//               {products.map((p) => (
//                 <motion.div key={p.id} layout whileHover={{ scale: 1.01 }}>
//                   <ProductCard product={p} view={viewMode} />
//                 </motion.div>
//               ))}
//             </motion.div>
//           ) : (
//             <EmptyState onReset={resetAll} />
//           )}

//           {/* Pagination */}
//           {!loading && products.length > 0 && totalPages > 1 && (
//             <div className="flex justify-center mt-8">
//               <Pagination
//                 total={totalPages}
//                 page={page}
//                 onChange={(p) => setPage(p)}
//                 showControls
//                 size="lg"
//               />
//             </div>
//           )}

//           {/* Error */}
//           {error && (
//             <Card className="mt-6 p-4 bg-danger-50 border-2 border-danger rounded-xl">
//               <p className="text-danger font-semibold">{error}</p>
//             </Card>
//           )}
//         </main>
//       </div>
//     </div>
//   );
// }

// "use client";

// import { useEffect, useState, useCallback, useRef } from "react";
// import { useRouter, usePathname, useSearchParams } from "next/navigation";
// import debounce from "lodash.debounce";
// import { motion } from "framer-motion";
// import { Pagination, Card } from "@heroui/react";
// import type { Product } from "@/types";
// import { ProductCard } from "./Productcard";
// import { SearchBar } from "./Searchbar";
// import { ViewModeToggle } from "./Viewmodetoggle";
// import { FilterSidebar } from "./Filtersidebar";
// import { ProductsHeader } from "./Productsheader";
// import { ProductsSkeleton } from "./Productskeleton";
// import { EmptyState } from "./Emptystate";
// import { CategoryApi } from "@/types";
// import { collectCategoryIds } from "@/lib/category-helpers";

// interface ProductGridProps {
//   initialProducts: Product[];
//   initialPage: number;
//   initialTotalPages: number;
//   categories: CategoryApi[];
//   priceRange: { min: number; max: number };
//   fileTypes: string[];
//   searchParams: {
//     search?: string;
//     category_ids?: string;
//     min_price?: string;
//     max_price?: string;
//     file_types?: string;
//     page?: string;
//   };
// }

// export default function ProductGrid({
//   initialProducts,
//   initialPage,
//   initialTotalPages,
//   categories,
//   priceRange: { min: minPrice, max: maxPrice },
//   fileTypes,
//   searchParams,
// }: ProductGridProps) {
//   const router = useRouter();
//   const pathname = usePathname();
//   const currentSearchParams = useSearchParams();

//   const [products, setProducts] = useState<Product[]>(initialProducts);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   const [selectedFileTypes, setSelectedFileTypes] = useState<string[]>(
//     searchParams.file_types?.split(",").filter(Boolean) || []
//   );

//   const [searchInput, setSearchInput] = useState(searchParams.search || "");
//   const [searchQuery, setSearchQuery] = useState(searchParams.search || "");
  
//   const searchDebouncedRef = useRef(
//     debounce((value: string) => {
//       setSearchQuery(value);
//     }, 500)
//   );

//   useEffect(() => {
//     return () => searchDebouncedRef.current.cancel();
//   }, []);

//   const [page, setPage] = useState(initialPage);
//   const [totalPages, setTotalPages] = useState(initialTotalPages);

//   const [selectedCategories, setSelectedCategories] = useState<string[]>(() => {
//     const childIdsFromUrl = searchParams.category_ids?.split(",") || [];
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

//   const [expandedCategories, setExpandedCategories] = useState<
//     Record<number, boolean>
//   >(() => {
//     const expandedDefault: Record<number, boolean> = {};
//     const walk = (nodes: CategoryApi[]) => {
//       nodes.forEach((n) => {
//         if (n.children_recursive && n.children_recursive.length > 0) {
//           expandedDefault[n.id] = true;
//           walk(n.children_recursive);
//         }
//       });
//     };
//     walk(categories);
//     return expandedDefault;
//   });

//   const [currentPriceRange, setCurrentPriceRange] = useState<[number, number]>([
//     searchParams.min_price ? Number(searchParams.min_price) : minPrice,
//     searchParams.max_price ? Number(searchParams.max_price) : maxPrice,
//   ]);

//   const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

//   // Update URL when filters change
//   const updateURL = useCallback((filters: {
//     search?: string;
//     categories?: string[];
//     priceRange?: [number, number];
//     fileTypes?: string[];
//     page?: number;
//   }) => {
//     const params = new URLSearchParams();

//     if (filters.search) params.append("search", filters.search);

//     if (filters.categories?.length) {
//       const allIds = collectCategoryIds(categories, filters.categories);
//       if (allIds.length) params.append("category_ids", allIds.join(","));
//     }

//     if (filters.priceRange) {
//       if (filters.priceRange[0] > minPrice)
//         params.append("min_price", String(filters.priceRange[0]));
//       if (filters.priceRange[1] < maxPrice)
//         params.append("max_price", String(filters.priceRange[1]));
//     }

//     if (filters.fileTypes?.length) {
//       params.append("file_types", filters.fileTypes.join(","));
//     }

//     if (filters.page && filters.page > 1) {
//       params.append("page", String(filters.page));
//     }

//     const newUrl = params.toString() ? `${pathname}?${params.toString()}` : pathname;
//     router.push(newUrl, { scroll: false });
//   }, [categories, minPrice, maxPrice, pathname, router]);

//   // Fetch products when filters change
//   useEffect(() => {
//     const fetchProducts = async () => {
//       setLoading(true);
//       try {
//         const params = new URLSearchParams();
//         if (searchQuery) params.append("search", searchQuery);

//         if (selectedCategories.length) {
//           const allIds = collectCategoryIds(categories, selectedCategories);
//           if (allIds.length) params.append("category_ids", allIds.join(","));
//         }

//         if (currentPriceRange[0] > minPrice)
//           params.append("min_price", String(currentPriceRange[0]));
//         if (currentPriceRange[1] < maxPrice)
//           params.append("max_price", String(currentPriceRange[1]));
//         if (page > 1) params.append("page", String(page));

//         if (selectedFileTypes?.length) {
//           params.append("file_types", selectedFileTypes.join(","));
//         }

//         const url = `https://filerget.com/api/products${
//           params.toString() ? `?${params.toString()}` : ""
//         }`;
//         const res = await fetch(url);
//         if (!res.ok) throw new Error(`Failed to fetch products: ${res.status}`);
//         const json = await res.json();

//         setProducts(json.data || []);
//         setPage(json.current_page || page);
//         setTotalPages(json.last_page || 1);
//         setError("");

//         // Update URL
//         updateURL({
//           search: searchQuery,
//           categories: selectedCategories,
//           priceRange: currentPriceRange,
//           fileTypes: selectedFileTypes,
//           page: json.current_page || page,
//         });
//       } catch (e) {
//         console.error(e);
//         setError("Failed to load products.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchProducts();
//   }, [searchQuery, selectedCategories, currentPriceRange, selectedFileTypes, page]);

//   const toggleExpanded = (id: number) => {
//     setExpandedCategories((prev) => ({ ...prev, [id]: !prev[id] }));
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
//     setPage(1);
//   };

//   const handlePriceChange = (range: [number, number]) => {
//     setCurrentPriceRange(range);
//     setPage(1);
//   };

//   const handleFileTypeChange = (vals: string[]) => {
//     setSelectedFileTypes(vals);
//     setPage(1);
//   };

//   const resetAll = () => {
//     setSelectedCategories([]);
//     setSelectedFileTypes([]);
//     setCurrentPriceRange([minPrice, maxPrice]);
//     setSearchInput("");
//     setSearchQuery("");
//     setPage(1);
//   };

//   const handleSearchChange = (value: string) => {
//     setSearchInput(value);
//     searchDebouncedRef.current(value);
//     setPage(1);
//   };

//   const handleSearchClear = () => {
//     setSearchInput("");
//     setSearchQuery("");
//     setPage(1);
//   };

//   return (
//     <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12 mt-12">

//       <div className="flex items-center justify-between gap-4 mb-8">
//         <SearchBar
//           value={searchInput}
//           onChange={handleSearchChange}
//           onClear={handleSearchClear}
//         />
//         <ViewModeToggle viewMode={viewMode} onViewModeChange={setViewMode} />
//       </div>

//       <div className="flex flex-col lg:flex-row gap-6 mb-32">
//         <FilterSidebar
//           categories={categories}
//           selectedCategories={selectedCategories}
//           expandedCategories={expandedCategories}
//           onToggleExpand={toggleExpanded}
//           onCategoryChange={handleCategoryChange}
//           priceRange={currentPriceRange}
//           minPrice={minPrice}
//           maxPrice={maxPrice}
//           onPriceChange={handlePriceChange}
//           fileTypes={fileTypes}
//           selectedFileTypes={selectedFileTypes}
//           onFileTypeChange={handleFileTypeChange}
//           onReset={resetAll}
//         />

//         <main className="flex-1">
//           <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
//             <ProductsHeader productsCount={products.length} loading={loading} />
//           </div>

//           {loading ? (
//             <ProductsSkeleton viewMode={viewMode} />
//           ) : products.length > 0 ? (
//             <motion.div
//               layout
//               className={`grid gap-6 ${
//                 viewMode === "grid"
//                   ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
//                   : "grid-cols-1"
//               }`}
//             >
//               {products.map((p) => (
//                 <motion.div key={p.id} layout whileHover={{ scale: 1.01 }}>
//                   <ProductCard product={p} view={viewMode} />
//                 </motion.div>
//               ))}
//             </motion.div>
//           ) : (
//             <EmptyState onReset={resetAll} />
//           )}

//           {!loading && products.length > 0 && totalPages > 1 && (
//             <div className="flex justify-center mt-8">
//               <Pagination
//                 total={totalPages}
//                 page={page}
//                 onChange={(p) => setPage(p)}
//                 showControls
//                 size="lg"
//               />
//             </div>
//           )}

//           {error && (
//             <Card className="mt-6 p-4 bg-danger-50 border-2 border-danger rounded-xl">
//               <p className="text-danger font-semibold">{error}</p>
//             </Card>
//           )}
//         </main>
//       </div>
//     </div>
//   );
// }


import { motion } from "framer-motion";
import type { Product } from "@/types";
import { ProductCard } from "./Productcard";
// import { SearchBar } from "./Searchbar";
// import { ViewModeToggle } from "./Viewmodetoggle";
// import { FilterSidebar } from "./Filtersidebar";
// import { ProductsHeader } from "./Productsheader";
// import { EmptyState } from "./Emptystate";
// import { PaginationWrapper } from "./Paginationwrapper";
import { CategoryApi } from "@/types";
import dynamic from "next/dynamic";
import FilterSidebar from "./Filtersidebar";

interface ProductGridProps {
  initialProducts: Product[];
  initialPage: number;
  initialTotalPages: number;
  categories: CategoryApi[];
  priceRange: { min: number; max: number };
  fileTypes: string[];
  searchParams: {
    search?: string;
    category_ids?: string;
    min_price?: string;
    max_price?: string;
    file_types?: string;
    page?: string;
  };
}

// const FilterSidebar = dynamic(() => import("./Filtersidebar"), { ssr: false });
const ProductsHeader = dynamic(() => import("./Productsheader"), { ssr: false });
const PaginationWrapper = dynamic(() => import("./Paginationwrapper"), { ssr: false });
const SearchBar = dynamic(() => import("./Searchbar"), { ssr: false });
const ViewModeToggle = dynamic(() => import("./Viewmodetoggle"), { ssr: false });
const EmptyState = dynamic(() => import("./Emptystate"), { ssr: false });

export default function ProductGrid({
  initialProducts,
  initialPage,
  initialTotalPages,
  categories,
  priceRange,
  fileTypes,
  searchParams,
}: ProductGridProps) {
  return (
    <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12 mt-12">
      <div className="flex items-center justify-between gap-4 mb-8">
        <SearchBar initialValue={searchParams.search} />
        <ViewModeToggle />
      </div>

      <div className="flex flex-col lg:flex-row gap-6 mb-32">
        <FilterSidebar
          categories={categories}
          priceRange={priceRange}
          fileTypes={fileTypes}
          searchParams={searchParams}
        />

        <main className="flex-1">
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <ProductsHeader productsCount={initialProducts.length} />
          </div>

          {initialProducts.length > 0 ? (
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {initialProducts.map((p) => (
                <ProductCard key={p.id} product={p} view="grid" />          
              ))}
            </div>
          ) : (
            <EmptyState />
          )}

          {initialProducts.length > 0 && initialTotalPages > 1 && (
            <PaginationWrapper
              currentPage={initialPage}
              totalPages={initialTotalPages}
            />
          )}
        </main>
      </div>
    </div>
  );
}
