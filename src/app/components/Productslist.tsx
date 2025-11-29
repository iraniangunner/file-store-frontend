"use client";

import { useState } from "react";
import type { Product } from "@/types";
import { ProductCard } from "./Productcard";
import ViewModeToggle from "./Viewmodetoggle";

interface ProductsListProps {
  products: Product[];
}

export default function ProductsList({ products }: ProductsListProps) {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  return (
    <>
      <div className="mb-6 flex justify-end">
        <ViewModeToggle viewMode={viewMode} onViewModeChange={setViewMode} />
      </div>

      <div className={
        viewMode === "grid" 
          ? "grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
          : "flex flex-col gap-4"
      }>
        {products.map((p) => (
          <ProductCard key={p.id} product={p} view={viewMode} />          
        ))}
      </div>
    </>
  );
}