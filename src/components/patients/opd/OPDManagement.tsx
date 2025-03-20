import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Search, Plus, Calendar, Users, Clock } from "lucide-react";
import OPDVisitList from "./OPDVisitList";
import OPDQueue from "./OPDQueue";
import OPDAppointments from "./OPDAppointments";
import NewOPDVisit from "./NewOPDVisit";
import { toast } from "@/components/ui/use-toast";
import { OPDVisit } from "../types";

interface OPDManagementProps {
  searchQuery: string;
}

const OPDManagement: React.FC<OPDManagementProps> = ({ searchQuery }) => {
  const [activeTab, setActiveTab] = useState<string>("visits");
  const [isNewVisitOpen, setIsNewVisitOpen] = useState<boolean>(false);
  const [localSearchQuery, setLocalSearchQuery] = useState<string>(searchQuery);

  const handleNewVisitSuccess = (newVisit: OPDVisit) => {
    setIsNewVisitOpen(false);
    toast({
      title: "OPD Visit Created",
      description: `New OPD visit created for ${newVisit.patientName}`,
    });
    // In a real app, you would refresh the visit list here
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">OPD Management</h2>
        <Button onClick={() => setIsNewVisitOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          New OPD Visit
        </Button>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-4"
      >
        <div className="flex justify-between items-center">
          <TabsList>
            <TabsTrigger value="visits" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span>All Visits</span>
            </TabsTrigger>
            <TabsTrigger value="queue" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>Today's Queue</span>
            </TabsTrigger>
            <TabsTrigger
              value="appointments"
              className="flex items-center gap-2"
            >
              <Calendar className="h-4 w-4" />
              <span>Appointments</span>
            </TabsTrigger>
          </TabsList>

          <div className="relative w-[300px]">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search OPD visits..."
              value={localSearchQuery}
              onChange={(e) => setLocalSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>

        <TabsContent value="visits" className="space-y-4">
          <Card className="bg-white dark:bg-gray-950">
            <OPDVisitList searchQuery={localSearchQuery} />
          </Card>
        </TabsContent>

        <TabsContent value="queue" className="space-y-4">
          <OPDQueue searchQuery={localSearchQuery} />
        </TabsContent>

        <TabsContent value="appointments" className="space-y-4">
          <OPDAppointments searchQuery={localSearchQuery} />
        </TabsContent>
      </Tabs>

      {isNewVisitOpen && (
        <NewOPDVisit
          isOpen={isNewVisitOpen}
          onClose={() => setIsNewVisitOpen(false)}
          onSuccess={handleNewVisitSuccess}
        />
      )}
    </div>
  );
};

export default OPDManagement;
