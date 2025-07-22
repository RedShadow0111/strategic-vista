import { 
  LayoutDashboard, 
  FolderOpen, 
  FileStack, 
  Users, 
  BarChart3, 
  FileText,
  ChevronDown,
  Search
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
          <SidebarGroupLabel className={cn(!collapsed && "px-2 py-1 text-xs font-medium text-muted-foreground")}>
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
                          "hover:bg-accent hover:text-accent-foreground",
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
      </SidebarContent>
    </Sidebar>
  );
}