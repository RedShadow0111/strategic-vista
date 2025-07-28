import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Award, Calendar as CalendarIcon, Plus, X, Target } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

interface SkillDevelopmentPlanDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface SkillPlan {
  skill: string;
  currentLevel: number;
  targetLevel: number;
  deadline: Date | undefined;
  methods: string[];
  budget: string;
}

export function SkillDevelopmentPlanDialog({ open, onOpenChange }: SkillDevelopmentPlanDialogProps) {
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [skillPlans, setSkillPlans] = useState<SkillPlan[]>([]);
  const [newSkillPlan, setNewSkillPlan] = useState<SkillPlan>({
    skill: "",
    currentLevel: 0,
    targetLevel: 0,
    deadline: undefined,
    methods: [],
    budget: ""
  });
  const [newMethod, setNewMethod] = useState("");

  const employees = [
    "Sarah Chen",
    "Mike Johnson", 
    "Emma Davis",
    "Alex Rodriguez",
    "Lisa Wang"
  ];

  const developmentMethods = [
    "Онлайн курсы",
    "Тренинги",
    "Менторство",
    "Сертификация",
    "Конференции",
    "Воркшопы",
    "Практические проекты",
    "Самообучение"
  ];

  const handleAddMethod = () => {
    if (newMethod.trim() && !newSkillPlan.methods.includes(newMethod.trim())) {
      setNewSkillPlan(prev => ({
        ...prev,
        methods: [...prev.methods, newMethod.trim()]
      }));
      setNewMethod("");
    }
  };

  const handleRemoveMethod = (method: string) => {
    setNewSkillPlan(prev => ({
      ...prev,
      methods: prev.methods.filter(m => m !== method)
    }));
  };

  const handleAddSkillPlan = () => {
    if (!newSkillPlan.skill || !newSkillPlan.deadline) {
      toast("Заполните обязательные поля");
      return;
    }
    
    setSkillPlans(prev => [...prev, { ...newSkillPlan }]);
    setNewSkillPlan({
      skill: "",
      currentLevel: 0,
      targetLevel: 0,
      deadline: undefined,
      methods: [],
      budget: ""
    });
    toast("План развития навыка добавлен");
  };

  const handleRemoveSkillPlan = (index: number) => {
    setSkillPlans(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (!selectedEmployee || skillPlans.length === 0) {
      toast("Выберите сотрудника и добавьте хотя бы один план развития");
      return;
    }
    
    toast("План развития навыков создан и отправлен сотруднику");
    onOpenChange(false);
    
    // Reset form
    setSelectedEmployee("");
    setSkillPlans([]);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Award className="w-5 h-5" />
            План развития навыков
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="employee">Сотрудник *</Label>
            <Select value={selectedEmployee} onValueChange={setSelectedEmployee}>
              <SelectTrigger>
                <SelectValue placeholder="Выберите сотрудника" />
              </SelectTrigger>
              <SelectContent>
                {employees.map(employee => (
                  <SelectItem key={employee} value={employee}>
                    {employee}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Add New Skill Plan */}
          <div className="border border-border rounded-lg p-4 space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Добавить навык для развития
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="skill">Навык *</Label>
                <Input
                  id="skill"
                  value={newSkillPlan.skill}
                  onChange={(e) => setNewSkillPlan(prev => ({ ...prev, skill: e.target.value }))}
                  placeholder="Например: React, Project Management"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="budget">Бюджет на развитие</Label>
                <Input
                  id="budget"
                  value={newSkillPlan.budget}
                  onChange={(e) => setNewSkillPlan(prev => ({ ...prev, budget: e.target.value }))}
                  placeholder="Например: $2000"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Текущий уровень (1-10)</Label>
                <div className="space-y-2">
                  <Input
                    type="number"
                    min="1"
                    max="10"
                    value={newSkillPlan.currentLevel}
                    onChange={(e) => setNewSkillPlan(prev => ({ ...prev, currentLevel: parseInt(e.target.value) || 0 }))}
                  />
                  <Progress value={newSkillPlan.currentLevel * 10} className="h-2" />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Целевой уровень (1-10)</Label>
                <div className="space-y-2">
                  <Input
                    type="number"
                    min="1"
                    max="10"
                    value={newSkillPlan.targetLevel}
                    onChange={(e) => setNewSkillPlan(prev => ({ ...prev, targetLevel: parseInt(e.target.value) || 0 }))}
                  />
                  <Progress value={newSkillPlan.targetLevel * 10} className="h-2" />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Дедлайн *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {newSkillPlan.deadline ? format(newSkillPlan.deadline, "PPP") : "Выберите дату"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={newSkillPlan.deadline}
                    onSelect={(date) => setNewSkillPlan(prev => ({ ...prev, deadline: date }))}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label>Методы развития</Label>
              <div className="flex gap-2">
                <Select value={newMethod} onValueChange={setNewMethod}>
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Выберите метод" />
                  </SelectTrigger>
                  <SelectContent>
                    {developmentMethods.map(method => (
                      <SelectItem key={method} value={method}>
                        {method}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button onClick={handleAddMethod} variant="outline">
                  Добавить
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {newSkillPlan.methods.map((method, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    {method}
                    <X 
                      className="w-3 h-3 cursor-pointer" 
                      onClick={() => handleRemoveMethod(method)}
                    />
                  </Badge>
                ))}
              </div>
            </div>

            <Button onClick={handleAddSkillPlan} className="w-full">
              Добавить в план
            </Button>
          </div>

          {/* Existing Skill Plans */}
          {skillPlans.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Планы развития навыков</h3>
              {skillPlans.map((plan, index) => (
                <div key={index} className="border border-border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-semibold">{plan.skill}</h4>
                      <p className="text-sm text-muted-foreground">
                        Дедлайн: {plan.deadline ? format(plan.deadline, "PPP") : "Не указан"}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveSkillPlan(index)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">
                        Прогресс: {plan.currentLevel} → {plan.targetLevel}
                      </div>
                      <Progress value={(plan.currentLevel / plan.targetLevel) * 100} className="h-2" />
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">Бюджет</div>
                      <div className="font-medium">{plan.budget || "Не указан"}</div>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {plan.methods.map((method, methodIndex) => (
                      <Badge key={methodIndex} variant="outline">
                        {method}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <Button onClick={handleSubmit} className="flex-1">
              Создать план развития
            </Button>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Отмена
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
