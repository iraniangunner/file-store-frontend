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
});
const SearchBar = dynamic(() => import("./Searchbar"), { ssr: false });
const ViewModeToggle = dynamic(() => import("./Viewmodetoggle"), {
  ssr: false,
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
    <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12 mt-12">
      <div className="flex items-center justify-between gap-4 mb-8">
        <SearchBar initialValue={searchParams.search} />
      </div>

      <div className="flex flex-col lg:flex-row gap-6 mb-32">
        <FilterSidebar
          categories={categories}
          priceRange={priceRange}
          fileTypes={fileTypes}
          searchParams={searchParams}
        />

        <main className="flex-1">
          <ProductsHeader productsCount={initialProducts.length} />

          {initialProducts.length > 0 ? (
            <ProductsList products={initialProducts} />
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
