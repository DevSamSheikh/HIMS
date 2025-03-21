import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import DataTable from "@/components/ui/data-table";
import { PlusCircle, BedDouble, ArrowLeft } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface RoomType {
  id: string;
  name: string;
  description: string;
  baseRate: number;
  amenities: string[];
  status: "active" | "inactive";
}

const RoomTypeForm = () => {
  const { toast } = useToast();

  const [roomTypes, setRoomTypes] = useState<RoomType[]>([
    {
      id: "type-1",
      name: "General",
      description: "Basic room with standard amenities",
      baseRate: 1000,
      amenities: ["TV", "AC"],
      status: "active",
    },
    {
      id: "type-2",
      name: "Semi-Private",
      description: "Room shared between two patients with enhanced amenities",
      baseRate: 2000,
      amenities: ["TV", "AC", "Refrigerator"],
      status: "active",
    },
    {
      id: "type-3",
      name: "Private",
      description: "Private room with premium amenities",
      baseRate: 3500,
      amenities: ["TV", "AC", "Refrigerator", "Sofa"],
      status: "active",
    },
    {
      id: "type-4",
      name: "Deluxe",
      description: "Spacious private room with all amenities",
      baseRate: 5000,
      amenities: ["TV", "AC", "Refrigerator", "Sofa", "Dining Area"],
      status: "active",
    },
    {
      id: "type-5",
      name: "Suite",
      description: "Luxury suite with separate living area",
      baseRate: 8000,
      amenities: [
        "TV",
        "AC",
        "Refrigerator",
        "Sofa",
        "Dining Area",
        "Separate Living Room",
      ],
      status: "active",
    },
    {
      id: "type-6",
      name: "ICU",
      description: "Intensive Care Unit room",
      baseRate: 10000,
      amenities: ["Medical Equipment", "24/7 Monitoring"],
      status: "active",
    },
    {
      id: "type-7",
      name: "Isolation",
      description: "Room for patients requiring isolation",
      baseRate: 6000,
      amenities: ["Negative Pressure", "Separate Ventilation", "TV", "AC"],
      status: "active",
    },
  ]);

  const columns = [
    {
      header: "Room Type",
      accessorKey: "name" as keyof RoomType,
      cellType: "text" as const,
      required: true,
    },
    {
      header: "Description",
      accessorKey: "description" as keyof RoomType,
      cellType: "text" as const,
    },
    {
      header: "Base Rate (₹/day)",
      accessorKey: "baseRate" as keyof RoomType,
      cellType: "number" as const,
      required: true,
      cell: (item: RoomType) => {
        return <span>₹{item.baseRate.toLocaleString()}</span>;
      },
    },
    {
      header: "Amenities",
      accessorKey: "amenities" as keyof RoomType,
      cellType: "text" as const,
      cell: (item: RoomType) => {
        return (
          <div className="flex flex-wrap gap-1">
            {item.amenities.map((amenity, index) => (
              <span
                key={index}
                className="inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10 dark:bg-blue-900/30 dark:text-blue-400"
              >
                {amenity}
              </span>
            ))}
          </div>
        );
      },
    },
    {
      header: "Status",
      accessorKey: "status" as keyof RoomType,
      cellType: "dropdown" as const,
      required: true,
      cell: (item: RoomType) => {
        const statusColors = {
          active:
            "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
          inactive:
            "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400",
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
  ];

  const handleSave = (updatedRoomTypes: RoomType[]) => {
    setRoomTypes(updatedRoomTypes);
    toast({
      title: "Success",
      description: "Room types updated successfully",
    });
  };

  return (
    <div className="container mx-auto py-6 space-y-6 max-w-7xl">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Room Type Management
          </h1>
          <p className="text-muted-foreground">
            Define room types and their base rates
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => (window.location.href = "/ipd/rooms")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Room Management
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BedDouble className="mr-2 h-5 w-5" />
            Room Types
          </CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            data={roomTypes}
            columns={columns}
            onSave={handleSave}
            isSearchable={true}
            isSortable={true}
            addButtonText="Add Room Type"
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default RoomTypeForm;
