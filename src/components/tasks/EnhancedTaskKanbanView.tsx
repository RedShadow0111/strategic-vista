import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Edit, Calendar, Clock, User, Plus, MoreHorizontal, Trash2, Edit3 } from "lucide-react";
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, closestCenter, useSensor, useSensors, PointerSensor } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface Task {
  id: string;
  title: string;
  description: string;
  project: string;
  assignee: string;
  status: string;
  priority: string;
  dueDate: string;
  startDate: string;
  progress: number;
  estimatedHours: number;
  actualHours: number;
  tags: string[];
  avatar: string;
}

interface TaskKanbanViewProps {
  tasks: Task[];
  onEditTask: (task: Task) => void;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "Completed": return "bg-success text-success-foreground";
    case "In Progress": return "bg-primary text-primary-foreground";
    case "Review": return "bg-warning text-warning-foreground";
    case "To Do": return "bg-muted text-muted-foreground";
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

function SortableTask({ task, onEditTask }: { task: Task; onEditTask: (task: Task) => void }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="cursor-grab hover:shadow-md transition-shadow mb-3"
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <h4 className="font-medium text-sm leading-tight pr-2">{task.title}</h4>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onEditTask(task);
            }}
            className="h-6 w-6 p-0 flex-shrink-0"
          >
            <Edit className="w-3 h-3" />
          </Button>
        </div>
        
        <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
          {task.description}
        </p>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Badge variant="outline" className={getPriorityColor(task.priority)}>
              {task.priority}
            </Badge>
            <span className="text-xs text-muted-foreground">{task.progress}%</span>
          </div>
          
          <Progress value={task.progress} className="h-1" />
          
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {task.dueDate}
            </div>
            <div className="flex items-center gap-1">
              <Avatar className="w-4 h-4">
                <AvatarFallback className="text-xs">
                  {task.avatar}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function KanbanColumn({ 
  status, 
  tasks, 
  onEditTask, 
  onEditColumnTitle, 
  onDeleteColumn 
}: { 
  status: string; 
  tasks: Task[]; 
  onEditTask: (task: Task) => void; 
  onEditColumnTitle: (oldTitle: string, newTitle: string) => void;
  onDeleteColumn: (status: string) => void;
}) {
  const columnTasks = tasks.filter(task => task.status === status);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(status);
  
  const handleSaveTitle = () => {
    if (editTitle.trim() && editTitle !== status) {
      onEditColumnTitle(status, editTitle.trim());
    }
    setIsEditing(false);
    setEditTitle(status);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSaveTitle();
    } else if (e.key === 'Escape') {
      setIsEditing(false);
      setEditTitle(status);
    }
  };
  
  return (
    <div className="flex-1 min-w-[280px]">
      <Card className="h-full">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center justify-between text-sm">
            {isEditing ? (
              <Input
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                onBlur={handleSaveTitle}
                onKeyDown={handleKeyPress}
                className="h-6 text-sm"
                autoFocus
              />
            ) : (
              <span>{status}</span>
            )}
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="ml-2">
                {columnTasks.length}
              </Badge>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                    <MoreHorizontal className="w-3 h-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setIsEditing(true)}>
                    <Edit3 className="w-4 h-4 mr-2" />
                    Edit Title
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => onDeleteColumn(status)}
                    className="text-destructive"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete Column
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0 h-[calc(100%-4rem)] overflow-y-auto">
          <SortableContext items={columnTasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
            {columnTasks.map((task) => (
              <SortableTask key={task.id} task={task} onEditTask={onEditTask} />
            ))}
          </SortableContext>
        </CardContent>
      </Card>
    </div>
  );
}

export function EnhancedTaskKanbanView({ tasks, onEditTask }: TaskKanbanViewProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [columns, setColumns] = useState(["To Do", "In Progress", "Review", "Completed"]);
  const [isAddingColumn, setIsAddingColumn] = useState(false);
  const [newColumnTitle, setNewColumnTitle] = useState("");

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  function handleDragStart(event: DragStartEvent) {
    setActiveId(event.active.id as string);
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    
    if (over) {
      // Update task status based on the column it was dropped into
      console.log("Task", active.id, "dropped over column", over.id);
    }
    
    setActiveId(null);
  }

  const handleAddColumn = () => {
    if (newColumnTitle.trim()) {
      setColumns([...columns, newColumnTitle.trim()]);
      setNewColumnTitle("");
      setIsAddingColumn(false);
    }
  };

  const handleEditColumnTitle = (oldTitle: string, newTitle: string) => {
    setColumns(columns.map(col => col === oldTitle ? newTitle : col));
  };

  const handleDeleteColumn = (status: string) => {
    if (columns.length > 1) {
      setColumns(columns.filter(col => col !== status));
    }
  };

  const activeTask = activeId ? tasks.find(task => task.id === activeId) : null;

  return (
    <div className="h-[70vh]">
      <div className="flex items-center gap-4 mb-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsAddingColumn(true)}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Column
        </Button>
      </div>

      <DndContext 
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart} 
        onDragEnd={handleDragEnd}
      >
        <div className="flex gap-4 h-full overflow-x-auto pb-4">
          {columns.map((status) => (
            <KanbanColumn
              key={status}
              status={status}
              tasks={tasks}
              onEditTask={onEditTask}
              onEditColumnTitle={handleEditColumnTitle}
              onDeleteColumn={handleDeleteColumn}
            />
          ))}
        </div>
        
        <DragOverlay>
          {activeTask ? (
            <SortableTask task={activeTask} onEditTask={onEditTask} />
          ) : null}
        </DragOverlay>
      </DndContext>

      <Dialog open={isAddingColumn} onOpenChange={setIsAddingColumn}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Column</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Input
              placeholder="Column title"
              value={newColumnTitle}
              onChange={(e) => setNewColumnTitle(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddColumn()}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddingColumn(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddColumn}>
              Add Column
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}