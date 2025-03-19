import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import DataTable, { Column } from "@/components/ui/data-table";

interface SaleReturn {
  id: string;
  returnNumber: string;
  date: string;
  customer: string;
  invoiceNumber: string;
  totalAmount: number;
  status: string;
}

const SaleReturnList: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading] = useState(false);

  // Sample data
  const sampleReturns: SaleReturn[] = [
    {
      id: "ret-001",
      returnNumber: "SR-001",
      date: "2023-08-05",
      customer: "John Doe",
      invoiceNumber: "SI-001",
      totalAmount: 250.0,
      status: "Completed",
    },
    {
      id: "ret-002",
      returnNumber: "SR-002",
      date: "2023-08-07",
      customer: "Jane Smith",
      invoiceNumber: "SI-002",
      totalAmount: 175.5,
      status: "Pending",
    },
    {
      id: "ret-003",
      returnNumber: "SR-003",
      date: "2023-08-10",
      customer: "Robert Johnson",
      invoiceNumber: "SI-003",
      totalAmount: 340.75,
      status: "Completed",
    },
  ];

  const columns: Column<SaleReturn>[] = [
    {
      header: "Return #",
      accessorKey: "returnNumber",
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
      header: "Invoice #",
      accessorKey: "invoiceNumber",
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
  ];

  const handleAddNew = () => {
    navigate("/pharmacy/sales/returns/new");
  };

  const handleEdit = (returnItem: SaleReturn) => {
    navigate(`/pharmacy/sales/returns/edit/${returnItem.id}`);
  };

  const handleDelete = (id: string) => {
    // In a real app, you would call an API to delete the return
    console.log(`Delete return with ID: ${id}`);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Sale Returns</h2>
        <Button onClick={handleAddNew}>
          <Plus className="mr-2 h-4 w-4" /> New Sale Return
        </Button>
      </div>

      <DataTable
        data={sampleReturns}
        columns={columns}
        isLoading={isLoading}
        onSave={() => {}}
        addButtonText="Add Sale Return"
        noDataText="No sale returns found"
        loadingText="Loading sale returns..."
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

export default SaleReturnList;
