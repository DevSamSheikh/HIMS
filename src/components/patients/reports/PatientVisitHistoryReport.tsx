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

interface PatientVisitHistoryReportProps {
  data: Array<{
    id: string;
    patientId: string;
    patientName: string;
    date: string;
    department: string;
    doctor: string;
    diagnosis: string;
    followUp: string | null;
  }>;
  dateRange: { from: Date | null; to: Date | null };
  department: string;
  doctor: string;
  onPrint: () => void;
}

const PatientVisitHistoryReport: React.FC<PatientVisitHistoryReportProps> = ({
  data,
  dateRange,
  department,
  doctor,
  onPrint,
}) => {
  return (
    <div id="report-content" className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium">Patient Visit History</h3>
          <p className="text-sm text-muted-foreground print:text-black">
            Total Visits: {data.length}
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
            <TableHead>Visit ID</TableHead>
            <TableHead>Patient</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Department</TableHead>
            <TableHead>Doctor</TableHead>
            <TableHead>Diagnosis</TableHead>
            <TableHead>Follow-up</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((visit) => (
            <TableRow key={visit.id}>
              <TableCell className="font-medium">{visit.id}</TableCell>
              <TableCell>
                <div>
                  <div>{visit.patientName}</div>
                  <div className="text-xs text-muted-foreground print:text-gray-600">
                    {visit.patientId}
                  </div>
                </div>
              </TableCell>
              <TableCell>{visit.date}</TableCell>
              <TableCell>{visit.department}</TableCell>
              <TableCell>{visit.doctor}</TableCell>
              <TableCell>{visit.diagnosis}</TableCell>
              <TableCell>
                {visit.followUp ? visit.followUp : "No follow-up scheduled"}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Print-only header */}
      <div className="hidden print:block print:mb-6">
        <div className="text-center mb-4">
          <h1 className="text-2xl font-bold">Hospital Management System</h1>
          <p className="text-lg">Patient Visit History Report</p>
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

export default PatientVisitHistoryReport;
