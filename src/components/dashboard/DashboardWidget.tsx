import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LucideIcon, Maximize2, Minimize2, GripVertical } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useState } from "react";

interface DashboardWidgetProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
  children: React.ReactNode;
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  dragHandle?: React.ReactNode;
  isDragging?: boolean;
}

export function DashboardWidget({ 
  title, 
  description, 
  icon: Icon, 
  children, 
  className,
  size = "md",
  dragHandle,
  isDragging = false
}: DashboardWidgetProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);

  return (
    <>
      <Card className={cn(
        "group hover:shadow-apple-lg transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1",
        "bg-gradient-to-br from-card to-card/50 backdrop-blur-sm border-border/50",
        {
          "col-span-1": size === "sm",
          "col-span-1 md:col-span-2": size === "md", 
          "col-span-1 md:col-span-2 lg:col-span-3": size === "lg",
          "col-span-full": size === "xl"
        },
        isDragging && "opacity-50 rotate-2 scale-105 shadow-2xl",
        className
      )}>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-3">
            {dragHandle && (
              <div className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground transition-colors">
                {dragHandle}
              </div>
            )}
            {Icon && (
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <Icon className="w-5 h-5 text-primary" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <CardTitle className="font-sf text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                {title}
              </CardTitle>
              {description && (
                <CardDescription className="text-sm text-muted-foreground mt-1">
                  {description}
                </CardDescription>
              )}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsFullscreen(true)}
              className="opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Maximize2 className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="pt-0">
          {children}
        </CardContent>
      </Card>

      {/* Fullscreen Dialog */}
      <Dialog open={isFullscreen} onOpenChange={setIsFullscreen}>
        <DialogContent className="max-w-[95vw] max-h-[95vh] w-full h-full">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              {Icon && (
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
              )}
              <div>
                <h2 className="text-xl font-sf font-semibold text-foreground">{title}</h2>
                {description && (
                  <p className="text-sm text-muted-foreground mt-1">{description}</p>
                )}
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsFullscreen(false)}
            >
              <Minimize2 className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex-1 overflow-auto">
            {children}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}