import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ListTable from "@/components/ui/list-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, User, FileText, DollarSign } from "lucide-react";

interface SalesInvoice {
  id: string;
  invoiceNumber: string;
  date: string;
  customer: string;
  amount: number;
  status: string;
  paymentStatus: string;
}

const SalesInvoiceList = () => {
  const navigate = useNavigate();

  // Sample data for demonstration
  const [salesInvoices] = useState<SalesInvoice[]>([
    {
      id: "inv-001",
      invoiceNumber: "SI-001",
      date: "2023-06-15",
      customer: "John Doe",
      amount: 1250.0,
      status: "completed",
      paymentStatus: "paid",
    },
    {
      id: "inv-002",
      invoiceNumber: "SI-002",
      date: "2023-06-16",
      customer: "Jane Smith",
      amount: 875.5,
      status: "completed",
      paymentStatus: "paid",
    },
    {
      id: "inv-003",
      invoiceNumber: "SI-003",
      date: "2023-06-17",
      customer: "Robert Johnson",
      amount: 2340.75,
      status: "completed",
      paymentStatus: "unpaid",
    },
    {
      id: "inv-004",
      invoiceNumber: "SI-004",
      date: "2023-06-18",
      customer: "Emily Davis",
      amount: 560.25,
      status: "pending",
      paymentStatus: "partial",
    },
    {
      id: "inv-005",
      invoiceNumber: "SI-005",
      date: "2023-06-19",
      customer: "Michael Wilson",
      amount: 1890.0,
      status: "completed",
      paymentStatus: "paid",
    },
  ]);

  const columns = [
    {
      header: "Invoice #",
      accessorKey: "invoiceNumber" as keyof SalesInvoice,
    },
    {
      header: "Date",
      accessorKey: "date" as keyof SalesInvoice,
      cell: (item: SalesInvoice) => (
        <div className="flex items-center">
          <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
          {new Date(item.date).toLocaleDateString()}
        </div>
      ),
    },
    {
      header: "Customer",
      accessorKey: "customer" as keyof SalesInvoice,
      cell: (item: SalesInvoice) => (
        <div className="flex items-center">
          <User className="mr-2 h-4 w-4 text-muted-foreground" />
          {item.customer}
        </div>
      ),
    },
    {
      header: "Amount",
      accessorKey: "amount" as keyof SalesInvoice,
      cell: (item: SalesInvoice) => (
        <div className="flex items-center font-medium">
          <DollarSign className="mr-2 h-4 w-4 text-muted-foreground" />
          {item.amount.toFixed(2)}
        </div>
      ),
    },
    {
      header: "Status",
      accessorKey: "status" as keyof SalesInvoice,
      cell: (item: SalesInvoice) => {
        let badgeVariant = "";
        let badgeText = "";

        switch (item.status) {
          case "completed":
            badgeVariant = "bg-green-500";
            badgeText = "Completed";
            break;
          case "pending":
            badgeVariant = "bg-yellow-500";
            badgeText = "Pending";
            break;
          case "cancelled":
            badgeVariant = "bg-red-500";
            badgeText = "Cancelled";
            break;
          default:
            badgeVariant = "bg-gray-500";
            badgeText = item.status;
        }

        return <Badge className={badgeVariant}>{badgeText}</Badge>;
      },
    },
    {
      header: "Payment",
      accessorKey: "paymentStatus" as keyof SalesInvoice,
      cell: (item: SalesInvoice) => {
        let badgeVariant = "";
        let badgeText = "";

        switch (item.paymentStatus) {
          case "paid":
            badgeVariant = "bg-green-500";
            badgeText = "Paid";
            break;
          case "unpaid":
            badgeVariant = "bg-red-500";
            badgeText = "Unpaid";
            break;
          case "partial":
            badgeVariant = "bg-yellow-500";
            badgeText = "Partial";
            break;
          default:
            badgeVariant = "bg-gray-500";
            badgeText = item.paymentStatus;
        }

        return <Badge className={badgeVariant}>{badgeText}</Badge>;
      },
    },
  ];

  const handleAdd = () => {
    navigate("/pharmacy/sales/invoices/new");
  };

  const handleEdit = (item: SalesInvoice) => {
    navigate(`/pharmacy/sales/invoices/edit/${item.id}`);
  };

  const handleDelete = (id: string) => {
    // In a real application, you would call an API to delete the invoice
    console.log(`Delete invoice with ID: ${id}`);
  };

  const handleExport = (type: "pdf" | "excel") => {
    console.log(`Export sales invoices as ${type}`);
  };

  return (
    <div>
      <ListTable
        title="Sales Invoices"
        data={salesInvoices}
        columns={columns}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onExport={handleExport}
        addButtonText="New Sales Invoice"
        isSearchable={true}
        isPaginated={true}
        filters={[
          {
            key: "status" as keyof SalesInvoice,
            label: "Status",
            options: [
              { id: "completed", name: "Completed" },
              { id: "pending", name: "Pending" },
              { id: "cancelled", name: "Cancelled" },
            ],
            defaultValue: "all-status",
          },
          {
            key: "paymentStatus" as keyof SalesInvoice,
            label: "Payment Status",
            options: [
              { id: "paid", name: "Paid" },
              { id: "unpaid", name: "Unpaid" },
              { id: "partial", name: "Partial" },
            ],
            defaultValue: "all-paymentStatus",
          },
        ]}
      />
    </div>
  );
};

export default SalesInvoiceList;
