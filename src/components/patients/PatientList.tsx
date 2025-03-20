import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  MoreHorizontal,
  ClipboardList,
  BedDouble,
  FileText,
  Edit,
  Trash2,
  Filter,
  ChevronLeft,
  ChevronRight,
  Printer,
} from "lucide-react";
import { Patient } from "./types";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
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
import { Input } from "@/components/ui/input";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import PatientRegistration from "./PatientRegistration";
import NewOPDVisit from "./opd/NewOPDVisit";
import { toast } from "@/components/ui/use-toast";

interface PatientListProps {
  searchQuery: string;
}

const PatientList: React.FC<PatientListProps> = ({ searchQuery }) => {
  // Sample patient data
  const [patients, setPatients] = useState<Patient[]>([
    {
      id: "1",
      mrNumber: "MR-2023-0001",
      name: "John Smith",
      age: 45,
      ageUnit: "Years",
      gender: "Male",
      contact: "+92 300 1234567",
      address: "123 Main St, Karachi",
      registrationDate: "2023-01-15",
      patientType: ["OPD", "IPD"],
      lastVisit: "2023-06-20",
      bloodGroup: "O+",
      email: "john.smith@example.com",
      cnic: "12345-1234567-1",
      emergencyContact: "+92 300 7654321",
      guardianName: "Mary Smith",
      guardianRelation: "Spouse",
      guardianContact: "+92 300 7654321",
      allergies: ["Penicillin", "Peanuts"],
      chronicDiseases: ["Hypertension"],
      notes: "Regular checkup every 3 months",
    },
    {
      id: "2",
      mrNumber: "MR-2023-0002",
      name: "Sarah Johnson",
      age: 32,
      ageUnit: "Years",
      gender: "Female",
      contact: "+92 321 9876543",
      address: "456 Park Ave, Lahore",
      registrationDate: "2023-02-10",
      patientType: ["OPD"],
      lastVisit: "2023-07-05",
      bloodGroup: "A+",
      email: "sarah.j@example.com",
      cnic: "12345-1234567-2",
      allergies: ["Sulfa drugs"],
      chronicDiseases: [],
      notes: "Pregnancy follow-up",
    },
    {
      id: "3",
      mrNumber: "MR-2023-0003",
      name: "Ahmed Khan",
      age: 60,
      ageUnit: "Years",
      gender: "Male",
      contact: "+92 333 5556666",
      address: "789 Hospital Road, Islamabad",
      registrationDate: "2023-03-22",
      patientType: ["IPD"],
      lastVisit: "2023-05-18",
      bloodGroup: "B-",
      cnic: "12345-1234567-3",
      emergencyContact: "+92 333 6665555",
      guardianName: "Fatima Khan",
      guardianRelation: "Daughter",
      guardianContact: "+92 333 6665555",
      chronicDiseases: ["Diabetes", "Coronary Artery Disease"],
      notes: "Scheduled for cardiac procedure",
    },
    {
      id: "4",
      mrNumber: "MR-2023-0004",
      name: "Fatima Ali",
      age: 28,
      ageUnit: "Years",
      gender: "Female",
      contact: "+92 345 1112222",
      address: "101 Green Town, Faisalabad",
      registrationDate: "2023-04-05",
      patientType: ["OPD", "IPD"],
      lastVisit: "2023-07-10",
      bloodGroup: "AB+",
      email: "fatima.ali@example.com",
      cnic: "12345-1234567-4",
      allergies: [],
      chronicDiseases: ["Asthma"],
      notes: "Requires inhaler regularly",
    },
    {
      id: "5",
      mrNumber: "MR-2023-0005",
      name: "Mohammad Raza",
      age: 52,
      ageUnit: "Years",
      gender: "Male",
      contact: "+92 312 3334444",
      address: "222 Blue Area, Peshawar",
      registrationDate: "2023-05-17",
      patientType: ["OPD"],
      lastVisit: "2023-06-30",
      bloodGroup: "O-",
      cnic: "12345-1234567-5",
      chronicDiseases: ["Hypertension"],
      notes: "Blood pressure monitoring",
    },
    {
      id: "6",
      mrNumber: "MR-2023-0006",
      name: "Ayesha Malik",
      age: 35,
      ageUnit: "Years",
      gender: "Female",
      contact: "+92 321 7778888",
      address: "303 Canal View, Lahore",
      registrationDate: "2023-06-12",
      patientType: ["OPD"],
      lastVisit: "2023-07-15",
      bloodGroup: "A-",
      email: "ayesha.m@example.com",
      cnic: "12345-1234567-6",
      allergies: ["Aspirin"],
      chronicDiseases: [],
      notes: "",
    },
    {
      id: "7",
      mrNumber: "MR-2023-0007",
      name: "Zainab Qureshi",
      age: 4,
      ageUnit: "Years",
      gender: "Female",
      contact: "+92 333 9998887",
      address: "404 Model Town, Karachi",
      registrationDate: "2023-06-20",
      patientType: ["OPD", "IPD"],
      lastVisit: "2023-07-18",
      bloodGroup: "B+",
      guardianName: "Tariq Qureshi",
      guardianRelation: "Father",
      guardianContact: "+92 333 9998887",
      allergies: [],
      chronicDiseases: [],
      notes: "Pediatric follow-up",
    },
    {
      id: "8",
      mrNumber: "MR-2023-0008",
      name: "Imran Ahmed",
      age: 45,
      ageUnit: "Years",
      gender: "Male",
      contact: "+92 345 6667777",
      address: "505 DHA, Islamabad",
      registrationDate: "2023-07-01",
      patientType: ["IPD"],
      lastVisit: "2023-07-20",
      bloodGroup: "AB-",
      email: "imran.a@example.com",
      cnic: "12345-1234567-8",
      emergencyContact: "+92 345 7776666",
      chronicDiseases: ["Kidney Disease"],
      notes: "Dialysis patient",
    },
    {
      id: "9",
      mrNumber: "MR-2023-0009",
      name: "Sana Riaz",
      age: 29,
      ageUnit: "Years",
      gender: "Female",
      contact: "+92 312 4445555",
      address: "606 Johar Town, Lahore",
      registrationDate: "2023-07-10",
      patientType: ["OPD"],
      lastVisit: "2023-07-22",
      bloodGroup: "O+",
      email: "sana.r@example.com",
      cnic: "12345-1234567-9",
      allergies: ["Latex"],
      chronicDiseases: [],
      notes: "",
    },
    {
      id: "10",
      mrNumber: "MR-2023-0010",
      name: "Kamran Shah",
      age: 65,
      ageUnit: "Years",
      gender: "Male",
      contact: "+92 321 1112222",
      address: "707 Gulberg, Karachi",
      registrationDate: "2023-07-15",
      patientType: ["OPD", "IPD"],
      lastVisit: "2023-07-25",
      bloodGroup: "A+",
      cnic: "12345-1234567-0",
      emergencyContact: "+92 321 2221111",
      guardianName: "Nadia Shah",
      guardianRelation: "Daughter",
      guardianContact: "+92 321 2221111",
      chronicDiseases: ["COPD", "Hypertension"],
      notes: "Oxygen therapy",
    },
  ]);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  // Filter state
  const [filters, setFilters] = useState({
    gender: "all",
    patientType: {
      OPD: false,
      IPD: false,
    },
    bloodGroup: "all",
    ageRange: {
      min: "",
      max: "",
    },
  });

  // Edit patient dialog
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentPatient, setCurrentPatient] = useState<Patient | null>(null);

  // OPD Visit dialog
  const [isOPDVisitOpen, setIsOPDVisitOpen] = useState(false);

  // IPD Admission dialog
  const [isIPDAdmissionOpen, setIsIPDAdmissionOpen] = useState(false);

  // Medical History dialog
  const [isMedicalHistoryOpen, setIsMedicalHistoryOpen] = useState(false);

  // Delete confirmation dialog
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [patientToDelete, setPatientToDelete] = useState<string | null>(null);

  // Apply filters and search
  const filteredPatients = patients.filter((patient) => {
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch =
      patient.name.toLowerCase().includes(searchLower) ||
      patient.mrNumber.toLowerCase().includes(searchLower) ||
      patient.contact.toLowerCase().includes(searchLower);

    // Apply gender filter
    const matchesGender =
      filters.gender === "all" || patient.gender === filters.gender;

    // Apply patient type filter
    const matchesPatientType =
      (!filters.patientType.OPD && !filters.patientType.IPD) || // No filter selected
      (filters.patientType.OPD && patient.patientType.includes("OPD")) ||
      (filters.patientType.IPD && patient.patientType.includes("IPD"));

    // Apply blood group filter
    const matchesBloodGroup =
      filters.bloodGroup === "all" || patient.bloodGroup === filters.bloodGroup;

    // Apply age range filter
    const matchesAgeRange =
      (filters.ageRange.min === "" ||
        patient.age >= parseInt(filters.ageRange.min)) &&
      (filters.ageRange.max === "" ||
        patient.age <= parseInt(filters.ageRange.max));

    return (
      matchesSearch &&
      matchesGender &&
      matchesPatientType &&
      matchesBloodGroup &&
      matchesAgeRange
    );
  });

  // Get current patients for pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentPatients = filteredPatients.slice(
    indexOfFirstItem,
    indexOfLastItem,
  );
  const totalPages = Math.ceil(filteredPatients.length / itemsPerPage);

  // Reset to first page when filters or search change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filters]);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("");
  };

  const handleEditPatient = (patient: Patient) => {
    setCurrentPatient(patient);
    setIsEditDialogOpen(true);
  };

  const handleNewOPDVisit = (patient: Patient) => {
    setCurrentPatient(patient);
    setIsOPDVisitOpen(true);
  };

  const handleNewIPDAdmission = (patient: Patient) => {
    setCurrentPatient(patient);
    setIsIPDAdmissionOpen(true);
  };

  const handleViewMedicalHistory = (patient: Patient) => {
    setCurrentPatient(patient);
    setIsMedicalHistoryOpen(true);
  };

  const handlePrintMedicalHistory = () => {
    if (!currentPatient) return;

    // Create a new window for printing
    const printWindow = window.open("", "_blank", "width=800,height=600");
    if (!printWindow) return;

    // Get the current date and time
    const now = new Date();
    const dateTimeStr = now.toLocaleString();

    // Create the print content with hospital header and detailed patient information
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Medical History - ${currentPatient.name}</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 800px;
              margin: 0 auto;
              padding: 20px;
            }
            .header {
              text-align: center;
              margin-bottom: 20px;
              padding-bottom: 20px;
              border-bottom: 2px solid #4a5568;
            }
            .hospital-name {
              font-size: 24px;
              font-weight: bold;
              margin: 0;
              color: #2d3748;
            }
            .hospital-address {
              font-size: 14px;
              margin: 5px 0;
            }
            .report-title {
              font-size: 18px;
              font-weight: bold;
              text-align: center;
              margin: 20px 0;
              padding: 10px;
              background-color: #f7fafc;
              border: 1px solid #e2e8f0;
            }
            .patient-header {
              display: flex;
              justify-content: space-between;
              margin-bottom: 20px;
              padding: 15px;
              background-color: #f7fafc;
              border: 1px solid #e2e8f0;
              border-radius: 5px;
            }
            .patient-info {
              flex: 1;
            }
            .patient-name {
              font-size: 20px;
              font-weight: bold;
              margin: 0 0 5px 0;
            }
            .patient-details {
              font-size: 14px;
              margin: 0;
            }
            .report-date {
              text-align: right;
              font-size: 12px;
              color: #718096;
            }
            .section {
              margin-bottom: 25px;
            }
            .section-title {
              font-size: 16px;
              font-weight: bold;
              margin-bottom: 10px;
              padding-bottom: 5px;
              border-bottom: 1px solid #e2e8f0;
              color: #4a5568;
            }
            .info-grid {
              display: grid;
              grid-template-columns: repeat(2, 1fr);
              gap: 10px;
            }
            .info-item {
              display: flex;
              justify-content: space-between;
              padding: 5px 0;
              border-bottom: 1px dotted #e2e8f0;
            }
            .info-label {
              font-weight: bold;
              color: #4a5568;
            }
            .badge {
              display: inline-block;
              padding: 3px 8px;
              margin: 2px;
              border-radius: 3px;
              font-size: 12px;
            }
            .badge-allergy {
              background-color: #fed7d7;
              color: #c53030;
              border: 1px solid #feb2b2;
            }
            .badge-disease {
              background-color: #feebc8;
              color: #c05621;
              border: 1px solid #fbd38d;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 20px;
            }
            th, td {
              padding: 10px;
              text-align: left;
              border: 1px solid #e2e8f0;
            }
            th {
              background-color: #f7fafc;
              font-weight: bold;
              color: #4a5568;
            }
            tr:nth-child(even) {
              background-color: #f7fafc;
            }
            .notes {
              padding: 10px;
              background-color: #f7fafc;
              border: 1px solid #e2e8f0;
              border-radius: 5px;
              font-style: italic;
            }
            .footer {
              margin-top: 30px;
              text-align: center;
              font-size: 12px;
              color: #718096;
              border-top: 1px solid #e2e8f0;
              padding-top: 20px;
            }
            .print-button {
              display: block;
              margin: 20px auto;
              padding: 10px 20px;
              background-color: #4a5568;
              color: white;
              border: none;
              border-radius: 5px;
              cursor: pointer;
              font-size: 14px;
            }
            .print-button:hover {
              background-color: #2d3748;
            }
            @media print {
              .print-button {
                display: none;
              }
              body {
                padding: 0;
                margin: 0;
              }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <p class="hospital-name">Healthcare Hospital</p>
            <p class="hospital-address">123 Medical Center Road, City</p>
            <p class="hospital-address">Phone: (123) 456-7890 | Email: info@healthcarehospital.com</p>
          </div>
          
          <div class="report-title">PATIENT MEDICAL HISTORY REPORT</div>
          
          <div class="patient-header">
            <div class="patient-info">
              <p class="patient-name">${currentPatient.name}</p>
              <p class="patient-details">MR#: ${currentPatient.mrNumber} | Age: ${currentPatient.age} years | Gender: ${currentPatient.gender} | Blood Group: ${currentPatient.bloodGroup}</p>
            </div>
            <div class="report-date">
              Report Generated: ${dateTimeStr}
            </div>
          </div>
          
          <div class="section">
            <h3 class="section-title">Personal Information</h3>
            <div class="info-grid">
              <div class="info-item">
                <span class="info-label">Registration Date:</span>
                <span>${new Date(currentPatient.registrationDate).toLocaleDateString()}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Last Visit:</span>
                <span>${new Date(currentPatient.lastVisit).toLocaleDateString()}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Contact:</span>
                <span>${currentPatient.contact}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Email:</span>
                <span>${currentPatient.email || "N/A"}</span>
              </div>
              <div class="info-item">
                <span class="info-label">CNIC:</span>
                <span>${currentPatient.cnic || "N/A"}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Address:</span>
                <span>${currentPatient.address}</span>
              </div>
              ${
                currentPatient.emergencyContact
                  ? `
              <div class="info-item">
                <span class="info-label">Emergency Contact:</span>
                <span>${currentPatient.emergencyContact}</span>
              </div>`
                  : ""
              }
              ${
                currentPatient.guardianName
                  ? `
              <div class="info-item">
                <span class="info-label">Guardian:</span>
                <span>${currentPatient.guardianName} (${currentPatient.guardianRelation || "Relation not specified"})</span>
              </div>`
                  : ""
              }
            </div>
          </div>
          
          <div class="section">
            <h3 class="section-title">Medical Information</h3>
            <div class="info-grid">
              <div>
                <h4>Allergies</h4>
                ${
                  currentPatient.allergies &&
                  currentPatient.allergies.length > 0
                    ? currentPatient.allergies
                        .map(
                          (allergy) =>
                            `<span class="badge badge-allergy">${allergy}</span>`,
                        )
                        .join(" ")
                    : "<p>No known allergies</p>"
                }
              </div>
              <div>
                <h4>Chronic Diseases</h4>
                ${
                  currentPatient.chronicDiseases &&
                  currentPatient.chronicDiseases.length > 0
                    ? currentPatient.chronicDiseases
                        .map(
                          (disease) =>
                            `<span class="badge badge-disease">${disease}</span>`,
                        )
                        .join(" ")
                    : "<p>No chronic diseases</p>"
                }
              </div>
            </div>
          </div>
          
          <div class="section">
            <h3 class="section-title">Visit History</h3>
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Type</th>
                  <th>Department</th>
                  <th>Doctor</th>
                  <th>Diagnosis</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>${new Date(currentPatient.lastVisit).toLocaleDateString()}</td>
                  <td>OPD</td>
                  <td>General Medicine</td>
                  <td>Dr. Ahmed Khan</td>
                  <td>Routine checkup</td>
                </tr>
                <tr>
                  <td>${new Date(new Date(currentPatient.lastVisit).setMonth(new Date(currentPatient.lastVisit).getMonth() - 1)).toLocaleDateString()}</td>
                  <td>OPD</td>
                  <td>General Medicine</td>
                  <td>Dr. Ahmed Khan</td>
                  <td>Follow-up</td>
                </tr>
              </tbody>
            </table>
          </div>
          
          ${
            currentPatient.notes
              ? `
          <div class="section">
            <h3 class="section-title">Clinical Notes</h3>
            <div class="notes">
              ${currentPatient.notes}
            </div>
          </div>`
              : ""
          }
          
          <div class="footer">
            <p>This is an official medical record from Healthcare Hospital. Please keep for your records.</p>
            <p>For any queries regarding this report, please contact our medical records department.</p>
          </div>
          
          <button class="print-button" onclick="window.print()">Print Report</button>
          
          <script>
            // Auto-focus the print button when the page loads
            window.onload = function() {
              document.querySelector('.print-button').focus();
            }
          </script>
        </body>
      </html>
    `);

    printWindow.document.close();
  };

  const handleDeletePatient = (patientId: string) => {
    setPatientToDelete(patientId);
    setIsDeleteDialogOpen(true);
  };

  const confirmDeletePatient = () => {
    if (patientToDelete) {
      setPatients(patients.filter((p) => p.id !== patientToDelete));
      toast({
        title: "Patient deleted",
        description: "Patient record has been permanently deleted.",
        variant: "destructive",
      });
      setIsDeleteDialogOpen(false);
      setPatientToDelete(null);
    }
  };

  const handleSavePatient = (updatedPatient: Patient) => {
    setPatients(
      patients.map((p) => (p.id === updatedPatient.id ? updatedPatient : p)),
    );
    setIsEditDialogOpen(false);
    setCurrentPatient(null);
    toast({
      title: "Patient updated",
      description: "Patient information has been successfully updated.",
    });
  };

  const resetFilters = () => {
    setFilters({
      gender: "all",
      patientType: {
        OPD: false,
        IPD: false,
      },
      bloodGroup: "all",
      ageRange: {
        min: "",
        max: "",
      },
    });
  };

  return (
    <Card className="bg-white dark:bg-gray-950">
      <div className="p-4 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">Patient Records</h2>
          <p className="text-sm text-muted-foreground">
            Manage and view patient information
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                <span>Filter</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="space-y-4">
                <h3 className="font-medium">Filter Patients</h3>

                <div className="space-y-2">
                  <Label>Gender</Label>
                  <Select
                    value={filters.gender}
                    onValueChange={(value) =>
                      setFilters({ ...filters, gender: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All Genders" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Genders</SelectItem>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Patient Type</Label>
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="opd"
                        checked={filters.patientType.OPD}
                        onCheckedChange={(checked) =>
                          setFilters({
                            ...filters,
                            patientType: {
                              ...filters.patientType,
                              OPD: checked === true,
                            },
                          })
                        }
                      />
                      <Label htmlFor="opd">OPD</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="ipd"
                        checked={filters.patientType.IPD}
                        onCheckedChange={(checked) =>
                          setFilters({
                            ...filters,
                            patientType: {
                              ...filters.patientType,
                              IPD: checked === true,
                            },
                          })
                        }
                      />
                      <Label htmlFor="ipd">IPD</Label>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Blood Group</Label>
                  <Select
                    value={filters.bloodGroup}
                    onValueChange={(value) =>
                      setFilters({ ...filters, bloodGroup: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All Blood Groups" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Blood Groups</SelectItem>
                      <SelectItem value="A+">A+</SelectItem>
                      <SelectItem value="A-">A-</SelectItem>
                      <SelectItem value="B+">B+</SelectItem>
                      <SelectItem value="B-">B-</SelectItem>
                      <SelectItem value="AB+">AB+</SelectItem>
                      <SelectItem value="AB-">AB-</SelectItem>
                      <SelectItem value="O+">O+</SelectItem>
                      <SelectItem value="O-">O-</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Age Range</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      placeholder="Min"
                      className="w-20"
                      value={filters.ageRange.min}
                      onChange={(e) =>
                        setFilters({
                          ...filters,
                          ageRange: {
                            ...filters.ageRange,
                            min: e.target.value,
                          },
                        })
                      }
                    />
                    <span>to</span>
                    <Input
                      type="number"
                      placeholder="Max"
                      className="w-20"
                      value={filters.ageRange.max}
                      onChange={(e) =>
                        setFilters({
                          ...filters,
                          ageRange: {
                            ...filters.ageRange,
                            max: e.target.value,
                          },
                        })
                      }
                    />
                  </div>
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
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Patient</TableHead>
              <TableHead>MR Number</TableHead>
              <TableHead>Age/Gender</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Last Visit</TableHead>
              <TableHead>Blood Group</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentPatients.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center h-24">
                  No patients found matching your search.
                </TableCell>
              </TableRow>
            ) : (
              currentPatients.map((patient) => (
                <TableRow key={patient.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage
                          src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${patient.id}`}
                          alt={patient.name}
                        />
                        <AvatarFallback>
                          {getInitials(patient.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{patient.name}</div>
                        <div className="text-xs text-muted-foreground">
                          Reg:{" "}
                          {new Date(
                            patient.registrationDate,
                          ).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">
                    {patient.mrNumber}
                  </TableCell>
                  <TableCell>
                    {patient.age} / {patient.gender}
                  </TableCell>
                  <TableCell>{patient.contact}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      {patient.patientType.includes("OPD") && (
                        <Badge
                          variant="outline"
                          className="bg-blue-50 text-blue-700 border-blue-200"
                        >
                          OPD
                        </Badge>
                      )}
                      {patient.patientType.includes("IPD") && (
                        <Badge
                          variant="outline"
                          className="bg-green-50 text-green-700 border-green-200"
                        >
                          IPD
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {new Date(patient.lastVisit).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="font-medium">
                      {patient.bloodGroup}
                    </Badge>
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
                          onClick={() => handleEditPatient(patient)}
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          Edit Patient
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleNewOPDVisit(patient)}
                        >
                          <ClipboardList className="mr-2 h-4 w-4" />
                          New OPD Visit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleNewIPDAdmission(patient)}
                        >
                          <BedDouble className="mr-2 h-4 w-4" />
                          New IPD Admission
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleViewMedicalHistory(patient)}
                        >
                          <FileText className="mr-2 h-4 w-4" />
                          View Medical History
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => handleDeletePatient(patient.id)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete Patient
                        </DropdownMenuItem>
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
          {Math.min(indexOfLastItem, filteredPatients.length)} of{" "}
          {filteredPatients.length} patients
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
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "outline"}
                size="icon"
                className="w-8 h-8"
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </Button>
            ))}
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
              <SelectValue placeholder="5 per page" />
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

      {/* Edit Patient Dialog */}
      {currentPatient && (
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Patient Information</DialogTitle>
              <DialogDescription>
                Update patient details and medical information.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={currentPatient.name}
                    onChange={(e) =>
                      setCurrentPatient({
                        ...currentPatient,
                        name: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="mrNumber">MR Number</Label>
                  <Input
                    id="mrNumber"
                    value={currentPatient.mrNumber}
                    disabled
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="age">Age</Label>
                  <Input
                    id="age"
                    type="number"
                    value={currentPatient.age}
                    onChange={(e) =>
                      setCurrentPatient({
                        ...currentPatient,
                        age: parseInt(e.target.value),
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gender">Gender</Label>
                  <Select
                    value={currentPatient.gender}
                    onValueChange={(value) =>
                      setCurrentPatient({ ...currentPatient, gender: value })
                    }
                  >
                    <SelectTrigger id="gender">
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bloodGroup">Blood Group</Label>
                  <Select
                    value={currentPatient.bloodGroup}
                    onValueChange={(value) =>
                      setCurrentPatient({
                        ...currentPatient,
                        bloodGroup: value,
                      })
                    }
                  >
                    <SelectTrigger id="bloodGroup">
                      <SelectValue placeholder="Select blood group" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="A+">A+</SelectItem>
                      <SelectItem value="A-">A-</SelectItem>
                      <SelectItem value="B+">B+</SelectItem>
                      <SelectItem value="B-">B-</SelectItem>
                      <SelectItem value="AB+">AB+</SelectItem>
                      <SelectItem value="AB-">AB-</SelectItem>
                      <SelectItem value="O+">O+</SelectItem>
                      <SelectItem value="O-">O-</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="contact">Contact Number</Label>
                  <Input
                    id="contact"
                    value={currentPatient.contact}
                    onChange={(e) =>
                      setCurrentPatient({
                        ...currentPatient,
                        contact: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={currentPatient.email || ""}
                    onChange={(e) =>
                      setCurrentPatient({
                        ...currentPatient,
                        email: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={currentPatient.address}
                  onChange={(e) =>
                    setCurrentPatient({
                      ...currentPatient,
                      address: e.target.value,
                    })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Input
                  id="notes"
                  value={currentPatient.notes || ""}
                  onChange={(e) =>
                    setCurrentPatient({
                      ...currentPatient,
                      notes: e.target.value,
                    })
                  }
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsEditDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={() => handleSavePatient(currentPatient)}>
                Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* New OPD Visit Dialog */}
      {currentPatient && (
        <Dialog open={isOPDVisitOpen} onOpenChange={setIsOPDVisitOpen}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>New OPD Visit</DialogTitle>
              <DialogDescription>
                Create a new OPD visit for {currentPatient.name}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Patient Name</Label>
                  <Input value={currentPatient.name} disabled />
                </div>
                <div className="space-y-2">
                  <Label>MR Number</Label>
                  <Input value={currentPatient.mrNumber} disabled />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="visitDate">Visit Date</Label>
                  <Input
                    id="visitDate"
                    type="date"
                    defaultValue={new Date().toISOString().split("T")[0]}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="visitType">Visit Type</Label>
                  <Select defaultValue="First">
                    <SelectTrigger id="visitType">
                      <SelectValue placeholder="Select visit type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="First">First Visit</SelectItem>
                      <SelectItem value="Follow-up">Follow-up</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="department">Department</Label>
                  <Select>
                    <SelectTrigger id="department">
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="General Medicine">
                        General Medicine
                      </SelectItem>
                      <SelectItem value="Pediatrics">Pediatrics</SelectItem>
                      <SelectItem value="Orthopedics">Orthopedics</SelectItem>
                      <SelectItem value="Cardiology">Cardiology</SelectItem>
                      <SelectItem value="Gynecology">Gynecology</SelectItem>
                      <SelectItem value="Neurology">Neurology</SelectItem>
                      <SelectItem value="Dermatology">Dermatology</SelectItem>
                      <SelectItem value="ENT">ENT</SelectItem>
                      <SelectItem value="Ophthalmology">
                        Ophthalmology
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="doctor">Doctor</Label>
                  <Select>
                    <SelectTrigger id="doctor">
                      <SelectValue placeholder="Select doctor" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dr1">Dr. Ahmed Khan</SelectItem>
                      <SelectItem value="dr2">Dr. Fatima Ali</SelectItem>
                      <SelectItem value="dr3">Dr. Zainab Qureshi</SelectItem>
                      <SelectItem value="dr4">Dr. Mohammad Raza</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="chiefComplaint">Chief Complaint</Label>
                <Input
                  id="chiefComplaint"
                  placeholder="Enter chief complaint"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fee">Consultation Fee</Label>
                  <Input id="fee" type="number" defaultValue="500" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="paymentStatus">Payment Status</Label>
                  <Select defaultValue="Pending">
                    <SelectTrigger id="paymentStatus">
                      <SelectValue placeholder="Select payment status" />
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
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsOPDVisitOpen(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  setIsOPDVisitOpen(false);
                  toast({
                    title: "OPD Visit Created",
                    description: `New OPD visit created for ${currentPatient.name}`,
                  });
                }}
              >
                Create Visit
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* IPD Admission Dialog */}
      {currentPatient && (
        <Dialog open={isIPDAdmissionOpen} onOpenChange={setIsIPDAdmissionOpen}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>New IPD Admission</DialogTitle>
              <DialogDescription>
                Create a new inpatient admission for {currentPatient.name}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Patient Name</Label>
                  <Input value={currentPatient.name} disabled />
                </div>
                <div className="space-y-2">
                  <Label>MR Number</Label>
                  <Input value={currentPatient.mrNumber} disabled />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="admissionDate">Admission Date</Label>
                  <Input
                    id="admissionDate"
                    type="date"
                    defaultValue={new Date().toISOString().split("T")[0]}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="admissionType">Admission Type</Label>
                  <Select defaultValue="Elective">
                    <SelectTrigger id="admissionType">
                      <SelectValue placeholder="Select admission type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Elective">Elective</SelectItem>
                      <SelectItem value="Emergency">Emergency</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="ward">Ward</Label>
                  <Select>
                    <SelectTrigger id="ward">
                      <SelectValue placeholder="Select ward" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ward1">
                        General Ward (Ground Floor)
                      </SelectItem>
                      <SelectItem value="ward2">
                        Private Ward (1st Floor)
                      </SelectItem>
                      <SelectItem value="ward3">ICU (2nd Floor)</SelectItem>
                      <SelectItem value="ward4">
                        Pediatric Ward (3rd Floor)
                      </SelectItem>
                      <SelectItem value="ward5">
                        Maternity Ward (4th Floor)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bed">Bed</Label>
                  <Select>
                    <SelectTrigger id="bed">
                      <SelectValue placeholder="Select bed" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bed1">Bed 101 (Available)</SelectItem>
                      <SelectItem value="bed2">Bed 102 (Available)</SelectItem>
                      <SelectItem value="bed3">Bed 103 (Available)</SelectItem>
                      <SelectItem value="bed4">Bed 104 (Available)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="primaryDoctor">Primary Doctor</Label>
                  <Select>
                    <SelectTrigger id="primaryDoctor">
                      <SelectValue placeholder="Select primary doctor" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dr1">Dr. Ahmed Khan</SelectItem>
                      <SelectItem value="dr2">Dr. Fatima Ali</SelectItem>
                      <SelectItem value="dr3">Dr. Zainab Qureshi</SelectItem>
                      <SelectItem value="dr4">Dr. Mohammad Raza</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="roomCategory">Room Category</Label>
                  <Select>
                    <SelectTrigger id="roomCategory">
                      <SelectValue placeholder="Select room category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="General">General</SelectItem>
                      <SelectItem value="Semi-Private">Semi-Private</SelectItem>
                      <SelectItem value="Private">Private</SelectItem>
                      <SelectItem value="Deluxe">Deluxe</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="diagnosisOnAdmission">
                  Diagnosis on Admission
                </Label>
                <Input
                  id="diagnosisOnAdmission"
                  placeholder="Enter diagnosis"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="advancePayment">Advance Payment</Label>
                  <Input
                    id="advancePayment"
                    type="number"
                    defaultValue="5000"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="estimatedStayCost">Estimated Stay Cost</Label>
                  <Input
                    id="estimatedStayCost"
                    type="number"
                    defaultValue="25000"
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsIPDAdmissionOpen(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  setIsIPDAdmissionOpen(false);
                  toast({
                    title: "IPD Admission Created",
                    description: `New IPD admission created for ${currentPatient.name}`,
                  });
                }}
              >
                Create Admission
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Medical History Dialog */}
      {currentPatient && (
        <Dialog
          open={isMedicalHistoryOpen}
          onOpenChange={setIsMedicalHistoryOpen}
        >
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Medical History</DialogTitle>
              <DialogDescription>
                Medical history and records for {currentPatient.name}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-6" id="patient-medical-history">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${currentPatient.id}`}
                    alt={currentPatient.name}
                  />
                  <AvatarFallback>
                    {getInitials(currentPatient.name)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-lg font-semibold">
                    {currentPatient.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {currentPatient.mrNumber}
                  </p>
                  <div className="flex gap-2 mt-1">
                    <Badge variant="outline">{currentPatient.age} years</Badge>
                    <Badge variant="outline">{currentPatient.gender}</Badge>
                    <Badge variant="outline">{currentPatient.bloodGroup}</Badge>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium">Patient Information</h4>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Registration Date:
                    </span>
                    <span>
                      {new Date(
                        currentPatient.registrationDate,
                      ).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Last Visit:</span>
                    <span>
                      {new Date(currentPatient.lastVisit).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Contact:</span>
                    <span>{currentPatient.contact}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Email:</span>
                    <span>{currentPatient.email || "N/A"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">CNIC:</span>
                    <span>{currentPatient.cnic || "N/A"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Address:</span>
                    <span>{currentPatient.address}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium">Medical Information</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h5 className="text-sm font-medium mb-2">Allergies</h5>
                    {currentPatient.allergies &&
                    currentPatient.allergies.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {currentPatient.allergies.map((allergy, index) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="bg-red-50 text-red-700 border-red-200"
                          >
                            {allergy}
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        No known allergies
                      </p>
                    )}
                  </div>
                  <div>
                    <h5 className="text-sm font-medium mb-2">
                      Chronic Diseases
                    </h5>
                    {currentPatient.chronicDiseases &&
                    currentPatient.chronicDiseases.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {currentPatient.chronicDiseases.map(
                          (disease, index) => (
                            <Badge
                              key={index}
                              variant="outline"
                              className="bg-amber-50 text-amber-700 border-amber-200"
                            >
                              {disease}
                            </Badge>
                          ),
                        )}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        No chronic diseases
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium">Recent Visits</h4>
                <div className="border rounded-md">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Department</TableHead>
                        <TableHead>Doctor</TableHead>
                        <TableHead>Diagnosis</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>
                          {new Date(
                            currentPatient.lastVisit,
                          ).toLocaleDateString()}
                        </TableCell>
                        <TableCell>OPD</TableCell>
                        <TableCell>General Medicine</TableCell>
                        <TableCell>Dr. Ahmed Khan</TableCell>
                        <TableCell>Routine checkup</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>
                          {new Date(
                            new Date(currentPatient.lastVisit).setMonth(
                              new Date(currentPatient.lastVisit).getMonth() - 1,
                            ),
                          ).toLocaleDateString()}
                        </TableCell>
                        <TableCell>OPD</TableCell>
                        <TableCell>General Medicine</TableCell>
                        <TableCell>Dr. Ahmed Khan</TableCell>
                        <TableCell>Follow-up</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </div>

              {currentPatient.notes && (
                <div className="space-y-2">
                  <h4 className="font-medium">Notes</h4>
                  <p className="text-sm">{currentPatient.notes}</p>
                </div>
              )}
            </div>
            <DialogFooter className="flex justify-between">
              <Button
                variant="outline"
                onClick={handlePrintMedicalHistory}
                className="flex items-center gap-2"
              >
                <Printer className="h-4 w-4" />
                Print Medical History
              </Button>
              <Button onClick={() => setIsMedicalHistoryOpen(false)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you sure you want to delete this patient?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              patient record and all associated medical history from the
              database.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeletePatient}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
};

export default PatientList;
