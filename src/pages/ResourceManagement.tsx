import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users, 
  Calendar, 
  Clock, 
  TrendingUp,
  Star,
  Plus,
  Search,
  Filter,
  UserPlus,
  Target,
  Briefcase,
  Award,
  Settings,
  Building2,
  BookOpen,
  UserCheck,
  BarChart3,
  UserCog,
  CheckSquare
} from "lucide-react";

// Import new components for each module
import { OrgStructure } from "@/components/resource-management/OrgStructure";
import { DisciplinesCompetencies } from "@/components/resource-management/DisciplinesCompetencies";
import { ResourceProfiles } from "@/components/resource-management/ResourceProfiles";
import { PlanningLoading } from "@/components/resource-management/PlanningLoading";
import { RequestsApprovals } from "@/components/resource-management/RequestsApprovals";
import { AnalyticsReports } from "@/components/resource-management/AnalyticsReports";

export default function ResourceManagement() {
  const [activeTab, setActiveTab] = useState("overview");

  const stats = [
    {
      title: "Total Resources",
      value: "156",
      change: "+8 this month",
      icon: Users,
      trend: "up"
    },
    {
      title: "Average Utilization",
      value: "87%",
      change: "Above target (85%)",
      icon: Clock,
      trend: "warning"
    },
    {
      title: "Available Capacity",
      value: "2,340h",
      change: "Next 30 days",
      icon: Calendar,
      trend: "neutral"
    },
    {
      title: "Skill Gaps",
      value: "3",
      change: "Critical areas",
      icon: Target,
      trend: "down"
    }
  ];

  const modules = [
    {
      id: "org-structure",
      title: "Оргструктура",
      description: "Подразделения",
      icon: Building2,
      value: "org-structure"
    },
    {
      id: "disciplines",
      title: "Дисциплины",
      description: "и компетенции",
      icon: BookOpen,
      value: "disciplines"
    },
    {
      id: "profiles",
      title: "Профили",
      description: "ресурсов",
      icon: UserCheck,
      value: "profiles"
    },
    {
      id: "planning",
      title: "Планирование",
      description: "и загрузка",
      icon: BarChart3,
      value: "planning"
    },
    {
      id: "requests",
      title: "Запросы",
      description: "и утверждения",
      icon: CheckSquare,
      value: "requests"
    },
    {
      id: "analytics",
      title: "Аналитика",
      description: "и отчёты",
      icon: Award,
      value: "analytics"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-sf font-bold text-foreground">Resource Management</h1>
          <p className="text-muted-foreground mt-1">
            Управление ресурсами, компетенциями и загрузкой команды
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm">
            <Search className="w-4 h-4 mr-2" />
            Поиск
          </Button>
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Фильтры
          </Button>
          <Button size="sm">
            <UserPlus className="w-4 h-4 mr-2" />
            Добавить ресурс
          </Button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <stat.icon className="w-4 h-4" />
                {stat.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{stat.value}</div>
              <div className={`flex items-center text-xs mt-1 ${
                stat.trend === "up" ? "text-success" :
                stat.trend === "warning" ? "text-warning" :
                stat.trend === "down" ? "text-destructive" :
                "text-primary"
              }`}>
                <TrendingUp className="w-3 h-3 mr-1" />
                {stat.change}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Navigation */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-7 max-w-4xl mx-auto">
          <TabsTrigger value="overview" className="text-xs">
            Обзор
          </TabsTrigger>
          {modules.map((module) => (
            <TabsTrigger key={module.id} value={module.value} className="text-xs">
              <div className="flex flex-col items-center gap-1">
                <module.icon className="w-4 h-4" />
                <div className="text-center">
                  <div className="font-medium">{module.title}</div>
                  <div className="text-[10px] opacity-70">{module.description}</div>
                </div>
              </div>
            </TabsTrigger>
          ))}
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {modules.map((module) => (
              <Card 
                key={module.id} 
                className="hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => setActiveTab(module.value)}
              >
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <module.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <div className="font-semibold">{module.title}</div>
                      <div className="text-sm text-muted-foreground font-normal">
                        {module.description}
                      </div>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-muted-foreground">
                    {module.id === "org-structure" && "Иерархия подразделений с drag-and-drop"}
                    {module.id === "disciplines" && "Управление навыками и компетенциями"}
                    {module.id === "profiles" && "360° профили ресурсов"}
                    {module.id === "planning" && "Тепловые карты загрузки"}
                    {module.id === "requests" && "Workflow назначения ресурсов"}
                    {module.id === "analytics" && "Дашборды и прогнозирование"}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Module Tabs */}
        <TabsContent value="org-structure" className="space-y-6 mt-6">
          <OrgStructure />
        </TabsContent>

        <TabsContent value="disciplines" className="space-y-6 mt-6">
          <DisciplinesCompetencies />
        </TabsContent>

        <TabsContent value="profiles" className="space-y-6 mt-6">
          <ResourceProfiles />
        </TabsContent>

        <TabsContent value="planning" className="space-y-6 mt-6">
          <PlanningLoading />
        </TabsContent>

        <TabsContent value="requests" className="space-y-6 mt-6">
          <RequestsApprovals />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6 mt-6">
          <AnalyticsReports />
        </TabsContent>
      </Tabs>
    </div>
  );
}