import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  AlertTriangle, 
  Plus,
  TrendingUp,
  TrendingDown,
  Minus,
  CheckCircle,
  Clock,
  Lightbulb,
  MoreVertical
} from "lucide-react";

interface ProjectRisksProps {
  project: any;
}

export function ProjectRisks({ project }: ProjectRisksProps) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newRisk, setNewRisk] = useState({
    title: "",
    description: "",
    probability: "",
    impact: "",
    category: "",
    owner: "",
    mitigation: ""
  });

  const risks = [
    {
      id: 1,
      title: "Задержка поставки серверного оборудования",
      description: "Возможная задержка поставки критически важного серверного оборудования на 2-3 недели из-за проблем у поставщика",
      probability: "Medium",
      impact: "High", 
      riskScore: 15,
      category: "Technical",
      status: "Active",
      owner: "David Kim",
      ownerInitials: "DK",
      mitigation: "Поиск альтернативных поставщиков, рассмотрение аренды оборудования",
      createdDate: "2024-03-15",
      lastUpdated: "2024-07-20"
    },
    {
      id: 2,
      title: "Недостаток экспертизы в области AI/ML",
      description: "В команде не хватает специалистов по машинному обучению для реализации AI-функций",
      probability: "High",
      impact: "Medium",
      riskScore: 12,
      category: "Resource",
      status: "Active", 
      owner: "Sarah Chen",
      ownerInitials: "SC",
      mitigation: "Привлечение внешних консультантов, обучение текущих разработчиков",
      createdDate: "2024-02-28",
      lastUpdated: "2024-07-18"
    },
    {
      id: 3,
      title: "Изменение требований заказчика",
      description: "Заказчик может изменить ключевые требования к системе в середине проекта",
      probability: "Medium",
      impact: "Medium",
      riskScore: 9,
      category: "Business",
      status: "Mitigated",
      owner: "Sarah Chen", 
      ownerInitials: "SC",
      mitigation: "Четкая фиксация требований в контракте, процедура управления изменениями",
      createdDate: "2024-02-15",
      lastUpdated: "2024-06-30"
    },
    {
      id: 4,
      title: "Проблемы с безопасностью данных",
      description: "Потенциальные уязвимости в системе безопасности при работе с персональными данными",
      probability: "Low",
      impact: "High",
      riskScore: 10,
      category: "Security",
      status: "Active",
      owner: "Alex Rodriguez",
      ownerInitials: "AR", 
      mitigation: "Аудит безопасности, внедрение дополнительных мер защиты",
      createdDate: "2024-04-01",
      lastUpdated: "2024-07-15"
    },
    {
      id: 5,
      title: "Превышение бюджета проекта",
      description: "Риск превышения планового бюджета из-за дополнительных требований и сложности задач",
      probability: "Medium",
      impact: "High",
      riskScore: 15,
      category: "Financial",
      status: "Active",
      owner: "Sarah Chen",
      ownerInitials: "SC",
      mitigation: "Еженедельный мониторинг расходов, резерв на непредвиденные траты",
      createdDate: "2024-03-01", 
      lastUpdated: "2024-07-22"
    }
  ];

  const aiSuggestions = [
    "Рассмотрите создание резервного плана для критических компонентов",
    "Проведите анализ заинтересованных сторон для выявления скрытых рисков",
    "Установите систему раннего предупреждения для технических рисков",
    "Создайте матрицу эскалации для различных уровней рисков"
  ];

  const getRiskColor = (score: number) => {
    if (score >= 15) return "bg-destructive text-destructive-foreground";
    if (score >= 10) return "bg-warning text-warning-foreground";
    if (score >= 5) return "bg-yellow-500 text-yellow-50";
    return "bg-success text-success-foreground";
  };

  const getRiskLevel = (score: number) => {
    if (score >= 15) return "Критический";
    if (score >= 10) return "Высокий";
    if (score >= 5) return "Средний";
    return "Низкий";
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active": return "bg-warning text-warning-foreground";
      case "Mitigated": return "bg-success text-success-foreground";
      case "Closed": return "bg-muted text-muted-foreground";
      default: return "bg-secondary text-secondary-foreground";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Active": return <AlertTriangle className="w-4 h-4" />;
      case "Mitigated": return <CheckCircle className="w-4 h-4" />;
      case "Closed": return <CheckCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Technical": return "border-l-blue-500";
      case "Resource": return "border-l-purple-500";
      case "Business": return "border-l-green-500";
      case "Security": return "border-l-red-500";
      case "Financial": return "border-l-yellow-500";
      default: return "border-l-muted";
    }
  };

  const riskStats = {
    total: risks.length,
    active: risks.filter(r => r.status === "Active").length,
    mitigated: risks.filter(r => r.status === "Mitigated").length,
    high: risks.filter(r => r.riskScore >= 10).length
  };

  const handleAddRisk = () => {
    // Handle adding new risk
    console.log("Adding risk:", newRisk);
    setIsAddDialogOpen(false);
    setNewRisk({
      title: "",
      description: "",
      probability: "",
      impact: "",
      category: "",
      owner: "",
      mitigation: ""
    });
  };

  return (
    <div className="space-y-6 h-full">
      {/* Risk Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-warning" />
              <span className="text-sm text-muted-foreground">Всего рисков</span>
            </div>
            <div className="text-2xl font-bold text-foreground mt-1">{riskStats.total}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-destructive" />
              <span className="text-sm text-muted-foreground">Активные</span>
            </div>
            <div className="text-2xl font-bold text-destructive mt-1">{riskStats.active}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-success" />
              <span className="text-sm text-muted-foreground">Устранены</span>
            </div>
            <div className="text-2xl font-bold text-success mt-1">{riskStats.mitigated}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingDown className="w-4 h-4 text-warning" />
              <span className="text-sm text-muted-foreground">Высокий риск</span>
            </div>
            <div className="text-2xl font-bold text-warning mt-1">{riskStats.high}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Risk List */}
        <div className="xl:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-foreground">Реестр рисков</h3>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Добавить риск
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Новый риск проекта</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="title">Название риска</Label>
                    <Input
                      id="title"
                      value={newRisk.title}
                      onChange={(e) => setNewRisk(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Краткое описание риска"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="description">Подробное описание</Label>
                    <Textarea
                      id="description"
                      value={newRisk.description}
                      onChange={(e) => setNewRisk(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Детальное описание риска и его потенциальных последствий"
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Вероятность</Label>
                      <Select value={newRisk.probability} onValueChange={(value) => setNewRisk(prev => ({ ...prev, probability: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Выберите вероятность" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Low">Низкая (1-3)</SelectItem>
                          <SelectItem value="Medium">Средняя (4-6)</SelectItem>
                          <SelectItem value="High">Высокая (7-9)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label>Воздействие</Label>
                      <Select value={newRisk.impact} onValueChange={(value) => setNewRisk(prev => ({ ...prev, impact: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Выберите воздействие" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Low">Низкое (1-3)</SelectItem>
                          <SelectItem value="Medium">Среднее (4-6)</SelectItem>
                          <SelectItem value="High">Высокое (7-9)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Категория</Label>
                      <Select value={newRisk.category} onValueChange={(value) => setNewRisk(prev => ({ ...prev, category: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Выберите категорию" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Technical">Технический</SelectItem>
                          <SelectItem value="Resource">Ресурсный</SelectItem>
                          <SelectItem value="Business">Бизнес</SelectItem>
                          <SelectItem value="Security">Безопасность</SelectItem>
                          <SelectItem value="Financial">Финансовый</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label>Ответственный</Label>
                      <Select value={newRisk.owner} onValueChange={(value) => setNewRisk(prev => ({ ...prev, owner: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Выберите владельца" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Sarah Chen">Sarah Chen</SelectItem>
                          <SelectItem value="Mike Johnson">Mike Johnson</SelectItem>
                          <SelectItem value="Emma Davis">Emma Davis</SelectItem>
                          <SelectItem value="Alex Rodriguez">Alex Rodriguez</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="mitigation">План снижения риска</Label>
                    <Textarea
                      id="mitigation"
                      value={newRisk.mitigation}
                      onChange={(e) => setNewRisk(prev => ({ ...prev, mitigation: e.target.value }))}
                      placeholder="Опишите действия по снижению вероятности или воздействия риска"
                      rows={3}
                    />
                  </div>

                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                      Отмена
                    </Button>
                    <Button onClick={handleAddRisk}>
                      Добавить риск
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="space-y-3">
            {risks.map((risk) => (
              <Card key={risk.id} className={`border-l-4 ${getCategoryColor(risk.category)} hover:shadow-md transition-shadow`}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-medium text-foreground">{risk.title}</h4>
                        <Badge variant="secondary" className={getRiskColor(risk.riskScore)}>
                          {getRiskLevel(risk.riskScore)}
                        </Badge>
                        <Badge variant="outline" className={getStatusColor(risk.status)}>
                          {getStatusIcon(risk.status)}
                          {risk.status === "Active" ? "Активный" : risk.status === "Mitigated" ? "Устранен" : "Закрыт"}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
                        {risk.description}
                      </p>
                    </div>
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Вероятность:</span>
                      <Badge variant="outline">{risk.probability}</Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Воздействие:</span>
                      <Badge variant="outline">{risk.impact}</Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Оценка:</span>
                      <Badge className={getRiskColor(risk.riskScore)}>
                        {risk.riskScore}
                      </Badge>
                    </div>
                  </div>

                  <div className="mb-3">
                    <div className="text-sm text-muted-foreground mb-1">План снижения:</div>
                    <p className="text-sm text-foreground leading-relaxed">
                      {risk.mitigation}
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Avatar className="w-5 h-5">
                        <AvatarFallback className="text-xs">
                          {risk.ownerInitials}
                        </AvatarFallback>
                      </Avatar>
                      <span>{risk.owner}</span>
                    </div>
                    <div>
                      Обновлено: {new Date(risk.lastUpdated).toLocaleDateString('ru-RU')}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* AI Suggestions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="w-5 h-5" />
              AI-подсказки
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Рекомендации ИИ для улучшения управления рисками:
            </p>
            
            {aiSuggestions.map((suggestion, index) => (
              <div key={index} className="p-3 bg-primary/5 rounded-lg border-l-2 border-primary">
                <p className="text-sm text-foreground leading-relaxed">
                  {suggestion}
                </p>
              </div>
            ))}

            <Button variant="outline" className="w-full">
              <Plus className="w-4 h-4 mr-2" />
              Получить больше рекомендаций
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}