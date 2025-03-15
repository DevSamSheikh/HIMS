import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { PlusCircle, Calendar, Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface OPDManagementProps {
  className?: string;
}

interface Appointment {
  id: string;
  patientName: string;
  patientId: string;
  date: string;
  time: string;
  doctor: string;
  status: "scheduled" | "in-progress" | "completed" | "cancelled";
  purpose: string;
}

const OPDManagement = ({ className = "" }: OPDManagementProps) => {
  const [activeTab, setActiveTab] = useState<"today" | "upcoming" | "past">(
    "today",
  );
  const [searchQuery, setSearchQuery] = useState("");

  // Mock appointments data
  const appointments: Appointment[] = [
    {
      id: "appt-001",
      patientName: "John Smith",
      patientId: "P-1001",
      date: "2023-06-15",
      time: "09:00 AM",
      doctor: "Dr. Sarah Johnson",
      status: "scheduled",
      purpose: "General Checkup",
    },
    {
      id: "appt-002",
      patientName: "Emily Davis",
      patientId: "P-1002",
      date: "2023-06-15",
      time: "10:30 AM",
      doctor: "Dr. Michael Chen",
      status: "in-progress",
      purpose: "Follow-up",
    },
    {
      id: "appt-003",
      patientName: "Robert Wilson",
      patientId: "P-1003",
      date: "2023-06-15",
      time: "11:45 AM",
      doctor: "Dr. Sarah Johnson",
      status: "scheduled",
      purpose: "Vaccination",
    },
    {
      id: "appt-004",
      patientName: "Lisa Thompson",
      patientId: "P-1004",
      date: "2023-06-15",
      time: "02:15 PM",
      doctor: "Dr. James Wilson",
      status: "scheduled",
      purpose: "Consultation",
    },
    {
      id: "appt-005",
      patientName: "Michael Brown",
      patientId: "P-1005",
      date: "2023-06-14",
      time: "03:30 PM",
      doctor: "Dr. Michael Chen",
      status: "completed",
      purpose: "Lab Results Review",
    },
  ];

  // Filter appointments based on tab and search query
  const filteredAppointments = appointments.filter((appointment) => {
    const matchesSearch =
      appointment.patientName
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      appointment.patientId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      appointment.doctor.toLowerCase().includes(searchQuery.toLowerCase());

    const today = new Date().toISOString().split("T")[0];
    const isToday = appointment.date === today;
    const isPast = appointment.date < today;
    const isUpcoming = appointment.date > today;

    if (activeTab === "today" && !isToday) return false;
    if (activeTab === "upcoming" && !isUpcoming) return false;
    if (activeTab === "past" && !isPast) return false;

    return matchesSearch;
  });

  const getStatusBadgeVariant = (status: Appointment["status"]) => {
    switch (status) {
      case "scheduled":
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
          <h1 className="text-3xl font-bold tracking-tight">OPD Management</h1>
          <Button>
            <Calendar className="mr-2 h-4 w-4" />
            Schedule Appointment
          </Button>
        </div>

        <div className="flex flex-col space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search by patient name, ID, or doctor..."
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
            defaultValue="today"
            value={activeTab}
            onValueChange={(value) => setActiveTab(value as any)}
          >
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="today">Today</TabsTrigger>
              <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
              <TabsTrigger value="past">Past</TabsTrigger>
            </TabsList>

            <TabsContent value="today" className="mt-4">
              <div className="grid grid-cols-1 gap-4">
                {filteredAppointments.length > 0 ? (
                  filteredAppointments.map((appointment) => (
                    <AppointmentCard
                      key={appointment.id}
                      appointment={appointment}
                    />
                  ))
                ) : (
                  <div className="text-center py-8 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                    <p className="text-gray-500 dark:text-gray-400">
                      No appointments found for today.
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="upcoming" className="mt-4">
              <div className="grid grid-cols-1 gap-4">
                {filteredAppointments.length > 0 ? (
                  filteredAppointments.map((appointment) => (
                    <AppointmentCard
                      key={appointment.id}
                      appointment={appointment}
                    />
                  ))
                ) : (
                  <div className="text-center py-8 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                    <p className="text-gray-500 dark:text-gray-400">
                      No upcoming appointments found.
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="past" className="mt-4">
              <div className="grid grid-cols-1 gap-4">
                {filteredAppointments.length > 0 ? (
                  filteredAppointments.map((appointment) => (
                    <AppointmentCard
                      key={appointment.id}
                      appointment={appointment}
                    />
                  ))
                ) : (
                  <div className="text-center py-8 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                    <p className="text-gray-500 dark:text-gray-400">
                      No past appointments found.
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

interface AppointmentCardProps {
  appointment: Appointment;
}

const AppointmentCard = ({ appointment }: AppointmentCardProps) => {
  const getStatusBadgeVariant = (status: Appointment["status"]) => {
    switch (status) {
      case "scheduled":
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
            <CardTitle className="text-lg">{appointment.patientName}</CardTitle>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Patient ID: {appointment.patientId}
            </div>
          </div>
          <Badge
            variant={getStatusBadgeVariant(appointment.status)}
            className="capitalize"
          >
            {appointment.status.replace("-", " ")}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-sm font-medium">Date & Time</div>
            <div className="text-sm">
              {new Date(appointment.date).toLocaleDateString()} at{" "}
              {appointment.time}
            </div>
          </div>
          <div>
            <div className="text-sm font-medium">Doctor</div>
            <div className="text-sm">{appointment.doctor}</div>
          </div>
          <div>
            <div className="text-sm font-medium">Purpose</div>
            <div className="text-sm">{appointment.purpose}</div>
          </div>
        </div>
        <div className="flex justify-end mt-4 gap-2">
          <Button variant="outline" size="sm">
            View Details
          </Button>
          <Button size="sm">Check In</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default OPDManagement;
