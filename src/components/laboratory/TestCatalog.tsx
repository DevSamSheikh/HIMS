import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  PlusCircle,
  Search,
  Edit,
  Trash2,
  FileText,
  TestTube2 as Flask,
  Microscope,
  Beaker,
  Syringe,
  TestTube as Vial,
  Filter,
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import DataTable from "@/components/ui/data-table";
import SearchableSelect from "@/components/ui/searchable-select";

interface TestParameter {
  id: string;
  name: string;
  unit: string;
  normalRange: string;
  criticalLow?: string;
  criticalHigh?: string;
  displayOrder: number;
}

interface Test {
  id: string;
  name: string;
  code: string;
  category: string;
  department: string;
  sampleType: string;
  turnaroundTime: string;
  price: number;
  description?: string;
  parameters: TestParameter[];
  status: "active" | "inactive";
}

interface Category {
  id: string;
  name: string;
}

const TestCatalog = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [isAddTestDialogOpen, setIsAddTestDialogOpen] = useState(false);
  const [isParametersDialogOpen, setIsParametersDialogOpen] = useState(false);
  const [isAddParameterDialogOpen, setIsAddParameterDialogOpen] =
    useState(false);
  const [isEditParameterDialogOpen, setIsEditParameterDialogOpen] =
    useState(false);
  const [selectedTest, setSelectedTest] = useState<Test | null>(null);
  const [selectedParameter, setSelectedParameter] =
    useState<TestParameter | null>(null);
  const [newParameter, setNewParameter] = useState<Partial<TestParameter>>({
    name: "",
    unit: "",
    normalRange: "",
    criticalLow: "",
    criticalHigh: "",
    displayOrder: 1,
  });

  // Mock data for tests
  const [tests, setTests] = useState<Test[]>([
    {
      id: "test-001",
      name: "Complete Blood Count",
      code: "CBC",
      category: "Hematology",
      department: "Hematology",
      sampleType: "Blood",
      turnaroundTime: "2 hours",
      price: 500,
      description: "Complete blood count analysis",
      parameters: [
        {
          id: "param-001",
          name: "Hemoglobin",
          unit: "g/dL",
          normalRange: "13.5-17.5 (Male), 12.0-15.5 (Female)",
          criticalLow: "7",
          criticalHigh: "20",
          displayOrder: 1,
        },
        {
          id: "param-002",
          name: "WBC Count",
          unit: "cells/μL",
          normalRange: "4,500-11,000",
          criticalLow: "2000",
          criticalHigh: "30000",
          displayOrder: 2,
        },
        {
          id: "param-003",
          name: "RBC Count",
          unit: "cells/μL",
          normalRange: "4.5-5.9 (Male), 4.1-5.1 (Female)",
          displayOrder: 3,
        },
        {
          id: "param-004",
          name: "Platelets",
          unit: "cells/μL",
          normalRange: "150,000-450,000",
          criticalLow: "20000",
          criticalHigh: "1000000",
          displayOrder: 4,
        },
      ],
      status: "active",
    },
    {
      id: "test-002",
      name: "Liver Function Test",
      code: "LFT",
      category: "Biochemistry",
      department: "Biochemistry",
      sampleType: "Blood",
      turnaroundTime: "3 hours",
      price: 800,
      description: "Comprehensive liver function analysis",
      parameters: [
        {
          id: "param-005",
          name: "ALT",
          unit: "U/L",
          normalRange: "7-55",
          criticalHigh: "1000",
          displayOrder: 1,
        },
        {
          id: "param-006",
          name: "AST",
          unit: "U/L",
          normalRange: "8-48",
          criticalHigh: "1000",
          displayOrder: 2,
        },
        {
          id: "param-007",
          name: "ALP",
          unit: "U/L",
          normalRange: "45-115",
          displayOrder: 3,
        },
        {
          id: "param-008",
          name: "Bilirubin (Total)",
          unit: "mg/dL",
          normalRange: "0.1-1.2",
          criticalHigh: "15",
          displayOrder: 4,
        },
      ],
      status: "active",
    },
    {
      id: "test-003",
      name: "Kidney Function Test",
      code: "KFT",
      category: "Biochemistry",
      department: "Biochemistry",
      sampleType: "Blood",
      turnaroundTime: "3 hours",
      price: 900,
      description: "Comprehensive kidney function analysis",
      parameters: [
        {
          id: "param-009",
          name: "Urea",
          unit: "mg/dL",
          normalRange: "7-20",
          displayOrder: 1,
        },
        {
          id: "param-010",
          name: "Creatinine",
          unit: "mg/dL",
          normalRange: "0.7-1.3 (Male), 0.6-1.1 (Female)",
          criticalHigh: "5",
          displayOrder: 2,
        },
        {
          id: "param-011",
          name: "Uric Acid",
          unit: "mg/dL",
          normalRange: "3.4-7.0 (Male), 2.4-6.0 (Female)",
          displayOrder: 3,
        },
      ],
      status: "active",
    },
    {
      id: "test-004",
      name: "Lipid Profile",
      code: "LIPID",
      category: "Biochemistry",
      department: "Biochemistry",
      sampleType: "Blood",
      turnaroundTime: "3 hours",
      price: 700,
      description: "Comprehensive lipid analysis",
      parameters: [
        {
          id: "param-012",
          name: "Total Cholesterol",
          unit: "mg/dL",
          normalRange: "<200",
          displayOrder: 1,
        },
        {
          id: "param-013",
          name: "HDL Cholesterol",
          unit: "mg/dL",
          normalRange: ">40 (Male), >50 (Female)",
          displayOrder: 2,
        },
        {
          id: "param-014",
          name: "LDL Cholesterol",
          unit: "mg/dL",
          normalRange: "<100",
          displayOrder: 3,
        },
        {
          id: "param-015",
          name: "Triglycerides",
          unit: "mg/dL",
          normalRange: "<150",
          displayOrder: 4,
        },
      ],
      status: "active",
    },
    {
      id: "test-005",
      name: "Thyroid Profile",
      code: "THYROID",
      category: "Endocrinology",
      department: "Biochemistry",
      sampleType: "Blood",
      turnaroundTime: "4 hours",
      price: 1200,
      description: "Comprehensive thyroid function analysis",
      parameters: [
        {
          id: "param-016",
          name: "TSH",
          unit: "μIU/mL",
          normalRange: "0.4-4.0",
          displayOrder: 1,
        },
        {
          id: "param-017",
          name: "T3",
          unit: "ng/dL",
          normalRange: "80-200",
          displayOrder: 2,
        },
        {
          id: "param-018",
          name: "T4",
          unit: "μg/dL",
          normalRange: "5.1-14.1",
          displayOrder: 3,
        },
      ],
      status: "active",
    },
    {
      id: "test-006",
      name: "Urine Routine",
      code: "URINE",
      category: "Microbiology",
      department: "Microbiology",
      sampleType: "Urine",
      turnaroundTime: "2 hours",
      price: 400,
      description: "Routine urine analysis",
      parameters: [
        {
          id: "param-019",
          name: "Color",
          unit: "",
          normalRange: "Pale Yellow to Yellow",
          displayOrder: 1,
        },
        {
          id: "param-020",
          name: "pH",
          unit: "",
          normalRange: "4.5-8.0",
          displayOrder: 2,
        },
        {
          id: "param-021",
          name: "Specific Gravity",
          unit: "",
          normalRange: "1.005-1.030",
          displayOrder: 3,
        },
        {
          id: "param-022",
          name: "Protein",
          unit: "",
          normalRange: "Negative",
          displayOrder: 4,
        },
        {
          id: "param-023",
          name: "Glucose",
          unit: "",
          normalRange: "Negative",
          displayOrder: 5,
        },
        {
          id: "param-024",
          name: "RBC",
          unit: "/HPF",
          normalRange: "0-2",
          displayOrder: 6,
        },
        {
          id: "param-025",
          name: "WBC",
          unit: "/HPF",
          normalRange: "0-5",
          displayOrder: 7,
        },
      ],
      status: "active",
    },
    {
      id: "test-007",
      name: "Blood Glucose Fasting",
      code: "FBS",
      category: "Biochemistry",
      department: "Biochemistry",
      sampleType: "Blood",
      turnaroundTime: "1 hour",
      price: 300,
      description: "Fasting blood glucose test",
      parameters: [
        {
          id: "param-026",
          name: "Glucose Fasting",
          unit: "mg/dL",
          normalRange: "70-100",
          criticalLow: "40",
          criticalHigh: "400",
          displayOrder: 1,
        },
      ],
      status: "active",
    },
    {
      id: "test-008",
      name: "Blood Glucose Post Prandial",
      code: "PPBS",
      category: "Biochemistry",
      department: "Biochemistry",
      sampleType: "Blood",
      turnaroundTime: "1 hour",
      price: 300,
      description: "Post prandial blood glucose test",
      parameters: [
        {
          id: "param-027",
          name: "Glucose Post Prandial",
          unit: "mg/dL",
          normalRange: "<140",
          criticalHigh: "500",
          displayOrder: 1,
        },
      ],
      status: "active",
    },
    {
      id: "test-009",
      name: "HbA1c",
      code: "HBA1C",
      category: "Biochemistry",
      department: "Biochemistry",
      sampleType: "Blood",
      turnaroundTime: "4 hours",
      price: 800,
      description: "Glycated hemoglobin test",
      parameters: [
        {
          id: "param-028",
          name: "HbA1c",
          unit: "%",
          normalRange: "<5.7",
          displayOrder: 1,
        },
      ],
      status: "active",
    },
    {
      id: "test-010",
      name: "Stool Routine",
      code: "STOOL",
      category: "Microbiology",
      department: "Microbiology",
      sampleType: "Stool",
      turnaroundTime: "2 hours",
      price: 400,
      description: "Routine stool analysis",
      parameters: [
        {
          id: "param-029",
          name: "Color",
          unit: "",
          normalRange: "Brown",
          displayOrder: 1,
        },
        {
          id: "param-030",
          name: "Consistency",
          unit: "",
          normalRange: "Formed",
          displayOrder: 2,
        },
        {
          id: "param-031",
          name: "Occult Blood",
          unit: "",
          normalRange: "Negative",
          displayOrder: 3,
        },
        {
          id: "param-032",
          name: "Parasites",
          unit: "",
          normalRange: "Not Seen",
          displayOrder: 4,
        },
      ],
      status: "active",
    },
  ]);

  // Mock data for categories
  const categories = [
    "Hematology",
    "Biochemistry",
    "Microbiology",
    "Serology",
    "Endocrinology",
    "Immunology",
    "Histopathology",
    "Cytology",
    "Molecular Biology",
  ];

  // Convert categories to options format for SearchableSelect
  const categoryOptions = categories.map((category) => ({
    id: category,
    name: category,
  }));

  // Mock data for departments
  const departments = [
    "Hematology",
    "Biochemistry",
    "Microbiology",
    "Pathology",
    "Molecular Diagnostics",
  ];

  // Mock data for sample types
  const sampleTypes = [
    "Blood",
    "Urine",
    "Stool",
    "CSF",
    "Sputum",
    "Swab",
    "Tissue",
    "Fluid",
  ];

  const filteredTests = tests.filter(
    (test) =>
      (test.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        test.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        test.category.toLowerCase().includes(searchQuery.toLowerCase())) &&
      (filterCategory ? test.category === filterCategory : true),
  );

  // Calculate pagination
  const totalPages = Math.ceil(filteredTests.length / itemsPerPage);
  const paginatedTests = filteredTests.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const handleAddTest = () => {
    setSelectedTest(null);
    setIsAddTestDialogOpen(true);
  };

  const handleEditTest = (test: Test) => {
    setSelectedTest(test);
    setIsAddTestDialogOpen(true);
  };

  const handleViewParameters = (test: Test) => {
    setSelectedTest(test);
    setIsParametersDialogOpen(true);
  };

  const handleSaveTest = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Save test logic would go here
    setIsAddTestDialogOpen(false);
    toast({
      title: "Success",
      description: selectedTest
        ? "Test updated successfully"
        : "Test added successfully",
    });
  };

  const handleAddParameter = () => {
    setSelectedParameter(null);
    setNewParameter({
      name: "",
      unit: "",
      normalRange: "",
      criticalLow: "",
      criticalHigh: "",
      displayOrder: selectedTest?.parameters.length
        ? selectedTest.parameters.length + 1
        : 1,
    });
    setIsAddParameterDialogOpen(true);
  };

  const handleEditParameter = (parameter: TestParameter) => {
    setSelectedParameter(parameter);
    setNewParameter({
      name: parameter.name,
      unit: parameter.unit,
      normalRange: parameter.normalRange,
      criticalLow: parameter.criticalLow || "",
      criticalHigh: parameter.criticalHigh || "",
      displayOrder: parameter.displayOrder,
    });
    setIsEditParameterDialogOpen(true);
  };

  const handleDeleteParameter = (parameterId: string) => {
    if (!selectedTest) return;

    const updatedTests = tests.map((test) => {
      if (test.id === selectedTest.id) {
        return {
          ...test,
          parameters: test.parameters.filter(
            (param) => param.id !== parameterId,
          ),
        };
      }
      return test;
    });

    setTests(updatedTests);
    setSelectedTest(
      updatedTests.find((test) => test.id === selectedTest.id) || null,
    );

    toast({
      title: "Success",
      description: "Parameter deleted successfully",
    });
  };

  const handleSaveParameter = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedTest) return;

    const parameterId = selectedParameter
      ? selectedParameter.id
      : `param-${Date.now()}`;
    const parameter: TestParameter = {
      id: parameterId,
      name: newParameter.name || "",
      unit: newParameter.unit || "",
      normalRange: newParameter.normalRange || "",
      criticalLow: newParameter.criticalLow || undefined,
      criticalHigh: newParameter.criticalHigh || undefined,
      displayOrder: newParameter.displayOrder || 1,
    };

    const updatedTests = tests.map((test) => {
      if (test.id === selectedTest.id) {
        if (selectedParameter) {
          // Edit existing parameter
          return {
            ...test,
            parameters: test.parameters.map((param) =>
              param.id === parameter.id ? parameter : param,
            ),
          };
        } else {
          // Add new parameter
          return {
            ...test,
            parameters: [...test.parameters, parameter],
          };
        }
      }
      return test;
    });

    setTests(updatedTests);
    setSelectedTest(
      updatedTests.find((test) => test.id === selectedTest.id) || null,
    );
    setIsAddParameterDialogOpen(false);
    setIsEditParameterDialogOpen(false);

    toast({
      title: "Success",
      description: selectedParameter
        ? "Parameter updated successfully"
        : "Parameter added successfully",
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewParameter((prev) => ({ ...prev, [name]: value }));
  };

  const columns = [
    {
      header: "Test Name",
      accessorKey: "name" as keyof Test,
      cellType: "text" as const,
      required: true,
    },
    {
      header: "Code",
      accessorKey: "code" as keyof Test,
      cellType: "text" as const,
      required: true,
    },
    {
      header: "Category",
      accessorKey: "category" as keyof Test,
      cellType: "dropdown" as const,
      options: categoryOptions,
      required: true,
      dropdownOptions: categoryOptions,
    },
    {
      header: "Sample Type",
      accessorKey: "sampleType" as keyof Test,
      cellType: "dropdown" as const,
      options: sampleTypes.map((type) => ({ id: type, name: type })),
      required: true,
    },
    {
      header: "TAT",
      accessorKey: "turnaroundTime" as keyof Test,
      cellType: "text" as const,
      required: true,
    },
    {
      header: "Price (₹)",
      accessorKey: "price" as keyof Test,
      cellType: "number" as const,
      required: true,
      cell: (item: Test) => {
        return <span>₹{item.price.toLocaleString()}</span>;
      },
    },
    {
      header: "Status",
      accessorKey: "status" as keyof Test,
      cellType: "dropdown" as const,
      options: [
        { id: "active", name: "Active" },
        { id: "inactive", name: "Inactive" },
      ],
      required: true,
      cell: (item: Test) => {
        const statusColors = {
          active:
            "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
          inactive:
            "bg-gray-100 text-gray-800 dark:bg-gray-800/30 dark:text-gray-400",
        };
        return (
          <span
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColors[item.status]}`}
          >
            {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
          </span>
        );
      },
    },
    {
      header: "Actions",
      id: "actions",
      cell: (item: Test) => {
        return (
          <div className="flex space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleViewParameters(item)}
            >
              Parameters
            </Button>
          </div>
        );
      },
    },
  ];

  const handleSave = (updatedTests: Test[]) => {
    setTests(updatedTests);
    toast({
      title: "Success",
      description: "Tests updated successfully",
    });
  };

  // Get category icon
  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case "hematology":
        return <Syringe className="h-4 w-4 mr-2" />;
      case "biochemistry":
        return <Beaker className="h-4 w-4 mr-2" />;
      case "microbiology":
        return <Microscope className="h-4 w-4 mr-2" />;
      default:
        return <Flask className="h-4 w-4 mr-2" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Test Catalog</h2>
          <p className="text-muted-foreground">
            Manage laboratory tests and their parameters
          </p>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by test name, code, or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>
        <div className="flex items-center space-x-2">
          <select
            className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setFilterCategory("")}
            title="Clear Filter"
          >
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <DataTable
            data={paginatedTests}
            columns={columns}
            onSave={handleSave}
            isSearchable={false}
            isSortable={true}
          />
        </CardContent>
      </Card>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Showing{" "}
          {filteredTests.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0}{" "}
          to {Math.min(currentPage * itemsPerPage, filteredTests.length)} of{" "}
          {filteredTests.length} entries
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <Button
              key={page}
              variant={currentPage === page ? "default" : "outline"}
              size="sm"
              onClick={() => setCurrentPage(page)}
            >
              {page}
            </Button>
          ))}
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages || totalPages === 0}
          >
            Next
          </Button>
        </div>
      </div>

      {/* Add/Edit Test Dialog */}
      <Dialog open={isAddTestDialogOpen} onOpenChange={setIsAddTestDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {selectedTest ? "Edit Test" : "Add New Test"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSaveTest} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="testName">Test Name</Label>
                <Input
                  id="testName"
                  defaultValue={selectedTest?.name}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="testCode">Test Code</Label>
                <Input
                  id="testCode"
                  defaultValue={selectedTest?.code}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <select
                  id="category"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  defaultValue={selectedTest?.category}
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <select
                  id="department"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  defaultValue={selectedTest?.department}
                  required
                >
                  <option value="">Select Department</option>
                  {departments.map((department) => (
                    <option key={department} value={department}>
                      {department}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="sampleType">Sample Type</Label>
                <select
                  id="sampleType"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  defaultValue={selectedTest?.sampleType}
                  required
                >
                  <option value="">Select Sample Type</option>
                  {sampleTypes.map((sampleType) => (
                    <option key={sampleType} value={sampleType}>
                      {sampleType}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="turnaroundTime">Turnaround Time</Label>
                <Input
                  id="turnaroundTime"
                  placeholder="e.g., 2 hours"
                  defaultValue={selectedTest?.turnaroundTime}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">Price (₹)</Label>
                <Input
                  id="price"
                  type="number"
                  min="0"
                  step="0.01"
                  defaultValue={selectedTest?.price}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <select
                  id="status"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  defaultValue={selectedTest?.status}
                  required
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              <div className="space-y-2 col-span-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  placeholder="Test description"
                  defaultValue={selectedTest?.description}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">
                {selectedTest ? "Update Test" : "Add Test"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Test Parameters Dialog */}
      <Dialog
        open={isParametersDialogOpen}
        onOpenChange={setIsParametersDialogOpen}
      >
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>{selectedTest?.name} - Test Parameters</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                {getCategoryIcon(selectedTest?.category || "")}
                <span className="text-sm font-medium">
                  {selectedTest?.category}
                </span>
              </div>
              <Button size="sm" onClick={handleAddParameter}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Parameter
              </Button>
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Parameter</TableHead>
                    <TableHead>Unit</TableHead>
                    <TableHead>Normal Range</TableHead>
                    <TableHead>Critical Values</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {selectedTest?.parameters.map((param) => (
                    <TableRow key={param.id}>
                      <TableCell className="font-medium">
                        {param.name}
                      </TableCell>
                      <TableCell>{param.unit}</TableCell>
                      <TableCell>{param.normalRange}</TableCell>
                      <TableCell>
                        {param.criticalLow || param.criticalHigh ? (
                          <div className="text-sm">
                            {param.criticalLow && (
                              <span className="text-red-500">
                                Low: &lt;{param.criticalLow}
                              </span>
                            )}
                            {param.criticalLow && param.criticalHigh && " | "}
                            {param.criticalHigh && (
                              <span className="text-red-500">
                                High: &gt;{param.criticalHigh}
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-muted-foreground text-sm">
                            None
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditParameter(param)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteParameter(param.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Parameter Dialog */}
      <Dialog
        open={isAddParameterDialogOpen}
        onOpenChange={setIsAddParameterDialogOpen}
      >
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New Parameter</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSaveParameter} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2 col-span-2">
                <Label htmlFor="name">Parameter Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={newParameter.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="unit">Unit</Label>
                <Input
                  id="unit"
                  name="unit"
                  value={newParameter.unit}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="normalRange">Normal Range</Label>
                <Input
                  id="normalRange"
                  name="normalRange"
                  value={newParameter.normalRange}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="criticalLow">Critical Low</Label>
                <Input
                  id="criticalLow"
                  name="criticalLow"
                  value={newParameter.criticalLow}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="criticalHigh">Critical High</Label>
                <Input
                  id="criticalHigh"
                  name="criticalHigh"
                  value={newParameter.criticalHigh}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="displayOrder">Display Order</Label>
                <Input
                  id="displayOrder"
                  name="displayOrder"
                  type="number"
                  min="1"
                  value={newParameter.displayOrder}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Add Parameter</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Parameter Dialog */}
      <Dialog
        open={isEditParameterDialogOpen}
        onOpenChange={setIsEditParameterDialogOpen}
      >
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Parameter</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSaveParameter} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2 col-span-2">
                <Label htmlFor="edit-name">Parameter Name</Label>
                <Input
                  id="edit-name"
                  name="name"
                  value={newParameter.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-unit">Unit</Label>
                <Input
                  id="edit-unit"
                  name="unit"
                  value={newParameter.unit}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-normalRange">Normal Range</Label>
                <Input
                  id="edit-normalRange"
                  name="normalRange"
                  value={newParameter.normalRange}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-criticalLow">Critical Low</Label>
                <Input
                  id="edit-criticalLow"
                  name="criticalLow"
                  value={newParameter.criticalLow}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-criticalHigh">Critical High</Label>
                <Input
                  id="edit-criticalHigh"
                  name="criticalHigh"
                  value={newParameter.criticalHigh}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-displayOrder">Display Order</Label>
                <Input
                  id="edit-displayOrder"
                  name="displayOrder"
                  type="number"
                  min="1"
                  value={newParameter.displayOrder}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Update Parameter</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TestCatalog;
