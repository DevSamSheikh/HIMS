import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  PlusCircle,
  Search,
  Filter,
  FileText,
  Clock,
  Download,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface LabManagementProps {
  className?: string;
}

interface LabTest {
  id: string;
  patientName: string;
  patientId: string;
  testName: string;
  testType: string;
  requestedBy: string;
  requestDate: string;
  status: "pending" | "in-progress" | "completed" | "cancelled";
  priority: "routine" | "urgent" | "stat";
  results?: string;
  completedDate?: string;
}

const LabManagement = ({ className = "" }: LabManagementProps) => {
  const [activeTab, setActiveTab] = useState<
    "pending" | "in-progress" | "completed"
  >("pending");
  const [searchQuery, setSearchQuery] = useState("");

  // Mock lab tests data
  const labTests: LabTest[] = [
    {
      id: "lab-001",
      patientName: "John Smith",
      patientId: "P-1001",
      testName: "Complete Blood Count (CBC)",
      testType: "Hematology",
      requestedBy: "Dr. Sarah Johnson",
      requestDate: "2023-06-15",
      status: "pending",
      priority: "routine",
    },
    {
      id: "lab-002",
      patientName: "Emily Davis",
      patientId: "P-1002",
      testName: "Comprehensive Metabolic Panel",
      testType: "Chemistry",
      requestedBy: "Dr. Michael Chen",
      requestDate: "2023-06-15",
      status: "in-progress",
      priority: "urgent",
    },
    {
      id: "lab-003",
      patientName: "Robert Wilson",
      patientId: "P-1003",
      testName: "Lipid Panel",
      testType: "Chemistry",
      requestedBy: "Dr. Sarah Johnson",
      requestDate: "2023-06-14",
      status: "completed",
      priority: "routine",
      results: "Normal lipid levels",
      completedDate: "2023-06-15",
    },
    {
      id: "lab-004",
      patientName: "Lisa Thompson",
      patientId: "P-1004",
      testName: "Thyroid Function Tests",
      testType: "Endocrinology",
      requestedBy: "Dr. James Wilson",
      requestDate: "2023-06-14",
      status: "pending",
      priority: "stat",
    },
    {
      id: "lab-005",
      patientName: "Michael Brown",
      patientId: "P-1005",
      testName: "Urinalysis",
      testType: "Microbiology",
      requestedBy: "Dr. Michael Chen",
      requestDate: "2023-06-13",
      status: "completed",
      priority: "routine",
      results: "Normal findings",
      completedDate: "2023-06-14",
    },
  ];

  // Filter lab tests based on tab and search query
  const filteredLabTests = labTests.filter((test) => {
    const matchesSearch =
      test.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      test.patientId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      test.testName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      test.testType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      test.requestedBy.toLowerCase().includes(searchQuery.toLowerCase());

    if (activeTab === "pending" && test.status !== "pending") return false;
    if (activeTab === "in-progress" && test.status !== "in-progress")
      return false;
    if (activeTab === "completed" && test.status !== "completed") return false;

    return matchesSearch;
  });

  const getPriorityBadgeVariant = (priority: LabTest["priority"]) => {
    switch (priority) {
      case "routine":
        return "outline";
      case "urgent":
        return "secondary";
      case "stat":
        return "destructive";
      default:
        return "outline";
    }
  };

  const getStatusBadgeVariant = (status: LabTest["status"]) => {
    switch (status) {
      case "pending":
        return "outline";
      case "in-progress":
        return "secondary";
      case "completed":
        return "default";
      case "cancelled":
        return "destructive";
      default:
        return "outline";
    }
  };

  return (
    <div
      className={`w-full h-full bg-gray-50 dark:bg-gray-900 p-6 ${className}`}
    >
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight">
            Laboratory Management
          </h1>
          <Button>
            <FileText className="mr-2 h-4 w-4" />
            New Lab Request
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Tests</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">125</div>
              <p className="text-xs text-muted-foreground">Last 30 days</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">28</div>
              <p className="text-xs text-muted-foreground">5 urgent, 2 stat</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">15</div>
              <p className="text-xs text-muted-foreground">
                Est. completion: 2 hours
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Completed Today
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">32</div>
              <p className="text-xs text-muted-foreground">12 pending review</p>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search by patient name, ID, test name, or doctor..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Filter
            </Button>
          </div>

          <Tabs
            defaultValue="pending"
            value={activeTab}
            onValueChange={(value) => setActiveTab(value as any)}
          >
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="in-progress">In Progress</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
            </TabsList>

            <TabsContent value="pending" className="mt-4">
              <div className="grid grid-cols-1 gap-4">
                {filteredLabTests.length > 0 ? (
                  filteredLabTests.map((test) => (
                    <LabTestCard key={test.id} test={test} />
                  ))
                ) : (
                  <div className="text-center py-8 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                    <p className="text-gray-500 dark:text-gray-400">
                      No pending lab tests found.
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="in-progress" className="mt-4">
              <div className="grid grid-cols-1 gap-4">
                {filteredLabTests.length > 0 ? (
                  filteredLabTests.map((test) => (
                    <LabTestCard key={test.id} test={test} />
                  ))
                ) : (
                  <div className="text-center py-8 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                    <p className="text-gray-500 dark:text-gray-400">
                      No lab tests in progress.
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="completed" className="mt-4">
              <div className="grid grid-cols-1 gap-4">
                {filteredLabTests.length > 0 ? (
                  filteredLabTests.map((test) => (
                    <LabTestCard key={test.id} test={test} />
                  ))
                ) : (
                  <div className="text-center py-8 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                    <p className="text-gray-500 dark:text-gray-400">
                      No completed lab tests found.
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

interface LabTestCardProps {
  test: LabTest;
}

const LabTestCard = ({ test }: LabTestCardProps) => {
  const getPriorityBadgeVariant = (priority: LabTest["priority"]) => {
    switch (priority) {
      case "routine":
        return "outline";
      case "urgent":
        return "secondary";
      case "stat":
        return "destructive";
      default:
        return "outline";
    }
  };

  const getStatusBadgeVariant = (status: LabTest["status"]) => {
    switch (status) {
      case "pending":
        return "outline";
      case "in-progress":
        return "secondary";
      case "completed":
        return "default";
      case "cancelled":
        return "destructive";
      default:
        return "outline";
    }
  };

  return (
    <Card className="bg-white dark:bg-gray-800 hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{test.testName}</CardTitle>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {test.testType}
            </div>
          </div>
          <div className="flex gap-2">
            <Badge
              variant={getPriorityBadgeVariant(test.priority)}
              className="capitalize"
            >
              {test.priority}
            </Badge>
            <Badge
              variant={getStatusBadgeVariant(test.status)}
              className="capitalize"
            >
              {test.status.replace("-", " ")}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
          <div>
            <div className="text-sm font-medium">Patient</div>
            <div className="text-sm">{test.patientName}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              ID: {test.patientId}
            </div>
          </div>
          <div>
            <div className="text-sm font-medium">Requested By</div>
            <div className="text-sm">{test.requestedBy}</div>
          </div>
          <div>
            <div className="text-sm font-medium">Request Date</div>
            <div className="text-sm">
              {new Date(test.requestDate).toLocaleDateString()}
            </div>
          </div>

          {test.status === "completed" && test.results && (
            <div className="col-span-3">
              <div className="text-sm font-medium">Results</div>
              <div className="text-sm">{test.results}</div>
              {test.completedDate && (
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Completed on{" "}
                  {new Date(test.completedDate).toLocaleDateString()}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex justify-end mt-4 gap-2">
          <Button variant="outline" size="sm">
            View Details
          </Button>

          {test.status === "pending" && (
            <Button size="sm">Process Sample</Button>
          )}

          {test.status === "in-progress" && (
            <Button size="sm">Enter Results</Button>
          )}

          {test.status === "completed" && (
            <Button size="sm" variant="secondary">
              <Download className="mr-2 h-4 w-4" />
              Download Report
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default LabManagement;
