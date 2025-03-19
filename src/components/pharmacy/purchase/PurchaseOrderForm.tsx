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
import { ArrowLeft, Printer, Save, Plus } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import DataTable, { Column } from "@/components/ui/data-table";
import SearchableSelect from "@/components/ui/searchable-select";
import ItemFormModal from "@/components/pharmacy/ItemFormModal";
import { useNavigate, useParams } from "react-router-dom";

interface PurchaseOrderFormProps {
  onSave?: (data: any) => void;
  onCancel?: () => void;
  onPrint?: (data: any) => void;
  initialData?: any;
}

interface PurchaseOrderItem {
  id: string;
  itemId: string;
  itemName: string;
  uom: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  tax: number;
  total: number;
}

const PurchaseOrderForm: React.FC<PurchaseOrderFormProps> = ({
  onSave,
  onCancel,
  onPrint,
  initialData,
}) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;

  const [formData, setFormData] = useState({
    poNumber: "",
    date: new Date().toISOString().split("T")[0],
    expectedDelivery: "",
    companyId: "",
    warehouseId: "",
    status: "pending",
    notes: "",
  });

  const [items, setItems] = useState<PurchaseOrderItem[]>([]);

  const [totals, setTotals] = useState({
    subtotal: 0,
    discount: 0,
    tax: 0,
    total: 0,
  });

  // Item form modal state
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [selectedItemForEdit, setSelectedItemForEdit] = useState<any>(null);

  // Mock data for warehouses, companies, and items
  const warehouses = [
    { id: "wh1", name: "Main Warehouse" },
    { id: "wh2", name: "Secondary Storage" },
    { id: "wh3", name: "Retail Outlet Storage" },
  ];

  const companies = [
    { id: "comp1", name: "ABC Pharmaceuticals" },
    { id: "comp2", name: "MedLife Supplies" },
    { id: "comp3", name: "HealthCare Products" },
    { id: "comp4", name: "Pharma Solutions" },
    { id: "comp5", name: "MediTech Inc." },
  ];

  const inventoryItems = [
    {
      id: "item1",
      name: "Paracetamol 500mg",
      uom: "Strip",
      saleRate: 10,
      purchaseRate: 8,
      batches: [
        { id: "B001", name: "B001" },
        { id: "B002", name: "B002" },
      ],
    },
    {
      id: "item2",
      name: "Amoxicillin 250mg",
      uom: "Bottle",
      saleRate: 15,
      purchaseRate: 12,
      batches: [
        { id: "B001", name: "B001" },
        { id: "B002", name: "B002" },
      ],
    },
    {
      id: "item3",
      name: "Vitamin C 1000mg",
      uom: "Tablet",
      saleRate: 8,
      purchaseRate: 6,
      batches: [
        { id: "B001", name: "B001" },
        { id: "B002", name: "B002" },
      ],
    },
    {
      id: "item4",
      name: "Ibuprofen 400mg",
      uom: "Strip",
      saleRate: 12,
      purchaseRate: 9,
      batches: [
        { id: "B001", name: "B001" },
        { id: "B002", name: "B002" },
      ],
    },
    {
      id: "item5",
      name: "Omeprazole 20mg",
      uom: "Capsule",
      saleRate: 18,
      purchaseRate: 14,
      batches: [
        { id: "B001", name: "B001" },
        { id: "B002", name: "B002" },
      ],
    },
  ];

  // Initialize form with initial data if provided
  useEffect(() => {
    if (initialData) {
      setFormData({
        poNumber: initialData.poNumber || "",
        date: initialData.date || new Date().toISOString().split("T")[0],
        expectedDelivery: initialData.expectedDelivery || "",
        companyId: initialData.companyId || "",
        warehouseId: initialData.warehouseId || "",
        status: initialData.status || "pending",
        notes: initialData.notes || "",
      });

      if (initialData.items && initialData.items.length > 0) {
        setItems(initialData.items);
      }
    } else if (id) {
      // Load data if editing
      if (id === "PO-001") {
        setFormData({
          poNumber: "PO-001",
          date: "2023-06-15",
          expectedDelivery: "2023-06-25",
          companyId: "comp1",
          warehouseId: "wh1",
          status: "pending",
          notes: "Urgent delivery needed",
        });

        setItems([
          {
            id: "1",
            itemId: "item1",
            itemName: "Paracetamol 500mg",
            uom: "Strip",
            quantity: 100,
            unitPrice: 5,
            discount: 2,
            tax: 5,
            total: 490,
          },
          {
            id: "2",
            itemId: "item3",
            itemName: "Vitamin C 1000mg",
            uom: "Tablet",
            quantity: 50,
            unitPrice: 8,
            discount: 0,
            tax: 5,
            total: 420,
          },
        ]);
      }
    } else {
      // Generate a new PO number for new records
      setFormData({
        ...formData,
        poNumber: `PO-${Math.floor(100000 + Math.random() * 900000)}`,
      });
    }
  }, [initialData, id]);

  // Calculate totals whenever items change
  useEffect(() => {
    const subtotal = items.reduce(
      (sum, item) => sum + item.quantity * item.unitPrice,
      0,
    );

    const discountTotal = items.reduce((sum, item) => {
      const itemSubtotal = item.quantity * item.unitPrice;
      return sum + (itemSubtotal * item.discount) / 100;
    }, 0);

    const taxTotal = items.reduce((sum, item) => {
      const itemSubtotal = item.quantity * item.unitPrice;
      const afterDiscount = itemSubtotal - (itemSubtotal * item.discount) / 100;
      return sum + (afterDiscount * item.tax) / 100;
    }, 0);

    const total = subtotal - discountTotal + taxTotal;

    setTotals({
      subtotal: Math.round(subtotal * 100) / 100,
      discount: Math.round(discountTotal * 100) / 100,
      tax: Math.round(taxTotal * 100) / 100,
      total: Math.round(total * 100) / 100,
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

  const handleSaveItems = (updatedItems: PurchaseOrderItem[]) => {
    try {
      console.log("Saving updated items:", updatedItems);
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
              uom: selectedItem.uom,
              quantity: item.quantity || 1,
              unitPrice: item.unitPrice || selectedItem.purchaseRate,
              discount: item.discount || 0,
              tax: item.tax || 0,
              total: calculateItemTotal({
                quantity: item.quantity || 1,
                unitPrice: item.unitPrice || selectedItem.purchaseRate,
                discount: item.discount || 0,
                tax: item.tax || 0,
              }),
            };
          }
        }
        return item;
      });

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

  const calculateItemTotal = ({
    quantity,
    unitPrice,
    discount,
    tax,
  }: {
    quantity: number;
    unitPrice: number;
    discount: number;
    tax: number;
  }) => {
    const subtotal = quantity * unitPrice;
    const discountAmount = (subtotal * discount) / 100;
    const taxableAmount = subtotal - discountAmount;
    const taxAmount = (taxableAmount * tax) / 100;
    return Math.round((taxableAmount + taxAmount) * 100) / 100;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    if (!formData.companyId || !formData.warehouseId || items.length === 0) {
      toast({
        title: "Validation Error",
        description:
          "Please fill all required fields and add at least one item",
        variant: "destructive",
      });
      return;
    }

    // Prepare data for submission
    const purchaseOrderData = {
      ...formData,
      items,
      totals,
    };

    if (onSave) {
      onSave(purchaseOrderData);
    } else {
      // In a real app, save to API
      console.log("Saving purchase order:", purchaseOrderData);

      // Navigate back to list
      navigate("/pharmacy/purchase/orders");
    }
  };

  // Handle saving a new item from the modal
  const handleSaveItem = (itemData: any) => {
    console.log("New item saved:", itemData);

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
      ],
      saleRate: itemData.isPack ? itemData.packSalePrice : itemData.salePrice,
      purchaseRate: itemData.isPack
        ? itemData.packPurchasePrice
        : itemData.purchasePrice,
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
  const columns: Column<PurchaseOrderItem>[] = [
    {
      header: "Item",
      accessorKey: "itemId",
      cellType: "dropdown",
      cell: (item) => {
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
                    uom: selectedItem.uom,
                    unitPrice: selectedItem.purchaseRate,
                    quantity: item.quantity || 1,
                    discount: item.discount || 0,
                    tax: item.tax || 0,
                    total: calculateItemTotal({
                      quantity: item.quantity || 1,
                      unitPrice: selectedItem.purchaseRate,
                      discount: item.discount || 0,
                      tax: item.tax || 0,
                    }),
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
      header: "UOM",
      accessorKey: "uom",
      cellType: "text",
      width: "80px",
      cell: (item) => {
        const selectedItem = inventoryItems.find(
          (invItem) => invItem.id === item.itemId,
        );
        return <span>{selectedItem?.uom || item.uom || ""}</span>;
      },
    },
    {
      header: "Quantity",
      accessorKey: "quantity",
      cellType: "number",
      width: "100px",
      onCellValueChange: (row, value) => {
        // When quantity changes, recalculate the total cost
        const qty = parseFloat(value) || 0;
        setItems((prevItems) => {
          return prevItems.map((item) => {
            if (item.id === row.id) {
              return {
                ...item,
                quantity: qty,
                total: calculateItemTotal({
                  quantity: qty,
                  unitPrice: item.unitPrice,
                  discount: item.discount,
                  tax: item.tax,
                }),
              };
            }
            return item;
          });
        });
      },
    },
    {
      header: "Unit Price",
      accessorKey: "unitPrice",
      cellType: "number",
      width: "120px",
      cell: (item) => `$${item.unitPrice.toFixed(2)}`,
      onCellValueChange: (row, value) => {
        const price = parseFloat(value) || 0;
        setItems((prevItems) => {
          return prevItems.map((item) => {
            if (item.id === row.id) {
              return {
                ...item,
                unitPrice: price,
                total: calculateItemTotal({
                  quantity: item.quantity,
                  unitPrice: price,
                  discount: item.discount,
                  tax: item.tax,
                }),
              };
            }
            return item;
          });
        });
      },
    },
    {
      header: "Discount %",
      accessorKey: "discount",
      cellType: "number",
      width: "100px",
      onCellValueChange: (row, value) => {
        const discountValue = parseFloat(value) || 0;
        setItems((prevItems) => {
          return prevItems.map((item) => {
            if (item.id === row.id) {
              return {
                ...item,
                discount: discountValue,
                total: calculateItemTotal({
                  quantity: item.quantity,
                  unitPrice: item.unitPrice,
                  discount: discountValue,
                  tax: item.tax,
                }),
              };
            }
            return item;
          });
        });
      },
    },
    {
      header: "Tax %",
      accessorKey: "tax",
      cellType: "number",
      width: "100px",
      onCellValueChange: (row, value) => {
        const taxValue = parseFloat(value) || 0;
        setItems((prevItems) => {
          return prevItems.map((item) => {
            if (item.id === row.id) {
              return {
                ...item,
                tax: taxValue,
                total: calculateItemTotal({
                  quantity: item.quantity,
                  unitPrice: item.unitPrice,
                  discount: item.discount,
                  tax: taxValue,
                }),
              };
            }
            return item;
          });
        });
      },
    },
    {
      header: "Total",
      accessorKey: "total",
      cellType: "number",
      width: "120px",
      cell: (item) => `$${item.total.toFixed(2)}`,
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
          <Button
            variant="outline"
            onClick={onCancel || (() => navigate("/pharmacy/purchase/orders"))}
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>
          <h2 className="text-2xl font-bold">
            {isEditing ? "Edit" : "New"} Purchase Order
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
          <CardTitle>Order Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="poNumber">PO Number</Label>
              <Input
                id="poNumber"
                name="poNumber"
                value={formData.poNumber}
                onChange={handleInputChange}
                readOnly
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                name="date"
                type="date"
                value={formData.date}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="expectedDelivery">Expected Delivery</Label>
              <Input
                id="expectedDelivery"
                name="expectedDelivery"
                type="date"
                value={formData.expectedDelivery}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="companyId">Company</Label>
              <Select
                value={formData.companyId}
                onValueChange={(value) =>
                  handleSelectChange("companyId", value)
                }
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
              <Label htmlFor="warehouseId">Warehouse</Label>
              <Select
                value={formData.warehouseId}
                onValueChange={(value) =>
                  handleSelectChange("warehouseId", value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Warehouse" />
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
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => handleSelectChange("status", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2 md:col-span-3">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                rows={2}
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
              "uom",
              "quantity",
              "unitPrice",
              "total",
            ]}
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
              <p className="text-2xl font-bold">{items.length}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Subtotal
              </p>
              <p className="text-2xl font-bold">
                ${totals.subtotal.toFixed(2)}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Discount
              </p>
              <p className="text-2xl font-bold">
                ${totals.discount.toFixed(2)}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Tax</p>
              <p className="text-2xl font-bold">${totals.tax.toFixed(2)}</p>
            </div>
            <div className="md:col-span-4">
              <div className="flex justify-between items-center p-4 bg-muted rounded-lg">
                <p className="text-lg font-medium">Grand Total</p>
                <p className="text-2xl font-bold">${totals.total.toFixed(2)}</p>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Status
              </p>
              <Badge className="mt-1 bg-amber-500">
                {formData.status.charAt(0).toUpperCase() +
                  formData.status.slice(1)}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PurchaseOrderForm;
