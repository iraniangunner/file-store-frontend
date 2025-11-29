import { Card, Button } from "@heroui/react";
import { Package, RotateCcw } from "lucide-react";

export default function EmptyState() {
  return (
    <Card className="p-12 text-center rounded-2xl border-2 border-dashed border-divider">
      <div className="space-y-4">
        <div className="w-20 h-20 mx-auto bg-default-100 rounded-full flex items-center justify-center">
          <Package className="w-10 h-10 text-default-400" />
        </div>
        <div>
          <h3 className="text-xl font-bold">No products found</h3>
          <p className="text-default-500 mb-4">
            Try adjusting your filters or search query
          </p>
        </div>
      </div>
    </Card>
  );
}
