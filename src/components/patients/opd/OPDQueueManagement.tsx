import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, ArrowUpDown, MoreHorizontal, Clock } from "lucide-react";
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
import { OPDVisit } from "../types";
import { toast } from "@/components/ui/use-toast";

interface OPDQueueManagementProps {
  searchQuery: string;
}

const OPDQueueManagement: React.FC<OPDQueueManagementProps> = ({
  searchQuery,
}) => {
  const [localSearchQuery, setLocalSearchQuery] = useState<string>(searchQuery);

  // Sample queue data
  const [queueItems, setQueueItems] = useState<OPDVisit[]>([
    {
      id: "1",
      patientId: "1",
      patientName: "John Smith",
      mrNumber: "MR-2023-0001",
      visitDate: new Date().toISOString(),
      doctorId: "D1",
      doctorName: "Dr. Ahmed Khan",
      department: "Cardiology",
      chiefComplaint: "Chest pain and shortness of breath",
      visitType: "First",
      fee: 2000,
      paymentStatus: "Paid",
      status: "Waiting",
      tokenNumber: "T-20230715-001",
      vitalSigns: {
        temperature: 98.6,
        bloodPressure: "140/90",
        pulseRate: 88,
        respiratoryRate: 18,
        oxygenSaturation: 98,
      },
    },
    {
      id: "2",
      patientId: "2",
      patientName: "Sarah Johnson",
      mrNumber: "MR-2023-0002",
      visitDate: new Date().toISOString(),
      doctorId: "D2",
      doctorName: "Dr. Fatima Ali",
      department: "Dermatology",
      chiefComplaint: "Skin rash and itching",
      visitType: "First",
      fee: 1800,
      paymentStatus: "Paid",
      status: "Waiting",
      tokenNumber: "T-20230716-001",
    },
    {
      id: "3",
      patientId: "3",
      patientName: "Ahmed Khan",
      mrNumber: "MR-2023-0003",
      visitDate: new Date().toISOString(),
      doctorId: "D1",
      doctorName: "Dr. Ahmed Khan",
      department: "Cardiology",
      chiefComplaint: "Follow-up for hypertension",
      visitType: "Follow-up",
      fee: 1000,
      paymentStatus: "Pending",
      status: "In Consultation",
      tokenNumber: "T-20230717-001",
    },
    {
      id: "4",
      patientId: "4",
      patientName: "Fatima Ali",
      mrNumber: "MR-2023-0004",
      visitDate: new Date().toISOString(),
      doctorId: "D3",
      doctorName: "Dr. Zainab Malik",
      department: "Orthopedics",
      chiefComplaint: "Lower back pain",
      visitType: "First",
      fee: 2500,
      paymentStatus: "Paid",
      status: "Waiting",
      tokenNumber: "T-20230718-001",
    },
    {
      id: "5",
      patientId: "5",
      patientName: "Mohammad Raza",
      mrNumber: "MR-2023-0005",
      visitDate: new Date().toISOString(),
      doctorId: "D4",
      doctorName: "Dr. Imran Shah",
      department: "ENT",
      chiefComplaint: "Sore throat and ear pain",
      visitType: "First",
      fee: 1500,
      paymentStatus: "Waived",
      status: "Waiting",
      tokenNumber: "T-20230719-001",
    },
  ]);

  // Filter queue items based on search query
  const filteredQueue = queueItems.filter((item) => {
    if (!localSearchQuery) return true;

    const searchLower = localSearchQuery.toLowerCase();
    return (
      item.patientName.toLowerCase().includes(searchLower) ||
      item.mrNumber.toLowerCase().includes(searchLower) ||
      item.doctorName.toLowerCase().includes(searchLower) ||
      item.department.toLowerCase().includes(searchLower) ||
      item.tokenNumber?.toLowerCase().includes(searchLower)
    );
  });

  // Sort queue items by status (Waiting first, then In Consultation)
  const sortedQueue = [...filteredQueue].sort((a, b) => {
    if (a.status === "Waiting" && b.status !== "Waiting") return -1;
    if (a.status !== "Waiting" && b.status === "Waiting") return 1;
    return 0;
  });

  const handleStartConsultation = (visitId: string) => {
    setQueueItems(
      queueItems.map((item) =>
        item.id === visitId ? { ...item, status: "In Consultation" } : item,
      ),
    );
    toast({
      title: "Consultation Started",
      description: "Patient has been moved to consultation.",
    });
  };

  const handleCompleteConsultation = (visitId: string) => {
    setQueueItems(
      queueItems.map((item) =>
        item.id === visitId ? { ...item, status: "Completed" } : item,
      ),
    );
    toast({
      title: "Consultation Completed",
      description: "Patient consultation has been marked as completed.",
    });
  };

  const handleCancelVisit = (visitId: string) => {
    setQueueItems(
      queueItems.map((item) =>
        item.id === visitId ? { ...item, status: "Cancelled" } : item,
      ),
    );
    toast({
      title: "Visit Cancelled",
      description: "Patient visit has been cancelled.",
      variant: "destructive",
    });
  };

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

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">OPD Queue Management</h2>
          <p className="text-muted-foreground">
            Manage patient queue and consultations
          </p>
        </div>
        <div className="flex space-x-2">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add to Queue
          </Button>
        </div>
      </div>

      <Card className="bg-white dark:bg-gray-950">
        <div className="p-4 flex justify-between items-center">
          <div className="relative w-[300px]">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search patients, tokens..."
              value={localSearchQuery}
              onChange={(e) => setLocalSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline">
              <ArrowUpDown className="mr-2 h-4 w-4" />
              Sort
            </Button>
          </div>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Token</TableHead>
                <TableHead>Patient</TableHead>
                <TableHead>Doctor</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Wait Time</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedQueue.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center h-24">
                    No patients in queue matching your search.
                  </TableCell>
                </TableRow>
              ) : (
                sortedQueue.map((item) => {
                  // Calculate wait time (for demo purposes)
                  const waitTime = Math.floor(Math.random() * 60) + 5; // 5-65 minutes

                  return (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">
                        {item.tokenNumber}
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{item.patientName}</div>
                          <div className="text-xs text-muted-foreground">
                            {item.mrNumber}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{item.doctorName}</TableCell>
                      <TableCell>{item.department}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Clock className="mr-1 h-3 w-3 text-muted-foreground" />
                          <span className="text-sm">
                            {item.status === "Waiting"
                              ? `${waitTime} mins`
                              : "-"}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(item.status)}</TableCell>
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
                            {item.status === "Waiting" && (
                              <DropdownMenuItem
                                onClick={() => handleStartConsultation(item.id)}
                              >
                                Start Consultation
                              </DropdownMenuItem>
                            )}
                            {item.status === "In Consultation" && (
                              <DropdownMenuItem
                                onClick={() =>
                                  handleCompleteConsultation(item.id)
                                }
                              >
                                Complete Consultation
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem>View Details</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            {(item.status === "Waiting" ||
                              item.status === "In Consultation") && (
                              <DropdownMenuItem
                                className="text-destructive"
                                onClick={() => handleCancelVisit(item.id)}
                              >
                                Cancel Visit
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
};

export default OPDQueueManagement;
