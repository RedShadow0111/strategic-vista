import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { 
  Users, 
  Mail, 
  Phone, 
  Calendar,
  Star,
  Plus,
  MessageCircle,
  MoreVertical,
  TrendingUp,
  Clock
} from "lucide-react";

interface ProjectTeamProps {
  project: any;
}

export function ProjectTeam({ project }: ProjectTeamProps) {
  const teamMembers = [
    {
      id: 1,
      name: "Sarah Chen", 
      role: "Project Manager",
      email: "sarah.chen@company.com",
      phone: "+1 (555) 123-4567",
      avatar: "/avatars/sarah.jpg",
      initials: "SC",
      workload: 85,
      skills: ["Project Management", "Agile", "Risk Management"],
      joinDate: "2024-02-15",
      tasksCompleted: 23,
      tasksActive: 4,
      performance: 95,
      availability: "Full-time"
    },
    {
      id: 2,
      name: "Mike Johnson",
      role: "Technical Lead", 
      email: "mike.johnson@company.com",
      phone: "+1 (555) 234-5678",
      avatar: "/avatars/mike.jpg", 
      initials: "MJ",
      workload: 90,
      skills: ["System Architecture", "React", "Node.js", "AWS"],
      joinDate: "2024-02-20",
      tasksCompleted: 18,
      tasksActive: 6,
      performance: 92,
      availability: "Full-time"
    },
    {
      id: 3,
      name: "Emma Davis",
      role: "UX/UI Designer",
      email: "emma.davis@company.com", 
      phone: "+1 (555) 345-6789",
      avatar: "/avatars/emma.jpg",
      initials: "ED",
      workload: 70,
      skills: ["UI Design", "UX Research", "Figma", "Prototyping"],
      joinDate: "2024-03-01",
      tasksCompleted: 15,
      tasksActive: 3,
      performance: 88,
      availability: "Full-time"
    },
    {
      id: 4,
      name: "Alex Rodriguez",
      role: "Backend Developer",
      email: "alex.rodriguez@company.com",
      phone: "+1 (555) 456-7890",
      avatar: "/avatars/alex.jpg",
      initials: "AR", 
      workload: 75,
      skills: ["Python", "Django", "PostgreSQL", "Docker"],
      joinDate: "2024-03-10",
      tasksCompleted: 12,
      tasksActive: 5,
      performance: 90,
      availability: "Full-time"
    },
    {
      id: 5,
      name: "Lisa Wang",
      role: "Frontend Developer",
      email: "lisa.wang@company.com",
      phone: "+1 (555) 567-8901", 
      avatar: "/avatars/lisa.jpg",
      initials: "LW",
      workload: 80,
      skills: ["React", "TypeScript", "CSS", "Testing"],
      joinDate: "2024-03-15",
      tasksCompleted: 14,
      tasksActive: 4,
      performance: 89,
      availability: "Full-time"
    },
    {
      id: 6,
      name: "David Kim",
      role: "QA Engineer",
      email: "david.kim@company.com",
      phone: "+1 (555) 678-9012",
      avatar: "/avatars/david.jpg",
      initials: "DK",
      workload: 60,
      skills: ["Manual Testing", "Automation", "Selenium", "API Testing"],
      joinDate: "2024-04-01", 
      tasksCompleted: 8,
      tasksActive: 2,
      performance: 86,
      availability: "Part-time"
    }
  ];

  const getWorkloadColor = (workload: number) => {
    if (workload >= 90) return "text-destructive";
    if (workload >= 80) return "text-warning"; 
    if (workload >= 60) return "text-success";
    return "text-muted-foreground";
  };

  const getPerformanceColor = (performance: number) => {
    if (performance >= 90) return "bg-success";
    if (performance >= 80) return "bg-warning";
    return "bg-muted";
  };

  return (
    <div className="space-y-6 h-full">
      {/* Team Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-primary" />
              <span className="text-sm text-muted-foreground">Участников</span>
            </div>
            <div className="text-2xl font-bold text-foreground mt-1">{teamMembers.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-success" />
              <span className="text-sm text-muted-foreground">Ср. производительность</span>
            </div>
            <div className="text-2xl font-bold text-success mt-1">
              {Math.round(teamMembers.reduce((acc, member) => acc + member.performance, 0) / teamMembers.length)}%
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-warning" />
              <span className="text-sm text-muted-foreground">Ср. загрузка</span>
            </div>
            <div className="text-2xl font-bold text-warning mt-1">
              {Math.round(teamMembers.reduce((acc, member) => acc + member.workload, 0) / teamMembers.length)}%
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-primary" />
              <span className="text-sm text-muted-foreground">Задач выполнено</span>
            </div>
            <div className="text-2xl font-bold text-foreground mt-1">
              {teamMembers.reduce((acc, member) => acc + member.tasksCompleted, 0)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Team Members Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {teamMembers.map((member) => (
          <Card key={member.id} className="hover:shadow-lg transition-shadow cursor-pointer group">
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={member.avatar} alt={member.name} />
                    <AvatarFallback className="bg-primary text-primary-foreground font-medium">
                      {member.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                      {member.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">{member.role}</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Contact Info */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground truncate">{member.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">{member.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">
                    С {new Date(member.joinDate).toLocaleDateString('ru-RU')}
                  </span>
                </div>
              </div>

              {/* Workload */}
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Загрузка</span>
                  <span className={`font-medium ${getWorkloadColor(member.workload)}`}>
                    {member.workload}%
                  </span>
                </div>
                <Progress value={member.workload} className="h-2" />
              </div>

              {/* Performance */}
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Производительность</span>
                  <span className="font-medium text-foreground">{member.performance}%</span>
                </div>
                <Progress 
                  value={member.performance} 
                  className={`h-2 ${getPerformanceColor(member.performance)}`}
                />
              </div>

              {/* Tasks */}
              <div className="flex justify-between text-sm">
                <div className="text-center">
                  <div className="font-medium text-success">{member.tasksCompleted}</div>
                  <div className="text-xs text-muted-foreground">Выполнено</div>
                </div>
                <div className="text-center">
                  <div className="font-medium text-primary">{member.tasksActive}</div>
                  <div className="text-xs text-muted-foreground">В работе</div>
                </div>
                <div className="text-center">
                  <div className="font-medium text-foreground">{member.availability}</div>
                  <div className="text-xs text-muted-foreground">Доступность</div>
                </div>
              </div>

              {/* Skills */}
              <div>
                <div className="text-sm text-muted-foreground mb-2">Навыки</div>
                <div className="flex flex-wrap gap-1">
                  {member.skills.slice(0, 3).map((skill, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                  {member.skills.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{member.skills.length - 3}
                    </Badge>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-2">
                <Button variant="outline" size="sm" className="flex-1">
                  <MessageCircle className="w-4 h-4 mr-1" />
                  Написать
                </Button>
                <Button variant="ghost" size="sm" className="flex-1">
                  Профиль
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}

        {/* Add New Member Card */}
        <Card className="border-dashed border-2 hover:border-primary transition-colors cursor-pointer group">
          <CardContent className="flex flex-col items-center justify-center p-8 h-full">
            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4 group-hover:bg-primary/10 transition-colors">
              <Plus className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
            <h3 className="font-medium text-foreground mb-2">Добавить участника</h3>
            <p className="text-sm text-muted-foreground text-center">
              Пригласить нового участника в команду проекта
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}