import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { DoorClosed, BedDouble, ArrowLeft, Search } from "lucide-react";

interface Room {
  id: string;
  roomNumber: string;
  wardName: string;
  roomTypeName: string;
  floor: string;
  capacity: number;
  occupiedBeds: number;
  status: "available" | "full" | "maintenance" | "reserved";
}

const RoomOccupancy = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedWard, setSelectedWard] = useState<string | null>(null);
  const [selectedFloor, setSelectedFloor] = useState<string | null>(null);

  // Mock data for rooms
  const rooms: Room[] = [
    {
      id: "room-1",
      roomNumber: "101",
      wardName: "General Ward",
      roomTypeName: "General",
      floor: "Ground Floor",
      capacity: 4,
      occupiedBeds: 2,
      status: "available",
    },
    {
      id: "room-2",
      roomNumber: "102",
      wardName: "General Ward",
      roomTypeName: "Semi-Private",
      floor: "Ground Floor",
      capacity: 2,
      occupiedBeds: 2,
      status: "full",
    },
    {
      id: "room-3",
      roomNumber: "201",
      wardName: "Pediatric Ward",
      roomTypeName: "Private",
      floor: "First Floor",
      capacity: 1,
      occupiedBeds: 0,
      status: "available",
    },
    {
      id: "room-4",
      roomNumber: "202",
      wardName: "Pediatric Ward",
      roomTypeName: "Private",
      floor: "First Floor",
      capacity: 1,
      occupiedBeds: 0,
      status: "reserved",
    },
    {
      id: "room-5",
      roomNumber: "301",
      wardName: "Surgical Ward",
      roomTypeName: "Deluxe",
      floor: "Second Floor",
      capacity: 1,
      occupiedBeds: 0,
      status: "maintenance",
    },
    {
      id: "room-6",
      roomNumber: "302",
      wardName: "Surgical Ward",
      roomTypeName: "Deluxe",
      floor: "Second Floor",
      capacity: 1,
      occupiedBeds: 1,
      status: "full",
    },
    {
      id: "room-7",
      roomNumber: "401",
      wardName: "ICU",
      roomTypeName: "ICU",
      floor: "Third Floor",
      capacity: 1,
      occupiedBeds: 0,
      status: "available",
    },
    {
      id: "room-8",
      roomNumber: "402",
      wardName: "ICU",
      roomTypeName: "Isolation",
      floor: "Third Floor",
      capacity: 1,
      occupiedBeds: 1,
      status: "full",
    },
  ];

  // Get unique wards and floors for filtering
  const wards = Array.from(new Set(rooms.map((room) => room.wardName)));
  const floors = Array.from(new Set(rooms.map((room) => room.floor)));

  // Filter rooms based on search query and filters
  const filteredRooms = rooms.filter((room) => {
    const matchesSearch =
      room.roomNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      room.wardName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      room.roomTypeName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesWard = selectedWard ? room.wardName === selectedWard : true;
    const matchesFloor = selectedFloor ? room.floor === selectedFloor : true;

    return matchesSearch && matchesWard && matchesFloor;
  });

  // Get status color
  const getStatusColor = (status: Room["status"]) => {
    switch (status) {
      case "available":
        return "bg-green-100 border-green-300 text-green-800";
      case "full":
        return "bg-red-100 border-red-300 text-red-800";
      case "maintenance":
        return "bg-amber-100 border-amber-300 text-amber-800";
      case "reserved":
        return "bg-blue-100 border-blue-300 text-blue-800";
      default:
        return "bg-gray-100 border-gray-300 text-gray-800";
    }
  };

  // Get occupancy percentage
  const getOccupancyPercentage = (room: Room) => {
    return (room.occupiedBeds / room.capacity) * 100;
  };

  // Get occupancy color
  const getOccupancyColor = (percentage: number) => {
    if (percentage === 0) return "bg-green-500";
    if (percentage < 50) return "bg-emerald-500";
    if (percentage < 75) return "bg-amber-500";
    if (percentage < 100) return "bg-orange-500";
    return "bg-red-500";
  };

  return (
    <div className="container mx-auto py-6 space-y-6 max-w-7xl">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Room Occupancy</h1>
          <p className="text-muted-foreground">
            View and manage room occupancy status
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

      <div className="flex flex-col md:flex-row gap-4">
        <Card className="w-full md:w-1/4">
          <CardHeader>
            <CardTitle className="text-lg">Filters</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Search</Label>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search rooms..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Ward</Label>
              <div className="flex flex-wrap gap-2">
                <Badge
                  variant={selectedWard === null ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => setSelectedWard(null)}
                >
                  All
                </Badge>
                {wards.map((ward) => (
                  <Badge
                    key={ward}
                    variant={selectedWard === ward ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => setSelectedWard(ward)}
                  >
                    {ward}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Floor</Label>
              <div className="flex flex-wrap gap-2">
                <Badge
                  variant={selectedFloor === null ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => setSelectedFloor(null)}
                >
                  All
                </Badge>
                {floors.map((floor) => (
                  <Badge
                    key={floor}
                    variant={selectedFloor === floor ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => setSelectedFloor(floor)}
                  >
                    {floor}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="space-y-2 pt-4">
              <h3 className="font-medium">Status Legend</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-green-500"></div>
                  <span className="text-sm">Available</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-amber-500"></div>
                  <span className="text-sm">Partially Occupied</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-red-500"></div>
                  <span className="text-sm">Full</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-blue-500"></div>
                  <span className="text-sm">Reserved</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-gray-500"></div>
                  <span className="text-sm">Maintenance</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="w-full md:w-3/4">
          <Tabs defaultValue="grid" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="grid">Grid View</TabsTrigger>
              <TabsTrigger value="list">List View</TabsTrigger>
            </TabsList>

            <TabsContent value="grid" className="w-full">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredRooms.map((room) => {
                  const occupancyPercentage = getOccupancyPercentage(room);
                  const occupancyColor = getOccupancyColor(occupancyPercentage);
                  const statusColor = getStatusColor(room.status);

                  return (
                    <div
                      key={room.id}
                      className={`border rounded-lg overflow-hidden ${statusColor}`}
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
                          <Badge variant="outline" className="font-medium">
                            {room.roomTypeName}
                          </Badge>
                        </div>

                        <div className="mt-4">
                          <div className="flex justify-between text-sm mb-1">
                            <span>Occupancy</span>
                            <span>
                              {room.occupiedBeds}/{room.capacity} beds
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
            </TabsContent>

            <TabsContent value="list">
              <Card>
                <CardContent className="p-0">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-3">Room</th>
                        <th className="text-left p-3">Ward</th>
                        <th className="text-left p-3">Type</th>
                        <th className="text-left p-3">Floor</th>
                        <th className="text-left p-3">Capacity</th>
                        <th className="text-left p-3">Occupancy</th>
                        <th className="text-left p-3">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredRooms.map((room) => {
                        const occupancyPercentage =
                          getOccupancyPercentage(room);
                        const occupancyColor =
                          getOccupancyColor(occupancyPercentage);

                        return (
                          <tr
                            key={room.id}
                            className="border-b hover:bg-muted/50"
                          >
                            <td className="p-3 font-medium">
                              {room.roomNumber}
                            </td>
                            <td className="p-3">{room.wardName}</td>
                            <td className="p-3">{room.roomTypeName}</td>
                            <td className="p-3">{room.floor}</td>
                            <td className="p-3">{room.capacity}</td>
                            <td className="p-3">
                              <div className="flex items-center gap-2">
                                <div className="w-full max-w-24 bg-gray-200 rounded-full h-2">
                                  <div
                                    className={`h-2 rounded-full ${occupancyColor}`}
                                    style={{ width: `${occupancyPercentage}%` }}
                                  ></div>
                                </div>
                                <span className="text-xs">
                                  {room.occupiedBeds}/{room.capacity}
                                </span>
                              </div>
                            </td>
                            <td className="p-3">
                              <Badge
                                variant="outline"
                                className={getStatusColor(room.status)}
                              >
                                {room.status.charAt(0).toUpperCase() +
                                  room.status.slice(1)}
                              </Badge>
                            </td>
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
      </div>
    </div>
  );
};

export default RoomOccupancy;
