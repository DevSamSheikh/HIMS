import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Save, X } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import FormField from "@/components/ui/form-field";
import SearchableSelect from "@/components/ui/searchable-select";

interface CustomerFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: any) => void;
  initialData?: any;
}

const CustomerForm: React.FC<CustomerFormProps> = ({
  open,
  onOpenChange,
  onSave,
  initialData,
}) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    customerCode: initialData?.customerCode || "",
    name: initialData?.name || "",
    phoneNo: initialData?.phoneNo || "",
    address: initialData?.address || "",
    city: initialData?.city || "1", // Default to first city
    isActive: initialData?.isActive !== undefined ? initialData.isActive : true,
    email: initialData?.email || "",
    creditLimit: initialData?.creditLimit || 0,
    openingBalance: initialData?.openingBalance || 0,
  });

  // Validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Mock data for cities
  const [cities, setCities] = useState([
    { id: "1", name: "New York" },
    { id: "2", name: "Los Angeles" },
    { id: "3", name: "Chicago" },
    { id: "4", name: "Houston" },
    { id: "5", name: "Phoenix" },
  ]);

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Required fields validation
    if (!formData.customerCode.trim()) {
      newErrors.customerCode = "Customer Code is required";
    }

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.phoneNo.trim()) {
      newErrors.phoneNo = "Phone Number is required";
    } else if (!/^\d{10}$/.test(formData.phoneNo.trim())) {
      newErrors.phoneNo = "Phone Number must be 10 digits";
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    if (formData.creditLimit < 0) {
      newErrors.creditLimit = "Credit limit cannot be negative";
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
        description: "Customer saved successfully",
        duration: 3000,
      });
      onOpenChange(false);
    } else {
      toast({
        title: "Error",
        description: "Please fix the errors in the form",
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>
              {initialData ? "Edit Customer" : "Add New Customer"}
            </DialogTitle>
            <DialogDescription>
              Enter the customer details below
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                id="customerCode"
                label="Customer Code"
                value={formData.customerCode}
                onChange={(value) => handleChange("customerCode", value)}
                error={errors.customerCode}
                required
              />

              <FormField
                id="name"
                label="Name"
                value={formData.name}
                onChange={(value) => handleChange("name", value)}
                error={errors.name}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                id="phoneNo"
                label="Phone Number"
                value={formData.phoneNo}
                onChange={(value) => handleChange("phoneNo", value)}
                error={errors.phoneNo}
                required
              />

              <FormField
                id="email"
                label="Email"
                value={formData.email}
                onChange={(value) => handleChange("email", value)}
                error={errors.email}
              />
            </div>

            <FormField
              id="address"
              label="Address"
              value={formData.address}
              onChange={(value) => handleChange("address", value)}
              error={errors.address}
            />

            <div className="grid grid-cols-2 gap-4">
              <SearchableSelect
                label="City"
                options={cities}
                value={formData.city}
                onValueChange={(value) => handleChange("city", value)}
                onAddNew={(name) => {
                  const newId = (
                    parseInt(cities[cities.length - 1].id) + 1
                  ).toString();
                  const newCity = { id: newId, name };
                  setCities([...cities, newCity]);
                  handleChange("city", newId);
                  toast({
                    title: "Success",
                    description: "City added successfully",
                    duration: 3000,
                  });
                }}
                addNewTitle="Add New City"
                addNewDescription="Enter the name of the new city"
                addNewInputLabel="City Name"
                addNewButtonLabel="Add City"
                required
              />

              <div className="flex items-center space-x-2 pt-8">
                <Switch
                  id="isActive"
                  checked={formData.isActive}
                  onCheckedChange={(checked) =>
                    handleChange("isActive", checked)
                  }
                />
                <Label htmlFor="isActive">Active Customer</Label>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                id="creditLimit"
                label="Credit Limit"
                value={formData.creditLimit}
                onChange={(value) =>
                  handleChange("creditLimit", parseFloat(value) || 0)
                }
                type="number"
                min={0}
                step="0.01"
                error={errors.creditLimit}
              />

              <FormField
                id="openingBalance"
                label="Opening Balance"
                value={formData.openingBalance}
                onChange={(value) =>
                  handleChange("openingBalance", parseFloat(value) || 0)
                }
                type="number"
                step="0.01"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              type="button"
              onClick={() => onOpenChange(false)}
            >
              <X className="mr-2 h-4 w-4" /> Cancel
            </Button>
            <Button type="submit">
              <Save className="mr-2 h-4 w-4" /> Save Customer
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CustomerForm;
