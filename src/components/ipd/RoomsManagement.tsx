import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { PlusCircle, Edit, Trash2, ArrowRight, BedDouble } from "lucide-react";

interface RoomType {
  id: string;
  name: string;
  baseRate: number;
  amenities: string[];
}

interface Room {
  id: string;
  name: string;
  wardId: string;
  wardName: string;
  roomTypeId: string;
  roomTypeName: string;
  capacity: number;
  floor: string;
  status: "active" | "maintenance" | "inactive";
  dailyRate: number;
  amenities: string[];
}

const RoomsManagement = () => {
  // Mock data for room types - this would come from an API in a real app
  const roomTypes: RoomType[] = [
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
      id: "room-001",
      name: "Room 101",
      wardId: "ward-001",
      wardName: "General Ward",
      roomTypeId: "type-1",
      roomTypeName: "General",
      capacity: 4,
      floor: "1st Floor",
      status: "active",
      dailyRate: 1000,
      amenities: ["TV", "AC"],
    },
    {
      id: "room-002",
      name: "Room 201",
      wardId: "ward-002",
      wardName: "Surgical Ward",
      roomTypeId: "type-3",
      roomTypeName: "Private",
      capacity: 2,
      floor: "2nd Floor",
      status: "active",
      dailyRate: 3500,
      amenities: ["TV", "AC", "Refrigerator", "Sofa"],
    },
    {
      id: "room-003",
      name: "Room 301",
      wardId: "ward-003",
      wardName: "Pediatric Ward",
      roomTypeId: "type-1",
      roomTypeName: "General",
      capacity: 6,
      floor: "3rd Floor",
      status: "maintenance",
      dailyRate: 1000,
      amenities: ["TV", "AC"],
    },
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentRoom, setCurrentRoom] = useState<Room | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRoomType, setSelectedRoomType] = useState<string>("");

  // Update room rate when room type changes
  useEffect(() => {
    if (currentRoom && selectedRoomType) {
      const roomType = roomTypes.find((rt) => rt.id === selectedRoomType);
      if (roomType) {
        setCurrentRoom({
          ...currentRoom,
          roomTypeId: roomType.id,
          roomTypeName: roomType.name,
          dailyRate: roomType.baseRate,
          amenities: roomType.amenities,
        });
      }
    }
  }, [selectedRoomType]);

  const handleAddRoom = () => {
    setCurrentRoom(null);
    setSelectedRoomType("");
    setIsDialogOpen(true);
  };

  const handleEditRoom = (room: Room) => {
    setCurrentRoom(room);
    setSelectedRoomType(room.roomTypeId);
    setIsDialogOpen(true);
  };

  const handleSaveRoom = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    if (currentRoom) {
      // Edit existing room
      const updatedRooms = rooms.map((room) => {
        if (room.id === currentRoom.id) {
          const wardId = formData.get("ward") as string;
          const wardOption = document.querySelector(
            `option[value="${wardId}"]`,
          ) as HTMLOptionElement;
          const wardName = wardOption ? wardOption.textContent || "" : "";

          return {
            ...currentRoom,
            name: formData.get("name") as string,
            wardId,
            wardName,
            floor: formData.get("floor") as string,
            capacity: parseInt(formData.get("capacity") as string),
            status: formData.get("status") as
              | "active"
              | "maintenance"
              | "inactive",
          };
        }
        return room;
      });
      setRooms(updatedRooms);
    } else {
      // Add new room
      const wardId = formData.get("ward") as string;
      const wardOption = document.querySelector(
        `option[value="${wardId}"]`,
      ) as HTMLOptionElement;
      const wardName = wardOption ? wardOption.textContent || "" : "";

      const roomType = roomTypes.find((rt) => rt.id === selectedRoomType);

      if (roomType) {
        const newRoom: Room = {
          id: `room-${Date.now()}`,
          name: formData.get("name") as string,
          wardId,
          wardName,
          roomTypeId: roomType.id,
          roomTypeName: roomType.name,
          capacity: parseInt(formData.get("capacity") as string),
          floor: formData.get("floor") as string,
          status: formData.get("status") as
            | "active"
            | "maintenance"
            | "inactive",
          dailyRate: roomType.baseRate,
          amenities: roomType.amenities,
        };

        setRooms([...rooms, newRoom]);
      }
    }

    setIsDialogOpen(false);
  };

  const filteredRooms = rooms.filter(
    (room) =>
      room.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      room.wardName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      room.roomTypeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      room.floor.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Rooms Management</CardTitle>
            <div className="flex gap-2">
              <Button variant="outline">
                <BedDouble className="mr-2 h-4 w-4" />
                Manage Room Types
              </Button>
              <Button onClick={handleAddRoom}>
                <PlusCircle className="mr-2 h-4 w-4" /> Add Room
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Input
              placeholder="Search rooms by name, ward, type, or floor..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-md"
            />
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Room Name</TableHead>
                  <TableHead>Ward</TableHead>
                  <TableHead>Floor</TableHead>
                  <TableHead>Room Type</TableHead>
                  <TableHead>Daily Rate</TableHead>
                  <TableHead>Capacity</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRooms.length > 0 ? (
                  filteredRooms.map((room) => (
                    <TableRow key={room.id}>
                      <TableCell className="font-medium">{room.name}</TableCell>
                      <TableCell>{room.wardName}</TableCell>
                      <TableCell>{room.floor}</TableCell>
                      <TableCell>{room.roomTypeName}</TableCell>
                      <TableCell>₹{room.dailyRate.toLocaleString()}</TableCell>
                      <TableCell>{room.capacity} beds</TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            room.status === "active"
                              ? "bg-green-100 text-green-800"
                              : room.status === "maintenance"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {room.status.charAt(0).toUpperCase() +
                            room.status.slice(1)}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditRoom(room)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-4">
                      No rooms found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>
              {currentRoom ? "Edit Room" : "Add New Room"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSaveRoom} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Room Name</Label>
                <Input
                  id="name"
                  name="name"
                  defaultValue={currentRoom?.name || ""}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ward">Ward</Label>
                <select
                  id="ward"
                  name="ward"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  defaultValue={currentRoom?.wardId || ""}
                  required
                >
                  <option value="">Select Ward</option>
                  <option value="ward-001">General Ward</option>
                  <option value="ward-002">Surgical Ward</option>
                  <option value="ward-003">Pediatric Ward</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="floor">Floor</Label>
                <Input
                  id="floor"
                  name="floor"
                  defaultValue={currentRoom?.floor || ""}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="roomType">Room Type</Label>
                <select
                  id="roomType"
                  name="roomType"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={selectedRoomType}
                  onChange={(e) => setSelectedRoomType(e.target.value)}
                  required
                >
                  <option value="">Select Room Type</option>
                  {roomTypes.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.name} - ₹{type.baseRate}/day
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="capacity">Capacity (Beds)</Label>
                <Input
                  id="capacity"
                  name="capacity"
                  type="number"
                  min="1"
                  defaultValue={currentRoom?.capacity || 1}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <select
                  id="status"
                  name="status"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  defaultValue={currentRoom?.status || "active"}
                  required
                >
                  <option value="active">Active</option>
                  <option value="maintenance">Maintenance</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>

            {selectedRoomType && (
              <div className="mt-4 p-3 bg-muted rounded-md">
                <h4 className="font-medium mb-2">Room Type Details</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="font-medium">Daily Rate:</span> ₹
                    {roomTypes
                      .find((rt) => rt.id === selectedRoomType)
                      ?.baseRate.toLocaleString() || 0}
                  </div>
                  <div>
                    <span className="font-medium">Amenities:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {roomTypes
                        .find((rt) => rt.id === selectedRoomType)
                        ?.amenities.map((amenity, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10 dark:bg-blue-900/30 dark:text-blue-400"
                          >
                            {amenity}
                          </span>
                        ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            <DialogFooter>
              <Button type="submit">
                {currentRoom ? "Update Room" : "Add Room"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RoomsManagement;
