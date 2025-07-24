import { useState, useEffect } from "react";
import { ArrowLeft, Clock, User, Calendar, CheckCircle, AlertCircle, Circle, MoreHorizontal, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useNavigate, useSearchParams } from "react-router-dom";

const mockProject = {
  id: "1",
  name: "AI Platform Development",
  portfolio: "Technology Portfolio",
  description: "Building a comprehensive AI platform for enterprise clients with machine learning capabilities.",
  status: "In Progress",
  priority: "High",
  progress: 65,
  startDate: "2024-01-15",
  endDate: "2024-06-30",
  budget: 450000,
  spent: 287000,
  team: [
    { id: "1", name: "Alice Chen", role: "Project Manager", avatar: "/placeholder.svg" },
    { id: "2", name: "Bob Smith", role: "Lead Developer", avatar: "/placeholder.svg" },
    { id: "3", name: "Carol Davis", role: "UI/UX Designer", avatar: "/placeholder.svg" },
    { id: "4", name: "David Wilson", role: "Data Scientist", avatar: "/placeholder.svg" }
  ]
};

const mockTasks = [
  {
    id: "1",
    title: "API Integration Development",
    description: "Develop REST API endpoints for ML model integration",
    status: "In Progress",
    priority: "High",
    assignee: "Bob Smith",
    dueDate: "2024-02-15",
    progress: 80,
    estimatedHours: 40,
    spentHours: 32
  },
  {
    id: "2",
    title: "User Interface Design",
    description: "Create responsive dashboard for AI platform",
    status: "Review",
    priority: "Medium",
    assignee: "Carol Davis",
    dueDate: "2024-02-10",
    progress: 95,
    estimatedHours: 32,
    spentHours: 30
  },
  {
    id: "3",
    title: "ML Model Training",
    description: "Train and optimize machine learning models",
    status: "To Do",
    priority: "High",
    assignee: "David Wilson",
    dueDate: "2024-02-20",
    progress: 15,
    estimatedHours: 60,
    spentHours: 9
  },
  {
    id: "4",
    title: "Database Schema Design",
    description: "Design optimized database structure for AI data",
    status: "Completed",
    priority: "High",
    assignee: "Bob Smith",
    dueDate: "2024-01-30",
    progress: 100,
    estimatedHours: 24,
    spentHours: 22
  }
];

const getStatusIcon = (status: string) => {
  switch (status) {
    case "Completed":
      return <CheckCircle className="w-4 h-4 text-green-500" />;
    case "In Progress":
      return <Clock className="w-4 h-4 text-blue-500" />;
    case "Review":
      return <AlertCircle className="w-4 h-4 text-yellow-500" />;
    default:
      return <Circle className="w-4 h-4 text-gray-400" />;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "Completed":
      return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
    case "In Progress":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400";
    case "Review":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
  }
};

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "High":
      return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400";
    case "Medium":
      return "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400";
    case "Low":
      return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
  }
};

export default function ProjectDetails() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const tabFromUrl = searchParams.get("tab") || "overview";
  const [selectedTab, setSelectedTab] = useState(tabFromUrl);

  // Update tab when URL changes
  useEffect(() => {
    const urlTab = searchParams.get("tab") || "overview";
    setSelectedTab(urlTab);
  }, [searchParams]);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate("/projects")}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Projects
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">{mockProject.name}</h1>
            <p className="text-muted-foreground">{mockProject.portfolio}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            Edit Project
          </Button>
          <Button size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Add Task
          </Button>
        </div>
      </div>

      {/* Project Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <Badge className={getStatusColor(mockProject.status)}>
                  {mockProject.status}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Progress</p>
                <div className="flex items-center gap-2 mt-1">
                  <Progress value={mockProject.progress} className="flex-1" />
                  <span className="text-sm font-medium">{mockProject.progress}%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Budget</p>
                <p className="text-lg font-semibold">
                  ${(mockProject.spent / 1000).toFixed(0)}k / ${(mockProject.budget / 1000).toFixed(0)}k
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Team</p>
                <p className="text-lg font-semibold">{mockProject.team.length} members</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Project Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Description</p>
                  <p className="text-sm mt-1">{mockProject.description}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Start Date</p>
                    <p className="text-sm font-medium">{mockProject.startDate}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">End Date</p>
                    <p className="text-sm font-medium">{mockProject.endDate}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Priority</p>
                  <Badge className={getPriorityColor(mockProject.priority)}>
                    {mockProject.priority}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Task Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Total Tasks</span>
                    <span className="font-medium">{mockTasks.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Completed</span>
                    <span className="font-medium">{mockTasks.filter(t => t.status === "Completed").length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">In Progress</span>
                    <span className="font-medium">{mockTasks.filter(t => t.status === "In Progress").length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Pending</span>
                    <span className="font-medium">{mockTasks.filter(t => t.status === "To Do").length}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="tasks" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Project Tasks</h3>
            <Button size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Add Task
            </Button>
          </div>
          
          <div className="space-y-4">
            {mockTasks.map((task) => (
              <Card key={task.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        {getStatusIcon(task.status)}
                        <h4 className="font-medium">{task.title}</h4>
                        <Badge className={getStatusColor(task.status)}>
                          {task.status}
                        </Badge>
                        <Badge className={getPriorityColor(task.priority)}>
                          {task.priority}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{task.description}</p>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Assignee</p>
                          <p className="font-medium">{task.assignee}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Due Date</p>
                          <p className="font-medium">{task.dueDate}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Progress</p>
                          <div className="flex items-center gap-2">
                            <Progress value={task.progress} className="flex-1" />
                            <span className="text-xs">{task.progress}%</span>
                          </div>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Hours</p>
                          <p className="font-medium">{task.spentHours} / {task.estimatedHours}h</p>
                        </div>
                      </div>
                    </div>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Edit Task</DropdownMenuItem>
                        <DropdownMenuItem>Assign to</DropdownMenuItem>
                        <DropdownMenuItem>Change Status</DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">Delete Task</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="team" className="space-y-4">
          <h3 className="text-lg font-semibold">Team Members</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mockProject.team.map((member) => (
              <Card key={member.id}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={member.avatar} />
                      <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{member.name}</p>
                      <p className="text-sm text-muted-foreground">{member.role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="timeline">
          <Card>
            <CardHeader>
              <CardTitle>Project Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center text-muted-foreground">
                  Timeline feature coming soon...
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}