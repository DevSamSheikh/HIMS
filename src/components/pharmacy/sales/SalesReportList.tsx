import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Download, FileSpreadsheet, FileText, Search } from "lucide-react";
import DataTable, { Column } from "@/components/ui/data-table";

interface SalesReport {
  id: string;
  date: string;
  invoiceNumber: string;
  customer: string;
  itemCount: number;
  totalAmount: number;
  paymentMethod: string;
  status: string;
}

interface ItemSalesReport {
  id: string;
  itemCode: string;
  itemName: string;
  category: string;
  quantitySold: number;
  revenue: number;
  profit: number;
  returnRate: number;
}

const SalesReportList: React.FC = () => {
  const [activeTab, setActiveTab] = useState("sales");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reportType, setReportType] = useState("daily");

  // Sample data for sales report
  const salesData: SalesReport[] = [
    {
      id: "sale-1",
      date: "2023-08-01",
      invoiceNumber: "SI-001",
      customer: "John Doe",
      itemCount: 5,
      totalAmount: 1250.0,
      paymentMethod: "Cash",
      status: "Completed",
    },
    {
      id: "sale-2",
      date: "2023-08-02",
      invoiceNumber: "SI-002",
      customer: "Jane Smith",
      itemCount: 3,
      totalAmount: 875.5,
      paymentMethod: "Credit Card",
      status: "Completed",
    },
    {
      id: "sale-3",
      date: "2023-08-03",
      invoiceNumber: "SI-003",
      customer: "Robert Johnson",
      itemCount: 7,
      totalAmount: 2340.75,
      paymentMethod: "Bank Transfer",
      status: "Completed",
    },
  ];

  // Sample data for item sales report
  const itemSalesData: ItemSalesReport[] = [
    {
      id: "item-1",
      itemCode: "MED001",
      itemName: "Paracetamol 500mg",
      category: "Pain Relief",
      quantitySold: 120,
      revenue: 660.0,
      profit: 264.0,
      returnRate: 2.5,
    },
    {
      id: "item-2",
      itemCode: "MED002",
      itemName: "Amoxicillin 250mg",
      category: "Antibiotics",
      quantitySold: 85,
      revenue: 743.75,
      profit: 371.88,
      returnRate: 1.2,
    },
    {
      id: "item-3",
      itemCode: "MED003",
      itemName: "Omeprazole 20mg",
      category: "Gastrointestinal",
      quantitySold: 65,
      revenue: 487.5,
      profit: 195.0,
      returnRate: 0.8,
    },
  ];

  const salesColumns: Column<SalesReport>[] = [
    {
      header: "Date",
      accessorKey: "date",
      cellType: "date",
      isSortable: true,
    },
    {
      header: "Invoice #",
      accessorKey: "invoiceNumber",
      isSortable: true,
    },
    {
      header: "Customer",
      accessorKey: "customer",
      isSortable: true,
    },
    {
      header: "Items",
      accessorKey: "itemCount",
      cellType: "number",
    },
    {
      header: "Total Amount",
      accessorKey: "totalAmount",
      cellType: "number",
      cell: (row) => `$${row.totalAmount.toFixed(2)}`,
    },
    {
      header: "Payment Method",
      accessorKey: "paymentMethod",
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: (row) => (
        <span
          className={`px-2 py-1 rounded-full text-xs ${row.status === "Completed" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}
        >
          {row.status}
        </span>
      ),
    },
  ];

  const itemSalesColumns: Column<ItemSalesReport>[] = [
    {
      header: "Item Code",
      accessorKey: "itemCode",
      isSortable: true,
    },
    {
      header: "Item Name",
      accessorKey: "itemName",
      isSortable: true,
      width: "200px",
    },
    {
      header: "Category",
      accessorKey: "category",
      isSortable: true,
    },
    {
      header: "Qty Sold",
      accessorKey: "quantitySold",
      cellType: "number",
    },
    {
      header: "Revenue",
      accessorKey: "revenue",
      cellType: "number",
      cell: (row) => `$${row.revenue.toFixed(2)}`,
    },
    {
      header: "Profit",
      accessorKey: "profit",
      cellType: "number",
      cell: (row) => `$${row.profit.toFixed(2)}`,
    },
    {
      header: "Return Rate",
      accessorKey: "returnRate",
      cellType: "number",
      cell: (row) => `${row.returnRate}%`,
    },
  ];

  const handleGenerateReport = () => {
    // In a real app, you would fetch report data based on filters
    console.log("Generating report with:", { startDate, endDate, reportType });
  };

  const handleExportPdf = () => {
    console.log("Exporting to PDF");
  };

  const handleExportExcel = () => {
    console.log("Exporting to Excel");
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div>
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="endDate">End Date</Label>
              <Input
                id="endDate"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="reportType">Report Type</Label>
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger id="reportType" className="mt-1">
                  <SelectValue placeholder="Select report type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="yearly">Yearly</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex space-x-2">
              <Button onClick={handleGenerateReport} className="flex-1">
                <Search className="mr-2 h-4 w-4" /> Generate Report
              </Button>
              <Button variant="outline" onClick={handleExportPdf}>
                <FileText className="h-4 w-4" />
              </Button>
              <Button variant="outline" onClick={handleExportExcel}>
                <FileSpreadsheet className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full md:w-auto grid-cols-1 md:grid-cols-2">
          <TabsTrigger value="sales">Sales Report</TabsTrigger>
          <TabsTrigger value="items">Item Sales Report</TabsTrigger>
        </TabsList>

        <TabsContent value="sales" className="mt-6">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">Sales Report</h3>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleExportPdf}
                    >
                      <FileText className="mr-2 h-4 w-4" /> Export PDF
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleExportExcel}
                    >
                      <FileSpreadsheet className="mr-2 h-4 w-4" /> Export Excel
                    </Button>
                  </div>
                </div>

                <DataTable
                  data={salesData}
                  columns={salesColumns}
                  isSearchable={true}
                  isSortable={true}
                  isFilterable={true}
                  noDataText="No sales data found for the selected period"
                />

                <div className="bg-muted p-4 rounded-md">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-background rounded-md shadow-sm">
                      <h4 className="text-sm font-medium text-muted-foreground">
                        Total Sales
                      </h4>
                      <p className="text-2xl font-bold">$4,466.25</p>
                    </div>
                    <div className="p-4 bg-background rounded-md shadow-sm">
                      <h4 className="text-sm font-medium text-muted-foreground">
                        Total Transactions
                      </h4>
                      <p className="text-2xl font-bold">3</p>
                    </div>
                    <div className="p-4 bg-background rounded-md shadow-sm">
                      <h4 className="text-sm font-medium text-muted-foreground">
                        Average Sale Value
                      </h4>
                      <p className="text-2xl font-bold">$1,488.75</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="items" className="mt-6">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">Item Sales Report</h3>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleExportPdf}
                    >
                      <FileText className="mr-2 h-4 w-4" /> Export PDF
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleExportExcel}
                    >
                      <FileSpreadsheet className="mr-2 h-4 w-4" /> Export Excel
                    </Button>
                  </div>
                </div>

                <DataTable
                  data={itemSalesData}
                  columns={itemSalesColumns}
                  isSearchable={true}
                  isSortable={true}
                  isFilterable={true}
                  noDataText="No item sales data found for the selected period"
                />

                <div className="bg-muted p-4 rounded-md">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="p-4 bg-background rounded-md shadow-sm">
                      <h4 className="text-sm font-medium text-muted-foreground">
                        Total Items Sold
                      </h4>
                      <p className="text-2xl font-bold">270</p>
                    </div>
                    <div className="p-4 bg-background rounded-md shadow-sm">
                      <h4 className="text-sm font-medium text-muted-foreground">
                        Total Revenue
                      </h4>
                      <p className="text-2xl font-bold">$1,891.25</p>
                    </div>
                    <div className="p-4 bg-background rounded-md shadow-sm">
                      <h4 className="text-sm font-medium text-muted-foreground">
                        Total Profit
                      </h4>
                      <p className="text-2xl font-bold">$830.88</p>
                    </div>
                    <div className="p-4 bg-background rounded-md shadow-sm">
                      <h4 className="text-sm font-medium text-muted-foreground">
                        Avg Return Rate
                      </h4>
                      <p className="text-2xl font-bold">1.5%</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SalesReportList;
