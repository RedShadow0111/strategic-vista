import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Brain, TrendingUp, TrendingDown, AlertTriangle, CheckCircle, DollarSign, Clock, Users } from "lucide-react";
import { cn } from "@/lib/utils";

interface Project {
  id: number;
  name: string;
  budget: number;
  duration: number; // in months
  resources: number;
  risk: number; // 1-10
  expectedROI: number;
  strategicValue: number;
}

interface SimulationResult {
  totalBudget: number;
  totalDuration: number;
  totalResources: number;
  averageRisk: number;
  expectedROI: number;
  resourceConflicts: string[];
  budgetImpact: string;
  timelineImpact: string;
  recommendations: string[];
}

const availableProjects: Project[] = [
  { id: 1, name: "AI Analytics Platform", budget: 1.5, duration: 8, resources: 12, risk: 6, expectedROI: 180, strategicValue: 9 },
  { id: 2, name: "Mobile App Redesign", budget: 0.8, duration: 4, resources: 6, risk: 3, expectedROI: 120, strategicValue: 7 },
  { id: 3, name: "Cloud Infrastructure", budget: 2.2, duration: 12, resources: 15, risk: 7, expectedROI: 200, strategicValue: 8 },
  { id: 4, name: "Security Enhancement", budget: 1.0, duration: 6, resources: 8, risk: 4, expectedROI: 95, strategicValue: 6 },
  { id: 5, name: "Data Warehouse", budget: 1.8, duration: 10, resources: 14, risk: 8, expectedROI: 160, strategicValue: 8 },
];

const currentPortfolio: Project[] = [
  { id: 101, name: "Digital Transformation", budget: 2.5, duration: 18, resources: 20, risk: 5, expectedROI: 220, strategicValue: 9 },
  { id: 102, name: "Customer Portal", budget: 0.9, duration: 6, resources: 8, risk: 3, expectedROI: 110, strategicValue: 6 },
];

export function WhatIfSimulator() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedProjects, setSelectedProjects] = useState<number[]>([]);
  const [budgetConstraint, setBudgetConstraint] = useState([8.0]);
  const [resourceConstraint, setResourceConstraint] = useState([50]);
  const [simulationResult, setSimulationResult] = useState<SimulationResult | null>(null);

  const runSimulation = () => {
    const allProjects = [
      ...currentPortfolio,
      ...availableProjects.filter(p => selectedProjects.includes(p.id))
    ];

    const totalBudget = allProjects.reduce((sum, p) => sum + p.budget, 0);
    const totalResources = allProjects.reduce((sum, p) => sum + p.resources, 0);
    const maxDuration = Math.max(...allProjects.map(p => p.duration));
    const averageRisk = allProjects.reduce((sum, p) => sum + p.risk, 0) / allProjects.length;
    const totalROI = allProjects.reduce((sum, p) => sum + p.expectedROI, 0);

    const resourceConflicts = [];
    const recommendations = [];

    // Check constraints
    if (totalBudget > budgetConstraint[0]) {
      resourceConflicts.push(`Budget overrun: $${totalBudget.toFixed(1)}M exceeds limit of $${budgetConstraint[0]}M`);
    }

    if (totalResources > resourceConstraint[0]) {
      resourceConflicts.push(`Resource overallocation: ${totalResources} people exceeds limit of ${resourceConstraint[0]}`);
    }

    // Generate recommendations
    if (averageRisk > 6) {
      recommendations.push("Consider risk mitigation strategies for high-risk projects");
    }

    if (totalROI / totalBudget < 100) {
      recommendations.push("Low ROI ratio detected - review project selection");
    }

    const selectedProjectsData = availableProjects.filter(p => selectedProjects.includes(p.id));
    if (selectedProjectsData.some(p => p.strategicValue > 8)) {
      recommendations.push("High strategic value projects detected - prioritize execution");
    }

    setSimulationResult({
      totalBudget,
      totalDuration: maxDuration,
      totalResources,
      averageRisk,
      expectedROI: totalROI,
      resourceConflicts,
      budgetImpact: totalBudget > budgetConstraint[0] ? "Over Budget" : "Within Budget",
      timelineImpact: maxDuration > 12 ? "Extended Timeline" : "Manageable Timeline",
      recommendations
    });
  };

  const toggleProject = (projectId: number) => {
    setSelectedProjects(prev =>
      prev.includes(projectId)
        ? prev.filter(id => id !== projectId)
        : [...prev, projectId]
    );
  };

  const getImpactColor = (impact: string) => {
    if (impact.includes("Over") || impact.includes("Extended")) return "text-destructive";
    return "text-success";
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Brain className="w-4 h-4" />
          What-if Simulator
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5" />
            Portfolio What-if Simulator
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Configuration Panel */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Simulation Parameters</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Budget Constraint */}
                <div>
                  <Label>Budget Constraint: ${budgetConstraint[0]}M</Label>
                  <Slider
                    value={budgetConstraint}
                    onValueChange={setBudgetConstraint}
                    max={15}
                    min={3}
                    step={0.5}
                    className="mt-2"
                  />
                </div>

                {/* Resource Constraint */}
                <div>
                  <Label>Resource Constraint: {resourceConstraint[0]} people</Label>
                  <Slider
                    value={resourceConstraint}
                    onValueChange={setResourceConstraint}
                    max={100}
                    min={20}
                    step={5}
                    className="mt-2"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Current Portfolio */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Current Portfolio</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {currentPortfolio.map(project => (
                    <div key={project.id} className="flex items-center justify-between p-2 bg-muted/30 rounded">
                      <span className="font-medium">{project.name}</span>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>${project.budget}M</span>
                        <span>{project.resources} people</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Available Projects */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Add Projects</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {availableProjects.map(project => (
                    <div
                      key={project.id}
                      className={cn(
                        "p-3 border rounded-lg cursor-pointer transition-all hover:shadow-md",
                        selectedProjects.includes(project.id)
                          ? "border-primary bg-primary/5"
                          : "border-border"
                      )}
                      onClick={() => toggleProject(project.id)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">{project.name}</h4>
                        <Badge variant={selectedProjects.includes(project.id) ? "default" : "outline"}>
                          {selectedProjects.includes(project.id) ? "Selected" : "Available"}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
                        <div>Budget: ${project.budget}M</div>
                        <div>Duration: {project.duration}mo</div>
                        <div>Resources: {project.resources}</div>
                        <div>ROI: {project.expectedROI}%</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Button onClick={runSimulation} className="w-full" size="lg">
              <Brain className="w-4 h-4 mr-2" />
              Run Simulation
            </Button>
          </div>

          {/* Results Panel */}
          <div className="space-y-6">
            {simulationResult ? (
              <>
                {/* Impact Summary */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <TrendingUp className="w-5 h-5" />
                      Simulation Results
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-foreground">
                          ${simulationResult.totalBudget.toFixed(1)}M
                        </div>
                        <div className="text-sm text-muted-foreground">Total Budget</div>
                        <div className={cn("text-xs font-medium mt-1", getImpactColor(simulationResult.budgetImpact))}>
                          {simulationResult.budgetImpact}
                        </div>
                      </div>

                      <div className="text-center">
                        <div className="text-2xl font-bold text-foreground">
                          {simulationResult.totalDuration}mo
                        </div>
                        <div className="text-sm text-muted-foreground">Max Duration</div>
                        <div className={cn("text-xs font-medium mt-1", getImpactColor(simulationResult.timelineImpact))}>
                          {simulationResult.timelineImpact}
                        </div>
                      </div>

                      <div className="text-center">
                        <div className="text-2xl font-bold text-foreground">
                          {simulationResult.totalResources}
                        </div>
                        <div className="text-sm text-muted-foreground">Total Resources</div>
                      </div>

                      <div className="text-center">
                        <div className="text-2xl font-bold text-foreground">
                          {simulationResult.expectedROI.toFixed(0)}%
                        </div>
                        <div className="text-sm text-muted-foreground">Expected ROI</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Risk Assessment */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5" />
                      Risk Assessment
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Portfolio Risk Level</span>
                          <span className="font-medium">{simulationResult.averageRisk.toFixed(1)}/10</span>
                        </div>
                        <Progress value={simulationResult.averageRisk * 10} className="h-2" />
                      </div>

                      {simulationResult.resourceConflicts.length > 0 && (
                        <div className="space-y-2">
                          <h4 className="font-medium text-sm text-destructive">Conflicts Detected:</h4>
                          {simulationResult.resourceConflicts.map((conflict, index) => (
                            <div key={index} className="text-sm text-destructive bg-destructive/10 p-2 rounded">
                              {conflict}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Recommendations */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <CheckCircle className="w-5 h-5" />
                      AI Recommendations
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {simulationResult.recommendations.map((recommendation, index) => (
                        <div key={index} className="flex items-start gap-2 text-sm">
                          <CheckCircle className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                          <span>{recommendation}</span>
                        </div>
                      ))}
                      {simulationResult.recommendations.length === 0 && (
                        <div className="text-sm text-success">
                          ✓ Portfolio configuration looks optimal
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card>
                <CardContent className="text-center py-12">
                  <Brain className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">Ready to Simulate</h3>
                  <p className="text-muted-foreground">
                    Select projects and run simulation to see portfolio impact
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}