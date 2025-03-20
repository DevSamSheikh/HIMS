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

interface Disease {
  id: string;
  name: string;
  description: string;
  icd10Code: string;
  isActive: boolean;
}

const DiseasesForm = () => {
  const [diseases, setDiseases] = useState<Disease[]>([
    {
      id: "1",
      name: "Hypertension",
      description: "High blood pressure",
      icd10Code: "I10",
      isActive: true,
    },
    {
      id: "2",
      name: "Type 2 Diabetes",
      description: "Non-insulin-dependent diabetes mellitus",
      icd10Code: "E11",
      isActive: true,
    },
    {
      id: "3",
      name: "Asthma",
      description: "Chronic respiratory condition",
      icd10Code: "J45",
      isActive: true,
    },
  ]);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [newDisease, setNewDisease] = useState<Partial<Disease>>({
    name: "",
    description: "",
    icd10Code: "",
    isActive: true,
  });

  const handleAddDisease = () => {
    if (!newDisease.name) return;

    const disease: Disease = {
      id: Date.now().toString(),
      name: newDisease.name,
      description: newDisease.description || "",
      icd10Code: newDisease.icd10Code || "",
      isActive: newDisease.isActive || true,
    };

    setDiseases([...diseases, disease]);
    setNewDisease({ name: "", description: "", icd10Code: "", isActive: true });
  };

  const handleEditDisease = (id: string) => {
    setEditingId(id);
  };

  const handleSaveEdit = (id: string) => {
    setDiseases(
      diseases.map((disease) => (disease.id === id ? { ...disease } : disease)),
    );
    setEditingId(null);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
  };

  const handleDeleteDisease = (id: string) => {
    setDiseases(diseases.filter((disease) => disease.id !== id));
  };

  const handleInputChange = (
    id: string,
    field: keyof Disease,
    value: string | boolean,
  ) => {
    setDiseases(
      diseases.map((disease) =>
        disease.id === id ? { ...disease, [field]: value } : disease,
      ),
    );
  };

  const handleNewDiseaseChange = (
    field: keyof Omit<Disease, "id">,
    value: string | boolean,
  ) => {
    setNewDisease({ ...newDisease, [field]: value });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Diseases</CardTitle>
        <CardDescription>Manage diseases for OPD consultations</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-end gap-4">
            <div className="grid flex-1 gap-2">
              <Input
                placeholder="Disease Name"
                value={newDisease.name}
                onChange={(e) => handleNewDiseaseChange("name", e.target.value)}
              />
            </div>
            <div className="grid flex-1 gap-2">
              <Input
                placeholder="Description"
                value={newDisease.description}
                onChange={(e) =>
                  handleNewDiseaseChange("description", e.target.value)
                }
              />
            </div>
            <div className="grid w-[150px] gap-2">
              <Input
                placeholder="ICD-10 Code"
                value={newDisease.icd10Code}
                onChange={(e) =>
                  handleNewDiseaseChange("icd10Code", e.target.value)
                }
              />
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                id="isActive"
                checked={newDisease.isActive}
                onCheckedChange={(checked) =>
                  handleNewDiseaseChange("isActive", checked as boolean)
                }
              />
              <label
                htmlFor="isActive"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Active
              </label>
            </div>
            <Button onClick={handleAddDisease}>
              <PlusCircle className="mr-2 h-4 w-4" /> Add Disease
            </Button>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>ICD-10 Code</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {diseases.map((disease) => (
                  <TableRow key={disease.id}>
                    <TableCell>
                      {editingId === disease.id ? (
                        <Input
                          value={disease.name}
                          onChange={(e) =>
                            handleInputChange(
                              disease.id,
                              "name",
                              e.target.value,
                            )
                          }
                        />
                      ) : (
                        disease.name
                      )}
                    </TableCell>
                    <TableCell>
                      {editingId === disease.id ? (
                        <Input
                          value={disease.description}
                          onChange={(e) =>
                            handleInputChange(
                              disease.id,
                              "description",
                              e.target.value,
                            )
                          }
                        />
                      ) : (
                        disease.description
                      )}
                    </TableCell>
                    <TableCell>
                      {editingId === disease.id ? (
                        <Input
                          value={disease.icd10Code}
                          onChange={(e) =>
                            handleInputChange(
                              disease.id,
                              "icd10Code",
                              e.target.value,
                            )
                          }
                        />
                      ) : (
                        disease.icd10Code
                      )}
                    </TableCell>
                    <TableCell>
                      {editingId === disease.id ? (
                        <div className="flex items-center">
                          <Checkbox
                            checked={disease.isActive}
                            onCheckedChange={(checked) =>
                              handleInputChange(
                                disease.id,
                                "isActive",
                                checked as boolean,
                              )
                            }
                          />
                          <span className="ml-2">Active</span>
                        </div>
                      ) : (
                        <Badge
                          variant={disease.isActive ? "default" : "outline"}
                          className={
                            disease.isActive
                              ? "bg-green-100 text-green-800"
                              : ""
                          }
                        >
                          {disease.isActive ? "Active" : "Inactive"}
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {editingId === disease.id ? (
                          <>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleSaveEdit(disease.id)}
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
                              onClick={() => handleEditDisease(disease.id)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteDisease(disease.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {diseases.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center h-24">
                      No diseases found. Add a new disease above.
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

export default DiseasesForm;
