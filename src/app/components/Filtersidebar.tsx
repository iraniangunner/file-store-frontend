import { Card, Button, Divider } from "@heroui/react";
import { Filter, RotateCcw } from "lucide-react";
import { CategoryApi } from "@/types";
import { CategoryFilter } from "./Categoryfilter";
import { PriceFilter } from "./Pricefilter";
import { FileTypeFilter } from "./Filetypefilter";

interface FilterSidebarProps {
  categories: CategoryApi[];
  selectedCategories: string[];
  expandedCategories: Record<number, boolean>;
  onToggleExpand: (id: number) => void;
  onCategoryChange: (categories: string[]) => void;
  priceRange: [number, number] | null;
  minPrice: number | null;
  maxPrice: number | null;
  onPriceChange: (range: [number, number]) => void;
  fileTypes: string[];
  selectedFileTypes: string[];
  onFileTypeChange: (types: string[]) => void;
  onReset: () => void;
}

export function FilterSidebar({
  categories,
  selectedCategories,
  expandedCategories,
  onToggleExpand,
  onCategoryChange,
  priceRange,
  minPrice,
  maxPrice,
  onPriceChange,
  fileTypes,
  selectedFileTypes,
  onFileTypeChange,
  onReset,
}: FilterSidebarProps) {
  return (
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
            onPress={onReset}
            startContent={<RotateCcw className="w-4 h-4" />}
          >
            Reset
          </Button>
        </div>

        <Divider className="mb-4" />

        <CategoryFilter
          categories={categories}
          selectedCategories={selectedCategories}
          expandedCategories={expandedCategories}
          onToggleExpand={onToggleExpand}
          onCategoryChange={onCategoryChange}
        />

        <Divider className="mb-4" />

        <PriceFilter
          priceRange={priceRange}
          minPrice={minPrice}
          maxPrice={maxPrice}
          onPriceChange={onPriceChange}
        />

        <Divider className="mb-4" />

        <FileTypeFilter
          fileTypes={fileTypes}
          selectedFileTypes={selectedFileTypes}
          onFileTypeChange={onFileTypeChange}
        />
      </Card>
    </aside>
  );
}
