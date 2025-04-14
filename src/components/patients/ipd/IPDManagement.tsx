import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search,
  Plus,
  BedDouble,
  Filter,
  Calendar,
  User,
  ClipboardList,
  FileText,
  CreditCard,
  ArrowRightLeft,
  LogOut,
  Clipboard,
  CheckCircle,
  X,
  AlertCircle,
  Printer,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import { generateMRNumber } from "@/utils/mrNumberGenerator";
import DischargeSlip from "./DischargeSlip";

interface IPDManagementProps {
  searchQuery: string;
  isInPatientManagement?: boolean;
}

interface Admission {
  id: string;
  patientName: string;
  patientId: string;
  mrNumber: string;
  admissionDate: string;
  ward: string;
  bed: string;
  doctor: string;
  status: string;
  diagnosis?: string;
  notes?: string;
  registrationFee?: number;
  paymentStatus?: string;
}

interface Ward {
  id: string;
  name: string;
  totalBeds: number;
  occupiedBeds: number;
  availableBeds: number;
  bedDetails?: Array<{
    id: string;
    number: string;
    isOccupied: boolean;
    patientName?: string;
    patientId?: string;
  }>;
}

interface Transfer {
  id: string;
  patientName: string;
  patientId: string;
  fromWard: string;
  fromBed: string;
  toWard: string;
  toBed: string;
  date: string;
  reason: string;
  status: string;
}

interface Discharge {
  id: string;
  patientName: string;
  patientId: string;
  admissionDate: string;
  dischargeDate: string;
  ward: string;
  bed: string;
  doctor: string;
  reason: string;
  status: string;
  dischargeType?: string;
  notes?: string;
  diagnosis?: string;
  treatmentSummary?: string;
  followUpDate?: string;
  medications?: string[];
}

const IPDManagement: React.FC<IPDManagementProps> = ({
  searchQuery,
  isInPatientManagement = false,
}) => {
  const [activeTab, setActiveTab] = useState<string>("admissions");
  const [isAdmissionDialogOpen, setIsAdmissionDialogOpen] = useState(false);
  const [isTransferDialogOpen, setIsTransferDialogOpen] = useState(false);
  const [isDischargeDialogOpen, setIsDischargeDialogOpen] = useState(false);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [isPrintAdmissionDialogOpen, setIsPrintAdmissionDialogOpen] =
    useState(false);
  const [patientSearchQuery, setPatientSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<
    Array<{ id: string; name: string; mrNumber: string }>
  >([]);
  const [selectedPatient, setSelectedPatient] = useState<{
    id: string;
    name: string;
    mrNumber: string;
  } | null>(null);
  const [selectedWard, setSelectedWard] = useState<string>("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [selectedAdmission, setSelectedAdmission] = useState<Admission | null>(
    null,
  );
  const [registrationFee, setRegistrationFee] = useState<string>("1000");
  const [paymentMethod, setPaymentMethod] = useState<string>("cash");
  const [transferReason, setTransferReason] = useState<string>("");
  const [dischargeReason, setDischargeReason] = useState<string>("");
  const [dischargeNotes, setDischargeNotes] = useState<string>("");
  const [dischargeType, setDischargeType] = useState<string>("normal");

  // Sample patient data for search
  const [patients, setPatients] = useState([
    {
      id: "P10023",
      name: "John Doe",
      mrNumber: "MR-2023-0001",
      age: 45,
      gender: "Male",
      contact: "9876543210",
    },
    {
      id: "P10045",
      name: "Jane Smith",
      mrNumber: "MR-2023-0002",
      age: 32,
      gender: "Female",
      contact: "8765432109",
    },
    {
      id: "P10067",
      name: "Robert Brown",
      mrNumber: "MR-2023-0003",
      age: 58,
      gender: "Male",
      contact: "7654321098",
    },
    {
      id: "P10089",
      name: "Emily Davis",
      mrNumber: "MR-2023-0004",
      age: 27,
      gender: "Female",
      contact: "6543210987",
    },
    {
      id: "P10112",
      name: "Michael Wilson",
      mrNumber: "MR-2023-0005",
      age: 39,
      gender: "Male",
      contact: "5432109876",
    },
    {
      id: "P10134",
      name: "Sarah Johnson",
      mrNumber: "MR-2023-0006",
      age: 41,
      gender: "Female",
      contact: "4321098765",
    },
    {
      id: "P10156",
      name: "James Rodriguez",
      mrNumber: "MR-2023-0007",
      age: 52,
      gender: "Male",
      contact: "3210987654",
    },
    {
      id: "P10178",
      name: "Lisa Taylor",
      mrNumber: "MR-2023-0008",
      age: 36,
      gender: "Female",
      contact: "2109876543",
    },
    {
      id: "P10190",
      name: "David Miller",
      mrNumber: "MR-2023-0009",
      age: 48,
      gender: "Male",
      contact: "1098765432",
    },
    {
      id: "P10203",
      name: "Jennifer White",
      mrNumber: "MR-2023-0010",
      age: 29,
      gender: "Female",
      contact: "0987654321",
    },
  ]);

  // Sample data for demonstration
  const [admissions, setAdmissions] = useState<Admission[]>([
    {
      id: "IPD001",
      patientName: "John Doe",
      patientId: "P10023",
      mrNumber: "MR-2023-0001",
      admissionDate: "2023-10-15",
      ward: "General Ward",
      bed: "G-12",
      doctor: "Dr. Smith",
      status: "Active",
      diagnosis: "Pneumonia",
      notes: "Patient responding well to antibiotics",
      registrationFee: 1000,
      paymentStatus: "Paid",
    },
    {
      id: "IPD002",
      patientName: "Jane Smith",
      patientId: "P10045",
      mrNumber: "MR-2023-0002",
      admissionDate: "2023-10-14",
      ward: "Private Room",
      bed: "PR-03",
      doctor: "Dr. Johnson",
      status: "Active",
      diagnosis: "Post-operative care",
      notes: "Recovering from appendectomy",
      registrationFee: 2000,
      paymentStatus: "Paid",
    },
    {
      id: "IPD003",
      patientName: "Robert Brown",
      patientId: "P10067",
      mrNumber: "MR-2023-0003",
      admissionDate: "2023-10-10",
      ward: "ICU",
      bed: "ICU-05",
      doctor: "Dr. Williams",
      status: "Critical",
      diagnosis: "Myocardial infarction",
      notes: "Requires continuous monitoring",
      registrationFee: 5000,
      paymentStatus: "Pending",
    },
    {
      id: "IPD004",
      patientName: "Emily Davis",
      patientId: "P10089",
      mrNumber: "MR-2023-0004",
      admissionDate: "2023-10-08",
      ward: "General Ward",
      bed: "G-15",
      doctor: "Dr. Smith",
      status: "Stable",
      diagnosis: "Viral infection",
      notes: "Fever subsiding, continue IV fluids",
      registrationFee: 1000,
      paymentStatus: "Paid",
    },
    {
      id: "IPD005",
      patientName: "Michael Wilson",
      patientId: "P10112",
      mrNumber: "MR-2023-0005",
      admissionDate: "2023-10-05",
      ward: "Private Room",
      bed: "PR-07",
      doctor: "Dr. Johnson",
      status: "Discharged",
      diagnosis: "Fractured femur",
      notes: "Discharged with follow-up appointment in 2 weeks",
      registrationFee: 2000,
      paymentStatus: "Paid",
    },
  ]);

  const [wards, setWards] = useState<Ward[]>([
    {
      id: "GW",
      name: "General Ward",
      totalBeds: 30,
      occupiedBeds: 22,
      availableBeds: 8,
      bedDetails: Array.from({ length: 30 }, (_, i) => ({
        id: `GW-${(i + 1).toString().padStart(2, "0")}`,
        number: `G-${(i + 1).toString().padStart(2, "0")}`,
        isOccupied: i < 22,
        patientName: i < 22 ? `Patient ${i + 1}` : undefined,
        patientId: i < 22 ? `P${10000 + i}` : undefined,
      })),
    },
    {
      id: "PR",
      name: "Private Room",
      totalBeds: 15,
      occupiedBeds: 10,
      availableBeds: 5,
      bedDetails: Array.from({ length: 15 }, (_, i) => ({
        id: `PR-${(i + 1).toString().padStart(2, "0")}`,
        number: `PR-${(i + 1).toString().padStart(2, "0")}`,
        isOccupied: i < 10,
        patientName: i < 10 ? `VIP Patient ${i + 1}` : undefined,
        patientId: i < 10 ? `P${20000 + i}` : undefined,
      })),
    },
    {
      id: "ICU",
      name: "Intensive Care Unit",
      totalBeds: 10,
      occupiedBeds: 7,
      availableBeds: 3,
      bedDetails: Array.from({ length: 10 }, (_, i) => ({
        id: `ICU-${(i + 1).toString().padStart(2, "0")}`,
        number: `ICU-${(i + 1).toString().padStart(2, "0")}`,
        isOccupied: i < 7,
        patientName: i < 7 ? `Critical Patient ${i + 1}` : undefined,
        patientId: i < 7 ? `P${30000 + i}` : undefined,
      })),
    },
    {
      id: "CCU",
      name: "Critical Care Unit",
      totalBeds: 8,
      occupiedBeds: 5,
      availableBeds: 3,
      bedDetails: Array.from({ length: 8 }, (_, i) => ({
        id: `CCU-${(i + 1).toString().padStart(2, "0")}`,
        number: `CCU-${(i + 1).toString().padStart(2, "0")}`,
        isOccupied: i < 5,
        patientName: i < 5 ? `Cardiac Patient ${i + 1}` : undefined,
        patientId: i < 5 ? `P${40000 + i}` : undefined,
      })),
    },
    {
      id: "PW",
      name: "Pediatric Ward",
      totalBeds: 20,
      occupiedBeds: 12,
      availableBeds: 8,
      bedDetails: Array.from({ length: 20 }, (_, i) => ({
        id: `PW-${(i + 1).toString().padStart(2, "0")}`,
        number: `PW-${(i + 1).toString().padStart(2, "0")}`,
        isOccupied: i < 12,
        patientName: i < 12 ? `Child Patient ${i + 1}` : undefined,
        patientId: i < 12 ? `P${50000 + i}` : undefined,
      })),
    },
  ]);

  const [transfers, setTransfers] = useState<Transfer[]>([
    {
      id: "T001",
      patientName: "John Doe",
      patientId: "P10023",
      fromWard: "General Ward",
      fromBed: "G-10",
      toWard: "General Ward",
      toBed: "G-12",
      date: "2023-10-14",
      reason: "Patient requested quieter location",
      status: "Completed",
    },
    {
      id: "T002",
      patientName: "Robert Brown",
      patientId: "P10067",
      fromWard: "General Ward",
      fromBed: "G-05",
      toWard: "ICU",
      toBed: "ICU-05",
      date: "2023-10-10",
      reason: "Patient condition deteriorated, requires intensive care",
      status: "Completed",
    },
    {
      id: "T003",
      patientName: "Sarah Johnson",
      patientId: "P10045",
      fromWard: "ICU",
      fromBed: "ICU-02",
      toWard: "Private Room",
      toBed: "PR-03",
      date: "2023-10-12",
      reason: "Patient condition improved, no longer requires ICU",
      status: "Completed",
    },
  ]);

  const [discharges, setDischarges] = useState<Discharge[]>([
    {
      id: "D001",
      patientName: "Michael Wilson",
      patientId: "P10112",
      admissionDate: "2023-10-05",
      dischargeDate: "2023-10-12",
      ward: "Private Room",
      bed: "PR-07",
      doctor: "Dr. Johnson",
      reason: "Patient has recovered fully",
      status: "Completed",
      dischargeType: "Normal Discharge",
      notes:
        "Patient advised to rest for 2 weeks and avoid strenuous activities.",
      diagnosis: "Fractured femur",
      treatmentSummary:
        "Surgical fixation of femur fracture with intramedullary nail. Post-operative care included physiotherapy and pain management.",
      followUpDate: "2023-10-26",
      medications: [
        "Acetaminophen 500mg three times daily for 7 days",
        "Calcium supplements once daily for 30 days",
      ],
    },
    {
      id: "D002",
      patientName: "Lisa Taylor",
      patientId: "P10078",
      admissionDate: "2023-10-03",
      dischargeDate: "2023-10-09",
      ward: "General Ward",
      bed: "G-22",
      doctor: "Dr. Smith",
      reason: "Treatment completed, follow-up in 2 weeks",
      status: "Completed",
      dischargeType: "Normal Discharge",
      notes:
        "Patient showing good recovery. Advised to continue medications as prescribed.",
      diagnosis: "Pneumonia",
      treatmentSummary:
        "Treated with IV antibiotics for 5 days followed by oral antibiotics. Oxygen support was provided initially.",
      followUpDate: "2023-10-23",
      medications: [
        "Amoxicillin 500mg twice daily for 5 days",
        "Expectorant syrup 10ml three times daily for 7 days",
      ],
    },
    {
      id: "D003",
      patientName: "James Rodriguez",
      patientId: "P10156",
      admissionDate: "2023-09-28",
      dischargeDate: "2023-10-08",
      ward: "ICU",
      bed: "ICU-03",
      doctor: "Dr. Williams",
      reason: "Patient condition stabilized, transferred to home care",
      status: "Completed",
      dischargeType: "Referral to Home Care",
      notes:
        "Patient requires continued monitoring. Home care nurse will visit daily for the first week.",
      diagnosis: "Congestive Heart Failure",
      treatmentSummary:
        "Managed with diuretics, ACE inhibitors, and careful fluid balance monitoring. Cardiac function improved significantly during stay.",
      followUpDate: "2023-10-15",
      medications: [
        "Furosemide 40mg once daily",
        "Lisinopril 10mg once daily",
        "Spironolactone 25mg once daily",
      ],
    },
    {
      id: "D004",
      patientName: "Sarah Johnson",
      patientId: "P10203",
      admissionDate: "2023-10-01",
      dischargeDate: "2023-10-10",
      ward: "General Ward",
      bed: "G-15",
      doctor: "Dr. Brown",
      reason: "Infection cleared, patient can continue recovery at home",
      status: "Completed",
      dischargeType: "Normal Discharge",
      notes: "Patient advised to complete full course of antibiotics.",
      diagnosis: "Urinary Tract Infection",
      treatmentSummary:
        "Treated with appropriate antibiotics based on culture sensitivity. Hydration maintained with IV fluids initially.",
      followUpDate: "2023-10-24",
      medications: ["Ciprofloxacin 500mg twice daily for 7 days"],
    },
    {
      id: "D005",
      patientName: "Robert Chen",
      patientId: "P10245",
      admissionDate: "2023-09-25",
      dischargeDate: "2023-10-07",
      ward: "Private Room",
      bed: "PR-05",
      doctor: "Dr. Johnson",
      reason: "Surgery successful, patient ready for discharge",
      status: "Completed",
      dischargeType: "Normal Discharge",
      notes:
        "Wound care instructions provided. Patient to return for suture removal in 10 days.",
      diagnosis: "Appendicitis",
      treatmentSummary:
        "Laparoscopic appendectomy performed without complications. Post-operative recovery was uneventful.",
      followUpDate: "2023-10-17",
      medications: [
        "Ibuprofen 400mg as needed for pain",
        "Probiotics once daily for 14 days",
      ],
    },
  ]);

  const [dischargeSearch, setDischargeSearch] = useState("");
  const [currentDischargePage, setCurrentDischargePage] = useState(1);
  const [dischargesPerPage] = useState(3);
  const [isDischargeSlipDialogOpen, setIsDischargeSlipDialogOpen] =
    useState(false);
  const [selectedDischarge, setSelectedDischarge] = useState<Discharge | null>(
    null,
  );

  // Handle patient search in real-time
  useEffect(() => {
    if (patientSearchQuery.trim() === "") {
      setSearchResults([]);
      return;
    }

    const query = patientSearchQuery.toLowerCase();
    const results = patients
      .filter(
        (patient) =>
          patient.name.toLowerCase().includes(query) ||
          patient.id.toLowerCase().includes(query) ||
          patient.mrNumber.toLowerCase().includes(query),
      )
      .map((patient) => ({
        id: patient.id,
        name: patient.name,
        mrNumber: patient.mrNumber,
      }));

    setSearchResults(results);
  }, [patientSearchQuery, patients]);

  // Handle patient selection
  const handlePatientSelect = (patient: {
    id: string;
    name: string;
    mrNumber: string;
  }) => {
    setSelectedPatient(patient);
    setPatientSearchQuery(patient.name);
    setSearchResults([]);
  };

  const filteredAdmissions = admissions.filter((admission) => {
    const matchesSearch =
      admission.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      admission.patientId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      admission.id.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      filterStatus === "all" ||
      admission.status.toLowerCase() === filterStatus.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  const handleViewDetails = (admission: Admission) => {
    setSelectedAdmission(admission);
    setIsDetailsDialogOpen(true);
  };

  const handleTransferPatient = (admission: Admission) => {
    setSelectedAdmission(admission);
    setIsTransferDialogOpen(true);
  };

  const handleDischargePatient = (admission: Admission) => {
    setSelectedAdmission(admission);
    setIsDischargeDialogOpen(true);
  };

  const handleConfirmTransfer = () => {
    if (!selectedAdmission || !transferReason) return;

    // Create new transfer record
    const newTransfer: Transfer = {
      id: `T${transfers.length + 1}`.padStart(4, "0"),
      patientName: selectedAdmission.patientName,
      patientId: selectedAdmission.patientId,
      fromWard: selectedAdmission.ward,
      fromBed: selectedAdmission.bed,
      toWard: "ICU", // This would come from a form selection
      toBed: "ICU-08", // This would come from a form selection
      date: new Date().toISOString().split("T")[0],
      reason: transferReason,
      status: "Completed",
    };

    // Update the patient's admission record
    const updatedAdmissions = admissions.map((admission) =>
      admission.id === selectedAdmission.id
        ? { ...admission, ward: newTransfer.toWard, bed: newTransfer.toBed }
        : admission,
    );

    setTransfers([...transfers, newTransfer]);
    setAdmissions(updatedAdmissions);
    setIsTransferDialogOpen(false);
    setTransferReason("");
  };

  const handleConfirmDischarge = () => {
    if (!selectedAdmission || !dischargeReason) return;

    // Create new discharge record
    const newDischarge: Discharge = {
      id: `D${discharges.length + 1}`.padStart(4, "0"),
      patientName: selectedAdmission.patientName,
      patientId: selectedAdmission.patientId,
      admissionDate: selectedAdmission.admissionDate,
      dischargeDate: new Date().toISOString().split("T")[0],
      ward: selectedAdmission.ward,
      bed: selectedAdmission.bed,
      doctor: selectedAdmission.doctor,
      reason: dischargeReason,
      status: "Completed",
      dischargeType: dischargeType,
      notes: dischargeNotes,
      diagnosis: selectedAdmission.diagnosis,
      treatmentSummary: dischargeReason,
      followUpDate: new Date(new Date().setDate(new Date().getDate() + 14))
        .toISOString()
        .split("T")[0],
      medications: [],
    };

    // Update the patient's admission record
    const updatedAdmissions = admissions.map((admission) =>
      admission.id === selectedAdmission.id
        ? { ...admission, status: "Discharged" }
        : admission,
    );

    setDischarges([...discharges, newDischarge]);
    setAdmissions(updatedAdmissions);
    setIsDischargeDialogOpen(false);
    setDischargeReason("");
    setDischargeNotes("");

    // Show discharge slip after creating discharge
    setSelectedDischarge(newDischarge);
    setIsDischargeSlipDialogOpen(true);
  };

  const handlePrintDischargeSlip = (discharge: Discharge) => {
    setSelectedDischarge(discharge);
    setIsDischargeSlipDialogOpen(true);
  };

  // Filter and paginate discharges
  const filteredDischarges = discharges.filter((discharge) => {
    return (
      discharge.patientName
        .toLowerCase()
        .includes(dischargeSearch.toLowerCase()) ||
      discharge.patientId
        .toLowerCase()
        .includes(dischargeSearch.toLowerCase()) ||
      discharge.id.toLowerCase().includes(dischargeSearch.toLowerCase())
    );
  });

  // Get current discharges for pagination
  const indexOfLastDischarge = currentDischargePage * dischargesPerPage;
  const indexOfFirstDischarge = indexOfLastDischarge - dischargesPerPage;
  const currentDischarges = filteredDischarges.slice(
    indexOfFirstDischarge,
    indexOfLastDischarge,
  );

  // Change page
  const paginate = (pageNumber: number) => setCurrentDischargePage(pageNumber);

  const handleRegisterAdmission = () => {
    // Create new admission from form inputs and selected patient
    const newAdmission: Admission = {
      id: `IPD${admissions.length + 1}`.padStart(6, "0"),
      patientName: selectedPatient ? selectedPatient.name : "New Patient",
      patientId: selectedPatient
        ? selectedPatient.id
        : `P${10000 + admissions.length + 1}`,
      mrNumber: selectedPatient ? selectedPatient.mrNumber : generateMRNumber(),
      admissionDate: new Date().toISOString().split("T")[0],
      ward: "General Ward",
      bed: "G-23",
      doctor: "Dr. Smith",
      status: "Active",
      diagnosis: "Initial assessment pending",
      notes: "New admission",
      registrationFee: parseInt(registrationFee),
      paymentStatus: "Paid",
    };

    setAdmissions([...admissions, newAdmission]);
    setIsAdmissionDialogOpen(false);
    setRegistrationFee("1000");
    setPaymentMethod("cash");
    setSelectedPatient(null);
    setPatientSearchQuery("");

    // Show print dialog after successful admission
    setSelectedAdmission(newAdmission);
    setIsPrintAdmissionDialogOpen(true);
  };

  return (
    <div className="space-y-4 bg-white dark:bg-gray-950">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">IPD Management</h2>
          <p className="text-muted-foreground">
            Manage inpatient admissions and ward assignments
          </p>
        </div>
        {!isInPatientManagement && (
          <div className="flex space-x-2">
            <Button onClick={() => setIsAdmissionDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              New Admission
            </Button>
          </div>
        )}
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-4"
      >
        <div className="flex justify-between items-center">
          <TabsList>
            <TabsTrigger value="admissions" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span>Admissions</span>
            </TabsTrigger>
            <TabsTrigger value="beds" className="flex items-center gap-2">
              <BedDouble className="h-4 w-4" />
              <span>Bed Management</span>
            </TabsTrigger>
            <TabsTrigger value="transfers" className="flex items-center gap-2">
              <ArrowRightLeft className="h-4 w-4" />
              <span>Transfers</span>
            </TabsTrigger>
            <TabsTrigger value="discharges" className="flex items-center gap-2">
              <LogOut className="h-4 w-4" />
              <span>Discharges</span>
            </TabsTrigger>
          </TabsList>

          {activeTab === "admissions" && !isInPatientManagement && (
            <div className="flex items-center space-x-2">
              <div className="relative w-[250px]">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by ID or patient name..."
                  className="pl-8"
                  value={searchQuery}
                />
              </div>

              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-[180px]">
                  <div className="flex items-center">
                    <Filter className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="Filter by status" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="stable">Stable</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                  <SelectItem value="discharged">Discharged</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
          {activeTab === "admissions" && isInPatientManagement && (
            <div className="flex items-center space-x-2">
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-[180px]">
                  <div className="flex items-center">
                    <Filter className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="Filter by status" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="stable">Stable</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                  <SelectItem value="discharged">Discharged</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        <TabsContent value="admissions" className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Current Admissions</CardTitle>
              <CardDescription>
                Manage all current inpatient admissions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Admission ID</TableHead>
                    <TableHead>Patient Name</TableHead>
                    <TableHead>Patient ID</TableHead>
                    <TableHead>Admission Date</TableHead>
                    <TableHead>Ward</TableHead>
                    <TableHead>Bed</TableHead>
                    <TableHead>Attending Doctor</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAdmissions.length > 0 ? (
                    filteredAdmissions.map((admission) => (
                      <TableRow key={admission.id}>
                        <TableCell className="font-medium">
                          {admission.id}
                        </TableCell>
                        <TableCell>{admission.patientName}</TableCell>
                        <TableCell>{admission.patientId}</TableCell>
                        <TableCell>{admission.admissionDate}</TableCell>
                        <TableCell>{admission.ward}</TableCell>
                        <TableCell>{admission.bed}</TableCell>
                        <TableCell>{admission.doctor}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              admission.status === "Critical"
                                ? "destructive"
                                : admission.status === "Discharged"
                                  ? "outline"
                                  : "default"
                            }
                          >
                            {admission.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            {admission.status !== "Discharged" && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleTransferPatient(admission)}
                              >
                                Transfer
                              </Button>
                            )}
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleViewDetails(admission)}
                            >
                              View Details
                            </Button>
                            {admission.status !== "Discharged" && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  handleDischargePatient(admission)
                                }
                              >
                                Discharge
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center py-4">
                        No admissions found matching your criteria
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter className="flex justify-between">
              <div className="text-sm text-muted-foreground">
                Showing {filteredAdmissions.length} of {admissions.length}{" "}
                admissions
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" disabled>
                  Previous
                </Button>
                <Button variant="outline" size="sm" disabled>
                  Next
                </Button>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="beds" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {wards.map((ward) => (
              <Card
                key={ward.id}
                className={selectedWard === ward.id ? "border-primary" : ""}
              >
                <CardHeader>
                  <CardTitle>{ward.name}</CardTitle>
                  <CardDescription>
                    {ward.availableBeds} beds available out of {ward.totalBeds}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <div className="space-y-1">
                      <div className="text-sm text-muted-foreground">
                        Occupied
                      </div>
                      <div className="text-2xl font-bold">
                        {ward.occupiedBeds}
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-sm text-muted-foreground">
                        Available
                      </div>
                      <div className="text-2xl font-bold">
                        {ward.availableBeds}
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-sm text-muted-foreground">
                        Occupancy
                      </div>
                      <div className="text-2xl font-bold">
                        {Math.round((ward.occupiedBeds / ward.totalBeds) * 100)}
                        %
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => setSelectedWard(ward.id)}
                  >
                    View Bed Details
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          {selectedWard && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>
                  {wards.find((w) => w.id === selectedWard)?.name} - Bed
                  Allocation
                </CardTitle>
                <CardDescription>
                  Detailed view of all beds and their current status
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {wards
                    .find((w) => w.id === selectedWard)
                    ?.bedDetails?.map((bed, index) => (
                      <div
                        key={bed.id}
                        className={`p-4 border rounded-md flex flex-col items-center justify-center space-y-2 ${bed.isOccupied ? "bg-muted" : "bg-green-50 dark:bg-green-950"}`}
                      >
                        <BedDouble
                          className={`h-8 w-8 ${bed.isOccupied ? "text-muted-foreground" : "text-green-500"}`}
                        />
                        <div className="text-sm font-medium">{bed.number}</div>
                        <Badge
                          variant={bed.isOccupied ? "outline" : "secondary"}
                          className="mt-1"
                        >
                          {bed.isOccupied ? "Occupied" : "Available"}
                        </Badge>
                        {bed.isOccupied && (
                          <div className="text-xs text-center mt-2 text-muted-foreground">
                            {bed.patientName}
                            <br />
                            {bed.patientId}
                          </div>
                        )}
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="transfers" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Patient Transfers</CardTitle>
              <CardDescription>
                View and manage patient transfers between wards
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Transfer ID</TableHead>
                    <TableHead>Patient</TableHead>
                    <TableHead>From</TableHead>
                    <TableHead>To</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transfers.length > 0 ? (
                    transfers.map((transfer) => (
                      <TableRow key={transfer.id}>
                        <TableCell className="font-medium">
                          {transfer.id}
                        </TableCell>
                        <TableCell>
                          <div>
                            <div>{transfer.patientName}</div>
                            <div className="text-xs text-muted-foreground">
                              {transfer.patientId}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div>{transfer.fromWard}</div>
                            <div className="text-xs text-muted-foreground">
                              Bed: {transfer.fromBed}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div>{transfer.toWard}</div>
                            <div className="text-xs text-muted-foreground">
                              Bed: {transfer.toBed}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{transfer.date}</TableCell>
                        <TableCell>
                          <div
                            className="max-w-[200px] truncate"
                            title={transfer.reason}
                          >
                            {transfer.reason}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className="bg-green-50 text-green-700 border-green-200"
                          >
                            {transfer.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-4">
                        No transfers found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="discharges" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle>Patient Discharges</CardTitle>
                <CardDescription>
                  View and manage patient discharges
                </CardDescription>
              </div>
              <div className="relative w-[250px]">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by ID or patient name..."
                  className="pl-8"
                  value={dischargeSearch}
                  onChange={(e) => {
                    setDischargeSearch(e.target.value);
                    setCurrentDischargePage(1); // Reset to first page on search
                  }}
                />
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Discharge ID</TableHead>
                    <TableHead>Patient</TableHead>
                    <TableHead>Ward/Bed</TableHead>
                    <TableHead>Admission Date</TableHead>
                    <TableHead>Discharge Date</TableHead>
                    <TableHead>Doctor</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentDischarges.length > 0 ? (
                    currentDischarges.map((discharge) => (
                      <TableRow key={discharge.id}>
                        <TableCell className="font-medium">
                          {discharge.id}
                        </TableCell>
                        <TableCell>
                          <div>
                            <div>{discharge.patientName}</div>
                            <div className="text-xs text-muted-foreground">
                              {discharge.patientId}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div>{discharge.ward}</div>
                            <div className="text-xs text-muted-foreground">
                              Bed: {discharge.bed}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{discharge.admissionDate}</TableCell>
                        <TableCell>{discharge.dischargeDate}</TableCell>
                        <TableCell>{discharge.doctor}</TableCell>
                        <TableCell>
                          <div
                            className="max-w-[200px] truncate"
                            title={discharge.reason}
                          >
                            {discharge.reason}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className="bg-green-50 text-green-700 border-green-200"
                          >
                            {discharge.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex items-center gap-1"
                            onClick={() => handlePrintDischargeSlip(discharge)}
                          >
                            <Printer className="h-3 w-3" />
                            Print Slip
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center py-4">
                        No discharges found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter className="flex justify-between items-center">
              <div className="text-sm text-muted-foreground">
                Showing {currentDischarges.length} of{" "}
                {filteredDischarges.length} discharges
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => paginate(currentDischargePage - 1)}
                  disabled={currentDischargePage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <div className="text-sm">
                  Page {currentDischargePage} of{" "}
                  {Math.ceil(filteredDischarges.length / dischargesPerPage)}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => paginate(currentDischargePage + 1)}
                  disabled={
                    currentDischargePage ===
                    Math.ceil(filteredDischarges.length / dischargesPerPage)
                  }
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Patient Details Dialog */}
      <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Patient Admission Details</DialogTitle>
            <DialogDescription>
              Detailed information about the patient's admission
            </DialogDescription>
          </DialogHeader>

          {selectedAdmission && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium">Patient Information</h3>
                  <div className="mt-2 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        Name:
                      </span>
                      <span className="text-sm font-medium">
                        {selectedAdmission.patientName}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        Patient ID:
                      </span>
                      <span className="text-sm font-medium">
                        {selectedAdmission.patientId}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        MR Number:
                      </span>
                      <span className="text-sm font-medium">
                        {selectedAdmission.mrNumber}
                      </span>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium">Admission Information</h3>
                  <div className="mt-2 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        Admission ID:
                      </span>
                      <span className="text-sm font-medium">
                        {selectedAdmission.id}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        Date:
                      </span>
                      <span className="text-sm font-medium">
                        {selectedAdmission.admissionDate}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        Status:
                      </span>
                      <Badge
                        variant={
                          selectedAdmission.status === "Critical"
                            ? "destructive"
                            : selectedAdmission.status === "Discharged"
                              ? "outline"
                              : "default"
                        }
                      >
                        {selectedAdmission.status}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium">Location</h3>
                  <div className="mt-2 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        Ward:
                      </span>
                      <span className="text-sm font-medium">
                        {selectedAdmission.ward}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        Bed:
                      </span>
                      <span className="text-sm font-medium">
                        {selectedAdmission.bed}
                      </span>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium">Medical Information</h3>
                  <div className="mt-2 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        Doctor:
                      </span>
                      <span className="text-sm font-medium">
                        {selectedAdmission.doctor}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        Diagnosis:
                      </span>
                      <span className="text-sm font-medium">
                        {selectedAdmission.diagnosis || "N/A"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="text-sm font-medium">Payment Information</h3>
                <div className="mt-2 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">
                      Registration Fee:
                    </span>
                    <span className="text-sm font-medium">
                      ₹
                      {selectedAdmission.registrationFee?.toLocaleString() ||
                        "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">
                      Payment Status:
                    </span>
                    <Badge
                      variant={
                        selectedAdmission.paymentStatus === "Paid"
                          ? "default"
                          : "destructive"
                      }
                    >
                      {selectedAdmission.paymentStatus || "N/A"}
                    </Badge>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium">Notes</h3>
                <p className="mt-2 text-sm border p-2 rounded-md bg-muted/50 min-h-[60px]">
                  {selectedAdmission.notes || "No notes available"}
                </p>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button onClick={() => setIsDetailsDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* New Admission Dialog */}
      <Dialog
        open={isAdmissionDialogOpen}
        onOpenChange={setIsAdmissionDialogOpen}
      >
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>New Patient Admission</DialogTitle>
            <DialogDescription>
              Register a new inpatient admission. Search for an existing patient
              or create a new patient record.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Patient Information</h3>
              <div className="relative">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search for patient by name, ID or MR number..."
                    className="pl-8 w-full"
                    value={patientSearchQuery}
                    onChange={(e) => setPatientSearchQuery(e.target.value)}
                  />
                </div>

                {searchResults.length > 0 && (
                  <div className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 border rounded-md shadow-lg max-h-60 overflow-y-auto">
                    {searchResults.map((patient) => (
                      <div
                        key={patient.id}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                        onClick={() => handlePatientSelect(patient)}
                      >
                        <div className="font-medium">{patient.name}</div>
                        <div className="text-xs text-muted-foreground flex justify-between">
                          <span>ID: {patient.id}</span>
                          <span>MR: {patient.mrNumber}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Patient ID</label>
                <Input
                  value={selectedPatient ? selectedPatient.id : ""}
                  placeholder="Patient ID"
                  disabled
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">MR Number</label>
                <Input
                  value={selectedPatient ? selectedPatient.mrNumber : ""}
                  placeholder="MR Number"
                  disabled
                />
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-medium">Admission Details</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Admission Date</label>
                  <div className="relative">
                    <Calendar className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="date"
                      className="pl-8"
                      defaultValue={new Date().toISOString().split("T")[0]}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Attending Doctor
                  </label>
                  <Select defaultValue="dr-smith">
                    <SelectTrigger>
                      <SelectValue placeholder="Select doctor" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dr-smith">Dr. Smith</SelectItem>
                      <SelectItem value="dr-johnson">Dr. Johnson</SelectItem>
                      <SelectItem value="dr-williams">Dr. Williams</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Ward</label>
                <Select defaultValue="general">
                  <SelectTrigger>
                    <SelectValue placeholder="Select ward" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">General Ward</SelectItem>
                    <SelectItem value="private">Private Room</SelectItem>
                    <SelectItem value="icu">Intensive Care Unit</SelectItem>
                    <SelectItem value="ccu">Critical Care Unit</SelectItem>
                    <SelectItem value="pediatric">Pediatric Ward</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Bed Number</label>
                <Select defaultValue="g-12">
                  <SelectTrigger>
                    <SelectValue placeholder="Select bed" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="g-12">G-12</SelectItem>
                    <SelectItem value="g-13">G-13</SelectItem>
                    <SelectItem value="g-14">G-14</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Initial Diagnosis</label>
              <Input placeholder="Enter initial diagnosis" />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Admission Notes</label>
              <Textarea placeholder="Enter any additional notes" />
            </div>

            <Separator />

            <div className="space-y-4">
              <h3 className="text-sm font-medium">Registration Fee</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Fee Amount (₹)</label>
                  <div className="relative">
                    <CreditCard className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="number"
                      className="pl-8"
                      value={registrationFee}
                      onChange={(e) => setRegistrationFee(e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Payment Method</label>
                  <Select
                    value={paymentMethod}
                    onValueChange={setPaymentMethod}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select payment method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cash">Cash</SelectItem>
                      <SelectItem value="card">Credit/Debit Card</SelectItem>
                      <SelectItem value="upi">UPI</SelectItem>
                      <SelectItem value="insurance">Insurance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="flex-col sm:flex-row gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => {
                setIsAdmissionDialogOpen(false);
                setSelectedPatient(null);
                setPatientSearchQuery("");
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleRegisterAdmission}>
              Register Admission
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Transfer Dialog */}
      <Dialog
        open={isTransferDialogOpen}
        onOpenChange={setIsTransferDialogOpen}
      >
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Transfer Patient</DialogTitle>
            <DialogDescription>
              Transfer a patient to a different ward or bed
            </DialogDescription>
          </DialogHeader>

          {selectedAdmission && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Patient ID</label>
                  <Input value={selectedAdmission.patientId} disabled />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Patient Name</label>
                  <Input value={selectedAdmission.patientName} disabled />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Current Ward</label>
                  <Input value={selectedAdmission.ward} disabled />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Current Bed</label>
                  <Input value={selectedAdmission.bed} disabled />
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-medium">Transfer Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">New Ward</label>
                    <Select defaultValue="icu">
                      <SelectTrigger>
                        <SelectValue placeholder="Select ward" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="general">General Ward</SelectItem>
                        <SelectItem value="private">Private Room</SelectItem>
                        <SelectItem value="icu">Intensive Care Unit</SelectItem>
                        <SelectItem value="ccu">Critical Care Unit</SelectItem>
                        <SelectItem value="pediatric">
                          Pediatric Ward
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">New Bed</label>
                    <Select defaultValue="icu-08">
                      <SelectTrigger>
                        <SelectValue placeholder="Select bed" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="icu-08">ICU-08</SelectItem>
                        <SelectItem value="icu-09">ICU-09</SelectItem>
                        <SelectItem value="icu-10">ICU-10</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Reason for Transfer
                </label>
                <Textarea
                  placeholder="Enter reason for transfer"
                  value={transferReason}
                  onChange={(e) => setTransferReason(e.target.value)}
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsTransferDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleConfirmTransfer}>Confirm Transfer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Discharge Dialog */}
      <Dialog
        open={isDischargeDialogOpen}
        onOpenChange={setIsDischargeDialogOpen}
      >
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Discharge Patient</DialogTitle>
            <DialogDescription>
              Process patient discharge from the hospital
            </DialogDescription>
          </DialogHeader>

          {selectedAdmission && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Patient ID</label>
                  <Input value={selectedAdmission.patientId} disabled />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Patient Name</label>
                  <Input value={selectedAdmission.patientName} disabled />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Admission Date</label>
                  <Input value={selectedAdmission.admissionDate} disabled />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Discharge Date</label>
                  <Input
                    type="date"
                    defaultValue={new Date().toISOString().split("T")[0]}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Discharge Type</label>
                <Select value={dischargeType} onValueChange={setDischargeType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select discharge type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Normal Discharge">
                      Normal Discharge
                    </SelectItem>
                    <SelectItem value="Left Against Medical Advice">
                      Left Against Medical Advice
                    </SelectItem>
                    <SelectItem value="Referral to Another Facility">
                      Referral to Another Facility
                    </SelectItem>
                    <SelectItem value="Deceased">Deceased</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Reason for Discharge
                </label>
                <Textarea
                  placeholder="Enter reason for discharge"
                  value={dischargeReason}
                  onChange={(e) => setDischargeReason(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Discharge Notes</label>
                <Textarea
                  placeholder="Enter discharge instructions and follow-up details"
                  value={dischargeNotes}
                  onChange={(e) => setDischargeNotes(e.target.value)}
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDischargeDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleConfirmDischarge}>Confirm Discharge</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Discharge Slip Dialog */}
      <Dialog
        open={isDischargeSlipDialogOpen}
        onOpenChange={setIsDischargeSlipDialogOpen}
      >
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
          {selectedDischarge && (
            <DischargeSlip
              discharge={selectedDischarge}
              onClose={() => setIsDischargeSlipDialogOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* IPD Admission Print Dialog */}
      <Dialog
        open={isPrintAdmissionDialogOpen}
        onOpenChange={setIsPrintAdmissionDialogOpen}
      >
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
          {selectedAdmission && (
            <div className="space-y-6 p-4 bg-white dark:bg-gray-950 border rounded-lg">
              <div className="flex justify-between items-center border-b pb-4">
                <div>
                  <h2 className="text-2xl font-bold">Hospital Name</h2>
                  <p className="text-muted-foreground">
                    123 Hospital Street, City, Country
                  </p>
                  <p className="text-muted-foreground">Phone: 123-456-7890</p>
                </div>
                <div className="text-right">
                  <h3 className="text-xl font-semibold">IPD Admission Slip</h3>
                  <p className="text-muted-foreground">
                    Date: {new Date().toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium">Patient Information</h3>
                  <div className="space-y-2 mt-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Name:</span>
                      <span>{selectedAdmission.patientName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Patient ID:</span>
                      <span>{selectedAdmission.patientId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">MR Number:</span>
                      <span>{selectedAdmission.mrNumber}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium">Admission Details</h3>
                  <div className="space-y-2 mt-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Admission ID:
                      </span>
                      <span>{selectedAdmission.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Date:</span>
                      <span>{selectedAdmission.admissionDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Doctor:</span>
                      <span>{selectedAdmission.doctor}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="font-medium">Ward & Bed Information</h3>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Ward:</span>
                  <span>{selectedAdmission.ward}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Bed Number:</span>
                  <span>{selectedAdmission.bed}</span>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="font-medium">Payment Information</h3>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    Registration Fee:
                  </span>
                  <span>
                    ₹{selectedAdmission.registrationFee?.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Payment Status:</span>
                  <Badge
                    variant={
                      selectedAdmission.paymentStatus === "Paid"
                        ? "default"
                        : "destructive"
                    }
                  >
                    {selectedAdmission.paymentStatus}
                  </Badge>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="font-medium">Initial Diagnosis</h3>
                <p className="border p-2 rounded-md">
                  {selectedAdmission.diagnosis || "N/A"}
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="font-medium">Notes</h3>
                <p className="border p-2 rounded-md">
                  {selectedAdmission.notes || "N/A"}
                </p>
              </div>

              <div className="flex justify-between pt-6 mt-6 border-t">
                <div>
                  <p className="font-medium">Patient/Guardian Signature</p>
                  <div className="mt-8 border-t border-dashed w-40"></div>
                </div>
                <div className="text-right">
                  <p className="font-medium">Doctor's Signature</p>
                  <div className="mt-8 border-t border-dashed w-40 ml-auto"></div>
                </div>
              </div>

              <div className="flex justify-end space-x-2 mt-6">
                <Button
                  variant="outline"
                  onClick={() => setIsPrintAdmissionDialogOpen(false)}
                >
                  Close
                </Button>
                <Button onClick={() => window.print()}>
                  <Printer className="mr-2 h-4 w-4" />
                  Print Admission Slip
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default IPDManagement;
