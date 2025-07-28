import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Briefcase, 
  DollarSign, 
  Clock, 
  Users, 
  MapPin, 
  Calendar,
  Star,
  ThumbsUp,
  Send,
  Filter
} from "lucide-react";
import { toast } from "sonner";

interface JobPosting {
  id: string;
  title: string;
  description: string;
  company: string;
  location: string;
  budget: {
    min: number;
    max: number;
    currency: string;
  };
  deadline: string;
  requiredSkills: string[];
  experience: "Junior" | "Mid" | "Senior" | "Expert";
  type: "Fixed Price" | "Hourly" | "Long-term";
  category: "Architecture" | "Construction" | "MEP" | "Geology" | "Design";
  bids: number;
  rating: number;
  verified: boolean;
  urgent: boolean;
  postedAt: string;
}

interface ContractorBid {
  id: string;
  jobId: string;
  contractorName: string;
  price: number;
  timeline: string;
  proposal: string;
  rating: number;
  completedJobs: number;
  portfolio: string[];
  submittedAt: string;
}

const mockJobs: JobPosting[] = [
  {
    id: "JOB-001",
    title: "Разработка КМД для жилого комплекса",
    description: "Требуется разработать конструктивные решения для многоэтажного жилого дома. Предоставляются архитектурные планы и геологические данные.",
    company: "СтройИнвест ООО",
    location: "Москва",
    budget: { min: 120000, max: 180000, currency: "RUB" },
    deadline: "2025-03-15",
    requiredSkills: ["AutoCAD", "КМД", "СНиП", "Железобетон"],
    experience: "Senior",
    type: "Fixed Price",
    category: "Construction",
    bids: 12,
    rating: 4.8,
    verified: true,
    urgent: true,
    postedAt: "2025-01-27"
  },
  {
    id: "JOB-002", 
    title: "Проектирование системы вентиляции",
    description: "Проектирование системы ОВК для офисного центра площадью 5000 м². Энергоэффективные решения приветствуются.",
    company: "ТехноБилд",
    location: "Санкт-Петербург",
    budget: { min: 80000, max: 120000, currency: "RUB" },
    deadline: "2025-04-01",
    requiredSkills: ["ОВК", "Вентиляция", "AutoCAD", "Revit"],
    experience: "Mid",
    type: "Fixed Price",
    category: "MEP",
    bids: 8,
    rating: 4.6,
    verified: true,
    urgent: false,
    postedAt: "2025-01-26"
  }
];

const mockBids: ContractorBid[] = [
  {
    id: "BID-001",
    jobId: "JOB-001",
    contractorName: "ПроектСтрой",
    price: 150000,
    timeline: "45 дней",
    proposal: "Опыт работы с подобными проектами более 10 лет. Гарантируем качество и соблюдение сроков.",
    rating: 4.9,
    completedJobs: 127,
    portfolio: ["portfolio1.pdf", "portfolio2.pdf"],
    submittedAt: "2025-01-27T10:30:00Z"
  }
];

export function JobBoard() {
  const [jobs] = useState<JobPosting[]>(mockJobs);
  const [selectedJob, setSelectedJob] = useState<JobPosting | null>(null);
  const [activeTab, setActiveTab] = useState("browse");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [filterType, setFilterType] = useState<string>("all");

  const getCategoryColor = (category: string) => {
    const colors = {
      "Architecture": "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
      "Construction": "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
      "MEP": "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      "Geology": "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
      "Design": "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
    };
    return colors[category as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  const filteredJobs = jobs.filter(job => {
    if (filterCategory !== "all" && job.category !== filterCategory) return false;
    if (filterType !== "all" && job.type !== filterType) return false;
    return true;
  });

  const handleBidSubmit = () => {
    toast.success("Заявка отправлена! Ожидайте ответа от заказчика.");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-sf font-bold text-foreground">Биржа заданий</h2>
          <p className="text-muted-foreground">Найдите проекты или предложите свои услуги</p>
        </div>
        <Button>
          <Send className="w-4 h-4 mr-2" />
          Разместить задание
        </Button>
      </div>

      {/* Статистика */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Активных заданий</p>
                <p className="text-2xl font-bold">{jobs.length}</p>
              </div>
              <Briefcase className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Средний бюджет</p>
                <p className="text-2xl font-bold">₽125K</p>
              </div>
              <DollarSign className="w-8 h-8 text-success" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Исполнителей</p>
                <p className="text-2xl font-bold">1,247</p>
              </div>
              <Users className="w-8 h-8 text-warning" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Успешных сделок</p>
                <p className="text-2xl font-bold">3,421</p>
              </div>
              <ThumbsUp className="w-8 h-8 text-success" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="browse">Просмотр заданий</TabsTrigger>
          <TabsTrigger value="my-bids">Мои заявки</TabsTrigger>
          <TabsTrigger value="my-jobs">Мои задания</TabsTrigger>
        </TabsList>

        <TabsContent value="browse" className="space-y-4">
          {/* Фильтры */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  <span className="text-sm font-medium">Фильтры:</span>
                </div>
                <Select value={filterCategory} onValueChange={setFilterCategory}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Категория" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Все категории</SelectItem>
                    <SelectItem value="Architecture">Архитектура</SelectItem>
                    <SelectItem value="Construction">Конструкции</SelectItem>
                    <SelectItem value="MEP">ОВК</SelectItem>
                    <SelectItem value="Geology">Геология</SelectItem>
                    <SelectItem value="Design">Дизайн</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Тип" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Все типы</SelectItem>
                    <SelectItem value="Fixed Price">Фикс. цена</SelectItem>
                    <SelectItem value="Hourly">Почасовая</SelectItem>
                    <SelectItem value="Long-term">Долгосрочная</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Список заданий */}
          <div className="space-y-4">
            {filteredJobs.map((job) => (
              <Card key={job.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-lg">{job.title}</CardTitle>
                        {job.urgent && <Badge variant="destructive">Срочно</Badge>}
                        {job.verified && <Badge variant="outline" className="text-success">✓ Верифицирован</Badge>}
                      </div>
                      <CardDescription>{job.description}</CardDescription>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-success">
                        ₽{job.budget.min.toLocaleString()} - ₽{job.budget.max.toLocaleString()}
                      </div>
                      <div className="text-sm text-muted-foreground">{job.type}</div>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      <span>{job.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(job.deadline).toLocaleDateString('ru-RU')}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      <span>{job.bids} заявок</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4 text-warning" />
                      <span>{job.rating} рейтинг</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge className={getCategoryColor(job.category)}>
                        {job.category}
                      </Badge>
                      <Badge variant="outline">
                        {job.experience}
                      </Badge>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {job.requiredSkills.map((skill, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="text-sm text-muted-foreground">
                      Опубликовано: {new Date(job.postedAt).toLocaleDateString('ru-RU')}
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        Подробнее
                      </Button>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button size="sm" onClick={() => setSelectedJob(job)}>
                            Подать заявку
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Подача заявки</DialogTitle>
                            <DialogDescription>
                              Заявка на проект: {job.title}
                            </DialogDescription>
                          </DialogHeader>
                          
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor="bid-price">Ваша цена (₽)</Label>
                                <Input
                                  id="bid-price"
                                  type="number"
                                  placeholder="150000"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="bid-timeline">Срок выполнения</Label>
                                <Input
                                  id="bid-timeline"
                                  placeholder="30 дней"
                                />
                              </div>
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="bid-proposal">Предложение</Label>
                              <Textarea
                                id="bid-proposal"
                                placeholder="Опишите ваш подход к выполнению проекта..."
                                rows={4}
                              />
                            </div>

                            <div className="flex justify-end gap-2">
                              <Button variant="outline">
                                Отмена
                              </Button>
                              <Button onClick={handleBidSubmit}>
                                Отправить заявку
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="my-bids" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Мои заявки</CardTitle>
              <CardDescription>История поданных заявок</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                Заявки не найдены
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="my-jobs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Мои задания</CardTitle>
              <CardDescription>Опубликованные вами проекты</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                Задания не найдены
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}