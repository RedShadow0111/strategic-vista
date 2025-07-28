import { useState } from "react";
import { 
  LayoutDashboard, 
  FolderOpen, 
  FileStack, 
  Users, 
  BarChart3, 
  FileText,
  ChevronDown,
  Search,
  MessageSquare,
  Bot,
  Briefcase
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  useSidebar,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { AiAssistantChat } from "@/components/ai-assistant/AiAssistantChat";
import { JobBoard } from "@/components/external-tasks/JobBoard";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const navigationItems = [
  {
    title: "Dashboard",
    url: "/",
    icon: LayoutDashboard,
    description: "Portfolio overview & KPIs"
  },
  {
    title: "Portfolio",
    url: "/portfolio",
    icon: FolderOpen,
    description: "Project matrix & optimization"
  },
  {
    title: "Projects",
    url: "/projects",
    icon: FileStack,
    description: "Project management & scheduling"
  },
  {
    title: "Tasks",
    url: "/tasks",
    icon: FileStack,
    description: "Task management & tracking"
  },
  {
    title: "Resources",
    url: "/resources",
    icon: Users,
    description: "Team capacity & skills"
  },
  {
    title: "Analytics",
    url: "/analytics",
    icon: BarChart3,
    description: "Predictive insights & trends"
  },
  {
    title: "Reports",
    url: "/reports",
    icon: FileText,
    description: "Custom reports & exports"
  },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  const collapsed = state === "collapsed";
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isChatMinimized, setIsChatMinimized] = useState(false);
  const [isJobBoardOpen, setIsJobBoardOpen] = useState(false);

  const isActive = (path: string) => {
    if (path === "/") {
      return currentPath === "/";
    }
    return currentPath.startsWith(path);
  };

  return (
    <Sidebar
      className={cn(
        "border-r border-border transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
      collapsible="icon"
    >
      <SidebarHeader className="p-4 border-b border-border">
        {!collapsed && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center">
              <LayoutDashboard className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="font-sf font-semibold text-foreground">PPM Suite</h2>
              <p className="text-xs text-muted-foreground">Project Portfolio</p>
            </div>
          </div>
        )}
        {collapsed && (
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center mx-auto">
            <LayoutDashboard className="w-4 h-4 text-white" />
          </div>
        )}
      </SidebarHeader>

      <SidebarContent className="p-2">
        <SidebarGroup>
          <SidebarGroupLabel className={cn(!collapsed && "px-2 py-1 text-xs font-medium text-sidebar-foreground/70")}>
            {!collapsed && "Main Navigation"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="w-full">
                    <NavLink
                      to={item.url}
                      className={({ isActive: navActive }) =>
                        cn(
                          "flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 group",
                          "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                          (isActive(item.url) || navActive) && 
                            "bg-primary text-primary-foreground shadow-apple-sm font-medium"
                        )
                      }
                    >
                      <item.icon className={cn(
                        "w-5 h-5 transition-transform duration-200", 
                        "group-hover:scale-110"
                      )} />
                      {!collapsed && (
                        <div className="flex-1 min-w-0">
                          <div className="font-sf font-medium text-sm">{item.title}</div>
                          <div className="text-xs opacity-70 truncate">{item.description}</div>
                        </div>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Additional Tools */}
        <SidebarGroup className="mt-auto">
          <SidebarGroupContent>
            <SidebarMenu>
              {/* Job Board */}
              <SidebarMenuItem>
                <SidebarMenuButton 
                  onClick={() => setIsJobBoardOpen(true)}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 group",
                    "text-sidebar-foreground hover:bg-gradient-to-r hover:from-secondary/10 hover:to-secondary-glow/10",
                    "hover:text-secondary font-medium"
                  )}
                >
                  <div className="relative">
                    <Briefcase className="w-5 h-5" />
                  </div>
                  {!collapsed && (
                    <div className="flex-1 min-w-0">
                      <div className="font-sf font-medium text-sm">Биржа заданий</div>
                      <div className="text-xs opacity-70 truncate">Внешние исполнители</div>
                    </div>
                  )}
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              {/* AI Assistant */}
              <SidebarMenuItem>
                <SidebarMenuButton 
                  onClick={() => setIsChatOpen(!isChatOpen)}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 group",
                    "text-sidebar-foreground hover:bg-gradient-to-r hover:from-primary/10 hover:to-primary-glow/10",
                    "hover:text-primary font-medium"
                  )}
                >
                  <div className="relative">
                    <Bot className="w-5 h-5" />
                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-success rounded-full animate-pulse"></div>
                  </div>
                  {!collapsed && (
                    <div className="flex-1 min-w-0">
                      <div className="font-sf font-medium text-sm">AI Помощник</div>
                      <div className="text-xs opacity-70 truncate">Задайте вопрос</div>
                    </div>
                  )}
                  {!collapsed && (
                    <MessageSquare className="w-4 h-4 opacity-50" />
                  )}
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Плавающая кнопка AI когда sidebar свернут */}
      {collapsed && !isChatOpen && (
        <Button
          onClick={() => setIsChatOpen(true)}
          className="fixed bottom-4 left-4 w-12 h-12 rounded-full bg-gradient-to-r from-primary to-primary-glow shadow-lg hover:shadow-xl transition-all duration-300 z-40"
          size="sm"
        >
          <Bot className="w-5 h-5 text-white" />
        </Button>
      )}

      {/* Минимизированный чат */}
      {isChatMinimized && (
        <Button
          onClick={() => {
            setIsChatMinimized(false);
            setIsChatOpen(true);
          }}
          className="fixed bottom-4 right-4 bg-gradient-to-r from-primary to-primary-glow shadow-lg hover:shadow-xl transition-all duration-300 z-40"
          size="sm"
        >
          <MessageSquare className="w-4 h-4 mr-2 text-white" />
          <span className="text-white">AI Помощник</span>
        </Button>
      )}

      {/* Job Board Dialog */}
      <Dialog open={isJobBoardOpen} onOpenChange={setIsJobBoardOpen}>
        <DialogContent className="max-w-7xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>Биржа заданий</DialogTitle>
          </DialogHeader>
          <JobBoard />
        </DialogContent>
      </Dialog>

      {/* AI Assistant Chat */}
      <AiAssistantChat 
        isOpen={isChatOpen && !isChatMinimized}
        onToggle={() => setIsChatOpen(!isChatOpen)}
        onMinimize={() => {
          setIsChatMinimized(true);
          setIsChatOpen(false);
        }}
      />
    </Sidebar>
  );
}