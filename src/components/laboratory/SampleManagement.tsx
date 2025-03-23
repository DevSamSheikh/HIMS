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
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface Sample {
  id: string;
  sampleId: string;
  patientId: string;
  patientName: string;
  mrNumber: string;
  testName: string;
  sampleType: string;
  collectionDate: string;
  collectionTime: string;
  collectedBy: string;
  status:
    | "pending"
    | "collected"
    | "received"
    | "processing"
    | "completed"
    | "rejected";
  priority: "routine" | "urgent" | "stat";
  notes?: string;
  barcode?: string;
}

const SampleManagement = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [isCollectSampleDialogOpen, setIsCollectSampleDialogOpen] =
    useState(false);
  const [isReceiveSampleDialogOpen, setIsReceiveSampleDialogOpen] =
    useState(false);
  const [isRejectSampleDialogOpen, setIsRejectSampleDialogOpen] =
    useState(false);
  const [isNewSampleDialogOpen, setIsNewSampleDialogOpen] = useState(false);
  const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false);
  const [isGraphDialogOpen, setIsGraphDialogOpen] = useState(false);
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);
  const [isQrCodeDialogOpen, setIsQrCodeDialogOpen] = useState(false);
  const [selectedSample, setSelectedSample] = useState<Sample | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [filterOptions, setFilterOptions] = useState({
    sampleType: "",
    priority: "",
    dateFrom: "",
    dateTo: "",
  });

  // Mock data for samples
  const [samples, setSamples] = useState<Sample[]>([
    {
      id: "sample-001",
      sampleId: "S-10001",
      patientId: "P-1001",
      patientName: "John Smith",
      mrNumber: "MR-10001",
      testName: "Complete Blood Count",
      sampleType: "Blood",
      collectionDate: "2023-06-15",
      collectionTime: "10:30 AM",
      collectedBy: "Nurse Johnson",
      status: "completed",
      priority: "routine",
      barcode: "S10001-CBC",
    },
    {
      id: "sample-002",
      sampleId: "S-10002",
      patientId: "P-1002",
      patientName: "Emily Johnson",
      mrNumber: "MR-10002",
      testName: "Liver Function Test",
      sampleType: "Blood",
      collectionDate: "2023-06-15",
      collectionTime: "11:15 AM",
      collectedBy: "Nurse Wilson",
      status: "processing",
      priority: "urgent",
      barcode: "S10002-LFT",
    },
    {
      id: "sample-003",
      sampleId: "S-10003",
      patientId: "P-1003",
      patientName: "Michael Brown",
      mrNumber: "MR-10003",
      testName: "Urine Routine",
      sampleType: "Urine",
      collectionDate: "2023-06-15",
      collectionTime: "12:00 PM",
      collectedBy: "Nurse Davis",
      status: "received",
      priority: "routine",
      barcode: "S10003-URINE",
    },
    {
      id: "sample-004",
      sampleId: "S-10004",
      patientId: "P-1004",
      patientName: "Sarah Wilson",
      mrNumber: "MR-10004",
      testName: "Blood Glucose Fasting",
      sampleType: "Blood",
      collectionDate: "2023-06-16",
      collectionTime: "08:30 AM",
      collectedBy: "",
      status: "pending",
      priority: "routine",
    },
    {
      id: "sample-005",
      sampleId: "S-10005",
      patientId: "P-1005",
      patientName: "David Miller",
      mrNumber: "MR-10005",
      testName: "Thyroid Profile",
      sampleType: "Blood",
      collectionDate: "2023-06-16",
      collectionTime: "09:15 AM",
      collectedBy: "",
      status: "pending",
      priority: "stat",
    },
    {
      id: "sample-006",
      sampleId: "S-10006",
      patientId: "P-1001",
      patientName: "John Smith",
      mrNumber: "MR-10001",
      testName: "Lipid Profile",
      sampleType: "Blood",
      collectionDate: "2023-06-16",
      collectionTime: "10:00 AM",
      collectedBy: "Nurse Johnson",
      status: "collected",
      priority: "routine",
      barcode: "S10006-LIPID",
    },
    {
      id: "sample-007",
      sampleId: "S-10007",
      patientId: "P-1006",
      patientName: "Jennifer Lee",
      mrNumber: "MR-10006",
      testName: "Stool Routine",
      sampleType: "Stool",
      collectionDate: "2023-06-16",
      collectionTime: "11:30 AM",
      collectedBy: "Nurse Wilson",
      status: "rejected",
      priority: "routine",
      notes: "Insufficient sample quantity",
      barcode: "S10007-STOOL",
    },
  ]);

  // Filter samples based on search query, active tab, and filter options
  const filteredSamples = samples.filter(
    (sample) =>
      (sample.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sample.mrNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sample.sampleId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sample.testName.toLowerCase().includes(searchQuery.toLowerCase())) &&
      (activeTab === "all" || sample.status === activeTab) &&
      (filterOptions.sampleType === "" ||
        sample.sampleType === filterOptions.sampleType) &&
      (filterOptions.priority === "" ||
        sample.priority === filterOptions.priority) &&
      (filterOptions.dateFrom === "" ||
        new Date(sample.collectionDate) >= new Date(filterOptions.dateFrom)) &&
      (filterOptions.dateTo === "" ||
        new Date(sample.collectionDate) <= new Date(filterOptions.dateTo)),
  );

  // Calculate pagination
  const totalPages = Math.ceil(filteredSamples.length / itemsPerPage);
  const paginatedSamples = filteredSamples.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  // Get status badge class
  const getStatusBadgeClass = (status: Sample["status"]) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "collected":
        return "bg-blue-100 text-blue-800";
      case "received":
        return "bg-indigo-100 text-indigo-800";
      case "processing":
        return "bg-purple-100 text-purple-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Get priority badge class
  const getPriorityBadgeClass = (priority: Sample["priority"]) => {
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
  const getStatusIcon = (status: Sample["status"]) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case "collected":
        return <Vial className="h-4 w-4 text-blue-600" />;
      case "received":
        return <CheckCircle2 className="h-4 w-4 text-indigo-600" />;
      case "processing":
        return <Flask className="h-4 w-4 text-purple-600" />;
      case "completed":
        return <CheckCircle2 className="h-4 w-4 text-green-600" />;
      case "rejected":
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      default:
        return null;
    }
  };

  // Handle collect sample
  const handleCollectSample = (sample: Sample) => {
    setSelectedSample(sample);
    setIsCollectSampleDialogOpen(true);
  };

  // Handle receive sample
  const handleReceiveSample = (sample: Sample) => {
    setSelectedSample(sample);
    setIsReceiveSampleDialogOpen(true);
  };

  // Handle reject sample
  const handleRejectSample = (sample: Sample) => {
    setSelectedSample(sample);
    setIsRejectSampleDialogOpen(true);
  };

  // Handle collect sample submit
  const handleCollectSampleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedSample) return;

    const collectedBy = (
      e.currentTarget.elements.namedItem("collectedBy") as HTMLInputElement
    ).value;
    const notes = (
      e.currentTarget.elements.namedItem("notes") as HTMLInputElement
    ).value;

    // Update sample status
    const updatedSamples = samples.map((sample) => {
      if (sample.id === selectedSample.id) {
        return {
          ...sample,
          status: "collected" as const,
          collectedBy,
          notes: notes || sample.notes,
          barcode: `${sample.sampleId}-${sample.testName.substring(0, 5).toUpperCase()}`,
        };
      }
      return sample;
    });

    setSamples(updatedSamples);
    setIsCollectSampleDialogOpen(false);
    toast({
      title: "Success",
      description: "Sample collected successfully",
    });
  };

  // Handle receive sample submit
  const handleReceiveSampleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedSample) return;

    const notes = (
      e.currentTarget.elements.namedItem("notes") as HTMLInputElement
    ).value;

    // Update sample status
    const updatedSamples = samples.map((sample) => {
      if (sample.id === selectedSample.id) {
        return {
          ...sample,
          status: "received" as const,
          notes: notes || sample.notes,
        };
      }
      return sample;
    });

    setSamples(updatedSamples);
    setIsReceiveSampleDialogOpen(false);
    toast({
      title: "Success",
      description: "Sample received successfully",
    });
  };

  // Handle reject sample submit
  const handleRejectSampleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedSample) return;

    const reason = (
      e.currentTarget.elements.namedItem("reason") as HTMLSelectElement
    ).value;
    const notes = (
      e.currentTarget.elements.namedItem("notes") as HTMLInputElement
    ).value;

    // Update sample status
    const updatedSamples = samples.map((sample) => {
      if (sample.id === selectedSample.id) {
        return {
          ...sample,
          status: "rejected" as const,
          notes: `${reason}${notes ? `: ${notes}` : ""}`,
        };
      }
      return sample;
    });

    setSamples(updatedSamples);
    setIsRejectSampleDialogOpen(false);
    toast({
      title: "Sample Rejected",
      description: "Sample has been marked as rejected",
    });
  };

  // Handle new sample submission
  const handleNewSampleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.currentTarget;
    const patientId = (form.elements.namedItem("patientId") as HTMLInputElement)
      .value;
    const patientName = (
      form.elements.namedItem("patientName") as HTMLInputElement
    ).value;
    const mrNumber = (form.elements.namedItem("mrNumber") as HTMLInputElement)
      .value;
    const testName = (form.elements.namedItem("testName") as HTMLSelectElement)
      .value;
    const sampleType = (
      form.elements.namedItem("sampleType") as HTMLSelectElement
    ).value;
    const priority = (form.elements.namedItem("priority") as HTMLSelectElement)
      .value as Sample["priority"];
    const notes = (form.elements.namedItem("notes") as HTMLInputElement).value;

    // Generate a new sample ID
    const sampleId = `S-${10000 + samples.length + 1}`;

    // Create new sample
    const newSample: Sample = {
      id: `sample-${Date.now()}`,
      sampleId,
      patientId,
      patientName,
      mrNumber,
      testName,
      sampleType,
      collectionDate: new Date().toISOString().split("T")[0],
      collectionTime: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      collectedBy: "",
      status: "pending",
      priority,
      notes: notes || undefined,
    };

    setSamples([...samples, newSample]);
    setIsNewSampleDialogOpen(false);
    toast({
      title: "Success",
      description: "New sample request created successfully",
    });
  };

  // Handle filter submission
  const handleFilterSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsFilterDialogOpen(false);
    // The filter is already applied through the filteredSamples computation
    toast({
      title: "Filters Applied",
      description: "Sample list has been filtered according to your criteria",
    });
  };

  // Handle print function
  const handlePrint = () => {
    const printContent = document.createElement("div");
    printContent.innerHTML = `
      <h1 style="text-align: center; font-size: 24px; margin-bottom: 20px;">Sample Management Report</h1>
      <p style="text-align: center; margin-bottom: 30px;">Generated on ${new Date().toLocaleString()}</p>
      <table style="width: 100%; border-collapse: collapse;">
        <thead>
          <tr>
            <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Sample ID</th>
            <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Patient</th>
            <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Test</th>
            <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Sample Type</th>
            <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Collection Date</th>
            <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Status</th>
          </tr>
        </thead>
        <tbody>
          ${filteredSamples
            .map(
              (sample) => `
            <tr>
              <td style="border: 1px solid #ddd; padding: 8px;">${sample.sampleId}</td>
              <td style="border: 1px solid #ddd; padding: 8px;">${sample.patientName} (${sample.mrNumber})</td>
              <td style="border: 1px solid #ddd; padding: 8px;">${sample.testName}</td>
              <td style="border: 1px solid #ddd; padding: 8px;">${sample.sampleType}</td>
              <td style="border: 1px solid #ddd; padding: 8px;">${new Date(sample.collectionDate).toLocaleDateString()} ${sample.collectionTime}</td>
              <td style="border: 1px solid #ddd; padding: 8px;">${sample.status.charAt(0).toUpperCase() + sample.status.slice(1)}</td>
            </tr>
          `,
            )
            .join("")}
        </tbody>
      </table>
    `;

    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Sample Management Report</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 20px; }
            </style>
          </head>
          <body>
            ${printContent.innerHTML}
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  // Handle QR code display
  const handleQrCode = (sample: Sample) => {
    setSelectedSample(sample);
    setIsQrCodeDialogOpen(true);
  };

  // Handle view report
  const handleViewReport = (sample: Sample) => {
    setSelectedSample(sample);
    setIsReportDialogOpen(true);
  };

  // Print QR code
  const printQrCode = () => {
    if (!selectedSample) return;

    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Sample Barcode</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 20px; text-align: center; }
              .barcode-container { border: 1px solid #ddd; display: inline-block; padding: 20px; margin-top: 20px; }
            </style>
          </head>
          <body>
            <div class="barcode-container">
              <div>
                <p style="font-weight: bold; margin: 0;">${selectedSample.sampleId}</p>
                <p style="font-size: 12px; margin: 4px 0;">${selectedSample.patientName}</p>
              </div>
              <svg width="200" height="200" viewBox="0 0 100 100">
                <rect x="10" y="10" width="80" height="80" fill="#000" />
                <rect x="20" y="20" width="60" height="60" fill="#fff" />
                <rect x="30" y="30" width="40" height="40" fill="#000" />
                <rect x="40" y="40" width="20" height="20" fill="#fff" />
              </svg>
              <div>
                <p style="font-family: monospace; margin: 4px 0;">${selectedSample.barcode}</p>
              </div>
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  // Print report
  const printReport = () => {
    const reportElement = document.getElementById("sample-report");
    if (!reportElement) return;

    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Sample Report</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 20px; }
              .report-container { max-width: 800px; margin: 0 auto; }
              h2 { margin-top: 0; }
              .header { display: flex; justify-content: space-between; }
              .section { margin-top: 20px; padding-top: 20px; border-top: 1px solid #ddd; }
              .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
              .label { font-size: 12px; color: #666; margin-bottom: 4px; }
              .value { font-weight: 500; }
            </style>
          </head>
          <body>
            <div class="report-container">
              ${reportElement.innerHTML}
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  // Get status bar color for graph
  const getStatusBarColor = (status: Sample["status"]) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500";
      case "collected":
        return "bg-blue-500";
      case "received":
        return "bg-indigo-500";
      case "processing":
        return "bg-purple-500";
      case "completed":
        return "bg-green-500";
      case "rejected":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  // Get sample type statistics
  const getSampleTypeStats = () => {
    const sampleTypes: Record<string, number> = {};
    samples.forEach((sample) => {
      if (sampleTypes[sample.sampleType]) {
        sampleTypes[sample.sampleType]++;
      } else {
        sampleTypes[sample.sampleType] = 1;
      }
    });

    return Object.entries(sampleTypes).map(([type, count]) => ({
      type,
      count,
    }));
  };

  // Count samples by status
  const countByStatus = {
    all: samples.length,
    pending: samples.filter((sample) => sample.status === "pending").length,
    collected: samples.filter((sample) => sample.status === "collected").length,
    received: samples.filter((sample) => sample.status === "received").length,
    processing: samples.filter((sample) => sample.status === "processing")
      .length,
    completed: samples.filter((sample) => sample.status === "completed").length,
    rejected: samples.filter((sample) => sample.status === "rejected").length,
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Sample Management</h2>
          <p className="text-muted-foreground">
            Track and manage laboratory samples
          </p>
        </div>
        <Button onClick={() => setIsNewSampleDialogOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          New Sample Request
        </Button>
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
        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsFilterDialogOpen(true)}
        >
          <Filter className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon" onClick={() => handlePrint()}>
          <Printer className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsGraphDialogOpen(true)}
        >
          <BarChart className="h-4 w-4" />
        </Button>
      </div>

      <Tabs
        defaultValue="all"
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="grid grid-cols-7 w-full">
          <TabsTrigger value="all">All ({countByStatus.all})</TabsTrigger>
          <TabsTrigger value="pending">
            Pending ({countByStatus.pending})
          </TabsTrigger>
          <TabsTrigger value="collected">
            Collected ({countByStatus.collected})
          </TabsTrigger>
          <TabsTrigger value="received">
            Received ({countByStatus.received})
          </TabsTrigger>
          <TabsTrigger value="processing">
            Processing ({countByStatus.processing})
          </TabsTrigger>
          <TabsTrigger value="completed">
            Completed ({countByStatus.completed})
          </TabsTrigger>
          <TabsTrigger value="rejected">
            Rejected ({countByStatus.rejected})
          </TabsTrigger>
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
                    {paginatedSamples.length > 0 ? (
                      paginatedSamples.map((sample) => (
                        <TableRow key={sample.id}>
                          <TableCell className="font-medium">
                            {sample.sampleId}
                          </TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium">
                                {sample.patientName}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {sample.mrNumber}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{sample.testName}</TableCell>
                          <TableCell>{sample.sampleType}</TableCell>
                          <TableCell>
                            <div>
                              <div>
                                {new Date(
                                  sample.collectionDate,
                                ).toLocaleDateString()}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {sample.collectionTime}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <span
                              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getPriorityBadgeClass(
                                sample.priority,
                              )}`}
                            >
                              {sample.priority.charAt(0).toUpperCase() +
                                sample.priority.slice(1)}
                            </span>
                          </TableCell>
                          <TableCell>
                            <span
                              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusBadgeClass(
                                sample.status,
                              )}`}
                            >
                              <div className="flex items-center space-x-1">
                                {getStatusIcon(sample.status)}
                                <span>
                                  {sample.status.charAt(0).toUpperCase() +
                                    sample.status.slice(1)}
                                </span>
                              </div>
                            </span>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end space-x-2">
                              {sample.status === "pending" && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleCollectSample(sample)}
                                >
                                  Collect
                                </Button>
                              )}
                              {sample.status === "collected" && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleReceiveSample(sample)}
                                >
                                  Receive
                                </Button>
                              )}
                              {(sample.status === "pending" ||
                                sample.status === "collected") && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                  onClick={() => handleRejectSample(sample)}
                                >
                                  Reject
                                </Button>
                              )}
                              {sample.barcode && (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  title="Print Barcode"
                                  onClick={() => handleQrCode(sample)}
                                >
                                  <QrCode className="h-4 w-4" />
                                </Button>
                              )}
                              <Button
                                variant="ghost"
                                size="icon"
                                title="View Report"
                                onClick={() => handleViewReport(sample)}
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
                          No samples found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-between p-4 border-t">
                <div className="text-sm text-muted-foreground">
                  Showing{" "}
                  {filteredSamples.length > 0
                    ? (currentPage - 1) * itemsPerPage + 1
                    : 0}{" "}
                  to{" "}
                  {Math.min(currentPage * itemsPerPage, filteredSamples.length)}{" "}
                  of {filteredSamples.length} entries
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                    // Show pages around current page
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    return (
                      <Button
                        key={pageNum}
                        variant={
                          currentPage === pageNum ? "default" : "outline"
                        }
                        size="sm"
                        onClick={() => setCurrentPage(pageNum)}
                      >
                        {pageNum}
                      </Button>
                    );
                  })}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    disabled={currentPage === totalPages || totalPages === 0}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Collect Sample Dialog */}
      <Dialog
        open={isCollectSampleDialogOpen}
        onOpenChange={setIsCollectSampleDialogOpen}
      >
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Collect Sample</DialogTitle>
          </DialogHeader>
          {selectedSample && (
            <form onSubmit={handleCollectSampleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Sample ID</Label>
                <div className="p-2 bg-muted rounded-md">
                  {selectedSample.sampleId}
                </div>
              </div>
              <div className="space-y-2">
                <Label>Patient</Label>
                <div className="p-2 bg-muted rounded-md">
                  {selectedSample.patientName} ({selectedSample.mrNumber})
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Test</Label>
                  <div className="p-2 bg-muted rounded-md">
                    {selectedSample.testName}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Sample Type</Label>
                  <div className="p-2 bg-muted rounded-md">
                    {selectedSample.sampleType}
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="collectedBy">Collected By</Label>
                <Input
                  id="collectedBy"
                  placeholder="Enter name of collector"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Notes (Optional)</Label>
                <Input id="notes" placeholder="Any additional notes" />
              </div>
              <DialogFooter>
                <Button type="submit">
                  <Vial className="mr-2 h-4 w-4" />
                  Mark as Collected
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Receive Sample Dialog */}
      <Dialog
        open={isReceiveSampleDialogOpen}
        onOpenChange={setIsReceiveSampleDialogOpen}
      >
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Receive Sample</DialogTitle>
          </DialogHeader>
          {selectedSample && (
            <form onSubmit={handleReceiveSampleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Sample ID</Label>
                <div className="p-2 bg-muted rounded-md">
                  {selectedSample.sampleId}
                </div>
              </div>
              <div className="space-y-2">
                <Label>Patient</Label>
                <div className="p-2 bg-muted rounded-md">
                  {selectedSample.patientName} ({selectedSample.mrNumber})
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Test</Label>
                  <div className="p-2 bg-muted rounded-md">
                    {selectedSample.testName}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Sample Type</Label>
                  <div className="p-2 bg-muted rounded-md">
                    {selectedSample.sampleType}
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Collected By</Label>
                <div className="p-2 bg-muted rounded-md">
                  {selectedSample.collectedBy}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Notes (Optional)</Label>
                <Input
                  id="notes"
                  placeholder="Any additional notes"
                  defaultValue={selectedSample.notes}
                />
              </div>
              <DialogFooter>
                <Button type="submit">
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Mark as Received
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Reject Sample Dialog */}
      <Dialog
        open={isRejectSampleDialogOpen}
        onOpenChange={setIsRejectSampleDialogOpen}
      >
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Reject Sample</DialogTitle>
          </DialogHeader>
          {selectedSample && (
            <form onSubmit={handleRejectSampleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Sample ID</Label>
                <div className="p-2 bg-muted rounded-md">
                  {selectedSample.sampleId}
                </div>
              </div>
              <div className="space-y-2">
                <Label>Patient</Label>
                <div className="p-2 bg-muted rounded-md">
                  {selectedSample.patientName} ({selectedSample.mrNumber})
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Test</Label>
                  <div className="p-2 bg-muted rounded-md">
                    {selectedSample.testName}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Sample Type</Label>
                  <div className="p-2 bg-muted rounded-md">
                    {selectedSample.sampleType}
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="reason">Reason for Rejection</Label>
                <select
                  id="reason"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  required
                >
                  <option value="">Select Reason</option>
                  <option value="Insufficient sample quantity">
                    Insufficient sample quantity
                  </option>
                  <option value="Hemolyzed sample">Hemolyzed sample</option>
                  <option value="Incorrect sample container">
                    Incorrect sample container
                  </option>
                  <option value="Sample contamination">
                    Sample contamination
                  </option>
                  <option value="Improper labeling">Improper labeling</option>
                  <option value="Delayed transport">Delayed transport</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Additional Notes</Label>
                <Input id="notes" placeholder="Provide additional details" />
              </div>
              <DialogFooter>
                <Button type="submit" variant="destructive">
                  <AlertCircle className="mr-2 h-4 w-4" />
                  Reject Sample
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* New Sample Dialog */}
      <Dialog
        open={isNewSampleDialogOpen}
        onOpenChange={setIsNewSampleDialogOpen}
      >
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>New Sample Request</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleNewSampleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="patientId">Patient ID</Label>
                <Input id="patientId" placeholder="Enter patient ID" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="patientName">Patient Name</Label>
                <Input
                  id="patientName"
                  placeholder="Enter patient name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="mrNumber">MR Number</Label>
                <Input id="mrNumber" placeholder="Enter MR number" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="testName">Test Name</Label>
                <select
                  id="testName"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  required
                >
                  <option value="">Select Test</option>
                  <option value="Complete Blood Count">
                    Complete Blood Count
                  </option>
                  <option value="Liver Function Test">
                    Liver Function Test
                  </option>
                  <option value="Kidney Function Test">
                    Kidney Function Test
                  </option>
                  <option value="Lipid Profile">Lipid Profile</option>
                  <option value="Thyroid Profile">Thyroid Profile</option>
                  <option value="Urine Routine">Urine Routine</option>
                  <option value="Blood Glucose Fasting">
                    Blood Glucose Fasting
                  </option>
                  <option value="Blood Glucose Post Prandial">
                    Blood Glucose Post Prandial
                  </option>
                  <option value="HbA1c">HbA1c</option>
                  <option value="Stool Routine">Stool Routine</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="sampleType">Sample Type</Label>
                <select
                  id="sampleType"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  required
                >
                  <option value="">Select Sample Type</option>
                  <option value="Blood">Blood</option>
                  <option value="Urine">Urine</option>
                  <option value="Stool">Stool</option>
                  <option value="CSF">CSF</option>
                  <option value="Sputum">Sputum</option>
                  <option value="Swab">Swab</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="priority">Priority</Label>
                <select
                  id="priority"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  required
                >
                  <option value="routine">Routine</option>
                  <option value="urgent">Urgent</option>
                  <option value="stat">STAT</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Notes (Optional)</Label>
                <Input id="notes" placeholder="Any additional notes" />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">
                <PlusCircle className="mr-2 h-4 w-4" />
                Create Sample Request
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Filter Dialog */}
      <Dialog open={isFilterDialogOpen} onOpenChange={setIsFilterDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Filter Samples</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleFilterSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="filterSampleType">Sample Type</Label>
              <select
                id="filterSampleType"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={filterOptions.sampleType}
                onChange={(e) =>
                  setFilterOptions({
                    ...filterOptions,
                    sampleType: e.target.value,
                  })
                }
              >
                <option value="">All Sample Types</option>
                <option value="Blood">Blood</option>
                <option value="Urine">Urine</option>
                <option value="Stool">Stool</option>
                <option value="CSF">CSF</option>
                <option value="Sputum">Sputum</option>
                <option value="Swab">Swab</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="filterPriority">Priority</Label>
              <select
                id="filterPriority"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={filterOptions.priority}
                onChange={(e) =>
                  setFilterOptions({
                    ...filterOptions,
                    priority: e.target.value,
                  })
                }
              >
                <option value="">All Priorities</option>
                <option value="routine">Routine</option>
                <option value="urgent">Urgent</option>
                <option value="stat">STAT</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="filterDateFrom">Date From</Label>
                <Input
                  id="filterDateFrom"
                  type="date"
                  value={filterOptions.dateFrom}
                  onChange={(e) =>
                    setFilterOptions({
                      ...filterOptions,
                      dateFrom: e.target.value,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="filterDateTo">Date To</Label>
                <Input
                  id="filterDateTo"
                  type="date"
                  value={filterOptions.dateTo}
                  onChange={(e) =>
                    setFilterOptions({
                      ...filterOptions,
                      dateTo: e.target.value,
                    })
                  }
                />
              </div>
            </div>
            <DialogFooter className="flex justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setFilterOptions({
                    sampleType: "",
                    priority: "",
                    dateFrom: "",
                    dateTo: "",
                  });
                }}
              >
                Reset Filters
              </Button>
              <Button type="submit">Apply Filters</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Graph Dialog */}
      <Dialog open={isGraphDialogOpen} onOpenChange={setIsGraphDialogOpen}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>Sample Statistics</DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-2">Samples by Status</h3>
              <div className="h-64 flex items-end space-x-2">
                {Object.entries(countByStatus)
                  .filter(([key]) => key !== "all")
                  .map(([status, count]) => (
                    <div key={status} className="flex flex-col items-center">
                      <div
                        className={`w-16 ${getStatusBarColor(status as Sample["status"])} rounded-t-md`}
                        style={{
                          height: `${(count / samples.length) * 200}px`,
                        }}
                      ></div>
                      <div className="mt-2 text-sm font-medium">
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {count}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-2">
                Samples by Sample Type
              </h3>
              <div className="h-64 flex items-end space-x-2">
                {getSampleTypeStats().map(({ type, count }) => (
                  <div key={type} className="flex flex-col items-center">
                    <div
                      className="w-16 bg-blue-500 rounded-t-md"
                      style={{ height: `${(count / samples.length) * 200}px` }}
                    ></div>
                    <div className="mt-2 text-sm font-medium">{type}</div>
                    <div className="text-sm text-muted-foreground">{count}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Report Dialog */}
      <Dialog open={isReportDialogOpen} onOpenChange={setIsReportDialogOpen}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>Sample Report</DialogTitle>
          </DialogHeader>
          {selectedSample && (
            <div className="space-y-4" id="sample-report">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-bold">
                    Sample ID: {selectedSample.sampleId}
                  </h2>
                  <p className="text-muted-foreground">
                    Test: {selectedSample.testName}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium">
                    Date:{" "}
                    {new Date(
                      selectedSample.collectionDate,
                    ).toLocaleDateString()}
                  </p>
                  <p className="text-muted-foreground">
                    Time: {selectedSample.collectionTime}
                  </p>
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="text-lg font-medium mb-2">
                  Patient Information
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Patient Name
                    </p>
                    <p className="font-medium">{selectedSample.patientName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">MR Number</p>
                    <p className="font-medium">{selectedSample.mrNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Patient ID</p>
                    <p className="font-medium">{selectedSample.patientId}</p>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="text-lg font-medium mb-2">Sample Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Sample Type</p>
                    <p className="font-medium">{selectedSample.sampleType}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Priority</p>
                    <p className="font-medium">
                      {selectedSample.priority.charAt(0).toUpperCase() +
                        selectedSample.priority.slice(1)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Status</p>
                    <p className="font-medium">
                      {selectedSample.status.charAt(0).toUpperCase() +
                        selectedSample.status.slice(1)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Collected By
                    </p>
                    <p className="font-medium">
                      {selectedSample.collectedBy || "Not collected yet"}
                    </p>
                  </div>
                </div>
              </div>

              {selectedSample.notes && (
                <div className="border-t pt-4">
                  <h3 className="text-lg font-medium mb-2">Notes</h3>
                  <p>{selectedSample.notes}</p>
                </div>
              )}

              <div className="border-t pt-4 flex justify-end">
                <Button onClick={() => printReport()}>
                  <Printer className="mr-2 h-4 w-4" />
                  Print Report
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* QR Code Dialog */}
      <Dialog open={isQrCodeDialogOpen} onOpenChange={setIsQrCodeDialogOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Sample Barcode</DialogTitle>
          </DialogHeader>
          {selectedSample && selectedSample.barcode && (
            <div className="flex flex-col items-center space-y-4">
              <div className="border p-4 bg-white">
                <div className="text-center mb-2">
                  <p className="font-bold">{selectedSample.sampleId}</p>
                  <p className="text-sm">{selectedSample.patientName}</p>
                </div>
                <div className="flex justify-center">
                  <svg className="h-40 w-40" viewBox="0 0 100 100">
                    {/* Simple QR code representation */}
                    <rect x="10" y="10" width="80" height="80" fill="#000" />
                    <rect x="20" y="20" width="60" height="60" fill="#fff" />
                    <rect x="30" y="30" width="40" height="40" fill="#000" />
                    <rect x="40" y="40" width="20" height="20" fill="#fff" />
                  </svg>
                </div>
                <div className="text-center mt-2">
                  <p className="font-mono">{selectedSample.barcode}</p>
                </div>
              </div>
              <Button onClick={() => printQrCode()}>
                <Printer className="mr-2 h-4 w-4" />
                Print Barcode
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SampleManagement;
