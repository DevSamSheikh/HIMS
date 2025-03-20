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

interface Dosage {
  id: string;
  name: string;
  description: string;
  frequency: string;
  isActive: boolean;
}

const DosageForm = () => {
  const [dosages, setDosages] = useState<Dosage[]>([
    {
      id: "1",
      name: "Once daily",
      description: "Take once a day",
      frequency: "1-0-0",
      isActive: true,
    },
    {
      id: "2",
      name: "Twice daily",
      description: "Take twice a day",
      frequency: "1-0-1",
      isActive: true,
    },
    {
      id: "3",
      name: "Three times daily",
      description: "Take three times a day",
      frequency: "1-1-1",
      isActive: true,
    },
    {
      id: "4",
      name: "Four times daily",
      description: "Take four times a day",
      frequency: "1-1-1-1",
      isActive: true,
    },
    {
      id: "5",
      name: "Before meals",
      description: "Take before meals",
      frequency: "Before meals",
      isActive: true,
    },
    {
      id: "6",
      name: "After meals",
      description: "Take after meals",
      frequency: "After meals",
      isActive: true,
    },
  ]);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [newDosage, setNewDosage] = useState<Partial<Dosage>>({
    name: "",
    description: "",
    frequency: "",
    isActive: true,
  });

  const handleAddDosage = () => {
    if (!newDosage.name) return;

    const dosage: Dosage = {
      id: Date.now().toString(),
      name: newDosage.name,
      description: newDosage.description || "",
      frequency: newDosage.frequency || "",
      isActive: newDosage.isActive || true,
    };

    setDosages([...dosages, dosage]);
    setNewDosage({ name: "", description: "", frequency: "", isActive: true });
  };

  const handleEditDosage = (id: string) => {
    setEditingId(id);
  };

  const handleSaveEdit = (id: string) => {
    setDosages(
      dosages.map((dosage) => (dosage.id === id ? { ...dosage } : dosage)),
    );
    setEditingId(null);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
  };

  const handleDeleteDosage = (id: string) => {
    setDosages(dosages.filter((dosage) => dosage.id !== id));
  };

  const handleInputChange = (
    id: string,
    field: keyof Dosage,
    value: string | boolean,
  ) => {
    setDosages(
      dosages.map((dosage) =>
        dosage.id === id ? { ...dosage, [field]: value } : dosage,
      ),
    );
  };

  const handleNewDosageChange = (
    field: keyof Omit<Dosage, "id">,
    value: string | boolean,
  ) => {
    setNewDosage({ ...newDosage, [field]: value });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Dosage</CardTitle>
        <CardDescription>
          Manage medication dosage instructions for prescriptions
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-end gap-4">
            <div className="grid flex-1 gap-2">
              <Input
                placeholder="Dosage Name"
                value={newDosage.name}
                onChange={(e) => handleNewDosageChange("name", e.target.value)}
              />
            </div>
            <div className="grid flex-1 gap-2">
              <Input
                placeholder="Description"
                value={newDosage.description}
                onChange={(e) =>
                  handleNewDosageChange("description", e.target.value)
                }
              />
            </div>
            <div className="grid w-[150px] gap-2">
              <Input
                placeholder="Frequency (e.g. 1-0-1)"
                value={newDosage.frequency}
                onChange={(e) =>
                  handleNewDosageChange("frequency", e.target.value)
                }
              />
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                id="isActive"
                checked={newDosage.isActive}
                onCheckedChange={(checked) =>
                  handleNewDosageChange("isActive", checked as boolean)
                }
              />
              <label
                htmlFor="isActive"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Active
              </label>
            </div>
            <Button onClick={handleAddDosage}>
              <PlusCircle className="mr-2 h-4 w-4" /> Add Dosage
            </Button>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Frequency</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {dosages.map((dosage) => (
                  <TableRow key={dosage.id}>
                    <TableCell>
                      {editingId === dosage.id ? (
                        <Input
                          value={dosage.name}
                          onChange={(e) =>
                            handleInputChange(dosage.id, "name", e.target.value)
                          }
                        />
                      ) : (
                        dosage.name
                      )}
                    </TableCell>
                    <TableCell>
                      {editingId === dosage.id ? (
                        <Input
                          value={dosage.description}
                          onChange={(e) =>
                            handleInputChange(
                              dosage.id,
                              "description",
                              e.target.value,
                            )
                          }
                        />
                      ) : (
                        dosage.description
                      )}
                    </TableCell>
                    <TableCell>
                      {editingId === dosage.id ? (
                        <Input
                          value={dosage.frequency}
                          onChange={(e) =>
                            handleInputChange(
                              dosage.id,
                              "frequency",
                              e.target.value,
                            )
                          }
                        />
                      ) : (
                        dosage.frequency
                      )}
                    </TableCell>
                    <TableCell>
                      {editingId === dosage.id ? (
                        <div className="flex items-center">
                          <Checkbox
                            checked={dosage.isActive}
                            onCheckedChange={(checked) =>
                              handleInputChange(
                                dosage.id,
                                "isActive",
                                checked as boolean,
                              )
                            }
                          />
                          <span className="ml-2">Active</span>
                        </div>
                      ) : (
                        <Badge
                          variant={dosage.isActive ? "default" : "outline"}
                          className={
                            dosage.isActive ? "bg-green-100 text-green-800" : ""
                          }
                        >
                          {dosage.isActive ? "Active" : "Inactive"}
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {editingId === dosage.id ? (
                          <>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleSaveEdit(dosage.id)}
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
                              onClick={() => handleEditDosage(dosage.id)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteDosage(dosage.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {dosages.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center h-24">
                      No dosages found. Add a new dosage above.
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

export default DosageForm;
