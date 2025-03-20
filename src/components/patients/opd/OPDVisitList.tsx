import React, { useState, useEffect } from "react";
import TokenPrintModal from "../TokenPrintModal";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  MoreHorizontal,
  FileText,
  Edit,
  Printer,
  Calendar,
  AlertCircle,
  Ticket,
  Filter,
  ChevronLeft,
  ChevronRight,
  Trash2,
} from "lucide-react";
import { OPDVisit } from "../types";
import { toast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface OPDVisitListProps {
  searchQuery: string;
}

const OPDVisitList: React.FC<OPDVisitListProps> = ({ searchQuery }) => {
  const [tokenPrintModalOpen, setTokenPrintModalOpen] =
    useState<boolean>(false);
  const [tokenData, setTokenData] = useState<any>(null);

  const handlePrintToken = (visit: OPDVisit) => {
    const now = new Date();
    setTokenData({
      tokenNumber: visit.tokenNumber || "N/A",
      patientName: visit.patientName,
      mrNumber: visit.mrNumber,
      department: visit.department,
      doctorName: visit.doctorName,
      date: now.toLocaleDateString(),
      time: now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    });
    setTokenPrintModalOpen(true);
  };

  // Sample OPD visit data
  const [visits, setVisits] = useState<OPDVisit[]>([
    {
      id: "1",
      patientId: "1",
      patientName: "John Smith",
      mrNumber: "MR-2023-0001",
      visitDate: "2023-07-15",
      doctorId: "D1",
      doctorName: "Dr. Ahmed Khan",
      department: "Cardiology",
      chiefComplaint: "Chest pain and shortness of breath",
      diagnosis: "Hypertension",
      treatment: "Prescribed Amlodipine 5mg daily",
      followUpDate: "2023-07-29",
      visitType: "First",
      fee: 2000,
      paymentStatus: "Paid",
      status: "Completed",
      vitalSigns: {
        temperature: 98.6,
        bloodPressure: "140/90",
        pulseRate: 88,
        respiratoryRate: 18,
        oxygenSaturation: 98,
        height: 175,
        weight: 75,
      },
      tokenNumber: "T-20230715-001",
    },
    {
      id: "2",
      patientId: "2",
      patientName: "Sarah Johnson",
      mrNumber: "MR-2023-0002",
      visitDate: "2023-07-16",
      doctorId: "D2",
      doctorName: "Dr. Fatima Ali",
      department: "Dermatology",
      chiefComplaint: "Skin rash and itching",
      diagnosis: "Eczema",
      treatment: "Prescribed topical steroid cream",
      followUpDate: "2023-07-30",
      visitType: "First",
      fee: 1800,
      paymentStatus: "Paid",
      status: "Completed",
      tokenNumber: "T-20230716-001",
    },
    {
      id: "3",
      patientId: "3",
      patientName: "Ahmed Khan",
      mrNumber: "MR-2023-0003",
      visitDate: "2023-07-17",
      doctorId: "D3",
      doctorName: "Dr. Zainab Malik",
      department: "Orthopedics",
      chiefComplaint: "Lower back pain",
      diagnosis: "Lumbar strain",
      treatment: "Prescribed pain medication and physical therapy",
      followUpDate: "2023-08-01",
      visitType: "First",
      fee: 2500,
      paymentStatus: "Pending",
      status: "Completed",
      tokenNumber: "T-20230717-001",
    },
    {
      id: "4",
      patientId: "4",
      patientName: "Fatima Ali",
      mrNumber: "MR-2023-0004",
      visitDate: "2023-07-18",
      doctorId: "D4",
      doctorName: "Dr. Imran Shah",
      department: "ENT",
      chiefComplaint: "Sore throat and ear pain",
      diagnosis: "Acute tonsillitis",
      treatment: "Prescribed antibiotics and pain relievers",
      followUpDate: "2023-07-25",
      visitType: "First",
      fee: 1500,
      paymentStatus: "Paid",
      status: "Completed",
      tokenNumber: "T-20230718-001",
    },
    {
      id: "5",
      patientId: "1",
      patientName: "John Smith",
      mrNumber: "MR-2023-0001",
      visitDate: "2023-07-29",
      doctorId: "D1",
      doctorName: "Dr. Ahmed Khan",
      department: "Cardiology",
      chiefComplaint: "Follow-up for hypertension",
      diagnosis: "Controlled hypertension",
      treatment: "Continue Amlodipine 5mg daily",
      followUpDate: "2023-08-29",
      visitType: "Follow-up",
      fee: 1000,
      paymentStatus: "Paid",
      status: "Completed",
      tokenNumber: "T-20230729-001",
    },
    {
      id: "6",
      patientId: "5",
      patientName: "Mohammad Raza",
      mrNumber: "MR-2023-0005",
      visitDate: "2023-07-19",
      doctorId: "D5",
      doctorName: "Dr. Saima Nawaz",
      department: "General Medicine",
      chiefComplaint: "Fever and body aches",
      diagnosis: "Viral fever",
      treatment: "Prescribed antipyretics and rest",
      followUpDate: "2023-07-26",
      visitType: "First",
      fee: 1200,
      paymentStatus: "Waived",
      status: "Completed",
      tokenNumber: "T-20230719-001",
    },
    {
      id: "7",
      patientId: "2",
      patientName: "Sarah Johnson",
      mrNumber: "MR-2023-0002",
      visitDate: "2023-07-20",
      doctorId: "D1",
      doctorName: "Dr. Ahmed Khan",
      department: "Cardiology",
      chiefComplaint: "Palpitations and dizziness",
      visitType: "First",
      fee: 2000,
      paymentStatus: "Paid",
      status: "Waiting",
      tokenNumber: "T-20230720-001",
    },
  ]);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  // Filter state
  const [filters, setFilters] = useState({
    department: "all",
    visitType: "all",
    status: "all",
    paymentStatus: "all",
    dateRange: {
      start: "",
      end: "",
    },
  });

  // Edit visit dialog
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentVisit, setCurrentVisit] = useState<OPDVisit | null>(null);

  // View details dialog
  const [isViewDetailsOpen, setIsViewDetailsOpen] = useState(false);

  // Delete confirmation dialog
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [visitToDelete, setVisitToDelete] = useState<string | null>(null);

  // Apply filters and search
  const filteredVisits = visits.filter((visit) => {
    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch =
        visit.patientName.toLowerCase().includes(searchLower) ||
        visit.mrNumber.toLowerCase().includes(searchLower) ||
        visit.doctorName.toLowerCase().includes(searchLower) ||
        visit.department.toLowerCase().includes(searchLower) ||
        (visit.diagnosis &&
          visit.diagnosis.toLowerCase().includes(searchLower));
      if (!matchesSearch) return false;
    }

    // Apply department filter
    if (
      filters.department !== "all" &&
      visit.department !== filters.department
    ) {
      return false;
    }

    // Apply visit type filter
    if (filters.visitType !== "all" && visit.visitType !== filters.visitType) {
      return false;
    }

    // Apply status filter
    if (filters.status !== "all" && visit.status !== filters.status) {
      return false;
    }

    // Apply payment status filter
    if (
      filters.paymentStatus !== "all" &&
      visit.paymentStatus !== filters.paymentStatus
    ) {
      return false;
    }

    // Apply date range filter
    if (
      filters.dateRange.start &&
      new Date(visit.visitDate) < new Date(filters.dateRange.start)
    ) {
      return false;
    }
    if (
      filters.dateRange.end &&
      new Date(visit.visitDate) > new Date(filters.dateRange.end)
    ) {
      return false;
    }

    return true;
  });

  // Sort visits by date (newest first)
  const sortedVisits = [...filteredVisits].sort((a, b) => {
    return new Date(b.visitDate).getTime() - new Date(a.visitDate).getTime();
  });

  // Get current visits for pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentVisits = sortedVisits.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sortedVisits.length / itemsPerPage);

  // Reset to first page when filters or search change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filters]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Waiting":
        return (
          <Badge
            variant="outline"
            className="bg-yellow-50 text-yellow-700 border-yellow-200"
          >
            Waiting
          </Badge>
        );
      case "In Consultation":
        return (
          <Badge
            variant="outline"
            className="bg-blue-50 text-blue-700 border-blue-200"
          >
            In Consultation
          </Badge>
        );
      case "Completed":
        return (
          <Badge
            variant="outline"
            className="bg-green-50 text-green-700 border-green-200"
          >
            Completed
          </Badge>
        );
      case "Cancelled":
        return (
          <Badge
            variant="outline"
            className="bg-red-50 text-red-700 border-red-200"
          >
            Cancelled
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case "Paid":
        return (
          <Badge
            variant="outline"
            className="bg-green-50 text-green-700 border-green-200"
          >
            Paid
          </Badge>
        );
      case "Pending":
        return (
          <Badge
            variant="outline"
            className="bg-yellow-50 text-yellow-700 border-yellow-200"
          >
            Pending
          </Badge>
        );
      case "Waived":
        return (
          <Badge
            variant="outline"
            className="bg-purple-50 text-purple-700 border-purple-200"
          >
            Waived
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const handleEditVisit = (visit: OPDVisit) => {
    setCurrentVisit(visit);
    setIsEditDialogOpen(true);
  };

  const handleViewDetails = (visit: OPDVisit) => {
    setCurrentVisit(visit);
    setIsViewDetailsOpen(true);
  };

  const handleDeleteVisit = (visitId: string) => {
    setVisitToDelete(visitId);
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteVisit = () => {
    if (visitToDelete) {
      setVisits(visits.filter((v) => v.id !== visitToDelete));
      toast({
        title: "Visit deleted",
        description: "OPD visit record has been permanently deleted.",
        variant: "destructive",
      });
      setIsDeleteDialogOpen(false);
      setVisitToDelete(null);
    }
  };

  const handleSaveVisit = (updatedVisit: OPDVisit) => {
    setVisits(visits.map((v) => (v.id === updatedVisit.id ? updatedVisit : v)));
    setIsEditDialogOpen(false);
    setCurrentVisit(null);
    toast({
      title: "Visit updated",
      description: "OPD visit information has been successfully updated.",
    });
  };

  const resetFilters = () => {
    setFilters({
      department: "all",
      visitType: "all",
      status: "all",
      paymentStatus: "all",
      dateRange: {
        start: "",
        end: "",
      },
    });
  };

  // Get unique departments for filter
  const departments = [...new Set(visits.map((visit) => visit.department))];

  return (
    <Card>
      <div className="p-4 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">OPD Visits</h2>
          <p className="text-sm text-muted-foreground">
            Manage and view outpatient visits
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                <span>Filter</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="w-80"
              align="start"
              side="bottom"
              sideOffset={5}
            >
              <div className="space-y-4">
                <h3 className="font-medium">Filter OPD Visits</h3>

                <div className="space-y-2">
                  <Label>Department</Label>
                  <Select
                    value={filters.department}
                    onValueChange={(value) =>
                      setFilters({ ...filters, department: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All Departments" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Departments</SelectItem>
                      {departments.map((dept) => (
                        <SelectItem key={dept} value={dept}>
                          {dept}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Visit Type</Label>
                  <Select
                    value={filters.visitType}
                    onValueChange={(value) =>
                      setFilters({ ...filters, visitType: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All Visit Types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Visit Types</SelectItem>
                      <SelectItem value="First">First Visit</SelectItem>
                      <SelectItem value="Follow-up">Follow-up</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select
                    value={filters.status}
                    onValueChange={(value) =>
                      setFilters({ ...filters, status: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All Statuses" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="Waiting">Waiting</SelectItem>
                      <SelectItem value="In Consultation">
                        In Consultation
                      </SelectItem>
                      <SelectItem value="Completed">Completed</SelectItem>
                      <SelectItem value="Cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Payment Status</Label>
                  <Select
                    value={filters.paymentStatus}
                    onValueChange={(value) =>
                      setFilters({ ...filters, paymentStatus: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All Payment Statuses" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Payment Statuses</SelectItem>
                      <SelectItem value="Paid">Paid</SelectItem>
                      <SelectItem value="Pending">Pending</SelectItem>
                      <SelectItem value="Waived">Waived</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Date Range</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label
                        htmlFor="startDate"
                        className="text-xs text-muted-foreground"
                      >
                        From
                      </Label>
                      <Input
                        id="startDate"
                        type="date"
                        value={filters.dateRange.start}
                        onChange={(e) =>
                          setFilters({
                            ...filters,
                            dateRange: {
                              ...filters.dateRange,
                              start: e.target.value,
                            },
                          })
                        }
                      />
                    </div>
                    <div>
                      <Label
                        htmlFor="endDate"
                        className="text-xs text-muted-foreground"
                      >
                        To
                      </Label>
                      <Input
                        id="endDate"
                        type="date"
                        value={filters.dateRange.end}
                        onChange={(e) =>
                          setFilters({
                            ...filters,
                            dateRange: {
                              ...filters.dateRange,
                              end: e.target.value,
                            },
                          })
                        }
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-between pt-2">
                  <Button variant="outline" size="sm" onClick={resetFilters}>
                    Reset
                  </Button>
                  <Button size="sm">Apply Filters</Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Patient</TableHead>
              <TableHead>Visit Date</TableHead>
              <TableHead>Doctor</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Visit Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Payment</TableHead>
              <TableHead>Token</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentVisits.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center h-24">
                  No OPD visits found matching your search.
                </TableCell>
              </TableRow>
            ) : (
              currentVisits.map((visit) => (
                <TableRow key={visit.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{visit.patientName}</div>
                      <div className="text-xs text-muted-foreground">
                        {visit.mrNumber}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {new Date(visit.visitDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{visit.doctorName}</TableCell>
                  <TableCell>{visit.department}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        visit.visitType === "First" ? "default" : "secondary"
                      }
                    >
                      {visit.visitType}
                    </Badge>
                  </TableCell>
                  <TableCell>{getStatusBadge(visit.status)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getPaymentStatusBadge(visit.paymentStatus)}
                      <span className="text-sm font-medium">
                        Rs. {visit.fee}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">
                        {visit.tokenNumber || "N/A"}
                      </span>
                      {visit.tokenNumber && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handlePrintToken(visit)}
                          className="h-8 w-8"
                        >
                          <Ticket className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem
                          onClick={() => handleViewDetails(visit)}
                        >
                          <FileText className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleEditVisit(visit)}
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          Edit Visit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handlePrintToken(visit)}
                        >
                          <Printer className="mr-2 h-4 w-4" />
                          Print Token
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            // Close dropdown first
                            document.body.click();
                            // Set up a new visit with follow-up type
                            const followUpVisit = {
                              ...visit,
                              id: String(Date.now()),
                              visitDate: new Date().toISOString().split("T")[0],
                              visitType: "Follow-up",
                              status: "Waiting",
                              paymentStatus: "Pending",
                              chiefComplaint: `Follow-up for ${visit.diagnosis || "previous visit"}`,
                              diagnosis: "",
                              treatment: "",
                              tokenNumber: `T-${new Date().toISOString().split("T")[0].replace(/-/g, "")}-${Math.floor(
                                Math.random() * 1000,
                              )
                                .toString()
                                .padStart(3, "0")}`,
                            };
                            setVisits([followUpVisit, ...visits]);
                            toast({
                              title: "Follow-up scheduled",
                              description: `Follow-up visit for ${visit.patientName} has been scheduled.`,
                            });
                          }}
                        >
                          <Calendar className="mr-2 h-4 w-4" />
                          Schedule Follow-up
                        </DropdownMenuItem>
                        {visit.status !== "Completed" && (
                          <DropdownMenuItem>
                            <AlertCircle className="mr-2 h-4 w-4" />
                            Mark as Completed
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => handleDeleteVisit(visit.id)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete Visit
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between p-4">
        <div className="text-sm text-muted-foreground">
          Showing {indexOfFirstItem + 1} to{" "}
          {Math.min(indexOfLastItem, sortedVisits.length)} of{" "}
          {sortedVisits.length} visits
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "outline"}
                size="icon"
                className="w-8 h-8"
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </Button>
            ))}
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Select
            value={itemsPerPage.toString()}
            onValueChange={(value) => {
              setItemsPerPage(parseInt(value));
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="w-[100px]">
              <SelectValue placeholder="5 per page" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5 per page</SelectItem>
              <SelectItem value="10">10 per page</SelectItem>
              <SelectItem value="20">20 per page</SelectItem>
              <SelectItem value="50">50 per page</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Edit Visit Dialog */}
      {currentVisit && (
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit OPD Visit</DialogTitle>
              <DialogDescription>
                Update visit details and medical information.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Patient Name</Label>
                  <Input value={currentVisit.patientName} disabled />
                </div>
                <div className="space-y-2">
                  <Label>MR Number</Label>
                  <Input value={currentVisit.mrNumber} disabled />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="visitDate">Visit Date</Label>
                  <Input
                    id="visitDate"
                    type="date"
                    value={currentVisit.visitDate}
                    onChange={(e) =>
                      setCurrentVisit({
                        ...currentVisit,
                        visitDate: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="visitType">Visit Type</Label>
                  <Select
                    value={currentVisit.visitType}
                    onValueChange={(value) =>
                      setCurrentVisit({ ...currentVisit, visitType: value })
                    }
                  >
                    <SelectTrigger id="visitType">
                      <SelectValue placeholder="Select visit type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="First">First Visit</SelectItem>
                      <SelectItem value="Follow-up">Follow-up</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="department">Department</Label>
                  <Select
                    value={currentVisit.department}
                    onValueChange={(value) =>
                      setCurrentVisit({ ...currentVisit, department: value })
                    }
                  >
                    <SelectTrigger id="department">
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="General Medicine">
                        General Medicine
                      </SelectItem>
                      <SelectItem value="Cardiology">Cardiology</SelectItem>
                      <SelectItem value="Dermatology">Dermatology</SelectItem>
                      <SelectItem value="Orthopedics">Orthopedics</SelectItem>
                      <SelectItem value="ENT">ENT</SelectItem>
                      <SelectItem value="Ophthalmology">
                        Ophthalmology
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="doctor">Doctor</Label>
                  <Select
                    value={currentVisit.doctorId}
                    onValueChange={(value) =>
                      setCurrentVisit({
                        ...currentVisit,
                        doctorId: value,
                        doctorName:
                          value === "D1"
                            ? "Dr. Ahmed Khan"
                            : value === "D2"
                              ? "Dr. Fatima Ali"
                              : value === "D3"
                                ? "Dr. Zainab Malik"
                                : value === "D4"
                                  ? "Dr. Imran Shah"
                                  : "Dr. Saima Nawaz",
                      })
                    }
                  >
                    <SelectTrigger id="doctor">
                      <SelectValue placeholder="Select doctor" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="D1">Dr. Ahmed Khan</SelectItem>
                      <SelectItem value="D2">Dr. Fatima Ali</SelectItem>
                      <SelectItem value="D3">Dr. Zainab Malik</SelectItem>
                      <SelectItem value="D4">Dr. Imran Shah</SelectItem>
                      <SelectItem value="D5">Dr. Saima Nawaz</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="chiefComplaint">Chief Complaint</Label>
                <Input
                  id="chiefComplaint"
                  value={currentVisit.chiefComplaint}
                  onChange={(e) =>
                    setCurrentVisit({
                      ...currentVisit,
                      chiefComplaint: e.target.value,
                    })
                  }
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="diagnosis">Diagnosis</Label>
                  <Input
                    id="diagnosis"
                    value={currentVisit.diagnosis || ""}
                    onChange={(e) =>
                      setCurrentVisit({
                        ...currentVisit,
                        diagnosis: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="treatment">Treatment</Label>
                  <Input
                    id="treatment"
                    value={currentVisit.treatment || ""}
                    onChange={(e) =>
                      setCurrentVisit({
                        ...currentVisit,
                        treatment: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fee">Consultation Fee</Label>
                  <Input
                    id="fee"
                    type="number"
                    value={currentVisit.fee}
                    onChange={(e) =>
                      setCurrentVisit({
                        ...currentVisit,
                        fee: parseInt(e.target.value),
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="paymentStatus">Payment Status</Label>
                  <Select
                    value={currentVisit.paymentStatus}
                    onValueChange={(value) =>
                      setCurrentVisit({
                        ...currentVisit,
                        paymentStatus: value,
                      })
                    }
                  >
                    <SelectTrigger id="paymentStatus">
                      <SelectValue placeholder="Select payment status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Paid">Paid</SelectItem>
                      <SelectItem value="Pending">Pending</SelectItem>
                      <SelectItem value="Waived">Waived</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Visit Status</Label>
                <Select
                  value={currentVisit.status}
                  onValueChange={(value) =>
                    setCurrentVisit({ ...currentVisit, status: value })
                  }
                >
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Select visit status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Waiting">Waiting</SelectItem>
                    <SelectItem value="In Consultation">
                      In Consultation
                    </SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                    <SelectItem value="Cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsEditDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={() => handleSaveVisit(currentVisit)}>
                Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* View Details Dialog */}
      {currentVisit && (
        <Dialog open={isViewDetailsOpen} onOpenChange={setIsViewDetailsOpen}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>OPD Visit Details</DialogTitle>
              <DialogDescription>
                Detailed information about the OPD visit
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2">
                    Patient Information
                  </h3>
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Name:</span>
                      <span className="font-medium">
                        {currentVisit.patientName}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">MR Number:</span>
                      <span>{currentVisit.mrNumber}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">
                    Visit Information
                  </h3>
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Date:</span>
                      <span>
                        {new Date(currentVisit.visitDate).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Type:</span>
                      <span>{currentVisit.visitType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Status:</span>
                      <span>{getStatusBadge(currentVisit.status)}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">
                  Medical Information
                </h3>
                <div className="space-y-2">
                  <div>
                    <span className="text-muted-foreground">Doctor:</span>
                    <span className="ml-2">{currentVisit.doctorName}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Department:</span>
                    <span className="ml-2">{currentVisit.department}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">
                      Chief Complaint:
                    </span>
                    <span className="ml-2">{currentVisit.chiefComplaint}</span>
                  </div>
                  {currentVisit.diagnosis && (
                    <div>
                      <span className="text-muted-foreground">Diagnosis:</span>
                      <span className="ml-2">{currentVisit.diagnosis}</span>
                    </div>
                  )}
                  {currentVisit.treatment && (
                    <div>
                      <span className="text-muted-foreground">Treatment:</span>
                      <span className="ml-2">{currentVisit.treatment}</span>
                    </div>
                  )}
                </div>
              </div>

              {currentVisit.vitalSigns && (
                <div>
                  <h3 className="text-lg font-semibold mb-2">Vital Signs</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-muted-foreground">
                        Temperature:
                      </span>
                      <span className="ml-2">
                        {currentVisit.vitalSigns.temperature}°F
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">
                        Blood Pressure:
                      </span>
                      <span className="ml-2">
                        {currentVisit.vitalSigns.bloodPressure} mmHg
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Pulse Rate:</span>
                      <span className="ml-2">
                        {currentVisit.vitalSigns.pulseRate} bpm
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">
                        Respiratory Rate:
                      </span>
                      <span className="ml-2">
                        {currentVisit.vitalSigns.respiratoryRate} breaths/min
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">
                        Oxygen Saturation:
                      </span>
                      <span className="ml-2">
                        {currentVisit.vitalSigns.oxygenSaturation}%
                      </span>
                    </div>
                    {currentVisit.vitalSigns.height && (
                      <div>
                        <span className="text-muted-foreground">Height:</span>
                        <span className="ml-2">
                          {currentVisit.vitalSigns.height} cm
                        </span>
                      </div>
                    )}
                    {currentVisit.vitalSigns.weight && (
                      <div>
                        <span className="text-muted-foreground">Weight:</span>
                        <span className="ml-2">
                          {currentVisit.vitalSigns.weight} kg
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div>
                <h3 className="text-lg font-semibold mb-2">
                  Billing Information
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-muted-foreground">
                      Consultation Fee:
                    </span>
                    <span className="ml-2">Rs. {currentVisit.fee}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">
                      Payment Status:
                    </span>
                    <span className="ml-2">
                      {getPaymentStatusBadge(currentVisit.paymentStatus)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={() => setIsViewDetailsOpen(false)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you sure you want to delete this visit?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the OPD
              visit record from the database.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteVisit}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Token Print Modal */}
      {tokenPrintModalOpen && tokenData && (
        <TokenPrintModal
          isOpen={tokenPrintModalOpen}
          onClose={() => setTokenPrintModalOpen(false)}
          tokenData={tokenData}
        />
      )}
    </Card>
  );
};

export default OPDVisitList;
