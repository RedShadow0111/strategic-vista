import { useState } from "react";
import { Bot, TrendingUp, AlertTriangle, Users, CheckCircle, X } from "lucide-react";
import { DashboardWidget } from "./DashboardWidget";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface AIAlert {
  id: string;
  type: "recommendation" | "prediction" | "warning" | "optimization";
  title: string;
  description: string;
  confidence: number;
  priority: "low" | "medium" | "high";
  actionable: boolean;
  dismissed?: boolean;
}

const initialAlerts: AIAlert[] = [
  {
    id: "1",
    type: "recommendation",
    title: "Resource Reallocation",
    description: "Recommend reassigning Ivan A. to Task Z for 15% efficiency gain",
    confidence: 87,
    priority: "high",
    actionable: true
  },
  {
    id: "2", 
    type: "prediction",
    title: "Project Success Probability",
    description: "Project B success probability is 64% - consider risk mitigation",
    confidence: 76,
    priority: "medium",
    actionable: true
  },
  {
    id: "3",
    type: "warning",
    title: "Budget Overrun Risk",
    description: "Digital Platform project shows 23% budget overrun risk",
    confidence: 91,
    priority: "high",
    actionable: true
  },
  {
    id: "4",
    type: "optimization",
    title: "Schedule Optimization",
    description: "Parallel execution of Tasks 3-5 could save 1.2 weeks",
    confidence: 82,
    priority: "medium",
    actionable: true
  }
];

export function AIAlertsPanel({ dragHandle }: { dragHandle?: React.ReactNode }) {
  const [alerts, setAlerts] = useState<AIAlert[]>(initialAlerts);

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "recommendation": return TrendingUp;
      case "prediction": return Bot;
      case "warning": return AlertTriangle;
      case "optimization": return CheckCircle;
      default: return Bot;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "recommendation": return "text-primary";
      case "prediction": return "text-info";
      case "warning": return "text-destructive";
      case "optimization": return "text-success";
      default: return "text-muted-foreground";
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high": return "destructive";
      case "medium": return "outline";
      case "low": return "secondary";
      default: return "secondary";
    }
  };

  const dismissAlert = (alertId: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, dismissed: true } : alert
    ));
  };

  const activeAlerts = alerts.filter(alert => !alert.dismissed);
  const highPriorityCount = activeAlerts.filter(alert => alert.priority === "high").length;

  return (
    <DashboardWidget  
      title="AI Insights Panel"
      description="Smart recommendations and predictions"
      icon={Bot}
      size="lg"
      dragHandle={dragHandle}
    >
      <div className="space-y-4">
        {/* Summary */}
        <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
          <div className="flex items-center gap-2">
            <Bot className="w-5 h-5 text-primary" />
            <span className="font-medium text-sm">
              {activeAlerts.length} Active Insights
            </span>
          </div>
          {highPriorityCount > 0 && (
            <Badge variant="destructive" className="text-xs">
              {highPriorityCount} High Priority
            </Badge>
          )}
        </div>

        {/* Alerts List */}
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {activeAlerts.map((alert) => {
            const Icon = getAlertIcon(alert.type);
            
            return (
              <div
                key={alert.id}
                className="group p-3 border rounded-lg hover:bg-muted/20 transition-all duration-200 animate-fade-in"
              >
                <div className="flex items-start gap-3">
                  <div className={cn(
                    "p-2 rounded-full bg-muted/50",
                    getTypeColor(alert.type)
                  )}>
                    <Icon className="w-4 h-4" />
                  </div>
                  
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-sm">{alert.title}</h4>
                      <div className="flex items-center gap-2">
                        <Badge 
                          variant={getPriorityBadge(alert.priority) as any}
                          className="text-xs"
                        >
                          {alert.priority}
                        </Badge>
                        <button
                          onClick={() => dismissAlert(alert.id)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-4 h-4 text-muted-foreground hover:text-foreground" />
                        </button>
                      </div>
                    </div>
                    
                    <p className="text-sm text-muted-foreground">
                      {alert.description}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">
                          Confidence: {alert.confidence}%
                        </span>
                        <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
                          <div
                            className={cn(
                              "h-full transition-all duration-500",
                              alert.confidence >= 80 ? "bg-success" :
                              alert.confidence >= 60 ? "bg-warning" : "bg-destructive"
                            )}
                            style={{ width: `${alert.confidence}%` }}
                          />
                        </div>
                      </div>
                      
                      {alert.actionable && (
                        <Button variant="outline" size="sm" className="text-xs">
                          Take Action
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {activeAlerts.length === 0 && (
          <div className="text-center py-8">
            <Bot className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">
              No active insights at the moment
            </p>
          </div>
        )}

        {/* AI Status */}
        <div className="flex items-center justify-center pt-2 border-t">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
            <span className="text-xs text-muted-foreground">
              AI Analysis Active
            </span>
          </div>
        </div>
      </div>
    </DashboardWidget>
  );
}