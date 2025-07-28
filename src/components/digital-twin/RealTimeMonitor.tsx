import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { 
  Activity, 
  Clock, 
  User, 
  FileText, 
  MessageSquare,
  Wifi,
  WifiOff,
  Circle,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Pause,
  Play
} from "lucide-react";

interface RealTimeEvent {
  id: string;
  timestamp: string;
  type: "status" | "document" | "communication" | "progress" | "assignment" | "alert";
  title: string;
  description: string;
  actor: string;
  severity: "low" | "medium" | "high" | "critical";
  metadata?: Record<string, any>;
}

interface RealTimeMetrics {
  progress: number;
  statusUpdatedAt: string;
  activeUsers: number;
  documentsModified: number;
  communicationsCount: number;
  riskLevel: number;
  estimatedCompletion: string;
}

interface RealTimeMonitorProps {
  taskId: string;
}

export function RealTimeMonitor({ taskId }: RealTimeMonitorProps) {
  const [isConnected, setIsConnected] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [events, setEvents] = useState<RealTimeEvent[]>([]);
  const [metrics, setMetrics] = useState<RealTimeMetrics>({
    progress: 75,
    statusUpdatedAt: new Date().toISOString(),
    activeUsers: 3,
    documentsModified: 2,
    communicationsCount: 8,
    riskLevel: 25,
    estimatedCompletion: "2025-02-15"
  });
  const [autoScroll, setAutoScroll] = useState(true);
  const eventsEndRef = useRef<HTMLDivElement>(null);

  // Симуляция реального времени
  useEffect(() => {
    if (!isConnected || isPaused) return;

    const interval = setInterval(() => {
      // Генерация случайных событий
      const eventTypes = ["status", "document", "communication", "progress", "assignment", "alert"];
      const actors = ["Иванов А.С.", "Петров И.К.", "Сидорова М.А.", "External Contractor", "System"];
      const randomType = eventTypes[Math.floor(Math.random() * eventTypes.length)] as any;
      const randomActor = actors[Math.floor(Math.random() * actors.length)];

      const newEvent: RealTimeEvent = {
        id: `evt-${Date.now()}`,
        timestamp: new Date().toISOString(),
        type: randomType,
        title: generateEventTitle(randomType),
        description: generateEventDescription(randomType),
        actor: randomActor,
        severity: Math.random() > 0.7 ? "high" : Math.random() > 0.4 ? "medium" : "low"
      };

      setEvents(prev => [newEvent, ...prev.slice(0, 49)]); // Последние 50 событий

      // Обновление метрик
      setMetrics(prev => ({
        ...prev,
        progress: Math.min(100, prev.progress + Math.random() * 2 - 1),
        activeUsers: Math.max(1, Math.floor(Math.random() * 5) + 1),
        documentsModified: prev.documentsModified + (Math.random() > 0.8 ? 1 : 0),
        communicationsCount: prev.communicationsCount + (Math.random() > 0.6 ? 1 : 0),
        riskLevel: Math.max(0, Math.min(100, prev.riskLevel + Math.random() * 10 - 5)),
        statusUpdatedAt: new Date().toISOString()
      }));
    }, 3000 + Math.random() * 4000); // 3-7 секунд

    return () => clearInterval(interval);
  }, [isConnected, isPaused]);

  // Автоскролл
  useEffect(() => {
    if (autoScroll && eventsEndRef.current) {
      eventsEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [events, autoScroll]);

  const generateEventTitle = (type: string): string => {
    const titles = {
      status: "Обновление статуса",
      document: "Изменение документа",
      communication: "Новое сообщение",
      progress: "Обновление прогресса",
      assignment: "Переназначение",
      alert: "Системное уведомление"
    };
    return titles[type as keyof typeof titles] || "Событие";
  };

  const generateEventDescription = (type: string): string => {
    const descriptions = {
      status: "Статус изменен на 'В процессе проверки'",
      document: "Файл 'КМД_план.dwg' обновлен",
      communication: "Получен ответ от внешнего исполнителя",
      progress: "Прогресс увеличен до 78%",
      assignment: "Задача переназначена на другого специалиста",
      alert: "Обнаружен потенциальный риск задержки"
    };
    return descriptions[type as keyof typeof descriptions] || "Описание события";
  };

  const getEventIcon = (type: string) => {
    const icons = {
      status: <CheckCircle className="w-4 h-4" />,
      document: <FileText className="w-4 h-4" />,
      communication: <MessageSquare className="w-4 h-4" />,
      progress: <TrendingUp className="w-4 h-4" />,
      assignment: <User className="w-4 h-4" />,
      alert: <AlertTriangle className="w-4 h-4" />
    };
    return icons[type as keyof typeof icons] || <Activity className="w-4 h-4" />;
  };

  const getEventColor = (type: string, severity: string) => {
    if (severity === "critical") return "text-destructive";
    if (severity === "high") return "text-warning";
    
    const colors = {
      status: "text-primary",
      document: "text-blue-500",
      communication: "text-green-500",
      progress: "text-success",
      assignment: "text-purple-500",
      alert: "text-orange-500"
    };
    return colors[type as keyof typeof colors] || "text-muted-foreground";
  };

  const getSeverityBadge = (severity: string) => {
    const variants = {
      critical: "destructive",
      high: "destructive",
      medium: "secondary",
      low: "secondary"
    } as const;
    return variants[severity as keyof typeof variants] || "secondary";
  };

  return (
    <div className="space-y-6">
      {/* Статус подключения и управление */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`flex items-center gap-2 ${isConnected ? 'text-success' : 'text-destructive'}`}>
                {isConnected ? <Wifi className="w-5 h-5" /> : <WifiOff className="w-5 h-5" />}
                <span className="font-medium">
                  {isConnected ? 'Подключено' : 'Отключено'}
                </span>
              </div>
              <Badge variant="outline" className="text-xs">
                Задача {taskId}
              </Badge>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Switch
                  checked={autoScroll}
                  onCheckedChange={setAutoScroll}
                  id="auto-scroll"
                />
                <Label htmlFor="auto-scroll" className="text-sm">Автоскролл</Label>
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsPaused(!isPaused)}
                disabled={!isConnected}
              >
                {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
                {isPaused ? 'Возобновить' : 'Пауза'}
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Метрики в реальном времени */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Прогресс</p>
                <p className="text-2xl font-bold">{metrics.progress.toFixed(1)}%</p>
              </div>
              <TrendingUp className="w-8 h-8 text-success" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Активных пользователей</p>
                <p className="text-2xl font-bold">{metrics.activeUsers}</p>
              </div>
              <User className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Риск задержки</p>
                <p className="text-2xl font-bold">{metrics.riskLevel.toFixed(0)}%</p>
              </div>
              <AlertTriangle className={`w-8 h-8 ${metrics.riskLevel > 70 ? 'text-destructive' : metrics.riskLevel > 40 ? 'text-warning' : 'text-success'}`} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Сообщений</p>
                <p className="text-2xl font-bold">{metrics.communicationsCount}</p>
              </div>
              <MessageSquare className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Лента событий в реальном времени */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Live-события
              </CardTitle>
              <CardDescription>
                События обновляются в реальном времени
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Circle className={`w-3 h-3 ${isConnected && !isPaused ? 'text-success animate-pulse' : 'text-muted-foreground'}`} />
              <span className="text-sm text-muted-foreground">
                {events.length} событий
              </span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-80">
            <div className="space-y-3">
              {events.map((event, index) => (
                <div
                  key={event.id}
                  className={`flex items-start gap-3 p-3 rounded-lg border ${
                    index === 0 ? 'bg-primary/5 border-primary/20' : 'bg-background'
                  }`}
                >
                  <div className={`mt-1 ${getEventColor(event.type, event.severity)}`}>
                    {getEventIcon(event.type)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium text-sm">{event.title}</p>
                      <Badge variant={getSeverityBadge(event.severity)} className="text-xs">
                        {event.severity}
                      </Badge>
                      {index === 0 && (
                        <Badge variant="outline" className="text-xs">
                          NEW
                        </Badge>
                      )}
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-2">
                      {event.description}
                    </p>
                    
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{event.actor}</span>
                      <span>•</span>
                      <span>{new Date(event.timestamp).toLocaleTimeString('ru-RU')}</span>
                    </div>
                  </div>
                </div>
              ))}
              <div ref={eventsEndRef} />
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Быстрая статистика */}
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Активность за последний час</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Изменения статуса:</span>
                <span className="font-medium">3</span>
              </div>
              <div className="flex justify-between">
                <span>Обновления документов:</span>
                <span className="font-medium">5</span>
              </div>
              <div className="flex justify-between">
                <span>Новые сообщения:</span>
                <span className="font-medium">12</span>
              </div>
              <div className="flex justify-between">
                <span>Системные уведомления:</span>
                <span className="font-medium">2</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Прогноз завершения</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">Текущий темп:</span>
                <Badge variant="outline" className="text-success">Норма</Badge>
              </div>
              <div className="text-sm text-muted-foreground">
                При текущем темпе работы задача будет завершена:
              </div>
              <div className="text-lg font-semibold">
                {new Date(metrics.estimatedCompletion).toLocaleDateString('ru-RU')}
              </div>
              <div className="text-xs text-muted-foreground">
                Обновлено: {new Date(metrics.statusUpdatedAt).toLocaleTimeString('ru-RU')}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}