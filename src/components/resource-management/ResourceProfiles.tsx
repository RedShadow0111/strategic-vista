import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  User, 
  MapPin, 
  Calendar, 
  Star, 
  Award, 
  Briefcase, 
  Clock,
  Globe,
  Phone,
  Mail,
  Edit,
  Share,
  UserPlus,
  Search,
  Filter,
  CheckCircle,
  AlertCircle,
  Calendar as CalendarIcon,
  TrendingUp
} from "lucide-react";

interface ResourceProfile {
  id: string;
  name: string;
  role: string;
  department: string;
  location: string;
  employmentType: "full-time" | "part-time" | "contractor" | "intern";
  availability: number;
  utilization: number;
  skills: { skill: string; level: number; verified: boolean }[];
  projects: { name: string; role: string; duration: string; status: "active" | "completed" }[];
  performance: number;
  languages: string[];
  certifications: { name: string; issuer: string; date: string; status: "active" | "expired" }[];
  careerInterests: string[];
  avatar?: string;
  phone: string;
  email: string;
  startDate: string;
  status: "available" | "busy" | "vacation" | "ready";
}

const mockProfiles: ResourceProfile[] = [
  {
    id: "1",
    name: "Sarah Chen",
    role: "Senior Frontend Developer",
    department: "Engineering",
    location: "San Francisco, CA",
    employmentType: "full-time",
    availability: 85,
    utilization: 92,
    skills: [
      { skill: "React", level: 5, verified: true },
      { skill: "TypeScript", level: 4, verified: true },
      { skill: "Node.js", level: 3, verified: false },
      { skill: "GraphQL", level: 4, verified: true }
    ],
    projects: [
      { name: "Digital Transformation", role: "Tech Lead", duration: "6 months", status: "active" },
      { name: "Portal Redesign", role: "Developer", duration: "4 months", status: "completed" }
    ],
    performance: 4.8,
    languages: ["English", "Mandarin", "Spanish"],
    certifications: [
      { name: "React Professional", issuer: "Meta", date: "2023-06-15", status: "active" },
      { name: "AWS Solutions Architect", issuer: "Amazon", date: "2022-11-20", status: "active" }
    ],
    careerInterests: ["Technical Leadership", "System Architecture", "Mentoring"],
    phone: "+1 (555) 123-4567",
    email: "sarah.chen@company.com",
    startDate: "2021-03-15",
    status: "busy"
  },
  {
    id: "2",
    name: "Mike Johnson",
    role: "UX Designer",
    department: "Design",
    location: "Remote",
    employmentType: "full-time",
    availability: 95,
    utilization: 78,
    skills: [
      { skill: "Figma", level: 5, verified: true },
      { skill: "User Research", level: 4, verified: true },
      { skill: "Prototyping", level: 4, verified: false },
      { skill: "Design Systems", level: 3, verified: true }
    ],
    projects: [
      { name: "Mobile App Redesign", role: "Lead Designer", duration: "3 months", status: "active" }
    ],
    performance: 4.6,
    languages: ["English", "French"],
    certifications: [
      { name: "Google UX Design", issuer: "Google", date: "2023-01-10", status: "active" }
    ],
    careerInterests: ["Design Leadership", "Product Strategy", "AI/ML Interface Design"],
    phone: "+1 (555) 987-6543",
    email: "mike.johnson@company.com",
    startDate: "2022-01-10",
    status: "available"
  },
  {
    id: "3",
    name: "Emma Davis",
    role: "Project Manager",
    department: "PMO",
    location: "New York, NY",
    employmentType: "full-time",
    availability: 90,
    utilization: 88,
    skills: [
      { skill: "Agile", level: 5, verified: true },
      { skill: "Scrum", level: 5, verified: true },
      { skill: "Risk Management", level: 4, verified: true },
      { skill: "Stakeholder Management", level: 4, verified: false }
    ],
    projects: [
      { name: "Infrastructure Upgrade", role: "PM", duration: "8 months", status: "active" },
      { name: "Team Onboarding", role: "PM", duration: "2 months", status: "completed" }
    ],
    performance: 4.9,
    languages: ["English", "German"],
    certifications: [
      { name: "PMP", issuer: "PMI", date: "2022-08-15", status: "active" },
      { name: "Certified Scrum Master", issuer: "Scrum Alliance", date: "2023-03-20", status: "active" }
    ],
    careerInterests: ["Program Management", "Digital Transformation", "Team Leadership"],
    phone: "+1 (555) 246-8135",
    email: "emma.davis@company.com",
    startDate: "2020-09-01",
    status: "ready"
  }
];

export function ResourceProfiles() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProfile, setSelectedProfile] = useState<ResourceProfile>(mockProfiles[0]);
  const [filteredProfiles, setFilteredProfiles] = useState(mockProfiles);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setFilteredProfiles(mockProfiles);
      return;
    }
    
    const filtered = mockProfiles.filter(profile =>
      profile.name.toLowerCase().includes(query.toLowerCase()) ||
      profile.role.toLowerCase().includes(query.toLowerCase()) ||
      profile.department.toLowerCase().includes(query.toLowerCase()) ||
      profile.skills.some(skill => skill.skill.toLowerCase().includes(query.toLowerCase()))
    );
    setFilteredProfiles(filtered);
  };

  const getStatusColor = (status: ResourceProfile['status']) => {
    switch (status) {
      case "available":
        return "bg-success text-success-foreground";
      case "busy":
        return "bg-destructive text-destructive-foreground";
      case "vacation":
        return "bg-warning text-warning-foreground";
      case "ready":
        return "bg-primary text-primary-foreground";
    }
  };

  const getStatusLabel = (status: ResourceProfile['status']) => {
    switch (status) {
      case "available":
        return "Доступен";
      case "busy":
        return "Занят";
      case "vacation":
        return "В отпуске";
      case "ready":
        return "Готов к новой задаче";
    }
  };

  const renderSkillLevel = (level: number) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-3 h-3 ${
              star <= level ? "fill-warning text-warning" : "text-muted-foreground"
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-sf font-bold text-foreground">Профили ресурсов</h2>
          <p className="text-muted-foreground mt-1">
            360° view профилей ресурсов с полной информацией о навыках и карьере
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <Input 
              placeholder="Поиск ресурсов..." 
              className="pl-10 w-64"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Фильтры
          </Button>
          <Button size="sm">
            <UserPlus className="w-4 h-4 mr-2" />
            Добавить ресурс
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Resource List */}
        <div className="space-y-4">
          <h3 className="font-semibold text-foreground">Список ресурсов ({filteredProfiles.length})</h3>
          {filteredProfiles.map((profile) => (
            <Card 
              key={profile.id}
              className={`cursor-pointer transition-all ${
                selectedProfile?.id === profile.id ? "ring-2 ring-primary" : "hover:shadow-md"
              }`}
              onClick={() => setSelectedProfile(profile)}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={profile.avatar} />
                    <AvatarFallback>
                      {profile.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h4 className="font-semibold text-foreground">{profile.name}</h4>
                    <p className="text-sm text-muted-foreground">{profile.role}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge className={getStatusColor(profile.status)}>
                        {getStatusLabel(profile.status)}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {profile.utilization}% загрузка
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Detailed Profile View */}
        <div className="lg:col-span-2">
          {selectedProfile && (
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <Avatar className="w-16 h-16">
                      <AvatarImage src={selectedProfile.avatar} />
                      <AvatarFallback className="text-lg">
                        {selectedProfile.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h2 className="text-2xl font-bold text-foreground">{selectedProfile.name}</h2>
                      <p className="text-lg text-muted-foreground">{selectedProfile.role}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="outline">{selectedProfile.department}</Badge>
                        <Badge className={getStatusColor(selectedProfile.status)}>
                          {getStatusLabel(selectedProfile.status)}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      <Edit className="w-4 h-4 mr-2" />
                      Редактировать
                    </Button>
                    <Button variant="outline" size="sm">
                      <Share className="w-4 h-4 mr-2" />
                      Предложить на проект
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="overview" className="w-full">
                  <TabsList className="grid w-full grid-cols-5">
                    <TabsTrigger value="overview">Обзор</TabsTrigger>
                    <TabsTrigger value="skills">Навыки</TabsTrigger>
                    <TabsTrigger value="projects">Проекты</TabsTrigger>
                    <TabsTrigger value="performance">Производительность</TabsTrigger>
                    <TabsTrigger value="career">Карьера</TabsTrigger>
                  </TabsList>

                  <TabsContent value="overview" className="space-y-6">
                    {/* Basic Info */}
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-semibold text-foreground mb-2">Контактная информация</h4>
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm">
                              <Mail className="w-4 h-4 text-muted-foreground" />
                              <span>{selectedProfile.email}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <Phone className="w-4 h-4 text-muted-foreground" />
                              <span>{selectedProfile.phone}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <MapPin className="w-4 h-4 text-muted-foreground" />
                              <span>{selectedProfile.location}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <CalendarIcon className="w-4 h-4 text-muted-foreground" />
                              <span>С {new Date(selectedProfile.startDate).toLocaleDateString('ru-RU')}</span>
                            </div>
                          </div>
                        </div>

                        <div>
                          <h4 className="font-semibold text-foreground mb-2">Языки</h4>
                          <div className="flex gap-1">
                            {selectedProfile.languages.map((lang, index) => (
                              <Badge key={index} variant="outline">
                                <Globe className="w-3 h-3 mr-1" />
                                {lang}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <h4 className="font-semibold text-foreground mb-2">Загрузка и доступность</h4>
                          <div className="space-y-3">
                            <div>
                              <div className="flex justify-between text-sm mb-1">
                                <span>Текущая загрузка</span>
                                <span className="font-medium">{selectedProfile.utilization}%</span>
                              </div>
                              <Progress value={selectedProfile.utilization} className="h-2" />
                            </div>
                            <div>
                              <div className="flex justify-between text-sm mb-1">
                                <span>Доступность</span>
                                <span className="font-medium">{selectedProfile.availability}%</span>
                              </div>
                              <Progress value={selectedProfile.availability} className="h-2" />
                            </div>
                          </div>
                        </div>

                        <div>
                          <h4 className="font-semibold text-foreground mb-2">Оценка производительности</h4>
                          <div className="flex items-center gap-2">
                            <div className="flex items-center">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                  key={star}
                                  className={`w-4 h-4 ${
                                    star <= selectedProfile.performance ? "fill-warning text-warning" : "text-muted-foreground"
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-sm font-medium">{selectedProfile.performance}/5</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="skills" className="space-y-4">
                    <h4 className="font-semibold text-foreground">Ключевые навыки</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {selectedProfile.skills.map((skill, index) => (
                        <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <div>
                              <div className="font-medium text-foreground">{skill.skill}</div>
                              <div className="flex items-center gap-2">
                                {renderSkillLevel(skill.level)}
                                {skill.verified && (
                                  <CheckCircle className="w-4 h-4 text-success" />
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Уровень {skill.level}/5
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-6">
                      <h4 className="font-semibold text-foreground mb-4">Сертификации</h4>
                      <div className="space-y-3">
                        {selectedProfile.certifications.map((cert, index) => (
                          <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                            <div className="flex items-center gap-3">
                              <Award className="w-5 h-5 text-primary" />
                              <div>
                                <div className="font-medium text-foreground">{cert.name}</div>
                                <div className="text-sm text-muted-foreground">{cert.issuer}</div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-sm text-muted-foreground">
                                {new Date(cert.date).toLocaleDateString('ru-RU')}
                              </div>
                              <Badge variant={cert.status === "active" ? "default" : "destructive"}>
                                {cert.status === "active" ? "Активна" : "Истекла"}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="projects" className="space-y-4">
                    <h4 className="font-semibold text-foreground">История проектов</h4>
                    <div className="space-y-3">
                      {selectedProfile.projects.map((project, index) => (
                        <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <Briefcase className="w-5 h-5 text-primary" />
                            <div>
                              <div className="font-medium text-foreground">{project.name}</div>
                              <div className="text-sm text-muted-foreground">
                                {project.role} • {project.duration}
                              </div>
                            </div>
                          </div>
                          <Badge variant={project.status === "active" ? "default" : "secondary"}>
                            {project.status === "active" ? "Активный" : "Завершён"}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="performance" className="space-y-4">
                    <h4 className="font-semibold text-foreground">Метрики производительности</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <Card>
                        <CardContent className="p-4">
                          <div className="flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-success" />
                            <div>
                              <div className="text-sm text-muted-foreground">Общая оценка</div>
                              <div className="text-2xl font-bold text-foreground">{selectedProfile.performance}/5</div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-4">
                          <div className="flex items-center gap-2">
                            <Clock className="w-5 h-5 text-primary" />
                            <div>
                              <div className="text-sm text-muted-foreground">Время в компании</div>
                              <div className="text-2xl font-bold text-foreground">
                                {Math.floor((new Date().getTime() - new Date(selectedProfile.startDate).getTime()) / (1000 * 60 * 60 * 24 * 365))} лет
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>

                  <TabsContent value="career" className="space-y-4">
                    <h4 className="font-semibold text-foreground">Карьерные интересы</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedProfile.careerInterests.map((interest, index) => (
                        <Badge key={index} variant="outline" className="text-sm">
                          {interest}
                        </Badge>
                      ))}
                    </div>
                    
                    <div className="mt-6">
                      <h4 className="font-semibold text-foreground mb-4">Рекомендации по развитию</h4>
                      <div className="space-y-3">
                        <div className="p-4 border rounded-lg">
                          <div className="flex items-start gap-3">
                            <AlertCircle className="w-5 h-5 text-warning mt-1" />
                            <div>
                              <div className="font-medium text-foreground">Рекомендуется изучить</div>
                              <div className="text-sm text-muted-foreground">
                                Node.js (уровень 3/5) - для расширения full-stack компетенций
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="p-4 border rounded-lg">
                          <div className="flex items-start gap-3">
                            <CheckCircle className="w-5 h-5 text-success mt-1" />
                            <div>
                              <div className="font-medium text-foreground">Готов к повышению</div>
                              <div className="text-sm text-muted-foreground">
                                Подходит для роли Tech Lead на основе текущих компетенций
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}