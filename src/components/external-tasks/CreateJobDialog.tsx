import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

interface CreateJobDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onJobCreated: () => void;
}

export function CreateJobDialog({ open, onOpenChange, onJobCreated }: CreateJobDialogProps) {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    job_type: "",
    experience_level: "",
    budget_min: "",
    budget_max: "",
    hourly_rate: "",
    deadline: "",
    duration: "",
    skills: [] as string[]
  });
  const [skillInput, setSkillInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addSkill = () => {
    if (skillInput.trim() && !formData.skills.includes(skillInput.trim())) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, skillInput.trim()]
      }));
      setSkillInput("");
    }
  };

  const removeSkill = (skill: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s !== skill)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error("Необходимо войти в систему для создания задания");
      return;
    }

    setIsSubmitting(true);

    try {
      // Получаем профиль пользователя
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (profileError || !profile) {
        toast.error("Ошибка профиля пользователя");
        setIsSubmitting(false);
        return;
      }
      
      const jobData = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        job_type: formData.job_type,
        experience_level: formData.experience_level,
        budget_min: formData.budget_min ? parseFloat(formData.budget_min) : null,
        budget_max: formData.budget_max ? parseFloat(formData.budget_max) : null,
        hourly_rate: formData.hourly_rate ? parseFloat(formData.hourly_rate) : null,
        deadline: formData.deadline || null,
        duration: formData.duration || null,
        skills_required: formData.skills.length > 0 ? formData.skills : null,
        client_id: profile.id,
        status: 'open'
      };

      const { error } = await supabase
        .from('job_postings')
        .insert([jobData]);

      if (error) {
        console.error('Error creating job:', error);
        toast.error("Ошибка при создании задания");
      } else {
        toast.success("Задание успешно создано!");
        onJobCreated();
        onOpenChange(false);
        // Reset form
        setFormData({
          title: "",
          description: "",
          category: "",
          job_type: "",
          experience_level: "",
          budget_min: "",
          budget_max: "",
          hourly_rate: "",
          deadline: "",
          duration: "",
          skills: []
        });
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error("Произошла ошибка при создании задания");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Разместить новое задание</DialogTitle>
          <DialogDescription>
            Заполните информацию о проекте для привлечения исполнителей
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Название проекта *</Label>
            <Input
              id="title"
              placeholder="Например: Разработка КМД для жилого комплекса"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Описание проекта *</Label>
            <Textarea
              id="description"
              placeholder="Подробно опишите техническое задание, требования и ожидания..."
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Категория *</Label>
              <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Выберите категорию" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Architecture">Архитектура</SelectItem>
                  <SelectItem value="Construction">Конструкции</SelectItem>
                  <SelectItem value="MEP">ОВК</SelectItem>
                  <SelectItem value="Geology">Геология</SelectItem>
                  <SelectItem value="Design">Дизайн</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="job_type">Тип оплаты *</Label>
              <Select value={formData.job_type} onValueChange={(value) => setFormData(prev => ({ ...prev, job_type: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Выберите тип" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Fixed Price">Фиксированная цена</SelectItem>
                  <SelectItem value="Hourly">Почасовая оплата</SelectItem>
                  <SelectItem value="Long-term">Долгосрочное сотрудничество</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="experience_level">Уровень опыта *</Label>
            <Select value={formData.experience_level} onValueChange={(value) => setFormData(prev => ({ ...prev, experience_level: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Выберите уровень" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Junior">Начальный (Junior)</SelectItem>
                <SelectItem value="Mid">Средний (Middle)</SelectItem>
                <SelectItem value="Senior">Опытный (Senior)</SelectItem>
                <SelectItem value="Expert">Эксперт</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="budget_min">Бюджет от (₽)</Label>
              <Input
                id="budget_min"
                type="number"
                placeholder="100000"
                value={formData.budget_min}
                onChange={(e) => setFormData(prev => ({ ...prev, budget_min: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="budget_max">Бюджет до (₽)</Label>
              <Input
                id="budget_max"
                type="number"
                placeholder="200000"
                value={formData.budget_max}
                onChange={(e) => setFormData(prev => ({ ...prev, budget_max: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="hourly_rate">Почасовая ставка (₽)</Label>
              <Input
                id="hourly_rate"
                type="number"
                placeholder="2000"
                value={formData.hourly_rate}
                onChange={(e) => setFormData(prev => ({ ...prev, hourly_rate: e.target.value }))}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="deadline">Срок выполнения</Label>
              <Input
                id="deadline"
                type="date"
                value={formData.deadline}
                onChange={(e) => setFormData(prev => ({ ...prev, deadline: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="duration">Длительность</Label>
              <Input
                id="duration"
                placeholder="Например: 2-3 месяца"
                value={formData.duration}
                onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="skills">Требуемые навыки</Label>
            <div className="flex gap-2">
              <Input
                id="skills"
                placeholder="Введите навык и нажмите Enter"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addSkill();
                  }
                }}
              />
              <Button type="button" onClick={addSkill}>
                Добавить
              </Button>
            </div>
            {formData.skills.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.skills.map((skill) => (
                  <Badge key={skill} variant="secondary" className="flex items-center gap-1">
                    {skill}
                    <X 
                      className="w-3 h-3 cursor-pointer" 
                      onClick={() => removeSkill(skill)}
                    />
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Отмена
            </Button>
            <Button type="submit" disabled={isSubmitting || !formData.title || !formData.description || !formData.category}>
              {isSubmitting ? "Создание..." : "Опубликовать задание"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}