import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { 
  Calendar, 
  Clock, 
  ZoomIn, 
  ZoomOut, 
  Filter, 
  Search,
  ArrowRight,
  Link2,
  BarChart3,
  FolderOpen,
  Eye,
  EyeOff
} from "lucide-react";

interface InteractiveGanttViewProps {
  tasks: any[];
}

type ZoomLevel = "days" | "weeks" | "months" | "quarters" | "years";
type GroupingMode = "none" | "project" | "assignee" | "status" | "priority";

export function InteractiveGanttView({ tasks }: InteractiveGanttViewProps) {
  const [zoomLevel, setZoomLevel] = useState<ZoomLevel>("weeks");
  const [groupingMode, setGroupingMode] = useState<GroupingMode>("project");
  const [showDependencies, setShowDependencies] = useState(true);
  const [filterProject, setFilterProject] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterAssignee, setFilterAssignee] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTasks, setSelectedTasks] = useState<string[]>([]);

  // Фильтрация задач
  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      if (filterProject !== "all" && task.project !== filterProject) return false;
      if (filterStatus !== "all" && task.status !== filterStatus) return false;
      if (filterAssignee !== "all" && task.assignee !== filterAssignee) return false;
      if (searchQuery && !task.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      return true;
    });
  }, [tasks, filterProject, filterStatus, filterAssignee, searchQuery]);

  // Группировка задач
  const groupedTasks = useMemo(() => {
    if (groupingMode === "none") {
      return { "Все задачи": filteredTasks };
    }

    const groups: Record<string, any[]> = {};
    filteredTasks.forEach(task => {
      let groupKey: string;
      switch (groupingMode) {
        case "project":
          groupKey = task.project || "Без проекта";
          break;
        case "assignee":
          groupKey = task.assignee || "Не назначено";
          break;
        case "status":
          groupKey = task.status || "Без статуса";
          break;
        case "priority":
          groupKey = task.priority || "Без приоритета";
          break;
        default:
          groupKey = "Прочее";
      }
      
      if (!groups[groupKey]) {
        groups[groupKey] = [];
      }
      groups[groupKey].push(task);
    });

    return groups;
  }, [filteredTasks, groupingMode]);

  // Расчет временной шкалы
  const getTimelineConfig = () => {
    const allDates = filteredTasks.flatMap(task => [
      new Date(task.startDate),
      new Date(task.dueDate)
    ]);
    
    if (allDates.length === 0) {
      return { 
        minDate: new Date(), 
        maxDate: new Date(), 
        timeUnits: [], 
        unitWidth: 100 
      };
    }

    const minDate = new Date(Math.min(...allDates.map(d => d.getTime())));
    const maxDate = new Date(Math.max(...allDates.map(d => d.getTime())));
    
    const timeUnits = [];
    let currentDate = new Date(minDate);
    let unitWidth = 100;

    switch (zoomLevel) {
      case "days":
        unitWidth = 40;
        while (currentDate <= maxDate) {
          timeUnits.push({
            label: `${currentDate.getDate()}/${currentDate.getMonth() + 1}`,
            value: new Date(currentDate)
          });
          currentDate.setDate(currentDate.getDate() + 1);
        }
        break;
      case "weeks":
        unitWidth = 80;
        while (currentDate <= maxDate) {
          const weekStart = new Date(currentDate);
          timeUnits.push({
            label: `${weekStart.getDate()}/${weekStart.getMonth() + 1}`,
            value: new Date(weekStart)
          });
          currentDate.setDate(currentDate.getDate() + 7);
        }
        break;
      case "months":
        unitWidth = 120;
        while (currentDate <= maxDate) {
          timeUnits.push({
            label: currentDate.toLocaleDateString('ru-RU', { month: 'short', year: '2-digit' }),
            value: new Date(currentDate)
          });
          currentDate.setMonth(currentDate.getMonth() + 1);
        }
        break;
      case "quarters":
        unitWidth = 200;
        while (currentDate <= maxDate) {
          const quarter = Math.floor(currentDate.getMonth() / 3) + 1;
          timeUnits.push({
            label: `Q${quarter} ${currentDate.getFullYear()}`,
            value: new Date(currentDate)
          });
          currentDate.setMonth(currentDate.getMonth() + 3);
        }
        break;
      case "years":
        unitWidth = 300;
        while (currentDate <= maxDate) {
          timeUnits.push({
            label: currentDate.getFullYear().toString(),
            value: new Date(currentDate)
          });
          currentDate.setFullYear(currentDate.getFullYear() + 1);
        }
        break;
    }

    return { minDate, maxDate, timeUnits, unitWidth };
  };

  const { minDate, maxDate, timeUnits, unitWidth } = getTimelineConfig();

  const getTaskPosition = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const totalTimespan = maxDate.getTime() - minDate.getTime();
    const taskStart = start.getTime() - minDate.getTime();
    const taskDuration = end.getTime() - start.getTime();
    
    const leftPercent = (taskStart / totalTimespan) * 100;
    const widthPercent = Math.max((taskDuration / totalTimespan) * 100, 1);
    
    return { left: leftPercent, width: widthPercent };
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed": return "bg-success";
      case "In Progress": return "bg-primary";
      case "Review": return "bg-warning";
      case "To Do": return "bg-muted";
      default: return "bg-secondary";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High": return "border-l-destructive";
      case "Medium": return "border-l-warning";
      case "Low": return "border-l-success";
      default: return "border-l-secondary";
    }
  };

  const toggleTaskSelection = (taskId: string) => {
    setSelectedTasks(prev => 
      prev.includes(taskId) 
        ? prev.filter(id => id !== taskId)
        : [...prev, taskId]
    );
  };

  const uniqueProjects = [...new Set(tasks.map(t => t.project))];
  const uniqueStatuses = [...new Set(tasks.map(t => t.status))];
  const uniqueAssignees = [...new Set(tasks.map(t => t.assignee))];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Интерактивная диаграмма Ганта
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="outline">
              {filteredTasks.length} задач
            </Badge>
            {selectedTasks.length > 0 && (
              <Badge variant="secondary">
                {selectedTasks.length} выбрано
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="gantt" className="space-y-4">
          <TabsList>
            <TabsTrigger value="gantt">Диаграмма</TabsTrigger>
            <TabsTrigger value="filters">Фильтры</TabsTrigger>
            <TabsTrigger value="settings">Настройки</TabsTrigger>
          </TabsList>

          <TabsContent value="filters" className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label>Поиск задач</Label>
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Найти задачу..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-8"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Проект</Label>
                <Select value={filterProject} onValueChange={setFilterProject}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Все проекты</SelectItem>
                    {uniqueProjects.map(project => (
                      <SelectItem key={project} value={project}>{project}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Статус</Label>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Все статусы</SelectItem>
                    {uniqueStatuses.map(status => (
                      <SelectItem key={status} value={status}>{status}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Исполнитель</Label>
                <Select value={filterAssignee} onValueChange={setFilterAssignee}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Все исполнители</SelectItem>
                    {uniqueAssignees.map(assignee => (
                      <SelectItem key={assignee} value={assignee}>{assignee}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label>Масштаб времени</Label>
                <Select value={zoomLevel} onValueChange={(value: ZoomLevel) => setZoomLevel(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="days">Дни</SelectItem>
                    <SelectItem value="weeks">Недели</SelectItem>
                    <SelectItem value="months">Месяцы</SelectItem>
                    <SelectItem value="quarters">Кварталы</SelectItem>
                    <SelectItem value="years">Годы</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Группировка</Label>
                <Select value={groupingMode} onValueChange={(value: GroupingMode) => setGroupingMode(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Без группировки</SelectItem>
                    <SelectItem value="project">По проектам</SelectItem>
                    <SelectItem value="assignee">По исполнителям</SelectItem>
                    <SelectItem value="status">По статусу</SelectItem>
                    <SelectItem value="priority">По приоритету</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Зависимости</Label>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="dependencies"
                    checked={showDependencies}
                    onCheckedChange={setShowDependencies}
                  />
                  <Label htmlFor="dependencies">
                    {showDependencies ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </Label>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Действия</Label>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => setSelectedTasks([])}>
                    Снять выделение
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="gantt" className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Button variant="outline" size="sm" onClick={() => {
                const currentIndex = ["days", "weeks", "months", "quarters", "years"].indexOf(zoomLevel);
                if (currentIndex > 0) {
                  setZoomLevel(["days", "weeks", "months", "quarters", "years"][currentIndex - 1] as ZoomLevel);
                }
              }}>
                <ZoomIn className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={() => {
                const currentIndex = ["days", "weeks", "months", "quarters", "years"].indexOf(zoomLevel);
                if (currentIndex < 4) {
                  setZoomLevel(["days", "weeks", "months", "quarters", "years"][currentIndex + 1] as ZoomLevel);
                }
              }}>
                <ZoomOut className="w-4 h-4" />
              </Button>
              <span className="text-sm text-muted-foreground">
                Масштаб: {zoomLevel === "days" ? "Дни" : zoomLevel === "weeks" ? "Недели" : zoomLevel === "months" ? "Месяцы" : zoomLevel === "quarters" ? "Кварталы" : "Годы"}
              </span>
            </div>

            <ScrollArea className="w-full">
              <div className="min-w-[1200px]">
                {/* Временная шкала */}
                <div className="flex border-b border-border pb-2 mb-4">
                  <div className="w-80 flex-shrink-0 font-medium text-muted-foreground">
                    Задачи
                  </div>
                  <div className="flex-1 relative">
                    <div className="flex">
                      {timeUnits.map((unit, index) => (
                        <div
                          key={index}
                          className="border-r border-border text-center text-xs font-medium text-muted-foreground py-2"
                          style={{ minWidth: `${unitWidth}px` }}
                        >
                          {unit.label}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Группы задач */}
                <div className="space-y-6">
                  {Object.entries(groupedTasks).map(([groupName, groupTasks]) => (
                    <div key={groupName} className="space-y-2">
                      {groupingMode !== "none" && (
                        <div className="flex items-center gap-2 py-2 border-b border-dashed">
                          <FolderOpen className="w-4 h-4 text-primary" />
                          <span className="font-medium text-primary">{groupName}</span>
                          <Badge variant="outline" className="text-xs">
                            {groupTasks.length} задач
                          </Badge>
                        </div>
                      )}
                      
                      {groupTasks.map((task) => {
                        const position = getTaskPosition(task.startDate, task.dueDate);
                        const isSelected = selectedTasks.includes(task.id);
                        
                        return (
                          <div 
                            key={task.id} 
                            className={`flex items-center group cursor-pointer ${isSelected ? 'bg-primary/5' : ''}`}
                            onClick={() => toggleTaskSelection(task.id)}
                          >
                            {/* Информация о задаче */}
                            <div className="w-80 flex-shrink-0 pr-4">
                              <div className={`border-l-4 ${getPriorityColor(task.priority)} pl-3 py-2`}>
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="font-medium text-sm text-foreground">
                                    {task.title}
                                  </span>
                                  <Badge variant="secondary" className={`${getStatusColor(task.status)} text-white text-xs`}>
                                    {task.status}
                                  </Badge>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Avatar className="w-5 h-5">
                                    <AvatarFallback className="text-xs">
                                      {task.avatar}
                                    </AvatarFallback>
                                  </Avatar>
                                  <span className="text-xs text-muted-foreground">
                                    {task.assignee}
                                  </span>
                                </div>
                                {groupingMode !== "project" && (
                                  <div className="text-xs text-muted-foreground mt-1">
                                    {task.project}
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Временная диаграмма */}
                            <div className="flex-1 relative h-12 border border-border bg-accent/20">
                              <div
                                className={`absolute top-2 h-8 ${getStatusColor(task.status)} rounded opacity-80 group-hover:opacity-100 transition-all ${isSelected ? 'ring-2 ring-primary' : ''}`}
                                style={{
                                  left: `${position.left}%`,
                                  width: `${position.width}%`,
                                  minWidth: '20px'
                                }}
                              >
                                <div className="flex items-center justify-between h-full px-2 text-white text-xs">
                                  <span className="truncate">
                                    {task.progress}%
                                  </span>
                                  <div className="flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    <span>{task.actualHours}h</span>
                                  </div>
                                </div>
                                
                                {/* Прогресс */}
                                <div
                                  className="absolute top-0 left-0 h-full bg-white/30 rounded-l"
                                  style={{ width: `${task.progress}%` }}
                                />
                              </div>

                              {/* Зависимости */}
                              {showDependencies && task.dependencies && task.dependencies.length > 0 && (
                                <div className="absolute -top-1 -left-2">
                                  <Link2 className="w-3 h-3 text-primary" />
                                </div>
                              )}

                              {/* Маркеры начала и конца */}
                              <div
                                className="absolute top-0 w-1 h-12 bg-primary border-l-2 border-primary"
                                style={{ left: `${position.left}%` }}
                                title={`Начало: ${task.startDate}`}
                              />
                              <div
                                className="absolute top-0 w-1 h-12 bg-destructive border-r-2 border-destructive"
                                style={{ left: `${position.left + position.width}%` }}
                                title={`Завершение: ${task.dueDate}`}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>

                {/* Легенда */}
                <div className="flex items-center gap-6 pt-4 border-t border-border text-xs mt-6">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-primary rounded"></div>
                    <span>Дата начала</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-destructive rounded"></div>
                    <span>Дата завершения</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-white/30 rounded"></div>
                    <span>Прогресс</span>
                  </div>
                  {showDependencies && (
                    <div className="flex items-center gap-2">
                      <Link2 className="w-3 h-3 text-primary" />
                      <span>Зависимости</span>
                    </div>
                  )}
                </div>
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}