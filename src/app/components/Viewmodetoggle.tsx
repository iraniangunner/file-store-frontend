// import { Button } from "@heroui/react";
// import { Grid3x3, List } from "lucide-react";

// interface ViewModeToggleProps {
//   viewMode: "grid" | "list";
//   onViewModeChange: (mode: "grid" | "list") => void;
// }

// export function ViewModeToggle({
//   viewMode,
//   onViewModeChange,
// }: ViewModeToggleProps) {
//   return (
//     <div className="hidden sm:flex items-center gap-2">
//       <Button
//         isIconOnly
//         variant={viewMode === "grid" ? "solid" : "flat"}
//         color={viewMode === "grid" ? "primary" : "default"}
//         onPress={() => onViewModeChange("grid")}
//         size="sm"
//       >
//         <Grid3x3 className="w-4 h-4" />
//       </Button>
//       <Button
//         isIconOnly
//         variant={viewMode === "list" ? "solid" : "flat"}
//         color={viewMode === "list" ? "primary" : "default"}
//         onPress={() => onViewModeChange("list")}
//         size="sm"
//       >
//         <List className="w-4 h-4" />
//       </Button>
//     </div>
//   );
// }

"use client";

import { useState } from "react";
import { LayoutGrid, List } from "lucide-react";
import { Button } from "@heroui/react";

export default function ViewModeToggle() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  return (
    <div className="flex gap-2">
      <Button
        isIconOnly
        variant={viewMode === "grid" ? "solid" : "light"}
        onPress={() => setViewMode("grid")}
      >
        <LayoutGrid className="w-4 h-4" />
      </Button>
      <Button
        isIconOnly
        variant={viewMode === "list" ? "solid" : "light"}
        onPress={() => setViewMode("list")}
      >
        <List className="w-4 h-4" />
      </Button>
    </div>
  );
}
