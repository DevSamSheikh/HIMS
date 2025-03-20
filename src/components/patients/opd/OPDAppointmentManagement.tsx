import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search,
  Plus,
  Calendar,
  MoreHorizontal,
  Filter,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import NewAppointmentDialog from "./NewAppointmentDialog";
import { format } from "date-fns";

interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  mrNumber: string;
  appointmentDate: string;
  appointmentTime: string;
  doctorId: string;
  doctorName: string;
  department: string;
  purpose: string;
  status: "Scheduled" | "Confirmed" | "Completed" | "Cancelled" | "No Show";
  notes?: string;
}

interface OPDAppointmentManagementProps {
  searchQuery: string;
}

const OPDAppointmentManagement: React.FC<OPDAppointmentManagementProps> = ({
  searchQuery,
}) => {
  const [localSearchQuery, setLocalSearchQuery] = useState<string>(searchQuery);
  const [isNewAppointmentOpen, setIsNewAppointmentOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [filters, setFilters] = useState({
    status: "all",
    department: "all",
    dateRange: {
      start: "",
      end: "",
    },
  });

  // Sample appointments data
  const [appointments, setAppointments] = useState<Appointment[]>([
    {
      id: "1",
      patientId: "1",
      patientName: "John Smith",
      mrNumber: "MR-2023-0001",
      appointmentDate: "2023-07-25",
      appointmentTime: "09:00",
      doctorId: "D1",
      doctorName: "Dr. Ahmed Khan",
      department: "Cardiology",
      purpose: "Follow-up for hypertension",
      status: "Scheduled",
    },
    {
      id: "2",
      patientId: "2",
      patientName: "Sarah Johnson",
      mrNumber: "MR-2023-0002",
      appointmentDate: "2023-07-25",
      appointmentTime: "10:30",
      doctorId: "D2",
      doctorName: "Dr. Fatima Ali",
      department: "Dermatology",
      purpose: "Skin condition assessment",
      status: "Confirmed",
    },
    {
      id: "3",
      patientId: "3",
      patientName: "Ahmed Khan",
      mrNumber: "MR-2023-0003",
      appointmentDate: "2023-07-26",
      appointmentTime: "11:00",
      doctorId: "D3",
      doctorName: "Dr. Zainab Malik",
      department: "Orthopedics",
      purpose: "Back pain consultation",
      status: "Scheduled",
    },
    {
      id: "4",
      patientId: "4",
      patientName: "Fatima Ali",
      mrNumber: "MR-2023-0004",
      appointmentDate: "2023-07-26",
      appointmentTime: "14:00",
      doctorId: "D4",
      doctorName: "Dr. Imran Shah",
      department: "ENT",
      purpose: "Ear infection follow-up",
      status: "Scheduled",
    },
    {
      id: "5",
      patientId: "5",
      patientName: "Mohammad Raza",
      mrNumber: "MR-2023-0005",
      appointmentDate: "2023-07-27",
      appointmentTime: "09:30",
      doctorId: "D5",
      doctorName: "Dr. Saima Nawaz",
      department: "General Medicine",
      purpose: "Annual checkup",
      status: "Scheduled",
    },
    {
      id: "6",
      patientId: "6",
      patientName: "Ayesha Malik",
      mrNumber: "MR-2023-0006",
      appointmentDate: "2023-07-24",
      appointmentTime: "10:00",
      doctorId: "D1",
      doctorName: "Dr. Ahmed Khan",
      department: "Cardiology",
      purpose: "Chest pain evaluation",
      status: "Completed",
    },
    {
      id: "7",
      patientId: "7",
      patientName: "Zainab Qureshi",
      mrNumber: "MR-2023-0007",
      appointmentDate: "2023-07-24",
      appointmentTime: "11:30",
      doctorId: "D5",
      doctorName: "Dr. Saima Nawaz",
      department: "General Medicine",
      purpose: "Fever and cough",
      status: "Cancelled",
      notes: "Patient requested cancellation",
    },
  ]);

  // Filter appointments based on search query and filters
  const filteredAppointments = appointments.filter((appointment) => {
    // Apply search query
    if (localSearchQuery) {
      const searchLower = localSearchQuery.toLowerCase();
      const matchesSearch =
        appointment.patientName.toLowerCase().includes(searchLower) ||
        appointment.mrNumber.toLowerCase().includes(searchLower) ||
        appointment.doctorName.toLowerCase().includes(searchLower) ||
        appointment.department.toLowerCase().includes(searchLower);
      if (!matchesSearch) return false;
    }

    // Apply status filter
    if (filters.status !== "all" && appointment.status !== filters.status) {
      return false;
    }

    // Apply department filter
    if (
      filters.department !== "all" &&
      appointment.department !== filters.department
    ) {
      return false;
    }

    // Apply date range filter
    if (
      filters.dateRange.start &&
      new Date(appointment.appointmentDate) < new Date(filters.dateRange.start)
    ) {
      return false;
    }
    if (
      filters.dateRange.end &&
      new Date(appointment.appointmentDate) > new Date(filters.dateRange.end)
    ) {
      return false;
    }

    return true;
  });

  // Sort appointments by date and time
  const sortedAppointments = [...filteredAppointments].sort((a, b) => {
    const dateA = new Date(`${a.appointmentDate}T${a.appointmentTime}`);
    const dateB = new Date(`${b.appointmentDate}T${b.appointmentTime}`);
    return dateA.getTime() - dateB.getTime();
  });

  // Get current appointments for pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentAppointments = sortedAppointments.slice(
    indexOfFirstItem,
    indexOfLastItem,
  );
  const totalPages = Math.ceil(sortedAppointments.length / itemsPerPage);

  const handleConfirmAppointment = (appointmentId: string) => {
    setAppointments(
      appointments.map((appointment) =>
        appointment.id === appointmentId
          ? { ...appointment, status: "Confirmed" }
          : appointment,
      ),
    );
    toast({
      title: "Appointment Confirmed",
      description: "The appointment has been confirmed.",
    });
  };

  const handleCompleteAppointment = (appointmentId: string) => {
    setAppointments(
      appointments.map((appointment) =>
        appointment.id === appointmentId
          ? { ...appointment, status: "Completed" }
          : appointment,
      ),
    );
    toast({
      title: "Appointment Completed",
      description: "The appointment has been marked as completed.",
    });
  };

  const handleCancelAppointment = (appointmentId: string) => {
    setAppointments(
      appointments.map((appointment) =>
        appointment.id === appointmentId
          ? { ...appointment, status: "Cancelled" }
          : appointment,
      ),
    );
    toast({
      title: "Appointment Cancelled",
      description: "The appointment has been cancelled.",
      variant: "destructive",
    });
  };

  const handleMarkNoShow = (appointmentId: string) => {
    setAppointments(
      appointments.map((appointment) =>
        appointment.id === appointmentId
          ? { ...appointment, status: "No Show" }
          : appointment,
      ),
    );
    toast({
      title: "Marked as No Show",
      description: "The patient has been marked as no show.",
      variant: "destructive",
    });
  };

  const resetFilters = () => {
    setFilters({
      status: "all",
      department: "all",
      dateRange: {
        start: "",
        end: "",
      },
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Scheduled":
        return (
          <Badge
            variant="outline"
            className="bg-blue-50 text-blue-700 border-blue-200"
          >
            Scheduled
          </Badge>
        );
      case "Confirmed":
        return (
          <Badge
            variant="outline"
            className="bg-green-50 text-green-700 border-green-200"
          >
            Confirmed
          </Badge>
        );
      case "Completed":
        return (
          <Badge
            variant="outline"
            className="bg-purple-50 text-purple-700 border-purple-200"
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
      case "No Show":
        return (
          <Badge
            variant="outline"
            className="bg-gray-50 text-gray-700 border-gray-200"
          >
            No Show
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // Get unique departments for filter
  const departments = [...new Set(appointments.map((a) => a.department))];

  // New Appointment Dialog
  const handleNewAppointment = (appointment: Appointment) => {
    // Create a new array with the new appointment at the beginning
    const updatedAppointments = [appointment, ...appointments];
    setAppointments(updatedAppointments);
    setIsNewAppointmentOpen(false);
    toast({
      title: "Appointment Scheduled",
      description: `Appointment for ${appointment.patientName} has been scheduled.`,
    });
  };

  const content = (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">OPD Appointments</h2>
          <p className="text-muted-foreground">
            Manage outpatient appointments and scheduling
          </p>
        </div>
        <div className="flex space-x-2">
          <Button onClick={() => setIsNewAppointmentOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            New Appointment
          </Button>
        </div>
      </div>

      <Card className="bg-white dark:bg-gray-950">
        <div className="p-4 flex justify-between items-center">
          <div className="relative w-[300px]">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search patients, doctors..."
              value={localSearchQuery}
              onChange={(e) => setLocalSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>
          <div className="flex items-center gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  <span>Filter</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="space-y-4">
                  <h3 className="font-medium">Filter Appointments</h3>

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
                        <SelectItem value="Scheduled">Scheduled</SelectItem>
                        <SelectItem value="Confirmed">Confirmed</SelectItem>
                        <SelectItem value="Completed">Completed</SelectItem>
                        <SelectItem value="Cancelled">Cancelled</SelectItem>
                        <SelectItem value="No Show">No Show</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

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
                <TableHead>Date & Time</TableHead>
                <TableHead>Patient</TableHead>
                <TableHead>Doctor</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Purpose</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentAppointments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center h-24">
                    No appointments found matching your search.
                  </TableCell>
                </TableRow>
              ) : (
                currentAppointments.map((appointment) => (
                  <TableRow key={appointment.id}>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium">
                          {new Date(
                            appointment.appointmentDate,
                          ).toLocaleDateString()}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {appointment.appointmentTime}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">
                          {appointment.patientName}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {appointment.mrNumber}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{appointment.doctorName}</TableCell>
                    <TableCell>{appointment.department}</TableCell>
                    <TableCell>
                      <div
                        className="max-w-[200px] truncate"
                        title={appointment.purpose}
                      >
                        {appointment.purpose}
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(appointment.status)}</TableCell>
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
                          {appointment.status === "Scheduled" && (
                            <DropdownMenuItem
                              onClick={() =>
                                handleConfirmAppointment(appointment.id)
                              }
                            >
                              Confirm Appointment
                            </DropdownMenuItem>
                          )}
                          {(appointment.status === "Scheduled" ||
                            appointment.status === "Confirmed") && (
                            <>
                              <DropdownMenuItem
                                onClick={() =>
                                  handleCompleteAppointment(appointment.id)
                                }
                              >
                                Mark as Completed
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleMarkNoShow(appointment.id)}
                              >
                                Mark as No Show
                              </DropdownMenuItem>
                            </>
                          )}
                          <DropdownMenuItem>View Details</DropdownMenuItem>
                          <DropdownMenuItem>Reschedule</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          {(appointment.status === "Scheduled" ||
                            appointment.status === "Confirmed") && (
                            <DropdownMenuItem
                              className="text-destructive"
                              onClick={() =>
                                handleCancelAppointment(appointment.id)
                              }
                            >
                              Cancel Appointment
                            </DropdownMenuItem>
                          )}
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
            {Math.min(indexOfLastItem, sortedAppointments.length)} of{" "}
            {sortedAppointments.length} appointments
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
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    size="icon"
                    className="w-8 h-8"
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </Button>
                ),
              )}
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
      </Card>
    </div>
  );

  return (
    <>
      <NewAppointmentDialog
        isOpen={isNewAppointmentOpen}
        onClose={() => setIsNewAppointmentOpen(false)}
        onSave={handleNewAppointment}
      />
      {content}
    </>
  );
};

export default OPDAppointmentManagement;
