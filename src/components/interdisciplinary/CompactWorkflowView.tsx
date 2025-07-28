import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  Play, 
  Pause, 
  CheckCircle, 
  Clock, 
  Users, 
  Settings,
  ArrowRight,
  AlertTriangle
} from "lucide-react";

const mockWorkflows = [
  {
    id: "1",
    name: "Code Review Process",
    description: "Automated code review and testing workflow",
    status: "Running",
    progress: 75,
    steps: 8,
    completedSteps: 6,
    assignedTeam: ["JD", "JS", "MJ"],
    priority: "High",
    estimatedTime: "2 hours",
    nextAction: "Security scan",
    dependencies: ["API Integration", "Database Schema"]
  },
  {
    id: "2", 
    name: "Deployment Pipeline",
    description: "Continuous deployment to staging environment",
    status: "Pending",
    progress: 0,
    steps: 12,
    completedSteps: 0,
    assignedTeam: ["ED", "AR"],
    priority: "Medium",
    estimatedTime: "45 minutes",
    nextAction: "Build validation",
    dependencies: ["Code Review Process"]
  },
  {
    id: "3",
    name: "Quality Assurance",
    description: "Comprehensive testing and quality checks",
    status: "Completed",
    progress: 100,
    steps: 6,
    completedSteps: 6,
    assignedTeam: ["MJ", "ED"],
    priority: "High",
    estimatedTime: "3 hours",
    nextAction: "Report generation",
    dependencies: []
  },
  {
    id: "4",
    name: "User Acceptance Testing",
    description: "Client review and acceptance workflow",
    status: "Blocked",
    progress: 40,
    steps: 5,
    completedSteps: 2,
    assignedTeam: ["JS"],
    priority: "Low",
    estimatedTime: "1 day",
    nextAction: "Client feedback",
    dependencies: ["Quality Assurance"]
  }
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "Running": return "bg-primary text-primary-foreground";
    case "Completed": return "bg-success text-success-foreground";
    case "Pending": return "bg-warning text-warning-foreground";
    case "Blocked": return "bg-destructive text-destructive-foreground";
    default: return "bg-secondary text-secondary-foreground";
  }
};

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "High": return "bg-destructive text-destructive-foreground";
    case "Medium": return "bg-warning text-warning-foreground";
    case "Low": return "bg-success text-success-foreground";
    default: return "bg-secondary text-secondary-foreground";
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case "Running": return <Play className="w-4 h-4" />;
    case "Completed": return <CheckCircle className="w-4 h-4" />;
    case "Pending": return <Clock className="w-4 h-4" />;
    case "Blocked": return <AlertTriangle className="w-4 h-4" />;
    default: return <Clock className="w-4 h-4" />;
  }
};

export function CompactWorkflowView() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold">Workflow Overview</h2>
          <p className="text-sm text-muted-foreground">Automated processes and dependencies</p>
        </div>
        <Button size="sm">
          <Settings className="w-4 h-4 mr-2" />
          Configure
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {mockWorkflows.map((workflow) => (
          <Card key={workflow.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    {getStatusIcon(workflow.status)}
                    <CardTitle className="text-sm leading-tight">{workflow.name}</CardTitle>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {workflow.description}
                  </p>
                </div>
                <div className="flex flex-col gap-1 ml-2">
                  <Badge variant="secondary" className={getStatusColor(workflow.status)}>
                    {workflow.status}
                  </Badge>
                  <Badge variant="outline" className={getPriorityColor(workflow.priority)}>
                    {workflow.priority}
                  </Badge>
                </div>
              </div>
            </CardHeader>

            <CardContent className="pt-0">
              <div className="space-y-3">
                {/* Progress */}
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span>Progress</span>
                    <span>{workflow.completedSteps}/{workflow.steps} steps</span>
                  </div>
                  <Progress value={workflow.progress} className="h-1.5" />
                </div>

                {/* Details */}
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <div className="flex items-center gap-1 text-muted-foreground mb-1">
                      <Clock className="w-3 h-3" />
                      <span>Est. Time</span>
                    </div>
                    <span className="font-medium">{workflow.estimatedTime}</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-1 text-muted-foreground mb-1">
                      <Users className="w-3 h-3" />
                      <span>Team</span>
                    </div>
                    <div className="flex -space-x-1">
                      {workflow.assignedTeam.map((member, index) => (
                        <Avatar key={index} className="w-5 h-5 border border-background">
                          <AvatarFallback className="text-xs">
                            {member}
                          </AvatarFallback>
                        </Avatar>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Next Action */}
                <div className="p-2 bg-muted/50 rounded text-xs">
                  <div className="flex items-center gap-1 text-muted-foreground mb-1">
                    <ArrowRight className="w-3 h-3" />
                    <span>Next Action</span>
                  </div>
                  <span className="font-medium">{workflow.nextAction}</span>
                </div>

                {/* Dependencies */}
                {workflow.dependencies.length > 0 && (
                  <div>
                    <span className="text-xs text-muted-foreground">Dependencies:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {workflow.dependencies.map((dep, index) => (
                        <Badge key={index} variant="outline" className="text-xs py-0">
                          {dep}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  {workflow.status === "Running" && (
                    <Button variant="outline" size="sm" className="flex-1">
                      <Pause className="w-3 h-3 mr-1" />
                      Pause
                    </Button>
                  )}
                  {workflow.status === "Pending" && (
                    <Button variant="outline" size="sm" className="flex-1">
                      <Play className="w-3 h-3 mr-1" />
                      Start
                    </Button>
                  )}
                  <Button variant="ghost" size="sm" className="flex-1">
                    Details
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}