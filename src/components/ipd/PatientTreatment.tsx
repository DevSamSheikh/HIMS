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
  FlaskConical,
  CreditCard,
  DollarSign,
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
  paymentStatus?: "pending" | "partial" | "paid";
  paidAmount?: number;
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

interface TreatmentTest {
  id: string;
  treatmentId: string;
  testName: string;
  testCategory: string;
  date: string;
  rate: number;
  amount: number;
  notes: string;
  status: "ordered" | "in_progress" | "completed" | "cancelled";
  results?: string;
  paymentStatus: "pending" | "partial" | "paid";
  paidAmount: number;
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

  const [treatmentTests, setTreatmentTests] = useState<TreatmentTest[]>([
    {
      id: "test-001",
      treatmentId: "tr-001",
      testName: "Complete Blood Count",
      testCategory: "Laboratory",
      date: "2023-06-16",
      rate: 500,
      amount: 500,
      notes: "Routine blood work",
      status: "completed",
      results: "WBC: 7.5, RBC: 4.8, Hgb: 14.2, Hct: 42%, Platelets: 250",
      paymentStatus: "paid",
      paidAmount: 500,
    },
    {
      id: "test-002",
      treatmentId: "tr-001",
      testName: "Chest X-Ray",
      testCategory: "Radiology",
      date: "2023-06-17",
      rate: 1000,
      amount: 1000,
      notes: "Check for pneumonia",
      status: "completed",
      results: "No significant findings. Lungs clear.",
      paymentStatus: "pending",
      paidAmount: 0,
    },
    {
      id: "test-003",
      treatmentId: "tr-002",
      testName: "Liver Function Test",
      testCategory: "Laboratory",
      date: "2023-06-15",
      rate: 800,
      amount: 800,
      notes: "Pre-surgery assessment",
      status: "completed",
      results: "ALT: 25, AST: 28, ALP: 85, Bilirubin: 0.8",
      paymentStatus: "partial",
      paidAmount: 400,
    },
    {
      id: "test-004",
      treatmentId: "tr-002",
      testName: "ECG",
      testCategory: "Cardiology",
      date: "2023-06-15",
      rate: 600,
      amount: 600,
      notes: "Pre-surgery cardiac assessment",
      status: "completed",
      results: "Normal sinus rhythm. No abnormalities detected.",
      paymentStatus: "paid",
      paidAmount: 600,
    },
    {
      id: "test-005",
      treatmentId: "tr-003",
      testName: "CT Scan - Head",
      testCategory: "Radiology",
      date: "2023-06-12",
      rate: 5000,
      amount: 5000,
      notes: "Evaluate head injury",
      status: "completed",
      results: "No intracranial hemorrhage. No mass effect or midline shift.",
      paymentStatus: "paid",
      paidAmount: 5000,
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
  const [isAddTestDialogOpen, setIsAddTestDialogOpen] = useState(false);
  const [isTestPaymentDialogOpen, setIsTestPaymentDialogOpen] = useState(false);
  const [selectedTest, setSelectedTest] = useState<TreatmentTest | null>(null);
  const [testPaymentAmount, setTestPaymentAmount] = useState<number>(0);

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

  const handleAddTest = () => {
    if (!selectedTreatment) return;
    setIsAddTestDialogOpen(true);
  };

  const handleTestPayment = (test: TreatmentTest) => {
    setSelectedTest(test);
    setTestPaymentAmount(test.amount - test.paidAmount);
    setIsTestPaymentDialogOpen(true);
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

  const handleSaveTest = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Get form data
    const form = e.currentTarget;
    const testName = (form.elements.namedItem("testName") as HTMLSelectElement)
      .value;
    const testCategory = "Test";
    const date = (form.elements.namedItem("testDate") as HTMLInputElement)
      .value;
    const rate = parseFloat(
      (form.elements.namedItem("rate") as HTMLInputElement).value,
    );
    const notes = (form.elements.namedItem("notes") as HTMLInputElement).value;

    // Create new test
    const newTest: TreatmentTest = {
      id: `test-${Math.floor(Math.random() * 10000)}`,
      treatmentId: selectedTreatment?.id || "",
      testName,
      testCategory,
      date,
      rate,
      amount: rate,
      notes,
      status: "ordered",
      paymentStatus: "pending",
      paidAmount: 0,
    };

    setTreatmentTests([...treatmentTests, newTest]);
    setIsAddTestDialogOpen(false);
  };

  const handleTestPaymentSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedTest) return;

    const paymentAmount = parseFloat(
      (e.currentTarget.elements.namedItem("paymentAmount") as HTMLInputElement)
        .value,
    );
    const paymentMethod = (
      e.currentTarget.elements.namedItem("paymentMethod") as HTMLSelectElement
    ).value;

    // Update the test payment status
    const updatedTests = treatmentTests.map((test) => {
      if (test.id === selectedTest.id) {
        const newPaidAmount = test.paidAmount + paymentAmount;
        const newPaymentStatus =
          newPaidAmount >= test.amount
            ? "paid"
            : newPaidAmount > 0
              ? "partial"
              : "pending";

        return {
          ...test,
          paidAmount: newPaidAmount,
          paymentStatus: newPaymentStatus as "pending" | "partial" | "paid",
        };
      }
      return test;
    });

    setTreatmentTests(updatedTests);
    setIsTestPaymentDialogOpen(false);
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

  const getFilteredTests = (treatmentId: string) => {
    return treatmentTests.filter((test) => test.treatmentId === treatmentId);
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
    const testsTotal = getFilteredTests(treatmentId).reduce(
      (sum, test) => sum + test.amount,
      0,
    );
    return servicesTotal + medicationsTotal + testsTotal;
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
                    <TabsTrigger value="tests">Tests</TabsTrigger>
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
                    <Button size="sm" onClick={handleAddTest}>
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Add Test
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

                <TabsContent value="tests" className="mt-4">
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Test Name</TableHead>
                          <TableHead>Category</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead>Payment Status</TableHead>
                          <TableHead>Results</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {getFilteredTests(selectedTreatment.id).length > 0 ? (
                          getFilteredTests(selectedTreatment.id).map((test) => (
                            <TableRow key={test.id}>
                              <TableCell className="font-medium">
                                {test.testName}
                              </TableCell>
                              <TableCell>{test.testCategory}</TableCell>
                              <TableCell>
                                {new Date(test.date).toLocaleDateString()}
                              </TableCell>
                              <TableCell>
                                <span
                                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                                    test.status === "completed"
                                      ? "bg-green-100 text-green-800"
                                      : test.status === "in_progress"
                                        ? "bg-blue-100 text-blue-800"
                                        : test.status === "ordered"
                                          ? "bg-amber-100 text-amber-800"
                                          : "bg-red-100 text-red-800"
                                  }`}
                                >
                                  {test.status === "completed"
                                    ? "Completed"
                                    : test.status === "in_progress"
                                      ? "In Progress"
                                      : test.status === "ordered"
                                        ? "Ordered"
                                        : "Cancelled"}
                                </span>
                              </TableCell>
                              <TableCell>₹{test.amount.toFixed(2)}</TableCell>
                              <TableCell>
                                <span
                                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                                    test.paymentStatus === "paid"
                                      ? "bg-green-100 text-green-800"
                                      : test.paymentStatus === "partial"
                                        ? "bg-amber-100 text-amber-800"
                                        : "bg-red-100 text-red-800"
                                  }`}
                                >
                                  {test.paymentStatus === "paid"
                                    ? "Paid"
                                    : test.paymentStatus === "partial"
                                      ? `Partial (₹${test.paidAmount})`
                                      : "Pending"}
                                </span>
                              </TableCell>
                              <TableCell>
                                {test.results ? (
                                  <Button variant="ghost" size="sm">
                                    View Results
                                  </Button>
                                ) : (
                                  <span className="text-muted-foreground text-sm">
                                    Not available
                                  </span>
                                )}
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="flex justify-end space-x-1">
                                  {test.paymentStatus !== "paid" && (
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => handleTestPayment(test)}
                                      title="Make Payment"
                                    >
                                      <CreditCard className="h-4 w-4" />
                                    </Button>
                                  )}
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    title="Edit Test"
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    title="Delete Test"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={8} className="text-center py-4">
                              No tests ordered yet
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

      {/* Add Test Dialog */}
      <Dialog open={isAddTestDialogOpen} onOpenChange={setIsAddTestDialogOpen}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>Order Test</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSaveTest} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2 col-span-2">
                <Label htmlFor="testName">Test Name</Label>
                <select
                  id="testName"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  required
                >
                  <option value="">Select Test</option>
                  <option value="Complete Blood Count">
                    Complete Blood Count
                  </option>
                  <option value="Blood Glucose">Blood Glucose</option>
                  <option value="Liver Function Test">
                    Liver Function Test
                  </option>
                  <option value="Kidney Function Test">
                    Kidney Function Test
                  </option>
                  <option value="Thyroid Profile">Thyroid Profile</option>
                  <option value="Lipid Profile">Lipid Profile</option>
                  <option value="Urine Analysis">Urine Analysis</option>
                  <option value="ECG">ECG</option>
                  <option value="X-Ray">X-Ray</option>
                  <option value="Ultrasound">Ultrasound</option>
                  <option value="CT Scan">CT Scan</option>
                  <option value="MRI">MRI</option>
                  <option value="Biopsy">Biopsy</option>
                  <option value="Endoscopy">Endoscopy</option>
                  <option value="Colonoscopy">Colonoscopy</option>
                  <option value="Allergy Test">Allergy Test</option>
                  <option value="Hormone Panel">Hormone Panel</option>
                  <option value="Vitamin D Test">Vitamin D Test</option>
                  <option value="COVID-19 Test">COVID-19 Test</option>
                  <option value="Dengue Test">Dengue Test</option>
                  <option value="Malaria Test">Malaria Test</option>
                  <option value="Typhoid Test">Typhoid Test</option>
                  <option value="HbA1c">HbA1c</option>
                  <option value="Cardiac Markers">Cardiac Markers</option>
                  <option value="Stool Examination">Stool Examination</option>
                  <option value="Sputum Culture">Sputum Culture</option>
                  <option value="Blood Culture">Blood Culture</option>
                  <option value="Urine Culture">Urine Culture</option>
                  <option value="Wound Culture">Wound Culture</option>
                  <option value="Bone Density Test">Bone Density Test</option>
                  <option value="Mammography">Mammography</option>
                  <option value="Pap Smear">Pap Smear</option>
                  <option value="PSA Test">PSA Test</option>
                  <option value="Spirometry">Spirometry</option>
                  <option value="EEG">EEG</option>
                  <option value="EMG">EMG</option>
                  <option value="Audiometry">Audiometry</option>
                  <option value="Vision Test">Vision Test</option>
                  <option value="Stress Test">Stress Test</option>
                  <option value="Holter Monitoring">Holter Monitoring</option>
                  <option value="Genetic Testing">Genetic Testing</option>
                  <option value="Histopathology">Histopathology</option>
                  <option value="Cytology">Cytology</option>
                  <option value="Immunology Panel">Immunology Panel</option>
                  <option value="Microbiology Culture">
                    Microbiology Culture
                  </option>
                  <option value="Coagulation Profile">
                    Coagulation Profile
                  </option>
                  <option value="Electrolyte Panel">Electrolyte Panel</option>
                  <option value="Arterial Blood Gas">Arterial Blood Gas</option>
                  <option value="Toxicology Screen">Toxicology Screen</option>
                  <option value="Pregnancy Test">Pregnancy Test</option>
                  <option value="Fertility Panel">Fertility Panel</option>
                  <option value="Tumor Markers">Tumor Markers</option>
                  <option value="Anemia Panel">Anemia Panel</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="testDate">Date</Label>
                <Input
                  id="testDate"
                  type="date"
                  defaultValue={new Date().toISOString().split("T")[0]}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="rate">Rate (₹)</Label>
                <Input id="rate" type="number" min="0" step="0.01" required />
              </div>
              <div className="space-y-2 col-span-2">
                <Label htmlFor="notes">Notes</Label>
                <Input id="notes" placeholder="Additional notes" />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">
                <FlaskConical className="mr-2 h-4 w-4" />
                Order Test
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Test Payment Dialog */}
      <Dialog
        open={isTestPaymentDialogOpen}
        onOpenChange={setIsTestPaymentDialogOpen}
      >
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>Test Payment</DialogTitle>
          </DialogHeader>
          {selectedTest && (
            <form onSubmit={handleTestPaymentSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Test</Label>
                <div className="p-2 bg-muted rounded-md">
                  {selectedTest.testName}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Total Amount</Label>
                  <div className="p-2 bg-muted rounded-md">
                    ₹{selectedTest.amount.toLocaleString()}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Paid Amount</Label>
                  <div className="p-2 bg-muted rounded-md">
                    ₹{selectedTest.paidAmount.toLocaleString()}
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Balance Due</Label>
                <div className="p-2 bg-muted rounded-md font-medium">
                  ₹
                  {(
                    selectedTest.amount - selectedTest.paidAmount
                  ).toLocaleString()}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="paymentAmount">Payment Amount (₹)</Label>
                <Input
                  id="paymentAmount"
                  type="number"
                  min="1"
                  max={selectedTest.amount - selectedTest.paidAmount}
                  value={testPaymentAmount}
                  onChange={(e) => setTestPaymentAmount(Number(e.target.value))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="paymentMethod">Payment Method</Label>
                <select
                  id="paymentMethod"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  required
                >
                  <option value="">Select Payment Method</option>
                  <option value="cash">Cash</option>
                  <option value="card">Credit/Debit Card</option>
                  <option value="upi">UPI</option>
                  <option value="bank">Bank Transfer</option>
                  <option value="insurance">Insurance</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="paymentReference">
                  Reference/Transaction ID
                </Label>
                <Input
                  id="paymentReference"
                  placeholder="Enter reference or transaction ID"
                />
              </div>
              <DialogFooter>
                <Button type="submit">
                  <DollarSign className="mr-2 h-4 w-4" />
                  Process Payment
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PatientTreatment;
