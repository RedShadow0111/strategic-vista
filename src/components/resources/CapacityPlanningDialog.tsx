import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Briefcase, Users, TrendingUp, AlertTriangle, CheckCircle } from "lucide-react";
import { toast } from "sonner";

interface CapacityPlanningDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface ResourceDemand {
  project: string;
  role: string;
  startDate: string;
  endDate: string;
  hoursRequired: number;
  priority: "High" | "Medium" | "Low";
}

export function CapacityPlanningDialog({ open, onOpenChange }: CapacityPlanningDialogProps) {
  const [selectedPeriod, setSelectedPeriod] = useState("Q1-2024");
  const [demands, setDemands] = useState<ResourceDemand[]>([
    {
      project: "Digital Transformation",
      role: "React Developer",
      startDate: "2024-03-01",
      endDate: "2024-05-31",
      hoursRequired: 480,
      priority: "High"
    },
    {
      project: "Mobile App",
      role: "UI/UX Designer",
      startDate: "2024-04-01",
      endDate: "2024-06-30",
      hoursRequired: 320,
      priority: "Medium"
    },
    {
      project: "Infrastructure",
      role: "DevOps Engineer",
      startDate: "2024-03-15",
      endDate: "2024-04-30",
      hoursRequired: 240,
      priority: "High"
    }
  ]);

  const [newDemand, setNewDemand] = useState<ResourceDemand>({
    project: "",
    role: "",
    startDate: "",
    endDate: "",
    hoursRequired: 0,
    priority: "Medium"
  });

  const capacityData = {
    "React Developer": { available: 400, allocated: 320, utilization: 80 },
    "UI/UX Designer": { available: 320, allocated: 280, utilization: 87.5 },
    "DevOps Engineer": { available: 240, allocated: 240, utilization: 100 },
    "Project Manager": { available: 360, allocated: 180, utilization: 50 },
    "Backend Developer": { available: 480, allocated: 400, utilization: 83.3 }
  };

  const handleAddDemand = () => {
    if (!newDemand.project || !newDemand.role || !newDemand.startDate || !newDemand.endDate) {
      toast("Заполните все обязательные поля");
      return;
    }
    
    setDemands(prev => [...prev, { ...newDemand }]);
    setNewDemand({
      project: "",
      role: "",
      startDate: "",
      endDate: "",
      hoursRequired: 0,
      priority: "Medium"
    });
    toast("Потребность в ресурсах добавлена");
  };

  const getUtilizationColor = (utilization: number) => {
    if (utilization >= 95) return "text-destructive";
    if (utilization >= 85) return "text-warning";
    return "text-success";
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High": return "bg-destructive text-destructive-foreground";
      case "Medium": return "bg-warning text-warning-foreground";
      case "Low": return "bg-success text-success-foreground";
      default: return "bg-secondary text-secondary-foreground";
    }
  };

  const handleOptimizeCapacity = () => {
    toast("Запущен анализ оптимизации загрузки ресурсов");
  };

  const handleGenerateReport = () => {
    toast("Отчет по планированию ресурсов сгенерирован");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Briefcase className="w-5 h-5" />
            Планирование ресурсов
          </DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Обзор</TabsTrigger>
            <TabsTrigger value="demands">Потребности</TabsTrigger>
            <TabsTrigger value="optimization">Оптимизация</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="flex items-center gap-4">
              <Label>Период планирования:</Label>
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Q1-2024">Q1 2024</SelectItem>
                  <SelectItem value="Q2-2024">Q2 2024</SelectItem>
                  <SelectItem value="Q3-2024">Q3 2024</SelectItem>
                  <SelectItem value="Q4-2024">Q4 2024</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Общая доступность</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">1,800h</div>
                  <div className="text-xs text-muted-foreground">на период</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Выделено ресурсов</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">1,420h</div>
                  <div className="text-xs text-success">79% загрузка</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Перегруженные роли</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-destructive">1</div>
                  <div className="text-xs text-muted-foreground">требует внимания</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Свободная ёмкость</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-success">380h</div>
                  <div className="text-xs text-muted-foreground">доступно</div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Загрузка по ролям</h3>
              {Object.entries(capacityData).map(([role, data]) => (
                <Card key={role}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">{role}</h4>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="text-muted-foreground">
                          {data.allocated}h / {data.available}h
                        </span>
                        <span className={`font-medium ${getUtilizationColor(data.utilization)}`}>
                          {data.utilization}%
                        </span>
                        {data.utilization >= 95 ? (
                          <AlertTriangle className="w-4 h-4 text-destructive" />
                        ) : (
                          <CheckCircle className="w-4 h-4 text-success" />
                        )}
                      </div>
                    </div>
                    <Progress value={data.utilization} className="h-2" />
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="demands" className="space-y-6">
            <div className="border border-border rounded-lg p-4 space-y-4">
              <h3 className="text-lg font-semibold">Добавить потребность в ресурсах</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Проект *</Label>
                  <Input
                    value={newDemand.project}
                    onChange={(e) => setNewDemand(prev => ({ ...prev, project: e.target.value }))}
                    placeholder="Название проекта"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Роль *</Label>
                  <Select value={newDemand.role} onValueChange={(value) => setNewDemand(prev => ({ ...prev, role: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите роль" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="React Developer">React Developer</SelectItem>
                      <SelectItem value="UI/UX Designer">UI/UX Designer</SelectItem>
                      <SelectItem value="DevOps Engineer">DevOps Engineer</SelectItem>
                      <SelectItem value="Project Manager">Project Manager</SelectItem>
                      <SelectItem value="Backend Developer">Backend Developer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Дата начала *</Label>
                  <Input
                    type="date"
                    value={newDemand.startDate}
                    onChange={(e) => setNewDemand(prev => ({ ...prev, startDate: e.target.value }))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Дата окончания *</Label>
                  <Input
                    type="date"
                    value={newDemand.endDate}
                    onChange={(e) => setNewDemand(prev => ({ ...prev, endDate: e.target.value }))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Часов требуется</Label>
                  <Input
                    type="number"
                    value={newDemand.hoursRequired}
                    onChange={(e) => setNewDemand(prev => ({ ...prev, hoursRequired: parseInt(e.target.value) || 0 }))}
                    placeholder="Количество часов"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Приоритет</Label>
                  <Select value={newDemand.priority} onValueChange={(value: any) => setNewDemand(prev => ({ ...prev, priority: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="High">Высокий</SelectItem>
                      <SelectItem value="Medium">Средний</SelectItem>
                      <SelectItem value="Low">Низкий</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <Button onClick={handleAddDemand} className="w-full">
                Добавить потребность
              </Button>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Запланированные потребности</h3>
              {demands.map((demand, index) => (
                <Card key={index}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium">{demand.project}</h4>
                          <Badge className={getPriorityColor(demand.priority)}>
                            {demand.priority}
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          <div>Роль: {demand.role}</div>
                          <div>Период: {demand.startDate} — {demand.endDate}</div>
                          <div>Часов требуется: {demand.hoursRequired}h</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="optimization" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Рекомендации по оптимизации
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-3 border border-border rounded-lg">
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-warning mt-0.5" />
                      <div>
                        <h5 className="font-medium text-sm">DevOps Engineer - перегрузка</h5>
                        <p className="text-xs text-muted-foreground">
                          Загрузка 100%. Рекомендуется привлечь дополнительного специалиста или перераспределить задачи.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-3 border border-border rounded-lg">
                    <div className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-success mt-0.5" />
                      <div>
                        <h5 className="font-medium text-sm">Project Manager - недозагрузка</h5>
                        <p className="text-xs text-muted-foreground">
                          Загрузка 50%. Можно выделить дополнительные проекты или задачи.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-3 border border-border rounded-lg">
                    <div className="flex items-start gap-2">
                      <Users className="w-4 h-4 text-primary mt-0.5" />
                      <div>
                        <h5 className="font-medium text-sm">Кроссфункциональность</h5>
                        <p className="text-xs text-muted-foreground">
                          Обучение Backend Developer основам DevOps может снизить нагрузку на критическую роль.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Сценарии планирования</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <h5 className="font-medium text-sm">Сценарий 1: Текущий план</h5>
                    <div className="text-xs text-muted-foreground">
                      Общая загрузка: 79% | Перегрузки: 1 роль | Риск: Средний
                    </div>
                    <Progress value={79} className="h-2" />
                  </div>
                  
                  <div className="space-y-2">
                    <h5 className="font-medium text-sm">Сценарий 2: +1 DevOps</h5>
                    <div className="text-xs text-muted-foreground">
                      Общая загрузка: 85% | Перегрузки: 0 ролей | Риск: Низкий
                    </div>
                    <Progress value={85} className="h-2" />
                  </div>
                  
                  <div className="space-y-2">
                    <h5 className="font-medium text-sm">Сценарий 3: Перераспределение</h5>
                    <div className="text-xs text-muted-foreground">
                      Общая загрузка: 82% | Перегрузки: 0 ролей | Риск: Низкий
                    </div>
                    <Progress value={82} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="flex gap-3">
              <Button onClick={handleOptimizeCapacity} className="flex-1">
                Автоматическая оптимизация
              </Button>
              <Button variant="outline" onClick={handleGenerateReport}>
                Сгенерировать отчет
              </Button>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex gap-3 pt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
            Закрыть
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}