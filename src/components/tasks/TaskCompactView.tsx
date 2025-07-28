import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Edit, Settings, Calendar, Clock, User, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";

interface TaskCompactViewProps {
  tasks: any[];
  onEditTask: (task: any) => void;
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

export function TaskCompactView({ tasks, onEditTask }: TaskCompactViewProps) {
  const [visibleColumns, setVisibleColumns] = useState({
    title: true,
    status: true,
    priority: true,
    assignee: true,
    project: true,
    progress: true,
    dueDate: true,
    startDate: false,
    estimatedHours: false,
    actualHours: false,
    tags: false,
    actions: true
  });

  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const columnOptions = [
    { key: "title", label: "Title" },
    { key: "status", label: "Status" },
    { key: "priority", label: "Priority" },
    { key: "assignee", label: "Assignee" },
    { key: "project", label: "Project" },
    { key: "progress", label: "Progress" },
    { key: "dueDate", label: "Due Date" },
    { key: "startDate", label: "Start Date" },
    { key: "estimatedHours", label: "Est. Hours" },
    { key: "actualHours", label: "Actual Hours" },
    { key: "tags", label: "Tags" },
    { key: "actions", label: "Actions" }
  ];

  const toggleColumn = (key: string) => {
    setVisibleColumns(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getSortIcon = (field: string) => {
    if (sortField !== field) return <ArrowUpDown className="w-3 h-3" />;
    return sortDirection === 'asc' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />;
  };

  const sortedTasks = [...tasks].sort((a, b) => {
    if (!sortField) return 0;
    
    let aValue = a[sortField];
    let bValue = b[sortField];
    
    // Handle different data types
    if (sortField === 'progress') {
      aValue = Number(aValue);
      bValue = Number(bValue);
    } else if (sortField === 'dueDate' || sortField === 'startDate') {
      aValue = new Date(aValue);
      bValue = new Date(bValue);
    } else if (typeof aValue === 'string') {
      aValue = aValue.toLowerCase();
      bValue = bValue.toLowerCase();
    }
    
    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            Tasks - Compact View
          </CardTitle>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4 mr-2" />
                Columns
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              {columnOptions.map((column) => (
                <DropdownMenuCheckboxItem
                  key={column.key}
                  checked={visibleColumns[column.key as keyof typeof visibleColumns]}
                  onCheckedChange={() => toggleColumn(column.key)}
                >
                  {column.label}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              {visibleColumns.title && (
                <TableHead>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleSort('title')}
                    className="h-auto p-1 font-medium"
                  >
                    Title {getSortIcon('title')}
                  </Button>
                </TableHead>
              )}
              {visibleColumns.status && (
                <TableHead>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleSort('status')}
                    className="h-auto p-1 font-medium"
                  >
                    Status {getSortIcon('status')}
                  </Button>
                </TableHead>
              )}
              {visibleColumns.priority && (
                <TableHead>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleSort('priority')}
                    className="h-auto p-1 font-medium"
                  >
                    Priority {getSortIcon('priority')}
                  </Button>
                </TableHead>
              )}
              {visibleColumns.assignee && (
                <TableHead>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleSort('assignee')}
                    className="h-auto p-1 font-medium"
                  >
                    Assignee {getSortIcon('assignee')}
                  </Button>
                </TableHead>
              )}
              {visibleColumns.project && (
                <TableHead>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleSort('project')}
                    className="h-auto p-1 font-medium"
                  >
                    Project {getSortIcon('project')}
                  </Button>
                </TableHead>
              )}
              {visibleColumns.progress && (
                <TableHead>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleSort('progress')}
                    className="h-auto p-1 font-medium"
                  >
                    Progress {getSortIcon('progress')}
                  </Button>
                </TableHead>
              )}
              {visibleColumns.dueDate && (
                <TableHead>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleSort('dueDate')}
                    className="h-auto p-1 font-medium"
                  >
                    Due Date {getSortIcon('dueDate')}
                  </Button>
                </TableHead>
              )}
              {visibleColumns.startDate && (
                <TableHead>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleSort('startDate')}
                    className="h-auto p-1 font-medium"
                  >
                    Start Date {getSortIcon('startDate')}
                  </Button>
                </TableHead>
              )}
              {visibleColumns.estimatedHours && <TableHead>Est. Hours</TableHead>}
              {visibleColumns.actualHours && <TableHead>Actual Hours</TableHead>}
              {visibleColumns.tags && <TableHead>Tags</TableHead>}
              {visibleColumns.actions && <TableHead>Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedTasks.map((task) => (
              <TableRow key={task.id} className="hover:bg-accent/50">
                {visibleColumns.title && (
                  <TableCell className="font-medium">
                    <div>
                      <div className="font-medium text-foreground">{task.title}</div>
                      <div className="text-xs text-muted-foreground truncate max-w-xs">
                        {task.description}
                      </div>
                    </div>
                  </TableCell>
                )}
                {visibleColumns.status && (
                  <TableCell>
                    <Badge variant="secondary" className={getStatusColor(task.status)}>
                      {task.status}
                    </Badge>
                  </TableCell>
                )}
                {visibleColumns.priority && (
                  <TableCell>
                    <Badge variant="outline" className={getPriorityColor(task.priority)}>
                      {task.priority}
                    </Badge>
                  </TableCell>
                )}
                {visibleColumns.assignee && (
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar className="w-6 h-6">
                        <AvatarFallback className="text-xs">
                          {task.avatar}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm">{task.assignee}</span>
                    </div>
                  </TableCell>
                )}
                {visibleColumns.project && (
                  <TableCell className="text-sm text-muted-foreground">
                    {task.project}
                  </TableCell>
                )}
                {visibleColumns.progress && (
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Progress value={task.progress} className="w-16 h-2" />
                      <span className="text-xs font-medium w-8">{task.progress}%</span>
                    </div>
                  </TableCell>
                )}
                {visibleColumns.dueDate && (
                  <TableCell className="text-sm">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-muted-foreground" />
                      {task.dueDate}
                    </div>
                  </TableCell>
                )}
                {visibleColumns.startDate && (
                  <TableCell className="text-sm">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-muted-foreground" />
                      {task.startDate}
                    </div>
                  </TableCell>
                )}
                {visibleColumns.estimatedHours && (
                  <TableCell className="text-sm">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-muted-foreground" />
                      {task.estimatedHours}h
                    </div>
                  </TableCell>
                )}
                {visibleColumns.actualHours && (
                  <TableCell className="text-sm">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-muted-foreground" />
                      {task.actualHours}h
                    </div>
                  </TableCell>
                )}
                {visibleColumns.tags && (
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {task.tags.slice(0, 2).map((tag: string, index: number) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {task.tags.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{task.tags.length - 2}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                )}
                {visibleColumns.actions && (
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEditTask(task)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}