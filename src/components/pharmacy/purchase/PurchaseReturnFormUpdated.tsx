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
import { ArrowLeft, Printer, Save, FileSearch, Trash } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import DataTable, { Column } from "@/components/ui/data-table";
import SearchableSelect from "@/components/ui/searchable-select";

const PurchaseReturnFormUpdated = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const invoiceNumber = queryParams.get("invoice");

  const isEditing = !!id;

  // Form state
  const [formData, setFormData] = useState({
    returnNumber: isEditing
      ? id
      : "RET-" + Math.floor(1000 + Math.random() * 9000),
    date: new Date().toISOString().split("T")[0],
    returnType: invoiceNumber ? "invoice" : "direct",
    invoiceNumber: invoiceNumber || "",
    companyId: "",
    warehouseId: "",
    reason: "damaged",
    notes: "",
  });

  const [items, setItems] = useState<any[]>([]);

  const [totals, setTotals] = useState({
    subtotal: 0,
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

  // Purchase invoices for selection
  const purchaseInvoices = [
    {
      id: "INV-001",
      company: "ABC Pharmaceuticals",
      companyId: "comp1",
      warehouseId: "wh1",
    },
    {
      id: "INV-002",
      company: "MedLife Supplies",
      companyId: "comp2",
      warehouseId: "wh2",
    },
    {
      id: "INV-003",
      company: "HealthCare Products",
      companyId: "comp3",
      warehouseId: "wh1",
    },
    {
      id: "INV-004",
      company: "Pharma Solutions",
      companyId: "comp4",
      warehouseId: "wh3",
    },
    {
      id: "INV-005",
      company: "MediTech Inc.",
      companyId: "comp5",
      warehouseId: "wh2",
    },
  ];

  // Load data if editing or creating from invoice
  useEffect(() => {
    if (isEditing) {
      // In a real app, fetch the return data from API
      // For now, we'll use mock data
      if (id === "RET-001") {
        setFormData({
          returnNumber: "RET-001",
          date: "2023-06-17",
          returnType: "invoice",
          invoiceNumber: "INV-001",
          companyId: "comp1",
          warehouseId: "wh1",
          reason: "damaged",
          notes: "Items received in damaged condition",
        });

        setItems([
          {
            id: "1",
            itemId: "item1",
            itemName: "Paracetamol 500mg",
            uom: "Strip",
            quantity: 20,
            unitPrice: 5,
            reason: "damaged",
            total: 100,
          },
          {
            id: "2",
            itemId: "item3",
            itemName: "Vitamin C 1000mg",
            uom: "Tablet",
            quantity: 10,
            unitPrice: 8,
            reason: "expired",
            total: 80,
          },
        ]);
      }
    } else if (invoiceNumber) {
      // If creating from invoice, load invoice data
      const invoice = purchaseInvoices.find((inv) => inv.id === invoiceNumber);
      if (invoice) {
        setFormData((prev) => ({
          ...prev,
          returnType: "invoice",
          invoiceNumber,
          companyId: invoice.companyId,
          warehouseId: invoice.warehouseId,
        }));

        // In a real app, you would also load the items from the invoice
        setItems([
          {
            id: "1",
            itemId: "item1",
            itemName: "Paracetamol 500mg",
            uom: "Strip",
            quantity: 20,
            unitPrice: 5,
            reason: "damaged",
            total: 100,
          },
          {
            id: "2",
            itemId: "item3",
            itemName: "Vitamin C 1000mg",
            uom: "Tablet",
            quantity: 10,
            unitPrice: 8,
            reason: "expired",
            total: 80,
          },
        ]);
      }
    }
  }, [id, isEditing, invoiceNumber]);

  // Calculate totals whenever items change
  useEffect(() => {
    const subtotal = items.reduce((sum, item) => sum + item.total, 0);
    setTotals({
      subtotal: Math.round(subtotal * 100) / 100,
      total: Math.round(subtotal * 100) / 100,
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
    if (name === "returnType" && value === "direct") {
      setFormData((prev) => ({
        ...prev,
        returnType: value,
        invoiceNumber: "",
      }));
    } else if (name === "invoiceNumber") {
      const invoice = purchaseInvoices.find((inv) => inv.id === value);
      if (invoice) {
        setFormData((prev) => ({
          ...prev,
          invoiceNumber: value,
          companyId: invoice.companyId,
          warehouseId: invoice.warehouseId,
        }));

        // In a real app, you would also load the items from the invoice
        setItems([
          {
            id: "1",
            itemId: "item1",
            itemName: "Paracetamol 500mg",
            uom: "Strip",
            quantity: 20,
            unitPrice: 5,
            reason: "damaged",
            total: 100,
          },
          {
            id: "2",
            itemId: "item3",
            itemName: "Vitamin C 1000mg",
            uom: "Tablet",
            quantity: 10,
            unitPrice: 8,
            reason: "expired",
            total: 80,
          },
        ]);
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Handle saving items
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
              reason: item.reason || formData.reason,
              total: item.quantity * item.unitPrice,
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

  // Save purchase return
  const savePurchaseReturn = () => {
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
    console.log("Saving purchase return:", { ...formData, items, totals });

    toast({
      title: "Success",
      description: "Purchase return saved successfully",
    });

    // Navigate back to list
    navigate("/pharmacy/purchase/returns");
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
                    reason: item.reason || formData.reason,
                    total: (item.quantity || 1) * selectedItem.purchaseRate,
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
                total: qty * item.unitPrice,
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
                total: item.quantity * price,
              };
            }
            return item;
          });
        });
      },
    },
    {
      header: "Reason",
      accessorKey: "reason",
      cellType: "dropdown",
      width: "150px",
      cell: (item) => {
        return (
          <Select
            value={item.reason || formData.reason}
            onValueChange={(value) => {
              setItems((prevItems) => {
                return prevItems.map((i) =>
                  i.id === item.id ? { ...i, reason: value } : i,
                );
              });
            }}
          >
            <SelectTrigger className="h-8">
              <SelectValue placeholder="Select reason" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="damaged">Damaged</SelectItem>
              <SelectItem value="expired">Expired</SelectItem>
              <SelectItem value="incorrect">Incorrect Item</SelectItem>
              <SelectItem value="quality">Quality Issue</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        );
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
          onClick={() => {
            setItems((prevItems) => prevItems.filter((i) => i.id !== item.id));
          }}
          className="text-red-500 hover:text-red-700"
        >
          <Trash className="h-4 w-4" />
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            onClick={() => navigate("/pharmacy/purchase/returns")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>
          <h2 className="text-2xl font-bold">
            {isEditing ? "Edit" : "New"} Purchase Return
          </h2>
          <Badge className="ml-2 bg-orange-500">
            {formData.returnType === "invoice"
              ? "Invoice Return"
              : "Direct Return"}
          </Badge>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Printer className="mr-2 h-4 w-4" /> Print
          </Button>
          <Button onClick={savePurchaseReturn}>
            <Save className="mr-2 h-4 w-4" /> Save
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Return Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="returnNumber">Return Number</Label>
              <Input
                id="returnNumber"
                name="returnNumber"
                value={formData.returnNumber}
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
              <Label htmlFor="returnType">Return Type</Label>
              <Select
                value={formData.returnType}
                onValueChange={(value) =>
                  handleSelectChange("returnType", value)
                }
                disabled={isEditing || !!invoiceNumber}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select return type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="invoice">Invoice Return</SelectItem>
                  <SelectItem value="direct">Direct Return</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {formData.returnType === "invoice" && (
              <div className="space-y-2">
                <Label htmlFor="invoiceNumber">Invoice Number</Label>
                <div className="flex space-x-2">
                  <Select
                    value={formData.invoiceNumber}
                    onValueChange={(value) =>
                      handleSelectChange("invoiceNumber", value)
                    }
                    disabled={isEditing}
                  >
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Select invoice" />
                    </SelectTrigger>
                    <SelectContent>
                      {purchaseInvoices.map((invoice) => (
                        <SelectItem key={invoice.id} value={invoice.id}>
                          {invoice.id} - {invoice.company}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => navigate("/pharmacy/purchase/invoices")}
                    title="Browse Invoices"
                  >
                    <FileSearch className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="companyId">Company</Label>
              <Select
                value={formData.companyId}
                onValueChange={(value) =>
                  handleSelectChange("companyId", value)
                }
                disabled={
                  formData.returnType === "invoice" && !!formData.invoiceNumber
                }
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
                disabled={
                  formData.returnType === "invoice" && !!formData.invoiceNumber
                }
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
              <Label htmlFor="reason">Return Reason</Label>
              <Select
                value={formData.reason}
                onValueChange={(value) => handleSelectChange("reason", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select reason" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="damaged">Damaged Goods</SelectItem>
                  <SelectItem value="expired">Expired Products</SelectItem>
                  <SelectItem value="incorrect">Incorrect Items</SelectItem>
                  <SelectItem value="quality">Quality Issues</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
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
            addStartEntry={true}
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
                Total Amount
              </p>
              <p className="text-2xl font-bold">${totals.total.toFixed(2)}</p>
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
    </div>
  );
};

export default PurchaseReturnFormUpdated;
