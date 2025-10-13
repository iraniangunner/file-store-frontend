"use client";

import { useEffect, useState } from "react";
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
import { Search } from "lucide-react";
import api from "@/lib/api";
import { Product } from "@/types";
import { ProductCard } from "@/app/components/Productcard";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [appliedFilters, setAppliedFilters] = useState({
    categories: [] as string[],
    priceRange: [0, 1000] as [number, number],
  });

  const [visibleCount, setVisibleCount] = useState(6);

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get<Product[]>("/products");
        setProducts(res.data);
      } catch {
        setError("Failed to load products. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Dynamic price range
  const prices = products.map((p) => p.price);
  const minPrice = prices.length ? Math.min(...prices) : 0;
  const maxPrice = prices.length ? Math.max(...prices) : 1000;

  useEffect(() => {
    if (products.length) setPriceRange([minPrice, maxPrice]);
  }, [products, minPrice, maxPrice]);

  // Unique categories
  const categories = Array.from(new Set(products.map((p:any) => p.category)));

  // Filtered products
  const filteredProducts = products
    .filter((p:any) => p.title.toLowerCase().includes(searchQuery.toLowerCase()))
    .filter((p:any) =>
      appliedFilters.categories.length
        ? appliedFilters.categories.includes(p.category)
        : true
    )
    .filter(
      (p:any) =>
        p.price >= appliedFilters.priceRange[0] &&
        p.price <= appliedFilters.priceRange[1]
    );

  const visibleProducts = filteredProducts.slice(0, visibleCount);

  // Reset visibleCount when filters/search change
  useEffect(() => {
    setVisibleCount(6);
  }, [appliedFilters, searchQuery]);

  // --- Loading ---
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Skeleton className="h-10 w-80" />
      </div>
    );
  }

  // --- Error ---
  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 p-6">
        <p className="text-lg text-red-500 font-medium">{error}</p>
        <Button onPress={() => window.location.reload()}>Retry</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-6 py-16">
        {/* Search Bar */}
        <div className="mb-8 relative w-full max-w-lg">
          <Input
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.currentTarget.value)}
            className="pr-10"
          />
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
        </div>

        {/* Main Layout */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <Card className="w-full sm:w-80 lg:w-64 p-4 border rounded-xl flex flex-col justify-between self-start lg:sticky lg:top-20">
            <div className="space-y-6 flex-1">
              {/* Categories */}
              <div className="flex flex-col h-60 overflow-y-auto">
                <h3 className="font-semibold mb-2">Categories</h3>
                <Divider className="mb-2" />
                <CheckboxGroup
                  value={selectedCategories}
                  onValueChange={(values) =>
                    setSelectedCategories(values as string[])
                  }
                >
                  {categories.map((category) => (
                    <Checkbox key={category} value={category}>
                      {category}
                    </Checkbox>
                  ))}
                </CheckboxGroup>
              </div>

              {/* Price */}
              <div className="flex flex-col h-40 overflow-y-auto mt-4">
                <h3 className="font-semibold mb-2">Price</h3>
                <Divider className="mb-2" />
                <p className="text-sm text-gray-500 mb-2">
                  ${priceRange[0]} - ${priceRange[1]}
                </p>
                <Slider
                  min={minPrice}
                  max={maxPrice}
                  value={priceRange}
                  onValueChange={(value: [number, number]) =>
                    setPriceRange(value)
                  }
                  step={1}
                  range
                />
              </div>
            </div>

            {/* Apply / Reset Buttons */}
            <div className="flex justify-between mt-4">
              <Button
                onPress={() =>
                  setAppliedFilters({
                    categories: selectedCategories,
                    priceRange,
                  })
                }
              >
                Apply
              </Button>
              <Button
                variant="outline"
                onPress={() => {
                  setSelectedCategories([]);
                  setPriceRange([minPrice, maxPrice]);
                  setAppliedFilters({
                    categories: [],
                    priceRange: [minPrice, maxPrice],
                  });
                  setVisibleCount(6);
                }}
              >
                Reset
              </Button>
            </div>
          </Card>

          {/* Products Grid */}
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {visibleProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>

        {/* Load More */}
        {visibleProducts.length < filteredProducts.length && (
          <div className="flex justify-center mt-8">
            <Button onPress={() => setVisibleCount((prev) => prev + 6)}>
              Load More
            </Button>
          </div>
        )}

        {/* No products */}
        {filteredProducts.length === 0 && (
          <div className="flex justify-center mt-8 text-gray-500">
            No products found.
          </div>
        )}
      </div>
    </div>
  );
}

