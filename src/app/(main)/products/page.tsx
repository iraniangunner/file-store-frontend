// import { Metadata } from "next";
// import dynamic from "next/dynamic";

// const ProductGrid = dynamic(() => import("@/app/components/Productgrid"), {
//   ssr: false,
// });

// export const metadata: Metadata = {
//   title: "Filerget | products",
//   description:
//     "Digital files, made simple Buy and download what you need Instantly, Safely, Securely",
// };

// export default function ProductsPage() {
//   return (
//     <div className="min-h-screen">
//       <ProductGrid />
//     </div>
//   );
// }


import { Metadata } from "next";
import ProductGrid from "@/app/components/Productgrid";

export const metadata: Metadata = {
  title: "Filerget | products",
  description:
    "Digital files, made simple Buy and download what you need Instantly, Safely, Securely",
};

interface PageProps {
  searchParams: {
    search?: string;
    category_ids?: string;
    min_price?: string;
    max_price?: string;
    file_types?: string;
    page?: string;
  };
}

async function getCategories() {
  const res = await fetch("https://filerget.com/api/categories", {
    next: { revalidate: 3600 }, // Cache for 1 hour
  });
  if (!res.ok) return [];
  const json = await res.json();
  return json.data || [];
}

async function getPriceRange() {
  const res = await fetch("https://filerget.com/api/products/meta/price-range", {
    next: { revalidate: 3600 },
  });
  if (!res.ok) return { min: 0, max: 1000 };
  const json = await res.json();
  return {
    min: Number(json.min_price) || 0,
    max: Number(json.max_price) || 1000,
  };
}

async function getFileTypes() {
  const res = await fetch("https://filerget.com/api/products/meta/file-types", {
    next: { revalidate: 3600 },
  });
  if (!res.ok) return [];
  const json = await res.json();
  return json.data || [];
}

async function getProducts(searchParams: PageProps["searchParams"]) {
  const params = new URLSearchParams();
  
  if (searchParams.search) params.append("search", searchParams.search);
  if (searchParams.category_ids) params.append("category_ids", searchParams.category_ids);
  if (searchParams.min_price) params.append("min_price", searchParams.min_price);
  if (searchParams.max_price) params.append("max_price", searchParams.max_price);
  if (searchParams.file_types) params.append("file_types", searchParams.file_types);
  if (searchParams.page) params.append("page", searchParams.page);

  const url = `https://filerget.com/api/products${params.toString() ? `?${params.toString()}` : ""}`;
  
  const res = await fetch(url, {
    next: { revalidate: 0 }, // Don't cache product results
  });
  
  if (!res.ok) return { data: [], current_page: 1, last_page: 1 };
  return res.json();
}

export default async function ProductsPage({ searchParams }: PageProps) {
  const [categories, priceRange, fileTypes, productsData] = await Promise.all([
    getCategories(),
    getPriceRange(),
    getFileTypes(),
    getProducts(searchParams),
  ]);

  return (
    <div className="min-h-screen">
      <ProductGrid
        initialProducts={productsData.data || []}
        initialPage={productsData.current_page || 1}
        initialTotalPages={productsData.last_page || 1}
        categories={categories}
        priceRange={priceRange}
        fileTypes={fileTypes}
        searchParams={searchParams}
      />
    </div>
  );
}

