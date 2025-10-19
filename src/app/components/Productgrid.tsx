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
} from "@heroui/react";
import { DollarSign, Filter, Package, RotateCcw, Search } from "lucide-react";
import { Product } from "@/types";
import { ProductCard } from "@/app/components/Productcard";
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

  // === Fetch categories ===
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

  // === Fetch price range ===
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

  // === Debounced search ===
  const searchDebouncedRef = useRef(
    debounce((value: string) => {
      setSearchQuery(value);
      setPage(1); // هر جستجو صفحه را 1 می‌کند
    }, 500)
  );

  useEffect(() => {
    return () => searchDebouncedRef.current.cancel();
  }, []);

  // === Fetch products ===
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

  // === Trigger fetch on ready or filter/search change ===
  useEffect(() => {
    if (initialLoaded && appliedFilters.priceRange[1] !== 0) {
      fetchProducts(page);
    }
  }, [appliedFilters, searchQuery, minPrice, maxPrice, initialLoaded, page]);

  if (!initialLoaded)
    return (
      <div className="h-screen flex items-center justify-center">
        Loading...
      </div>
    );

  return (
 
      <div className="container mx-auto px-6 py-16">
        {/* Search */}
        <div className="mb-8 relative w-full max-w-lg">
          <Input
            placeholder="Search..."
            value={searchInput}
            onChange={(e) => {
              setSearchInput(e.currentTarget.value);
              searchDebouncedRef.current(e.currentTarget.value);
            }}
            className="pr-10"
          />
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
        </div>

        <div className="flex flex-col lg:flex-row items-start gap-8">
          {/* Sidebar */}
          <Card className="w-full sm:w-80 lg:w-64 p-5 border rounded-2xl shadow-sm bg-white/80 backdrop-blur-sm self-start lg:sticky lg:top-20">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-gray-800 text-base flex items-center gap-2">
                <Filter className="w-4 h-4 text-primary" /> Filters
              </h2>
              <Button
                size="sm"
                variant="ghost"
                onPress={() => {
                  if (minPrice !== null && maxPrice !== null) {
                    const newRange: [number, number] = [minPrice, maxPrice];
                    setSelectedCategories([]);
                    setPriceRange(newRange);
                    setAppliedFilters({ categories: [], priceRange: newRange });
                    // setPage(1);
                  }
                }}
                className="text-gray-500 text-sm flex items-center gap-1"
              >
                <RotateCcw className="w-4 h-4" /> Reset
              </Button>
            </div>
            <Divider className="mb-4" />

            <div className="space-y-6 flex-1">
              {/* Categories */}
              <div>
                <h3 className="font-semibold text-gray-700 text-sm mb-2 flex items-center gap-2">
                  <Package className="w-4 h-4 text-primary" /> Categories
                </h3>
                <CheckboxGroup
                  value={selectedCategories}
                  onValueChange={(values) =>
                    setSelectedCategories(values as string[])
                  }
                >
                  {categories.map((c) => (
                    <Checkbox key={c.id} value={String(c.id)}>
                      {c.name}
                    </Checkbox>
                  ))}
                </CheckboxGroup>
              </div>

              {/* Price */}
              <div>
                <h3 className="font-semibold text-gray-700 text-sm mb-2 flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-primary" /> Price
                </h3>
                <p className="text-sm text-gray-500 mb-2">
                  {priceRange ? `$${priceRange[0]} - $${priceRange[1]}` : ""}
                </p>
                {minPrice !== null && maxPrice !== null && (
                  <Slider
                    minValue={minPrice}
                    maxValue={maxPrice}
                    step={1}
                    value={priceRange ?? [minPrice ?? 0, maxPrice ?? 1000]}
                    onChange={(v) => {
                      if (Array.isArray(v))
                        setPriceRange(v as [number, number]);
                    }}
                    aria-label="Price range slider"
                  />
                )}
              </div>

              {/* Apply Button */}
              <Button
                color="primary"
                onPress={() => {
                  if (priceRange !== null) {
                    setAppliedFilters({
                      categories: selectedCategories,
                      priceRange,
                    });
                    setPage(1);
                  }
                }}
                className="mt-4 w-full"
              >
                Apply Filters
              </Button>
            </div>
          </Card>

          {/* Products */}
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>

        {/* Pagination */}
        {products.length > 0 && totalPages > 1 && (
          <div className="flex justify-center mt-8">
            <Pagination
              total={totalPages}
              page={page}
              onChange={setPage}
              showControls
            />
          </div>
        )}

        {/* Error */}
        {error && <p className="text-red-500 mt-4">{error}</p>}
      </div>
   
  );
}
