import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
}

interface InvoiceItem {
  id: string;
  itemId: string;
  itemName: string;
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
  const { toast } = useToast();
  const isEditing = !!id;

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
    },
    {
      id: "item-002",
      name: "Amoxicillin 250mg",
      code: "A250",
      category: "Antibiotics",
      unitPrice: 12.5,
      availableQty: 300,
    },
    {
      id: "item-003",
      name: "Vitamin C 1000mg",
      code: "VC1000",
      category: "Vitamins",
      unitPrice: 8.75,
      availableQty: 200,
    },
    {
      id: "item-004",
      name: "Ibuprofen 400mg",
      code: "I400",
      category: "Analgesics",
      unitPrice: 7.25,
      availableQty: 400,
    },
    {
      id: "item-005",
      name: "Cetirizine 10mg",
      code: "C10",
      category: "Antihistamines",
      unitPrice: 9.99,
      availableQty: 250,
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

  // Load invoice data if editing
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
    }
  }, [id, isEditing]);

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

  const handleAddItem = () => {
    if (!selectedItem) return;

    const item = items.find((i) => i.id === selectedItem);
    if (!item) return;

    const newItem: InvoiceItem = {
      id: `line-${Date.now()}`,
      itemId: item.id,
      itemName: item.name,
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

    setSelectedItem("");
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
      accessorKey: "itemName",
      width: "30%",
    },
    {
      header: "Quantity",
      accessorKey: "quantity",
      cellType: "number",
      width: "15%",
      min: 1,
      required: true,
      isValid: (value) => Number(value) > 0,
    },
    {
      header: "Unit Price",
      accessorKey: "unitPrice",
      cellType: "number",
      width: "15%",
      min: 0,
      required: true,
      cell: (item) => `$${item.unitPrice.toFixed(2)}`,
    },
    {
      header: "Discount",
      accessorKey: "discount",
      cellType: "number",
      width: "15%",
      min: 0,
      cell: (item) => `$${item.discount.toFixed(2)}`,
    },
    {
      header: "Tax",
      accessorKey: "tax",
      cellType: "number",
      width: "10%",
      min: 0,
      cell: (item) => `$${item.tax.toFixed(2)}`,
    },
    {
      header: "Total",
      accessorKey: "total",
      width: "15%",
      cell: (item) => `$${item.total.toFixed(2)}`,
    },
  ];

  const handleItemsChange = (updatedItems: InvoiceItem[]) => {
    // Recalculate totals for each item
    const recalculatedItems = updatedItems.map((item) => {
      const subtotal = item.quantity * item.unitPrice;
      const total = subtotal - item.discount + item.tax;
      return {
        ...item,
        total,
      };
    });

    setInvoice((prev) => ({
      ...prev,
      items: recalculatedItems,
    }));
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
              <SearchableSelect
                label=""
                options={items.map((i) => ({ id: i.id, name: i.name }))}
                value={selectedItem}
                onValueChange={setSelectedItem}
                placeholder="Select an item"
                className="w-64"
              />
              <Button onClick={handleAddItem} disabled={!selectedItem}>
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
