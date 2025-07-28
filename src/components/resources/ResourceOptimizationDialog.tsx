import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  TrendingUp, 
  Users, 
  AlertTriangle, 
  CheckCircle, 
  Target,
  Zap,
  BarChart3,
  Settings
} from "lucide-react";
import { toast } from "sonner";

interface ResourceOptimizationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface OptimizationRecommendation {
  type: "reallocation" | "training" | "hiring" | "outsourcing";
  priority: "High" | "Medium" | "Low";
  title: string;
  description: string;
  impact: number;
  effort: number;
  cost: string;
  timeline: string;
}

export function ResourceOptimizationDialog({ open, onOpenChange }: ResourceOptimizationDialogProps) {
  const [selectedOptimizationGoal, setSelectedOptimizationGoal] = useState("utilization");
  const [analysisType, setAnalysisType] = useState("current");

  const currentMetrics = {
    totalUtilization: 82,
    costEfficiency: 76,
    skillCoverage: 85,
    projectDelays: 15,
    resourceWaste: 18,
    burnoutRisk: 25
  };

  const optimizedMetrics = {
    totalUtilization: 88,
    costEfficiency: 92,
    skillCoverage: 95,
    projectDelays: 5,
    resourceWaste: 8,
    burnoutRisk: 12
  };

  const recommendations: OptimizationRecommendation[] = [
    {
      type: "reallocation",
      priority: "High",
      title: "Перераспределение DevOps нагрузки",
      description: "Распределить часть DevOps задач между Backend разработчиками после краткого обучения",
      impact: 85,
      effort: 40,
      cost: "$3,000",
      timeline: "2 недели"
    },
    {
      type: "training",
      priority: "Medium",
      title: "Кроссфункциональное обучение",
      description: "Обучить Frontend разработчиков основам Backend для повышения гибкости команды",
      impact: 70,
      effort: 60,
      cost: "$8,000",
      timeline: "6 недель"
    },
    {
      type: "hiring",
      priority: "High",
      title: "Найм Senior DevOps Engineer",
      description: "Привлечь опытного DevOps инженера для критически важных проектов",
      impact: 90,
      effort: 80,
      cost: "$15,000/мес",
      timeline: "4-6 недель"
    },
    {
      type: "outsourcing",
      priority: "Low",
      title: "Аутсорсинг QA тестирования",
      description: "Передать часть рутинного тестирования внешней команде",
      impact: 60,
      effort: 30,
      cost: "$5,000/мес",
      timeline: "1 неделя"
    }
  ];

  const skillGaps = [
    { skill: "DevOps", gap: -30, demand: 100, supply: 70 },
    { skill: "React", gap: -10, demand: 90, supply: 80 },
    { skill: "Backend", gap: 5, demand: 75, supply: 80 },
    { skill: "Design", gap: -5, demand: 60, supply: 55 },
    { skill: "PM", gap: 20, demand: 50, supply: 70 }
  ];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "reallocation": return <Users className="w-4 h-4" />;
      case "training": return <Target className="w-4 h-4" />;
      case "hiring": return <CheckCircle className="w-4 h-4" />;
      case "outsourcing": return <Zap className="w-4 h-4" />;
      default: return <Settings className="w-4 h-4" />;
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

  const getGapColor = (gap: number) => {
    if (gap < -15) return "text-destructive";
    if (gap < 0) return "text-warning";
    return "text-success";
  };

  const handleApplyOptimization = (recommendation: OptimizationRecommendation) => {
    toast(`Применение оптимизации: ${recommendation.title}`);
  };

  const handleRunAnalysis = () => {
    toast("Запущен полный анализ оптимизации ресурсов");
  };

  const handleExportReport = () => {
    toast("Отчет по оптимизации ресурсов экспортирован");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Оптимизация ресурсов
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Цель оптимизации:</label>
              <Select value={selectedOptimizationGoal} onValueChange={setSelectedOptimizationGoal}>
                <SelectTrigger className="w-64">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="utilization">Максимизация загрузки</SelectItem>
                  <SelectItem value="cost">Снижение затрат</SelectItem>
                  <SelectItem value="quality">Улучшение качества</SelectItem>
                  <SelectItem value="speed">Ускорение доставки</SelectItem>
                  <SelectItem value="balance">Баланс всех факторов</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Тип анализа:</label>
              <Select value={analysisType} onValueChange={setAnalysisType}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="current">Текущее состояние</SelectItem>
                  <SelectItem value="forecast">Прогноз на квартал</SelectItem>
                  <SelectItem value="scenarios">Сценарный анализ</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Button onClick={handleRunAnalysis} className="mt-7">
              <BarChart3 className="w-4 h-4 mr-2" />
              Обновить анализ
            </Button>
          </div>

          <Tabs defaultValue="metrics" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="metrics">Метрики</TabsTrigger>
              <TabsTrigger value="recommendations">Рекомендации</TabsTrigger>
              <TabsTrigger value="skills">Навыки</TabsTrigger>
              <TabsTrigger value="scenarios">Сценарии</TabsTrigger>
            </TabsList>

            <TabsContent value="metrics" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Текущие показатели</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Общая загрузка</span>
                        <span className="font-medium">{currentMetrics.totalUtilization}%</span>
                      </div>
                      <Progress value={currentMetrics.totalUtilization} className="h-2" />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Эффективность затрат</span>
                        <span className="font-medium">{currentMetrics.costEfficiency}%</span>
                      </div>
                      <Progress value={currentMetrics.costEfficiency} className="h-2" />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Покрытие навыков</span>
                        <span className="font-medium">{currentMetrics.skillCoverage}%</span>
                      </div>
                      <Progress value={currentMetrics.skillCoverage} className="h-2" />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Риск выгорания</span>
                        <span className="font-medium text-warning">{currentMetrics.burnoutRisk}%</span>
                      </div>
                      <Progress value={currentMetrics.burnoutRisk} className="h-2" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      Прогноз после оптимизации
                      <Badge variant="outline" className="bg-success text-success-foreground">
                        +12% эффективность
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Общая загрузка</span>
                        <span className="font-medium text-success">
                          {optimizedMetrics.totalUtilization}% (+{optimizedMetrics.totalUtilization - currentMetrics.totalUtilization})
                        </span>
                      </div>
                      <Progress value={optimizedMetrics.totalUtilization} className="h-2" />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Эффективность затрат</span>
                        <span className="font-medium text-success">
                          {optimizedMetrics.costEfficiency}% (+{optimizedMetrics.costEfficiency - currentMetrics.costEfficiency})
                        </span>
                      </div>
                      <Progress value={optimizedMetrics.costEfficiency} className="h-2" />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Покрытие навыков</span>
                        <span className="font-medium text-success">
                          {optimizedMetrics.skillCoverage}% (+{optimizedMetrics.skillCoverage - currentMetrics.skillCoverage})
                        </span>
                      </div>
                      <Progress value={optimizedMetrics.skillCoverage} className="h-2" />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Риск выгорания</span>
                        <span className="font-medium text-success">
                          {optimizedMetrics.burnoutRisk}% (-{currentMetrics.burnoutRisk - optimizedMetrics.burnoutRisk})
                        </span>
                      </div>
                      <Progress value={optimizedMetrics.burnoutRisk} className="h-2" />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="recommendations" className="space-y-4">
              {recommendations.map((rec, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          {getTypeIcon(rec.type)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-semibold">{rec.title}</h4>
                            <Badge className={getPriorityColor(rec.priority)}>
                              {rec.priority}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-3">{rec.description}</p>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <span className="text-muted-foreground">Влияние:</span>
                              <div className="font-medium">{rec.impact}%</div>
                              <Progress value={rec.impact} className="h-1 mt-1" />
                            </div>
                            <div>
                              <span className="text-muted-foreground">Усилия:</span>
                              <div className="font-medium">{rec.effort}%</div>
                              <Progress value={rec.effort} className="h-1 mt-1" />
                            </div>
                            <div>
                              <span className="text-muted-foreground">Стоимость:</span>
                              <div className="font-medium">{rec.cost}</div>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Время:</span>
                              <div className="font-medium">{rec.timeline}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleApplyOptimization(rec)}
                      >
                        Применить
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="skills" className="space-y-4">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Анализ навыков и потребностей</h3>
                {skillGaps.map((skill, index) => (
                  <Card key={index}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium">{skill.skill}</h4>
                        <div className="flex items-center gap-4 text-sm">
                          <span className="text-muted-foreground">
                            Потребность: {skill.demand}%
                          </span>
                          <span className="text-muted-foreground">
                            Предложение: {skill.supply}%
                          </span>
                          <span className={`font-medium ${getGapColor(skill.gap)}`}>
                            Разрыв: {skill.gap > 0 ? '+' : ''}{skill.gap}%
                          </span>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div>
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-muted-foreground">Потребность</span>
                            <span>{skill.demand}%</span>
                          </div>
                          <Progress value={skill.demand} className="h-2" />
                        </div>
                        
                        <div>
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-muted-foreground">Предложение</span>
                            <span>{skill.supply}%</span>
                          </div>
                          <Progress value={skill.supply} className="h-2" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="scenarios" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Консервативный</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span>Инвестиции:</span>
                        <span className="font-medium">$8,000</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Время:</span>
                        <span className="font-medium">2 месяца</span>
                      </div>
                      <div className="flex justify-between">
                        <span>ROI:</span>
                        <span className="font-medium text-success">+15%</span>
                      </div>
                      <div className="pt-2">
                        <Progress value={75} className="h-2" />
                        <span className="text-xs text-muted-foreground">75% вероятность успеха</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Сбалансированный</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span>Инвестиции:</span>
                        <span className="font-medium">$23,000</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Время:</span>
                        <span className="font-medium">4 месяца</span>
                      </div>
                      <div className="flex justify-between">
                        <span>ROI:</span>
                        <span className="font-medium text-success">+28%</span>
                      </div>
                      <div className="pt-2">
                        <Progress value={85} className="h-2" />
                        <span className="text-xs text-muted-foreground">85% вероятность успеха</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Агрессивный</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span>Инвестиции:</span>
                        <span className="font-medium">$45,000</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Время:</span>
                        <span className="font-medium">6 месяцев</span>
                      </div>
                      <div className="flex justify-between">
                        <span>ROI:</span>
                        <span className="font-medium text-success">+42%</span>
                      </div>
                      <div className="pt-2">
                        <Progress value={65} className="h-2" />
                        <span className="text-xs text-muted-foreground">65% вероятность успеха</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex gap-3 pt-4">
            <Button onClick={handleExportReport} variant="outline">
              Экспорт отчета
            </Button>
            <Button variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Закрыть
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}