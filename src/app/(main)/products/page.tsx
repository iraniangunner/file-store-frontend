"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Card,
  Input,
  Button,
  Checkbox,
  CheckboxGroup,
  Slider,
  Divider,
  Skeleton,
} from "@heroui/react";
import { DollarSign, Filter, Package, RotateCcw, Search } from "lucide-react";
import { Product } from "@/types";
import { ProductCard } from "@/app/components/Productcard";
import debounce from "lodash.debounce";

export default function ProductsPage() {
  // === Init states from URL ===
  const searchParams = new URLSearchParams(window.location.search);

  const initialCategories = searchParams.get("category_id")
    ? searchParams.get("category_id")!.split(",")
    : [];
  const initialSearch = searchParams.get("search") || "";
  const initialPage = Number(searchParams.get("page")) || 1;

  // === states ===
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [page, setPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(1);

  const [categories, setCategories] = useState<{ id: number; name: string }[]>(
    []
  );
  const [selectedCategories, setSelectedCategories] =
    useState<string[]>(initialCategories);

  const [minPrice, setMinPrice] = useState<number | null>(null);
  const [maxPrice, setMaxPrice] = useState<number | null>(null);
  const [priceRange, setPriceRange] = useState<[number, number] | null>(null);

  const [appliedFilters, setAppliedFilters] = useState({
    categories: initialCategories,
    priceRange: [0, 0] as [number, number],
  });

  // === fetch categories ===
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("https://filerget.com/api/categories");
        const data = await res.json();
        setCategories(data.data || []);
      } catch (err) {
        console.error(err);
      }
    })();
  }, []);

  // === fetch price range from server ===
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(
          "https://filerget.com/api/products/meta/price-range"
        );
        const data = await res.json();
        const min = Number(data.min_price) || 0;
        const max = Number(data.max_price) || 1000;
        setMinPrice(min);
        setMaxPrice(max);
        setPriceRange([min, max]); // <-- این باید همزمان با min/max باشه
        setAppliedFilters((prev) => ({ ...prev, priceRange: [min, max] }));
      } catch (err) {
        console.error(err);
      }
    })();
  }, []);

  // --- debounce search handler ---
  const handleSearch = useCallback(
    debounce((value: string) => {
      setSearchQuery(value);
      setPage(1);
    }, 500),
    []
  );

  // === fetch products ===
  const fetchProducts = useCallback(
    async (pageNumber = 1) => {
      if (minPrice === null || maxPrice === null || priceRange === null) return;
      try {
        setLoading(true);

        const params = new URLSearchParams();
        if (searchQuery) params.append("search", searchQuery);
        if (appliedFilters.categories.length)
          params.append("category_id", appliedFilters.categories.join(","));
        if (appliedFilters.priceRange[0] > minPrice)
          params.append("min_price", appliedFilters.priceRange[0].toString());
        if (appliedFilters.priceRange[1] < maxPrice)
          params.append("max_price", appliedFilters.priceRange[1].toString());
        params.append("page", pageNumber.toString());
        params.append("per_page", "6");

        const url = `https://filerget.com/api/products${
          params.toString() ? `?${params.toString()}` : ""
        }`;
        const res = await fetch(url);
        const data = await res.json();

        if (pageNumber === 1) {
          setProducts(data.data);
        } else {
          setProducts((prev) => [...prev, ...data.data]);
        }

        setPage(data.current_page);
        setTotalPages(data.last_page);

        const newUrl = params.toString() ? `?${params.toString()}` : "";
        window.history.replaceState(null, "", `/products${newUrl}`);

        setError("");
      } catch (err) {
        setError("Failed to load products.");
      } finally {
        setLoading(false);
      }
    },
    [searchQuery, appliedFilters, minPrice, maxPrice, priceRange]
  );

  // fetch products when filters/search/page changes
  useEffect(() => {
    fetchProducts(1);
  }, [appliedFilters, searchQuery]);

  // --- UI --- Loading
  if (loading && !products.length)
    return (
      <div className="flex justify-center items-center h-screen">
        <Skeleton className="h-10 w-80" />
      </div>
    );

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-6 py-16">
        {/* Search */}
        <div className="mb-8 relative w-full max-w-lg">
          <Input
            placeholder="Search..."
            defaultValue={searchQuery}
            onChange={(e) => handleSearch(e.currentTarget.value)}
            className="pr-10"
          />
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
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
                      if (Array.isArray(v)) {
                        setPriceRange(v as [number, number]);
                      }
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
                className="mt-4"
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

        {/* Load More */}
        {page < totalPages && (
          <div className="flex justify-center mt-8">
            <Button
              onPress={() => {
                if (page < totalPages) fetchProducts(page + 1);
              }}
            >
              Load More
            </Button>
          </div>
        )}

        {/* Error */}
        {error && <p className="text-red-500 mt-4">{error}</p>}
      </div>
    </div>
  );
}
