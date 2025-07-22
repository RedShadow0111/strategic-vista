import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { AppHeader } from "./AppHeader";
import { Toaster } from "@/components/ui/toaster";
import { cn } from "@/lib/utils";

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        
        <div className="flex-1 flex flex-col min-w-0">
          <AppHeader />
          
          <main className="flex-1 p-6 bg-background">
            <div className="max-w-none mx-auto animate-fade-in">
              {children}
            </div>
          </main>
        </div>
      </div>
      
      <Toaster />
    </SidebarProvider>
  );
}