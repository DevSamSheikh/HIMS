import React, { useState, useEffect } from "react";
import StatisticsPanel from "./StatisticsPanel";
import TasksPanel from "./TasksPanel";
import {
  FlaskConical,
  FileText,
  Clock,
  AlertCircle,
  CheckCircle,
  Activity,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import BarChart from "./charts/BarChart";
import PieChart from "./charts/PieChart";
import DashboardSkeleton from "./DashboardSkeleton";

const LabDashboard = () => {
  const [isLoading, setIsLoading] = useState(true);

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Chart data
  const testsByTypeData = [
    { label: "Blood", value: 42, color: "bg-red-500" },
    { label: "Urine", value: 28, color: "bg-yellow-500" },
    { label: "Imaging", value: 18, color: "bg-blue-500" },
    { label: "Pathology", value: 12, color: "bg-green-500" },
    { label: "Other", value: 8, color: "bg-purple-500" },
  ];

  const resultDistributionData = [
    { label: "Normal", value: 64 },
    { label: "Abnormal", value: 28 },
    { label: "Critical", value: 8 },
  ];

  if (isLoading) {
    return <DashboardSkeleton />;
  }
  // Mock data for pending tests
  const pendingTests = [
    {
      id: 1,
      patient: "John Smith",
      test: "Complete Blood Count",
      requestedBy: "Dr. Wilson",
      priority: "routine",
      requestedOn: "2023-06-14",
      status: "processing",
    },
    {
      id: 2,
      patient: "Emily Johnson",
      test: "Liver Function Test",
      requestedBy: "Dr. Patel",
      priority: "urgent",
      requestedOn: "2023-06-14",
      status: "collected",
    },
    {
      id: 3,
      patient: "Michael Brown",
      test: "Lipid Profile",
      requestedBy: "Dr. Chen",
      priority: "routine",
      requestedOn: "2023-06-14",
      status: "pending",
    },
    {
      id: 4,
      patient: "Sarah Davis",
      test: "Thyroid Function Test",
      requestedBy: "Dr. Wilson",
      priority: "urgent",
      requestedOn: "2023-06-14",
      status: "processing",
    },
    {
      id: 5,
      patient: "Robert Miller",
      test: "Urinalysis",
      requestedBy: "Dr. Patel",
      priority: "routine",
      requestedOn: "2023-06-13",
      status: "processing",
    },
    {
      id: 6,
      patient: "Jennifer Wilson",
      test: "Blood Glucose",
      requestedBy: "Dr. Chen",
      priority: "stat",
      requestedOn: "2023-06-14",
      status: "collected",
    },
  ];

  // Mock data for completed tests
  const completedTests = [
    {
      id: 7,
      patient: "David Garcia",
      test: "Complete Blood Count",
      requestedBy: "Dr. Wilson",
      completedOn: "2023-06-14",
      result: "normal",
    },
    {
      id: 8,
      patient: "Lisa Martinez",
      test: "Urinalysis",
      requestedBy: "Dr. Patel",
      completedOn: "2023-06-14",
      result: "abnormal",
    },
    {
      id: 9,
      patient: "James Johnson",
      test: "Blood Glucose",
      requestedBy: "Dr. Chen",
      completedOn: "2023-06-14",
      result: "critical",
    },
    {
      id: 10,
      patient: "Mary Williams",
      test: "Liver Function Test",
      requestedBy: "Dr. Wilson",
      completedOn: "2023-06-13",
      result: "normal",
    },
  ];

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "stat":
        return <Badge className="bg-red-500">STAT</Badge>;
      case "urgent":
        return <Badge className="bg-amber-500">Urgent</Badge>;
      case "routine":
        return <Badge variant="outline">Routine</Badge>;
      default:
        return <Badge variant="outline">{priority}</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline">Pending</Badge>;
      case "collected":
        return <Badge className="bg-blue-500">Collected</Badge>;
      case "processing":
        return <Badge className="bg-purple-500">Processing</Badge>;
      case "completed":
        return <Badge className="bg-green-500">Completed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getResultBadge = (result: string) => {
    switch (result) {
      case "normal":
        return <Badge className="bg-green-500">Normal</Badge>;
      case "abnormal":
        return <Badge className="bg-amber-500">Abnormal</Badge>;
      case "critical":
        return <Badge className="bg-red-500">Critical</Badge>;
      default:
        return <Badge variant="outline">{result}</Badge>;
    }
  };

  return (
    <div className="container mx-auto space-y-6 max-w-7xl">
      <h1 className="text-3xl font-bold tracking-tight">
        Laboratory Dashboard
      </h1>
      <p className="text-muted-foreground">
        Manage laboratory tests, samples, and results reporting.
      </p>

      <StatisticsPanel
        statistics={[
          {
            title: "Pending Tests",
            value: "42",
            description: "Awaiting processing",
            icon: <Clock className="h-5 w-5" />,
            trend: { value: 8, isPositive: false },
          },
          {
            title: "Tests Today",
            value: "78",
            description: "Processed today",
            icon: <FlaskConical className="h-5 w-5" />,
            trend: { value: 12, isPositive: true },
          },
          {
            title: "Critical Results",
            value: "5",
            description: "Require immediate attention",
            icon: <AlertCircle className="h-5 w-5" />,
            trend: { value: 2, isPositive: false },
          },
          {
            title: "Completed Reports",
            value: "64",
            description: "Ready for delivery",
            icon: <FileText className="h-5 w-5" />,
          },
        ]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="w-full bg-card">
            <CardHeader>
              <CardTitle className="text-xl flex items-center">
                <FlaskConical className="mr-2 h-5 w-5" />
                Tests by Type
              </CardTitle>
            </CardHeader>
            <CardContent>
              <BarChart data={testsByTypeData} height={180} />
            </CardContent>
          </Card>

          <Card className="w-full bg-card">
            <CardHeader>
              <CardTitle className="text-xl flex items-center">
                <Clock className="mr-2 h-5 w-5" />
                Pending Tests
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-medium">
                        Patient
                      </th>
                      <th className="text-left py-3 px-4 font-medium">Test</th>
                      <th className="text-left py-3 px-4 font-medium">
                        Requested By
                      </th>
                      <th className="text-left py-3 px-4 font-medium">
                        Priority
                      </th>
                      <th className="text-left py-3 px-4 font-medium">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {pendingTests.map((test) => (
                      <tr key={test.id} className="border-b hover:bg-muted/50">
                        <td className="py-3 px-4">{test.patient}</td>
                        <td className="py-3 px-4">{test.test}</td>
                        <td className="py-3 px-4">{test.requestedBy}</td>
                        <td className="py-3 px-4">
                          {getPriorityBadge(test.priority)}
                        </td>
                        <td className="py-3 px-4">
                          {getStatusBadge(test.status)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          <Card className="w-full bg-card">
            <CardHeader>
              <CardTitle className="text-xl flex items-center">
                <CheckCircle className="mr-2 h-5 w-5" />
                Recent Results
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-medium">
                        Patient
                      </th>
                      <th className="text-left py-3 px-4 font-medium">Test</th>
                      <th className="text-left py-3 px-4 font-medium">
                        Requested By
                      </th>
                      <th className="text-left py-3 px-4 font-medium">
                        Completed On
                      </th>
                      <th className="text-left py-3 px-4 font-medium">
                        Result
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {completedTests.map((test) => (
                      <tr key={test.id} className="border-b hover:bg-muted/50">
                        <td className="py-3 px-4">{test.patient}</td>
                        <td className="py-3 px-4">{test.test}</td>
                        <td className="py-3 px-4">{test.requestedBy}</td>
                        <td className="py-3 px-4">{test.completedOn}</td>
                        <td className="py-3 px-4">
                          {getResultBadge(test.result)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="lg:col-span-1 space-y-6">
          <Card className="w-full bg-card">
            <CardHeader>
              <CardTitle className="text-xl flex items-center">
                <Activity className="mr-2 h-5 w-5" />
                Result Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <PieChart data={resultDistributionData} size={180} />
            </CardContent>
          </Card>

          <TasksPanel
            tasks={[
              {
                id: "1",
                title: "Process STAT samples",
                module: "Laboratory",
                priority: "high",
                dueDate: "2023-06-15",
              },
              {
                id: "2",
                title: "Calibrate equipment",
                module: "Laboratory",
                priority: "medium",
                dueDate: "2023-06-15",
              },
              {
                id: "3",
                title: "Restock reagents",
                module: "Laboratory",
                priority: "high",
                dueDate: "2023-06-16",
              },
              {
                id: "4",
                title: "Verify critical results",
                module: "Laboratory",
                priority: "high",
                dueDate: "2023-06-15",
              },
            ]}
          />

          <Card className="w-full bg-card overflow-hidden">
            <CardHeader>
              <CardTitle className="text-xl">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-3">
                <button className="w-full text-left p-3 bg-blue-50 dark:bg-blue-900/20 rounded-md hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors">
                  Register New Sample
                </button>
                <button className="w-full text-left p-3 bg-green-50 dark:bg-green-900/20 rounded-md hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors">
                  Record Test Results
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default LabDashboard;
