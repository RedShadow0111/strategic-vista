import { Activity, TrendingUp, TrendingDown } from "lucide-react";
import { DashboardWidget } from "./DashboardWidget";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function PortfolioPulse({ dragHandle }: { dragHandle?: React.ReactNode }) {
  const pulseScore = 78;
  const trend = 5.2; // positive trend
  const status = pulseScore >= 80 ? "excellent" : pulseScore >= 60 ? "good" : "needs-attention";
  
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-success";
    if (score >= 60) return "text-warning";
    return "text-destructive";
  };

  return (
    <DashboardWidget
      title="Portfolio Pulse Score"
      description="Overall portfolio health indicator"
      icon={Activity}
      size="md"
      dragHandle={dragHandle}
    >
      <div className="space-y-6">
        {/* Main score display */}
        <div className="text-center">
          <div className="relative inline-flex items-center justify-center">
            <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
              {/* Background circle */}
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                className="text-muted"
              />
              {/* Progress circle */}
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                strokeDasharray={`${2 * Math.PI * 40}`}
                strokeDashoffset={`${2 * Math.PI * 40 * (1 - pulseScore / 100)}`}
                className={cn("transition-all duration-1000 ease-out", getScoreColor(pulseScore))}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className={cn("text-4xl font-bold font-sf", getScoreColor(pulseScore))}>
                {pulseScore}
              </span>
              <span className="text-sm text-muted-foreground">out of 100</span>
            </div>
          </div>
        </div>

        {/* Status and trend */}
        <div className="flex items-center justify-between">
          <Badge variant={status === "excellent" ? "default" : status === "good" ? "secondary" : "destructive"}>
            {status === "excellent" ? "Excellent" : status === "good" ? "Good" : "Needs Attention"}
          </Badge>
          
          <div className="flex items-center gap-1">
            {trend > 0 ? (
              <TrendingUp className="w-4 h-4 text-success" />
            ) : (
              <TrendingDown className="w-4 h-4 text-destructive" />
            )}
            <span className={cn("text-sm font-medium", trend > 0 ? "text-success" : "text-destructive")}>
              {trend > 0 ? "+" : ""}{trend}%
            </span>
            <span className="text-sm text-muted-foreground">vs last month</span>
          </div>
        </div>

        {/* Contributing factors */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-foreground">Contributing Factors:</h4>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Schedule Performance</span>
              <div className="flex items-center gap-2">
                <Progress value={85} className="w-16 h-2" />
                <span className="text-sm font-medium text-success">85%</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Budget Performance</span>
              <div className="flex items-center gap-2">
                <Progress value={72} className="w-16 h-2" />
                <span className="text-sm font-medium text-warning">72%</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Resource Utilization</span>
              <div className="flex items-center gap-2">
                <Progress value={78} className="w-16 h-2" />
                <span className="text-sm font-medium text-success">78%</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Risk Management</span>
              <div className="flex items-center gap-2">
                <Progress value={68} className="w-16 h-2" />
                <span className="text-sm font-medium text-warning">68%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardWidget>
  );
}