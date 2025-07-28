import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Calendar, 
  Users, 
  BarChart3, 
  Filter, 
  Download,
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp,
  Eye,
  Zap
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ResourceLoad {
  id: string;
  name: string;
  role: string;
  department: string;
  weeks: { week: string; load: number; projects: string[] }[];
}

const mockResourceLoads: ResourceLoad[] = [
  {
    id: "1",
    name: "Sarah Chen",
    role: "Senior Developer",
    department: "Engineering",
    weeks: [
      { week: "2024-01", load: 85, projects: ["Digital Transform"] },
      { week: "2024-02", load: 92, projects: ["Digital Transform", "Portal"] },
      { week: "2024-03", load: 88, projects: ["Digital Transform"] },
      { week: "2024-04", load: 95, projects: ["Digital Transform", "Mobile App"] },
      { week: "2024-05", load: 78, projects: ["Mobile App"] },
      { week: "2024-06", load: 82, projects: ["Mobile App", "API Upgrade"] }
    ]
  },
  {
    id: "2",
    name: "Mike Johnson",
    role: "UX Designer",
    department: "Design",
    weeks: [
      { week: "2024-01", load: 70, projects: ["Portal"] },
      { week: "2024-02", load: 85, projects: ["Portal", "Mobile App"] },
      { week: "2024-03", load: 92, projects: ["Mobile App"] },
      { week: "2024-04", load: 68, projects: ["Mobile App"] },
      { week: "2024-05", load: 75, projects: ["New Project"] },
      { week: "2024-06", load: 88, projects: ["New Project", "Research"] }
    ]
  },
  {
    id: "3",
    name: "Emma Davis",
    role: "Project Manager",
    department: "PMO",
    weeks: [
      { week: "2024-01", load: 95, projects: ["Digital Transform", "Infrastructure"] },
      { week: "2024-02", load: 88, projects: ["Digital Transform", "Infrastructure"] },
      { week: "2024-03", load: 90, projects: ["Infrastructure", "Portal"] },
      { week: "2024-04", load: 85, projects: ["Infrastructure"] },
      { week: "2024-05", load: 78, projects: ["New Project"] },
      { week: "2024-06", load: 82, projects: ["New Project", "Planning"] }
    ]
  },
  {
    id: "4",
    name: "Alex Rodriguez",
    role: "Backend Developer",
    department: "Engineering",
    weeks: [
      { week: "2024-01", load: 78, projects: ["API Upgrade"] },
      { week: "2024-02", load: 82, projects: ["API Upgrade"] },
      { week: "2024-03", load: 88, projects: ["API Upgrade", "Database"] },
      { week: "2024-04", load: 85, projects: ["Database"] },
      { week: "2024-05", load: 45, projects: [] },
      { week: "2024-06", load: 65, projects: ["New Backend"] }
    ]
  },
  {
    id: "5",
    name: "Lisa Wang",
    role: "DevOps Engineer",
    department: "Engineering",
    weeks: [
      { week: "2024-01", load: 98, projects: ["Infrastructure", "Security"] },
      { week: "2024-02", load: 95, projects: ["Infrastructure", "Security"] },
      { week: "2024-03", load: 90, projects: ["Infrastructure"] },
      { week: "2024-04", load: 88, projects: ["Security", "Monitoring"] },
      { week: "2024-05", load: 85, projects: ["Monitoring"] },
      { week: "2024-06", load: 80, projects: ["Monitoring", "Backup"] }
    ]
  }
];

export function PlanningLoading() {
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const [selectedTimeRange, setSelectedTimeRange] = useState("6weeks");
  const [viewMode, setViewMode] = useState<"heatmap" | "timeline">("heatmap");

  const getLoadColor = (load: number) => {
    if (load >= 95) return "bg-destructive text-destructive-foreground";
    if (load >= 85) return "bg-warning text-warning-foreground";
    if (load >= 70) return "bg-success text-success-foreground";
    if (load >= 30) return "bg-primary text-primary-foreground";
    return "bg-muted text-muted-foreground";
  };

  const getLoadLabel = (load: number) => {
    if (load >= 95) return "Перегрузка";
    if (load >= 85) return "Высокая";
    if (load >= 70) return "Оптимальная";
    if (load >= 30) return "Доступен";
    return "Простой";
  };

  const filteredResources = selectedDepartment === "all" 
    ? mockResourceLoads 
    : mockResourceLoads.filter(r => r.department === selectedDepartment);

  const weekHeaders = mockResourceLoads[0]?.weeks.map(w => w.week) || [];

  // Calculate statistics
  const totalResources = filteredResources.length;
  const overloadedCount = filteredResources.filter(r => 
    r.weeks.some(w => w.load >= 95)
  ).length;
  const underutilizedCount = filteredResources.filter(r => 
    r.weeks.some(w => w.load < 50)
  ).length;
  const avgUtilization = Math.round(
    filteredResources.reduce((acc, r) => 
      acc + r.weeks.reduce((weekAcc, w) => weekAcc + w.load, 0) / r.weeks.length, 0
    ) / totalResources
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-sf font-bold text-foreground">Планирование и загрузка</h2>
          <p className="text-muted-foreground mt-1">
            Тепловая карта загрузки ресурсов с прогнозированием
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Выберите подразделение" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Все подразделения</SelectItem>
              <SelectItem value="Engineering">Engineering</SelectItem>
              <SelectItem value="Design">Design</SelectItem>
              <SelectItem value="PMO">PMO</SelectItem>
            </SelectContent>
          </Select>
          <Select value={selectedTimeRange} onValueChange={setSelectedTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Период" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="6weeks">6 недель</SelectItem>
              <SelectItem value="3months">3 месяца</SelectItem>
              <SelectItem value="6months">6 месяцев</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Экспорт
          </Button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              <div>
                <div className="text-sm text-muted-foreground">Всего ресурсов</div>
                <div className="text-2xl font-bold text-foreground">{totalResources}</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-destructive" />
              <div>
                <div className="text-sm text-muted-foreground">Перегружены</div>
                <div className="text-2xl font-bold text-foreground">{overloadedCount}</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-success" />
              <div>
                <div className="text-sm text-muted-foreground">Недозагружены</div>
                <div className="text-2xl font-bold text-foreground">{underutilizedCount}</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-warning" />
              <div>
                <div className="text-sm text-muted-foreground">Средняя загрузка</div>
                <div className="text-2xl font-bold text-foreground">{avgUtilization}%</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* View Mode Toggle */}
      <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as "heatmap" | "timeline")}>
        <TabsList>
          <TabsTrigger value="heatmap">Тепловая карта</TabsTrigger>
          <TabsTrigger value="timeline">Временная шкала</TabsTrigger>
        </TabsList>

        <TabsContent value="heatmap" className="space-y-4">
          {/* Heatmap */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Тепловая карта загрузки
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <div className="min-w-[800px]">
                  {/* Header with weeks */}
                  <div className="grid grid-cols-7 gap-2 mb-4">
                    <div className="font-medium text-sm text-muted-foreground">Ресурс</div>
                    {weekHeaders.map((week) => (
                      <div key={week} className="text-center font-medium text-sm text-muted-foreground">
                        {week}
                      </div>
                    ))}
                  </div>

                  {/* Resource rows */}
                  {filteredResources.map((resource) => (
                    <div key={resource.id} className="grid grid-cols-7 gap-2 mb-3 items-center">
                      <div className="p-3 border rounded-lg">
                        <div className="font-medium text-sm text-foreground">{resource.name}</div>
                        <div className="text-xs text-muted-foreground">{resource.role}</div>
                        <Badge variant="outline" className="text-xs mt-1">
                          {resource.department}
                        </Badge>
                      </div>
                      {resource.weeks.map((week, weekIndex) => (
                        <div 
                          key={weekIndex}
                          className={`p-3 rounded-lg text-center cursor-pointer transition-all hover:scale-105 ${getLoadColor(week.load)}`}
                          title={`${week.load}% - ${week.projects.join(', ')}`}
                        >
                          <div className="font-medium text-sm">{week.load}%</div>
                          <div className="text-xs opacity-90">
                            {getLoadLabel(week.load)}
                          </div>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>

              {/* Legend */}
              <div className="mt-6 pt-4 border-t border-border">
                <div className="flex items-center gap-4 text-xs">
                  <span className="font-medium text-muted-foreground">Условные обозначения:</span>
                  <div className="flex items-center gap-1">
                    <div className="w-4 h-4 bg-muted rounded"></div>
                    <span>Простой (&lt;30%)</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-4 h-4 bg-primary rounded"></div>
                    <span>Доступен (30-70%)</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-4 h-4 bg-success rounded"></div>
                    <span>Оптимально (70-85%)</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-4 h-4 bg-warning rounded"></div>
                    <span>Высокая (85-95%)</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-4 h-4 bg-destructive rounded"></div>
                    <span>Перегрузка (&gt;95%)</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="timeline" className="space-y-4">
          {/* Timeline View */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Временная шкала проектов
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredResources.map((resource) => (
                  <div key={resource.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="font-medium text-foreground">{resource.name}</h4>
                        <p className="text-sm text-muted-foreground">{resource.role}</p>
                      </div>
                      <Badge variant="outline">{resource.department}</Badge>
                    </div>
                    
                    <div className="space-y-2">
                      {weekHeaders.map((week, weekIndex) => {
                        const weekData = resource.weeks[weekIndex];
                        return (
                          <div key={week} className="flex items-center gap-3">
                            <div className="w-20 text-sm text-muted-foreground">{week}</div>
                            <div className="flex-1">
                              <Progress value={weekData.load} className="h-2" />
                            </div>
                            <div className="w-16 text-sm font-medium text-right">{weekData.load}%</div>
                            <div className="flex-1 text-sm text-muted-foreground">
                              {weekData.projects.join(', ') || 'Нет проектов'}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Forecasting Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Прогнозирование на 3-6 месяцев
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-3">
              <h4 className="font-medium text-foreground">Зоны риска</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <AlertTriangle className="w-4 h-4 text-destructive" />
                  <span>Перегрузка DevOps команды (Март-Апрель)</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="w-4 h-4 text-warning" />
                  <span>Простой Backend разработчиков (Май)</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Zap className="w-4 h-4 text-primary" />
                  <span>Нехватка UX дизайнеров (Июнь)</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium text-foreground">Рекомендации</h4>
              <div className="space-y-2">
                <div className="text-sm">
                  • Нанять 1 DevOps инженера до марта
                </div>
                <div className="text-sm">
                  • Переназначить Backend разработчиков в мае
                </div>
                <div className="text-sm">
                  • Запланировать обучение UX для дизайнеров
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium text-foreground">Быстрые действия</h4>
              <div className="space-y-2">
                <Button variant="outline" size="sm" className="w-full">
                  <Eye className="w-4 h-4 mr-2" />
                  Оптимизировать распределение
                </Button>
                <Button variant="outline" size="sm" className="w-full">
                  <Users className="w-4 h-4 mr-2" />
                  Планировать найм
                </Button>
                <Button variant="outline" size="sm" className="w-full">
                  <Calendar className="w-4 h-4 mr-2" />
                  Планировать отпуска
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}