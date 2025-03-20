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
import { Printer, FileText, Download } from "lucide-react";

interface PatientDocumentReportProps {
  data: Array<{
    id: string;
    patientId: string;
    patientName: string;
    date: string;
    documentType: string;
    fileName: string;
    uploadedBy: string;
    fileSize: string;
    status: string;
  }>;
  dateRange: { from: Date | null; to: Date | null };
  department: string;
  doctor: string;
  onPrint: () => void;
}

const PatientDocumentReport: React.FC<PatientDocumentReportProps> = ({
  data,
  dateRange,
  department,
  doctor,
  onPrint,
}) => {
  // Calculate summary statistics
  const documentTypes = data.reduce(
    (acc, doc) => {
      acc[doc.documentType] = (acc[doc.documentType] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  const handleDownload = (fileName: string) => {
    // In a real application, this would trigger a file download
    console.log(`Downloading ${fileName}`);
    // You would typically call an API endpoint here to get the file
  };

  return (
    <div id="report-content" className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium">Patient Documents</h3>
          <p className="text-sm text-muted-foreground print:text-black">
            Total Documents: {data.length}
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
            <TableHead>Document ID</TableHead>
            <TableHead>Patient</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Document Type</TableHead>
            <TableHead>File Name</TableHead>
            <TableHead>Uploaded By</TableHead>
            <TableHead>Size</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="print:hidden">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((document) => (
            <TableRow key={document.id}>
              <TableCell className="font-medium">{document.id}</TableCell>
              <TableCell>
                <div>
                  <div>{document.patientName}</div>
                  <div className="text-xs text-muted-foreground print:text-gray-600">
                    {document.patientId}
                  </div>
                </div>
              </TableCell>
              <TableCell>{document.date}</TableCell>
              <TableCell>
                <div className="flex items-center">
                  <FileText className="mr-2 h-4 w-4 text-muted-foreground" />
                  {document.documentType}
                </div>
              </TableCell>
              <TableCell>{document.fileName}</TableCell>
              <TableCell>{document.uploadedBy}</TableCell>
              <TableCell>{document.fileSize}</TableCell>
              <TableCell>
                <Badge
                  variant={
                    document.status === "Verified" ? "default" : "outline"
                  }
                  className={
                    document.status === "Verified"
                      ? "bg-green-100 text-green-800 hover:bg-green-100 print:bg-green-100 print:text-green-800"
                      : document.status === "Pending"
                        ? "bg-amber-100 text-amber-800 hover:bg-amber-100 print:bg-amber-100 print:text-amber-800"
                        : "bg-blue-100 text-blue-800 hover:bg-blue-100 print:bg-blue-100 print:text-blue-800"
                  }
                >
                  {document.status}
                </Badge>
              </TableCell>
              <TableCell className="print:hidden">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDownload(document.fileName)}
                >
                  <Download className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Summary section */}
      <div className="border rounded-md p-4 bg-muted/20 print:bg-gray-50">
        <h4 className="font-medium mb-2">Documents Summary</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.entries(documentTypes).map(([type, count]) => (
            <div key={type}>
              <p className="text-sm text-muted-foreground print:text-gray-600">
                {type}
              </p>
              <p className="text-lg font-bold text-blue-600">{count}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Print-only header */}
      <div className="hidden print:block print:mb-6">
        <div className="text-center mb-4">
          <h1 className="text-2xl font-bold">Hospital Management System</h1>
          <p className="text-lg">Patient Documents Report</p>
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

export default PatientDocumentReport;
