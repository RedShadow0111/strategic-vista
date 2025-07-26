import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { 
  CalendarIcon, 
  Save, 
  AlertTriangle, 
  CheckCircle,
  Clock,
  Users
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface MitigateRiskDialogProps {
  risk: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const mitigationStrategies = {
  "Budget Overrun Risk": [
    "Implement strict change control process",
    "Reallocate budget from lower priority features",
    "Negotiate with vendors for cost reduction",
    "Reduce project scope",
    "Seek additional budget approval"
  ],
  "Schedule Delay Risk": [
    "Add additional resources to critical path",
    "Implement parallel development tracks",
    "Reduce non-essential features",
    "Extend project timeline",
    "Outsource specific components"
  ],
  "Resource Constraint": [
    "Hire additional team members",
    "Provide training to existing staff",
    "Reallocate resources from other projects",
    "Engage external consultants",
    "Adjust project priorities"
  ],
  "Scope Creep": [
    "Strengthen requirements documentation",
    "Implement change request process",
    "Regular stakeholder communication",
    "Set clear project boundaries",
    "Establish approval workflows"
  ]
};

export function MitigateRiskDialog({ risk, open, onOpenChange }: MitigateRiskDialogProps) {
  const [selectedStrategy, setSelectedStrategy] = useState("");
  const [customPlan, setCustomPlan] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [priority, setPriority] = useState("");
  const [dueDate, setDueDate] = useState<Date | null>(null);

  if (!risk) return null;

  const strategies = mitigationStrategies[risk.type as keyof typeof mitigationStrategies] || [];

  const handleSave = () => {
    if (!selectedStrategy && !customPlan) {
      toast.error("Please select a strategy or provide a custom plan");
      return;
    }

    if (!assignedTo) {
      toast.error("Please assign responsibility for this mitigation");
      return;
    }

    // Simulate saving
    toast.success("Mitigation plan created successfully");
    onOpenChange(false);
    
    // Reset form
    setSelectedStrategy("");
    setCustomPlan("");
    setAssignedTo("");
    setPriority("");
    setDueDate(null);
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
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            Create Mitigation Plan: {risk.type}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Risk Summary */}
          <Card className="bg-muted/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">{risk.type}</h4>
                  <p className="text-sm text-muted-foreground">{risk.description}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={getSeverityColor(risk.severity)}>
                    {risk.severity}
                  </Badge>
                  <div className="text-right">
                    <div className="font-bold">{risk.projects}</div>
                    <div className="text-xs text-muted-foreground">projects</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Mitigation Strategy */}
          <div>
            <Label className="text-base font-medium">Mitigation Strategy</Label>
            <div className="mt-2 space-y-3">
              {strategies.map((strategy, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id={`strategy-${index}`}
                    name="strategy"
                    value={strategy}
                    checked={selectedStrategy === strategy}
                    onChange={(e) => setSelectedStrategy(e.target.value)}
                    className="h-4 w-4"
                  />
                  <label htmlFor={`strategy-${index}`} className="text-sm flex-1">
                    {strategy}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Custom Plan */}
          <div>
            <Label htmlFor="customPlan">Custom Mitigation Plan</Label>
            <Textarea
              id="customPlan"
              value={customPlan}
              onChange={(e) => setCustomPlan(e.target.value)}
              placeholder="Describe your custom mitigation approach..."
              rows={4}
              className="mt-2"
            />
          </div>

          {/* Assignment Details */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Assigned To</Label>
              <Select value={assignedTo} onValueChange={setAssignedTo}>
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Select team member" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sarah.chen">Sarah Chen (PM)</SelectItem>
                  <SelectItem value="mike.johnson">Mike Johnson (Tech Lead)</SelectItem>
                  <SelectItem value="emma.davis">Emma Davis (Designer)</SelectItem>
                  <SelectItem value="alex.rodriguez">Alex Rodriguez (PM)</SelectItem>
                  <SelectItem value="lisa.wang">Lisa Wang (Developer)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Priority</Label>
              <Select value={priority} onValueChange={setPriority}>
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="urgent">Urgent</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Due Date */}
          <div>
            <Label>Target Completion Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal mt-2",
                    !dueDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dueDate ? format(dueDate, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={dueDate || undefined}
                  onSelect={(date) => setDueDate(date || null)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Success Criteria */}
          <div>
            <Label className="text-base font-medium">Success Criteria</Label>
            <div className="mt-2 space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle className="w-4 h-4 text-success" />
                Risk severity reduced by at least one level
              </div>
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle className="w-4 h-4 text-success" />
                Number of affected projects decreased
              </div>
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle className="w-4 h-4 text-success" />
                Mitigation plan implemented within timeline
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              <Save className="w-4 h-4 mr-2" />
              Create Mitigation Plan
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}