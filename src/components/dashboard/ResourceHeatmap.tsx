import { Users, Clock, AlertCircle } from "lucide-react";
import { DashboardWidget } from "./DashboardWidget";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface TeamUtilization {
  teamName: string;
  weeks: number[]; // utilization percentage for each week (0-150)
}

const teams: TeamUtilization[] = [
  { teamName: "Frontend Dev", weeks: [85, 92, 78, 95, 120, 110, 88, 92] },
  { teamName: "Backend Dev", weeks: [90, 88, 95, 102, 85, 90, 95, 88] },
  { teamName: "DevOps", weeks: [110, 125, 108, 95, 135, 115, 100, 105] },
  { teamName: "QA Testing", weeks: [75, 80, 85, 90, 95, 88, 82, 78] },
  { teamName: "UX/UI Design", weeks: [65, 70, 85, 92, 88, 95, 90, 85] },
  { teamName: "Data Science", weeks: [95, 105, 110, 98, 102, 108, 95, 100] },
];

const getUtilizationColor = (utilization: number) => {
  if (utilization >= 100) return "bg-destructive text-destructive-foreground"; // Overloaded
  if (utilization >= 80) return "bg-success text-success-foreground"; // Optimal
  return "bg-primary text-primary-foreground"; // Underutilized
};

const getUtilizationLabel = (utilization: number) => {
  if (utilization >= 100) return "Overloaded";
  if (utilization >= 80) return "Optimal";
  return "Available";
};

export function ResourceHeatmap({ dragHandle }: { dragHandle?: React.ReactNode }) {
  const weekLabels = ["W45", "W46", "W47", "W48", "W49", "W50", "W51", "W52"];
  
  // Calculate averages for summary
  const overloadedTeams = teams.filter(team => 
    team.weeks.some(week => week >= 100)
  ).length;
  
  const totalCapacity = teams.reduce((sum, team) => 
    sum + team.weeks.reduce((weekSum, week) => weekSum + week, 0), 0
  ) / (teams.length * weekLabels.length);

  return (
    <DashboardWidget
      title="Resource Heatmap"
      description="Team capacity utilization over the next 8 weeks"
      icon={Users}
      size="lg"
      dragHandle={dragHandle}
    >
      <div className="space-y-6">
        {/* Summary stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-3 bg-muted/50 rounded-lg">
            <div className="text-2xl font-bold font-sf text-foreground">{Math.round(totalCapacity)}%</div>
            <div className="text-sm text-muted-foreground">Avg Utilization</div>
          </div>
          <div className="text-center p-3 bg-muted/50 rounded-lg">
            <div className="text-2xl font-bold font-sf text-destructive">{overloadedTeams}</div>
            <div className="text-sm text-muted-foreground">Overloaded Teams</div>
          </div>
          <div className="text-center p-3 bg-muted/50 rounded-lg">
            <div className="text-2xl font-bold font-sf text-success">{teams.length - overloadedTeams}</div>
            <div className="text-sm text-muted-foreground">Healthy Teams</div>
          </div>
        </div>

        {/* Heatmap */}
        <div className="space-y-2">
          {/* Header row */}
          <div className="grid grid-cols-9 gap-2 mb-2">
            <div className="text-sm font-medium text-muted-foreground py-2">Team</div>
            {weekLabels.map((week) => (
              <div key={week} className="text-sm font-medium text-muted-foreground text-center py-2">
                {week}
              </div>
            ))}
          </div>

          {/* Data rows */}
          {teams.map((team) => (
            <div key={team.teamName} className="grid grid-cols-9 gap-2 items-center">
              <div className="text-sm font-medium text-foreground py-1 truncate">
                {team.teamName}
              </div>
              {team.weeks.map((utilization, weekIndex) => (
                <div
                  key={weekIndex}
                  className={cn(
                    "h-8 rounded flex items-center justify-center text-xs font-medium transition-all duration-200 hover:scale-105 cursor-pointer",
                    getUtilizationColor(utilization)
                  )}
                  title={`${team.teamName}: ${utilization}% utilization (${getUtilizationLabel(utilization)})`}
                >
                  {utilization}%
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-primary"></div>
            <span className="text-sm text-muted-foreground">Available (&lt;80%)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-success"></div>
            <span className="text-sm text-muted-foreground">Optimal (80-99%)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-destructive"></div>
            <span className="text-sm text-muted-foreground">Overloaded (≥100%)</span>
          </div>
        </div>

        {/* Quick actions */}
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline" className="cursor-pointer hover:bg-accent">
            <AlertCircle className="w-3 h-3 mr-1" />
            Rebalance DevOps
          </Badge>
          <Badge variant="outline" className="cursor-pointer hover:bg-accent">
            <Clock className="w-3 h-3 mr-1" />
            Schedule Review
          </Badge>
          <Badge variant="outline" className="cursor-pointer hover:bg-accent">
            <Users className="w-3 h-3 mr-1" />
            View Details
          </Badge>
        </div>
      </div>
    </DashboardWidget>
  );
}