import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  Plus,
  Folder,
  Calendar,
  Users,
  DollarSign,
  AlertTriangle,
  FileText,
  BarChart3
} from "lucide-react";

// Components for each tab
import { ProjectOverview } from "@/components/projects/ProjectOverview";
import { ProjectSchedule } from "@/components/projects/ProjectSchedule";
import { ProjectTeam } from "@/components/projects/ProjectTeam";
import { ProjectFinances } from "@/components/projects/ProjectFinances";
import { ProjectRisks } from "@/components/projects/ProjectRisks";
import { ProjectDocuments } from "@/components/projects/ProjectDocuments";

const projects = [
  {
    id: 1,
    name: "Digital Transformation Initiative",
    description: "Modernizing core business processes",
    status: "In Progress",
    priority: "High",
    progress: 72,
    sponsor: "Sarah Johnson",
    category: "Strategic",
    budget: 2500000,
    spent: 1800000,
    teamSize: 15,
    riskLevel: "Medium"
  },
  {
    id: 2,
    name: "Customer Portal Redesign", 
    description: "Complete UX overhaul and new features",
    status: "Planning",
    priority: "Medium",
    progress: 15,
    sponsor: "Mike Chen",
    category: "Product",
    budget: 850000,
    spent: 127500,
    teamSize: 8,
    riskLevel: "Low"
  },
  {
    id: 3,
    name: "Infrastructure Modernization",
    description: "Cloud migration and architecture upgrade",
    status: "In Progress", 
    priority: "High",
    progress: 85,
    sponsor: "Emily Rodriguez",
    category: "Infrastructure",
    budget: 1200000,
    spent: 1020000,
    teamSize: 12,
    riskLevel: "High"
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
  const [selectedProject, setSelectedProject] = useState(projects[0]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("overview");

  const filteredProjects = projects.filter(project =>
    project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-screen flex bg-background">
      {/* Left Sidebar - Project List */}
      <div className="w-80 border-r border-border bg-muted/20">
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-sf font-bold text-foreground">Проекты</h2>
            <Button size="sm">
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Поиск проектов..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-2">
            {filteredProjects.map((project) => (
              <Card 
                key={project.id}
                className={`mb-2 cursor-pointer transition-all hover:shadow-md ${
                  selectedProject.id === project.id 
                    ? 'ring-2 ring-primary bg-primary/5' 
                    : 'hover:bg-muted/50'
                }`}
                onClick={() => setSelectedProject(project)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Folder className="w-4 h-4 text-primary" />
                      <h3 className="font-medium text-sm leading-tight">{project.name}</h3>
                    </div>
                  </div>
                  
                  <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                    {project.description}
                  </p>
                  
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="secondary" className={`${getStatusColor(project.status)} text-xs`}>
                      {project.status}
                    </Badge>
                    <Badge variant="outline" className={`${getPriorityColor(project.priority)} text-xs`}>
                      {project.priority}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{project.progress}% завершено</span>
                    <span>{project.teamSize} участников</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Project Header */}
        <div className="p-6 border-b border-border bg-background">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-sf font-bold text-foreground mb-1">
                {selectedProject.name}
              </h1>
              <p className="text-muted-foreground">
                {selectedProject.description}
              </p>
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                {selectedProject.teamSize}
              </div>
              <div className="flex items-center gap-1">
                <BarChart3 className="w-4 h-4" />
                {selectedProject.progress}%
              </div>
              <Badge variant="secondary" className={getStatusColor(selectedProject.status)}>
                {selectedProject.status}
              </Badge>
            </div>
          </div>
        </div>

        {/* Project Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
          <div className="px-6 pt-4">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="overview" className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="schedule" className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Schedule
              </TabsTrigger>
              <TabsTrigger value="team" className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                Team
              </TabsTrigger>
              <TabsTrigger value="finances" className="flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                Finances
              </TabsTrigger>
              <TabsTrigger value="risks" className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                Risks
              </TabsTrigger>
              <TabsTrigger value="documents" className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Documents
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="flex-1 p-6">
            <TabsContent value="overview" className="h-full mt-0 animate-fade-in">
              <ProjectOverview project={selectedProject} />
            </TabsContent>
            
            <TabsContent value="schedule" className="h-full mt-0 animate-fade-in">
              <ProjectSchedule project={selectedProject} />
            </TabsContent>
            
            <TabsContent value="team" className="h-full mt-0 animate-fade-in">
              <ProjectTeam project={selectedProject} />
            </TabsContent>
            
            <TabsContent value="finances" className="h-full mt-0 animate-fade-in">
              <ProjectFinances project={selectedProject} />
            </TabsContent>
            
            <TabsContent value="risks" className="h-full mt-0 animate-fade-in">
              <ProjectRisks project={selectedProject} />
            </TabsContent>
            
            <TabsContent value="documents" className="h-full mt-0 animate-fade-in">
              <ProjectDocuments project={selectedProject} />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
}