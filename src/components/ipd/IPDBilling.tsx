import React, { useState } from "react";
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
import { Search, FileText, Printer, Download, CheckCircle } from "lucide-react";

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

const IPDBilling = () => {
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
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState<number>(0);

  const filteredBills = bills.filter(
    (bill) =>
      bill.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bill.mrNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bill.billNumber.toLowerCase().includes(searchQuery.toLowerCase()),
  );

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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">IPD Billing</h2>
        <Button>
          <FileText className="mr-2 h-4 w-4" />
          Generate New Bill
        </Button>
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by bill number, patient name, or MR number..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
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
            {filteredBills.length > 0 ? (
              filteredBills.map((bill) => (
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
                  <Button variant="outline" size="sm">
                    <Printer className="mr-2 h-4 w-4" />
                    Print
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="mr-2 h-4 w-4" />
                    Download PDF
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
                  <span>Discount:</span>
                  <span>₹0.00</span>
                </div>
                <Separator />
                <div className="flex justify-between font-medium">
                  <span>Total Amount:</span>
                  <span>₹{selectedBill.totalAmount.toLocaleString()}</span>
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
                      selectedBill.totalAmount - selectedBill.paidAmount
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
    </div>
  );
};

export default IPDBilling;
