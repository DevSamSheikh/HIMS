import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import SearchableSelect from "@/components/ui/searchable-select";
import { useToast } from "@/components/ui/use-toast";
import {
  BedDouble,
  Search,
  Filter,
  UserPlus,
  ClipboardList,
  Calendar,
  Clock,
  Building2,
  DoorClosed,
} from "lucide-react";

interface Ward {
  id: string;
  name: string;
  totalBeds: number;
  occupiedBeds: number;
}

interface Room {
  id: string;
  roomNumber: string;
  wardId: string;
  roomType: string;
  totalBeds: number;
  occupiedBeds: number;
  dailyRate: number;
}

interface Bed {
  id: string;
  bedNumber: string;
  roomId: string;
  roomNumber: string;
  wardId: string;
  wardName: string;
  bedType: string;
  status: "available" | "occupied" | "maintenance" | "reserved";
  currentPatientId?: string;
  currentPatientName?: string;
  admissionDate?: string;
  expectedDischargeDate?: string;
}

const BedAllocation = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("wards");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedWard, setSelectedWard] = useState<string | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);

  // Mock data for wards
  const wards: Ward[] = [
    { id: "ward-1", name: "General Ward", totalBeds: 40, occupiedBeds: 32 },
    { id: "ward-2", name: "Pediatric Ward", totalBeds: 20, occupiedBeds: 12 },
    { id: "ward-3", name: "Surgical Ward", totalBeds: 30, occupiedBeds: 28 },
    { id: "ward-4", name: "ICU", totalBeds: 10, occupiedBeds: 9 },
    { id: "ward-5", name: "Maternity Ward", totalBeds: 15, occupiedBeds: 8 },
  ];

  // Mock data for rooms
  const rooms: Room[] = [
    {
      id: "room-1",
      roomNumber: "101",
      wardId: "ward-1",
      roomType: "General",
      totalBeds: 4,
      occupiedBeds: 3,
      dailyRate: 1000,
    },
    {
      id: "room-2",
      roomNumber: "102",
      wardId: "ward-1",
      roomType: "Semi-Private",
      totalBeds: 2,
      occupiedBeds: 1,
      dailyRate: 2000,
    },
    {
      id: "room-3",
      roomNumber: "103",
      wardId: "ward-1",
      roomType: "Private",
      totalBeds: 1,
      occupiedBeds: 1,
      dailyRate: 3000,
    },
    {
      id: "room-4",
      roomNumber: "201",
      wardId: "ward-2",
      roomType: "Pediatric",
      totalBeds: 4,
      occupiedBeds: 2,
      dailyRate: 1500,
    },
    {
      id: "room-5",
      roomNumber: "301",
      wardId: "ward-3",
      roomType: "Surgical",
      totalBeds: 4,
      occupiedBeds: 4,
      dailyRate: 2000,
    },
    {
      id: "room-6",
      roomNumber: "401",
      wardId: "ward-4",
      roomType: "ICU",
      totalBeds: 1,
      occupiedBeds: 1,
      dailyRate: 8000,
    },
    {
      id: "room-7",
      roomNumber: "501",
      wardId: "ward-5",
      roomType: "Maternity",
      totalBeds: 2,
      occupiedBeds: 1,
      dailyRate: 2500,
    },
  ];

  // Mock data for beds
  const beds: Bed[] = [
    {
      id: "bed-1",
      bedNumber: "101-A",
      roomId: "room-1",
      roomNumber: "101",
      wardId: "ward-1",
      wardName: "General Ward",
      bedType: "Standard",
      status: "occupied",
      currentPatientId: "P-1001",
      currentPatientName: "John Smith",
      admissionDate: "2023-06-10",
      expectedDischargeDate: "2023-06-17",
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
      currentPatientId: "P-1002",
      currentPatientName: "Emily Johnson",
      admissionDate: "2023-06-12",
      expectedDischargeDate: "2023-06-19",
    },
    {
      id: "bed-3",
      bedNumber: "101-C",
      roomId: "room-1",
      roomNumber: "101",
      wardId: "ward-1",
      wardName: "General Ward",
      bedType: "Standard",
      status: "occupied",
      currentPatientId: "P-1003",
      currentPatientName: "Michael Brown",
      admissionDate: "2023-06-14",
      expectedDischargeDate: "2023-06-21",
    },
    {
      id: "bed-4",
      bedNumber: "101-D",
      roomId: "room-1",
      roomNumber: "101",
      wardId: "ward-1",
      wardName: "General Ward",
      bedType: "Standard",
      status: "available",
    },
    {
      id: "bed-5",
      bedNumber: "102-A",
      roomId: "room-2",
      roomNumber: "102",
      wardId: "ward-1",
      wardName: "General Ward",
      bedType: "Semi-Private",
      status: "occupied",
      currentPatientId: "P-1004",
      currentPatientName: "Sarah Davis",
      admissionDate: "2023-06-11",
      expectedDischargeDate: "2023-06-18",
    },
    {
      id: "bed-6",
      bedNumber: "102-B",
      roomId: "room-2",
      roomNumber: "102",
      wardId: "ward-1",
      wardName: "General Ward",
      bedType: "Semi-Private",
      status: "available",
    },
    {
      id: "bed-7",
      bedNumber: "103-A",
      roomId: "room-3",
      roomNumber: "103",
      wardId: "ward-1",
      wardName: "General Ward",
      bedType: "Private",
      status: "occupied",
      currentPatientId: "P-1005",
      currentPatientName: "David Miller",
      admissionDate: "2023-06-13",
      expectedDischargeDate: "2023-06-20",
    },
  ];

  // Filter rooms based on selected ward
  const filteredRooms = rooms.filter((room) => {
    if (selectedWard) {
      return room.wardId === selectedWard;
    }
    return true;
  });

  // Filter beds based on selected ward and room
  const filteredBeds = beds
    .filter((bed) => {
      if (selectedWard && selectedRoom) {
        return bed.wardId === selectedWard && bed.roomId === selectedRoom;
      } else if (selectedWard) {
        return bed.wardId === selectedWard;
      } else if (selectedRoom) {
        return bed.roomId === selectedRoom;
      }
      return true;
    })
    .filter((bed) => {
      if (searchQuery) {
        return (
          bed.bedNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
          bed.wardName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          bed.roomNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (bed.currentPatientName &&
            bed.currentPatientName
              .toLowerCase()
              .includes(searchQuery.toLowerCase())) ||
          (bed.currentPatientId &&
            bed.currentPatientId
              .toLowerCase()
              .includes(searchQuery.toLowerCase()))
        );
      }
      return true;
    });

  const getOccupancyStatusColor = (occupiedBeds: number, totalBeds: number) => {
    const occupancyRate = (occupiedBeds / totalBeds) * 100;
    if (occupancyRate >= 90) return "text-red-500";
    if (occupancyRate >= 70) return "text-amber-500";
    if (occupancyRate >= 50) return "text-yellow-500";
    return "text-green-500";
  };

  const getOccupancyPercentage = (occupiedBeds: number, totalBeds: number) => {
    return (occupiedBeds / totalBeds) * 100;
  };

  const getStatusBadgeVariant = (status: Bed["status"]) => {
    switch (status) {
      case "available":
        return "outline";
      case "occupied":
        return "destructive";
      case "maintenance":
        return "secondary";
      case "reserved":
        return "default";
      default:
        return "outline";
    }
  };

  const handleAllocateBed = (bedId: string) => {
    toast({
      title: "Bed Allocation",
      description: "Redirecting to patient admission form...",
    });
    // In a real application, this would navigate to the patient admission form
    console.log("Allocate bed", bedId);
  };

  return (
    <div className="container mx-auto py-6 space-y-6 max-w-7xl">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Bed Allocation</h1>
          <p className="text-muted-foreground">
            View and manage bed occupancy across wards and rooms
          </p>
        </div>
        <Button>
          <UserPlus className="mr-2 h-4 w-4" />
          New Admission
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Beds</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{beds.length}</div>
            <p className="text-xs text-muted-foreground">Across all wards</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Occupied Beds</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {beds.filter((bed) => bed.status === "occupied").length}
            </div>
            <p className="text-xs text-muted-foreground">
              {Math.round(
                (beds.filter((bed) => bed.status === "occupied").length /
                  beds.length) *
                  100,
              )}
              % occupancy rate
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Available Beds
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {beds.filter((bed) => bed.status === "available").length}
            </div>
            <p className="text-xs text-muted-foreground">
              {Math.round(
                (beds.filter((bed) => bed.status === "available").length /
                  beds.length) *
                  100,
              )}
              % availability
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Reserved/Maintenance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {
                beds.filter(
                  (bed) =>
                    bed.status === "reserved" || bed.status === "maintenance",
                ).length
              }
            </div>
            <p className="text-xs text-muted-foreground">
              {beds.filter((bed) => bed.status === "reserved").length} reserved,{" "}
              {beds.filter((bed) => bed.status === "maintenance").length}{" "}
              maintenance
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search by bed number, patient name, ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <SearchableSelect
              label=""
              options={wards.map((ward) => ({ id: ward.id, name: ward.name }))}
              value={selectedWard || ""}
              onValueChange={(value) => {
                setSelectedWard(value || null);
                setSelectedRoom(null); // Reset room selection when ward changes
              }}
              placeholder="All Wards"
              className="w-40"
            />
            <SearchableSelect
              label=""
              options={filteredRooms.map((room) => ({
                id: room.id,
                name: room.roomNumber,
              }))}
              value={selectedRoom || ""}
              onValueChange={(value) => setSelectedRoom(value || null)}
              placeholder="All Rooms"
              className="w-40"
              disabled={!selectedWard}
            />
          </div>
        </div>

        <Tabs
          defaultValue="wards"
          value={activeTab}
          onValueChange={setActiveTab}
        >
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="wards">
              <Building2 className="mr-2 h-4 w-4" />
              Wards View
            </TabsTrigger>
            <TabsTrigger value="rooms">
              <DoorClosed className="mr-2 h-4 w-4" />
              Rooms View
            </TabsTrigger>
            <TabsTrigger value="beds">
              <BedDouble className="mr-2 h-4 w-4" />
              Beds View
            </TabsTrigger>
          </TabsList>

          <TabsContent value="wards" className="mt-4">
            <div className="grid grid-cols-1 gap-4">
              {wards.map((ward) => (
                <Card
                  key={ward.id}
                  className="bg-white dark:bg-gray-800 hover:shadow-md transition-shadow"
                >
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-semibold">{ward.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {ward.totalBeds} total beds
                          </p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedWard(ward.id)}
                        >
                          View Details
                        </Button>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">Occupancy</span>
                          <span
                            className={`font-medium ${getOccupancyStatusColor(ward.occupiedBeds, ward.totalBeds)}`}
                          >
                            {ward.occupiedBeds}/{ward.totalBeds} beds
                          </span>
                        </div>
                        <Progress
                          value={getOccupancyPercentage(
                            ward.occupiedBeds,
                            ward.totalBeds,
                          )}
                          className="h-2"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="rooms" className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredRooms.map((room) => (
                <Card
                  key={room.id}
                  className="bg-white dark:bg-gray-800 hover:shadow-md transition-shadow"
                >
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-semibold">
                            Room {room.roomNumber}
                          </h3>
                          <div className="flex items-center space-x-2">
                            <Badge variant="outline">{room.roomType}</Badge>
                            <span className="text-sm text-muted-foreground">
                              ₹{room.dailyRate}/day
                            </span>
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedWard(room.wardId);
                            setSelectedRoom(room.id);
                            setActiveTab("beds");
                          }}
                        >
                          View Beds
                        </Button>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">Occupancy</span>
                          <span
                            className={`font-medium ${getOccupancyStatusColor(room.occupiedBeds, room.totalBeds)}`}
                          >
                            {room.occupiedBeds}/{room.totalBeds} beds
                          </span>
                        </div>
                        <Progress
                          value={getOccupancyPercentage(
                            room.occupiedBeds,
                            room.totalBeds,
                          )}
                          className="h-2"
                        />
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {wards.find((w) => w.id === room.wardId)?.name}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="beds" className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredBeds.map((bed) => (
                <Card
                  key={bed.id}
                  className="bg-white dark:bg-gray-800 hover:shadow-md transition-shadow"
                >
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-semibold">
                            Bed {bed.bedNumber}
                          </h3>
                          <div className="flex items-center space-x-2">
                            <Badge variant="outline">{bed.bedType}</Badge>
                            <Badge
                              variant={getStatusBadgeVariant(bed.status)}
                              className="capitalize"
                            >
                              {bed.status}
                            </Badge>
                          </div>
                        </div>
                        {bed.status === "available" && (
                          <Button
                            size="sm"
                            onClick={() => handleAllocateBed(bed.id)}
                          >
                            Allocate
                          </Button>
                        )}
                      </div>

                      <div className="text-sm">
                        <div className="font-medium">Location</div>
                        <div className="text-muted-foreground">
                          {bed.wardName}, Room {bed.roomNumber}
                        </div>
                      </div>

                      {bed.status === "occupied" && bed.currentPatientName && (
                        <div className="space-y-2">
                          <div className="text-sm">
                            <div className="font-medium">Current Patient</div>
                            <div className="text-blue-600 dark:text-blue-400">
                              {bed.currentPatientName} ({bed.currentPatientId})
                            </div>
                          </div>

                          {bed.admissionDate && bed.expectedDischargeDate && (
                            <div className="flex flex-col space-y-1 text-xs text-muted-foreground">
                              <div className="flex items-center">
                                <Calendar className="h-3 w-3 mr-1" />
                                Admitted:{" "}
                                {new Date(
                                  bed.admissionDate,
                                ).toLocaleDateString()}
                              </div>
                              <div className="flex items-center">
                                <Clock className="h-3 w-3 mr-1" />
                                Expected Discharge:{" "}
                                {new Date(
                                  bed.expectedDischargeDate,
                                ).toLocaleDateString()}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default BedAllocation;
