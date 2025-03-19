import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import InventoryOpeningTable from "./InventoryOpeningTable";
import InventoryAdjustmentTable from "./InventoryAdjustmentTable";
import InventoryTransferTable from "./InventoryTransferTable";

const InventoryManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState("openings");

  return (
    <div className="container mx-auto py-6 space-y-6">
      <h1 className="text-3xl font-bold">Inventory Management</h1>

      <Tabs
        defaultValue="openings"
        onValueChange={setActiveTab}
        value={activeTab}
      >
        <TabsList className="grid w-full md:w-auto grid-cols-1 md:grid-cols-3">
          <TabsTrigger value="openings">Inventory Openings</TabsTrigger>
          <TabsTrigger value="adjustments">Inventory Adjustments</TabsTrigger>
          <TabsTrigger value="transfers">Inventory Transfers</TabsTrigger>
        </TabsList>

        <TabsContent value="openings" className="mt-6">
          <InventoryOpeningTable />
        </TabsContent>

        <TabsContent value="adjustments" className="mt-6">
          <InventoryAdjustmentTable />
        </TabsContent>

        <TabsContent value="transfers" className="mt-6">
          <InventoryTransferTable />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default InventoryManagement;
