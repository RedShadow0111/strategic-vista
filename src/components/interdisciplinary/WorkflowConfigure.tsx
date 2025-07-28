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
  CheckCircle
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Workflow Configuration</h2>
          <p className="text-muted-foreground">Configure and manage automated workflows</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          New Workflow
        </Button>
      </div>

      <Tabs defaultValue="existing" className="space-y-6">
        <TabsList>
          <TabsTrigger value="existing">Existing Workflows</TabsTrigger>
          <TabsTrigger value="create">Create New</TabsTrigger>
          <TabsTrigger value="settings">Global Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="existing" className="space-y-4">
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
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                        <Edit className="w-3 h-3" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
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
                      <Button variant="outline" size="sm">
                        Configure
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
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
    </div>
  );
}