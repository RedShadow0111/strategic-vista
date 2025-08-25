import { TrendingUp, DollarSign } from "lucide-react";
import { DashboardWidget } from "./DashboardWidget";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface CashFlowData {
  month: string;
  income: number;
  expenses: number;
  forecast: boolean;
}

const cashFlowData: CashFlowData[] = [
  { month: "Jan", income: 850000, expenses: 720000, forecast: false },
  { month: "Feb", income: 920000, expenses: 780000, forecast: false },
  { month: "Mar", income: 780000, expenses: 810000, forecast: false },
  { month: "Apr", income: 950000, expenses: 790000, forecast: true },
  { month: "May", income: 880000, expenses: 830000, forecast: true },
  { month: "Jun", income: 1100000, expenses: 850000, forecast: true },
];

export function CashFlowForecast({ dragHandle }: { dragHandle?: React.ReactNode }) {
  const maxValue = Math.max(...cashFlowData.map(d => Math.max(d.income, d.expenses)));
  
  const currentMonthData = cashFlowData[2]; // March (current)
  const eac = 10500000; // Estimate at Completion
  const bac = 10000000; // Budget at Completion
  const vac = bac - eac; // Variance at Completion

  const getBarHeight = (value: number) => {
    return (value / maxValue) * 120; // Max height 120px
  };

  return (
    <DashboardWidget
      title="Cash Flow Forecast"
      description="Revenue, expenses and EAC/VAC analysis"
      icon={DollarSign}
      size="lg"
      dragHandle={dragHandle}
    >
      <div className="space-y-6">
        {/* EAC/VAC Summary */}
        <div className="grid grid-cols-3 gap-4 p-4 bg-muted/30 rounded-lg">
          <div className="text-center">
            <div className="text-lg font-bold text-foreground">
              ${(bac / 1000000).toFixed(1)}M
            </div>
            <div className="text-xs text-muted-foreground">BAC</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-warning">
              ${(eac / 1000000).toFixed(1)}M
            </div>
            <div className="text-xs text-muted-foreground">EAC</div>
          </div>
          <div className="text-center">
            <div className={cn(
              "text-lg font-bold",
              vac < 0 ? "text-destructive" : "text-success"
            )}>
              ${(Math.abs(vac) / 1000000).toFixed(1)}M
            </div>
            <div className="text-xs text-muted-foreground">
              VAC {vac < 0 ? "(Over)" : "(Under)"}
            </div>
          </div>
        </div>

        {/* Chart */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Monthly Overview</span>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-success" />
                <span className="text-xs text-muted-foreground">Income</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-destructive" />
                <span className="text-xs text-muted-foreground">Expenses</span>
              </div>
              <Badge variant="outline" className="text-xs">
                Forecast
              </Badge>
            </div>
          </div>

          {/* Bar Chart */}
          <div className="flex items-end justify-between gap-2 h-32">
            {cashFlowData.map((data, index) => (
              <div key={data.month} className="flex-1 flex flex-col items-center gap-2">
                <div className="relative flex items-end gap-1 w-full h-full">
                  {/* Income bar */}
                  <div
                    className={cn(
                      "flex-1 rounded-t transition-all duration-500 hover:opacity-80",
                      data.forecast ? "bg-success/60" : "bg-success",
                      data.forecast && "border-2 border-success border-dashed"
                    )}
                    style={{ height: `${getBarHeight(data.income)}px` }}
                  />
                  {/* Expenses bar */}
                  <div
                    className={cn(
                      "flex-1 rounded-t transition-all duration-500 hover:opacity-80",
                      data.forecast ? "bg-destructive/60" : "bg-destructive",
                      data.forecast && "border-2 border-destructive border-dashed"
                    )}
                    style={{ height: `${getBarHeight(data.expenses)}px` }}
                  />
                </div>
                
                {/* Month label */}
                <span className={cn(
                  "text-xs",
                  index === 2 ? "font-medium text-foreground" : "text-muted-foreground"
                )}>
                  {data.month}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Current month details */}
        <div className="flex items-center justify-between p-3 bg-primary/5 rounded-lg border border-primary/20">
          <div>
            <div className="font-medium text-sm">March Performance</div>
            <div className="text-xs text-muted-foreground">
              Net: ${((currentMonthData.income - currentMonthData.expenses) / 1000).toFixed(0)}K
            </div>
          </div>
          <div className="flex items-center gap-1">
            <TrendingUp className={cn(
              "w-4 h-4",
              currentMonthData.income > currentMonthData.expenses 
                ? "text-success" 
                : "text-destructive"
            )} />
            <span className={cn(
              "text-sm font-medium",
              currentMonthData.income > currentMonthData.expenses 
                ? "text-success" 
                : "text-destructive" 
            )}>
              {currentMonthData.income > currentMonthData.expenses ? "Profit" : "Loss"}
            </span>
          </div>
        </div>
      </div>
    </DashboardWidget>
  );
}