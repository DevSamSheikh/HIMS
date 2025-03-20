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

interface Symptom {
  id: string;
  name: string;
  description: string;
  category: string;
  isActive: boolean;
}

const SymptomsForm = () => {
  const [symptoms, setSymptoms] = useState<Symptom[]>([
    {
      id: "1",
      name: "Fever",
      description: "Elevated body temperature",
      category: "General",
      isActive: true,
    },
    {
      id: "2",
      name: "Headache",
      description: "Pain in the head or upper neck",
      category: "Neurological",
      isActive: true,
    },
    {
      id: "3",
      name: "Cough",
      description: "Sudden expulsion of air from the lungs",
      category: "Respiratory",
      isActive: true,
    },
  ]);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [newSymptom, setNewSymptom] = useState<Partial<Symptom>>({
    name: "",
    description: "",
    category: "",
    isActive: true,
  });

  const handleAddSymptom = () => {
    if (!newSymptom.name) return;

    const symptom: Symptom = {
      id: Date.now().toString(),
      name: newSymptom.name,
      description: newSymptom.description || "",
      category: newSymptom.category || "",
      isActive: newSymptom.isActive || true,
    };

    setSymptoms([...symptoms, symptom]);
    setNewSymptom({ name: "", description: "", category: "", isActive: true });
  };

  const handleEditSymptom = (id: string) => {
    setEditingId(id);
  };

  const handleSaveEdit = (id: string) => {
    setSymptoms(
      symptoms.map((symptom) => (symptom.id === id ? { ...symptom } : symptom)),
    );
    setEditingId(null);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
  };

  const handleDeleteSymptom = (id: string) => {
    setSymptoms(symptoms.filter((symptom) => symptom.id !== id));
  };

  const handleInputChange = (
    id: string,
    field: keyof Symptom,
    value: string | boolean,
  ) => {
    setSymptoms(
      symptoms.map((symptom) =>
        symptom.id === id ? { ...symptom, [field]: value } : symptom,
      ),
    );
  };

  const handleNewSymptomChange = (
    field: keyof Omit<Symptom, "id">,
    value: string | boolean,
  ) => {
    setNewSymptom({ ...newSymptom, [field]: value });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Symptoms</CardTitle>
        <CardDescription>Manage symptoms for OPD consultations</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-end gap-4">
            <div className="grid flex-1 gap-2">
              <Input
                placeholder="Symptom Name"
                value={newSymptom.name}
                onChange={(e) => handleNewSymptomChange("name", e.target.value)}
              />
            </div>
            <div className="grid flex-1 gap-2">
              <Input
                placeholder="Description"
                value={newSymptom.description}
                onChange={(e) =>
                  handleNewSymptomChange("description", e.target.value)
                }
              />
            </div>
            <div className="grid w-[150px] gap-2">
              <Input
                placeholder="Category"
                value={newSymptom.category}
                onChange={(e) =>
                  handleNewSymptomChange("category", e.target.value)
                }
              />
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                id="isActive"
                checked={newSymptom.isActive}
                onCheckedChange={(checked) =>
                  handleNewSymptomChange("isActive", checked as boolean)
                }
              />
              <label
                htmlFor="isActive"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Active
              </label>
            </div>
            <Button onClick={handleAddSymptom}>
              <PlusCircle className="mr-2 h-4 w-4" /> Add Symptom
            </Button>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {symptoms.map((symptom) => (
                  <TableRow key={symptom.id}>
                    <TableCell>
                      {editingId === symptom.id ? (
                        <Input
                          value={symptom.name}
                          onChange={(e) =>
                            handleInputChange(
                              symptom.id,
                              "name",
                              e.target.value,
                            )
                          }
                        />
                      ) : (
                        symptom.name
                      )}
                    </TableCell>
                    <TableCell>
                      {editingId === symptom.id ? (
                        <Input
                          value={symptom.description}
                          onChange={(e) =>
                            handleInputChange(
                              symptom.id,
                              "description",
                              e.target.value,
                            )
                          }
                        />
                      ) : (
                        symptom.description
                      )}
                    </TableCell>
                    <TableCell>
                      {editingId === symptom.id ? (
                        <Input
                          value={symptom.category}
                          onChange={(e) =>
                            handleInputChange(
                              symptom.id,
                              "category",
                              e.target.value,
                            )
                          }
                        />
                      ) : (
                        symptom.category
                      )}
                    </TableCell>
                    <TableCell>
                      {editingId === symptom.id ? (
                        <div className="flex items-center">
                          <Checkbox
                            checked={symptom.isActive}
                            onCheckedChange={(checked) =>
                              handleInputChange(
                                symptom.id,
                                "isActive",
                                checked as boolean,
                              )
                            }
                          />
                          <span className="ml-2">Active</span>
                        </div>
                      ) : (
                        <Badge
                          variant={symptom.isActive ? "default" : "outline"}
                          className={
                            symptom.isActive
                              ? "bg-green-100 text-green-800"
                              : ""
                          }
                        >
                          {symptom.isActive ? "Active" : "Inactive"}
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {editingId === symptom.id ? (
                          <>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleSaveEdit(symptom.id)}
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
                              onClick={() => handleEditSymptom(symptom.id)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteSymptom(symptom.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {symptoms.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center h-24">
                      No symptoms found. Add a new symptom above.
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

export default SymptomsForm;
