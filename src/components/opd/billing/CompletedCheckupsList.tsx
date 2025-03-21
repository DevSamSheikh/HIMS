import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import {
  Search,
  FileText,
  MoreHorizontal,
  Filter,
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Printer,
  Download,
  Receipt,
  CreditCard,
} from "lucide-react";
import EnhancedPrescriptionView from "./EnhancedPrescriptionView";
import AlternativePrescriptionView from "./AlternativePrescriptionView";

interface CompletedCheckupsListProps {}

const CompletedCheckupsList: React.FC<CompletedCheckupsListProps> = () => {
  // State for filters
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: undefined,
    to: undefined,
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    doctor: "all",
    paymentStatus: "all",
    department: "all",
  });

  // State for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // State for prescription view
  const [selectedCheckup, setSelectedCheckup] = useState<any | null>(null);
  const [showPrescription, setShowPrescription] = useState(false);
  const [showAlternativePrescription, setShowAlternativePrescription] =
    useState(false);
  const [prescriptionTemplate, setPrescriptionTemplate] = useState<
    "standard" | "alternative"
  >("standard");

  // Mock data for completed checkups
  const mockCompletedCheckups = [
    {
      id: "C001",
      date: "2023-10-15",
      patient: {
        id: "P001",
        name: "John Doe",
        age: 45,
        gender: "Male",
        bloodGroup: "O+",
        contact: "9876543210",
      },
      doctor: "Dr. Sarah Johnson",
      department: "General Medicine",
      diagnosis: [
        { name: "Common Cold", icd10Code: "J00" },
        { name: "Allergic Rhinitis", icd10Code: "J30.4" },
      ],
      symptoms: [
        { name: "Cough", description: "Dry cough" },
        { name: "Runny Nose", description: "Clear discharge" },
        { name: "Sneezing", description: "Frequent" },
      ],
      medications: [
        {
          medicine: { name: "Cetirizine", category: "Antihistamine" },
          dosage: { name: "Once daily", frequency: "1-0-0" },
          days: { name: "7 Days", value: 7 },
        },
        {
          medicine: { name: "Paracetamol", category: "Analgesic" },
          dosage: { name: "Three times daily", frequency: "1-1-1" },
          days: { name: "3 Days", value: 3 },
        },
      ],
      tests: [{ name: "Complete Blood Count", price: 500 }],
      remarks: "Patient advised to rest and increase fluid intake.",
      followUpDate: "2023-10-22",
      paymentStatus: "Paid",
      amount: 1500,
    },
    {
      id: "C002",
      date: "2023-10-16",
      patient: {
        id: "P002",
        name: "Jane Smith",
        age: 32,
        gender: "Female",
        bloodGroup: "A+",
        contact: "9876543211",
      },
      doctor: "Dr. Michael Chen",
      department: "Gastroenterology",
      diagnosis: [{ name: "Gastritis", icd10Code: "K29" }],
      symptoms: [
        { name: "Abdominal Pain", description: "Upper abdomen" },
        { name: "Nausea", description: "Especially after meals" },
        { name: "Loss of Appetite", description: "Moderate" },
      ],
      medications: [
        {
          medicine: { name: "Omeprazole", category: "Proton Pump Inhibitor" },
          dosage: { name: "Once daily", frequency: "1-0-0" },
          days: { name: "14 Days", value: 14 },
        },
        {
          medicine: { name: "Domperidone", category: "Antiemetic" },
          dosage: { name: "Three times daily", frequency: "1-1-1" },
          days: { name: "7 Days", value: 7 },
        },
      ],
      tests: [
        { name: "Liver Function Test", price: 1000 },
        { name: "Abdominal Ultrasound", price: 1500 },
      ],
      remarks: "Patient advised to avoid spicy foods and alcohol.",
      followUpDate: "2023-10-30",
      paymentStatus: "Pending",
      amount: 3000,
    },
    {
      id: "C003",
      date: "2023-10-17",
      patient: {
        id: "P003",
        name: "Robert Brown",
        age: 58,
        gender: "Male",
        bloodGroup: "B+",
        contact: "9876543212",
      },
      doctor: "Dr. Sarah Johnson",
      department: "General Medicine",
      diagnosis: [
        { name: "Hypertension", icd10Code: "I10" },
        { name: "Type 2 Diabetes", icd10Code: "E11" },
      ],
      symptoms: [
        { name: "Headache", description: "Frequent" },
        { name: "Fatigue", description: "Moderate" },
      ],
      medications: [
        {
          medicine: { name: "Amlodipine", category: "Calcium Channel Blocker" },
          dosage: { name: "Once daily", frequency: "1-0-0" },
          days: { name: "30 Days", value: 30 },
        },
        {
          medicine: { name: "Metformin", category: "Antidiabetic" },
          dosage: { name: "Twice daily", frequency: "1-0-1" },
          days: { name: "30 Days", value: 30 },
        },
      ],
      tests: [
        { name: "HbA1c", price: 800 },
        { name: "Lipid Profile", price: 800 },
        { name: "Kidney Function Test", price: 1000 },
      ],
      remarks:
        "Patient advised to monitor blood pressure and blood sugar regularly.",
      followUpDate: "2023-11-17",
      paymentStatus: "Paid",
      amount: 3100,
    },
    {
      id: "C004",
      date: "2023-10-18",
      patient: {
        id: "P004",
        name: "Emily Johnson",
        age: 28,
        gender: "Female",
        bloodGroup: "O-",
        contact: "9876543213",
      },
      doctor: "Dr. Lisa Wong",
      department: "Dermatology",
      diagnosis: [{ name: "Atopic Dermatitis", icd10Code: "L20" }],
      symptoms: [
        { name: "Skin Rash", description: "On arms and neck" },
        { name: "Itching", description: "Severe" },
        { name: "Dry Skin", description: "Moderate" },
      ],
      medications: [
        {
          medicine: {
            name: "Hydrocortisone Cream",
            category: "Corticosteroid",
          },
          dosage: { name: "Twice daily", frequency: "Apply to affected areas" },
          days: { name: "10 Days", value: 10 },
        },
        {
          medicine: { name: "Cetirizine", category: "Antihistamine" },
          dosage: { name: "Once daily", frequency: "0-0-1" },
          days: { name: "7 Days", value: 7 },
        },
      ],
      tests: [],
      remarks:
        "Patient advised to use moisturizer regularly and avoid hot showers.",
      followUpDate: "2023-11-01",
      paymentStatus: "Paid",
      amount: 1200,
    },
    {
      id: "C005",
      date: "2023-10-19",
      patient: {
        id: "P005",
        name: "Michael Wilson",
        age: 42,
        gender: "Male",
        bloodGroup: "AB+",
        contact: "9876543214",
      },
      doctor: "Dr. James Anderson",
      department: "Orthopedics",
      diagnosis: [{ name: "Lumbar Strain", icd10Code: "S39.012" }],
      symptoms: [
        { name: "Lower Back Pain", description: "Moderate to severe" },
        { name: "Limited Mobility", description: "Difficulty bending" },
      ],
      medications: [
        {
          medicine: { name: "Diclofenac", category: "NSAID" },
          dosage: { name: "Twice daily", frequency: "1-0-1" },
          days: { name: "5 Days", value: 5 },
        },
        {
          medicine: {
            name: "Muscle Relaxant",
            category: "Skeletal Muscle Relaxant",
          },
          dosage: { name: "Three times daily", frequency: "1-1-1" },
          days: { name: "5 Days", value: 5 },
        },
      ],
      tests: [{ name: "X-Ray Lumbar Spine", price: 1200 }],
      remarks:
        "Patient advised to rest and avoid heavy lifting. Referred for physiotherapy.",
      followUpDate: "2023-10-26",
      paymentStatus: "Pending",
      amount: 2500,
    },
    {
      id: "C006",
      date: "2023-10-20",
      patient: {
        id: "P006",
        name: "Sarah Thompson",
        age: 35,
        gender: "Female",
        bloodGroup: "A-",
        contact: "9876543215",
      },
      doctor: "Dr. Michael Chen",
      department: "Gastroenterology",
      diagnosis: [{ name: "Irritable Bowel Syndrome", icd10Code: "K58" }],
      symptoms: [
        { name: "Abdominal Pain", description: "Cramping" },
        { name: "Diarrhea", description: "Intermittent" },
        { name: "Bloating", description: "After meals" },
      ],
      medications: [
        {
          medicine: { name: "Mebeverine", category: "Antispasmodic" },
          dosage: { name: "Three times daily", frequency: "1-1-1" },
          days: { name: "15 Days", value: 15 },
        },
        {
          medicine: { name: "Psyllium Husk", category: "Fiber Supplement" },
          dosage: { name: "Once daily", frequency: "1-0-0" },
          days: { name: "30 Days", value: 30 },
        },
      ],
      tests: [{ name: "Stool Examination", price: 500 }],
      remarks:
        "Patient advised to maintain food diary and identify trigger foods.",
      followUpDate: "2023-11-10",
      paymentStatus: "Paid",
      amount: 1800,
    },
    {
      id: "C007",
      date: "2023-10-21",
      patient: {
        id: "P007",
        name: "David Miller",
        age: 50,
        gender: "Male",
        bloodGroup: "B-",
        contact: "9876543216",
      },
      doctor: "Dr. Sarah Johnson",
      department: "General Medicine",
      diagnosis: [{ name: "Bronchitis", icd10Code: "J20" }],
      symptoms: [
        { name: "Cough", description: "Productive with yellow sputum" },
        { name: "Fever", description: "Low grade" },
        { name: "Chest Discomfort", description: "Mild" },
      ],
      medications: [
        {
          medicine: { name: "Amoxicillin", category: "Antibiotic" },
          dosage: { name: "Three times daily", frequency: "1-1-1" },
          days: { name: "7 Days", value: 7 },
        },
        {
          medicine: { name: "Bromhexine", category: "Mucolytic" },
          dosage: { name: "Three times daily", frequency: "1-1-1" },
          days: { name: "5 Days", value: 5 },
        },
      ],
      tests: [
        { name: "Chest X-Ray", price: 800 },
        { name: "Sputum Culture", price: 700 },
      ],
      remarks: "Patient advised to increase fluid intake and avoid smoking.",
      followUpDate: "2023-10-28",
      paymentStatus: "Paid",
      amount: 2300,
    },
    {
      id: "C008",
      date: "2023-10-22",
      patient: {
        id: "P008",
        name: "Jennifer Lee",
        age: 38,
        gender: "Female",
        bloodGroup: "AB-",
        contact: "9876543217",
      },
      doctor: "Dr. Lisa Wong",
      department: "Dermatology",
      diagnosis: [{ name: "Psoriasis", icd10Code: "L40" }],
      symptoms: [
        {
          name: "Skin Patches",
          description: "Red, scaly patches on elbows and knees",
        },
        { name: "Itching", description: "Mild" },
      ],
      medications: [
        {
          medicine: {
            name: "Calcipotriol Ointment",
            category: "Vitamin D Analog",
          },
          dosage: { name: "Twice daily", frequency: "Apply to affected areas" },
          days: { name: "30 Days", value: 30 },
        },
        {
          medicine: { name: "Betamethasone Cream", category: "Corticosteroid" },
          dosage: { name: "Once daily", frequency: "Apply to affected areas" },
          days: { name: "10 Days", value: 10 },
        },
      ],
      tests: [],
      remarks:
        "Patient advised to moisturize regularly and avoid triggers like stress.",
      followUpDate: "2023-11-22",
      paymentStatus: "Pending",
      amount: 1500,
    },
    {
      id: "C009",
      date: "2023-10-23",
      patient: {
        id: "P009",
        name: "Thomas Brown",
        age: 62,
        gender: "Male",
        bloodGroup: "O+",
        contact: "9876543218",
      },
      doctor: "Dr. James Anderson",
      department: "Orthopedics",
      diagnosis: [{ name: "Osteoarthritis", icd10Code: "M15" }],
      symptoms: [
        { name: "Joint Pain", description: "Knees and hips" },
        { name: "Stiffness", description: "Morning stiffness" },
        {
          name: "Reduced Mobility",
          description: "Difficulty walking long distances",
        },
      ],
      medications: [
        {
          medicine: { name: "Acetaminophen", category: "Analgesic" },
          dosage: { name: "Three times daily", frequency: "1-1-1" },
          days: { name: "15 Days", value: 15 },
        },
        {
          medicine: { name: "Glucosamine", category: "Supplement" },
          dosage: { name: "Once daily", frequency: "1-0-0" },
          days: { name: "30 Days", value: 30 },
        },
      ],
      tests: [{ name: "X-Ray Knee", price: 1000 }],
      remarks:
        "Patient advised to lose weight and do gentle exercises. Referred for physiotherapy.",
      followUpDate: "2023-11-23",
      paymentStatus: "Paid",
      amount: 2200,
    },
    {
      id: "C010",
      date: "2023-10-24",
      patient: {
        id: "P010",
        name: "Elizabeth Wilson",
        age: 45,
        gender: "Female",
        bloodGroup: "A+",
        contact: "9876543219",
      },
      doctor: "Dr. Sarah Johnson",
      department: "General Medicine",
      diagnosis: [{ name: "Migraine", icd10Code: "G43" }],
      symptoms: [
        { name: "Headache", description: "Severe, one-sided" },
        { name: "Nausea", description: "Moderate" },
        { name: "Photophobia", description: "Sensitivity to light" },
      ],
      medications: [
        {
          medicine: { name: "Sumatriptan", category: "Triptan" },
          dosage: { name: "As needed", frequency: "During migraine attack" },
          days: { name: "PRN", value: 0 },
        },
        {
          medicine: { name: "Propranolol", category: "Beta Blocker" },
          dosage: { name: "Twice daily", frequency: "1-0-1" },
          days: { name: "30 Days", value: 30 },
        },
      ],
      tests: [],
      remarks:
        "Patient advised to identify and avoid triggers. Maintain headache diary.",
      followUpDate: "2023-11-24",
      paymentStatus: "Paid",
      amount: 1500,
    },
    {
      id: "C011",
      date: "2023-10-25",
      patient: {
        id: "P011",
        name: "Richard Davis",
        age: 55,
        gender: "Male",
        bloodGroup: "B+",
        contact: "9876543220",
      },
      doctor: "Dr. Michael Chen",
      department: "Gastroenterology",
      diagnosis: [{ name: "Peptic Ulcer", icd10Code: "K27" }],
      symptoms: [
        {
          name: "Abdominal Pain",
          description: "Burning, worse on empty stomach",
        },
        { name: "Nausea", description: "Occasional" },
        { name: "Heartburn", description: "Frequent" },
      ],
      medications: [
        {
          medicine: { name: "Pantoprazole", category: "Proton Pump Inhibitor" },
          dosage: { name: "Once daily", frequency: "1-0-0" },
          days: { name: "30 Days", value: 30 },
        },
        {
          medicine: { name: "Clarithromycin", category: "Antibiotic" },
          dosage: { name: "Twice daily", frequency: "1-0-1" },
          days: { name: "14 Days", value: 14 },
        },
        {
          medicine: { name: "Amoxicillin", category: "Antibiotic" },
          dosage: { name: "Twice daily", frequency: "1-0-1" },
          days: { name: "14 Days", value: 14 },
        },
      ],
      tests: [
        { name: "Endoscopy", price: 3000 },
        { name: "H. pylori Test", price: 1000 },
      ],
      remarks: "Patient advised to avoid spicy foods, alcohol, and NSAIDs.",
      followUpDate: "2023-11-25",
      paymentStatus: "Pending",
      amount: 5000,
    },
    {
      id: "C012",
      date: "2023-10-26",
      patient: {
        id: "P012",
        name: "Mary Johnson",
        age: 40,
        gender: "Female",
        bloodGroup: "O+",
        contact: "9876543221",
      },
      doctor: "Dr. Lisa Wong",
      department: "Dermatology",
      diagnosis: [{ name: "Acne Vulgaris", icd10Code: "L70.0" }],
      symptoms: [
        {
          name: "Facial Eruptions",
          description: "Papules and pustules on face",
        },
        { name: "Oily Skin", description: "Especially on T-zone" },
      ],
      medications: [
        {
          medicine: { name: "Adapalene Gel", category: "Retinoid" },
          dosage: { name: "Once daily", frequency: "Apply at night" },
          days: { name: "30 Days", value: 30 },
        },
        {
          medicine: { name: "Clindamycin Solution", category: "Antibiotic" },
          dosage: { name: "Twice daily", frequency: "Apply morning and night" },
          days: { name: "30 Days", value: 30 },
        },
      ],
      tests: [],
      remarks:
        "Patient advised to use oil-free products and avoid picking at lesions.",
      followUpDate: "2023-11-26",
      paymentStatus: "Paid",
      amount: 1200,
    },
  ];

  // Filter checkups based on search query and filters
  const filteredCheckups = mockCompletedCheckups.filter((checkup) => {
    const searchLower = searchQuery.toLowerCase();
    const dateInRange =
      dateRange.from && dateRange.to
        ? new Date(checkup.date) >= dateRange.from &&
          new Date(checkup.date) <= dateRange.to
        : true;
    const doctorMatches =
      filters.doctor === "all" || checkup.doctor === filters.doctor;
    const paymentMatches =
      filters.paymentStatus === "all" ||
      checkup.paymentStatus === filters.paymentStatus;
    const departmentMatches =
      filters.department === "all" || checkup.department === filters.department;

    return (
      dateInRange &&
      doctorMatches &&
      paymentMatches &&
      departmentMatches &&
      (searchQuery === "" ||
        checkup.patient.name.toLowerCase().includes(searchLower) ||
        checkup.patient.id.toLowerCase().includes(searchLower) ||
        checkup.id.toLowerCase().includes(searchLower))
    );
  });

  // Sort checkups by date (newest first)
  const sortedCheckups = [...filteredCheckups].sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  // Get current checkups for pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCheckups = sortedCheckups.slice(
    indexOfFirstItem,
    indexOfLastItem,
  );
  const totalPages = Math.ceil(sortedCheckups.length / itemsPerPage);

  // Get unique doctors, departments for filters
  const doctors = [...new Set(mockCompletedCheckups.map((c) => c.doctor))];
  const departments = [
    ...new Set(mockCompletedCheckups.map((c) => c.department)),
  ];

  // Reset filters
  const resetFilters = () => {
    setDateRange({ from: undefined, to: undefined });
    setFilters({
      doctor: "all",
      paymentStatus: "all",
      department: "all",
    });
    setSearchQuery("");
  };

  // Handle prescription view
  const handleViewPrescription = (
    checkup: any,
    template: "standard" | "alternative" = "standard",
  ) => {
    setSelectedCheckup(checkup);
    setPrescriptionTemplate(template);

    if (template === "standard") {
      setShowPrescription(true);
      setShowAlternativePrescription(false);
    } else {
      setShowAlternativePrescription(true);
      setShowPrescription(false);
    }
  };

  // Stats
  const totalAmount = filteredCheckups.reduce(
    (sum, checkup) => sum + checkup.amount,
    0,
  );
  const paidAmount = filteredCheckups
    .filter((c) => c.paymentStatus === "Paid")
    .reduce((sum, checkup) => sum + checkup.amount, 0);
  const pendingAmount = filteredCheckups
    .filter((c) => c.paymentStatus === "Pending")
    .reduce((sum, checkup) => sum + checkup.amount, 0);

  return (
    <div className="space-y-6">
      {/* Prescription View Dialogs */}
      {selectedCheckup && (
        <>
          <EnhancedPrescriptionView
            open={showPrescription}
            onOpenChange={setShowPrescription}
            checkup={selectedCheckup}
          />
          <AlternativePrescriptionView
            open={showAlternativePrescription}
            onOpenChange={setShowAlternativePrescription}
            checkup={selectedCheckup}
          />
        </>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Total Checkups
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredCheckups.length}</div>
            <p className="text-xs text-muted-foreground">
              {dateRange.from && dateRange.to
                ? `${format(dateRange.from, "MMM d, yyyy")} - ${format(dateRange.to, "MMM d, yyyy")}`
                : "All time"}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Amount</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₹{totalAmount.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">From all checkups</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Paid Amount</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              ₹{paidAmount.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">Completed payments</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Amount
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">
              ₹{pendingAmount.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">Awaiting payments</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-end">
        <div className="relative w-full md:w-[300px]">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by patient name or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-full md:w-auto">
              <CalendarIcon className="mr-2 h-4 w-4" />
              {dateRange.from ? (
                dateRange.to ? (
                  <>
                    {format(dateRange.from, "LLL dd, y")} -{" "}
                    {format(dateRange.to, "LLL dd, y")}
                  </>
                ) : (
                  format(dateRange.from, "LLL dd, y")
                )
              ) : (
                <span>Date range</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={dateRange.from}
              selected={dateRange}
              onSelect={setDateRange}
              numberOfMonths={2}
            />
          </PopoverContent>
        </Popover>

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-full md:w-auto">
              <Filter className="mr-2 h-4 w-4" />
              <span>Filters</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="space-y-4">
              <h3 className="font-medium">Filter Checkups</h3>

              <div className="space-y-2">
                <Label>Doctor</Label>
                <Select
                  value={filters.doctor}
                  onValueChange={(value) =>
                    setFilters({ ...filters, doctor: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All Doctors" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Doctors</SelectItem>
                    {doctors.map((doctor) => (
                      <SelectItem key={doctor} value={doctor}>
                        {doctor}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Department</Label>
                <Select
                  value={filters.department}
                  onValueChange={(value) =>
                    setFilters({ ...filters, department: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All Departments" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Departments</SelectItem>
                    {departments.map((dept) => (
                      <SelectItem key={dept} value={dept}>
                        {dept}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Payment Status</Label>
                <Select
                  value={filters.paymentStatus}
                  onValueChange={(value) =>
                    setFilters({ ...filters, paymentStatus: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All Statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="Paid">Paid</SelectItem>
                    <SelectItem value="Pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex justify-between pt-2">
                <Button variant="outline" size="sm" onClick={resetFilters}>
                  Reset
                </Button>
                <Button size="sm">Apply Filters</Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {/* Checkups Table */}
      <Card>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Patient</TableHead>
                <TableHead>Doctor</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Diagnosis</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentCheckups.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center h-24">
                    No checkups found matching the criteria.
                  </TableCell>
                </TableRow>
              ) : (
                currentCheckups.map((checkup) => (
                  <TableRow key={checkup.id}>
                    <TableCell className="font-medium">{checkup.id}</TableCell>
                    <TableCell>
                      {format(new Date(checkup.date), "MMM d, yyyy")}
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">
                          {checkup.patient.name}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {checkup.patient.id} | {checkup.patient.age}/
                          {checkup.patient.gender}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{checkup.doctor}</TableCell>
                    <TableCell>{checkup.department}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {checkup.diagnosis.map(
                          (diagnosis: any, index: number) => (
                            <Badge key={index} variant="outline">
                              {diagnosis.name}
                            </Badge>
                          ),
                        )}
                      </div>
                    </TableCell>
                    <TableCell>₹{checkup.amount.toLocaleString()}</TableCell>
                    <TableCell>
                      {checkup.paymentStatus === "Paid" ? (
                        <Badge className="bg-green-50 text-green-700 border-green-200">
                          Paid
                        </Badge>
                      ) : (
                        <Badge className="bg-amber-50 text-amber-700 border-amber-200">
                          Pending
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Open menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem
                            onClick={() =>
                              handleViewPrescription(checkup, "standard")
                            }
                          >
                            <FileText className="mr-2 h-4 w-4" />
                            View Standard Prescription
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              handleViewPrescription(checkup, "alternative")
                            }
                          >
                            <FileText className="mr-2 h-4 w-4" />
                            View Alternative Prescription
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              handleViewPrescription(checkup, "standard");
                              setTimeout(() => {
                                document
                                  .querySelector(
                                    "[data-prescription-print-button]",
                                  )
                                  ?.dispatchEvent(
                                    new MouseEvent("click", { bubbles: true }),
                                  );
                              }, 500);
                            }}
                          >
                            <Printer className="mr-2 h-4 w-4" />
                            Print Prescription
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>
                            <Receipt className="mr-2 h-4 w-4" />
                            View Invoice
                          </DropdownMenuItem>
                          {checkup.paymentStatus === "Pending" && (
                            <DropdownMenuItem>
                              <CreditCard className="mr-2 h-4 w-4" />
                              Process Payment
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between p-4">
          <div className="text-sm text-muted-foreground">
            Showing {indexOfFirstItem + 1} to{" "}
            {Math.min(indexOfLastItem, sortedCheckups.length)} of{" "}
            {sortedCheckups.length} checkups
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    size="icon"
                    className="w-8 h-8"
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </Button>
                ),
              )}
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Select
              value={itemsPerPage.toString()}
              onValueChange={(value) => {
                setItemsPerPage(parseInt(value));
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="w-[100px]">
                <SelectValue placeholder="10 per page" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5 per page</SelectItem>
                <SelectItem value="10">10 per page</SelectItem>
                <SelectItem value="20">20 per page</SelectItem>
                <SelectItem value="50">50 per page</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default CompletedCheckupsList;
