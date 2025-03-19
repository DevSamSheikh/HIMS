import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ListTable from "@/components/ui/list-table";
import { PlusCircle, Search, FileDown, Printer } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useNavigate } from "react-router-dom";

interface PurchaseInvoice {
  id: string;
  date: string;
  poNumber: string;
  company: string;
  total: number;
  status: string;
}

const PurchaseInvoiceList = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Sample data - would come from API in real implementation
  const purchaseInvoices: PurchaseInvoice[] = [
    {
      id: "INV-001",
      date: "2023-06-16",
      poNumber: "PO-001",
      company: "ABC Pharmaceuticals",
      total: 12500,
      status: "pending",
    },
    {
      id: "INV-002",
      date: "2023-06-19",
      poNumber: "PO-002",
      company: "MedLife Supplies",
      total: 8750,
      status: "paid",
    },
    {
      id: "INV-003",
      date: "2023-06-21",
      poNumber: "PO-003",
      company: "HealthCare Products",
      total: 15200,
      status: "paid",
    },
    {
      id: "INV-004",
      date: "2023-06-23",
      poNumber: "PO-004",
      company: "Pharma Solutions",
      total: 9300,
      status: "pending",
    },
    {
      id: "INV-005",
      date: "2023-06-26",
      poNumber: "PO-005",
      company: "MediTech Inc.",
      total: 11800,
      status: "paid",
    },
  ];

  const columns = [
    { header: "Invoice Number", accessorKey: "id" },
    { header: "Date", accessorKey: "date" },
    { header: "PO Number", accessorKey: "poNumber" },
    { header: "Company", accessorKey: "company" },
    {
      header: "Total Amount",
      accessorKey: "total",
      cell: (item: PurchaseInvoice) => {
        return <span>${item.total.toLocaleString()}</span>;
      },
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: (item: PurchaseInvoice) => {
        const status = item.status;
        const statusClasses = {
          pending:
            "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
          paid: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
          cancelled:
            "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
        };

        return (
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${statusClasses[status as keyof typeof statusClasses]}`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </span>
        );
      },
    },
    {
      header: "Actions",
      accessorKey: "id",
      cell: (item: PurchaseInvoice) => {
        return (
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                navigate(`/pharmacy/purchase/invoices/edit/${item.id}`)
              }
            >
              Edit
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                navigate(`/pharmacy/purchase/returns/new?invoice=${item.id}`)
              }
            >
              Create Return
            </Button>
          </div>
        );
      },
    },
  ];

  const filteredData = purchaseInvoices.filter((invoice) => {
    const matchesSearch =
      invoice.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.poNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.company.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || invoice.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2 w-1/3">
          <Search className="h-5 w-5 text-gray-400" />
          <Input
            placeholder="Search invoices..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>

        <div className="flex items-center space-x-4">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="paid">Paid</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" size="sm">
            <FileDown className="h-4 w-4 mr-2" />
            Export
          </Button>

          <Button variant="outline" size="sm">
            <Printer className="h-4 w-4 mr-2" />
            Print
          </Button>

          <Button onClick={() => navigate("/pharmacy/purchase/invoices/new")}>
            <PlusCircle className="h-4 w-4 mr-2" />
            New Invoice
          </Button>
        </div>
      </div>

      <ListTable
        title="Purchase Invoices"
        columns={columns}
        data={filteredData}
        isPaginated={true}
        noDataText="No invoices found"
      />
    </div>
  );
};

export default PurchaseInvoiceList;
