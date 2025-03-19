import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import DataTable, { Column } from "@/components/ui/data-table";
import { ArrowLeft, Save, Printer, X } from "lucide-react";

interface SaleItem {
  id: string;
  itemCode: string;
  itemName: string;
  batchNumber: string;
  expiryDate: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  tax: number;
  total: number;
}

const SaleInvoiceForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isEditMode = id !== undefined;

  // Form state
  const [invoiceNumber, setInvoiceNumber] = useState(
    isEditMode ? `SI-${id}` : "SI-" + Date.now().toString().slice(-6),
  );
  const [invoiceDate, setInvoiceDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [customer, setCustomer] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [doctor, setDoctor] = useState("");
  const [prescription, setPrescription] = useState("");
  const [items, setItems] = useState<SaleItem[]>([]);
  const [subtotal, setSubtotal] = useState(0);
  const [taxAmount, setTaxAmount] = useState(0);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);

  // Sample data for edit mode
  React.useEffect(() => {
    if (isEditMode) {
      // In a real app, you would fetch the invoice data from an API
      setCustomer("John Doe");
      setCustomerPhone("+1 (555) 123-4567");
      setDoctor("Dr. Smith");
      setPrescription("RX-12345");

      const sampleItems: SaleItem[] = [
        {
          id: "item-1",
          itemCode: "MED001",
          itemName: "Paracetamol 500mg",
          batchNumber: "B12345",
          expiryDate: "2024-12-31",
          quantity: 20,
          unitPrice: 5.5,
          discount: 0,
          tax: 5,
          total: 110.0,
        },
        {
          id: "item-2",
          itemCode: "MED002",
          itemName: "Amoxicillin 250mg",
          batchNumber: "B12346",
          expiryDate: "2024-10-31",
          quantity: 15,
          unitPrice: 8.75,
          discount: 5,
          tax: 5,
          total: 124.69,
        },
      ];

      setItems(sampleItems);
      calculateTotals(sampleItems);
    }
  }, [isEditMode, id]);

  const calculateTotals = (itemsList: SaleItem[]) => {
    const sub = itemsList.reduce((sum, item) => sum + item.total, 0);
    const tax = itemsList.reduce(
      (sum, item) => sum + (item.total * item.tax) / 100,
      0,
    );
    const discount = itemsList.reduce(
      (sum, item) =>
        sum + (item.unitPrice * item.quantity * item.discount) / 100,
      0,
    );

    setSubtotal(sub);
    setTaxAmount(tax);
    setDiscountAmount(discount);
    setTotalAmount(sub + tax - discount);
  };

  const columns: Column<SaleItem>[] = [
    {
      header: "Item Code",
      accessorKey: "itemCode",
      required: true,
    },
    {
      header: "Item Name",
      accessorKey: "itemName",
      required: true,
      width: "200px",
    },
    {
      header: "Batch #",
      accessorKey: "batchNumber",
    },
    {
      header: "Expiry",
      accessorKey: "expiryDate",
      cellType: "date",
    },
    {
      header: "Qty",
      accessorKey: "quantity",
      cellType: "number",
      required: true,
      min: 1,
    },
    {
      header: "Unit Price",
      accessorKey: "unitPrice",
      cellType: "number",
      required: true,
      min: 0.01,
    },
    {
      header: "Discount %",
      accessorKey: "discount",
      cellType: "number",
      min: 0,
      max: 100,
    },
    {
      header: "Tax %",
      accessorKey: "tax",
      cellType: "number",
      min: 0,
      max: 100,
    },
    {
      header: "Total",
      accessorKey: "total",
      cellType: "number",
      cell: (row) => `$${row.total.toFixed(2)}`,
    },
  ];

  const handleSaveItems = (updatedItems: SaleItem[]) => {
    setItems(updatedItems);
    calculateTotals(updatedItems);
  };

  const handleSave = () => {
    // Validate form
    if (!customer) {
      toast({
        title: "Validation Error",
        description: "Customer is required",
        variant: "destructive",
      });
      return;
    }

    if (items.length === 0) {
      toast({
        title: "Validation Error",
        description: "At least one item is required",
        variant: "destructive",
      });
      return;
    }

    // In a real app, you would save the invoice data to an API
    toast({
      title: "Success",
      description: isEditMode
        ? "Sale invoice updated successfully"
        : "Sale invoice created successfully",
    });

    // Navigate back to the list
    navigate("/pharmacy/sales/invoices");
  };

  const handleCancel = () => {
    navigate("/pharmacy/sales/invoices");
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate("/pharmacy/sales/invoices")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h2 className="text-xl font-semibold">
            {isEditMode ? "Edit Sale Invoice" : "New Sale Invoice"}
          </h2>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handleCancel}>
            <X className="mr-2 h-4 w-4" /> Cancel
          </Button>
          <Button variant="outline">
            <Printer className="mr-2 h-4 w-4" /> Print
          </Button>
          <Button onClick={handleSave}>
            <Save className="mr-2 h-4 w-4" /> Save
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <Label htmlFor="invoiceNumber">Invoice Number</Label>
              <Input
                id="invoiceNumber"
                value={invoiceNumber}
                onChange={(e) => setInvoiceNumber(e.target.value)}
                className="mt-1"
                readOnly
              />
            </div>
            <div>
              <Label htmlFor="invoiceDate">Invoice Date</Label>
              <Input
                id="invoiceDate"
                type="date"
                value={invoiceDate}
                onChange={(e) => setInvoiceDate(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="customer">Customer</Label>
              <Input
                id="customer"
                value={customer}
                onChange={(e) => setCustomer(e.target.value)}
                className="mt-1"
                placeholder="Select or enter customer name"
              />
            </div>
            <div>
              <Label htmlFor="customerPhone">Customer Phone</Label>
              <Input
                id="customerPhone"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                className="mt-1"
                placeholder="Enter customer phone"
              />
            </div>
            <div>
              <Label htmlFor="doctor">Doctor</Label>
              <Input
                id="doctor"
                value={doctor}
                onChange={(e) => setDoctor(e.target.value)}
                className="mt-1"
                placeholder="Enter doctor name (optional)"
              />
            </div>
            <div>
              <Label htmlFor="prescription">Prescription #</Label>
              <Input
                id="prescription"
                value={prescription}
                onChange={(e) => setPrescription(e.target.value)}
                className="mt-1"
                placeholder="Enter prescription number (optional)"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-2">
        <h3 className="text-lg font-medium">Invoice Items</h3>
        <DataTable
          data={items}
          columns={columns}
          onSave={handleSaveItems}
          addButtonText="Add Item"
          noDataText="No items added yet"
          isSearchable={false}
          isPaginated={false}
          keyboardShortcuts={true}
        />
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col space-y-3 md:w-1/3 md:ml-auto">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax Amount:</span>
              <span>${taxAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Discount Amount:</span>
              <span>${discountAmount.toFixed(2)}</span>
            </div>
            <Separator />
            <div className="flex justify-between font-bold">
              <span>Total Amount:</span>
              <span>${totalAmount.toFixed(2)}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SaleInvoiceForm;
