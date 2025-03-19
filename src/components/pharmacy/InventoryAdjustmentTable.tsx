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
import InventoryAdjustmentForm from "./InventoryAdjustmentForm";
import ListTable, { Column, Filter } from "@/components/ui/list-table";

interface InventoryAdjustment {
  id: string;
  adjustmentNo: string;
  transactionDate: string;
  warehouse: string;
  warehouseName: string;
  company: string;
  companyName: string;
  adjustmentType: string;
  remarks: string;
  totalItems: number;
  totalValue: number;
  status: string;
}

const InventoryAdjustmentTable: React.FC = () => {
  const { toast } = useToast();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedAdjustment, setSelectedAdjustment] =
    useState<InventoryAdjustment | null>(null);
  const [adjustmentToDelete, setAdjustmentToDelete] = useState<string | null>(
    null,
  );

  // Mock data for inventory adjustments
  const [inventoryAdjustments, setInventoryAdjustments] = useState<
    InventoryAdjustment[]
  >([
    {
      id: "1",
      adjustmentNo: "ADJ-123456",
      transactionDate: "2023-07-15",
      warehouse: "1",
      warehouseName: "Main Warehouse",
      company: "1",
      companyName: "Pharma Co",
      adjustmentType: "addition",
      remarks: "Stock count adjustment",
      totalItems: 5,
      totalValue: 2500,
      status: "approved",
    },
    {
      id: "2",
      adjustmentNo: "ADJ-234567",
      transactionDate: "2023-07-20",
      warehouse: "2",
      warehouseName: "Secondary Warehouse",
      company: "2",
      companyName: "MediCorp",
      adjustmentType: "subtraction",
      remarks: "Damaged inventory",
      totalItems: 3,
      totalValue: 1800,
      status: "pending",
    },
    {
      id: "3",
      adjustmentNo: "ADJ-345678",
      transactionDate: "2023-07-25",
      warehouse: "3",
      warehouseName: "Retail Store",
      company: "3",
      companyName: "HealthDrugs",
      adjustmentType: "addition",
      remarks: "Inventory reconciliation",
      totalItems: 7,
      totalValue: 3500,
      status: "approved",
    },
  ]);

  // Mock data for inventory items with batches, UOM, and rates
  const inventoryItems = [
    {
      id: "1",
      name: "Paracetamol 500mg",
      isActive: 1,
      uom: "PCS",
      batches: [
        { id: "B001", name: "B001" },
        { id: "B002", name: "B002" },
        { id: "B003", name: "B003" },
      ],
      saleRate: 450,
      purchaseRate: 400,
    },
    {
      id: "2",
      name: "Amoxicillin 250mg",
      isActive: 1,
      uom: "PCS",
      batches: [
        { id: "B001", name: "B001" },
        { id: "B002", name: "B002" },
      ],
      saleRate: 550,
      purchaseRate: 500,
    },
    {
      id: "3",
      name: "Ibuprofen 400mg",
      isActive: 1,
      uom: "PCS",
      batches: [
        { id: "B001", name: "B001" },
        { id: "B002", name: "B002" },
        { id: "B003", name: "B003" },
      ],
      saleRate: 350,
      purchaseRate: 300,
    },
    {
      id: "4",
      name: "Cetirizine 10mg",
      isActive: 1,
      uom: "PCS",
      batches: [
        { id: "B001", name: "B001" },
        { id: "B002", name: "B002" },
      ],
      saleRate: 250,
      purchaseRate: 200,
    },
    {
      id: "5",
      name: "Omeprazole 20mg",
      isActive: 1,
      uom: "PCS",
      batches: [
        { id: "B001", name: "B001" },
        { id: "B002", name: "B002" },
      ],
      saleRate: 650,
      purchaseRate: 600,
    },
  ];

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

  const adjustmentTypes = [
    { id: "addition", name: "Addition" },
    { id: "subtraction", name: "Subtraction" },
  ];

  const handleAddAdjustment = () => {
    setSelectedAdjustment(null);
    setIsFormOpen(true);
  };

  const handleEditAdjustment = (adjustment: InventoryAdjustment) => {
    setSelectedAdjustment(adjustment);
    setIsFormOpen(true);
  };

  const handleDeleteAdjustment = (id: string) => {
    setAdjustmentToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (adjustmentToDelete) {
      setInventoryAdjustments(
        inventoryAdjustments.filter((i) => i.id !== adjustmentToDelete),
      );
      toast({
        title: "Success",
        description: "Inventory adjustment deleted successfully",
        duration: 3000,
      });
      setIsDeleteDialogOpen(false);
      setAdjustmentToDelete(null);
    }
  };

  const handleSaveAdjustment = (data: any) => {
    try {
      // Ensure items have default values
      const processedItems =
        data.items?.map((item: any) => {
          if (item.itemId) {
            const selectedItem = inventoryItems.find(
              (i) => i.id === item.itemId,
            );
            if (selectedItem) {
              // Set default values based on selected item
              return {
                ...item,
                adjustedQty: item.adjustedQty || 1,
                unitCost: selectedItem.saleRate,
                totalCost: (item.adjustedQty || 1) * selectedItem.saleRate,
                uom: selectedItem.uom,
                // Set default batch if none selected
                batchNo:
                  item.batchNo ||
                  (selectedItem.batches && selectedItem.batches.length > 0
                    ? selectedItem.batches[0].id
                    : "B001"),
              };
            }
          }
          return item;
        }) || [];

      // Calculate total value from processed items
      const totalValue = processedItems.reduce(
        (sum: number, item: any) => sum + (item.totalCost || 0),
        0,
      );

      if (selectedAdjustment) {
        // Edit existing adjustment
        setInventoryAdjustments(
          inventoryAdjustments.map((i) =>
            i.id === selectedAdjustment.id
              ? {
                  ...i,
                  ...data,
                  warehouseName:
                    warehouses.find((w) => w.id === data.warehouse)?.name || "",
                  companyName:
                    companies.find((c) => c.id === data.company)?.name || "",
                  totalItems: processedItems.length || 0,
                  totalValue: totalValue || data.totals?.totalValue || 0,
                }
              : i,
          ),
        );
        toast({
          title: "Success",
          description: "Inventory adjustment updated successfully",
          duration: 3000,
        });
      } else {
        // Add new adjustment
        const newId = (
          parseInt(
            inventoryAdjustments[inventoryAdjustments.length - 1]?.id || "0",
          ) + 1
        ).toString();
        const newAdjustment = {
          id: newId,
          ...data,
          warehouseName:
            warehouses.find((w) => w.id === data.warehouse)?.name || "",
          companyName: companies.find((c) => c.id === data.company)?.name || "",
          totalItems: processedItems.length || 0,
          totalValue: totalValue || data.totals?.totalValue || 0,
          status: "pending",
        };
        setInventoryAdjustments([...inventoryAdjustments, newAdjustment]);
        toast({
          title: "Success",
          description: "Inventory adjustment created successfully",
          duration: 3000,
        });
      }
      setIsFormOpen(false);
    } catch (error) {
      console.error("Error saving adjustment:", error);
      toast({
        title: "Error",
        description:
          "An error occurred while saving the adjustment. Please try again.",
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  const handlePrintAdjustment = (data: any) => {
    // This is a placeholder for print functionality
    console.log("Printing inventory adjustment:", data);
    toast({
      title: "Print Initiated",
      description: "Inventory adjustment print job sent to printer",
      duration: 3000,
    });
  };

  const exportData = (type: "pdf" | "excel") => {
    // This is a placeholder function for export functionality
    console.log(`Exporting data as ${type}`);
    toast({
      title: "Export Initiated",
      description: `Inventory adjustments exported as ${type.toUpperCase()}`,
      duration: 3000,
    });
  };

  // Define columns for the ListTable component
  const columns: Column<InventoryAdjustment>[] = [
    {
      header: "Adjustment No",
      accessorKey: "adjustmentNo",
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
      header: "Type",
      accessorKey: "adjustmentType",
      cell: (item) => (
        <Badge
          variant={
            item.adjustmentType === "addition" ? "default" : "destructive"
          }
          className={
            item.adjustmentType === "addition" ? "bg-green-500" : "bg-red-500"
          }
        >
          {item.adjustmentType === "addition" ? "Addition" : "Subtraction"}
        </Badge>
      ),
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
  const filters: Filter<InventoryAdjustment>[] = [
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
      key: "adjustmentType",
      label: "Type",
      options: adjustmentTypes,
      defaultValue: "all-adjustmentType",
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
          title="Inventory Adjustments"
          data={inventoryAdjustments}
          columns={columns}
          filters={filters}
          onAdd={handleAddAdjustment}
          onEdit={handleEditAdjustment}
          onDelete={handleDeleteAdjustment}
          addButtonText="Add Inventory Adjustment"
          noDataText="No inventory adjustments found"
          isSearchable={true}
          isPaginated={true}
          itemsPerPage={10}
          onExport={exportData}
        />
      ) : (
        <InventoryAdjustmentForm
          onSave={handleSaveAdjustment}
          onCancel={() => setIsFormOpen(false)}
          onPrint={handlePrintAdjustment}
          initialData={selectedAdjustment}
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
              inventory adjustment record and remove its data from our servers.
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

export default InventoryAdjustmentTable;
