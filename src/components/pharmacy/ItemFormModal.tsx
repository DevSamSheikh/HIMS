import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Save, X } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import FormField from "@/components/ui/form-field";
import SearchableSelect from "@/components/ui/searchable-select";

interface ItemFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (item: any) => void;
  initialData?: any;
}

const ItemFormModal: React.FC<ItemFormModalProps> = ({
  open,
  onOpenChange,
  onSave,
  initialData,
}) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    itemCode: "",
    itemName: "",
    genericName: "",
    company: "1", // Default to first company
    isPack: false,
    packQty: 1,
    packPurchasePrice: 0,
    packSalePrice: 0,
    purchaseRatePercentage: 15,
    purchasePrice: 0,
    salePrice: 0,
    category: "1", // Default to first category
    uom: "1", // Default to first UOM
    isActive: true,
    maxSaleDiscount: 0,
    gst: 0,
    altItemCode: "",
    alias: "",
  });

  // Validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Mock data for dropdowns
  const [companies, setCompanies] = useState([
    { id: "1", name: "Pharma Co" },
    { id: "2", name: "MediCorp" },
    { id: "3", name: "HealthDrugs" },
  ]);

  const [categories, setCategories] = useState([
    { id: "1", name: "Antibiotics" },
    { id: "2", name: "Pain Relief" },
    { id: "3", name: "Vitamins" },
  ]);

  const [uoms, setUOMs] = useState([
    { id: "1", name: "Tablet" },
    { id: "2", name: "Bottle" },
    { id: "3", name: "Box" },
  ]);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => {
      const newData = { ...prev, [field]: value };

      // Calculate prices based on isPack, packQty, and percentages
      if (
        field === "isPack" ||
        field === "packQty" ||
        field === "packSalePrice" ||
        field === "packPurchasePrice" ||
        field === "purchaseRatePercentage" ||
        field === "salePrice" ||
        field === "purchasePrice"
      ) {
        if (newData.isPack) {
          // If pack is checked, calculate pack purchase price based on percentage
          if (field === "packSalePrice" || field === "purchaseRatePercentage") {
            newData.packPurchasePrice = Number(
              (
                (newData.packSalePrice *
                  (100 - newData.purchaseRatePercentage)) /
                100
              ).toFixed(2),
            );
          }

          // Calculate single unit prices
          if (newData.packQty > 0) {
            newData.salePrice = Number(
              (newData.packSalePrice / newData.packQty).toFixed(2),
            );
            newData.purchasePrice = Number(
              (newData.packPurchasePrice / newData.packQty).toFixed(2),
            );
          }
        } else {
          // If pack is unchecked, calculate pack prices
          if (field === "salePrice" || field === "purchaseRatePercentage") {
            newData.purchasePrice = Number(
              (
                (newData.salePrice * (100 - newData.purchaseRatePercentage)) /
                100
              ).toFixed(2),
            );
          }

          if (newData.packQty > 0) {
            newData.packSalePrice = Number(
              (newData.salePrice * newData.packQty).toFixed(2),
            );
            newData.packPurchasePrice = Number(
              (newData.purchasePrice * newData.packQty).toFixed(2),
            );
          }
        }
      }

      return newData;
    });
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Required fields validation
    if (!formData.itemName.trim()) {
      newErrors.itemName = "Item Name is required";
    }

    // Numeric validations
    if (formData.isPack && formData.packQty <= 0) {
      newErrors.packQty = "Pack quantity must be greater than 0";
    }

    if (formData.isPack && formData.packSalePrice < 0) {
      newErrors.packSalePrice = "Pack sale price cannot be negative";
    }

    if (formData.isPack && formData.packPurchasePrice < 0) {
      newErrors.packPurchasePrice = "Pack purchase price cannot be negative";
    }

    if (!formData.isPack && formData.salePrice < 0) {
      newErrors.salePrice = "Sale price cannot be negative";
    }

    if (!formData.isPack && formData.purchasePrice < 0) {
      newErrors.purchasePrice = "Purchase price cannot be negative";
    }

    if (
      formData.purchaseRatePercentage < 0 ||
      formData.purchaseRatePercentage > 100
    ) {
      newErrors.purchaseRatePercentage = "Percentage must be between 0 and 100";
    }

    if (formData.maxSaleDiscount < 0 || formData.maxSaleDiscount > 100) {
      newErrors.maxSaleDiscount = "Discount must be between 0 and 100";
    }

    if (formData.gst < 0 || formData.gst > 100) {
      newErrors.gst = "GST must be between 0 and 100";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      // Generate item code if not provided
      const dataToSave = {
        ...formData,
        itemCode:
          formData.itemCode ||
          `ITEM-${new Date().getTime().toString().slice(-6)}`,
      };

      onSave(dataToSave);
      onOpenChange(false);

      toast({
        title: "Success",
        description: "Item saved successfully",
        duration: 3000,
      });
    } else {
      toast({
        title: "Error",
        description: "Please fix the errors in the form",
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  const handleAddCompany = (name: string) => {
    const newId = (parseInt(companies[companies.length - 1].id) + 1).toString();
    const newCompany = { id: newId, name };
    setCompanies([...companies, newCompany]);
    handleChange("company", newId);
    return newId;
  };

  const handleAddCategory = (name: string) => {
    const newId = (
      parseInt(categories[categories.length - 1].id) + 1
    ).toString();
    const newCategory = { id: newId, name };
    setCategories([...categories, newCategory]);
    handleChange("category", newId);
    return newId;
  };

  const handleAddUom = (name: string) => {
    const newId = (parseInt(uoms[uoms.length - 1].id) + 1).toString();
    const newUom = { id: newId, name };
    setUOMs([...uoms, newUom]);
    handleChange("uom", newId);
    return newId;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {initialData ? "Edit Item" : "Add New Item"}
          </DialogTitle>
          <DialogDescription>
            Enter the details of the item below
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <FormField
              id="itemCode"
              label="Item Code"
              value={formData.itemCode}
              onChange={(value) => handleChange("itemCode", value)}
              placeholder="Auto-generated if empty"
              error={errors.itemCode}
            />

            <FormField
              id="itemName"
              label="Item Name"
              value={formData.itemName}
              onChange={(value) => handleChange("itemName", value)}
              required
              error={errors.itemName}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormField
              id="genericName"
              label="Generic Name"
              value={formData.genericName}
              onChange={(value) => handleChange("genericName", value)}
              error={errors.genericName}
            />

            <FormField
              id="alias"
              label="Alias / Product Registration No"
              value={formData.alias}
              onChange={(value) => handleChange("alias", value)}
              error={errors.alias}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <SearchableSelect
              label="Company"
              options={companies}
              value={formData.company}
              onValueChange={(value) => handleChange("company", value)}
              onAddNew={handleAddCompany}
              addNewTitle="Add New Company"
              addNewDescription="Enter the name of the new company"
              addNewInputLabel="Company Name"
              addNewButtonLabel="Add Company"
              required
              error={errors.company}
              showSelectedLabel={true}
            />

            <SearchableSelect
              label="Category"
              options={categories}
              value={formData.category}
              onValueChange={(value) => handleChange("category", value)}
              onAddNew={handleAddCategory}
              addNewTitle="Add New Category"
              addNewDescription="Enter the name of the new category"
              addNewInputLabel="Category Name"
              addNewButtonLabel="Add Category"
              required
              error={errors.category}
              showSelectedLabel={true}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <SearchableSelect
              label="UOM (Unit of Measure)"
              options={uoms}
              value={formData.uom}
              onValueChange={(value) => handleChange("uom", value)}
              onAddNew={handleAddUom}
              addNewTitle="Add New UOM"
              addNewDescription="Enter the name of the new unit of measurement"
              addNewInputLabel="UOM Name"
              addNewButtonLabel="Add UOM"
              required
              error={errors.uom}
              showSelectedLabel={true}
            />

            <FormField
              id="altItemCode"
              label="Alt. Item Code"
              value={formData.altItemCode}
              onChange={(value) => handleChange("altItemCode", value)}
              error={errors.altItemCode}
            />
          </div>

          <Separator />

          <div className="flex items-center space-x-2">
            <Checkbox
              id="isPack"
              checked={formData.isPack}
              onCheckedChange={(checked) =>
                handleChange("isPack", checked === true)
              }
            />
            <Label htmlFor="isPack">Is Pack</Label>
          </div>

          {formData.isPack && (
            <div className="grid grid-cols-3 gap-4">
              <FormField
                id="packQty"
                label="Pack Quantity"
                type="number"
                value={formData.packQty.toString()}
                onChange={(value) =>
                  handleChange("packQty", parseInt(value) || 1)
                }
                min="1"
                required={formData.isPack}
                error={errors.packQty}
              />

              <FormField
                id="packSalePrice"
                label="Pack Sale Price"
                type="number"
                value={formData.packSalePrice.toString()}
                onChange={(value) =>
                  handleChange("packSalePrice", parseFloat(value) || 0)
                }
                min="0"
                step="0.01"
                required={formData.isPack}
                error={errors.packSalePrice}
              />

              <FormField
                id="packPurchasePrice"
                label="Pack Purchase Price"
                type="number"
                value={formData.packPurchasePrice.toString()}
                onChange={(value) =>
                  handleChange("packPurchasePrice", parseFloat(value) || 0)
                }
                min="0"
                step="0.01"
                required={formData.isPack}
                error={errors.packPurchasePrice}
              />
            </div>
          )}

          <div className="grid grid-cols-3 gap-4">
            <FormField
              id="purchaseRatePercentage"
              label="Purchase Rate %"
              type="number"
              value={formData.purchaseRatePercentage.toString()}
              onChange={(value) =>
                handleChange("purchaseRatePercentage", parseFloat(value) || 0)
              }
              min="0"
              max="100"
              error={errors.purchaseRatePercentage}
            />

            <FormField
              id="salePrice"
              label="Sale Price (Single Unit)"
              type="number"
              value={formData.salePrice.toString()}
              onChange={(value) =>
                handleChange("salePrice", parseFloat(value) || 0)
              }
              min="0"
              step="0.01"
              disabled={formData.isPack}
              error={errors.salePrice}
            />

            <FormField
              id="purchasePrice"
              label="Purchase Price (Single Unit)"
              type="number"
              value={formData.purchasePrice.toString()}
              onChange={(value) =>
                handleChange("purchasePrice", parseFloat(value) || 0)
              }
              min="0"
              step="0.01"
              disabled={formData.isPack}
              error={errors.purchasePrice}
            />
          </div>

          <Separator />

          <div className="grid grid-cols-3 gap-4">
            <FormField
              id="maxSaleDiscount"
              label="Max Sale Discount (%)"
              type="number"
              value={formData.maxSaleDiscount.toString()}
              onChange={(value) =>
                handleChange("maxSaleDiscount", parseFloat(value) || 0)
              }
              min="0"
              max="100"
              error={errors.maxSaleDiscount}
            />

            <FormField
              id="gst"
              label="GST (%)"
              type="number"
              value={formData.gst.toString()}
              onChange={(value) => handleChange("gst", parseFloat(value) || 0)}
              min="0"
              max="100"
              error={errors.gst}
            />

            <div className="flex items-center space-x-2 pt-8">
              <Switch
                id="isActive"
                checked={formData.isActive}
                onCheckedChange={(checked) => handleChange("isActive", checked)}
              />
              <Label htmlFor="isActive">Is Active</Label>
            </div>
          </div>

          <DialogFooter className="pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              <X className="mr-2 h-4 w-4" /> Cancel
            </Button>
            <Button type="submit">
              <Save className="mr-2 h-4 w-4" /> Save Item
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ItemFormModal;
