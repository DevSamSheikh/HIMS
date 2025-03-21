import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DataTable, { Column } from "@/components/ui/data-table";
import SearchableSelect from "@/components/ui/searchable-select";
import { useToast } from "@/components/ui/use-toast";
import {
  ArrowLeft,
  Save,
  Trash2,
  Plus,
  FileText,
  Calculator,
} from "lucide-react";

interface Customer {
  id: string;
  name: string;
}

interface Item {
  id: string;
  name: string;
  code: string;
  category: string;
  unitPrice: number;
  availableQty: number;
  batches?: Batch[];
}

interface Batch {
  id: string;
  batchNo: string;
  expiryDate: string;
  availableQty: number;
}

interface InvoiceItem {
  id: string;
  itemId: string;
  itemName: string;
  batchId: string;
  batchNo: string;
  batchQty: number;
  quantity: number;
  unitPrice: number;
  discount: number;
  tax: number;
  total: number;
}

interface SalesInvoice {
  id: string;
  invoiceNumber: string;
  date: string;
  customerId: string;
  customerName: string;
  subtotal: number;
  discountTotal: number;
  taxTotal: number;
  grandTotal: number;
  notes: string;
  status: string;
  paymentStatus: string;
  items: InvoiceItem[];
}

const SalesInvoiceForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const isEditing = !!id;

  // Get checkupId from URL query params if it exists
  const queryParams = new URLSearchParams(location.search);
  const checkupId = queryParams.get("checkupId");

  // Sample data for demonstration
  const [customers] = useState<Customer[]>([
    { id: "cust-001", name: "John Doe" },
    { id: "cust-002", name: "Jane Smith" },
    { id: "cust-003", name: "Robert Johnson" },
    { id: "cust-004", name: "Emily Davis" },
    { id: "cust-005", name: "Michael Wilson" },
  ]);

  const [items] = useState<Item[]>([
    {
      id: "item-001",
      name: "Paracetamol 500mg",
      code: "P500",
      category: "Analgesics",
      unitPrice: 5.99,
      availableQty: 500,
      batches: [
        {
          id: "batch-001-1",
          batchNo: "B001",
          expiryDate: "2024-12-31",
          availableQty: 300,
        },
        {
          id: "batch-001-2",
          batchNo: "B002",
          expiryDate: "2025-06-30",
          availableQty: 200,
        },
      ],
    },
    {
      id: "item-002",
      name: "Amoxicillin 250mg",
      code: "A250",
      category: "Antibiotics",
      unitPrice: 12.5,
      availableQty: 300,
      batches: [
        {
          id: "batch-002-1",
          batchNo: "B101",
          expiryDate: "2024-10-15",
          availableQty: 150,
        },
        {
          id: "batch-002-2",
          batchNo: "B102",
          expiryDate: "2025-02-28",
          availableQty: 150,
        },
      ],
    },
    {
      id: "item-003",
      name: "Vitamin C 1000mg",
      code: "VC1000",
      category: "Vitamins",
      unitPrice: 8.75,
      availableQty: 200,
      batches: [
        {
          id: "batch-003-1",
          batchNo: "B201",
          expiryDate: "2024-11-30",
          availableQty: 100,
        },
        {
          id: "batch-003-2",
          batchNo: "B202",
          expiryDate: "2025-04-15",
          availableQty: 100,
        },
      ],
    },
    {
      id: "item-004",
      name: "Ibuprofen 400mg",
      code: "I400",
      category: "Analgesics",
      unitPrice: 7.25,
      availableQty: 400,
      batches: [
        {
          id: "batch-004-1",
          batchNo: "B301",
          expiryDate: "2024-09-30",
          availableQty: 200,
        },
        {
          id: "batch-004-2",
          batchNo: "B302",
          expiryDate: "2025-01-15",
          availableQty: 200,
        },
      ],
    },
    {
      id: "item-005",
      name: "Cetirizine 10mg",
      code: "C10",
      category: "Antihistamines",
      unitPrice: 9.99,
      availableQty: 250,
      batches: [
        {
          id: "batch-005-1",
          batchNo: "B401",
          expiryDate: "2024-08-31",
          availableQty: 125,
        },
        {
          id: "batch-005-2",
          batchNo: "B402",
          expiryDate: "2025-03-15",
          availableQty: 125,
        },
      ],
    },
  ]);

  const [invoice, setInvoice] = useState<SalesInvoice>({
    id: isEditing ? id : `inv-${Date.now()}`,
    invoiceNumber: isEditing
      ? ""
      : `SI-${Math.floor(Math.random() * 1000)
          .toString()
          .padStart(3, "0")}`,
    date: new Date().toISOString().split("T")[0],
    customerId: "",
    customerName: "",
    subtotal: 0,
    discountTotal: 0,
    taxTotal: 0,
    grandTotal: 0,
    notes: "",
    status: "pending",
    paymentStatus: "unpaid",
    items: [],
  });

  const [selectedItem, setSelectedItem] = useState<string>("");
  const [selectedBatch, setSelectedBatch] = useState<string>("");
  const [availableBatches, setAvailableBatches] = useState<Batch[]>([]);
  const [selectedBatchQty, setSelectedBatchQty] = useState<number>(0);

  // Mock data for prescriptions/checkups
  const mockCheckups = [
    {
      id: "C001",
      date: "2023-10-15",
      patient: {
        id: "P001",
        name: "John Doe",
        age: 45,
        gender: "Male",
        contact: "9876543210",
      },
      medications: [
        {
          medicine: {
            id: "item-001",
            name: "Cetirizine",
            category: "Antihistamine",
            unitPrice: 5.99,
          },
          dosage: { name: "Once daily", frequency: "1-0-0" },
          days: { name: "7 Days", value: 7 },
        },
        {
          medicine: {
            id: "item-002",
            name: "Paracetamol",
            category: "Analgesic",
            unitPrice: 8.75,
          },
          dosage: { name: "Three times daily", frequency: "1-1-1" },
          days: { name: "3 Days", value: 3 },
        },
      ],
    },
    {
      id: "C003",
      date: "2023-10-17",
      patient: {
        id: "P003",
        name: "Robert Brown",
        age: 58,
        gender: "Male",
        contact: "9876543212",
      },
      medications: [
        {
          medicine: {
            id: "item-003",
            name: "Amlodipine",
            category: "Calcium Channel Blocker",
            unitPrice: 12.5,
          },
          dosage: { name: "Once daily", frequency: "1-0-0" },
          days: { name: "30 Days", value: 30 },
        },
        {
          medicine: {
            id: "item-004",
            name: "Metformin",
            category: "Antidiabetic",
            unitPrice: 9.99,
          },
          dosage: { name: "Twice daily", frequency: "1-0-1" },
          days: { name: "30 Days", value: 30 },
        },
      ],
    },
  ];

  // Load invoice data if editing or from prescription
  useEffect(() => {
    if (isEditing) {
      // In a real application, you would fetch the invoice data from an API
      // For demonstration, we'll use mock data
      if (id === "inv-001") {
        setInvoice({
          id: "inv-001",
          invoiceNumber: "SI-001",
          date: "2023-06-15",
          customerId: "cust-001",
          customerName: "John Doe",
          subtotal: 1200.0,
          discountTotal: 50.0,
          taxTotal: 100.0,
          grandTotal: 1250.0,
          notes: "Regular customer purchase",
          status: "completed",
          paymentStatus: "paid",
          items: [
            {
              id: "line-001",
              itemId: "item-001",
              itemName: "Paracetamol 500mg",
              quantity: 100,
              unitPrice: 5.99,
              discount: 10.0,
              tax: 29.95,
              total: 599.0,
            },
            {
              id: "line-002",
              itemId: "item-003",
              itemName: "Vitamin C 1000mg",
              quantity: 50,
              unitPrice: 8.75,
              discount: 20.0,
              tax: 43.75,
              total: 437.5,
            },
            {
              id: "line-003",
              itemId: "item-005",
              itemName: "Cetirizine 10mg",
              quantity: 20,
              unitPrice: 9.99,
              discount: 20.0,
              tax: 19.98,
              total: 199.8,
            },
          ],
        });
      }
    } else if (checkupId) {
      // If creating from prescription, load prescription data
      const checkup = mockCheckups.find((c) => c.id === checkupId);
      if (checkup) {
        // Create invoice items from prescription medications
        const invoiceItems = checkup.medications.map((med) => {
          const quantity = med.days.value;
          const unitPrice = med.medicine.unitPrice;
          const total = quantity * unitPrice;
          const tax = total * 0.05; // 5% tax

          return {
            id: `line-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
            itemId: med.medicine.id,
            itemName: med.medicine.name,
            batchId: "", // This would need to be selected by the user
            batchNo: "",
            batchQty: 0,
            quantity: quantity,
            unitPrice: unitPrice,
            discount: 0,
            tax: tax,
            total: total,
          };
        });

        // Set invoice with prescription data
        setInvoice((prev) => ({
          ...prev,
          customerId: `cust-${checkup.patient.id}`,
          customerName: checkup.patient.name,
          notes: `Prescription from checkup ${checkupId}`,
          items: invoiceItems,
        }));

        toast({
          title: "Prescription Loaded",
          description: `Prescription for ${checkup.patient.name} has been loaded. Please review and complete the invoice.`,
        });
      }
    }
  }, [id, isEditing, checkupId, toast]);

  // Calculate totals whenever invoice items change
  useEffect(() => {
    const subtotal = invoice.items.reduce((sum, item) => sum + item.total, 0);
    const discountTotal = invoice.items.reduce(
      (sum, item) => sum + item.discount,
      0,
    );
    const taxTotal = invoice.items.reduce((sum, item) => sum + item.tax, 0);
    const grandTotal = subtotal - discountTotal + taxTotal;

    setInvoice((prev) => ({
      ...prev,
      subtotal,
      discountTotal,
      taxTotal,
      grandTotal,
    }));
  }, [invoice.items]);

  const handleCustomerChange = (customerId: string) => {
    const customer = customers.find((c) => c.id === customerId);
    setInvoice((prev) => ({
      ...prev,
      customerId,
      customerName: customer ? customer.name : "",
    }));
  };

  // Update available batches when an item is selected
  useEffect(() => {
    if (selectedItem) {
      const item = items.find((i) => i.id === selectedItem);
      if (item && item.batches) {
        setAvailableBatches(item.batches);
      } else {
        setAvailableBatches([]);
      }
      setSelectedBatch("");
      setSelectedBatchQty(0);
    } else {
      setAvailableBatches([]);
      setSelectedBatch("");
      setSelectedBatchQty(0);
    }
  }, [selectedItem, items]);

  // Update selected batch quantity when a batch is selected
  useEffect(() => {
    if (selectedBatch) {
      const batch = availableBatches.find((b) => b.id === selectedBatch);
      if (batch) {
        setSelectedBatchQty(batch.availableQty);
      } else {
        setSelectedBatchQty(0);
      }
    } else {
      setSelectedBatchQty(0);
    }
  }, [selectedBatch, availableBatches]);

  const handleAddItem = () => {
    if (!selectedItem || !selectedBatch) return;

    const item = items.find((i) => i.id === selectedItem);
    const batch = availableBatches.find((b) => b.id === selectedBatch);

    if (!item || !batch) return;

    const newItem: InvoiceItem = {
      id: `line-${Date.now()}`,
      itemId: item.id,
      itemName: item.name,
      batchId: batch.id,
      batchNo: batch.batchNo,
      batchQty: batch.availableQty,
      quantity: 1,
      unitPrice: item.unitPrice,
      discount: 0,
      tax: item.unitPrice * 0.05, // 5% tax for example
      total: item.unitPrice,
    };

    setInvoice((prev) => ({
      ...prev,
      items: [...prev.items, newItem],
    }));

    // Reset selections
    setSelectedItem("");
    setSelectedBatch("");
    setSelectedBatchQty(0);
  };

  const handleSaveInvoice = () => {
    // Validate required fields
    if (!invoice.customerId || invoice.items.length === 0) {
      toast({
        title: "Validation Error",
        description: "Please select a customer and add at least one item",
        variant: "destructive",
      });
      return;
    }

    // In a real application, you would save the invoice to an API
    console.log("Saving invoice:", invoice);

    toast({
      title: "Success",
      description: `Sales invoice ${invoice.invoiceNumber} has been ${isEditing ? "updated" : "created"} successfully`,
    });

    navigate("/pharmacy/sales/invoices");
  };

  const handleCancel = () => {
    navigate("/pharmacy/sales/invoices");
  };

  const handleCreateReturn = () => {
    if (isEditing) {
      navigate(`/pharmacy/sales/returns/new?invoiceId=${id}`);
    }
  };

  // Define columns for the items table
  const columns: Column<InvoiceItem>[] = [
    {
      header: "Item",
      accessorKey: "itemId",
      width: "20%",
      cellType: "dropdown",
      cell: (item) => {
        return (
          <SearchableSelect
            label=""
            options={items.map((i) => ({ id: i.id, name: i.name }))}
            value={item.itemId || ""}
            onValueChange={(value) => {
              const selectedItem = items.find((i) => i.id === value);
              if (selectedItem) {
                const updatedItems = [...invoice.items];
                const index = updatedItems.findIndex((i) => i.id === item.id);
                if (index !== -1) {
                  updatedItems[index] = {
                    ...updatedItems[index],
                    itemId: selectedItem.id,
                    itemName: selectedItem.name,
                    unitPrice: selectedItem.unitPrice,
                    batchId: "",
                    batchNo: "",
                    batchQty: 0,
                    tax: selectedItem.unitPrice * 0.05, // 5% tax for example
                  };
                  setInvoice((prev) => ({
                    ...prev,
                    items: updatedItems,
                  }));
                }
              }
            }}
            placeholder="Select Item"
            showSelectedLabel={true}
            className="w-full"
          />
        );
      },
    },
    {
      header: "Batch No",
      accessorKey: "batchId",
      width: "10%",
      cellType: "dropdown",
      cell: (item) => {
        const selectedItem = items.find((i) => i.id === item.itemId);
        const batches = selectedItem?.batches || [];

        return (
          <SearchableSelect
            label=""
            options={batches.map((batch) => ({
              id: batch.id,
              name: `${batch.batchNo} (Exp: ${batch.expiryDate})`,
            }))}
            value={item.batchId || ""}
            onValueChange={(value) => {
              const selectedBatch = batches.find((b) => b.id === value);
              if (selectedBatch) {
                const updatedItems = [...invoice.items];
                const index = updatedItems.findIndex((i) => i.id === item.id);
                if (index !== -1) {
                  updatedItems[index] = {
                    ...updatedItems[index],
                    batchId: selectedBatch.id,
                    batchNo: selectedBatch.batchNo,
                    batchQty: selectedBatch.availableQty,
                  };
                  setInvoice((prev) => ({
                    ...prev,
                    items: updatedItems,
                  }));
                }
              }
            }}
            placeholder="Select Batch"
            showSelectedLabel={true}
            className="w-full"
            disabled={!item.itemId}
          />
        );
      },
    },
    {
      header: "Batch Qty",
      accessorKey: "batchQty",
      width: "10%",
      cellType: "text",
      cell: (item) => item.batchQty.toString(),
      isReadOnly: true,
    },

    {
      header: "Quantity",
      accessorKey: "quantity",
      cellType: "number",
      width: "10%",
      min: 1,
      required: true,
      isValid: (value, row) =>
        Number(value) > 0 && Number(value) <= row.batchQty,
    },
    {
      header: "Unit Price",
      accessorKey: "unitPrice",
      cellType: "number",
      width: "12%",
      min: 0,
      required: true,
      cell: (item) => `${item.unitPrice.toFixed(2)}`,
    },
    {
      header: "Discount",
      accessorKey: "discount",
      cellType: "number",
      width: "12%",
      min: 0,
      cell: (item) => `${item.discount.toFixed(2)}`,
    },
    {
      header: "Tax",
      accessorKey: "tax",
      cellType: "number",
      width: "10%",
      min: 0,
      cell: (item) => `${item.tax.toFixed(2)}`,
    },
    {
      header: "Total",
      accessorKey: "total",
      width: "16%",
      cell: (item) => `${item.total.toFixed(2)}`,
    },
  ];

  const handleItemsChange = (updatedItems: InvoiceItem[]) => {
    // Process each item to ensure all required fields are populated
    const processedItems = updatedItems.map((item) => {
      // If item has an ID but is missing other values, ensure they're populated
      if (item.itemId) {
        const selectedItem = items.find((i) => i.id === item.itemId);
        if (selectedItem) {
          // If batch is selected, get batch details
          let batchQty = item.batchQty;
          let batchNo = item.batchNo;

          if (item.batchId) {
            const selectedBatch = getAvailableBatchesForItem(item.itemId).find(
              (b) => b.id === item.batchId,
            );
            if (selectedBatch) {
              batchQty = selectedBatch.availableQty;
              batchNo = selectedBatch.batchNo;
            }
          }

          // Calculate totals
          const subtotal = item.quantity * item.unitPrice;
          const total = subtotal - item.discount + item.tax;

          // Validate quantity against batch quantity
          let quantity = item.quantity;
          if (item.batchId && quantity > batchQty) {
            toast({
              title: "Quantity Error",
              description: `Quantity for ${item.itemName} exceeds available batch quantity of ${batchQty}`,
              variant: "destructive",
            });
            // Reset to batch quantity or 1, whichever is smaller
            quantity = Math.min(batchQty, 1);
          }

          return {
            ...item,
            itemName: selectedItem.name,
            batchQty,
            batchNo,
            quantity,
            unitPrice: item.unitPrice || selectedItem.unitPrice,
            tax: (item.unitPrice || selectedItem.unitPrice) * 0.05, // 5% tax for example
            total,
          };
        }
      }

      // If no changes needed or item not found, return as is
      return item;
    });

    setInvoice((prev) => ({
      ...prev,
      items: processedItems,
    }));
  };

  // Function to create a new empty invoice item
  const createEmptyInvoiceItem = (): InvoiceItem => ({
    id: `line-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
    itemId: "",
    itemName: "",
    batchId: "",
    batchNo: "",
    batchQty: 0,
    quantity: 1,
    unitPrice: 0,
    discount: 0,
    tax: 0,
    total: 0,
  });

  // Get available batches for a specific item
  const getAvailableBatchesForItem = (itemId: string): Batch[] => {
    const item = items.find((i) => i.id === itemId);
    return item?.batches || [];
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="icon" onClick={handleCancel}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h2 className="text-2xl font-bold">
            {isEditing
              ? `Edit Sales Invoice #${invoice.invoiceNumber}`
              : "Create New Sales Invoice"}
          </h2>
        </div>
        <div className="flex space-x-2">
          {isEditing && (
            <Button variant="outline" onClick={handleCreateReturn}>
              <FileText className="mr-2 h-4 w-4" />
              Create Return
            </Button>
          )}
          <Button onClick={handleSaveInvoice}>
            <Save className="mr-2 h-4 w-4" />
            Save Invoice
          </Button>
        </div>
      </div>

      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="space-y-2">
            <Label htmlFor="invoiceNumber">Invoice Number</Label>
            <Input
              id="invoiceNumber"
              value={invoice.invoiceNumber}
              onChange={(e) =>
                setInvoice({ ...invoice, invoiceNumber: e.target.value })
              }
              readOnly={isEditing}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              value={invoice.date}
              onChange={(e) => setInvoice({ ...invoice, date: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <SearchableSelect
              label="Customer"
              options={customers.map((c) => ({ id: c.id, name: c.name }))}
              value={invoice.customerId}
              onValueChange={handleCustomerChange}
              placeholder="Select a customer"
              required
              showSelectedLabel
            />
          </div>

          <div className="space-y-2 col-span-full">
            <Label htmlFor="notes">Notes</Label>
            <Input
              id="notes"
              value={invoice.notes}
              onChange={(e) =>
                setInvoice({ ...invoice, notes: e.target.value })
              }
              placeholder="Add notes about this invoice"
            />
          </div>
        </CardContent>
      </Card>

      {/* Invoice Items */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Invoice Items</CardTitle>
            <div className="flex items-center space-x-2">
              <div className="flex space-x-2">
                <SearchableSelect
                  label=""
                  options={items.map((i) => ({ id: i.id, name: i.name }))}
                  value={selectedItem}
                  onValueChange={setSelectedItem}
                  placeholder="Select an item"
                  className="w-48"
                />
                <SearchableSelect
                  label=""
                  options={availableBatches.map((b) => ({
                    id: b.id,
                    name: `${b.batchNo} (Exp: ${b.expiryDate})`,
                  }))}
                  value={selectedBatch}
                  onValueChange={setSelectedBatch}
                  placeholder="Select batch"
                  className="w-48"
                  disabled={!selectedItem || availableBatches.length === 0}
                />
                <div className="flex items-center space-x-2 bg-muted px-3 py-2 rounded-md">
                  <span className="text-sm font-medium">Available Qty:</span>
                  <span className="text-sm font-bold">{selectedBatchQty}</span>
                </div>
              </div>
              <Button
                onClick={handleAddItem}
                disabled={!selectedItem || !selectedBatch}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Item
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <DataTable
            data={invoice.items}
            columns={columns}
            onSave={handleItemsChange}
            isSearchable={false}
            isPaginated={false}
            addButtonText="Add Item Manually"
            onAddRow={() => {
              setInvoice((prev) => ({
                ...prev,
                items: [...prev.items, createEmptyInvoiceItem()],
              }));
            }}
          />
        </CardContent>
      </Card>

      {/* Invoice Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Invoice Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between py-2">
              <span className="font-medium">Subtotal:</span>
              <span>${invoice.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="font-medium">Discount Total:</span>
              <span>${invoice.discountTotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="font-medium">Tax Total:</span>
              <span>${invoice.taxTotal.toFixed(2)}</span>
            </div>
            <Separator />
            <div className="flex justify-between py-2">
              <span className="font-bold text-lg">Grand Total:</span>
              <span className="font-bold text-lg">
                ${invoice.grandTotal.toFixed(2)}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SalesInvoiceForm;
