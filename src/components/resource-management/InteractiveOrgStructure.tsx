import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { 
  ChevronDown, 
  ChevronRight, 
  Users, 
  UserCheck, 
  Clock,
  Target,
  TrendingUp,
  Plus,
  Settings
} from "lucide-react";

interface Resource {
  id: string;
  name: string;
  role: string;
  avatar: string;
  skills: string[];
  utilization: number;
  availability: "available" | "busy" | "away";
  currentProject?: string;
}

interface Department {
  id: string;
  name: string;
  manager: string;
  description: string;
  resources: Resource[];
  subdepartments?: Department[];
  isExpanded?: boolean;
  budget: number;
  utilizationTarget: number;
}

const mockOrgData: Department[] = [
  {
    id: "engineering",
    name: "Engineering",
    manager: "John Smith",
    description: "Software development and technical architecture",
    budget: 2500000,
    utilizationTarget: 85,
    isExpanded: true,
    resources: [
      {
        id: "1",
        name: "Alice Johnson",
        role: "Senior Developer",
        avatar: "AJ",
        skills: ["React", "TypeScript", "Node.js"],
        utilization: 92,
        availability: "busy",
        currentProject: "Mobile App Redesign"
      },
      {
        id: "2",
        name: "Bob Wilson",
        role: "DevOps Engineer",
        avatar: "BW",
        skills: ["AWS", "Docker", "Kubernetes"],
        utilization: 78,
        availability: "available"
      }
    ],
    subdepartments: [
      {
        id: "frontend",
        name: "Frontend Team",
        manager: "Sarah Davis",
        description: "UI/UX development",
        budget: 800000,
        utilizationTarget: 80,
        isExpanded: false,
        resources: [
          {
            id: "3",
            name: "Mike Chen",
            role: "Frontend Developer",
            avatar: "MC",
            skills: ["React", "CSS", "Design Systems"],
            utilization: 85,
            availability: "busy",
            currentProject: "Design System Upgrade"
          },
          {
            id: "4",
            name: "Emma Rodriguez",
            role: "UI/UX Designer",
            avatar: "ER",
            skills: ["Figma", "Prototyping", "User Research"],
            utilization: 70,
            availability: "available"
          }
        ]
      },
      {
        id: "backend",
        name: "Backend Team",
        manager: "David Kim",
        description: "API and infrastructure development",
        budget: 900000,
        utilizationTarget: 90,
        isExpanded: false,
        resources: [
          {
            id: "5",
            name: "Lisa Thompson",
            role: "Backend Developer",
            avatar: "LT",
            skills: ["Python", "PostgreSQL", "Redis"],
            utilization: 95,
            availability: "busy",
            currentProject: "API Optimization"
          }
        ]
      }
    ]
  },
  {
    id: "design",
    name: "Design",
    manager: "Patricia Lee",
    description: "Product design and user experience",
    budget: 1200000,
    utilizationTarget: 75,
    isExpanded: false,
    resources: [
      {
        id: "6",
        name: "Tom Anderson",
        role: "Product Designer",
        avatar: "TA",
        skills: ["Figma", "User Research", "Prototyping"],
        utilization: 68,
        availability: "available"
      },
      {
        id: "7",
        name: "Julia Martinez",
        role: "Visual Designer",
        avatar: "JM",
        skills: ["Illustrator", "Brand Design", "Motion Graphics"],
        utilization: 82,
        availability: "away"
      }
    ]
  },
  {
    id: "marketing",
    name: "Marketing",
    manager: "Robert Taylor",
    description: "Digital marketing and growth",
    budget: 800000,
    utilizationTarget: 70,
    isExpanded: false,
    resources: [
      {
        id: "8",
        name: "Anna Garcia",
        role: "Marketing Manager",
        avatar: "AG",
        skills: ["SEO", "Content Marketing", "Analytics"],
        utilization: 75,
        availability: "busy",
        currentProject: "Q4 Campaign"
      }
    ]
  }
];

const getAvailabilityColor = (availability: string) => {
  switch (availability) {
    case "available": return "bg-success text-success-foreground";
    case "busy": return "bg-warning text-warning-foreground";
    case "away": return "bg-muted text-muted-foreground";
    default: return "bg-secondary text-secondary-foreground";
  }
};

const getUtilizationColor = (utilization: number, target: number) => {
  if (utilization >= target) return "text-success";
  if (utilization >= target * 0.8) return "text-warning";
  return "text-destructive";
};

function ResourceCard({ resource }: { resource: Resource }) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <Avatar className="w-10 h-10">
              <AvatarFallback>{resource.avatar}</AvatarFallback>
            </Avatar>
            <div>
              <h4 className="font-medium text-sm">{resource.name}</h4>
              <p className="text-xs text-muted-foreground">{resource.role}</p>
            </div>
          </div>
          <Badge variant="outline" className={getAvailabilityColor(resource.availability)}>
            {resource.availability}
          </Badge>
        </div>

        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span>Utilization</span>
              <span className="font-medium">{resource.utilization}%</span>
            </div>
            <Progress value={resource.utilization} className="h-1.5" />
          </div>

          <div className="flex flex-wrap gap-1">
            {resource.skills.slice(0, 3).map((skill, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {skill}
              </Badge>
            ))}
            {resource.skills.length > 3 && (
              <Badge variant="secondary" className="text-xs">
                +{resource.skills.length - 3}
              </Badge>
            )}
          </div>

          {resource.currentProject && (
            <div className="p-2 bg-muted/50 rounded text-xs">
              <div className="font-medium mb-1">Current Project</div>
              <div className="text-muted-foreground">{resource.currentProject}</div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function DepartmentNode({ department, onToggle }: { department: Department; onToggle: (id: string) => void }) {
  const totalResources = department.resources.length + 
    (department.subdepartments?.reduce((acc, sub) => acc + sub.resources.length, 0) || 0);
  
  const avgUtilization = department.resources.length > 0 
    ? Math.round(department.resources.reduce((acc, r) => acc + r.utilization, 0) / department.resources.length)
    : 0;

  return (
    <div className="space-y-4">
      <Card className="border-2">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onToggle(department.id)}
                className="h-8 w-8 p-0"
              >
                {department.isExpanded ? (
                  <ChevronDown className="w-4 h-4" />
                ) : (
                  <ChevronRight className="w-4 h-4" />
                )}
              </Button>
              <div>
                <CardTitle className="text-lg">{department.name}</CardTitle>
                <p className="text-sm text-muted-foreground">{department.description}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-sm font-medium">Manager</div>
                <div className="text-xs text-muted-foreground">{department.manager}</div>
              </div>
              <Button variant="ghost" size="sm">
                <Settings className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          <div className="grid grid-cols-4 gap-4">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-muted-foreground" />
              <div>
                <div className="font-medium">{totalResources}</div>
                <div className="text-xs text-muted-foreground">Resources</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-muted-foreground" />
              <div>
                <div className={`font-medium ${getUtilizationColor(avgUtilization, department.utilizationTarget)}`}>
                  {avgUtilization}%
                </div>
                <div className="text-xs text-muted-foreground">Utilization</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <div>
                <div className="font-medium">{department.utilizationTarget}%</div>
                <div className="text-xs text-muted-foreground">Target</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-muted-foreground" />
              <div>
                <div className="font-medium">${(department.budget / 1000).toFixed(0)}K</div>
                <div className="text-xs text-muted-foreground">Budget</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {department.isExpanded && (
        <div className="ml-8 space-y-4">
          {department.resources.length > 0 && (
            <div>
              <h4 className="font-medium mb-3 text-sm text-muted-foreground">Direct Reports</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {department.resources.map((resource) => (
                  <ResourceCard key={resource.id} resource={resource} />
                ))}
              </div>
            </div>
          )}

          {department.subdepartments && department.subdepartments.map((subdept) => (
            <div key={subdept.id} className="ml-4">
              <DepartmentNode department={subdept} onToggle={onToggle} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function InteractiveOrgStructure() {
  const [orgData, setOrgData] = useState(mockOrgData);

  const handleToggle = (departmentId: string) => {
    const toggleDepartment = (departments: Department[]): Department[] => {
      return departments.map(dept => {
        if (dept.id === departmentId) {
          return { ...dept, isExpanded: !dept.isExpanded };
        }
        if (dept.subdepartments) {
          return { ...dept, subdepartments: toggleDepartment(dept.subdepartments) };
        }
        return dept;
      });
    };

    setOrgData(toggleDepartment(orgData));
  };

  const totalResources = orgData.reduce((acc, dept) => {
    const deptResources = dept.resources.length + 
      (dept.subdepartments?.reduce((subAcc, sub) => subAcc + sub.resources.length, 0) || 0);
    return acc + deptResources;
  }, 0);

  const totalBudget = orgData.reduce((acc, dept) => acc + dept.budget, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Interactive Organization Structure</h3>
          <p className="text-sm text-muted-foreground">
            Explore departments and view resource details
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="font-medium">{totalResources}</div>
            <div className="text-xs text-muted-foreground">Total Resources</div>
          </div>
          <div className="text-right">
            <div className="font-medium">${(totalBudget / 1000000).toFixed(1)}M</div>
            <div className="text-xs text-muted-foreground">Total Budget</div>
          </div>
          <Button size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Add Department
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        {orgData.map((department) => (
          <DepartmentNode 
            key={department.id} 
            department={department} 
            onToggle={handleToggle}
          />
        ))}
      </div>
    </div>
  );
}