import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  PlusCircle,
  Search,
  Edit,
  Trash2,
  FileText,
  TestTube2 as Flask,
  Microscope,
  Beaker,
  Syringe,
  TestTube as Vial,
  Filter,
  CheckCircle2,
  Clock,
  AlertCircle,
  Printer,
  QrCode,
  BarChart,
  FileCheck,
  FileWarning,
  Pencil,
  CheckSquare,
  XCircle,
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface TestParameter {
  id: string;
  name: string;
  unit: string;
  normalRange: string;
  criticalLow?: string;
  criticalHigh?: string;
  result?: string;
  flag?: "normal" | "low" | "high" | "critical";
  displayOrder: number;
}

interface TestResult {
  id: string;
  sampleId: string;
  patientId: string;
  patientName: string;
  mrNumber: string;
  testName: string;
  sampleType: string;
  collectionDate: string;
  collectionTime: string;
  receivedDate: string;
  receivedTime: string;
  status: "pending" | "in_progress" | "completed" | "verified" | "rejected";
  priority: "routine" | "urgent" | "stat";
  parameters: TestParameter[];
  notes?: string;
  performedBy?: string;
  verifiedBy?: string;
  completedDate?: string;
  verifiedDate?: string;
}

const ResultsEntry = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("pending");
  const [isResultEntryDialogOpen, setIsResultEntryDialogOpen] = useState(false);
  const [isVerifyResultDialogOpen, setIsVerifyResultDialogOpen] =
    useState(false);
  const [selectedResult, setSelectedResult] = useState<TestResult | null>(null);

  // Mock data for test results
  const [testResults, setTestResults] = useState<TestResult[]>([
    {
      id: "result-001",
      sampleId: "S-10001",
      patientId: "P-1001",
      patientName: "John Smith",
      mrNumber: "MR-10001",
      testName: "Complete Blood Count",
      sampleType: "Blood",
      collectionDate: "2023-06-15",
      collectionTime: "10:30 AM",
      receivedDate: "2023-06-15",
      receivedTime: "11:00 AM",
      status: "verified",
      priority: "routine",
      parameters: [
        {
          id: "param-001",
          name: "Hemoglobin",
          unit: "g/dL",
          normalRange: "13.5-17.5 (Male), 12.0-15.5 (Female)",
          criticalLow: "7",
          criticalHigh: "20",
          result: "14.2",
          flag: "normal",
          displayOrder: 1,
        },
        {
          id: "param-002",
          name: "WBC Count",
          unit: "cells/μL",
          normalRange: "4,500-11,000",
          criticalLow: "2000",
          criticalHigh: "30000",
          result: "7,500",
          flag: "normal",
          displayOrder: 2,
        },
        {
          id: "param-003",
          name: "RBC Count",
          unit: "cells/μL",
          normalRange: "4.5-5.9 (Male), 4.1-5.1 (Female)",
          result: "4.8",
          flag: "normal",
          displayOrder: 3,
        },
        {
          id: "param-004",
          name: "Platelets",
          unit: "cells/μL",
          normalRange: "150,000-450,000",
          criticalLow: "20000",
          criticalHigh: "1000000",
          result: "250,000",
          flag: "normal",
          displayOrder: 4,
        },
      ],
      performedBy: "Lab Tech Johnson",
      verifiedBy: "Dr. Wilson",
      completedDate: "2023-06-15",
      verifiedDate: "2023-06-15",
    },
    {
      id: "result-002",
      sampleId: "S-10002",
      patientId: "P-1002",
      patientName: "Emily Johnson",
      mrNumber: "MR-10002",
      testName: "Liver Function Test",
      sampleType: "Blood",
      collectionDate: "2023-06-15",
      collectionTime: "11:15 AM",
      receivedDate: "2023-06-15",
      receivedTime: "11:45 AM",
      status: "completed",
      priority: "urgent",
      parameters: [
        {
          id: "param-005",
          name: "ALT",
          unit: "U/L",
          normalRange: "7-55",
          criticalHigh: "1000",
          result: "65",
          flag: "high",
          displayOrder: 1,
        },
        {
          id: "param-006",
          name: "AST",
          unit: "U/L",
          normalRange: "8-48",
          criticalHigh: "1000",
          result: "58",
          flag: "high",
          displayOrder: 2,
        },
        {
          id: "param-007",
          name: "ALP",
          unit: "U/L",
          normalRange: "45-115",
          result: "85",
          flag: "normal",
          displayOrder: 3,
        },
        {
          id: "param-008",
          name: "Bilirubin (Total)",
          unit: "mg/dL",
          normalRange: "0.1-1.2",
          criticalHigh: "15",
          result: "0.8",
          flag: "normal",
          displayOrder: 4,
        },
      ],
      performedBy: "Lab Tech Davis",
      completedDate: "2023-06-15",
    },
    {
      id: "result-003",
      sampleId: "S-10003",
      patientId: "P-1003",
      patientName: "Michael Brown",
      mrNumber: "MR-10003",
      testName: "Urine Routine",
      sampleType: "Urine",
      collectionDate: "2023-06-15",
      collectionTime: "12:00 PM",
      receivedDate: "2023-06-15",
      receivedTime: "12:30 PM",
      status: "in_progress",
      priority: "routine",
      parameters: [
        {
          id: "param-019",
          name: "Color",
          unit: "",
          normalRange: "Pale Yellow to Yellow",
          displayOrder: 1,
        },
        {
          id: "param-020",
          name: "pH",
          unit: "",
          normalRange: "4.5-8.0",
          displayOrder: 2,
        },
        {
          id: "param-021",
          name: "Specific Gravity",
          unit: "",
          normalRange: "1.005-1.030",
          displayOrder: 3,
        },
        {
          id: "param-022",
          name: "Protein",
          unit: "",
          normalRange: "Negative",
          displayOrder: 4,
        },
        {
          id: "param-023",
          name: "Glucose",
          unit: "",
          normalRange: "Negative",
          displayOrder: 5,
        },
        {
          id: "param-024",
          name: "RBC",
          unit: "/HPF",
          normalRange: "0-2",
          displayOrder: 6,
        },
        {
          id: "param-025",
          name: "WBC",
          unit: "/HPF",
          normalRange: "0-5",
          displayOrder: 7,
        },
      ],
    },
    {
      id: "result-004",
      sampleId: "S-10006",
      patientId: "P-1001",
      patientName: "John Smith",
      mrNumber: "MR-10001",
      testName: "Lipid Profile",
      sampleType: "Blood",
      collectionDate: "2023-06-16",
      collectionTime: "10:00 AM",
      receivedDate: "2023-06-16",
      receivedTime: "10:30 AM",
      status: "pending",
      priority: "routine",
      parameters: [
        {
          id: "param-012",
          name: "Total Cholesterol",
          unit: "mg/dL",
          normalRange: "&lt;200",
          displayOrder: 1,
        },
        {
          id: "param-013",
          name: "HDL Cholesterol",
          unit: "mg/dL",
          normalRange: "&gt;40 (Male), &gt;50 (Female)",
          displayOrder: 2,
        },
        {
          id: "param-014",
          name: "LDL Cholesterol",
          unit: "mg/dL",
          normalRange: "&lt;100",
          displayOrder: 3,
        },
        {
          id: "param-015",
          name: "Triglycerides",
          unit: "mg/dL",
          normalRange: "&lt;150",
          displayOrder: 4,
        },
      ],
    },
  ]);

  // Filter results based on search query and active tab
  const filteredResults = testResults.filter((result) => {
    const matchesSearch =
      result.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      result.sampleId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      result.mrNumber.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesTab =
      (activeTab === "pending" && result.status === "pending") ||
      (activeTab === "in_progress" && result.status === "in_progress") ||
      (activeTab === "completed" && result.status === "completed") ||
      (activeTab === "verified" && result.status === "verified") ||
      activeTab === "all";

    return matchesSearch && matchesTab;
  });

  // Handle opening the result entry dialog
  const handleOpenResultEntryDialog = (result: TestResult) => {
    setSelectedResult(result);
    setIsResultEntryDialogOpen(true);
  };

  // Handle opening the verify result dialog
  const handleOpenVerifyResultDialog = (result: TestResult) => {
    setSelectedResult(result);
    setIsVerifyResultDialogOpen(true);
  };

  // Get status badge class
  const getStatusBadgeClass = (status: TestResult["status"]) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "in_progress":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "verified":
        return "bg-indigo-100 text-indigo-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Get priority badge class
  const getPriorityBadgeClass = (priority: TestResult["priority"]) => {
    switch (priority) {
      case "routine":
        return "bg-blue-100 text-blue-800";
      case "urgent":
        return "bg-orange-100 text-orange-800";
      case "stat":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Get status icon
  const getStatusIcon = (status: TestResult["status"]) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case "in_progress":
        return <Flask className="h-4 w-4 text-blue-600" />;
      case "completed":
        return <CheckCircle2 className="h-4 w-4 text-green-600" />;
      case "verified":
        return <FileCheck className="h-4 w-4 text-indigo-600" />;
      case "rejected":
        return <FileWarning className="h-4 w-4 text-red-600" />;
      default:
        return null;
    }
  };

  // Handle save results
  const handleSaveResults = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedResult) return;

    const performedBy = (
      e.currentTarget.elements.namedItem("performedBy") as HTMLInputElement
    ).value;

    // Update parameters with results
    const updatedParameters = selectedResult.parameters.map((param) => {
      const resultInput = e.currentTarget.elements.namedItem(
        `result-${param.id}`,
      ) as HTMLInputElement;
      const result = resultInput ? resultInput.value : param.result;

      // Determine flag based on result and normal range
      let flag: TestParameter["flag"] = "normal";
      if (result) {
        // Simple logic for numeric results
        if (param.normalRange.includes("-")) {
          const [min, max] = param.normalRange.split("-").map(Number);
          const numResult = Number(result);
          if (!isNaN(numResult) && !isNaN(min) && !isNaN(max)) {
            if (numResult < min) flag = "low";
            if (numResult > max) flag = "high";
          }
        } else if (param.normalRange.includes("&lt;")) {
          const max = Number(param.normalRange.replace("&lt;", "").trim());
          const numResult = Number(result);
          if (!isNaN(numResult) && !isNaN(max) && numResult >= max) {
            flag = "high";
          }
        } else if (param.normalRange.includes("&gt;")) {
          const min = Number(param.normalRange.replace("&gt;", "").trim());
          const numResult = Number(result);
          if (!isNaN(numResult) && !isNaN(min) && numResult <= min) {
            flag = "low";
          }
        }

        // Check for critical values
        if (
          param.criticalLow &&
          !isNaN(Number(result)) &&
          Number(result) <= Number(param.criticalLow)
        ) {
          flag = "critical";
        }
        if (
          param.criticalHigh &&
          !isNaN(Number(result)) &&
          Number(result) >= Number(param.criticalHigh)
        ) {
          flag = "critical";
        }
      }

      return {
        ...param,
        result,
        flag: result ? flag : undefined,
      };
    });

    // Update test result
    const updatedResults = testResults.map((result) => {
      if (result.id === selectedResult.id) {
        return {
          ...result,
          status: "completed" as const,
          parameters: updatedParameters,
          performedBy,
          completedDate: new Date().toISOString().split("T")[0],
        };
      }
      return result;
    });

    setTestResults(updatedResults);
    setIsResultEntryDialogOpen(false);
    toast({
      title: "Success",
      description: "Test results saved successfully",
    });
  };

  // Handle verify results
  const handleVerifyResults = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedResult) return;

    const verifiedBy = (
      e.currentTarget.elements.namedItem("verifiedBy") as HTMLInputElement
    ).value;

    // Update test result
    const updatedResults = testResults.map((result) => {
      if (result.id === selectedResult.id) {
        return {
          ...result,
          status: "verified" as const,
          verifiedBy,
          verifiedDate: new Date().toISOString().split("T")[0],
        };
      }
      return result;
    });

    setTestResults(updatedResults);
    setIsVerifyResultDialogOpen(false);
    toast({
      title: "Success",
      description: "Test results verified successfully",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Results Entry</h2>
          <p className="text-muted-foreground">
            Enter and verify laboratory test results
          </p>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by patient name, MR number, sample ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>
        <Button variant="outline" size="icon">
          <Filter className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon">
          <Printer className="h-4 w-4" />
        </Button>
      </div>

      <Tabs
        defaultValue="pending"
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="grid grid-cols-5 w-full">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="in_progress">In Progress</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="verified">Verified</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-4">
          <Card>
            <CardContent className="p-0">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Sample ID</TableHead>
                      <TableHead>Patient</TableHead>
                      <TableHead>Test</TableHead>
                      <TableHead>Sample Type</TableHead>
                      <TableHead>Collection</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredResults.length > 0 ? (
                      filteredResults.map((result) => (
                        <TableRow key={result.id}>
                          <TableCell className="font-medium">
                            {result.sampleId}
                          </TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium">
                                {result.patientName}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {result.mrNumber}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{result.testName}</TableCell>
                          <TableCell>{result.sampleType}</TableCell>
                          <TableCell>
                            <div>
                              <div>
                                {new Date(
                                  result.collectionDate,
                                ).toLocaleDateString()}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {result.collectionTime}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <span
                              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getPriorityBadgeClass(
                                result.priority,
                              )}`}
                            >
                              {result.priority.charAt(0).toUpperCase() +
                                result.priority.slice(1)}
                            </span>
                          </TableCell>
                          <TableCell>
                            <span
                              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusBadgeClass(
                                result.status,
                              )}`}
                            >
                              <div className="flex items-center space-x-1">
                                {getStatusIcon(result.status)}
                                <span>
                                  {result.status
                                    .replace("_", " ")
                                    .charAt(0)
                                    .toUpperCase() +
                                    result.status.replace("_", " ").slice(1)}
                                </span>
                              </div>
                            </span>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end space-x-2">
                              {(result.status === "pending" ||
                                result.status === "in_progress") && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() =>
                                    handleOpenResultEntryDialog(result)
                                  }
                                >
                                  Enter Results
                                </Button>
                              )}
                              {result.status === "completed" && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() =>
                                    handleOpenVerifyResultDialog(result)
                                  }
                                >
                                  Verify
                                </Button>
                              )}
                              <Button
                                variant="ghost"
                                size="icon"
                                title="Print Report"
                              >
                                <Printer className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                title="View Details"
                              >
                                <FileText className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-4">
                          No results found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Result Entry Dialog */}
      <Dialog
        open={isResultEntryDialogOpen}
        onOpenChange={setIsResultEntryDialogOpen}
      >
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>Enter Test Results</DialogTitle>
          </DialogHeader>
          {selectedResult && (
            <form onSubmit={handleSaveResults} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Patient</Label>
                  <div className="p-2 bg-muted rounded-md">
                    {selectedResult.patientName} ({selectedResult.mrNumber})
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Sample ID</Label>
                  <div className="p-2 bg-muted rounded-md">
                    {selectedResult.sampleId}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Test</Label>
                  <div className="p-2 bg-muted rounded-md">
                    {selectedResult.testName}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Sample Type</Label>
                  <div className="p-2 bg-muted rounded-md">
                    {selectedResult.sampleType}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="performedBy">Performed By</Label>
                <Input
                  id="performedBy"
                  placeholder="Enter your name"
                  required
                  defaultValue={selectedResult.performedBy}
                />
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Parameter</TableHead>
                      <TableHead>Normal Range</TableHead>
                      <TableHead>Critical Values</TableHead>
                      <TableHead>Result</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedResult.parameters.map((param) => (
                      <TableRow key={param.id}>
                        <TableCell>
                          <div className="font-medium">{param.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {param.unit && `Unit: ${param.unit}`}
                          </div>
                        </TableCell>
                        <TableCell>{param.normalRange}</TableCell>
                        <TableCell>
                          {param.criticalLow || param.criticalHigh ? (
                            <div className="text-sm">
                              {param.criticalLow && (
                                <span className="text-red-500">
                                  Low: &lt;{param.criticalLow}
                                </span>
                              )}
                              {param.criticalLow && param.criticalHigh && " | "}
                              {param.criticalHigh && (
                                <span className="text-red-500">
                                  High: &gt;{param.criticalHigh}
                                </span>
                              )}
                            </div>
                          ) : (
                            <span className="text-muted-foreground text-sm">
                              None
                            </span>
                          )}
                        </TableCell>
                        <TableCell>
                          <Input
                            id={`result-${param.id}`}
                            placeholder="Enter result"
                            defaultValue={param.result}
                            className="w-full"
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <DialogFooter>
                <Button type="submit">
                  <CheckSquare className="mr-2 h-4 w-4" />
                  Save Results
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Verify Result Dialog */}
      <Dialog
        open={isVerifyResultDialogOpen}
        onOpenChange={setIsVerifyResultDialogOpen}
      >
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>Verify Test Results</DialogTitle>
          </DialogHeader>
          {selectedResult && (
            <form onSubmit={handleVerifyResults} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Patient</Label>
                  <div className="p-2 bg-muted rounded-md">
                    {selectedResult.patientName} ({selectedResult.mrNumber})
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Sample ID</Label>
                  <div className="p-2 bg-muted rounded-md">
                    {selectedResult.sampleId}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Test</Label>
                  <div className="p-2 bg-muted rounded-md">
                    {selectedResult.testName}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Performed By</Label>
                  <div className="p-2 bg-muted rounded-md">
                    {selectedResult.performedBy}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="verifiedBy">Verified By</Label>
                <Input id="verifiedBy" placeholder="Enter your name" required />
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Parameter</TableHead>
                      <TableHead>Normal Range</TableHead>
                      <TableHead>Result</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedResult.parameters.map((param) => {
                      const flagColors = {
                        normal: "text-green-600",
                        low: "text-amber-600",
                        high: "text-amber-600",
                        critical: "text-red-600",
                      };

                      const flagIcons = {
                        normal: <CheckCircle2 className="h-4 w-4" />,
                        low: <AlertCircle className="h-4 w-4" />,
                        high: <AlertCircle className="h-4 w-4" />,
                        critical: <XCircle className="h-4 w-4" />,
                      };

                      return (
                        <TableRow key={param.id}>
                          <TableCell>
                            <div className="font-medium">{param.name}</div>
                            <div className="text-xs text-muted-foreground">
                              {param.unit && `Unit: ${param.unit}`}
                            </div>
                          </TableCell>
                          <TableCell>{param.normalRange}</TableCell>
                          <TableCell className="font-medium">
                            {param.result || "Not entered"}
                          </TableCell>
                          <TableCell>
                            {param.flag ? (
                              <div
                                className={`flex items-center space-x-1 ${flagColors[param.flag]}`}
                              >
                                {flagIcons[param.flag]}
                                <span>
                                  {param.flag.charAt(0).toUpperCase() +
                                    param.flag.slice(1)}
                                </span>
                              </div>
                            ) : (
                              <span className="text-muted-foreground">
                                Not applicable
                              </span>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>

              <DialogFooter>
                <Button type="submit">
                  <FileCheck className="mr-2 h-4 w-4" />
                  Verify Results
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ResultsEntry;
