import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Building2, 
  Users, 
  ChevronDown, 
  ChevronRight, 
  Plus, 
  Edit, 
  Trash2,
  Move,
  MoreHorizontal,
  MapPin,
  Wifi,
  Home,
  Building
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Department {
  id: string;
  name: string;
  type: "department" | "team";
  parent?: string;
  resourceCount: number;
  utilization: number;
  children?: Department[];
  location: "office" | "remote" | "hybrid" | "outsource";
  skillGaps: { skill: string; gap: number }[];
}

const mockDepartments: Department[] = [
  {
    id: "1",
    name: "Engineering",
    type: "department",
    resourceCount: 45,
    utilization: 88,
    location: "hybrid",
    skillGaps: [
      { skill: "DevOps", gap: -3 },
      { skill: "React", gap: 2 }
    ],
    children: [
      {
        id: "1-1",
        name: "Frontend Team",
        type: "team",
        parent: "1",
        resourceCount: 12,
        utilization: 92,
        location: "remote",
        skillGaps: [{ skill: "Vue.js", gap: -2 }]
      },
      {
        id: "1-2",
        name: "Backend Team",
        type: "team",
        parent: "1",
        resourceCount: 15,
        utilization: 85,
        location: "office",
        skillGaps: [{ skill: "Node.js", gap: 1 }]
      },
      {
        id: "1-3",
        name: "DevOps Team",
        type: "team",
        parent: "1",
        resourceCount: 8,
        utilization: 95,
        location: "hybrid",
        skillGaps: [{ skill: "Kubernetes", gap: -4 }]
      }
    ]
  },
  {
    id: "2",
    name: "Design",
    type: "department",
    resourceCount: 18,
    utilization: 75,
    location: "hybrid",
    skillGaps: [
      { skill: "UX Research", gap: -2 },
      { skill: "3D Design", gap: -1 }
    ],
    children: [
      {
        id: "2-1",
        name: "UX Team",
        type: "team",
        parent: "2",
        resourceCount: 10,
        utilization: 78,
        location: "office",
        skillGaps: [{ skill: "User Research", gap: -1 }]
      },
      {
        id: "2-2",
        name: "Visual Design Team",
        type: "team",
        parent: "2",
        resourceCount: 8,
        utilization: 72,
        location: "remote",
        skillGaps: [{ skill: "Motion Design", gap: -2 }]
      }
    ]
  },
  {
    id: "3",
    name: "PMO",
    type: "department",
    resourceCount: 25,
    utilization: 82,
    location: "hybrid",
    skillGaps: [
      { skill: "Agile", gap: 1 },
      { skill: "Risk Management", gap: -1 }
    ],
    children: [
      {
        id: "3-1",
        name: "Project Managers",
        type: "team",
        parent: "3",
        resourceCount: 15,
        utilization: 85,
        location: "office",
        skillGaps: [{ skill: "Scrum", gap: 2 }]
      },
      {
        id: "3-2",
        name: "Business Analysts",
        type: "team",
        parent: "3",
        resourceCount: 10,
        utilization: 78,
        location: "hybrid",
        skillGaps: [{ skill: "Requirements Analysis", gap: -1 }]
      }
    ]
  }
];

export function OrgStructure() {
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set(["1", "2", "3"]));
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  const toggleNode = (nodeId: string) => {
    const newExpanded = new Set(expandedNodes);
    if (newExpanded.has(nodeId)) {
      newExpanded.delete(nodeId);
    } else {
      newExpanded.add(nodeId);
    }
    setExpandedNodes(newExpanded);
  };

  const getLocationIcon = (location: Department['location']) => {
    switch (location) {
      case "office":
        return <Building className="w-3 h-3" />;
      case "remote":
        return <Wifi className="w-3 h-3" />;
      case "hybrid":
        return <Home className="w-3 h-3" />;
      case "outsource":
        return <MapPin className="w-3 h-3" />;
    }
  };

  const getLocationLabel = (location: Department['location']) => {
    switch (location) {
      case "office":
        return "Офис";
      case "remote":
        return "Удалённо";
      case "hybrid":
        return "Гибрид";
      case "outsource":
        return "Аутсорс";
    }
  };

  const getUtilizationColor = (utilization: number) => {
    if (utilization >= 90) return "text-destructive";
    if (utilization >= 80) return "text-warning";
    return "text-success";
  };

  const renderDepartment = (dept: Department, level: number = 0) => {
    const isExpanded = expandedNodes.has(dept.id);
    const hasChildren = dept.children && dept.children.length > 0;
    const isSelected = selectedNode === dept.id;

    return (
      <div key={dept.id} className="space-y-2">
        <Card 
          className={`cursor-pointer transition-all ${
            isSelected ? "ring-2 ring-primary" : "hover:shadow-md"
          }`}
          onClick={() => setSelectedNode(dept.id)}
        >
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {hasChildren && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="p-1 h-6 w-6"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleNode(dept.id);
                    }}
                  >
                    {isExpanded ? (
                      <ChevronDown className="w-4 h-4" />
                    ) : (
                      <ChevronRight className="w-4 h-4" />
                    )}
                  </Button>
                )}
                {!hasChildren && <div className="w-6" />}
                
                <div className="flex items-center gap-2">
                  {dept.type === "department" ? (
                    <Building2 className="w-5 h-5 text-primary" />
                  ) : (
                    <Users className="w-5 h-5 text-muted-foreground" />
                  )}
                  <div>
                    <h3 className="font-semibold text-foreground">{dept.name}</h3>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      {getLocationIcon(dept.location)}
                      <span>{getLocationLabel(dept.location)}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                {/* Metrics */}
                <div className="text-right">
                  <div className="text-sm font-medium text-foreground">
                    {dept.resourceCount} ресурсов
                  </div>
                  <div className={`text-xs ${getUtilizationColor(dept.utilization)}`}>
                    {dept.utilization}% загрузка
                  </div>
                </div>

                {/* Utilization Bar */}
                <div className="w-20">
                  <Progress value={dept.utilization} className="h-2" />
                </div>

                {/* Skill Gaps */}
                <div className="flex gap-1">
                  {dept.skillGaps.slice(0, 2).map((gap, index) => (
                    <Badge 
                      key={index} 
                      variant={gap.gap < 0 ? "destructive" : "secondary"}
                      className="text-xs"
                    >
                      {gap.skill} {gap.gap > 0 ? `+${gap.gap}` : gap.gap}
                    </Badge>
                  ))}
                </div>

                {/* Actions */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="p-1 h-6 w-6">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Plus className="w-4 h-4 mr-2" />
                      Добавить подразделение
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Edit className="w-4 h-4 mr-2" />
                      Переименовать
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Move className="w-4 h-4 mr-2" />
                      Переместить
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive">
                      <Trash2 className="w-4 h-4 mr-2" />
                      Удалить
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Children */}
        {hasChildren && isExpanded && (
          <div className="ml-8 space-y-2">
            {dept.children!.map((child) => renderDepartment(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-sf font-bold text-foreground">Организационная структура</h2>
          <p className="text-muted-foreground mt-1">
            Иерархия подразделений с возможностью drag-and-drop перемещения ресурсов
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm">
            <Move className="w-4 h-4 mr-2" />
            Режим перемещения
          </Button>
          <Button size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Добавить подразделение
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-muted-foreground">Всего подразделений</div>
            <div className="text-2xl font-bold text-foreground">8</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-muted-foreground">Всего ресурсов</div>
            <div className="text-2xl font-bold text-foreground">88</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-muted-foreground">Средняя загрузка</div>
            <div className="text-2xl font-bold text-warning">85%</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-muted-foreground">Критических пробелов</div>
            <div className="text-2xl font-bold text-destructive">6</div>
          </CardContent>
        </Card>
      </div>

      {/* Department Tree */}
      <div className="space-y-4">
        {mockDepartments.map((dept) => renderDepartment(dept))}
      </div>

      {/* Legend */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Условные обозначения</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-2">
              <Building className="w-4 h-4" />
              <span className="text-sm">Офис</span>
            </div>
            <div className="flex items-center gap-2">
              <Wifi className="w-4 h-4" />
              <span className="text-sm">Удалённо</span>
            </div>
            <div className="flex items-center gap-2">
              <Home className="w-4 h-4" />
              <span className="text-sm">Гибридная модель</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              <span className="text-sm">Аутсорсинг</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}