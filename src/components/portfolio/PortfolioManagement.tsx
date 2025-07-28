import { useState } from "react";
import { Plus, Edit, Trash2, FolderOpen, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { DndContext, DragEndEvent, closestCenter } from "@dnd-kit/core";
import { SortableContext, useSortable, verticalListSortingStrategy, arrayMove } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface Portfolio {
  id: string;
  name: string;
  description: string;
  color: string;
  projectCount: number;
  budget: number;
}

interface Project {
  id: string;
  name: string;
  portfolioId: string;
  status: string;
  budget: number;
}

const initialPortfolios: Portfolio[] = [
  {
    id: "1",
    name: "Digital Innovation",
    description: "Projects focused on digital transformation and innovation",
    color: "bg-blue-500",
    projectCount: 4,
    budget: 12.5
  },
  {
    id: "2", 
    name: "Infrastructure",
    description: "Core infrastructure and platform projects",
    color: "bg-green-500",
    projectCount: 3,
    budget: 8.2
  },
  {
    id: "3",
    name: "Customer Experience", 
    description: "Customer-facing applications and services",
    color: "bg-purple-500",
    projectCount: 2,
    budget: 6.3
  }
];

const initialProjects: Project[] = [
  { id: "1", name: "Digital Transformation", portfolioId: "1", status: "on-track", budget: 2.5 },
  { id: "2", name: "Infrastructure Upgrade", portfolioId: "2", status: "at-risk", budget: 4.2 },
  { id: "3", name: "Mobile App Platform", portfolioId: "3", status: "on-track", budget: 1.8 },
  { id: "4", name: "Data Analytics Suite", portfolioId: "1", status: "delayed", budget: 3.1 },
  { id: "5", name: "Security Enhancement", portfolioId: "2", status: "on-track", budget: 1.2 },
  { id: "6", name: "Cloud Migration", portfolioId: "1", status: "completed", budget: 2.8 },
];

function DraggableProject({ project, portfolios }: { project: Project; portfolios: Portfolio[] }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: project.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const portfolio = portfolios.find(p => p.id === project.portfolioId);

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`cursor-grab active:cursor-grabbing transition-all ${
        isDragging ? "opacity-50 scale-105" : ""
      }`}
    >
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-foreground truncate">{project.name}</h4>
              <div className="flex items-center gap-2 mt-1">
                <div className={`w-3 h-3 rounded-full ${portfolio?.color}`}></div>
                <span className="text-sm text-muted-foreground">{portfolio?.name}</span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium">${project.budget}M</p>
              <Badge variant="secondary" className="text-xs">{project.status}</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export function PortfolioManagement() {
  const [portfolios, setPortfolios] = useState<Portfolio[]>(initialPortfolios);
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingPortfolio, setEditingPortfolio] = useState<Portfolio | null>(null);
  const [newPortfolio, setNewPortfolio] = useState({
    name: "",
    description: "",
    color: "bg-blue-500"
  });

  const colors = [
    "bg-blue-500",
    "bg-green-500", 
    "bg-purple-500",
    "bg-red-500",
    "bg-yellow-500",
    "bg-indigo-500",
    "bg-pink-500",
    "bg-gray-500"
  ];

  const handleCreatePortfolio = () => {
    const portfolio: Portfolio = {
      id: Date.now().toString(),
      name: newPortfolio.name,
      description: newPortfolio.description,
      color: newPortfolio.color,
      projectCount: 0,
      budget: 0
    };
    
    setPortfolios([...portfolios, portfolio]);
    setNewPortfolio({ name: "", description: "", color: "bg-blue-500" });
    setIsCreateDialogOpen(false);
  };

  const handleEditPortfolio = (portfolio: Portfolio) => {
    setEditingPortfolio(portfolio);
    setNewPortfolio({
      name: portfolio.name,
      description: portfolio.description,
      color: portfolio.color
    });
  };

  const handleUpdatePortfolio = () => {
    if (!editingPortfolio) return;
    
    setPortfolios(portfolios.map(p => 
      p.id === editingPortfolio.id 
        ? { ...p, ...newPortfolio }
        : p
    ));
    
    setEditingPortfolio(null);
    setNewPortfolio({ name: "", description: "", color: "bg-blue-500" });
  };

  const handleDeletePortfolio = (portfolioId: string) => {
    setPortfolios(portfolios.filter(p => p.id !== portfolioId));
    // Move projects to "Unassigned" portfolio or first available portfolio
    setProjects(projects.map(project => 
      project.portfolioId === portfolioId 
        ? { ...project, portfolioId: portfolios[0]?.id || "1" }
        : project
    ));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over) return;
    
    const projectId = active.id as string;
    const newPortfolioId = over.id as string;
    
    // If dropping on a portfolio
    if (portfolios.find(p => p.id === newPortfolioId)) {
      setProjects(projects.map(project =>
        project.id === projectId
          ? { ...project, portfolioId: newPortfolioId }
          : project
      ));
    }
  };

  const getPortfolioProjects = (portfolioId: string) => {
    return projects.filter(p => p.portfolioId === portfolioId);
  };

  const updatePortfolioStats = (portfolio: Portfolio) => {
    const portfolioProjects = getPortfolioProjects(portfolio.id);
    return {
      ...portfolio,
      projectCount: portfolioProjects.length,
      budget: portfolioProjects.reduce((sum, p) => sum + p.budget, 0)
    };
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-sf font-bold text-foreground">Portfolio Management</h2>
          <p className="text-muted-foreground mt-1">
            Organize and manage your project portfolios
          </p>
        </div>
        
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Create Portfolio
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Portfolio</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Portfolio Name</Label>
                <Input
                  id="name"
                  value={newPortfolio.name}
                  onChange={(e) => setNewPortfolio({ ...newPortfolio, name: e.target.value })}
                  placeholder="Enter portfolio name"
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newPortfolio.description}
                  onChange={(e) => setNewPortfolio({ ...newPortfolio, description: e.target.value })}
                  placeholder="Enter portfolio description"
                />
              </div>
              <div>
                <Label>Color</Label>
                <div className="flex gap-2 mt-2">
                  {colors.map((color) => (
                    <button
                      key={color}
                      className={`w-8 h-8 rounded-full ${color} border-2 ${
                        newPortfolio.color === color ? "border-foreground" : "border-transparent"
                      }`}
                      onClick={() => setNewPortfolio({ ...newPortfolio, color })}
                    />
                  ))}
                </div>
              </div>
              <div className="flex gap-2">
                <Button onClick={handleCreatePortfolio} className="flex-1">
                  Create Portfolio
                </Button>
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Portfolio Cards */}
          {portfolios.map((portfolio) => {
            const updatedPortfolio = updatePortfolioStats(portfolio);
            const portfolioProjects = getPortfolioProjects(portfolio.id);
            
            return (
              <SortableContext key={portfolio.id} items={[portfolio.id]} strategy={verticalListSortingStrategy}>
                <div
                  className="border-2 border-dashed border-border/50 rounded-lg p-4 min-h-[200px] hover:border-primary/50 transition-colors"
                  id={portfolio.id}
                >
                  <Card className="mb-4">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-4 h-4 rounded-full ${portfolio.color}`}></div>
                          <div>
                            <CardTitle className="text-lg">{portfolio.name}</CardTitle>
                            <p className="text-sm text-muted-foreground">{portfolio.description}</p>
                          </div>
                        </div>
                        
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem onClick={() => handleEditPortfolio(portfolio)}>
                              <Edit className="w-4 h-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleDeletePortfolio(portfolio.id)}
                              className="text-destructive"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Projects: {updatedPortfolio.projectCount}</span>
                        <span className="font-medium">${updatedPortfolio.budget.toFixed(1)}M</span>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Projects in this portfolio */}
                  <div className="space-y-2">
                    <SortableContext items={portfolioProjects.map(p => p.id)} strategy={verticalListSortingStrategy}>
                      {portfolioProjects.map((project) => (
                        <DraggableProject key={project.id} project={project} portfolios={portfolios} />
                      ))}
                    </SortableContext>
                    {portfolioProjects.length === 0 && (
                      <div className="text-center py-8 text-muted-foreground">
                        <FolderOpen className="w-8 h-8 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">No projects in this portfolio</p>
                        <p className="text-xs">Drag projects here to organize them</p>
                      </div>
                    )}
                  </div>
                </div>
              </SortableContext>
            );
          })}
        </div>
      </DndContext>

      {/* Edit Portfolio Dialog */}
      <Dialog open={!!editingPortfolio} onOpenChange={() => setEditingPortfolio(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Portfolio</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-name">Portfolio Name</Label>
              <Input
                id="edit-name"
                value={newPortfolio.name}
                onChange={(e) => setNewPortfolio({ ...newPortfolio, name: e.target.value })}
                placeholder="Enter portfolio name"
              />
            </div>
            <div>
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={newPortfolio.description}
                onChange={(e) => setNewPortfolio({ ...newPortfolio, description: e.target.value })}
                placeholder="Enter portfolio description"
              />
            </div>
            <div>
              <Label>Color</Label>
              <div className="flex gap-2 mt-2">
                {colors.map((color) => (
                  <button
                    key={color}
                    className={`w-8 h-8 rounded-full ${color} border-2 ${
                      newPortfolio.color === color ? "border-foreground" : "border-transparent"
                    }`}
                    onClick={() => setNewPortfolio({ ...newPortfolio, color })}
                  />
                ))}
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleUpdatePortfolio} className="flex-1">
                Update Portfolio
              </Button>
              <Button variant="outline" onClick={() => setEditingPortfolio(null)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}