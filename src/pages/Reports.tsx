import { useState } from "react";
import { 
  FileText, 
  Download, 
  Filter, 
  Calendar, 
  BarChart3, 
  TrendingUp, 
  Users, 
  Clock,
  CheckCircle,
  AlertTriangle,
  DollarSign,
  Target
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DashboardWidget } from "@/components/dashboard/DashboardWidget";

const reportTypes = [
  {
    id: "portfolio",
    title: "Portfolio Performance Report",
    description: "Complete overview of portfolio performance and KPIs",
    icon: BarChart3,
    lastGenerated: "2 hours ago",
    frequency: "Daily"
  },
  {
    id: "project",
    title: "Project Status Report", 
    description: "Detailed status of all active projects",
    icon: FileText,
    lastGenerated: "1 day ago",
    frequency: "Weekly"
  },
  {
    id: "resource",
    title: "Resource Utilization Report",
    description: "Team capacity and resource allocation analysis",
    icon: Users,
    lastGenerated: "3 hours ago", 
    frequency: "Daily"
  },
  {
    id: "financial",
    title: "Financial Summary Report",
    description: "Budget tracking and financial performance",
    icon: DollarSign,
    lastGenerated: "1 week ago",
    frequency: "Monthly"
  }
];

const portfolioMetrics = [
  { label: "Active Projects", value: "24", change: "+3", trend: "up" },
  { label: "Completed Projects", value: "156", change: "+12", trend: "up" },
  { label: "Total Budget", value: "$2.4M", change: "+8%", trend: "up" },
  { label: "Team Members", value: "89", change: "+5", trend: "up" }
];

const projectStatusData = [
  { status: "On Track", count: 18, percentage: 75, color: "bg-green-500" },
  { status: "At Risk", count: 4, percentage: 17, color: "bg-yellow-500" },
  { status: "Delayed", count: 2, percentage: 8, color: "bg-red-500" }
];

export default function Reports() {
  const [selectedPeriod, setSelectedPeriod] = useState("30d");
  const [selectedTab, setSelectedTab] = useState("overview");

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-sf font-bold text-foreground">Reports</h1>
          <p className="text-muted-foreground">
            Comprehensive reports and analytics for portfolio management
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          
          <Button size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export All
          </Button>
        </div>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
          <TabsTrigger value="financial">Financial</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {portfolioMetrics.map((metric) => (
              <Card key={metric.label} className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{metric.label}</p>
                    <p className="text-2xl font-bold text-foreground">{metric.value}</p>
                  </div>
                  <div className="flex items-center gap-1 text-sm">
                    <TrendingUp className="w-4 h-4 text-green-500" />
                    <span className="text-green-500 font-medium">{metric.change}</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Available Reports */}
          <DashboardWidget 
            title="Available Reports" 
            description="Generate and download reports"
            icon={FileText}
            size="xl"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {reportTypes.map((report) => (
                <Card key={report.id} className="p-4 hover:shadow-apple-md transition-shadow cursor-pointer group">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <report.icon className="w-5 h-5 text-primary" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h4 className="font-sf font-semibold text-foreground group-hover:text-primary transition-colors">
                        {report.title}
                      </h4>
                      <p className="text-sm text-muted-foreground mb-2">
                        {report.description}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span>Last: {report.lastGenerated}</span>
                          <Badge variant="outline" className="text-xs">
                            {report.frequency}
                          </Badge>
                        </div>
                        
                        <Button variant="ghost" size="sm">
                          <Download className="w-4 h-4 mr-1" />
                          Generate
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </DashboardWidget>
        </TabsContent>

        <TabsContent value="projects" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Project Status Distribution */}
            <DashboardWidget title="Project Status Distribution" icon={Target} size="md">
              <div className="space-y-4">
                {projectStatusData.map((item) => (
                  <div key={item.status} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium text-foreground">{item.status}</span>
                      <span className="text-muted-foreground">{item.count} projects</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Progress value={item.percentage} className="flex-1" />
                      <span className="text-sm font-medium text-foreground w-10 text-right">
                        {item.percentage}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </DashboardWidget>

            {/* Recent Project Updates */}
            <DashboardWidget title="Recent Project Updates" icon={Clock} size="md">
              <div className="space-y-3">
                {[
                  { name: "E-commerce Platform", status: "completed", time: "2h ago", icon: CheckCircle, color: "text-green-500" },
                  { name: "Mobile App Redesign", status: "at-risk", time: "4h ago", icon: AlertTriangle, color: "text-yellow-500" },
                  { name: "Data Migration", status: "on-track", time: "6h ago", icon: CheckCircle, color: "text-blue-500" },
                  { name: "Security Audit", status: "completed", time: "1d ago", icon: CheckCircle, color: "text-green-500" }
                ].map((update, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-card/50 hover:bg-card transition-colors">
                    <update.icon className={`w-4 h-4 ${update.color}`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{update.name}</p>
                      <p className="text-xs text-muted-foreground">{update.time}</p>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {update.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </DashboardWidget>
          </div>
        </TabsContent>

        <TabsContent value="resources" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Team Utilization */}
            <DashboardWidget title="Team Utilization" icon={Users} size="md">
              <div className="space-y-4">
                {[
                  { team: "Frontend Development", utilization: 85, members: 12 },
                  { team: "Backend Development", utilization: 78, members: 8 },
                  { team: "UI/UX Design", utilization: 92, members: 6 },
                  { team: "QA Testing", utilization: 67, members: 4 }
                ].map((team) => (
                  <div key={team.team} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium text-foreground">{team.team}</span>
                      <span className="text-muted-foreground">{team.members} members</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Progress value={team.utilization} className="flex-1" />
                      <span className="text-sm font-medium text-foreground w-10 text-right">
                        {team.utilization}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </DashboardWidget>

            {/* Capacity Planning */}
            <DashboardWidget title="Capacity Planning" icon={BarChart3} size="md">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 rounded-lg bg-card/50">
                    <p className="text-2xl font-bold text-foreground">89</p>
                    <p className="text-sm text-muted-foreground">Total Members</p>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-card/50">
                    <p className="text-2xl font-bold text-green-500">82%</p>
                    <p className="text-sm text-muted-foreground">Avg Utilization</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Available capacity</span>
                    <span className="font-medium text-foreground">160 hours/week</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Allocated capacity</span>
                    <span className="font-medium text-foreground">131 hours/week</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Free capacity</span>
                    <span className="font-medium text-green-500">29 hours/week</span>
                  </div>
                </div>
              </div>
            </DashboardWidget>
          </div>
        </TabsContent>

        <TabsContent value="financial" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Budget Overview */}
            <DashboardWidget title="Budget Overview" icon={DollarSign} size="md">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 rounded-lg bg-card/50">
                    <p className="text-2xl font-bold text-foreground">$2.4M</p>
                    <p className="text-sm text-muted-foreground">Total Budget</p>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-card/50">
                    <p className="text-2xl font-bold text-blue-500">$1.8M</p>
                    <p className="text-sm text-muted-foreground">Allocated</p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  {[
                    { category: "Development", allocated: 1200000, total: 1400000 },
                    { category: "Design", allocated: 300000, total: 400000 },
                    { category: "Testing", allocated: 200000, total: 300000 },
                    { category: "Operations", allocated: 100000, total: 300000 }
                  ].map((budget) => (
                    <div key={budget.category} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium text-foreground">{budget.category}</span>
                        <span className="text-muted-foreground">
                          ${(budget.allocated / 1000)}k / ${(budget.total / 1000)}k
                        </span>
                      </div>
                      <Progress value={(budget.allocated / budget.total) * 100} className="h-2" />
                    </div>
                  ))}
                </div>
              </div>
            </DashboardWidget>

            {/* Cost Analysis */}
            <DashboardWidget title="Cost Analysis" icon={TrendingUp} size="md">
              <div className="space-y-4">
                <div className="text-center p-4 rounded-lg bg-card/50">
                  <p className="text-2xl font-bold text-foreground">$145K</p>
                  <p className="text-sm text-muted-foreground">Monthly Burn Rate</p>
                  <div className="flex items-center justify-center gap-1 mt-2">
                    <TrendingUp className="w-4 h-4 text-green-500" />
                    <span className="text-sm text-green-500">-8% vs last month</span>
                  </div>
                </div>
                
                <div className="space-y-3">
                  {[
                    { metric: "Cost per project", value: "$6.2K", change: "-5%" },
                    { metric: "Cost per employee", value: "$1.6K", change: "+2%" },
                    { metric: "ROI", value: "18.5%", change: "+3%" },
                    { metric: "Efficiency ratio", value: "87%", change: "+12%" }
                  ].map((metric) => (
                    <div key={metric.metric} className="flex items-center justify-between p-3 rounded-lg bg-card/50">
                      <span className="text-sm font-medium text-foreground">{metric.metric}</span>
                      <div className="text-right">
                        <p className="text-sm font-bold text-foreground">{metric.value}</p>
                        <p className="text-xs text-green-500">{metric.change}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </DashboardWidget>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}