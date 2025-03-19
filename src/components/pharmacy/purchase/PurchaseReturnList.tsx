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

const PurchaseReturnList = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");

  // Sample data - would come from API in real implementation
  const purchaseReturns = [
    {
      id: "RET-001",
      date: "2023-06-17",
      invoiceNumber: "INV-001",
      company: "ABC Pharmaceuticals",
      total: 2500,
      type: "invoice",
    },
    {
      id: "RET-002",
      date: "2023-06-20",
      invoiceNumber: "",
      company: "MedLife Supplies",
      total: 1750,
      type: "direct",
    },
    {
      id: "RET-003",
      date: "2023-06-22",
      invoiceNumber: "INV-003",
      company: "HealthCare Products",
      total: 3200,
      type: "invoice",
    },
    {
      id: "RET-004",
      date: "2023-06-24",
      invoiceNumber: "",
      company: "Pharma Solutions",
      total: 1300,
      type: "direct",
    },
    {
      id: "RET-005",
      date: "2023-06-27",
      invoiceNumber: "INV-005",
      company: "MediTech Inc.",
      total: 2800,
      type: "invoice",
    },
  ];

  const columns = [
    { header: "Return Number", accessorKey: "id" },
    { header: "Date", accessorKey: "date" },
    {
      header: "Return Type",
      accessorKey: "type",
      cell: (info: any) => {
        if (!info.row || !info.row.original) return null;
        const type = info.row.original.type;
        return (
          <span
            className={`capitalize ${type === "invoice" ? "text-blue-600" : "text-purple-600"}`}
          >
            {type === "invoice" ? "Invoice Return" : "Direct Return"}
          </span>
        );
      },
    },
    {
      header: "Invoice Number",
      accessorKey: "invoiceNumber",
      cell: (info: any) => {
        if (!info.row || !info.row.original) return null;
        const invoiceNumber = info.row.original.invoiceNumber;
        return invoiceNumber ? (
          <span>{invoiceNumber}</span>
        ) : (
          <span className="text-gray-400">N/A</span>
        );
      },
    },
    { header: "Company", accessorKey: "company" },
    {
      header: "Total Amount",
      accessorKey: "total",
      cell: (info: any) => {
        if (!info.row || !info.row.original) return null;
        return <span>${info.row.original.total.toLocaleString()}</span>;
      },
    },
    {
      header: "Actions",
      cell: (info: any) => {
        if (!info.row || !info.row.original) return null;
        const row = info.row;
        return (
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                navigate(`/pharmacy/purchase/returns/edit/${row.original.id}`)
              }
            >
              Edit
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                navigate(`/pharmacy/purchase/returns/view/${row.original.id}`)
              }
            >
              View
            </Button>
          </div>
        );
      },
    },
  ];

  const filteredData = purchaseReturns.filter((returnItem) => {
    const matchesSearch =
      returnItem.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      returnItem.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (returnItem.invoiceNumber &&
        returnItem.invoiceNumber
          .toLowerCase()
          .includes(searchTerm.toLowerCase()));

    const matchesType = typeFilter === "all" || returnItem.type === typeFilter;

    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2 w-1/3">
          <Search className="h-5 w-5 text-gray-400" />
          <Input
            placeholder="Search returns..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>

        <div className="flex items-center space-x-4">
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="invoice">Invoice Returns</SelectItem>
              <SelectItem value="direct">Direct Returns</SelectItem>
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

          <Button onClick={() => navigate("/pharmacy/purchase/returns/new")}>
            <PlusCircle className="h-4 w-4 mr-2" />
            New Return
          </Button>
        </div>
      </div>

      <ListTable columns={columns} data={filteredData} pagination={true} />
    </div>
  );
};

export default PurchaseReturnList;
