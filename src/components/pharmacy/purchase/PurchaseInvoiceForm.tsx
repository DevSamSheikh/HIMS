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
import DataTable from "@/components/ui/data-table";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Plus,
  Trash2,
  Save,
  ArrowLeft,
  FileText,
  FileSearch,
} from "lucide-react";

const PurchaseInvoiceForm = () => {
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
    items: [] as any[],
  });

  const [itemForm, setItemForm] = useState({
    itemId: "",
    quantity: 0,
    unitPrice: 0,
    discount: 0,
    tax: 0,
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

  const items = [
    { id: "item1", name: "Paracetamol 500mg", uom: "Strip" },
    { id: "item2", name: "Amoxicillin 250mg", uom: "Bottle" },
    { id: "item3", name: "Vitamin C 1000mg", uom: "Tablet" },
    { id: "item4", name: "Ibuprofen 400mg", uom: "Strip" },
    { id: "item5", name: "Omeprazole 20mg", uom: "Capsule" },
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
          items: [
            {
              id: 1,
              itemId: "item1",
              name: "Paracetamol 500mg",
              quantity: 100,
              unitPrice: 5,
              discount: 2,
              tax: 5,
              total: 490,
            },
            {
              id: 2,
              itemId: "item3",
              name: "Vitamin C 1000mg",
              quantity: 50,
              unitPrice: 8,
              discount: 0,
              tax: 5,
              total: 420,
            },
          ],
        });
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
          // In a real app, you would also load the items from the PO
          items: [
            {
              id: 1,
              itemId: "item1",
              name: "Paracetamol 500mg",
              quantity: 100,
              unitPrice: 5,
              discount: 2,
              tax: 5,
              total: 490,
            },
            {
              id: 2,
              itemId: "item3",
              name: "Vitamin C 1000mg",
              quantity: 50,
              unitPrice: 8,
              discount: 0,
              tax: 5,
              total: 420,
            },
          ],
        }));
      }
    }
  }, [id, isEditing, poNumber]);

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
          // In a real app, you would also load the items from the PO
          items: [
            {
              id: 1,
              itemId: "item1",
              name: "Paracetamol 500mg",
              quantity: 100,
              unitPrice: 5,
              discount: 2,
              tax: 5,
              total: 490,
            },
            {
              id: 2,
              itemId: "item3",
              name: "Vitamin C 1000mg",
              quantity: 50,
              unitPrice: 8,
              discount: 0,
              tax: 5,
              total: 420,
            },
          ],
        }));
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleItemFormChange = (name: string, value: any) => {
    setItemForm((prev) => ({ ...prev, [name]: value }));
  };

  // Add item to the invoice
  const addItem = () => {
    if (!itemForm.itemId || itemForm.quantity <= 0 || itemForm.unitPrice <= 0) {
      // Show validation error
      return;
    }

    const selectedItem = items.find((item) => item.id === itemForm.itemId);
    if (!selectedItem) return;

    const quantity = Number(itemForm.quantity);
    const unitPrice = Number(itemForm.unitPrice);
    const discount = Number(itemForm.discount);
    const tax = Number(itemForm.tax);

    const subtotal = quantity * unitPrice;
    const discountAmount = (subtotal * discount) / 100;
    const taxableAmount = subtotal - discountAmount;
    const taxAmount = (taxableAmount * tax) / 100;
    const total = taxableAmount + taxAmount;

    const newItem = {
      id: Date.now(),
      itemId: itemForm.itemId,
      name: selectedItem.name,
      uom: selectedItem.uom,
      quantity,
      unitPrice,
      discount,
      tax,
      total: Math.round(total * 100) / 100,
    };

    setFormData((prev) => ({
      ...prev,
      items: [...prev.items, newItem],
    }));

    // Reset item form
    setItemForm({
      itemId: "",
      quantity: 0,
      unitPrice: 0,
      discount: 0,
      tax: 0,
    });
  };

  // Remove item from the invoice
  const removeItem = (itemId: number) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.filter((item) => item.id !== itemId),
    }));
  };

  // Calculate invoice totals
  const calculateTotals = () => {
    const subtotal = formData.items.reduce(
      (sum, item) => sum + item.quantity * item.unitPrice,
      0,
    );
    const discountTotal = formData.items.reduce((sum, item) => {
      const itemSubtotal = item.quantity * item.unitPrice;
      return sum + (itemSubtotal * item.discount) / 100;
    }, 0);
    const taxTotal = formData.items.reduce((sum, item) => {
      const itemSubtotal = item.quantity * item.unitPrice;
      const afterDiscount = itemSubtotal - (itemSubtotal * item.discount) / 100;
      return sum + (afterDiscount * item.tax) / 100;
    }, 0);

    return {
      subtotal: Math.round(subtotal * 100) / 100,
      discount: Math.round(discountTotal * 100) / 100,
      tax: Math.round(taxTotal * 100) / 100,
      total: Math.round((subtotal - discountTotal + taxTotal) * 100) / 100,
    };
  };

  const totals = calculateTotals();

  // Save purchase invoice
  const savePurchaseInvoice = () => {
    // Validate form
    if (
      !formData.companyId ||
      !formData.warehouseId ||
      formData.items.length === 0
    ) {
      // Show validation error
      return;
    }

    // In a real app, save to API
    console.log("Saving purchase invoice:", formData);

    // Navigate back to list
    navigate("/pharmacy/purchase/invoices");
  };

  // Item columns for the data table
  const itemColumns = [
    { header: "Item", accessorKey: "name" },
    { header: "UOM", accessorKey: "uom" },
    {
      header: "Quantity",
      accessorKey: "quantity",
      cell: ({ row }: any) => {
        return <span className="font-medium">{row.original.quantity}</span>;
      },
    },
    {
      header: "Unit Price",
      accessorKey: "unitPrice",
      cell: ({ row }: any) => {
        return <span>${row.original.unitPrice.toFixed(2)}</span>;
      },
    },
    {
      header: "Discount %",
      accessorKey: "discount",
      cell: ({ row }: any) => {
        return <span>{row.original.discount}%</span>;
      },
    },
    {
      header: "Tax %",
      accessorKey: "tax",
      cell: ({ row }: any) => {
        return <span>{row.original.tax}%</span>;
      },
    },
    {
      header: "Total",
      accessorKey: "total",
      cell: ({ row }: any) => {
        return (
          <span className="font-medium">${row.original.total.toFixed(2)}</span>
        );
      },
    },
    {
      header: "Actions",
      cell: ({ row }: any) => {
        return (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => removeItem(row.original.id)}
          >
            <Trash2 className="h-4 w-4 text-red-500" />
          </Button>
        );
      },
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            onClick={() => navigate("/pharmacy/purchase/invoices")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to List
          </Button>
          <h2 className="text-xl font-bold">
            {isEditing ? "Edit Purchase Invoice" : "New Purchase Invoice"}
          </h2>
        </div>

        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <FileText className="h-4 w-4 mr-2" />
            Print Invoice
          </Button>
          <Button onClick={savePurchaseInvoice}>
            <Save className="h-4 w-4 mr-2" />
            Save Invoice
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
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
                      <SelectItem value="none">
                        None (Direct Invoice)
                      </SelectItem>
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
                  disabled={!!formData.poNumber}
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
                  disabled={!!formData.poNumber}
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

              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  rows={3}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardContent className="pt-6">
            <Tabs defaultValue="items">
              <TabsList>
                <TabsTrigger value="items">Items</TabsTrigger>
                <TabsTrigger value="summary">Summary</TabsTrigger>
              </TabsList>

              <TabsContent value="items" className="space-y-4 pt-4">
                <div className="flex justify-between items-end">
                  <h3 className="text-lg font-medium">Invoice Items</h3>

                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        disabled={
                          formData.items.length > 0 && !!formData.poNumber
                        }
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Item
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add Item to Invoice</DialogTitle>
                      </DialogHeader>

                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Label htmlFor="itemId">Item</Label>
                          <Select
                            value={itemForm.itemId}
                            onValueChange={(value) =>
                              handleItemFormChange("itemId", value)
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select item" />
                            </SelectTrigger>
                            <SelectContent>
                              {items.map((item) => (
                                <SelectItem key={item.id} value={item.id}>
                                  {item.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="quantity">Quantity</Label>
                            <Input
                              id="quantity"
                              type="number"
                              min="1"
                              value={itemForm.quantity || ""}
                              onChange={(e) =>
                                handleItemFormChange(
                                  "quantity",
                                  Number(e.target.value),
                                )
                              }
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="unitPrice">Unit Price</Label>
                            <Input
                              id="unitPrice"
                              type="number"
                              min="0"
                              step="0.01"
                              value={itemForm.unitPrice || ""}
                              onChange={(e) =>
                                handleItemFormChange(
                                  "unitPrice",
                                  Number(e.target.value),
                                )
                              }
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="discount">Discount %</Label>
                            <Input
                              id="discount"
                              type="number"
                              min="0"
                              max="100"
                              value={itemForm.discount || ""}
                              onChange={(e) =>
                                handleItemFormChange(
                                  "discount",
                                  Number(e.target.value),
                                )
                              }
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="tax">Tax %</Label>
                            <Input
                              id="tax"
                              type="number"
                              min="0"
                              max="100"
                              value={itemForm.tax || ""}
                              onChange={(e) =>
                                handleItemFormChange(
                                  "tax",
                                  Number(e.target.value),
                                )
                              }
                            />
                          </div>
                        </div>

                        <div className="flex justify-end">
                          <Button onClick={addItem}>Add to Invoice</Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>

                {formData.items.length > 0 ? (
                  <DataTable
                    columns={itemColumns}
                    data={formData.items}
                    pagination={false}
                  />
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    No items added to this invoice yet.{" "}
                    {!formData.poNumber &&
                      'Click "Add Item" to start or select a Purchase Order.'}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="summary" className="pt-4">
                <div className="space-y-6">
                  <h3 className="text-lg font-medium">Invoice Summary</h3>

                  <div className="space-y-2">
                    <div className="flex justify-between py-2 border-b">
                      <span>Subtotal:</span>
                      <span>${totals.subtotal.toFixed(2)}</span>
                    </div>

                    <div className="flex justify-between py-2 border-b">
                      <span>Total Discount:</span>
                      <span>-${totals.discount.toFixed(2)}</span>
                    </div>

                    <div className="flex justify-between py-2 border-b">
                      <span>Total Tax:</span>
                      <span>${totals.tax.toFixed(2)}</span>
                    </div>

                    <div className="flex justify-between py-2 font-bold text-lg">
                      <span>Grand Total:</span>
                      <span>${totals.total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PurchaseInvoiceForm;
