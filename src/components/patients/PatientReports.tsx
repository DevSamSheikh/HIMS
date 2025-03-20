import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  Calendar,
  FileText,
  Filter,
  Printer,
  RefreshCw,
  Search,
  File,
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import PatientDemographicsReport from "./reports/PatientDemographicsReport";
import PatientVisitHistoryReport from "./reports/PatientVisitHistoryReport";
import PatientBillingReport from "./reports/PatientBillingReport";
import PatientAdmissionsReport from "./reports/PatientAdmissionsReport";
import PatientLabReport from "./reports/PatientLabReport";
import PatientDocumentReport from "./reports/PatientDocumentReport";

interface DatePickerProps {
  selected?: Date | null;
  onSelect?: (date: Date | null) => void;
  placeholder?: string;
}

function DatePicker({
  selected,
  onSelect,
  placeholder = "Pick a date",
}: DatePickerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-normal",
            !selected && "text-muted-foreground",
          )}
        >
          <Calendar className="mr-2 h-4 w-4" />
          {selected ? format(selected, "PPP") : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <CalendarComponent
          mode="single"
          selected={selected || undefined}
          onSelect={onSelect}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}

interface PatientReportsProps {
  searchQuery?: string;
}

const PatientReports: React.FC<PatientReportsProps> = ({
  searchQuery = "",
}) => {
  const [activeReport, setActiveReport] = useState<string>("demographics");
  const [dateRange, setDateRange] = useState<{
    from: Date | null;
    to: Date | null;
  }>({
    from: new Date(new Date().setDate(new Date().getDate() - 30)),
    to: new Date(),
  });
  const [department, setDepartment] = useState<string>("all");
  const [doctor, setDoctor] = useState<string>("all");
  const [reportFormat, setReportFormat] = useState<string>("detailed");
  const [isGeneratingReport, setIsGeneratingReport] = useState<boolean>(false);
  const [showReport, setShowReport] = useState<boolean>(false);
  const [localSearchQuery, setLocalSearchQuery] = useState<string>(searchQuery);

  // Sample data for reports
  const patientDemographics = [
    {
      id: "P10023",
      name: "John Doe",
      age: 45,
      gender: "Male",
      bloodGroup: "O+",
      contact: "9876543210",
      address: "123 Main St, City",
      registrationDate: "2023-01-15",
    },
    {
      id: "P10045",
      name: "Jane Smith",
      age: 32,
      gender: "Female",
      bloodGroup: "A+",
      contact: "8765432109",
      address: "456 Oak Ave, Town",
      registrationDate: "2023-02-20",
    },
    {
      id: "P10067",
      name: "Robert Brown",
      age: 58,
      gender: "Male",
      bloodGroup: "B-",
      contact: "7654321098",
      address: "789 Pine Rd, Village",
      registrationDate: "2023-03-10",
    },
    {
      id: "P10089",
      name: "Emily Davis",
      age: 27,
      gender: "Female",
      bloodGroup: "AB+",
      contact: "6543210987",
      address: "101 Elm St, County",
      registrationDate: "2023-04-05",
    },
    {
      id: "P10112",
      name: "Michael Wilson",
      age: 39,
      gender: "Male",
      bloodGroup: "O-",
      contact: "5432109876",
      address: "202 Maple Dr, District",
      registrationDate: "2023-05-12",
    },
    {
      id: "P10113",
      name: "Sarah Johnson",
      age: 41,
      gender: "Female",
      bloodGroup: "A-",
      contact: "4321098765",
      address: "303 Cedar Ln, Suburb",
      registrationDate: "2023-06-18",
    },
    {
      id: "P10114",
      name: "David Lee",
      age: 52,
      gender: "Male",
      bloodGroup: "B+",
      contact: "3210987654",
      address: "404 Birch Blvd, Metropolis",
      registrationDate: "2023-07-22",
    },
    {
      id: "P10115",
      name: "Jennifer White",
      age: 36,
      gender: "Female",
      bloodGroup: "AB-",
      contact: "2109876543",
      address: "505 Willow Way, Downtown",
      registrationDate: "2023-08-30",
    },
    {
      id: "P10116",
      name: "Thomas Martin",
      age: 63,
      gender: "Male",
      bloodGroup: "O+",
      contact: "1098765432",
      address: "606 Spruce St, Uptown",
      registrationDate: "2023-09-05",
    },
    {
      id: "P10117",
      name: "Lisa Garcia",
      age: 29,
      gender: "Female",
      bloodGroup: "A+",
      contact: "0987654321",
      address: "707 Aspen Ave, Riverside",
      registrationDate: "2023-10-12",
    },
  ];

  const patientVisits = [
    {
      id: "V10023",
      patientId: "P10023",
      patientName: "John Doe",
      date: "2023-10-15",
      department: "Cardiology",
      doctor: "Dr. Smith",
      diagnosis: "Hypertension",
      followUp: "2023-11-15",
    },
    {
      id: "V10045",
      patientId: "P10045",
      patientName: "Jane Smith",
      date: "2023-10-18",
      department: "Orthopedics",
      doctor: "Dr. Johnson",
      diagnosis: "Sprained ankle",
      followUp: "2023-11-01",
    },
    {
      id: "V10067",
      patientId: "P10067",
      patientName: "Robert Brown",
      date: "2023-10-20",
      department: "Neurology",
      doctor: "Dr. Williams",
      diagnosis: "Migraine",
      followUp: "2023-11-20",
    },
    {
      id: "V10089",
      patientId: "P10089",
      patientName: "Emily Davis",
      date: "2023-10-22",
      department: "Gynecology",
      doctor: "Dr. Brown",
      diagnosis: "Regular checkup",
      followUp: "2024-01-22",
    },
    {
      id: "V10112",
      patientId: "P10112",
      patientName: "Michael Wilson",
      date: "2023-10-25",
      department: "Cardiology",
      doctor: "Dr. Smith",
      diagnosis: "Arrhythmia",
      followUp: "2023-11-25",
    },
    {
      id: "V10113",
      patientId: "P10023",
      patientName: "John Doe",
      date: "2023-11-15",
      department: "Cardiology",
      doctor: "Dr. Smith",
      diagnosis: "Hypertension - Follow up",
      followUp: "2023-12-15",
    },
    {
      id: "V10114",
      patientId: "P10045",
      patientName: "Jane Smith",
      date: "2023-11-01",
      department: "Orthopedics",
      doctor: "Dr. Johnson",
      diagnosis: "Ankle recovery assessment",
      followUp: null,
    },
    {
      id: "V10115",
      patientId: "P10113",
      patientName: "Sarah Johnson",
      date: "2023-11-05",
      department: "Endocrinology",
      doctor: "Dr. Martinez",
      diagnosis: "Diabetes Type 2",
      followUp: "2023-12-05",
    },
    {
      id: "V10116",
      patientId: "P10114",
      patientName: "David Lee",
      date: "2023-11-08",
      department: "Pulmonology",
      doctor: "Dr. Anderson",
      diagnosis: "Chronic bronchitis",
      followUp: "2023-12-08",
    },
    {
      id: "V10117",
      patientId: "P10115",
      patientName: "Jennifer White",
      date: "2023-11-10",
      department: "Dermatology",
      doctor: "Dr. Wilson",
      diagnosis: "Eczema",
      followUp: "2023-12-10",
    },
    {
      id: "V10118",
      patientId: "P10116",
      patientName: "Thomas Martin",
      date: "2023-11-12",
      department: "Cardiology",
      doctor: "Dr. Smith",
      diagnosis: "Coronary artery disease",
      followUp: "2023-11-26",
    },
    {
      id: "V10119",
      patientId: "P10117",
      patientName: "Lisa Garcia",
      date: "2023-11-14",
      department: "Psychiatry",
      doctor: "Dr. Thompson",
      diagnosis: "Anxiety disorder",
      followUp: "2023-12-14",
    },
  ];

  const patientBilling = [
    {
      id: "B10023",
      patientId: "P10023",
      patientName: "John Doe",
      date: "2023-10-15",
      department: "Cardiology",
      service: "Consultation",
      amount: 1500,
      status: "Paid",
    },
    {
      id: "B10024",
      patientId: "P10023",
      patientName: "John Doe",
      date: "2023-10-15",
      department: "Cardiology",
      service: "ECG",
      amount: 2500,
      status: "Paid",
    },
    {
      id: "B10045",
      patientId: "P10045",
      patientName: "Jane Smith",
      date: "2023-10-18",
      department: "Orthopedics",
      service: "Consultation",
      amount: 1800,
      status: "Paid",
    },
    {
      id: "B10046",
      patientId: "P10045",
      patientName: "Jane Smith",
      date: "2023-10-18",
      department: "Orthopedics",
      service: "X-Ray",
      amount: 3000,
      status: "Paid",
    },
    {
      id: "B10067",
      patientId: "P10067",
      patientName: "Robert Brown",
      date: "2023-10-20",
      department: "Neurology",
      service: "Consultation",
      amount: 2000,
      status: "Pending",
    },
    {
      id: "B10068",
      patientId: "P10067",
      patientName: "Robert Brown",
      date: "2023-10-20",
      department: "Neurology",
      service: "MRI",
      amount: 8000,
      status: "Pending",
    },
    {
      id: "B10089",
      patientId: "P10089",
      patientName: "Emily Davis",
      date: "2023-10-22",
      department: "Gynecology",
      service: "Consultation",
      amount: 1500,
      status: "Paid",
    },
    {
      id: "B10112",
      patientId: "P10112",
      patientName: "Michael Wilson",
      date: "2023-10-25",
      department: "Cardiology",
      service: "Consultation",
      amount: 1500,
      status: "Paid",
    },
    {
      id: "B10113",
      patientId: "P10112",
      patientName: "Michael Wilson",
      date: "2023-10-25",
      department: "Cardiology",
      service: "Echocardiogram",
      amount: 4500,
      status: "Paid",
    },
    {
      id: "B10114",
      patientId: "P10113",
      patientName: "Sarah Johnson",
      date: "2023-11-05",
      department: "Endocrinology",
      service: "Consultation",
      amount: 1800,
      status: "Paid",
    },
    {
      id: "B10115",
      patientId: "P10113",
      patientName: "Sarah Johnson",
      date: "2023-11-05",
      department: "Endocrinology",
      service: "Blood Tests",
      amount: 3500,
      status: "Paid",
    },
    {
      id: "B10116",
      patientId: "P10114",
      patientName: "David Lee",
      date: "2023-11-08",
      department: "Pulmonology",
      service: "Consultation",
      amount: 2000,
      status: "Paid",
    },
    {
      id: "B10117",
      patientId: "P10114",
      patientName: "David Lee",
      date: "2023-11-08",
      department: "Pulmonology",
      service: "Spirometry",
      amount: 2500,
      status: "Pending",
    },
    {
      id: "B10118",
      patientId: "P10115",
      patientName: "Jennifer White",
      date: "2023-11-10",
      department: "Dermatology",
      service: "Consultation",
      amount: 1500,
      status: "Paid",
    },
    {
      id: "B10119",
      patientId: "P10116",
      patientName: "Thomas Martin",
      date: "2023-11-12",
      department: "Cardiology",
      service: "Consultation",
      amount: 1500,
      status: "Paid",
    },
    {
      id: "B10120",
      patientId: "P10116",
      patientName: "Thomas Martin",
      date: "2023-11-12",
      department: "Cardiology",
      service: "Stress Test",
      amount: 5000,
      status: "Pending",
    },
  ];

  const patientAdmissions = [
    {
      id: "A10023",
      patientId: "P10023",
      patientName: "John Doe",
      admissionDate: "2023-09-15",
      dischargeDate: "2023-09-20",
      department: "Cardiology",
      doctor: "Dr. Smith",
      ward: "General Ward",
      bed: "G-12",
      diagnosis: "Chest pain",
      status: "Discharged",
    },
    {
      id: "A10045",
      patientId: "P10045",
      patientName: "Jane Smith",
      admissionDate: "2023-09-18",
      dischargeDate: "2023-09-25",
      department: "Orthopedics",
      doctor: "Dr. Johnson",
      ward: "Private Room",
      bed: "PR-03",
      diagnosis: "Fractured leg",
      status: "Discharged",
    },
    {
      id: "A10067",
      patientId: "P10067",
      patientName: "Robert Brown",
      admissionDate: "2023-10-10",
      dischargeDate: null,
      department: "Neurology",
      doctor: "Dr. Williams",
      ward: "ICU",
      bed: "ICU-05",
      diagnosis: "Stroke",
      status: "Admitted",
    },
    {
      id: "A10089",
      patientId: "P10089",
      patientName: "Emily Davis",
      admissionDate: "2023-10-05",
      dischargeDate: "2023-10-10",
      department: "Gynecology",
      doctor: "Dr. Brown",
      ward: "General Ward",
      bed: "G-15",
      diagnosis: "Appendicitis",
      status: "Discharged",
    },
    {
      id: "A10113",
      patientId: "P10113",
      patientName: "Sarah Johnson",
      admissionDate: "2023-10-28",
      dischargeDate: "2023-11-02",
      department: "Endocrinology",
      doctor: "Dr. Martinez",
      ward: "General Ward",
      bed: "G-18",
      diagnosis: "Diabetic ketoacidosis",
      status: "Discharged",
    },
    {
      id: "A10114",
      patientId: "P10114",
      patientName: "David Lee",
      admissionDate: "2023-11-01",
      dischargeDate: "2023-11-07",
      department: "Pulmonology",
      doctor: "Dr. Anderson",
      ward: "General Ward",
      bed: "G-22",
      diagnosis: "Pneumonia",
      status: "Discharged",
    },
    {
      id: "A10116",
      patientId: "P10116",
      patientName: "Thomas Martin",
      admissionDate: "2023-11-12",
      dischargeDate: null,
      department: "Cardiology",
      doctor: "Dr. Smith",
      ward: "CCU",
      bed: "CCU-03",
      diagnosis: "Myocardial infarction",
      status: "Admitted",
    },
    {
      id: "A10117",
      patientId: "P10117",
      patientName: "Lisa Garcia",
      admissionDate: "2023-11-10",
      dischargeDate: "2023-11-15",
      department: "Psychiatry",
      doctor: "Dr. Thompson",
      ward: "Psychiatric Ward",
      bed: "PW-07",
      diagnosis: "Acute anxiety attack",
      status: "Discharged",
    },
  ];

  const patientLabReports = [
    {
      id: "L10023",
      patientId: "P10023",
      patientName: "John Doe",
      date: "2023-10-15",
      testName: "Complete Blood Count",
      doctor: "Dr. Smith",
      result: "Normal",
      notes: "All parameters within normal range",
    },
    {
      id: "L10024",
      patientId: "P10023",
      patientName: "John Doe",
      date: "2023-10-15",
      testName: "Lipid Profile",
      doctor: "Dr. Smith",
      result: "Abnormal",
      notes: "Elevated LDL cholesterol",
    },
    {
      id: "L10045",
      patientId: "P10045",
      patientName: "Jane Smith",
      date: "2023-10-18",
      testName: "X-Ray",
      doctor: "Dr. Johnson",
      result: "Abnormal",
      notes: "Hairline fracture detected",
    },
    {
      id: "L10067",
      patientId: "P10067",
      patientName: "Robert Brown",
      date: "2023-10-20",
      testName: "MRI Brain",
      doctor: "Dr. Williams",
      result: "Abnormal",
      notes: "Signs of minor ischemia",
    },
    {
      id: "L10089",
      patientId: "P10089",
      patientName: "Emily Davis",
      date: "2023-10-22",
      testName: "Ultrasound",
      doctor: "Dr. Brown",
      result: "Normal",
      notes: "No abnormalities detected",
    },
    {
      id: "L10112",
      patientId: "P10112",
      patientName: "Michael Wilson",
      date: "2023-10-25",
      testName: "ECG",
      doctor: "Dr. Smith",
      result: "Abnormal",
      notes: "Irregular heart rhythm detected",
    },
    {
      id: "L10113",
      patientId: "P10113",
      patientName: "Sarah Johnson",
      date: "2023-11-05",
      testName: "Blood Glucose",
      doctor: "Dr. Martinez",
      result: "Abnormal",
      notes: "Elevated fasting glucose levels",
    },
    {
      id: "L10114",
      patientId: "P10113",
      patientName: "Sarah Johnson",
      date: "2023-11-05",
      testName: "HbA1c",
      doctor: "Dr. Martinez",
      result: "Abnormal",
      notes: "Indicates poor glycemic control",
    },
    {
      id: "L10115",
      patientId: "P10114",
      patientName: "David Lee",
      date: "2023-11-08",
      testName: "Chest X-Ray",
      doctor: "Dr. Anderson",
      result: "Abnormal",
      notes: "Infiltrates in lower lung fields",
    },
    {
      id: "L10116",
      patientId: "P10114",
      patientName: "David Lee",
      date: "2023-11-08",
      testName: "Sputum Culture",
      doctor: "Dr. Anderson",
      result: "Abnormal",
      notes: "Growth of Streptococcus pneumoniae",
    },
    {
      id: "L10117",
      patientId: "P10115",
      patientName: "Jennifer White",
      date: "2023-11-10",
      testName: "Skin Biopsy",
      doctor: "Dr. Wilson",
      result: "Normal",
      notes: "No malignant cells detected",
    },
    {
      id: "L10118",
      patientId: "P10116",
      patientName: "Thomas Martin",
      date: "2023-11-12",
      testName: "Cardiac Enzymes",
      doctor: "Dr. Smith",
      result: "Abnormal",
      notes: "Elevated troponin levels",
    },
    {
      id: "L10119",
      patientId: "P10116",
      patientName: "Thomas Martin",
      date: "2023-11-12",
      testName: "ECG",
      doctor: "Dr. Smith",
      result: "Abnormal",
      notes: "ST-segment elevation in leads V1-V4",
    },
    {
      id: "L10120",
      patientId: "P10117",
      patientName: "Lisa Garcia",
      date: "2023-11-14",
      testName: "Thyroid Function",
      doctor: "Dr. Thompson",
      result: "Normal",
      notes: "All parameters within normal range",
    },
  ];

  const patientDocuments = [
    {
      id: "D10023",
      patientId: "P10023",
      patientName: "John Doe",
      date: "2023-10-15",
      documentType: "Medical Certificate",
      fileName: "john_doe_med_cert.pdf",
      uploadedBy: "Dr. Smith",
      fileSize: "245 KB",
      status: "Verified",
    },
    {
      id: "D10024",
      patientId: "P10023",
      patientName: "John Doe",
      date: "2023-10-15",
      documentType: "Lab Results",
      fileName: "john_doe_lipid_profile.pdf",
      uploadedBy: "Dr. Smith",
      fileSize: "1.2 MB",
      status: "Verified",
    },
    {
      id: "D10045",
      patientId: "P10045",
      patientName: "Jane Smith",
      date: "2023-10-18",
      documentType: "X-Ray Image",
      fileName: "jane_smith_xray.jpg",
      uploadedBy: "Dr. Johnson",
      fileSize: "3.5 MB",
      status: "Verified",
    },
    {
      id: "D10067",
      patientId: "P10067",
      patientName: "Robert Brown",
      date: "2023-10-20",
      documentType: "MRI Scan",
      fileName: "robert_brown_mri.dcm",
      uploadedBy: "Dr. Williams",
      fileSize: "15.8 MB",
      status: "Verified",
    },
    {
      id: "D10089",
      patientId: "P10089",
      patientName: "Emily Davis",
      date: "2023-10-22",
      documentType: "Ultrasound Report",
      fileName: "emily_davis_ultrasound.pdf",
      uploadedBy: "Dr. Brown",
      fileSize: "780 KB",
      status: "Verified",
    },
    {
      id: "D10112",
      patientId: "P10112",
      patientName: "Michael Wilson",
      date: "2023-10-25",
      documentType: "ECG Report",
      fileName: "michael_wilson_ecg.pdf",
      uploadedBy: "Dr. Smith",
      fileSize: "450 KB",
      status: "Verified",
    },
    {
      id: "D10113",
      patientId: "P10113",
      patientName: "Sarah Johnson",
      date: "2023-11-05",
      documentType: "Prescription",
      fileName: "sarah_johnson_prescription.pdf",
      uploadedBy: "Dr. Martinez",
      fileSize: "125 KB",
      status: "Verified",
    },
    {
      id: "D10114",
      patientId: "P10113",
      patientName: "Sarah Johnson",
      date: "2023-11-05",
      documentType: "Consent Form",
      fileName: "sarah_johnson_consent.pdf",
      uploadedBy: "Dr. Martinez",
      fileSize: "95 KB",
      status: "Pending",
    },
    {
      id: "D10115",
      patientId: "P10114",
      patientName: "David Lee",
      date: "2023-11-08",
      documentType: "Chest X-Ray",
      fileName: "david_lee_chest_xray.jpg",
      uploadedBy: "Dr. Anderson",
      fileSize: "2.8 MB",
      status: "Verified",
    },
    {
      id: "D10116",
      patientId: "P10114",
      patientName: "David Lee",
      date: "2023-11-08",
      documentType: "Lab Report",
      fileName: "david_lee_sputum_culture.pdf",
      uploadedBy: "Dr. Anderson",
      fileSize: "320 KB",
      status: "Verified",
    },
    {
      id: "D10117",
      patientId: "P10115",
      patientName: "Jennifer White",
      date: "2023-11-10",
      documentType: "Biopsy Report",
      fileName: "jennifer_white_biopsy.pdf",
      uploadedBy: "Dr. Wilson",
      fileSize: "1.5 MB",
      status: "Pending",
    },
    {
      id: "D10118",
      patientId: "P10116",
      patientName: "Thomas Martin",
      date: "2023-11-12",
      documentType: "Insurance Form",
      fileName: "thomas_martin_insurance.pdf",
      uploadedBy: "Dr. Smith",
      fileSize: "350 KB",
      status: "Uploaded",
    },
    {
      id: "D10119",
      patientId: "P10116",
      patientName: "Thomas Martin",
      date: "2023-11-12",
      documentType: "ECG Report",
      fileName: "thomas_martin_ecg.pdf",
      uploadedBy: "Dr. Smith",
      fileSize: "480 KB",
      status: "Verified",
    },
    {
      id: "D10120",
      patientId: "P10117",
      patientName: "Lisa Garcia",
      date: "2023-11-14",
      documentType: "Medical History",
      fileName: "lisa_garcia_history.pdf",
      uploadedBy: "Dr. Thompson",
      fileSize: "1.8 MB",
      status: "Verified",
    },
  ];

  // Filter data based on search query and other filters
  const filterData = (data: any[], query: string) => {
    return data.filter((item) => {
      const matchesSearch =
        item.patientName?.toLowerCase().includes(query.toLowerCase()) ||
        item.patientId?.toLowerCase().includes(query.toLowerCase()) ||
        item.id?.toLowerCase().includes(query.toLowerCase()) ||
        item.name?.toLowerCase().includes(query.toLowerCase());

      const matchesDepartment =
        department === "all" || item.department === department;
      const matchesDoctor = doctor === "all" || item.doctor === doctor;

      // Date filtering for reports with date field
      let matchesDate = true;
      if (item.date && dateRange.from && dateRange.to) {
        const itemDate = new Date(item.date);
        matchesDate = itemDate >= dateRange.from && itemDate <= dateRange.to;
      } else if (item.admissionDate && dateRange.from && dateRange.to) {
        const itemDate = new Date(item.admissionDate);
        matchesDate = itemDate >= dateRange.from && itemDate <= dateRange.to;
      } else if (item.registrationDate && dateRange.from && dateRange.to) {
        const itemDate = new Date(item.registrationDate);
        matchesDate = itemDate >= dateRange.from && itemDate <= dateRange.to;
      }

      return matchesSearch && matchesDepartment && matchesDoctor && matchesDate;
    });
  };

  const handleGenerateReport = () => {
    setIsGeneratingReport(true);
    // Simulate report generation delay
    setTimeout(() => {
      setIsGeneratingReport(false);
      setShowReport(true);
    }, 1000);
  };

  const handlePrintReport = () => {
    const printContent = document.getElementById("report-content");
    if (printContent) {
      const originalContents = document.body.innerHTML;
      document.body.innerHTML = printContent.innerHTML;
      window.print();
      document.body.innerHTML = originalContents;
      window.location.reload();
    }
  };

  return (
    <div className="space-y-4 bg-white dark:bg-gray-950 print:bg-white print:dark:bg-white">
      <div className="flex justify-between items-center print:hidden">
        <div>
          <h2 className="text-xl font-semibold">Patient Reports</h2>
          <p className="text-muted-foreground">
            Generate and view comprehensive patient reports
          </p>
        </div>
      </div>

      <div className="print:hidden">
        <Tabs
          value={activeReport}
          onValueChange={setActiveReport}
          className="space-y-4"
        >
          <TabsList className="grid grid-cols-2 md:grid-cols-6 gap-2">
            <TabsTrigger
              value="demographics"
              className="flex items-center gap-2"
            >
              <FileText className="h-4 w-4" />
              <span>Demographics</span>
            </TabsTrigger>
            <TabsTrigger value="visits" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>Visit History</span>
            </TabsTrigger>
            <TabsTrigger value="billing" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span>Billing</span>
            </TabsTrigger>
            <TabsTrigger value="admissions" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span>Admissions</span>
            </TabsTrigger>
            <TabsTrigger value="lab" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span>Lab Reports</span>
            </TabsTrigger>
            <TabsTrigger value="documents" className="flex items-center gap-2">
              <File className="h-4 w-4" />
              <span>Documents</span>
            </TabsTrigger>
          </TabsList>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Report Parameters</CardTitle>
              <CardDescription>
                Select parameters to generate the report
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-4">
                <div className="space-y-2 col-span-1 md:col-span-6">
                  <label className="text-sm font-medium">Date Range</label>
                  <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2">
                    <DatePicker
                      selected={dateRange.from}
                      onSelect={(date) =>
                        setDateRange({ ...dateRange, from: date })
                      }
                      placeholder="From date"
                    />
                    <DatePicker
                      selected={dateRange.to}
                      onSelect={(date) =>
                        setDateRange({ ...dateRange, to: date })
                      }
                      placeholder="To date"
                    />
                  </div>
                </div>

                {activeReport !== "demographics" && (
                  <div className="space-y-2 col-span-1 md:col-span-2">
                    <label className="text-sm font-medium">Department</label>
                    <Select value={department} onValueChange={setDepartment}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Departments</SelectItem>
                        <SelectItem value="Cardiology">Cardiology</SelectItem>
                        <SelectItem value="Orthopedics">Orthopedics</SelectItem>
                        <SelectItem value="Neurology">Neurology</SelectItem>
                        <SelectItem value="Gynecology">Gynecology</SelectItem>
                        <SelectItem value="Pediatrics">Pediatrics</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {(activeReport === "visits" ||
                  activeReport === "lab" ||
                  activeReport === "admissions" ||
                  activeReport === "documents") && (
                  <div className="space-y-2 col-span-1 md:col-span-2">
                    <label className="text-sm font-medium">Doctor</label>
                    <Select value={doctor} onValueChange={setDoctor}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select doctor" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Doctors</SelectItem>
                        <SelectItem value="Dr. Smith">Dr. Smith</SelectItem>
                        <SelectItem value="Dr. Johnson">Dr. Johnson</SelectItem>
                        <SelectItem value="Dr. Williams">
                          Dr. Williams
                        </SelectItem>
                        <SelectItem value="Dr. Brown">Dr. Brown</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div className="space-y-2 col-span-1 md:col-span-2">
                  <label className="text-sm font-medium">Report Format</label>
                  <Select value={reportFormat} onValueChange={setReportFormat}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select format" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="detailed">Detailed</SelectItem>
                      <SelectItem value="summary">Summary</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2 col-span-1 md:col-span-2">
                  <label className="text-sm font-medium">Search</label>
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search by ID or name..."
                      className="pl-8"
                      value={localSearchQuery}
                      onChange={(e) => setLocalSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setDateRange({
                      from: new Date(
                        new Date().setDate(new Date().getDate() - 30),
                      ),
                      to: new Date(),
                    });
                    setDepartment("all");
                    setDoctor("all");
                    setReportFormat("detailed");
                    setLocalSearchQuery("");
                    setShowReport(false);
                  }}
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Reset
                </Button>
                <Button
                  onClick={handleGenerateReport}
                  disabled={isGeneratingReport}
                >
                  {isGeneratingReport ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>Generate Report</>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {showReport && (
            <Card
              id="report-content"
              className="print:shadow-none print:border-none"
            >
              <CardHeader className="flex flex-row items-center justify-between pb-2 print:pb-0">
                <div>
                  <CardTitle className="text-xl">
                    {activeReport === "demographics" &&
                      "Patient Demographics Report"}
                    {activeReport === "visits" &&
                      "Patient Visit History Report"}
                    {activeReport === "billing" && "Patient Billing Report"}
                    {activeReport === "admissions" &&
                      "Patient Admissions Report"}
                    {activeReport === "lab" && "Patient Lab Reports"}
                    {activeReport === "documents" && "Patient Documents Report"}
                  </CardTitle>
                  <CardDescription className="print:text-black">
                    {dateRange.from && dateRange.to
                      ? `${dateRange.from.toLocaleDateString()} to ${dateRange.to.toLocaleDateString()}`
                      : "All time"}
                    {department !== "all" && ` • ${department}`}
                    {doctor !== "all" && ` • ${doctor}`}
                  </CardDescription>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="print:hidden"
                  onClick={handlePrintReport}
                >
                  <Printer className="mr-2 h-4 w-4" />
                  Print
                </Button>
              </CardHeader>

              <CardContent className="print:pt-4">
                {/* Demographics Report */}
                {activeReport === "demographics" && (
                  <PatientDemographicsReport
                    data={filterData(patientDemographics, localSearchQuery)}
                    dateRange={dateRange}
                    onPrint={handlePrintReport}
                  />
                )}

                {/* Visit History Report */}
                {activeReport === "visits" && (
                  <PatientVisitHistoryReport
                    data={filterData(patientVisits, localSearchQuery)}
                    dateRange={dateRange}
                    department={department}
                    doctor={doctor}
                    onPrint={handlePrintReport}
                  />
                )}

                {/* Billing Report */}
                {activeReport === "billing" && (
                  <PatientBillingReport
                    data={filterData(patientBilling, localSearchQuery)}
                    dateRange={dateRange}
                    department={department}
                    onPrint={handlePrintReport}
                  />
                )}

                {/* Admissions Report */}
                {activeReport === "admissions" && (
                  <PatientAdmissionsReport
                    data={filterData(patientAdmissions, localSearchQuery)}
                    dateRange={dateRange}
                    department={department}
                    doctor={doctor}
                    onPrint={handlePrintReport}
                  />
                )}

                {/* Lab Reports */}
                {activeReport === "lab" && (
                  <PatientLabReport
                    data={filterData(patientLabReports, localSearchQuery)}
                    dateRange={dateRange}
                    department={department}
                    doctor={doctor}
                    onPrint={handlePrintReport}
                  />
                )}

                {/* Documents */}
                {activeReport === "documents" && (
                  <PatientDocumentReport
                    data={filterData(patientDocuments, localSearchQuery)}
                    dateRange={dateRange}
                    department={department}
                    doctor={doctor}
                    onPrint={handlePrintReport}
                  />
                )}
              </CardContent>
            </Card>
          )}
        </Tabs>
      </div>

      {/* Print-only view that shows when printing */}
      {showReport && (
        <div className="hidden print:block">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold">Hospital Management System</h1>
            <p className="text-lg">123 Hospital Street, City, Country</p>
            <p>Phone: 123-456-7890 | Email: info@hospital.com</p>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-bold border-b pb-2">
              {activeReport === "demographics" && "Patient Demographics Report"}
              {activeReport === "visits" && "Patient Visit History Report"}
              {activeReport === "billing" && "Patient Billing Report"}
              {activeReport === "admissions" && "Patient Admissions Report"}
              {activeReport === "lab" && "Patient Lab Reports"}
              {activeReport === "documents" && "Patient Documents Report"}
            </h2>
            <p className="text-sm mt-2">
              Report Date: {new Date().toLocaleDateString()} | Period:{" "}
              {dateRange.from?.toLocaleDateString()} to{" "}
              {dateRange.to?.toLocaleDateString()}
              {department !== "all" && ` | Department: ${department}`}
              {doctor !== "all" && ` | Doctor: ${doctor}`}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientReports;
