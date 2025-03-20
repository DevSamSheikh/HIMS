import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Calendar as CalendarIcon,
  Clock,
  CheckCircle2,
  X,
  Calendar,
  Plus,
  MoreHorizontal,
  Filter,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "@/components/ui/use-toast";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import NewAppointmentDialog from "./NewAppointmentDialog";

interface OPDAppointmentsProps {
  searchQuery: string;
}

interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  mrNumber: string;
  doctorId: string;
  doctorName: string;
  department: string;
  appointmentDate: Date;
  appointmentTime: string;
  purpose: string;
  status: "Scheduled" | "Confirmed" | "Completed" | "Cancelled" | "No Show";
  notes?: string;
}

const OPDAppointments: React.FC<OPDAppointmentsProps> = ({ searchQuery }) => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [isNewAppointmentOpen, setIsNewAppointmentOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [filters, setFilters] = useState({
    status: "all",
    department: "all",
  });

  // Sample appointments data
  const [appointments, setAppointments] = useState<Appointment[]>([
    {
      id: "A1",
      patientId: "1",
      patientName: "John Smith",
      mrNumber: "MR-2023-0001",
      doctorId: "D1",
      doctorName: "Dr. Ahmed Khan",
      department: "Cardiology",
      appointmentDate: new Date(),
      appointmentTime: "10:00 AM",
      purpose: "Follow-up for hypertension",
      status: "Scheduled",
    },
    {
      id: "A2",
      patientId: "2",
      patientName: "Sarah Johnson",
      mrNumber: "MR-2023-0002",
      doctorId: "D2",
      doctorName: "Dr. Fatima Ali",
      department: "Dermatology",
      appointmentDate: new Date(),
      appointmentTime: "11:30 AM",
      purpose: "Skin rash assessment",
      status: "Confirmed",
    },
    {
      id: "A3",
      patientId: "3",
      patientName: "Ahmed Khan",
      mrNumber: "MR-2023-0003",
      doctorId: "D3",
      doctorName: "Dr. Zainab Malik",
      department: "Orthopedics",
      appointmentDate: new Date(),
      appointmentTime: "2:00 PM",
      purpose: "Knee pain follow-up",
      status: "Completed",
    },
    {
      id: "A4",
      patientId: "4",
      patientName: "Fatima Ali",
      mrNumber: "MR-2023-0004",
      doctorId: "D4",
      doctorName: "Dr. Imran Shah",
      department: "ENT",
      appointmentDate: new Date(),
      appointmentTime: "3:30 PM",
      purpose: "Ear infection check",
      status: "Scheduled",
    },
    {
      id: "A5",
      patientId: "5",
      patientName: "Mohammad Raza",
      mrNumber: "MR-2023-0005",
      doctorId: "D5",
      doctorName: "Dr. Saima Nawaz",
      department: "General Medicine",
      appointmentDate: new Date(new Date().setDate(new Date().getDate() + 1)),
      appointmentTime: "9:00 AM",
      purpose: "Fever and cough",
      status: "Scheduled",
    },
  ]);

  // Filter appointments based on search query and selected date
  const filteredAppointments = appointments.filter((appointment) => {
    const searchLower = searchQuery.toLowerCase();
    const dateMatches = date
      ? appointment.appointmentDate.toDateString() === date.toDateString()
      : true;
    const statusMatches =
      filters.status === "all" || appointment.status === filters.status;
    const departmentMatches =
      filters.department === "all" ||
      appointment.department === filters.department;

    return (
      dateMatches &&
      statusMatches &&
      departmentMatches &&
      (searchQuery === "" ||
        appointment.patientName.toLowerCase().includes(searchLower) ||
        appointment.mrNumber.toLowerCase().includes(searchLower) ||
        appointment.doctorName.toLowerCase().includes(searchLower) ||
        appointment.department.toLowerCase().includes(searchLower) ||
        appointment.purpose.toLowerCase().includes(searchLower))
    );
  });

  // Sort appointments by time
  const sortedAppointments = [...filteredAppointments].sort((a, b) => {
    return a.appointmentTime.localeCompare(b.appointmentTime);
  });

  // Get current appointments for pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentAppointments = sortedAppointments.slice(
    indexOfFirstItem,
    indexOfLastItem,
  );
  const totalPages = Math.ceil(sortedAppointments.length / itemsPerPage);

  // Stats
  const scheduledCount = filteredAppointments.filter(
    (a) => a.status === "Scheduled" || a.status === "Confirmed",
  ).length;
  const completedCount = filteredAppointments.filter(
    (a) => a.status === "Completed",
  ).length;
  const cancelledCount = filteredAppointments.filter(
    (a) => a.status === "Cancelled" || a.status === "No Show",
  ).length;

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
            className="bg-purple-50 text-purple-700 border-purple-200"
          >
            Confirmed
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
      case "No Show":
        return (
          <Badge
            variant="outline"
            className="bg-orange-50 text-orange-700 border-orange-200"
          >
            No Show
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const updateStatus = (
    id: string,
    newStatus:
      | "Scheduled"
      | "Confirmed"
      | "Completed"
      | "Cancelled"
      | "No Show",
  ) => {
    setAppointments(
      appointments.map((appointment) =>
        appointment.id === id
          ? { ...appointment, status: newStatus }
          : appointment,
      ),
    );

    toast({
      title: `Appointment ${newStatus}`,
      description: `The appointment has been marked as ${newStatus.toLowerCase()}.`,
      variant:
        newStatus === "Cancelled" || newStatus === "No Show"
          ? "destructive"
          : "default",
    });
  };

  const resetFilters = () => {
    setFilters({
      status: "all",
      department: "all",
    });
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
      description: `Appointment for ${appointment.patientName} has been scheduled for ${format(appointment.appointmentDate, "PPP")} at ${appointment.appointmentTime}.`,
    });
  };

  return (
    <>
      <NewAppointmentDialog
        isOpen={isNewAppointmentOpen}
        onClose={() => setIsNewAppointmentOpen(false)}
        onSave={handleNewAppointment}
      />
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

        <div className="grid grid-cols-4 gap-4 flex-1">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {filteredAppointments.length}
              </div>
              <p className="text-xs text-muted-foreground">Appointments</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Scheduled</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{scheduledCount}</div>
              <p className="text-xs text-muted-foreground">
                Upcoming appointments
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{completedCount}</div>
              <p className="text-xs text-muted-foreground">
                Finished appointments
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Cancelled</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{cancelledCount}</div>
              <p className="text-xs text-muted-foreground">
                Cancelled/No-shows
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="flex items-center gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-[240px] justify-start text-left font-normal"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <CalendarComponent
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
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

        <Card>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Time</TableHead>
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
                      No appointments found for the selected date.
                    </TableCell>
                  </TableRow>
                ) : (
                  currentAppointments.map((appointment) => (
                    <TableRow key={appointment.id}>
                      <TableCell>
                        <div className="font-medium">
                          {appointment.appointmentTime}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {format(appointment.appointmentDate, "MMM d, yyyy")}
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
                        <span className="text-sm">{appointment.purpose}</span>
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(appointment.status)}
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
                            {(appointment.status === "Scheduled" ||
                              appointment.status === "Confirmed") && (
                              <>
                                <DropdownMenuItem
                                  onClick={() =>
                                    updateStatus(appointment.id, "Completed")
                                  }
                                >
                                  <CheckCircle2 className="mr-2 h-4 w-4" />
                                  Mark as Completed
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() =>
                                    updateStatus(appointment.id, "No Show")
                                  }
                                >
                                  <X className="mr-2 h-4 w-4" />
                                  Mark as No Show
                                </DropdownMenuItem>
                              </>
                            )}
                            {appointment.status === "Scheduled" && (
                              <DropdownMenuItem
                                onClick={() =>
                                  updateStatus(appointment.id, "Confirmed")
                                }
                              >
                                Confirm Appointment
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem>
                              <Calendar className="mr-2 h-4 w-4" />
                              Reschedule
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            {(appointment.status === "Scheduled" ||
                              appointment.status === "Confirmed") && (
                              <DropdownMenuItem
                                className="text-destructive"
                                onClick={() =>
                                  updateStatus(appointment.id, "Cancelled")
                                }
                              >
                                <X className="mr-2 h-4 w-4" />
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
    </>
  );
};

export default OPDAppointments;
