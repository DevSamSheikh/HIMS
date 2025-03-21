import React from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

interface PatientManagementProps {
  className?: string;
}

const PatientManagement = ({ className = "" }: PatientManagementProps) => {
  return (
    <div
      className={`w-full h-full bg-gray-50 dark:bg-gray-900 p-6 ${className}`}
    >
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight">
            Patient Management
          </h1>
        </div>

        <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              variant="outline"
              className="h-auto py-6 flex flex-col items-center justify-center"
            >
              <PlusCircle className="h-8 w-8 mb-2" />
              <span>Schedule Appointment</span>
            </Button>
            <Button
              variant="outline"
              className="h-auto py-6 flex flex-col items-center justify-center"
            >
              <PlusCircle className="h-8 w-8 mb-2" />
              <span>Record Vitals</span>
            </Button>
            <Button
              variant="outline"
              className="h-auto py-6 flex flex-col items-center justify-center"
            >
              <PlusCircle className="h-8 w-8 mb-2" />
              <span>Generate Report</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientManagement;
