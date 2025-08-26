import { useState, useEffect } from "react";
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
  Filter,
  History,
  Eye,
  User
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { CreateJobDialog } from "./CreateJobDialog";
import { JobDetailsDialog } from "./JobDetailsDialog";
import { JobHistoryView } from "./JobHistoryView";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

interface JobPosting {
  id: string;
  title: string;
  description: string;
  category: string;
  job_type: string;
  experience_level: string;
  budget_min?: number;
  budget_max?: number;
  hourly_rate?: number;
  deadline?: string;
  duration?: string;
  skills_required?: string[];
  status: string;
  created_at: string;
  client_id: string;
}

interface ContractorBid {
  id: string;
  job_id: string;
  contractor_id: string;
  bid_amount: number;
  timeline: string;
  proposal: string;
  status: string;
  created_at: string;
}


export function JobBoard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<JobPosting[]>([]);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("browse");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [filterType, setFilterType] = useState<string>("all");
  const [loading, setLoading] = useState(true);
  const [createJobOpen, setCreateJobOpen] = useState(false);
  const [jobDetailsOpen, setJobDetailsOpen] = useState(false);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const { data, error } = await supabase
        .from('job_postings')
        .select('*')
        .eq('status', 'open')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching jobs:', error);
        toast.error("Ошибка при загрузке заданий");
      } else {
        setJobs(data || []);
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error("Произошла ошибка при загрузке заданий");
    } finally {
      setLoading(false);
    }
  };

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
    if (filterType !== "all" && job.job_type !== filterType) return false;
    return true;
  });

  const formatBudget = (job: JobPosting) => {
    if (job.hourly_rate) return `₽${job.hourly_rate.toLocaleString()}/час`;
    if (job.budget_min && job.budget_max) return `₽${job.budget_min.toLocaleString()} - ₽${job.budget_max.toLocaleString()}`;
    if (job.budget_min) return `от ₽${job.budget_min.toLocaleString()}`;
    return "Договорная";
  };

  const handleJobCreated = () => {
    fetchJobs();
  };

  const handleJobDetails = (jobId: string) => {
    setSelectedJobId(jobId);
    setJobDetailsOpen(true);
  };

  const handleBidSubmit = () => {
    toast.success("Заявка отправлена! Ожидайте ответа от заказчика.");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-sf font-bold text-foreground">Job Board</h2>
          <p className="text-muted-foreground">Найдите проекты или предложите свои услуги</p>
        </div>
        <div className="flex gap-2">
          {!user ? (
            <Button variant="outline" onClick={() => navigate('/auth')}>
              <User className="w-4 h-4 mr-2" />
              Войти для размещения
            </Button>
          ) : (
            <>
              <Button variant="outline" onClick={() => setActiveTab("history")}>
                <History className="w-4 h-4 mr-2" />
                История
              </Button>
              <Button onClick={() => setCreateJobOpen(true)}>
                <Send className="w-4 h-4 mr-2" />
                Разместить задание
              </Button>
            </>
          )}
        </div>
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
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="browse">Просмотр заданий</TabsTrigger>
          <TabsTrigger value="my-bids">Мои заявки</TabsTrigger>
          <TabsTrigger value="my-jobs">Мои задания</TabsTrigger>
          <TabsTrigger value="history">История</TabsTrigger>
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
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredJobs.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-8">
                    <div className="text-muted-foreground">
                      Задания не найдены. Попробуйте изменить фильтры или создать новое задание.
                    </div>
                  </CardContent>
                </Card>
              ) : (
                filteredJobs.map((job) => (
                  <Card key={job.id} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <CardTitle className="text-lg">{job.title}</CardTitle>
                            {job.status === 'urgent' && <Badge variant="destructive">Срочно</Badge>}
                            <Badge variant="outline" className="text-success">
                              {job.status === 'open' ? 'Открыто' : job.status}
                            </Badge>
                          </div>
                          <CardDescription>{job.description}</CardDescription>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-success">
                            {formatBudget(job)}
                          </div>
                          <div className="text-sm text-muted-foreground">{job.job_type}</div>
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        {job.deadline && (
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            <span>{new Date(job.deadline).toLocaleDateString('ru-RU')}</span>
                          </div>
                        )}
                        {job.duration && (
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            <span>{job.duration}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4" />
                          <span>0 заявок</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(job.created_at).toLocaleDateString('ru-RU')}</span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Badge className={getCategoryColor(job.category)}>
                            {job.category}
                          </Badge>
                          <Badge variant="outline">
                            {job.experience_level}
                          </Badge>
                        </div>
                        {job.skills_required && job.skills_required.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {job.skills_required.map((skill, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t">
                        <div className="text-sm text-muted-foreground">
                          Опубликовано: {new Date(job.created_at).toLocaleDateString('ru-RU')}
                        </div>
                        <div className="flex items-center gap-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleJobDetails(job.id)}
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            Подробнее
                          </Button>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button size="sm">
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
                ))
              )}
            </div>
          )}
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
                Задания не найдены. Для работы с заданиями необходима аутентификация.
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <JobHistoryView />
        </TabsContent>
      </Tabs>

      <CreateJobDialog 
        open={createJobOpen}
        onOpenChange={setCreateJobOpen}
        onJobCreated={handleJobCreated}
      />

      <JobDetailsDialog
        jobId={selectedJobId}
        open={jobDetailsOpen}
        onOpenChange={setJobDetailsOpen}
      />
    </div>
  );
}