import React, { useState, useEffect } from "react";
import StatisticsPanel from "./StatisticsPanel";
import TasksPanel from "./TasksPanel";
import ModulesGrid from "./ModulesGrid";
import { Users, UserCog, DollarSign, ShieldCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import BarChart from "./charts/BarChart";
import PieChart from "./charts/PieChart";

const AdminDashboard = () => {
  const [isLoading, setIsLoading] = useState(true);

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Chart data
  const departmentRevenueData = [
    { label: "OPD", value: 125000, color: "bg-blue-500" },
    { label: "IPD", value: 180000, color: "bg-green-500" },
    { label: "Pharmacy", value: 75000, color: "bg-purple-500" },
    { label: "Lab", value: 65000, color: "bg-amber-500" },
    { label: "Radiology", value: 55000, color: "bg-red-500" },
  ];

  const patientDistributionData = [
    { label: "OPD", value: 3200 },
    { label: "IPD", value: 850 },
    { label: "Emergency", value: 450 },
    { label: "Follow-up", value: 750 },
  ];
  return (
    <div className="container mx-auto space-y-6 max-w-7xl">
      <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
      <p className="text-muted-foreground">
        Welcome to the hospital administration dashboard. Here's an overview of
        your entire healthcare system.
      </p>

      <StatisticsPanel
        statistics={[
          {
            title: "Total Patients",
            value: "5,248",
            description: "Registered in system",
            icon: <Users className="h-5 w-5" />,
            trend: { value: 12, isPositive: true },
          },
          {
            title: "Staff Members",
            value: "312",
            description: "Active employees",
            icon: <UserCog className="h-5 w-5" />,
            trend: { value: 4, isPositive: true },
          },
          {
            title: "Monthly Revenue",
            value: "$342,500",
            description: "Current month",
            icon: <DollarSign className="h-5 w-5" />,
            trend: { value: 8, isPositive: true },
          },
          {
            title: "System Status",
            value: "Optimal",
            description: "All modules operational",
            icon: <ShieldCheck className="h-5 w-5" />,
          },
        ]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="w-full bg-card">
            <CardHeader>
              <CardTitle className="text-xl">Department Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <BarChart data={departmentRevenueData} height={250} />
            </CardContent>
          </Card>

          <TasksPanel
            tasks={[
              {
                id: "1",
                title: "Review monthly department reports",
                module: "Administrative Tasks",
                priority: "high",
                dueDate: "2023-06-15",
              },
              {
                id: "2",
                title: "Approve staff vacation requests",
                module: "Administrative Tasks",
                priority: "medium",
                dueDate: "2023-06-18",
              },
              {
                id: "3",
                title: "Finalize quarterly budget",
                module: "Administrative Tasks",
                priority: "high",
                dueDate: "2023-06-16",
              },
              {
                id: "4",
                title: "Meet with department heads",
                module: "Administrative Tasks",
                priority: "medium",
                dueDate: "2023-06-19",
              },
              {
                id: "5",
                title: "Review new equipment requests",
                module: "Administrative Tasks",
                priority: "low",
                dueDate: "2023-06-22",
              },
            ]}
          />
        </div>
        <div className="lg:col-span-1 space-y-6">
          <Card className="w-full bg-card">
            <CardHeader>
              <CardTitle className="text-xl">Patient Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <PieChart data={patientDistributionData} size={180} />
            </CardContent>
          </Card>

          <Card className="w-full bg-card">
            <CardHeader>
              <CardTitle className="text-xl">Administrative Actions</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-3">
                <button className="w-full text-left p-3 bg-blue-50 dark:bg-blue-900/20 rounded-md hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors">
                  Generate Hospital Report
                </button>
                <button className="w-full text-left p-3 bg-green-50 dark:bg-green-900/20 rounded-md hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors">
                  Manage Staff Accounts
                </button>
                <button className="w-full text-left p-3 bg-purple-50 dark:bg-purple-900/20 rounded-md hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors">
                  Review Department Budgets
                </button>
                <button className="w-full text-left p-3 bg-orange-50 dark:bg-orange-900/20 rounded-md hover:bg-orange-100 dark:hover:bg-orange-900/30 transition-colors">
                  System Configuration
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <ModulesGrid />
    </div>
  );
};

export default AdminDashboard;
