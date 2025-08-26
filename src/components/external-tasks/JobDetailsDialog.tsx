import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  MapPin, 
  Calendar, 
  DollarSign, 
  Clock,
  Star,
  User,
  Briefcase,
  CheckCircle,
  FileText
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface JobDetailsDialogProps {
  jobId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface JobDetails {
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
  client: {
    display_name?: string;
    company_name?: string;
    rating?: number;
    completed_jobs?: number;
  };
}

interface Bid {
  id: string;
  bid_amount: number;
  timeline: string;
  proposal: string;
  status: string;
  created_at: string;
  contractor: {
    display_name?: string;
    rating?: number;
    completed_jobs?: number;
  };
}

export function JobDetailsDialog({ jobId, open, onOpenChange }: JobDetailsDialogProps) {
  const [job, setJob] = useState<JobDetails | null>(null);
  const [bids, setBids] = useState<Bid[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (jobId && open) {
      fetchJobDetails();
    }
  }, [jobId, open]);

  const fetchJobDetails = async () => {
    if (!jobId) return;
    
    setLoading(true);
    try {
      // Получаем детали задания
      const { data: jobData, error: jobError } = await supabase
        .from('job_postings')
        .select(`
          *,
          profiles!job_postings_client_id_fkey (
            display_name,
            company_name,
            rating,
            completed_jobs
          )
        `)
        .eq('id', jobId)
        .single();

      if (jobError) {
        console.error('Error fetching job:', jobError);
        toast.error("Ошибка при загрузке задания");
        return;
      }

      // Получаем заявки
      const { data: bidsData, error: bidsError } = await supabase
        .from('contractor_bids')
        .select(`
          *,
          profiles!contractor_bids_contractor_id_fkey (
            display_name,
            rating,
            completed_jobs
          )
        `)
        .eq('job_id', jobId);

      if (bidsError) {
        console.error('Error fetching bids:', bidsError);
      }

      if (jobData) {
        setJob({
          ...jobData,
          client: jobData.profiles || {}
        });
      }

      setBids(bidsData?.map(bid => ({
        ...bid,
        contractor: bid.profiles || {}
      })) || []);

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

  const formatBudget = (min?: number, max?: number, hourly?: number) => {
    if (hourly) return `₽${hourly.toLocaleString()}/час`;
    if (min && max) return `₽${min.toLocaleString()} - ₽${max.toLocaleString()}`;
    if (min) return `от ₽${min.toLocaleString()}`;
    return "Договорная";
  };

  if (!job && !loading) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            {loading ? "Загрузка..." : job?.title}
          </DialogTitle>
          <DialogDescription>
            {loading ? "Получение деталей задания..." : "Подробная информация о проекте"}
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : job ? (
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Обзор</TabsTrigger>
              <TabsTrigger value="bids">Заявки ({bids.length})</TabsTrigger>
              <TabsTrigger value="client">Заказчик</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Badge className={getCategoryColor(job.category)}>
                          {job.category}
                        </Badge>
                        <Badge variant="outline">
                          {job.experience_level}
                        </Badge>
                        <Badge variant={job.status === 'open' ? 'default' : 'secondary'}>
                          {job.status === 'open' ? 'Открыто' : job.status}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-success">
                        {formatBudget(job.budget_min, job.budget_max, job.hourly_rate)}
                      </div>
                      <div className="text-sm text-muted-foreground">{job.job_type}</div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="font-semibold mb-2">Описание проекта</h3>
                    <p className="text-muted-foreground whitespace-pre-wrap">{job.description}</p>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {job.deadline && (
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <div>
                          <div className="text-sm text-muted-foreground">Срок</div>
                          <div className="font-medium">
                            {new Date(job.deadline).toLocaleDateString('ru-RU')}
                          </div>
                        </div>
                      </div>
                    )}
                    {job.duration && (
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <div>
                          <div className="text-sm text-muted-foreground">Длительность</div>
                          <div className="font-medium">{job.duration}</div>
                        </div>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <Briefcase className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <div className="text-sm text-muted-foreground">Тип</div>
                        <div className="font-medium">{job.job_type}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <div className="text-sm text-muted-foreground">Опубликовано</div>
                        <div className="font-medium">
                          {new Date(job.created_at).toLocaleDateString('ru-RU')}
                        </div>
                      </div>
                    </div>
                  </div>

                  {job.skills_required && job.skills_required.length > 0 && (
                    <div>
                      <h3 className="font-semibold mb-2">Требуемые навыки</h3>
                      <div className="flex flex-wrap gap-2">
                        {job.skills_required.map((skill, index) => (
                          <Badge key={index} variant="secondary">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="bids" className="space-y-4">
              {bids.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-8">
                    <div className="text-muted-foreground">
                      Заявки на это задание пока не поступали
                    </div>
                  </CardContent>
                </Card>
              ) : (
                bids.map((bid) => (
                  <Card key={bid.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarFallback>
                              {bid.contractor.display_name?.[0] || 'К'}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-semibold">
                              {bid.contractor.display_name || 'Исполнитель'}
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Star className="w-4 h-4 text-warning" />
                              <span>{bid.contractor.rating?.toFixed(1) || 'Нет рейтинга'}</span>
                              <span>•</span>
                              <span>{bid.contractor.completed_jobs || 0} завершенных проектов</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xl font-bold text-success">
                            ₽{bid.bid_amount.toLocaleString()}
                          </div>
                          <div className="text-sm text-muted-foreground">{bid.timeline}</div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium mb-2">Предложение</h4>
                          <p className="text-muted-foreground">{bid.proposal}</p>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="text-sm text-muted-foreground">
                            Подано: {new Date(bid.created_at).toLocaleDateString('ru-RU')}
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              Написать сообщение
                            </Button>
                            <Button size="sm">
                              Принять заявку
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>

            <TabsContent value="client" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <Avatar className="w-12 h-12">
                      <AvatarFallback>
                        {job.client.display_name?.[0] || job.client.company_name?.[0] || 'З'}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="text-xl font-semibold">
                        {job.client.display_name || job.client.company_name || 'Заказчик'}
                      </div>
                      {job.client.company_name && job.client.display_name && (
                        <div className="text-muted-foreground">{job.client.company_name}</div>
                      )}
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <Star className="w-5 h-5 text-warning" />
                      <div>
                        <div className="text-sm text-muted-foreground">Рейтинг</div>
                        <div className="font-medium">
                          {job.client.rating?.toFixed(1) || 'Нет рейтинга'}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-success" />
                      <div>
                        <div className="text-sm text-muted-foreground">Завершенных проектов</div>
                        <div className="font-medium">{job.client.completed_jobs || 0}</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        ) : (
          <div className="text-center py-8">
            <div className="text-muted-foreground">Задание не найдено</div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}