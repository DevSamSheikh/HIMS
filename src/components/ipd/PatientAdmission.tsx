import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import SearchableSelect from "@/components/ui/searchable-select";
import { useToast } from "@/components/ui/use-toast";
import {
  BedDouble,
  User,
  Calendar,
  Clock,
  Building2,
  DoorClosed,
  Stethoscope,
  FileText,
  Save,
  Printer,
  ClipboardList,
} from "lucide-react";

const PatientAdmission = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("patient-info");

  // Mock data for patients
  const patients = [
    { id: "P-1001", name: "John Smith" },
    { id: "P-1002", name: "Emily Johnson" },
    { id: "P-1003", name: "Michael Brown" },
    { id: "P-1004", name: "Sarah Davis" },
    { id: "P-1005", name: "David Miller" },
  ];

  // Mock data for doctors
  const doctors = [
    { id: "D-1001", name: "Dr. Robert Wilson" },
    { id: "D-1002", name: "Dr. Jennifer Lee" },
    { id: "D-1003", name: "Dr. James Thompson" },
    { id: "D-1004", name: "Dr. Maria Garcia" },
    { id: "D-1005", name: "Dr. William Chen" },
  ];

  // Mock data for wards
  const wards = [
    { id: "ward-1", name: "General Ward" },
    { id: "ward-2", name: "Pediatric Ward" },
    { id: "ward-3", name: "Surgical Ward" },
    { id: "ward-4", name: "ICU" },
    { id: "ward-5", name: "Maternity Ward" },
  ];

  // Mock data for rooms
  const rooms = [
    { id: "room-1", name: "101", wardId: "ward-1" },
    { id: "room-2", name: "102", wardId: "ward-1" },
    { id: "room-3", name: "201", wardId: "ward-2" },
    { id: "room-4", name: "301", wardId: "ward-3" },
    { id: "room-5", name: "401", wardId: "ward-4" },
  ];

  // Mock data for beds
  const beds = [
    { id: "bed-1", name: "101-A", roomId: "room-1", status: "available" },
    { id: "bed-2", name: "101-B", roomId: "room-1", status: "occupied" },
    { id: "bed-3", name: "102-A", roomId: "room-2", status: "available" },
    { id: "bed-4", name: "201-A", roomId: "room-3", status: "available" },
    { id: "bed-5", name: "401-A", roomId: "room-5", status: "maintenance" },
  ];

  // Form state
  const [formData, setFormData] = useState({
    patientId: "",
    doctorId: "",
    wardId: "",
    roomId: "",
    bedId: "",
    admissionDate: new Date().toISOString().split("T")[0],
    admissionTime: new Date().toTimeString().split(" ")[0].substring(0, 5),
    expectedDischargeDays: "7",
    admissionType: "regular",
    admissionReason: "",
    initialDiagnosis: "",
    allergies: "",
    currentMedications: "",
    specialInstructions: "",
    emergencyContactName: "",
    emergencyContactRelation: "",
    emergencyContactPhone: "",
    paymentMethod: "cash",
    insuranceProvider: "",
    insurancePolicyNumber: "",
    insuranceAuthorizationCode: "",
    registrationFee: "1000",
    advancePayment: "5000",
    packageSelected: "none",
  });

  // Filter rooms based on selected ward
  const filteredRooms = rooms.filter((room) => {
    if (formData.wardId) {
      return room.wardId === formData.wardId;
    }
    return true;
  });

  // Filter beds based on selected room
  const filteredBeds = beds.filter((bed) => {
    if (formData.roomId) {
      return bed.roomId === formData.roomId && bed.status === "available";
    }
    return bed.status === "available";
  });

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => {
      const newData = { ...prev, [name]: value };

      // Reset dependent fields
      if (name === "wardId") {
        newData.roomId = "";
        newData.bedId = "";
      } else if (name === "roomId") {
        newData.bedId = "";
      }

      return newData;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted", formData);
    toast({
      title: "Success",
      description: "Patient admission processed successfully",
    });
  };

  return (
    <div className="container mx-auto py-6 space-y-6 max-w-7xl">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Patient Admission
          </h1>
          <p className="text-muted-foreground">
            Admit a new patient to the inpatient department
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => window.print()}>
            <Printer className="mr-2 h-4 w-4" />
            Print Form
          </Button>
          <Button type="submit" form="admission-form">
            <Save className="mr-2 h-4 w-4" />
            Save Admission
          </Button>
        </div>
      </div>

      <form id="admission-form" onSubmit={handleSubmit}>
        <Tabs
          defaultValue="patient-info"
          value={activeTab}
          onValueChange={setActiveTab}
        >
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="patient-info">
              <User className="mr-2 h-4 w-4" />
              Patient Information
            </TabsTrigger>
            <TabsTrigger value="medical-info">
              <Stethoscope className="mr-2 h-4 w-4" />
              Medical Information
            </TabsTrigger>
            <TabsTrigger value="bed-allocation">
              <BedDouble className="mr-2 h-4 w-4" />
              Bed Allocation
            </TabsTrigger>
            <TabsTrigger value="billing-info">
              <FileText className="mr-2 h-4 w-4" />
              Billing Information
            </TabsTrigger>
          </TabsList>

          <TabsContent value="patient-info" className="mt-6 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Patient Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="patientId">
                      Select Patient <span className="text-red-500">*</span>
                    </Label>
                    <SearchableSelect
                      label=""
                      options={patients}
                      value={formData.patientId}
                      onValueChange={(value) =>
                        handleSelectChange("patientId", value)
                      }
                      placeholder="Search for patient"
                      required
                      addNewLabel="Register New Patient"
                      onAddNew={() => {
                        toast({
                          title: "New Patient",
                          description:
                            "Redirecting to patient registration form...",
                        });
                      }}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="doctorId">
                      Attending Physician{" "}
                      <span className="text-red-500">*</span>
                    </Label>
                    <SearchableSelect
                      label=""
                      options={doctors}
                      value={formData.doctorId}
                      onValueChange={(value) =>
                        handleSelectChange("doctorId", value)
                      }
                      placeholder="Select doctor"
                      required
                    />
                  </div>
                </div>

                <Separator />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="admissionDate">
                      Admission Date <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="admissionDate"
                      name="admissionDate"
                      type="date"
                      value={formData.admissionDate}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="admissionTime">
                      Admission Time <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="admissionTime"
                      name="admissionTime"
                      type="time"
                      value={formData.admissionTime}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="admissionType">
                      Admission Type <span className="text-red-500">*</span>
                    </Label>
                    <select
                      id="admissionType"
                      name="admissionType"
                      value={formData.admissionType}
                      onChange={handleInputChange}
                      className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                      required
                    >
                      <option value="regular">Regular</option>
                      <option value="emergency">Emergency</option>
                      <option value="transfer">Transfer</option>
                      <option value="day-care">Day Care</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="expectedDischargeDays">
                      Expected Stay (Days)
                    </Label>
                    <Input
                      id="expectedDischargeDays"
                      name="expectedDischargeDays"
                      type="number"
                      min="1"
                      value={formData.expectedDischargeDays}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="admissionReason">
                    Reason for Admission <span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    id="admissionReason"
                    name="admissionReason"
                    value={formData.admissionReason}
                    onChange={handleInputChange}
                    placeholder="Describe the reason for admission"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>Emergency Contact Information</Label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Input
                      id="emergencyContactName"
                      name="emergencyContactName"
                      placeholder="Contact Name"
                      value={formData.emergencyContactName}
                      onChange={handleInputChange}
                    />
                    <Input
                      id="emergencyContactRelation"
                      name="emergencyContactRelation"
                      placeholder="Relationship"
                      value={formData.emergencyContactRelation}
                      onChange={handleInputChange}
                    />
                    <Input
                      id="emergencyContactPhone"
                      name="emergencyContactPhone"
                      placeholder="Phone Number"
                      value={formData.emergencyContactPhone}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="medical-info" className="mt-6 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Medical Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="initialDiagnosis">
                    Initial Diagnosis <span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    id="initialDiagnosis"
                    name="initialDiagnosis"
                    value={formData.initialDiagnosis}
                    onChange={handleInputChange}
                    placeholder="Enter initial diagnosis"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="allergies">Allergies</Label>
                  <Textarea
                    id="allergies"
                    name="allergies"
                    value={formData.allergies}
                    onChange={handleInputChange}
                    placeholder="List any allergies"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="currentMedications">
                    Current Medications
                  </Label>
                  <Textarea
                    id="currentMedications"
                    name="currentMedications"
                    value={formData.currentMedications}
                    onChange={handleInputChange}
                    placeholder="List current medications"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="specialInstructions">
                    Special Instructions
                  </Label>
                  <Textarea
                    id="specialInstructions"
                    name="specialInstructions"
                    value={formData.specialInstructions}
                    onChange={handleInputChange}
                    placeholder="Any special instructions for care"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="bed-allocation" className="mt-6 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Bed Allocation</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="wardId">
                      Select Ward <span className="text-red-500">*</span>
                    </Label>
                    <SearchableSelect
                      label=""
                      options={wards}
                      value={formData.wardId}
                      onValueChange={(value) =>
                        handleSelectChange("wardId", value)
                      }
                      placeholder="Select ward"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="roomId">
                      Select Room <span className="text-red-500">*</span>
                    </Label>
                    <SearchableSelect
                      label=""
                      options={filteredRooms}
                      value={formData.roomId}
                      onValueChange={(value) =>
                        handleSelectChange("roomId", value)
                      }
                      placeholder="Select room"
                      required
                      disabled={!formData.wardId}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bedId">
                      Select Bed <span className="text-red-500">*</span>
                    </Label>
                    <SearchableSelect
                      label=""
                      options={filteredBeds}
                      value={formData.bedId}
                      onValueChange={(value) =>
                        handleSelectChange("bedId", value)
                      }
                      placeholder="Select bed"
                      required
                      disabled={!formData.roomId}
                    />
                  </div>
                </div>

                {formData.wardId && formData.roomId && formData.bedId && (
                  <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-md">
                    <h3 className="text-lg font-semibold mb-2">
                      Selected Allocation
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm font-medium">Ward</p>
                        <p className="text-sm text-muted-foreground">
                          {wards.find((w) => w.id === formData.wardId)?.name}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Room</p>
                        <p className="text-sm text-muted-foreground">
                          {rooms.find((r) => r.id === formData.roomId)?.name}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Bed</p>
                        <p className="text-sm text-muted-foreground">
                          {beds.find((b) => b.id === formData.bedId)?.name}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="mt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      toast({
                        title: "Bed Allocation",
                        description: "Redirecting to bed allocation view...",
                      });
                    }}
                  >
                    <BedDouble className="mr-2 h-4 w-4" />
                    View Bed Availability
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="billing-info" className="mt-6 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Billing Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="paymentMethod">
                      Payment Method <span className="text-red-500">*</span>
                    </Label>
                    <select
                      id="paymentMethod"
                      name="paymentMethod"
                      value={formData.paymentMethod}
                      onChange={handleInputChange}
                      className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                      required
                    >
                      <option value="cash">Cash</option>
                      <option value="card">Credit/Debit Card</option>
                      <option value="insurance">Insurance</option>
                      <option value="corporate">Corporate</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="packageSelected">Package Selection</Label>
                    <select
                      id="packageSelected"
                      name="packageSelected"
                      value={formData.packageSelected}
                      onChange={handleInputChange}
                      className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="none">No Package</option>
                      <option value="basic">Basic Care Package</option>
                      <option value="standard">Standard Care Package</option>
                      <option value="premium">Premium Care Package</option>
                      <option value="maternity">Maternity Package</option>
                      <option value="surgery">Surgical Package</option>
                    </select>
                  </div>
                </div>

                {formData.paymentMethod === "insurance" && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="insuranceProvider">
                        Insurance Provider{" "}
                        <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="insuranceProvider"
                        name="insuranceProvider"
                        value={formData.insuranceProvider}
                        onChange={handleInputChange}
                        required={formData.paymentMethod === "insurance"}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="insurancePolicyNumber">
                        Policy Number <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="insurancePolicyNumber"
                        name="insurancePolicyNumber"
                        value={formData.insurancePolicyNumber}
                        onChange={handleInputChange}
                        required={formData.paymentMethod === "insurance"}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="insuranceAuthorizationCode">
                        Authorization Code
                      </Label>
                      <Input
                        id="insuranceAuthorizationCode"
                        name="insuranceAuthorizationCode"
                        value={formData.insuranceAuthorizationCode}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                )}

                <Separator />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="registrationFee">
                      Registration Fee (₹){" "}
                      <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="registrationFee"
                      name="registrationFee"
                      type="number"
                      min="0"
                      value={formData.registrationFee}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="advancePayment">
                      Advance Payment (₹){" "}
                      <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="advancePayment"
                      name="advancePayment"
                      type="number"
                      min="0"
                      value={formData.advancePayment}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-md">
                  <h3 className="text-lg font-semibold mb-2">
                    Payment Summary
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Registration Fee:</span>
                      <span>
                        ₹{parseInt(formData.registrationFee).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Advance Payment:</span>
                      <span>
                        ₹{parseInt(formData.advancePayment).toLocaleString()}
                      </span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-bold">
                      <span>Total Initial Payment:</span>
                      <span>
                        ₹
                        {(
                          parseInt(formData.registrationFee) +
                          parseInt(formData.advancePayment)
                        ).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end space-x-2">
              <Button type="submit" size="lg">
                <Save className="mr-2 h-4 w-4" />
                Complete Admission
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </form>
    </div>
  );
};

export default PatientAdmission;
