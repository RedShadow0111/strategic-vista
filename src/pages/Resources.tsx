import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  Users, 
  Calendar, 
  Clock, 
  TrendingUp,
  Star,
  Plus,
  Search,
  Filter,
  UserPlus,
  Target,
  Briefcase,
  Award
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const teamMembers = [
  {
    id: 1,
    name: "Sarah Chen",
    role: "Senior Project Manager",
    department: "PMO",
    utilization: 85,
    capacity: 40,
    allocated: 34,
    skills: ["Agile", "Scrum", "Risk Management", "Leadership"],
    projects: ["Digital Transformation", "Portal Redesign"],
    avatar: "SC",
    level: "Senior",
    cost: "$120/hr"
  },
  {
    id: 2,
    name: "Mike Johnson",
    role: "Tech Lead",
    department: "Engineering",
    utilization: 92,
    capacity: 40,
    allocated: 37,
    skills: ["React", "Node.js", "AWS", "Architecture"],
    projects: ["Digital Transformation", "Infrastructure"],
    avatar: "MJ",
    level: "Lead",
    cost: "$110/hr"
  },
  {
    id: 3,
    name: "Emma Davis",
    role: "UX Designer",
    department: "Design",
    utilization: 75,
    capacity: 40,
    allocated: 30,
    skills: ["Figma", "User Research", "Prototyping", "Design Systems"],
    projects: ["Portal Redesign"],
    avatar: "ED",
    level: "Mid",
    cost: "$85/hr"
  },
  {
    id: 4,
    name: "Alex Rodriguez",
    role: "Project Manager",
    department: "PMO",
    utilization: 68,
    capacity: 40,
    allocated: 27,
    skills: ["PMP", "MS Project", "Stakeholder Management"],
    projects: ["Portal Redesign"],
    avatar: "AR",
    level: "Mid",
    cost: "$95/hr"
  },
  {
    id: 5,
    name: "Lisa Wang",
    role: "Frontend Developer",
    department: "Engineering",
    utilization: 88,
    capacity: 40,
    allocated: 35,
    skills: ["Vue.js", "TypeScript", "CSS", "Testing"],
    projects: ["Portal Redesign", "Mobile App"],
    avatar: "LW",
    level: "Senior",
    cost: "$100/hr"
  }
];

const skillMatrix = [
  { skill: "Project Management", demand: 85, supply: 75, gap: -10 },
  { skill: "React/Frontend", demand: 95, supply: 88, gap: -7 },
  { skill: "Backend Development", demand: 78, supply: 82, gap: 4 },
  { skill: "UX/UI Design", demand: 65, supply: 60, gap: -5 },
  { skill: "DevOps", demand: 70, supply: 55, gap: -15 },
  { skill: "Data Analysis", demand: 45, supply: 35, gap: -10 }
];

const getUtilizationColor = (utilization: number) => {
  if (utilization >= 90) return "text-destructive";
  if (utilization >= 80) return "text-warning";
  return "text-success";
};

const getGapColor = (gap: number) => {
  if (gap < -10) return "text-destructive";
  if (gap < 0) return "text-warning";
  return "text-success";
};

export default function Resources() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-sf font-bold text-foreground">Resource Management</h1>
          <p className="text-muted-foreground mt-1">
            Team capacity, skills matrix, and resource optimization
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm">
            <Search className="w-4 h-4 mr-2" />
            Search
          </Button>
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          <Button size="sm">
            <UserPlus className="w-4 h-4 mr-2" />
            Add Resource
          </Button>
        </div>
      </div>

      {/* Resource Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Resources</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">156</div>
            <div className="flex items-center text-xs text-success mt-1">
              <TrendingUp className="w-3 h-3 mr-1" />
              +8 this month
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Average Utilization</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">87%</div>
            <div className="flex items-center text-xs text-warning mt-1">
              <Clock className="w-3 h-3 mr-1" />
              Above target (85%)
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Available Capacity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">2,340h</div>
            <div className="flex items-center text-xs text-primary mt-1">
              <Calendar className="w-3 h-3 mr-1" />
              Next 30 days
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Skill Gaps</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">3</div>
            <div className="flex items-center text-xs text-destructive mt-1">
              <Target className="w-3 h-3 mr-1" />
              Critical areas
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Resource Tabs */}
      <Tabs defaultValue="team" className="w-full">
        <TabsList className="grid w-full grid-cols-4 max-w-lg">
          <TabsTrigger value="team">Team</TabsTrigger>
          <TabsTrigger value="capacity">Capacity</TabsTrigger>
          <TabsTrigger value="skills">Skills</TabsTrigger>
          <TabsTrigger value="planning">Planning</TabsTrigger>
        </TabsList>

        <TabsContent value="team" className="space-y-6 mt-6">
          {/* Team Members */}
          <div className="space-y-4">
            {teamMembers.map((member) => (
              <Card key={member.id} className="hover:shadow-apple-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <Avatar className="w-12 h-12">
                        <AvatarFallback className="text-sm font-medium">
                          {member.avatar}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-sf font-semibold text-foreground">{member.name}</h3>
                        <p className="text-sm text-muted-foreground">{member.role}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-xs">
                            {member.department}
                          </Badge>
                          <Badge variant="secondary" className="text-xs">
                            {member.level}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-foreground">{member.cost}</div>
                      <div className="text-xs text-muted-foreground">Hourly rate</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Utilization */}
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-muted-foreground">Utilization</span>
                        <span className={`font-medium ${getUtilizationColor(member.utilization)}`}>
                          {member.utilization}%
                        </span>
                      </div>
                      <Progress value={member.utilization} className="h-2" />
                      <div className="flex justify-between text-xs text-muted-foreground mt-1">
                        <span>{member.allocated}h allocated</span>
                        <span>{member.capacity}h capacity</span>
                      </div>
                    </div>

                    {/* Skills */}
                    <div>
                      <div className="text-sm text-muted-foreground mb-2">Key Skills</div>
                      <div className="flex flex-wrap gap-1">
                        {member.skills.map((skill, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Projects */}
                    <div>
                      <div className="text-sm text-muted-foreground mb-2">Current Projects</div>
                      <div className="space-y-1">
                        {member.projects.map((project, index) => (
                          <div key={index} className="text-xs text-foreground">
                            • {project}
                          </div>
                        ))}
                      </div>
                      <Button variant="ghost" size="sm" className="mt-2 h-7 text-xs">
                        View Details
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="capacity" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Capacity Planning
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-4">
                  <h4 className="font-sf font-medium text-foreground">This Week</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Available</span>
                      <span className="font-medium">1,240h</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Allocated</span>
                      <span className="font-medium">1,085h</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Utilization</span>
                      <span className="font-medium text-warning">87.5%</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-sf font-medium text-foreground">Next Week</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Available</span>
                      <span className="font-medium">1,240h</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Allocated</span>
                      <span className="font-medium">980h</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Utilization</span>
                      <span className="font-medium text-success">79%</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-sf font-medium text-foreground">Next Month</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Available</span>
                      <span className="font-medium">5,200h</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Allocated</span>
                      <span className="font-medium">3,900h</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Utilization</span>
                      <span className="font-medium text-success">75%</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="skills" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="w-5 h-5" />
                Skills Matrix & Gaps
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {skillMatrix.map((skill, index) => (
                  <div key={index} className="p-4 border border-border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-sf font-medium text-foreground">{skill.skill}</h4>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="text-muted-foreground">
                          Demand: {skill.demand}%
                        </span>
                        <span className="text-muted-foreground">
                          Supply: {skill.supply}%
                        </span>
                        <span className={`font-medium ${getGapColor(skill.gap)}`}>
                          Gap: {skill.gap > 0 ? '+' : ''}{skill.gap}%
                        </span>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-muted-foreground">Demand</span>
                          <span>{skill.demand}%</span>
                        </div>
                        <Progress value={skill.demand} className="h-2" />
                      </div>
                      
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-muted-foreground">Supply</span>
                          <span>{skill.supply}%</span>
                        </div>
                        <Progress value={skill.supply} className="h-2" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="planning" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="w-5 h-5" />
                Resource Planning
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-sf font-medium text-foreground">Upcoming Requirements</h4>
                  <div className="space-y-3">
                    <div className="p-3 border border-border rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-medium text-sm">React Developer</span>
                        <Badge variant="destructive" className="text-xs">Urgent</Badge>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Project: Portal Redesign • Start: Next week
                      </div>
                    </div>
                    
                    <div className="p-3 border border-border rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-medium text-sm">DevOps Engineer</span>
                        <Badge variant="outline" className="text-xs bg-warning text-warning-foreground">High</Badge>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Project: Infrastructure • Start: Q3 2024
                      </div>
                    </div>

                    <div className="p-3 border border-border rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-medium text-sm">UX Designer</span>
                        <Badge variant="secondary" className="text-xs">Medium</Badge>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Project: Mobile App • Start: Q4 2024
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-sf font-medium text-foreground">Resource Actions</h4>
                  <div className="space-y-3">
                    <Button variant="outline" className="w-full justify-start">
                      <UserPlus className="w-4 h-4 mr-2" />
                      Hire New Resources
                    </Button>
                    
                    <Button variant="outline" className="w-full justify-start">
                      <Star className="w-4 h-4 mr-2" />
                      Skill Development Plan
                    </Button>
                    
                    <Button variant="outline" className="w-full justify-start">
                      <Calendar className="w-4 h-4 mr-2" />
                      Capacity Planning
                    </Button>
                    
                    <Button variant="outline" className="w-full justify-start">
                      <Target className="w-4 h-4 mr-2" />
                      Resource Optimization
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}