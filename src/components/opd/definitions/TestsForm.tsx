import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { PlusCircle, Pencil, Trash2, Save, X } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Test {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  isActive: boolean;
}

const TestsForm = () => {
  const [tests, setTests] = useState<Test[]>([
    {
      id: "1",
      name: "Complete Blood Count",
      description: "Measures various components of blood",
      category: "Hematology",
      price: 500,
      isActive: true,
    },
    {
      id: "2",
      name: "Blood Glucose",
      description: "Measures blood sugar levels",
      category: "Biochemistry",
      price: 300,
      isActive: true,
    },
    {
      id: "3",
      name: "Lipid Profile",
      description: "Measures cholesterol and triglycerides",
      category: "Biochemistry",
      price: 800,
      isActive: true,
    },
  ]);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [newTest, setNewTest] = useState<Partial<Test>>({
    name: "",
    description: "",
    category: "",
    price: 0,
    isActive: true,
  });

  const handleAddTest = () => {
    if (!newTest.name) return;

    const test: Test = {
      id: Date.now().toString(),
      name: newTest.name,
      description: newTest.description || "",
      category: newTest.category || "",
      price: newTest.price || 0,
      isActive: newTest.isActive || true,
    };

    setTests([...tests, test]);
    setNewTest({
      name: "",
      description: "",
      category: "",
      price: 0,
      isActive: true,
    });
  };

  const handleEditTest = (id: string) => {
    setEditingId(id);
  };

  const handleSaveEdit = (id: string) => {
    setTests(tests.map((test) => (test.id === id ? { ...test } : test)));
    setEditingId(null);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
  };

  const handleDeleteTest = (id: string) => {
    setTests(tests.filter((test) => test.id !== id));
  };

  const handleInputChange = (
    id: string,
    field: keyof Test,
    value: string | boolean | number,
  ) => {
    setTests(
      tests.map((test) =>
        test.id === id ? { ...test, [field]: value } : test,
      ),
    );
  };

  const handleNewTestChange = (
    field: keyof Omit<Test, "id">,
    value: string | boolean | number,
  ) => {
    setNewTest({ ...newTest, [field]: value });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tests</CardTitle>
        <CardDescription>
          Manage diagnostic tests for OPD consultations
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-end gap-4">
            <div className="grid flex-1 gap-2">
              <Input
                placeholder="Test Name"
                value={newTest.name}
                onChange={(e) => handleNewTestChange("name", e.target.value)}
              />
            </div>
            <div className="grid flex-1 gap-2">
              <Input
                placeholder="Description"
                value={newTest.description}
                onChange={(e) =>
                  handleNewTestChange("description", e.target.value)
                }
              />
            </div>
            <div className="grid w-[150px] gap-2">
              <Input
                placeholder="Category"
                value={newTest.category}
                onChange={(e) =>
                  handleNewTestChange("category", e.target.value)
                }
              />
            </div>
            <div className="grid w-[100px] gap-2">
              <Input
                type="number"
                placeholder="Price"
                value={newTest.price?.toString() || ""}
                onChange={(e) =>
                  handleNewTestChange("price", parseFloat(e.target.value) || 0)
                }
              />
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                id="isActive"
                checked={newTest.isActive}
                onCheckedChange={(checked) =>
                  handleNewTestChange("isActive", checked as boolean)
                }
              />
              <label
                htmlFor="isActive"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Active
              </label>
            </div>
            <Button onClick={handleAddTest}>
              <PlusCircle className="mr-2 h-4 w-4" /> Add Test
            </Button>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tests.map((test) => (
                  <TableRow key={test.id}>
                    <TableCell>
                      {editingId === test.id ? (
                        <Input
                          value={test.name}
                          onChange={(e) =>
                            handleInputChange(test.id, "name", e.target.value)
                          }
                        />
                      ) : (
                        test.name
                      )}
                    </TableCell>
                    <TableCell>
                      {editingId === test.id ? (
                        <Input
                          value={test.description}
                          onChange={(e) =>
                            handleInputChange(
                              test.id,
                              "description",
                              e.target.value,
                            )
                          }
                        />
                      ) : (
                        test.description
                      )}
                    </TableCell>
                    <TableCell>
                      {editingId === test.id ? (
                        <Input
                          value={test.category}
                          onChange={(e) =>
                            handleInputChange(
                              test.id,
                              "category",
                              e.target.value,
                            )
                          }
                        />
                      ) : (
                        test.category
                      )}
                    </TableCell>
                    <TableCell>
                      {editingId === test.id ? (
                        <Input
                          type="number"
                          value={test.price}
                          onChange={(e) =>
                            handleInputChange(
                              test.id,
                              "price",
                              parseFloat(e.target.value) || 0,
                            )
                          }
                        />
                      ) : (
                        `₹${test.price.toFixed(2)}`
                      )}
                    </TableCell>
                    <TableCell>
                      {editingId === test.id ? (
                        <div className="flex items-center">
                          <Checkbox
                            checked={test.isActive}
                            onCheckedChange={(checked) =>
                              handleInputChange(
                                test.id,
                                "isActive",
                                checked as boolean,
                              )
                            }
                          />
                          <span className="ml-2">Active</span>
                        </div>
                      ) : (
                        <Badge
                          variant={test.isActive ? "default" : "outline"}
                          className={
                            test.isActive ? "bg-green-100 text-green-800" : ""
                          }
                        >
                          {test.isActive ? "Active" : "Inactive"}
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {editingId === test.id ? (
                          <>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleSaveEdit(test.id)}
                            >
                              <Save className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={handleCancelEdit}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </>
                        ) : (
                          <>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEditTest(test.id)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteTest(test.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {tests.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center h-24">
                      No tests found. Add a new test above.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TestsForm;
