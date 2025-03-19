import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Printer, Save, Plus, ArrowRightLeft } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import DataTable, { Column } from "@/components/ui/data-table";
import SearchableSelect from "@/components/ui/searchable-select";
import ItemFormModal from "@/components/pharmacy/ItemFormModal";

interface InventoryTransferFormProps {
  onSave: (data: any) => void;
  onCancel: () => void;
  onPrint?: (data: any) => void;
  initialData?: any;
}

interface TransferItem {
  id: string;
  itemId: string;
  itemName: string;
  batchNo: string;
  expiryDate: string;
  availableQty: number;
  transferQty: number;
  unitCost: number;
  totalCost: number;
  remarks: string;
  uom?: string;
}

const InventoryTransferForm: React.FC<InventoryTransferFormProps> = ({
  onSave,
  onCancel,
  onPrint,
  initialData,
}) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    transferNo: "",
    transactionDate: new Date().toISOString().split("T")[0],
    sourceWarehouse: "",
    destinationWarehouse: "",
    company: "",
    remarks: "",
  });

  const [items, setItems] = useState<TransferItem[]>([]);

  const [totals, setTotals] = useState({
    totalItems: 0,
    totalValue: 0,
  });

  // Item form modal state
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [selectedItemForEdit, setSelectedItemForEdit] = useState<any>(null);

  // Mock data for warehouses, companies, and items
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
        { id: "B004", name: "B004" },
        { id: "B005", name: "B005" },
      ],
      saleRate: 450,
      purchaseRate: 400,
      availableQty: 500,
    },
    {
      id: "2",
      name: "Amoxicillin 250mg",
      isActive: 1,
      uom: "PCS",
      batches: [
        { id: "B001", name: "B001" },
        { id: "B002", name: "B002" },
        { id: "B003", name: "B003" },
        { id: "B004", name: "B004" },
        { id: "B005", name: "B005" },
      ],
      saleRate: 550,
      purchaseRate: 500,
      availableQty: 350,
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
        { id: "B004", name: "B004" },
        { id: "B005", name: "B005" },
      ],
      saleRate: 350,
      purchaseRate: 300,
      availableQty: 420,
    },
    {
      id: "4",
      name: "Cetirizine 10mg",
      isActive: 1,
      uom: "PCS",
      batches: [
        { id: "B001", name: "B001" },
        { id: "B002", name: "B002" },
        { id: "B003", name: "B003" },
        { id: "B004", name: "B004" },
        { id: "B005", name: "B005" },
      ],
      saleRate: 250,
      purchaseRate: 200,
      availableQty: 600,
    },
    {
      id: "5",
      name: "Omeprazole 20mg",
      isActive: 1,
      uom: "PCS",
      batches: [
        { id: "B001", name: "B001" },
        { id: "B002", name: "B002" },
        { id: "B003", name: "B003" },
        { id: "B004", name: "B004" },
        { id: "B005", name: "B005" },
      ],
      saleRate: 650,
      purchaseRate: 600,
      availableQty: 280,
    },
  ];

  // Initialize form with initial data if provided
  useEffect(() => {
    if (initialData) {
      setFormData({
        transferNo: initialData.transferNo || "",
        transactionDate:
          initialData.transactionDate || new Date().toISOString().split("T")[0],
        sourceWarehouse: initialData.sourceWarehouse || "",
        destinationWarehouse: initialData.destinationWarehouse || "",
        company: initialData.company || "",
        remarks: initialData.remarks || "",
      });

      if (initialData.items && initialData.items.length > 0) {
        // Process items to ensure all required fields are populated
        const processedItems = initialData.items.map((item: TransferItem) => {
          if (item.itemId) {
            const selectedItem = inventoryItems.find(
              (i) => i.id === item.itemId,
            );
            if (selectedItem) {
              // Ensure all fields are populated correctly
              return {
                ...item,
                itemName: item.itemName || selectedItem.name,
                unitCost: item.unitCost || selectedItem.purchaseRate,
                uom: item.uom || selectedItem.uom,
                batchNo:
                  item.batchNo ||
                  (selectedItem.batches && selectedItem.batches.length > 0
                    ? selectedItem.batches[0].id
                    : "B001"),
                transferQty: item.transferQty || 1,
                totalCost:
                  item.totalCost ||
                  (item.transferQty || 1) *
                    (item.unitCost || selectedItem.purchaseRate),
                expiryDate:
                  item.expiryDate || new Date().toISOString().split("T")[0],
                availableQty:
                  item.availableQty || selectedItem.availableQty || 0,
                remarks: item.remarks || "",
              };
            }
          }
          return item;
        });
        setItems(processedItems);
      } else {
        // Explicitly set empty array for items if no items in initialData
        setItems([]);
      }

      if (initialData.totals) {
        setTotals(initialData.totals);
      }
    } else {
      // Generate a new transfer number for new records
      setFormData({
        ...formData,
        transferNo: `TRF-${Math.floor(100000 + Math.random() * 900000)}`,
      });

      // Ensure items array is empty for new records
      setItems([]);
    }
  }, [initialData]);

  // Calculate totals whenever items change
  useEffect(() => {
    const totalValue = items.reduce((sum, item) => sum + item.totalCost, 0);
    setTotals({
      totalItems: items.length,
      totalValue,
    });
  }, [items]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSaveItems = (updatedItems: TransferItem[]) => {
    try {
      // Ensure all required fields are present
      const validItems = updatedItems.map((item) => {
        // If item has an ID but is missing other values, ensure they're populated with defaults
        if (item.itemId) {
          const selectedItem = inventoryItems.find((i) => i.id === item.itemId);
          if (selectedItem) {
            // Auto-fill values based on the selected item
            return {
              ...item,
              itemName: selectedItem.name,
              remarks: item.remarks || "",
              availableQty: selectedItem.availableQty || 0,
              transferQty: item.transferQty || 1, // Default to 1 if not set
              unitCost: selectedItem.purchaseRate,
              totalCost: (item.transferQty || 1) * selectedItem.purchaseRate,
              uom: selectedItem.uom,
              batchNo:
                item.batchNo ||
                (selectedItem.batches && selectedItem.batches.length > 0
                  ? selectedItem.batches[0].id
                  : "B001"),
              expiryDate:
                item.expiryDate || new Date().toISOString().split("T")[0],
            };
          }
        }
        return item;
      });

      // Update state directly
      setItems(validItems);
    } catch (error) {
      console.error("Error saving items:", error);
      toast({
        title: "Error",
        description: "An error occurred while saving items. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    if (
      !formData.sourceWarehouse ||
      !formData.destinationWarehouse ||
      !formData.company ||
      items.length === 0
    ) {
      toast({
        title: "Validation Error",
        description:
          "Please fill all required fields and add at least one item",
        variant: "destructive",
      });
      return;
    }

    // Check if source and destination warehouses are the same
    if (formData.sourceWarehouse === formData.destinationWarehouse) {
      toast({
        title: "Validation Error",
        description: "Source and destination warehouses cannot be the same",
        variant: "destructive",
      });
      return;
    }

    // Check if any item has a transfer quantity greater than available quantity
    const invalidItems = items.filter(
      (item) => item.transferQty > item.availableQty,
    );
    if (invalidItems.length > 0) {
      toast({
        title: "Validation Error",
        description: `Some items have transfer quantities exceeding available stock: ${invalidItems.map((item) => item.itemName).join(", ")}`,
        variant: "destructive",
      });
      return;
    }

    // Prepare data for submission
    const transferData = {
      ...formData,
      items,
      totals,
    };

    onSave(transferData);
  };

  // Handle saving a new item from the modal
  const handleSaveItem = (itemData: any) => {
    // Create a new inventory item from the form data
    const newItem = {
      id: itemData.id || itemData.itemCode,
      name: itemData.itemName,
      isActive: itemData.isActive ? 1 : 0,
      uom:
        itemData.uom === "1"
          ? "Tablet"
          : itemData.uom === "2"
            ? "Bottle"
            : "Box",
      batches: [
        { id: "B001", name: "B001" },
        { id: "B002", name: "B002" },
        { id: "B003", name: "B003" },
      ],
      saleRate: itemData.isPack ? itemData.packSalePrice : itemData.salePrice,
      purchaseRate: itemData.isPack
        ? itemData.packPurchasePrice
        : itemData.purchasePrice,
      availableQty: 100, // Default available quantity
    };

    // Add to the inventory items array
    inventoryItems.push(newItem);

    // Show success toast
    toast({
      title: "Success",
      description: `Item '${itemData.itemName}' added successfully`,
      duration: 3000,
    });

    // Close the modal
    setIsItemModalOpen(false);
    setSelectedItemForEdit(null);
  };

  // Define columns for the DataTable
  const columns: Column<TransferItem>[] = [
    {
      header: "Item",
      accessorKey: "itemId",
      cellType: "dropdown",
      cell: (item) => {
        const selectedItem = inventoryItems.find(
          (invItem) => invItem.id === item.itemId,
        );
        return (
          <div className="w-full">
            <SearchableSelect
              label=""
              options={inventoryItems}
              value={item.itemId || ""}
              onValueChange={(value) => {
                // When a value is selected, update the item name as well
                const selectedItem = inventoryItems.find(
                  (invItem) => invItem.id === value,
                );
                if (selectedItem) {
                  // Auto-fill all values based on the selected item
                  const updatedItem = {
                    ...item,
                    itemId: value,
                    itemName: selectedItem.name,
                    unitCost: selectedItem.purchaseRate,
                    transferQty: 1, // Set default quantity to 1
                    totalCost: 1 * selectedItem.purchaseRate, // Calculate based on default qty
                    uom: selectedItem.uom,
                    availableQty: selectedItem.availableQty || 0,
                    // Set default batch if none selected
                    batchNo:
                      selectedItem.batches && selectedItem.batches.length > 0
                        ? selectedItem.batches[0].id
                        : "B001",
                    expiryDate:
                      item.expiryDate || new Date().toISOString().split("T")[0],
                    remarks: item.remarks || "",
                  };

                  // Force immediate update with all properties
                  setItems((prevItems) => {
                    return prevItems.map((i) =>
                      i.id === item.id ? updatedItem : i,
                    );
                  });
                }
              }}
              placeholder="Select Item"
              showSelectedLabel={true}
              className="w-full"
            />
          </div>
        );
      },
      isPinned: true,
      width: "200px",
    },
    {
      header: "Batch No",
      accessorKey: "batchNo",
      cellType: "dropdown",
      cell: (item) => {
        // Get batches for the selected item
        const selectedItem = inventoryItems.find(
          (invItem) => invItem.id === item.itemId,
        );
        const batchOptions = selectedItem?.batches || [];

        return (
          <div className="w-full">
            <SearchableSelect
              label=""
              options={batchOptions}
              value={item.batchNo || ""}
              onValueChange={(value) => {
                // Update batch and recalculate total cost in a single state update
                setItems((prevItems) => {
                  return prevItems.map((i) => {
                    if (i.id === item.id) {
                      const updatedItem = {
                        ...i,
                        batchNo: value,
                        // Recalculate total cost when batch changes to ensure consistency
                        totalCost: (i.transferQty || 1) * (i.unitCost || 0),
                      };
                      return updatedItem;
                    }
                    return i;
                  });
                });
              }}
              placeholder="Select Batch"
              showSelectedLabel={true}
              className="w-full"
            />
          </div>
        );
      },
      width: "150px",
    },
    {
      header: "UOM",
      accessorKey: "uom",
      cellType: "text",
      width: "80px",
      cell: (item) => {
        const selectedItem = inventoryItems.find(
          (invItem) => invItem.id === item.itemId,
        );
        return <span>{selectedItem?.uom || ""}</span>;
      },
    },
    {
      header: "Expiry Date",
      accessorKey: "expiryDate",
      cellType: "date",
      width: "150px",
    },
    {
      header: "Available Qty",
      accessorKey: "availableQty",
      cellType: "number",
      width: "120px",
      cell: (item) => (
        <span
          className={
            item.availableQty < item.transferQty ? "text-red-600 font-bold" : ""
          }
        >
          {item.availableQty}
        </span>
      ),
    },
    {
      header: "Transfer Qty",
      accessorKey: "transferQty",
      cellType: "number",
      width: "120px",
      cell: (item) => (
        <span
          className={
            item.transferQty > item.availableQty
              ? "text-red-600 font-bold"
              : "text-blue-600"
          }
        >
          {item.transferQty}
        </span>
      ),
      onCellValueChange: (row, value) => {
        // When quantity changes, recalculate the total cost using functional update
        const qty = parseFloat(value) || 0;
        setItems((prevItems) => {
          return prevItems.map((item) => {
            if (item.id === row.id) {
              const selectedItem = inventoryItems.find(
                (invItem) => invItem.id === row.itemId,
              );

              if (selectedItem) {
                return {
                  ...item,
                  transferQty: qty,
                  totalCost: qty * (selectedItem.purchaseRate || item.unitCost),
                };
              } else {
                return {
                  ...item,
                  transferQty: qty,
                  totalCost: qty * (item.unitCost || 0),
                };
              }
            }
            return item;
          });
        });
      },
    },
    {
      header: "Unit Cost",
      accessorKey: "unitCost",
      cellType: "number",
      width: "120px",
      cell: (item) => `$${item.unitCost.toFixed(2)}`,
    },
    {
      header: "Total Cost",
      accessorKey: "totalCost",
      cellType: "number",
      width: "120px",
      cell: (item) => `$${item.totalCost.toFixed(2)}`,
    },
    {
      header: "Remarks",
      accessorKey: "remarks",
      width: "200px",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Item Form Modal */}
      <ItemFormModal
        open={isItemModalOpen}
        onOpenChange={setIsItemModalOpen}
        onSave={handleSaveItem}
        initialData={selectedItemForEdit}
      />
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={onCancel}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>
          <h2 className="text-2xl font-bold">
            {initialData ? "Edit" : "New"} Inventory Transfer
          </h2>
        </div>
        <div className="flex space-x-2">
          {onPrint && (
            <Button
              variant="outline"
              onClick={() =>
                onPrint({
                  ...formData,
                  items,
                  totals,
                })
              }
            >
              <Printer className="mr-2 h-4 w-4" /> Print
            </Button>
          )}
          <Button onClick={handleSubmit}>
            <Save className="mr-2 h-4 w-4" /> Save
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Transfer Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="transferNo">Transfer No</Label>
              <Input
                id="transferNo"
                name="transferNo"
                value={formData.transferNo}
                onChange={handleInputChange}
                readOnly
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="transactionDate">Date</Label>
              <Input
                id="transactionDate"
                name="transactionDate"
                type="date"
                value={formData.transactionDate}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="company">Company</Label>
              <Select
                value={formData.company}
                onValueChange={(value) => handleSelectChange("company", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Company" />
                </SelectTrigger>
                <SelectContent>
                  {companies.map((company) => (
                    <SelectItem key={company.id} value={company.id}>
                      {company.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="sourceWarehouse">From Warehouse</Label>
              <div className="flex items-center gap-2">
                <div className="flex-grow">
                  <Select
                    value={formData.sourceWarehouse}
                    onValueChange={(value) =>
                      handleSelectChange("sourceWarehouse", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Source Warehouse" />
                    </SelectTrigger>
                    <SelectContent>
                      {warehouses.map((warehouse) => (
                        <SelectItem key={warehouse.id} value={warehouse.id}>
                          {warehouse.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="destinationWarehouse">To Warehouse</Label>
              <div className="flex items-center gap-2">
                <div className="flex-grow">
                  <Select
                    value={formData.destinationWarehouse}
                    onValueChange={(value) =>
                      handleSelectChange("destinationWarehouse", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Destination Warehouse" />
                    </SelectTrigger>
                    <SelectContent>
                      {warehouses.map((warehouse) => (
                        <SelectItem key={warehouse.id} value={warehouse.id}>
                          {warehouse.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => {
                    // Swap source and destination warehouses
                    if (
                      formData.sourceWarehouse &&
                      formData.destinationWarehouse
                    ) {
                      setFormData({
                        ...formData,
                        sourceWarehouse: formData.destinationWarehouse,
                        destinationWarehouse: formData.sourceWarehouse,
                      });
                      toast({
                        title: "Warehouses Swapped",
                        description:
                          "Source and destination warehouses have been swapped.",
                        duration: 2000,
                      });
                    } else {
                      toast({
                        title: "Cannot Swap",
                        description: "Please select both warehouses first.",
                        variant: "destructive",
                        duration: 2000,
                      });
                    }
                  }}
                  title="Swap warehouses"
                >
                  <ArrowRightLeft className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="remarks">Remarks</Label>
              <Textarea
                id="remarks"
                name="remarks"
                value={formData.remarks}
                onChange={handleInputChange}
                rows={1}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Items</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            data={items}
            columns={columns}
            onSave={handleSaveItems}
            disableSaveAnimation={true}
            isSearchable={true}
            isSortable={true}
            isFilterable={true}
            isPaginated={true}
            addStartEntry={false}
            addButtonText="Add Item"
            noDataText="No items added yet. Click 'Add Item' to start."
            loadingText="Loading items..."
            keyboardShortcuts={true}
            initialSortColumn="itemName"
            initialSortDirection="asc"
            enableExport={true}
            horizontalScroll={true}
            enableColumnConfiguration={true}
            defaultPinnedColumns={[
              "itemId",
              "batchNo",
              "uom",
              "availableQty",
              "transferQty",
              "unitCost",
              "totalCost",
            ]}
            onExportPdf={(data) => {
              console.log("Exporting to PDF:", data);
              toast({
                title: "Export Started",
                description: "Exporting items to PDF",
              });
            }}
            onExportExcel={(data) => {
              console.log("Exporting to Excel:", data);
              toast({
                title: "Export Started",
                description: "Exporting items to Excel",
              });
            }}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Total Items
              </p>
              <p className="text-2xl font-bold">{totals.totalItems}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Total Value
              </p>
              <p className="text-2xl font-bold">
                ${totals.totalValue.toFixed(2)}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Status
              </p>
              <Badge className="mt-1 bg-amber-500">In Transit</Badge>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                From → To
              </p>
              <div className="flex items-center mt-1">
                <span className="font-medium">
                  {warehouses.find((w) => w.id === formData.sourceWarehouse)
                    ?.name || "Source"}
                </span>
                <ArrowRightLeft className="mx-2 h-4 w-4 text-muted-foreground" />
                <span className="font-medium">
                  {warehouses.find(
                    (w) => w.id === formData.destinationWarehouse,
                  )?.name || "Destination"}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InventoryTransferForm;
