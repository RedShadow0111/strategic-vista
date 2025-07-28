import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Target,
  Download,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Clock,
  Award,
  Brain,
  Zap,
  Eye,
  Filter
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AnalyticsData {
  departmentUtilization: { department: string; utilization: number; trend: number }[];
  skillBalance: { skill: string; demand: number; supply: number; gap: number }[];
  resourceEfficiency: { name: string; efficiency: number; projects: number; rating: number }[];
  predictiveStaffing: { month: string; requiredHires: number; budget: number; skills: string[] }[];
  teamHealth: { department: string; workload: number; burnoutRisk: number; satisfaction: number }[];
}

const mockAnalytics: AnalyticsData = {
  departmentUtilization: [
    { department: "Engineering", utilization: 88, trend: 5 },
    { department: "Design", utilization: 75, trend: -2 },
    { department: "PMO", utilization: 82, trend: 8 },
    { department: "QA", utilization: 92, trend: 12 },
    { department: "DevOps", utilization: 95, trend: 18 }
  ],
  skillBalance: [
    { skill: "React/Frontend", demand: 95, supply: 85, gap: -10 },
    { skill: "Node.js/Backend", demand: 80, supply: 88, gap: 8 },
    { skill: "DevOps", demand: 90, supply: 70, gap: -20 },
    { skill: "UX Research", demand: 65, supply: 60, gap: -5 },
    { skill: "Project Management", demand: 75, supply: 82, gap: 7 },
    { skill: "Data Science", demand: 70, supply: 45, gap: -25 }
  ],
  resourceEfficiency: [
    { name: "Sarah Chen", efficiency: 95, projects: 3, rating: 4.9 },
    { name: "Mike Johnson", efficiency: 88, projects: 2, rating: 4.6 },
    { name: "Emma Davis", efficiency: 92, projects: 4, rating: 4.8 },
    { name: "Alex Rodriguez", efficiency: 85, projects: 2, rating: 4.4 },
    { name: "Lisa Wang", efficiency: 98, projects: 3, rating: 4.9 }
  ],
  predictiveStaffing: [
    { month: "Март 2024", requiredHires: 3, budget: 450000, skills: ["DevOps", "Frontend"] },
    { month: "Апрель 2024", requiredHires: 2, budget: 280000, skills: ["Backend", "QA"] },
    { month: "Май 2024", requiredHires: 1, budget: 150000, skills: ["UX Designer"] },
    { month: "Июнь 2024", requiredHires: 4, budget: 520000, skills: ["Data Science", "ML Engineer"] }
  ],
  teamHealth: [
    { department: "Engineering", workload: 88, burnoutRisk: 25, satisfaction: 4.2 },
    { department: "Design", workload: 75, burnoutRisk: 15, satisfaction: 4.5 },
    { department: "PMO", workload: 82, burnoutRisk: 20, satisfaction: 4.3 },
    { department: "QA", workload: 92, burnoutRisk: 35, satisfaction: 3.8 },
    { department: "DevOps", workload: 95, burnoutRisk: 45, satisfaction: 3.6 }
  ]
};

export function AnalyticsReports() {
  const [selectedPeriod, setSelectedPeriod] = useState("3months");
  const [selectedDepartment, setSelectedDepartment] = useState("all");

  const getEfficiencyColor = (efficiency: number) => {
    if (efficiency >= 90) return "text-success";
    if (efficiency >= 80) return "text-warning";
    return "text-destructive";
  };

  const getBurnoutRiskColor = (risk: number) => {
    if (risk >= 40) return "text-destructive";
    if (risk >= 25) return "text-warning";
    return "text-success";
  };

  const getGapColor = (gap: number) => {
    if (gap < -15) return "text-destructive";
    if (gap < 0) return "text-warning";
    return "text-success";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-sf font-bold text-foreground">Аналитика и отчёты</h2>
          <p className="text-muted-foreground mt-1">
            Дашборды и прогнозирование для стратегического планирования
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Период" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1month">1 месяц</SelectItem>
              <SelectItem value="3months">3 месяца</SelectItem>
              <SelectItem value="6months">6 месяцев</SelectItem>
              <SelectItem value="1year">1 год</SelectItem>
            </SelectContent>
          </Select>
          <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Подразделение" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Все подразделения</SelectItem>
              <SelectItem value="Engineering">Engineering</SelectItem>
              <SelectItem value="Design">Design</SelectItem>
              <SelectItem value="PMO">PMO</SelectItem>
              <SelectItem value="QA">QA</SelectItem>
              <SelectItem value="DevOps">DevOps</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Экспорт
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              <div>
                <div className="text-sm text-muted-foreground">Средняя загрузка</div>
                <div className="text-2xl font-bold text-foreground">86%</div>
                <div className="text-xs text-success">+3% к прошлому месяцу</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-warning" />
              <div>
                <div className="text-sm text-muted-foreground">Критические пробелы</div>
                <div className="text-2xl font-bold text-foreground">3</div>
                <div className="text-xs text-destructive">DevOps, Data Science</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-success" />
              <div>
                <div className="text-sm text-muted-foreground">Эффективность</div>
                <div className="text-2xl font-bold text-foreground">91.6%</div>
                <div className="text-xs text-success">Выше планового</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-destructive" />
              <div>
                <div className="text-sm text-muted-foreground">Риск выгорания</div>
                <div className="text-2xl font-bold text-foreground">2</div>
                <div className="text-xs text-destructive">команды</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Analytics Tabs */}
      <Tabs defaultValue="utilization" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="utilization">Загрузка</TabsTrigger>
          <TabsTrigger value="skills">Компетенции</TabsTrigger>
          <TabsTrigger value="efficiency">Эффективность</TabsTrigger>
          <TabsTrigger value="prediction">Прогнозы</TabsTrigger>
          <TabsTrigger value="health">Здоровье команды</TabsTrigger>
        </TabsList>

        {/* Department Utilization */}
        <TabsContent value="utilization" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Загрузка по подразделениям
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockAnalytics.departmentUtilization.map((dept) => (
                  <div key={dept.department} className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="w-32">
                        <div className="font-medium text-sm">{dept.department}</div>
                      </div>
                      <div className="flex-1 max-w-xs">
                        <Progress value={dept.utilization} className="h-3" />
                      </div>
                      <div className="w-16 text-right">
                        <span className="font-medium">{dept.utilization}%</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={dept.trend > 0 ? "default" : "destructive"}>
                        {dept.trend > 0 ? "+" : ""}{dept.trend}%
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Динамика загрузки</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <BarChart3 className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  График загрузки по времени
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Распределение по проектам</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <Target className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  Распределение ресурсов
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Skills Balance */}
        <TabsContent value="skills" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                Баланс компетенций (Спрос vs Предложение)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockAnalytics.skillBalance.map((skill) => (
                  <div key={skill.skill} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-sm">{skill.skill}</span>
                      <div className="flex items-center gap-4">
                        <span className="text-xs text-muted-foreground">
                          Спрос: {skill.demand}% | Предложение: {skill.supply}%
                        </span>
                        <Badge variant={skill.gap < 0 ? "destructive" : "default"}>
                          {skill.gap > 0 ? "+" : ""}{skill.gap}%
                        </Badge>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <div className="text-xs text-muted-foreground mb-1">Спрос</div>
                        <Progress value={skill.demand} className="h-2 bg-red-100" />
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground mb-1">Предложение</div>
                        <Progress value={skill.supply} className="h-2 bg-green-100" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-destructive" />
                  Критические пробелы
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockAnalytics.skillBalance
                    .filter(skill => skill.gap < -10)
                    .map((skill) => (
                      <div key={skill.skill} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <div className="font-medium text-sm">{skill.skill}</div>
                          <div className="text-xs text-muted-foreground">
                            Нехватка: {Math.abs(skill.gap)}%
                          </div>
                        </div>
                        <Badge variant="destructive">
                          Критично
                        </Badge>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-success" />
                  Избыток компетенций
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockAnalytics.skillBalance
                    .filter(skill => skill.gap > 5)
                    .map((skill) => (
                      <div key={skill.skill} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <div className="font-medium text-sm">{skill.skill}</div>
                          <div className="text-xs text-muted-foreground">
                            Избыток: +{skill.gap}%
                          </div>
                        </div>
                        <Badge variant="default">
                          Доступно
                        </Badge>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Resource Efficiency */}
        <TabsContent value="efficiency" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="w-5 h-5" />
                Эффективность ресурсов (KPI)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockAnalytics.resourceEfficiency.map((resource) => (
                  <div key={resource.name} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div>
                        <div className="font-medium">{resource.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {resource.projects} активных проектов
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-center">
                        <div className="text-sm text-muted-foreground">Эффективность</div>
                        <div className={`text-lg font-bold ${getEfficiencyColor(resource.efficiency)}`}>
                          {resource.efficiency}%
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm text-muted-foreground">Рейтинг</div>
                        <div className="text-lg font-bold text-foreground">
                          {resource.rating}/5
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4 mr-2" />
                        Детали
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Predictive Staffing */}
        <TabsContent value="prediction" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="w-5 h-5" />
                Прогноз потребности в кадрах (Predictive Staffing)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockAnalytics.predictiveStaffing.map((forecast) => (
                  <div key={forecast.month} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <div className="font-medium">{forecast.month}</div>
                      <div className="text-sm text-muted-foreground">
                        Требуется {forecast.requiredHires} сотрудника(ов)
                      </div>
                      <div className="flex gap-1 mt-2">
                        {forecast.skills.map((skill, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-foreground">
                        {forecast.budget.toLocaleString('ru-RU')} ₽
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Бюджет найма
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Тренды найма</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <TrendingUp className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  График трендов найма
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Бюджетное планирование</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <BarChart3 className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  Распределение бюджета
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Team Health */}
        <TabsContent value="health" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Оценка "здоровья" команды
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockAnalytics.teamHealth.map((team) => (
                  <div key={team.department} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium">{team.department}</h4>
                      <Badge variant={team.burnoutRisk >= 40 ? "destructive" : team.burnoutRisk >= 25 ? "secondary" : "default"}>
                        {team.burnoutRisk >= 40 ? "Высокий риск" : team.burnoutRisk >= 25 ? "Средний риск" : "Низкий риск"}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <div className="text-sm text-muted-foreground mb-1">Нагрузка</div>
                        <div className="flex items-center gap-2">
                          <Progress value={team.workload} className="flex-1 h-2" />
                          <span className="text-sm font-medium">{team.workload}%</span>
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground mb-1">Риск выгорания</div>
                        <div className="flex items-center gap-2">
                          <Progress value={team.burnoutRisk} className="flex-1 h-2" />
                          <span className={`text-sm font-medium ${getBurnoutRiskColor(team.burnoutRisk)}`}>
                            {team.burnoutRisk}%
                          </span>
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground mb-1">Удовлетворённость</div>
                        <div className="flex items-center gap-2">
                          <Progress value={team.satisfaction * 20} className="flex-1 h-2" />
                          <span className="text-sm font-medium">{team.satisfaction}/5</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-destructive" />
                  Действия требуются
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="text-sm">
                    • DevOps команда: снизить нагрузку
                  </div>
                  <div className="text-sm">
                    • QA команда: планировать отпуска
                  </div>
                  <div className="text-sm">
                    • Провести опрос удовлетворённости
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-success" />
                  Здоровые команды
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="text-sm">
                    • Design: отличные показатели
                  </div>
                  <div className="text-sm">
                    • PMO: стабильная нагрузка
                  </div>
                  <div className="text-sm">
                    • Высокая удовлетворённость
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Clock className="w-5 h-5 text-primary" />
                  Рекомендации
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="text-sm">
                    • Перераспределить задачи
                  </div>
                  <div className="text-sm">
                    • Организовать тимбилдинг
                  </div>
                  <div className="text-sm">
                    • Внедрить wellness программы
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}