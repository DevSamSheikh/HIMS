import React from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FileText, Printer, Search } from "lucide-react";

// Mock data for completed checkups
const mockCompletedCheckups = [
  {
    id: "C001",
    date: "2023-11-15",
    patientId: "P001",
    patientName: "John Doe",
    diagnosis: ["Common Cold", "Allergic Rhinitis"],
    doctor: "Dr. Sarah Johnson",
  },
  {
    id: "C002",
    date: "2023-11-14",
    patientId: "P003",
    patientName: "Robert Brown",
    diagnosis: ["Hypertension", "Type 2 Diabetes"],
    doctor: "Dr. Michael Chen",
  },
  {
    id: "C003",
    date: "2023-11-14",
    patientId: "P002",
    patientName: "Jane Smith",
    diagnosis: ["Migraine"],
    doctor: "Dr. Sarah Johnson",
  },
  {
    id: "C004",
    date: "2023-11-13",
    patientId: "P004",
    patientName: "Emily Wilson",
    diagnosis: ["Gastritis"],
    doctor: "Dr. Michael Chen",
  },
  {
    id: "C005",
    date: "2023-11-12",
    patientId: "P005",
    patientName: "David Miller",
    diagnosis: ["Bronchitis", "Asthma"],
    doctor: "Dr. Sarah Johnson",
  },
];

const CompletedCheckupsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = React.useState<string>("");

  // Filter checkups based on search query
  const filteredCheckups = mockCompletedCheckups.filter(
    (checkup) =>
      checkup.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      checkup.patientId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      checkup.id.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // Handler for printing prescription
  const handlePrintPrescription = (checkupId: string) => {
    console.log(`Printing prescription for checkup ${checkupId}`);
    alert(`Prescription for checkup ${checkupId} sent to printer`);
  };

  // Handler for viewing prescription
  const handleViewPrescription = (checkupId: string) => {
    console.log(`Viewing prescription for checkup ${checkupId}`);
    // In a real app, this would open a modal or navigate to a prescription view
    alert(`Viewing prescription for checkup ${checkupId}`);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Completed Checkups</CardTitle>
            <CardDescription>
              View and print prescriptions for completed checkups
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search by patient name, ID or checkup ID..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Checkup ID</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Patient</TableHead>
                      <TableHead>Diagnosis</TableHead>
                      <TableHead>Doctor</TableHead>
                      <TableHead className="w-[120px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCheckups.map((checkup) => (
                      <TableRow key={checkup.id}>
                        <TableCell className="font-medium">
                          {checkup.id}
                        </TableCell>
                        <TableCell>{checkup.date}</TableCell>
                        <TableCell>
                          {checkup.patientName}
                          <div className="text-xs text-muted-foreground">
                            {checkup.patientId}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {checkup.diagnosis.map((diagnosis, index) => (
                              <Badge key={index} variant="default">
                                {diagnosis}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>{checkup.doctor}</TableCell>
                        <TableCell>
                          <div className="flex space-x-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleViewPrescription(checkup.id)}
                            >
                              <FileText className="h-4 w-4" />
                              <span className="sr-only">View Prescription</span>
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() =>
                                handlePrintPrescription(checkup.id)
                              }
                            >
                              <Printer className="h-4 w-4" />
                              <span className="sr-only">
                                Print Prescription
                              </span>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                    {filteredCheckups.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={6} className="h-24 text-center">
                          No checkups found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default CompletedCheckupsPage;
