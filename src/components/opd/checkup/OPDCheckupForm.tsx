import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
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
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import {
  Search,
  Plus,
  Trash2,
  Calendar as CalendarIcon,
  FileText,
  AlertCircle,
  Stethoscope,
  FlaskConical,
  Pill,
  ClipboardList,
  Clock,
  Info,
  Loader2,
  BrainCircuit,
} from "lucide-react";

// Mock data for dropdowns
const mockPatients = [
  {
    id: "P001",
    name: "John Doe",
    age: 45,
    gender: "Male",
    bloodGroup: "O+",
    contact: "9876543210",
    visitDetails: {
      bp: "120/80",
      temperature: "98.6",
      height: "175",
      weight: "70",
      pulse: "72",
      respiratoryRate: "16",
      oxygenSaturation: "98",
    },
  },
  {
    id: "P002",
    name: "Jane Smith",
    age: 32,
    gender: "Female",
    bloodGroup: "A+",
    contact: "9876543211",
    visitDetails: {
      bp: "110/70",
      temperature: "98.4",
      height: "165",
      weight: "58",
      pulse: "68",
      respiratoryRate: "14",
      oxygenSaturation: "99",
    },
  },
  {
    id: "P003",
    name: "Robert Brown",
    age: 58,
    gender: "Male",
    bloodGroup: "B+",
    contact: "9876543212",
    visitDetails: {
      bp: "140/90",
      temperature: "99.1",
      height: "180",
      weight: "85",
      pulse: "78",
      respiratoryRate: "18",
      oxygenSaturation: "96",
    },
  },
];

const mockSymptoms = [
  { id: "1", name: "Fever", description: "Elevated body temperature" },
  { id: "2", name: "Headache", description: "Pain in the head or upper neck" },
  {
    id: "3",
    name: "Cough",
    description: "Sudden expulsion of air from the lungs",
  },
  {
    id: "4",
    name: "Fatigue",
    description: "Feeling of tiredness or exhaustion",
  },
  {
    id: "5",
    name: "Nausea",
    description: "Feeling of sickness with an inclination to vomit",
  },
  {
    id: "6",
    name: "Dizziness",
    description: "Feeling faint, woozy, or unsteady",
  },
  {
    id: "7",
    name: "Chest Pain",
    description: "Pain or discomfort in the chest",
  },
  { id: "8", name: "Shortness of Breath", description: "Difficulty breathing" },
];

const mockDiseases = [
  {
    id: "1",
    name: "Hypertension",
    description: "High blood pressure",
    icd10Code: "I10",
  },
  {
    id: "2",
    name: "Type 2 Diabetes",
    description: "Non-insulin-dependent diabetes mellitus",
    icd10Code: "E11",
  },
  {
    id: "3",
    name: "Asthma",
    description: "Chronic respiratory condition",
    icd10Code: "J45",
  },
  {
    id: "4",
    name: "Common Cold",
    description: "Viral infectious disease",
    icd10Code: "J00",
  },
  {
    id: "5",
    name: "Influenza",
    description: "Viral infection that attacks respiratory system",
    icd10Code: "J10",
  },
  {
    id: "6",
    name: "Migraine",
    description: "Recurring headache",
    icd10Code: "G43",
  },
  {
    id: "7",
    name: "Gastritis",
    description: "Inflammation of the stomach lining",
    icd10Code: "K29",
  },
  {
    id: "8",
    name: "Bronchitis",
    description: "Inflammation of the bronchial tubes",
    icd10Code: "J20",
  },
];

const mockTests = [
  {
    id: "1",
    name: "Complete Blood Count",
    description: "Measures various components of blood",
    category: "Hematology",
    price: 500,
  },
  {
    id: "2",
    name: "Blood Glucose",
    description: "Measures blood sugar levels",
    category: "Biochemistry",
    price: 300,
  },
  {
    id: "3",
    name: "Lipid Profile",
    description: "Measures cholesterol and triglycerides",
    category: "Biochemistry",
    price: 800,
  },
  {
    id: "4",
    name: "Liver Function Test",
    description: "Assesses liver function",
    category: "Biochemistry",
    price: 1000,
  },
  {
    id: "5",
    name: "Kidney Function Test",
    description: "Assesses kidney function",
    category: "Biochemistry",
    price: 1000,
  },
  {
    id: "6",
    name: "Thyroid Function Test",
    description: "Assesses thyroid function",
    category: "Endocrinology",
    price: 1200,
  },
  {
    id: "7",
    name: "Chest X-Ray",
    description: "Imaging of the chest",
    category: "Radiology",
    price: 800,
  },
  {
    id: "8",
    name: "ECG",
    description: "Records electrical activity of the heart",
    category: "Cardiology",
    price: 500,
  },
];

const mockMedicines = [
  {
    id: "1",
    name: "Paracetamol",
    description: "Pain reliever and fever reducer",
    category: "Analgesic",
  },
  {
    id: "2",
    name: "Amoxicillin",
    description: "Antibiotic",
    category: "Antibiotic",
  },
  {
    id: "3",
    name: "Omeprazole",
    description: "Reduces stomach acid",
    category: "Proton Pump Inhibitor",
  },
  {
    id: "4",
    name: "Lisinopril",
    description: "Treats high blood pressure",
    category: "ACE Inhibitor",
  },
  {
    id: "5",
    name: "Metformin",
    description: "Treats type 2 diabetes",
    category: "Antidiabetic",
  },
  {
    id: "6",
    name: "Atorvastatin",
    description: "Lowers cholesterol",
    category: "Statin",
  },
  {
    id: "7",
    name: "Salbutamol",
    description: "Treats asthma",
    category: "Bronchodilator",
  },
  {
    id: "8",
    name: "Cetirizine",
    description: "Treats allergies",
    category: "Antihistamine",
  },
];

const mockDosages = [
  {
    id: "1",
    name: "Once daily",
    description: "Take once a day",
    frequency: "1-0-0",
  },
  {
    id: "2",
    name: "Twice daily",
    description: "Take twice a day",
    frequency: "1-0-1",
  },
  {
    id: "3",
    name: "Three times daily",
    description: "Take three times a day",
    frequency: "1-1-1",
  },
  {
    id: "4",
    name: "Four times daily",
    description: "Take four times a day",
    frequency: "1-1-1-1",
  },
  {
    id: "5",
    name: "Before meals",
    description: "Take before meals",
    frequency: "Before meals",
  },
  {
    id: "6",
    name: "After meals",
    description: "Take after meals",
    frequency: "After meals",
  },
];

const mockDays = [
  { id: "1", name: "1 Day", value: 1, description: "For one day" },
  { id: "2", name: "3 Days", value: 3, description: "For three days" },
  { id: "3", name: "5 Days", value: 5, description: "For five days" },
  { id: "4", name: "7 Days", value: 7, description: "For one week" },
  { id: "5", name: "10 Days", value: 10, description: "For ten days" },
  { id: "6", name: "15 Days", value: 15, description: "For fifteen days" },
  { id: "7", name: "30 Days", value: 30, description: "For one month" },
];

// Mock patient history
const mockPatientHistory = [
  {
    id: "V001",
    date: "2023-10-15",
    doctor: "Dr. Sarah Johnson",
    diagnosis: ["Common Cold", "Allergic Rhinitis"],
    symptoms: ["Cough", "Runny Nose", "Sneezing"],
    medications: [
      { name: "Cetirizine", dosage: "Once daily", days: 7 },
      { name: "Paracetamol", dosage: "Three times daily", days: 3 },
    ],
    tests: ["Complete Blood Count"],
    notes: "Patient advised to rest and increase fluid intake.",
  },
  {
    id: "V002",
    date: "2023-08-22",
    doctor: "Dr. Michael Chen",
    diagnosis: ["Gastritis"],
    symptoms: ["Abdominal Pain", "Nausea", "Loss of Appetite"],
    medications: [
      { name: "Omeprazole", dosage: "Once daily", days: 14 },
      { name: "Domperidone", dosage: "Three times daily", days: 7 },
    ],
    tests: ["Liver Function Test", "Abdominal Ultrasound"],
    notes: "Patient advised to avoid spicy foods and alcohol.",
  },
];

interface OPDCheckupFormProps {}

const OPDCheckupForm: React.FC<OPDCheckupFormProps> = () => {
  // State for selected patient
  const [selectedPatient, setSelectedPatient] = useState<string>("");
  const [patientDetails, setPatientDetails] = useState<any>(null);

  // State for new item creation
  const [showNewSymptomDialog, setShowNewSymptomDialog] =
    useState<boolean>(false);
  const [newSymptomName, setNewSymptomName] = useState<string>("");
  const [newSymptomDescription, setNewSymptomDescription] =
    useState<string>("");

  const [showNewDiseaseDialog, setShowNewDiseaseDialog] =
    useState<boolean>(false);
  const [newDiseaseName, setNewDiseaseName] = useState<string>("");
  const [newDiseaseDescription, setNewDiseaseDescription] =
    useState<string>("");
  const [newDiseaseIcd10Code, setNewDiseaseIcd10Code] = useState<string>("");

  const [showNewTestDialog, setShowNewTestDialog] = useState<boolean>(false);
  const [newTestName, setNewTestName] = useState<string>("");
  const [newTestDescription, setNewTestDescription] = useState<string>("");
  const [newTestCategory, setNewTestCategory] = useState<string>("");
  const [newTestPrice, setNewTestPrice] = useState<string>("");

  const [showNewMedicineDialog, setShowNewMedicineDialog] =
    useState<boolean>(false);
  const [newMedicineName, setNewMedicineName] = useState<string>("");
  const [newMedicineDescription, setNewMedicineDescription] =
    useState<string>("");
  const [newMedicineCategory, setNewMedicineCategory] = useState<string>("");

  const [showNewDosageDialog, setShowNewDosageDialog] =
    useState<boolean>(false);
  const [newDosageName, setNewDosageName] = useState<string>("");
  const [newDosageDescription, setNewDosageDescription] = useState<string>("");
  const [newDosageFrequency, setNewDosageFrequency] = useState<string>("");

  const [showNewDaysDialog, setShowNewDaysDialog] = useState<boolean>(false);
  const [newDaysName, setNewDaysName] = useState<string>("");
  const [newDaysValue, setNewDaysValue] = useState<string>("");
  const [newDaysDescription, setNewDaysDescription] = useState<string>("");

  // State for active tab
  const [activeTab, setActiveTab] = useState("symptoms");

  // State for each step
  const [selectedSymptom, setSelectedSymptom] = useState<string>("");
  const [symptoms, setSymptoms] = useState<any[]>([]);

  const [selectedDisease, setSelectedDisease] = useState<string>("");
  const [provisionalDiagnosis, setProvisionalDiagnosis] = useState<any[]>([]);

  const [selectedTest, setSelectedTest] = useState<string>("");
  const [tests, setTests] = useState<any[]>([]);

  const [finalDiagnosis, setFinalDiagnosis] = useState<any[]>([]);

  const [selectedMedicine, setSelectedMedicine] = useState<string>("");
  const [selectedDosage, setSelectedDosage] = useState<string>("");
  const [selectedDays, setSelectedDays] = useState<string>("");
  const [medications, setMedications] = useState<any[]>([]);

  const [remarks, setRemarks] = useState<string>("");
  const [followUpDate, setFollowUpDate] = useState<Date | undefined>(undefined);

  // State for showing patient history
  const [showHistory, setShowHistory] = useState<boolean>(false);

  // State for AI suggestions
  const [aiSuggestionQuery, setAiSuggestionQuery] = useState<string>("");
  const [isLoadingAiSuggestion, setIsLoadingAiSuggestion] =
    useState<boolean>(false);
  const [aiSuggestions, setAiSuggestions] = useState<any[]>([]);

  // Effect to load patient details when selected
  useEffect(() => {
    if (selectedPatient) {
      const patient = mockPatients.find((p) => p.id === selectedPatient);
      setPatientDetails(patient);
    } else {
      setPatientDetails(null);
    }
  }, [selectedPatient]);

  // Handler for adding symptom
  const handleAddSymptom = () => {
    if (!selectedSymptom) return;

    const symptom = mockSymptoms.find((s) => s.id === selectedSymptom);
    if (symptom && !symptoms.some((s) => s.id === symptom.id)) {
      setSymptoms([...symptoms, symptom]);
      setSelectedSymptom("");
    }
  };

  // Handler for creating new symptom
  const handleCreateNewSymptom = () => {
    if (!newSymptomName) return;

    const newSymptom = {
      id: `sym-${Date.now()}`,
      name: newSymptomName,
      description: newSymptomDescription || "No description provided",
    };

    // Add to mock data
    mockSymptoms.push(newSymptom);

    // Add to selected symptoms
    setSymptoms([...symptoms, newSymptom]);

    // Reset form
    setNewSymptomName("");
    setNewSymptomDescription("");
    setShowNewSymptomDialog(false);
  };

  // Handler for removing symptom
  const handleRemoveSymptom = (id: string) => {
    setSymptoms(symptoms.filter((s) => s.id !== id));
  };

  // Handler for adding provisional diagnosis
  const handleAddProvisionalDiagnosis = () => {
    if (!selectedDisease) return;

    const disease = mockDiseases.find((d) => d.id === selectedDisease);
    if (disease && !provisionalDiagnosis.some((d) => d.id === disease.id)) {
      setProvisionalDiagnosis([...provisionalDiagnosis, disease]);
      setSelectedDisease("");
    }
  };

  // Handler for creating new disease
  const handleCreateNewDisease = () => {
    if (!newDiseaseName || !newDiseaseIcd10Code) return;

    const newDisease = {
      id: `dis-${Date.now()}`,
      name: newDiseaseName,
      description: newDiseaseDescription || "No description provided",
      icd10Code: newDiseaseIcd10Code,
    };

    // Add to mock data
    mockDiseases.push(newDisease);

    // Add to provisional diagnosis
    setProvisionalDiagnosis([...provisionalDiagnosis, newDisease]);

    // Reset form
    setNewDiseaseName("");
    setNewDiseaseDescription("");
    setNewDiseaseIcd10Code("");
    setShowNewDiseaseDialog(false);
  };

  // Handler for removing provisional diagnosis
  const handleRemoveProvisionalDiagnosis = (id: string) => {
    setProvisionalDiagnosis(provisionalDiagnosis.filter((d) => d.id !== id));
  };

  // Handler for adding test
  const handleAddTest = () => {
    if (!selectedTest) return;

    const test = mockTests.find((t) => t.id === selectedTest);
    if (test && !tests.some((t) => t.id === test.id)) {
      setTests([...tests, test]);
      setSelectedTest("");
    }
  };

  // Handler for creating new test
  const handleCreateNewTest = () => {
    if (!newTestName || !newTestCategory || !newTestPrice) return;

    const newTest = {
      id: `test-${Date.now()}`,
      name: newTestName,
      description: newTestDescription || "No description provided",
      category: newTestCategory,
      price: parseInt(newTestPrice) || 0,
    };

    // Add to mock data
    mockTests.push(newTest);

    // Add to selected tests
    setTests([...tests, newTest]);

    // Reset form
    setNewTestName("");
    setNewTestDescription("");
    setNewTestCategory("");
    setNewTestPrice("");
    setShowNewTestDialog(false);
  };

  // Handler for removing test
  const handleRemoveTest = (id: string) => {
    setTests(tests.filter((t) => t.id !== id));
  };

  // Handler for adding to final diagnosis
  const handleAddToFinalDiagnosis = (disease: any) => {
    if (!finalDiagnosis.some((d) => d.id === disease.id)) {
      setFinalDiagnosis([...finalDiagnosis, disease]);
    }
  };

  // Handler for removing from final diagnosis
  const handleRemoveFinalDiagnosis = (id: string) => {
    setFinalDiagnosis(finalDiagnosis.filter((d) => d.id !== id));
  };

  // Handler for adding medication
  const handleAddMedication = () => {
    if (!selectedMedicine || !selectedDosage || !selectedDays) return;

    const medicine = mockMedicines.find((m) => m.id === selectedMedicine);
    const dosage = mockDosages.find((d) => d.id === selectedDosage);
    const days = mockDays.find((d) => d.id === selectedDays);

    if (medicine && dosage && days) {
      const medication = {
        id: `med-${Date.now()}`,
        medicine,
        dosage,
        days,
      };

      setMedications([...medications, medication]);
      setSelectedMedicine("");
      setSelectedDosage("");
      setSelectedDays("");
    }
  };

  // Handler for creating new medicine
  const handleCreateNewMedicine = () => {
    if (!newMedicineName || !newMedicineCategory) return;

    const newMedicine = {
      id: `med-${Date.now()}`,
      name: newMedicineName,
      description: newMedicineDescription || "No description provided",
      category: newMedicineCategory,
    };

    // Add to mock data
    mockMedicines.push(newMedicine);

    // Set as selected medicine
    setSelectedMedicine(newMedicine.id);

    // Reset form
    setNewMedicineName("");
    setNewMedicineDescription("");
    setNewMedicineCategory("");
    setShowNewMedicineDialog(false);
  };

  // Handler for creating new dosage
  const handleCreateNewDosage = () => {
    if (!newDosageName || !newDosageFrequency) return;

    const newDosage = {
      id: `dos-${Date.now()}`,
      name: newDosageName,
      description: newDosageDescription || "No description provided",
      frequency: newDosageFrequency,
    };

    // Add to mock data
    mockDosages.push(newDosage);

    // Set as selected dosage
    setSelectedDosage(newDosage.id);

    // Reset form
    setNewDosageName("");
    setNewDosageDescription("");
    setNewDosageFrequency("");
    setShowNewDosageDialog(false);
  };

  // Handler for creating new days
  const handleCreateNewDays = () => {
    if (!newDaysName || !newDaysValue) return;

    const newDays = {
      id: `days-${Date.now()}`,
      name: newDaysName,
      value: parseInt(newDaysValue) || 1,
      description: newDaysDescription || "No description provided",
    };

    // Add to mock data
    mockDays.push(newDays);

    // Set as selected days
    setSelectedDays(newDays.id);

    // Reset form
    setNewDaysName("");
    setNewDaysValue("");
    setNewDaysDescription("");
    setShowNewDaysDialog(false);
  };

  // Handler for removing medication
  const handleRemoveMedication = (id: string) => {
    setMedications(medications.filter((m) => m.id !== id));
  };

  // Handler for getting AI suggestions
  const handleGetAiSuggestions = () => {
    if (!aiSuggestionQuery) return;

    setIsLoadingAiSuggestion(true);

    // Simulate API call with timeout
    setTimeout(() => {
      // Mock AI suggestions based on query
      const mockAiSuggestions = [
        {
          id: "ai-1",
          title: "Possible Diagnosis",
          content:
            "Based on the symptoms (fever, headache, cough), consider Upper Respiratory Tract Infection or Influenza.",
        },
        {
          id: "ai-2",
          title: "Recommended Tests",
          content:
            "Consider Complete Blood Count to check for infection markers and Chest X-Ray if respiratory symptoms persist.",
        },
        {
          id: "ai-3",
          title: "Treatment Options",
          content:
            "For symptomatic relief: Paracetamol for fever, adequate hydration, and rest. If bacterial infection is suspected, consider antibiotics like Amoxicillin.",
        },
      ];

      setAiSuggestions(mockAiSuggestions);
      setIsLoadingAiSuggestion(false);
    }, 1500);
  };

  // Handler for saving checkup at current stage
  const handleSaveCheckup = () => {
    // Implement save logic here
    console.log("Saving checkup at current stage");
    alert("Checkup saved successfully!");
  };

  // State for completed checkups list
  const [completedCheckups, setCompletedCheckups] = useState<any[]>([]);
  const [showCompletedCheckups, setShowCompletedCheckups] =
    useState<boolean>(false);

  // Handler for completing checkup
  const handleCompleteCheckup = () => {
    // Create a new checkup record
    const newCheckup = {
      id: `C${Date.now()}`,
      date: new Date().toISOString().split("T")[0],
      patient: patientDetails,
      symptoms,
      diagnosis: finalDiagnosis,
      tests,
      medications,
      remarks,
      followUpDate,
    };

    // Add to completed checkups
    setCompletedCheckups([...completedCheckups, newCheckup]);

    // Reset form
    setSelectedPatient("");
    setPatientDetails(null);
    setSymptoms([]);
    setProvisionalDiagnosis([]);
    setTests([]);
    setFinalDiagnosis([]);
    setMedications([]);
    setRemarks("");
    setFollowUpDate(undefined);
    setActiveTab("symptoms");

    // Show success message
    alert("Checkup completed successfully!");
  };

  // Handler for navigating to next tab
  const handleNextTab = () => {
    switch (activeTab) {
      case "symptoms":
        setActiveTab("provisional-diagnosis");
        break;
      case "provisional-diagnosis":
        setActiveTab("tests");
        break;
      case "tests":
        setActiveTab("final-diagnosis");
        break;
      case "final-diagnosis":
        setActiveTab("treatment");
        break;
      case "treatment":
        setActiveTab("remarks");
        break;
      default:
        break;
    }
  };

  // Handler for navigating to previous tab
  const handlePreviousTab = () => {
    switch (activeTab) {
      case "provisional-diagnosis":
        setActiveTab("symptoms");
        break;
      case "tests":
        setActiveTab("provisional-diagnosis");
        break;
      case "final-diagnosis":
        setActiveTab("tests");
        break;
      case "treatment":
        setActiveTab("final-diagnosis");
        break;
      case "remarks":
        setActiveTab("treatment");
        break;
      default:
        break;
    }
  };

  return (
    <div className="space-y-6">
      {/* New Symptom Dialog */}
      <Dialog
        open={showNewSymptomDialog}
        onOpenChange={setShowNewSymptomDialog}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Symptom</DialogTitle>
            <DialogDescription>
              Create a new symptom that will be available for all checkups
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="symptom-name">Symptom Name</Label>
              <Input
                id="symptom-name"
                placeholder="Enter symptom name"
                value={newSymptomName}
                onChange={(e) => setNewSymptomName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="symptom-description">Description</Label>
              <Textarea
                id="symptom-description"
                placeholder="Enter symptom description"
                value={newSymptomDescription}
                onChange={(e) => setNewSymptomDescription(e.target.value)}
              />
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={() => setShowNewSymptomDialog(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleCreateNewSymptom} disabled={!newSymptomName}>
              Create Symptom
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* New Disease Dialog */}
      <Dialog
        open={showNewDiseaseDialog}
        onOpenChange={setShowNewDiseaseDialog}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Disease</DialogTitle>
            <DialogDescription>
              Create a new disease that will be available for all checkups
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="disease-name">Disease Name</Label>
              <Input
                id="disease-name"
                placeholder="Enter disease name"
                value={newDiseaseName}
                onChange={(e) => setNewDiseaseName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="disease-icd10">ICD-10 Code</Label>
              <Input
                id="disease-icd10"
                placeholder="Enter ICD-10 code"
                value={newDiseaseIcd10Code}
                onChange={(e) => setNewDiseaseIcd10Code(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="disease-description">Description</Label>
              <Textarea
                id="disease-description"
                placeholder="Enter disease description"
                value={newDiseaseDescription}
                onChange={(e) => setNewDiseaseDescription(e.target.value)}
              />
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={() => setShowNewDiseaseDialog(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateNewDisease}
              disabled={!newDiseaseName || !newDiseaseIcd10Code}
            >
              Create Disease
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* New Test Dialog */}
      <Dialog open={showNewTestDialog} onOpenChange={setShowNewTestDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Test</DialogTitle>
            <DialogDescription>
              Create a new test that will be available for all checkups
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="test-name">Test Name</Label>
              <Input
                id="test-name"
                placeholder="Enter test name"
                value={newTestName}
                onChange={(e) => setNewTestName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="test-category">Category</Label>
              <Input
                id="test-category"
                placeholder="Enter test category"
                value={newTestCategory}
                onChange={(e) => setNewTestCategory(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="test-price">Price (₹)</Label>
              <Input
                id="test-price"
                type="number"
                placeholder="Enter test price"
                value={newTestPrice}
                onChange={(e) => setNewTestPrice(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="test-description">Description</Label>
              <Textarea
                id="test-description"
                placeholder="Enter test description"
                value={newTestDescription}
                onChange={(e) => setNewTestDescription(e.target.value)}
              />
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={() => setShowNewTestDialog(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateNewTest}
              disabled={!newTestName || !newTestCategory || !newTestPrice}
            >
              Create Test
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* New Medicine Dialog */}
      <Dialog
        open={showNewMedicineDialog}
        onOpenChange={setShowNewMedicineDialog}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Medicine</DialogTitle>
            <DialogDescription>
              Create a new medicine that will be available for all checkups
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="medicine-name">Medicine Name</Label>
              <Input
                id="medicine-name"
                placeholder="Enter medicine name"
                value={newMedicineName}
                onChange={(e) => setNewMedicineName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="medicine-category">Category</Label>
              <Input
                id="medicine-category"
                placeholder="Enter medicine category"
                value={newMedicineCategory}
                onChange={(e) => setNewMedicineCategory(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="medicine-description">Description</Label>
              <Textarea
                id="medicine-description"
                placeholder="Enter medicine description"
                value={newMedicineDescription}
                onChange={(e) => setNewMedicineDescription(e.target.value)}
              />
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={() => setShowNewMedicineDialog(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateNewMedicine}
              disabled={!newMedicineName || !newMedicineCategory}
            >
              Create Medicine
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* New Dosage Dialog */}
      <Dialog open={showNewDosageDialog} onOpenChange={setShowNewDosageDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Dosage</DialogTitle>
            <DialogDescription>
              Create a new dosage that will be available for all checkups
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="dosage-name">Dosage Name</Label>
              <Input
                id="dosage-name"
                placeholder="Enter dosage name"
                value={newDosageName}
                onChange={(e) => setNewDosageName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dosage-frequency">Frequency</Label>
              <Input
                id="dosage-frequency"
                placeholder="Enter frequency (e.g. 1-0-1)"
                value={newDosageFrequency}
                onChange={(e) => setNewDosageFrequency(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dosage-description">Description</Label>
              <Textarea
                id="dosage-description"
                placeholder="Enter dosage description"
                value={newDosageDescription}
                onChange={(e) => setNewDosageDescription(e.target.value)}
              />
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={() => setShowNewDosageDialog(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateNewDosage}
              disabled={!newDosageName || !newDosageFrequency}
            >
              Create Dosage
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* New Days Dialog */}
      <Dialog open={showNewDaysDialog} onOpenChange={setShowNewDaysDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Days Option</DialogTitle>
            <DialogDescription>
              Create a new days option that will be available for all checkups
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="days-name">Display Name</Label>
              <Input
                id="days-name"
                placeholder="Enter display name (e.g. 7 Days)"
                value={newDaysName}
                onChange={(e) => setNewDaysName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="days-value">Number of Days</Label>
              <Input
                id="days-value"
                type="number"
                placeholder="Enter number of days"
                value={newDaysValue}
                onChange={(e) => setNewDaysValue(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="days-description">Description</Label>
              <Textarea
                id="days-description"
                placeholder="Enter description"
                value={newDaysDescription}
                onChange={(e) => setNewDaysDescription(e.target.value)}
              />
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={() => setShowNewDaysDialog(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateNewDays}
              disabled={!newDaysName || !newDaysValue}
            >
              Create Days Option
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Completed Checkups Dialog */}
      <Dialog
        open={showCompletedCheckups}
        onOpenChange={setShowCompletedCheckups}
      >
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Completed Checkups</DialogTitle>
            <DialogDescription>
              View and print prescriptions for completed checkups
            </DialogDescription>
          </DialogHeader>
          {completedCheckups.length > 0 ? (
            <div className="space-y-4">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Patient</TableHead>
                      <TableHead>Diagnosis</TableHead>
                      <TableHead className="w-[100px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {completedCheckups.map((checkup) => (
                      <TableRow key={checkup.id}>
                        <TableCell className="font-medium">
                          {checkup.id}
                        </TableCell>
                        <TableCell>{checkup.date}</TableCell>
                        <TableCell>{checkup.patient.name}</TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {checkup.diagnosis.map((diagnosis, index) => (
                              <Badge key={index} variant="default">
                                {diagnosis.name}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm">
                            <FileText className="h-4 w-4" />
                            <span className="sr-only">Print Prescription</span>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-muted-foreground">
                No completed checkups found
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>
      <Card>
        <CardHeader>
          <CardTitle>OPD Checkup</CardTitle>
          <CardDescription>
            Perform patient checkup and create prescriptions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Patient Selection */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-2">
                <Label htmlFor="patient-select">Select Patient</Label>
                <div className="relative">
                  <div className="flex items-center space-x-2">
                    <div className="flex-1">
                      <Select
                        value={selectedPatient}
                        onValueChange={setSelectedPatient}
                      >
                        <SelectTrigger id="patient-select" className="w-full">
                          <SelectValue placeholder="Select a patient" />
                        </SelectTrigger>
                        <SelectContent>
                          <div className="flex items-center px-2 pb-1">
                            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                            <input
                              className="flex h-8 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                              placeholder="Search patients..."
                              onChange={(e) => {
                                // In a real app, this would filter the patients list
                                console.log("Searching for", e.target.value);
                              }}
                            />
                          </div>
                          {mockPatients.map((patient) => (
                            <SelectItem key={patient.id} value={patient.id}>
                              {patient.name} ({patient.id})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => setShowCompletedCheckups(true)}
                    >
                      <ClipboardList className="mr-2 h-4 w-4" />
                      Completed Checkups
                    </Button>
                  </div>
                </div>
              </div>

              {patientDetails && (
                <div className="md:col-span-2 flex justify-end">
                  <Button
                    variant="outline"
                    onClick={() => setShowHistory(!showHistory)}
                  >
                    <FileText className="mr-2 h-4 w-4" />
                    {showHistory
                      ? "Hide Medical History"
                      : "View Medical History"}
                  </Button>
                </div>
              )}
            </div>

            {/* Patient Details */}
            {patientDetails && (
              <Card className="bg-muted/50">
                <CardContent className="pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-lg font-medium">
                        {patientDetails.name}
                      </h3>
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Patient ID
                          </p>
                          <p>{patientDetails.id}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Age / Gender
                          </p>
                          <p>
                            {patientDetails.age} / {patientDetails.gender}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Blood Group
                          </p>
                          <p>{patientDetails.bloodGroup}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Contact
                          </p>
                          <p>{patientDetails.contact}</p>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium">
                        Current Visit Details
                      </h3>
                      <div className="grid grid-cols-3 gap-2 mt-2">
                        <div>
                          <p className="text-sm text-muted-foreground">BP</p>
                          <p>{patientDetails.visitDetails.bp} mmHg</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Temperature
                          </p>
                          <p>{patientDetails.visitDetails.temperature} °F</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Pulse</p>
                          <p>{patientDetails.visitDetails.pulse} bpm</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Height
                          </p>
                          <p>{patientDetails.visitDetails.height} cm</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Weight
                          </p>
                          <p>{patientDetails.visitDetails.weight} kg</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">SpO2</p>
                          <p>{patientDetails.visitDetails.oxygenSaturation}%</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Patient History Dialog */}
            <Dialog open={showHistory} onOpenChange={setShowHistory}>
              <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>
                    Medical History - {patientDetails?.name}
                  </DialogTitle>
                  <DialogDescription>
                    Previous visits and medical records
                  </DialogDescription>
                </DialogHeader>
                {mockPatientHistory.length > 0 ? (
                  <div className="space-y-4">
                    {mockPatientHistory.map((visit) => (
                      <div key={visit.id} className="border rounded-md p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h4 className="font-medium">
                              Visit Date: {visit.date}
                            </h4>
                            <p className="text-sm text-muted-foreground">
                              Doctor: {visit.doctor}
                            </p>
                          </div>
                          <Badge variant="outline">{visit.id}</Badge>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                          <div>
                            <h5 className="text-sm font-medium mb-1">
                              Symptoms
                            </h5>
                            <div className="flex flex-wrap gap-1">
                              {visit.symptoms.map((symptom, index) => (
                                <Badge key={index} variant="secondary">
                                  {symptom}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          <div>
                            <h5 className="text-sm font-medium mb-1">
                              Diagnosis
                            </h5>
                            <div className="flex flex-wrap gap-1">
                              {visit.diagnosis.map((diagnosis, index) => (
                                <Badge key={index} variant="default">
                                  {diagnosis}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          <div className="md:col-span-2">
                            <h5 className="text-sm font-medium mb-1">
                              Medications
                            </h5>
                            <div className="text-sm">
                              <ul className="list-disc pl-5 space-y-1">
                                {visit.medications.map((med, index) => (
                                  <li key={index}>
                                    {med.name} - {med.dosage} for {med.days}{" "}
                                    days
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>

                          {visit.tests.length > 0 && (
                            <div>
                              <h5 className="text-sm font-medium mb-1">
                                Tests
                              </h5>
                              <div className="flex flex-wrap gap-1">
                                {visit.tests.map((test, index) => (
                                  <Badge key={index} variant="outline">
                                    {test}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}

                          <div>
                            <h5 className="text-sm font-medium mb-1">Notes</h5>
                            <p className="text-sm">{visit.notes}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-muted-foreground">
                      No previous medical history found
                    </p>
                  </div>
                )}
              </DialogContent>
            </Dialog>

            {/* Checkup Tabs */}
            {patientDetails && (
              <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="mt-6"
              >
                <TabsList className="grid grid-cols-6 mb-4">
                  <TabsTrigger value="symptoms" className="flex items-center">
                    <AlertCircle className="mr-2 h-4 w-4" />
                    Symptoms
                  </TabsTrigger>
                  <TabsTrigger
                    value="provisional-diagnosis"
                    className="flex items-center"
                  >
                    <Stethoscope className="mr-2 h-4 w-4" />
                    Provisional Diagnosis
                  </TabsTrigger>
                  <TabsTrigger value="tests" className="flex items-center">
                    <FlaskConical className="mr-2 h-4 w-4" />
                    Tests
                  </TabsTrigger>
                  <TabsTrigger
                    value="final-diagnosis"
                    className="flex items-center"
                  >
                    <ClipboardList className="mr-2 h-4 w-4" />
                    Final Diagnosis
                  </TabsTrigger>
                  <TabsTrigger value="treatment" className="flex items-center">
                    <Pill className="mr-2 h-4 w-4" />
                    Treatment
                  </TabsTrigger>
                  <TabsTrigger value="remarks" className="flex items-center">
                    <Clock className="mr-2 h-4 w-4" />
                    Remarks & Follow-up
                  </TabsTrigger>
                </TabsList>

                {/* Symptoms Tab */}
                <TabsContent value="symptoms" className="space-y-4">
                  <div className="flex items-end gap-4">
                    <div className="grid flex-1 gap-2">
                      <Label htmlFor="symptom-select">Select Symptom</Label>
                      <Select
                        value={selectedSymptom}
                        onValueChange={setSelectedSymptom}
                      >
                        <SelectTrigger id="symptom-select">
                          <SelectValue placeholder="Select a symptom" />
                        </SelectTrigger>
                        <SelectContent>
                          <div className="flex items-center px-2 pb-1">
                            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                            <input
                              className="flex h-8 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                              placeholder="Search symptoms..."
                              onChange={(e) => {
                                // In a real app, this would filter the symptoms list
                                console.log("Searching for", e.target.value);
                              }}
                            />
                          </div>
                          {mockSymptoms.map((symptom) => (
                            <SelectItem key={symptom.id} value={symptom.id}>
                              {symptom.name}
                            </SelectItem>
                          ))}
                          <div className="border-t px-2 py-2">
                            <Button
                              variant="ghost"
                              className="w-full justify-start text-muted-foreground"
                              onClick={() => {
                                setShowNewSymptomDialog(true);
                              }}
                            >
                              <Plus className="mr-2 h-4 w-4" />
                              Add New Symptom
                            </Button>
                          </div>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button onClick={handleAddSymptom}>
                      <Plus className="mr-2 h-4 w-4" /> Add Symptom
                    </Button>
                  </div>

                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Symptom</TableHead>
                          <TableHead>Description</TableHead>
                          <TableHead className="w-[100px]">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {symptoms.map((symptom) => (
                          <TableRow key={symptom.id}>
                            <TableCell className="font-medium">
                              {symptom.name}
                            </TableCell>
                            <TableCell>{symptom.description}</TableCell>
                            <TableCell>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleRemoveSymptom(symptom.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                        {symptoms.length === 0 && (
                          <TableRow>
                            <TableCell colSpan={3} className="text-center h-24">
                              No symptoms added yet
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>

                  <div className="flex justify-end">
                    <Button
                      onClick={handleNextTab}
                      disabled={symptoms.length === 0}
                    >
                      Next: Provisional Diagnosis
                    </Button>
                  </div>
                </TabsContent>

                {/* Provisional Diagnosis Tab */}
                <TabsContent
                  value="provisional-diagnosis"
                  className="space-y-4"
                >
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="md:w-2/3 space-y-4">
                      <div className="flex items-end gap-4">
                        <div className="grid flex-1 gap-2">
                          <Label htmlFor="disease-select">Select Disease</Label>
                          <Select
                            value={selectedDisease}
                            onValueChange={setSelectedDisease}
                          >
                            <SelectTrigger id="disease-select">
                              <SelectValue placeholder="Select a disease" />
                            </SelectTrigger>
                            <SelectContent>
                              <div className="flex items-center px-2 pb-1">
                                <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                                <input
                                  className="flex h-8 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                                  placeholder="Search diseases..."
                                  onChange={(e) => {
                                    // In a real app, this would filter the diseases list
                                    console.log(
                                      "Searching for",
                                      e.target.value,
                                    );
                                  }}
                                />
                              </div>
                              {mockDiseases.map((disease) => (
                                <SelectItem key={disease.id} value={disease.id}>
                                  {disease.name} ({disease.icd10Code})
                                </SelectItem>
                              ))}
                              <div className="border-t px-2 py-2">
                                <Button
                                  variant="ghost"
                                  className="w-full justify-start text-muted-foreground"
                                  onClick={() => {
                                    setShowNewDiseaseDialog(true);
                                  }}
                                >
                                  <Plus className="mr-2 h-4 w-4" />
                                  Add New Disease
                                </Button>
                              </div>
                            </SelectContent>
                          </Select>
                        </div>
                        <Button onClick={handleAddProvisionalDiagnosis}>
                          <Plus className="mr-2 h-4 w-4" /> Add Diagnosis
                        </Button>
                      </div>

                      <div className="rounded-md border">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Disease</TableHead>
                              <TableHead>ICD-10</TableHead>
                              <TableHead>Description</TableHead>
                              <TableHead className="w-[100px]">
                                Actions
                              </TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {provisionalDiagnosis.map((disease) => (
                              <TableRow key={disease.id}>
                                <TableCell className="font-medium">
                                  {disease.name}
                                </TableCell>
                                <TableCell>{disease.icd10Code}</TableCell>
                                <TableCell>{disease.description}</TableCell>
                                <TableCell>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() =>
                                      handleRemoveProvisionalDiagnosis(
                                        disease.id,
                                      )
                                    }
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))}
                            {provisionalDiagnosis.length === 0 && (
                              <TableRow>
                                <TableCell
                                  colSpan={4}
                                  className="text-center h-24"
                                >
                                  No provisional diagnosis added yet
                                </TableCell>
                              </TableRow>
                            )}
                          </TableBody>
                        </Table>
                      </div>
                    </div>

                    <div className="md:w-1/3 space-y-4">
                      <div className="rounded-md border p-4">
                        <h3 className="text-lg font-medium flex items-center">
                          <BrainCircuit className="mr-2 h-5 w-5" />
                          AI Diagnosis Assistant
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1 mb-3">
                          Get AI-powered suggestions for diagnosis and treatment
                        </p>

                        <div className="space-y-3">
                          <div className="flex gap-2">
                            <Input
                              placeholder="Describe symptoms or ask for suggestions..."
                              value={aiSuggestionQuery}
                              onChange={(e) =>
                                setAiSuggestionQuery(e.target.value)
                              }
                            />
                            <Button
                              variant="secondary"
                              onClick={handleGetAiSuggestions}
                              disabled={
                                isLoadingAiSuggestion || !aiSuggestionQuery
                              }
                            >
                              {isLoadingAiSuggestion ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Search className="h-4 w-4" />
                              )}
                            </Button>
                          </div>

                          {aiSuggestions.length > 0 && (
                            <div className="space-y-3 mt-4">
                              {aiSuggestions.map((suggestion) => (
                                <div
                                  key={suggestion.id}
                                  className="bg-secondary/20 p-3 rounded-md"
                                >
                                  <h4 className="text-sm font-medium">
                                    {suggestion.title}
                                  </h4>
                                  <p className="text-sm mt-1">
                                    {suggestion.content}
                                  </p>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between">
                    <Button variant="outline" onClick={handlePreviousTab}>
                      Back: Symptoms
                    </Button>
                    <Button onClick={handleNextTab}>Next: Tests</Button>
                  </div>
                </TabsContent>

                {/* Tests Tab */}
                <TabsContent value="tests" className="space-y-4">
                  <div className="flex items-end gap-4">
                    <div className="grid flex-1 gap-2">
                      <Label htmlFor="test-select">Select Test</Label>
                      <Select
                        value={selectedTest}
                        onValueChange={setSelectedTest}
                      >
                        <SelectTrigger id="test-select">
                          <SelectValue placeholder="Select a test" />
                        </SelectTrigger>
                        <SelectContent>
                          <div className="flex items-center px-2 pb-1">
                            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                            <input
                              className="flex h-8 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                              placeholder="Search tests..."
                              onChange={(e) => {
                                // In a real app, this would filter the tests list
                                console.log("Searching for", e.target.value);
                              }}
                            />
                          </div>
                          {mockTests.map((test) => (
                            <SelectItem key={test.id} value={test.id}>
                              {test.name}
                            </SelectItem>
                          ))}
                          <div className="border-t px-2 py-2">
                            <Button
                              variant="ghost"
                              className="w-full justify-start text-muted-foreground"
                              onClick={() => {
                                setShowNewTestDialog(true);
                              }}
                            >
                              <Plus className="mr-2 h-4 w-4" />
                              Add New Test
                            </Button>
                          </div>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button onClick={handleAddTest}>
                      <Plus className="mr-2 h-4 w-4" /> Add Test
                    </Button>
                  </div>

                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Test</TableHead>
                          <TableHead>Category</TableHead>
                          <TableHead>Description</TableHead>
                          <TableHead>Price (₹)</TableHead>
                          <TableHead className="w-[100px]">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {tests.map((test) => (
                          <TableRow key={test.id}>
                            <TableCell className="font-medium">
                              {test.name}
                            </TableCell>
                            <TableCell>{test.category}</TableCell>
                            <TableCell>{test.description}</TableCell>
                            <TableCell>{test.price.toLocaleString()}</TableCell>
                            <TableCell>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleRemoveTest(test.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                        {tests.length === 0 && (
                          <TableRow>
                            <TableCell colSpan={5} className="text-center h-24">
                              No tests added yet
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>

                  {tests.length > 0 && (
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm font-medium">
                          Total Tests: {tests.length}
                        </p>
                        <p className="text-sm font-medium">
                          Total Amount: ₹
                          {tests
                            .reduce((sum, test) => sum + test.price, 0)
                            .toLocaleString()}
                        </p>
                      </div>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="secondary"
                              onClick={handleSaveCheckup}
                            >
                              Save & Send for Tests
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>
                              Save the checkup and send the patient for tests
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <Button variant="outline" onClick={handlePreviousTab}>
                      Back: Provisional Diagnosis
                    </Button>
                    <Button onClick={handleNextTab}>
                      Next: Final Diagnosis
                    </Button>
                  </div>
                </TabsContent>

                {/* Final Diagnosis Tab */}
                <TabsContent value="final-diagnosis" className="space-y-4">
                  <div className="flex items-end gap-4">
                    <div className="grid flex-1 gap-2">
                      <Label htmlFor="final-disease-select">
                        Select Disease
                      </Label>
                      <Select
                        value={selectedDisease}
                        onValueChange={setSelectedDisease}
                      >
                        <SelectTrigger id="final-disease-select">
                          <SelectValue placeholder="Select a disease" />
                        </SelectTrigger>
                        <SelectContent>
                          <div className="flex items-center px-2 pb-1">
                            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                            <input
                              className="flex h-8 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                              placeholder="Search diseases..."
                              onChange={(e) => {
                                // In a real app, this would filter the diseases list
                                console.log("Searching for", e.target.value);
                              }}
                            />
                          </div>
                          {mockDiseases.map((disease) => (
                            <SelectItem key={disease.id} value={disease.id}>
                              {disease.name} ({disease.icd10Code})
                            </SelectItem>
                          ))}
                          <div className="border-t px-2 py-2">
                            <Button
                              variant="ghost"
                              className="w-full justify-start text-muted-foreground"
                              onClick={() => {
                                setShowNewDiseaseDialog(true);
                              }}
                            >
                              <Plus className="mr-2 h-4 w-4" />
                              Add New Disease
                            </Button>
                          </div>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button
                      onClick={() => {
                        if (!selectedDisease) return;
                        const disease = mockDiseases.find(
                          (d) => d.id === selectedDisease,
                        );
                        if (disease) handleAddToFinalDiagnosis(disease);
                      }}
                    >
                      <Plus className="mr-2 h-4 w-4" /> Add Diagnosis
                    </Button>
                  </div>

                  {provisionalDiagnosis.length > 0 && (
                    <div className="rounded-md border p-4 bg-muted/50">
                      <h3 className="text-sm font-medium mb-2">
                        Provisional Diagnosis
                      </h3>
                      <div className="space-y-2">
                        {provisionalDiagnosis.map((disease) => (
                          <div key={disease.id} className="flex items-center">
                            <Checkbox
                              id={`confirm-${disease.id}`}
                              checked={finalDiagnosis.some(
                                (d) => d.id === disease.id,
                              )}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  handleAddToFinalDiagnosis(disease);
                                } else {
                                  handleRemoveFinalDiagnosis(disease.id);
                                }
                              }}
                            />
                            <label
                              htmlFor={`confirm-${disease.id}`}
                              className="ml-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              {disease.name} ({disease.icd10Code})
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Disease</TableHead>
                          <TableHead>ICD-10</TableHead>
                          <TableHead>Description</TableHead>
                          <TableHead className="w-[100px]">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {finalDiagnosis.map((disease) => (
                          <TableRow key={disease.id}>
                            <TableCell className="font-medium">
                              {disease.name}
                            </TableCell>
                            <TableCell>{disease.icd10Code}</TableCell>
                            <TableCell>{disease.description}</TableCell>
                            <TableCell>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() =>
                                  handleRemoveFinalDiagnosis(disease.id)
                                }
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                        {finalDiagnosis.length === 0 && (
                          <TableRow>
                            <TableCell colSpan={4} className="text-center h-24">
                              No final diagnosis added yet
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>

                  <div className="flex justify-between">
                    <Button variant="outline" onClick={handlePreviousTab}>
                      Back: Tests
                    </Button>
                    <Button
                      onClick={handleNextTab}
                      disabled={finalDiagnosis.length === 0}
                    >
                      Next: Treatment
                    </Button>
                  </div>
                </TabsContent>

                {/* Treatment Tab */}
                <TabsContent value="treatment" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <Label htmlFor="medicine-select">Medicine</Label>
                      <Select
                        value={selectedMedicine}
                        onValueChange={setSelectedMedicine}
                      >
                        <SelectTrigger id="medicine-select">
                          <SelectValue placeholder="Select medicine" />
                        </SelectTrigger>
                        <SelectContent>
                          <div className="flex items-center px-2 pb-1">
                            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                            <input
                              className="flex h-8 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                              placeholder="Search medicines..."
                              onChange={(e) => {
                                // In a real app, this would filter the medicines list
                                console.log("Searching for", e.target.value);
                              }}
                            />
                          </div>
                          {mockMedicines.map((medicine) => (
                            <SelectItem key={medicine.id} value={medicine.id}>
                              {medicine.name}
                            </SelectItem>
                          ))}
                          <div className="border-t px-2 py-2">
                            <Button
                              variant="ghost"
                              className="w-full justify-start text-muted-foreground"
                              onClick={() => {
                                setShowNewMedicineDialog(true);
                              }}
                            >
                              <Plus className="mr-2 h-4 w-4" />
                              Add New Medicine
                            </Button>
                          </div>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="dosage-select">Dosage</Label>
                      <Select
                        value={selectedDosage}
                        onValueChange={setSelectedDosage}
                      >
                        <SelectTrigger id="dosage-select">
                          <SelectValue placeholder="Select dosage" />
                        </SelectTrigger>
                        <SelectContent>
                          <div className="flex items-center px-2 pb-1">
                            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                            <input
                              className="flex h-8 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                              placeholder="Search dosages..."
                              onChange={(e) => {
                                // In a real app, this would filter the dosages list
                                console.log("Searching for", e.target.value);
                              }}
                            />
                          </div>
                          {mockDosages.map((dosage) => (
                            <SelectItem key={dosage.id} value={dosage.id}>
                              {dosage.name} ({dosage.frequency})
                            </SelectItem>
                          ))}
                          <div className="border-t px-2 py-2">
                            <Button
                              variant="ghost"
                              className="w-full justify-start text-muted-foreground"
                              onClick={() => {
                                setShowNewDosageDialog(true);
                              }}
                            >
                              <Plus className="mr-2 h-4 w-4" />
                              Add New Dosage
                            </Button>
                          </div>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="days-select">Days</Label>
                      <Select
                        value={selectedDays}
                        onValueChange={setSelectedDays}
                      >
                        <SelectTrigger id="days-select">
                          <SelectValue placeholder="Select days" />
                        </SelectTrigger>
                        <SelectContent>
                          <div className="flex items-center px-2 pb-1">
                            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                            <input
                              className="flex h-8 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                              placeholder="Search days..."
                              onChange={(e) => {
                                // In a real app, this would filter the days list
                                console.log("Searching for", e.target.value);
                              }}
                            />
                          </div>
                          {mockDays.map((day) => (
                            <SelectItem key={day.id} value={day.id}>
                              {day.name}
                            </SelectItem>
                          ))}
                          <div className="border-t px-2 py-2">
                            <Button
                              variant="ghost"
                              className="w-full justify-start text-muted-foreground"
                              onClick={() => {
                                setShowNewDaysDialog(true);
                              }}
                            >
                              <Plus className="mr-2 h-4 w-4" />
                              Add New Days Option
                            </Button>
                          </div>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-end">
                      <Button
                        className="w-full"
                        onClick={handleAddMedication}
                        disabled={
                          !selectedMedicine || !selectedDosage || !selectedDays
                        }
                      >
                        <Plus className="mr-2 h-4 w-4" /> Add Medication
                      </Button>
                    </div>
                  </div>

                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Medicine</TableHead>
                          <TableHead>Category</TableHead>
                          <TableHead>Dosage</TableHead>
                          <TableHead>Days</TableHead>
                          <TableHead className="w-[100px]">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {medications.map((medication) => (
                          <TableRow key={medication.id}>
                            <TableCell className="font-medium">
                              {medication.medicine.name}
                              <div className="text-xs text-muted-foreground">
                                {medication.medicine.description}
                              </div>
                            </TableCell>
                            <TableCell>
                              {medication.medicine.category}
                            </TableCell>
                            <TableCell>
                              {medication.dosage.name}
                              <div className="text-xs text-muted-foreground">
                                {medication.dosage.frequency}
                              </div>
                            </TableCell>
                            <TableCell>{medication.days.name}</TableCell>
                            <TableCell>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() =>
                                  handleRemoveMedication(medication.id)
                                }
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                        {medications.length === 0 && (
                          <TableRow>
                            <TableCell colSpan={5} className="text-center h-24">
                              No medications added yet
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>

                  <div className="flex justify-between">
                    <Button variant="outline" onClick={handlePreviousTab}>
                      Back: Final Diagnosis
                    </Button>
                    <Button
                      onClick={handleNextTab}
                      disabled={medications.length === 0}
                    >
                      Next: Remarks & Follow-up
                    </Button>
                  </div>
                </TabsContent>

                {/* Remarks & Follow-up Tab */}
                <TabsContent value="remarks" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="remarks">Remarks & Instructions</Label>
                        <Textarea
                          id="remarks"
                          placeholder="Enter any additional remarks or instructions for the patient"
                          className="h-32"
                          value={remarks}
                          onChange={(e) => setRemarks(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="followup-date">
                          Follow-up Date (if required)
                        </Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className="w-full justify-start text-left font-normal"
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {followUpDate ? (
                                format(followUpDate, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={followUpDate}
                              onSelect={setFollowUpDate}
                              initialFocus
                              disabled={(date) => date < new Date()}
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-md border p-4 bg-muted/50 mt-6">
                    <h3 className="text-lg font-medium mb-2">
                      Checkup Summary
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-sm font-medium">Patient</h4>
                        <p className="text-sm">
                          {patientDetails.name} ({patientDetails.id})
                        </p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium">
                          Symptoms ({symptoms.length})
                        </h4>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {symptoms.map((symptom) => (
                            <Badge key={symptom.id} variant="secondary">
                              {symptom.name}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium">
                          Diagnosis ({finalDiagnosis.length})
                        </h4>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {finalDiagnosis.map((disease) => (
                            <Badge key={disease.id} variant="default">
                              {disease.name}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium">
                          Tests ({tests.length})
                        </h4>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {tests.map((test) => (
                            <Badge key={test.id} variant="outline">
                              {test.name}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="md:col-span-2">
                        <h4 className="text-sm font-medium">
                          Medications ({medications.length})
                        </h4>
                        <div className="text-sm mt-1">
                          <ul className="list-disc pl-5 space-y-1">
                            {medications.map((medication) => (
                              <li key={medication.id}>
                                {medication.medicine.name} -{" "}
                                {medication.dosage.name} for{" "}
                                {medication.days.name}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                      {followUpDate && (
                        <div>
                          <h4 className="text-sm font-medium">
                            Follow-up Date
                          </h4>
                          <p className="text-sm">
                            {format(followUpDate, "PPP")}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-between">
                    <Button variant="outline" onClick={handlePreviousTab}>
                      Back: Treatment
                    </Button>
                    <div className="space-x-2">
                      <Button variant="outline" onClick={handleSaveCheckup}>
                        Save Draft
                      </Button>
                      <Button onClick={handleCompleteCheckup}>
                        Complete Checkup
                      </Button>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OPDCheckupForm;
