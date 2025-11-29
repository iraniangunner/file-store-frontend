"use client";

import { LayoutGrid, List } from "lucide-react";

interface ViewModeToggleProps {
  viewMode: "grid" | "list";
  onViewModeChange: (mode: "grid" | "list") => void;
}

export default function ViewModeToggle({ viewMode, onViewModeChange }: ViewModeToggleProps) {
  const baseClasses = "inline-flex items-center justify-center rounded-md text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background";
  const sizeClasses = "h-11 w-11";
  
  return (
    <div className="flex gap-2">
      <button
        onClick={() => onViewModeChange("grid")}
        className={`${baseClasses} ${sizeClasses} ${
          viewMode === "grid" 
            ? "bg-accent text-accent-foreground hover:bg-accent/90 shadow-sm" 
            : "hover:bg-accent/50 hover:text-accent-foreground"
        }`}
        aria-label="Grid view"
      >
        <LayoutGrid className="w-5 h-5" />
      </button>
      <button
        onClick={() => onViewModeChange("list")}
        className={`${baseClasses} ${sizeClasses} ${
          viewMode === "list" 
            ? "bg-accent text-accent-foreground hover:bg-accent/90 shadow-sm" 
            : "hover:bg-accent/50 hover:text-accent-foreground"
        }`}
        aria-label="List view"
      >
        <List className="w-5 h-5" />
      </button>
    </div>
  );
}