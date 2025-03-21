import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import DataTable from "@/components/ui/data-table";
import { PlusCircle, Stethoscope } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import SearchableSelect from "@/components/ui/searchable-select";

interface Service {
  id: string;
  name: string;
  code: string;
  category: string;
  description: string;
  rate: number;
  chargeType: "fixed" | "hourly" | "daily" | "per_visit";
  taxable: boolean;
  status: "active" | "inactive";
}

const ServiceForm = () => {
  const { toast } = useToast();

  // Mock data for service categories
  const serviceCategories = [
    { id: "diagnostic", name: "Diagnostic" },
    { id: "therapeutic", name: "Therapeutic" },
    { id: "surgical", name: "Surgical" },
    { id: "consultation", name: "Consultation" },
    { id: "nursing", name: "Nursing" },
    { id: "laboratory", name: "Laboratory" },
    { id: "radiology", name: "Radiology" },
    { id: "pharmacy", name: "Pharmacy" },
    { id: "physiotherapy", name: "Physiotherapy" },
    { id: "ambulance", name: "Ambulance" },
  ];

  // Mock data for charge types
  const chargeTypes = [
    { id: "fixed", name: "Fixed" },
    { id: "hourly", name: "Hourly" },
    { id: "daily", name: "Daily" },
    { id: "per_visit", name: "Per Visit" },
  ];

  const [services, setServices] = useState<Service[]>([
    {
      id: "service-1",
      name: "Doctor Consultation",
      code: "CONS-001",
      category: "Consultation",
      description: "Consultation with specialist doctor",
      rate: 1000,
      chargeType: "per_visit",
      taxable: true,
      status: "active",
    },
    {
      id: "service-2",
      name: "Blood Test - Complete Blood Count",
      code: "LAB-001",
      category: "Laboratory",
      description: "Complete blood count analysis",
      rate: 500,
      chargeType: "fixed",
      taxable: true,
      status: "active",
    },
    {
      id: "service-3",
      name: "X-Ray - Chest",
      code: "RAD-001",
      category: "Radiology",
      description: "Chest X-Ray",
      rate: 1200,
      chargeType: "fixed",
      taxable: true,
      status: "active",
    },
    {
      id: "service-4",
      name: "Nursing Care",
      code: "NUR-001",
      category: "Nursing",
      description: "Regular nursing care",
      rate: 800,
      chargeType: "daily",
      taxable: true,
      status: "active",
    },
    {
      id: "service-5",
      name: "Oxygen Therapy",
      code: "THER-001",
      category: "Therapeutic",
      description: "Oxygen therapy for respiratory support",
      rate: 300,
      chargeType: "hourly",
      taxable: true,
      status: "active",
    },
    {
      id: "service-6",
      name: "Physiotherapy Session",
      code: "PHY-001",
      category: "Physiotherapy",
      description: "Physiotherapy session with specialist",
      rate: 800,
      chargeType: "per_visit",
      taxable: true,
      status: "active",
    },
    {
      id: "service-7",
      name: "Ambulance Service",
      code: "AMB-001",
      category: "Ambulance",
      description: "Emergency ambulance service",
      rate: 1500,
      chargeType: "fixed",
      taxable: false,
      status: "active",
    },
  ]);

  const columns = [
    {
      header: "Service Name",
      accessorKey: "name" as keyof Service,
      cellType: "text" as const,
      required: true,
    },
    {
      header: "Code",
      accessorKey: "code" as keyof Service,
      cellType: "text" as const,
      required: true,
    },
    {
      header: "Category",
      accessorKey: "category" as keyof Service,
      cellType: "dropdown" as const,
      required: true,
      cell: (item: Service) => {
        return (
          <SearchableSelect
            label=""
            options={serviceCategories}
            value={
              serviceCategories.find((sc) => sc.name === item.category)?.id ||
              ""
            }
            onValueChange={(value) => {
              // This would be handled by the DataTable component
              console.log("Category changed to", value);
            }}
            placeholder="Select Category"
            showSelectedLabel={true}
          />
        );
      },
    },
    {
      header: "Rate (₹)",
      accessorKey: "rate" as keyof Service,
      cellType: "number" as const,
      required: true,
      cell: (item: Service) => {
        return <span>₹{item.rate.toLocaleString()}</span>;
      },
    },
    {
      header: "Charge Type",
      accessorKey: "chargeType" as keyof Service,
      cellType: "dropdown" as const,
      required: true,
      cell: (item: Service) => {
        return (
          <SearchableSelect
            label=""
            options={chargeTypes}
            value={item.chargeType}
            onValueChange={(value) => {
              // This would be handled by the DataTable component
              console.log("Charge type changed to", value);
            }}
            placeholder="Select Charge Type"
            showSelectedLabel={true}
          />
        );
      },
    },
    {
      header: "Taxable",
      accessorKey: "taxable" as keyof Service,
      cellType: "checkbox" as const,
      required: true,
    },
    {
      header: "Status",
      accessorKey: "status" as keyof Service,
      cellType: "text" as const,
      required: true,
      cell: (item: Service) => {
        const statusColors = {
          active:
            "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
          inactive:
            "bg-gray-100 text-gray-800 dark:bg-gray-800/30 dark:text-gray-400",
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
      accessorKey: "description" as keyof Service,
      cellType: "text" as const,
    },
  ];

  const handleSave = (updatedServices: Service[]) => {
    setServices(updatedServices);
    toast({
      title: "Success",
      description: "Services updated successfully",
    });
  };

  return (
    <div className="container mx-auto py-6 space-y-6 max-w-7xl">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Service Management
          </h1>
          <p className="text-muted-foreground">
            Define and manage hospital services and their rates
          </p>
        </div>
        <Button>
          <Stethoscope className="mr-2 h-4 w-4" />
          View Service Usage
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <PlusCircle className="mr-2 h-5 w-5" />
            Services
          </CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            data={services}
            columns={columns}
            onSave={handleSave}
            isSearchable={true}
            isSortable={true}
            addButtonText="Add Service"
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default ServiceForm;
