import { Slider, Divider } from "@heroui/react";
import { DollarSign } from "lucide-react";

interface PriceFilterProps {
  priceRange: [number, number] | null;
  minPrice: number | null;
  maxPrice: number | null;
  onPriceChange: (range: [number, number]) => void;
}

export function PriceFilter({
  priceRange,
  minPrice,
  maxPrice,
  onPriceChange,
}: PriceFilterProps) {
  return (
    <div className="mb-4">
      <h4 className="font-medium mb-3 flex items-center gap-2">
        <DollarSign className="w-4 h-4 text-primary" /> Price
      </h4>

      <div className="text-sm mb-2">
        {priceRange ? `$${priceRange[0]} - $${priceRange[1]}` : ""}
      </div>
      {minPrice !== null && maxPrice !== null && (
        <Slider
          minValue={minPrice}
          maxValue={maxPrice}
          value={priceRange ?? [minPrice, maxPrice]}
          step={1}
          onChange={(v) => {
            if (!Array.isArray(v)) return;
            onPriceChange(v as [number, number]);
          }}
        />
      )}
    </div>
  );
}
