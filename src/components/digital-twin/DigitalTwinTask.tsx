import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Database, 
  History, 
  MessageSquare, 
  FileText, 
  Activity,
  Clock,
  User,
  CheckCircle,
  ArrowRight,
  GitBranch,
  Monitor
} from "lucide-react";

interface TaskEvent {
  id: string;
  timestamp: string;
  type: "status_change" | "assignment" | "document" | "comment" | "dependency" | "external_transfer";
  actor: string;
  description: string;
  metadata?: Record<string, any>;
}

interface TaskVersion {
  id: string;
  version: string;
  timestamp: string;
  author: string;
  changes: string[];
  documents: string[];
  status: string;
}

interface TaskCommunication {
  id: string;
  timestamp: string;
  from: string;
  to: string;
  type: "internal" | "external" | "system";
  subject: string;
  content: string;
  attachments?: string[];
}

interface DigitalTwinData {
  taskId: string;
  title: string;
  currentStatus: string;
  createdAt: string;
  updatedAt: string;
  totalEvents: number;
  versions: TaskVersion[];
  events: TaskEvent[];
  communications: TaskCommunication[];
  dependencies: Array<{
    id: string;
    title: string;
    type: "predecessor" | "successor";
    status: string;
  }>;
  externalTransfers: Array<{
    id: string;
    contractor: string;
    sentAt: string;
    status: string;
    budget: number;
  }>;
}

const mockDigitalTwin: DigitalTwinData = {
  taskId: "TASK-1234",
  title: "Разработка КМД для 3-го этажа",
  currentStatus: "External Review",
  createdAt: "2025-01-15T09:00:00Z",
  updatedAt: "2025-01-27T14:30:00Z",
  totalEvents: 47,
  versions: [
    {
      id: "v1",
      version: "1.0",
      timestamp: "2025-01-15T09:00:00Z",
      author: "Иванов А.С.",
      changes: ["Создание задачи", "Назначение исполнителя"],
      documents: ["ТЗ_КМД.pdf"],
      status: "Created"
    },
    {
      id: "v2", 
      version: "1.1",
      timestamp: "2025-01-20T11:15:00Z",
      author: "Петров И.К.",
      changes: ["Добавлены архитектурные чертежи", "Обновлен срок выполнения"],
      documents: ["ТЗ_КМД.pdf", "Архитектура_этаж3.dwg"],
      status: "In Progress"
    },
    {
      id: "v3",
      version: "2.0", 
      timestamp: "2025-01-25T16:45:00Z",
      author: "System",
      changes: ["Передача внешнему исполнителю", "Создан защищенный доступ"],
      documents: ["ТЗ_КМД.pdf", "Архитектура_этаж3.dwg", "Геология_отчет.pdf"],
      status: "External Transfer"
    }
  ],
  events: [
    {
      id: "evt1",
      timestamp: "2025-01-15T09:00:00Z",
      type: "status_change",
      actor: "Иванов А.С.",
      description: "Задача создана и назначена"
    },
    {
      id: "evt2",
      timestamp: "2025-01-20T11:15:00Z", 
      type: "document",
      actor: "Петров И.К.",
      description: "Добавлены входные архитектурные данные"
    },
    {
      id: "evt3",
      timestamp: "2025-01-22T14:30:00Z",
      type: "comment",
      actor: "AI/ML Engine",
      description: "Обнаружен риск превышения сроков (85%)"
    },
    {
      id: "evt4",
      timestamp: "2025-01-25T16:45:00Z",
      type: "external_transfer", 
      actor: "Сидорова М.А.",
      description: "Задача передана внешнему исполнителю 'СтройПроект ООО'"
    },
    {
      id: "evt5",
      timestamp: "2025-01-27T14:30:00Z",
      type: "status_change",
      actor: "External Contractor",
      description: "Статус обновлен до 'На рассмотрении'"
    }
  ],
  communications: [
    {
      id: "comm1",
      timestamp: "2025-01-25T17:00:00Z",
      from: "Сидорова М.А.",
      to: "contractor@stroyproekt.ru",
      type: "external",
      subject: "Передача задачи: Разработка КМД для 3-го этажа",
      content: "Добрый день! Направляем задачу на разработку конструктивных решений...",
      attachments: ["task_package.zip"]
    },
    {
      id: "comm2",
      timestamp: "2025-01-27T10:15:00Z",
      from: "contractor@stroyproekt.ru", 
      to: "Сидорова М.А.",
      type: "external",
      subject: "Re: Передача задачи: Разработка КМД",
      content: "Здравствуйте! Задача принята в работу. Ожидаемая готовность - 30.01.2025"
    },
    {
      id: "comm3",
      timestamp: "2025-01-27T14:30:00Z",
      from: "System",
      to: "Project Team",
      type: "system", 
      subject: "Обновление статуса внешней задачи",
      content: "Задача TASK-1234 обновлена исполнителем. Новый статус: На рассмотрении"
    }
  ],
  dependencies: [
    {
      id: "dep1",
      title: "Архитектурные решения - План этажа",
      type: "predecessor", 
      status: "Completed"
    },
    {
      id: "dep2",
      title: "Детализация узлов КЖ",
      type: "successor",
      status: "Waiting"
    }
  ],
  externalTransfers: [
    {
      id: "ext1",
      contractor: "СтройПроект ООО",
      sentAt: "2025-01-25T16:45:00Z",
      status: "In Progress",
      budget: 150000
    }
  ]
};

export function DigitalTwinTask() {
  const [selectedTaskId] = useState("TASK-1234");
  const [digitalTwin] = useState<DigitalTwinData>(mockDigitalTwin);
  const [activeTab, setActiveTab] = useState("overview");

  const getEventIcon = (type: string) => {
    switch (type) {
      case "status_change": return <Activity className="w-4 h-4" />;
      case "assignment": return <User className="w-4 h-4" />;
      case "document": return <FileText className="w-4 h-4" />;
      case "comment": return <MessageSquare className="w-4 h-4" />;
      case "dependency": return <GitBranch className="w-4 h-4" />;
      case "external_transfer": return <ArrowRight className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getEventColor = (type: string) => {
    switch (type) {
      case "status_change": return "text-primary";
      case "assignment": return "text-blue-500";
      case "document": return "text-green-500";
      case "comment": return "text-yellow-500";
      case "dependency": return "text-purple-500";
      case "external_transfer": return "text-orange-500";
      default: return "text-muted-foreground";
    }
  };

  const getCommunicationType = (type: string) => {
    switch (type) {
      case "external": return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200";
      case "internal": return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "system": return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
      default: return "bg-secondary";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-sf font-bold text-foreground">Digital Twin of Task</h2>
          <p className="text-muted-foreground">Полная история и состояние задачи {selectedTaskId}</p>
        </div>
        <Button variant="outline">
          <Monitor className="w-4 h-4 mr-2" />
          Реальное время
        </Button>
      </div>

      {/* Краткая информация */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Database className="w-5 h-5" />
                {digitalTwin.title}
              </CardTitle>
              <CardDescription>ID: {digitalTwin.taskId}</CardDescription>
            </div>
            <Badge variant="outline" className="bg-primary text-primary-foreground">
              {digitalTwin.currentStatus}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Создано</p>
              <p className="font-medium">
                {new Date(digitalTwin.createdAt).toLocaleDateString('ru-RU')}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Обновлено</p>
              <p className="font-medium">
                {new Date(digitalTwin.updatedAt).toLocaleDateString('ru-RU')}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Всего событий</p>
              <p className="font-medium">{digitalTwin.totalEvents}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Версий</p>
              <p className="font-medium">{digitalTwin.versions.length}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Вкладки детализации */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Обзор</TabsTrigger>
          <TabsTrigger value="versions">Версии</TabsTrigger>
          <TabsTrigger value="events">События</TabsTrigger>
          <TabsTrigger value="communications">Коммуникации</TabsTrigger>
          <TabsTrigger value="dependencies">Зависимости</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Последние события */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Последние события</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-64">
                  <div className="space-y-3">
                    {digitalTwin.events.slice(0, 5).map((event) => (
                      <div key={event.id} className="flex items-start gap-3 p-2 rounded-lg hover:bg-secondary">
                        <div className={`mt-1 ${getEventColor(event.type)}`}>
                          {getEventIcon(event.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium">{event.description}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-muted-foreground">{event.actor}</span>
                            <span className="text-xs text-muted-foreground">
                              {new Date(event.timestamp).toLocaleString('ru-RU')}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            {/* Внешние передачи */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Внешние исполнители</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {digitalTwin.externalTransfers.map((transfer) => (
                    <div key={transfer.id} className="p-3 border rounded-lg">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-medium">{transfer.contractor}</p>
                          <p className="text-sm text-muted-foreground">
                            Отправлено: {new Date(transfer.sentAt).toLocaleDateString('ru-RU')}
                          </p>
                          <Badge variant="outline" className="mt-1">
                            {transfer.status}
                          </Badge>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">₽{transfer.budget.toLocaleString()}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="versions" className="space-y-4">
          <div className="space-y-4">
            {digitalTwin.versions.map((version, index) => (
              <Card key={version.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">
                      Версия {version.version}
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{version.status}</Badge>
                      {index === 0 && <Badge>Текущая</Badge>}
                    </div>
                  </div>
                  <CardDescription>
                    {new Date(version.timestamp).toLocaleString('ru-RU')} • {version.author}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-medium mb-2">Изменения:</h4>
                      <ul className="text-sm space-y-1">
                        {version.changes.map((change, i) => (
                          <li key={i} className="flex items-center gap-2">
                            <CheckCircle className="w-3 h-3 text-success" />
                            {change}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-2">Документы:</h4>
                      <div className="flex flex-wrap gap-2">
                        {version.documents.map((doc, i) => (
                          <Badge key={i} variant="outline" className="gap-1">
                            <FileText className="w-3 h-3" />
                            {doc}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="events" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Журнал событий</CardTitle>
              <CardDescription>Хронология всех изменений и действий</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-96">
                <div className="space-y-4">
                  {digitalTwin.events.map((event, index) => (
                    <div key={event.id} className="flex items-start gap-4">
                      <div className="flex flex-col items-center">
                        <div className={`p-2 rounded-full bg-secondary ${getEventColor(event.type)}`}>
                          {getEventIcon(event.type)}
                        </div>
                        {index < digitalTwin.events.length - 1 && (
                          <div className="w-px h-8 bg-border mt-2" />
                        )}
                      </div>
                      
                      <div className="flex-1 pb-4">
                        <p className="font-medium">{event.description}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-sm text-muted-foreground">{event.actor}</span>
                          <span className="text-sm text-muted-foreground">
                            {new Date(event.timestamp).toLocaleString('ru-RU')}
                          </span>
                          <Badge variant="outline" className="text-xs">
                            {event.type}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="communications" className="space-y-4">
          <div className="space-y-4">
            {digitalTwin.communications.map((comm) => (
              <Card key={comm.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{comm.subject}</CardTitle>
                      <CardDescription>
                        {comm.from} → {comm.to} • {new Date(comm.timestamp).toLocaleString('ru-RU')}
                      </CardDescription>
                    </div>
                    <Badge className={getCommunicationType(comm.type)}>
                      {comm.type}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm whitespace-pre-wrap">{comm.content}</p>
                  {comm.attachments && comm.attachments.length > 0 && (
                    <div className="mt-3">
                      <p className="text-sm font-medium mb-2">Вложения:</p>
                      <div className="flex flex-wrap gap-2">
                        {comm.attachments.map((attachment, i) => (
                          <Badge key={i} variant="outline" className="gap-1">
                            <FileText className="w-3 h-3" />
                            {attachment}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="dependencies" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Предшествующие задачи</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {digitalTwin.dependencies
                    .filter(dep => dep.type === "predecessor")
                    .map((dep) => (
                      <div key={dep.id} className="flex items-center gap-3 p-2 border rounded-lg">
                        <CheckCircle className="w-4 h-4 text-success" />
                        <div className="flex-1">
                          <p className="font-medium">{dep.title}</p>
                          <Badge variant="outline" className="mt-1">
                            {dep.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Зависимые задачи</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {digitalTwin.dependencies
                    .filter(dep => dep.type === "successor")
                    .map((dep) => (
                      <div key={dep.id} className="flex items-center gap-3 p-2 border rounded-lg">
                        <Clock className="w-4 h-4 text-warning" />
                        <div className="flex-1">
                          <p className="font-medium">{dep.title}</p>
                          <Badge variant="outline" className="mt-1">
                            {dep.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}