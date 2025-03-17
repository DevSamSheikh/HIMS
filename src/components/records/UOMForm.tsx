import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import UOMTable, { UOM } from "./UOMTable";
import { toast } from "@/components/ui/use-toast";

const UOMForm = () => {
  const [uoms, setUOMs] = useState<UOM[]>([
    {
      id: "uom-1",
      name: "Tablets",
    },
    {
      id: "uom-2",
      name: "Bottles",
    },
    {
      id: "uom-3",
      name: "Strips",
    },
    {
      id: "uom-4",
      name: "Vials",
    },
    {
      id: "uom-5",
      name: "Ampules",
    },
  ]);

  const [isLoading, setIsLoading] = useState(false);

  const handleSaveUOMs = (updatedUOMs: UOM[]) => {
    // Simulate API call
    setIsLoading(true);
    setTimeout(() => {
      setUOMs(updatedUOMs);
      setIsLoading(false);
      toast({
        title: "UOMs Updated",
        description: "Unit of Measurement list has been updated successfully",
      });
    }, 500);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Unit of Measurement Management</CardTitle>
      </CardHeader>
      <CardContent>
        <UOMTable
          initialData={uoms}
          onSave={handleSaveUOMs}
          isLoading={isLoading}
          isPaginated={true}
          addStartEntry={true}
        />
      </CardContent>
    </Card>
  );
};

export default UOMForm;
