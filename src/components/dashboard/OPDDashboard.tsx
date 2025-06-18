import React, { useState, useEffect } from "react";
import StatisticsPanel from "./StatisticsPanel";
import TasksPanel from "./TasksPanel";
import { Users, Calendar, Clock, Stethoscope, UserCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import LineChart from "./charts/LineChart";
import PieChart from "./charts/PieChart";
import DashboardSkeleton from "./DashboardSkeleton";

const OPDDashboard = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const weeklyAppointmentsData = [
    { label: "Mon", value: 32 },
    { label: "Tue", value: 28 },
    { label: "Wed", value: 42 },
    { label: "Thu", value: 38 },
    { label: "Fri", value: 45 },
    { label: "Sat", value: 56 },
    { label: "Sun", value: 24 },
  ];

  const consultationTypeData = [
    { label: "New Patient", value: 28 },
    { label: "Follow-up", value: 42 },
    { label: "Specialist", value: 18 },
    { label: "Emergency", value: 12 },
  ];

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  const todayAppointments = [
    {
      id: 1,
      time: "09:00 AM",
      patient: "John Smith",
      doctor: "Dr. Wilson",
      status: "completed",
      type: "Follow-up",
    },
    {
      id: 2,
      time: "10:30 AM",
      patient: "Emily Johnson",
      doctor: "Dr. Patel",
      status: "completed",
      type: "Consultation",
    },
    {
      id: 3,
      time: "11:45 AM",
      patient: "Michael Brown",
      doctor: "Dr. Wilson",
      status: "in-progress",
      type: "Follow-up",
    },
    {
      id: 4,
      time: "01:15 PM",
      patient: "Sarah Davis",
      doctor: "Dr. Chen",
      status: "waiting",
      type: "New Patient",
    },
    {
      id: 5,
      time: "02:30 PM",
      patient: "Robert Miller",
      doctor: "Dr. Patel",
      status: "scheduled",
      type: "Consultation",
    },
    {
      id: 6,
      time: "03:45 PM",
      patient: "Jennifer Wilson",
      doctor: "Dr. Chen",
      status: "scheduled",
      type: "Follow-up",
    },
    {
      id: 7,
      time: "04:30 PM",
      patient: "David Garcia",
      doctor: "Dr. Wilson",
      status: "scheduled",
      type: "New Patient",
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-500">Completed</Badge>;
      case "in-progress":
        return <Badge className="bg-blue-500">In Progress</Badge>;
      case "waiting":
        return <Badge className="bg-amber-500">Waiting</Badge>;
      case "scheduled":
        return <Badge variant="outline">Scheduled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="container bg-gray-100/50 px-5 py-4 rounded-xl mx-auto space-y-6 max-w-7xl">
      <h1 className="text-3xl font-bold tracking-tight font-roboto">
        OPD Dashboard
      </h1>
      <p className="text-muted-foreground font-roboto">
        Manage outpatient department appointments, consultations, and patient flow.
      </p>

      {/* Statistics Panel */}
      <section className=" bg-ColorFul w-full">
        <StatisticsPanel
          statistics={[
            {
              title: "Today's Appointments",
              value: "42",
              description: "Scheduled for today",
              icon: <Calendar className="h-5 w-5" />,
              trend: { value: 8, isPositive: true },
            },
            {
              title: "Waiting Patients",
              value: "12",
              description: "Currently in waiting area",
              icon: <Clock className="h-5 w-5" />,
              trend: { value: 3, isPositive: false },
            },
            {
              title: "Consultations Today",
              value: "28",
              description: "Completed today",
              icon: <Stethoscope className="h-5 w-5" />,
              trend: { value: 5, isPositive: true },
            },
            {
              title: "New Patients",
              value: "8",
              description: "First-time visits today",
              icon: <UserCheck className="h-5 w-5" />,
            },
          ]}
        />
      </section>

      {/* Main Widgets Grid */}
      <section className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="md:col-span-2 lg:col-span-2 col-span-1 flex flex-col gap-4">
          <Card className="w-full bg-card">
            <CardHeader>
              <CardTitle className="text-xl flex items-center">
                <Calendar className="mr-2 h-5 w-5" />
                Weekly Appointments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <LineChart data={weeklyAppointmentsData} height={180} />
            </CardContent>
          </Card>
          <Card className="w-full bg-card">
            <CardHeader>
              <CardTitle className="text-xl flex items-center">
                <Calendar className="mr-2 h-5 w-5" />
                Today's Appointments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-medium">Time</th>
                      <th className="text-left py-3 px-4 font-medium">Patient</th>
                      <th className="text-left py-3 px-4 font-medium">Doctor</th>
                      <th className="text-left py-3 px-4 font-medium">Type</th>
                      <th className="text-left py-3 px-4 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {todayAppointments.map((appointment) => (
                      <tr
                        key={appointment.id}
                        className="border-b hover:bg-muted/50"
                      >
                        <td className="py-3 px-4">{appointment.time}</td>
                        <td className="py-3 px-4">{appointment.patient}</td>
                        <td className="py-3 px-4">{appointment.doctor}</td>
                        <td className="py-3 px-4">{appointment.type}</td>
                        <td className="py-3 px-4">
                          {getStatusBadge(appointment.status)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="col-span-1 flex flex-col gap-4">
          <Card className="w-full bg-card">
            <CardHeader>
              <CardTitle className="text-xl flex items-center">
                <Stethoscope className="mr-2 h-5 w-5" />
                Consultation Types
              </CardTitle>
            </CardHeader>
            <CardContent>
              <PieChart data={consultationTypeData} size={180} />
            </CardContent>
          </Card>
          <TasksPanel
            tasks={[
              {
                id: "1",
                title: "Confirm tomorrow's appointments",
                module: "Appointments",
                priority: "high",
                dueDate: "2023-06-15",
              },
              {
                id: "2",
                title: "Update patient records",
                module: "Patient Management",
                priority: "medium",
                dueDate: "2023-06-15",
              },
              {
                id: "3",
                title: "Prepare consultation rooms",
                module: "Administrative Tasks",
                priority: "medium",
                dueDate: "2023-06-15",
              },
              {
                id: "4",
                title: "Process referrals",
                module: "Appointments",
                priority: "low",
                dueDate: "2023-06-16",
              },
            ]}
          />
          <Card className="w-full bg-card overflow-hidden">
            <CardHeader>
              <CardTitle className="text-xl">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-3">
                <button className="w-full text-left p-3 bg-blue-50 dark:bg-blue-900/20 rounded-md hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors">
                  Schedule New Appointment
                </button>
                <button className="w-full text-left p-3 bg-green-50 dark:bg-green-900/20 rounded-md hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors">
                  Register New Patient
                </button>
                <button className="w-full text-left p-3 bg-purple-50 dark:bg-purple-900/20 rounded-md hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors">
                  Generate OPD Report
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="col-span-1 flex flex-col gap-4">
          {/* You can add more widgets here if needed */}
        </div>
      </section>
    </div>
  );
};

export default OPDDashboard;
