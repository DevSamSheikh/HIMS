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
} from "lucide-react";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";

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

    return (
      dateMatches &&
      (appointment.patientName.toLowerCase().includes(searchLower) ||
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
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
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

        <div className="flex items-center gap-2 ml-4">
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
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Appointment
          </Button>
        </div>
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
              {sortedAppointments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center h-24">
                    No appointments found for the selected date.
                  </TableCell>
                </TableRow>
              ) : (
                sortedAppointments.map((appointment) => (
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
                    <TableCell>{getStatusBadge(appointment.status)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        {(appointment.status === "Scheduled" ||
                          appointment.status === "Confirmed") && (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-green-600 border-green-200 hover:bg-green-50"
                              onClick={() =>
                                updateStatus(appointment.id, "Completed")
                              }
                            >
                              <CheckCircle2 className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-red-600 border-red-200 hover:bg-red-50"
                              onClick={() =>
                                updateStatus(appointment.id, "Cancelled")
                              }
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                        <Button size="sm" variant="outline">
                          <Calendar className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
};

export default OPDAppointments;
