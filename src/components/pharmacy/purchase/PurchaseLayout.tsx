import React from "react";
import { Outlet } from "react-router-dom";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useNavigate, useLocation } from "react-router-dom";

const PurchaseLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname.split("/").pop();

  const handleTabChange = (value: string) => {
    navigate(`/pharmacy/purchase/${value}`);
  };

  return (
    <div className="p-6 bg-white dark:bg-gray-950 h-full">
      <h1 className="text-2xl font-bold mb-6">Purchase Management</h1>

      <Tabs
        defaultValue={currentPath || "orders"}
        onValueChange={handleTabChange}
        className="w-full"
      >
        <TabsList className="grid grid-cols-4 w-full max-w-3xl mb-8">
          <TabsTrigger value="orders">Purchase Orders</TabsTrigger>
          <TabsTrigger value="invoices">Purchase Invoices</TabsTrigger>
          <TabsTrigger value="returns">Purchase Returns</TabsTrigger>
          <TabsTrigger value="reports">Purchase Reports</TabsTrigger>
        </TabsList>

        <div className="mt-4">
          <Outlet />
        </div>
      </Tabs>
    </div>
  );
};

export default PurchaseLayout;
