import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { CheckSquare, Edit, Trash2, Calendar, DollarSign, Users, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

interface Project {
  id: number;
  name: string;
  status: string;
  priority: string;
  budget: string;
  progress: number;
  team: number;
  risk: string;
  category: string;
}

interface BulkActionsProps {
  projects: Project[];
  onBulkUpdate: (updates: BulkUpdateData) => void;
}

interface BulkUpdateData {
  projectIds: number[];
  updates: {
    status?: string;
    priority?: string;
    budget?: string;
    category?: string;
  };
}

export function BulkActions({ projects, onBulkUpdate }: BulkActionsProps) {
  console.log("BulkActions component rendering with:", { projects: projects.length });
  const [isOpen, setIsOpen] = useState(false);
  const [selectedProjects, setSelectedProjects] = useState<number[]>([]);
  const [bulkUpdates, setBulkUpdates] = useState({
    status: "no_change",
    priority: "no_change", 
    budget: "",
    category: "no_change"
  });

  const handleProjectToggle = (projectId: number) => {
    setSelectedProjects(prev =>
      prev.includes(projectId)
        ? prev.filter(id => id !== projectId)
        : [...prev, projectId]
    );
  };

  const handleSelectAll = () => {
    if (selectedProjects.length === projects.length) {
      setSelectedProjects([]);
    } else {
      setSelectedProjects(projects.map(p => p.id));
    }
  };

  const handleApplyUpdates = () => {
    if (selectedProjects.length === 0) return;

    const filteredUpdates = Object.fromEntries(
      Object.entries(bulkUpdates).filter(([_, value]) => value !== "" && value !== "no_change")
    );

    onBulkUpdate({
      projectIds: selectedProjects,
      updates: filteredUpdates
    });

    // Reset form
    setSelectedProjects([]);
    setBulkUpdates({ status: "no_change", priority: "no_change", budget: "", category: "no_change" });
    setIsOpen(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed": return "bg-success text-success-foreground";
      case "In Progress": return "bg-primary text-primary-foreground";
      case "Planning": return "bg-warning text-warning-foreground";
      case "On Hold": return "bg-muted text-muted-foreground";
      default: return "bg-secondary text-secondary-foreground";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High": return "bg-destructive text-destructive-foreground";
      case "Medium": return "bg-warning text-warning-foreground";
      case "Low": return "bg-success text-success-foreground";
      default: return "bg-secondary text-secondary-foreground";
    }
  };

  const getUpdatePreview = () => {
    const updates = Object.entries(bulkUpdates).filter(([_, value]) => value !== "" && value !== "no_change");
    return updates.length > 0 ? updates.map(([key, value]) => `${key}: ${value}`).join(", ") : "No changes";
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <CheckSquare className="w-4 h-4" />
          Bulk Actions
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CheckSquare className="w-5 h-5" />
            Bulk Project Actions
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Project Selection */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Select Projects</CardTitle>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      checked={selectedProjects.length === projects.length}
                      onCheckedChange={handleSelectAll}
                    />
                    <Label className="text-sm">Select All ({projects.length})</Label>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {projects.map(project => (
                    <div
                      key={project.id}
                      className={cn(
                        "flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-all hover:shadow-md",
                        selectedProjects.includes(project.id)
                          ? "border-primary bg-primary/5"
                          : "border-border"
                      )}
                      onClick={() => handleProjectToggle(project.id)}
                    >
                      <Checkbox
                        checked={selectedProjects.includes(project.id)}
                        onCheckedChange={() => handleProjectToggle(project.id)}
                      />
                      
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium truncate">{project.name}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="secondary" className={cn("text-xs", getStatusColor(project.status))}>
                            {project.status}
                          </Badge>
                          <Badge variant="outline" className={cn("text-xs", getPriorityColor(project.priority))}>
                            {project.priority}
                          </Badge>
                          <span className="text-xs text-muted-foreground">{project.budget}</span>
                        </div>
                        
                        <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Progress value={project.progress} className="w-12 h-1" />
                            <span>{project.progress}%</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            <span>{project.team}</span>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {project.category}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 p-3 bg-muted/30 rounded-lg">
                  <div className="text-sm font-medium">
                    {selectedProjects.length} of {projects.length} projects selected
                  </div>
                  {selectedProjects.length > 0 && (
                    <div className="text-xs text-muted-foreground mt-1">
                      Ready for bulk actions
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Bulk Update Forms */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Update Properties</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Changes will be applied to all selected projects
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                 {/* Status Update */}
                 <div>
                   <Label>Status</Label>
                   <Select 
                     value={bulkUpdates.status} 
                     onValueChange={(value) => {
                       console.log("Status select changed to:", value);
                       setBulkUpdates(prev => ({ ...prev, status: value }));
                     }}
                   >
                     <SelectTrigger>
                       <SelectValue placeholder="Select new status" />
                     </SelectTrigger>
                     <SelectContent>
                       <SelectItem value="no_change">No Change</SelectItem>
                       <SelectItem value="Planning">Planning</SelectItem>
                       <SelectItem value="In Progress">In Progress</SelectItem>
                       <SelectItem value="On Hold">On Hold</SelectItem>
                       <SelectItem value="Completed">Completed</SelectItem>
                     </SelectContent>
                   </Select>
                 </div>

                {/* Priority Update */}
                <div>
                  <Label>Priority</Label>
                  <Select value={bulkUpdates.priority} onValueChange={(value) => setBulkUpdates(prev => ({ ...prev, priority: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select new priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="no_change">No Change</SelectItem>
                      <SelectItem value="Low">Low</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="High">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Category Update */}
                <div>
                  <Label>Category</Label>
                  <Select value={bulkUpdates.category} onValueChange={(value) => setBulkUpdates(prev => ({ ...prev, category: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select new category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="no_change">No Change</SelectItem>
                      <SelectItem value="Strategic">Strategic</SelectItem>
                      <SelectItem value="Product">Product</SelectItem>
                      <SelectItem value="Infrastructure">Infrastructure</SelectItem>
                      <SelectItem value="Operational">Operational</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Budget Adjustment */}
                <div>
                  <Label>Budget Adjustment (%)</Label>
                  <Input
                    type="number"
                    placeholder="e.g. +10 or -5"
                    value={bulkUpdates.budget}
                    onChange={(e) => setBulkUpdates(prev => ({ ...prev, budget: e.target.value }))}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Use + for increase, - for decrease (e.g., +10% or -5%)
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Preview */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" />
                  Preview Changes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="text-sm">
                    <span className="font-medium">Selected Projects:</span> {selectedProjects.length}
                  </div>
                  <div className="text-sm">
                    <span className="font-medium">Changes:</span> {getUpdatePreview()}
                  </div>
                  
                  {selectedProjects.length > 0 && (
                    <div className="bg-warning/10 border border-warning/20 rounded-lg p-3">
                      <div className="flex items-center gap-2 text-warning">
                        <AlertTriangle className="w-4 h-4" />
                        <span className="text-sm font-medium">Confirmation Required</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        This action will update {selectedProjects.length} projects and cannot be undone.
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex gap-3">
              <Button
                onClick={handleApplyUpdates}
                disabled={selectedProjects.length === 0}
                className="flex-1"
              >
                <Edit className="w-4 h-4 mr-2" />
                Apply Changes ({selectedProjects.length})
              </Button>
              <Button variant="outline" onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}