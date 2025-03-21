import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  PlusCircle,
  Search,
  Edit,
  Trash2,
  FileText,
  Pill,
  Stethoscope,
} from "lucide-react";

interface Treatment {
  id: string;
  patientId: string;
  patientName: string;
  mrNumber: string;
  wardName: string;
  roomNumber: string;
  bedNumber: string;
  admissionDate: string;
  doctorName: string;
  status: "active" | "discharged";
}

interface TreatmentService {
  id: string;
  treatmentId: string;
  serviceName: string;
  serviceCategory: string;
  date: string;
  quantity: number;
  rate: number;
  amount: number;
  notes: string;
}

interface TreatmentMedication {
  id: string;
  treatmentId: string;
  medicationName: string;
  dosage: string;
  frequency: string;
  startDate: string;
  endDate: string;
  quantity: number;
  rate: number;
  amount: number;
}

const PatientTreatment = () => {
  const [treatments, setTreatments] = useState<Treatment[]>([
    {
      id: "tr-001",
      patientId: "P-1001",
      patientName: "John Smith",
      mrNumber: "MR-10001",
      wardName: "General Ward",
      roomNumber: "101",
      bedNumber: "A",
      admissionDate: "2023-06-15",
      doctorName: "Dr. Robert Wilson",
      status: "active",
    },
    {
      id: "tr-002",
      patientId: "P-1002",
      patientName: "Emily Johnson",
      mrNumber: "MR-10002",
      wardName: "Surgical Ward",
      roomNumber: "201",
      bedNumber: "B",
      admissionDate: "2023-06-12",
      doctorName: "Dr. Sarah Parker",
      status: "active",
    },
    {
      id: "tr-003",
      patientId: "P-1003",
      patientName: "Michael Brown",
      mrNumber: "MR-10003",
      wardName: "ICU",
      roomNumber: "301",
      bedNumber: "A",
      admissionDate: "2023-06-10",
      doctorName: "Dr. James Thompson",
      status: "discharged",
    },
  ]);

  const [treatmentServices, setTreatmentServices] = useState<
    TreatmentService[]
  >([
    {
      id: "svc-001",
      treatmentId: "tr-001",
      serviceName: "Daily Doctor Visit",
      serviceCategory: "Consultation",
      date: "2023-06-16",
      quantity: 1,
      rate: 500,
      amount: 500,
      notes: "Regular checkup",
    },
    {
      id: "svc-002",
      treatmentId: "tr-001",
      serviceName: "Nursing Care",
      serviceCategory: "Care",
      date: "2023-06-16",
      quantity: 1,
      rate: 1200,
      amount: 1200,
      notes: "24-hour nursing care",
    },
    {
      id: "svc-003",
      treatmentId: "tr-002",
      serviceName: "Daily Doctor Visit",
      serviceCategory: "Consultation",
      date: "2023-06-16",
      quantity: 1,
      rate: 500,
      amount: 500,
      notes: "Post-surgery checkup",
    },
  ]);

  const [treatmentMedications, setTreatmentMedications] = useState<
    TreatmentMedication[]
  >([
    {
      id: "med-001",
      treatmentId: "tr-001",
      medicationName: "Amoxicillin",
      dosage: "500mg",
      frequency: "TID",
      startDate: "2023-06-15",
      endDate: "2023-06-22",
      quantity: 21,
      rate: 15,
      amount: 315,
    },
    {
      id: "med-002",
      treatmentId: "tr-001",
      medicationName: "Paracetamol",
      dosage: "650mg",
      frequency: "QID",
      startDate: "2023-06-15",
      endDate: "2023-06-18",
      quantity: 12,
      rate: 5,
      amount: 60,
    },
    {
      id: "med-003",
      treatmentId: "tr-002",
      medicationName: "Tramadol",
      dosage: "50mg",
      frequency: "BID",
      startDate: "2023-06-12",
      endDate: "2023-06-19",
      quantity: 14,
      rate: 25,
      amount: 350,
    },
  ]);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTreatment, setSelectedTreatment] = useState<Treatment | null>(
    null,
  );
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [isAddServiceDialogOpen, setIsAddServiceDialogOpen] = useState(false);
  const [isAddMedicationDialogOpen, setIsAddMedicationDialogOpen] =
    useState(false);

  const filteredTreatments = treatments.filter(
    (treatment) =>
      treatment.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      treatment.mrNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      treatment.doctorName.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleViewDetails = (treatment: Treatment) => {
    setSelectedTreatment(treatment);
    setIsDetailsDialogOpen(true);
  };

  const handleAddService = () => {
    if (!selectedTreatment) return;
    setIsAddServiceDialogOpen(true);
  };

  const handleAddMedication = () => {
    if (!selectedTreatment) return;
    setIsAddMedicationDialogOpen(true);
  };

  const handleSaveService = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Save service logic would go here
    setIsAddServiceDialogOpen(false);
  };

  const handleSaveMedication = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Save medication logic would go here
    setIsAddMedicationDialogOpen(false);
  };

  const getFilteredServices = (treatmentId: string) => {
    return treatmentServices.filter(
      (service) => service.treatmentId === treatmentId,
    );
  };

  const getFilteredMedications = (treatmentId: string) => {
    return treatmentMedications.filter(
      (medication) => medication.treatmentId === treatmentId,
    );
  };

  const calculateTotalAmount = (treatmentId: string) => {
    const servicesTotal = getFilteredServices(treatmentId).reduce(
      (sum, service) => sum + service.amount,
      0,
    );
    const medicationsTotal = getFilteredMedications(treatmentId).reduce(
      (sum, medication) => sum + medication.amount,
      0,
    );
    return servicesTotal + medicationsTotal;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Patient Treatments</h2>
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by patient name, MR number, or doctor..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>MR Number</TableHead>
              <TableHead>Patient Name</TableHead>
              <TableHead>Ward</TableHead>
              <TableHead>Room/Bed</TableHead>
              <TableHead>Admission Date</TableHead>
              <TableHead>Doctor</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTreatments.length > 0 ? (
              filteredTreatments.map((treatment) => (
                <TableRow key={treatment.id}>
                  <TableCell className="font-medium">
                    {treatment.mrNumber}
                  </TableCell>
                  <TableCell>{treatment.patientName}</TableCell>
                  <TableCell>{treatment.wardName}</TableCell>
                  <TableCell>{`${treatment.roomNumber}-${treatment.bedNumber}`}</TableCell>
                  <TableCell>
                    {new Date(treatment.admissionDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{treatment.doctorName}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${treatment.status === "active" ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"}`}
                    >
                      {treatment.status === "active" ? "Active" : "Discharged"}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleViewDetails(treatment)}
                    >
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-4">
                  No treatments found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Treatment Details Dialog */}
      <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
        <DialogContent className="sm:max-w-[900px]">
          <DialogHeader>
            <DialogTitle>Treatment Details</DialogTitle>
          </DialogHeader>

          {selectedTreatment && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-lg font-semibold">
                    {selectedTreatment.patientName}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    MR Number: {selectedTreatment.mrNumber}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">
                    Admission Date:{" "}
                    {new Date(
                      selectedTreatment.admissionDate,
                    ).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Doctor: {selectedTreatment.doctorName}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 bg-muted/50 p-4 rounded-md">
                <div>
                  <p className="text-sm font-medium">Ward</p>
                  <p className="text-sm">{selectedTreatment.wardName}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Room</p>
                  <p className="text-sm">{selectedTreatment.roomNumber}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Bed</p>
                  <p className="text-sm">{selectedTreatment.bedNumber}</p>
                </div>
              </div>

              <Tabs defaultValue="services">
                <div className="flex justify-between items-center">
                  <TabsList>
                    <TabsTrigger value="services">Services</TabsTrigger>
                    <TabsTrigger value="medications">Medications</TabsTrigger>
                  </TabsList>
                  <div className="space-x-2">
                    <Button size="sm" onClick={handleAddService}>
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Add Service
                    </Button>
                    <Button size="sm" onClick={handleAddMedication}>
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Add Medication
                    </Button>
                  </div>
                </div>

                <TabsContent value="services" className="mt-4">
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Service</TableHead>
                          <TableHead>Category</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Quantity</TableHead>
                          <TableHead>Rate</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead>Notes</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {getFilteredServices(selectedTreatment.id).length >
                        0 ? (
                          getFilteredServices(selectedTreatment.id).map(
                            (service) => (
                              <TableRow key={service.id}>
                                <TableCell className="font-medium">
                                  {service.serviceName}
                                </TableCell>
                                <TableCell>{service.serviceCategory}</TableCell>
                                <TableCell>
                                  {new Date(service.date).toLocaleDateString()}
                                </TableCell>
                                <TableCell>{service.quantity}</TableCell>
                                <TableCell>
                                  ₹{service.rate.toFixed(2)}
                                </TableCell>
                                <TableCell>
                                  ₹{service.amount.toFixed(2)}
                                </TableCell>
                                <TableCell>{service.notes}</TableCell>
                                <TableCell className="text-right">
                                  <Button variant="ghost" size="icon">
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button variant="ghost" size="icon">
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ),
                          )
                        ) : (
                          <TableRow>
                            <TableCell colSpan={8} className="text-center py-4">
                              No services added yet
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </TabsContent>

                <TabsContent value="medications" className="mt-4">
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Medication</TableHead>
                          <TableHead>Dosage</TableHead>
                          <TableHead>Frequency</TableHead>
                          <TableHead>Duration</TableHead>
                          <TableHead>Quantity</TableHead>
                          <TableHead>Rate</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {getFilteredMedications(selectedTreatment.id).length >
                        0 ? (
                          getFilteredMedications(selectedTreatment.id).map(
                            (medication) => (
                              <TableRow key={medication.id}>
                                <TableCell className="font-medium">
                                  {medication.medicationName}
                                </TableCell>
                                <TableCell>{medication.dosage}</TableCell>
                                <TableCell>{medication.frequency}</TableCell>
                                <TableCell>
                                  {new Date(
                                    medication.startDate,
                                  ).toLocaleDateString()}{" "}
                                  -{" "}
                                  {new Date(
                                    medication.endDate,
                                  ).toLocaleDateString()}
                                </TableCell>
                                <TableCell>{medication.quantity}</TableCell>
                                <TableCell>
                                  ₹{medication.rate.toFixed(2)}
                                </TableCell>
                                <TableCell>
                                  ₹{medication.amount.toFixed(2)}
                                </TableCell>
                                <TableCell className="text-right">
                                  <Button variant="ghost" size="icon">
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button variant="ghost" size="icon">
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ),
                          )
                        ) : (
                          <TableRow>
                            <TableCell colSpan={8} className="text-center py-4">
                              No medications added yet
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </TabsContent>
              </Tabs>

              <div className="flex justify-between items-center pt-4 border-t">
                <div>
                  <p className="text-sm font-medium">Total Amount</p>
                  <p className="text-xl font-bold">
                    ₹{calculateTotalAmount(selectedTreatment.id).toFixed(2)}
                  </p>
                </div>
                <div className="space-x-2">
                  <Button variant="outline">
                    <FileText className="mr-2 h-4 w-4" />
                    Generate Bill
                  </Button>
                  <Button>
                    <Stethoscope className="mr-2 h-4 w-4" />
                    Update Treatment
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Add Service Dialog */}
      <Dialog
        open={isAddServiceDialogOpen}
        onOpenChange={setIsAddServiceDialogOpen}
      >
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>Add Service</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSaveService} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="serviceName">Service Name</Label>
                <select
                  id="serviceName"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  required
                >
                  <option value="">Select Service</option>
                  <option value="Daily Doctor Visit">Daily Doctor Visit</option>
                  <option value="Nursing Care">Nursing Care</option>
                  <option value="IV Fluid Administration">
                    IV Fluid Administration
                  </option>
                  <option value="Oxygen Therapy">Oxygen Therapy</option>
                  <option value="Physiotherapy Session">
                    Physiotherapy Session
                  </option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="serviceCategory">Category</Label>
                <select
                  id="serviceCategory"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  required
                >
                  <option value="">Select Category</option>
                  <option value="Consultation">Consultation</option>
                  <option value="Care">Care</option>
                  <option value="Treatment">Treatment</option>
                  <option value="Rehabilitation">Rehabilitation</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="serviceDate">Date</Label>
                <Input id="serviceDate" type="date" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity</Label>
                <Input
                  id="quantity"
                  type="number"
                  min="1"
                  defaultValue="1"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="rate">Rate (₹)</Label>
                <Input id="rate" type="number" min="0" step="0.01" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="amount">Amount (₹)</Label>
                <Input
                  id="amount"
                  type="number"
                  min="0"
                  step="0.01"
                  required
                  readOnly
                />
              </div>
              <div className="space-y-2 col-span-2">
                <Label htmlFor="notes">Notes</Label>
                <Input id="notes" placeholder="Additional notes" />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Add Service</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Add Medication Dialog */}
      <Dialog
        open={isAddMedicationDialogOpen}
        onOpenChange={setIsAddMedicationDialogOpen}
      >
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>Add Medication</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSaveMedication} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="medicationName">Medication Name</Label>
                <select
                  id="medicationName"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  required
                >
                  <option value="">Select Medication</option>
                  <option value="Amoxicillin">Amoxicillin</option>
                  <option value="Paracetamol">Paracetamol</option>
                  <option value="Tramadol">Tramadol</option>
                  <option value="Omeprazole">Omeprazole</option>
                  <option value="Metformin">Metformin</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="dosage">Dosage</Label>
                <Input id="dosage" placeholder="e.g., 500mg" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="frequency">Frequency</Label>
                <select
                  id="frequency"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  required
                >
                  <option value="">Select Frequency</option>
                  <option value="OD">Once Daily (OD)</option>
                  <option value="BID">Twice Daily (BID)</option>
                  <option value="TID">Three Times Daily (TID)</option>
                  <option value="QID">Four Times Daily (QID)</option>
                  <option value="PRN">As Needed (PRN)</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date</Label>
                <Input id="startDate" type="date" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">End Date</Label>
                <Input id="endDate" type="date" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity</Label>
                <Input id="quantity" type="number" min="1" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="rate">Rate (₹)</Label>
                <Input id="rate" type="number" min="0" step="0.01" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="amount">Amount (₹)</Label>
                <Input
                  id="amount"
                  type="number"
                  min="0"
                  step="0.01"
                  required
                  readOnly
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Add Medication</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PatientTreatment;
