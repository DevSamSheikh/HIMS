import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DepartmentTable, { Department } from "./DepartmentTable";
import { Toaster } from "@/components/ui/toaster";

const mockDepartments: Department[] = [
  {
    id: "dept-1",
    name: "Emergency",
    code: "ER",
    location: "Building A, Floor 1",
  },
  {
    id: "dept-2",
    name: "Cardiology",
    code: "CARD",
    location: "Building B, Floor 2",
  },
  {
    id: "dept-3",
    name: "Pediatrics",
    code: "PED",
    location: "Building C, Floor 1",
  },
  {
    id: "dept-4",
    name: "Orthopedics",
    code: "ORTH",
    location: "Building A, Floor 3",
  },
  {
    id: "dept-5",
    name: "Neurology",
    code: "NEURO",
    location: "Building B, Floor 3",
  },
  {
    id: "dept-6",
    name: "Oncology",
    code: "ONC",
    location: "Building D, Floor 2",
  },
];

const DepartmentForm = () => {
  const [departments, setDepartments] = useState<Department[]>(mockDepartments);

  const handleSaveDepartments = (updatedDepartments: Department[]) => {
    setDepartments(updatedDepartments);
    // Here you would typically make an API call to save the data
    console.log("Saving departments:", updatedDepartments);
  };

  return (
    <div className="container mx-auto py-6 max-w-7xl bg-background">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Departments</h1>
        <p className="text-muted-foreground mt-2">
          Manage departments and their locations in the healthcare facility.
        </p>
      </div>

      <Card className="bg-background">
        <CardHeader>
          <CardTitle>Department Management</CardTitle>
        </CardHeader>
        <CardContent>
          <DepartmentTable
            initialData={departments}
            onSave={handleSaveDepartments}
            isPaginated={true}
            addStartEntry={true}
          />
        </CardContent>
      </Card>
      <Toaster />
    </div>
  );
};

export default DepartmentForm;
