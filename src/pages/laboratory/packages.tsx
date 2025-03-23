import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Plus, Edit, Trash2, FileText } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface TestItem {
  id: string;
  name: string;
  category: string;
  price: number;
}

interface PackageType {
  id: string;
  name: string;
  description: string;
  price: number;
  discountPercentage: number;
  discountedPrice: number;
  status: "active" | "inactive";
  tests: TestItem[];
  createdAt: string;
  updatedAt: string;
}

const LaboratoryPackages = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [isAddPackageOpen, setIsAddPackageOpen] = useState(false);
  const [isEditPackageOpen, setIsEditPackageOpen] = useState(false);
  const [isDeletePackageOpen, setIsDeletePackageOpen] = useState(false);
  const [isViewDetailsOpen, setIsViewDetailsOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<PackageType | null>(
    null,
  );
  const [availableTests, setAvailableTests] = useState<TestItem[]>([
    {
      id: "test-001",
      name: "Complete Blood Count (CBC)",
      category: "Hematology",
      price: 25.0,
    },
    {
      id: "test-002",
      name: "Lipid Profile",
      category: "Biochemistry",
      price: 35.0,
    },
    {
      id: "test-003",
      name: "Liver Function Test",
      category: "Biochemistry",
      price: 40.0,
    },
    {
      id: "test-004",
      name: "Kidney Function Test",
      category: "Biochemistry",
      price: 40.0,
    },
    {
      id: "test-005",
      name: "Thyroid Profile",
      category: "Endocrinology",
      price: 45.0,
    },
    {
      id: "test-006",
      name: "HbA1c",
      category: "Diabetes",
      price: 30.0,
    },
    {
      id: "test-007",
      name: "Urine Routine",
      category: "Microbiology",
      price: 15.0,
    },
    {
      id: "test-008",
      name: "Stool Routine",
      category: "Microbiology",
      price: 15.0,
    },
    {
      id: "test-009",
      name: "Blood Glucose Fasting",
      category: "Diabetes",
      price: 10.0,
    },
    {
      id: "test-010",
      name: "Blood Glucose PP",
      category: "Diabetes",
      price: 10.0,
    },
  ]);

  // Mock data for packages
  const [packages, setPackages] = useState<PackageType[]>([
    {
      id: "pkg-001",
      name: "Basic Health Checkup",
      description: "Essential tests for routine health monitoring",
      price: 75.0,
      discountPercentage: 10,
      discountedPrice: 67.5,
      status: "active",
      tests: [
        {
          id: "test-001",
          name: "Complete Blood Count (CBC)",
          category: "Hematology",
          price: 25.0,
        },
        {
          id: "test-007",
          name: "Urine Routine",
          category: "Microbiology",
          price: 15.0,
        },
        {
          id: "test-009",
          name: "Blood Glucose Fasting",
          category: "Diabetes",
          price: 10.0,
        },
        {
          id: "test-010",
          name: "Blood Glucose PP",
          category: "Diabetes",
          price: 10.0,
        },
      ],
      createdAt: "2023-05-15",
      updatedAt: "2023-05-15",
    },
    {
      id: "pkg-002",
      name: "Comprehensive Health Checkup",
      description: "Complete health assessment with detailed analysis",
      price: 150.0,
      discountPercentage: 15,
      discountedPrice: 127.5,
      status: "active",
      tests: [
        {
          id: "test-001",
          name: "Complete Blood Count (CBC)",
          category: "Hematology",
          price: 25.0,
        },
        {
          id: "test-002",
          name: "Lipid Profile",
          category: "Biochemistry",
          price: 35.0,
        },
        {
          id: "test-003",
          name: "Liver Function Test",
          category: "Biochemistry",
          price: 40.0,
        },
        {
          id: "test-004",
          name: "Kidney Function Test",
          category: "Biochemistry",
          price: 40.0,
        },
        {
          id: "test-007",
          name: "Urine Routine",
          category: "Microbiology",
          price: 15.0,
        },
      ],
      createdAt: "2023-06-10",
      updatedAt: "2023-06-10",
    },
    {
      id: "pkg-003",
      name: "Diabetes Screening",
      description: "Specialized tests for diabetes monitoring and diagnosis",
      price: 60.0,
      discountPercentage: 8,
      discountedPrice: 55.2,
      status: "active",
      tests: [
        {
          id: "test-006",
          name: "HbA1c",
          category: "Diabetes",
          price: 30.0,
        },
        {
          id: "test-009",
          name: "Blood Glucose Fasting",
          category: "Diabetes",
          price: 10.0,
        },
        {
          id: "test-010",
          name: "Blood Glucose PP",
          category: "Diabetes",
          price: 10.0,
        },
      ],
      createdAt: "2023-07-05",
      updatedAt: "2023-07-05",
    },
    {
      id: "pkg-004",
      name: "Thyroid Profile Package",
      description: "Complete thyroid health assessment",
      price: 70.0,
      discountPercentage: 10,
      discountedPrice: 63.0,
      status: "inactive",
      tests: [
        {
          id: "test-005",
          name: "Thyroid Profile",
          category: "Endocrinology",
          price: 45.0,
        },
        {
          id: "test-001",
          name: "Complete Blood Count (CBC)",
          category: "Hematology",
          price: 25.0,
        },
      ],
      createdAt: "2023-08-20",
      updatedAt: "2023-08-20",
    },
  ]);

  // Filter packages based on search query and active tab
  const filteredPackages = packages.filter(
    (pkg) =>
      (pkg.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pkg.description.toLowerCase().includes(searchQuery.toLowerCase())) &&
      (activeTab === "all" ||
        (activeTab === "active" && pkg.status === "active") ||
        (activeTab === "inactive" && pkg.status === "inactive")),
  );

  // Handle add package
  const handleAddPackage = () => {
    setIsAddPackageOpen(true);
  };

  // Handle edit package
  const handleEditPackage = (pkg: PackageType) => {
    setSelectedPackage(pkg);
    setIsEditPackageOpen(true);
  };

  // Handle delete package
  const handleDeletePackage = (pkg: PackageType) => {
    setSelectedPackage(pkg);
    setIsDeletePackageOpen(true);
  };

  // Handle view package details
  const handleViewDetails = (pkg: PackageType) => {
    setSelectedPackage(pkg);
    setIsViewDetailsOpen(true);
  };

  // Handle add package submit
  const handleAddPackageSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.currentTarget;
    const name = (form.elements.namedItem("name") as HTMLInputElement).value;
    const description = (
      form.elements.namedItem("description") as HTMLInputElement
    ).value;
    const price = parseFloat(
      (form.elements.namedItem("price") as HTMLInputElement).value,
    );
    const discountPercentage = parseFloat(
      (form.elements.namedItem("discount") as HTMLInputElement).value,
    );
    const discountedPrice = price - (price * discountPercentage) / 100;
    const status = (form.elements.namedItem("status") as HTMLInputElement)
      .checked
      ? "active"
      : "inactive";

    // Get selected tests (this is a simplified version)
    const selectedTestIds = Array.from(
      form.querySelectorAll('input[name="test"]:checked'),
    ).map((checkbox) => (checkbox as HTMLInputElement).value);

    const selectedTests = availableTests.filter((test) =>
      selectedTestIds.includes(test.id),
    );

    const newPackage: PackageType = {
      id: `pkg-${(packages.length + 1).toString().padStart(3, "0")}`,
      name,
      description,
      price,
      discountPercentage,
      discountedPrice,
      status: status as "active" | "inactive",
      tests: selectedTests,
      createdAt: new Date().toISOString().split("T")[0],
      updatedAt: new Date().toISOString().split("T")[0],
    };

    setPackages([...packages, newPackage]);
    setIsAddPackageOpen(false);

    toast({
      title: "Package Added",
      description: `${name} has been added successfully.`,
    });
  };

  // Handle edit package submit
  const handleEditPackageSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedPackage) return;

    const form = e.currentTarget;
    const name = (form.elements.namedItem("name") as HTMLInputElement).value;
    const description = (
      form.elements.namedItem("description") as HTMLInputElement
    ).value;
    const price = parseFloat(
      (form.elements.namedItem("price") as HTMLInputElement).value,
    );
    const discountPercentage = parseFloat(
      (form.elements.namedItem("discount") as HTMLInputElement).value,
    );
    const discountedPrice = price - (price * discountPercentage) / 100;
    const status = (form.elements.namedItem("status") as HTMLInputElement)
      .checked
      ? "active"
      : "inactive";

    // Get selected tests
    const selectedTestIds = Array.from(
      form.querySelectorAll('input[name="test"]:checked'),
    ).map((checkbox) => (checkbox as HTMLInputElement).value);

    const selectedTests = availableTests.filter((test) =>
      selectedTestIds.includes(test.id),
    );

    const updatedPackages = packages.map((pkg) =>
      pkg.id === selectedPackage.id
        ? {
            ...pkg,
            name,
            description,
            price,
            discountPercentage,
            discountedPrice,
            status: status as "active" | "inactive",
            tests: selectedTests,
            updatedAt: new Date().toISOString().split("T")[0],
          }
        : pkg,
    );

    setPackages(updatedPackages);
    setIsEditPackageOpen(false);

    toast({
      title: "Package Updated",
      description: `${name} has been updated successfully.`,
    });
  };

  // Handle delete package submit
  const handleDeletePackageSubmit = () => {
    if (!selectedPackage) return;

    const updatedPackages = packages.filter(
      (pkg) => pkg.id !== selectedPackage.id,
    );

    setPackages(updatedPackages);
    setIsDeletePackageOpen(false);

    toast({
      title: "Package Deleted",
      description: `${selectedPackage.name} has been deleted successfully.`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Laboratory Packages</h2>
          <p className="text-muted-foreground">
            Manage test packages, discounts, and bundle offerings
          </p>
        </div>
        <Button onClick={handleAddPackage}>
          <Plus className="mr-2 h-4 w-4" /> Add Package
        </Button>
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search packages..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      <Tabs
        defaultValue="all"
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="grid grid-cols-3 w-full max-w-md">
          <TabsTrigger value="all">All Packages</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="inactive">Inactive</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-4">
          <Card>
            <CardContent className="p-0">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Package Name</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Discount</TableHead>
                      <TableHead>Final Price</TableHead>
                      <TableHead>Tests</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPackages.length > 0 ? (
                      filteredPackages.map((pkg) => (
                        <TableRow key={pkg.id}>
                          <TableCell className="font-medium">
                            {pkg.name}
                          </TableCell>
                          <TableCell>{pkg.description}</TableCell>
                          <TableCell>${pkg.price.toFixed(2)}</TableCell>
                          <TableCell>{pkg.discountPercentage}%</TableCell>
                          <TableCell>
                            ${pkg.discountedPrice.toFixed(2)}
                          </TableCell>
                          <TableCell>{pkg.tests.length} tests</TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                pkg.status === "active"
                                  ? "default"
                                  : "secondary"
                              }
                            >
                              {pkg.status === "active" ? "Active" : "Inactive"}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end space-x-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleViewDetails(pkg)}
                              >
                                <FileText className="mr-2 h-4 w-4" />
                                Details
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEditPackage(pkg)}
                              >
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                onClick={() => handleDeletePackage(pkg)}
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-4">
                          No packages found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add Package Dialog */}
      <Dialog open={isAddPackageOpen} onOpenChange={setIsAddPackageOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add New Package</DialogTitle>
            <DialogDescription>
              Create a new test package with discounted pricing
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddPackageSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Package Name</Label>
                <Input id="name" placeholder="Enter package name" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">Base Price ($)</Label>
                <Input
                  id="price"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                placeholder="Enter package description"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="discount">Discount Percentage (%)</Label>
                <Input
                  id="discount"
                  type="number"
                  min="0"
                  max="100"
                  placeholder="0"
                  required
                />
              </div>
              <div className="space-y-2 flex items-end">
                <div className="flex items-center space-x-2">
                  <Checkbox id="status" defaultChecked />
                  <Label htmlFor="status">Active</Label>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Select Tests</Label>
              <div className="border rounded-md p-4 max-h-60 overflow-y-auto">
                <div className="space-y-2">
                  {availableTests.map((test) => (
                    <div key={test.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`test-${test.id}`}
                        name="test"
                        value={test.id}
                      />
                      <Label htmlFor={`test-${test.id}`} className="flex-1">
                        {test.name}
                      </Label>
                      <span className="text-sm text-muted-foreground">
                        ${test.price.toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">
                <Plus className="mr-2 h-4 w-4" />
                Add Package
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Package Dialog */}
      <Dialog open={isEditPackageOpen} onOpenChange={setIsEditPackageOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Package</DialogTitle>
          </DialogHeader>
          {selectedPackage && (
            <form onSubmit={handleEditPackageSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Package Name</Label>
                  <Input
                    id="name"
                    defaultValue={selectedPackage.name}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price">Base Price ($)</Label>
                  <Input
                    id="price"
                    type="number"
                    min="0"
                    step="0.01"
                    defaultValue={selectedPackage.price}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  defaultValue={selectedPackage.description}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="discount">Discount Percentage (%)</Label>
                  <Input
                    id="discount"
                    type="number"
                    min="0"
                    max="100"
                    defaultValue={selectedPackage.discountPercentage}
                    required
                  />
                </div>
                <div className="space-y-2 flex items-end">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="status"
                      defaultChecked={selectedPackage.status === "active"}
                    />
                    <Label htmlFor="status">Active</Label>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Select Tests</Label>
                <div className="border rounded-md p-4 max-h-60 overflow-y-auto">
                  <div className="space-y-2">
                    {availableTests.map((test) => (
                      <div
                        key={test.id}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          id={`test-${test.id}`}
                          name="test"
                          value={test.id}
                          defaultChecked={selectedPackage.tests.some(
                            (t) => t.id === test.id,
                          )}
                        />
                        <Label htmlFor={`test-${test.id}`} className="flex-1">
                          {test.name}
                        </Label>
                        <span className="text-sm text-muted-foreground">
                          ${test.price.toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">
                  <Edit className="mr-2 h-4 w-4" />
                  Update Package
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Package Dialog */}
      <Dialog open={isDeletePackageOpen} onOpenChange={setIsDeletePackageOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete Package</DialogTitle>
          </DialogHeader>
          {selectedPackage && (
            <div className="space-y-4">
              <p>
                Are you sure you want to delete the package "
                {selectedPackage.name}"? This action cannot be undone.
              </p>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsDeletePackageOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleDeletePackageSubmit}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* View Package Details Dialog */}
      <Dialog open={isViewDetailsOpen} onOpenChange={setIsViewDetailsOpen}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>Package Details</DialogTitle>
          </DialogHeader>
          {selectedPackage && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-lg font-semibold mb-4">
                    {selectedPackage.name}
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Description:
                      </span>
                      <span className="font-medium">
                        {selectedPackage.description}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Base Price:</span>
                      <span className="font-medium">
                        ${selectedPackage.price.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Discount:</span>
                      <span className="font-medium">
                        {selectedPackage.discountPercentage}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Final Price:
                      </span>
                      <span className="font-medium">
                        ${selectedPackage.discountedPrice.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Status:</span>
                      <Badge
                        variant={
                          selectedPackage.status === "active"
                            ? "default"
                            : "secondary"
                        }
                      >
                        {selectedPackage.status === "active"
                          ? "Active"
                          : "Inactive"}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Created:</span>
                      <span className="font-medium">
                        {selectedPackage.createdAt}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Last Updated:
                      </span>
                      <span className="font-medium">
                        {selectedPackage.updatedAt}
                      </span>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-4">Included Tests</h3>
                  <div className="border rounded-md">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Test Name</TableHead>
                          <TableHead>Category</TableHead>
                          <TableHead>Price</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedPackage.tests.map((test) => (
                          <TableRow key={test.id}>
                            <TableCell>{test.name}</TableCell>
                            <TableCell>{test.category}</TableCell>
                            <TableCell>${test.price.toFixed(2)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                  <div className="mt-4">
                    <div className="flex justify-between font-semibold">
                      <span>Total Tests Value:</span>
                      <span>
                        $
                        {selectedPackage.tests
                          .reduce((sum, test) => sum + test.price, 0)
                          .toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between font-semibold text-green-600">
                      <span>Savings:</span>
                      <span>
                        $
                        {(
                          selectedPackage.tests.reduce(
                            (sum, test) => sum + test.price,
                            0,
                          ) - selectedPackage.discountedPrice
                        ).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <DialogFooter>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => setIsViewDetailsOpen(false)}
                  >
                    Close
                  </Button>
                  <Button
                    onClick={() => {
                      setIsViewDetailsOpen(false);
                      handleEditPackage(selectedPackage);
                    }}
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Package
                  </Button>
                </div>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LaboratoryPackages;
