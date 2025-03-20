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
import { OPDVisit } from "../types";
import { Clock, ArrowRight, CheckCircle2, AlertCircle } from "lucide-react";

interface OPDQueueProps {
  searchQuery: string;
}

const OPDQueue: React.FC<OPDQueueProps> = ({ searchQuery }) => {
  // Sample today's queue data
  const today = new Date().toISOString().split("T")[0];

  const [queueItems, setQueueItems] = useState<OPDVisit[]>([
    {
      id: "101",
      patientId: "1",
      patientName: "John Smith",
      mrNumber: "MR-2023-0001",
      visitDate: today,
      doctorId: "D1",
      doctorName: "Dr. Ahmed Khan",
      department: "Cardiology",
      chiefComplaint: "Chest pain and palpitations",
      visitType: "Follow-up",
      fee: 1000,
      paymentStatus: "Paid",
      status: "Waiting",
      vitalSigns: {
        temperature: 98.6,
        bloodPressure: "140/90",
        pulseRate: 88,
        respiratoryRate: 18,
        oxygenSaturation: 98,
      },
    },
    {
      id: "102",
      patientId: "2",
      patientName: "Sarah Johnson",
      mrNumber: "MR-2023-0002",
      visitDate: today,
      doctorId: "D1",
      doctorName: "Dr. Ahmed Khan",
      department: "Cardiology",
      chiefComplaint: "Palpitations and dizziness",
      visitType: "First",
      fee: 2000,
      paymentStatus: "Paid",
      status: "In Consultation",
      vitalSigns: {
        temperature: 98.4,
        bloodPressure: "120/80",
        pulseRate: 76,
        respiratoryRate: 16,
        oxygenSaturation: 99,
      },
    },
    {
      id: "103",
      patientId: "5",
      patientName: "Mohammad Raza",
      mrNumber: "MR-2023-0005",
      visitDate: today,
      doctorId: "D2",
      doctorName: "Dr. Fatima Ali",
      department: "Dermatology",
      chiefComplaint: "Skin rash follow-up",
      visitType: "Follow-up",
      fee: 1000,
      paymentStatus: "Pending",
      status: "Waiting",
    },
    {
      id: "104",
      patientId: "3",
      patientName: "Ahmed Khan",
      mrNumber: "MR-2023-0003",
      visitDate: today,
      doctorId: "D3",
      doctorName: "Dr. Zainab Malik",
      department: "Orthopedics",
      chiefComplaint: "Knee pain assessment",
      visitType: "First",
      fee: 2500,
      paymentStatus: "Paid",
      status: "Completed",
      diagnosis: "Osteoarthritis of the knee",
      treatment: "Prescribed pain medication and physiotherapy",
    },
    {
      id: "105",
      patientId: "4",
      patientName: "Fatima Ali",
      mrNumber: "MR-2023-0004",
      visitDate: today,
      doctorId: "D4",
      doctorName: "Dr. Imran Shah",
      department: "ENT",
      chiefComplaint: "Ear infection follow-up",
      visitType: "Follow-up",
      fee: 1000,
      paymentStatus: "Paid",
      status: "Waiting",
    },
  ]);

  // Filter queue items based on search query
  const filteredQueue = queueItems.filter((item) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      item.patientName.toLowerCase().includes(searchLower) ||
      item.mrNumber.toLowerCase().includes(searchLower) ||
      item.doctorName.toLowerCase().includes(searchLower) ||
      item.department.toLowerCase().includes(searchLower)
    );
  });

  // Group by doctor and department
  const queueByDoctor = filteredQueue.reduce(
    (acc, item) => {
      const key = `${item.doctorId}-${item.department}`;
      if (!acc[key]) {
        acc[key] = {
          doctorId: item.doctorId,
          doctorName: item.doctorName,
          department: item.department,
          patients: [],
        };
      }
      acc[key].patients.push(item);
      return acc;
    },
    {} as Record<
      string,
      {
        doctorId: string;
        doctorName: string;
        department: string;
        patients: OPDVisit[];
      }
    >,
  );

  // Stats
  const waitingCount = queueItems.filter(
    (item) => item.status === "Waiting",
  ).length;
  const inConsultationCount = queueItems.filter(
    (item) => item.status === "In Consultation",
  ).length;
  const completedCount = queueItems.filter(
    (item) => item.status === "Completed",
  ).length;

  const updateStatus = (
    id: string,
    newStatus: "Waiting" | "In Consultation" | "Completed" | "Cancelled",
  ) => {
    setQueueItems(
      queueItems.map((item) =>
        item.id === id ? { ...item, status: newStatus } : item,
      ),
    );
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Total Patients
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{queueItems.length}</div>
            <p className="text-xs text-muted-foreground">Today's OPD queue</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Waiting</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{waitingCount}</div>
            <p className="text-xs text-muted-foreground">
              Patients in waiting area
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              In Consultation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inConsultationCount}</div>
            <p className="text-xs text-muted-foreground">
              Currently with doctors
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
              Consultations completed
            </p>
          </CardContent>
        </Card>
      </div>

      {Object.values(queueByDoctor).map((doctorQueue) => (
        <Card key={doctorQueue.doctorId} className="overflow-hidden">
          <CardHeader className="bg-muted py-3">
            <CardTitle className="text-lg font-medium">
              {doctorQueue.doctorName} - {doctorQueue.department}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Token</TableHead>
                  <TableHead>Patient</TableHead>
                  <TableHead>Visit Type</TableHead>
                  <TableHead>Chief Complaint</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {doctorQueue.patients.map((patient, index) => (
                  <TableRow key={patient.id}>
                    <TableCell>
                      <Badge variant="outline" className="font-bold">
                        {index + 1}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{patient.patientName}</div>
                        <div className="text-xs text-muted-foreground">
                          {patient.mrNumber}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          patient.visitType === "First"
                            ? "default"
                            : "secondary"
                        }
                      >
                        {patient.visitType}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">{patient.chiefComplaint}</span>
                    </TableCell>
                    <TableCell>
                      {patient.status === "Waiting" && (
                        <Badge
                          variant="outline"
                          className="bg-yellow-50 text-yellow-700 border-yellow-200 flex items-center gap-1"
                        >
                          <Clock className="h-3 w-3" /> Waiting
                        </Badge>
                      )}
                      {patient.status === "In Consultation" && (
                        <Badge
                          variant="outline"
                          className="bg-blue-50 text-blue-700 border-blue-200 flex items-center gap-1"
                        >
                          <ArrowRight className="h-3 w-3" /> In Consultation
                        </Badge>
                      )}
                      {patient.status === "Completed" && (
                        <Badge
                          variant="outline"
                          className="bg-green-50 text-green-700 border-green-200 flex items-center gap-1"
                        >
                          <CheckCircle2 className="h-3 w-3" /> Completed
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {patient.paymentStatus === "Paid" ? (
                        <Badge
                          variant="outline"
                          className="bg-green-50 text-green-700 border-green-200"
                        >
                          Paid
                        </Badge>
                      ) : (
                        <Badge
                          variant="outline"
                          className="bg-yellow-50 text-yellow-700 border-yellow-200"
                        >
                          Pending
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      {patient.status === "Waiting" && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-blue-600 border-blue-200 hover:bg-blue-50"
                          onClick={() =>
                            updateStatus(patient.id, "In Consultation")
                          }
                        >
                          Start Consultation
                        </Button>
                      )}
                      {patient.status === "In Consultation" && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-green-600 border-green-200 hover:bg-green-50"
                          onClick={() => updateStatus(patient.id, "Completed")}
                        >
                          Complete
                        </Button>
                      )}
                      {patient.status === "Completed" && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-gray-600 border-gray-200 hover:bg-gray-50"
                        >
                          View Details
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default OPDQueue;
