import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
  FileText,
  Printer,
  Download,
  CheckCircle,
  Search,
  PlusCircle,
  Share,
  X,
  Percent,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface Bill {
  id: string;
  billNumber: string;
  patientId: string;
  patientName: string;
  mrNumber: string;
  admissionDate: string;
  dischargeDate: string;
  wardName: string;
  roomNumber: string;
  bedNumber: string;
  doctorName: string;
  totalAmount: number;
  paidAmount: number;
  discount: number;
  status: "pending" | "partial" | "paid";
  generatedDate: string;
}

interface BillItem {
  id: string;
  billId: string;
  category: string;
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

interface AdmittedPatient {
  id: string;
  patientName: string;
  mrNumber: string;
  admissionDate: string;
  wardName: string;
  roomNumber: string;
  bedNumber: string;
  doctorName: string;
  avatar?: string;
}

interface Service {
  id: string;
  category: string;
  name: string;
  rate: number;
  description?: string;
}

const IPDBilling = () => {
  const { toast } = useToast();
  const [bills, setBills] = useState<Bill[]>([
    {
      id: "bill-001",
      billNumber: "IPD-B-10001",
      patientId: "P-1001",
      patientName: "John Smith",
      mrNumber: "MR-10001",
      admissionDate: "2023-06-15",
      dischargeDate: "2023-06-22",
      wardName: "General Ward",
      roomNumber: "101",
      bedNumber: "A",
      doctorName: "Dr. Robert Wilson",
      totalAmount: 15750,
      paidAmount: 15750,
      discount: 500,
      status: "paid",
      generatedDate: "2023-06-22",
    },
    {
      id: "bill-002",
      billNumber: "IPD-B-10002",
      patientId: "P-1002",
      patientName: "Emily Johnson",
      mrNumber: "MR-10002",
      admissionDate: "2023-06-12",
      dischargeDate: "2023-06-19",
      wardName: "Surgical Ward",
      roomNumber: "201",
      bedNumber: "B",
      doctorName: "Dr. Sarah Parker",
      totalAmount: 28500,
      paidAmount: 15000,
      discount: 0,
      status: "partial",
      generatedDate: "2023-06-19",
    },
    {
      id: "bill-003",
      billNumber: "IPD-B-10003",
      patientId: "P-1003",
      patientName: "Michael Brown",
      mrNumber: "MR-10003",
      admissionDate: "2023-06-10",
      dischargeDate: "2023-06-18",
      wardName: "ICU",
      roomNumber: "301",
      bedNumber: "A",
      doctorName: "Dr. James Thompson",
      totalAmount: 45000,
      paidAmount: 0,
      discount: 2000,
      status: "pending",
      generatedDate: "2023-06-18",
    },
  ]);

  const [billItems, setBillItems] = useState<BillItem[]>([
    // Bill 1 Items
    {
      id: "item-001",
      billId: "bill-001",
      category: "Room Charges",
      description: "General Ward (7 days)",
      quantity: 7,
      rate: 1000,
      amount: 7000,
    },
    {
      id: "item-002",
      billId: "bill-001",
      category: "Doctor Visits",
      description: "Daily Doctor Visit (7 days)",
      quantity: 7,
      rate: 500,
      amount: 3500,
    },
    {
      id: "item-003",
      billId: "bill-001",
      category: "Nursing Care",
      description: "24-hour Nursing Care (7 days)",
      quantity: 7,
      rate: 600,
      amount: 4200,
    },
    {
      id: "item-004",
      billId: "bill-001",
      category: "Medications",
      description: "Medications as prescribed",
      quantity: 1,
      rate: 1050,
      amount: 1050,
    },
    // Bill 2 Items
    {
      id: "item-005",
      billId: "bill-002",
      category: "Room Charges",
      description: "Surgical Ward (7 days)",
      quantity: 7,
      rate: 2000,
      amount: 14000,
    },
    {
      id: "item-006",
      billId: "bill-002",
      category: "Surgery",
      description: "Appendectomy Procedure",
      quantity: 1,
      rate: 8000,
      amount: 8000,
    },
    {
      id: "item-007",
      billId: "bill-002",
      category: "Doctor Visits",
      description: "Daily Doctor Visit (7 days)",
      quantity: 7,
      rate: 500,
      amount: 3500,
    },
    {
      id: "item-008",
      billId: "bill-002",
      category: "Medications",
      description: "Post-surgery medications",
      quantity: 1,
      rate: 3000,
      amount: 3000,
    },
    // Bill 3 Items
    {
      id: "item-009",
      billId: "bill-003",
      category: "Room Charges",
      description: "ICU (8 days)",
      quantity: 8,
      rate: 4000,
      amount: 32000,
    },
    {
      id: "item-010",
      billId: "bill-003",
      category: "Doctor Visits",
      description: "ICU Specialist Visit (8 days)",
      quantity: 8,
      rate: 1000,
      amount: 8000,
    },
    {
      id: "item-011",
      billId: "bill-003",
      category: "Medications",
      description: "Critical care medications",
      quantity: 1,
      rate: 5000,
      amount: 5000,
    },
  ]);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBill, setSelectedBill] = useState<Bill | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [isNewBillDialogOpen, setIsNewBillDialogOpen] = useState(false);
  const [isAddServiceDialogOpen, setIsAddServiceDialogOpen] = useState(false);
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState<number>(0);
  const [patientSearchQuery, setPatientSearchQuery] = useState("");
  const [selectedPatient, setSelectedPatient] =
    useState<AdmittedPatient | null>(null);
  const [newBillServices, setNewBillServices] = useState<BillItem[]>([]);
  const [newBillDiscount, setNewBillDiscount] = useState<number>(0);
  const [newBillId, setNewBillId] = useState<string>("");

  // Function to generate default services based on patient's ward and admission duration
  const generateDefaultServices = (patient: AdmittedPatient) => {
    const admissionDate = new Date(patient.admissionDate);
    const currentDate = new Date();
    const daysAdmitted = Math.max(
      1,
      Math.ceil(
        (currentDate.getTime() - admissionDate.getTime()) /
          (1000 * 60 * 60 * 24),
      ),
    );

    let defaultServices: BillItem[] = [];

    // Add room charges based on ward
    let roomRate = 1000; // Default rate
    let roomName = "General Ward";

    if (patient.wardName.toLowerCase().includes("icu")) {
      roomRate = 5000;
      roomName = "ICU";
    } else if (patient.wardName.toLowerCase().includes("surgical")) {
      roomRate = 2000;
      roomName = "Surgical Ward";
    } else if (patient.wardName.toLowerCase().includes("private")) {
      roomRate = 3500;
      roomName = "Private Room";
    } else if (patient.wardName.toLowerCase().includes("pediatric")) {
      roomRate = 1500;
      roomName = "Pediatric Ward";
    }

    // Add room charges
    defaultServices.push({
      id: `item-${Math.floor(Math.random() * 10000)}`,
      billId: "",
      category: "Room Charges",
      description: `${roomName} (${daysAdmitted} days)`,
      quantity: daysAdmitted,
      rate: roomRate,
      amount: roomRate * daysAdmitted,
    });

    // Add doctor visits
    const doctorVisitRate = patient.wardName.toLowerCase().includes("icu")
      ? 1000
      : 500;
    defaultServices.push({
      id: `item-${Math.floor(Math.random() * 10000)}`,
      billId: "",
      category: "Doctor Visits",
      description: `${patient.wardName.toLowerCase().includes("icu") ? "ICU Specialist Visit" : "Daily Doctor Visit"} (${daysAdmitted} days)`,
      quantity: daysAdmitted,
      rate: doctorVisitRate,
      amount: doctorVisitRate * daysAdmitted,
    });

    // Add nursing care
    const nursingRate = patient.wardName.toLowerCase().includes("icu")
      ? 1200
      : 600;
    defaultServices.push({
      id: `item-${Math.floor(Math.random() * 10000)}`,
      billId: "",
      category: "Nursing Care",
      description: `${patient.wardName.toLowerCase().includes("icu") ? "Special Nursing Care" : "Regular Nursing Care"} (${daysAdmitted} days)`,
      quantity: daysAdmitted,
      rate: nursingRate,
      amount: nursingRate * daysAdmitted,
    });

    // Add medication package
    const medicationRate = patient.wardName.toLowerCase().includes("icu")
      ? 5000
      : patient.wardName.toLowerCase().includes("surgical")
        ? 3000
        : 1000;
    const medicationDesc = patient.wardName.toLowerCase().includes("icu")
      ? "Critical care medications"
      : patient.wardName.toLowerCase().includes("surgical")
        ? "Post-surgery medications"
        : "Basic Medication Package";

    defaultServices.push({
      id: `item-${Math.floor(Math.random() * 10000)}`,
      billId: "",
      category: "Medications",
      description: medicationDesc,
      quantity: 1,
      rate: medicationRate,
      amount: medicationRate,
    });

    return defaultServices;
  };

  // Mock admitted patients data
  const [admittedPatients, setAdmittedPatients] = useState<AdmittedPatient[]>([
    {
      id: "patient-001",
      patientName: "John Smith",
      mrNumber: "MR-10001",
      admissionDate: "2023-06-15",
      wardName: "General Ward",
      roomNumber: "101",
      bedNumber: "A",
      doctorName: "Dr. Robert Wilson",
      avatar: "JS",
    },
    {
      id: "patient-002",
      patientName: "Emily Johnson",
      mrNumber: "MR-10002",
      admissionDate: "2023-06-12",
      wardName: "Surgical Ward",
      roomNumber: "201",
      bedNumber: "B",
      doctorName: "Dr. Sarah Parker",
      avatar: "EJ",
    },
    {
      id: "patient-003",
      patientName: "Michael Brown",
      mrNumber: "MR-10003",
      admissionDate: "2023-06-10",
      wardName: "ICU",
      roomNumber: "301",
      bedNumber: "A",
      doctorName: "Dr. James Thompson",
      avatar: "MB",
    },
    {
      id: "patient-004",
      patientName: "Sarah Wilson",
      mrNumber: "MR-10004",
      admissionDate: "2023-06-18",
      wardName: "General Ward",
      roomNumber: "102",
      bedNumber: "C",
      doctorName: "Dr. Robert Wilson",
      avatar: "SW",
    },
    {
      id: "patient-005",
      patientName: "David Miller",
      mrNumber: "MR-10005",
      admissionDate: "2023-06-17",
      wardName: "Pediatric Ward",
      roomNumber: "401",
      bedNumber: "A",
      doctorName: "Dr. Lisa Chen",
      avatar: "DM",
    },
  ]);

  // Mock services data
  const [availableServices, setAvailableServices] = useState<Service[]>([
    {
      id: "service-001",
      category: "Room Charges",
      name: "General Ward",
      rate: 1000,
      description: "Per day charges for general ward",
    },
    {
      id: "service-002",
      category: "Room Charges",
      name: "Semi-Private Room",
      rate: 2000,
      description: "Per day charges for semi-private room",
    },
    {
      id: "service-003",
      category: "Room Charges",
      name: "Private Room",
      rate: 3500,
      description: "Per day charges for private room",
    },
    {
      id: "service-004",
      category: "Room Charges",
      name: "ICU",
      rate: 5000,
      description: "Per day charges for ICU",
    },
    {
      id: "service-005",
      category: "Doctor Visits",
      name: "General Physician Visit",
      rate: 500,
      description: "Per visit charges for general physician",
    },
    {
      id: "service-006",
      category: "Doctor Visits",
      name: "Specialist Visit",
      rate: 1000,
      description: "Per visit charges for specialist",
    },
    {
      id: "service-007",
      category: "Nursing Care",
      name: "Regular Nursing Care",
      rate: 600,
      description: "Per day charges for regular nursing care",
    },
    {
      id: "service-008",
      category: "Nursing Care",
      name: "Special Nursing Care",
      rate: 1200,
      description: "Per day charges for special nursing care",
    },
    {
      id: "service-009",
      category: "Medications",
      name: "Basic Medication Package",
      rate: 1000,
      description: "Basic medication package",
    },
    {
      id: "service-010",
      category: "Medications",
      name: "Advanced Medication Package",
      rate: 3000,
      description: "Advanced medication package",
    },
    {
      id: "service-011",
      category: "Procedures",
      name: "Blood Test - CBC",
      rate: 500,
      description: "Complete blood count test",
    },
    {
      id: "service-012",
      category: "Procedures",
      name: "X-Ray",
      rate: 1200,
      description: "X-Ray procedure",
    },
    {
      id: "service-013",
      category: "Procedures",
      name: "CT Scan",
      rate: 5000,
      description: "CT Scan procedure",
    },
    {
      id: "service-014",
      category: "Procedures",
      name: "MRI",
      rate: 8000,
      description: "MRI procedure",
    },
  ]);

  // Filtered services by category
  const serviceCategories = [
    ...new Set(availableServices.map((service) => service.category)),
  ];

  // Selected service for adding to bill
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [serviceQuantity, setServiceQuantity] = useState<number>(1);

  const filteredBills = bills.filter(
    (bill) =>
      bill.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bill.mrNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bill.billNumber.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // Calculate pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentBills = filteredBills.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredBills.length / itemsPerPage);

  const handleViewDetails = (bill: Bill) => {
    setSelectedBill(bill);
    setIsDetailsDialogOpen(true);
  };

  const handleMakePayment = (bill: Bill) => {
    setSelectedBill(bill);
    setPaymentAmount(bill.totalAmount - bill.paidAmount);
    setIsPaymentDialogOpen(true);
  };

  const handlePaymentSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Payment processing logic would go here
    setIsPaymentDialogOpen(false);
  };

  const getFilteredBillItems = (billId: string) => {
    return billItems.filter((item) => item.billId === billId);
  };

  const getStatusBadgeClass = (status: Bill["status"]) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800";
      case "partial":
        return "bg-amber-100 text-amber-800";
      case "pending":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: Bill["status"]) => {
    switch (status) {
      case "paid":
        return "Paid";
      case "partial":
        return "Partially Paid";
      case "pending":
        return "Pending";
      default:
        return status;
    }
  };

  // Function to handle printing bill
  const handlePrintBill = (bill: Bill) => {
    const content = document.getElementById("bill-report-content");
    if (content) {
      const printWindow = window.open("", "_blank");
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>IPD Bill - ${bill.billNumber}</title>
              <style>
                body { font-family: Arial, sans-serif; padding: 20px; }
                .header { display: flex; justify-content: space-between; margin-bottom: 20px; }
                .patient-info { margin-bottom: 20px; padding: 10px; border: 1px solid #eee; }
                table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
                th, td { padding: 8px; text-align: left; border-bottom: 1px solid #ddd; }
                th { background-color: #f8f8f8; }
                .amount { text-align: right; }
                .total-row { font-weight: bold; }
              </style>
            </head>
            <body>
              <div class="header">
                <div>
                  <h2>Bill #${bill.billNumber}</h2>
                  <p>Generated on ${new Date(bill.generatedDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <h1>HIMS Hospital</h1>
                  <p>123 Healthcare Avenue, Medical City</p>
                </div>
              </div>
              <div class="patient-info">
                <div style="display: flex; justify-content: space-between;">
                  <div>
                    <h3>Patient Information</h3>
                    <p>${bill.patientName}</p>
                    <p>MR Number: ${bill.mrNumber}</p>
                    <p>Doctor: ${bill.doctorName}</p>
                  </div>
                  <div>
                    <h3>Admission Details</h3>
                    <p>Ward: ${bill.wardName}</p>
                    <p>Room/Bed: ${bill.roomNumber}-${bill.bedNumber}</p>
                    <p>${new Date(bill.admissionDate).toLocaleDateString()} to ${new Date(bill.dischargeDate).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
              <table>
                <thead>
                  <tr>
                    <th>Category</th>
                    <th>Description</th>
                    <th class="amount">Quantity</th>
                    <th class="amount">Rate (₹)</th>
                    <th class="amount">Amount (₹)</th>
                  </tr>
                </thead>
                <tbody>
                  ${getFilteredBillItems(bill.id)
                    .map(
                      (item) => `
                    <tr>
                      <td>${item.category}</td>
                      <td>${item.description}</td>
                      <td class="amount">${item.quantity}</td>
                      <td class="amount">${item.rate.toLocaleString()}</td>
                      <td class="amount">${item.amount.toLocaleString()}</td>
                    </tr>
                  `,
                    )
                    .join("")}
                </tbody>
              </table>
              <div style="margin-left: auto; width: 300px;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                  <span>Subtotal:</span>
                  <span>₹${bill.totalAmount.toLocaleString()}</span>
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                  <span>Discount:</span>
                  <span>₹${bill.discount.toLocaleString()}</span>
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 5px; font-weight: bold;">
                  <span>Total Amount:</span>
                  <span>₹${(bill.totalAmount - bill.discount).toLocaleString()}</span>
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                  <span>Paid Amount:</span>
                  <span>₹${bill.paidAmount.toLocaleString()}</span>
                </div>
                <div style="display: flex; justify-content: space-between; font-weight: bold;">
                  <span>Balance Due:</span>
                  <span>₹${(bill.totalAmount - bill.discount - bill.paidAmount).toLocaleString()}</span>
                </div>
              </div>
              <div style="margin-top: 40px; text-align: center;">
                <p>Thank you for choosing HIMS Hospital</p>
                <p>For any queries, please contact: billing@himshospital.com</p>
              </div>
            </body>
          </html>
        `);
        printWindow.document.close();
        printWindow.focus();
        setTimeout(() => {
          printWindow.print();
        }, 500);
      } else {
        toast({
          title: "Error",
          description:
            "Could not open print window. Please check your popup settings.",
        });
      }
    }
  };

  // Function to handle downloading bill as PDF
  const handleDownloadPDF = (bill: Bill) => {
    const generatePDF = async () => {
      try {
        toast({
          title: "Generating PDF",
          description: "Please wait while we generate your PDF...",
        });

        // Dynamically import the required libraries
        const jsPDFModule = await import("jspdf");
        const html2canvasModule = await import("html2canvas");
        const jsPDF = jsPDFModule.default;
        const html2canvas = html2canvasModule.default;

        const content = document.getElementById("bill-report-content");
        if (!content) return;

        // Create a clone of the content to style it for PDF
        const clone = content.cloneNode(true) as HTMLElement;
        clone.style.padding = "20px";
        clone.style.backgroundColor = "white";
        clone.style.position = "absolute";
        clone.style.left = "-9999px";
        clone.style.top = "0";
        clone.style.width = "800px";
        document.body.appendChild(clone);

        // Add hospital header to the clone
        const header = document.createElement("div");
        header.innerHTML = `
          <div style="text-align: center; margin-bottom: 20px;">
            <h1 style="margin: 0; color: #2563eb;">HIMS Hospital</h1>
            <p style="margin: 5px 0;">123 Healthcare Avenue, Medical City</p>
            <h2 style="margin: 10px 0;">IPD Billing Report</h2>
          </div>
        `;
        clone.insertBefore(header, clone.firstChild);

        // Generate PDF from the clone
        const canvas = await html2canvas(clone, { scale: 2 });
        document.body.removeChild(clone);

        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF("p", "mm", "a4");
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        const imgWidth = canvas.width;
        const imgHeight = canvas.height;
        const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
        const imgX = (pdfWidth - imgWidth * ratio) / 2;
        const imgY = 10;

        pdf.addImage(
          imgData,
          "PNG",
          imgX,
          imgY,
          imgWidth * ratio,
          imgHeight * ratio,
        );
        pdf.save(`IPD_Bill_${bill.billNumber}.pdf`);

        toast({
          title: "Success",
          description: "PDF downloaded successfully",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to generate PDF. Please try again.",
        });
        console.error("PDF generation error:", error);
      }
    };

    generatePDF();
  };

  // Function to handle sharing bill
  const handleShareBill = (bill: Bill) => {
    // Create a shareable link (in a real app, this would generate a unique URL)
    const shareableLink = `https://himshospital.com/bills/${bill.id}`;

    // Check if Web Share API is available
    if (navigator.share) {
      navigator
        .share({
          title: `IPD Bill - ${bill.billNumber}`,
          text: `Bill for ${bill.patientName} (${bill.mrNumber})`,
          url: shareableLink,
        })
        .then(() => {
          toast({
            title: "Success",
            description: "Bill shared successfully",
          });
        })
        .catch(() => {
          // Fallback to clipboard if share is cancelled
          copyToClipboard();
        });
    } else {
      // Fallback for browsers that don't support Web Share API
      copyToClipboard();
    }

    function copyToClipboard() {
      navigator.clipboard
        .writeText(shareableLink)
        .then(() => {
          toast({
            title: "Link Copied",
            description: "Shareable link copied to clipboard",
          });
        })
        .catch(() => {
          toast({
            title: "Error",
            description: "Failed to copy link. Please try again.",
          });
        });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">IPD Billing</h2>
        <Button onClick={() => setIsNewBillDialogOpen(true)}>
          <FileText className="mr-2 h-4 w-4" />
          Generate New Bill
        </Button>
      </div>

      <div className="flex items-center space-x-2 justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by bill number, patient name, or MR number..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1); // Reset to first page on new search
            }}
            className="pl-8"
          />
        </div>
        <div className="flex items-center space-x-2">
          <select
            className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            value={itemsPerPage}
            onChange={(e) => {
              setItemsPerPage(Number(e.target.value));
              setCurrentPage(1); // Reset to first page when changing items per page
            }}
          >
            <option value="5">5 per page</option>
            <option value="10">10 per page</option>
            <option value="20">20 per page</option>
          </select>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Bill Number</TableHead>
              <TableHead>Patient Name</TableHead>
              <TableHead>MR Number</TableHead>
              <TableHead>Discharge Date</TableHead>
              <TableHead>Total Amount</TableHead>
              <TableHead>Paid Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentBills.length > 0 ? (
              currentBills.map((bill) => (
                <TableRow key={bill.id}>
                  <TableCell className="font-medium">
                    {bill.billNumber}
                  </TableCell>
                  <TableCell>{bill.patientName}</TableCell>
                  <TableCell>{bill.mrNumber}</TableCell>
                  <TableCell>
                    {new Date(bill.dischargeDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell>₹{bill.totalAmount.toLocaleString()}</TableCell>
                  <TableCell>₹{bill.paidAmount.toLocaleString()}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(
                        bill.status,
                      )}`}
                    >
                      {getStatusText(bill.status)}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleViewDetails(bill)}
                    >
                      View Details
                    </Button>
                    {bill.status !== "paid" && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleMakePayment(bill)}
                      >
                        Make Payment
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-4">
                  No bills found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Controls */}
      {filteredBills.length > 0 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {indexOfFirstItem + 1} to{" "}
            {Math.min(indexOfLastItem, filteredBills.length)} of{" "}
            {filteredBills.length} bills
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Previous</span>
            </Button>
            <div className="flex items-center space-x-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    className="w-8 h-8 p-0"
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </Button>
                ),
              )}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
              <span className="sr-only">Next</span>
            </Button>
          </div>
        </div>
      )}

      {/* Bill Details Dialog */}
      <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
        <DialogContent className="sm:max-w-[900px]">
          <DialogHeader>
            <DialogTitle>Bill Details</DialogTitle>
          </DialogHeader>

          {selectedBill && (
            <div className="space-y-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold">
                    Bill #{selectedBill.billNumber}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Generated on{" "}
                    {new Date(selectedBill.generatedDate).toLocaleDateString()}
                  </p>
                </div>
                <div className="space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePrintBill(selectedBill)}
                  >
                    <Printer className="mr-2 h-4 w-4" />
                    Print
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDownloadPDF(selectedBill)}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download PDF
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleShareBill(selectedBill)}
                  >
                    <Share className="mr-2 h-4 w-4" />
                    Share
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-1">
                  <p className="text-sm font-medium">Patient Information</p>
                  <p className="text-sm">{selectedBill.patientName}</p>
                  <p className="text-sm text-muted-foreground">
                    MR Number: {selectedBill.mrNumber}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Doctor: {selectedBill.doctorName}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">Admission Details</p>
                  <p className="text-sm">Ward: {selectedBill.wardName}</p>
                  <p className="text-sm">
                    Room/Bed: {selectedBill.roomNumber}-{selectedBill.bedNumber}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(selectedBill.admissionDate).toLocaleDateString()}{" "}
                    to{" "}
                    {new Date(selectedBill.dischargeDate).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Category</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead className="text-right">Quantity</TableHead>
                      <TableHead className="text-right">Rate (₹)</TableHead>
                      <TableHead className="text-right">Amount (₹)</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {getFilteredBillItems(selectedBill.id).map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">
                          {item.category}
                        </TableCell>
                        <TableCell>{item.description}</TableCell>
                        <TableCell className="text-right">
                          {item.quantity}
                        </TableCell>
                        <TableCell className="text-right">
                          {item.rate.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-right">
                          {item.amount.toLocaleString()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Subtotal:</span>
                  <span>₹{selectedBill.totalAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Tax (0%):</span>
                  <span>₹0.00</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>
                    Discount (
                    {(
                      (selectedBill.discount / selectedBill.totalAmount) *
                      100
                    ).toFixed(2)}
                    %):
                  </span>
                  <span>₹{selectedBill.discount.toLocaleString()}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-medium">
                  <span>Total Amount:</span>
                  <span>
                    ₹
                    {(
                      selectedBill.totalAmount - selectedBill.discount
                    ).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Paid Amount:</span>
                  <span>₹{selectedBill.paidAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between font-medium">
                  <span>Balance Due:</span>
                  <span>
                    ₹
                    {(
                      selectedBill.totalAmount -
                      selectedBill.discount -
                      selectedBill.paidAmount
                    ).toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="flex justify-between items-center pt-4 border-t">
                <div>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(
                      selectedBill.status,
                    )}`}
                  >
                    {getStatusText(selectedBill.status)}
                  </span>
                </div>
                {selectedBill.status !== "paid" && (
                  <Button
                    onClick={() => {
                      setIsDetailsDialogOpen(false);
                      handleMakePayment(selectedBill);
                    }}
                  >
                    Make Payment
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Payment Dialog */}
      <Dialog open={isPaymentDialogOpen} onOpenChange={setIsPaymentDialogOpen}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>Make Payment</DialogTitle>
          </DialogHeader>
          {selectedBill && (
            <form onSubmit={handlePaymentSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Bill Number</Label>
                <div className="p-2 bg-muted rounded-md">
                  {selectedBill.billNumber}
                </div>
              </div>
              <div className="space-y-2">
                <Label>Patient</Label>
                <div className="p-2 bg-muted rounded-md">
                  {selectedBill.patientName} ({selectedBill.mrNumber})
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Total Amount</Label>
                  <div className="p-2 bg-muted rounded-md">
                    ₹{selectedBill.totalAmount.toLocaleString()}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Paid Amount</Label>
                  <div className="p-2 bg-muted rounded-md">
                    ₹{selectedBill.paidAmount.toLocaleString()}
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Balance Due</Label>
                <div className="p-2 bg-muted rounded-md font-medium">
                  ₹
                  {(
                    selectedBill.totalAmount - selectedBill.paidAmount
                  ).toLocaleString()}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="paymentAmount">Payment Amount (₹)</Label>
                <Input
                  id="paymentAmount"
                  type="number"
                  min="1"
                  max={selectedBill.totalAmount - selectedBill.paidAmount}
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(Number(e.target.value))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="paymentMethod">Payment Method</Label>
                <select
                  id="paymentMethod"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  required
                >
                  <option value="">Select Payment Method</option>
                  <option value="cash">Cash</option>
                  <option value="card">Credit/Debit Card</option>
                  <option value="upi">UPI</option>
                  <option value="bank">Bank Transfer</option>
                  <option value="insurance">Insurance</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="paymentReference">
                  Reference/Transaction ID
                </Label>
                <Input
                  id="paymentReference"
                  placeholder="Enter reference or transaction ID"
                />
              </div>
              <DialogFooter>
                <Button type="submit">
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Process Payment
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Generate New Bill Dialog */}
      <Dialog open={isNewBillDialogOpen} onOpenChange={setIsNewBillDialogOpen}>
        <DialogContent className="sm:max-w-[650px] md:max-w-[750px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Generate New Bill</DialogTitle>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              // Generate a new bill ID
              const newId = `bill-${Math.floor(Math.random() * 10000)
                .toString()
                .padStart(3, "0")}`;
              const newBillNumber = `IPD-B-${Math.floor(10000 + Math.random() * 90000)}`;
              setNewBillId(newId);

              // Calculate total amount
              const totalAmount = newBillServices.reduce(
                (sum, item) => sum + item.amount,
                0,
              );

              // Calculate discount amount based on percentage
              const discountAmount = (totalAmount * newBillDiscount) / 100;

              // Create new bill
              const newBill: Bill = {
                id: newId,
                billNumber: newBillNumber,
                patientId: selectedPatient?.id || "",
                patientName: selectedPatient?.patientName || "",
                mrNumber: selectedPatient?.mrNumber || "",
                admissionDate:
                  selectedPatient?.admissionDate ||
                  new Date().toISOString().split("T")[0],
                dischargeDate: new Date().toISOString().split("T")[0],
                wardName: selectedPatient?.wardName || "",
                roomNumber: selectedPatient?.roomNumber || "",
                bedNumber: selectedPatient?.bedNumber || "",
                doctorName: selectedPatient?.doctorName || "",
                totalAmount: totalAmount,
                paidAmount: 0,
                discount: discountAmount,
                status: "pending",
                generatedDate: new Date().toISOString().split("T")[0],
              };

              // Add new bill to bills array
              setBills([...bills, newBill]);

              // Add bill items
              setBillItems([
                ...billItems,
                ...newBillServices.map((service) => ({
                  ...service,
                  billId: newId,
                })),
              ]);

              // Show report dialog
              setSelectedBill(newBill);
              setIsReportDialogOpen(true);
              setIsNewBillDialogOpen(false);

              toast({
                title: "Success",
                description: "New bill generated successfully",
              });
            }}
            className="space-y-4"
          >
            <div className="space-y-2">
              <Label htmlFor="patientSearch">Search Patient</Label>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="patientSearch"
                  placeholder="Search by patient name, MR number..."
                  className="pl-8"
                  value={patientSearchQuery}
                  onChange={(e) => setPatientSearchQuery(e.target.value)}
                />
              </div>

              {/* Patient search results */}
              {patientSearchQuery.length > 0 && (
                <div className="absolute z-10 mt-1 w-full max-w-[calc(100%-2rem)] bg-background border rounded-md shadow-md max-h-60 overflow-y-auto">
                  {admittedPatients
                    .filter(
                      (patient) =>
                        patient.patientName
                          .toLowerCase()
                          .includes(patientSearchQuery.toLowerCase()) ||
                        patient.mrNumber
                          .toLowerCase()
                          .includes(patientSearchQuery.toLowerCase()),
                    )
                    .map((patient) => (
                      <div
                        key={patient.id}
                        className="p-2 hover:bg-muted cursor-pointer flex items-center gap-3"
                        onClick={() => {
                          setSelectedPatient(patient);
                          setPatientSearchQuery("");
                          // Generate default services when patient is selected
                          setNewBillServices(generateDefaultServices(patient));
                        }}
                      >
                        <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium">
                          {patient.avatar || patient.patientName.charAt(0)}
                        </div>
                        <div>
                          <div className="font-medium">
                            {patient.patientName}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {patient.mrNumber}
                          </div>
                        </div>
                      </div>
                    ))}
                  {admittedPatients.filter(
                    (patient) =>
                      patient.patientName
                        .toLowerCase()
                        .includes(patientSearchQuery.toLowerCase()) ||
                      patient.mrNumber
                        .toLowerCase()
                        .includes(patientSearchQuery.toLowerCase()),
                  ).length === 0 && (
                    <div className="p-2 text-muted-foreground">
                      No patients found
                    </div>
                  )}
                </div>
              )}
            </div>

            {selectedPatient ? (
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label>Patient Information</Label>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-6 px-2"
                    onClick={() => {
                      setSelectedPatient(null);
                      setNewBillServices([]);
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <div className="p-3 border rounded-md">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium">
                      {selectedPatient.avatar ||
                        selectedPatient.patientName.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">
                        {selectedPatient.patientName}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {selectedPatient.mrNumber}
                      </div>
                    </div>
                    <div className="text-right text-sm">
                      <div>Ward: {selectedPatient.wardName}</div>
                      <div>
                        Room: {selectedPatient.roomNumber}, Bed:{" "}
                        {selectedPatient.bedNumber}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-4 border border-dashed rounded-md text-center text-muted-foreground">
                Search and select a patient to generate bill
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="admissionDate">Admission Date</Label>
                <Input
                  id="admissionDate"
                  type="date"
                  value={
                    selectedPatient?.admissionDate ||
                    new Date().toISOString().split("T")[0]
                  }
                  readOnly
                  disabled
                  className="bg-muted"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dischargeDate">Discharge Date</Label>
                <Input
                  id="dischargeDate"
                  type="date"
                  defaultValue={new Date().toISOString().split("T")[0]}
                  required
                />
              </div>
            </div>

            <div className="pt-4 border-t">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-medium">Services</h3>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsAddServiceDialogOpen(true)}
                >
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Service
                </Button>
              </div>

              {newBillServices.length > 0 ? (
                <div className="space-y-3">
                  {newBillServices.map((service, index) => (
                    <div
                      key={index}
                      className="flex flex-col sm:flex-row sm:items-center justify-between p-2 bg-muted rounded-md"
                    >
                      <div>
                        <div className="font-medium">
                          {service.category}: {service.description}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {service.quantity} × ₹{service.rate.toLocaleString()}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="font-medium mt-1 sm:mt-0">
                          ₹{service.amount.toLocaleString()}
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-6 px-2 text-red-500 hover:text-red-700 hover:bg-red-50"
                          onClick={() => {
                            const updatedServices = [...newBillServices];
                            updatedServices.splice(index, 1);
                            setNewBillServices(updatedServices);
                          }}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 border border-dashed rounded-md text-center text-muted-foreground">
                  No services added yet. Click "Add Service" to add services to
                  the bill.
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="discount">Discount Percentage (%)</Label>
              <div className="relative">
                <Percent className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="discount"
                  type="number"
                  min="0"
                  max="100"
                  placeholder="Enter discount percentage"
                  className="pl-8"
                  value={newBillDiscount}
                  onChange={(e) => setNewBillDiscount(Number(e.target.value))}
                />
              </div>
            </div>

            <div className="space-y-2 pt-4 border-t">
              <div className="flex justify-between text-sm">
                <span>Subtotal:</span>
                <span>
                  ₹
                  {newBillServices
                    .reduce((sum, item) => sum + item.amount, 0)
                    .toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Discount ({newBillDiscount}%):</span>
                <span>
                  ₹
                  {(
                    (newBillServices.reduce(
                      (sum, item) => sum + item.amount,
                      0,
                    ) *
                      newBillDiscount) /
                    100
                  ).toLocaleString()}
                </span>
              </div>
              <Separator />
              <div className="flex justify-between font-medium">
                <span>Total Amount:</span>
                <span>
                  ₹
                  {(
                    newBillServices.reduce(
                      (sum, item) => sum + item.amount,
                      0,
                    ) -
                    (newBillServices.reduce(
                      (sum, item) => sum + item.amount,
                      0,
                    ) *
                      newBillDiscount) /
                      100
                  ).toLocaleString()}
                </span>
              </div>
            </div>

            <DialogFooter>
              <Button
                type="submit"
                disabled={!selectedPatient || newBillServices.length === 0}
              >
                <FileText className="mr-2 h-4 w-4" />
                Generate Bill
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Add Service Dialog */}
      <Dialog
        open={isAddServiceDialogOpen}
        onOpenChange={setIsAddServiceDialogOpen}
      >
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add Service</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="serviceCategory">Service Category</Label>
              <select
                id="serviceCategory"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                onChange={(e) => {
                  const category = e.target.value;
                  if (category) {
                    const firstServiceInCategory = availableServices.find(
                      (s) => s.category === category,
                    );
                    if (firstServiceInCategory) {
                      setSelectedService(firstServiceInCategory);
                    }
                  } else {
                    setSelectedService(null);
                  }
                }}
              >
                <option value="">Select Category</option>
                {serviceCategories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {selectedService && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="serviceName">Service</Label>
                  <select
                    id="serviceName"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={selectedService.id}
                    onChange={(e) => {
                      const serviceId = e.target.value;
                      const service = availableServices.find(
                        (s) => s.id === serviceId,
                      );
                      if (service) {
                        setSelectedService(service);
                      }
                    }}
                  >
                    {availableServices
                      .filter(
                        (service) =>
                          service.category === selectedService.category,
                      )
                      .map((service) => (
                        <option key={service.id} value={service.id}>
                          {service.name}
                        </option>
                      ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="serviceRate">Rate (₹)</Label>
                  <Input
                    id="serviceRate"
                    type="number"
                    value={selectedService.rate}
                    readOnly
                    className="bg-muted"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="serviceQuantity">Quantity</Label>
                  <Input
                    id="serviceQuantity"
                    type="number"
                    min="1"
                    value={serviceQuantity}
                    onChange={(e) => setServiceQuantity(Number(e.target.value))}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>Total Amount</Label>
                  <div className="p-2 bg-muted rounded-md font-medium">
                    ₹{(selectedService.rate * serviceQuantity).toLocaleString()}
                  </div>
                </div>
              </>
            )}

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsAddServiceDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="button"
                disabled={!selectedService}
                onClick={() => {
                  if (selectedService) {
                    const newService: BillItem = {
                      id: `item-${Math.floor(Math.random() * 10000)}`,
                      billId: "", // Will be set when bill is generated
                      category: selectedService.category,
                      description: selectedService.name,
                      quantity: serviceQuantity,
                      rate: selectedService.rate,
                      amount: selectedService.rate * serviceQuantity,
                    };

                    setNewBillServices([...newBillServices, newService]);
                    setIsAddServiceDialogOpen(false);
                    setSelectedService(null);
                    setServiceQuantity(1);
                  }
                }}
              >
                Add to Bill
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>

      {/* Bill Report Dialog */}
      <Dialog open={isReportDialogOpen} onOpenChange={setIsReportDialogOpen}>
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>IPD Billing Report</DialogTitle>
          </DialogHeader>

          {selectedBill && (
            <div className="space-y-6" id="bill-report-content">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold">
                    Bill #{selectedBill.billNumber}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Generated on{" "}
                    {new Date(selectedBill.generatedDate).toLocaleDateString()}
                  </p>
                </div>
                <div className="space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePrintBill(selectedBill)}
                  >
                    <Printer className="mr-2 h-4 w-4" />
                    Print
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDownloadPDF(selectedBill)}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download PDF
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleShareBill(selectedBill)}
                  >
                    <Share className="mr-2 h-4 w-4" />
                    Share
                  </Button>
                </div>
              </div>

              <div className="p-4 border rounded-md bg-muted/30">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Patient Information</p>
                    <p className="text-sm">{selectedBill.patientName}</p>
                    <p className="text-sm text-muted-foreground">
                      MR Number: {selectedBill.mrNumber}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Doctor: {selectedBill.doctorName}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Admission Details</p>
                    <p className="text-sm">Ward: {selectedBill.wardName}</p>
                    <p className="text-sm">
                      Room/Bed: {selectedBill.roomNumber}-
                      {selectedBill.bedNumber}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(
                        selectedBill.admissionDate,
                      ).toLocaleDateString()}{" "}
                      to{" "}
                      {new Date(
                        selectedBill.dischargeDate,
                      ).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Category</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead className="text-right">Quantity</TableHead>
                      <TableHead className="text-right">Rate (₹)</TableHead>
                      <TableHead className="text-right">Amount (₹)</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {getFilteredBillItems(selectedBill.id).map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">
                          {item.category}
                        </TableCell>
                        <TableCell>{item.description}</TableCell>
                        <TableCell className="text-right">
                          {item.quantity}
                        </TableCell>
                        <TableCell className="text-right">
                          {item.rate.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-right">
                          {item.amount.toLocaleString()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Subtotal:</span>
                  <span>₹{selectedBill.totalAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Tax (0%):</span>
                  <span>₹0.00</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>
                    Discount (
                    {(
                      (selectedBill.discount / selectedBill.totalAmount) *
                      100
                    ).toFixed(2)}
                    %):
                  </span>
                  <span>₹{selectedBill.discount.toLocaleString()}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-medium">
                  <span>Total Amount:</span>
                  <span>
                    ₹
                    {(
                      selectedBill.totalAmount - selectedBill.discount
                    ).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Paid Amount:</span>
                  <span>₹{selectedBill.paidAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between font-medium">
                  <span>Balance Due:</span>
                  <span>
                    ₹
                    {(
                      selectedBill.totalAmount -
                      selectedBill.discount -
                      selectedBill.paidAmount
                    ).toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="flex justify-between items-center pt-4 border-t">
                <div>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(
                      selectedBill.status,
                    )}`}
                  >
                    {getStatusText(selectedBill.status)}
                  </span>
                </div>
                {selectedBill.status !== "paid" && (
                  <Button
                    onClick={() => {
                      setIsReportDialogOpen(false);
                      handleMakePayment(selectedBill);
                    }}
                  >
                    Make Payment
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default IPDBilling;
