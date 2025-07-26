import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { 
  AlertTriangle, 
  Calendar, 
  DollarSign, 
  TrendingUp, 
  Users,
  Clock,
  Target
} from "lucide-react";

interface RiskDetailsDialogProps {
  risk: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const mockRiskDetails = {
  "Budget Overrun Risk": {
    impactLevel: "High",
    probability: 75,
    projectedCost: "$2.3M",
    timeframe: "Next 3 months",
    affectedProjects: [
      { name: "Digital Transformation", overrun: "18%", amount: "$450K" },
      { name: "Portal Redesign", overrun: "22%", amount: "$320K" },
      { name: "Infrastructure Upgrade", overrun: "12%", amount: "$180K" }
    ],
    indicators: [
      "Scope expansion without budget approval",
      "Resource costs exceeding estimates",
      "Third-party vendor price increases"
    ],
    recommendations: [
      "Implement stricter change control process",
      "Renegotiate vendor contracts",
      "Consider scope reduction for non-critical features"
    ]
  },
  "Schedule Delay Risk": {
    impactLevel: "Medium",
    probability: 60,
    projectedDelay: "4-6 weeks",
    timeframe: "Q3 2024",
    affectedProjects: [
      { name: "Mobile App Development", delay: "3 weeks", impact: "Low" },
      { name: "API Integration", delay: "5 weeks", impact: "High" },
      { name: "Security Implementation", delay: "2 weeks", impact: "Medium" }
    ],
    indicators: [
      "Resource availability constraints",
      "Technical complexity higher than estimated",
      "Dependency delays from external teams"
    ],
    recommendations: [
      "Increase sprint velocity through additional resources",
      "Implement parallel development tracks",
      "Escalate external dependencies"
    ]
  }
};

export function RiskDetailsDialog({ risk, open, onOpenChange }: RiskDetailsDialogProps) {
  if (!risk) return null;

  const details = mockRiskDetails[risk.type as keyof typeof mockRiskDetails] || {
    impactLevel: "Medium",
    probability: 50,
    projectedCost: "TBD",
    timeframe: "TBD",
    affectedProjects: [],
    indicators: [],
    recommendations: []
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "High": return "bg-destructive text-destructive-foreground";
      case "Medium": return "bg-warning text-warning-foreground";
      case "Low": return "bg-success text-success-foreground";
      default: return "bg-secondary text-secondary-foreground";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            Risk Details: {risk.type}
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="h-[70vh]">
          <div className="space-y-6">
            {/* Risk Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Impact Level</CardTitle>
                </CardHeader>
                <CardContent>
                  <Badge className={getSeverityColor(details.impactLevel)}>
                    {details.impactLevel}
                  </Badge>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Probability</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="text-lg font-bold">{details.probability}%</div>
                    <Progress value={details.probability} className="h-2" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Affected Projects</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-lg font-bold">{risk.projects}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Timeframe</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm">{details.timeframe}</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Affected Projects */}
            {details.affectedProjects.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    Affected Projects
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {details.affectedProjects.map((project, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border border-border rounded-lg">
                        <div>
                          <div className="font-medium">{project.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {project.overrun && `Budget overrun: ${project.overrun}`}
                            {project.delay && `Expected delay: ${project.delay}`}
                          </div>
                        </div>
                        <div className="text-right">
                          {project.amount && (
                            <div className="font-medium text-destructive">{project.amount}</div>
                          )}
                          {project.impact && (
                            <Badge variant="outline">{project.impact} Impact</Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Risk Indicators */}
            {details.indicators.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Risk Indicators
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {details.indicators.map((indicator, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <div className="w-2 h-2 rounded-full bg-warning mt-2"></div>
                        <span className="text-sm">{indicator}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Recommendations */}
            {details.recommendations.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Recommended Actions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {details.recommendations.map((recommendation, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <div className="w-2 h-2 rounded-full bg-success mt-2"></div>
                        <span className="text-sm">{recommendation}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Financial Impact */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5" />
                  Financial Impact
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-muted-foreground">Projected Impact</div>
                    <div className="text-lg font-bold text-destructive">
                      {(details as any).projectedCost || (details as any).projectedDelay || "TBD"}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Risk Score</div>
                    <div className="text-lg font-bold">{risk.severity}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}