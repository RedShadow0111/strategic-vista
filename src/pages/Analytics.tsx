import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
  Target, 
  Calendar,
  AlertTriangle,
  CheckCircle,
  Clock,
  DollarSign,
  Users,
  Zap,
  Download,
  Filter,
  RefreshCw
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell
} from "recharts";

const portfolioTrendData = [
  { month: 'Jan', projects: 18, budget: 8.2, completed: 15, onTime: 85 },
  { month: 'Feb', projects: 20, budget: 9.1, completed: 18, onTime: 88 },
  { month: 'Mar', projects: 22, budget: 10.5, completed: 20, onTime: 90 },
  { month: 'Apr', projects: 24, budget: 11.8, completed: 22, onTime: 87 },
  { month: 'May', projects: 26, budget: 12.3, completed: 24, onTime: 92 },
  { month: 'Jun', projects: 24, budget: 12.5, completed: 26, onTime: 89 }
];

const predictiveData = [
  { month: 'Jul', predicted: 25, confidence: 85 },
  { month: 'Aug', predicted: 27, confidence: 82 },
  { month: 'Sep', predicted: 29, confidence: 78 },
  { month: 'Oct', predicted: 31, confidence: 75 },
  { month: 'Nov', predicted: 28, confidence: 80 },
  { month: 'Dec', predicted: 30, confidence: 77 }
];

const performanceData = [
  { category: 'On Time', value: 85, color: '#22c55e' },
  { category: 'Delayed', value: 12, color: '#f59e0b' },
  { category: 'At Risk', value: 3, color: '#ef4444' }
];

const resourceUtilization = [
  { department: 'Engineering', utilization: 87, capacity: 45, trend: 'up' },
  { department: 'Design', utilization: 75, capacity: 12, trend: 'stable' },
  { department: 'PMO', utilization: 82, capacity: 8, trend: 'up' },
  { department: 'QA', utilization: 91, capacity: 15, trend: 'down' },
  { department: 'DevOps', utilization: 95, capacity: 6, trend: 'up' }
];

const riskIndicators = [
  {
    type: "Budget Overrun Risk",
    projects: 3,
    severity: "High",
    trend: "increasing",
    description: "Projects trending over budget by >15%"
  },
  {
    type: "Schedule Delay Risk", 
    projects: 5,
    severity: "Medium",
    trend: "stable",
    description: "Projects with potential timeline delays"
  },
  {
    type: "Resource Constraint",
    projects: 2,
    severity: "High", 
    trend: "increasing",
    description: "Critical skill gaps affecting delivery"
  },
  {
    type: "Scope Creep",
    projects: 4,
    severity: "Low",
    trend: "decreasing",
    description: "Projects showing scope expansion trends"
  }
];

const getSeverityColor = (severity: string) => {
  switch (severity) {
    case "High": return "bg-destructive text-destructive-foreground";
    case "Medium": return "bg-warning text-warning-foreground";
    case "Low": return "bg-success text-success-foreground";
    default: return "bg-secondary text-secondary-foreground";
  }
};

const getTrendIcon = (trend: string) => {
  switch (trend) {
    case "increasing": return <TrendingUp className="w-3 h-3 text-destructive" />;
    case "decreasing": return <TrendingDown className="w-3 h-3 text-success" />;
    case "stable": return <Clock className="w-3 h-3 text-muted-foreground" />;
    default: return null;
  }
};

export default function Analytics() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-sf font-bold text-foreground">Portfolio Analytics</h1>
          <p className="text-muted-foreground mt-1">
            Predictive insights, trends analysis, and performance metrics
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Portfolio Health</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">89%</div>
            <div className="flex items-center text-xs text-success mt-1">
              <TrendingUp className="w-3 h-3 mr-1" />
              +3% vs last month
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Predictive Success Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">92%</div>
            <div className="flex items-center text-xs text-muted-foreground mt-1">
              <Target className="w-3 h-3 mr-1" />
              Next 6 months
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">ROI Forecast</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">24.5%</div>
            <div className="flex items-center text-xs text-success mt-1">
              <DollarSign className="w-3 h-3 mr-1" />
              Expected return
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Risk Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">3.2</div>
            <div className="flex items-center text-xs text-warning mt-1">
              <AlertTriangle className="w-3 h-3 mr-1" />
              Medium risk level
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Analytics Tabs */}
      <Tabs defaultValue="trends" className="w-full">
        <TabsList className="grid w-full grid-cols-4 max-w-lg">
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="predictive">Predictive</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="risks">Risks</TabsTrigger>
        </TabsList>

        <TabsContent value="trends" className="space-y-6 mt-6">
          {/* Portfolio Trends */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Portfolio Growth Trends
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={portfolioTrendData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                    <YAxis stroke="hsl(var(--muted-foreground))" />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: "hsl(var(--popover))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px"
                      }}
                    />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="projects" 
                      stroke="hsl(var(--primary))" 
                      strokeWidth={2}
                      name="Active Projects"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="completed" 
                      stroke="hsl(var(--success))" 
                      strokeWidth={2}
                      name="Completed"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Budget Utilization
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={portfolioTrendData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                    <YAxis stroke="hsl(var(--muted-foreground))" />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: "hsl(var(--popover))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px"
                      }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="budget" 
                      stroke="hsl(var(--primary))" 
                      fill="hsl(var(--primary) / 0.3)"
                      name="Budget (M$)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Resource Utilization by Department */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Resource Utilization by Department
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {resourceUtilization.map((dept, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border border-border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-3 h-3 rounded-full bg-primary"></div>
                      <div>
                        <div className="font-medium text-foreground">{dept.department}</div>
                        <div className="text-sm text-muted-foreground">{dept.capacity} resources</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="w-32">
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-muted-foreground">Utilization</span>
                          <span className="font-medium">{dept.utilization}%</span>
                        </div>
                        <Progress value={dept.utilization} className="h-2" />
                      </div>
                      
                      <div className="flex items-center gap-1">
                        {getTrendIcon(dept.trend)}
                        <span className="text-xs text-muted-foreground capitalize">{dept.trend}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="predictive" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  Project Success Prediction
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={predictiveData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                    <YAxis stroke="hsl(var(--muted-foreground))" />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: "hsl(var(--popover))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px"
                      }}
                    />
                    <Bar 
                      dataKey="predicted" 
                      fill="hsl(var(--primary))"
                      name="Predicted Projects"
                    />
                    <Bar 
                      dataKey="confidence" 
                      fill="hsl(var(--success))"
                      name="Confidence %"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Predictive Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg">
                    <div className="flex items-start gap-3">
                      <TrendingUp className="w-5 h-5 text-primary mt-0.5" />
                      <div>
                        <h4 className="font-medium text-foreground">Portfolio Expansion</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Model predicts 15% portfolio growth in Q4 based on current trends and resource availability.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-warning/10 border border-warning/20 rounded-lg">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 text-warning mt-0.5" />
                      <div>
                        <h4 className="font-medium text-foreground">Resource Bottleneck</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          DevOps capacity constraint likely to impact 3 major projects starting in August.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-success/10 border border-success/20 rounded-lg">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-success mt-0.5" />
                      <div>
                        <h4 className="font-medium text-foreground">Delivery Confidence</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          92% confidence in on-time delivery for Q3 projects based on current velocity.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Project Performance Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={performanceData}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}%`}
                    >
                      {performanceData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-muted-foreground">On-Time Delivery</span>
                      <span className="font-medium">85%</span>
                    </div>
                    <Progress value={85} className="h-2" />
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-muted-foreground">Budget Adherence</span>
                      <span className="font-medium">78%</span>
                    </div>
                    <Progress value={78} className="h-2" />
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-muted-foreground">Quality Score</span>
                      <span className="font-medium">92%</span>
                    </div>
                    <Progress value={92} className="h-2" />
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-muted-foreground">Stakeholder Satisfaction</span>
                      <span className="font-medium">88%</span>
                    </div>
                    <Progress value={88} className="h-2" />
                  </div>

                  <div className="pt-4 border-t border-border">
                    <div className="text-sm text-muted-foreground mb-2">Overall Performance Score</div>
                    <div className="text-2xl font-bold text-primary">86%</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="risks" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                Risk Analysis & Monitoring
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {riskIndicators.map((risk, index) => (
                  <div key={index} className="p-4 border border-border rounded-lg">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-medium text-foreground">{risk.type}</h4>
                          <Badge className={getSeverityColor(risk.severity)}>
                            {risk.severity}
                          </Badge>
                          <div className="flex items-center gap-1">
                            {getTrendIcon(risk.trend)}
                            <span className="text-xs text-muted-foreground capitalize">
                              {risk.trend}
                            </span>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">{risk.description}</p>
                      </div>
                      
                      <div className="text-right">
                        <div className="text-lg font-bold text-foreground">{risk.projects}</div>
                        <div className="text-xs text-muted-foreground">projects affected</div>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => console.log('View details for', risk.type)}
                      >
                        View Details
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => console.log('Mitigate risk for', risk.type)}
                      >
                        Mitigate Risk
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}