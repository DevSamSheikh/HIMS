import React from "react";
import { Outlet } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";

const IPDLayout = () => {
  return (
    <div className="w-full p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">IPD Management</h1>
      </div>

      <Card>
        <CardContent className="p-6">
          <Outlet />
        </CardContent>
      </Card>
    </div>
  );
};

export default IPDLayout;
