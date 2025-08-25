import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  BarChart3,
  PieChart
} from "lucide-react";

interface ProjectFinancesProps {
  project: any;
}

export function ProjectFinances({ project }: ProjectFinancesProps) {
  const financialData = {
    totalBudget: project.budget || 2500000,
    actualCost: project.spent || 1800000,
    plannedValue: 1750000, // BCWS - Budgeted Cost of Work Scheduled
    earnedValue: 1680000,   // BCWP - Budgeted Cost of Work Performed
    costVariance: -120000,  // CV = EV - AC
    scheduleVariance: -70000, // SV = EV - PV
    costPerformanceIndex: 0.93, // CPI = EV / AC
    schedulePerformanceIndex: 0.96, // SPI = EV / PV
    estimateAtCompletion: 2690000, // EAC
    estimateToComplete: 890000, // ETC
    varianceAtCompletion: -190000 // VAC
  };

  const budgetBreakdown = [
    {
      category: "Персонал",
      budgeted: 1500000,
      actual: 1200000,
      percentage: 60
    },
    {
      category: "Технологии",
      budgeted: 500000,
      actual: 380000,
      percentage: 20
    },
    {
      category: "Инфраструктура",
      budgeted: 300000,
      actual: 150000,
      percentage: 12
    },
    {
      category: "Обучение",
      budgeted: 100000,
      actual: 45000,
      percentage: 4
    },
    {
      category: "Прочее",
      budgeted: 100000,
      actual: 25000,
      percentage: 4
    }
  ];

  const monthlySpending = [
    { month: "Фев", planned: 150000, actual: 120000 },
    { month: "Мар", planned: 200000, actual: 180000 },
    { month: "Апр", planned: 250000, actual: 240000 },
    { month: "Май", planned: 300000, actual: 290000 },
    { month: "Июн", planned: 280000, actual: 320000 },
    { month: "Июл", planned: 320000, actual: 350000 },
    { month: "Авг", planned: 300000, actual: 300000 }
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB'
    }).format(amount);
  };

  const getVarianceColor = (variance: number) => {
    if (variance > 0) return "text-success";
    if (variance < -50000) return "text-destructive";
    return "text-warning";
  };

  const getIndexColor = (index: number) => {
    if (index >= 1.0) return "text-success";
    if (index >= 0.9) return "text-warning";
    return "text-destructive";
  };

  return (
    <div className="space-y-6 h-full">
      {/* Financial Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-primary" />
              <span className="text-sm text-muted-foreground">Общий бюджет</span>
            </div>
            <div className="text-2xl font-bold text-foreground mt-1">
              {formatCurrency(financialData.totalBudget)}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-warning" />
              <span className="text-sm text-muted-foreground">Потрачено</span>
            </div>
            <div className="text-2xl font-bold text-warning mt-1">
              {formatCurrency(financialData.actualCost)}
            </div>
            <div className="text-xs text-muted-foreground">
              {Math.round((financialData.actualCost / financialData.totalBudget) * 100)}% от бюджета
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-success" />
              <span className="text-sm text-muted-foreground">Освоенный объем</span>
            </div>
            <div className="text-2xl font-bold text-success mt-1">
              {formatCurrency(financialData.earnedValue)}
            </div>
            <div className="text-xs text-muted-foreground">
              EV (BCWP)
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              {financialData.costVariance >= 0 ? (
                <CheckCircle className="w-4 h-4 text-success" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-destructive" />
              )}
              <span className="text-sm text-muted-foreground">Отклонение</span>
            </div>
            <div className={`text-2xl font-bold mt-1 ${getVarianceColor(financialData.costVariance)}`}>
              {formatCurrency(financialData.costVariance)}
            </div>
            <div className="text-xs text-muted-foreground">
              CV (EV - AC)
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Budget vs Actual Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Бюджет vs Фактические расходы
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {budgetBreakdown.map((item, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium text-foreground">{item.category}</span>
                    <div className="text-right">
                      <div className="text-muted-foreground">
                        {formatCurrency(item.actual)} / {formatCurrency(item.budgeted)}
                      </div>
                      <div className={`text-xs ${item.actual <= item.budgeted ? 'text-success' : 'text-destructive'}`}>
                        {Math.round((item.actual / item.budgeted) * 100)}%
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <div className="flex-1 bg-muted rounded-full h-2">
                      <div 
                        className="bg-primary rounded-full h-2 transition-all"
                        style={{ width: `${Math.min((item.actual / item.budgeted) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* EVM Analysis */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="w-5 h-5" />
              Анализ освоенного объема (EVM)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">Плановый объем (PV)</div>
                <div className="text-lg font-semibold text-foreground">
                  {formatCurrency(financialData.plannedValue)}
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">Освоенный объем (EV)</div>
                <div className="text-lg font-semibold text-success">
                  {formatCurrency(financialData.earnedValue)}
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Индекс эффективности затрат (CPI)</span>
                <div className="flex items-center gap-2">
                  <Badge variant={financialData.costPerformanceIndex >= 1 ? "default" : "destructive"}>
                    {financialData.costPerformanceIndex.toFixed(2)}
                  </Badge>
                  {financialData.costPerformanceIndex >= 1 ? (
                    <TrendingUp className="w-4 h-4 text-success" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-destructive" />
                  )}
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Индекс выполнения расписания (SPI)</span>
                <div className="flex items-center gap-2">
                  <Badge variant={financialData.schedulePerformanceIndex >= 1 ? "default" : "secondary"}>
                    {financialData.schedulePerformanceIndex.toFixed(2)}
                  </Badge>
                  {financialData.schedulePerformanceIndex >= 1 ? (
                    <TrendingUp className="w-4 h-4 text-success" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-warning" />
                  )}
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Отклонение по затратам (CV)</span>
                <span className={`font-medium ${getVarianceColor(financialData.costVariance)}`}>
                  {formatCurrency(financialData.costVariance)}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Отклонение по расписанию (SV)</span>
                <span className={`font-medium ${getVarianceColor(financialData.scheduleVariance)}`}>
                  {formatCurrency(financialData.scheduleVariance)}
                </span>
              </div>
            </div>

            <div className="pt-4 border-t space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Прогноз к завершению (EAC)</span>
                <span className="font-medium text-foreground">
                  {formatCurrency(financialData.estimateAtCompletion)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Осталось потратить (ETC)</span>
                <span className="font-medium text-foreground">
                  {formatCurrency(financialData.estimateToComplete)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Отклонение к завершению (VAC)</span>
                <span className={`font-medium ${getVarianceColor(financialData.varianceAtCompletion)}`}>
                  {formatCurrency(financialData.varianceAtCompletion)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Spending Trend */}
      <Card>
        <CardHeader>
          <CardTitle>Динамика расходов по месяцам</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-end gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-primary rounded" />
                <span className="text-muted-foreground">Плановые расходы</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-warning rounded" />
                <span className="text-muted-foreground">Фактические расходы</span>
              </div>
            </div>
            
            <div className="space-y-3">
              {monthlySpending.map((month, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium text-foreground">{month.month}</span>
                    <div className="text-right">
                      <span className="text-warning">{formatCurrency(month.actual)}</span>
                      <span className="text-muted-foreground"> / </span>
                      <span className="text-primary">{formatCurrency(month.planned)}</span>
                    </div>
                  </div>
                  <div className="relative">
                    <div className="bg-muted rounded-full h-2">
                      <div 
                        className="bg-primary rounded-full h-2 transition-all"
                        style={{ width: `${(month.planned / 350000) * 100}%` }}
                      />
                    </div>
                    <div 
                      className="absolute top-0 bg-warning rounded-full h-2 transition-all"
                      style={{ width: `${(month.actual / 350000) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}