import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Plus, FileText } from "lucide-react";
import DataTable, { Column } from "@/components/ui/data-table";

interface SaleInvoice {
  id: string;
  invoiceNumber: string;
  date: string;
  customer: string;
  totalAmount: number;
  status: string;
  paymentStatus: string;
}

const SaleInvoiceList: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading] = useState(false);

  // Sample data
  const sampleInvoices: SaleInvoice[] = [
    {
      id: "inv-001",
      invoiceNumber: "SI-001",
      date: "2023-08-01",
      customer: "John Doe",
      totalAmount: 1250.0,
      status: "Completed",
      paymentStatus: "Paid",
    },
    {
      id: "inv-002",
      invoiceNumber: "SI-002",
      date: "2023-08-02",
      customer: "Jane Smith",
      totalAmount: 875.5,
      status: "Completed",
      paymentStatus: "Pending",
    },
    {
      id: "inv-003",
      invoiceNumber: "SI-003",
      date: "2023-08-03",
      customer: "Robert Johnson",
      totalAmount: 2340.75,
      status: "Completed",
      paymentStatus: "Paid",
    },
  ];

  const columns: Column<SaleInvoice>[] = [
    {
      header: "Invoice #",
      accessorKey: "invoiceNumber",
      isSortable: true,
      isPinned: true,
    },
    {
      header: "Date",
      accessorKey: "date",
      cellType: "date",
      isSortable: true,
    },
    {
      header: "Customer",
      accessorKey: "customer",
      isSortable: true,
    },
    {
      header: "Total Amount",
      accessorKey: "totalAmount",
      cellType: "number",
      cell: (row) => `$${row.totalAmount.toFixed(2)}`,
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
    {
      header: "Payment",
      accessorKey: "paymentStatus",
      cell: (row) => (
        <span
          className={`px-2 py-1 rounded-full text-xs ${row.paymentStatus === "Paid" ? "bg-blue-100 text-blue-800" : "bg-orange-100 text-orange-800"}`}
        >
          {row.paymentStatus}
        </span>
      ),
    },
  ];

  const handleAddNew = () => {
    navigate("/pharmacy/sales/invoices/new");
  };

  const handleEdit = (invoice: SaleInvoice) => {
    navigate(`/pharmacy/sales/invoices/edit/${invoice.id}`);
  };

  const handleDelete = (id: string) => {
    // In a real app, you would call an API to delete the invoice
    console.log(`Delete invoice with ID: ${id}`);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Sale Invoices</h2>
        <Button onClick={handleAddNew}>
          <Plus className="mr-2 h-4 w-4" /> New Sale Invoice
        </Button>
      </div>

      <DataTable
        data={sampleInvoices}
        columns={columns}
        isLoading={isLoading}
        onSave={() => {}}
        addButtonText="Add Sale Invoice"
        noDataText="No sale invoices found"
        loadingText="Loading sale invoices..."
        isSearchable={true}
        isSortable={true}
        isFilterable={true}
        enableExport={true}
        onExportPdf={() => console.log("Export to PDF")}
        onExportExcel={() => console.log("Export to Excel")}
      />
    </div>
  );
};

export default SaleInvoiceList;
