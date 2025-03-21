import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import DataTable from "@/components/ui/data-table";
import { PlusCircle, Building2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

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
        <Button>
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
    </div>
  );
};

export default WardForm;
