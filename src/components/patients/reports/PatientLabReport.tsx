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

interface PatientLabReportProps {
  data: Array<{
    id: string;
    patientId: string;
    patientName: string;
    date: string;
    testName: string;
    doctor: string;
    result: string;
    notes: string;
  }>;
  dateRange: { from: Date | null; to: Date | null };
  department: string;
  doctor: string;
  onPrint: () => void;
}

const PatientLabReport: React.FC<PatientLabReportProps> = ({
  data,
  dateRange,
  department,
  doctor,
  onPrint,
}) => {
  // Calculate summary statistics
  const normalResults = data.filter(
    (report) => report.result === "Normal",
  ).length;
  const abnormalResults = data.filter(
    (report) => report.result === "Abnormal",
  ).length;

  return (
    <div id="report-content" className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium">Patient Lab Reports</h3>
          <p className="text-sm text-muted-foreground print:text-black">
            Total Lab Reports: {data.length}
            {dateRange.from && dateRange.to && (
              <span className="ml-2">
                ({dateRange.from.toLocaleDateString()} to{" "}
                {dateRange.to.toLocaleDateString()})
              </span>
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
            <TableHead>Report ID</TableHead>
            <TableHead>Patient</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Test Name</TableHead>
            <TableHead>Doctor</TableHead>
            <TableHead>Result</TableHead>
            <TableHead>Notes</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((report) => (
            <TableRow key={report.id}>
              <TableCell className="font-medium">{report.id}</TableCell>
              <TableCell>
                <div>
                  <div>{report.patientName}</div>
                  <div className="text-xs text-muted-foreground print:text-gray-600">
                    {report.patientId}
                  </div>
                </div>
              </TableCell>
              <TableCell>{report.date}</TableCell>
              <TableCell>{report.testName}</TableCell>
              <TableCell>{report.doctor}</TableCell>
              <TableCell>
                <Badge
                  variant={report.result === "Normal" ? "default" : "outline"}
                  className={
                    report.result === "Normal"
                      ? "bg-green-100 text-green-800 hover:bg-green-100 print:bg-green-100 print:text-green-800"
                      : "bg-amber-100 text-amber-800 hover:bg-amber-100 print:bg-amber-100 print:text-amber-800"
                  }
                >
                  {report.result}
                </Badge>
              </TableCell>
              <TableCell>{report.notes}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Summary section */}
      <div className="border rounded-md p-4 bg-muted/20 print:bg-gray-50">
        <h4 className="font-medium mb-2">Lab Reports Summary</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground print:text-gray-600">
              Normal Results
            </p>
            <p className="text-lg font-bold text-green-600">{normalResults}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground print:text-gray-600">
              Abnormal Results
            </p>
            <p className="text-lg font-bold text-amber-600">
              {abnormalResults}
            </p>
          </div>
        </div>
      </div>

      {/* Print-only header */}
      <div className="hidden print:block print:mb-6">
        <div className="text-center mb-4">
          <h1 className="text-2xl font-bold">Hospital Management System</h1>
          <p className="text-lg">Patient Lab Reports</p>
          <p>
            {dateRange.from && dateRange.to
              ? `${dateRange.from.toLocaleDateString()} to ${dateRange.to.toLocaleDateString()}`
              : "All time"}
            {doctor !== "all" && ` • Doctor: ${doctor}`}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PatientLabReport;
