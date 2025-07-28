import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Plus, 
  Search, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  User,
  Calendar,
  Star,
  MessageSquare,
  Eye,
  ThumbsUp,
  ThumbsDown,
  Send
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ResourceRequest {
  id: string;
  projectName: string;
  requestedBy: string;
  role: string;
  discipline: string;
  requiredSkills: string[];
  startDate: string;
  endDate: string;
  loadPercentage: number;
  status: "pending" | "approved" | "rejected" | "in_review";
  priority: "low" | "medium" | "high" | "critical";
  createdAt: string;
  approver?: string;
  candidates?: { name: string; match: number; available: boolean }[];
  comments: { author: string; text: string; date: string }[];
}

const mockRequests: ResourceRequest[] = [
  {
    id: "1",
    projectName: "Digital Transformation",
    requestedBy: "Sarah Chen",
    role: "Senior React Developer",
    discipline: "Frontend Development",
    requiredSkills: ["React", "TypeScript", "Redux", "Testing"],
    startDate: "2024-03-01",
    endDate: "2024-08-31",
    loadPercentage: 80,
    status: "pending",
    priority: "high",
    createdAt: "2024-02-15",
    candidates: [
      { name: "Alex Rodriguez", match: 95, available: true },
      { name: "Lisa Wang", match: 88, available: false },
      { name: "Mike Johnson", match: 76, available: true }
    ],
    comments: [
      { author: "Sarah Chen", text: "Требуется опытный разработчик для ключевого модуля", date: "2024-02-15" }
    ]
  },
  {
    id: "2",
    projectName: "Mobile App Redesign",
    requestedBy: "Mike Johnson",
    role: "UX Researcher",
    discipline: "UX Design",
    requiredSkills: ["User Research", "Analytics", "Prototyping", "Interviews"],
    startDate: "2024-04-01",
    endDate: "2024-06-30",
    loadPercentage: 60,
    status: "in_review",
    priority: "medium",
    createdAt: "2024-02-20",
    approver: "Emma Davis",
    candidates: [
      { name: "Anna Smith", match: 92, available: true },
      { name: "David Lee", match: 85, available: true }
    ],
    comments: [
      { author: "Mike Johnson", text: "Нужен исследователь для проведения интервью с пользователями", date: "2024-02-20" },
      { author: "Emma Davis", text: "Рассматриваем кандидатов. Anna Smith выглядит подходящей", date: "2024-02-22" }
    ]
  },
  {
    id: "3",
    projectName: "Infrastructure Upgrade",
    requestedBy: "Emma Davis",
    role: "DevOps Engineer",
    discipline: "DevOps",
    requiredSkills: ["Kubernetes", "Docker", "AWS", "Terraform"],
    startDate: "2024-02-15",
    endDate: "2024-05-15",
    loadPercentage: 100,
    status: "approved",
    priority: "critical",
    createdAt: "2024-02-10",
    approver: "John Smith",
    candidates: [
      { name: "Lisa Wang", match: 98, available: true }
    ],
    comments: [
      { author: "Emma Davis", text: "Критически важно для стабильности системы", date: "2024-02-10" },
      { author: "John Smith", text: "Одобрено. Lisa Wang назначена на проект", date: "2024-02-12" }
    ]
  }
];

export function RequestsApprovals() {
  const [selectedTab, setSelectedTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [newRequestOpen, setNewRequestOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<ResourceRequest | null>(null);

  const getStatusColor = (status: ResourceRequest['status']) => {
    switch (status) {
      case "pending":
        return "bg-warning text-warning-foreground";
      case "in_review":
        return "bg-primary text-primary-foreground";
      case "approved":
        return "bg-success text-success-foreground";
      case "rejected":
        return "bg-destructive text-destructive-foreground";
    }
  };

  const getStatusLabel = (status: ResourceRequest['status']) => {
    switch (status) {
      case "pending":
        return "Ожидает";
      case "in_review":
        return "На рассмотрении";
      case "approved":
        return "Одобрено";
      case "rejected":
        return "Отклонено";
    }
  };

  const getStatusIcon = (status: ResourceRequest['status']) => {
    switch (status) {
      case "pending":
        return <Clock className="w-4 h-4" />;
      case "in_review":
        return <AlertCircle className="w-4 h-4" />;
      case "approved":
        return <CheckCircle className="w-4 h-4" />;
      case "rejected":
        return <XCircle className="w-4 h-4" />;
    }
  };

  const getPriorityColor = (priority: ResourceRequest['priority']) => {
    switch (priority) {
      case "low":
        return "text-muted-foreground";
      case "medium":
        return "text-primary";
      case "high":
        return "text-warning";
      case "critical":
        return "text-destructive";
    }
  };

  const filteredRequests = mockRequests.filter(request => {
    const matchesTab = selectedTab === "all" || request.status === selectedTab;
    const matchesSearch = !searchQuery || 
      request.projectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.requestedBy.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const stats = {
    total: mockRequests.length,
    pending: mockRequests.filter(r => r.status === "pending").length,
    inReview: mockRequests.filter(r => r.status === "in_review").length,
    approved: mockRequests.filter(r => r.status === "approved").length,
    rejected: mockRequests.filter(r => r.status === "rejected").length
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-sf font-bold text-foreground">Запросы и утверждения</h2>
          <p className="text-muted-foreground mt-1">
            Управление процессом назначения ресурсов на проекты
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <Input 
              placeholder="Поиск запросов..." 
              className="pl-10 w-64"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Dialog open={newRequestOpen} onOpenChange={setNewRequestOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Новый запрос
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Запрос ресурса</DialogTitle>
                <DialogDescription>
                  Создайте запрос на назначение ресурса на проект
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Проект</label>
                    <Input placeholder="Название проекта" />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Роль</label>
                    <Input placeholder="Требуемая роль" />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">Дисциплина</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите дисциплину" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="frontend">Frontend Development</SelectItem>
                      <SelectItem value="backend">Backend Development</SelectItem>
                      <SelectItem value="devops">DevOps</SelectItem>
                      <SelectItem value="design">UX/UI Design</SelectItem>
                      <SelectItem value="pm">Project Management</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium">Требуемые навыки</label>
                  <Input placeholder="React, TypeScript, Testing..." />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium">Дата начала</label>
                    <Input type="date" />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Дата окончания</label>
                    <Input type="date" />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Загрузка (%)</label>
                    <Input type="number" placeholder="80" min="1" max="100" />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">Приоритет</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите приоритет" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Низкий</SelectItem>
                      <SelectItem value="medium">Средний</SelectItem>
                      <SelectItem value="high">Высокий</SelectItem>
                      <SelectItem value="critical">Критический</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium">Описание</label>
                  <Textarea placeholder="Дополнительные требования и комментарии..." />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setNewRequestOpen(false)}>
                  Отмена
                </Button>
                <Button onClick={() => setNewRequestOpen(false)}>
                  Создать запрос
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-muted-foreground">Всего запросов</div>
            <div className="text-2xl font-bold text-foreground">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-muted-foreground">Ожидают</div>
            <div className="text-2xl font-bold text-warning">{stats.pending}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-muted-foreground">На рассмотрении</div>
            <div className="text-2xl font-bold text-primary">{stats.inReview}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-muted-foreground">Одобрено</div>
            <div className="text-2xl font-bold text-success">{stats.approved}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-muted-foreground">Отклонено</div>
            <div className="text-2xl font-bold text-destructive">{stats.rejected}</div>
          </CardContent>
        </Card>
      </div>

      {/* Requests List */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList>
          <TabsTrigger value="all">Все</TabsTrigger>
          <TabsTrigger value="pending">Ожидают</TabsTrigger>
          <TabsTrigger value="in_review">На рассмотрении</TabsTrigger>
          <TabsTrigger value="approved">Одобрено</TabsTrigger>
          <TabsTrigger value="rejected">Отклонено</TabsTrigger>
        </TabsList>

        <TabsContent value={selectedTab} className="space-y-4">
          {filteredRequests.map((request) => (
            <Card key={request.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-foreground">{request.projectName}</h3>
                        <Badge className={getStatusColor(request.status)}>
                          {getStatusIcon(request.status)}
                          <span className="ml-1">{getStatusLabel(request.status)}</span>
                        </Badge>
                        <Badge variant="outline" className={getPriorityColor(request.priority)}>
                          {request.priority.toUpperCase()}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground mb-2">
                        Запросил: {request.requestedBy} • {new Date(request.createdAt).toLocaleDateString('ru-RU')}
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Роль:</span>
                          <div className="font-medium">{request.role}</div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Дисциплина:</span>
                          <div className="font-medium">{request.discipline}</div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Период:</span>
                          <div className="font-medium">
                            {new Date(request.startDate).toLocaleDateString('ru-RU')} - {new Date(request.endDate).toLocaleDateString('ru-RU')}
                          </div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Загрузка:</span>
                          <div className="font-medium">{request.loadPercentage}%</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setSelectedRequest(request)}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Подробнее
                    </Button>
                    {request.status === "pending" && (
                      <>
                        <Button variant="outline" size="sm">
                          <ThumbsUp className="w-4 h-4 mr-2" />
                          Одобрить
                        </Button>
                        <Button variant="outline" size="sm">
                          <ThumbsDown className="w-4 h-4 mr-2" />
                          Отклонить
                        </Button>
                      </>
                    )}
                  </div>
                </div>

                {/* Skills */}
                <div className="mb-4">
                  <span className="text-sm text-muted-foreground">Требуемые навыки:</span>
                  <div className="flex gap-1 mt-1">
                    {request.requiredSkills.map((skill, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Candidates Preview */}
                {request.candidates && request.candidates.length > 0 && (
                  <div className="border-t pt-4">
                    <div className="text-sm text-muted-foreground mb-2">
                      Предлагаемые кандидаты ({request.candidates.length}):
                    </div>
                    <div className="flex gap-3">
                      {request.candidates.slice(0, 3).map((candidate, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm">
                          <Avatar className="w-6 h-6">
                            <AvatarFallback className="text-xs">
                              {candidate.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <span>{candidate.name}</span>
                          <div className="flex items-center gap-1">
                            <Star className="w-3 h-3 text-warning" />
                            <span>{candidate.match}%</span>
                          </div>
                          {!candidate.available && (
                            <Badge variant="destructive" className="text-xs">
                              Недоступен
                            </Badge>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>

      {/* Request Details Dialog */}
      {selectedRequest && (
        <Dialog open={!!selectedRequest} onOpenChange={() => setSelectedRequest(null)}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-auto">
            <DialogHeader>
              <DialogTitle>Детали запроса: {selectedRequest.projectName}</DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              {/* Request Info */}
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-foreground mb-2">Информация о запросе</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Проект:</span>
                        <span>{selectedRequest.projectName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Роль:</span>
                        <span>{selectedRequest.role}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Дисциплина:</span>
                        <span>{selectedRequest.discipline}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Загрузка:</span>
                        <span>{selectedRequest.loadPercentage}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Период:</span>
                        <span>
                          {new Date(selectedRequest.startDate).toLocaleDateString('ru-RU')} - {new Date(selectedRequest.endDate).toLocaleDateString('ru-RU')}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-foreground mb-2">Статус</h4>
                    <div className="space-y-2">
                      <Badge className={getStatusColor(selectedRequest.status)}>
                        {getStatusIcon(selectedRequest.status)}
                        <span className="ml-1">{getStatusLabel(selectedRequest.status)}</span>
                      </Badge>
                      <div className="text-sm text-muted-foreground">
                        Создан: {new Date(selectedRequest.createdAt).toLocaleDateString('ru-RU')}
                      </div>
                      {selectedRequest.approver && (
                        <div className="text-sm text-muted-foreground">
                          Рассматривает: {selectedRequest.approver}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Required Skills */}
              <div>
                <h4 className="font-medium text-foreground mb-2">Требуемые навыки</h4>
                <div className="flex flex-wrap gap-1">
                  {selectedRequest.requiredSkills.map((skill, index) => (
                    <Badge key={index} variant="outline">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Candidates */}
              {selectedRequest.candidates && (
                <div>
                  <h4 className="font-medium text-foreground mb-2">Предлагаемые кандидаты</h4>
                  <div className="space-y-3">
                    {selectedRequest.candidates.map((candidate, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarFallback>
                              {candidate.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{candidate.name}</div>
                            <div className="text-sm text-muted-foreground">
                              Соответствие: {candidate.match}%
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {candidate.available ? (
                            <Badge variant="default">Доступен</Badge>
                          ) : (
                            <Badge variant="destructive">Недоступен</Badge>
                          )}
                          <Button variant="outline" size="sm">
                            Выбрать
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Comments */}
              <div>
                <h4 className="font-medium text-foreground mb-2">Комментарии</h4>
                <div className="space-y-3">
                  {selectedRequest.comments.map((comment, index) => (
                    <div key={index} className="flex gap-3 p-3 border rounded-lg">
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className="text-xs">
                          {comment.author.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-sm">{comment.author}</span>
                          <span className="text-xs text-muted-foreground">
                            {new Date(comment.date).toLocaleDateString('ru-RU')}
                          </span>
                        </div>
                        <div className="text-sm">{comment.text}</div>
                      </div>
                    </div>
                  ))}
                  
                  {/* Add Comment */}
                  <div className="flex gap-3 p-3 border rounded-lg bg-muted/30">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="text-xs">Вы</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-2">
                      <Textarea placeholder="Добавить комментарий..." className="min-h-[60px]" />
                      <Button size="sm">
                        <Send className="w-4 h-4 mr-2" />
                        Отправить
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}