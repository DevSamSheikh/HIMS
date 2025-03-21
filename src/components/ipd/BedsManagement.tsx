import React, { useState } from "react";
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
  DialogFooter,
} from "@/components/ui/dialog";
import { PlusCircle, Edit, Trash2 } from "lucide-react";

interface Bed {
  id: string;
  number: string;
  roomId: string;
  roomName: string;
  wardId: string;
  wardName: string;
  type: string;
  status: "available" | "occupied" | "maintenance" | "reserved";
  currentPatient?: string;
}

const BedsManagement = () => {
  const [beds, setBeds] = useState<Bed[]>([
    {
      id: "bed-001",
      number: "101-A",
      roomId: "room-001",
      roomName: "Room 101",
      wardId: "ward-001",
      wardName: "General Ward",
      type: "Standard",
      status: "available",
    },
    {
      id: "bed-002",
      number: "101-B",
      roomId: "room-001",
      roomName: "Room 101",
      wardId: "ward-001",
      wardName: "General Ward",
      type: "Standard",
      status: "occupied",
      currentPatient: "James Wilson",
    },
    {
      id: "bed-003",
      number: "201-A",
      roomId: "room-002",
      roomName: "Room 201",
      wardId: "ward-002",
      wardName: "Surgical Ward",
      type: "Electric",
      status: "maintenance",
    },
    {
      id: "bed-004",
      number: "201-B",
      roomId: "room-002",
      roomName: "Room 201",
      wardId: "ward-002",
      wardName: "Surgical Ward",
      type: "Electric",
      status: "reserved",
    },
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentBed, setCurrentBed] = useState<Bed | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const handleAddBed = () => {
    setCurrentBed(null);
    setIsDialogOpen(true);
  };

  const handleEditBed = (bed: Bed) => {
    setCurrentBed(bed);
    setIsDialogOpen(true);
  };

  const handleSaveBed = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Save bed logic would go here
    setIsDialogOpen(false);
  };

  const filteredBeds = beds.filter(
    (bed) =>
      bed.number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bed.roomName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bed.wardName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bed.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (bed.currentPatient &&
        bed.currentPatient.toLowerCase().includes(searchQuery.toLowerCase())),
  );

  const getStatusBadgeClass = (status: Bed["status"]) => {
    switch (status) {
      case "available":
        return "bg-green-100 text-green-800";
      case "occupied":
        return "bg-blue-100 text-blue-800";
      case "maintenance":
        return "bg-yellow-100 text-yellow-800";
      case "reserved":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Beds Management</CardTitle>
            <Button onClick={handleAddBed}>
              <PlusCircle className="mr-2 h-4 w-4" /> Add Bed
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Input
              placeholder="Search beds by number, room, ward, type, or patient..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-md"
            />
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Bed Number</TableHead>
                  <TableHead>Room</TableHead>
                  <TableHead>Ward</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Current Patient</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBeds.length > 0 ? (
                  filteredBeds.map((bed) => (
                    <TableRow key={bed.id}>
                      <TableCell className="font-medium">
                        {bed.number}
                      </TableCell>
                      <TableCell>{bed.roomName}</TableCell>
                      <TableCell>{bed.wardName}</TableCell>
                      <TableCell>{bed.type}</TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(
                            bed.status,
                          )}`}
                        >
                          {bed.status.charAt(0).toUpperCase() +
                            bed.status.slice(1)}
                        </span>
                      </TableCell>
                      <TableCell>{bed.currentPatient || "-"}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditBed(bed)}
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
                    <TableCell colSpan={7} className="text-center py-4">
                      No beds found
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
            <DialogTitle>{currentBed ? "Edit Bed" : "Add New Bed"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSaveBed} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="number">Bed Number</Label>
                <Input
                  id="number"
                  defaultValue={currentBed?.number || ""}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="room">Room</Label>
                <select
                  id="room"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  defaultValue={currentBed?.roomId || ""}
                  required
                >
                  <option value="">Select Room</option>
                  <option value="room-001">Room 101 (General Ward)</option>
                  <option value="room-002">Room 201 (Surgical Ward)</option>
                  <option value="room-003">Room 301 (Pediatric Ward)</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Bed Type</Label>
                <select
                  id="type"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  defaultValue={currentBed?.type || ""}
                  required
                >
                  <option value="">Select Type</option>
                  <option value="Standard">Standard</option>
                  <option value="Electric">Electric</option>
                  <option value="Adjustable">Adjustable</option>
                  <option value="ICU">ICU</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <select
                  id="status"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  defaultValue={currentBed?.status || "available"}
                  required
                >
                  <option value="available">Available</option>
                  <option value="occupied">Occupied</option>
                  <option value="maintenance">Maintenance</option>
                  <option value="reserved">Reserved</option>
                </select>
              </div>
              <div className="space-y-2 col-span-2">
                <Label htmlFor="patient">Current Patient (if occupied)</Label>
                <Input
                  id="patient"
                  defaultValue={currentBed?.currentPatient || ""}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">
                {currentBed ? "Update Bed" : "Add Bed"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BedsManagement;
