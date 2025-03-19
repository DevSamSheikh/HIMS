import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Download,
  FileText,
  Search,
  User,
  DollarSign,
  BarChart,
  FileBarChart,
} from "lucide-react";

interface SalesTransaction {
  id: string;
  date: string;
  documentNumber: string;
  documentType: "invoice" | "return";
  customer: string;
  amount: number;
}

interface ItemSales {
  id: string;
  itemName: string;
  category: string;
  quantitySold: number;
  totalSales: number;
  returnQuantity: number;
  returnAmount: number;
  netSales: number;
}

interface CustomerLedger {
  id: string;
  date: string;
  documentNumber: string;
  documentType: "invoice" | "return" | "payment";
  debit: number;
  credit: number;
  balance: number;
}

const SalesReportList: React.FC = () => {
  const [reportType, setReportType] = useState("sales");
  const [dateRange, setDateRange] = useState({ from: "", to: "" });
  const [customer, setCustomer] = useState("");
  const [item, setItem] = useState("");

  // Sample data for demonstration
  const [salesTransactions] = useState<SalesTransaction[]>([
    {
      id: "trans-001",
      date: "2023-06-15",
      documentNumber: "SI-001",
      documentType: "invoice",
      customer: "John Doe",
      amount: 1250.0,
    },
    {
      id: "trans-002",
      date: "2023-06-16",
      documentNumber: "SR-001",
      documentType: "return",
      customer: "John Doe",
      amount: -250.0,
    },
    {
      id: "trans-003",
      date: "2023-06-16",
      documentNumber: "SI-002",
      documentType: "invoice",
      customer: "Jane Smith",
      amount: 875.5,
    },
    {
      id: "trans-004",
      date: "2023-06-17",
      documentNumber: "SI-003",
      documentType: "invoice",
      customer: "Robert Johnson",
      amount: 2340.75,
    },
    {
      id: "trans-005",
      date: "2023-06-18",
      documentNumber: "SR-002",
      documentType: "return",
      customer: "Jane Smith",
      amount: -175.5,
    },
  ]);

  const [itemSales] = useState<ItemSales[]>([
    {
      id: "item-001",
      itemName: "Paracetamol 500mg",
      category: "Analgesics",
      quantitySold: 250,
      totalSales: 1497.5,
      returnQuantity: 20,
      returnAmount: 119.8,
      netSales: 1377.7,
    },
    {
      id: "item-002",
      itemName: "Amoxicillin 250mg",
      category: "Antibiotics",
      quantitySold: 120,
      totalSales: 1500.0,
      returnQuantity: 0,
      returnAmount: 0,
      netSales: 1500.0,
    },
    {
      id: "item-003",
      itemName: "Vitamin C 1000mg",
      category: "Vitamins",
      quantitySold: 180,
      totalSales: 1575.0,
      returnQuantity: 15,
      returnAmount: 131.25,
      netSales: 1443.75,
    },
    {
      id: "item-004",
      itemName: "Ibuprofen 400mg",
      category: "Analgesics",
      quantitySold: 150,
      totalSales: 1087.5,
      returnQuantity: 10,
      returnAmount: 72.5,
      netSales: 1015.0,
    },
    {
      id: "item-005",
      itemName: "Cetirizine 10mg",
      category: "Antihistamines",
      quantitySold: 80,
      totalSales: 799.2,
      returnQuantity: 0,
      returnAmount: 0,
      netSales: 799.2,
    },
  ]);

  const [customerLedger] = useState<CustomerLedger[]>([
    {
      id: "ledger-001",
      date: "2023-06-15",
      documentNumber: "SI-001",
      documentType: "invoice",
      debit: 1250.0,
      credit: 0,
      balance: 1250.0,
    },
    {
      id: "ledger-002",
      date: "2023-06-16",
      documentNumber: "SR-001",
      documentType: "return",
      debit: 0,
      credit: 250.0,
      balance: 1000.0,
    },
    {
      id: "ledger-003",
      date: "2023-06-17",
      documentNumber: "PMT-001",
      documentType: "payment",
      debit: 0,
      credit: 1000.0,
      balance: 0,
    },
    {
      id: "ledger-004",
      date: "2023-06-18",
      documentNumber: "SI-004",
      documentType: "invoice",
      debit: 560.25,
      credit: 0,
      balance: 560.25,
    },
  ]);

  const handleExport = (format: string) => {
    console.log(`Exporting ${reportType} report as ${format}`);
  };

  const handleSearch = () => {
    console.log("Searching with filters:", {
      dateRange,
      customer,
      item,
      reportType,
    });
    // In a real application, you would filter the data based on the search criteria
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Sales Reports</CardTitle>
            <div className="flex space-x-2">
              <Button variant="outline" onClick={() => handleExport("pdf")}>
                <FileText className="mr-2 h-4 w-4" />
                Export PDF
              </Button>
              <Button variant="outline" onClick={() => handleExport("excel")}>
                <FileBarChart className="mr-2 h-4 w-4" />
                Export Excel
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs
            defaultValue="sales"
            onValueChange={setReportType}
            value={reportType}
          >
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="sales">Sales Reports</TabsTrigger>
              <TabsTrigger value="items">Item-wise Sales</TabsTrigger>
              <TabsTrigger value="customer">Customer Ledger</TabsTrigger>
            </TabsList>

            <div className="mt-6 mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fromDate">From Date</Label>
                <Input
                  id="fromDate"
                  type="date"
                  value={dateRange.from}
                  onChange={(e) =>
                    setDateRange({ ...dateRange, from: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="toDate">To Date</Label>
                <Input
                  id="toDate"
                  type="date"
                  value={dateRange.to}
                  onChange={(e) =>
                    setDateRange({ ...dateRange, to: e.target.value })
                  }
                />
              </div>

              {reportType === "customer" && (
                <div className="space-y-2">
                  <Label htmlFor="customer">Customer</Label>
                  <Select value={customer} onValueChange={setCustomer}>
                    <SelectTrigger id="customer">
                      <SelectValue placeholder="Select customer" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cust-001">John Doe</SelectItem>
                      <SelectItem value="cust-002">Jane Smith</SelectItem>
                      <SelectItem value="cust-003">Robert Johnson</SelectItem>
                      <SelectItem value="cust-004">Emily Davis</SelectItem>
                      <SelectItem value="cust-005">Michael Wilson</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              {reportType === "items" && (
                <div className="space-y-2">
                  <Label htmlFor="item">Item</Label>
                  <Select value={item} onValueChange={setItem}>
                    <SelectTrigger id="item">
                      <SelectValue placeholder="Select item" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="item-001">
                        Paracetamol 500mg
                      </SelectItem>
                      <SelectItem value="item-002">
                        Amoxicillin 250mg
                      </SelectItem>
                      <SelectItem value="item-003">Vitamin C 1000mg</SelectItem>
                      <SelectItem value="item-004">Ibuprofen 400mg</SelectItem>
                      <SelectItem value="item-005">Cetirizine 10mg</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="flex items-end">
                <Button onClick={handleSearch} className="w-full">
                  <Search className="mr-2 h-4 w-4" />
                  Search
                </Button>
              </div>
            </div>

            <TabsContent value="sales">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Document #</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {salesTransactions.map((transaction) => (
                      <TableRow key={transaction.id}>
                        <TableCell>
                          <div className="flex items-center">
                            <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                            {new Date(transaction.date).toLocaleDateString()}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <FileText className="mr-2 h-4 w-4 text-muted-foreground" />
                            {transaction.documentNumber}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={
                              transaction.documentType === "invoice"
                                ? "bg-green-500"
                                : "bg-red-500"
                            }
                          >
                            {transaction.documentType === "invoice"
                              ? "Invoice"
                              : "Return"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <User className="mr-2 h-4 w-4 text-muted-foreground" />
                            {transaction.customer}
                          </div>
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          <div className="flex items-center justify-end">
                            <DollarSign className="mr-2 h-4 w-4 text-muted-foreground" />
                            {transaction.amount.toFixed(2)}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                    <TableRow className="font-bold">
                      <TableCell colSpan={4} className="text-right">
                        Total:
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end">
                          <DollarSign className="mr-2 h-4 w-4" />
                          {salesTransactions
                            .reduce((sum, t) => sum + t.amount, 0)
                            .toFixed(2)}
                        </div>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            <TabsContent value="items">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Item</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead className="text-right">Qty Sold</TableHead>
                      <TableHead className="text-right">Sales Amount</TableHead>
                      <TableHead className="text-right">Return Qty</TableHead>
                      <TableHead className="text-right">
                        Return Amount
                      </TableHead>
                      <TableHead className="text-right">Net Sales</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {itemSales.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.itemName}</TableCell>
                        <TableCell>{item.category}</TableCell>
                        <TableCell className="text-right">
                          {item.quantitySold}
                        </TableCell>
                        <TableCell className="text-right">
                          ${item.totalSales.toFixed(2)}
                        </TableCell>
                        <TableCell className="text-right">
                          {item.returnQuantity}
                        </TableCell>
                        <TableCell className="text-right">
                          ${item.returnAmount.toFixed(2)}
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          ${item.netSales.toFixed(2)}
                        </TableCell>
                      </TableRow>
                    ))}
                    <TableRow className="font-bold">
                      <TableCell colSpan={3} className="text-right">
                        Totals:
                      </TableCell>
                      <TableCell className="text-right">
                        $
                        {itemSales
                          .reduce((sum, i) => sum + i.totalSales, 0)
                          .toFixed(2)}
                      </TableCell>
                      <TableCell className="text-right">
                        {itemSales.reduce(
                          (sum, i) => sum + i.returnQuantity,
                          0,
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        $
                        {itemSales
                          .reduce((sum, i) => sum + i.returnAmount, 0)
                          .toFixed(2)}
                      </TableCell>
                      <TableCell className="text-right">
                        $
                        {itemSales
                          .reduce((sum, i) => sum + i.netSales, 0)
                          .toFixed(2)}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            <TabsContent value="customer">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Document #</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead className="text-right">Debit</TableHead>
                      <TableHead className="text-right">Credit</TableHead>
                      <TableHead className="text-right">Balance</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {customerLedger.map((entry) => (
                      <TableRow key={entry.id}>
                        <TableCell>
                          <div className="flex items-center">
                            <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                            {new Date(entry.date).toLocaleDateString()}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <FileText className="mr-2 h-4 w-4 text-muted-foreground" />
                            {entry.documentNumber}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={
                              entry.documentType === "invoice"
                                ? "bg-green-500"
                                : entry.documentType === "return"
                                  ? "bg-red-500"
                                  : "bg-blue-500"
                            }
                          >
                            {entry.documentType === "invoice"
                              ? "Invoice"
                              : entry.documentType === "return"
                                ? "Return"
                                : "Payment"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          {entry.debit > 0 ? `$${entry.debit.toFixed(2)}` : "-"}
                        </TableCell>
                        <TableCell className="text-right">
                          {entry.credit > 0
                            ? `$${entry.credit.toFixed(2)}`
                            : "-"}
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          ${entry.balance.toFixed(2)}
                        </TableCell>
                      </TableRow>
                    ))}
                    <TableRow className="font-bold">
                      <TableCell colSpan={3} className="text-right">
                        Totals:
                      </TableCell>
                      <TableCell className="text-right">
                        $
                        {customerLedger
                          .reduce((sum, e) => sum + e.debit, 0)
                          .toFixed(2)}
                      </TableCell>
                      <TableCell className="text-right">
                        $
                        {customerLedger
                          .reduce((sum, e) => sum + e.credit, 0)
                          .toFixed(2)}
                      </TableCell>
                      <TableCell className="text-right">
                        $
                        {customerLedger[
                          customerLedger.length - 1
                        ].balance.toFixed(2)}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default SalesReportList;
