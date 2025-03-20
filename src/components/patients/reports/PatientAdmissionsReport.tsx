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
import { Badge } from "@/components/ui/badge";
import { Printer } from "lucide-react";

interface PatientAdmissionsReportProps {
  data: Array<{
    id: string;
    patientId: string;
    patientName: string;
    admissionDate: string;
    dischargeDate: string | null;
    department: string;
    doctor: string;
    ward: string;
    bed: string;
    diagnosis: string;
    status: string;
  }>;
  dateRange: { from: Date | null; to: Date | null };
  department: string;
  doctor: string;
  onPrint: () => void;
}

const PatientAdmissionsReport: React.FC<PatientAdmissionsReportProps> = ({
  data,
  dateRange,
  department,
  doctor,
  onPrint,
}) => {
  // Calculate summary statistics
  const totalAdmissions = data.length;
  const currentlyAdmitted = data.filter(
    (admission) => admission.status === "Admitted",
  ).length;
  const discharged = data.filter(
    (admission) => admission.status === "Discharged",
  ).length;

  return (
    <div id="report-content" className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium">Patient Admissions Report</h3>
          <p className="text-sm text-muted-foreground print:text-black">
            Total Admissions: {totalAdmissions}
            {dateRange.from && dateRange.to && (
              <span className="ml-2">
                ({dateRange.from.toLocaleDateString()} to{" "}
                {dateRange.to.toLocaleDateString()})
              </span>
            )}
            {department !== "all" && (
              <span className="ml-2">• Department: {department}</span>
            )}
            {doctor !== "all" && (
              <span className="ml-2">• Doctor: {doctor}</span>
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
            <TableHead>Admission ID</TableHead>
            <TableHead>Patient</TableHead>
            <TableHead>Admission Date</TableHead>
            <TableHead>Discharge Date</TableHead>
            <TableHead>Department</TableHead>
            <TableHead>Doctor</TableHead>
            <TableHead>Ward/Bed</TableHead>
            <TableHead>Diagnosis</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((admission) => (
            <TableRow key={admission.id}>
              <TableCell className="font-medium">{admission.id}</TableCell>
              <TableCell>
                <div>
                  <div>{admission.patientName}</div>
                  <div className="text-xs text-muted-foreground print:text-gray-600">
                    {admission.patientId}
                  </div>
                </div>
              </TableCell>
              <TableCell>{admission.admissionDate}</TableCell>
              <TableCell>
                {admission.dischargeDate || "Not discharged"}
              </TableCell>
              <TableCell>{admission.department}</TableCell>
              <TableCell>{admission.doctor}</TableCell>
              <TableCell>
                {admission.ward} / {admission.bed}
              </TableCell>
              <TableCell>{admission.diagnosis}</TableCell>
              <TableCell>
                <Badge
                  variant={
                    admission.status === "Admitted" ? "outline" : "default"
                  }
                  className={
                    admission.status === "Discharged"
                      ? "bg-green-100 text-green-800 hover:bg-green-100 print:bg-green-100 print:text-green-800"
                      : ""
                  }
                >
                  {admission.status}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Summary section */}
      <div className="border rounded-md p-4 bg-muted/20 print:bg-gray-50">
        <h4 className="font-medium mb-2">Admissions Summary</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-muted-foreground print:text-gray-600">
              Total Admissions
            </p>
            <p className="text-lg font-bold">{totalAdmissions}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground print:text-gray-600">
              Currently Admitted
            </p>
            <p className="text-lg font-bold text-blue-600">
              {currentlyAdmitted}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground print:text-gray-600">
              Discharged
            </p>
            <p className="text-lg font-bold text-green-600">{discharged}</p>
          </div>
        </div>
      </div>

      {/* Print-only header */}
      <div className="hidden print:block print:mb-6">
        <div className="text-center mb-4">
          <h1 className="text-2xl font-bold">Hospital Management System</h1>
          <p className="text-lg">Patient Admissions Report</p>
          <p>
            {dateRange.from && dateRange.to
              ? `${dateRange.from.toLocaleDateString()} to ${dateRange.to.toLocaleDateString()}`
              : "All time"}
            {department !== "all" && ` • Department: ${department}`}
            {doctor !== "all" && ` • Doctor: ${doctor}`}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PatientAdmissionsReport;
