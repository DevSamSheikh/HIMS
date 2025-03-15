import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Calendar,
  Download,
  Filter,
  BarChart3,
  LineChart,
  PieChart,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AnalyticsDashboardProps {
  className?: string;
}

interface TabProps {
  timeRange: "7d" | "30d" | "90d" | "1y";
}

const OverviewTab = ({ timeRange }: TabProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium">Total Patients</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold">1,248</div>
              <p className="text-xs text-muted-foreground mt-1">
                +12% from last{" "}
                {timeRange === "7d"
                  ? "week"
                  : timeRange === "30d"
                    ? "month"
                    : timeRange === "90d"
                      ? "quarter"
                      : "year"}
              </p>
            </div>
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-primary" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium">Revenue</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold">$52,489</div>
              <p className="text-xs text-muted-foreground mt-1">
                +8% from last{" "}
                {timeRange === "7d"
                  ? "week"
                  : timeRange === "30d"
                    ? "month"
                    : timeRange === "90d"
                      ? "quarter"
                      : "year"}
              </p>
            </div>
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <BarChart3 className="h-6 w-6 text-primary" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium">Appointments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold">324</div>
              <p className="text-xs text-muted-foreground mt-1">
                -3% from last{" "}
                {timeRange === "7d"
                  ? "week"
                  : timeRange === "30d"
                    ? "month"
                    : timeRange === "90d"
                      ? "quarter"
                      : "year"}
              </p>
            </div>
            <div className="h-12 w-12 rounded-full bg-destructive/10 flex items-center justify-center">
              <TrendingDown className="h-6 w-6 text-destructive" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="col-span-1 md:col-span-2">
        <CardHeader>
          <CardTitle>Patient Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[200px] flex items-center justify-center bg-muted/20 rounded-md">
            <LineChart className="h-8 w-8 text-muted-foreground" />
            <span className="ml-2 text-muted-foreground">
              Chart visualization would appear here
            </span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Patient Demographics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[200px] flex items-center justify-center bg-muted/20 rounded-md">
            <PieChart className="h-8 w-8 text-muted-foreground" />
            <span className="ml-2 text-muted-foreground">
              Chart visualization would appear here
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const PatientAnalyticsTab = ({ timeRange }: TabProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Patient Demographics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[250px] flex items-center justify-center bg-muted/20 rounded-md">
            <PieChart className="h-8 w-8 text-muted-foreground" />
            <span className="ml-2 text-muted-foreground">
              Age distribution chart would appear here
            </span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Patient Visits</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[250px] flex items-center justify-center bg-muted/20 rounded-md">
            <BarChart3 className="h-8 w-8 text-muted-foreground" />
            <span className="ml-2 text-muted-foreground">
              Visit frequency chart would appear here
            </span>
          </div>
        </CardContent>
      </Card>

      <Card className="col-span-1 md:col-span-2">
        <CardHeader>
          <CardTitle>Patient Satisfaction</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[200px] flex items-center justify-center bg-muted/20 rounded-md">
            <LineChart className="h-8 w-8 text-muted-foreground" />
            <span className="ml-2 text-muted-foreground">
              Satisfaction trends would appear here
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const FinancialTab = ({ timeRange }: TabProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Revenue Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[250px] flex items-center justify-center bg-muted/20 rounded-md">
            <PieChart className="h-8 w-8 text-muted-foreground" />
            <span className="ml-2 text-muted-foreground">
              Revenue sources chart would appear here
            </span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Monthly Revenue</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[250px] flex items-center justify-center bg-muted/20 rounded-md">
            <BarChart3 className="h-8 w-8 text-muted-foreground" />
            <span className="ml-2 text-muted-foreground">
              Monthly revenue chart would appear here
            </span>
          </div>
        </CardContent>
      </Card>

      <Card className="col-span-1 md:col-span-2">
        <CardHeader>
          <CardTitle>Expense Tracking</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[200px] flex items-center justify-center bg-muted/20 rounded-md">
            <LineChart className="h-8 w-8 text-muted-foreground" />
            <span className="ml-2 text-muted-foreground">
              Expense tracking chart would appear here
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const OperationsTab = ({ timeRange }: TabProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Resource Utilization</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[250px] flex items-center justify-center bg-muted/20 rounded-md">
            <BarChart3 className="h-8 w-8 text-muted-foreground" />
            <span className="ml-2 text-muted-foreground">
              Resource utilization chart would appear here
            </span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Staff Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[250px] flex items-center justify-center bg-muted/20 rounded-md">
            <LineChart className="h-8 w-8 text-muted-foreground" />
            <span className="ml-2 text-muted-foreground">
              Staff performance metrics would appear here
            </span>
          </div>
        </CardContent>
      </Card>

      <Card className="col-span-1 md:col-span-2">
        <CardHeader>
          <CardTitle>Operational Efficiency</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[200px] flex items-center justify-center bg-muted/20 rounded-md">
            <BarChart3 className="h-8 w-8 text-muted-foreground" />
            <span className="ml-2 text-muted-foreground">
              Efficiency metrics would appear here
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const AnalyticsDashboard = ({ className = "" }: AnalyticsDashboardProps) => {
  const [activeTab, setActiveTab] = useState<
    "overview" | "patients" | "financial" | "operations"
  >("overview");
  const [timeRange, setTimeRange] = useState<"7d" | "30d" | "90d" | "1y">(
    "30d",
  );

  return (
    <div
      className={`w-full h-full bg-gray-50 dark:bg-gray-900 p-6 ${className}`}
    >
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight">
            Analytics Dashboard
          </h1>
          <div className="flex items-center gap-2">
            <Select
              value={timeRange}
              onValueChange={(value) => setTimeRange(value as any)}
            >
              <SelectTrigger className="w-[180px]">
                <Calendar className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Select time range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
                <SelectItem value="1y">Last year</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </div>

        <Tabs
          defaultValue="overview"
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as any)}
        >
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="patients">Patient Analytics</TabsTrigger>
            <TabsTrigger value="financial">Financial</TabsTrigger>
            <TabsTrigger value="operations">Operations</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            <OverviewTab timeRange={timeRange} />
          </TabsContent>

          <TabsContent value="patients" className="mt-6">
            <PatientAnalyticsTab timeRange={timeRange} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
