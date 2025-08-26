import { Search, Bell, Settings, User, Moon, Sun, Command, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { MyTasksDropdown } from "./MyTasksDropdown";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";

export function AppHeader() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" || "light";
    setTheme(savedTheme);
    document.documentElement.classList.toggle("dark", savedTheme === "dark");
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  const getUserInitials = () => {
    if (!user?.email) return 'U';
    return user.email.charAt(0).toUpperCase();
  };

  const getUserDisplayName = () => {
    return user?.user_metadata?.display_name || user?.email?.split('@')[0] || 'Пользователь';
  };

  return (
    <header className="h-16 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="flex items-center justify-between h-full px-4 gap-4">
        {/* Left section */}
        <div className="flex items-center gap-4">
          <SidebarTrigger className="hover:bg-accent hover:text-accent-foreground rounded-lg p-2 transition-colors" />
          
          {/* Global search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search projects, resources, reports... (⌘K)"
              className="pl-9 pr-12 bg-muted/50 border-border focus:bg-background transition-colors"
            />
            <kbd className="absolute right-3 top-1/2 transform -translate-y-1/2 px-1.5 py-0.5 bg-muted text-xs rounded border">
              ⌘K
            </kbd>
          </div>
        </div>

        {/* Right section */}
        <div className="flex items-center gap-2">
          {/* My Tasks */}
          <MyTasksDropdown />
          
          {/* Theme toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleTheme}
            className="w-9 h-9 p-0 hover:bg-accent rounded-lg"
          >
            {theme === "light" ? (
              <Moon className="w-4 h-4" />
            ) : (
              <Sun className="w-4 h-4" />
            )}
          </Button>

          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="w-9 h-9 p-0 hover:bg-accent rounded-lg relative">
                <Bell className="w-4 h-4" />
                <Badge 
                  variant="destructive" 
                  className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center text-xs"
                >
                  3
                </Badge>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel className="flex items-center justify-between">
                Notifications
                <Badge variant="secondary">3 new</Badge>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="flex-col items-start p-3">
                <div className="font-medium text-sm">Project Alpha delayed</div>
                <div className="text-xs text-muted-foreground">Resource allocation conflict detected</div>
                <div className="text-xs text-muted-foreground mt-1">2 minutes ago</div>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex-col items-start p-3">
                <div className="font-medium text-sm">Budget threshold reached</div>
                <div className="text-xs text-muted-foreground">Project Beta at 85% budget utilization</div>
                <div className="text-xs text-muted-foreground mt-1">1 hour ago</div>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex-col items-start p-3">
                <div className="font-medium text-sm">Risk alert</div>
                <div className="text-xs text-muted-foreground">High risk identified in infrastructure project</div>
                <div className="text-xs text-muted-foreground mt-1">3 hours ago</div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User menu */}
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-9 px-3 hover:bg-accent rounded-lg gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={user.user_metadata?.avatar_url} alt="Аватар" />
                    <AvatarFallback className="text-xs">{getUserInitials()}</AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium hidden sm:inline">{getUserDisplayName()}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{getUserDisplayName()}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className="w-4 h-4 mr-2" />
                  Профиль
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="w-4 h-4 mr-2" />
                  Настройки
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Выйти
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link to="/auth">
              <Button variant="outline" size="sm" className="gap-2">
                <User className="w-4 h-4" />
                Войти
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}