import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { 
  Users, 
  Calendar as CalendarIcon, 
  Clock, 
  Flag, 
  Tag, 
  CheckSquare,
  X,
  Send,
  Package
} from "lucide-react";
import { format } from "date-fns";
import { ru } from "date-fns/locale";

interface BulkActionsProps {
  selectedTasks: any[];
  onClose: () => void;
  onApplyChanges: (changes: any) => void;
  onSendToExternal: (tasks: any[], packageData: any) => void;
}

export function BulkActions({ selectedTasks, onClose, onApplyChanges, onSendToExternal }: BulkActionsProps) {
  const [bulkChanges, setBulkChanges] = useState({
    assignee: "",
    status: "",
    priority: "",
    startDate: null as Date | null,
    endDate: null as Date | null,
    estimatedHours: "",
    tags: [] as string[]
  });

  const [newTag, setNewTag] = useState("");
  const [externalPackage, setExternalPackage] = useState({
    contractor: "",
    deadline: null as Date | null,
    budget: "",
    notes: ""
  });

  const [activeMode, setActiveMode] = useState<"bulk" | "external">("bulk");

  const addTag = () => {
    if (newTag.trim() && !bulkChanges.tags.includes(newTag.trim())) {
      setBulkChanges(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setBulkChanges(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleApplyBulkChanges = () => {
    const changes = Object.fromEntries(
      Object.entries(bulkChanges).filter(([_, value]) => {
        if (Array.isArray(value)) return value.length > 0;
        return value !== "" && value !== null;
      })
    );
    
    if (Object.keys(changes).length > 0) {
      onApplyChanges(changes);
      onClose();
    }
  };

  const handleSendToExternal = () => {
    const packageData = {
      contractor: externalPackage.contractor,
      deadline: externalPackage.deadline,
      budget: externalPackage.budget ? parseFloat(externalPackage.budget) : 0,
      notes: externalPackage.notes,
      totalTasks: selectedTasks.length,
      estimatedHours: selectedTasks.reduce((sum, task) => sum + (task.estimatedHours || 0), 0)
    };
    
    onSendToExternal(selectedTasks, packageData);
    onClose();
  };

  return (
    <Card className="fixed bottom-4 left-4 right-4 z-50 border-primary shadow-lg">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <CheckSquare className="w-5 h-5" />
            <span className="font-medium">
              Выбрано задач: {selectedTasks.length}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant={activeMode === "bulk" ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveMode("bulk")}
            >
              <Users className="w-4 h-4 mr-2" />
              Массовые действия
            </Button>
            <Button
              variant={activeMode === "external" ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveMode("external")}
            >
              <Package className="w-4 h-4 mr-2" />
              Внешний исполнитель
            </Button>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {activeMode === "bulk" && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Ответственный */}
            <div className="space-y-2">
              <Label className="text-sm flex items-center gap-1">
                <Users className="w-3 h-3" />
                Ответственный
              </Label>
              <Select value={bulkChanges.assignee} onValueChange={(value) => 
                setBulkChanges(prev => ({ ...prev, assignee: value }))
              }>
                <SelectTrigger className="h-8">
                  <SelectValue placeholder="Выбрать" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="John Doe">John Doe</SelectItem>
                  <SelectItem value="Jane Smith">Jane Smith</SelectItem>
                  <SelectItem value="Mike Johnson">Mike Johnson</SelectItem>
                  <SelectItem value="Emma Davis">Emma Davis</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Статус */}
            <div className="space-y-2">
              <Label className="text-sm flex items-center gap-1">
                <CheckSquare className="w-3 h-3" />
                Статус
              </Label>
              <Select value={bulkChanges.status} onValueChange={(value) => 
                setBulkChanges(prev => ({ ...prev, status: value }))
              }>
                <SelectTrigger className="h-8">
                  <SelectValue placeholder="Выбрать" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="To Do">К выполнению</SelectItem>
                  <SelectItem value="In Progress">В работе</SelectItem>
                  <SelectItem value="Review">На проверке</SelectItem>
                  <SelectItem value="Completed">Завершено</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Приоритет */}
            <div className="space-y-2">
              <Label className="text-sm flex items-center gap-1">
                <Flag className="w-3 h-3" />
                Приоритет
              </Label>
              <Select value={bulkChanges.priority} onValueChange={(value) => 
                setBulkChanges(prev => ({ ...prev, priority: value }))
              }>
                <SelectTrigger className="h-8">
                  <SelectValue placeholder="Выбрать" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Low">Низкий</SelectItem>
                  <SelectItem value="Medium">Средний</SelectItem>
                  <SelectItem value="High">Высокий</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Трудозатраты */}
            <div className="space-y-2">
              <Label className="text-sm flex items-center gap-1">
                <Clock className="w-3 h-3" />
                Плановые часы
              </Label>
              <Input
                type="number"
                placeholder="Часы"
                value={bulkChanges.estimatedHours}
                onChange={(e) => setBulkChanges(prev => ({ ...prev, estimatedHours: e.target.value }))}
                className="h-8"
              />
            </div>

            {/* Дата начала */}
            <div className="space-y-2">
              <Label className="text-sm flex items-center gap-1">
                <CalendarIcon className="w-3 h-3" />
                Дата начала
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="h-8 justify-start text-left font-normal">
                    {bulkChanges.startDate ? (
                      format(bulkChanges.startDate, "dd.MM.yyyy", { locale: ru })
                    ) : (
                      "Выбрать"
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={bulkChanges.startDate}
                    onSelect={(date) => setBulkChanges(prev => ({ ...prev, startDate: date }))}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Дата завершения */}
            <div className="space-y-2">
              <Label className="text-sm flex items-center gap-1">
                <CalendarIcon className="w-3 h-3" />
                Дата завершения
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="h-8 justify-start text-left font-normal">
                    {bulkChanges.endDate ? (
                      format(bulkChanges.endDate, "dd.MM.yyyy", { locale: ru })
                    ) : (
                      "Выбрать"
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={bulkChanges.endDate}
                    onSelect={(date) => setBulkChanges(prev => ({ ...prev, endDate: date }))}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Теги */}
            <div className="space-y-2 col-span-2">
              <Label className="text-sm flex items-center gap-1">
                <Tag className="w-3 h-3" />
                Теги
              </Label>
              <div className="flex gap-2">
                <Input
                  placeholder="Добавить тег"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addTag()}
                  className="h-8 flex-1"
                />
                <Button onClick={addTag} size="sm" className="h-8">
                  Добавить
                </Button>
              </div>
              {bulkChanges.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {bulkChanges.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {tag}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-auto p-0 ml-1"
                        onClick={() => removeTag(tag)}
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            <div className="col-span-full flex justify-end">
              <Button onClick={handleApplyBulkChanges} className="bg-primary hover:bg-primary/90">
                Применить изменения
              </Button>
            </div>
          </div>
        )}

        {activeMode === "external" && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Подрядчик */}
            <div className="space-y-2">
              <Label className="text-sm">Подрядчик</Label>
              <Select value={externalPackage.contractor} onValueChange={(value) => 
                setExternalPackage(prev => ({ ...prev, contractor: value }))
              }>
                <SelectTrigger className="h-8">
                  <SelectValue placeholder="Выбрать" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="СтройПроект ООО">СтройПроект ООО</SelectItem>
                  <SelectItem value="Архитектурная мастерская">Архитектурная мастерская</SelectItem>
                  <SelectItem value="ТехноБилд">ТехноБилд</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Срок выполнения */}
            <div className="space-y-2">
              <Label className="text-sm">Срок выполнения</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="h-8 justify-start text-left font-normal">
                    {externalPackage.deadline ? (
                      format(externalPackage.deadline, "dd.MM.yyyy", { locale: ru })
                    ) : (
                      "Выбрать"
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={externalPackage.deadline}
                    onSelect={(date) => setExternalPackage(prev => ({ ...prev, deadline: date }))}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Бюджет */}
            <div className="space-y-2">
              <Label className="text-sm">Бюджет (₽)</Label>
              <Input
                type="number"
                placeholder="0"
                value={externalPackage.budget}
                onChange={(e) => setExternalPackage(prev => ({ ...prev, budget: e.target.value }))}
                className="h-8"
              />
            </div>

            {/* Примечания */}
            <div className="space-y-2">
              <Label className="text-sm">Примечания</Label>
              <Input
                placeholder="Особые требования"
                value={externalPackage.notes}
                onChange={(e) => setExternalPackage(prev => ({ ...prev, notes: e.target.value }))}
                className="h-8"
              />
            </div>

            <div className="col-span-full">
              <div className="bg-secondary/50 p-3 rounded-md mb-4">
                <div className="text-sm space-y-1">
                  <p><strong>Пакет работ:</strong></p>
                  <p>• Задач: {selectedTasks.length}</p>
                  <p>• Общий объем: {selectedTasks.reduce((sum, task) => sum + (task.estimatedHours || 0), 0)} часов</p>
                  <p>• Проекты: {Array.from(new Set(selectedTasks.map(task => task.project))).join(", ")}</p>
                </div>
              </div>
              <div className="flex justify-end">
                <Button onClick={handleSendToExternal} className="bg-orange-500 hover:bg-orange-600">
                  <Send className="w-4 h-4 mr-2" />
                  Отправить внешнему исполнителю
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}