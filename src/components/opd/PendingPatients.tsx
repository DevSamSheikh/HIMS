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
import { Input } from "@/components/ui/input";
import { Search, Filter, FileText, CheckCircle } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface PendingPatient {
  id: string;
  patientId: string;
  patientName: string;
  age: number;
  gender: string;
  doctor: string;
  visitDate: string;
  pendingTests: string[];
  status: "pending" | "completed" | "cancelled";
}

const PendingPatients = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [doctorFilter, setDoctorFilter] = useState<string>("all");

  // Mock data for pending patients
  const pendingPatients: PendingPatient[] = [
    {
      id: "PP001",
      patientId: "P10023",
      patientName: "John Doe",
      age: 45,
      gender: "Male",
      doctor: "Dr. Sarah Johnson",
      visitDate: "2023-11-15",
      pendingTests: ["Complete Blood Count", "Lipid Profile"],
      status: "pending",
    },
    {
      id: "PP002",
      patientId: "P10045",
      patientName: "Jane Smith",
      age: 32,
      gender: "Female",
      doctor: "Dr. Michael Chen",
      visitDate: "2023-11-14",
      pendingTests: ["Blood Glucose", "HbA1c"],
      status: "pending",
    },
    {
      id: "PP003",
      patientId: "P10067",
      patientName: "Robert Brown",
      age: 58,
      gender: "Male",
      doctor: "Dr. Williams",
      visitDate: "2023-11-13",
      pendingTests: ["MRI Brain"],
      status: "completed",
    },
    {
      id: "PP004",
      patientId: "P10089",
      patientName: "Emily Davis",
      age: 27,
      gender: "Female",
      doctor: "Dr. Brown",
      visitDate: "2023-11-12",
      pendingTests: ["Ultrasound"],
      status: "cancelled",
    },
    {
      id: "PP005",
      patientId: "P10112",
      patientName: "Michael Wilson",
      age: 39,
      gender: "Male",
      doctor: "Dr. Sarah Johnson",
      visitDate: "2023-11-10",
      pendingTests: ["ECG", "Cardiac Enzymes"],
      status: "pending",
    },
  ];

  // Filter patients based on search query and filters
  const filteredPatients = pendingPatients.filter((patient) => {
    const matchesSearch =
      patient.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.patientId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.doctor.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || patient.status === statusFilter;

    const matchesDoctor =
      doctorFilter === "all" || patient.doctor === doctorFilter;

    return matchesSearch && matchesStatus && matchesDoctor;
  });

  // Get unique doctors for filter
  const doctors = [
    ...new Set(pendingPatients.map((patient) => patient.doctor)),
  ];

  const getStatusBadgeVariant = (status: PendingPatient["status"]) => {
    switch (status) {
      case "pending":
        return "outline";
      case "completed":
        return "default";
      case "cancelled":
        return "destructive";
      default:
        return "outline";
    }
  };

  const getStatusBadgeClass = (status: PendingPatient["status"]) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100";
      case "completed":
        return "bg-green-100 text-green-800 hover:bg-green-100";
      case "cancelled":
        return "bg-red-100 text-red-800 hover:bg-red-100";
      default:
        return "";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pending Patients</CardTitle>
        <CardDescription>
          Manage patients with pending tests and follow-ups
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
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
            <div className="flex flex-col sm:flex-row gap-4">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>

              <Select value={doctorFilter} onValueChange={setDoctorFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by doctor" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Doctors</SelectItem>
                  {doctors.map((doctor) => (
                    <SelectItem key={doctor} value={doctor}>
                      {doctor}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Patient</TableHead>
                  <TableHead>Doctor</TableHead>
                  <TableHead>Visit Date</TableHead>
                  <TableHead>Pending Tests</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPatients.map((patient) => (
                  <TableRow key={patient.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{patient.patientName}</div>
                        <div className="text-sm text-muted-foreground">
                          {patient.patientId} • {patient.age} yrs •{" "}
                          {patient.gender}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{patient.doctor}</TableCell>
                    <TableCell>{patient.visitDate}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {patient.pendingTests.map((test, index) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="bg-blue-50"
                          >
                            {test}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={getStatusBadgeVariant(patient.status)}
                        className={getStatusBadgeClass(patient.status)}
                      >
                        {patient.status.charAt(0).toUpperCase() +
                          patient.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          title="View Details"
                        >
                          <FileText className="h-4 w-4" />
                        </Button>
                        {patient.status === "pending" && (
                          <Button
                            variant="ghost"
                            size="icon"
                            title="Mark as Completed"
                          >
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredPatients.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center h-24">
                      No pending patients found matching your filters.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PendingPatients;
