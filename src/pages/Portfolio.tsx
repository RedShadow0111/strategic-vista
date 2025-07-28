import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  FolderOpen, 
  Calendar, 
  Users, 
  Target, 
  TrendingUp, 
  AlertTriangle,
  Filter,
  Grid3X3,
  List,
  Eye,
  FolderKanban
} from "lucide-react";
import { PortfolioFilters } from "@/components/portfolio/PortfolioFilters";
import { PortfolioViewToggle } from "@/components/portfolio/PortfolioViewToggle";
import { PortfolioGridView } from "@/components/portfolio/PortfolioGridView";
import { PortfolioManagement } from "@/components/portfolio/PortfolioManagement";

const portfolioProjects = [
  {
    id: 1,
    name: "Digital Transformation Initiative",
    status: "In Progress",
    priority: "High",
    budget: "$2.5M",
    spent: "$1.8M",
    progress: 72,
    timeline: "Q2 2024 - Q4 2024",
    team: 12,
    risk: "Medium",
    category: "Strategic"
  },
  {
    id: 2,
    name: "Customer Portal Redesign",
    status: "Planning",
    priority: "Medium",
    budget: "$850K",
    spent: "$120K",
    progress: 15,
    timeline: "Q3 2024 - Q1 2025",
    team: 8,
    risk: "Low",
    category: "Product"
  },
  {
    id: 3,
    name: "Infrastructure Modernization",
    status: "In Progress",
    priority: "High",
    budget: "$1.2M",
    spent: "$950K",
    progress: 85,
    timeline: "Q1 2024 - Q3 2024",
    team: 15,
    risk: "High",
    category: "Infrastructure"
  },
  {
    id: 4,
    name: "Mobile App Development",
    status: "Completed",
    priority: "Medium",
    budget: "$600K",
    spent: "$580K",
    progress: 100,
    timeline: "Q4 2023 - Q2 2024",
    team: 6,
    risk: "Low",
    category: "Product"
  }
];

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

export default function Portfolio() {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [filteredProjects, setFilteredProjects] = useState(portfolioProjects);

  const handleViewDetails = (projectId: number) => {
    navigate(`/projects/${projectId}`);
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-border pb-4">
        <h1 className="text-3xl font-sf font-bold text-foreground">Project Portfolio</h1>
        <p className="text-muted-foreground mt-2">
          Strategic overview and management of all organizational projects
        </p>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <List className="w-4 h-4" />
            Project Overview
          </TabsTrigger>
          <TabsTrigger value="management" className="flex items-center gap-2">
            <FolderKanban className="w-4 h-4" />
            Portfolio Management
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Header controls */}
          <div className="flex items-center justify-between">
            <div></div>
            <div className="flex items-center gap-3">
              <PortfolioFilters onFiltersChange={setFilteredProjects} projects={portfolioProjects} />
              <PortfolioViewToggle viewMode={viewMode} onViewModeChange={setViewMode} />
              <Button size="sm">
                <FolderOpen className="w-4 h-4 mr-2" />
                New Project
              </Button>
            </div>
          </div>

          {/* Portfolio Summary */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Projects</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">24</div>
                <div className="flex items-center text-xs text-success mt-1">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +2 this month
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Budget</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">$12.5M</div>
                <div className="flex items-center text-xs text-muted-foreground mt-1">
                  <Target className="w-3 h-3 mr-1" />
                  $9.2M allocated
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Active Projects</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">18</div>
                <div className="flex items-center text-xs text-warning mt-1">
                  <AlertTriangle className="w-3 h-3 mr-1" />
                  3 at risk
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Team Members</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">156</div>
                <div className="flex items-center text-xs text-primary mt-1">
                  <Users className="w-3 h-3 mr-1" />
                  87% utilization
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Project Matrix */}
          {viewMode === "list" ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <List className="w-5 h-5" />
                  Project Matrix
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredProjects.map((project) => (
                    <div 
                      key={project.id}
                      className="border border-border rounded-lg p-4 hover:bg-accent/50 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="font-sf font-semibold text-foreground mb-1">
                            {project.name}
                          </h3>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {project.timeline}
                            </div>
                            <div className="flex items-center gap-1">
                              <Users className="w-4 h-4" />
                              {project.team} members
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className={getStatusColor(project.status)}>
                            {project.status}
                          </Badge>
                          <Badge variant="outline" className={getPriorityColor(project.priority)}>
                            {project.priority}
                          </Badge>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-muted-foreground">Progress</span>
                            <span className="font-medium">{project.progress}%</span>
                          </div>
                          <Progress value={project.progress} className="h-2" />
                        </div>

                        <div>
                          <div className="flex justify-between text-sm mb-1">
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

                        <div className="flex items-center justify-between">
                          <Badge variant="outline" className="text-xs">
                            {project.category}
                          </Badge>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleViewDetails(project.id)}
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            View Details
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ) : (
            <PortfolioGridView 
              projects={filteredProjects} 
              onViewDetails={handleViewDetails}
            />
          )}
        </TabsContent>

        <TabsContent value="management">
          <PortfolioManagement />
        </TabsContent>
      </Tabs>
    </div>
  );
}