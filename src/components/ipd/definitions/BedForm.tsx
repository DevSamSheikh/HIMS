import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import DataTable from "@/components/ui/data-table";
import { PlusCircle, BedDouble, Search, Users } from "lucide-react";
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
  const [showOccupancyModal, setShowOccupancyModal] = useState(false);

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
        <Button onClick={() => setShowOccupancyModal(true)}>
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

      {/* Bed Occupancy Modal */}
      <Dialog open={showOccupancyModal} onOpenChange={setShowOccupancyModal}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Bed Occupancy</DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            <Tabs defaultValue="grid" className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger value="grid">Grid View</TabsTrigger>
                <TabsTrigger value="list">List View</TabsTrigger>
              </TabsList>

              <TabsContent value="grid" className="w-full">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {beds.map((bed) => {
                    // Determine status color
                    const statusColors: Record<string, string> = {
                      available: "bg-green-100 border-green-300 text-green-800",
                      occupied: "bg-red-100 border-red-300 text-red-800",
                      maintenance:
                        "bg-amber-100 border-amber-300 text-amber-800",
                      reserved: "bg-blue-100 border-blue-300 text-blue-800",
                    };

                    return (
                      <div
                        key={bed.id}
                        className={`border rounded-lg overflow-hidden ${statusColors[bed.status]}`}
                      >
                        <div className="p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="text-lg font-semibold flex items-center">
                                <BedDouble className="mr-2 h-4 w-4" />
                                Bed {bed.bedNumber}
                              </h3>
                              <p className="text-sm">
                                {bed.wardName} - Room {bed.roomNumber}
                              </p>
                            </div>
                            <Badge
                              variant="outline"
                              className={statusColors[bed.status]}
                            >
                              {bed.status.charAt(0).toUpperCase() +
                                bed.status.slice(1)}
                            </Badge>
                          </div>

                          <div className="mt-4">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium">Type:</span>
                              <span className="text-sm">{bed.bedType}</span>
                            </div>
                            {bed.currentPatientName && (
                              <div className="mt-2 p-2 bg-blue-50 rounded-md">
                                <div className="text-sm font-medium">
                                  Current Patient:
                                </div>
                                <div className="text-sm">
                                  {bed.currentPatientName}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  {bed.currentPatientId}
                                </div>
                              </div>
                            )}
                          </div>

                          <div className="mt-4 flex justify-between items-center">
                            <span className="text-xs">
                              Last Sanitized: {bed.lastSanitized}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </TabsContent>

              <TabsContent value="list">
                <Card>
                  <CardContent className="p-0">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-3">Bed Number</th>
                          <th className="text-left p-3">Ward</th>
                          <th className="text-left p-3">Room</th>
                          <th className="text-left p-3">Type</th>
                          <th className="text-left p-3">Status</th>
                          <th className="text-left p-3">Current Patient</th>
                          <th className="text-left p-3">Last Sanitized</th>
                        </tr>
                      </thead>
                      <tbody>
                        {beds.map((bed) => {
                          return (
                            <tr
                              key={bed.id}
                              className="border-b hover:bg-muted/50"
                            >
                              <td className="p-3 font-medium">
                                {bed.bedNumber}
                              </td>
                              <td className="p-3">{bed.wardName}</td>
                              <td className="p-3">{bed.roomNumber}</td>
                              <td className="p-3">{bed.bedType}</td>
                              <td className="p-3">
                                <Badge
                                  variant="outline"
                                  className={
                                    bed.status === "available"
                                      ? "bg-green-100 text-green-800"
                                      : bed.status === "occupied"
                                        ? "bg-red-100 text-red-800"
                                        : bed.status === "maintenance"
                                          ? "bg-amber-100 text-amber-800"
                                          : "bg-blue-100 text-blue-800"
                                  }
                                >
                                  {bed.status.charAt(0).toUpperCase() +
                                    bed.status.slice(1)}
                                </Badge>
                              </td>
                              <td className="p-3">
                                {bed.currentPatientName ? (
                                  <span className="text-blue-600">
                                    {bed.currentPatientName} (
                                    {bed.currentPatientId})
                                  </span>
                                ) : (
                                  <span className="text-gray-400">-</span>
                                )}
                              </td>
                              <td className="p-3">{bed.lastSanitized}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BedForm;
