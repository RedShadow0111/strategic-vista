import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";
import { 
  Settings, 
  Plus, 
  Trash2, 
  Edit, 
  Save, 
  ArrowRight,
  Clock,
  Users,
  Zap,
  AlertTriangle,
  CheckCircle,
  Download,
  Upload,
  FileText,
  Eye,
  ExpandIcon as Expand,
  Minimize
} from "lucide-react";

const workflowTemplates = [
  {
    id: "code-review",
    name: "Code Review Workflow",
    description: "Standard code review process with automated testing",
    steps: ["Code Submission", "Automated Tests", "Peer Review", "Security Scan", "Deployment"]
  },
  {
    id: "deployment",
    name: "Deployment Pipeline", 
    description: "Continuous deployment with staging validation",
    steps: ["Build", "Test", "Stage Deploy", "QA Review", "Production Deploy"]
  },
  {
    id: "qa-testing",
    name: "Quality Assurance",
    description: "Comprehensive testing workflow",
    steps: ["Unit Tests", "Integration Tests", "UI Tests", "Performance Tests", "Report"]
  }
];

const triggerTypes = [
  { value: "manual", label: "Manual Trigger" },
  { value: "schedule", label: "Scheduled" },
  { value: "event", label: "Event-based" },
  { value: "webhook", label: "Webhook" }
];

export function WorkflowConfigure() {
  const [activeWorkflow, setActiveWorkflow] = useState<string | null>(null);
  const [workflows, setWorkflows] = useState(workflowTemplates);
  const [editingWorkflow, setEditingWorkflow] = useState<any>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isConfigDialogOpen, setIsConfigDialogOpen] = useState(false);
  const [isCompactMode, setIsCompactMode] = useState(false);
  const [newWorkflow, setNewWorkflow] = useState({
    name: "",
    description: "",
    trigger: "manual",
    enabled: true,
    steps: [""]
  });

  const handleCreateWorkflow = () => {
    if (newWorkflow.name.trim()) {
      const workflow = {
        id: newWorkflow.name.toLowerCase().replace(/\s+/g, '-'),
        name: newWorkflow.name,
        description: newWorkflow.description,
        steps: newWorkflow.steps.filter(step => step.trim())
      };
      setWorkflows([...workflows, workflow]);
      setNewWorkflow({ name: "", description: "", trigger: "manual", enabled: true, steps: [""] });
    }
  };

  const handleAddStep = () => {
    setNewWorkflow({
      ...newWorkflow,
      steps: [...newWorkflow.steps, ""]
    });
  };

  const handleUpdateStep = (index: number, value: string) => {
    const updatedSteps = [...newWorkflow.steps];
    updatedSteps[index] = value;
    setNewWorkflow({ ...newWorkflow, steps: updatedSteps });
  };

  const handleRemoveStep = (index: number) => {
    const updatedSteps = newWorkflow.steps.filter((_, i) => i !== index);
    setNewWorkflow({ ...newWorkflow, steps: updatedSteps });
  };

  const handleExportWorkflows = () => {
    const data = JSON.stringify(workflows, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'workflows.json';
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Workflows exported successfully");
  };

  const handleImportWorkflows = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedWorkflows = JSON.parse(e.target?.result as string);
          setWorkflows([...workflows, ...importedWorkflows]);
          toast.success("Workflows imported successfully");
        } catch (error) {
          toast.error("Failed to import workflows");
        }
      };
      reader.readAsText(file);
    }
  };

  const handleEditWorkflow = (workflow: any) => {
    setEditingWorkflow({ ...workflow });
    setIsEditDialogOpen(true);
  };

  const handleSaveEdit = () => {
    if (editingWorkflow) {
      setWorkflows(workflows.map(w => w.id === editingWorkflow.id ? editingWorkflow : w));
      setIsEditDialogOpen(false);
      setEditingWorkflow(null);
      toast.success("Workflow updated successfully");
    }
  };

  const handleConfigureWorkflow = (workflow: any) => {
    setEditingWorkflow({ ...workflow });
    setIsConfigDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Workflow Configuration</h2>
          <p className="text-muted-foreground">Configure and manage automated workflows</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setIsCompactMode(!isCompactMode)}>
            {isCompactMode ? <Expand className="w-4 h-4 mr-2" /> : <Minimize className="w-4 h-4 mr-2" />}
            {isCompactMode ? "Expand" : "Compact"}
          </Button>
          <Button variant="outline" size="sm" onClick={handleExportWorkflows}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" size="sm" onClick={() => document.getElementById('import-file')?.click()}>
            <Upload className="w-4 h-4 mr-2" />
            Import
          </Button>
          <input
            id="import-file"
            type="file"
            accept=".json"
            onChange={handleImportWorkflows}
            className="hidden"
          />
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            New Workflow
          </Button>
        </div>
      </div>

      <Tabs defaultValue="existing" className="space-y-6">
        <TabsList>
          <TabsTrigger value="existing">Existing Workflows</TabsTrigger>
          <TabsTrigger value="create">Create New</TabsTrigger>
          <TabsTrigger value="settings">Global Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="existing" className="space-y-4">
          {isCompactMode ? (
            <div className="space-y-2">
              {workflows.map((workflow) => (
                <Card key={workflow.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div>
                          <h4 className="font-medium text-sm">{workflow.name}</h4>
                          <p className="text-xs text-muted-foreground">{workflow.description}</p>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {workflow.steps.length} steps
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <Switch defaultChecked />
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => handleEditWorkflow(workflow)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => handleConfigureWorkflow(workflow)}>
                          <Settings className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => setWorkflows(workflows.filter(w => w.id !== workflow.id))}>
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {workflows.map((workflow) => (
                <Card key={workflow.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-sm">{workflow.name}</CardTitle>
                        <p className="text-xs text-muted-foreground mt-1">
                          {workflow.description}
                        </p>
                      </div>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => handleEditWorkflow(workflow)}>
                          <Edit className="w-3 h-3" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => setWorkflows(workflows.filter(w => w.id !== workflow.id))}>
                          <Trash2 className="w-3 h-3 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-3">
                      <div>
                        <Label className="text-xs text-muted-foreground">Steps ({workflow.steps.length})</Label>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {workflow.steps.slice(0, 3).map((step, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {step}
                            </Badge>
                          ))}
                          {workflow.steps.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{workflow.steps.length - 3} more
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between pt-2">
                        <div className="flex items-center gap-2">
                          <Switch defaultChecked />
                          <span className="text-xs text-muted-foreground">Active</span>
                        </div>
                        <Button variant="outline" size="sm" onClick={() => handleConfigureWorkflow(workflow)}>
                          Configure
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="create" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Create New Workflow</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="workflow-name">Workflow Name</Label>
                  <Input
                    id="workflow-name"
                    placeholder="e.g., Review Process"
                    value={newWorkflow.name}
                    onChange={(e) => setNewWorkflow({ ...newWorkflow, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="trigger-type">Trigger Type</Label>
                  <Select 
                    value={newWorkflow.trigger} 
                    onValueChange={(value) => setNewWorkflow({ ...newWorkflow, trigger: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {triggerTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="workflow-description">Description</Label>
                <Textarea
                  id="workflow-description"
                  placeholder="Describe what this workflow does..."
                  value={newWorkflow.description}
                  onChange={(e) => setNewWorkflow({ ...newWorkflow, description: e.target.value })}
                />
              </div>

              <Separator />

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Workflow Steps</Label>
                  <Button variant="outline" size="sm" onClick={handleAddStep}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Step
                  </Button>
                </div>
                
                <div className="space-y-2">
                  {newWorkflow.steps.map((step, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="flex items-center justify-center w-6 h-6 bg-muted rounded-full text-xs">
                        {index + 1}
                      </div>
                      <Input
                        placeholder="Step description"
                        value={step}
                        onChange={(e) => handleUpdateStep(index, e.target.value)}
                        className="flex-1"
                      />
                      {newWorkflow.steps.length > 1 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveStep(index)}
                          className="h-8 w-8 p-0"
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between pt-4">
                <div className="flex items-center gap-2">
                  <Switch 
                    checked={newWorkflow.enabled}
                    onCheckedChange={(checked) => setNewWorkflow({ ...newWorkflow, enabled: checked })}
                  />
                  <Label>Enable workflow</Label>
                </div>
                <Button onClick={handleCreateWorkflow}>
                  <Save className="w-4 h-4 mr-2" />
                  Create Workflow
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-4 h-4" />
                  Execution Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Parallel Execution</Label>
                    <p className="text-xs text-muted-foreground">Allow multiple workflows to run simultaneously</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Auto Retry Failed Steps</Label>
                    <p className="text-xs text-muted-foreground">Automatically retry failed workflow steps</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="space-y-2">
                  <Label>Max Retry Attempts</Label>
                  <Input type="number" defaultValue="3" min="1" max="10" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  Notification Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Email Notifications</Label>
                    <p className="text-xs text-muted-foreground">Send email updates on workflow events</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Slack Integration</Label>
                    <p className="text-xs text-muted-foreground">Post workflow updates to Slack channels</p>
                  </div>
                  <Switch />
                </div>
                <div className="space-y-2">
                  <Label>Default Notification Channel</Label>
                  <Input placeholder="#workflows" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Edit Workflow Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Workflow</DialogTitle>
          </DialogHeader>
          {editingWorkflow && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Name</Label>
                  <Input
                    value={editingWorkflow.name}
                    onChange={(e) => setEditingWorkflow({ ...editingWorkflow, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>ID</Label>
                  <Input
                    value={editingWorkflow.id}
                    onChange={(e) => setEditingWorkflow({ ...editingWorkflow, id: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  value={editingWorkflow.description}
                  onChange={(e) => setEditingWorkflow({ ...editingWorkflow, description: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Steps</Label>
                <div className="space-y-2">
                  {editingWorkflow.steps.map((step: string, index: number) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="flex items-center justify-center w-6 h-6 bg-muted rounded-full text-xs">
                        {index + 1}
                      </div>
                      <Input
                        value={step}
                        onChange={(e) => {
                          const newSteps = [...editingWorkflow.steps];
                          newSteps[index] = e.target.value;
                          setEditingWorkflow({ ...editingWorkflow, steps: newSteps });
                        }}
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          const newSteps = editingWorkflow.steps.filter((_: any, i: number) => i !== index);
                          setEditingWorkflow({ ...editingWorkflow, steps: newSteps });
                        }}
                        className="h-8 w-8 p-0"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEditingWorkflow({ ...editingWorkflow, steps: [...editingWorkflow.steps, ""] })}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Step
                  </Button>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveEdit}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Configure Workflow Dialog */}
      <Dialog open={isConfigDialogOpen} onOpenChange={setIsConfigDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Configure Workflow: {editingWorkflow?.name}</DialogTitle>
          </DialogHeader>
          {editingWorkflow && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Triggers</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label>Manual Trigger</Label>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>Schedule</Label>
                      <Switch />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>Event-based</Label>
                      <Switch />
                    </div>
                    <div className="space-y-2">
                      <Label>Cron Expression</Label>
                      <Input placeholder="0 0 * * *" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Execution Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label>Auto Retry</Label>
                      <Switch defaultChecked />
                    </div>
                    <div className="space-y-2">
                      <Label>Max Retries</Label>
                      <Input type="number" defaultValue="3" />
                    </div>
                    <div className="space-y-2">
                      <Label>Timeout (minutes)</Label>
                      <Input type="number" defaultValue="30" />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>Parallel Execution</Label>
                      <Switch />
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Notifications</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="flex items-center justify-between">
                      <Label>On Success</Label>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>On Failure</Label>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>On Start</Label>
                      <Switch />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Email Recipients</Label>
                    <Input placeholder="admin@company.com, team@company.com" />
                  </div>
                  <div className="space-y-2">
                    <Label>Slack Channel</Label>
                    <Input placeholder="#workflows" />
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsConfigDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => {
              setIsConfigDialogOpen(false);
              toast.success("Workflow configuration saved");
            }}>
              Save Configuration
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}