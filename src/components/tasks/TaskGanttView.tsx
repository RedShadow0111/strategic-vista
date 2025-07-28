import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Calendar, Clock, BarChart3 } from "lucide-react";
import { InteractiveGanttView } from "./InteractiveGanttView";

interface TaskGanttViewProps {
  tasks: any[];
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "Completed": return "bg-success";
    case "In Progress": return "bg-primary";
    case "Review": return "bg-warning";
    case "To Do": return "bg-muted";
    default: return "bg-secondary";
  }
};

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "High": return "border-l-destructive";
    case "Medium": return "border-l-warning";
    case "Low": return "border-l-success";
    default: return "border-l-secondary";
  }
};

export function TaskGanttView({ tasks }: TaskGanttViewProps) {
  // Calculate date range for the timeline
  const allDates = tasks.flatMap(task => [
    new Date(task.startDate),
    new Date(task.dueDate)
  ]);
  const minDate = new Date(Math.min(...allDates.map(d => d.getTime())));
  const maxDate = new Date(Math.max(...allDates.map(d => d.getTime())));
  
  // Generate timeline days
  const timelineDays = [];
  const currentDate = new Date(minDate);
  while (currentDate <= maxDate) {
    timelineDays.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }

  const getDayPosition = (date: Date) => {
    const totalDays = timelineDays.length;
    const dayIndex = timelineDays.findIndex(d => 
      d.toDateString() === date.toDateString()
    );
    return (dayIndex / totalDays) * 100;
  };

  const getTaskWidth = (startDate: Date, endDate: Date) => {
    const startPos = getDayPosition(startDate);
    const endPos = getDayPosition(endDate);
    return Math.max(endPos - startPos, 2); // Minimum 2% width
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Gantt Chart View
          </CardTitle>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">
                <BarChart3 className="w-4 h-4 mr-2" />
                Интерактивный режим
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-7xl max-h-[90vh]">
              <DialogHeader>
                <DialogTitle>Интерактивная диаграмма Ганта</DialogTitle>
                <DialogDescription>
                  Полнофункциональная диаграмма с зумом, фильтрацией и группировкой
                </DialogDescription>
              </DialogHeader>
              <InteractiveGanttView tasks={tasks} />
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Timeline Header */}
          <div className="flex border-b border-border pb-2">
            <div className="w-80 flex-shrink-0">
              <div className="text-sm font-medium text-muted-foreground">Task</div>
            </div>
            <div className="flex-1 relative">
              <div className="flex justify-between text-xs text-muted-foreground mb-1">
                <span>{minDate.toLocaleDateString()}</span>
                <span>{maxDate.toLocaleDateString()}</span>
              </div>
              <div className="flex">
                {timelineDays.map((day, index) => (
                  <div
                    key={index}
                    className="flex-1 border-r border-border h-8 flex items-end justify-center"
                    style={{ minWidth: '2px' }}
                  >
                    {index % 7 === 0 && (
                      <div className="text-xs text-muted-foreground transform -rotate-45 origin-bottom">
                        {day.getDate()}/{day.getMonth() + 1}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Task Rows */}
          <div className="space-y-2">
            {tasks.map((task) => {
              const startDate = new Date(task.startDate);
              const endDate = new Date(task.dueDate);
              const leftPosition = getDayPosition(startDate);
              const width = getTaskWidth(startDate, endDate);

              return (
                <div key={task.id} className="flex items-center group">
                  {/* Task Info */}
                  <div className="w-80 flex-shrink-0 pr-4">
                    <div className={`border-l-4 ${getPriorityColor(task.priority)} pl-3 py-2`}>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-sm text-foreground">
                          {task.title}
                        </span>
                        <Badge variant="secondary" className={`${getStatusColor(task.status)} text-white`}>
                          {task.status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <Avatar className="w-5 h-5">
                          <AvatarFallback className="text-xs">
                            {task.avatar}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-xs text-muted-foreground">
                          {task.assignee}
                        </span>
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {task.project}
                      </div>
                    </div>
                  </div>

                  {/* Timeline Bar */}
                  <div className="flex-1 relative h-12 border border-border bg-accent/20">
                    <div
                      className={`absolute top-2 h-8 ${getStatusColor(task.status)} rounded opacity-80 group-hover:opacity-100 transition-opacity`}
                      style={{
                        left: `${leftPosition}%`,
                        width: `${width}%`,
                        minWidth: '20px'
                      }}
                    >
                      <div className="flex items-center justify-between h-full px-2 text-white text-xs">
                        <span className="truncate">
                          {task.progress}%
                        </span>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>{task.actualHours}h</span>
                        </div>
                      </div>
                      
                      {/* Progress overlay */}
                      <div
                        className="absolute top-0 left-0 h-full bg-white/30 rounded-l"
                        style={{ width: `${task.progress}%` }}
                      />
                    </div>

                    {/* Milestone indicators */}
                    <div
                      className="absolute top-0 w-1 h-12 bg-primary border-l-2 border-primary"
                      style={{ left: `${leftPosition}%` }}
                      title={`Start: ${task.startDate}`}
                    />
                    <div
                      className="absolute top-0 w-1 h-12 bg-destructive border-r-2 border-destructive"
                      style={{ left: `${leftPosition + width}%` }}
                      title={`Due: ${task.dueDate}`}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Legend */}
          <div className="flex items-center gap-6 pt-4 border-t border-border text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-primary rounded"></div>
              <span>Start Date</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-destructive rounded"></div>
              <span>Due Date</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-white/30 rounded"></div>
              <span>Progress Overlay</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}