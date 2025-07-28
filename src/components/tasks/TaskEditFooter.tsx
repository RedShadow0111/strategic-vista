import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Save, X, ChevronUp, ChevronDown } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";

interface TaskEditFooterProps {
  task: any;
  open: boolean;
  onClose: () => void;
}

export function TaskEditFooter({ task, open, onClose }: TaskEditFooterProps) {
  const [expanded, setExpanded] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "",
    priority: "",
    assignee: "",
    progress: 0,
    estimatedHours: 0,
    actualHours: 0,
    startDate: null as Date | null,
    dueDate: null as Date | null,
    tags: [] as string[]
  });

  const [newTag, setNewTag] = useState("");

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || "",
        description: task.description || "",
        status: task.status || "",
        priority: task.priority || "",
        assignee: task.assignee || "",
        progress: task.progress || 0,
        estimatedHours: task.estimatedHours || 0,
        actualHours: task.actualHours || 0,
        startDate: task.startDate ? new Date(task.startDate) : null,
        dueDate: task.dueDate ? new Date(task.dueDate) : null,
        tags: task.tags || []
      });
    }
  }, [task]);

  const handleSave = () => {
    console.log("Saving task:", formData);
    onClose();
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  if (!open || !task) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border shadow-lg z-50">
      <Card className="rounded-none border-0 border-t">
        <CardContent className="p-4">
          {/* Collapsed view */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div>
                <h3 className="font-medium text-sm">Editing: {formData.title}</h3>
                <p className="text-xs text-muted-foreground">
                  {formData.status} • {formData.priority} Priority
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setExpanded(!expanded)}
                >
                  {expanded ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
                  {expanded ? "Collapse" : "Expand"}
                </Button>
                <Button variant="outline" size="sm" onClick={onClose}>
                  Cancel
                </Button>
                <Button size="sm" onClick={handleSave}>
                  <Save className="w-4 h-4 mr-2" />
                  Save
                </Button>
              </div>
            </div>
          </div>

          {/* Expanded view */}
          {expanded && (
            <div className="mt-4 pt-4 border-t border-border">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-h-[60vh] overflow-y-auto">
                {/* Basic Information */}
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Enter task title"
                    />
                  </div>

                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Enter task description"
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label>Status</Label>
                      <Select
                        value={formData.status}
                        onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="To Do">To Do</SelectItem>
                          <SelectItem value="In Progress">In Progress</SelectItem>
                          <SelectItem value="Review">Review</SelectItem>
                          <SelectItem value="Completed">Completed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Priority</Label>
                      <Select
                        value={formData.priority}
                        onValueChange={(value) => setFormData(prev => ({ ...prev, priority: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Low">Low</SelectItem>
                          <SelectItem value="Medium">Medium</SelectItem>
                          <SelectItem value="High">High</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Progress and Time */}
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="assignee">Assignee</Label>
                    <Input
                      id="assignee"
                      value={formData.assignee}
                      onChange={(e) => setFormData(prev => ({ ...prev, assignee: e.target.value }))}
                      placeholder="Enter assignee name"
                    />
                  </div>

                  <div>
                    <Label>Progress: {formData.progress}%</Label>
                    <div className="mt-2 space-y-2">
                      <Progress value={formData.progress} className="h-2" />
                      <Input
                        type="range"
                        min="0"
                        max="100"
                        value={formData.progress}
                        onChange={(e) => setFormData(prev => ({ ...prev, progress: parseInt(e.target.value) }))}
                        className="w-full"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label htmlFor="estimatedHours">Est. Hours</Label>
                      <Input
                        id="estimatedHours"
                        type="number"
                        value={formData.estimatedHours}
                        onChange={(e) => setFormData(prev => ({ ...prev, estimatedHours: parseInt(e.target.value) || 0 }))}
                        placeholder="0"
                      />
                    </div>

                    <div>
                      <Label htmlFor="actualHours">Actual Hours</Label>
                      <Input
                        id="actualHours"
                        type="number"
                        value={formData.actualHours}
                        onChange={(e) => setFormData(prev => ({ ...prev, actualHours: parseInt(e.target.value) || 0 }))}
                        placeholder="0"
                      />
                    </div>
                  </div>
                </div>

                {/* Dates and Tags */}
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label>Start Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !formData.startDate && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-1 h-3 w-3" />
                            {formData.startDate ? format(formData.startDate, "MMM dd") : "Pick date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={formData.startDate || undefined}
                            onSelect={(date) => setFormData(prev => ({ ...prev, startDate: date || null }))}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>

                    <div>
                      <Label>Due Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !formData.dueDate && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-1 h-3 w-3" />
                            {formData.dueDate ? format(formData.dueDate, "MMM dd") : "Pick date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={formData.dueDate || undefined}
                            onSelect={(date) => setFormData(prev => ({ ...prev, dueDate: date || null }))}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>

                  <div>
                    <Label>Tags</Label>
                    <div className="flex flex-wrap gap-1 mb-2">
                      {formData.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary" className="gap-1 text-xs">
                          {tag}
                          <X
                            className="w-2 h-2 cursor-pointer hover:text-destructive"
                            onClick={() => removeTag(tag)}
                          />
                        </Badge>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Input
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        placeholder="Add a tag"
                        onKeyPress={(e) => e.key === 'Enter' && addTag()}
                      />
                      <Button type="button" variant="outline" size="sm" onClick={addTag}>
                        Add
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}