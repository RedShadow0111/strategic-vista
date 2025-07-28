import { JobBoard as JobBoardComponent } from "@/components/external-tasks/JobBoard";

const JobBoard = () => {
  return (
    <div className="space-y-6">
      <div className="border-b border-border pb-4">
        <h1 className="text-3xl font-sf font-bold text-foreground">Биржа заданий</h1>
        <p className="text-muted-foreground mt-2">
          Управление внешними исполнителями и заданиями
        </p>
      </div>
      
      <JobBoardComponent />
    </div>
  );
};

export default JobBoard;