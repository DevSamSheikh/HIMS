import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Save, X } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import FormField from "@/components/ui/form-field";
import SearchableSelect from "@/components/ui/searchable-select";

interface ItemFormProps {
  onSave: (data: any) => void;
  onCancel: () => void;
  initialData?: any;
}

const ItemForm: React.FC<ItemFormProps> = ({
  onSave,
  onCancel,
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

  // States for new item dialogs
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCompanyName, setNewCompanyName] = useState("");
  const [newUOMName, setNewUOMName] = useState("");
  const [categorySearch, setCategorySearch] = useState("");
  const [companySearch, setCompanySearch] = useState("");
  const [uomSearch, setUOMSearch] = useState("");

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
    if (!formData.itemCode.trim()) {
      newErrors.itemCode = "Item Code is required";
    }

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
      onSave(formData);
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

  const addNewCategory = () => {
    if (newCategoryName.trim()) {
      const newId = (
        parseInt(categories[categories.length - 1].id) + 1
      ).toString();
      const newCategory = { id: newId, name: newCategoryName.trim() };
      setCategories([...categories, newCategory]);
      setFormData({ ...formData, category: newId });
      setNewCategoryName("");
    }
  };

  const addNewCompany = () => {
    if (newCompanyName.trim()) {
      const newId = (
        parseInt(companies[companies.length - 1].id) + 1
      ).toString();
      const newCompany = { id: newId, name: newCompanyName.trim() };
      setCompanies([...companies, newCompany]);
      setFormData({ ...formData, company: newId });
      setNewCompanyName("");
    }
  };

  const addNewUOM = () => {
    if (newUOMName.trim()) {
      const newId = (parseInt(uoms[uoms.length - 1].id) + 1).toString();
      const newUOM = { id: newId, name: newUOMName.trim() };
      setUOMs([...uoms, newUOM]);
      setFormData({ ...formData, uom: newId });
      setNewUOMName("");
    }
  };

  // Filter functions for search
  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(categorySearch.toLowerCase()),
  );

  const filteredCompanies = companies.filter((company) =>
    company.name.toLowerCase().includes(companySearch.toLowerCase()),
  );

  const filteredUOMs = uoms.filter((uom) =>
    uom.name.toLowerCase().includes(uomSearch.toLowerCase()),
  );

  return (
    <form onSubmit={handleSubmit}>
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Item Information</CardTitle>
          <CardDescription>
            Enter the details of the pharmaceutical item
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Basic Information */}
            <FormField
              id="itemCode"
              label="Item Code"
              value={formData.itemCode}
              onChange={(value) => handleChange("itemCode", value)}
              error={errors.itemCode}
              required
            />

            <FormField
              id="itemName"
              label="Item Name"
              value={formData.itemName}
              onChange={(value) => handleChange("itemName", value)}
              error={errors.itemName}
              required
            />

            <FormField
              id="genericName"
              label="Generic Name"
              value={formData.genericName}
              onChange={(value) => handleChange("genericName", value)}
            />

            <SearchableSelect
              label="Company"
              options={companies}
              value={formData.company}
              onValueChange={(value) => handleChange("company", value)}
              onAddNew={(name) => {
                const newId = (
                  parseInt(companies[companies.length - 1].id) + 1
                ).toString();
                const newCompany = { id: newId, name };
                setCompanies([...companies, newCompany]);
                handleChange("company", newId);
                toast({
                  title: "Success",
                  description: "Company added successfully",
                  duration: 3000,
                });
              }}
              addNewTitle="Add New Company"
              addNewDescription="Enter the name of the new company"
              addNewInputLabel="Company Name"
              addNewButtonLabel="Add Company"
              required
            />

            <SearchableSelect
              label="Category"
              options={categories}
              value={formData.category}
              onValueChange={(value) => handleChange("category", value)}
              onAddNew={(name) => {
                const newId = (
                  parseInt(categories[categories.length - 1].id) + 1
                ).toString();
                const newCategory = { id: newId, name };
                setCategories([...categories, newCategory]);
                handleChange("category", newId);
                toast({
                  title: "Success",
                  description: "Category added successfully",
                  duration: 3000,
                });
              }}
              addNewTitle="Add New Category"
              addNewDescription="Enter the name of the new category"
              addNewInputLabel="Category Name"
              addNewButtonLabel="Add Category"
              required
            />

            <SearchableSelect
              label="UOM (Unit of Measure)"
              options={uoms}
              value={formData.uom}
              onValueChange={(value) => handleChange("uom", value)}
              onAddNew={(name) => {
                const newId = (
                  parseInt(uoms[uoms.length - 1].id) + 1
                ).toString();
                const newUOM = { id: newId, name };
                setUOMs([...uoms, newUOM]);
                handleChange("uom", newId);
                toast({
                  title: "Success",
                  description: "UOM added successfully",
                  duration: 3000,
                });
              }}
              addNewTitle="Add New UOM"
              addNewDescription="Enter the name of the new Unit of Measure"
              addNewInputLabel="UOM Name"
              addNewButtonLabel="Add UOM"
              required
            />

            <FormField
              id="altItemCode"
              label="Alt. Item Code"
              value={formData.altItemCode}
              onChange={(value) => handleChange("altItemCode", value)}
            />

            <FormField
              id="alias"
              label="Alias / Product Registration No"
              value={formData.alias}
              onChange={(value) => handleChange("alias", value)}
            />
          </div>

          <Separator />

          {/* Pricing Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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

            <FormField
              id="packQty"
              label="Packing Qty / No. of pieces in pack"
              value={formData.packQty}
              onChange={(value) =>
                handleChange("packQty", parseInt(value) || 1)
              }
              type="number"
              min={1}
              disabled={!formData.isPack}
              error={errors.packQty}
            />

            <FormField
              id="packSalePrice"
              label="Packing Sale Price"
              value={formData.packSalePrice}
              onChange={(value) =>
                handleChange("packSalePrice", parseFloat(value) || 0)
              }
              type="number"
              min={0}
              step="0.01"
              disabled={!formData.isPack}
              error={errors.packSalePrice}
            />

            <FormField
              id="packPurchasePrice"
              label="Packing Purchase Price"
              value={formData.packPurchasePrice}
              onChange={(value) =>
                handleChange("packPurchasePrice", parseFloat(value) || 0)
              }
              type="number"
              min={0}
              step="0.01"
              disabled={!formData.isPack}
              error={errors.packPurchasePrice}
            />

            <FormField
              id="purchaseRatePercentage"
              label="Purchase Rate %"
              value={formData.purchaseRatePercentage}
              onChange={(value) =>
                handleChange("purchaseRatePercentage", parseFloat(value) || 0)
              }
              type="number"
              min={0}
              max={100}
              error={errors.purchaseRatePercentage}
            />

            <FormField
              id="salePrice"
              label="Sale Price (Single Unit)"
              value={formData.salePrice}
              onChange={(value) =>
                handleChange("salePrice", parseFloat(value) || 0)
              }
              type="number"
              min={0}
              step="0.01"
              disabled={formData.isPack}
              error={errors.salePrice}
            />

            <FormField
              id="purchasePrice"
              label="Purchase Price (Single Unit)"
              value={formData.purchasePrice}
              onChange={(value) =>
                handleChange("purchasePrice", parseFloat(value) || 0)
              }
              type="number"
              min={0}
              step="0.01"
              disabled={formData.isPack}
              error={errors.purchasePrice}
            />
          </div>

          <Separator />

          {/* Additional Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FormField
              id="maxSaleDiscount"
              label="Max Sale Discount (%)"
              value={formData.maxSaleDiscount}
              onChange={(value) =>
                handleChange("maxSaleDiscount", parseFloat(value) || 0)
              }
              type="number"
              min={0}
              max={100}
              error={errors.maxSaleDiscount}
            />

            <FormField
              id="gst"
              label="GST (%)"
              value={formData.gst}
              onChange={(value) => handleChange("gst", parseFloat(value) || 0)}
              type="number"
              min={0}
              max={100}
              error={errors.gst}
            />

            <div className="flex items-center space-x-2">
              <Switch
                id="isActive"
                checked={formData.isActive}
                onCheckedChange={(checked) => handleChange("isActive", checked)}
              />
              <Label htmlFor="isActive">Is Active</Label>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end gap-2">
          <Button variant="outline" type="button" onClick={onCancel}>
            <X className="mr-2 h-4 w-4" /> Cancel
          </Button>
          <Button type="submit">
            <Save className="mr-2 h-4 w-4" /> Save Item
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
};

export default ItemForm;
