import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";

interface PatientDemographicsReportProps {
  data: Array<{
    id: string;
    name: string;
    age: number;
    gender: string;
    bloodGroup: string;
    contact: string;
    address: string;
    registrationDate: string;
  }>;
  dateRange: { from: Date | null; to: Date | null };
  onPrint: () => void;
}

const PatientDemographicsReport: React.FC<PatientDemographicsReportProps> = ({
  data,
  dateRange,
  onPrint,
}) => {
  return (
    <div id="report-content" className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium">Patient Demographics Summary</h3>
          <p className="text-sm text-muted-foreground print:text-black">
            Total Patients: {data.length}
            {dateRange.from && dateRange.to && (
              <span className="ml-2">
                ({dateRange.from.toLocaleDateString()} to{" "}
                {dateRange.to.toLocaleDateString()})
              </span>
            )}
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="print:hidden"
          onClick={onPrint}
        >
          <Printer className="mr-2 h-4 w-4" />
          Print
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Patient ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Age</TableHead>
            <TableHead>Gender</TableHead>
            <TableHead>Blood Group</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>Address</TableHead>
            <TableHead>Registration Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((patient) => (
            <TableRow key={patient.id}>
              <TableCell className="font-medium">{patient.id}</TableCell>
              <TableCell>{patient.name}</TableCell>
              <TableCell>{patient.age}</TableCell>
              <TableCell>{patient.gender}</TableCell>
              <TableCell>{patient.bloodGroup}</TableCell>
              <TableCell>{patient.contact}</TableCell>
              <TableCell>{patient.address}</TableCell>
              <TableCell>{patient.registrationDate}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Print-only header */}
      <div className="hidden print:block print:mb-6">
        <div className="text-center mb-4">
          <h1 className="text-2xl font-bold">Hospital Management System</h1>
          <p className="text-lg">Patient Demographics Report</p>
          <p>
            {dateRange.from && dateRange.to
              ? `${dateRange.from.toLocaleDateString()} to ${dateRange.to.toLocaleDateString()}`
              : "All time"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PatientDemographicsReport;
