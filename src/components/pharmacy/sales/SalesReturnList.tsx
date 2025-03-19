import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ListTable from "@/components/ui/list-table";
import { Badge } from "@/components/ui/badge";
import { Calendar, FileText, User, DollarSign } from "lucide-react";

interface SalesReturn {
  id: string;
  returnNumber: string;
  date: string;
  customer: string;
  invoiceNumber: string;
  amount: number;
  status: string;
}

const SalesReturnList = () => {
  const navigate = useNavigate();

  // Sample data for demonstration
  const [salesReturns] = useState<SalesReturn[]>([
    {
      id: "ret-001",
      returnNumber: "SR-001",
      date: "2023-06-16",
      customer: "John Doe",
      invoiceNumber: "SI-001",
      amount: 250.0,
      status: "completed",
    },
    {
      id: "ret-002",
      returnNumber: "SR-002",
      date: "2023-06-17",
      customer: "Jane Smith",
      invoiceNumber: "SI-002",
      amount: 175.5,
      status: "completed",
    },
    {
      id: "ret-003",
      returnNumber: "SR-003",
      date: "2023-06-18",
      customer: "Robert Johnson",
      invoiceNumber: "SI-003",
      amount: 340.75,
      status: "pending",
    },
    {
      id: "ret-004",
      returnNumber: "SR-004",
      date: "2023-06-19",
      customer: "Emily Davis",
      invoiceNumber: "SI-004",
      amount: 120.25,
      status: "cancelled",
    },
  ]);

  const columns = [
    {
      header: "Return #",
      accessorKey: "returnNumber" as keyof SalesReturn,
    },
    {
      header: "Date",
      accessorKey: "date" as keyof SalesReturn,
      cell: (item: SalesReturn) => (
        <div className="flex items-center">
          <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
          {new Date(item.date).toLocaleDateString()}
        </div>
      ),
    },
    {
      header: "Customer",
      accessorKey: "customer" as keyof SalesReturn,
      cell: (item: SalesReturn) => (
        <div className="flex items-center">
          <User className="mr-2 h-4 w-4 text-muted-foreground" />
          {item.customer}
        </div>
      ),
    },
    {
      header: "Invoice #",
      accessorKey: "invoiceNumber" as keyof SalesReturn,
      cell: (item: SalesReturn) => (
        <div className="flex items-center">
          <FileText className="mr-2 h-4 w-4 text-muted-foreground" />
          {item.invoiceNumber}
        </div>
      ),
    },
    {
      header: "Amount",
      accessorKey: "amount" as keyof SalesReturn,
      cell: (item: SalesReturn) => (
        <div className="flex items-center font-medium">
          <DollarSign className="mr-2 h-4 w-4 text-muted-foreground" />
          {item.amount.toFixed(2)}
        </div>
      ),
    },
    {
      header: "Status",
      accessorKey: "status" as keyof SalesReturn,
      cell: (item: SalesReturn) => {
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
  ];

  const handleAdd = () => {
    navigate("/pharmacy/sales/returns/new");
  };

  const handleEdit = (item: SalesReturn) => {
    navigate(`/pharmacy/sales/returns/edit/${item.id}`);
  };

  const handleDelete = (id: string) => {
    // In a real application, you would call an API to delete the return
    console.log(`Delete sales return with ID: ${id}`);
  };

  const handleExport = (type: "pdf" | "excel") => {
    console.log(`Export sales returns as ${type}`);
  };

  return (
    <div>
      <ListTable
        title="Sales Returns"
        data={salesReturns}
        columns={columns}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onExport={handleExport}
        addButtonText="New Sales Return"
        isSearchable={true}
        isPaginated={true}
        filters={[
          {
            key: "status" as keyof SalesReturn,
            label: "Status",
            options: [
              { id: "completed", name: "Completed" },
              { id: "pending", name: "Pending" },
              { id: "cancelled", name: "Cancelled" },
            ],
            defaultValue: "all-status",
          },
        ]}
      />
    </div>
  );
};

export default SalesReturnList;
