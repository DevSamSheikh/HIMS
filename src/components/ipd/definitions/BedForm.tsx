import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import DataTable from "@/components/ui/data-table";
import { PlusCircle, BedDouble } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import SearchableSelect from "@/components/ui/searchable-select";

interface Bed {
  id: string;
  bedNumber: string;
  roomId: string;
  roomNumber: string;
  wardId: string;
  wardName: string;
  bedType: string;
  status: "available" | "occupied" | "maintenance" | "reserved";
  description: string;
  lastSanitized: string;
  currentPatientId?: string;
  currentPatientName?: string;
}

const BedForm = () => {
  const { toast } = useToast();

  // Mock data for wards
  const wards = [
    { id: "ward-1", name: "General Ward" },
    { id: "ward-2", name: "Pediatric Ward" },
    { id: "ward-3", name: "Surgical Ward" },
    { id: "ward-4", name: "ICU" },
    { id: "ward-5", name: "Maternity Ward" },
  ];

  // Mock data for rooms
  const rooms = [
    { id: "room-1", name: "101", wardId: "ward-1" },
    { id: "room-2", name: "102", wardId: "ward-1" },
    { id: "room-3", name: "201", wardId: "ward-2" },
    { id: "room-4", name: "301", wardId: "ward-3" },
    { id: "room-5", name: "401", wardId: "ward-4" },
  ];

  // Mock data for bed types
  const bedTypes = [
    { id: "standard", name: "Standard" },
    { id: "electric", name: "Electric" },
    { id: "bariatric", name: "Bariatric" },
    { id: "pediatric", name: "Pediatric" },
    { id: "icu", name: "ICU" },
  ];

  const [beds, setBeds] = useState<Bed[]>([
    {
      id: "bed-1",
      bedNumber: "101-A",
      roomId: "room-1",
      roomNumber: "101",
      wardId: "ward-1",
      wardName: "General Ward",
      bedType: "Standard",
      status: "available",
      description: "Standard bed in general ward",
      lastSanitized: "2023-06-15",
    },
    {
      id: "bed-2",
      bedNumber: "101-B",
      roomId: "room-1",
      roomNumber: "101",
      wardId: "ward-1",
      wardName: "General Ward",
      bedType: "Standard",
      status: "occupied",
      description: "Standard bed in general ward",
      lastSanitized: "2023-06-14",
      currentPatientId: "P-1001",
      currentPatientName: "John Doe",
    },
    {
      id: "bed-3",
      bedNumber: "102-A",
      roomId: "room-2",
      roomNumber: "102",
      wardId: "ward-1",
      wardName: "General Ward",
      bedType: "Electric",
      status: "maintenance",
      description: "Electric bed in general ward",
      lastSanitized: "2023-06-13",
    },
    {
      id: "bed-4",
      bedNumber: "201-A",
      roomId: "room-3",
      roomNumber: "201",
      wardId: "ward-2",
      wardName: "Pediatric Ward",
      bedType: "Pediatric",
      status: "available",
      description: "Pediatric bed",
      lastSanitized: "2023-06-15",
    },
    {
      id: "bed-5",
      bedNumber: "401-A",
      roomId: "room-5",
      roomNumber: "401",
      wardId: "ward-4",
      wardName: "ICU",
      bedType: "ICU",
      status: "reserved",
      description: "ICU bed with monitoring equipment",
      lastSanitized: "2023-06-15",
    },
  ]);

  const columns = [
    {
      header: "Bed Number",
      accessorKey: "bedNumber" as keyof Bed,
      cellType: "text" as const,
      required: true,
    },
    {
      header: "Ward",
      accessorKey: "wardId" as keyof Bed,
      cellType: "dropdown" as const,
      required: true,
      cell: (item: Bed) => {
        return (
          <SearchableSelect
            label=""
            options={wards}
            value={item.wardId}
            onValueChange={(value) => {
              // This would be handled by the DataTable component
              console.log("Ward changed to", value);
            }}
            placeholder="Select Ward"
            showSelectedLabel={true}
          />
        );
      },
    },
    {
      header: "Room",
      accessorKey: "roomId" as keyof Bed,
      cellType: "dropdown" as const,
      required: true,
      cell: (item: Bed) => {
        // Filter rooms by ward
        const filteredRooms = rooms.filter(
          (room) => room.wardId === item.wardId,
        );

        return (
          <SearchableSelect
            label=""
            options={filteredRooms}
            value={item.roomId}
            onValueChange={(value) => {
              // This would be handled by the DataTable component
              console.log("Room changed to", value);
            }}
            placeholder="Select Room"
            showSelectedLabel={true}
          />
        );
      },
    },
    {
      header: "Bed Type",
      accessorKey: "bedType" as keyof Bed,
      cellType: "dropdown" as const,
      required: true,
      cell: (item: Bed) => {
        return (
          <SearchableSelect
            label=""
            options={bedTypes}
            value={bedTypes.find((bt) => bt.name === item.bedType)?.id || ""}
            onValueChange={(value) => {
              // This would be handled by the DataTable component
              console.log("Bed type changed to", value);
            }}
            placeholder="Select Bed Type"
            showSelectedLabel={true}
          />
        );
      },
    },
    {
      header: "Status",
      accessorKey: "status" as keyof Bed,
      cellType: "text" as const,
      required: true,
      cell: (item: Bed) => {
        const statusColors = {
          available:
            "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
          occupied:
            "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
          maintenance:
            "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
          reserved:
            "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
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
      header: "Current Patient",
      accessorKey: "currentPatientName" as keyof Bed,
      cellType: "text" as const,
      cell: (item: Bed) => {
        return item.currentPatientName ? (
          <span className="text-blue-600 dark:text-blue-400">
            {item.currentPatientName} ({item.currentPatientId})
          </span>
        ) : (
          <span className="text-gray-400">-</span>
        );
      },
    },
    {
      header: "Last Sanitized",
      accessorKey: "lastSanitized" as keyof Bed,
      cellType: "date" as const,
    },
    {
      header: "Description",
      accessorKey: "description" as keyof Bed,
      cellType: "text" as const,
    },
  ];

  const handleSave = (updatedBeds: Bed[]) => {
    // Update the room number and ward name based on the selected IDs
    const bedsWithDetails = updatedBeds.map((bed) => {
      const room = rooms.find((r) => r.id === bed.roomId);
      const ward = wards.find((w) => w.id === bed.wardId);
      return {
        ...bed,
        roomNumber: room ? room.name : bed.roomNumber,
        wardName: ward ? ward.name : bed.wardName,
      };
    });

    setBeds(bedsWithDetails);
    toast({
      title: "Success",
      description: "Beds updated successfully",
    });
  };

  return (
    <div className="container mx-auto py-6 space-y-6 max-w-7xl">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Bed Management</h1>
          <p className="text-muted-foreground">
            Define and manage hospital beds and their allocation
          </p>
        </div>
        <Button>
          <BedDouble className="mr-2 h-4 w-4" />
          View Bed Occupancy
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <PlusCircle className="mr-2 h-5 w-5" />
            Beds
          </CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            data={beds}
            columns={columns}
            onSave={handleSave}
            isSearchable={true}
            isSortable={true}
            addButtonText="Add Bed"
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default BedForm;
