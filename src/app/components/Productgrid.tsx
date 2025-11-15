"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import debounce from "lodash.debounce";
import { motion, AnimatePresence } from "framer-motion";
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
  ChevronRight,
  File,
} from "lucide-react";
import type { Product } from "@/types";
import { ProductCard } from "./Productcard";

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
    const cats = params.get("category_ids")
      ? params.get("category_ids")!.split(",")
      : [];
    const search = params.get("search") || "";
    const page = Number(params.get("page")) || 1;
    const min = params.get("min_price");
    const max = params.get("max_price");
    const fileTypes = params.get("file_types")
      ? params.get("file_types")!.split(",")
      : [];

    setSelectedCategories(cats);
    setSearchInput(search);
    setSearchQuery(search);
    setPage(page);

    const pr =
      min !== null && max !== null
        ? ([Number(min), Number(max)] as [number, number])
        : null;
    setPriceRange(pr);

    setSelectedFileTypes(fileTypes);

    setAppliedFilters({
      categories: cats,
      priceRange: pr ?? [0, 0],
      fileTypes: fileTypes,
    });

    setInitialLoaded(true);
  }, []);

  // --- data states ---
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // file-types
  const [fileTypes, setFileTypes] = useState<string[]>([]);
  const [selectedFileTypes, setSelectedFileTypes] = useState<string[]>([]);

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
    fileTypes: [] as string[],
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

  useEffect(() => {
    const controller = new AbortController();

    (async () => {
      try {
        const res = await fetch(
          "https://filerget.com/api/products/meta/file-types",
          {
            signal: controller.signal,
          }
        );
        const json = await res.json();
        setFileTypes(json.data || []);
      } catch (e) {
        if ((e as any).name !== "AbortError") console.error(e);
      }
    })();

    return () => controller.abort();
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

        if (appliedFilters.fileTypes?.length) {
          params.append("file_types", appliedFilters.fileTypes.join(","));
        }

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
      const isRoot = n.parent_id === null;

      return (
        <div key={n.id} className="mb-1">
          {/* CLICKABLE ROW */}
          <div
            className="
              flex items-center justify-between
              cursor-pointer p-2 rounded-lg
              hover:bg-default-100 transition
            "
            onClick={() => hasChildren && toggleExpanded(n.id)}
          >
            {/* LEFT: name or checkbox */}
            <div className="flex items-center gap-2">
              {isRoot ? (
                <span className="font-semibold text-sm">{n.name}</span>
              ) : (
                <Checkbox
                  value={String(n.id)}
                  onClick={(e) => e.stopPropagation()}
                >
                  <span className="text-sm">{n.name}</span>
                </Checkbox>
              )}
            </div>

            {/* RIGHT: Arrow */}
            <div className="flex items-center">
              {hasChildren ? (
                <motion.div
                  animate={{ rotate: expanded ? 90 : 0 }}
                  transition={{ duration: 0.25 }}
                >
                  <ChevronRight className="w-4 h-4 text-primary" />
                </motion.div>
              ) : (
                <div className="w-4" />
              )}
            </div>
          </div>

          {/* COLLAPSIBLE CHILDREN */}
          <AnimatePresence initial={false}>
            {expanded && hasChildren && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="pl-4 border-l border-default-200 overflow-hidden"
              >
                <div className="mt-2">
                  {renderCategoryTree(n.children_recursive || [])}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      );
    });
  };

  /* ---------- UI actions ---------- */
  const applyFilters = () => {
    setAppliedFilters({
      categories: selectedCategories,
      priceRange: priceRange ?? [minPrice ?? 0, maxPrice ?? 0],
      fileTypes: selectedFileTypes,
    });
    setPage(1);
  };

  const resetAll = () => {
    if (minPrice === null || maxPrice === null) return;
    setSelectedCategories([]);
    setSelectedFileTypes([]);
    setPriceRange([minPrice, maxPrice]);
    setAppliedFilters({
      categories: [],
      priceRange: [minPrice, maxPrice],
      fileTypes: [],
    });
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
    <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12 mt-12">
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

      <div className="flex flex-col lg:flex-row gap-6 mb-32">
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
                <div className="max-h-80 overflow-auto pr-2">
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

            <Divider className="mb-4" />

            {/* File Types */}
            <div className="mb-4">
              <h4 className="font-medium mb-3 flex items-center gap-2">
                <File className="w-4 h-4 text-primary" /> File Types
              </h4>

              <CheckboxGroup
                value={selectedFileTypes}
                onValueChange={(vals) => setSelectedFileTypes(vals as string[])}
              >
                <div className="flex flex-col gap-2">
                  {fileTypes.map((ft) => (
                    <Checkbox key={ft} value={ft}>
                      {ft.toUpperCase()}
                    </Checkbox>
                  ))}
                </div>
              </CheckboxGroup>
            </div>

            <Button
              className="w-full mt-2  bg-gradient-to-r from-[#3B9FE8] to-[#3D3D8F] text-white font-semibold"
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
