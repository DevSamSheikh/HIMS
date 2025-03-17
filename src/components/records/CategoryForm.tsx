import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CategoryTable, { Category } from "./CategoryTable";
import { Toaster } from "@/components/ui/toaster";

const mockCategories: Category[] = [
  { id: "cat-1", name: "Medical Records" },
  { id: "cat-2", name: "Patient Forms" },
  { id: "cat-3", name: "Prescription Templates" },
  { id: "cat-4", name: "Lab Test Definitions" },
  { id: "cat-5", name: "Billing Codes" },
  { id: "cat-6", name: "Insurance Providers" },
  { id: "cat-7", name: "Medication List" },
  { id: "cat-8", name: "Procedure Codes" },
  { id: "cat-9", name: "Diagnosis Codes" },
  { id: "cat-10", name: "Department Definitions" },
  { id: "cat-11", name: "Staff Roles" },
  { id: "cat-12", name: "Equipment Inventory" },
];

const CategoryForm = () => {
  const [categories, setCategories] = useState<Category[]>(mockCategories);

  const handleSaveCategories = (updatedCategories: Category[]) => {
    setCategories(updatedCategories);
    // Here you would typically make an API call to save the data
    console.log("Saving categories:", updatedCategories);
  };

  return (
    <div className="container mx-auto py-6 max-w-7xl bg-background">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Categories</h1>
        <p className="text-muted-foreground mt-2">
          Manage categories for records and definitions in the system.
        </p>
      </div>

      <Card className="bg-background">
        <CardHeader>
          <CardTitle>Category Management</CardTitle>
        </CardHeader>
        <CardContent>
          <CategoryTable
            initialData={categories}
            onSave={handleSaveCategories}
            isPaginated={true}
            addStartEntry={false}
          />
        </CardContent>
      </Card>
      <Toaster />
    </div>
  );
};

export default CategoryForm;
