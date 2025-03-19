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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const PurchaseReturnForm = () => {
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
    reason: "",
    notes: "",
    items: [] as any[],
  });

  const [itemForm, setItemForm] = useState({
    itemId: "",
    quantity: 0,
    unitPrice: 0,
    reason: "damaged",
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
          items: [
            {
              id: 1,
              itemId: "item1",
              name: "Paracetamol 500mg",
              quantity: 20,
              unitPrice: 5,
              reason: "damaged",
              total: 100,
            },
            {
              id: 2,
              itemId: "item3",
              name: "Vitamin C 1000mg",
              quantity: 10,
              unitPrice: 8,
              reason: "expired",
              total: 80,
            },
          ],
        });
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
          // In a real app, you would also load the items from the invoice
          items: [
            {
              id: 1,
              itemId: "item1",
              name: "Paracetamol 500mg",
              quantity: 20,
              unitPrice: 5,
              reason: "damaged",
              total: 100,
            },
            {
              id: 2,
              itemId: "item3",
              name: "Vitamin C 1000mg",
              quantity: 10,
              unitPrice: 8,
              reason: "expired",
              total: 80,
            },
          ],
        }));
      }
    }
  }, [id, isEditing, invoiceNumber]);

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
          // In a real app, you would also load the items from the invoice
          items: [
            {
              id: 1,
              itemId: "item1",
              name: "Paracetamol 500mg",
              quantity: 20,
              unitPrice: 5,
              reason: "damaged",
              total: 100,
            },
            {
              id: 2,
              itemId: "item3",
              name: "Vitamin C 1000mg",
              quantity: 10,
              unitPrice: 8,
              reason: "expired",
              total: 80,
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

  // Add item to the return
  const addItem = () => {
    if (!itemForm.itemId || itemForm.quantity <= 0 || itemForm.unitPrice <= 0) {
      // Show validation error
      return;
    }

    const selectedItem = items.find((item) => item.id === itemForm.itemId);
    if (!selectedItem) return;

    const quantity = Number(itemForm.quantity);
    const unitPrice = Number(itemForm.unitPrice);
    const total = quantity * unitPrice;

    const newItem = {
      id: Date.now(),
      itemId: itemForm.itemId,
      name: selectedItem.name,
      uom: selectedItem.uom,
      quantity,
      unitPrice,
      reason: itemForm.reason,
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
      reason: "damaged",
    });
  };

  // Remove item from the return
  const removeItem = (itemId: number) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.filter((item) => item.id !== itemId),
    }));
  };

  // Calculate return totals
  const calculateTotals = () => {
    const total = formData.items.reduce((sum, item) => sum + item.total, 0);
    return {
      total: Math.round(total * 100) / 100,
    };
  };

  const totals = calculateTotals();

  // Save purchase return
  const savePurchaseReturn = () => {
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
    console.log("Saving purchase return:", formData);

    // Navigate back to list
    navigate("/pharmacy/purchase/returns");
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
      header: "Reason",
      accessorKey: "reason",
      cell: ({ row }: any) => {
        return <span className="capitalize">{row.original.reason}</span>;
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
            onClick={() => navigate("/pharmacy/purchase/returns")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to List
          </Button>
          <h2 className="text-xl font-bold">
            {isEditing ? "Edit Purchase Return" : "New Purchase Return"}
          </h2>
        </div>

        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <FileText className="h-4 w-4 mr-2" />
            Print Return
          </Button>
          <Button onClick={savePurchaseReturn}>
            <Save className="h-4 w-4 mr-2" />
            Save Return
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
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
                    formData.returnType === "invoice" &&
                    !!formData.invoiceNumber
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
                    formData.returnType === "invoice" &&
                    !!formData.invoiceNumber
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
                  <h3 className="text-lg font-medium">Return Items</h3>

                  <Dialog>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Item
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add Item to Return</DialogTitle>
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

                        <div className="space-y-2">
                          <Label>Return Reason</Label>
                          <RadioGroup
                            value={itemForm.reason}
                            onValueChange={(value) =>
                              handleItemFormChange("reason", value)
                            }
                            className="flex flex-col space-y-1"
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="damaged" id="damaged" />
                              <Label
                                htmlFor="damaged"
                                className="cursor-pointer"
                              >
                                Damaged
                              </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="expired" id="expired" />
                              <Label
                                htmlFor="expired"
                                className="cursor-pointer"
                              >
                                Expired
                              </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem
                                value="incorrect"
                                id="incorrect"
                              />
                              <Label
                                htmlFor="incorrect"
                                className="cursor-pointer"
                              >
                                Incorrect Item
                              </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="quality" id="quality" />
                              <Label
                                htmlFor="quality"
                                className="cursor-pointer"
                              >
                                Quality Issue
                              </Label>
                            </div>
                          </RadioGroup>
                        </div>

                        <div className="flex justify-end">
                          <Button onClick={addItem}>Add to Return</Button>
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
                    No items added to this return yet. Click "Add Item" to
                    start.
                  </div>
                )}
              </TabsContent>

              <TabsContent value="summary" className="pt-4">
                <div className="space-y-6">
                  <h3 className="text-lg font-medium">Return Summary</h3>

                  <div className="space-y-2">
                    <div className="flex justify-between py-2 font-bold text-lg">
                      <span>Total Return Amount:</span>
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

export default PurchaseReturnForm;
