import { useState, useEffect } from "react";
import { TrendingUp, AlertTriangle, Clock } from "lucide-react";
import { DashboardWidget } from "./DashboardWidget";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface TimelineEvent {
  id: string;
  type: "delay" | "overload" | "milestone" | "risk";
  title: string;
  description: string;
  date: string;
  severity: "low" | "medium" | "high";
  projectName: string;
}

const timelineEvents: TimelineEvent[] = [
  {
    id: "1",
    type: "delay",
    title: "Project X Completion Delay",
    description: "Expected 2 weeks delay due to resource constraints",
    date: "2024-03-15",
    severity: "medium",
    projectName: "Digital Transformation"
  },
  {
    id: "2", 
    type: "overload",
    title: "Resource Y Overload Alert",
    description: "Ivan Petrov will be overloaded from May 15th",
    date: "2024-05-15",
    severity: "high",
    projectName: "Mobile App"
  },
  {
    id: "3",
    type: "milestone",
    title: "Critical Milestone Due",
    description: "System integration testing phase starts",
    date: "2024-04-01",
    severity: "low",
    projectName: "ERP Implementation"
  },
  {
    id: "4",
    type: "risk",
    title: "Budget Risk Identified",
    description: "Project B budget variance detected",
    date: "2024-03-20",
    severity: "high",
    projectName: "Infrastructure Upgrade"
  }
];

export function PredictiveTimeline({ dragHandle }: { dragHandle?: React.ReactNode }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [autoScroll, setAutoScroll] = useState(true);

  useEffect(() => {
    if (!autoScroll) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % timelineEvents.length);
    }, 8000);

    return () => clearInterval(interval);
  }, [autoScroll]);

  const getEventIcon = (type: string) => {
    switch (type) {
      case "delay": return Clock;
      case "overload": return AlertTriangle;
      case "milestone": return TrendingUp;
      case "risk": return AlertTriangle;
      default: return Clock;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "low": return "text-success";
      case "medium": return "text-warning";
      case "high": return "text-destructive";
      default: return "text-muted-foreground";
    }
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case "low": return "secondary";
      case "medium": return "outline";
      case "high": return "destructive";
      default: return "secondary";
    }
  };

  return (
    <DashboardWidget
      title="Predictive Timeline"
      description="AI-powered project forecasts and alerts"
      icon={TrendingUp}
      size="lg"
      dragHandle={dragHandle}
    >
      <div className="space-y-4">
        {/* Auto-scroll toggle */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">
            {timelineEvents.length} predictions
          </span>
          <button
            onClick={() => setAutoScroll(!autoScroll)}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            Auto-scroll: {autoScroll ? "ON" : "OFF"}
          </button>
        </div>

        {/* Current event display */}
        <div className="bg-muted/30 rounded-lg p-4 space-y-3 animate-fade-in">
          <div className="flex items-start gap-3">
            {(() => {
              const Icon = getEventIcon(timelineEvents[currentIndex].type);
              return (
                <div className={cn(
                  "p-2 rounded-full",
                  getSeverityColor(timelineEvents[currentIndex].severity)
                )}>
                  <Icon className="w-5 h-5" />
                </div>
              );
            })()}
            
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-2">
                <h4 className="font-medium text-sm">
                  {timelineEvents[currentIndex].title}
                </h4>
                <Badge variant={getSeverityBadge(timelineEvents[currentIndex].severity) as any}>
                  {timelineEvents[currentIndex].severity}
                </Badge>
              </div>
              
              <p className="text-sm text-muted-foreground">
                {timelineEvents[currentIndex].description}
              </p>
              
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">
                  {timelineEvents[currentIndex].projectName}
                </span>
                <span className="text-xs font-medium">
                  {new Date(timelineEvents[currentIndex].date).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Timeline indicators */}
        <div className="flex items-center gap-2">
          {timelineEvents.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setCurrentIndex(index);
                setAutoScroll(false);
              }}
              className={cn(
                "w-2 h-2 rounded-full transition-all duration-300",
                index === currentIndex 
                  ? "bg-primary scale-125" 
                  : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
              )}
            />
          ))}
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-3 gap-3 pt-2 border-t">
          <div className="text-center">
            <div className="text-lg font-bold text-destructive">2</div>
            <div className="text-xs text-muted-foreground">High Risk</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-warning">1</div>
            <div className="text-xs text-muted-foreground">Medium Risk</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-success">1</div>
            <div className="text-xs text-muted-foreground">Low Risk</div>
          </div>
        </div>
      </div>
    </DashboardWidget>
  );
}