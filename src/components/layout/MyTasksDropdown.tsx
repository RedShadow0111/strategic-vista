import { CheckSquare, Clock, User, FolderOpen, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";

// Mock user tasks data
const myTasks = [
  {
    id: "1",
    title: "API Integration Development",
    projectName: "AI Platform Development",
    portfolioName: "Technology Portfolio",
    status: "In Progress",
    priority: "High",
    dueDate: "2024-02-15",
    progress: 80
  },
  {
    id: "2",
    title: "Database Schema Review",
    projectName: "E-commerce Redesign",
    portfolioName: "Digital Transformation",
    status: "Review",
    priority: "Medium",
    dueDate: "2024-02-12",
    progress: 95
  },
  {
    id: "3",
    title: "Security Audit Report",
    projectName: "Infrastructure Upgrade",
    portfolioName: "IT Operations",
    status: "To Do",
    priority: "High",
    dueDate: "2024-02-18",
    progress: 0
  },
  {
    id: "4",
    title: "UI Component Testing",
    projectName: "Mobile App Development",
    portfolioName: "Product Innovation",
    status: "In Progress",
    priority: "Medium",
    dueDate: "2024-02-14",
    progress: 60
  },
  {
    id: "5",
    title: "Performance Optimization",
    projectName: "Website Overhaul",
    portfolioName: "Digital Transformation",
    status: "Completed",
    priority: "Low",
    dueDate: "2024-02-10",
    progress: 100
  }
];

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

const getStatusIcon = (status: string) => {
  switch (status) {
    case "Completed":
      return <CheckSquare className="w-3 h-3 text-green-500" />;
    case "In Progress":
      return <Clock className="w-3 h-3 text-blue-500" />;
    case "Review":
      return <User className="w-3 h-3 text-yellow-500" />;
    default:
      return <Clock className="w-3 h-3 text-gray-400" />;
  }
};

export function MyTasksDropdown() {
  const pendingTasks = myTasks.filter(task => task.status !== "Completed");
  const completedTasks = myTasks.filter(task => task.status === "Completed");

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2 hover:bg-accent rounded-lg">
          <CheckSquare className="w-4 h-4" />
          <span className="text-sm font-medium hidden sm:inline">My Tasks</span>
          <Badge variant="secondary" className="ml-1">
            {pendingTasks.length}
          </Badge>
          <ChevronDown className="w-3 h-3" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-96">
        <DropdownMenuLabel className="flex items-center justify-between">
          My Tasks
          <Badge variant="secondary">{pendingTasks.length} active</Badge>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        <ScrollArea className="h-80">
          <div className="space-y-1">
            {pendingTasks.length > 0 ? (
              pendingTasks.map((task) => (
                <DropdownMenuItem 
                  key={task.id} 
                  className="flex-col items-start p-3 space-y-2 cursor-pointer"
                  onClick={() => window.location.href = `/tasks?taskId=${task.id}`}
                >
                  <div className="w-full">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(task.status)}
                        <span className="font-medium text-sm truncate">{task.title}</span>
                      </div>
                      <div className="flex gap-1">
                        <Badge className={getStatusColor(task.status)} variant="secondary">
                          {task.status}
                        </Badge>
                        <Badge className={getPriorityColor(task.priority)} variant="secondary">
                          {task.priority}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-1 text-xs text-muted-foreground mb-2">
                      <FolderOpen className="w-3 h-3" />
                      <span>{task.portfolioName}</span>
                      <span>•</span>
                      <span>{task.projectName}</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 flex-1">
                        <Progress value={task.progress} className="flex-1 h-1.5" />
                        <span className="text-xs font-medium">{task.progress}%</span>
                      </div>
                      <span className="text-xs text-muted-foreground ml-2">
                        Due: {task.dueDate}
                      </span>
                    </div>
                  </div>
                </DropdownMenuItem>
              ))
            ) : (
              <div className="text-center text-muted-foreground p-4">
                No active tasks
              </div>
            )}
            
            {completedTasks.length > 0 && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuLabel className="text-xs text-muted-foreground">
                  Recently Completed
                </DropdownMenuLabel>
                {completedTasks.slice(0, 2).map((task) => (
                  <DropdownMenuItem key={task.id} className="flex-col items-start p-3 space-y-2 opacity-60">
                    <div className="w-full">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(task.status)}
                          <span className="font-medium text-sm truncate">{task.title}</span>
                        </div>
                        <Badge className={getStatusColor(task.status)} variant="secondary">
                          {task.status}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <FolderOpen className="w-3 h-3" />
                        <span>{task.portfolioName}</span>
                        <span>•</span>
                        <span>{task.projectName}</span>
                      </div>
                    </div>
                  </DropdownMenuItem>
                ))}
              </>
            )}
          </div>
        </ScrollArea>
        
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          className="text-center text-sm text-primary cursor-pointer"
          onClick={() => window.location.href = '/tasks'}
        >
          View All Tasks
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}