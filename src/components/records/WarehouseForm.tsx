import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import WarehouseTable, { Warehouse } from "./WarehouseTable";
import { toast } from "@/components/ui/use-toast";

const WarehouseForm = () => {
  const [warehouses, setWarehouses] = useState<Warehouse[]>([
    {
      id: "wh-1",
      name: "Main Storage",
    },
    {
      id: "wh-2",
      name: "Emergency Stock",
    },
    {
      id: "wh-3",
      name: "Pharmacy Store",
    },
    {
      id: "wh-4",
      name: "Cold Storage",
    },
    {
      id: "wh-5",
      name: "Controlled Substances",
    },
  ]);

  const [isLoading, setIsLoading] = useState(false);

  const handleSaveWarehouses = (updatedWarehouses: Warehouse[]) => {
    // Simulate API call
    setIsLoading(true);
    setTimeout(() => {
      setWarehouses(updatedWarehouses);
      setIsLoading(false);
      toast({
        title: "Warehouses Updated",
        description: "Warehouse list has been updated successfully",
      });
    }, 500);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Warehouse Management</CardTitle>
      </CardHeader>
      <CardContent>
        <WarehouseTable
          initialData={warehouses}
          onSave={handleSaveWarehouses}
          isLoading={isLoading}
          isPaginated={true}
          addStartEntry={true}
        />
      </CardContent>
    </Card>
  );
};

export default WarehouseForm;
