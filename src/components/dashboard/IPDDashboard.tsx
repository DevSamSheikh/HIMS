import React, { useState, useEffect } from "react";
import StatisticsPanel from "./StatisticsPanel";
import TasksPanel from "./TasksPanel";
import {
  BedDouble,
  Users,
  Activity,
  ClipboardList,
  Clipboard,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import BarChart from "./charts/BarChart";
import PieChart from "./charts/PieChart";
import DashboardSkeleton from "./DashboardSkeleton";

const IPDDashboard = () => {
  const [isLoading, setIsLoading] = useState(true);

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Chart data
  const admissionsByWardData = [
    { label: "General", value: 32, color: "bg-blue-500" },
    { label: "Pediatric", value: 12, color: "bg-green-500" },
    { label: "Surgical", value: 28, color: "bg-purple-500" },
    { label: "Maternity", value: 8, color: "bg-amber-500" },
    { label: "ICU", value: 9, color: "bg-red-500" },
    { label: "Cardiac", value: 7, color: "bg-indigo-500" },
  ];

  const diagnosisDistributionData = [
    { label: "Respiratory", value: 28 },
    { label: "Cardiac", value: 22 },
    { label: "Surgical", value: 18 },
    { label: "Infectious", value: 15 },
    { label: "Other", value: 13 },
  ];

  if (isLoading) {
    return <DashboardSkeleton />;
  }
  // Mock data for ward occupancy
  const wards = [
    { name: "General Ward", total: 40, occupied: 32, status: "high" },
    { name: "Pediatric Ward", total: 20, occupied: 12, status: "medium" },
    { name: "Surgical Ward", total: 30, occupied: 28, status: "high" },
    { name: "Maternity Ward", total: 15, occupied: 8, status: "medium" },
    { name: "ICU", total: 10, occupied: 9, status: "critical" },
    { name: "Cardiac Care", total: 12, occupied: 7, status: "medium" },
  ];

  // Mock data for recent admissions
  const recentAdmissions = [
    {
      id: 1,
      patient: "John Smith",
      age: 45,
      diagnosis: "Pneumonia",
      admissionDate: "2023-06-12",
      ward: "General Ward",
      bed: "G-12",
    },
    {
      id: 2,
      patient: "Emily Johnson",
      age: 32,
      diagnosis: "Appendicitis",
      admissionDate: "2023-06-13",
      ward: "Surgical Ward",
      bed: "S-05",
    },
    {
      id: 3,
      patient: "Michael Brown",
      age: 67,
      diagnosis: "Cardiac Arrest",
      admissionDate: "2023-06-14",
      ward: "ICU",
      bed: "ICU-03",
    },
    {
      id: 4,
      patient: "Sarah Davis",
      age: 28,
      diagnosis: "Childbirth",
      admissionDate: "2023-06-14",
      ward: "Maternity Ward",
      bed: "M-04",
    },
  ];

  const getOccupancyStatusColor = (status: string) => {
    switch (status) {
      case "critical":
        return "text-red-500";
      case "high":
        return "text-amber-500";
      case "medium":
        return "text-yellow-500";
      case "low":
        return "text-green-500";
      default:
        return "text-gray-500";
    }
  };

  const getOccupancyPercentage = (occupied: number, total: number) => {
    return (occupied / total) * 100;
  };

  return (
    <div className="container mx-auto space-y-6 max-w-7xl">
      <h1 className="text-3xl font-bold tracking-tight">IPD Dashboard</h1>
      <p className="text-muted-foreground">
        Manage inpatient department, ward occupancy, and patient admissions.
      </p>

      <StatisticsPanel
        statistics={[
          {
            title: "Total Beds",
            value: "127",
            description: "Across all wards",
            icon: <BedDouble className="h-5 w-5" />,
          },
          {
            title: "Bed Occupancy",
            value: "76%",
            description: "Current occupancy rate",
            icon: <Activity className="h-5 w-5" />,
            trend: { value: 3, isPositive: false },
          },
          {
            title: "Admitted Patients",
            value: "96",
            description: "Currently admitted",
            icon: <Users className="h-5 w-5" />,
            trend: { value: 5, isPositive: true },
          },
          {
            title: "Discharges Today",
            value: "8",
            description: "Scheduled for today",
            icon: <ClipboardList className="h-5 w-5" />,
          },
        ]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="w-full bg-card">
            <CardHeader>
              <CardTitle className="text-xl flex items-center">
                <BedDouble className="mr-2 h-5 w-5" />
                Admissions by Ward
              </CardTitle>
            </CardHeader>
            <CardContent>
              <BarChart data={admissionsByWardData} height={180} />
            </CardContent>
          </Card>

          <Card className="w-full bg-card">
            <CardHeader>
              <CardTitle className="text-xl flex items-center">
                <BedDouble className="mr-2 h-5 w-5" />
                Ward Occupancy
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {wards.map((ward, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{ward.name}</span>
                      <span
                        className={`font-medium ${getOccupancyStatusColor(ward.status)}`}
                      >
                        {ward.occupied}/{ward.total} beds
                      </span>
                    </div>
                    <Progress
                      value={getOccupancyPercentage(ward.occupied, ward.total)}
                      className={`h-2 ${ward.status === "critical" ? "bg-red-100" : ward.status === "high" ? "bg-amber-100" : "bg-gray-100"}`}
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="w-full bg-card">
            <CardHeader>
              <CardTitle className="text-xl flex items-center">
                <Clipboard className="mr-2 h-5 w-5" />
                Recent Admissions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-medium">
                        Patient
                      </th>
                      <th className="text-left py-3 px-4 font-medium">Age</th>
                      <th className="text-left py-3 px-4 font-medium">
                        Diagnosis
                      </th>
                      <th className="text-left py-3 px-4 font-medium">
                        Admission Date
                      </th>
                      <th className="text-left py-3 px-4 font-medium">
                        Ward/Bed
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentAdmissions.map((admission) => (
                      <tr
                        key={admission.id}
                        className="border-b hover:bg-muted/50"
                      >
                        <td className="py-3 px-4">{admission.patient}</td>
                        <td className="py-3 px-4">{admission.age}</td>
                        <td className="py-3 px-4">{admission.diagnosis}</td>
                        <td className="py-3 px-4">{admission.admissionDate}</td>
                        <td className="py-3 px-4">
                          {admission.ward} / {admission.bed}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="lg:col-span-1 space-y-6">
          <Card className="w-full bg-card">
            <CardHeader>
              <CardTitle className="text-xl flex items-center">
                <Activity className="mr-2 h-5 w-5" />
                Diagnosis Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <PieChart data={diagnosisDistributionData} size={180} />
            </CardContent>
          </Card>

          <TasksPanel
            tasks={[
              {
                id: "1",
                title: "Process discharge papers",
                module: "Administrative Tasks",
                priority: "high",
                dueDate: "2023-06-15",
              },
              {
                id: "2",
                title: "Prepare beds for new admissions",
                module: "Administrative Tasks",
                priority: "medium",
                dueDate: "2023-06-15",
              },
              {
                id: "3",
                title: "Update patient charts",
                module: "Patient Management",
                priority: "high",
                dueDate: "2023-06-15",
              },
              {
                id: "4",
                title: "Schedule surgeries",
                module: "Appointments",
                priority: "medium",
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
                  Admit New Patient
                </button>
                <button className="w-full text-left p-3 bg-green-50 dark:bg-green-900/20 rounded-md hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors">
                  Process Discharge
                </button>
                <button className="w-full text-left p-3 bg-purple-50 dark:bg-purple-900/20 rounded-md hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors">
                  Transfer Patient
                </button>
                <button className="w-full text-left p-3 bg-orange-50 dark:bg-orange-900/20 rounded-md hover:bg-orange-100 dark:hover:bg-orange-900/30 transition-colors">
                  Generate Ward Report
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default IPDDashboard;
