import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  FileStack, 
  Calendar, 
  Clock, 
  Users, 
  Target, 
  Plus,
  Search,
  SortAsc,
  Filter,
  MoreHorizontal
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const projects = [
  {
    id: 1,
    name: "Digital Transformation Initiative",
    description: "Modernizing core business processes and implementing new digital workflows",
    status: "In Progress",
    priority: "High",
    progress: 72,
    startDate: "2024-02-15",
    endDate: "2024-12-31",
    team: [
      { name: "Sarah Chen", role: "PM", avatar: "SC" },
      { name: "Mike Johnson", role: "Tech Lead", avatar: "MJ" },
      { name: "Emma Davis", role: "Designer", avatar: "ED" }
    ],
    tasks: { total: 45, completed: 32, inProgress: 8, pending: 5 },
    budget: "$2.5M",
    category: "Strategic"
  },
  {
    id: 2,
    name: "Customer Portal Redesign",
    description: "Complete redesign of customer-facing portal with improved UX and new features",
    status: "Planning",
    priority: "Medium",
    progress: 15,
    startDate: "2024-07-01",
    endDate: "2025-03-31",
    team: [
      { name: "Alex Rodriguez", role: "PM", avatar: "AR" },
      { name: "Lisa Wang", role: "UX Lead", avatar: "LW" }
    ],
    tasks: { total: 28, completed: 4, inProgress: 3, pending: 21 },
    budget: "$850K",
    category: "Product"
  },
  {
    id: 3,
    name: "Infrastructure Modernization",
    description: "Upgrading server infrastructure and migrating to cloud-native architecture",
    status: "In Progress",
    priority: "High",
    progress: 85,
    startDate: "2024-01-10",
    endDate: "2024-09-30",
    team: [
      { name: "David Kim", role: "PM", avatar: "DK" },
      { name: "Rachel Green", role: "DevOps", avatar: "RG" },
      { name: "Tom Wilson", role: "Architect", avatar: "TW" }
    ],
    tasks: { total: 52, completed: 44, inProgress: 6, pending: 2 },
    budget: "$1.2M",
    category: "Infrastructure"
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

export default function Projects() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-sf font-bold text-foreground">Project Management</h1>
          <p className="text-muted-foreground mt-1">
            Track progress, manage tasks, and coordinate team activities
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm">
            <Search className="w-4 h-4 mr-2" />
            Search
          </Button>
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          <Button size="sm">
            <Plus className="w-4 h-4 mr-2" />
            New Project
          </Button>
        </div>
      </div>

      {/* Project Tabs */}
      <Tabs defaultValue="active" className="w-full">
        <TabsList className="grid w-full grid-cols-4 max-w-md">
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="planning">Planning</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="all">All</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-6 mt-6">
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Active Projects</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">18</div>
                <div className="text-xs text-muted-foreground mt-1">
                  +3 this quarter
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Tasks</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">342</div>
                <div className="text-xs text-success mt-1">
                  68% completed
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Team Members</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">56</div>
                <div className="text-xs text-primary mt-1">
                  Across all projects
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">On Schedule</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">85%</div>
                <div className="text-xs text-success mt-1">
                  15/18 projects
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Project List */}
          <div className="space-y-4">
            {projects.map((project) => (
              <Card key={project.id} className="hover:shadow-apple-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-sf font-semibold text-lg text-foreground">
                          {project.name}
                        </h3>
                        <Badge variant="secondary" className={getStatusColor(project.status)}>
                          {project.status}
                        </Badge>
                        <Badge variant="outline" className={getPriorityColor(project.priority)}>
                          {project.priority}
                        </Badge>
                      </div>
                      <p className="text-muted-foreground text-sm mb-3">
                        {project.description}
                      </p>
                    </div>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Progress & Timeline */}
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-muted-foreground">Progress</span>
                          <span className="font-medium">{project.progress}%</span>
                        </div>
                        <Progress value={project.progress} className="h-2" />
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {new Date(project.startDate).toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-1">
                          <Target className="w-4 h-4" />
                          {new Date(project.endDate).toLocaleDateString()}
                        </div>
                      </div>
                    </div>

                    {/* Team */}
                    <div>
                      <div className="text-sm text-muted-foreground mb-2">Team</div>
                      <div className="flex items-center gap-2">
                        {project.team.map((member, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <Avatar className="w-6 h-6">
                              <AvatarFallback className="text-xs">
                                {member.avatar}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-xs text-muted-foreground">
                              {member.role}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Tasks & Actions */}
                    <div className="space-y-3">
                      <div>
                        <div className="text-sm text-muted-foreground mb-2">Tasks</div>
                        <div className="grid grid-cols-4 gap-2 text-xs">
                          <div className="text-center">
                            <div className="font-medium text-foreground">{project.tasks.completed}</div>
                            <div className="text-success">Done</div>
                          </div>
                          <div className="text-center">
                            <div className="font-medium text-foreground">{project.tasks.inProgress}</div>
                            <div className="text-warning">Active</div>
                          </div>
                          <div className="text-center">
                            <div className="font-medium text-foreground">{project.tasks.pending}</div>
                            <div className="text-muted-foreground">Pending</div>
                          </div>
                          <div className="text-center">
                            <div className="font-medium text-foreground">{project.tasks.total}</div>
                            <div className="text-muted-foreground">Total</div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="flex-1">
                          <FileStack className="w-4 h-4 mr-1" />
                          Tasks
                        </Button>
                        <Button variant="ghost" size="sm">
                          Details
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="planning" className="mt-6">
          <Card>
            <CardContent className="p-12 text-center">
              <FileStack className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-sf font-semibold text-foreground mb-2">Planning Projects</h3>
              <p className="text-muted-foreground mb-4">
                Projects in planning phase will appear here
              </p>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Create Planning Project
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="completed" className="mt-6">
          <Card>
            <CardContent className="p-12 text-center">
              <Target className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-sf font-semibold text-foreground mb-2">Completed Projects</h3>
              <p className="text-muted-foreground mb-4">
                Successfully completed projects will be shown here
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="all" className="mt-6">
          <Card>
            <CardContent className="p-12 text-center">
              <FileStack className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-sf font-semibold text-foreground mb-2">All Projects</h3>
              <p className="text-muted-foreground mb-4">
                Complete project overview across all statuses
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}