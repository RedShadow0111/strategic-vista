import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Calendar, 
  Users, 
  Eye, 
  Grid3X3 
} from "lucide-react";

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
}

interface PortfolioGridViewProps {
  projects: Project[];
  onViewDetails: (projectId: number) => void;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "Completed": return "bg-success text-success-foreground";
    case "In Progress": return "bg-primary text-primary-foreground";
    case "Planning": return "bg-warning text-warning-foreground";
    case "On Hold": return "bg-muted text-muted-foreground";
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

const getRiskColor = (risk: string) => {
  switch (risk) {
    case "High": return "text-destructive";
    case "Medium": return "text-warning";
    case "Low": return "text-success";
    default: return "text-muted-foreground";
  }
};

export function PortfolioGridView({ projects, onViewDetails }: PortfolioGridViewProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Grid3X3 className="w-5 h-5" />
        <h3 className="text-lg font-sf font-semibold">Project Grid</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <Card 
            key={project.id} 
            className="hover:shadow-apple-md transition-shadow cursor-pointer group"
            onClick={() => onViewDetails(project.id)}
          >
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg mb-2 group-hover:text-primary transition-colors">
                    {project.name}
                  </CardTitle>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="secondary" className={getStatusColor(project.status)}>
                      {project.status}
                    </Badge>
                    <Badge variant="outline" className={getPriorityColor(project.priority)}>
                      {project.priority}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Progress */}
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Progress</span>
                  <span className="font-medium">{project.progress}%</span>
                </div>
                <Progress value={project.progress} className="h-2" />
              </div>

              {/* Timeline & Team */}
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span className="truncate">{project.timeline}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  <span>{project.team}</span>
                </div>
              </div>

              {/* Budget */}
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Budget</span>
                  <span className="font-medium">{project.budget}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Spent: {project.spent}</span>
                  <span className={getRiskColor(project.risk)}>
                    Risk: {project.risk}
                  </span>
                </div>
              </div>

              {/* Category & Action */}
              <div className="flex items-center justify-between pt-2 border-t">
                <Badge variant="outline" className="text-xs">
                  {project.category}
                </Badge>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onViewDetails(project.id);
                  }}
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Eye className="w-4 h-4 mr-1" />
                  Details
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}