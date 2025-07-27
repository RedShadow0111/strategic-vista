import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ExternalLink, 
  Send, 
  AlertTriangle, 
  Clock, 
  DollarSign, 
  FileText,
  Users,
  CheckCircle,
  XCircle,
  MessageSquare,
  Download
} from "lucide-react";
import { toast } from "sonner";

interface ExternalTask {
  id: string;
  title: string;
  description: string;
  priority: "High" | "Medium" | "Low";
  riskLevel: number;
  resourceUtilization: number;
  requiredSkills: string[];
  budget: number;
  deadline: string;
  inputDocuments: Array<{
    name: string;
    link: string;
    type: string;
  }>;
  status: "Pending" | "Sent" | "In Progress" | "Completed" | "Rejected";
  contractorName?: string;
  createdAt: string;
}

const mockExternalTasks: ExternalTask[] = [
  {
    id: "ETG-001",
    title: "Разработка КМД для 3-го этажа",
    description: "На основе архитектурных решений и геологических данных требуется разработать конструктивные решения",
    priority: "High",
    riskLevel: 85,
    resourceUtilization: 95,
    requiredSkills: ["КМД", "AutoCAD", "СНиП", "Железобетон"],
    budget: 150000,
    deadline: "2025-04-30",
    inputDocuments: [
      { name: "Архитектура_этаж3.pdf", link: "#", type: "PDF" },
      { name: "Геология_отчет.docx", link: "#", type: "DOC" },
      { name: "Стандарты_КМД.pdf", link: "#", type: "PDF" }
    ],
    status: "Pending",
    createdAt: "2025-01-27"
  },
  {
    id: "ETG-002", 
    title: "Инженерные изыскания участка Б",
    description: "Геодезические и геологические работы для проектирования фундаментов",
    priority: "Medium",
    riskLevel: 70,
    resourceUtilization: 88,
    requiredSkills: ["Геология", "Геодезия", "Лабораторные испытания"],
    budget: 80000,
    deadline: "2025-03-15",
    inputDocuments: [
      { name: "ТЗ_изыскания.pdf", link: "#", type: "PDF" },
      { name: "Карта_участка.dwg", link: "#", type: "DWG" }
    ],
    status: "Sent",
    contractorName: "ГеоПроект ООО",
    createdAt: "2025-01-25"
  }
];

interface ExternalTaskPackage {
  task_id: string;
  title: string;
  description: string;
  required_skills: string[];
  budget: number;
  deadline: string;
  input_documents: Array<{
    name: string;
    link: string;
  }>;
  nda_required: boolean;
  delivery_format: string;
  access_token?: string;
}

export function ExternalTaskGateway() {
  const [tasks, setTasks] = useState<ExternalTask[]>(mockExternalTasks);
  const [selectedTask, setSelectedTask] = useState<ExternalTask | null>(null);
  const [isPackageDialogOpen, setIsPackageDialogOpen] = useState(false);
  const [contractorEmail, setContractorEmail] = useState("");
  const [contractorName, setContractorName] = useState("");

  const getRiskColor = (riskLevel: number) => {
    if (riskLevel >= 80) return "text-destructive";
    if (riskLevel >= 60) return "text-warning";
    return "text-success";
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High": return "bg-destructive text-destructive-foreground";
      case "Medium": return "bg-warning text-warning-foreground";
      case "Low": return "bg-success text-success-foreground";
      default: return "bg-secondary";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed": return "bg-success text-success-foreground";
      case "In Progress": return "bg-primary text-primary-foreground";
      case "Sent": return "bg-warning text-warning-foreground";
      case "Rejected": return "bg-destructive text-destructive-foreground";
      default: return "bg-secondary";
    }
  };

  const generateTaskPackage = (task: ExternalTask): ExternalTaskPackage => {
    return {
      task_id: task.id,
      title: task.title,
      description: task.description,
      required_skills: task.requiredSkills,
      budget: task.budget,
      deadline: task.deadline,
      input_documents: task.inputDocuments.map(doc => ({
        name: doc.name,
        link: doc.link
      })),
      nda_required: true,
      delivery_format: "DWG + PDF",
      access_token: `jwt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    };
  };

  const handleSendToContractor = () => {
    if (!selectedTask || !contractorEmail) return;

    const taskPackage = generateTaskPackage(selectedTask);
    
    // Обновляем статус задачи
    setTasks(prev => prev.map(task => 
      task.id === selectedTask.id 
        ? { ...task, status: "Sent" as const, contractorName } 
        : task
    ));

    toast.success(`Задача отправлена исполнителю ${contractorName}`);
    setIsPackageDialogOpen(false);
    setSelectedTask(null);
    setContractorEmail("");
    setContractorName("");
  };

  const generateSecureLink = (task: ExternalTask) => {
    const package_data = generateTaskPackage(task);
    const secureLink = `https://predictivepulse.io/external/${package_data.access_token}`;
    
    navigator.clipboard.writeText(secureLink);
    toast.success("Защищённая ссылка скопирована в буфер обмена");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-sf font-bold text-foreground">External Task Gateway</h2>
          <p className="text-muted-foreground">Автоматизированная передача задач внешним исполнителям</p>
        </div>
        <Button variant="outline">
          <Users className="w-4 h-4 mr-2" />
          Биржа заданий
        </Button>
      </div>

      {/* Статистика */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Задач на передачу</p>
                <p className="text-2xl font-bold">{tasks.filter(t => t.status === "Pending").length}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-warning" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">В работе</p>
                <p className="text-2xl font-bold">{tasks.filter(t => t.status === "In Progress").length}</p>
              </div>
              <Clock className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Завершено</p>
                <p className="text-2xl font-bold">{tasks.filter(t => t.status === "Completed").length}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-success" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Экономия</p>
                <p className="text-2xl font-bold">₽2.1M</p>
              </div>
              <DollarSign className="w-8 h-8 text-success" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Список задач */}
      <div className="space-y-4">
        {tasks.map((task) => (
          <Card key={task.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-lg">{task.title}</CardTitle>
                  <CardDescription>{task.description}</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={getPriorityColor(task.priority)}>
                    {task.priority}
                  </Badge>
                  <Badge className={getStatusColor(task.status)}>
                    {task.status}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Риск срыва сроков</Label>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-secondary rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${task.riskLevel >= 80 ? 'bg-destructive' : task.riskLevel >= 60 ? 'bg-warning' : 'bg-success'}`}
                        style={{ width: `${task.riskLevel}%` }}
                      />
                    </div>
                    <span className={`text-sm font-medium ${getRiskColor(task.riskLevel)}`}>
                      {task.riskLevel}%
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">Загрузка ресурсов</Label>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-secondary rounded-full h-2">
                      <div 
                        className="h-2 rounded-full bg-primary"
                        style={{ width: `${task.resourceUtilization}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium">{task.resourceUtilization}%</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">Бюджет</Label>
                  <p className="text-lg font-semibold">₽{task.budget.toLocaleString()}</p>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">Требуемые навыки</Label>
                <div className="flex flex-wrap gap-1">
                  {task.requiredSkills.map((skill, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">Входные документы</Label>
                <div className="flex flex-wrap gap-2">
                  {task.inputDocuments.map((doc, index) => (
                    <Button key={index} variant="outline" size="sm" className="gap-2">
                      <FileText className="w-3 h-3" />
                      {doc.name}
                      <Download className="w-3 h-3" />
                    </Button>
                  ))}
                </div>
              </div>

              {task.contractorName && (
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Исполнитель</Label>
                  <p className="text-sm">{task.contractorName}</p>
                </div>
              )}

              <div className="flex items-center justify-between pt-4 border-t">
                <div className="text-sm text-muted-foreground">
                  Крайний срок: {new Date(task.deadline).toLocaleDateString('ru-RU')}
                </div>
                <div className="flex items-center gap-2">
                  {task.status === "Pending" && (
                    <>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => generateSecureLink(task)}
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Создать ссылку
                      </Button>
                      <Dialog open={isPackageDialogOpen} onOpenChange={setIsPackageDialogOpen}>
                        <DialogTrigger asChild>
                          <Button 
                            size="sm"
                            onClick={() => setSelectedTask(task)}
                          >
                            <Send className="w-4 h-4 mr-2" />
                            Передать исполнителю
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Передача задачи внешнему исполнителю</DialogTitle>
                            <DialogDescription>
                              Заполните данные исполнителя для отправки задачи
                            </DialogDescription>
                          </DialogHeader>
                          
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor="contractor-name">Название организации</Label>
                                <Input
                                  id="contractor-name"
                                  value={contractorName}
                                  onChange={(e) => setContractorName(e.target.value)}
                                  placeholder="ООО Проектная компания"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="contractor-email">Email исполнителя</Label>
                                <Input
                                  id="contractor-email"
                                  type="email"
                                  value={contractorEmail}
                                  onChange={(e) => setContractorEmail(e.target.value)}
                                  placeholder="contractor@example.com"
                                />
                              </div>
                            </div>

                            {selectedTask && (
                              <div className="space-y-3 p-4 bg-secondary rounded-lg">
                                <h4 className="font-medium">Пакет задания:</h4>
                                <div className="text-sm space-y-1">
                                  <p><strong>Задача:</strong> {selectedTask.title}</p>
                                  <p><strong>Бюджет:</strong> ₽{selectedTask.budget.toLocaleString()}</p>
                                  <p><strong>Срок:</strong> {new Date(selectedTask.deadline).toLocaleDateString('ru-RU')}</p>
                                  <p><strong>Документов:</strong> {selectedTask.inputDocuments.length}</p>
                                  <p><strong>NDA:</strong> Требуется</p>
                                </div>
                              </div>
                            )}

                            <div className="flex justify-end gap-2">
                              <Button 
                                variant="outline" 
                                onClick={() => setIsPackageDialogOpen(false)}
                              >
                                Отмена
                              </Button>
                              <Button 
                                onClick={handleSendToContractor}
                                disabled={!contractorEmail || !contractorName}
                              >
                                Отправить задачу
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </>
                  )}
                  
                  {task.status === "Sent" && (
                    <Button variant="outline" size="sm">
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Чат с исполнителем
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}