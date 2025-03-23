import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
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
  Search,
  Filter,
  Printer,
  BarChart,
  CheckCircle2,
  Clock,
  AlertCircle,
  Stethoscope,
  BedDouble,
  TestTube,
  FileText,
  Send,
  X,
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface TestOrder {
  id: string;
  orderId: string;
  patientId: string;
  patientName: string;
  mrNumber: string;
  testName: string;
  orderType: "opd" | "ipd";
  orderDate: string;
  orderTime: string;
  orderedBy: string;
  status: "pending" | "processing" | "completed" | "cancelled";
  priority: "routine" | "urgent" | "stat";
  notes?: string;
  department?: string;
  ward?: string;
  bedNumber?: string;
}

const OrderManagement = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [isProcessOrderDialogOpen, setIsProcessOrderDialogOpen] =
    useState(false);
  const [isCancelOrderDialogOpen, setIsCancelOrderDialogOpen] = useState(false);
  const [isNotifyDoctorDialogOpen, setIsNotifyDoctorDialogOpen] =
    useState(false);
  const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false);
  const [isGraphDialogOpen, setIsGraphDialogOpen] = useState(false);
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<TestOrder | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [filterOptions, setFilterOptions] = useState({
    orderType: "",
    priority: "",
    dateFrom: "",
    dateTo: "",
  });

  // Mock data for test orders
  const [testOrders, setTestOrders] = useState<TestOrder[]>([
    {
      id: "order-001",
      orderId: "ORD-10001",
      patientId: "P-1001",
      patientName: "John Smith",
      mrNumber: "MR-10001",
      testName: "Complete Blood Count",
      orderType: "opd",
      orderDate: "2023-06-15",
      orderTime: "10:30 AM",
      orderedBy: "Dr. Johnson",
      status: "pending",
      priority: "routine",
      department: "General Medicine",
    },
    {
      id: "order-002",
      orderId: "ORD-10002",
      patientId: "P-1002",
      patientName: "Emily Johnson",
      mrNumber: "MR-10002",
      testName: "Liver Function Test",
      orderType: "opd",
      orderDate: "2023-06-15",
      orderTime: "11:15 AM",
      orderedBy: "Dr. Wilson",
      status: "pending",
      priority: "urgent",
      department: "Gastroenterology",
    },
    {
      id: "order-003",
      orderId: "ORD-10003",
      patientId: "P-1003",
      patientName: "Michael Brown",
      mrNumber: "MR-10003",
      testName: "Urine Routine",
      orderType: "opd",
      orderDate: "2023-06-15",
      orderTime: "12:00 PM",
      orderedBy: "Dr. Davis",
      status: "processing",
      priority: "routine",
      department: "Nephrology",
    },
    {
      id: "order-004",
      orderId: "ORD-10004",
      patientId: "P-1004",
      patientName: "Sarah Wilson",
      mrNumber: "MR-10004",
      testName: "Blood Glucose Fasting",
      orderType: "ipd",
      orderDate: "2023-06-16",
      orderTime: "08:30 AM",
      orderedBy: "Dr. Martinez",
      status: "pending",
      priority: "routine",
      ward: "Medical Ward",
      bedNumber: "B-101",
    },
    {
      id: "order-005",
      orderId: "ORD-10005",
      patientId: "P-1005",
      patientName: "David Miller",
      mrNumber: "MR-10005",
      testName: "Thyroid Profile",
      orderType: "ipd",
      orderDate: "2023-06-16",
      orderTime: "09:15 AM",
      orderedBy: "Dr. Thompson",
      status: "pending",
      priority: "stat",
      ward: "ICU",
      bedNumber: "ICU-05",
    },
    {
      id: "order-006",
      orderId: "ORD-10006",
      patientId: "P-1001",
      patientName: "John Smith",
      mrNumber: "MR-10001",
      testName: "Lipid Profile",
      orderType: "opd",
      orderDate: "2023-06-16",
      orderTime: "10:00 AM",
      orderedBy: "Dr. Johnson",
      status: "completed",
      priority: "routine",
      department: "Cardiology",
    },
    {
      id: "order-007",
      orderId: "ORD-10007",
      patientId: "P-1006",
      patientName: "Jennifer Lee",
      mrNumber: "MR-10006",
      testName: "Stool Routine",
      orderType: "ipd",
      orderDate: "2023-06-16",
      orderTime: "11:30 AM",
      orderedBy: "Dr. Wilson",
      status: "cancelled",
      priority: "routine",
      notes: "Patient discharged",
      ward: "Pediatric Ward",
      bedNumber: "P-203",
    },
  ]);

  // Filter orders based on search query, active tab, and filter options
  const filteredOrders = testOrders.filter(
    (order) =>
      (order.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.mrNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.testName.toLowerCase().includes(searchQuery.toLowerCase())) &&
      (activeTab === "all" || order.status === activeTab) &&
      (filterOptions.orderType === "" ||
        order.orderType === filterOptions.orderType) &&
      (filterOptions.priority === "" ||
        order.priority === filterOptions.priority) &&
      (filterOptions.dateFrom === "" ||
        new Date(order.orderDate) >= new Date(filterOptions.dateFrom)) &&
      (filterOptions.dateTo === "" ||
        new Date(order.orderDate) <= new Date(filterOptions.dateTo)),
  );

  // Calculate pagination
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  // Get status badge class
  const getStatusBadgeClass = (status: TestOrder["status"]) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Get priority badge class
  const getPriorityBadgeClass = (priority: TestOrder["priority"]) => {
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

  // Get order type badge class
  const getOrderTypeBadgeClass = (orderType: TestOrder["orderType"]) => {
    switch (orderType) {
      case "opd":
        return "bg-purple-100 text-purple-800";
      case "ipd":
        return "bg-indigo-100 text-indigo-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Get status icon
  const getStatusIcon = (status: TestOrder["status"]) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case "processing":
        return <TestTube className="h-4 w-4 text-blue-600" />;
      case "completed":
        return <CheckCircle2 className="h-4 w-4 text-green-600" />;
      case "cancelled":
        return <X className="h-4 w-4 text-red-600" />;
      default:
        return null;
    }
  };

  // Get order type icon
  const getOrderTypeIcon = (orderType: TestOrder["orderType"]) => {
    switch (orderType) {
      case "opd":
        return <Stethoscope className="h-4 w-4 text-purple-600" />;
      case "ipd":
        return <BedDouble className="h-4 w-4 text-indigo-600" />;
      default:
        return null;
    }
  };

  // Handle process order
  const handleProcessOrder = (order: TestOrder) => {
    setSelectedOrder(order);
    setIsProcessOrderDialogOpen(true);
  };

  // Handle cancel order
  const handleCancelOrder = (order: TestOrder) => {
    setSelectedOrder(order);
    setIsCancelOrderDialogOpen(true);
  };

  // Handle notify doctor
  const handleNotifyDoctor = (order: TestOrder) => {
    setSelectedOrder(order);
    setIsNotifyDoctorDialogOpen(true);
  };

  // Handle process order submit
  const handleProcessOrderSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedOrder) return;

    const notes = (
      e.currentTarget.elements.namedItem("notes") as HTMLInputElement
    ).value;

    // Update order status
    const updatedOrders = testOrders.map((order) => {
      if (order.id === selectedOrder.id) {
        return {
          ...order,
          status: "processing" as const,
          notes: notes || order.notes,
        };
      }
      return order;
    });

    setTestOrders(updatedOrders);
    setIsProcessOrderDialogOpen(false);
    toast({
      title: "Success",
      description: "Order is now being processed",
    });

    // Here you would typically create a sample from this order
    // This is where the integration with SampleManagement would happen
  };

  // Handle cancel order submit
  const handleCancelOrderSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedOrder) return;

    const reason = (
      e.currentTarget.elements.namedItem("reason") as HTMLSelectElement
    ).value;
    const notes = (
      e.currentTarget.elements.namedItem("notes") as HTMLInputElement
    ).value;

    // Update order status
    const updatedOrders = testOrders.map((order) => {
      if (order.id === selectedOrder.id) {
        return {
          ...order,
          status: "cancelled" as const,
          notes: `${reason}${notes ? `: ${notes}` : ""}`,
        };
      }
      return order;
    });

    setTestOrders(updatedOrders);
    setIsCancelOrderDialogOpen(false);
    toast({
      title: "Order Cancelled",
      description: "Order has been cancelled",
    });
  };

  // Handle notify doctor submit
  const handleNotifyDoctorSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedOrder) return;

    const message = (
      e.currentTarget.elements.namedItem("message") as HTMLTextAreaElement
    ).value;

    // In a real application, this would send a notification to the doctor
    // For now, we'll just show a toast
    setIsNotifyDoctorDialogOpen(false);
    toast({
      title: "Notification Sent",
      description: `Message sent to ${selectedOrder.orderedBy}`,
    });
  };

  // Handle filter submission
  const handleFilterSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsFilterDialogOpen(false);
    // The filter is already applied through the filteredOrders computation
    toast({
      title: "Filters Applied",
      description: "Order list has been filtered according to your criteria",
    });
  };

  // Handle print function
  const handlePrint = () => {
    const printContent = document.createElement("div");
    printContent.innerHTML = `
      <h1 style="text-align: center; font-size: 24px; margin-bottom: 20px;">Test Order Management Report</h1>
      <p style="text-align: center; margin-bottom: 30px;">Generated on ${new Date().toLocaleString()}</p>
      <table style="width: 100%; border-collapse: collapse;">
        <thead>
          <tr>
            <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Order ID</th>
            <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Patient</th>
            <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Test</th>
            <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Order Type</th>
            <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Order Date</th>
            <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Status</th>
          </tr>
        </thead>
        <tbody>
          ${filteredOrders
            .map(
              (order) => `
            <tr>
              <td style="border: 1px solid #ddd; padding: 8px;">${order.orderId}</td>
              <td style="border: 1px solid #ddd; padding: 8px;">${order.patientName} (${order.mrNumber})</td>
              <td style="border: 1px solid #ddd; padding: 8px;">${order.testName}</td>
              <td style="border: 1px solid #ddd; padding: 8px;">${order.orderType.toUpperCase()}</td>
              <td style="border: 1px solid #ddd; padding: 8px;">${new Date(order.orderDate).toLocaleDateString()} ${order.orderTime}</td>
              <td style="border: 1px solid #ddd; padding: 8px;">${order.status.charAt(0).toUpperCase() + order.status.slice(1)}</td>
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
            <title>Test Order Management Report</title>
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

  // Get status bar color for graph
  const getStatusBarColor = (status: TestOrder["status"]) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500";
      case "processing":
        return "bg-blue-500";
      case "completed":
        return "bg-green-500";
      case "cancelled":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  // Get order type statistics
  const getOrderTypeStats = () => {
    const orderTypes: Record<string, number> = {};
    testOrders.forEach((order) => {
      if (orderTypes[order.orderType]) {
        orderTypes[order.orderType]++;
      } else {
        orderTypes[order.orderType] = 1;
      }
    });

    return Object.entries(orderTypes).map(([type, count]) => ({
      type,
      count,
    }));
  };

  // Count orders by status
  const countByStatus = {
    all: testOrders.length,
    pending: testOrders.filter((order) => order.status === "pending").length,
    processing: testOrders.filter((order) => order.status === "processing")
      .length,
    completed: testOrders.filter((order) => order.status === "completed")
      .length,
    cancelled: testOrders.filter((order) => order.status === "cancelled")
      .length,
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Order Management</h2>
          <p className="text-muted-foreground">
            Track and manage laboratory test orders
          </p>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by patient name, MR number, order ID..."
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
        <TabsList className="grid grid-cols-5 w-full">
          <TabsTrigger value="all">All ({countByStatus.all})</TabsTrigger>
          <TabsTrigger value="pending">
            Pending ({countByStatus.pending})
          </TabsTrigger>
          <TabsTrigger value="processing">
            Processing ({countByStatus.processing})
          </TabsTrigger>
          <TabsTrigger value="completed">
            Completed ({countByStatus.completed})
          </TabsTrigger>
          <TabsTrigger value="cancelled">
            Cancelled ({countByStatus.cancelled})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-4">
          <Card>
            <CardContent className="p-0">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order ID</TableHead>
                      <TableHead>Patient</TableHead>
                      <TableHead>Test</TableHead>
                      <TableHead>Order Type</TableHead>
                      <TableHead>Ordered By</TableHead>
                      <TableHead>Order Date</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedOrders.length > 0 ? (
                      paginatedOrders.map((order) => (
                        <TableRow key={order.id}>
                          <TableCell className="font-medium">
                            {order.orderId}
                          </TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium">
                                {order.patientName}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {order.mrNumber}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{order.testName}</TableCell>
                          <TableCell>
                            <span
                              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getOrderTypeBadgeClass(
                                order.orderType,
                              )}`}
                            >
                              <div className="flex items-center space-x-1">
                                {getOrderTypeIcon(order.orderType)}
                                <span>{order.orderType.toUpperCase()}</span>
                              </div>
                            </span>
                            {order.orderType === "ipd" && (
                              <div className="text-xs text-muted-foreground mt-1">
                                {order.ward}, Bed: {order.bedNumber}
                              </div>
                            )}
                            {order.orderType === "opd" && order.department && (
                              <div className="text-xs text-muted-foreground mt-1">
                                {order.department}
                              </div>
                            )}
                          </TableCell>
                          <TableCell>{order.orderedBy}</TableCell>
                          <TableCell>
                            <div>
                              <div>
                                {new Date(order.orderDate).toLocaleDateString()}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {order.orderTime}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <span
                              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getPriorityBadgeClass(
                                order.priority,
                              )}`}
                            >
                              {order.priority.charAt(0).toUpperCase() +
                                order.priority.slice(1)}
                            </span>
                          </TableCell>
                          <TableCell>
                            <span
                              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusBadgeClass(
                                order.status,
                              )}`}
                            >
                              <div className="flex items-center space-x-1">
                                {getStatusIcon(order.status)}
                                <span>
                                  {order.status.charAt(0).toUpperCase() +
                                    order.status.slice(1)}
                                </span>
                              </div>
                            </span>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end space-x-2">
                              {order.status === "pending" && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleProcessOrder(order)}
                                >
                                  Process
                                </Button>
                              )}
                              {order.status === "pending" && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                  onClick={() => handleCancelOrder(order)}
                                >
                                  Cancel
                                </Button>
                              )}
                              {(order.status === "processing" ||
                                order.status === "completed") && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleNotifyDoctor(order)}
                                >
                                  Notify Doctor
                                </Button>
                              )}
                              <Button
                                variant="ghost"
                                size="icon"
                                title="View Details"
                                onClick={() => {
                                  setSelectedOrder(order);
                                  setIsReportDialogOpen(true);
                                }}
                              >
                                <FileText className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={9} className="text-center py-4">
                          No orders found
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
                  {filteredOrders.length > 0
                    ? (currentPage - 1) * itemsPerPage + 1
                    : 0}{" "}
                  to{" "}
                  {Math.min(currentPage * itemsPerPage, filteredOrders.length)}{" "}
                  of {filteredOrders.length} entries
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

      {/* Process Order Dialog */}
      <Dialog
        open={isProcessOrderDialogOpen}
        onOpenChange={setIsProcessOrderDialogOpen}
      >
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Process Order</DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <form onSubmit={handleProcessOrderSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Order ID</Label>
                <div className="p-2 bg-muted rounded-md">
                  {selectedOrder.orderId}
                </div>
              </div>
              <div className="space-y-2">
                <Label>Patient</Label>
                <div className="p-2 bg-muted rounded-md">
                  {selectedOrder.patientName} ({selectedOrder.mrNumber})
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Test</Label>
                  <div className="p-2 bg-muted rounded-md">
                    {selectedOrder.testName}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Order Type</Label>
                  <div className="p-2 bg-muted rounded-md">
                    {selectedOrder.orderType.toUpperCase()}
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Ordered By</Label>
                <div className="p-2 bg-muted rounded-md">
                  {selectedOrder.orderedBy}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Notes (Optional)</Label>
                <Input id="notes" placeholder="Any additional notes" />
              </div>
              <DialogFooter>
                <Button type="submit">
                  <TestTube className="mr-2 h-4 w-4" />
                  Process Order
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Cancel Order Dialog */}
      <Dialog
        open={isCancelOrderDialogOpen}
        onOpenChange={setIsCancelOrderDialogOpen}
      >
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Cancel Order</DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <form onSubmit={handleCancelOrderSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Order ID</Label>
                <div className="p-2 bg-muted rounded-md">
                  {selectedOrder.orderId}
                </div>
              </div>
              <div className="space-y-2">
                <Label>Patient</Label>
                <div className="p-2 bg-muted rounded-md">
                  {selectedOrder.patientName} ({selectedOrder.mrNumber})
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Test</Label>
                  <div className="p-2 bg-muted rounded-md">
                    {selectedOrder.testName}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Order Type</Label>
                  <div className="p-2 bg-muted rounded-md">
                    {selectedOrder.orderType.toUpperCase()}
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="reason">Reason for Cancellation</Label>
                <select
                  id="reason"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  required
                >
                  <option value="">Select Reason</option>
                  <option value="Test no longer required">
                    Test no longer required
                  </option>
                  <option value="Duplicate order">Duplicate order</option>
                  <option value="Patient discharged">Patient discharged</option>
                  <option value="Patient deceased">Patient deceased</option>
                  <option value="Wrong test ordered">Wrong test ordered</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Additional Notes</Label>
                <Input id="notes" placeholder="Provide additional details" />
              </div>
              <DialogFooter>
                <Button type="submit" variant="destructive">
                  <X className="mr-2 h-4 w-4" />
                  Cancel Order
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Notify Doctor Dialog */}
      <Dialog
        open={isNotifyDoctorDialogOpen}
        onOpenChange={setIsNotifyDoctorDialogOpen}
      >
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Notify Doctor</DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <form onSubmit={handleNotifyDoctorSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Order ID</Label>
                <div className="p-2 bg-muted rounded-md">
                  {selectedOrder.orderId}
                </div>
              </div>
              <div className="space-y-2">
                <Label>Patient</Label>
                <div className="p-2 bg-muted rounded-md">
                  {selectedOrder.patientName} ({selectedOrder.mrNumber})
                </div>
              </div>
              <div className="space-y-2">
                <Label>Doctor</Label>
                <div className="p-2 bg-muted rounded-md">
                  {selectedOrder.orderedBy}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <textarea
                  id="message"
                  className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="Enter message for the doctor"
                  required
                ></textarea>
              </div>
              <DialogFooter>
                <Button type="submit">
                  <Send className="mr-2 h-4 w-4" />
                  Send Notification
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Filter Dialog */}
      <Dialog open={isFilterDialogOpen} onOpenChange={setIsFilterDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Filter Orders</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleFilterSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="filterOrderType">Order Type</Label>
              <select
                id="filterOrderType"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={filterOptions.orderType}
                onChange={(e) =>
                  setFilterOptions({
                    ...filterOptions,
                    orderType: e.target.value,
                  })
                }
              >
                <option value="">All Order Types</option>
                <option value="opd">OPD</option>
                <option value="ipd">IPD</option>
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
                    orderType: "",
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
            <DialogTitle>Order Statistics</DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-2">Orders by Status</h3>
              <div className="h-64 flex items-end space-x-2">
                {Object.entries(countByStatus)
                  .filter(([key]) => key !== "all")
                  .map(([status, count]) => (
                    <div key={status} className="flex flex-col items-center">
                      <div
                        className={`w-16 ${getStatusBarColor(status as TestOrder["status"])} rounded-t-md`}
                        style={{
                          height: `${(count / testOrders.length) * 200}px`,
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
              <h3 className="text-lg font-medium mb-2">Orders by Order Type</h3>
              <div className="h-64 flex items-end space-x-2">
                {getOrderTypeStats().map(({ type, count }) => (
                  <div key={type} className="flex flex-col items-center">
                    <div
                      className={`w-16 ${type === "opd" ? "bg-purple-500" : "bg-indigo-500"} rounded-t-md`}
                      style={{
                        height: `${(count / testOrders.length) * 200}px`,
                      }}
                    ></div>
                    <div className="mt-2 text-sm font-medium">
                      {type.toUpperCase()}
                    </div>
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
            <DialogTitle>Order Details</DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-4" id="order-report">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-bold">
                    Order ID: {selectedOrder.orderId}
                  </h2>
                  <p className="text-muted-foreground">
                    Test: {selectedOrder.testName}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium">
                    Date:{" "}
                    {new Date(selectedOrder.orderDate).toLocaleDateString()}
                  </p>
                  <p className="text-muted-foreground">
                    Time: {selectedOrder.orderTime}
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
                    <p className="font-medium">{selectedOrder.patientName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">MR Number</p>
                    <p className="font-medium">{selectedOrder.mrNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Patient ID</p>
                    <p className="font-medium">{selectedOrder.patientId}</p>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="text-lg font-medium mb-2">Order Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Order Type</p>
                    <p className="font-medium">
                      {selectedOrder.orderType.toUpperCase()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Priority</p>
                    <p className="font-medium">
                      {selectedOrder.priority.charAt(0).toUpperCase() +
                        selectedOrder.priority.slice(1)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Status</p>
                    <p className="font-medium">
                      {selectedOrder.status.charAt(0).toUpperCase() +
                        selectedOrder.status.slice(1)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Ordered By</p>
                    <p className="font-medium">{selectedOrder.orderedBy}</p>
                  </div>
                </div>
              </div>

              {selectedOrder.orderType === "ipd" && (
                <div className="border-t pt-4">
                  <h3 className="text-lg font-medium mb-2">IPD Details</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Ward</p>
                      <p className="font-medium">{selectedOrder.ward}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Bed Number
                      </p>
                      <p className="font-medium">{selectedOrder.bedNumber}</p>
                    </div>
                  </div>
                </div>
              )}

              {selectedOrder.orderType === "opd" &&
                selectedOrder.department && (
                  <div className="border-t pt-4">
                    <h3 className="text-lg font-medium mb-2">OPD Details</h3>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Department
                      </p>
                      <p className="font-medium">{selectedOrder.department}</p>
                    </div>
                  </div>
                )}

              {selectedOrder.notes && (
                <div className="border-t pt-4">
                  <h3 className="text-lg font-medium mb-2">Notes</h3>
                  <p>{selectedOrder.notes}</p>
                </div>
              )}

              <div className="border-t pt-4 flex justify-end">
                <Button onClick={() => handlePrint()}>
                  <Printer className="mr-2 h-4 w-4" />
                  Print Report
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OrderManagement;
