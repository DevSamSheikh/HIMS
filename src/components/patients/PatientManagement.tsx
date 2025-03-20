import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search,
  Plus,
  FileText,
  UserPlus,
  Users,
  BedDouble,
  ClipboardList,
} from "lucide-react";
import PatientList from "./PatientList";
import PatientRegistration from "./PatientRegistration";
import IPDManagement from "./ipd/IPDManagement";
import OPDManagement from "./opd/OPDManagement";

const PatientManagement = () => {
  const [activeTab, setActiveTab] = useState<string>("patients");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isRegistrationOpen, setIsRegistrationOpen] = useState<boolean>(false);

  return (
    <div className="container mx-auto p-6 bg-white dark:bg-gray-950 h-full">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Patient Management
          </h1>
          <p className="text-muted-foreground mt-1">
            Register and manage patient records, OPD visits, and IPD admissions
          </p>
        </div>
        <Button onClick={() => setIsRegistrationOpen(true)}>
          <UserPlus className="mr-2 h-4 w-4" />
          Register New Patient
        </Button>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-4"
      >
        <div className="flex justify-between items-center">
          <TabsList className="grid grid-cols-4 w-[600px]">
            <TabsTrigger value="patients" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span>All Patients</span>
            </TabsTrigger>
            <TabsTrigger value="opd" className="flex items-center gap-2">
              <ClipboardList className="h-4 w-4" />
              <span>OPD Management</span>
            </TabsTrigger>
            <TabsTrigger value="ipd" className="flex items-center gap-2">
              <BedDouble className="h-4 w-4" />
              <span>IPD Management</span>
            </TabsTrigger>
            <TabsTrigger value="reports" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span>Reports</span>
            </TabsTrigger>
          </TabsList>

          <div className="relative w-[300px]">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search patients..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>

        <TabsContent value="patients" className="space-y-4">
          <PatientList searchQuery={searchQuery} />
        </TabsContent>

        <TabsContent value="opd" className="space-y-4">
          <OPDManagement searchQuery={searchQuery} />
        </TabsContent>

        <TabsContent value="ipd" className="space-y-4">
          <IPDManagement searchQuery={searchQuery} />
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <div className="p-4 border rounded-md">
            <h2 className="text-xl font-semibold mb-4">Patient Reports</h2>
            <p className="text-muted-foreground">
              Reports module coming soon...
            </p>
          </div>
        </TabsContent>
      </Tabs>

      {isRegistrationOpen && (
        <PatientRegistration
          isOpen={isRegistrationOpen}
          onClose={() => setIsRegistrationOpen(false)}
          onSuccess={() => {
            setIsRegistrationOpen(false);
            // Refresh patient list
          }}
        />
      )}
    </div>
  );
};

export default PatientManagement;
