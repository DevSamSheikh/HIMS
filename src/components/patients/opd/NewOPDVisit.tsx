import React, { useState, useEffect } from "react";
import { generateTokenNumber } from "@/utils/tokenGenerator";
import TokenPrintModal from "../TokenPrintModal";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Patient, OPDVisit, Doctor } from "../types";
import { Search, UserPlus } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface NewOPDVisitProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (visit: OPDVisit) => void;
  patientId?: string;
}

const NewOPDVisit: React.FC<NewOPDVisitProps> = ({
  isOpen,
  onClose,
  onSuccess,
  patientId,
}) => {
  const [activeTab, setActiveTab] = useState<string>("patient");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [selectedDoctor, setSelectedDoctor] = useState<string>("");
  const [visitType, setVisitType] = useState<"First" | "Follow-up">("First");
  const [chiefComplaint, setChiefComplaint] = useState<string>("");
  const [vitalSigns, setVitalSigns] = useState({
    temperature: "",
    bloodPressure: "",
    pulseRate: "",
    respiratoryRate: "",
    oxygenSaturation: "",
    height: "",
    weight: "",
  });
  const [fee, setFee] = useState<number>(0);
  const [paymentStatus, setPaymentStatus] = useState<
    "Paid" | "Pending" | "Waived"
  >("Pending");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [tokenPrintModalOpen, setTokenPrintModalOpen] =
    useState<boolean>(false);
  const [tokenData, setTokenData] = useState<any>(null);

  // Sample patients data
  const patients: Patient[] = [
    {
      id: "1",
      mrNumber: "MR-2023-0001",
      name: "John Smith",
      age: 45,
      gender: "Male",
      contact: "+92 300 1234567",
      address: "123 Main St, Karachi",
      registrationDate: "2023-01-15",
      patientType: ["OPD", "IPD"],
      lastVisit: "2023-06-20",
      bloodGroup: "O+",
    },
    {
      id: "2",
      mrNumber: "MR-2023-0002",
      name: "Sarah Johnson",
      age: 32,
      gender: "Female",
      contact: "+92 321 9876543",
      address: "456 Park Ave, Lahore",
      registrationDate: "2023-02-10",
      patientType: ["OPD"],
      lastVisit: "2023-07-05",
      bloodGroup: "A+",
    },
    {
      id: "3",
      mrNumber: "MR-2023-0003",
      name: "Ahmed Khan",
      age: 60,
      gender: "Male",
      contact: "+92 333 5556666",
      address: "789 Hospital Road, Islamabad",
      registrationDate: "2023-03-22",
      patientType: ["IPD"],
      lastVisit: "2023-05-18",
      bloodGroup: "B-",
    },
    {
      id: "4",
      mrNumber: "MR-2023-0004",
      name: "Fatima Ali",
      age: 28,
      gender: "Female",
      contact: "+92 345 1112222",
      address: "101 Green Town, Faisalabad",
      registrationDate: "2023-04-05",
      patientType: ["OPD", "IPD"],
      lastVisit: "2023-07-10",
      bloodGroup: "AB+",
    },
    {
      id: "5",
      mrNumber: "MR-2023-0005",
      name: "Mohammad Raza",
      age: 52,
      gender: "Male",
      contact: "+92 312 3334444",
      address: "222 Blue Area, Peshawar",
      registrationDate: "2023-05-17",
      patientType: ["OPD"],
      lastVisit: "2023-06-30",
      bloodGroup: "O-",
    },
  ];

  // Sample doctors data
  const doctors: Doctor[] = [
    {
      id: "D1",
      name: "Dr. Ahmed Khan",
      specialization: "Cardiologist",
      department: "Cardiology",
      firstVisitFee: 2000,
      followUpFee: 1000,
      availableDays: ["Monday", "Wednesday", "Friday"],
      availableTimeSlots: [
        { day: "Monday", startTime: "09:00", endTime: "13:00" },
        { day: "Wednesday", startTime: "14:00", endTime: "18:00" },
        { day: "Friday", startTime: "10:00", endTime: "15:00" },
      ],
    },
    {
      id: "D2",
      name: "Dr. Fatima Ali",
      specialization: "Dermatologist",
      department: "Dermatology",
      firstVisitFee: 1800,
      followUpFee: 1000,
      availableDays: ["Tuesday", "Thursday", "Saturday"],
      availableTimeSlots: [
        { day: "Tuesday", startTime: "10:00", endTime: "14:00" },
        { day: "Thursday", startTime: "15:00", endTime: "19:00" },
        { day: "Saturday", startTime: "09:00", endTime: "13:00" },
      ],
    },
    {
      id: "D3",
      name: "Dr. Zainab Malik",
      specialization: "Orthopedic Surgeon",
      department: "Orthopedics",
      firstVisitFee: 2500,
      followUpFee: 1500,
      availableDays: ["Monday", "Thursday", "Saturday"],
      availableTimeSlots: [
        { day: "Monday", startTime: "14:00", endTime: "18:00" },
        { day: "Thursday", startTime: "09:00", endTime: "13:00" },
        { day: "Saturday", startTime: "14:00", endTime: "17:00" },
      ],
    },
    {
      id: "D4",
      name: "Dr. Imran Shah",
      specialization: "ENT Specialist",
      department: "ENT",
      firstVisitFee: 1500,
      followUpFee: 1000,
      availableDays: ["Tuesday", "Wednesday", "Friday"],
      availableTimeSlots: [
        { day: "Tuesday", startTime: "09:00", endTime: "13:00" },
        { day: "Wednesday", startTime: "14:00", endTime: "18:00" },
        { day: "Friday", startTime: "09:00", endTime: "13:00" },
      ],
    },
    {
      id: "D5",
      name: "Dr. Saima Nawaz",
      specialization: "General Physician",
      department: "General Medicine",
      firstVisitFee: 1200,
      followUpFee: 800,
      availableDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      availableTimeSlots: [
        { day: "Monday", startTime: "09:00", endTime: "17:00" },
        { day: "Tuesday", startTime: "09:00", endTime: "17:00" },
        { day: "Wednesday", startTime: "09:00", endTime: "17:00" },
        { day: "Thursday", startTime: "09:00", endTime: "17:00" },
        { day: "Friday", startTime: "09:00", endTime: "17:00" },
      ],
    },
  ];

  // Handle form submission
  const handleSubmit = () => {
    // Validate required fields
    const newErrors: Record<string, string> = {};

    if (!selectedPatient && activeTab === "patient") {
      newErrors.patient = "Please select a patient";
    }

    if (!selectedDoctor) {
      newErrors.doctor = "Please select a doctor";
    }

    if (!chiefComplaint) {
      newErrors.chiefComplaint = "Please enter chief complaint";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Generate token number
    const tokenNumber = generateTokenNumber();

    // Create new OPD visit object
    const newVisit: OPDVisit = {
      id: `OPD-${Date.now()}`,
      patientId: selectedPatient?.id || patientId || "",
      patientName: selectedPatient?.name || "",
      mrNumber: selectedPatient?.mrNumber || "",
      doctorId: selectedDoctor,
      doctorName: doctors.find((d) => d.id === selectedDoctor)?.name || "",
      department:
        doctors.find((d) => d.id === selectedDoctor)?.department || "",
      visitDate: new Date().toISOString(),
      visitType,
      chiefComplaint,
      vitalSigns,
      fee,
      paymentStatus,
      status: "Waiting",
      tokenNumber: tokenNumber,
    };

    // Prepare token data for printing
    const now = new Date();
    const selectedDoc = doctors.find((d) => d.id === selectedDoctor);

    setTokenData({
      tokenNumber: tokenNumber,
      patientName: selectedPatient?.name || "",
      mrNumber: selectedPatient?.mrNumber || "",
      department: selectedDoc?.department || "",
      doctorName: selectedDoc?.name || "",
      date: now.toLocaleDateString(),
      time: now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    });

    onSuccess(newVisit);

    // Show token print modal
    setTokenPrintModalOpen(true);
  };

  // Filter patients based on search query
  const filteredPatients = patients.filter(
    (patient) =>
      patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.mrNumber.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // Find selected doctor
  const doctor = doctors.find((d) => d.id === selectedDoctor);

  // Update fee based on selected doctor and visit type
  useEffect(() => {
    if (doctor) {
      setFee(visitType === "First" ? doctor.firstVisitFee : doctor.followUpFee);
    }
  }, [doctor, visitType]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>New OPD Visit</DialogTitle>
          <DialogDescription>
            Register a new outpatient department visit
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="patient">Patient Information</TabsTrigger>
            <TabsTrigger value="visit">Visit Details</TabsTrigger>
          </TabsList>

          <TabsContent value="patient" className="space-y-4 mt-4">
            {!patientId && (
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search patients by name or MR number"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-8"
                    />
                  </div>
                  <Button variant="outline">
                    <UserPlus className="mr-2 h-4 w-4" />
                    New Patient
                  </Button>
                </div>

                <div className="border rounded-md overflow-hidden">
                  <div className="grid grid-cols-12 bg-muted py-2 px-4 text-sm font-medium">
                    <div className="col-span-2">MR Number</div>
                    <div className="col-span-3">Name</div>
                    <div className="col-span-1">Age</div>
                    <div className="col-span-2">Gender</div>
                    <div className="col-span-2">Contact</div>
                    <div className="col-span-2">Last Visit</div>
                  </div>

                  <div className="max-h-[300px] overflow-y-auto">
                    {filteredPatients.length > 0 ? (
                      filteredPatients.map((patient) => (
                        <div
                          key={patient.id}
                          className={`grid grid-cols-12 py-3 px-4 text-sm border-b cursor-pointer hover:bg-muted/50 ${selectedPatient?.id === patient.id ? "bg-muted/50" : ""}`}
                          onClick={() => setSelectedPatient(patient)}
                        >
                          <div className="col-span-2">{patient.mrNumber}</div>
                          <div className="col-span-3 font-medium">
                            {patient.name}
                          </div>
                          <div className="col-span-1">{patient.age}</div>
                          <div className="col-span-2">{patient.gender}</div>
                          <div className="col-span-2">{patient.contact}</div>
                          <div className="col-span-2">{patient.lastVisit}</div>
                        </div>
                      ))
                    ) : (
                      <div className="py-8 text-center text-muted-foreground">
                        No patients found matching your search
                      </div>
                    )}
                  </div>
                </div>

                {errors.patient && (
                  <p className="text-sm text-destructive">{errors.patient}</p>
                )}

                {selectedPatient && (
                  <div className="bg-muted/50 p-4 rounded-md">
                    <h3 className="font-medium mb-2">Selected Patient</h3>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-muted-foreground">Name:</span>{" "}
                        {selectedPatient.name}
                      </div>
                      <div>
                        <span className="text-muted-foreground">
                          MR Number:
                        </span>{" "}
                        {selectedPatient.mrNumber}
                      </div>
                      <div>
                        <span className="text-muted-foreground">Age:</span>{" "}
                        {selectedPatient.age}
                      </div>
                      <div>
                        <span className="text-muted-foreground">Gender:</span>{" "}
                        {selectedPatient.gender}
                      </div>
                      <div>
                        <span className="text-muted-foreground">Contact:</span>{" "}
                        {selectedPatient.contact}
                      </div>
                      <div>
                        <span className="text-muted-foreground">
                          Blood Group:
                        </span>{" "}
                        {selectedPatient.bloodGroup}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </TabsContent>

          <TabsContent value="visit" className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="doctor">Doctor</Label>
                  <Select
                    value={selectedDoctor}
                    onValueChange={setSelectedDoctor}
                  >
                    <SelectTrigger id="doctor">
                      <SelectValue placeholder="Select doctor" />
                    </SelectTrigger>
                    <SelectContent>
                      {doctors.map((doctor) => (
                        <SelectItem key={doctor.id} value={doctor.id}>
                          {doctor.name} - {doctor.specialization}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.doctor && (
                    <p className="text-sm text-destructive">{errors.doctor}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Visit Type</Label>
                  <RadioGroup
                    value={visitType}
                    onValueChange={(value) =>
                      setVisitType(value as "First" | "Follow-up")
                    }
                    className="flex space-x-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="First" id="first" />
                      <Label htmlFor="first">First Visit</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Follow-up" id="followup" />
                      <Label htmlFor="followup">Follow-up</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="chiefComplaint">Chief Complaint</Label>
                  <Textarea
                    id="chiefComplaint"
                    value={chiefComplaint}
                    onChange={(e) => setChiefComplaint(e.target.value)}
                    rows={3}
                  />
                  {errors.chiefComplaint && (
                    <p className="text-sm text-destructive">
                      {errors.chiefComplaint}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Payment</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label
                        htmlFor="fee"
                        className="text-xs text-muted-foreground"
                      >
                        Fee Amount
                      </Label>
                      <Input
                        id="fee"
                        type="number"
                        value={fee}
                        onChange={(e) => setFee(Number(e.target.value))}
                      />
                    </div>
                    <div>
                      <Label
                        htmlFor="paymentStatus"
                        className="text-xs text-muted-foreground"
                      >
                        Payment Status
                      </Label>
                      <Select
                        value={paymentStatus}
                        onValueChange={(value) =>
                          setPaymentStatus(
                            value as "Paid" | "Pending" | "Waived",
                          )
                        }
                      >
                        <SelectTrigger id="paymentStatus">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Paid">Paid</SelectItem>
                          <SelectItem value="Pending">Pending</SelectItem>
                          <SelectItem value="Waived">Waived</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label className="block mb-2">Vital Signs</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label
                        htmlFor="temperature"
                        className="text-xs text-muted-foreground"
                      >
                        Temperature (°C)
                      </Label>
                      <Input
                        id="temperature"
                        value={vitalSigns.temperature}
                        onChange={(e) =>
                          setVitalSigns({
                            ...vitalSigns,
                            temperature: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="bloodPressure"
                        className="text-xs text-muted-foreground"
                      >
                        Blood Pressure (mmHg)
                      </Label>
                      <Input
                        id="bloodPressure"
                        value={vitalSigns.bloodPressure}
                        onChange={(e) =>
                          setVitalSigns({
                            ...vitalSigns,
                            bloodPressure: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="pulseRate"
                        className="text-xs text-muted-foreground"
                      >
                        Pulse Rate (bpm)
                      </Label>
                      <Input
                        id="pulseRate"
                        value={vitalSigns.pulseRate}
                        onChange={(e) =>
                          setVitalSigns({
                            ...vitalSigns,
                            pulseRate: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="respiratoryRate"
                        className="text-xs text-muted-foreground"
                      >
                        Respiratory Rate
                      </Label>
                      <Input
                        id="respiratoryRate"
                        value={vitalSigns.respiratoryRate}
                        onChange={(e) =>
                          setVitalSigns({
                            ...vitalSigns,
                            respiratoryRate: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="oxygenSaturation"
                        className="text-xs text-muted-foreground"
                      >
                        Oxygen Saturation (%)
                      </Label>
                      <Input
                        id="oxygenSaturation"
                        value={vitalSigns.oxygenSaturation}
                        onChange={(e) =>
                          setVitalSigns({
                            ...vitalSigns,
                            oxygenSaturation: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="height"
                        className="text-xs text-muted-foreground"
                      >
                        Height (cm)
                      </Label>
                      <Input
                        id="height"
                        value={vitalSigns.height}
                        onChange={(e) =>
                          setVitalSigns({
                            ...vitalSigns,
                            height: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="weight"
                        className="text-xs text-muted-foreground"
                      >
                        Weight (kg)
                      </Label>
                      <Input
                        id="weight"
                        value={vitalSigns.weight}
                        onChange={(e) =>
                          setVitalSigns({
                            ...vitalSigns,
                            weight: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Save Visit</Button>
        </DialogFooter>
      </DialogContent>

      {/* Token Print Modal */}
      {tokenPrintModalOpen && tokenData && (
        <TokenPrintModal
          isOpen={tokenPrintModalOpen}
          onClose={() => {
            setTokenPrintModalOpen(false);
            onClose();
          }}
          tokenData={tokenData}
        />
      )}
    </Dialog>
  );
};

export default NewOPDVisit;
