import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlusCircle, Search, Settings, Trash2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const LaboratoryMachines = () => {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [isAddMachineOpen, setIsAddMachineOpen] = React.useState(false);

  // Mock data for laboratory machines
  const machines = [
    {
      id: "1",
      name: "Hematology Analyzer XN-1000",
      manufacturer: "Sysmex",
      model: "XN-1000",
      serialNumber: "SYS-XN1-78945",
      installationDate: "2022-05-15",
      lastCalibration: "2023-04-10",
      status: "Active",
      location: "Main Laboratory",
      tests: ["CBC", "WBC", "RBC", "Platelets"],
    },
    {
      id: "2",
      name: "Chemistry Analyzer Cobas c501",
      manufacturer: "Roche",
      model: "Cobas c501",
      serialNumber: "RC-C501-12345",
      installationDate: "2021-11-20",
      lastCalibration: "2023-03-25",
      status: "Active",
      location: "Biochemistry Section",
      tests: ["Glucose", "Lipid Profile", "Liver Function", "Kidney Function"],
    },
    {
      id: "3",
      name: "Immunoassay Analyzer Architect i2000SR",
      manufacturer: "Abbott",
      model: "Architect i2000SR",
      serialNumber: "AB-I2K-56789",
      installationDate: "2022-02-10",
      lastCalibration: "2023-02-15",
      status: "Maintenance",
      location: "Immunology Section",
      tests: ["Thyroid Function", "Fertility Hormones", "Tumor Markers"],
    },
    {
      id: "4",
      name: "Blood Gas Analyzer ABL800 FLEX",
      manufacturer: "Radiometer",
      model: "ABL800 FLEX",
      serialNumber: "RM-ABL8-34567",
      installationDate: "2022-08-05",
      lastCalibration: "2023-04-05",
      status: "Active",
      location: "Emergency Laboratory",
      tests: ["Blood Gas", "Electrolytes", "Metabolites"],
    },
    {
      id: "5",
      name: "Coagulation Analyzer ACL TOP 700",
      manufacturer: "Instrumentation Laboratory",
      model: "ACL TOP 700",
      serialNumber: "IL-ACL7-23456",
      installationDate: "2021-09-15",
      lastCalibration: "2023-03-10",
      status: "Inactive",
      location: "Hematology Section",
      tests: ["PT", "APTT", "Fibrinogen", "D-dimer"],
    },
  ];

  // Filter machines based on search query
  const filteredMachines = machines.filter(
    (machine) =>
      machine.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      machine.manufacturer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      machine.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
      machine.serialNumber.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="p-6 space-y-6 bg-background">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Laboratory Machines
          </h1>
          <p className="text-muted-foreground">
            Manage laboratory equipment and analyzers
          </p>
        </div>
        <Button onClick={() => setIsAddMachineOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Machine
        </Button>
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search machines..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All Machines</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
          <TabsTrigger value="inactive">Inactive</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Machine Name</TableHead>
                    <TableHead>Manufacturer</TableHead>
                    <TableHead>Model</TableHead>
                    <TableHead>Serial Number</TableHead>
                    <TableHead>Last Calibration</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMachines.map((machine) => (
                    <TableRow key={machine.id}>
                      <TableCell className="font-medium">
                        {machine.name}
                      </TableCell>
                      <TableCell>{machine.manufacturer}</TableCell>
                      <TableCell>{machine.model}</TableCell>
                      <TableCell>{machine.serialNumber}</TableCell>
                      <TableCell>{machine.lastCalibration}</TableCell>
                      <TableCell>
                        <div
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            machine.status === "Active"
                              ? "bg-green-100 text-green-800"
                              : machine.status === "Maintenance"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                          }`}
                        >
                          {machine.status}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button variant="ghost" size="icon">
                            <Settings className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Other tab contents would be similar but filtered by status */}
        <TabsContent value="active" className="space-y-4">
          {/* Similar table but filtered for active machines */}
        </TabsContent>
        <TabsContent value="maintenance" className="space-y-4">
          {/* Similar table but filtered for machines in maintenance */}
        </TabsContent>
        <TabsContent value="inactive" className="space-y-4">
          {/* Similar table but filtered for inactive machines */}
        </TabsContent>
      </Tabs>

      {/* Add Machine Dialog */}
      <Dialog open={isAddMachineOpen} onOpenChange={setIsAddMachineOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add New Laboratory Machine</DialogTitle>
            <DialogDescription>
              Enter the details of the new laboratory machine or analyzer.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="machine-name">Machine Name</Label>
                <Input id="machine-name" placeholder="Enter machine name" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="manufacturer">Manufacturer</Label>
                <Input id="manufacturer" placeholder="Enter manufacturer" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="model">Model</Label>
                <Input id="model" placeholder="Enter model number" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="serial-number">Serial Number</Label>
                <Input id="serial-number" placeholder="Enter serial number" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="installation-date">Installation Date</Label>
                <Input id="installation-date" type="date" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="last-calibration">Last Calibration</Label>
                <Input id="last-calibration" type="date" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select>
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input id="location" placeholder="Enter location" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="tests">Supported Tests</Label>
              <Input id="tests" placeholder="Enter tests separated by commas" />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsAddMachineOpen(false)}
            >
              Cancel
            </Button>
            <Button>Save Machine</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LaboratoryMachines;
