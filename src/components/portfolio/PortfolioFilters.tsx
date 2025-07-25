import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Filter, X } from "lucide-react";

interface PortfolioFiltersProps {
  onFiltersChange?: (projects: any[]) => void;
  projects?: any[];
}

export function PortfolioFilters({ onFiltersChange, projects = [] }: PortfolioFiltersProps) {
  const [filters, setFilters] = useState({
    status: [] as string[],
    priority: [] as string[],
    category: [] as string[],
    risk: [] as string[]
  });

  const filterOptions = {
    status: ["In Progress", "Planning", "Completed", "On Hold"],
    priority: ["High", "Medium", "Low"],
    category: ["Strategic", "Product", "Infrastructure"],
    risk: ["High", "Medium", "Low"]
  };

  const toggleFilter = (type: keyof typeof filters, value: string) => {
    setFilters(prev => ({
      ...prev,
      [type]: prev[type].includes(value)
        ? prev[type].filter(item => item !== value)
        : [...prev[type], value]
    }));
  };

  const clearAllFilters = () => {
    setFilters({
      status: [],
      priority: [],
      category: [],
      risk: []
    });
  };

  const getActiveFilterCount = () => {
    return Object.values(filters).flat().length;
  };

  return (
    <div className="flex items-center gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2">
            <Filter className="w-4 h-4" />
            Filter
            {getActiveFilterCount() > 0 && (
              <Badge variant="destructive" className="ml-1 px-1 py-0 text-xs">
                {getActiveFilterCount()}
              </Badge>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-64">
          <div className="flex items-center justify-between p-2">
            <DropdownMenuLabel className="p-0">Filters</DropdownMenuLabel>
            {getActiveFilterCount() > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAllFilters}
                className="h-auto p-1 text-xs"
              >
                Clear All
              </Button>
            )}
          </div>
          
          <DropdownMenuSeparator />
          
          <DropdownMenuLabel>Status</DropdownMenuLabel>
          {filterOptions.status.map((status) => (
            <DropdownMenuCheckboxItem
              key={status}
              checked={filters.status.includes(status)}
              onCheckedChange={() => toggleFilter('status', status)}
            >
              {status}
            </DropdownMenuCheckboxItem>
          ))}
          
          <DropdownMenuSeparator />
          
          <DropdownMenuLabel>Priority</DropdownMenuLabel>
          {filterOptions.priority.map((priority) => (
            <DropdownMenuCheckboxItem
              key={priority}
              checked={filters.priority.includes(priority)}
              onCheckedChange={() => toggleFilter('priority', priority)}
            >
              {priority}
            </DropdownMenuCheckboxItem>
          ))}
          
          <DropdownMenuSeparator />
          
          <DropdownMenuLabel>Category</DropdownMenuLabel>
          {filterOptions.category.map((category) => (
            <DropdownMenuCheckboxItem
              key={category}
              checked={filters.category.includes(category)}
              onCheckedChange={() => toggleFilter('category', category)}
            >
              {category}
            </DropdownMenuCheckboxItem>
          ))}
          
          <DropdownMenuSeparator />
          
          <DropdownMenuLabel>Risk Level</DropdownMenuLabel>
          {filterOptions.risk.map((risk) => (
            <DropdownMenuCheckboxItem
              key={risk}
              checked={filters.risk.includes(risk)}
              onCheckedChange={() => toggleFilter('risk', risk)}
            >
              {risk}
            </DropdownMenuCheckboxItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Active filters display */}
      {getActiveFilterCount() > 0 && (
        <div className="flex items-center gap-1 max-w-md overflow-x-auto">
          {Object.entries(filters).map(([type, values]) =>
            values.map((value) => (
              <Badge
                key={`${type}-${value}`}
                variant="secondary"
                className="text-xs gap-1 whitespace-nowrap"
              >
                {value}
                <X
                  className="w-3 h-3 cursor-pointer hover:text-destructive"
                  onClick={() => toggleFilter(type as keyof typeof filters, value)}
                />
              </Badge>
            ))
          )}
        </div>
      )}
    </div>
  );
}