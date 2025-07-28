import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  MessageSquare, 
  Send, 
  Bot, 
  User, 
  Sparkles, 
  Clock,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  FileText,
  X,
  Minimize2
} from "lucide-react";

interface ChatMessage {
  id: string;
  type: "user" | "assistant";
  content: string;
  timestamp: string;
  suggestions?: string[];
  attachments?: Array<{
    name: string;
    type: string;
  }>;
}

interface AiAssistantChatProps {
  isOpen: boolean;
  onToggle: () => void;
  onMinimize: () => void;
}

const mockMessages: ChatMessage[] = [
  {
    id: "1",
    type: "assistant",
    content: "Привет! Я ваш AI-помощник по управлению проектами. Чем могу помочь?",
    timestamp: "2025-01-27T10:00:00Z",
    suggestions: [
      "Анализ рисков проекта",
      "Оптимизация ресурсов",
      "Прогноз завершения",
      "Рекомендации по задачам"
    ]
  }
];

const quickActions = [
  { 
    icon: TrendingUp, 
    label: "Анализ портфеля", 
    color: "text-primary",
    action: "Проанализируй текущее состояние портфеля проектов"
  },
  { 
    icon: AlertTriangle, 
    label: "Риски", 
    color: "text-destructive",
    action: "Покажи критические риски в активных проектах"
  },
  { 
    icon: CheckCircle, 
    label: "Задачи", 
    color: "text-success",
    action: "Какие задачи требуют моего внимания сегодня?"
  },
  { 
    icon: FileText, 
    label: "Отчёт", 
    color: "text-warning",
    action: "Создай краткий отчёт по проектам за неделю"
  }
];

export function AiAssistantChat({ isOpen, onToggle, onMinimize }: AiAssistantChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>(mockMessages);
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: "user",
      content,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setNewMessage("");
    setIsTyping(true);

    // Симуляция ответа AI
    setTimeout(() => {
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: "assistant",
        content: getAiResponse(content),
        timestamp: new Date().toISOString(),
        suggestions: getSuggestions(content)
      };

      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const getAiResponse = (userInput: string): string => {
    const input = userInput.toLowerCase();
    
    if (input.includes("риск") || input.includes("риски")) {
      return "Анализирую текущие риски в портфеле:\n\n🔴 **Критические риски:**\n• Проект 'Жилой комплекс А' - риск срыва сроков 85%\n• Нехватка конструкторов (загрузка 95%)\n\n🟡 **Средние риски:**\n• Задержка согласований в проекте 'Офисный центр'\n• Превышение бюджета на 12% в проекте 'Торговый комплекс'\n\n📊 Рекомендую: перераспределить ресурсы и привлечь внешних исполнителей.";
    }
    
    if (input.includes("портфель") || input.includes("проект")) {
      return "📈 **Состояние портфеля:**\n\n✅ **15 активных проектов**\n• 8 в срок (53%)\n• 4 с задержками (27%)\n• 3 завершаются досрочно (20%)\n\n💰 **Бюджет:** 73% использовано\n👥 **Ресурсы:** 87% загружены\n\n🎯 **Ключевые метрики:**\n• ROI: +23%\n• Качество: 4.7/5\n• Удовлетворенность клиентов: 92%";
    }
    
    if (input.includes("задач") || input.includes("дел")) {
      return "📋 **Задачи требующие внимания:**\n\n🔥 **Срочные (сегодня):**\n• Утверждение КМД для этажа 3\n• Ревью архитектурных решений\n• Встреча с заказчиком в 15:00\n\n⏰ **На этой неделе:**\n• Финальная проверка проекта А\n• Планирование ресурсов на февраль\n• Подготовка отчёта для руководства\n\n💡 Рекомендую начать с утверждения КМД - это блокирует 3 других задачи.";
    }
    
    if (input.includes("отчёт") || input.includes("отчет")) {
      return "📊 **Еженедельный отчёт (21-27 января):**\n\n✅ **Завершено:**\n• 23 задачи\n• 2 проекта перешли в следующую фазу\n• Подписан контракт на 2.5М₽\n\n📈 **Прогресс:**\n• Общий прогресс портфеля: +7%\n• Экономия времени: 12 часов\n• Экономия бюджета: 340К₽\n\n🎯 **На следующую неделю:**\n• 18 запланированных задач\n• 3 ключевые вехи проектов\n• Планерка с командой дизайнеров";
    }
    
    return "Спасибо за вопрос! Я анализирую ваш запрос и готовлю детальный ответ с учётом текущего состояния проектов и задач. Могу помочь с анализом рисков, планированием ресурсов, генерацией отчётов или оптимизацией процессов.";
  };

  const getSuggestions = (userInput: string): string[] => {
    const input = userInput.toLowerCase();
    
    if (input.includes("риск")) {
      return [
        "Как снизить риски проекта А?",
        "Планы митигации рисков",
        "Анализ загрузки команды"
      ];
    }
    
    if (input.includes("портфель")) {
      return [
        "Оптимизация бюджета",
        "Прогноз ROI на квартал", 
        "Сравнение с прошлым периодом"
      ];
    }
    
    return [
      "Создать план на завтра",
      "Анализ эффективности",
      "Рекомендации по улучшению"
    ];
  };

  if (!isOpen) return null;

  return (
    <Card className="fixed bottom-4 right-4 w-96 h-[600px] shadow-xl border-2 border-primary/20 z-50">
      <CardHeader className="p-4 bg-gradient-to-r from-primary to-primary-glow text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
              <Bot className="w-4 h-4" />
            </div>
            <div>
              <CardTitle className="text-lg">AI Помощник</CardTitle>
              <p className="text-sm opacity-90">Онлайн</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Button
              size="sm"
              variant="ghost"
              className="text-white hover:bg-white/20 h-8 w-8 p-0"
              onClick={onMinimize}
            >
              <Minimize2 className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="text-white hover:bg-white/20 h-8 w-8 p-0"
              onClick={onToggle}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0 flex flex-col h-[calc(600px-80px)]">
        {/* Быстрые действия */}
        <div className="p-4 border-b bg-accent/30">
          <div className="grid grid-cols-2 gap-2">
            {quickActions.map((action, index) => (
              <Button
                key={index}
                variant="ghost"
                size="sm"
                className="justify-start gap-2 text-xs h-8"
                onClick={() => handleSendMessage(action.action)}
              >
                <action.icon className={`w-3 h-3 ${action.color}`} />
                {action.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Сообщения */}
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${
                  message.type === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {message.type === "assistant" && (
                  <Avatar className="w-8 h-8 bg-primary">
                    <AvatarFallback>
                      <Bot className="w-4 h-4 text-white" />
                    </AvatarFallback>
                  </Avatar>
                )}
                
                <div
                  className={`max-w-[80%] ${
                    message.type === "user"
                      ? "bg-primary text-white"
                      : "bg-secondary"
                  } rounded-lg p-3`}
                >
                  <div className="text-sm whitespace-pre-line">
                    {message.content}
                  </div>
                  <div className="flex items-center gap-1 mt-2 opacity-70">
                    <Clock className="w-3 h-3" />
                    <span className="text-xs">
                      {new Date(message.timestamp).toLocaleTimeString('ru-RU', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                  
                  {message.suggestions && (
                    <div className="mt-3 space-y-1">
                      {message.suggestions.map((suggestion, index) => (
                        <Button
                          key={index}
                          variant="ghost"
                          size="sm"
                          className="w-full justify-start text-xs h-6 px-2"
                          onClick={() => handleSendMessage(suggestion)}
                        >
                          <Sparkles className="w-3 h-3 mr-1" />
                          {suggestion}
                        </Button>
                      ))}
                    </div>
                  )}
                </div>

                {message.type === "user" && (
                  <Avatar className="w-8 h-8 bg-secondary">
                    <AvatarFallback>
                      <User className="w-4 h-4" />
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
            
            {isTyping && (
              <div className="flex gap-3">
                <Avatar className="w-8 h-8 bg-primary">
                  <AvatarFallback>
                    <Bot className="w-4 h-4 text-white" />
                  </AvatarFallback>
                </Avatar>
                <div className="bg-secondary rounded-lg p-3">
                  <div className="flex items-center gap-1">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                    <span className="text-xs text-muted-foreground ml-2">Печатает...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {/* Ввод сообщения */}
        <div className="p-4 border-t">
          <div className="flex gap-2">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Напишите сообщение..."
              onKeyPress={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage(newMessage);
                }
              }}
              className="flex-1"
            />
            <Button
              size="sm"
              onClick={() => handleSendMessage(newMessage)}
              disabled={!newMessage.trim() || isTyping}
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}