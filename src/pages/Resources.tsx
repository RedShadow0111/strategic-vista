import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
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
  Award,
  Edit,
  History
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ResourceSearchFilter } from "@/components/resources/ResourceSearchFilter";
import { ResourceEditDialog } from "@/components/resources/ResourceEditDialog";
import { ResourceHistoryDialog } from "@/components/resources/ResourceHistoryDialog";
import { ResourceViewModeToggle } from "@/components/resources/ResourceViewModeToggle";

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
  const [filteredMembers, setFilteredMembers] = useState(teamMembers);
  const [selectedResource, setSelectedResource] = useState<any>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [historyDialogOpen, setHistoryDialogOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"normal" | "compact">("normal");
  const [compactColumns, setCompactColumns] = useState(["name", "role", "department", "utilization"]);

  const handleSearch = (query: string) => {
    if (!query.trim()) {
      setFilteredMembers(teamMembers);
      return;
    }
    
    const filtered = teamMembers.filter(member =>
      member.name.toLowerCase().includes(query.toLowerCase()) ||
      member.role.toLowerCase().includes(query.toLowerCase()) ||
      member.department.toLowerCase().includes(query.toLowerCase()) ||
      member.skills.some(skill => skill.toLowerCase().includes(query.toLowerCase())) ||
      member.projects.some(project => project.toLowerCase().includes(query.toLowerCase()))
    );
    setFilteredMembers(filtered);
  };

  const handleFilter = (filters: any) => {
    let filtered = [...teamMembers];
    
    if (filters.department && filters.department !== "all") {
      filtered = filtered.filter(member => member.department === filters.department);
    }
    
    if (filters.level && filters.level !== "all") {
      filtered = filtered.filter(member => member.level === filters.level);
    }
    
    if (filters.utilization && filters.utilization !== "all") {
      filtered = filtered.filter(member => {
        switch (filters.utilization) {
          case "low":
            return member.utilization < 70;
          case "medium":
            return member.utilization >= 70 && member.utilization <= 85;
          case "high":
            return member.utilization > 85;
          default:
            return true;
        }
      });
    }
    
    setFilteredMembers(filtered);
  };

  const handleEditResource = (resource: any) => {
    setSelectedResource(resource);
    setEditDialogOpen(true);
  };

  const handleViewHistory = (resource: any) => {
    setSelectedResource(resource);
    setHistoryDialogOpen(true);
  };

  const handleHireNewResources = () => {
    // Implementation for hiring new resources
    alert("Opening resource hiring workflow...");
  };

  const handleSkillDevelopmentPlan = () => {
    // Implementation for skill development planning
    alert("Opening skill development planning...");
  };

  const handleCapacityPlanning = () => {
    // Implementation for capacity planning
    alert("Opening capacity planning tools...");
  };

  const handleResourceOptimization = () => {
    // Implementation for resource optimization
    alert("Opening resource optimization analysis...");
  };

  const renderCompactView = () => {
    const getColumnValue = (member: any, columnId: string) => {
      switch (columnId) {
        case "name":
          return member.name;
        case "role":
          return member.role;
        case "department":
          return <Badge variant="outline">{member.department}</Badge>;
        case "level":
          return <Badge variant="secondary">{member.level}</Badge>;
        case "utilization":
          return `${member.utilization}%`;
        case "capacity":
          return `${member.capacity}h`;
        case "cost":
          return member.cost;
        case "skills":
          return member.skills.slice(0, 2).map((skill: string, index: number) => (
            <Badge key={index} variant="outline" className="text-xs mr-1">
              {skill}
            </Badge>
          ));
        case "projects":
          return member.projects.slice(0, 1).map((project: string, index: number) => (
            <div key={index} className="text-xs">{project}</div>
          ));
        default:
          return "";
      }
    };

    const getColumnHeader = (columnId: string) => {
      const column = availableColumns.find(col => col.id === columnId);
      return column ? column.label : columnId;
    };

    const availableColumns = [
      { id: "name", label: "Name" },
      { id: "role", label: "Role" },
      { id: "department", label: "Department" },
      { id: "level", label: "Level" },
      { id: "utilization", label: "Utilization" },
      { id: "capacity", label: "Capacity" },
      { id: "cost", label: "Cost" },
      { id: "skills", label: "Skills" },
      { id: "projects", label: "Projects" }
    ];

    return (
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                {compactColumns.map(columnId => (
                  <TableHead key={columnId}>{getColumnHeader(columnId)}</TableHead>
                ))}
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMembers.map((member) => (
                <TableRow key={member.id}>
                  {compactColumns.map(columnId => (
                    <TableCell key={columnId}>
                      {getColumnValue(member, columnId)}
                    </TableCell>
                  ))}
                  <TableCell>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditResource(member)}
                      >
                        <Edit className="w-3 h-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewHistory(member)}
                      >
                        <History className="w-3 h-3" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    );
  };

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
          <ResourceSearchFilter onSearch={handleSearch} onFilter={handleFilter} />
          <ResourceViewModeToggle
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            compactColumns={compactColumns}
            onCompactColumnsChange={setCompactColumns}
          />
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
          {viewMode === "normal" ? (
            <div className="space-y-4">
              {filteredMembers.map((member) => (
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
                      <div className="flex gap-2 mt-2">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-7 text-xs"
                          onClick={() => handleEditResource(member)}
                        >
                          <Edit className="w-3 h-3 mr-1" />
                          Edit
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-7 text-xs"
                          onClick={() => handleViewHistory(member)}
                        >
                          <History className="w-3 h-3 mr-1" />
                          History
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              ))}
            </div>
          ) : (
            renderCompactView()
          )}
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

          {/* Original Resource Planning Content */}
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
                  <h4 className="font-sf font-medium text-foreground">Additional Actions</h4>
                  <div className="grid grid-cols-1 gap-3">
                    <Button 
                      variant="outline" 
                      className="w-full justify-start" 
                      onClick={handleHireNewResources}
                    >
                      <UserPlus className="w-4 h-4 mr-2" />
                      Hire new resources
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full justify-start" 
                      onClick={handleSkillDevelopmentPlan}
                    >
                      <Award className="w-4 h-4 mr-2" />
                      Skill development plan
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full justify-start" 
                      onClick={handleCapacityPlanning}
                    >
                      <Briefcase className="w-4 h-4 mr-2" />
                      Capacity planning
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full justify-start" 
                      onClick={handleResourceOptimization}
                    >
                      <TrendingUp className="w-4 h-4 mr-2" />
                      Resource optimization
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Dialogs */}
      <ResourceEditDialog
        resource={selectedResource}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
      />
      
      <ResourceHistoryDialog
        resource={selectedResource}
        open={historyDialogOpen}
        onOpenChange={setHistoryDialogOpen}
      />
    </div>
  );
}