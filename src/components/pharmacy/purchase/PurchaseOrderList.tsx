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

const PurchaseOrderList = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Sample data - would come from API in real implementation
  const purchaseOrders = [
    {
      id: "PO-001",
      date: "2023-06-15",
      company: "ABC Pharmaceuticals",
      total: 12500,
      status: "pending",
    },
    {
      id: "PO-002",
      date: "2023-06-18",
      company: "MedLife Supplies",
      total: 8750,
      status: "approved",
    },
    {
      id: "PO-003",
      date: "2023-06-20",
      company: "HealthCare Products",
      total: 15200,
      status: "completed",
    },
    {
      id: "PO-004",
      date: "2023-06-22",
      company: "Pharma Solutions",
      total: 9300,
      status: "pending",
    },
    {
      id: "PO-005",
      date: "2023-06-25",
      company: "MediTech Inc.",
      total: 11800,
      status: "approved",
    },
  ];

  const columns = [
    { header: "PO Number", accessorKey: "id" },
    { header: "Date", accessorKey: "date" },
    { header: "Company", accessorKey: "company" },
    {
      header: "Total Amount",
      accessorKey: "total",
      cell: (item) => {
        return <span>${item.total.toLocaleString()}</span>;
      },
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: (item) => {
        const status = item.status;
        const statusClasses = {
          pending:
            "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
          approved:
            "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
          completed:
            "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
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
      cell: (item) => {
        return (
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                navigate(`/pharmacy/purchase/orders/edit/${item.id}`)
              }
            >
              Edit
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                navigate(`/pharmacy/purchase/invoices/new?po=${item.id}`)
              }
            >
              Create Invoice
            </Button>
          </div>
        );
      },
    },
  ];

  const filteredData = purchaseOrders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.company.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || order.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2 w-1/3">
          <Search className="h-5 w-5 text-gray-400" />
          <Input
            placeholder="Search purchase orders..."
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
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
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

          <Button onClick={() => navigate("/pharmacy/purchase/orders/new")}>
            <PlusCircle className="h-4 w-4 mr-2" />
            New Purchase Order
          </Button>
        </div>
      </div>

      <ListTable
        title="Purchase Orders"
        columns={columns}
        data={filteredData}
        isPaginated={true}
        hideAddButton={true}
      />
    </div>
  );
};

export default PurchaseOrderList;
