import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface DashboardWidgetProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
  children: React.ReactNode;
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
}

export function DashboardWidget({ 
  title, 
  description, 
  icon: Icon, 
  children, 
  className,
  size = "md" 
}: DashboardWidgetProps) {
  return (
    <Card className={cn(
      "group hover:shadow-apple-lg transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1",
      "bg-gradient-to-br from-card to-card/50 backdrop-blur-sm border-border/50",
      {
        "col-span-1": size === "sm",
        "col-span-1 md:col-span-2": size === "md", 
        "col-span-1 md:col-span-2 lg:col-span-3": size === "lg",
        "col-span-full": size === "xl"
      },
      className
    )}>
      <CardHeader className="pb-3">
        <div className="flex items-center gap-3">
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
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        {children}
      </CardContent>
    </Card>
  );
}