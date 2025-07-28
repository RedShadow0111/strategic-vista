import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  BookOpen, 
  Users, 
  ChevronDown, 
  ChevronRight, 
  Plus, 
  Edit, 
  Trash2,
  Search,
  Filter,
  Award,
  Target,
  TrendingUp
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Discipline {
  id: string;
  name: string;
  parent?: string;
  category: "technical" | "management" | "design" | "business";
  resourceCount: number;
  demand: number;
  supply: number;
  children?: Discipline[];
  standardCompetencies: string[];
  certifications: string[];
}

const mockDisciplines: Discipline[] = [
  {
    id: "1",
    name: "Information Technology",
    category: "technical",
    resourceCount: 45,
    demand: 95,
    supply: 85,
    standardCompetencies: ["Problem Solving", "Technical Documentation", "Code Review"],
    certifications: ["AWS", "Azure", "Google Cloud"],
    children: [
      {
        id: "1-1",
        name: "Frontend Development",
        parent: "1",
        category: "technical",
        resourceCount: 15,
        demand: 90,
        supply: 88,
        standardCompetencies: ["HTML/CSS", "JavaScript", "Framework Knowledge", "UI/UX"],
        certifications: ["React Certification", "Vue.js Certification"]
      },
      {
        id: "1-2",
        name: "Backend Development",
        parent: "1",
        category: "technical",
        resourceCount: 18,
        demand: 85,
        supply: 82,
        standardCompetencies: ["API Design", "Database Design", "Security", "Performance"],
        certifications: ["Node.js", "Python", "Java Spring"]
      },
      {
        id: "1-3",
        name: "DevOps",
        parent: "1",
        category: "technical",
        resourceCount: 8,
        demand: 95,
        supply: 70,
        standardCompetencies: ["CI/CD", "Infrastructure", "Monitoring", "Security"],
        certifications: ["Docker", "Kubernetes", "Jenkins"]
      }
    ]
  },
  {
    id: "2",
    name: "Project Management",
    category: "management",
    resourceCount: 25,
    demand: 80,
    supply: 85,
    standardCompetencies: ["Planning", "Risk Management", "Stakeholder Management", "Leadership"],
    certifications: ["PMP", "Scrum Master", "Prince2"],
    children: [
      {
        id: "2-1",
        name: "Agile Management",
        parent: "2",
        category: "management",
        resourceCount: 15,
        demand: 90,
        supply: 88,
        standardCompetencies: ["Scrum", "Kanban", "Sprint Planning", "Retrospectives"],
        certifications: ["CSM", "PSM", "SAFe"]
      },
      {
        id: "2-2",
        name: "Traditional PM",
        parent: "2",
        category: "management",
        resourceCount: 10,
        demand: 70,
        supply: 82,
        standardCompetencies: ["Waterfall", "Gantt Charts", "Resource Planning", "Budget Management"],
        certifications: ["PMP", "CAPM", "Prince2"]
      }
    ]
  },
  {
    id: "3",
    name: "Design",
    category: "design",
    resourceCount: 18,
    demand: 75,
    supply: 72,
    standardCompetencies: ["Design Thinking", "User Research", "Prototyping", "Visual Design"],
    certifications: ["Adobe Certified", "Figma Expert", "UX Certification"],
    children: [
      {
        id: "3-1",
        name: "UX Design",
        parent: "3",
        category: "design",
        resourceCount: 10,
        demand: 80,
        supply: 75,
        standardCompetencies: ["User Research", "Information Architecture", "Wireframing", "Testing"],
        certifications: ["Google UX", "Nielsen Norman", "HFI CUA"]
      },
      {
        id: "3-2",
        name: "Visual Design",
        parent: "3",
        category: "design",
        resourceCount: 8,
        demand: 70,
        supply: 68,
        standardCompetencies: ["Typography", "Color Theory", "Layout", "Branding"],
        certifications: ["Adobe Creative Suite", "Sketch", "Figma"]
      }
    ]
  }
];

export function DisciplinesCompetencies() {
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set(["1", "2", "3"]));
  const [selectedDiscipline, setSelectedDiscipline] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const toggleNode = (nodeId: string) => {
    const newExpanded = new Set(expandedNodes);
    if (newExpanded.has(nodeId)) {
      newExpanded.delete(nodeId);
    } else {
      newExpanded.add(nodeId);
    }
    setExpandedNodes(newExpanded);
  };

  const getCategoryColor = (category: Discipline['category']) => {
    switch (category) {
      case "technical":
        return "bg-blue-100 text-blue-800";
      case "management":
        return "bg-green-100 text-green-800";
      case "design":
        return "bg-purple-100 text-purple-800";
      case "business":
        return "bg-orange-100 text-orange-800";
    }
  };

  const getGapColor = (demand: number, supply: number) => {
    const gap = supply - demand;
    if (gap < -10) return "text-destructive";
    if (gap < 0) return "text-warning";
    return "text-success";
  };

  const renderDiscipline = (discipline: Discipline, level: number = 0) => {
    const isExpanded = expandedNodes.has(discipline.id);
    const hasChildren = discipline.children && discipline.children.length > 0;
    const isSelected = selectedDiscipline === discipline.id;
    const gap = discipline.supply - discipline.demand;

    return (
      <div key={discipline.id} className="space-y-2">
        <Card 
          className={`cursor-pointer transition-all ${
            isSelected ? "ring-2 ring-primary" : "hover:shadow-md"
          }`}
          onClick={() => setSelectedDiscipline(discipline.id)}
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
                      toggleNode(discipline.id);
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
                
                <div className="flex items-center gap-3">
                  <BookOpen className="w-5 h-5 text-primary" />
                  <div>
                    <h3 className="font-semibold text-foreground">{discipline.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge className={getCategoryColor(discipline.category)}>
                        {discipline.category}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {discipline.resourceCount} ресурсов
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-6">
                {/* Demand vs Supply */}
                <div className="text-right">
                  <div className="text-sm text-muted-foreground">Спрос/Предложение</div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{discipline.demand}%</span>
                    <span className="text-xs text-muted-foreground">/</span>
                    <span className="text-sm font-medium">{discipline.supply}%</span>
                    <span className={`text-xs ${getGapColor(discipline.demand, discipline.supply)}`}>
                      ({gap > 0 ? '+' : ''}{gap}%)
                    </span>
                  </div>
                </div>

                {/* Supply Progress */}
                <div className="w-24">
                  <div className="text-xs text-muted-foreground mb-1">Покрытие</div>
                  <Progress value={discipline.supply} className="h-2" />
                </div>

                {/* Certifications Count */}
                <div className="text-center">
                  <div className="text-sm font-medium text-foreground">
                    {discipline.certifications.length}
                  </div>
                  <div className="text-xs text-muted-foreground">сертификаций</div>
                </div>

                {/* Actions */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <Edit className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Plus className="w-4 h-4 mr-2" />
                      Добавить дочернюю дисциплину
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Edit className="w-4 h-4 mr-2" />
                      Редактировать
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Users className="w-4 h-4 mr-2" />
                      Посмотреть ресурсы
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive">
                      <Trash2 className="w-4 h-4 mr-2" />
                      Удалить
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {/* Competencies & Certifications Preview */}
            {level === 0 && (
              <div className="mt-3 pt-3 border-t border-border">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">Ключевые компетенции</div>
                    <div className="flex gap-1">
                      {discipline.standardCompetencies.slice(0, 3).map((comp, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {comp}
                        </Badge>
                      ))}
                      {discipline.standardCompetencies.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{discipline.standardCompetencies.length - 3}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">Сертификации</div>
                    <div className="flex gap-1">
                      {discipline.certifications.slice(0, 2).map((cert, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {cert}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Children */}
        {hasChildren && isExpanded && (
          <div className="ml-8 space-y-2">
            {discipline.children!.map((child) => renderDiscipline(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  const totalDisciplines = mockDisciplines.length + mockDisciplines.reduce((acc, d) => acc + (d.children?.length || 0), 0);
  const avgDemand = Math.round(mockDisciplines.reduce((acc, d) => acc + d.demand, 0) / mockDisciplines.length);
  const avgSupply = Math.round(mockDisciplines.reduce((acc, d) => acc + d.supply, 0) / mockDisciplines.length);
  const criticalGaps = mockDisciplines.filter(d => (d.supply - d.demand) < -10).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-sf font-bold text-foreground">Дисциплины и компетенции</h2>
          <p className="text-muted-foreground mt-1">
            Управление направлениями экспертизы и навыками команды
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <Input 
              placeholder="Поиск дисциплин..." 
              className="pl-10 w-64"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Фильтры
          </Button>
          <Button size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Добавить дисциплину
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-primary" />
              <div>
                <div className="text-sm text-muted-foreground">Всего дисциплин</div>
                <div className="text-2xl font-bold text-foreground">{totalDisciplines}</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-warning" />
              <div>
                <div className="text-sm text-muted-foreground">Средний спрос</div>
                <div className="text-2xl font-bold text-foreground">{avgDemand}%</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-success" />
              <div>
                <div className="text-sm text-muted-foreground">Среднее предложение</div>
                <div className="text-2xl font-bold text-foreground">{avgSupply}%</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-destructive" />
              <div>
                <div className="text-sm text-muted-foreground">Критические пробелы</div>
                <div className="text-2xl font-bold text-foreground">{criticalGaps}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Disciplines Tree */}
      <div className="space-y-4">
        {mockDisciplines.map((discipline) => renderDiscipline(discipline))}
      </div>

      {/* Skills Matrix Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="w-5 h-5" />
            Матрица навыков по категориям
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {["technical", "management", "design", "business"].map((category) => {
              const categoryDisciplines = mockDisciplines.filter(d => d.category === category);
              const avgDemandCat = Math.round(categoryDisciplines.reduce((acc, d) => acc + d.demand, 0) / categoryDisciplines.length);
              const avgSupplyCat = Math.round(categoryDisciplines.reduce((acc, d) => acc + d.supply, 0) / categoryDisciplines.length);
              const gap = avgSupplyCat - avgDemandCat;
              
              return (
                <div key={category} className="p-4 border rounded-lg">
                  <div className="text-sm font-medium capitalize mb-2">{category}</div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span>Спрос: {avgDemandCat}%</span>
                      <span>Предложение: {avgSupplyCat}%</span>
                    </div>
                    <Progress value={avgSupplyCat} className="h-2" />
                    <div className={`text-xs text-center ${getGapColor(avgDemandCat, avgSupplyCat)}`}>
                      Разрыв: {gap > 0 ? '+' : ''}{gap}%
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}