import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import DataTable from "@/components/ui/data-table";
import { PlusCircle, Building2, Users, Search } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Ward {
  id: string;
  name: string;
  code: string;
  description: string;
  capacity: number;
  floor: string;
  department: string;
  status: "active" | "inactive" | "maintenance";
}

const WardForm = () => {
  const { toast } = useToast();
  const [showOccupancyModal, setShowOccupancyModal] = useState(false);
  const [wards, setWards] = useState<Ward[]>([
    {
      id: "ward-1",
      name: "General Ward",
      code: "GW",
      description: "General ward for regular patients",
      capacity: 20,
      floor: "Ground Floor",
      department: "General Medicine",
      status: "active",
    },
    {
      id: "ward-2",
      name: "Pediatric Ward",
      code: "PW",
      description: "Ward for children and infants",
      capacity: 15,
      floor: "First Floor",
      department: "Pediatrics",
      status: "active",
    },
    {
      id: "ward-3",
      name: "Surgical Ward",
      code: "SW",
      description: "Ward for post-surgical recovery",
      capacity: 25,
      floor: "Second Floor",
      department: "Surgery",
      status: "active",
    },
    {
      id: "ward-4",
      name: "ICU",
      code: "ICU",
      description: "Intensive Care Unit",
      capacity: 10,
      floor: "Third Floor",
      department: "Critical Care",
      status: "active",
    },
    {
      id: "ward-5",
      name: "Maternity Ward",
      code: "MW",
      description: "Ward for pregnant women and new mothers",
      capacity: 15,
      floor: "First Floor",
      department: "Obstetrics & Gynecology",
      status: "active",
    },
  ]);

  const columns = [
    {
      header: "Ward Name",
      accessorKey: "name" as keyof Ward,
      cellType: "text" as const,
      required: true,
    },
    {
      header: "Code",
      accessorKey: "code" as keyof Ward,
      cellType: "text" as const,
      required: true,
    },
    {
      header: "Department",
      accessorKey: "department" as keyof Ward,
      cellType: "text" as const,
      required: true,
    },
    {
      header: "Floor",
      accessorKey: "floor" as keyof Ward,
      cellType: "text" as const,
      required: true,
    },
    {
      header: "Capacity",
      accessorKey: "capacity" as keyof Ward,
      cellType: "number" as const,
      required: true,
    },
    {
      header: "Status",
      accessorKey: "status" as keyof Ward,
      cellType: "text" as const,
      required: true,
      cell: (item: Ward) => {
        const statusColors = {
          active:
            "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
          inactive:
            "bg-gray-100 text-gray-800 dark:bg-gray-800/30 dark:text-gray-400",
          maintenance:
            "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
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
      header: "Description",
      accessorKey: "description" as keyof Ward,
      cellType: "text" as const,
    },
  ];

  const handleSave = (updatedWards: Ward[]) => {
    setWards(updatedWards);
    toast({
      title: "Success",
      description: "Wards updated successfully",
    });
  };

  return (
    <div className="container mx-auto py-6 space-y-6 max-w-7xl">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Ward Management</h1>
          <p className="text-muted-foreground">
            Define and manage hospital wards and their capacities
          </p>
        </div>
        <Button onClick={() => setShowOccupancyModal(true)}>
          <Building2 className="mr-2 h-4 w-4" />
          View Ward Occupancy
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <PlusCircle className="mr-2 h-5 w-5" />
            Wards
          </CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            data={wards}
            columns={columns}
            onSave={handleSave}
            isSearchable={true}
            isSortable={true}
            addButtonText="Add Ward"
          />
        </CardContent>
      </Card>

      {/* Ward Occupancy Modal */}
      <Dialog open={showOccupancyModal} onOpenChange={setShowOccupancyModal}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Ward Occupancy</DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            <Tabs defaultValue="grid" className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger value="grid">Grid View</TabsTrigger>
                <TabsTrigger value="list">List View</TabsTrigger>
              </TabsList>

              <TabsContent value="grid" className="w-full">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {wards.map((ward) => {
                    // Mock data for occupancy
                    const totalBeds = ward.capacity;
                    const occupiedBeds = Math.floor(
                      Math.random() * (totalBeds + 1),
                    );
                    const occupancyPercentage =
                      (occupiedBeds / totalBeds) * 100;

                    // Determine color based on occupancy
                    let occupancyColor = "bg-green-500";
                    if (occupancyPercentage === 100)
                      occupancyColor = "bg-red-500";
                    else if (occupancyPercentage >= 75)
                      occupancyColor = "bg-orange-500";
                    else if (occupancyPercentage >= 50)
                      occupancyColor = "bg-amber-500";
                    else if (occupancyPercentage > 0)
                      occupancyColor = "bg-emerald-500";

                    // Determine status color
                    const statusColors: Record<string, string> = {
                      active: "bg-green-100 border-green-300 text-green-800",
                      inactive: "bg-gray-100 border-gray-300 text-gray-800",
                      maintenance:
                        "bg-amber-100 border-amber-300 text-amber-800",
                    };

                    return (
                      <div
                        key={ward.id}
                        className={`border rounded-lg overflow-hidden ${statusColors[ward.status]}`}
                      >
                        <div className="p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="text-lg font-semibold flex items-center">
                                <Building2 className="mr-2 h-4 w-4" />
                                {ward.name}
                              </h3>
                              <p className="text-sm">{ward.department}</p>
                            </div>
                            <Badge
                              variant="outline"
                              className={statusColors[ward.status]}
                            >
                              {ward.status.charAt(0).toUpperCase() +
                                ward.status.slice(1)}
                            </Badge>
                          </div>

                          <div className="mt-4">
                            <div className="flex justify-between text-sm mb-1">
                              <span>Occupancy</span>
                              <span>
                                {occupiedBeds}/{totalBeds} beds
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
                            <span className="text-sm">{ward.floor}</span>
                            <div className="flex items-center">
                              <Users className="h-4 w-4 mr-1" />
                              <span className="text-sm font-medium">
                                {ward.capacity} beds
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
                          <th className="text-left p-3">Ward Name</th>
                          <th className="text-left p-3">Department</th>
                          <th className="text-left p-3">Floor</th>
                          <th className="text-left p-3">Capacity</th>
                          <th className="text-left p-3">Occupancy</th>
                          <th className="text-left p-3">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {wards.map((ward) => {
                          // Mock data for occupancy
                          const totalBeds = ward.capacity;
                          const occupiedBeds = Math.floor(
                            Math.random() * (totalBeds + 1),
                          );
                          const occupancyPercentage =
                            (occupiedBeds / totalBeds) * 100;

                          // Determine color based on occupancy
                          let occupancyColor = "bg-green-500";
                          if (occupancyPercentage === 100)
                            occupancyColor = "bg-red-500";
                          else if (occupancyPercentage >= 75)
                            occupancyColor = "bg-orange-500";
                          else if (occupancyPercentage >= 50)
                            occupancyColor = "bg-amber-500";
                          else if (occupancyPercentage > 0)
                            occupancyColor = "bg-emerald-500";

                          return (
                            <tr
                              key={ward.id}
                              className="border-b hover:bg-muted/50"
                            >
                              <td className="p-3 font-medium">{ward.name}</td>
                              <td className="p-3">{ward.department}</td>
                              <td className="p-3">{ward.floor}</td>
                              <td className="p-3">{ward.capacity}</td>
                              <td className="p-3">
                                <div className="flex items-center gap-2">
                                  <div className="w-full max-w-24 bg-gray-200 rounded-full h-2">
                                    <div
                                      className={`h-2 rounded-full ${occupancyColor}`}
                                      style={{
                                        width: `${occupancyPercentage}%`,
                                      }}
                                    ></div>
                                  </div>
                                  <span className="text-xs">
                                    {occupiedBeds}/{totalBeds}
                                  </span>
                                </div>
                              </td>
                              <td className="p-3">
                                <Badge
                                  variant="outline"
                                  className={
                                    ward.status === "active"
                                      ? "bg-green-100 text-green-800"
                                      : ward.status === "maintenance"
                                        ? "bg-amber-100 text-amber-800"
                                        : "bg-gray-100 text-gray-800"
                                  }
                                >
                                  {ward.status.charAt(0).toUpperCase() +
                                    ward.status.slice(1)}
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
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default WardForm;
