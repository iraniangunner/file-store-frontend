import { CheckboxGroup } from "@heroui/react";
import { Package } from "lucide-react";
import { CategoryApi } from "@/types";
import { CategoryTreeItem } from "./Categorytree";

interface CategoryFilterProps {
  categories: CategoryApi[];
  selectedCategories: string[];
  expandedCategories: Record<number, boolean>;
  onToggleExpand: (id: number) => void;
  onCategoryChange: (categories: string[]) => void;
}

export function CategoryFilter({
  categories,
  selectedCategories,
  expandedCategories,
  onToggleExpand,
  onCategoryChange,
}: CategoryFilterProps) {
  const renderCategoryTree = (nodes: CategoryApi[]): React.ReactNode => {
    return nodes.map((n) => (
      <CategoryTreeItem
        key={n.id}
        node={n}
        isExpanded={!!expandedCategories[n.id]}
        onToggleExpand={onToggleExpand}
        renderChildren={renderCategoryTree}
      />
    ));
  };

  return (
    <div className="mb-4">
      <h4 className="font-medium mb-3 flex items-center gap-2">
        <Package className="w-4 h-4 text-primary" /> Categories
      </h4>

      <CheckboxGroup
        value={selectedCategories}
        onValueChange={onCategoryChange}
      >
        <div className="max-h-80 overflow-auto pr-2">
          {renderCategoryTree(categories.filter((c) => c.parent_id === null))}
        </div>
      </CheckboxGroup>
    </div>
  );
}
