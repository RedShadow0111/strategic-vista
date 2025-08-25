import { useState } from "react";
import { DndContext, DragEndEvent, closestCenter } from "@dnd-kit/core";
import { SortableContext, useSortable, verticalListSortingStrategy, arrayMove } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";
import { PortfolioPulse } from "@/components/dashboard/PortfolioPulse";
import { ProjectStatusMap } from "@/components/dashboard/ProjectStatusMap";
import { ResourceHeatmap } from "@/components/dashboard/ResourceHeatmap";
import { PredictiveTimeline } from "@/components/dashboard/PredictiveTimeline";
import { CashFlowForecast } from "@/components/dashboard/CashFlowForecast";
import { AIAlertsPanel } from "@/components/dashboard/AIAlertsPanel";

interface DashboardItem {
  id: string;
  component: React.ComponentType<{ dragHandle?: React.ReactNode }>;
}

function SortableWidget({ id, children }: { id: string; children: React.ReactNode }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      {children}
    </div>
  );
}

const Index = () => {
  const [dashboardItems, setDashboardItems] = useState<DashboardItem[]>([
    { id: "portfolio-pulse", component: PortfolioPulse },
    { id: "project-status", component: ProjectStatusMap },
    { id: "predictive-timeline", component: PredictiveTimeline },
    { id: "cash-flow", component: CashFlowForecast },
    { id: "resource-heatmap", component: ResourceHeatmap },
    { id: "ai-alerts", component: AIAlertsPanel },
  ]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setDashboardItems((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);

        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard</h1>
        <p className="text-muted-foreground">
          Executive overview of portfolio health and key performance indicators
        </p>
      </div>

      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={dashboardItems.map(item => item.id)} strategy={verticalListSortingStrategy}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 auto-rows-fr">
            {dashboardItems.map((item) => {
              const Component = item.component;
              return (
                <SortableWidget key={item.id} id={item.id}>
                  <div className="h-full transform transition-all duration-200 ease-out hover:scale-[1.02] hover:shadow-lg">
                    <Component 
                      dragHandle={<GripVertical className="w-4 h-4 text-muted-foreground hover:text-foreground transition-colors" />}
                    />
                  </div>
                </SortableWidget>
              );
            })}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
};

export default Index;
