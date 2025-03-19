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
import { ArrowLeft, Save, FileText, Plus } from "lucide-react";

interface Customer {
  id: string;
  name: string;
}

interface SalesInvoice {
  id: string;
  invoiceNumber: string;
  date: string;
  customerId: string;
  customerName: string;
  items: InvoiceItem[];
}

interface InvoiceItem {
  id: string;
  itemId: string;
  itemName: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

interface ReturnItem {
  id: string;
  itemId: string;
  itemName: string;
  invoiceItemId: string;
  originalQuantity: number;
  returnQuantity: number;
  unitPrice: number;
  total: number;
  reason: string;
}

interface SalesReturn {
  id: string;
  returnNumber: string;
  date: string;
  invoiceId: string;
  invoiceNumber: string;
  customerId: string;
  customerName: string;
  subtotal: number;
  grandTotal: number;
  notes: string;
  status: string;
  items: ReturnItem[];
}

const SalesReturnForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const isEditing = !!id;

  // Get invoice ID from query params if creating a return from an invoice
  const queryParams = new URLSearchParams(location.search);
  const invoiceIdFromQuery = queryParams.get("invoiceId");

  // Sample data for demonstration
  const [customers] = useState<Customer[]>([
    { id: "cust-001", name: "John Doe" },
    { id: "cust-002", name: "Jane Smith" },
    { id: "cust-003", name: "Robert Johnson" },
    { id: "cust-004", name: "Emily Davis" },
    { id: "cust-005", name: "Michael Wilson" },
  ]);

  const [invoices, setInvoices] = useState<SalesInvoice[]>([
    {
      id: "inv-001",
      invoiceNumber: "SI-001",
      date: "2023-06-15",
      customerId: "cust-001",
      customerName: "John Doe",
      items: [
        {
          id: "line-001",
          itemId: "item-001",
          itemName: "Paracetamol 500mg",
          quantity: 100,
          unitPrice: 5.99,
          total: 599.0,
        },
        {
          id: "line-002",
          itemId: "item-003",
          itemName: "Vitamin C 1000mg",
          quantity: 50,
          unitPrice: 8.75,
          total: 437.5,
        },
        {
          id: "line-003",
          itemId: "item-005",
          itemName: "Cetirizine 10mg",
          quantity: 20,
          unitPrice: 9.99,
          total: 199.8,
        },
      ],
    },
    {
      id: "inv-002",
      invoiceNumber: "SI-002",
      date: "2023-06-16",
      customerId: "cust-002",
      customerName: "Jane Smith",
      items: [
        {
          id: "line-004",
          itemId: "item-002",
          itemName: "Amoxicillin 250mg",
          quantity: 30,
          unitPrice: 12.5,
          total: 375.0,
        },
        {
          id: "line-005",
          itemId: "item-004",
          itemName: "Ibuprofen 400mg",
          quantity: 40,
          unitPrice: 7.25,
          total: 290.0,
        },
      ],
    },
  ]);

  const [salesReturn, setSalesReturn] = useState<SalesReturn>({
    id: isEditing ? id : `ret-${Date.now()}`,
    returnNumber: isEditing
      ? ""
      : `SR-${Math.floor(Math.random() * 1000)
          .toString()
          .padStart(3, "0")}`,
    date: new Date().toISOString().split("T")[0],
    invoiceId: invoiceIdFromQuery || "",
    invoiceNumber: "",
    customerId: "",
    customerName: "",
    subtotal: 0,
    grandTotal: 0,
    notes: "",
    status: "pending",
    items: [],
  });

  const [selectedInvoiceItems, setSelectedInvoiceItems] = useState<
    InvoiceItem[]
  >([]);
  const [selectedItem, setSelectedItem] = useState<string>("");

  // Load return data if editing
  useEffect(() => {
    if (isEditing) {
      // In a real application, you would fetch the return data from an API
      // For demonstration, we'll use mock data
      if (id === "ret-001") {
        setSalesReturn({
          id: "ret-001",
          returnNumber: "SR-001",
          date: "2023-06-16",
          invoiceId: "inv-001",
          invoiceNumber: "SI-001",
          customerId: "cust-001",
          customerName: "John Doe",
          subtotal: 250.0,
          grandTotal: 250.0,
          notes: "Customer returned items due to expiry",
          status: "completed",
          items: [
            {
              id: "rline-001",
              itemId: "item-001",
              itemName: "Paracetamol 500mg",
              invoiceItemId: "line-001",
              originalQuantity: 100,
              returnQuantity: 20,
              unitPrice: 5.99,
              total: 119.8,
              reason: "Expired",
            },
            {
              id: "rline-002",
              itemId: "item-003",
              itemName: "Vitamin C 1000mg",
              invoiceItemId: "line-002",
              originalQuantity: 50,
              returnQuantity: 15,
              unitPrice: 8.75,
              total: 131.25,
              reason: "Damaged packaging",
            },
          ],
        });
      }
    }
  }, [id, isEditing]);

  // Load invoice data when invoice ID changes
  useEffect(() => {
    if (salesReturn.invoiceId) {
      const invoice = invoices.find((inv) => inv.id === salesReturn.invoiceId);
      if (invoice) {
        setSalesReturn((prev) => ({
          ...prev,
          invoiceNumber: invoice.invoiceNumber,
          customerId: invoice.customerId,
          customerName: invoice.customerName,
        }));
        setSelectedInvoiceItems(invoice.items);
      }
    } else {
      setSelectedInvoiceItems([]);
    }
  }, [salesReturn.invoiceId, invoices]);

  // Calculate totals whenever return items change
  useEffect(() => {
    const subtotal = salesReturn.items.reduce(
      (sum, item) => sum + item.total,
      0,
    );
    const grandTotal = subtotal; // No additional calculations for returns in this example

    setSalesReturn((prev) => ({
      ...prev,
      subtotal,
      grandTotal,
    }));
  }, [salesReturn.items]);

  const handleInvoiceChange = (invoiceId: string) => {
    setSalesReturn((prev) => ({
      ...prev,
      invoiceId,
      items: [], // Clear items when invoice changes
    }));
  };

  const handleAddItem = () => {
    if (!selectedItem) return;

    const invoiceItem = selectedInvoiceItems.find((i) => i.id === selectedItem);
    if (!invoiceItem) return;

    // Check if item is already added
    const existingItem = salesReturn.items.find(
      (i) => i.invoiceItemId === invoiceItem.id,
    );
    if (existingItem) {
      toast({
        title: "Item already added",
        description: "This item is already in the return list",
        variant: "destructive",
      });
      return;
    }

    const newItem: ReturnItem = {
      id: `rline-${Date.now()}`,
      itemId: invoiceItem.itemId,
      itemName: invoiceItem.itemName,
      invoiceItemId: invoiceItem.id,
      originalQuantity: invoiceItem.quantity,
      returnQuantity: 1,
      unitPrice: invoiceItem.unitPrice,
      total: invoiceItem.unitPrice,
      reason: "",
    };

    setSalesReturn((prev) => ({
      ...prev,
      items: [...prev.items, newItem],
    }));

    setSelectedItem("");
  };

  const handleSaveReturn = () => {
    // Validate required fields
    if (!salesReturn.invoiceId || salesReturn.items.length === 0) {
      toast({
        title: "Validation Error",
        description: "Please select an invoice and add at least one item",
        variant: "destructive",
      });
      return;
    }

    // Validate return quantities
    const invalidItems = salesReturn.items.filter(
      (item) =>
        item.returnQuantity <= 0 || item.returnQuantity > item.originalQuantity,
    );

    if (invalidItems.length > 0) {
      toast({
        title: "Validation Error",
        description:
          "Return quantity must be greater than 0 and not exceed the original quantity",
        variant: "destructive",
      });
      return;
    }

    // In a real application, you would save the return to an API
    console.log("Saving sales return:", salesReturn);

    toast({
      title: "Success",
      description: `Sales return ${salesReturn.returnNumber} has been ${isEditing ? "updated" : "created"} successfully`,
    });

    navigate("/pharmacy/sales/returns");
  };

  const handleCancel = () => {
    navigate("/pharmacy/sales/returns");
  };

  // Define columns for the items table
  const columns: Column<ReturnItem>[] = [
    {
      header: "Item",
      accessorKey: "itemName",
      width: "25%",
    },
    {
      header: "Original Qty",
      accessorKey: "originalQuantity",
      width: "15%",
      cell: (item) => item.originalQuantity.toString(),
    },
    {
      header: "Return Qty",
      accessorKey: "returnQuantity",
      cellType: "number",
      width: "15%",
      min: 1,
      required: true,
      isValid: (value) => {
        const numValue = Number(value);
        const item = salesReturn.items.find(
          (i) => i.returnQuantity === numValue,
        );
        return numValue > 0 && (!item || numValue <= item.originalQuantity);
      },
    },
    {
      header: "Unit Price",
      accessorKey: "unitPrice",
      width: "15%",
      cell: (item) => `$${item.unitPrice.toFixed(2)}`,
    },
    {
      header: "Total",
      accessorKey: "total",
      width: "15%",
      cell: (item) => `$${item.total.toFixed(2)}`,
    },
    {
      header: "Reason",
      accessorKey: "reason",
      width: "15%",
    },
  ];

  const handleItemsChange = (updatedItems: ReturnItem[]) => {
    // Recalculate totals for each item
    const recalculatedItems = updatedItems.map((item) => {
      const total = item.returnQuantity * item.unitPrice;
      return {
        ...item,
        total,
      };
    });

    setSalesReturn((prev) => ({
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
              ? `Edit Sales Return #${salesReturn.returnNumber}`
              : "Create New Sales Return"}
          </h2>
        </div>
        <div className="flex space-x-2">
          <Button onClick={handleSaveReturn}>
            <Save className="mr-2 h-4 w-4" />
            Save Return
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
            <Label htmlFor="returnNumber">Return Number</Label>
            <Input
              id="returnNumber"
              value={salesReturn.returnNumber}
              onChange={(e) =>
                setSalesReturn({
                  ...salesReturn,
                  returnNumber: e.target.value,
                })
              }
              readOnly={isEditing}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              value={salesReturn.date}
              onChange={(e) =>
                setSalesReturn({ ...salesReturn, date: e.target.value })
              }
            />
          </div>

          <div className="space-y-2">
            <SearchableSelect
              label="Invoice"
              options={invoices.map((inv) => ({
                id: inv.id,
                name: inv.invoiceNumber,
              }))}
              value={salesReturn.invoiceId}
              onValueChange={handleInvoiceChange}
              placeholder="Select an invoice"
              required
              showSelectedLabel
              disabled={isEditing || !!invoiceIdFromQuery}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="customer">Customer</Label>
            <Input id="customer" value={salesReturn.customerName} readOnly />
          </div>

          <div className="space-y-2 col-span-full">
            <Label htmlFor="notes">Notes</Label>
            <Input
              id="notes"
              value={salesReturn.notes}
              onChange={(e) =>
                setSalesReturn({ ...salesReturn, notes: e.target.value })
              }
              placeholder="Add notes about this return"
            />
          </div>
        </CardContent>
      </Card>

      {/* Return Items */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Return Items</CardTitle>
            <div className="flex items-center space-x-2">
              <SearchableSelect
                label=""
                options={selectedInvoiceItems.map((i) => ({
                  id: i.id,
                  name: i.itemName,
                }))}
                value={selectedItem}
                onValueChange={setSelectedItem}
                placeholder="Select an item from invoice"
                className="w-64"
                disabled={!salesReturn.invoiceId}
              />
              <Button
                onClick={handleAddItem}
                disabled={!selectedItem || !salesReturn.invoiceId}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Item
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {!salesReturn.invoiceId ? (
            <div className="text-center py-8 text-muted-foreground">
              Please select an invoice first to add return items
            </div>
          ) : (
            <DataTable
              data={salesReturn.items}
              columns={columns}
              onSave={handleItemsChange}
              isSearchable={false}
              isPaginated={false}
              addButtonText="Add Item Manually"
              noDataText="No items added to this return yet"
            />
          )}
        </CardContent>
      </Card>

      {/* Return Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Return Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between py-2">
              <span className="font-medium">Subtotal:</span>
              <span>${salesReturn.subtotal.toFixed(2)}</span>
            </div>
            <Separator />
            <div className="flex justify-between py-2">
              <span className="font-bold text-lg">Grand Total:</span>
              <span className="font-bold text-lg">
                ${salesReturn.grandTotal.toFixed(2)}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SalesReturnForm;
