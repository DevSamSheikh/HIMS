import React, { useState } from "react";
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
} from "lucide-react";
import { OPDVisit } from "../types";

interface OPDVisitListProps {
  searchQuery: string;
}

const OPDVisitList: React.FC<OPDVisitListProps> = ({ searchQuery }) => {
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
      chiefComplaint: "Palpitations and dizziness",
    },
  ]);

  // Filter visits based on search query
  const filteredVisits = visits.filter((visit) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      visit.patientName.toLowerCase().includes(searchLower) ||
      visit.mrNumber.toLowerCase().includes(searchLower) ||
      visit.doctorName.toLowerCase().includes(searchLower) ||
      visit.department.toLowerCase().includes(searchLower) ||
      (visit.diagnosis && visit.diagnosis.toLowerCase().includes(searchLower))
    );
  });

  // Sort visits by date (newest first)
  const sortedVisits = [...filteredVisits].sort((a, b) => {
    return new Date(b.visitDate).getTime() - new Date(a.visitDate).getTime();
  });

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

  return (
    <Card>
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
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedVisits.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center h-24">
                  No OPD visits found matching your search.
                </TableCell>
              </TableRow>
            ) : (
              sortedVisits.map((visit) => (
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
                        <DropdownMenuItem>
                          <FileText className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit Visit
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Printer className="mr-2 h-4 w-4" />
                          Print Receipt
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Calendar className="mr-2 h-4 w-4" />
                          Schedule Follow-up
                        </DropdownMenuItem>
                        {visit.status !== "Completed" && (
                          <DropdownMenuItem>
                            <AlertCircle className="mr-2 h-4 w-4" />
                            Mark as Completed
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
    </Card>
  );
};

export default OPDVisitList;
