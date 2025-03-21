import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import DataTable from "@/components/ui/data-table";
import { PlusCircle, DoorClosed, ArrowRight, BedDouble } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import SearchableSelect from "@/components/ui/searchable-select";

interface RoomType {
  id: string;
  name: string;
  baseRate: number;
  amenities: string[];
}

interface Room {
  id: string;
  roomNumber: string;
  wardId: string;
  wardName: string;
  roomTypeId: string;
  roomTypeName: string;
  capacity: number;
  floor: string;
  description: string;
  status: "available" | "occupied" | "maintenance" | "reserved";
  dailyRate: number;
  amenities: string[];
}

const RoomForm = () => {
  const { toast } = useToast();
  const [showRoomTypesModal, setShowRoomTypesModal] = useState(false);
  const [showOccupancyModal, setShowOccupancyModal] = useState(false);

  // Mock data for wards
  const wards = [
    { id: "ward-1", name: "General Ward" },
    { id: "ward-2", name: "Pediatric Ward" },
    { id: "ward-3", name: "Surgical Ward" },
    { id: "ward-4", name: "ICU" },
    { id: "ward-5", name: "Maternity Ward" },
  ];

  // Mock data for room types - this would come from the RoomTypeForm in a real app
  const roomTypes = [
    {
      id: "type-1",
      name: "General",
      baseRate: 1000,
      amenities: ["TV", "AC"],
    },
    {
      id: "type-2",
      name: "Semi-Private",
      baseRate: 2000,
      amenities: ["TV", "AC", "Refrigerator"],
    },
    {
      id: "type-3",
      name: "Private",
      baseRate: 3500,
      amenities: ["TV", "AC", "Refrigerator", "Sofa"],
    },
    {
      id: "type-4",
      name: "Deluxe",
      baseRate: 5000,
      amenities: ["TV", "AC", "Refrigerator", "Sofa", "Dining Area"],
    },
    {
      id: "type-5",
      name: "Suite",
      baseRate: 8000,
      amenities: [
        "TV",
        "AC",
        "Refrigerator",
        "Sofa",
        "Dining Area",
        "Separate Living Room",
      ],
    },
    {
      id: "type-6",
      name: "ICU",
      baseRate: 10000,
      amenities: ["Medical Equipment", "24/7 Monitoring"],
    },
    {
      id: "type-7",
      name: "Isolation",
      baseRate: 6000,
      amenities: ["Negative Pressure", "Separate Ventilation", "TV", "AC"],
    },
  ];

  const [rooms, setRooms] = useState<Room[]>([
    {
      id: "room-1",
      roomNumber: "101",
      wardId: "ward-1",
      wardName: "General Ward",
      roomTypeId: "type-1",
      roomTypeName: "General",
      capacity: 4,
      floor: "Ground Floor",
      description: "General room with 4 beds",
      status: "available",
      dailyRate: 1000,
      amenities: ["TV", "AC"],
    },
    {
      id: "room-2",
      roomNumber: "102",
      wardId: "ward-1",
      wardName: "General Ward",
      roomTypeId: "type-2",
      roomTypeName: "Semi-Private",
      capacity: 2,
      floor: "Ground Floor",
      description: "Semi-private room with 2 beds",
      status: "occupied",
      dailyRate: 2000,
      amenities: ["TV", "AC", "Refrigerator"],
    },
    {
      id: "room-3",
      roomNumber: "201",
      wardId: "ward-2",
      wardName: "Pediatric Ward",
      roomTypeId: "type-3",
      roomTypeName: "Private",
      capacity: 1,
      floor: "First Floor",
      description: "Private room for pediatric patients",
      status: "available",
      dailyRate: 3500,
      amenities: ["TV", "AC", "Refrigerator", "Sofa"],
    },
    {
      id: "room-4",
      roomNumber: "301",
      wardId: "ward-3",
      wardName: "Surgical Ward",
      roomTypeId: "type-4",
      roomTypeName: "Deluxe",
      capacity: 1,
      floor: "Second Floor",
      description: "Deluxe room for post-surgical recovery",
      status: "maintenance",
      dailyRate: 5000,
      amenities: ["TV", "AC", "Refrigerator", "Sofa", "Dining Area"],
    },
    {
      id: "room-5",
      roomNumber: "401",
      wardId: "ward-4",
      wardName: "ICU",
      roomTypeId: "type-7",
      roomTypeName: "Isolation",
      capacity: 1,
      floor: "Third Floor",
      description: "Isolation room in ICU",
      status: "reserved",
      dailyRate: 6000,
      amenities: ["Negative Pressure", "Separate Ventilation", "TV", "AC"],
    },
  ]);

  // Function to update room rate when room type changes
  const updateRoomRateByType = (roomTypeId: string, room: Room) => {
    const selectedRoomType = roomTypes.find((rt) => rt.id === roomTypeId);
    if (selectedRoomType) {
      return {
        ...room,
        roomTypeId,
        roomTypeName: selectedRoomType.name,
        dailyRate: selectedRoomType.baseRate,
        amenities: selectedRoomType.amenities,
      };
    }
    return room;
  };

  // Handle room type change in the data table
  const handleRoomTypeChange = (roomTypeId: string, roomId: string) => {
    const updatedRooms = rooms.map((room) => {
      if (room.id === roomId) {
        return updateRoomRateByType(roomTypeId, room);
      }
      return room;
    });
    setRooms(updatedRooms);
  };

  const columns = [
    {
      header: "Room Number",
      accessorKey: "roomNumber" as keyof Room,
      cellType: "text" as const,
      required: true,
    },
    {
      header: "Ward",
      accessorKey: "wardId" as keyof Room,
      cellType: "dropdown" as const,
      required: true,
      cell: (item: Room) => {
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
      header: "Room Type",
      accessorKey: "roomTypeId" as keyof Room,
      cellType: "dropdown" as const,
      required: true,
      cell: (item: Room) => {
        return (
          <SearchableSelect
            label=""
            options={roomTypes.map((rt) => ({ id: rt.id, name: rt.name }))}
            value={item.roomTypeId}
            onValueChange={(value) => {
              handleRoomTypeChange(value, item.id);
            }}
            placeholder="Select Room Type"
            showSelectedLabel={true}
          />
        );
      },
    },
    {
      header: "Capacity",
      accessorKey: "capacity" as keyof Room,
      cellType: "number" as const,
      required: true,
    },
    {
      header: "Daily Rate",
      accessorKey: "dailyRate" as keyof Room,
      cellType: "number" as const,
      required: true,
      cell: (item: Room) => {
        return <span>₹{item.dailyRate.toLocaleString()}</span>;
      },
    },
    {
      header: "Status",
      accessorKey: "status" as keyof Room,
      cellType: "dropdown" as const,
      required: true,
      cell: (item: Room) => {
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
      header: "Floor",
      accessorKey: "floor" as keyof Room,
      cellType: "text" as const,
    },
    {
      header: "Amenities",
      accessorKey: "amenities" as keyof Room,
      cellType: "text" as const,
      cell: (item: Room) => {
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
      header: "Description",
      accessorKey: "description" as keyof Room,
      cellType: "text" as const,
    },
  ];

  const handleSave = (updatedRooms: Room[]) => {
    // Process the updated rooms
    const processedRooms = updatedRooms.map((room) => {
      // Update the ward name based on the selected ward ID
      const ward = wards.find((w) => w.id === room.wardId);

      // Update room type details and rate
      const updatedRoom = updateRoomRateByType(room.roomTypeId, {
        ...room,
        wardName: ward ? ward.name : room.wardName,
      });

      return updatedRoom;
    });

    setRooms(processedRooms);
    toast({
      title: "Success",
      description: "Rooms updated successfully",
    });
  };

  return (
    <div className="container mx-auto py-6 space-y-6 max-w-7xl">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Room Management</h1>
          <p className="text-muted-foreground">
            Define and manage hospital rooms and their capacities
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowRoomTypesModal(true)}>
            <ArrowRight className="mr-2 h-4 w-4" />
            Manage Room Types
          </Button>
          <Button onClick={() => setShowOccupancyModal(true)}>
            <DoorClosed className="mr-2 h-4 w-4" />
            View Room Occupancy
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <PlusCircle className="mr-2 h-5 w-5" />
            Rooms
          </CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            data={rooms}
            columns={columns}
            onSave={handleSave}
            isSearchable={true}
            isSortable={true}
            addButtonText="Add Room"
          />
        </CardContent>
      </Card>

      {/* Room Types Modal */}
      <Dialog open={showRoomTypesModal} onOpenChange={setShowRoomTypesModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Room Type Management</DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            <DataTable
              data={roomTypes}
              columns={[
                {
                  header: "Room Type",
                  accessorKey: "name",
                  cellType: "text" as const,
                  required: true,
                },
                {
                  header: "Description",
                  accessorKey: "description",
                  cellType: "text" as const,
                },
                {
                  header: "Base Rate (₹/day)",
                  accessorKey: "baseRate",
                  cellType: "number" as const,
                  required: true,
                  cell: (item: any) => {
                    return <span>₹{item.baseRate.toLocaleString()}</span>;
                  },
                },
                {
                  header: "Amenities",
                  accessorKey: "amenities",
                  cellType: "text" as const,
                  cell: (item: any) => {
                    return (
                      <div className="flex flex-wrap gap-1">
                        {item.amenities.map(
                          (amenity: string, index: number) => (
                            <span
                              key={index}
                              className="inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10 dark:bg-blue-900/30 dark:text-blue-400"
                            >
                              {amenity}
                            </span>
                          ),
                        )}
                      </div>
                    );
                  },
                },
              ]}
              onSave={(updatedRoomTypes) => {
                // In a real app, this would update the room types in the database
                toast({
                  title: "Success",
                  description: "Room types updated successfully",
                });
              }}
              isSearchable={true}
              isSortable={true}
              addButtonText="Add Room Type"
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* Room Occupancy Modal */}
      <Dialog open={showOccupancyModal} onOpenChange={setShowOccupancyModal}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Room Occupancy</DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {rooms.map((room) => {
                // Calculate occupancy percentage (mock data for demo)
                const occupiedBeds = Math.floor(
                  Math.random() * (room.capacity + 1),
                );
                const occupancyPercentage =
                  (occupiedBeds / room.capacity) * 100;

                // Determine color based on occupancy
                let occupancyColor = "bg-green-500";
                if (occupancyPercentage === 100) occupancyColor = "bg-red-500";
                else if (occupancyPercentage >= 75)
                  occupancyColor = "bg-orange-500";
                else if (occupancyPercentage >= 50)
                  occupancyColor = "bg-amber-500";
                else if (occupancyPercentage > 0)
                  occupancyColor = "bg-emerald-500";

                // Determine status color
                const statusColors: Record<string, string> = {
                  available: "bg-green-100 border-green-300 text-green-800",
                  occupied: "bg-red-100 border-red-300 text-red-800",
                  maintenance: "bg-amber-100 border-amber-300 text-amber-800",
                  reserved: "bg-blue-100 border-blue-300 text-blue-800",
                };

                return (
                  <div
                    key={room.id}
                    className={`border rounded-lg overflow-hidden ${statusColors[room.status]}`}
                  >
                    <div className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-semibold flex items-center">
                            <DoorClosed className="mr-2 h-4 w-4" />
                            Room {room.roomNumber}
                          </h3>
                          <p className="text-sm">{room.wardName}</p>
                        </div>
                        <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700">
                          {room.roomTypeName}
                        </span>
                      </div>

                      <div className="mt-4">
                        <div className="flex justify-between text-sm mb-1">
                          <span>Occupancy</span>
                          <span>
                            {occupiedBeds}/{room.capacity} beds
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div
                            className={`h-2.5 rounded-full ${occupancyColor}`}
                            style={{ width: `${occupancyPercentage}%` }}
                          ></div>
                        </div>
                      </div>

                      <div className="mt-4 flex justify-between items-center">
                        <span className="text-sm">{room.floor}</span>
                        <div className="flex items-center">
                          <BedDouble className="h-4 w-4 mr-1" />
                          <span className="text-sm font-medium">
                            {room.capacity}{" "}
                            {room.capacity === 1 ? "bed" : "beds"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RoomForm;
