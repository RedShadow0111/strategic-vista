import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  CheckSquare, 
  Clock, 
  Calendar, 
  User, 
  Filter,
  Search,
  Grid3X3,
  List,
  BarChart3,
  Edit,
  Settings,
  Plus,
  Download,
  Printer,
  ArrowUpDown,
  ArrowUp,
  ArrowDown
} from "lucide-react";
import { useParams, useSearchParams } from "react-router-dom";
import { TaskEditDialog } from "@/components/tasks/TaskEditDialog";
import { TaskGanttView } from "@/components/tasks/TaskGanttView";
import { TaskCompactView } from "@/components/tasks/TaskCompactView";
import { ExternalTaskGateway } from "@/components/external-tasks/ExternalTaskGateway";
import { InterdisciplinaryWorkflow } from "@/components/interdisciplinary/InterdisciplinaryWorkflow";
import { DigitalTwinTask } from "@/components/digital-twin/DigitalTwinTask";

const mockTasks = [
  {
    id: "1",
    title: "API Integration Development",
    description: "Develop and integrate new API endpoints for customer data",
    project: "Digital Transformation",
    assignee: "John Doe",
    status: "In Progress",
    priority: "High",
    dueDate: "2024-02-15",
    startDate: "2024-02-01",
    progress: 75,
    estimatedHours: 40,
    actualHours: 32,
    tags: ["Backend", "API"],
    avatar: "JD"
  },
  {
    id: "2",
    title: "Database Schema Review",
    description: "Review and optimize database schema for performance",
    project: "Infrastructure Upgrade",
    assignee: "Jane Smith",
    status: "Review",
    priority: "Medium",
    dueDate: "2024-02-12",
    startDate: "2024-02-05",
    progress: 90,
    estimatedHours: 16,
    actualHours: 14,
    tags: ["Database", "Performance"],
    avatar: "JS"
  },
  {
    id: "3",
    title: "Security Audit Report",
    description: "Complete security audit and generate comprehensive report",
    project: "Security Enhancement",
    assignee: "Mike Johnson",
    status: "To Do",
    priority: "High",
    dueDate: "2024-02-18",
    startDate: "2024-02-10",
    progress: 0,
    estimatedHours: 24,
    actualHours: 0,
    tags: ["Security", "Audit"],
    avatar: "MJ"
  },
  {
    id: "4",
    title: "UI Component Testing",
    description: "Test all UI components for accessibility and responsiveness",
    project: "Mobile App Development",
    assignee: "Emma Davis",
    status: "In Progress",
    priority: "Medium",
    dueDate: "2024-02-14",
    startDate: "2024-02-08",
    progress: 60,
    estimatedHours: 20,
    actualHours: 12,
    tags: ["Frontend", "Testing"],
    avatar: "ED"
  },
  {
    id: "5",
    title: "Performance Optimization",
    description: "Optimize application performance and reduce load times",
    project: "Website Overhaul",
    assignee: "Alex Rodriguez",
    status: "Completed",
    priority: "Low",
    dueDate: "2024-02-10",
    startDate: "2024-02-01",
    progress: 100,
    estimatedHours: 32,
    actualHours: 35,
    tags: ["Performance", "Optimization"],
    avatar: "AR"
  }
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "Completed": return "bg-success text-success-foreground";
    case "In Progress": return "bg-primary text-primary-foreground";
    case "Review": return "bg-warning text-warning-foreground";
    case "To Do": return "bg-muted text-muted-foreground";
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

export default function Tasks() {
  const { projectId } = useParams();
  const [searchParams] = useSearchParams();
  const tab = searchParams.get('tab') || 'normal';
  
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [viewMode, setViewMode] = useState<"normal" | "compact" | "gantt" | "external" | "interdisciplinary" | "digital-twin">("gantt");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const filteredTasks = mockTasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || task.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleEditTask = (task: any) => {
    setSelectedTask(task);
  };

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getSortIcon = (field: string) => {
    if (sortField !== field) return <ArrowUpDown className="w-3 h-3" />;
    return sortDirection === 'asc' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />;
  };

  const handleExport = () => {
    const csvContent = "data:text/csv;charset=utf-8," + 
      "Title,Status,Priority,Assignee,Project,Progress,Due Date\n" +
      filteredTasks.map(task => 
        `"${task.title}","${task.status}","${task.priority}","${task.assignee}","${task.project}","${task.progress}%","${task.dueDate}"`
      ).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "tasks_export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (!sortField) return 0;
    
    let aValue = a[sortField];
    let bValue = b[sortField];
    
    // Handle different data types
    if (sortField === 'progress') {
      aValue = Number(aValue);
      bValue = Number(bValue);
    } else if (sortField === 'dueDate' || sortField === 'startDate') {
      aValue = new Date(aValue);
      bValue = new Date(bValue);
    } else if (typeof aValue === 'string') {
      aValue = aValue.toLowerCase();
      bValue = bValue.toLowerCase();
    }
    
    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-sf font-bold text-foreground">
            {projectId ? `Project ${projectId} Tasks` : "All Tasks"}
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage and track task progress across projects
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as any)} className="w-full max-w-2xl">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="normal">Normal</TabsTrigger>
              <TabsTrigger value="compact">Compact</TabsTrigger>
              <TabsTrigger value="gantt">Gantt</TabsTrigger>
              <TabsTrigger value="external">External</TabsTrigger>
              <TabsTrigger value="interdisciplinary">Workflow</TabsTrigger>
              <TabsTrigger value="digital-twin">Digital Twin</TabsTrigger>
            </TabsList>
          </Tabs>
          <Button size="sm">
            <Plus className="w-4 h-4 mr-2" />
            New Task
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-3 py-2 border border-border rounded-md bg-background text-foreground"
        >
          <option value="all">All Status</option>
          <option value="To Do">To Do</option>
          <option value="In Progress">In Progress</option>
          <option value="Review">Review</option>
          <option value="Completed">Completed</option>
        </select>
        <Button variant="outline" size="sm">
          <Filter className="w-4 h-4 mr-2" />
          More Filters
        </Button>
        <Button variant="outline" size="sm" onClick={handleExport}>
          <Download className="w-4 h-4 mr-2" />
          Export
        </Button>
        <Button variant="outline" size="sm" onClick={handlePrint}>
          <Printer className="w-4 h-4 mr-2" />
          Print
        </Button>
      </div>

      {/* Task Views */}
      <Tabs value={viewMode} className="w-full">
        <TabsContent value="normal">
          {/* Sorting Headers */}
          <div className="flex items-center gap-4 mb-4 pb-2 border-b border-border">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => handleSort('title')}
              className="font-medium"
            >
              Title {getSortIcon('title')}
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => handleSort('status')}
              className="font-medium"
            >
              Status {getSortIcon('status')}
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => handleSort('priority')}
              className="font-medium"
            >
              Priority {getSortIcon('priority')}
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => handleSort('dueDate')}
              className="font-medium"
            >
              Due Date {getSortIcon('dueDate')}
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => handleSort('progress')}
              className="font-medium"
            >
              Progress {getSortIcon('progress')}
            </Button>
          </div>
          
          <div className="space-y-4">
            {sortedTasks.map((task) => (
              <Card key={task.id} className="hover:shadow-apple-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-sf font-semibold text-lg text-foreground">
                          {task.title}
                        </h3>
                        <Badge variant="secondary" className={getStatusColor(task.status)}>
                          {task.status}
                        </Badge>
                        <Badge variant="outline" className={getPriorityColor(task.priority)}>
                          {task.priority}
                        </Badge>
                      </div>
                      <p className="text-muted-foreground text-sm mb-3">
                        {task.description}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditTask(task)}
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Edit Task
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-muted-foreground">Progress</span>
                          <span className="font-medium">{task.progress}%</span>
                        </div>
                        <Progress value={task.progress} className="h-2" />
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {task.startDate}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          Due: {task.dueDate}
                        </div>
                      </div>
                    </div>

                    <div>
                      <div className="text-sm text-muted-foreground mb-2">Assignee & Project</div>
                      <div className="flex items-center gap-2 mb-2">
                        <Avatar className="w-6 h-6">
                          <AvatarFallback className="text-xs">
                            {task.avatar}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm text-foreground">{task.assignee}</span>
                      </div>
                      <div className="text-sm text-muted-foreground">{task.project}</div>
                    </div>

                    <div>
                      <div className="text-sm text-muted-foreground mb-2">Time Tracking</div>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Estimated:</span>
                          <span className="font-medium">{task.estimatedHours}h</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Actual:</span>
                          <span className="font-medium">{task.actualHours}h</span>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {task.tags.map((tag: string, index: number) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="compact">
          <TaskCompactView tasks={sortedTasks} onEditTask={handleEditTask} />
        </TabsContent>

        <TabsContent value="gantt">
          <TaskGanttView tasks={filteredTasks} />
        </TabsContent>

        <TabsContent value="external">
          <ExternalTaskGateway />
        </TabsContent>

        <TabsContent value="interdisciplinary">
          <InterdisciplinaryWorkflow />
        </TabsContent>

        <TabsContent value="digital-twin">
          <DigitalTwinTask />
        </TabsContent>
      </Tabs>

      {/* Edit Task Dialog */}
      <TaskEditDialog
        task={selectedTask}
        open={!!selectedTask}
        onOpenChange={(open) => !open && setSelectedTask(null)}
      />
    </div>
  );
}