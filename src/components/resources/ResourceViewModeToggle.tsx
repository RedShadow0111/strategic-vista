import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel
} from "@/components/ui/dropdown-menu";
import { Grid, List, Settings } from "lucide-react";

interface ResourceViewModeToggleProps {
  viewMode: "normal" | "compact";
  onViewModeChange: (mode: "normal" | "compact") => void;
  compactColumns: string[];
  onCompactColumnsChange: (columns: string[]) => void;
}

const availableColumns = [
  { id: "name", label: "Name" },
  { id: "role", label: "Role" },
  { id: "department", label: "Department" },
  { id: "level", label: "Level" },
  { id: "utilization", label: "Utilization" },
  { id: "capacity", label: "Capacity" },
  { id: "cost", label: "Cost" },
  { id: "skills", label: "Skills" },
  { id: "projects", label: "Projects" }
];

export function ResourceViewModeToggle({ 
  viewMode, 
  onViewModeChange, 
  compactColumns, 
  onCompactColumnsChange 
}: ResourceViewModeToggleProps) {
  const toggleColumn = (columnId: string) => {
    if (compactColumns.includes(columnId)) {
      onCompactColumnsChange(compactColumns.filter(id => id !== columnId));
    } else {
      onCompactColumnsChange([...compactColumns, columnId]);
    }
  };

  return (
    <div className="flex items-center gap-2">
      {/* View Mode Toggle */}
      <div className="flex items-center border rounded-lg p-1">
        <Button
          variant={viewMode === "normal" ? "default" : "ghost"}
          size="sm"
          onClick={() => onViewModeChange("normal")}
          className="px-3"
        >
          <Grid className="w-4 h-4 mr-1" />
          Normal
        </Button>
        <Button
          variant={viewMode === "compact" ? "default" : "ghost"}
          size="sm"
          onClick={() => onViewModeChange("compact")}
          className="px-3"
        >
          <List className="w-4 h-4 mr-1" />
          Compact
        </Button>
      </div>

      {/* Column Settings for Compact Mode */}
      {viewMode === "compact" && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2">
              <Settings className="w-4 h-4" />
              Columns
              <Badge variant="secondary" className="ml-1">
                {compactColumns.length}
              </Badge>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Select Columns</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {availableColumns.map((column) => (
              <DropdownMenuCheckboxItem
                key={column.id}
                checked={compactColumns.includes(column.id)}
                onCheckedChange={() => toggleColumn(column.id)}
              >
                {column.label}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
}