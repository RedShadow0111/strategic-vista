import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Calendar, User, Briefcase, TrendingUp, TrendingDown } from "lucide-react";

interface ResourceHistoryDialogProps {
  resource: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const historyData = [
  {
    date: "2024-01-15",
    type: "project_assignment",
    title: "Assigned to Digital Transformation",
    description: "Allocated 60% capacity as Senior Project Manager",
    status: "active"
  },
  {
    date: "2024-01-10",
    type: "skill_update",
    title: "New certification: PMP",
    description: "Added Project Management Professional certification",
    status: "completed"
  },
  {
    date: "2023-12-01",
    type: "promotion",
    title: "Promoted to Senior Project Manager",
    description: "Promotion from Project Manager to Senior PM level",
    status: "completed"
  },
  {
    date: "2023-11-15",
    type: "project_completion",
    title: "Completed Portal Redesign project",
    description: "Successfully delivered on time and under budget",
    status: "completed"
  },
  {
    date: "2023-10-01",
    type: "capacity_change",
    title: "Capacity increased to 40h/week",
    description: "Increased from part-time to full-time",
    status: "completed"
  }
];

const getEventIcon = (type: string) => {
  switch (type) {
    case "project_assignment":
      return <Briefcase className="w-4 h-4" />;
    case "skill_update":
      return <TrendingUp className="w-4 h-4" />;
    case "promotion":
      return <User className="w-4 h-4" />;
    case "project_completion":
      return <Calendar className="w-4 h-4" />;
    case "capacity_change":
      return <TrendingDown className="w-4 h-4" />;
    default:
      return <Calendar className="w-4 h-4" />;
  }
};

const getEventColor = (type: string) => {
  switch (type) {
    case "project_assignment":
      return "text-primary";
    case "skill_update":
      return "text-success";
    case "promotion":
      return "text-warning";
    case "project_completion":
      return "text-success";
    case "capacity_change":
      return "text-primary";
    default:
      return "text-muted-foreground";
  }
};

export function ResourceHistoryDialog({ resource, open, onOpenChange }: ResourceHistoryDialogProps) {
  if (!resource) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Resource History - {resource.name}</DialogTitle>
        </DialogHeader>

        <ScrollArea className="h-96">
          <div className="space-y-4">
            {historyData.map((event, index) => (
              <Card key={index} className="border-l-4 border-l-primary/20">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className={`${getEventColor(event.type)} mt-1`}>
                      {getEventIcon(event.type)}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-medium text-foreground">{event.title}</h4>
                        <div className="text-sm text-muted-foreground">{event.date}</div>
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-2">
                        {event.description}
                      </p>
                      
                      <Badge 
                        variant={event.status === "active" ? "default" : "secondary"}
                        className="text-xs"
                      >
                        {event.status}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>

        <Separator />
        
        <div className="space-y-3">
          <h4 className="font-medium">Current Status</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Total Projects: </span>
              <span className="font-medium">8</span>
            </div>
            <div>
              <span className="text-muted-foreground">Avg Rating: </span>
              <span className="font-medium">4.7/5</span>
            </div>
            <div>
              <span className="text-muted-foreground">Years Experience: </span>
              <span className="font-medium">3.5</span>
            </div>
            <div>
              <span className="text-muted-foreground">Certifications: </span>
              <span className="font-medium">2</span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}