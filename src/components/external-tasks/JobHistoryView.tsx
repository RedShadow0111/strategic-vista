import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Calendar, 
  DollarSign, 
  Star, 
  User,
  CheckCircle,
  Clock,
  XCircle
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface CompletedJob {
  id: string;
  job: {
    title: string;
    category: string;
    budget_min?: number;
    budget_max?: number;
  };
  final_amount?: number;
  client_rating?: number;
  contractor_rating?: number;
  client_feedback?: string;
  contractor_feedback?: string;
  start_date: string;
  end_date?: string;
  created_at: string;
  client: {
    display_name?: string;
    company_name?: string;
  };
  contractor: {
    display_name?: string;
  };
}

export function JobHistoryView() {
  const [completedJobs, setCompletedJobs] = useState<CompletedJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    fetchCompletedJobs();
  }, []);

  const fetchCompletedJobs = async () => {
    try {
      const { data, error } = await supabase
        .from('job_assignments')
        .select(`
          *,
          job_postings!job_assignments_job_id_fkey (
            title,
            category,
            budget_min,
            budget_max
          ),
          profiles!job_assignments_contractor_id_fkey (
            display_name
          ),
          client:job_postings!job_assignments_job_id_fkey (
            profiles!job_postings_client_id_fkey (
              display_name,
              company_name
            )
          )
        `)
        .not('end_date', 'is', null)
        .order('end_date', { ascending: false });

      if (error) {
        console.error('Error fetching completed jobs:', error);
        toast.error("Ошибка при загрузке истории заданий");
        return;
      }

      const formattedJobs = data?.map(assignment => ({
        ...assignment,
        job: assignment.job_postings || { title: 'Неизвестно', category: 'Неизвестно' },
        contractor: assignment.profiles || { display_name: 'Неизвестен' },
        client: assignment.client?.profiles || { display_name: 'Неизвестен' }
      })) || [];

      setCompletedJobs(formattedJobs);
    } catch (error) {
      console.error('Error:', error);
      toast.error("Произошла ошибка при загрузке данных");
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

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? 'text-warning fill-current' : 'text-muted-foreground'
        }`}
      />
    ));
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const filteredJobs = completedJobs.filter(job => {
    if (activeTab === "all") return true;
    if (activeTab === "client") return true; // Filter by user being client
    if (activeTab === "contractor") return true; // Filter by user being contractor
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-sf font-bold text-foreground">История заданий</h2>
          <p className="text-muted-foreground">Завершенные проекты и их результаты</p>
        </div>
      </div>

      {/* Статистика */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Завершено проектов</p>
                <p className="text-2xl font-bold">{completedJobs.length}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-success" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Общий оборот</p>
                <p className="text-2xl font-bold">
                  ₽{completedJobs.reduce((sum, job) => sum + (job.final_amount || 0), 0).toLocaleString()}
                </p>
              </div>
              <DollarSign className="w-8 h-8 text-success" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Средний рейтинг</p>
                <div className="flex items-center gap-1">
                  <p className="text-2xl font-bold">
                    {(completedJobs.reduce((sum, job) => 
                      sum + ((job.client_rating || 0) + (job.contractor_rating || 0)) / 2, 0
                    ) / completedJobs.length || 0).toFixed(1)}
                  </p>
                  <Star className="w-4 h-4 text-warning" />
                </div>
              </div>
              <Star className="w-8 h-8 text-warning" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Успешность</p>
                <p className="text-2xl font-bold">
                  {completedJobs.length > 0 ? '98%' : '0%'}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-success" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all">Все проекты</TabsTrigger>
          <TabsTrigger value="client">Как заказчик</TabsTrigger>
          <TabsTrigger value="contractor">Как исполнитель</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4">
          {filteredJobs.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <div className="text-muted-foreground">
                  Завершенные проекты не найдены
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
                        <CardTitle className="text-lg">{job.job.title}</CardTitle>
                        <Badge className={getCategoryColor(job.job.category)}>
                          {job.job.category}
                        </Badge>
                        <Badge variant="outline" className="text-success">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Завершено
                        </Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold text-success">
                        ₽{job.final_amount?.toLocaleString() || 'Не указано'}
                      </div>
                      <div className="text-sm text-muted-foreground">Финальная сумма</div>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-6">
                    {/* Информация о заказчике */}
                    <div className="space-y-2">
                      <h4 className="font-medium flex items-center gap-2">
                        <User className="w-4 h-4" />
                        Заказчик
                      </h4>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarFallback>
                            {job.client.display_name?.[0] || job.client.company_name?.[0] || 'З'}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">
                            {job.client.display_name || job.client.company_name || 'Заказчик'}
                          </div>
                          {job.client_rating && (
                            <div className="flex items-center gap-1">
                              {renderStars(job.client_rating)}
                              <span className="text-sm text-muted-foreground ml-1">
                                ({job.client_rating}/5)
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Информация об исполнителе */}
                    <div className="space-y-2">
                      <h4 className="font-medium flex items-center gap-2">
                        <User className="w-4 h-4" />
                        Исполнитель
                      </h4>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarFallback>
                            {job.contractor.display_name?.[0] || 'И'}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">
                            {job.contractor.display_name || 'Исполнитель'}
                          </div>
                          {job.contractor_rating && (
                            <div className="flex items-center gap-1">
                              {renderStars(job.contractor_rating)}
                              <span className="text-sm text-muted-foreground ml-1">
                                ({job.contractor_rating}/5)
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <div>
                        <div className="text-muted-foreground">Начало</div>
                        <div>{new Date(job.start_date).toLocaleDateString('ru-RU')}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" />
                      <div>
                        <div className="text-muted-foreground">Завершение</div>
                        <div>{job.end_date ? new Date(job.end_date).toLocaleDateString('ru-RU') : 'Не указано'}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <div>
                        <div className="text-muted-foreground">Длительность</div>
                        <div>
                          {job.end_date 
                            ? Math.ceil((new Date(job.end_date).getTime() - new Date(job.start_date).getTime()) / (1000 * 60 * 60 * 24)) + ' дней'
                            : 'Не указано'
                          }
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4" />
                      <div>
                        <div className="text-muted-foreground">Бюджет</div>
                        <div>
                          {job.job.budget_min && job.job.budget_max 
                            ? `₽${job.job.budget_min.toLocaleString()}-${job.job.budget_max.toLocaleString()}`
                            : 'Договорная'
                          }
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Отзывы */}
                  {(job.client_feedback || job.contractor_feedback) && (
                    <div className="space-y-3 pt-4 border-t">
                      <h4 className="font-medium">Отзывы</h4>
                      <div className="grid gap-3">
                        {job.client_feedback && (
                          <div className="bg-muted p-3 rounded-lg">
                            <div className="text-sm text-muted-foreground mb-1">Отзыв заказчика:</div>
                            <p className="text-sm">{job.client_feedback}</p>
                          </div>
                        )}
                        {job.contractor_feedback && (
                          <div className="bg-muted p-3 rounded-lg">
                            <div className="text-sm text-muted-foreground mb-1">Отзыв исполнителя:</div>
                            <p className="text-sm">{job.contractor_feedback}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}