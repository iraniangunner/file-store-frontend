// "use client";

// import { useEffect, useState, useCallback, useRef } from "react";
// import {
//   Card,
//   Input,
//   Button,
//   Checkbox,
//   CheckboxGroup,
//   Slider,
//   Divider,
//   Pagination,
//   Chip,
//   Skeleton,
// } from "@heroui/react";
// import {
//   DollarSign,
//   Filter,
//   Package,
//   RotateCcw,
//   Search,
//   X,
//   Grid3x3,
//   List,
// } from "lucide-react";
// import type { Product } from "@/types";
// import { ProductCard } from "./Productcard";
// import debounce from "lodash.debounce";

// export default function ProductGrid() {
//   // --- Parse from URL ---
//   const [initialLoaded, setInitialLoaded] = useState(false);
//   const [initialCategories, setInitialCategories] = useState<string[]>([]);
//   const [initialSearch, setInitialSearch] = useState("");
//   const [initialPage, setInitialPage] = useState(1);

//   useEffect(() => {
//     if (typeof window !== "undefined") {
//       const params = new URLSearchParams(window.location.search);
//       const cats = params.get("category_ids")
//         ? params.get("category_ids")!.split(",")
//         : [];
//       const search = params.get("search") || "";
//       const page = Number(params.get("page")) || 1;

//       setInitialCategories(cats);
//       setInitialSearch(search);
//       setInitialPage(page);
//       setPage(page);

//       setSelectedCategories(cats);
//       setSearchInput(search);
//       setSearchQuery(search);

//       setAppliedFilters({
//         categories: cats,
//         priceRange: [0, 0], // بعداً با min/max پر می‌شود
//       });

//       setInitialLoaded(true);
//     }
//   }, []);

//   // --- States ---
//   const [products, setProducts] = useState<Product[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   const [searchQuery, setSearchQuery] = useState("");
//   const [searchInput, setSearchInput] = useState("");

//   const [page, setPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);

//   const [categories, setCategories] = useState<{ id: number; name: string }[]>(
//     []
//   );
//   const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

//   const [minPrice, setMinPrice] = useState<number | null>(null);
//   const [maxPrice, setMaxPrice] = useState<number | null>(null);
//   const [priceRange, setPriceRange] = useState<[number, number] | null>(null);

//   const [appliedFilters, setAppliedFilters] = useState({
//     categories: [] as string[],
//     priceRange: [0, 0] as [number, number],
//   });

//   const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

//   useEffect(() => {
//     const controller = new AbortController();
//     (async () => {
//       try {
//         const res = await fetch("https://filerget.com/api/categories", {
//           signal: controller.signal,
//         });
//         if (!res.ok) throw new Error("Failed to fetch categories");
//         const data = await res.json();
//         setCategories(data.data || []);
//       } catch (err) {
//         if ((err as any).name !== "AbortError") console.error(err);
//       }
//     })();
//     return () => controller.abort();
//   }, []);

//   useEffect(() => {
//     const controller = new AbortController();
//     (async () => {
//       try {
//         const res = await fetch(
//           "https://filerget.com/api/products/meta/price-range",
//           { signal: controller.signal }
//         );
//         if (!res.ok) throw new Error("Failed to fetch price range");
//         const data = await res.json();
//         const min = Number(data.min_price) || 0;
//         const max = Number(data.max_price) || 1000;

//         setMinPrice(min);
//         setMaxPrice(max);

//         const params = new URLSearchParams(window.location.search);
//         const urlMin = Number(params.get("min_price")) || min;
//         const urlMax = Number(params.get("max_price")) || max;

//         setPriceRange([urlMin, urlMax]);
//         setAppliedFilters((prev) => ({
//           ...prev,
//           priceRange: [urlMin, urlMax],
//         }));
//       } catch (err) {
//         if ((err as any).name !== "AbortError") console.error(err);
//       }
//     })();
//     return () => controller.abort();
//   }, []);

//   const searchDebouncedRef = useRef(
//     debounce((value: string) => {
//       setSearchQuery(value);
//       setPage(1); // هر جستجو صفحه را 1 می‌کند
//     }, 500)
//   );

//   useEffect(() => {
//     return () => searchDebouncedRef.current.cancel();
//   }, []);

//   const fetchProducts = useCallback(
//     async (pageNumber = 1) => {
//       if (minPrice === null || maxPrice === null || priceRange === null) return;

//       const controller = new AbortController();
//       const signal = controller.signal;

//       try {
//         setLoading(true);

//         const params = new URLSearchParams();
//         if (searchQuery) params.append("search", searchQuery);
//         if (appliedFilters.categories.length)
//           params.append("category_ids", appliedFilters.categories.join(","));
//         if (appliedFilters.priceRange[0] > minPrice)
//           params.append("min_price", appliedFilters.priceRange[0].toString());
//         if (appliedFilters.priceRange[1] < maxPrice)
//           params.append("max_price", appliedFilters.priceRange[1].toString());
//         if (pageNumber > 1) params.append("page", pageNumber.toString());

//         const url = `https://filerget.com/api/products${
//           params.toString() ? `?${params.toString()}` : ""
//         }`;

//         const res = await fetch(url, { signal });
//         if (!res.ok) throw new Error(`Fetch failed with status ${res.status}`);
//         const data = await res.json();

//         setProducts(data.data);
//         setPage(data.current_page);
//         setTotalPages(data.last_page);

//         if (typeof window !== "undefined") {
//           const newQuery = params.toString();
//           const current = window.location.search.slice(1);
//           if (current !== newQuery) {
//             const newUrl = newQuery ? `/products?${newQuery}` : `/products`;
//             window.history.replaceState({}, "", newUrl);
//           }
//         }

//         setError("");
//       } catch (err) {
//         if ((err as any).name !== "AbortError") {
//           console.error(err);
//           setError("Failed to load products.");
//         }
//       } finally {
//         setLoading(false);
//       }

//       return () => controller.abort();
//     },
//     [searchQuery, appliedFilters, minPrice, maxPrice, priceRange]
//   );

//   useEffect(() => {
//     if (initialLoaded && appliedFilters.priceRange[1] !== 0) {
//       fetchProducts(page);
//     }
//   }, [appliedFilters, searchQuery, minPrice, maxPrice, initialLoaded, page]);

//   const clearCategoryFilter = (categoryId: string) => {
//     const newCategories = selectedCategories.filter((c) => c !== categoryId);
//     setSelectedCategories(newCategories);
//     setAppliedFilters((prev) => ({
//       ...prev,
//       categories: newCategories,
//     }));
//     setPage(1);
//   };

//   const getCategoryName = (id: string) => {
//     return categories.find((c) => c.id === Number(id))?.name || id;
//   };

//   if (!initialLoaded)
//     return (
//       <div className="h-screen flex items-center justify-center">
//         <div className="text-center space-y-4">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" />
//           <p className="text-default-500">Loading products...</p>
//         </div>
//       </div>
//     );

//   return (
//     <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-16 mt-16">
//       <div className="mb-8">
//         <div className="relative w-full max-w-2xl mx-auto">
//           <Input
//             placeholder="Search for products..."
//             value={searchInput}
//             onChange={(e) => {
//               setSearchInput(e.currentTarget.value);
//               searchDebouncedRef.current(e.currentTarget.value);
//             }}
//             size="lg"
//             startContent={<Search className="w-5 h-5 text-default-400" />}
//             endContent={
//               searchInput && (
//                 <Button
//                   isIconOnly
//                   size="sm"
//                   variant="light"
//                   onPress={() => {
//                     setSearchInput("");
//                     setSearchQuery("");
//                   }}
//                 >
//                   <X className="w-4 h-4" />
//                 </Button>
//               )
//             }
//             classNames={{
//               input: "text-base",
//               inputWrapper: "shadow-md hover:shadow-lg transition-shadow",
//             }}
//           />
//         </div>
//       </div>

//       <div className="flex flex-col lg:flex-row items-start gap-6 lg:gap-8">
//         <Card className="w-full lg:w-80 p-6 border-2 border-divider rounded-2xl shadow-lg bg-content1 self-start lg:sticky lg:top-20">
//           <div className="flex items-center justify-between mb-5">
//             <h2 className="font-bold text-foreground text-lg flex items-center gap-2">
//               <Filter className="w-5 h-5 text-primary" /> Filters
//             </h2>
//             <Button
//               size="sm"
//               variant="light"
//               color="danger"
//               onPress={() => {
//                 if (minPrice !== null && maxPrice !== null) {
//                   const newRange: [number, number] = [minPrice, maxPrice];
//                   setSelectedCategories([]);
//                   setPriceRange(newRange);
//                   setAppliedFilters({ categories: [], priceRange: newRange });
//                   setSearchInput("");
//                   setSearchQuery("");
//                 }
//               }}
//               startContent={<RotateCcw className="w-4 h-4" />}
//               className="font-semibold"
//             >
//               Reset All
//             </Button>
//           </div>
//           <Divider className="mb-5" />

//           <div className="space-y-6">
//             <div>
//               <h3 className="font-bold text-foreground text-base mb-3 flex items-center gap-2">
//                 <Package className="w-5 h-5 text-primary" /> Categories
//               </h3>
//               <CheckboxGroup
//                 value={selectedCategories}
//                 onValueChange={(values) =>
//                   setSelectedCategories(values as string[])
//                 }
//                 classNames={{
//                   wrapper: "gap-2",
//                 }}
//               >
//                 {categories.map((c) => (
//                   <Checkbox
//                     key={c.id}
//                     value={String(c.id)}
//                     classNames={{
//                       label: "text-sm font-medium",
//                     }}
//                   >
//                     {c.name}
//                   </Checkbox>
//                 ))}
//               </CheckboxGroup>
//             </div>

//             <Divider />

//             <div>
//               <h3 className="font-bold text-foreground text-base mb-3 flex items-center gap-2">
//                 <DollarSign className="w-5 h-5 text-primary" /> Price Range
//               </h3>
//               <div className="bg-default-100 rounded-lg p-3 mb-4">
//                 <p className="text-base font-semibold text-foreground text-center">
//                   {priceRange ? `$${priceRange[0]} - $${priceRange[1]}` : ""}
//                 </p>
//               </div>
//               {minPrice !== null && maxPrice !== null && (
//                 <Slider
//                   minValue={minPrice}
//                   maxValue={maxPrice}
//                   step={1}
//                   value={priceRange ?? [minPrice ?? 0, maxPrice ?? 1000]}
//                   onChange={(v) => {
//                     if (Array.isArray(v)) setPriceRange(v as [number, number]);
//                   }}
//                   aria-label="Price range slider"
//                   color="primary"
//                   size="lg"
//                   classNames={{
//                     track: "h-2",
//                     thumb: "w-5 h-5",
//                   }}
//                 />
//               )}
//             </div>

//             <Button

//               size="lg"
//               onPress={() => {
//                 if (priceRange !== null) {
//                   setAppliedFilters({
//                     categories: selectedCategories,
//                     priceRange,
//                   });
//                   setPage(1);
//                 }
//               }}
//               className="w-full shadow-lg bg-gradient-to-r from-[#3B9FE8] to-[#3D3D8F] text-white font-semibold"
//               startContent={<Filter className="w-5 h-5" />}
//             >
//               Apply Filters
//             </Button>
//           </div>
//         </Card>

//         <div className="flex-1 w-full">
//           {/* Active filters display and product count */}
//           <div className="mb-6 space-y-4">
//             <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
//               <div>
//                 <h2 className="text-2xl font-bold text-foreground">Products</h2>
//                 {!loading && (
//                   <p className="text-sm text-default-500 mt-1">
//                     {products.length} products found
//                   </p>
//                 )}
//               </div>

//               <div className="flex items-center gap-2">
//                 <Button
//                   isIconOnly
//                   variant={viewMode === "grid" ? "solid" : "flat"}
//                   color={viewMode === "grid" ? "primary" : "default"}
//                   onPress={() => setViewMode("grid")}
//                   size="sm"
//                 >
//                   <Grid3x3 className="w-4 h-4" />
//                 </Button>
//                 <Button
//                   isIconOnly
//                   variant={viewMode === "list" ? "solid" : "flat"}
//                   color={viewMode === "list" ? "primary" : "default"}
//                   onPress={() => setViewMode("list")}
//                   size="sm"
//                 >
//                   <List className="w-4 h-4" />
//                 </Button>
//               </div>
//             </div>

//             {(appliedFilters.categories.length > 0 || searchQuery) && (
//               <div className="flex flex-wrap items-center gap-2">
//                 <span className="text-sm font-medium text-default-500">
//                   Active filters:
//                 </span>
//                 {searchQuery && (
//                   <Chip
//                     onClose={() => {
//                       setSearchInput("");
//                       setSearchQuery("");
//                     }}
//                     variant="flat"
//                     color="primary"
//                   >
//                     Search: {searchQuery}
//                   </Chip>
//                 )}
//                 {appliedFilters.categories.map((catId) => (
//                   <Chip
//                     key={catId}
//                     onClose={() => clearCategoryFilter(catId)}
//                     variant="flat"
//                     color="secondary"
//                   >
//                     {getCategoryName(catId)}
//                   </Chip>
//                 ))}
//               </div>
//             )}
//           </div>

//           {loading ? (
//             <div
//               className={`grid gap-6 ${
//                 viewMode === "grid"
//                   ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
//                   : "grid-cols-1"
//               }`}
//             >
//               {[...Array(6)].map((_, i) => (
//                 <Card key={i} className="rounded-2xl">
//                   <Skeleton className="rounded-t-2xl">
//                     <div className="h-[240px] rounded-t-2xl bg-default-300" />
//                   </Skeleton>
//                   <div className="p-5 space-y-3">
//                     <Skeleton className="w-3/4 rounded-lg">
//                       <div className="h-6 w-3/4 rounded-lg bg-default-200" />
//                     </Skeleton>
//                     <Skeleton className="w-full rounded-lg">
//                       <div className="h-4 w-full rounded-lg bg-default-200" />
//                     </Skeleton>
//                     <Skeleton className="w-2/3 rounded-lg">
//                       <div className="h-4 w-2/3 rounded-lg bg-default-200" />
//                     </Skeleton>
//                   </div>
//                 </Card>
//               ))}
//             </div>
//           ) : products.length > 0 ? (
//             <div
//               className={`grid gap-6 ${
//                 viewMode === "grid"
//                   ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
//                   : "grid-cols-1"
//               }`}
//             >
//               {products.map((p) => (
//                 <ProductCard key={p.id} product={p} />
//               ))}
//             </div>
//           ) : (
//             <Card className="p-12 text-center rounded-2xl border-2 border-dashed border-divider">
//               <div className="space-y-4">
//                 <div className="w-20 h-20 mx-auto bg-default-100 rounded-full flex items-center justify-center">
//                   <Package className="w-10 h-10 text-default-400" />
//                 </div>
//                 <div>
//                   <h3 className="text-xl font-bold text-foreground mb-2">
//                     No products found
//                   </h3>
//                   <p className="text-default-500 mb-4">
//                     Try adjusting your filters or search query
//                   </p>
//                   <Button
//                     color="primary"
//                     variant="flat"
//                     onPress={() => {
//                       if (minPrice !== null && maxPrice !== null) {
//                         const newRange: [number, number] = [minPrice, maxPrice];
//                         setSelectedCategories([]);
//                         setPriceRange(newRange);
//                         setAppliedFilters({
//                           categories: [],
//                           priceRange: newRange,
//                         });
//                         setSearchInput("");
//                         setSearchQuery("");
//                       }
//                     }}
//                     startContent={<RotateCcw className="w-4 h-4" />}
//                   >
//                     Clear All Filters
//                   </Button>
//                 </div>
//               </div>
//             </Card>
//           )}
//         </div>
//       </div>

//       {!loading && products.length > 0 && totalPages > 1 && (
//         <div className="flex justify-center mt-12">
//           <Pagination
//             total={totalPages}
//             page={page}
//             onChange={setPage}
//             showControls
//             color="primary"
//             size="lg"
//             classNames={{
//               wrapper: "gap-2",
//               item: "font-semibold",
//             }}
//           />
//         </div>
//       )}

//       {/* Error */}
//       {error && (
//         <Card className="mt-6 p-4 bg-danger-50 border-2 border-danger rounded-xl">
//           <p className="text-danger font-semibold">{error}</p>
//         </Card>
//       )}
//     </div>
//   );
// }

"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import debounce from "lodash.debounce";
import { motion } from "framer-motion";
import {
  Card,
  Input,
  Button,
  Checkbox,
  CheckboxGroup,
  Slider,
  Divider,
  Pagination,
  Chip,
  Skeleton,
  Drawer,
  // IconButton,
} from "@heroui/react";
import {
  Search,
  Filter,
  Grid3x3,
  List,
  RotateCcw,
  Package,
  DollarSign,
  X,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import type { Product } from "@/types";
import { ProductCard } from "./Productcard";

/**
 * Assumptions about API shapes:
 * - GET /api/categories -> { success: true, data: Category[] } where Category has children_recursive: Category[]
 * - GET /api/products?search=&category_ids=1,2&min_price=&max_price=&page= -> paginated { data: Product[], current_page, last_page }
 * - GET /api/products/meta/price-range -> { min_price, max_price }
 *
 * Replace endpoints if needed.
 */

/* ---------- Types ---------- */
type CategoryApi = {
  id: number;
  name: string;
  parent_id?: number | null;
  children_recursive?: CategoryApi[];
};

type ProductsResponse = {
  data: Product[];
  current_page: number;
  last_page: number;
};

/* ---------- Helpers ---------- */
const collectCategoryIds = (cats: CategoryApi[], selected: string[]) => {
  // If a parent is selected, include all descendants' ids as strings
  const map = new Set<string>();
  const visit = (node: CategoryApi) => {
    map.add(String(node.id));
    (node.children_recursive || []).forEach(visit);
  };

  const rootById: Record<number, CategoryApi> = {};
  const index = (nodes: CategoryApi[]) => {
    for (const n of nodes) {
      rootById[n.id] = n;
      if (n.children_recursive?.length) index(n.children_recursive);
    }
  };
  index(cats);

  for (const s of selected) {
    const id = Number(s);
    if (rootById[id]) visit(rootById[id]);
    else map.add(s);
  }

  return Array.from(map);
};

const findCategoryName = (cats: CategoryApi[], id: number): string | null => {
  for (const c of cats) {
    if (c.id === id) return c.name;
    if (c.children_recursive) {
      const found = findCategoryName(c.children_recursive, id);
      if (found) return found;
    }
  }
  return null;
};

/* ---------- Main Component ---------- */
export default function ProductGrid() {
  // --- initial URL parse & flags ---
  const [initialLoaded, setInitialLoaded] = useState(false);
 useEffect(() => {
  if (typeof window === "undefined") return;
  const params = new URLSearchParams(window.location.search);
  const cats = params.get("category_ids") ? params.get("category_ids")!.split(",") : [];
  const search = params.get("search") || "";
  const page = Number(params.get("page")) || 1;
  const min = params.get("min_price");
  const max = params.get("max_price");

  setSelectedCategories(cats);
  setSearchInput(search);
  setSearchQuery(search);
  setPage(page);

  const pr = min !== null && max !== null ? [Number(min), Number(max)] as [number, number] : null;
  setPriceRange(pr);

  // 🔥 اضافه کردن این خط:
  setAppliedFilters({
    categories: cats,
    priceRange: pr ?? [0, 0],
  });

  setInitialLoaded(true);
}, []);


  // --- data states ---
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // --- search & debounce ---
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const searchDebouncedRef = useRef(
    debounce((value: string) => {
      setSearchQuery(value);
      setPage(1);
    }, 500)
  );
  useEffect(() => {
    return () => searchDebouncedRef.current.cancel();
  }, []);

  // --- pagination ---
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // --- categories (tree) ---
  const [categories, setCategories] = useState<CategoryApi[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [expandedCategories, setExpandedCategories] = useState<
    Record<number, boolean>
  >({});

  // --- price range ---
  const [minPrice, setMinPrice] = useState<number | null>(null);
  const [maxPrice, setMaxPrice] = useState<number | null>(null);
  const [priceRange, setPriceRange] = useState<[number, number] | null>(null);

  // --- applied filters (committed) ---
  const [appliedFilters, setAppliedFilters] = useState({
    categories: [] as string[],
    priceRange: [0, 0] as [number, number],
  });

  // --- UI state ---
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  // const [drawerOpen, setDrawerOpen] = useState(false);

  /* ---------- Fetch categories ---------- */
  useEffect(() => {
    const ctrl = new AbortController();

    (async () => {
      try {
        const res = await fetch("https://filerget.com/api/categories", {
          signal: ctrl.signal,
        });
        if (!res.ok) throw new Error("Failed to fetch categories");

        const json = await res.json();
        const data: CategoryApi[] = json.data || [];

        setCategories(data);

        // 🔥 به‌صورت پیش‌فرض همه والدهایی که child دارند را باز کن
        const expandedDefault: Record<number, boolean> = {};

        const walk = (nodes: CategoryApi[]) => {
          nodes.forEach((n) => {
            if (n.children_recursive && n.children_recursive.length > 0) {
              expandedDefault[n.id] = true; // ← پیش‌فرض باز
              walk(n.children_recursive);
            }
          });
        };

        walk(data);

        setExpandedCategories(expandedDefault);
      } catch (e) {
        if ((e as any).name !== "AbortError") console.error(e);
      }
    })();

    return () => ctrl.abort();
  }, []);

  /* ---------- Fetch price range ---------- */
  useEffect(() => {
    const ctrl = new AbortController();
    (async () => {
      try {
        const res = await fetch(
          "https://filerget.com/api/products/meta/price-range",
          { signal: ctrl.signal }
        );
        if (!res.ok) throw new Error("Failed to fetch price range");
        const json = await res.json();
        const min = Number(json.min_price) || 0;
        const max = Number(json.max_price) || 1000;
        setMinPrice(min);
        setMaxPrice(max);

        // initialize if not set by URL
        setPriceRange((prev) => prev ?? [min, max]);
        setAppliedFilters((prev) => ({
          ...prev,
          priceRange: prev.priceRange[1] === 0 ? [min, max] : prev.priceRange,
        }));
      } catch (e) {
        if ((e as any).name !== "AbortError") console.error(e);
      }
    })();
    return () => ctrl.abort();
  }, []);

  /* ---------- Build fetchProducts ---------- */
  const fetchProducts = useCallback(
    async (pageNumber = 1) => {
      // ensure price range loaded
      if (minPrice === null || maxPrice === null || priceRange === null) return;
      const ctrl = new AbortController();
      const signal = ctrl.signal;

      try {
        setLoading(true);
        const params = new URLSearchParams();
        if (searchQuery) params.append("search", searchQuery);

        // collect all descendant ids for selected categories
        if (appliedFilters.categories.length) {
          const allIds = collectCategoryIds(
            categories,
            appliedFilters.categories
          );
          if (allIds.length) params.append("category_ids", allIds.join(","));
        }

        if (appliedFilters.priceRange[0] > minPrice)
          params.append("min_price", String(appliedFilters.priceRange[0]));
        if (appliedFilters.priceRange[1] < maxPrice)
          params.append("max_price", String(appliedFilters.priceRange[1]));
        if (pageNumber > 1) params.append("page", String(pageNumber));

        const url = `https://filerget.com/api/products${
          params.toString() ? `?${params.toString()}` : ""
        }`;
        const res = await fetch(url, { signal });
        if (!res.ok) throw new Error(`Failed to fetch products: ${res.status}`);
        const json: ProductsResponse = await res.json();

        setProducts(json.data || []);
        setPage(json.current_page || pageNumber);
        setTotalPages(json.last_page || 1);

        // sync URL (replace)
        if (typeof window !== "undefined") {
          const newQuery = params.toString();
          const current = window.location.search.slice(1);
          if (current !== newQuery) {
            const newUrl = newQuery ? `/products?${newQuery}` : `/products`;
            window.history.replaceState({}, "", newUrl);
          }
        }

        setError("");
      } catch (e) {
        if ((e as any).name !== "AbortError") {
          console.error(e);
          setError("Failed to load products.");
        }
      } finally {
        setLoading(false);
      }

      return () => ctrl.abort();
    },
    [appliedFilters, searchQuery, minPrice, maxPrice, categories]
  );

  /* ---------- auto fetch on filters change ---------- */
  useEffect(() => {
    if (!initialLoaded) return;
    // avoid calling before price range or categories ready
    if (priceRange === null || minPrice === null || maxPrice === null) return;
    fetchProducts(page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appliedFilters, searchQuery, page, initialLoaded]);

  /* ---------- Category Tree rendering ---------- */
  const toggleExpanded = (id: number) => {
    setExpandedCategories((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const renderCategoryTree = (nodes: CategoryApi[]) => {
    return nodes.map((n) => {
      const hasChildren = (n.children_recursive || []).length > 0;
      const expanded = !!expandedCategories[n.id];
      const isRoot = n.parent_id === null; // 🔥 تشخیص دسته والد

      return (
        <div key={n.id} className="mb-1">
          <div className="flex items-center gap-2">
            {/* آیکون باز/بسته شدن */}
            {hasChildren ? (
              <button
                onClick={() => toggleExpanded(n.id)}
                aria-label="toggle"
                className="p-1 rounded hover:bg-default-100"
              >
                {expanded ? (
                  <ChevronDown className="w-4 h-4" />
                ) : (
                  <ChevronRight className="w-4 h-4" />
                )}
              </button>
            ) : (
              <div className="w-4" />
            )}

            {/* 🔥 دسته‌های والد (parent_id null) بدون Checkbox */}
            {isRoot ? (
              <span className="font-semibold text-sm text-foreground">
                {n.name}
              </span>
            ) : (
              /* دسته‌های فرزند با Checkbox */
              <Checkbox
                value={String(n.id)}
                classNames={{ wrapper: "flex items-center gap-2" }}
              >
                <span className="text-sm">{n.name}</span>
              </Checkbox>
            )}
          </div>

          {hasChildren && expanded && (
            <div className="pl-5 mt-2 border-l border-default-100">
              {renderCategoryTree(n.children_recursive || [])}
            </div>
          )}
        </div>
      );
    });
  };

  /* ---------- UI actions ---------- */
  const applyFilters = () => {
    setAppliedFilters({
      categories: selectedCategories,
      priceRange: priceRange ?? [minPrice ?? 0, maxPrice ?? 0],
    });
    setPage(1);
    // setDrawerOpen(false);
  };

  const resetAll = () => {
    if (minPrice === null || maxPrice === null) return;
    setSelectedCategories([]);
    setPriceRange([minPrice, maxPrice]);
    setAppliedFilters({ categories: [], priceRange: [minPrice, maxPrice] });
    setSearchInput("");
    setSearchQuery("");
    setPage(1);
  };

  const clearCategoryChip = (id: string) => {
    const newSel = appliedFilters.categories.filter((c) => c !== id);
    setAppliedFilters((prev) => ({ ...prev, categories: newSel }));
    setSelectedCategories((prev) => prev.filter((p) => p !== id));
    setPage(1);
  };

  const getCatName = (id: string) => {
    const found = findCategoryName(categories, Number(id));
    return found ?? id;
  };

  /* ---------- Render ---------- */
  return (
    <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12">
      {/* Header: search + filter button */}
      <div className="flex items-center justify-between gap-4 mb-8">
        <div className="flex-1 max-w-2xl">
          <Input
            placeholder="Search products..."
            value={searchInput}
            onChange={(e) => {
              setSearchInput(e.currentTarget.value);
              searchDebouncedRef.current(e.currentTarget.value);
            }}
            size="lg"
            startContent={<Search className="w-5 h-5" />}
            endContent={
              searchInput && (
                <Button
                  isIconOnly
                  size="sm"
                  variant="light"
                  onPress={() => {
                    setSearchInput("");
                    setSearchQuery("");
                  }}
                >
                  <X className="w-4 h-4" />
                </Button>
              )
            }
            classNames={{ input: "text-base", inputWrapper: "shadow-sm" }}
          />
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-2">
            <Button
              isIconOnly
              variant={viewMode === "grid" ? "solid" : "flat"}
              color={viewMode === "grid" ? "primary" : "default"}
              onPress={() => setViewMode("grid")}
              size="sm"
            >
              <Grid3x3 className="w-4 h-4" />
            </Button>
            <Button
              isIconOnly
              variant={viewMode === "list" ? "solid" : "flat"}
              color={viewMode === "list" ? "primary" : "default"}
              onPress={() => setViewMode("list")}
              size="sm"
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left: Desktop sticky filter card */}
        <aside className="lg:w-80">
          <Card className="p-6 border-2 border-divider rounded-2xl shadow-sm sticky top-20">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold flex items-center gap-2 text-foreground">
                <Filter className="w-5 h-5 text-primary" /> Filters
              </h3>
              <Button
                size="sm"
                variant="light"
                color="danger"
                onPress={resetAll}
                startContent={<RotateCcw className="w-4 h-4" />}
              >
                Reset
              </Button>
            </div>

            <Divider className="mb-4" />

            {/* Categories Tree */}
            <div className="mb-4">
              <h4 className="font-medium mb-3 flex items-center gap-2">
                <Package className="w-4 h-4 text-primary" /> Categories
              </h4>

              <CheckboxGroup
                value={selectedCategories}
                onValueChange={(vals) =>
                  setSelectedCategories(vals as string[])
                }
              >
                <div className="max-h-60 overflow-auto pr-2">
                  {renderCategoryTree(
                    categories.filter((c) => c.parent_id === null)
                  )}
                </div>
              </CheckboxGroup>
            </div>

            <Divider className="mb-4" />

            {/* Price */}
            <div className="mb-4">
              <h4 className="font-medium mb-3 flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-primary" /> Price
              </h4>

              <div className="text-sm mb-2">
                {priceRange ? `$${priceRange[0]} - $${priceRange[1]}` : ""}
              </div>
              {minPrice !== null && maxPrice !== null && (
                <Slider
                  minValue={minPrice}
                  maxValue={maxPrice}
                  value={priceRange ?? [minPrice, maxPrice]}
                  step={1}
                  onChange={(v) =>
                    Array.isArray(v) && setPriceRange(v as [number, number])
                  }
                />
              )}
            </div>

            <Button
              className="w-full mt-2"
              size="lg"
              onPress={applyFilters}
              startContent={<Filter className="w-4 h-4" />}
            >
              Apply Filters
            </Button>
          </Card>
        </aside>

        {/* Main content */}
        <main className="flex-1">
          {/* Active filters */}
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold">Products</h2>
              {!loading && (
                <p className="text-sm text-default-500 mt-1">
                  {products.length} products
                </p>
              )}
            </div>

            <div className="flex items-center gap-2">
              {searchQuery && (
                <Chip
                  onClose={() => {
                    setSearchInput("");
                    setSearchQuery("");
                  }}
                >
                  Search: {searchQuery}
                </Chip>
              )}
              {appliedFilters.categories.map((c) => (
                <Chip key={c} onClose={() => clearCategoryChip(c)}>
                  {getCatName(c)}
                </Chip>
              ))}
              <Button
                size="sm"
                variant="light"
                onPress={resetAll}
                startContent={<RotateCcw className="w-4 h-4" />}
              >
                Clear
              </Button>
            </div>
          </div>

          {/* Products area */}
          {loading ? (
            <div
              className={`grid gap-6 ${
                viewMode === "grid"
                  ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                  : "grid-cols-1"
              }`}
            >
              {[...Array(6)].map((_, i) => (
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
          ) : products.length > 0 ? (
            <motion.div
              layout
              className={`grid gap-6 ${
                viewMode === "grid"
                  ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                  : "grid-cols-1"
              }`}
            >
              {products.map((p) => (
                <motion.div key={p.id} layout whileHover={{ scale: 1.01 }}>
                  <ProductCard product={p} view={viewMode} />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <Card className="p-12 text-center rounded-2xl border-2 border-dashed border-divider">
              <div className="space-y-4">
                <div className="w-20 h-20 mx-auto bg-default-100 rounded-full flex items-center justify-center">
                  <Package className="w-10 h-10 text-default-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">No products found</h3>
                  <p className="text-default-500 mb-4">
                    Try adjusting your filters or search query
                  </p>
                  <Button
                    onPress={resetAll}
                    startContent={<RotateCcw className="w-4 h-4" />}
                  >
                    Reset filters
                  </Button>
                </div>
              </div>
            </Card>
          )}

          {/* Pagination */}
          {!loading && products.length > 0 && totalPages > 1 && (
            <div className="flex justify-center mt-8">
              <Pagination
                total={totalPages}
                page={page}
                onChange={(p) => setPage(p)}
                showControls
                size="lg"
              />
            </div>
          )}

          {/* Error */}
          {error && (
            <Card className="mt-6 p-4 bg-danger-50 border-2 border-danger rounded-xl">
              <p className="text-danger font-semibold">{error}</p>
            </Card>
          )}
        </main>
      </div>
    </div>
  );
}
