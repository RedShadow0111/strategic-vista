import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  Target, 
  User, 
  TrendingUp, 
  Calendar,
  CheckCircle,
  Clock,
  AlertCircle
} from "lucide-react";

interface ProjectOverviewProps {
  project: any;
}

export function ProjectOverview({ project }: ProjectOverviewProps) {
  const kpis = [
    {
      name: "Budget Utilization",
      value: "72%",
      status: "good",
      icon: TrendingUp
    },
    {
      name: "Schedule Performance",
      value: "On Track",
      status: "good", 
      icon: Calendar
    },
    {
      name: "Quality Score",
      value: "8.5/10",
      status: "good",
      icon: CheckCircle
    },
    {
      name: "Risk Level",
      value: project.riskLevel,
      status: project.riskLevel === "High" ? "warning" : project.riskLevel === "Medium" ? "neutral" : "good",
      icon: AlertCircle
    }
  ];

  const milestones = [
    {
      name: "Project Initiation",
      date: "2024-02-15",
      status: "completed",
      description: "Project charter approval and team formation"
    },
    {
      name: "Requirements Analysis",
      date: "2024-03-15", 
      status: "completed",
      description: "Detailed requirements gathering and analysis"
    },
    {
      name: "Design Phase",
      date: "2024-04-30",
      status: "in-progress",
      description: "System architecture and UI/UX design"
    },
    {
      name: "Development Sprint 1",
      date: "2024-06-15",
      status: "upcoming",
      description: "Core functionality development"
    },
    {
      name: "Testing & QA",
      date: "2024-08-30",
      status: "upcoming", 
      description: "Comprehensive testing and quality assurance"
    },
    {
      name: "Go-Live",
      date: "2024-12-31",
      status: "upcoming",
      description: "Production deployment and launch"
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed": return <CheckCircle className="w-4 h-4 text-success" />;
      case "in-progress": return <Clock className="w-4 h-4 text-warning" />;
      default: return <Clock className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getKpiColor = (status: string) => {
    switch (status) {
      case "good": return "text-success";
      case "warning": return "text-warning";
      case "error": return "text-destructive";
      default: return "text-muted-foreground";
    }
  };

  return (
    <div className="space-y-6 h-full">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Project Goal & Sponsor */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                Цель проекта
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                Модернизация основных бизнес-процессов компании за счет внедрения цифровых технологий. 
                Повышение эффективности операций на 35% и улучшение клиентского опыта через автоматизацию 
                рутинных процессов и внедрение современных инструментов аналитики.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Спонсор проекта
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <Avatar className="w-12 h-12">
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {project.sponsor?.split(' ').map((n: string) => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium text-foreground">{project.sponsor}</div>
                  <div className="text-sm text-muted-foreground">Chief Technology Officer</div>
                  <div className="text-xs text-muted-foreground">sarah.johnson@company.com</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* KPIs */}
        <Card>
          <CardHeader>
            <CardTitle>Ключевые показатели</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {kpis.map((kpi, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <kpi.icon className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">{kpi.name}</span>
                </div>
                <span className={`text-sm font-medium ${getKpiColor(kpi.status)}`}>
                  {kpi.value}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* WBS & Milestones */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Work Breakdown Structure */}
        <Card>
          <CardHeader>
            <CardTitle>Структура декомпозиции работ (WBS)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <span className="font-medium">1. Планирование</span>
                <Badge variant="secondary" className="bg-success text-success-foreground">Завершено</Badge>
              </div>
              <div className="ml-4 space-y-2">
                <div className="flex items-center justify-between p-2 text-sm">
                  <span>1.1 Анализ требований</span>
                  <Badge variant="outline" className="bg-success text-success-foreground">100%</Badge>
                </div>
                <div className="flex items-center justify-between p-2 text-sm">
                  <span>1.2 Планирование ресурсов</span>
                  <Badge variant="outline" className="bg-success text-success-foreground">100%</Badge>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-primary/10 rounded-lg">
                <span className="font-medium">2. Дизайн и архитектура</span>
                <Badge variant="secondary" className="bg-warning text-warning-foreground">В процессе</Badge>
              </div>
              <div className="ml-4 space-y-2">
                <div className="flex items-center justify-between p-2 text-sm">
                  <span>2.1 Системная архитектура</span>
                  <Badge variant="outline" className="bg-warning text-warning-foreground">75%</Badge>
                </div>
                <div className="flex items-center justify-between p-2 text-sm">
                  <span>2.2 UI/UX дизайн</span>
                  <Badge variant="outline" className="bg-warning text-warning-foreground">60%</Badge>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <span className="font-medium">3. Разработка</span>
                <Badge variant="secondary" className="bg-muted text-muted-foreground">Ожидается</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Key Milestones */}
        <Card>
          <CardHeader>
            <CardTitle>Ключевые вехи</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {milestones.map((milestone, index) => (
                <div key={index} className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="mt-1">
                    {getStatusIcon(milestone.status)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-medium text-sm text-foreground">{milestone.name}</h4>
                      <span className="text-xs text-muted-foreground">
                        {new Date(milestone.date).toLocaleDateString('ru-RU')}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {milestone.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Project Progress Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Общий прогресс проекта</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-muted-foreground">Общий прогресс</span>
                <span className="font-medium">{project.progress}%</span>
              </div>
              <Progress value={project.progress} className="h-3" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-success">{Math.round(project.progress * 0.8)}</div>
                <div className="text-xs text-muted-foreground">Задач завершено</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-warning">{Math.round(project.progress * 0.15)}</div>
                <div className="text-xs text-muted-foreground">В работе</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-muted-foreground">{Math.round((100 - project.progress) * 0.05)}</div>
                <div className="text-xs text-muted-foreground">Отложено</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-foreground">{Math.round(project.progress + (100 - project.progress))}</div>
                <div className="text-xs text-muted-foreground">Всего задач</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}