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

interface Day {
  id: string;
  name: string;
  value: number;
  description: string;
  isActive: boolean;
}

const DaysForm = () => {
  const [days, setDays] = useState<Day[]>([
    {
      id: "1",
      name: "1 Day",
      value: 1,
      description: "For one day",
      isActive: true,
    },
    {
      id: "2",
      name: "3 Days",
      value: 3,
      description: "For three days",
      isActive: true,
    },
    {
      id: "3",
      name: "5 Days",
      value: 5,
      description: "For five days",
      isActive: true,
    },
    {
      id: "4",
      name: "7 Days",
      value: 7,
      description: "For one week",
      isActive: true,
    },
    {
      id: "5",
      name: "10 Days",
      value: 10,
      description: "For ten days",
      isActive: true,
    },
    {
      id: "6",
      name: "15 Days",
      value: 15,
      description: "For fifteen days",
      isActive: true,
    },
    {
      id: "7",
      name: "30 Days",
      value: 30,
      description: "For one month",
      isActive: true,
    },
  ]);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [newDay, setNewDay] = useState<Partial<Day>>({
    name: "",
    value: 0,
    description: "",
    isActive: true,
  });

  const handleAddDay = () => {
    if (!newDay.name || !newDay.value) return;

    const day: Day = {
      id: Date.now().toString(),
      name: newDay.name,
      value: newDay.value,
      description: newDay.description || "",
      isActive: newDay.isActive || true,
    };

    setDays([...days, day]);
    setNewDay({ name: "", value: 0, description: "", isActive: true });
  };

  const handleEditDay = (id: string) => {
    setEditingId(id);
  };

  const handleSaveEdit = (id: string) => {
    setDays(days.map((day) => (day.id === id ? { ...day } : day)));
    setEditingId(null);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
  };

  const handleDeleteDay = (id: string) => {
    setDays(days.filter((day) => day.id !== id));
  };

  const handleInputChange = (
    id: string,
    field: keyof Day,
    value: string | boolean | number,
  ) => {
    setDays(
      days.map((day) => (day.id === id ? { ...day, [field]: value } : day)),
    );
  };

  const handleNewDayChange = (
    field: keyof Omit<Day, "id">,
    value: string | boolean | number,
  ) => {
    setNewDay({ ...newDay, [field]: value });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Days</CardTitle>
        <CardDescription>
          Manage duration options for medication prescriptions
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-end gap-4">
            <div className="grid flex-1 gap-2">
              <Input
                placeholder="Name (e.g. 7 Days)"
                value={newDay.name}
                onChange={(e) => handleNewDayChange("name", e.target.value)}
              />
            </div>
            <div className="grid w-[100px] gap-2">
              <Input
                type="number"
                placeholder="Value"
                value={newDay.value?.toString() || ""}
                onChange={(e) =>
                  handleNewDayChange("value", parseInt(e.target.value) || 0)
                }
              />
            </div>
            <div className="grid flex-1 gap-2">
              <Input
                placeholder="Description"
                value={newDay.description}
                onChange={(e) =>
                  handleNewDayChange("description", e.target.value)
                }
              />
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                id="isActive"
                checked={newDay.isActive}
                onCheckedChange={(checked) =>
                  handleNewDayChange("isActive", checked as boolean)
                }
              />
              <label
                htmlFor="isActive"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Active
              </label>
            </div>
            <Button onClick={handleAddDay}>
              <PlusCircle className="mr-2 h-4 w-4" /> Add Day
            </Button>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Value (Days)</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {days.map((day) => (
                  <TableRow key={day.id}>
                    <TableCell>
                      {editingId === day.id ? (
                        <Input
                          value={day.name}
                          onChange={(e) =>
                            handleInputChange(day.id, "name", e.target.value)
                          }
                        />
                      ) : (
                        day.name
                      )}
                    </TableCell>
                    <TableCell>
                      {editingId === day.id ? (
                        <Input
                          type="number"
                          value={day.value}
                          onChange={(e) =>
                            handleInputChange(
                              day.id,
                              "value",
                              parseInt(e.target.value) || 0,
                            )
                          }
                        />
                      ) : (
                        day.value
                      )}
                    </TableCell>
                    <TableCell>
                      {editingId === day.id ? (
                        <Input
                          value={day.description}
                          onChange={(e) =>
                            handleInputChange(
                              day.id,
                              "description",
                              e.target.value,
                            )
                          }
                        />
                      ) : (
                        day.description
                      )}
                    </TableCell>
                    <TableCell>
                      {editingId === day.id ? (
                        <div className="flex items-center">
                          <Checkbox
                            checked={day.isActive}
                            onCheckedChange={(checked) =>
                              handleInputChange(
                                day.id,
                                "isActive",
                                checked as boolean,
                              )
                            }
                          />
                          <span className="ml-2">Active</span>
                        </div>
                      ) : (
                        <Badge
                          variant={day.isActive ? "default" : "outline"}
                          className={
                            day.isActive ? "bg-green-100 text-green-800" : ""
                          }
                        >
                          {day.isActive ? "Active" : "Inactive"}
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {editingId === day.id ? (
                          <>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleSaveEdit(day.id)}
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
                              onClick={() => handleEditDay(day.id)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteDay(day.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {days.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center h-24">
                      No days found. Add a new day above.
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

export default DaysForm;
