import type { Product } from "@/types";
import { CategoryApi } from "@/types";
import dynamic from "next/dynamic";
import FilterSidebar from "./Filtersidebar";
import ProductsHeader from "./Productsheader";
import EmptyState from "./Emptystate";
import ProductsList from "./Productslist";

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

const PaginationWrapper = dynamic(() => import("./Paginationwrapper"), {
  ssr: false,
  loading: () => (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mt-8 animate-pulse">
      {/* Page info skeleton */}
      <div className="flex items-center gap-2 text-sm order-2 sm:order-1">
        <div className="h-6 w-10 bg-slate-200 rounded-lg" />
        <div className="h-7 w-8 bg-slate-300 rounded-lg" />
        <div className="h-6 w-14 bg-slate-200 rounded-lg" />
      </div>

      {/* Pagination buttons skeleton */}
      <div className="inline-flex items-center gap-1 p-1.5 bg-white rounded-2xl shadow-lg shadow-slate-200/50 border border-slate-200/60 order-1 sm:order-2">
        {/* 6 button placeholders */}
        {[...Array(7)].map((_, i) => (
          <div key={i} className="w-9 h-9 rounded-xl bg-slate-200" />
        ))}
      </div>
    </div>
  ),
});

const SearchBar = dynamic(() => import("./Searchbar"), {
  ssr: false,
  loading: () => (
    <div className="relative w-full">
      <div className="animate-pulse">
        <div className="h-14 rounded-2xl bg-slate-200/60 w-full"></div>
      </div>
    </div>
  ),
});

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
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50/50">
      {/* Subtle background pattern */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(148,163,184,0.1),transparent_50%)]" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-bl from-violet-100/30 via-transparent to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-tr from-sky-100/30 via-transparent to-transparent rounded-full blur-3xl" />
      </div>

      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 mt-8">
        {/* Header Section */}
        <div className="mb-10">
          <div className="flex flex-col gap-6">
            {/* Title area */}
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
              <div>
                <span className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-slate-400 mb-2">
                  <span className="w-8 h-px bg-gradient-to-r from-violet-500 to-sky-500" />
                  Browse
                </span>
                <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
                  Product Catalog
                </h1>
              </div>
            </div>

            {/* Search Bar */}
            <div className="max-w-2xl">
              <SearchBar initialValue={searchParams.search} />
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row gap-8 mb-24">
          {/* Sidebar */}
          <FilterSidebar
            categories={categories}
            priceRange={priceRange}
            fileTypes={fileTypes}
            searchParams={searchParams}
          />

          {/* Products Area */}
          <main className="flex-1 min-w-0">
            <ProductsHeader productsCount={initialProducts.length} />

            <div className="mt-6">
              {initialProducts.length > 0 ? (
                <ProductsList products={initialProducts} />
              ) : (
                <EmptyState />
              )}
            </div>

            {initialProducts.length > 0 && initialTotalPages > 1 && (
              <div className="mt-12 pt-8 border-t border-slate-200/60">
                <PaginationWrapper
                  currentPage={initialPage}
                  totalPages={initialTotalPages}
                />
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
