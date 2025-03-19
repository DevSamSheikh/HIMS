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

interface ReturnItem {
  id: string;
  itemCode: string;
  itemName: string;
  batchNumber: string;
  expiryDate: string;
  quantity: number;
  unitPrice: number;
  reason: string;
  total: number;
}

const SaleReturnForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isEditMode = id !== undefined;

  // Form state
  const [returnNumber, setReturnNumber] = useState(
    isEditMode ? `SR-${id}` : "SR-" + Date.now().toString().slice(-6),
  );
  const [returnDate, setReturnDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [customer, setCustomer] = useState("");
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [invoiceDate, setInvoiceDate] = useState("");
  const [returnReason, setReturnReason] = useState("");
  const [items, setItems] = useState<ReturnItem[]>([]);
  const [totalAmount, setTotalAmount] = useState(0);

  // Sample data for edit mode
  React.useEffect(() => {
    if (isEditMode) {
      // In a real app, you would fetch the return data from an API
      setCustomer("John Doe");
      setInvoiceNumber("SI-001");
      setInvoiceDate("2023-08-01");
      setReturnReason("Customer dissatisfaction");

      const sampleItems: ReturnItem[] = [
        {
          id: "item-1",
          itemCode: "MED001",
          itemName: "Paracetamol 500mg",
          batchNumber: "B12345",
          expiryDate: "2024-12-31",
          quantity: 5,
          unitPrice: 5.5,
          reason: "Expired",
          total: 27.5,
        },
        {
          id: "item-2",
          itemCode: "MED002",
          itemName: "Amoxicillin 250mg",
          batchNumber: "B12346",
          expiryDate: "2024-10-31",
          quantity: 3,
          unitPrice: 8.75,
          reason: "Wrong medication",
          total: 26.25,
        },
      ];

      setItems(sampleItems);
      calculateTotal(sampleItems);
    }
  }, [isEditMode, id]);

  const calculateTotal = (itemsList: ReturnItem[]) => {
    const total = itemsList.reduce((sum, item) => sum + item.total, 0);
    setTotalAmount(total);
  };

  const columns: Column<ReturnItem>[] = [
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
      header: "Reason",
      accessorKey: "reason",
      required: true,
    },
    {
      header: "Total",
      accessorKey: "total",
      cellType: "number",
      cell: (row) => `$${row.total.toFixed(2)}`,
    },
  ];

  const handleSaveItems = (updatedItems: ReturnItem[]) => {
    setItems(updatedItems);
    calculateTotal(updatedItems);
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

    if (!invoiceNumber) {
      toast({
        title: "Validation Error",
        description: "Invoice number is required",
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

    // In a real app, you would save the return data to an API
    toast({
      title: "Success",
      description: isEditMode
        ? "Sale return updated successfully"
        : "Sale return created successfully",
    });

    // Navigate back to the list
    navigate("/pharmacy/sales/returns");
  };

  const handleCancel = () => {
    navigate("/pharmacy/sales/returns");
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate("/pharmacy/sales/returns")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h2 className="text-xl font-semibold">
            {isEditMode ? "Edit Sale Return" : "New Sale Return"}
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
              <Label htmlFor="returnNumber">Return Number</Label>
              <Input
                id="returnNumber"
                value={returnNumber}
                onChange={(e) => setReturnNumber(e.target.value)}
                className="mt-1"
                readOnly
              />
            </div>
            <div>
              <Label htmlFor="returnDate">Return Date</Label>
              <Input
                id="returnDate"
                type="date"
                value={returnDate}
                onChange={(e) => setReturnDate(e.target.value)}
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
              <Label htmlFor="invoiceNumber">Invoice Number</Label>
              <Input
                id="invoiceNumber"
                value={invoiceNumber}
                onChange={(e) => setInvoiceNumber(e.target.value)}
                className="mt-1"
                placeholder="Select invoice number"
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
                readOnly
              />
            </div>
            <div>
              <Label htmlFor="returnReason">Return Reason</Label>
              <Input
                id="returnReason"
                value={returnReason}
                onChange={(e) => setReturnReason(e.target.value)}
                className="mt-1"
                placeholder="Enter general return reason"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-2">
        <h3 className="text-lg font-medium">Return Items</h3>
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
            <div className="flex justify-between font-bold">
              <span>Total Return Amount:</span>
              <span>${totalAmount.toFixed(2)}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SaleReturnForm;
