import { PortfolioPulse } from "@/components/dashboard/PortfolioPulse";
import { ProjectStatusMap } from "@/components/dashboard/ProjectStatusMap";
import { ResourceHeatmap } from "@/components/dashboard/ResourceHeatmap";

const Index = () => {
  return (
    <div className="space-y-6">        
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <PortfolioPulse />
        <ProjectStatusMap />
        <ResourceHeatmap />
      </div>
    </div>
  );
};

export default Index;
