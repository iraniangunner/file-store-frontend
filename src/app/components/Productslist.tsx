"use client";

import { useState, useEffect, useTransition } from "react";
import { useSearchParams } from "next/navigation";
import type { Product } from "@/types";
import { ProductCard } from "./Productcard";
import { LayoutGrid, List } from "lucide-react";

interface ProductsListProps {
  products: Product[];
}

// Skeleton Card Component
function SkeletonCard({ view }: { view: "grid" | "list" }) {
  if (view === "list") {
    return (
      <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden">
        <div className="flex flex-col sm:flex-row">
          {/* Image skeleton */}
          <div className="relative sm:w-64 md:w-72 flex-shrink-0 bg-slate-100">
            <div className="aspect-[4/3] sm:aspect-auto sm:h-full skeleton-shimmer" />
          </div>

          {/* Content skeleton */}
          <div className="flex-1 p-5 sm:p-6 flex flex-col justify-between min-w-0">
            <div>
              <div className="h-6 w-3/4 bg-slate-200 rounded-lg skeleton-pulse mb-3" />
              <div className="space-y-2">
                <div className="h-4 w-full bg-slate-100 rounded-lg skeleton-pulse" />
                <div className="h-4 w-5/6 bg-slate-100 rounded-lg skeleton-pulse" />
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
              <div className="space-y-1">
                <div className="h-3 w-12 bg-slate-100 rounded skeleton-pulse" />
                <div className="h-7 w-20 bg-slate-200 rounded-lg skeleton-pulse" />
              </div>
              <div className="h-10 w-32 bg-slate-200 rounded-xl skeleton-pulse" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Grid view skeleton
  return (
    <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden">
      <div className="aspect-[4/3] bg-slate-100 relative overflow-hidden">
        <div className="absolute inset-0 skeleton-shimmer" />
        <div className="absolute top-3 right-3 h-6 w-14 bg-slate-200/80 rounded-lg skeleton-pulse" />
      </div>

      <div className="p-5">
        <div className="h-5 w-4/5 bg-slate-200 rounded-lg skeleton-pulse mb-3" />
        <div className="space-y-2 mb-4">
          <div className="h-4 w-full bg-slate-100 rounded-lg skeleton-pulse" />
          <div className="h-4 w-3/4 bg-slate-100 rounded-lg skeleton-pulse" />
        </div>

        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          <div className="space-y-1">
            <div className="h-3 w-10 bg-slate-100 rounded skeleton-pulse" />
            <div className="h-6 w-16 bg-slate-200 rounded-lg skeleton-pulse" />
          </div>
          <div className="h-9 w-24 bg-slate-200 rounded-xl skeleton-pulse" />
        </div>
      </div>
    </div>
  );
}

export default function ProductsList({ products }: ProductsListProps) {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isLoading, setIsLoading] = useState(false);
  const [displayedProducts, setDisplayedProducts] = useState<Product[]>(products);
  const searchParams = useSearchParams();

  // Track URL changes to show loading state
  useEffect(() => {
    setIsLoading(true);
    
    // Small delay to show skeleton, then update products
    const timer = setTimeout(() => {
      setDisplayedProducts(products);
      setIsLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchParams, products]);

  // Initial load - no skeleton
  useEffect(() => {
    setDisplayedProducts(products);
    setIsLoading(false);
  }, []);

  const skeletonCount = 6;

  return (
    <div>
      {/* View Mode Toggle */}
      <div className="flex justify-end mb-6">
        <div className="inline-flex items-center gap-1 p-1 bg-slate-100 rounded-xl">
          <button
            onClick={() => setViewMode("grid")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              viewMode === "grid"
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            <LayoutGrid className="w-4 h-4" />
            <span className="hidden sm:inline">Grid</span>
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              viewMode === "list"
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            <List className="w-4 h-4" />
            <span className="hidden sm:inline">List</span>
          </button>
        </div>
      </div>

      {/* Products Grid/List */}
      <div
        className={
          viewMode === "grid"
            ? "grid gap-6 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3"
            : "flex flex-col gap-4"
        }
      >
        {isLoading
          ? // Skeleton loading state
            Array.from({ length: skeletonCount }).map((_, index) => (
              <div
                key={`skeleton-${index}`}
                className="animate-fadeIn"
                style={{ animationDelay: `${index * 75}ms` }}
              >
                <SkeletonCard view={viewMode} />
              </div>
            ))
          : // Actual products
            displayedProducts.map((p, index) => (
              <div
                key={p.id}
                className="animate-fadeIn"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <ProductCard product={p} view={viewMode} />
              </div>
            ))}
      </div>

      {/* Animations */}
      <style jsx>{`
        @keyframes shimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }
        
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        :global(.skeleton-shimmer) {
          background: linear-gradient(
            90deg,
            rgb(241 245 249) 0%,
            rgb(226 232 240) 50%,
            rgb(241 245 249) 100%
          );
          background-size: 200% 100%;
          animation: shimmer 1.5s ease-in-out infinite;
        }
        
        :global(.skeleton-pulse) {
          animation: pulse 1.5s ease-in-out infinite;
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.4s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  );
}