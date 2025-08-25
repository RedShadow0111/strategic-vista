import { Button } from "@/components/ui/button";
import { Grid3X3, List, Move } from "lucide-react";

interface PortfolioViewToggleProps {
  viewMode?: "list" | "grid";
  onViewModeChange?: (mode: "list" | "grid") => void;
}

export function PortfolioViewToggle({ 
  viewMode = "list", 
  onViewModeChange 
}: PortfolioViewToggleProps) {
  // Only show toggle for overview tab (list/grid modes)
  return (
    <div className="flex items-center border border-border rounded-lg p-1">
      <Button
        variant={viewMode === "list" ? "default" : "ghost"}
        size="sm"
        className="h-8 px-3"
        onClick={() => onViewModeChange?.("list")}
      >
        <List className="w-4 h-4" />
      </Button>
      <Button
        variant={viewMode === "grid" ? "default" : "ghost"}
        size="sm"
        className="h-8 px-3"
        onClick={() => onViewModeChange?.("grid")}
      >
        <Grid3X3 className="w-4 h-4" />
      </Button>
    </div>
  );
}