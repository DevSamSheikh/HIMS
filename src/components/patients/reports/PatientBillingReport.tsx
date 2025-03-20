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

interface PatientBillingReportProps {
  data: Array<{
    id: string;
    patientId: string;
    patientName: string;
    date: string;
    department: string;
    service: string;
    amount: number;
    status: string;
  }>;
  dateRange: { from: Date | null; to: Date | null };
  department: string;
  onPrint: () => void;
}

const PatientBillingReport: React.FC<PatientBillingReportProps> = ({
  data,
  dateRange,
  department,
  onPrint,
}) => {
  // Calculate summary statistics
  const totalAmount = data.reduce((sum, bill) => sum + bill.amount, 0);
  const paidAmount = data
    .filter((bill) => bill.status === "Paid")
    .reduce((sum, bill) => sum + bill.amount, 0);
  const pendingAmount = data
    .filter((bill) => bill.status === "Pending")
    .reduce((sum, bill) => sum + bill.amount, 0);

  return (
    <div id="report-content" className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium">Patient Billing Report</h3>
          <p className="text-sm text-muted-foreground print:text-black">
            Total Transactions: {data.length}
            {dateRange.from && dateRange.to && (
              <span className="ml-2">
                ({dateRange.from.toLocaleDateString()} to{" "}
                {dateRange.to.toLocaleDateString()})
              </span>
            )}
            {department !== "all" && (
              <span className="ml-2">• Department: {department}</span>
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
            <TableHead>Bill ID</TableHead>
            <TableHead>Patient</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Department</TableHead>
            <TableHead>Service</TableHead>
            <TableHead>Amount (₹)</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((bill) => (
            <TableRow key={bill.id}>
              <TableCell className="font-medium">{bill.id}</TableCell>
              <TableCell>
                <div>
                  <div>{bill.patientName}</div>
                  <div className="text-xs text-muted-foreground print:text-gray-600">
                    {bill.patientId}
                  </div>
                </div>
              </TableCell>
              <TableCell>{bill.date}</TableCell>
              <TableCell>{bill.department}</TableCell>
              <TableCell>{bill.service}</TableCell>
              <TableCell>{bill.amount.toLocaleString()}</TableCell>
              <TableCell>
                <Badge
                  variant={bill.status === "Paid" ? "default" : "outline"}
                  className={
                    bill.status === "Paid"
                      ? "bg-green-100 text-green-800 hover:bg-green-100 print:bg-green-100 print:text-green-800"
                      : ""
                  }
                >
                  {bill.status}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Summary section */}
      <div className="border rounded-md p-4 bg-muted/20 print:bg-gray-50">
        <h4 className="font-medium mb-2">Billing Summary</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-muted-foreground print:text-gray-600">
              Total Amount
            </p>
            <p className="text-lg font-bold">₹{totalAmount.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground print:text-gray-600">
              Paid Amount
            </p>
            <p className="text-lg font-bold text-green-600">
              ₹{paidAmount.toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground print:text-gray-600">
              Pending Amount
            </p>
            <p className="text-lg font-bold text-amber-600">
              ₹{pendingAmount.toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {/* Print-only header */}
      <div className="hidden print:block print:mb-6">
        <div className="text-center mb-4">
          <h1 className="text-2xl font-bold">Hospital Management System</h1>
          <p className="text-lg">Patient Billing Report</p>
          <p>
            {dateRange.from && dateRange.to
              ? `${dateRange.from.toLocaleDateString()} to ${dateRange.to.toLocaleDateString()}`
              : "All time"}
            {department !== "all" && ` • Department: ${department}`}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PatientBillingReport;
