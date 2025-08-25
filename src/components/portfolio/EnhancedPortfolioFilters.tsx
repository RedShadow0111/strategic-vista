import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Filter, X, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

interface Project {
  id: number;
  name: string;
  status: string;
  priority: string;
  budget: string;
  spent: string;
  progress: number;
  timeline: string;
  team: number;
  risk: string;
  category: string;
  type: string;
  strategicGoal: string;
  strategicValue: number;
}

interface EnhancedPortfolioFiltersProps {
  projects: Project[];
  onFiltersChange: (filteredProjects: Project[]) => void;
}

interface FilterState {
  status: string[];
  priority: string[];
  risk: string[];
  category: string[];
  type: string[];
  strategicGoal: string[];
}

const filterOptions = {
  status: ["Active", "On Hold", "Completed", "Planning", "In Progress"],
  priority: ["High", "Medium", "Low"],
  risk: ["High", "Medium", "Low"],
  category: ["Strategic", "Product", "Infrastructure", "Operational"],
  type: ["Independent", "Program", "Network"],
  strategicGoal: [
    "Digital Transformation",
    "Customer Experience",
    "Operational Efficiency",
    "Market Expansion",
    "Cost Reduction"
  ]
};

export function EnhancedPortfolioFilters({ projects, onFiltersChange }: EnhancedPortfolioFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    status: [],
    priority: [],
    risk: [],
    category: [],
    type: [],
    strategicGoal: []
  });

  const handleFilterChange = (filterType: keyof FilterState, value: string, checked: boolean) => {
    const newFilters = {
      ...filters,
      [filterType]: checked
        ? [...filters[filterType], value]
        : filters[filterType].filter(item => item !== value)
    };
    
    setFilters(newFilters);
    applyFilters(newFilters);
  };

  const applyFilters = (currentFilters: FilterState) => {
    let filtered = projects;

    // Apply each filter type
    Object.entries(currentFilters).forEach(([filterType, values]) => {
      if (values.length > 0) {
        filtered = filtered.filter(project => {
          const projectValue = project[filterType as keyof Project] as string;
          return values.includes(projectValue);
        });
      }
    });

    onFiltersChange(filtered);
  };

  const clearAllFilters = () => {
    const emptyFilters = {
      status: [],
      priority: [],
      risk: [],
      category: [],
      type: [],
      strategicGoal: []
    };
    setFilters(emptyFilters);
    applyFilters(emptyFilters);
  };

  const getActiveFilterCount = () => {
    return Object.values(filters).reduce((count, filterArray) => count + filterArray.length, 0);
  };

  const getActiveFiltersList = () => {
    const activeFilters: string[] = [];
    Object.entries(filters).forEach(([type, values]) => {
      values.forEach(value => {
        activeFilters.push(`${type}: ${value}`);
      });
    });
    return activeFilters;
  };

  const removeFilter = (filterType: keyof FilterState, value: string) => {
    handleFilterChange(filterType, value, false);
  };

  const activeCount = getActiveFilterCount();
  const activeFilters = getActiveFiltersList();

  return (
    <div className="flex items-center gap-2">
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="gap-2">
            <Filter className="w-4 h-4" />
            Filters
            {activeCount > 0 && (
              <Badge variant="secondary" className="ml-1 px-1.5 py-0.5 text-xs">
                {activeCount}
              </Badge>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-96 p-0" align="end">
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium">Filter Projects</h3>
              {activeCount > 0 && (
                <Button variant="ghost" size="sm" onClick={clearAllFilters}>
                  <RotateCcw className="w-3 h-3 mr-1" />
                  Clear All
                </Button>
              )}
            </div>

            <div className="space-y-4 max-h-96 overflow-y-auto">
              {Object.entries(filterOptions).map(([filterType, options]) => (
                <div key={filterType}>
                  <Label className="text-sm font-medium capitalize mb-2 block">
                    {filterType.replace(/([A-Z])/g, ' $1').trim()}
                  </Label>
                  <div className="space-y-2">
                    {options.map(option => (
                      <div key={option} className="flex items-center space-x-2">
                        <Checkbox
                          id={`${filterType}-${option}`}
                          checked={filters[filterType as keyof FilterState].includes(option)}
                          onCheckedChange={(checked) =>
                            handleFilterChange(filterType as keyof FilterState, option, !!checked)
                          }
                        />
                        <Label
                          htmlFor={`${filterType}-${option}`}
                          className="text-sm font-normal cursor-pointer"
                        >
                          {option}
                        </Label>
                      </div>
                    ))}
                  </div>
                  {filterType !== 'strategicGoal' && <Separator className="mt-3" />}
                </div>
              ))}
            </div>
          </div>
        </PopoverContent>
      </Popover>

      {/* Active Filters Display */}
      {activeFilters.length > 0 && (
        <div className="flex flex-wrap gap-1 max-w-md">
          {activeFilters.slice(0, 3).map((filter, index) => {
            const [type, value] = filter.split(': ');
            return (
              <Badge
                key={index}
                variant="secondary"
                className="text-xs gap-1 pr-1"
              >
                {value}
                <button
                  onClick={() => removeFilter(type as keyof FilterState, value)}
                  className="ml-1 hover:bg-muted rounded-full p-0.5"
                >
                  <X className="w-2.5 h-2.5" />
                </button>
              </Badge>
            );
          })}
          {activeFilters.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{activeFilters.length - 3} more
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}