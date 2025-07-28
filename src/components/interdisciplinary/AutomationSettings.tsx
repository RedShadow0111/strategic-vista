import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { 
  Zap, 
  ArrowRight, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  Settings,
  Bell,
  Mail,
  MessageSquare,
  Plus,
  Trash2
} from "lucide-react";
import { toast } from "sonner";

interface AutomationRule {
  id: string;
  name: string;
  trigger: {
    type: "status_change" | "time_delay" | "document_upload" | "approval";
    condition: string;
    value: string;
  };
  action: {
    type: "status_update" | "notification" | "assignment" | "external_transfer";
    target: string;
    parameters: Record<string, any>;
  };
  enabled: boolean;
  discipline: string;
  description: string;
}

const mockRules: AutomationRule[] = [
  {
    id: "rule-001",
    name: "Автопереход КМД → Детализация",
    trigger: {
      type: "status_change",
      condition: "КМД завершен",
      value: "completed"
    },
    action: {
      type: "status_update",
      target: "Детализация узлов",
      parameters: { status: "ready_to_start", notify_assignee: true }
    },
    enabled: true,
    discipline: "Конструкции",
    description: "При завершении КМД автоматически активировать детализацию узлов"
  },
  {
    id: "rule-002",
    name: "Риск срыва → Внешний исполнитель",
    trigger: {
      type: "time_delay",
      condition: "Риск > 80% и просрочка > 3 дня",
      value: "high_risk"
    },
    action: {
      type: "external_transfer",
      target: "JobBoard",
      parameters: { budget_multiplier: 1.2, urgent: true }
    },
    enabled: true,
    discipline: "Все",
    description: "При критическом риске автоматически выставить задачу на биржу"
  }
];

export function AutomationSettings() {
  const [rules, setRules] = useState<AutomationRule[]>(mockRules);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newRule, setNewRule] = useState<Partial<AutomationRule>>({
    name: "",
    trigger: { type: "status_change", condition: "", value: "" },
    action: { type: "status_update", target: "", parameters: {} },
    enabled: true,
    discipline: "",
    description: ""
  });

  const triggerTypes = [
    { value: "status_change", label: "Изменение статуса" },
    { value: "time_delay", label: "Задержка по времени" },
    { value: "document_upload", label: "Загрузка документа" },
    { value: "approval", label: "Утверждение" }
  ];

  const actionTypes = [
    { value: "status_update", label: "Обновить статус" },
    { value: "notification", label: "Отправить уведомление" },
    { value: "assignment", label: "Назначить исполнителя" },
    { value: "external_transfer", label: "Передать внешнему исполнителю" }
  ];

  const disciplines = [
    "Все", "Архитектура", "Конструкции", "ВК", "ОВ", "ЭО"
  ];

  const toggleRule = (ruleId: string) => {
    setRules(prev => prev.map(rule => 
      rule.id === ruleId ? { ...rule, enabled: !rule.enabled } : rule
    ));
    toast.success("Настройки автоматизации обновлены");
  };

  const deleteRule = (ruleId: string) => {
    setRules(prev => prev.filter(rule => rule.id !== ruleId));
    toast.success("Правило удалено");
  };

  const addRule = () => {
    if (!newRule.name || !newRule.discipline) {
      toast.error("Заполните обязательные поля");
      return;
    }

    const rule: AutomationRule = {
      id: `rule-${Date.now()}`,
      name: newRule.name!,
      trigger: newRule.trigger!,
      action: newRule.action!,
      enabled: newRule.enabled!,
      discipline: newRule.discipline!,
      description: newRule.description!
    };

    setRules(prev => [...prev, rule]);
    setNewRule({
      name: "",
      trigger: { type: "status_change", condition: "", value: "" },
      action: { type: "status_update", target: "", parameters: {} },
      enabled: true,
      discipline: "",
      description: ""
    });
    setShowAddForm(false);
    toast.success("Правило автоматизации добавлено");
  };

  const getTriggerIcon = (type: string) => {
    switch (type) {
      case "status_change": return <CheckCircle className="w-4 h-4" />;
      case "time_delay": return <Clock className="w-4 h-4" />;
      case "document_upload": return <ArrowRight className="w-4 h-4" />;
      case "approval": return <CheckCircle className="w-4 h-4" />;
      default: return <Settings className="w-4 h-4" />;
    }
  };

  const getActionIcon = (type: string) => {
    switch (type) {
      case "status_update": return <CheckCircle className="w-4 h-4" />;
      case "notification": return <Bell className="w-4 h-4" />;
      case "assignment": return <MessageSquare className="w-4 h-4" />;
      case "external_transfer": return <ArrowRight className="w-4 h-4" />;
      default: return <Settings className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Заголовок и статистика */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Активных правил</p>
                <p className="text-2xl font-bold">{rules.filter(r => r.enabled).length}</p>
              </div>
              <Zap className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Срабатываний сегодня</p>
                <p className="text-2xl font-bold">12</p>
              </div>
              <Clock className="w-8 h-8 text-success" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Экономия времени</p>
                <p className="text-2xl font-bold">4.2ч</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-warning" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Список правил */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Правила автоматизации</CardTitle>
              <CardDescription>Настройте автоматические переходы между этапами</CardDescription>
            </div>
            <Button onClick={() => setShowAddForm(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Добавить правило
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {rules.map((rule) => (
            <div key={rule.id} className="border rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="font-medium">{rule.name}</h4>
                    <Badge variant="outline">{rule.discipline}</Badge>
                    <Switch
                      checked={rule.enabled}
                      onCheckedChange={() => toggleRule(rule.id)}
                    />
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-3">
                    {rule.description}
                  </p>
                  
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      {getTriggerIcon(rule.trigger.type)}
                      <span className="text-muted-foreground">Триггер:</span>
                      <span>{rule.trigger.condition}</span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-muted-foreground" />
                    <div className="flex items-center gap-2">
                      {getActionIcon(rule.action.type)}
                      <span className="text-muted-foreground">Действие:</span>
                      <span>{rule.action.target}</span>
                    </div>
                  </div>
                </div>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => deleteRule(rule.id)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Форма добавления нового правила */}
      {showAddForm && (
        <Card>
          <CardHeader>
            <CardTitle>Новое правило автоматизации</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="rule-name">Название правила</Label>
                <Input
                  id="rule-name"
                  value={newRule.name}
                  onChange={(e) => setNewRule(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Название правила"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="rule-discipline">Дисциплина</Label>
                <Select
                  value={newRule.discipline}
                  onValueChange={(value) => setNewRule(prev => ({ ...prev, discipline: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите дисциплину" />
                  </SelectTrigger>
                  <SelectContent>
                    {disciplines.map(discipline => (
                      <SelectItem key={discipline} value={discipline}>
                        {discipline}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <h4 className="font-medium">Условие срабатывания</h4>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Тип триггера</Label>
                  <Select
                    value={newRule.trigger?.type}
                    onValueChange={(value) => setNewRule(prev => ({
                      ...prev,
                      trigger: { ...prev.trigger!, type: value as any }
                    }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {triggerTypes.map(type => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Условие</Label>
                  <Input
                    value={newRule.trigger?.condition}
                    onChange={(e) => setNewRule(prev => ({
                      ...prev,
                      trigger: { ...prev.trigger!, condition: e.target.value }
                    }))}
                    placeholder="Описание условия"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Значение</Label>
                  <Input
                    value={newRule.trigger?.value}
                    onChange={(e) => setNewRule(prev => ({
                      ...prev,
                      trigger: { ...prev.trigger!, value: e.target.value }
                    }))}
                    placeholder="Значение"
                  />
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <h4 className="font-medium">Действие</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Тип действия</Label>
                  <Select
                    value={newRule.action?.type}
                    onValueChange={(value) => setNewRule(prev => ({
                      ...prev,
                      action: { ...prev.action!, type: value as any }
                    }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {actionTypes.map(type => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Цель</Label>
                  <Input
                    value={newRule.action?.target}
                    onChange={(e) => setNewRule(prev => ({
                      ...prev,
                      action: { ...prev.action!, target: e.target.value }
                    }))}
                    placeholder="Цель действия"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="rule-description">Описание</Label>
              <Textarea
                id="rule-description"
                value={newRule.description}
                onChange={(e) => setNewRule(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Описание правила автоматизации"
                rows={3}
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowAddForm(false)}>
                Отмена
              </Button>
              <Button onClick={addRule}>
                Создать правило
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}