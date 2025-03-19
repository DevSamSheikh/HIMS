import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Search } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import InventoryTransferForm from "./InventoryTransferForm";
import ListTable, { Column, Filter } from "@/components/ui/list-table";

interface InventoryTransfer {
  id: string;
  transferNo: string;
  transactionDate: string;
  sourceWarehouse: string;
  sourceWarehouseName: string;
  destinationWarehouse: string;
  destinationWarehouseName: string;
  company: string;
  companyName: string;
  remarks: string;
  totalItems: number;
  totalValue: number;
  status: string;
}

const InventoryTransferTable: React.FC = () => {
  const { toast } = useToast();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedTransfer, setSelectedTransfer] =
    useState<InventoryTransfer | null>(null);
  const [transferToDelete, setTransferToDelete] = useState<string | null>(null);

  // Mock data for inventory transfers
  const [inventoryTransfers, setInventoryTransfers] = useState<
    InventoryTransfer[]
  >([
    {
      id: "1",
      transferNo: "TRF-123456",
      transactionDate: "2023-08-15",
      sourceWarehouse: "1",
      sourceWarehouseName: "Main Warehouse",
      destinationWarehouse: "2",
      destinationWarehouseName: "Secondary Warehouse",
      company: "1",
      companyName: "Pharma Co",
      remarks: "Monthly stock transfer",
      totalItems: 8,
      totalValue: 5600,
      status: "completed",
    },
    {
      id: "2",
      transferNo: "TRF-234567",
      transactionDate: "2023-08-20",
      sourceWarehouse: "1",
      sourceWarehouseName: "Main Warehouse",
      destinationWarehouse: "3",
      destinationWarehouseName: "Retail Store",
      company: "2",
      companyName: "MediCorp",
      remarks: "Urgent stock replenishment",
      totalItems: 5,
      totalValue: 3200,
      status: "in-transit",
    },
    {
      id: "3",
      transferNo: "TRF-345678",
      transactionDate: "2023-08-25",
      sourceWarehouse: "2",
      sourceWarehouseName: "Secondary Warehouse",
      destinationWarehouse: "3",
      destinationWarehouseName: "Retail Store",
      company: "3",
      companyName: "HealthDrugs",
      remarks: "Weekly stock transfer",
      totalItems: 10,
      totalValue: 7800,
      status: "completed",
    },
  ]);

  // Mock data for warehouses and companies
  const warehouses = [
    { id: "1", name: "Main Warehouse" },
    { id: "2", name: "Secondary Warehouse" },
    { id: "3", name: "Retail Store" },
  ];

  const companies = [
    { id: "1", name: "Pharma Co" },
    { id: "2", name: "MediCorp" },
    { id: "3", name: "HealthDrugs" },
  ];

  const handleAddTransfer = () => {
    setSelectedTransfer(null);
    setIsFormOpen(true);
  };

  const handleEditTransfer = (transfer: InventoryTransfer) => {
    setSelectedTransfer(transfer);
    setIsFormOpen(true);
  };

  const handleDeleteTransfer = (id: string) => {
    setTransferToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (transferToDelete) {
      setInventoryTransfers(
        inventoryTransfers.filter((i) => i.id !== transferToDelete),
      );
      toast({
        title: "Success",
        description: "Inventory transfer deleted successfully",
        duration: 3000,
      });
      setIsDeleteDialogOpen(false);
      setTransferToDelete(null);
    }
  };

  const handleSaveTransfer = (data: any) => {
    if (selectedTransfer) {
      // Edit existing transfer
      setInventoryTransfers(
        inventoryTransfers.map((i) =>
          i.id === selectedTransfer.id
            ? {
                ...i,
                ...data,
                sourceWarehouseName:
                  warehouses.find((w) => w.id === data.sourceWarehouse)?.name ||
                  "",
                destinationWarehouseName:
                  warehouses.find((w) => w.id === data.destinationWarehouse)
                    ?.name || "",
                companyName:
                  companies.find((c) => c.id === data.company)?.name || "",
                totalItems: data.items?.length || 0,
                totalValue: data.totals?.totalValue || 0,
              }
            : i,
        ),
      );
      toast({
        title: "Success",
        description: "Inventory transfer updated successfully",
        duration: 3000,
      });
    } else {
      // Add new transfer
      const newId = (
        parseInt(inventoryTransfers[inventoryTransfers.length - 1]?.id || "0") +
        1
      ).toString();
      const newTransfer = {
        id: newId,
        ...data,
        sourceWarehouseName:
          warehouses.find((w) => w.id === data.sourceWarehouse)?.name || "",
        destinationWarehouseName:
          warehouses.find((w) => w.id === data.destinationWarehouse)?.name ||
          "",
        companyName: companies.find((c) => c.id === data.company)?.name || "",
        totalItems: data.items?.length || 0,
        totalValue: data.totals?.totalValue || 0,
        status: "in-transit",
      };
      setInventoryTransfers([...inventoryTransfers, newTransfer]);
      toast({
        title: "Success",
        description: "Inventory transfer created successfully",
        duration: 3000,
      });
    }
    setIsFormOpen(false);
  };

  const handlePrintTransfer = (data: any) => {
    // This is a placeholder for print functionality
    console.log("Printing inventory transfer:", data);
    toast({
      title: "Print Initiated",
      description: "Inventory transfer print job sent to printer",
      duration: 3000,
    });
  };

  const exportData = (type: "pdf" | "excel") => {
    // This is a placeholder function for export functionality
    console.log(`Exporting data as ${type}`);
    toast({
      title: "Export Initiated",
      description: `Inventory transfers exported as ${type.toUpperCase()}`,
      duration: 3000,
    });
  };

  // Define columns for the ListTable component
  const columns: Column<InventoryTransfer>[] = [
    {
      header: "Transfer No",
      accessorKey: "transferNo",
    },
    {
      header: "Date",
      accessorKey: "transactionDate",
      cell: (item) => new Date(item.transactionDate).toLocaleDateString(),
    },
    {
      header: "From",
      accessorKey: "sourceWarehouseName",
    },
    {
      header: "To",
      accessorKey: "destinationWarehouseName",
    },
    {
      header: "Company",
      accessorKey: "companyName",
    },
    {
      header: "Items",
      accessorKey: "totalItems",
    },
    {
      header: "Total Value",
      accessorKey: "totalValue",
      cell: (item) => `${item.totalValue.toFixed(2)}`,
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: (item) => (
        <Badge
          variant={item.status === "completed" ? "default" : "secondary"}
          className={
            item.status === "completed" ? "bg-green-500" : "bg-amber-500"
          }
        >
          {item.status === "completed" ? "Completed" : "In Transit"}
        </Badge>
      ),
    },
  ];

  // Define filters for the ListTable component
  const filters: Filter<InventoryTransfer>[] = [
    {
      key: "sourceWarehouse",
      label: "From Warehouse",
      options: warehouses,
      defaultValue: "all-sourceWarehouse",
    },
    {
      key: "destinationWarehouse",
      label: "To Warehouse",
      options: warehouses,
      defaultValue: "all-destinationWarehouse",
    },
    {
      key: "company",
      label: "Company",
      options: companies,
      defaultValue: "all-company",
    },
    {
      key: "status",
      label: "Status",
      options: [
        { id: "completed", name: "Completed" },
        { id: "in-transit", name: "In Transit" },
      ],
      defaultValue: "all-status",
    },
  ];

  return (
    <>
      {!isFormOpen ? (
        <ListTable
          title="Inventory Transfers"
          data={inventoryTransfers}
          columns={columns}
          filters={filters}
          onAdd={handleAddTransfer}
          onEdit={handleEditTransfer}
          onDelete={handleDeleteTransfer}
          addButtonText="Add Inventory Transfer"
          noDataText="No inventory transfers found"
          isSearchable={true}
          isPaginated={true}
          itemsPerPage={10}
          onExport={exportData}
        />
      ) : (
        <InventoryTransferForm
          onSave={handleSaveTransfer}
          onCancel={() => setIsFormOpen(false)}
          onPrint={handlePrintTransfer}
          initialData={selectedTransfer}
        />
      )}

      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              inventory transfer record and remove its data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-500 hover:bg-red-600"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default InventoryTransferTable;
