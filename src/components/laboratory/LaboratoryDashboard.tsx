import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  BarChart,
  ClipboardList,
  TestTube2 as Flask,
  FileText,
  AlertCircle,
  Clock,
  CheckCircle2,
  Users,
  Microscope,
  Beaker,
  TestTube as Vial,
  Syringe,
} from "lucide-react";

const LaboratoryDashboard = () => {
  // Mock data for dashboard statistics
  const stats = {
    pendingSamples: 24,
    testsToday: 78,
    pendingReports: 15,
    criticalResults: 3,
    revenueToday: 25600,
    machinesActive: 8,
  };

  // Mock data for recent tests
  const recentTests = [
    {
      id: "T001",
      patientName: "John Smith",
      testName: "Complete Blood Count",
      status: "completed",
      time: "10:30 AM",
    },
    {
      id: "T002",
      patientName: "Emily Johnson",
      testName: "Liver Function Test",
      status: "processing",
      time: "11:15 AM",
    },
    {
      id: "T003",
      patientName: "Michael Brown",
      testName: "Thyroid Profile",
      status: "pending",
      time: "12:00 PM",
    },
    {
      id: "T004",
      patientName: "Sarah Wilson",
      testName: "Lipid Profile",
      status: "critical",
      time: "12:45 PM",
    },
    {
      id: "T005",
      patientName: "David Miller",
      testName: "Blood Glucose",
      status: "completed",
      time: "01:30 PM",
    },
  ];

  // Status badge colors
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "critical":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Status icons
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="h-4 w-4 text-green-600" />;
      case "processing":
        return <Clock className="h-4 w-4 text-blue-600" />;
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case "critical":
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Samples
            </CardTitle>
            <Vial className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingSamples}</div>
            <p className="text-xs text-muted-foreground">
              Samples awaiting collection/processing
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Tests Today</CardTitle>
            <Flask className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.testsToday}</div>
            <p className="text-xs text-muted-foreground">
              Tests performed today
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Reports
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingReports}</div>
            <p className="text-xs text-muted-foreground">
              Reports awaiting validation
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Critical Results
            </CardTitle>
            <AlertCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">
              {stats.criticalResults}
            </div>
            <p className="text-xs text-muted-foreground">
              Results requiring immediate attention
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Revenue Today</CardTitle>
            <BarChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₹{stats.revenueToday.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Total revenue generated today
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Machines Active
            </CardTitle>
            <Microscope className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.machinesActive}/10</div>
            <p className="text-xs text-muted-foreground">
              Lab machines currently operational
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Button className="h-20" variant="outline">
          <div className="flex flex-col items-center">
            <Vial className="h-5 w-5 mb-1" />
            <span>Collect Sample</span>
          </div>
        </Button>
        <Button className="h-20" variant="outline">
          <div className="flex flex-col items-center">
            <Beaker className="h-5 w-5 mb-1" />
            <span>Process Sample</span>
          </div>
        </Button>
        <Button className="h-20" variant="outline">
          <div className="flex flex-col items-center">
            <FileText className="h-5 w-5 mb-1" />
            <span>Enter Results</span>
          </div>
        </Button>
        <Button className="h-20" variant="outline">
          <div className="flex flex-col items-center">
            <ClipboardList className="h-5 w-5 mb-1" />
            <span>View Reports</span>
          </div>
        </Button>
      </div>

      {/* Recent Tests */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Tests</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentTests.map((test) => (
              <div
                key={test.id}
                className="flex items-center justify-between p-3 bg-muted/50 rounded-md"
              >
                <div className="flex items-center space-x-4">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <Flask className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{test.testName}</p>
                    <p className="text-sm text-muted-foreground">
                      {test.patientName} • {test.time}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(
                      test.status,
                    )}`}
                  >
                    <div className="flex items-center space-x-1">
                      {getStatusIcon(test.status)}
                      <span>
                        {test.status.charAt(0).toUpperCase() +
                          test.status.slice(1)}
                      </span>
                    </div>
                  </span>
                  <Button variant="ghost" size="sm">
                    View
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Test Categories */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Syringe className="h-5 w-5 mr-2" />
              Hematology
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span>Complete Blood Count</span>
                <span className="text-sm text-muted-foreground">12 today</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Hemoglobin</span>
                <span className="text-sm text-muted-foreground">8 today</span>
              </div>
              <div className="flex justify-between items-center">
                <span>ESR</span>
                <span className="text-sm text-muted-foreground">5 today</span>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Beaker className="h-5 w-5 mr-2" />
              Biochemistry
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span>Liver Function Test</span>
                <span className="text-sm text-muted-foreground">7 today</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Kidney Function Test</span>
                <span className="text-sm text-muted-foreground">9 today</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Lipid Profile</span>
                <span className="text-sm text-muted-foreground">6 today</span>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Microscope className="h-5 w-5 mr-2" />
              Microbiology
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span>Urine Culture</span>
                <span className="text-sm text-muted-foreground">4 today</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Blood Culture</span>
                <span className="text-sm text-muted-foreground">2 today</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Stool Examination</span>
                <span className="text-sm text-muted-foreground">3 today</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LaboratoryDashboard;
