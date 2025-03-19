import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
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
import {
  ArrowLeft,
  Printer,
  Save,
  FileSearch,
  Plus,
  Trash,
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import DataTable, { Column } from "@/components/ui/data-table";
import SearchableSelect from "@/components/ui/searchable-select";

const PurchaseInvoiceFormUpdated = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const poNumber = queryParams.get("po");

  const isEditing = !!id;

  // Form state
  const [formData, setFormData] = useState({
    invoiceNumber: isEditing
      ? id
      : "INV-" + Math.floor(1000 + Math.random() * 9000),
    date: new Date().toISOString().split("T")[0],
    poNumber: poNumber || "none",
    companyId: "",
    warehouseId: "",
    status: "pending",
    notes: "",
  });

  const [items, setItems] = useState<any[]>([]);

  const [totals, setTotals] = useState({
    subtotal: 0,
    discount: 0,
    tax: 0,
    total: 0,
  });

  // Sample data for dropdowns
  const companies = [
    { id: "comp1", name: "ABC Pharmaceuticals" },
    { id: "comp2", name: "MedLife Supplies" },
    { id: "comp3", name: "HealthCare Products" },
    { id: "comp4", name: "Pharma Solutions" },
    { id: "comp5", name: "MediTech Inc." },
  ];

  const warehouses = [
    { id: "wh1", name: "Main Warehouse" },
    { id: "wh2", name: "Secondary Storage" },
    { id: "wh3", name: "Retail Outlet Storage" },
  ];

  const inventoryItems = [
    { id: "item1", name: "Paracetamol 500mg", uom: "Strip", purchaseRate: 5 },
    { id: "item2", name: "Amoxicillin 250mg", uom: "Bottle", purchaseRate: 12 },
    { id: "item3", name: "Vitamin C 1000mg", uom: "Tablet", purchaseRate: 8 },
    { id: "item4", name: "Ibuprofen 400mg", uom: "Strip", purchaseRate: 9 },
    { id: "item5", name: "Omeprazole 20mg", uom: "Capsule", purchaseRate: 14 },
  ];

  // Purchase orders for selection
  const purchaseOrders = [
    {
      id: "PO-001",
      company: "ABC Pharmaceuticals",
      companyId: "comp1",
      warehouseId: "wh1",
    },
    {
      id: "PO-002",
      company: "MedLife Supplies",
      companyId: "comp2",
      warehouseId: "wh2",
    },
    {
      id: "PO-003",
      company: "HealthCare Products",
      companyId: "comp3",
      warehouseId: "wh1",
    },
    {
      id: "PO-004",
      company: "Pharma Solutions",
      companyId: "comp4",
      warehouseId: "wh3",
    },
    {
      id: "PO-005",
      company: "MediTech Inc.",
      companyId: "comp5",
      warehouseId: "wh2",
    },
  ];

  // Load data if editing or creating from PO
  useEffect(() => {
    if (isEditing) {
      // In a real app, fetch the invoice data from API
      // For now, we'll use mock data
      if (id === "INV-001") {
        setFormData({
          invoiceNumber: "INV-001",
          date: "2023-06-16",
          poNumber: "PO-001",
          companyId: "comp1",
          warehouseId: "wh1",
          status: "pending",
          notes: "Invoice for urgent order",
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
    } else if (poNumber) {
      // If creating from PO, load PO data
      const po = purchaseOrders.find((po) => po.id === poNumber);
      if (po) {
        setFormData((prev) => ({
          ...prev,
          poNumber,
          companyId: po.companyId,
          warehouseId: po.warehouseId,
        }));

        // In a real app, you would also load the items from the PO
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
    }
  }, [id, isEditing, poNumber]);

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

  // Handle form input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    if (name === "poNumber") {
      if (value === "none") {
        setFormData((prev) => ({
          ...prev,
          poNumber: "none",
          // Don't clear company and warehouse if they're already set
        }));
        return;
      }
      const po = purchaseOrders.find((po) => po.id === value);
      if (po) {
        setFormData((prev) => ({
          ...prev,
          poNumber: value,
          companyId: po.companyId,
          warehouseId: po.warehouseId,
        }));

        // In a real app, you would also load the items from the PO
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
      setFormData((prev) => ({ ...prev, [name]: value }));
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

  const handleAddItem = () => {
    const newItem = {
      id: `item-${Date.now()}`,
      itemId: "",
      itemName: "",
      uom: "",
      quantity: 1,
      unitPrice: 0,
      discount: 0,
      tax: 0,
      total: 0,
    };
    setItems([...items, newItem]);
  };

  const handleRemoveItem = (itemId: string) => {
    setItems(items.filter((item) => item.id !== itemId));
  };

  const handleSaveItems = (updatedItems: any[]) => {
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

  // Save purchase invoice
  const savePurchaseInvoice = () => {
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

    // In a real app, save to API
    console.log("Saving purchase invoice:", { ...formData, items, totals });

    toast({
      title: "Success",
      description: "Purchase invoice saved successfully",
    });

    // Navigate back to list
    navigate("/pharmacy/purchase/invoices");
  };

  // Define columns for the DataTable
  const columns: Column<any>[] = [
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
    {
      header: "Actions",
      accessorKey: "actions",
      cellType: "actions",
      width: "80px",
      cell: (item) => (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => handleRemoveItem(item.id)}
          className="text-red-500 hover:text-red-700"
        >
          <Trash className="h-4 w-4" />
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6 bg-background p-6 rounded-lg">
      {/* Header */}
      <div className="flex items-center justify-between bg-card p-4 rounded-lg shadow-sm">
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            onClick={() => navigate("/pharmacy/purchase/invoices")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>
          <h2 className="text-2xl font-bold">
            {isEditing ? "Edit" : "New"} Purchase Invoice
          </h2>
          {formData.status && (
            <Badge
              className={`ml-2 ${formData.status === "pending" ? "bg-yellow-500" : formData.status === "paid" ? "bg-green-500" : "bg-red-500"}`}
            >
              {formData.status.charAt(0).toUpperCase() +
                formData.status.slice(1)}
            </Badge>
          )}
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Printer className="mr-2 h-4 w-4" /> Print
          </Button>
          <Button onClick={savePurchaseInvoice}>
            <Save className="mr-2 h-4 w-4" /> Save
          </Button>
        </div>
      </div>

      {/* Master Fields */}
      <Card>
        <CardHeader>
          <CardTitle>Invoice Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="invoiceNumber">Invoice Number</Label>
              <Input
                id="invoiceNumber"
                name="invoiceNumber"
                value={formData.invoiceNumber}
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
              <Label htmlFor="poNumber">Purchase Order</Label>
              <div className="flex space-x-2">
                <Select
                  value={formData.poNumber}
                  onValueChange={(value) =>
                    handleSelectChange("poNumber", value)
                  }
                >
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Select purchase order" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None (Direct Invoice)</SelectItem>
                    {purchaseOrders.map((po) => (
                      <SelectItem key={po.id} value={po.id}>
                        {po.id} - {po.company}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => navigate("/pharmacy/purchase/orders")}
                  title="Browse Purchase Orders"
                >
                  <FileSearch className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="companyId">Company</Label>
              <Select
                value={formData.companyId}
                onValueChange={(value) =>
                  handleSelectChange("companyId", value)
                }
                disabled={formData.poNumber !== "none"}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select company" />
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
                disabled={formData.poNumber !== "none"}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select warehouse" />
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
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
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

      {/* Items Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Items</CardTitle>
          <Button onClick={handleAddItem} size="sm">
            <Plus className="mr-2 h-4 w-4" /> Add Item
          </Button>
        </CardHeader>
        <CardContent>
          <DataTable
            data={items}
            columns={columns}
            onSave={handleSaveItems}
            disableSaveAnimation={true}
            isSearchable={false}
            isSortable={true}
            isFilterable={false}
            isPaginated={false}
            keyboardShortcuts={true}
            horizontalScroll={true}
            enableColumnConfiguration={true}
            defaultPinnedColumns={[
              "itemId",
              "uom",
              "quantity",
              "unitPrice",
              "total",
            ]}
            noDataText="No items added yet. Click 'Add Item' to start."
          />
        </CardContent>
      </Card>

      {/* Summary */}
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
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-2">
        <Button
          variant="outline"
          onClick={() => navigate("/pharmacy/purchase/invoices")}
        >
          Cancel
        </Button>
        <Button onClick={savePurchaseInvoice}>
          <Save className="mr-2 h-4 w-4" /> Save Invoice
        </Button>
      </div>
    </div>
  );
};

export default PurchaseInvoiceFormUpdated;
