import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  GitBranch, 
  ArrowRight, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  FileText,
  Users,
  Activity,
  Zap
} from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AutomationSettings } from "./AutomationSettings";

interface DisciplinaryTask {
  id: string;
  title: string;
  discipline: string;
  status: "Not Started" | "In Progress" | "Completed" | "Blocked";
  assignee: string;
  progress: number;
  dependencies: string[];
  dependents: string[];
  documents: string[];
  estimatedHours: number;
  actualHours?: number;
  startDate: string;
  endDate: string;
  priority: "High" | "Medium" | "Low";
}

interface DisciplinaryFlow {
  id: string;
  name: string;
  description: string;
  tasks: DisciplinaryTask[];
  activationTrigger: string;
  completionRate: number;
}

const mockFlows: DisciplinaryFlow[] = [
  {
    id: "flow-001",
    name: "Проектирование жилого комплекса - Блок А",
    description: "Междисциплинарный поток проектирования от архитектуры до рабочей документации",
    activationTrigger: "Architectural concept approval",
    completionRate: 65,
    tasks: [
      {
        id: "task-arch-001",
        title: "Архитектурные решения - План 3-го этажа",
        discipline: "Архитектура",
        status: "Completed",
        assignee: "Иванов А.С.",
        progress: 100,
        dependencies: [],
        dependents: ["task-struct-001", "task-mep-001"],
        documents: ["Планы_этаж3.dwg", "Разрезы.pdf", "Спецификации.xlsx"],
        estimatedHours: 40,
        actualHours: 38,
        startDate: "2025-01-15",
        endDate: "2025-01-25",
        priority: "High"
      },
      {
        id: "task-struct-001", 
        title: "Конструктивные решения ЖБ",
        discipline: "Конструкции",
        status: "In Progress",
        assignee: "Петров И.К.",
        progress: 75,
        dependencies: ["task-arch-001"],
        dependents: ["task-detail-001"],
        documents: ["КЖ_схемы.dwg", "Расчеты.pdf"],
        estimatedHours: 60,
        actualHours: 45,
        startDate: "2025-01-26",
        endDate: "2025-02-10",
        priority: "High"
      },
      {
        id: "task-mep-001",
        title: "Инженерные системы ВК",
        discipline: "ВК",
        status: "In Progress", 
        assignee: "Сидорова М.А.",
        progress: 40,
        dependencies: ["task-arch-001"],
        dependents: ["task-detail-002"],
        documents: ["ВК_схемы.dwg"],
        estimatedHours: 50,
        startDate: "2025-01-26",
        endDate: "2025-02-15",
        priority: "Medium"
      },
      {
        id: "task-detail-001",
        title: "Детализация узлов КЖ",
        discipline: "Конструкции",
        status: "Not Started",
        assignee: "Козлов Д.В.",
        progress: 0,
        dependencies: ["task-struct-001"],
        dependents: [],
        documents: [],
        estimatedHours: 30,
        startDate: "2025-02-11",
        endDate: "2025-02-20",
        priority: "Medium"
      },
      {
        id: "task-detail-002",
        title: "Рабочие чертежи ВК",
        discipline: "ВК", 
        status: "Blocked",
        assignee: "Новиков С.Р.",
        progress: 0,
        dependencies: ["task-mep-001"],
        dependents: [],
        documents: [],
        estimatedHours: 35,
        startDate: "2025-02-16", 
        endDate: "2025-02-28",
        priority: "Low"
      }
    ]
  }
];

export function InterdisciplinaryWorkflow() {
  const [selectedFlow, setSelectedFlow] = useState<DisciplinaryFlow>(mockFlows[0]);
  const [activeTab, setActiveTab] = useState("dependencies");

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed": return "bg-success text-success-foreground";
      case "In Progress": return "bg-primary text-primary-foreground";
      case "Blocked": return "bg-destructive text-destructive-foreground";
      default: return "bg-secondary";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High": return "bg-destructive text-destructive-foreground";
      case "Medium": return "bg-warning text-warning-foreground";
      case "Low": return "bg-success text-success-foreground";
      default: return "bg-secondary";
    }
  };

  const getDisciplineColor = (discipline: string) => {
    const colors = {
      "Архитектура": "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
      "Конструкции": "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
      "ВК": "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      "ОВ": "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
      "ЭО": "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
    };
    return colors[discipline as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  const renderDependencyGraph = () => {
    const disciplines = [...new Set(selectedFlow.tasks.map(t => t.discipline))];
    
    return (
      <div className="space-y-6">
        {disciplines.map(discipline => {
          const disciplineTasks = selectedFlow.tasks.filter(t => t.discipline === discipline);
          
          return (
            <Card key={discipline}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Badge className={getDisciplineColor(discipline)}>
                      {discipline}
                    </Badge>
                    <CardTitle className="text-lg">{discipline}</CardTitle>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {disciplineTasks.filter(t => t.status === "Completed").length} / {disciplineTasks.length} завершено
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-3">
                  {disciplineTasks.map(task => (
                    <div key={task.id} className="flex items-center gap-4 p-3 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-medium">{task.title}</h4>
                          <Badge className={getStatusColor(task.status)}>
                            {task.status}
                          </Badge>
                          <Badge className={getPriorityColor(task.priority)} variant="outline">
                            {task.priority}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Исполнитель:</span> {task.assignee}
                          </div>
                          <div>
                            <span className="text-muted-foreground">Прогресс:</span> {task.progress}%
                          </div>
                        </div>
                        
                        <Progress value={task.progress} className="mt-2" />
                        
                        {task.dependencies.length > 0 && (
                          <div className="mt-2">
                            <span className="text-xs text-muted-foreground">
                              Зависимости: {task.dependencies.join(", ")}
                            </span>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex flex-col items-center gap-2">
                        {task.status === "Completed" && (
                          <CheckCircle className="w-5 h-5 text-success" />
                        )}
                        {task.status === "In Progress" && (
                          <Activity className="w-5 h-5 text-primary animate-pulse" />
                        )}
                        {task.status === "Blocked" && (
                          <AlertCircle className="w-5 h-5 text-destructive" />
                        )}
                        {task.status === "Not Started" && (
                          <Clock className="w-5 h-5 text-muted-foreground" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    );
  };

  const renderFlowTimeline = () => {
    const sortedTasks = [...selectedFlow.tasks].sort((a, b) => 
      new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
    );

    return (
      <div className="space-y-4">
        {sortedTasks.map((task, index) => (
          <div key={task.id} className="flex items-center gap-4">
            <div className="flex flex-col items-center">
              <div className={`w-3 h-3 rounded-full ${
                task.status === "Completed" ? "bg-success" :
                task.status === "In Progress" ? "bg-primary" :
                task.status === "Blocked" ? "bg-destructive" : "bg-muted-foreground"
              }`} />
              {index < sortedTasks.length - 1 && (
                <div className="w-px h-12 bg-border mt-2" />
              )}
            </div>
            
            <Card className="flex-1">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <h4 className="font-medium">{task.title}</h4>
                    <div className="flex items-center gap-2">
                      <Badge className={getDisciplineColor(task.discipline)} variant="outline">
                        {task.discipline}
                      </Badge>
                      <Badge className={getStatusColor(task.status)}>
                        {task.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {task.assignee} • {new Date(task.startDate).toLocaleDateString('ru-RU')} - {new Date(task.endDate).toLocaleDateString('ru-RU')}
                    </p>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-sm font-medium">{task.progress}%</div>
                    <Progress value={task.progress} className="w-24 mt-1" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-sf font-bold text-foreground">Interdisciplinary Workflow Engine</h2>
          <p className="text-muted-foreground">Организация междисциплинарного обмена задачами</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline">
              <Zap className="w-4 h-4 mr-2" />
              Автоматизировать переходы
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Автоматизация переходов</DialogTitle>
              <DialogDescription>
                Настройка автоматических переходов между этапами работ
              </DialogDescription>
            </DialogHeader>
            <AutomationSettings />
          </DialogContent>
        </Dialog>
      </div>

      {/* Статистика по потоку */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Общий прогресс</p>
                <p className="text-2xl font-bold">{selectedFlow.completionRate}%</p>
              </div>
              <Activity className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Активных задач</p>
                <p className="text-2xl font-bold">
                  {selectedFlow.tasks.filter(t => t.status === "In Progress").length}
                </p>
              </div>
              <Clock className="w-8 h-8 text-warning" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Завершено</p>
                <p className="text-2xl font-bold">
                  {selectedFlow.tasks.filter(t => t.status === "Completed").length}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-success" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Заблокировано</p>
                <p className="text-2xl font-bold">
                  {selectedFlow.tasks.filter(t => t.status === "Blocked").length}
                </p>
              </div>
              <AlertCircle className="w-8 h-8 text-destructive" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Информация о потоке */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GitBranch className="w-5 h-5" />
            {selectedFlow.name}
          </CardTitle>
          <CardDescription>{selectedFlow.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Триггер активации:</span>
              <Badge variant="outline">{selectedFlow.activationTrigger}</Badge>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Прогресс:</span>
              <Progress value={selectedFlow.completionRate} className="w-32" />
              <span className="text-sm font-medium">{selectedFlow.completionRate}%</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Вкладки визуализации */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="dependencies">Зависимости по дисциплинам</TabsTrigger>
          <TabsTrigger value="timeline">Временная диаграмма</TabsTrigger>
        </TabsList>
        
        <TabsContent value="dependencies" className="space-y-4">
          {renderDependencyGraph()}
        </TabsContent>
        
        <TabsContent value="timeline" className="space-y-4">
          {renderFlowTimeline()}
        </TabsContent>
      </Tabs>
    </div>
  );
}