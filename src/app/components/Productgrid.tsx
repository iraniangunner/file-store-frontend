"use client";

import { useEffect, useState, useCallback, useRef } from "react";
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
  DollarSign,
  Filter,
  Package,
  RotateCcw,
  Search,
  X,
  Grid3x3,
  List,
} from "lucide-react";
import type { Product } from "@/types";
import { ProductCard } from "./Productcard";
import debounce from "lodash.debounce";

export default function ProductGrid() {
  // --- Parse from URL ---
  const [initialLoaded, setInitialLoaded] = useState(false);
  const [initialCategories, setInitialCategories] = useState<string[]>([]);
  const [initialSearch, setInitialSearch] = useState("");
  const [initialPage, setInitialPage] = useState(1);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const cats = params.get("category_ids")
        ? params.get("category_ids")!.split(",")
        : [];
      const search = params.get("search") || "";
      const page = Number(params.get("page")) || 1;

      setInitialCategories(cats);
      setInitialSearch(search);
      setInitialPage(page);
      setPage(page);

      setSelectedCategories(cats);
      setSearchInput(search);
      setSearchQuery(search);

      setAppliedFilters({
        categories: cats,
        priceRange: [0, 0], // بعداً با min/max پر می‌شود
      });

      setInitialLoaded(true);
    }
  }, []);

  // --- States ---
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchQuery, setSearchQuery] = useState("");
  const [searchInput, setSearchInput] = useState("");

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [categories, setCategories] = useState<{ id: number; name: string }[]>(
    []
  );
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const [minPrice, setMinPrice] = useState<number | null>(null);
  const [maxPrice, setMaxPrice] = useState<number | null>(null);
  const [priceRange, setPriceRange] = useState<[number, number] | null>(null);

  const [appliedFilters, setAppliedFilters] = useState({
    categories: [] as string[],
    priceRange: [0, 0] as [number, number],
  });

  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  useEffect(() => {
    const controller = new AbortController();
    (async () => {
      try {
        const res = await fetch("https://filerget.com/api/categories", {
          signal: controller.signal,
        });
        if (!res.ok) throw new Error("Failed to fetch categories");
        const data = await res.json();
        setCategories(data.data || []);
      } catch (err) {
        if ((err as any).name !== "AbortError") console.error(err);
      }
    })();
    return () => controller.abort();
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    (async () => {
      try {
        const res = await fetch(
          "https://filerget.com/api/products/meta/price-range",
          { signal: controller.signal }
        );
        if (!res.ok) throw new Error("Failed to fetch price range");
        const data = await res.json();
        const min = Number(data.min_price) || 0;
        const max = Number(data.max_price) || 1000;

        setMinPrice(min);
        setMaxPrice(max);

        const params = new URLSearchParams(window.location.search);
        const urlMin = Number(params.get("min_price")) || min;
        const urlMax = Number(params.get("max_price")) || max;

        setPriceRange([urlMin, urlMax]);
        setAppliedFilters((prev) => ({
          ...prev,
          priceRange: [urlMin, urlMax],
        }));
      } catch (err) {
        if ((err as any).name !== "AbortError") console.error(err);
      }
    })();
    return () => controller.abort();
  }, []);

  const searchDebouncedRef = useRef(
    debounce((value: string) => {
      setSearchQuery(value);
      setPage(1); // هر جستجو صفحه را 1 می‌کند
    }, 500)
  );

  useEffect(() => {
    return () => searchDebouncedRef.current.cancel();
  }, []);

  const fetchProducts = useCallback(
    async (pageNumber = 1) => {
      if (minPrice === null || maxPrice === null || priceRange === null) return;

      const controller = new AbortController();
      const signal = controller.signal;

      try {
        setLoading(true);

        const params = new URLSearchParams();
        if (searchQuery) params.append("search", searchQuery);
        if (appliedFilters.categories.length)
          params.append("category_ids", appliedFilters.categories.join(","));
        if (appliedFilters.priceRange[0] > minPrice)
          params.append("min_price", appliedFilters.priceRange[0].toString());
        if (appliedFilters.priceRange[1] < maxPrice)
          params.append("max_price", appliedFilters.priceRange[1].toString());
        if (pageNumber > 1) params.append("page", pageNumber.toString());

        const url = `https://filerget.com/api/products${
          params.toString() ? `?${params.toString()}` : ""
        }`;

        const res = await fetch(url, { signal });
        if (!res.ok) throw new Error(`Fetch failed with status ${res.status}`);
        const data = await res.json();

        setProducts(data.data);
        setPage(data.current_page);
        setTotalPages(data.last_page);

        if (typeof window !== "undefined") {
          const newQuery = params.toString();
          const current = window.location.search.slice(1);
          if (current !== newQuery) {
            const newUrl = newQuery ? `/products?${newQuery}` : `/products`;
            window.history.replaceState({}, "", newUrl);
          }
        }

        setError("");
      } catch (err) {
        if ((err as any).name !== "AbortError") {
          console.error(err);
          setError("Failed to load products.");
        }
      } finally {
        setLoading(false);
      }

      return () => controller.abort();
    },
    [searchQuery, appliedFilters, minPrice, maxPrice, priceRange]
  );

  useEffect(() => {
    if (initialLoaded && appliedFilters.priceRange[1] !== 0) {
      fetchProducts(page);
    }
  }, [appliedFilters, searchQuery, minPrice, maxPrice, initialLoaded, page]);

  const clearCategoryFilter = (categoryId: string) => {
    const newCategories = selectedCategories.filter((c) => c !== categoryId);
    setSelectedCategories(newCategories);
    setAppliedFilters((prev) => ({
      ...prev,
      categories: newCategories,
    }));
    setPage(1);
  };

  const getCategoryName = (id: string) => {
    return categories.find((c) => c.id === Number(id))?.name || id;
  };

  if (!initialLoaded)
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" />
          <p className="text-default-500">Loading products...</p>
        </div>
      </div>
    );

  return (
    <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-16 mt-16">
      <div className="mb-8">
        <div className="relative w-full max-w-2xl mx-auto">
          <Input
            placeholder="Search for products..."
            value={searchInput}
            onChange={(e) => {
              setSearchInput(e.currentTarget.value);
              searchDebouncedRef.current(e.currentTarget.value);
            }}
            size="lg"
            startContent={<Search className="w-5 h-5 text-default-400" />}
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
            classNames={{
              input: "text-base",
              inputWrapper: "shadow-md hover:shadow-lg transition-shadow",
            }}
          />
        </div>
      </div>

      <div className="flex flex-col lg:flex-row items-start gap-6 lg:gap-8">
        <Card className="w-full lg:w-80 p-6 border-2 border-divider rounded-2xl shadow-lg bg-content1 self-start lg:sticky lg:top-20">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-bold text-foreground text-lg flex items-center gap-2">
              <Filter className="w-5 h-5 text-primary" /> Filters
            </h2>
            <Button
              size="sm"
              variant="light"
              color="danger"
              onPress={() => {
                if (minPrice !== null && maxPrice !== null) {
                  const newRange: [number, number] = [minPrice, maxPrice];
                  setSelectedCategories([]);
                  setPriceRange(newRange);
                  setAppliedFilters({ categories: [], priceRange: newRange });
                  setSearchInput("");
                  setSearchQuery("");
                }
              }}
              startContent={<RotateCcw className="w-4 h-4" />}
              className="font-semibold"
            >
              Reset All
            </Button>
          </div>
          <Divider className="mb-5" />

          <div className="space-y-6">
            <div>
              <h3 className="font-bold text-foreground text-base mb-3 flex items-center gap-2">
                <Package className="w-5 h-5 text-primary" /> Categories
              </h3>
              <CheckboxGroup
                value={selectedCategories}
                onValueChange={(values) =>
                  setSelectedCategories(values as string[])
                }
                classNames={{
                  wrapper: "gap-2",
                }}
              >
                {categories.map((c) => (
                  <Checkbox
                    key={c.id}
                    value={String(c.id)}
                    classNames={{
                      label: "text-sm font-medium",
                    }}
                  >
                    {c.name}
                  </Checkbox>
                ))}
              </CheckboxGroup>
            </div>

            <Divider />

            <div>
              <h3 className="font-bold text-foreground text-base mb-3 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-primary" /> Price Range
              </h3>
              <div className="bg-default-100 rounded-lg p-3 mb-4">
                <p className="text-base font-semibold text-foreground text-center">
                  {priceRange ? `$${priceRange[0]} - $${priceRange[1]}` : ""}
                </p>
              </div>
              {minPrice !== null && maxPrice !== null && (
                <Slider
                  minValue={minPrice}
                  maxValue={maxPrice}
                  step={1}
                  value={priceRange ?? [minPrice ?? 0, maxPrice ?? 1000]}
                  onChange={(v) => {
                    if (Array.isArray(v)) setPriceRange(v as [number, number]);
                  }}
                  aria-label="Price range slider"
                  color="primary"
                  size="lg"
                  classNames={{
                    track: "h-2",
                    thumb: "w-5 h-5",
                  }}
                />
              )}
            </div>

            <Button
            
              size="lg"
              onPress={() => {
                if (priceRange !== null) {
                  setAppliedFilters({
                    categories: selectedCategories,
                    priceRange,
                  });
                  setPage(1);
                }
              }}
              className="w-full shadow-lg bg-gradient-to-r from-[#3B9FE8] to-[#3D3D8F] text-white font-semibold"
              startContent={<Filter className="w-5 h-5" />}
            >
              Apply Filters
            </Button>
          </div>
        </Card>

        <div className="flex-1 w-full">
          {/* Active filters display and product count */}
          <div className="mb-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-foreground">Products</h2>
                {!loading && (
                  <p className="text-sm text-default-500 mt-1">
                    {products.length} products found
                  </p>
                )}
              </div>

              <div className="flex items-center gap-2">
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

            {(appliedFilters.categories.length > 0 || searchQuery) && (
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-medium text-default-500">
                  Active filters:
                </span>
                {searchQuery && (
                  <Chip
                    onClose={() => {
                      setSearchInput("");
                      setSearchQuery("");
                    }}
                    variant="flat"
                    color="primary"
                  >
                    Search: {searchQuery}
                  </Chip>
                )}
                {appliedFilters.categories.map((catId) => (
                  <Chip
                    key={catId}
                    onClose={() => clearCategoryFilter(catId)}
                    variant="flat"
                    color="secondary"
                  >
                    {getCategoryName(catId)}
                  </Chip>
                ))}
              </div>
            )}
          </div>

          {loading ? (
            <div
              className={`grid gap-6 ${
                viewMode === "grid"
                  ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                  : "grid-cols-1"
              }`}
            >
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="rounded-2xl">
                  <Skeleton className="rounded-t-2xl">
                    <div className="h-[240px] rounded-t-2xl bg-default-300" />
                  </Skeleton>
                  <div className="p-5 space-y-3">
                    <Skeleton className="w-3/4 rounded-lg">
                      <div className="h-6 w-3/4 rounded-lg bg-default-200" />
                    </Skeleton>
                    <Skeleton className="w-full rounded-lg">
                      <div className="h-4 w-full rounded-lg bg-default-200" />
                    </Skeleton>
                    <Skeleton className="w-2/3 rounded-lg">
                      <div className="h-4 w-2/3 rounded-lg bg-default-200" />
                    </Skeleton>
                  </div>
                </Card>
              ))}
            </div>
          ) : products.length > 0 ? (
            <div
              className={`grid gap-6 ${
                viewMode === "grid"
                  ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                  : "grid-cols-1"
              }`}
            >
              {products.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          ) : (
            <Card className="p-12 text-center rounded-2xl border-2 border-dashed border-divider">
              <div className="space-y-4">
                <div className="w-20 h-20 mx-auto bg-default-100 rounded-full flex items-center justify-center">
                  <Package className="w-10 h-10 text-default-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-foreground mb-2">
                    No products found
                  </h3>
                  <p className="text-default-500 mb-4">
                    Try adjusting your filters or search query
                  </p>
                  <Button
                    color="primary"
                    variant="flat"
                    onPress={() => {
                      if (minPrice !== null && maxPrice !== null) {
                        const newRange: [number, number] = [minPrice, maxPrice];
                        setSelectedCategories([]);
                        setPriceRange(newRange);
                        setAppliedFilters({
                          categories: [],
                          priceRange: newRange,
                        });
                        setSearchInput("");
                        setSearchQuery("");
                      }
                    }}
                    startContent={<RotateCcw className="w-4 h-4" />}
                  >
                    Clear All Filters
                  </Button>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>

      {!loading && products.length > 0 && totalPages > 1 && (
        <div className="flex justify-center mt-12">
          <Pagination
            total={totalPages}
            page={page}
            onChange={setPage}
            showControls
            color="primary"
            size="lg"
            classNames={{
              wrapper: "gap-2",
              item: "font-semibold",
            }}
          />
        </div>
      )}

      {/* Error */}
      {error && (
        <Card className="mt-6 p-4 bg-danger-50 border-2 border-danger rounded-xl">
          <p className="text-danger font-semibold">{error}</p>
        </Card>
      )}
    </div>
  );
}
