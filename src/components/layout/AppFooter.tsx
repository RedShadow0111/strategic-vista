import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Briefcase, FolderOpen, Clock } from "lucide-react";

// Mock current project data - в реальном приложении это будет из контекста/состояния
const currentProject = {
  portfolioName: "Technology Portfolio",
  projectName: "AI Platform Development",
  status: "In Progress",
  progress: 65,
  lastUpdated: "2 hours ago"
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "Completed":
      return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
    case "In Progress":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400";
    case "On Hold":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400";
    case "Planning":
      return "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
  }
};

export function AppFooter() {
  if (!currentProject.projectName) {
    return null; // Не показываем footer если нет активного проекта
  }

  return (
    <footer className="border-t border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center justify-between px-4 py-3">
        {/* Project Info */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm">
            <Briefcase className="w-4 h-4 text-muted-foreground" />
            <span className="text-muted-foreground">Portfolio:</span>
            <span className="font-medium">{currentProject.portfolioName}</span>
          </div>
          
          <div className="w-px h-4 bg-border" />
          
          <div className="flex items-center gap-2 text-sm">
            <FolderOpen className="w-4 h-4 text-muted-foreground" />
            <span className="text-muted-foreground">Project:</span>
            <span className="font-medium">{currentProject.projectName}</span>
          </div>
          
          <div className="w-px h-4 bg-border" />
          
          <Badge className={getStatusColor(currentProject.status)}>
            {currentProject.status}
          </Badge>
        </div>

        {/* Progress Info */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground">Progress:</span>
            <div className="flex items-center gap-2 min-w-[120px]">
              <Progress value={currentProject.progress} className="flex-1" />
              <span className="font-medium text-sm">{currentProject.progress}%</span>
            </div>
          </div>
          
          <div className="w-px h-4 bg-border" />
          
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="w-3 h-3" />
            <span>Updated {currentProject.lastUpdated}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}