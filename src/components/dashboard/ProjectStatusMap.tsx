import { Target, AlertTriangle, CheckCircle, Clock } from "lucide-react";
import { DashboardWidget } from "./DashboardWidget";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface Project {
  id: string;
  name: string;
  risk: number; // 0-100
  progress: number; // 0-100
  budget: number; // in millions
  status: "on-track" | "at-risk" | "delayed" | "completed";
}

const projects: Project[] = [
  { id: "1", name: "Digital Transformation", risk: 25, progress: 68, budget: 2.5, status: "on-track" },
  { id: "2", name: "Infrastructure Upgrade", risk: 75, progress: 45, budget: 4.2, status: "at-risk" },
  { id: "3", name: "Mobile App Platform", risk: 15, progress: 92, budget: 1.8, status: "on-track" },
  { id: "4", name: "Data Analytics Suite", risk: 55, progress: 30, budget: 3.1, status: "delayed" },
  { id: "5", name: "Security Enhancement", risk: 35, progress: 78, budget: 1.2, status: "on-track" },
  { id: "6", name: "Cloud Migration", risk: 20, progress: 100, budget: 2.8, status: "completed" },
];

const getStatusIcon = (status: Project["status"]) => {
  switch (status) {
    case "completed": return CheckCircle;
    case "on-track": return Target;
    case "at-risk": return AlertTriangle;
    case "delayed": return Clock;
  }
};

const getStatusColor = (status: Project["status"]) => {
  switch (status) {
    case "completed": return "text-success";
    case "on-track": return "text-primary";
    case "at-risk": return "text-warning";
    case "delayed": return "text-destructive";
  }
};

export function ProjectStatusMap() {
  const getBubbleSize = (budget: number) => {
    const minSize = 40;
    const maxSize = 80;
    const maxBudget = Math.max(...projects.map(p => p.budget));
    const size = minSize + (budget / maxBudget) * (maxSize - minSize);
    return size;
  };

  return (
    <DashboardWidget
      title="Project Status Map"
      description="Risk vs Progress matrix with budget-based sizing"
      icon={Target}
      size="lg"
    >
      <div className="space-y-4">
        {/* Chart area */}
        <div className="relative bg-muted/20 rounded-lg p-6 h-80">
          {/* Axis labels */}
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-xs text-muted-foreground font-medium">
            Risk Level →
          </div>
          <div className="absolute left-2 top-1/2 transform -translate-y-1/2 -rotate-90 text-xs text-muted-foreground font-medium">
            ← Progress
          </div>

          {/* Grid lines */}
          <div className="absolute inset-6 opacity-20">
            {/* Vertical lines */}
            {[25, 50, 75].map((x) => (
              <div
                key={`v-${x}`}
                className="absolute top-0 bottom-0 border-l border-border"
                style={{ left: `${x}%` }}
              />
            ))}
            {/* Horizontal lines */}
            {[25, 50, 75].map((y) => (
              <div
                key={`h-${y}`}
                className="absolute left-0 right-0 border-t border-border"
                style={{ top: `${100 - y}%` }}
              />
            ))}
          </div>

          {/* Project bubbles */}
          <div className="absolute inset-6">
            {projects.map((project) => {
              const StatusIcon = getStatusIcon(project.status);
              const size = getBubbleSize(project.budget);
              
              return (
                <div
                  key={project.id}
                  className="absolute group cursor-pointer transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 hover:scale-110 hover:z-10"
                  style={{
                    left: `${project.risk}%`,
                    top: `${100 - project.progress}%`,
                    width: size,
                    height: size,
                  }}
                >
                  <div className={cn(
                    "w-full h-full rounded-full flex items-center justify-center shadow-apple-md",
                    "border-2 border-white dark:border-gray-800",
                    "group-hover:shadow-apple-lg",
                    {
                      "bg-success/20 border-success": project.status === "completed",
                      "bg-primary/20 border-primary": project.status === "on-track",
                      "bg-warning/20 border-warning": project.status === "at-risk",
                      "bg-destructive/20 border-destructive": project.status === "delayed",
                    }
                  )}>
                    <StatusIcon className={cn("w-4 h-4", getStatusColor(project.status))} />
                  </div>
                  
                  {/* Tooltip */}
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-20">
                    <div className="bg-popover border border-border rounded-lg shadow-apple-md p-3 text-sm whitespace-nowrap">
                      <div className="font-medium text-foreground">{project.name}</div>
                      <div className="text-muted-foreground mt-1">
                        Progress: {project.progress}% • Risk: {project.risk}%
                      </div>
                      <div className="text-muted-foreground">
                        Budget: ${project.budget}M
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-4 justify-center">
          {[
            { status: "completed" as const, label: "Completed", count: projects.filter(p => p.status === "completed").length },
            { status: "on-track" as const, label: "On Track", count: projects.filter(p => p.status === "on-track").length },
            { status: "at-risk" as const, label: "At Risk", count: projects.filter(p => p.status === "at-risk").length },
            { status: "delayed" as const, label: "Delayed", count: projects.filter(p => p.status === "delayed").length },
          ].map(({ status, label, count }) => {
            const StatusIcon = getStatusIcon(status);
            return (
              <div key={status} className="flex items-center gap-2">
                <StatusIcon className={cn("w-4 h-4", getStatusColor(status))} />
                <span className="text-sm text-muted-foreground">{label}</span>
                <Badge variant="secondary" className="text-xs">
                  {count}
                </Badge>
              </div>
            );
          })}
        </div>
      </div>
    </DashboardWidget>
  );
}