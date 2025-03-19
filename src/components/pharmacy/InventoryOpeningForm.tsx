import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Save, X, Printer, Plus } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import FormField from "@/components/ui/form-field";
import SearchableSelect from "@/components/ui/searchable-select";
import DataTable, { Column } from "@/components/ui/data-table";
import ItemFormModal from "@/components/pharmacy/ItemFormModal";

interface InventoryItem {
  id: string;
  itemId: string;
  itemName: string;
  uom: string;
  isPack: boolean;
  qty: number;
  saleRate: number;
  purchaseRate: number;
  batchNo: string;
  expiryDate: string;
  gst: number;
  value: number;
}

interface InventoryOpeningFormProps {
  onSave: (data: any) => void;
  onCancel: () => void;
  onPrint?: (data: any) => void;
  initialData?: any;
}

const InventoryOpeningForm: React.FC<InventoryOpeningFormProps> = ({
  onSave,
  onCancel,
  onPrint,
  initialData,
}) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    openingNo: "",
    transactionDate: new Date().toISOString().split("T")[0],
    warehouse: "1", // Default to first warehouse
    company: "1", // Default to first company
    remarks: "",
  });

  // Inventory items
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);

  // Totals
  const [totals, setTotals] = useState({
    totalGST: 0,
    totalValue: 0,
    totalInvoiceValue: 0,
  });

  // Validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Item form modal state
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [selectedItemForEdit, setSelectedItemForEdit] = useState<any>(null);

  // Mock data for dropdowns
  const [warehouses, setWarehouses] = useState([
    { id: "1", name: "Main Warehouse" },
    { id: "2", name: "Secondary Warehouse" },
    { id: "3", name: "Retail Store" },
  ]);

  const [companies, setCompanies] = useState([
    { id: "1", name: "Pharma Co" },
    { id: "2", name: "MediCorp" },
    { id: "3", name: "HealthDrugs" },
  ]);

  // Mock data for items
  const [items, setItems] = useState([
    {
      id: "1",
      itemCode: "PCM500",
      itemName: "Paracetamol 500mg",
      genericName: "Paracetamol",
      uom: "Tablet",
      isPack: true,
      packQty: 10,
      packSalePrice: 50,
      packPurchasePrice: 40,
      salePrice: 5,
      purchasePrice: 4,
      gst: 5,
      isActive: true,
    },
    {
      id: "2",
      itemCode: "AMX250",
      itemName: "Amoxicillin 250mg",
      genericName: "Amoxicillin",
      uom: "Capsule",
      isPack: true,
      packQty: 12,
      packSalePrice: 120,
      packPurchasePrice: 96,
      salePrice: 10,
      purchasePrice: 8,
      gst: 12,
      isActive: true,
    },
    {
      id: "3",
      itemCode: "VTC",
      itemName: "Vitamin C 500mg",
      genericName: "Ascorbic Acid",
      uom: "Tablet",
      isPack: false,
      packQty: 30,
      packSalePrice: 150,
      packPurchasePrice: 120,
      salePrice: 5,
      purchasePrice: 4,
      gst: 5,
      isActive: true,
    },
    {
      id: "4",
      itemCode: "AZTH500",
      itemName: "Azithromycin 500mg",
      genericName: "Azithromycin",
      uom: "Tablet",
      isPack: true,
      packQty: 6,
      packSalePrice: 180,
      packPurchasePrice: 150,
      salePrice: 30,
      purchasePrice: 25,
      gst: 12,
      isActive: true,
    },
    {
      id: "5",
      itemCode: "CETRZN",
      itemName: "Cetirizine 10mg",
      genericName: "Cetirizine",
      uom: "Tablet",
      isPack: true,
      packQty: 10,
      packSalePrice: 35,
      packPurchasePrice: 28,
      salePrice: 3.5,
      purchasePrice: 2.8,
      gst: 5,
      isActive: true,
    },
  ]);

  // Default batch number (would come from configuration)
  const defaultBatchNo = "DEFAULT";

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
      if (initialData.items) {
        setInventoryItems(initialData.items);
      }
    }

    // Generate a new opening number if not provided
    if (!formData.openingNo) {
      const timestamp = new Date().getTime();
      setFormData((prev) => ({
        ...prev,
        openingNo: `OP-${timestamp.toString().slice(-6)}`,
      }));
    }
  }, [initialData]);

  // Calculate totals whenever inventory items change
  useEffect(() => {
    const gstSum = inventoryItems.reduce(
      (sum, item) => sum + (item.value * item.gst) / 100,
      0,
    );
    const valueSum = inventoryItems.reduce((sum, item) => sum + item.value, 0);
    const invoiceSum = gstSum + valueSum;

    setTotals({
      totalGST: parseFloat(gstSum.toFixed(2)),
      totalValue: parseFloat(valueSum.toFixed(2)),
      totalInvoiceValue: parseFloat(invoiceSum.toFixed(2)),
    });
  }, [inventoryItems]);

  const handleChange = (field: string, value: any) => {
    console.log(`Changing ${field} to:`, value);
    setFormData((prev) => {
      const newData = {
        ...prev,
        [field]: value,
      };
      console.log("New form data:", newData);
      return newData;
    });
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Required fields validation
    if (!formData.openingNo.trim()) {
      newErrors.openingNo = "Opening No is required";
    }

    if (!formData.transactionDate) {
      newErrors.transactionDate = "Transaction Date is required";
    }

    if (!formData.warehouse) {
      newErrors.warehouse = "Warehouse is required";
    }

    if (!formData.company) {
      newErrors.company = "Company is required";
    }

    // Validate inventory items
    if (inventoryItems.length === 0) {
      newErrors.items = "At least one inventory item is required";
    }

    // Validate each inventory item
    inventoryItems.forEach((item, index) => {
      if (!item.itemId) {
        newErrors[`item_${index}_itemId`] = "Item selection is required";
      }
      if (!item.qty || item.qty <= 0) {
        newErrors[`item_${index}_qty`] = "Quantity must be greater than 0";
      }
      // Set default batch number if not provided
      if (!item.batchNo) {
        // Auto-assign default batch instead of showing error
        const updatedItems = [...inventoryItems];
        updatedItems[index] = {
          ...item,
          batchNo: defaultBatchNo,
        };
        setInventoryItems(updatedItems);
      }
      // Set default expiry date if not provided
      if (!item.expiryDate) {
        // Auto-assign default expiry date instead of showing error
        const currentDate = new Date();
        const defaultExpiryDate = new Date(
          currentDate.setFullYear(currentDate.getFullYear() + 1),
        )
          .toISOString()
          .split("T")[0];

        const updatedItems = [...inventoryItems];
        updatedItems[index] = {
          ...item,
          expiryDate: defaultExpiryDate,
        };
        setInventoryItems(updatedItems);
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent, shouldPrint: boolean = false) => {
    e.preventDefault();

    if (validateForm()) {
      const dataToSave = {
        ...formData,
        items: inventoryItems,
        totals,
      };

      onSave(dataToSave);
      toast({
        title: "Success",
        description: "Inventory opening saved successfully",
        duration: 3000,
      });

      if (shouldPrint && onPrint) {
        onPrint(dataToSave);
      }
    } else {
      toast({
        title: "Error",
        description: "Please fix the errors in the form",
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  const handleAddWarehouse = (name: string) => {
    const newId = (
      parseInt(warehouses[warehouses.length - 1].id) + 1
    ).toString();
    const newWarehouse = { id: newId, name };
    setWarehouses([...warehouses, newWarehouse]);
    setFormData({ ...formData, warehouse: newId });
  };

  const handleAddCompany = (name: string) => {
    const newId = (parseInt(companies[companies.length - 1].id) + 1).toString();
    const newCompany = { id: newId, name };
    setCompanies([...companies, newCompany]);
    setFormData({ ...formData, company: newId });
  };

  // Handle inventory item changes in the data table
  const handleInventoryItemsChange = (updatedItems: InventoryItem[]) => {
    console.log("handleInventoryItemsChange called with:", updatedItems);

    // Ensure all numeric values are non-negative
    const sanitizedItems = updatedItems.map((item) => {
      // If this is a new item with an itemId but missing other values, populate them
      if (item.itemId && (!item.itemName || !item.uom)) {
        const selectedItem = items.find((i) => i.id === item.itemId);
        if (selectedItem) {
          console.log("Found selected item for population:", selectedItem);
          const isPack =
            item.isPack !== undefined ? item.isPack : selectedItem.isPack;
          const saleRate = isPack
            ? selectedItem.packSalePrice
            : selectedItem.salePrice;
          const purchaseRate = isPack
            ? selectedItem.packPurchasePrice
            : selectedItem.purchasePrice;
          const qty = Math.max(1, item.qty || 1); // Default to 1 if not set
          const value = qty * purchaseRate;

          // Set default batch and expiry date if not already set
          const currentDate = new Date();
          const expiryDate =
            item.expiryDate || currentDate.toISOString().split("T")[0];

          return {
            ...item,
            itemName: selectedItem.itemName,
            uom: selectedItem.uom,
            isPack: isPack,
            saleRate: saleRate,
            purchaseRate: purchaseRate,
            gst: selectedItem.gst,
            value: value,
            qty: qty,
            batchNo: item.batchNo || defaultBatchNo,
            expiryDate: expiryDate,
          };
        }
      }

      return {
        ...item,
        qty: Math.max(1, item.qty || 1), // Default to 1 if not set
        saleRate: Math.max(0, item.saleRate || 0),
        purchaseRate: Math.max(0, item.purchaseRate || 0),
        gst: Math.max(0, Math.min(100, item.gst || 0)),
        value: Math.max(0, item.value || 0),
        batchNo: item.batchNo || defaultBatchNo,
      };
    });

    // Log for debugging
    console.log("Sanitized items:", sanitizedItems);

    // Update state directly without setTimeout to prevent duplicate rows
    setInventoryItems(sanitizedItems);
  };

  // Update item rates and value based on isPack selection
  const updateItemRatesAndValue = (item: InventoryItem, isPack: boolean) => {
    const selectedItem = items.find((i) => i.id === item.itemId);
    if (!selectedItem) return item;

    const saleRate = isPack
      ? selectedItem.packSalePrice
      : selectedItem.salePrice;
    const purchaseRate = isPack
      ? selectedItem.packPurchasePrice
      : selectedItem.purchasePrice;
    const qty = Math.max(0, item.qty || 0); // Ensure non-negative quantity
    const value = qty * purchaseRate;

    return {
      ...item,
      isPack,
      saleRate,
      purchaseRate,
      value,
    };
  };

  // Calculate item value based on quantity and purchase rate
  const calculateItemValue = (
    qty: number,
    purchaseRate: number,
    gst: number,
  ) => {
    // Ensure all values are non-negative
    const safeQty = Math.max(0, qty || 0);
    const safePurchaseRate = Math.max(0, purchaseRate || 0);
    const safeGst = Math.max(0, Math.min(100, gst || 0));

    const baseValue = safeQty * safePurchaseRate;
    const gstAmount = (baseValue * safeGst) / 100;
    const totalValue = baseValue + gstAmount;
    return {
      value: baseValue,
      gstAmount,
      totalValue,
    };
  };

  // Mock batch numbers for dropdown
  const [batchNumbers, setBatchNumbers] = useState([
    { id: "DEFAULT", name: "DEFAULT" },
    { id: "BATCH001", name: "BATCH001" },
    { id: "BATCH002", name: "BATCH002" },
    { id: "BATCH003", name: "BATCH003" },
  ]);

  const handleAddBatchNumber = (name: string) => {
    const newBatch = { id: name, name };
    setBatchNumbers([...batchNumbers, newBatch]);
    return name;
  };

  // Columns for the inventory items data table
  const inventoryColumns: Column<InventoryItem>[] = [
    {
      header: "Pack",
      accessorKey: "isPack",
      cell: (item) => (
        <Checkbox
          checked={item.isPack}
          onCheckedChange={(checked) => {
            const selectedItem = items.find((i) => i.id === item.itemId);
            if (selectedItem) {
              const updatedItem = updateItemRatesAndValue(
                item,
                checked === true,
              );
              const updatedItems = inventoryItems.map((i) =>
                i.id === item.id ? updatedItem : i,
              );
              setInventoryItems(updatedItems);
            }
          }}
        />
      ),
      cellType: "checkbox",
      isPinned: true,
      width: "80px",
    },
    {
      header: "Item",
      accessorKey: "itemName",
      isPinned: true,
      width: "250px",
      cell: (item) => {
        const itemOptions = items.map((i) => ({ id: i.id, name: i.itemName }));
        return (
          <SearchableSelect
            label=""
            options={itemOptions}
            value={item.itemId || ""}
            onValueChange={(val) => {
              console.log("Item selected:", val);
              // Immediately update the item ID to ensure the UI reflects the selection
              const updatedItems = [...inventoryItems];
              const itemIndex = updatedItems.findIndex((i) => i.id === item.id);

              if (itemIndex !== -1) {
                // First update just the itemId to ensure the dropdown shows the selection
                updatedItems[itemIndex] = {
                  ...updatedItems[itemIndex],
                  itemId: val,
                };
                setInventoryItems([...updatedItems]);

                // Then use setTimeout to update the rest of the item properties
                setTimeout(() => {
                  const selectedItem = items.find((i) => i.id === val);
                  if (selectedItem) {
                    console.log("Found selected item:", selectedItem);
                    // Calculate value based on quantity and purchase rate
                    const isPack = selectedItem.isPack;
                    const saleRate = isPack
                      ? selectedItem.packSalePrice
                      : selectedItem.salePrice;
                    const purchaseRate = isPack
                      ? selectedItem.packPurchasePrice
                      : selectedItem.purchasePrice;
                    // Always default to 1 for new items
                    const qty = 1;
                    const value = qty * purchaseRate;

                    // Set default batch and expiry date if not already set
                    const currentDate = new Date();
                    // Set expiry date to 1 year from now by default
                    const oneYearFromNow = new Date();
                    oneYearFromNow.setFullYear(
                      oneYearFromNow.getFullYear() + 1,
                    );
                    const expiryDate = oneYearFromNow
                      .toISOString()
                      .split("T")[0];

                    const updatedItem = {
                      ...updatedItems[itemIndex],
                      itemName: selectedItem.itemName,
                      uom: selectedItem.uom,
                      isPack: isPack,
                      saleRate: saleRate,
                      purchaseRate: purchaseRate,
                      gst: selectedItem.gst,
                      value: value,
                      qty: qty,
                      batchNo: defaultBatchNo,
                      expiryDate: expiryDate,
                    };

                    console.log(
                      "Updated item with all properties:",
                      updatedItem,
                    );

                    // Update the item with all properties
                    const finalUpdatedItems = [...inventoryItems];
                    const finalItemIndex = finalUpdatedItems.findIndex(
                      (i) => i.id === item.id,
                    );

                    if (finalItemIndex !== -1) {
                      finalUpdatedItems[finalItemIndex] = updatedItem;
                      console.log(
                        "Setting inventory items with all properties:",
                        finalUpdatedItems,
                      );
                      setInventoryItems([...finalUpdatedItems]);
                    }
                  }
                }, 50);
              } else {
                console.error("Could not find item with id:", item.id);
              }
            }}
            onAddNew={() => {
              // Open the item modal directly with default values
              setSelectedItemForEdit({
                itemName: "",
                isPack: false,
                packQty: 1,
                packPurchasePrice: 0,
                packSalePrice: 0,
                purchaseRatePercentage: 15,
                purchasePrice: 0,
                salePrice: 0,
                isActive: true,
                maxSaleDiscount: 0,
                gst: 0,
              });
              setIsItemModalOpen(true);
            }}
            addNewTitle=""
            addNewButtonLabel=""
            placeholder="Select Item"
            className="w-full"
            error={errors[`item_${item.id}_itemId`]}
            autoFocus
            showSelectedLabel={true}
          />
        );
      },
      cellType: "dropdown",
    },
    {
      header: "UOM",
      accessorKey: "uom",
      cellType: "text",
      isPinned: true,
      width: "100px",
    },
    {
      header: "Qty",
      accessorKey: "qty",
      isPinned: true,
      width: "100px",
      cell: (item) => (
        <Input
          type="number"
          min={0}
          value={item.qty || 0}
          onChange={(e) => {
            // Ensure non-negative values
            const inputValue = e.target.value;
            const qty =
              inputValue === "" ? 0 : Math.max(0, parseFloat(inputValue) || 0);

            const { value } = calculateItemValue(
              qty,
              item.purchaseRate,
              item.gst,
            );
            const updatedItem = {
              ...item,
              qty,
              value,
            };
            const updatedItems = inventoryItems.map((i) =>
              i.id === item.id ? updatedItem : i,
            );
            setInventoryItems(updatedItems);
          }}
          className="w-full"
          error={errors[`item_${item.id}_qty`]}
        />
      ),
      cellType: "number",
    },
    {
      header: "Sale Rate",
      accessorKey: "saleRate",
      isPinned: true,
      width: "120px",
      cell: (item) => (
        <Input
          type="number"
          min={0}
          step="0.01"
          value={item.saleRate || 0}
          onChange={(e) => {
            // Ensure non-negative values
            const inputValue = e.target.value;
            const saleRate =
              inputValue === "" ? 0 : Math.max(0, parseFloat(inputValue) || 0);

            const updatedItem = {
              ...item,
              saleRate,
            };
            const updatedItems = inventoryItems.map((i) =>
              i.id === item.id ? updatedItem : i,
            );
            setInventoryItems(updatedItems);
          }}
          className="w-full"
        />
      ),
      cellType: "number",
    },
    {
      header: "Purchase Rate",
      accessorKey: "purchaseRate",
      isPinned: true,
      width: "140px",
      cell: (item) => (
        <Input
          type="number"
          min={0}
          step="0.01"
          value={item.purchaseRate || 0}
          onChange={(e) => {
            // Ensure non-negative values
            const inputValue = e.target.value;
            const purchaseRate =
              inputValue === "" ? 0 : Math.max(0, parseFloat(inputValue) || 0);

            const { value } = calculateItemValue(
              item.qty,
              purchaseRate,
              item.gst,
            );
            const updatedItem = {
              ...item,
              purchaseRate,
              value,
            };
            const updatedItems = inventoryItems.map((i) =>
              i.id === item.id ? updatedItem : i,
            );
            setInventoryItems(updatedItems);
          }}
          className="w-full"
        />
      ),
      cellType: "number",
    },
    {
      header: "Batch No",
      accessorKey: "batchNo",
      width: "150px",
      cell: (item) => (
        <SearchableSelect
          label=""
          options={batchNumbers}
          value={item.batchNo || defaultBatchNo}
          onValueChange={(val) => {
            console.log("Batch selected:", val);
            // Immediately update the batchNo to ensure the UI reflects the selection
            const updatedItems = [...inventoryItems];
            const itemIndex = updatedItems.findIndex((i) => i.id === item.id);

            if (itemIndex !== -1) {
              updatedItems[itemIndex] = {
                ...updatedItems[itemIndex],
                batchNo: val || defaultBatchNo,
              };

              console.log(
                "Setting inventory items with new batch:",
                updatedItems,
              );
              // Force a re-render by creating a new array
              setInventoryItems([...updatedItems]);
            } else {
              console.error(
                "Could not find item with id for batch update:",
                item.id,
              );
            }
          }}
          onAddNew={handleAddBatchNumber}
          addNewTitle="Add New Batch"
          addNewDescription="Enter the new batch number"
          addNewInputLabel="Batch Number"
          addNewButtonLabel="Add Batch"
          placeholder="Select Batch"
          className="w-full"
          error={errors[`item_${item.id}_batchNo`]}
          showSelectedLabel={true}
        />
      ),
      cellType: "dropdown",
    },
    {
      header: "Expiry Date",
      accessorKey: "expiryDate",
      width: "150px",
      cell: (item) => (
        <Input
          type="date"
          value={item.expiryDate || ""}
          onChange={(e) => {
            console.log("Expiry date changed:", e.target.value);
            const updatedItem = {
              ...item,
              expiryDate: e.target.value,
            };

            // Important: Create a new array instead of modifying the existing one
            const updatedItems = [...inventoryItems];
            const itemIndex = updatedItems.findIndex((i) => i.id === item.id);

            if (itemIndex !== -1) {
              updatedItems[itemIndex] = updatedItem;
              console.log(
                "Setting inventory items with new expiry date:",
                updatedItems,
              );
              setInventoryItems(updatedItems);
            } else {
              console.error(
                "Could not find item with id for expiry date update:",
                item.id,
              );
            }
          }}
          className="w-full"
          error={errors[`item_${item.id}_expiryDate`]}
        />
      ),
      cellType: "date",
    },
    {
      header: "GST %",
      accessorKey: "gst",
      width: "100px",
      cell: (item) => (
        <Input
          type="number"
          min={0}
          max={100}
          value={item.gst || 0}
          onChange={(e) => {
            // Ensure non-negative values and max 100
            const inputValue = e.target.value;
            const gst =
              inputValue === ""
                ? 0
                : Math.min(100, Math.max(0, parseFloat(inputValue) || 0));

            const { value } = calculateItemValue(
              item.qty,
              item.purchaseRate,
              gst,
            );
            const updatedItem = {
              ...item,
              gst,
              value,
            };
            const updatedItems = inventoryItems.map((i) =>
              i.id === item.id ? updatedItem : i,
            );
            setInventoryItems(updatedItems);
          }}
          className="w-full"
        />
      ),
      cellType: "number",
    },
    {
      header: "Value",
      accessorKey: "value",
      width: "120px",
      cell: (item) => (
        <div className="text-right font-medium">
          {(item.value || 0).toFixed(2)}
        </div>
      ),
      cellType: "text",
    },
  ];

  // Handle saving a new item from the modal
  const handleSaveItem = (itemData: any) => {
    console.log("New item saved:", itemData);

    // Add the new item to the items list
    const newItem = {
      id: itemData.id || itemData.itemCode,
      itemCode: itemData.itemCode,
      itemName: itemData.itemName,
      genericName: itemData.genericName,
      uom:
        itemData.uom === "1"
          ? "Tablet"
          : itemData.uom === "2"
            ? "Bottle"
            : "Box",
      isPack: itemData.isPack,
      packQty: itemData.packQty,
      packSalePrice: itemData.packSalePrice,
      packPurchasePrice: itemData.packPurchasePrice,
      salePrice: itemData.salePrice,
      purchasePrice: itemData.purchasePrice,
      gst: itemData.gst,
      isActive: itemData.isActive,
    };

    // Add to the items array
    setItems((prevItems) => [...prevItems, newItem]);

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

  return (
    <form onSubmit={(e) => handleSubmit(e)}>
      {/* Item Form Modal */}
      <ItemFormModal
        open={isItemModalOpen}
        onOpenChange={setIsItemModalOpen}
        onSave={handleSaveItem}
        initialData={selectedItemForEdit}
      />

      <Card className="w-full">
        <CardHeader>
          <CardTitle>Inventory Opening</CardTitle>
          <CardDescription>
            Enter the details of the inventory opening transaction
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Master Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <FormField
              id="openingNo"
              label="Opening No"
              value={formData.openingNo}
              onChange={(value) => handleChange("openingNo", value)}
              error={errors.openingNo}
              required
              disabled
            />

            <FormField
              id="transactionDate"
              label="Transaction Date"
              value={formData.transactionDate}
              onChange={(value) => handleChange("transactionDate", value)}
              type="date"
              error={errors.transactionDate}
              required
            />

            <SearchableSelect
              label="Warehouse"
              options={warehouses}
              value={formData.warehouse}
              onValueChange={(val) => {
                console.log("Warehouse selected:", val);
                // Immediately update the value to ensure the UI reflects the selection
                handleChange("warehouse", val);
              }}
              onAddNew={handleAddWarehouse}
              addNewTitle="Add New Warehouse"
              addNewDescription="Enter the name of the new warehouse"
              addNewInputLabel="Warehouse Name"
              addNewButtonLabel="Add Warehouse"
              required
              error={errors.warehouse}
              showSelectedLabel={true}
            />

            <SearchableSelect
              label="Company"
              options={companies}
              value={formData.company}
              onValueChange={(val) => {
                console.log("Company selected:", val);
                // Immediately update the value to ensure the UI reflects the selection
                handleChange("company", val);
              }}
              onAddNew={handleAddCompany}
              addNewTitle="Add New Company"
              addNewDescription="Enter the name of the new company"
              addNewInputLabel="Company Name"
              addNewButtonLabel="Add Company"
              required
              error={errors.company}
              showSelectedLabel={true}
            />
          </div>

          <FormField
            id="remarks"
            label="Remarks"
            value={formData.remarks}
            onChange={(value) => handleChange("remarks", value)}
            className="w-full"
          />

          <Separator />

          {/* Inventory Items Table */}
          <div>
            <Label className="mb-2 block">Inventory Items</Label>
            {errors.items && (
              <p className="text-sm text-red-500 mb-2">{errors.items}</p>
            )}
            <DataTable
              data={inventoryItems}
              columns={inventoryColumns}
              onSave={handleInventoryItemsChange}
              isSearchable={false}
              addButtonText="Add Item"
              keyboardShortcuts={true}
              addStartEntry={false}
              noDataText="No inventory items added yet"
              enableColumnConfiguration={true}
              disableSaveAnimation={true}
              defaultPinnedColumns={[
                "isPack",
                "itemName",
                "uom",
                "qty",
                "saleRate",
                "purchaseRate",
              ]}
              horizontalScroll={true}
            />
          </div>

          <Separator />

          {/* Totals */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-start-2">
              <FormField
                id="totalGST"
                label="Total GST"
                value={totals.totalGST.toFixed(2)}
                onChange={() => {}}
                disabled
              />
            </div>
            <div>
              <FormField
                id="totalValue"
                label="Total Value"
                value={totals.totalValue.toFixed(2)}
                onChange={() => {}}
                disabled
              />
            </div>
            <div className="md:col-start-3">
              <FormField
                id="totalInvoiceValue"
                label="Total Invoice Value"
                value={totals.totalInvoiceValue.toFixed(2)}
                onChange={() => {}}
                disabled
                className="font-bold"
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end gap-2">
          <Button variant="outline" type="button" onClick={onCancel}>
            <X className="mr-2 h-4 w-4" /> Cancel
          </Button>
          <Button type="submit">
            <Save className="mr-2 h-4 w-4" /> Save
          </Button>
          {onPrint && (
            <Button
              type="button"
              onClick={(e) => handleSubmit(e, true)}
              variant="secondary"
            >
              <Printer className="mr-2 h-4 w-4" /> Save & Print
            </Button>
          )}
        </CardFooter>
      </Card>
    </form>
  );
};

export default InventoryOpeningForm;
