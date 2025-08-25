import { useState } from "react";
import { DndContext, DragEndEvent, useDraggable, useDroppable } from "@dnd-kit/core";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Move, Target, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

interface Project {
  id: number;
  name: string;
  risk: number; // 1-10 scale
  strategicValue: number; // 1-10 scale  
  status: string;
  budget: string;
  priority: string;
}

interface MatrixCellProps {
  riskLevel: 'low' | 'medium' | 'high';
  valueLevel: 'low' | 'medium' | 'high';
  projects: Project[];
  onProjectMove: (projectId: number, newRisk: number, newValue: number) => void;
}

function DraggableProject({ project }: { project: Project }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: project.id.toString(),
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed": return "bg-success";
      case "In Progress": return "bg-primary";
      case "Planning": return "bg-warning";
      case "On Hold": return "bg-muted";
      default: return "bg-secondary";
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={cn(
        "bg-card border rounded-lg p-3 cursor-grab active:cursor-grabbing transition-all duration-200 hover:shadow-lg",
        isDragging && "opacity-50 scale-105 shadow-xl z-50"
      )}
    >
      <div className="flex items-center gap-2 mb-2">
        <Move className="w-3 h-3 text-muted-foreground" />
        <h4 className="font-medium text-sm truncate">{project.name}</h4>
      </div>
      <div className="flex items-center justify-between">
        <Badge variant="outline" className={cn("text-xs", getStatusColor(project.status))}>
          {project.status}
        </Badge>
        <span className="text-xs text-muted-foreground">{project.budget}</span>
      </div>
    </div>
  );
}

function MatrixCell({ riskLevel, valueLevel, projects, onProjectMove }: MatrixCellProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: `${riskLevel}-${valueLevel}`,
  });

  const getCellColor = () => {
    if (riskLevel === 'low' && valueLevel === 'high') return 'bg-success/10 border-success/30';
    if (riskLevel === 'low' && valueLevel === 'medium') return 'bg-primary/10 border-primary/30';
    if (riskLevel === 'medium' && valueLevel === 'high') return 'bg-warning/10 border-warning/30';
    if (riskLevel === 'high' && valueLevel === 'low') return 'bg-destructive/10 border-destructive/30';
    return 'bg-muted/30 border-border';
  };

  const getCellLabel = () => {
    if (riskLevel === 'low' && valueLevel === 'high') return 'Star Projects';
    if (riskLevel === 'low' && valueLevel === 'medium') return 'Breadwinners';
    if (riskLevel === 'medium' && valueLevel === 'high') return 'Wildcards';
    if (riskLevel === 'high' && valueLevel === 'low') return 'Question Marks';
    return 'Evaluate';
  };

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "min-h-[120px] p-3 rounded-lg border-2 border-dashed transition-all duration-200",
        getCellColor(),
        isOver && "scale-105 shadow-lg border-solid"
      )}
    >
      <div className="text-xs font-medium text-muted-foreground mb-3">
        {getCellLabel()}
      </div>
      <div className="space-y-2">
        {projects.map((project) => (
          <DraggableProject key={project.id} project={project} />
        ))}
      </div>
    </div>
  );
}

export function PortfolioMatrix({ projects }: { projects: Project[] }) {
  const [matrixProjects, setMatrixProjects] = useState<Project[]>(projects);

  const getRiskLevel = (risk: number): 'low' | 'medium' | 'high' => {
    if (risk <= 3) return 'low';
    if (risk <= 6) return 'medium';
    return 'high';
  };

  const getValueLevel = (value: number): 'low' | 'medium' | 'high' => {
    if (value <= 3) return 'low';
    if (value <= 6) return 'medium';
    return 'high';
  };

  const getProjectsForCell = (riskLevel: 'low' | 'medium' | 'high', valueLevel: 'low' | 'medium' | 'high') => {
    return matrixProjects.filter(project => 
      getRiskLevel(project.risk) === riskLevel && 
      getValueLevel(project.strategicValue) === valueLevel
    );
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over) return;

    const projectId = parseInt(active.id as string);
    const [newRiskLevel, newValueLevel] = (over.id as string).split('-') as ['low' | 'medium' | 'high', 'low' | 'medium' | 'high'];
    
    // Convert levels to numeric values
    const riskValue = newRiskLevel === 'low' ? 2 : newRiskLevel === 'medium' ? 5 : 8;
    const valueValue = newValueLevel === 'low' ? 2 : newValueLevel === 'medium' ? 5 : 8;

    setMatrixProjects(prev => prev.map(project => 
      project.id === projectId 
        ? { ...project, risk: riskValue, strategicValue: valueValue }
        : project
    ));
  };

  const getQuadrantStats = () => {
    const stats = {
      stars: getProjectsForCell('low', 'high').length,
      breadwinners: getProjectsForCell('low', 'medium').length,
      wildcards: getProjectsForCell('medium', 'high').length,
      questions: getProjectsForCell('high', 'low').length,
    };
    return stats;
  };

  const stats = getQuadrantStats();

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              Portfolio Matrix
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Drag projects to reposition based on risk vs strategic value
            </p>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded bg-success" />
              <span>Stars ({stats.stars})</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded bg-warning" />
              <span>Wildcards ({stats.wildcards})</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded bg-destructive" />
              <span>Question Marks ({stats.questions})</span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <DndContext onDragEnd={handleDragEnd}>
          <div className="space-y-4">
            {/* Matrix Grid */}
            <div className="grid grid-cols-3 gap-4">
              {/* High Strategic Value Row */}
              <div className="text-center text-sm font-medium text-muted-foreground py-2">
                High Strategic Value
              </div>
              <MatrixCell 
                riskLevel="low" 
                valueLevel="high" 
                projects={getProjectsForCell('low', 'high')}
                onProjectMove={() => {}}
              />
              <MatrixCell 
                riskLevel="medium" 
                valueLevel="high" 
                projects={getProjectsForCell('medium', 'high')}
                onProjectMove={() => {}}
              />
              <MatrixCell 
                riskLevel="high" 
                valueLevel="high" 
                projects={getProjectsForCell('high', 'high')}
                onProjectMove={() => {}}
              />

              {/* Medium Strategic Value Row */}
              <div className="text-center text-sm font-medium text-muted-foreground py-2">
                Medium Strategic Value
              </div>
              <MatrixCell 
                riskLevel="low" 
                valueLevel="medium" 
                projects={getProjectsForCell('low', 'medium')}
                onProjectMove={() => {}}
              />
              <MatrixCell 
                riskLevel="medium" 
                valueLevel="medium" 
                projects={getProjectsForCell('medium', 'medium')}
                onProjectMove={() => {}}
              />
              <MatrixCell 
                riskLevel="high" 
                valueLevel="medium" 
                projects={getProjectsForCell('high', 'medium')}
                onProjectMove={() => {}}
              />

              {/* Low Strategic Value Row */}
              <div className="text-center text-sm font-medium text-muted-foreground py-2">
                Low Strategic Value
              </div>
              <MatrixCell 
                riskLevel="low" 
                valueLevel="low" 
                projects={getProjectsForCell('low', 'low')}
                onProjectMove={() => {}}
              />
              <MatrixCell 
                riskLevel="medium" 
                valueLevel="low" 
                projects={getProjectsForCell('medium', 'low')}
                onProjectMove={() => {}}
              />
              <MatrixCell 
                riskLevel="high" 
                valueLevel="low" 
                projects={getProjectsForCell('high', 'low')}
                onProjectMove={() => {}}
              />

              {/* Risk Labels */}
              <div></div>
              <div className="text-center text-sm font-medium text-muted-foreground">
                Low Risk
              </div>
              <div className="text-center text-sm font-medium text-muted-foreground">
                Medium Risk
              </div>
              <div className="text-center text-sm font-medium text-muted-foreground">
                High Risk
              </div>
            </div>

            {/* Recommendations */}
            <div className="bg-muted/30 rounded-lg p-4">
              <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                AI Recommendations
              </h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                {stats.stars > 0 && (
                  <div>• Focus resources on {stats.stars} Star projects for maximum ROI</div>
                )}
                {stats.questions > 0 && (
                  <div>• Review {stats.questions} Question Mark projects for potential cancellation</div>
                )}
                {stats.wildcards > 0 && (
                  <div>• Implement risk mitigation for {stats.wildcards} Wildcard projects</div>
                )}
              </div>
            </div>
          </div>
        </DndContext>
      </CardContent>
    </Card>
  );
}