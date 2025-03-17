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
import InventoryOpeningForm from "./InventoryOpeningForm";
import ListTable, { Column, Filter } from "@/components/ui/list-table";

interface InventoryOpening {
  id: string;
  openingNo: string;
  transactionDate: string;
  warehouse: string;
  warehouseName: string;
  company: string;
  companyName: string;
  remarks: string;
  totalItems: number;
  totalValue: number;
  status: string;
}

const InventoryOpeningTable: React.FC = () => {
  const { toast } = useToast();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedInventory, setSelectedInventory] =
    useState<InventoryOpening | null>(null);
  const [inventoryToDelete, setInventoryToDelete] = useState<string | null>(
    null,
  );

  // Mock data for inventory openings
  const [inventoryOpenings, setInventoryOpenings] = useState<
    InventoryOpening[]
  >([
    {
      id: "1",
      openingNo: "OP-123456",
      transactionDate: "2023-06-15",
      warehouse: "1",
      warehouseName: "Main Warehouse",
      company: "1",
      companyName: "Pharma Co",
      remarks: "Initial inventory setup",
      totalItems: 15,
      totalValue: 12500,
      status: "approved",
    },
    {
      id: "2",
      openingNo: "OP-234567",
      transactionDate: "2023-06-20",
      warehouse: "2",
      warehouseName: "Secondary Warehouse",
      company: "2",
      companyName: "MediCorp",
      remarks: "New branch opening",
      totalItems: 8,
      totalValue: 7800,
      status: "pending",
    },
    {
      id: "3",
      openingNo: "OP-345678",
      transactionDate: "2023-06-25",
      warehouse: "3",
      warehouseName: "Retail Store",
      company: "3",
      companyName: "HealthDrugs",
      remarks: "Retail store inventory",
      totalItems: 12,
      totalValue: 9500,
      status: "approved",
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

  const handleAddInventory = () => {
    setSelectedInventory(null);
    setIsFormOpen(true);
  };

  const handleEditInventory = (inventory: InventoryOpening) => {
    setSelectedInventory(inventory);
    setIsFormOpen(true);
  };

  const handleDeleteInventory = (id: string) => {
    setInventoryToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (inventoryToDelete) {
      setInventoryOpenings(
        inventoryOpenings.filter((i) => i.id !== inventoryToDelete),
      );
      toast({
        title: "Success",
        description: "Inventory opening deleted successfully",
        duration: 3000,
      });
      setIsDeleteDialogOpen(false);
      setInventoryToDelete(null);
    }
  };

  const handleSaveInventory = (data: any) => {
    if (selectedInventory) {
      // Edit existing inventory
      setInventoryOpenings(
        inventoryOpenings.map((i) =>
          i.id === selectedInventory.id
            ? {
                ...i,
                ...data,
                warehouseName:
                  warehouses.find((w) => w.id === data.warehouse)?.name || "",
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
        description: "Inventory opening updated successfully",
        duration: 3000,
      });
    } else {
      // Add new inventory
      const newId = (
        parseInt(inventoryOpenings[inventoryOpenings.length - 1]?.id || "0") + 1
      ).toString();
      const newInventory = {
        id: newId,
        ...data,
        warehouseName:
          warehouses.find((w) => w.id === data.warehouse)?.name || "",
        companyName: companies.find((c) => c.id === data.company)?.name || "",
        totalItems: data.items?.length || 0,
        totalValue: data.totals?.totalValue || 0,
        status: "pending",
      };
      setInventoryOpenings([...inventoryOpenings, newInventory]);
      toast({
        title: "Success",
        description: "Inventory opening created successfully",
        duration: 3000,
      });
    }
    setIsFormOpen(false);
  };

  const handlePrintInventory = (data: any) => {
    // This is a placeholder for print functionality
    console.log("Printing inventory opening:", data);
    toast({
      title: "Print Initiated",
      description: "Inventory opening print job sent to printer",
      duration: 3000,
    });
  };

  const exportData = (type: "pdf" | "excel") => {
    // This is a placeholder function for export functionality
    console.log(`Exporting data as ${type}`);
    toast({
      title: "Export Initiated",
      description: `Inventory openings exported as ${type.toUpperCase()}`,
      duration: 3000,
    });
  };

  // Define columns for the ListTable component
  const columns: Column<InventoryOpening>[] = [
    {
      header: "Opening No",
      accessorKey: "openingNo",
    },
    {
      header: "Date",
      accessorKey: "transactionDate",
      cell: (item) => new Date(item.transactionDate).toLocaleDateString(),
    },
    {
      header: "Warehouse",
      accessorKey: "warehouseName",
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
          variant={item.status === "approved" ? "default" : "secondary"}
          className={
            item.status === "approved" ? "bg-green-500" : "bg-amber-500"
          }
        >
          {item.status === "approved" ? "Approved" : "Pending"}
        </Badge>
      ),
    },
  ];

  // Define filters for the ListTable component
  const filters: Filter<InventoryOpening>[] = [
    {
      key: "warehouse",
      label: "Warehouse",
      options: warehouses,
      defaultValue: "all-warehouse",
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
        { id: "approved", name: "Approved" },
        { id: "pending", name: "Pending" },
      ],
      defaultValue: "all-status",
    },
  ];

  return (
    <>
      {!isFormOpen ? (
        <ListTable
          title="Inventory Openings"
          data={inventoryOpenings}
          columns={columns}
          filters={filters}
          onAdd={handleAddInventory}
          onEdit={handleEditInventory}
          onDelete={handleDeleteInventory}
          addButtonText="Add Inventory Opening"
          noDataText="No inventory openings found"
          isSearchable={true}
          isPaginated={true}
          itemsPerPage={10}
          onExport={exportData}
        />
      ) : (
        <InventoryOpeningForm
          onSave={handleSaveInventory}
          onCancel={() => setIsFormOpen(false)}
          onPrint={handlePrintInventory}
          initialData={selectedInventory}
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
              inventory opening record and remove its data from our servers.
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

export default InventoryOpeningTable;
