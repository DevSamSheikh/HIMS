import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { PlusCircle, UserPlus } from "lucide-react";
import PatientSearch from "./PatientSearch";
import PatientList from "./PatientList";
import PatientRegistrationForm from "./PatientRegistrationForm";

interface PatientManagementProps {
  className?: string;
}

const PatientManagement = ({ className = "" }: PatientManagementProps) => {
  const [activeTab, setActiveTab] = useState<"list" | "register">("list");
  const [searchParams, setSearchParams] = useState<any>(null);

  // Handle patient search
  const handleSearch = (params: any) => {
    setSearchParams(params);
    console.log("Searching with params:", params);
    // In a real implementation, this would filter the patient list
  };

  // Handle viewing a patient's details
  const handleViewPatient = (patientId: string) => {
    console.log(`Viewing patient with ID: ${patientId}`);
    // In a real implementation, this would navigate to the patient details page
  };

  // Handle editing a patient's information
  const handleEditPatient = (patientId: string) => {
    console.log(`Editing patient with ID: ${patientId}`);
    // In a real implementation, this would open the edit form with patient data
  };

  // Handle patient registration form submission
  const handleRegisterPatient = (data: any) => {
    console.log("Registering new patient:", data);
    // In a real implementation, this would save the patient data and switch to list view
    setActiveTab("list");
  };

  return (
    <div
      className={`w-full h-full bg-gray-50 dark:bg-gray-900 p-6 ${className}`}
    >
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight">
            Patient Management
          </h1>
          <div className="flex space-x-2">
            {activeTab === "list" ? (
              <Button onClick={() => setActiveTab("register")}>
                <UserPlus className="mr-2 h-4 w-4" />
                Register New Patient
              </Button>
            ) : (
              <Button variant="outline" onClick={() => setActiveTab("list")}>
                Back to Patient List
              </Button>
            )}
          </div>
        </div>

        {activeTab === "list" ? (
          <div className="space-y-6">
            <PatientSearch onSearch={handleSearch} />
            <PatientList
              onViewPatient={handleViewPatient}
              onEditPatient={handleEditPatient}
            />
          </div>
        ) : (
          <PatientRegistrationForm onSubmit={handleRegisterPatient} />
        )}

        {activeTab === "list" && (
          <div className="mt-8 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
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
        )}
      </div>
    </div>
  );
};

export default PatientManagement;
