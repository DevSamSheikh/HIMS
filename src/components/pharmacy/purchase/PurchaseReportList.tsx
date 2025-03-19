import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon, FileDown, Printer, Search } from "lucide-react";

const PurchaseReportList = () => {
  const [startDate, setStartDate] = useState<Date | undefined>(new Date());
  const [endDate, setEndDate] = useState<Date | undefined>(new Date());
  const [company, setCompany] = useState<string>("all");
  const [product, setProduct] = useState<string>("all");
  const [reportType, setReportType] = useState("company-ledger");

  // Sample data for dropdowns
  const companies = [
    { id: "comp1", name: "ABC Pharmaceuticals" },
    { id: "comp2", name: "MedLife Supplies" },
    { id: "comp3", name: "HealthCare Products" },
    { id: "comp4", name: "Pharma Solutions" },
    { id: "comp5", name: "MediTech Inc." },
  ];

  const products = [
    { id: "prod1", name: "Paracetamol 500mg" },
    { id: "prod2", name: "Amoxicillin 250mg" },
    { id: "prod3", name: "Omeprazole 20mg" },
    { id: "prod4", name: "Metformin 500mg" },
    { id: "prod5", name: "Atorvastatin 10mg" },
  ];

  // Sample report data
  const companyLedgerData = [
    {
      date: "2023-06-15",
      reference: "PO-001",
      type: "Purchase Order",
      debit: 12500,
      credit: 0,
      balance: 12500,
    },
    {
      date: "2023-06-18",
      reference: "PI-001",
      type: "Purchase Invoice",
      debit: 0,
      credit: 10000,
      balance: 2500,
    },
    {
      date: "2023-06-20",
      reference: "PMT-001",
      type: "Payment",
      debit: 0,
      credit: 2500,
      balance: 0,
    },
    {
      date: "2023-06-22",
      reference: "PO-002",
      type: "Purchase Order",
      debit: 8750,
      credit: 0,
      balance: 8750,
    },
    {
      date: "2023-06-25",
      reference: "PI-002",
      type: "Purchase Invoice",
      debit: 0,
      credit: 8750,
      balance: 0,
    },
  ];

  const productWiseData = [
    {
      product: "Paracetamol 500mg",
      quantity: 5000,
      unitPrice: 0.5,
      totalAmount: 2500,
      supplier: "ABC Pharmaceuticals",
      date: "2023-06-15",
    },
    {
      product: "Amoxicillin 250mg",
      quantity: 2000,
      unitPrice: 1.2,
      totalAmount: 2400,
      supplier: "MedLife Supplies",
      date: "2023-06-18",
    },
    {
      product: "Omeprazole 20mg",
      quantity: 3000,
      unitPrice: 0.8,
      totalAmount: 2400,
      supplier: "HealthCare Products",
      date: "2023-06-20",
    },
    {
      product: "Metformin 500mg",
      quantity: 4000,
      unitPrice: 0.6,
      totalAmount: 2400,
      supplier: "Pharma Solutions",
      date: "2023-06-22",
    },
    {
      product: "Atorvastatin 10mg",
      quantity: 1500,
      unitPrice: 1.5,
      totalAmount: 2250,
      supplier: "MediTech Inc.",
      date: "2023-06-25",
    },
  ];

  const outstandingPaymentsData = [
    {
      company: "ABC Pharmaceuticals",
      invoiceNumber: "PI-003",
      invoiceDate: "2023-07-01",
      dueDate: "2023-07-31",
      amount: 15000,
      outstanding: 15000,
      agingDays: 30,
    },
    {
      company: "MedLife Supplies",
      invoiceNumber: "PI-004",
      invoiceDate: "2023-07-05",
      dueDate: "2023-08-04",
      amount: 8500,
      outstanding: 8500,
      agingDays: 26,
    },
    {
      company: "HealthCare Products",
      invoiceNumber: "PI-005",
      invoiceDate: "2023-07-10",
      dueDate: "2023-08-09",
      amount: 12000,
      outstanding: 6000,
      agingDays: 21,
    },
    {
      company: "Pharma Solutions",
      invoiceNumber: "PI-006",
      invoiceDate: "2023-07-15",
      dueDate: "2023-08-14",
      amount: 9800,
      outstanding: 9800,
      agingDays: 16,
    },
    {
      company: "MediTech Inc.",
      invoiceNumber: "PI-007",
      invoiceDate: "2023-07-20",
      dueDate: "2023-08-19",
      amount: 11200,
      outstanding: 5600,
      agingDays: 11,
    },
  ];

  const handleGenerateReport = () => {
    // In a real implementation, this would fetch data from an API
    console.log("Generating report with parameters:", {
      reportType,
      startDate,
      endDate,
      company,
      product,
    });
  };

  const handleExport = () => {
    // In a real implementation, this would export the data to CSV/Excel
    console.log("Exporting report");
  };

  const handlePrint = () => {
    // In a real implementation, this would print the report
    window.print();
  };

  return (
    <div className="space-y-6 bg-white dark:bg-gray-950">
      <Card>
        <CardHeader>
          <CardTitle>Purchase Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs
            value={reportType}
            onValueChange={setReportType}
            className="w-full"
          >
            <TabsList className="grid w-full max-w-3xl grid-cols-3 mb-6">
              <TabsTrigger value="company-ledger">Company Ledger</TabsTrigger>
              <TabsTrigger value="product-wise">Product Wise</TabsTrigger>
              <TabsTrigger value="outstanding-payments">
                Outstanding Payments
              </TabsTrigger>
            </TabsList>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Start Date</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {startDate ? (
                        format(startDate, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={startDate}
                      onSelect={setStartDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">End Date</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {endDate ? (
                        format(endDate, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={endDate}
                      onSelect={setEndDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {reportType === "company-ledger" && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Company</label>
                  <Select value={company} onValueChange={setCompany}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select company" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Companies</SelectItem>
                      {companies.map((company) => (
                        <SelectItem key={company.id} value={company.id}>
                          {company.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {reportType === "product-wise" && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Product</label>
                  <Select value={product} onValueChange={setProduct}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select product" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Products</SelectItem>
                      {products.map((product) => (
                        <SelectItem key={product.id} value={product.id}>
                          {product.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="flex items-end space-x-2">
                <Button onClick={handleGenerateReport} className="flex-1">
                  Generate Report
                </Button>
              </div>
            </div>

            <div className="flex justify-end space-x-2 mb-4">
              <Button variant="outline" size="sm" onClick={handleExport}>
                <FileDown className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button variant="outline" size="sm" onClick={handlePrint}>
                <Printer className="h-4 w-4 mr-2" />
                Print
              </Button>
            </div>

            <TabsContent value="company-ledger" className="mt-0">
              <div className="rounded-md border">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="py-3 px-4 text-left">Date</th>
                      <th className="py-3 px-4 text-left">Reference</th>
                      <th className="py-3 px-4 text-left">Type</th>
                      <th className="py-3 px-4 text-right">Debit</th>
                      <th className="py-3 px-4 text-right">Credit</th>
                      <th className="py-3 px-4 text-right">Balance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {companyLedgerData.map((item, index) => (
                      <tr
                        key={index}
                        className="border-b hover:bg-muted/50 transition-colors"
                      >
                        <td className="py-3 px-4">{item.date}</td>
                        <td className="py-3 px-4">{item.reference}</td>
                        <td className="py-3 px-4">{item.type}</td>
                        <td className="py-3 px-4 text-right">
                          ${item.debit.toLocaleString()}
                        </td>
                        <td className="py-3 px-4 text-right">
                          ${item.credit.toLocaleString()}
                        </td>
                        <td className="py-3 px-4 text-right">
                          ${item.balance.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                    <tr className="bg-muted/20 font-medium">
                      <td colSpan={3} className="py-3 px-4 text-right">
                        Total:
                      </td>
                      <td className="py-3 px-4 text-right">
                        $
                        {companyLedgerData
                          .reduce((sum, item) => sum + item.debit, 0)
                          .toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-right">
                        $
                        {companyLedgerData
                          .reduce((sum, item) => sum + item.credit, 0)
                          .toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-right">
                        $
                        {companyLedgerData[
                          companyLedgerData.length - 1
                        ].balance.toLocaleString()}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </TabsContent>

            <TabsContent value="product-wise" className="mt-0">
              <div className="rounded-md border">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="py-3 px-4 text-left">Product</th>
                      <th className="py-3 px-4 text-left">Supplier</th>
                      <th className="py-3 px-4 text-left">Date</th>
                      <th className="py-3 px-4 text-right">Quantity</th>
                      <th className="py-3 px-4 text-right">Unit Price</th>
                      <th className="py-3 px-4 text-right">Total Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {productWiseData.map((item, index) => (
                      <tr
                        key={index}
                        className="border-b hover:bg-muted/50 transition-colors"
                      >
                        <td className="py-3 px-4">{item.product}</td>
                        <td className="py-3 px-4">{item.supplier}</td>
                        <td className="py-3 px-4">{item.date}</td>
                        <td className="py-3 px-4 text-right">
                          {item.quantity.toLocaleString()}
                        </td>
                        <td className="py-3 px-4 text-right">
                          ${item.unitPrice.toFixed(2)}
                        </td>
                        <td className="py-3 px-4 text-right">
                          ${item.totalAmount.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                    <tr className="bg-muted/20 font-medium">
                      <td colSpan={5} className="py-3 px-4 text-right">
                        Total:
                      </td>
                      <td className="py-3 px-4 text-right">
                        $
                        {productWiseData
                          .reduce((sum, item) => sum + item.totalAmount, 0)
                          .toLocaleString()}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </TabsContent>

            <TabsContent value="outstanding-payments" className="mt-0">
              <div className="rounded-md border">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="py-3 px-4 text-left">Company</th>
                      <th className="py-3 px-4 text-left">Invoice Number</th>
                      <th className="py-3 px-4 text-left">Invoice Date</th>
                      <th className="py-3 px-4 text-left">Due Date</th>
                      <th className="py-3 px-4 text-right">Amount</th>
                      <th className="py-3 px-4 text-right">Outstanding</th>
                      <th className="py-3 px-4 text-right">Aging (Days)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {outstandingPaymentsData.map((item, index) => (
                      <tr
                        key={index}
                        className="border-b hover:bg-muted/50 transition-colors"
                      >
                        <td className="py-3 px-4">{item.company}</td>
                        <td className="py-3 px-4">{item.invoiceNumber}</td>
                        <td className="py-3 px-4">{item.invoiceDate}</td>
                        <td className="py-3 px-4">{item.dueDate}</td>
                        <td className="py-3 px-4 text-right">
                          ${item.amount.toLocaleString()}
                        </td>
                        <td className="py-3 px-4 text-right">
                          ${item.outstanding.toLocaleString()}
                        </td>
                        <td className="py-3 px-4 text-right">
                          {item.agingDays}
                        </td>
                      </tr>
                    ))}
                    <tr className="bg-muted/20 font-medium">
                      <td colSpan={5} className="py-3 px-4 text-right">
                        Total Outstanding:
                      </td>
                      <td className="py-3 px-4 text-right">
                        $
                        {outstandingPaymentsData
                          .reduce((sum, item) => sum + item.outstanding, 0)
                          .toLocaleString()}
                      </td>
                      <td></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default PurchaseReportList;
