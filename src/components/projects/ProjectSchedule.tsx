import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Calendar,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  MoreVertical
} from "lucide-react";

interface ProjectScheduleProps {
  project: any;
}

type TimeScale = "days" | "weeks" | "months";

export function ProjectSchedule({ project }: ProjectScheduleProps) {
  const [timeScale, setTimeScale] = useState<TimeScale>("weeks");
  const [currentDate, setCurrentDate] = useState(new Date());

  const tasks = [
    {
      id: 1,
      name: "Анализ требований",
      startDate: "2024-02-15",
      endDate: "2024-03-15",
      progress: 100,
      status: "completed",
      assignee: "Sarah Chen",
      priority: "High",
      dependencies: [],
      critical: false
    },
    {
      id: 2, 
      name: "Проектирование архитектуры",
      startDate: "2024-03-10",
      endDate: "2024-04-20",
      progress: 75,
      status: "in-progress",
      assignee: "Mike Johnson",
      priority: "High",
      dependencies: [1],
      critical: true
    },
    {
      id: 3,
      name: "UI/UX дизайн",
      startDate: "2024-03-20",
      endDate: "2024-04-30",
      progress: 60,
      status: "in-progress", 
      assignee: "Emma Davis",
      priority: "Medium",
      dependencies: [1],
      critical: false
    },
    {
      id: 4,
      name: "Разработка API",
      startDate: "2024-04-15",
      endDate: "2024-06-15",
      progress: 0,
      status: "pending",
      assignee: "Alex Rodriguez",
      priority: "High",
      dependencies: [2],
      critical: true
    },
    {
      id: 5,
      name: "Frontend разработка",
      startDate: "2024-05-01",
      endDate: "2024-07-15",
      progress: 0,
      status: "pending",
      assignee: "Lisa Wang",
      priority: "High",
      dependencies: [3],
      critical: true
    },
    {
      id: 6,
      name: "Интеграционное тестирование",
      startDate: "2024-07-01",
      endDate: "2024-08-15",
      progress: 0,
      status: "pending",
      assignee: "David Kim",
      priority: "Medium", 
      dependencies: [4, 5],
      critical: false
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-success";
      case "in-progress": return "bg-primary";
      case "pending": return "bg-muted";
      default: return "bg-secondary";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High": return "border-l-destructive";
      case "Medium": return "border-l-warning";
      case "Low": return "border-l-success";
      default: return "border-l-muted";
    }
  };

  const getTimelineWidth = () => {
    switch (timeScale) {
      case "days": return "w-8";
      case "weeks": return "w-16";  
      case "months": return "w-24";
      default: return "w-16";
    }
  };

  const generateTimelineHeaders = () => {
    const headers = [];
    const start = new Date("2024-02-01");
    const end = new Date("2024-12-31");
    
    if (timeScale === "months") {
      let current = new Date(start);
      while (current <= end) {
        headers.push({
          label: current.toLocaleDateString('ru-RU', { month: 'short', year: 'numeric' }),
          date: new Date(current)
        });
        current.setMonth(current.getMonth() + 1);
      }
    } else if (timeScale === "weeks") {
      let current = new Date(start);
      let weekNum = 1;
      while (current <= end) {
        headers.push({
          label: `Нед ${weekNum}`,
          date: new Date(current)
        });
        current.setDate(current.getDate() + 7);
        weekNum++;
      }
    } else {
      let current = new Date(start);
      while (current <= end) {
        headers.push({
          label: current.getDate().toString(),
          date: new Date(current)
        });
        current.setDate(current.getDate() + 1);
      }
    }
    
    return headers.slice(0, 20); // Limit for display
  };

  const calculateTaskPosition = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const timelineStart = new Date("2024-02-01");
    
    let unitSize;
    switch (timeScale) {
      case "days":
        unitSize = 1;
        break;
      case "weeks":
        unitSize = 7;
        break;
      case "months":
        unitSize = 30;
        break;
      default:
        unitSize = 7;
    }
    
    const startOffset = Math.floor((start.getTime() - timelineStart.getTime()) / (1000 * 60 * 60 * 24 * unitSize));
    const duration = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * unitSize));
    
    return { left: startOffset * (timeScale === "days" ? 32 : timeScale === "weeks" ? 64 : 96), width: duration * (timeScale === "days" ? 32 : timeScale === "weeks" ? 64 : 96) };
  };

  return (
    <div className="space-y-6 h-full">
      {/* Gantt Controls */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Интерактивная диаграмма Ганта
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => setCurrentDate(new Date(currentDate.getTime() - 7 * 24 * 60 * 60 * 1000))}>
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={() => setCurrentDate(new Date())}>
                <RotateCcw className="w-4 h-4" />
                Сегодня
              </Button>
              <Button variant="outline" size="sm" onClick={() => setCurrentDate(new Date(currentDate.getTime() + 7 * 24 * 60 * 60 * 1000))}>
                <ChevronRight className="w-4 h-4" />
              </Button>
              
              <div className="flex border rounded-md">
                <Button 
                  variant={timeScale === "days" ? "default" : "ghost"} 
                  size="sm"
                  onClick={() => setTimeScale("days")}
                  className="rounded-r-none"
                >
                  Дни
                </Button>
                <Button 
                  variant={timeScale === "weeks" ? "default" : "ghost"} 
                  size="sm"
                  onClick={() => setTimeScale("weeks")}
                  className="rounded-none border-x"
                >
                  Недели
                </Button>
                <Button 
                  variant={timeScale === "months" ? "default" : "ghost"} 
                  size="sm"
                  onClick={() => setTimeScale("months")}
                  className="rounded-l-none"
                >
                  Месяцы
                </Button>
              </div>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="overflow-x-auto">
            <div className="min-w-full">
              {/* Timeline Header */}
              <div className="flex border-b border-border pb-2 mb-4">
                <div className="w-80 flex-shrink-0 text-sm font-medium text-muted-foreground">
                  Задача
                </div>
                <div className="flex">
                  {generateTimelineHeaders().map((header, index) => (
                    <div key={index} className={`${getTimelineWidth()} text-center text-xs text-muted-foreground border-l border-border/50 py-1`}>
                      {header.label}
                    </div>
                  ))}
                </div>
              </div>

              {/* Gantt Chart */}
              <div className="space-y-2">
                {tasks.map((task) => {
                  const position = calculateTaskPosition(task.startDate, task.endDate);
                  return (
                    <div key={task.id} className="flex items-center group hover:bg-muted/30 p-2 rounded transition-colors">
                      {/* Task Info */}
                      <div className="w-80 flex-shrink-0 pr-4">
                        <div className={`border-l-4 ${getPriorityColor(task.priority)} pl-3`}>
                          <div className="flex items-center justify-between">
                            <h4 className="text-sm font-medium text-foreground truncate">
                              {task.name}
                            </h4>
                            <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-muted-foreground">{task.assignee}</span>
                            <Badge variant="outline" className={`text-xs ${task.critical ? 'border-destructive text-destructive' : ''}`}>
                              {task.priority}
                            </Badge>
                            {task.critical && (
                              <Badge variant="destructive" className="text-xs">
                                Критический путь
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Gantt Bar */}
                      <div className="flex-1 relative h-8">
                        <div 
                          className={`absolute top-1 h-6 rounded ${getStatusColor(task.status)} ${task.critical ? 'ring-2 ring-destructive ring-offset-1' : ''} group cursor-pointer hover:opacity-80 transition-opacity`}
                          style={{ 
                            left: `${position.left}px`, 
                            width: `${Math.max(position.width, 32)}px` 
                          }}
                          title={`${task.name}: ${new Date(task.startDate).toLocaleDateString('ru-RU')} - ${new Date(task.endDate).toLocaleDateString('ru-RU')}`}
                        >
                          {/* Progress Overlay */}
                          <div 
                            className="h-full bg-primary-foreground/30 rounded"
                            style={{ width: `${task.progress}%` }}
                          />
                          
                          {/* Task Label */}
                          <div className="absolute inset-0 flex items-center px-2">
                            <span className="text-xs text-primary-foreground font-medium truncate">
                              {task.progress}%
                            </span>
                          </div>
                        </div>

                        {/* Dependencies (simplified) */}
                        {task.dependencies.length > 0 && (
                          <div className="absolute top-4 left-0 w-full">
                            {task.dependencies.map((depId) => (
                              <div key={depId} className="absolute w-2 h-2 bg-muted-foreground rounded-full -translate-x-1" />
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Legend */}
          <div className="flex items-center gap-6 mt-6 pt-4 border-t border-border text-xs">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-success rounded" />
              <span className="text-muted-foreground">Завершено</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-primary rounded" />
              <span className="text-muted-foreground">В работе</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-muted rounded" />
              <span className="text-muted-foreground">Ожидается</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-destructive rounded ring-2 ring-destructive ring-offset-1" />
              <span className="text-muted-foreground">Критический путь</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Timeline Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-foreground">{tasks.filter(t => t.status === 'completed').length}</div>
            <div className="text-sm text-muted-foreground">Завершенных задач</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-primary">{tasks.filter(t => t.status === 'in-progress').length}</div>
            <div className="text-sm text-muted-foreground">В работе</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-warning">{tasks.filter(t => t.critical).length}</div>
            <div className="text-sm text-muted-foreground">Критический путь</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-muted-foreground">{tasks.filter(t => t.status === 'pending').length}</div>
            <div className="text-sm text-muted-foreground">Ожидают начала</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}