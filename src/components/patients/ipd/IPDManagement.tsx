import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, BedDouble } from "lucide-react";

interface IPDManagementProps {
  searchQuery: string;
}

const IPDManagement: React.FC<IPDManagementProps> = ({ searchQuery }) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">IPD Management</h2>
          <p className="text-muted-foreground">
            Manage inpatient admissions and ward assignments
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <BedDouble className="mr-2 h-4 w-4" />
            View Bed Allocation
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Admission
          </Button>
        </div>
      </div>

      <div className="p-8 text-center border rounded-md bg-muted/50">
        <BedDouble className="h-12 w-12 mx-auto text-muted-foreground" />
        <h3 className="mt-4 text-lg font-medium">IPD Module Coming Soon</h3>
        <p className="mt-2 text-muted-foreground">
          The Inpatient Department management module is currently under
          development and will be available in a future update.
        </p>
      </div>
    </div>
  );
};

export default IPDManagement;
