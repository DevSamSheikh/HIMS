import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { PlusCircle, Search, Filter, BedDouble, Clock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface IPDManagementProps {
  className?: string;
}

interface Admission {
  id: string;
  patientName: string;
  patientId: string;
  admissionDate: string;
  expectedDischargeDate: string;
  roomNumber: string;
  bedNumber: string;
  doctor: string;
  diagnosis: string;
  status: "admitted" | "critical" | "stable" | "discharged" | "transferred";
  progress: number;
}

const IPDManagement = ({ className = "" }: IPDManagementProps) => {
  const [activeTab, setActiveTab] = useState<"current" | "discharged">(
    "current",
  );
  const [searchQuery, setSearchQuery] = useState("");

  // Mock admissions data
  const admissions: Admission[] = [
    {
      id: "adm-001",
      patientName: "James Wilson",
      patientId: "P-2001",
      admissionDate: "2023-06-10",
      expectedDischargeDate: "2023-06-17",
      roomNumber: "201",
      bedNumber: "A",
      doctor: "Dr. Robert Brown",
      diagnosis: "Pneumonia",
      status: "stable",
      progress: 70,
    },
    {
      id: "adm-002",
      patientName: "Sarah Johnson",
      patientId: "P-2002",
      admissionDate: "2023-06-12",
      expectedDischargeDate: "2023-06-19",
      roomNumber: "205",
      bedNumber: "C",
      doctor: "Dr. Emily Davis",
      diagnosis: "Appendicitis (Post-Surgery)",
      status: "stable",
      progress: 50,
    },
    {
      id: "adm-003",
      patientName: "Michael Thompson",
      patientId: "P-2003",
      admissionDate: "2023-06-14",
      expectedDischargeDate: "2023-06-21",
      roomNumber: "210",
      bedNumber: "B",
      doctor: "Dr. James Wilson",
      diagnosis: "Diabetic Ketoacidosis",
      status: "critical",
      progress: 30,
    },
    {
      id: "adm-004",
      patientName: "Jennifer Lopez",
      patientId: "P-2004",
      admissionDate: "2023-06-05",
      expectedDischargeDate: "2023-06-15",
      roomNumber: "215",
      bedNumber: "D",
      doctor: "Dr. Michael Chen",
      diagnosis: "Fractured Femur",
      status: "discharged",
      progress: 100,
    },
    {
      id: "adm-005",
      patientName: "David Miller",
      patientId: "P-2005",
      admissionDate: "2023-06-08",
      expectedDischargeDate: "2023-06-16",
      roomNumber: "220",
      bedNumber: "A",
      doctor: "Dr. Sarah Johnson",
      diagnosis: "Acute Kidney Injury",
      status: "discharged",
      progress: 100,
    },
  ];

  // Filter admissions based on tab and search query
  const filteredAdmissions = admissions.filter((admission) => {
    const matchesSearch =
      admission.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      admission.patientId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      admission.doctor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      admission.diagnosis.toLowerCase().includes(searchQuery.toLowerCase()) ||
      admission.roomNumber.toLowerCase().includes(searchQuery.toLowerCase());

    if (activeTab === "current" && admission.status === "discharged")
      return false;
    if (activeTab === "discharged" && admission.status !== "discharged")
      return false;

    return matchesSearch;
  });

  const getStatusBadgeVariant = (status: Admission["status"]) => {
    switch (status) {
      case "admitted":
        return "outline";
      case "critical":
        return "destructive";
      case "stable":
        return "secondary";
      case "discharged":
        return "default";
      case "transferred":
        return "warning";
      default:
        return "outline";
    }
  };

  return (
    <div
      className={`w-full h-full bg-gray-50 dark:bg-gray-900 p-6 ${className}`}
    >
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight">IPD Management</h1>
          <Button>
            <BedDouble className="mr-2 h-4 w-4" />
            New Admission
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Beds</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">50</div>
              <p className="text-xs text-muted-foreground">
                5 floors, 10 rooms per floor
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Occupied Beds
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">32</div>
              <p className="text-xs text-muted-foreground">
                64% occupancy rate
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Available Beds
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">18</div>
              <p className="text-xs text-muted-foreground">36% availability</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Critical Patients
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3</div>
              <p className="text-xs text-muted-foreground">
                9.4% of current patients
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search by patient name, ID, doctor, diagnosis, or room..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Filter
            </Button>
          </div>

          <Tabs
            defaultValue="current"
            value={activeTab}
            onValueChange={(value) => setActiveTab(value as any)}
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="current">Current Patients</TabsTrigger>
              <TabsTrigger value="discharged">Discharged Patients</TabsTrigger>
            </TabsList>

            <TabsContent value="current" className="mt-4">
              <div className="grid grid-cols-1 gap-4">
                {filteredAdmissions.length > 0 ? (
                  filteredAdmissions.map((admission) => (
                    <AdmissionCard key={admission.id} admission={admission} />
                  ))
                ) : (
                  <div className="text-center py-8 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                    <p className="text-gray-500 dark:text-gray-400">
                      No current admissions found.
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="discharged" className="mt-4">
              <div className="grid grid-cols-1 gap-4">
                {filteredAdmissions.length > 0 ? (
                  filteredAdmissions.map((admission) => (
                    <AdmissionCard key={admission.id} admission={admission} />
                  ))
                ) : (
                  <div className="text-center py-8 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                    <p className="text-gray-500 dark:text-gray-400">
                      No discharged patients found.
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

interface AdmissionCardProps {
  admission: Admission;
}

const AdmissionCard = ({ admission }: AdmissionCardProps) => {
  const getStatusBadgeVariant = (status: Admission["status"]) => {
    switch (status) {
      case "admitted":
        return "outline";
      case "critical":
        return "destructive";
      case "stable":
        return "secondary";
      case "discharged":
        return "default";
      case "transferred":
        return "warning";
      default:
        return "outline";
    }
  };

  const daysRemaining = () => {
    if (admission.status === "discharged") return 0;

    const today = new Date();
    const dischargeDate = new Date(admission.expectedDischargeDate);
    const diffTime = dischargeDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  return (
    <Card className="bg-white dark:bg-gray-800 hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{admission.patientName}</CardTitle>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Patient ID: {admission.patientId}
            </div>
          </div>
          <Badge
            variant={getStatusBadgeVariant(admission.status)}
            className="capitalize"
          >
            {admission.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
          <div>
            <div className="text-sm font-medium">Room & Bed</div>
            <div className="text-sm">
              {admission.roomNumber}-{admission.bedNumber}
            </div>
          </div>
          <div>
            <div className="text-sm font-medium">Admission Date</div>
            <div className="text-sm">
              {new Date(admission.admissionDate).toLocaleDateString()}
            </div>
          </div>
          <div>
            <div className="text-sm font-medium">Expected Discharge</div>
            <div className="text-sm">
              {new Date(admission.expectedDischargeDate).toLocaleDateString()}
            </div>
          </div>
          <div>
            <div className="text-sm font-medium">Doctor</div>
            <div className="text-sm">{admission.doctor}</div>
          </div>
          <div className="col-span-2">
            <div className="text-sm font-medium">Diagnosis</div>
            <div className="text-sm">{admission.diagnosis}</div>
          </div>
        </div>

        {admission.status !== "discharged" && (
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <div className="text-sm font-medium">Recovery Progress</div>
              <div className="text-sm">{admission.progress}%</div>
            </div>
            <Progress value={admission.progress} className="h-2" />
            <div className="flex items-center justify-end text-xs text-gray-500 dark:text-gray-400">
              <Clock className="h-3 w-3 mr-1" />
              {daysRemaining()} days until expected discharge
            </div>
          </div>
        )}

        <div className="flex justify-end mt-4 gap-2">
          <Button variant="outline" size="sm">
            View Details
          </Button>
          {admission.status !== "discharged" && (
            <Button size="sm">Update Status</Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default IPDManagement;
