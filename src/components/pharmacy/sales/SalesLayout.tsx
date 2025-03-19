import React from "react";
import { Outlet } from "react-router-dom";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate, useLocation } from "react-router-dom";

const SalesLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname.split("/").pop();

  const handleTabChange = (value: string) => {
    navigate(`/pharmacy/sales/${value}`);
  };

  return (
    <div className="p-6 bg-white dark:bg-gray-950 h-full">
      <h1 className="text-2xl font-bold mb-6">Sales Management</h1>

      <Tabs
        defaultValue={currentPath || "invoices"}
        onValueChange={handleTabChange}
        className="w-full"
      >
        <TabsList className="grid grid-cols-3 w-full max-w-2xl mb-8">
          <TabsTrigger value="invoices">Sale Invoices</TabsTrigger>
          <TabsTrigger value="returns">Sale Returns</TabsTrigger>
          <TabsTrigger value="reports">Sales Reports</TabsTrigger>
        </TabsList>

        <div className="mt-4">
          <Outlet />
        </div>
      </Tabs>
    </div>
  );
};

export default SalesLayout;
