import { AppLayout } from "@/components/layout/AppLayout";
import { PortfolioPulse } from "@/components/dashboard/PortfolioPulse";
import { ProjectStatusMap } from "@/components/dashboard/ProjectStatusMap";
import { ResourceHeatmap } from "@/components/dashboard/ResourceHeatmap";

const Index = () => {
  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-sf font-bold text-foreground">Dashboard</h1>
            <p className="text-muted-foreground">Portfolio overview and key performance indicators</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <PortfolioPulse />
          <ProjectStatusMap />
          <ResourceHeatmap />
        </div>
      </div>
    </AppLayout>
  );
};

export default Index;
