export interface Patient {
  id: string;
  mrNumber: string;
  name: string;
  age: number;
  gender: string;
  contact: string;
  address: string;
  registrationDate: string;
  patientType: ("OPD" | "IPD")[];
  lastVisit: string;
  bloodGroup: string;
  email?: string;
  cnic?: string;
  emergencyContact?: string;
  guardianName?: string;
  guardianRelation?: string;
  guardianContact?: string;
  insuranceProvider?: string;
  insuranceId?: string;
  allergies?: string[];
  chronicDiseases?: string[];
  notes?: string;
}

export interface OPDVisit {
  id: string;
  patientId: string;
  patientName: string;
  mrNumber: string;
  visitDate: string;
  doctorId: string;
  doctorName: string;
  department: string;
  chiefComplaint: string;
  diagnosis?: string;
  treatment?: string;
  followUpDate?: string;
  visitType: "First" | "Follow-up";
  fee: number;
  paymentStatus: "Paid" | "Pending" | "Waived";
  status: "Waiting" | "In Consultation" | "Completed" | "Cancelled";
  vitalSigns?: {
    temperature?: number;
    bloodPressure?: string;
    pulseRate?: number;
    respiratoryRate?: number;
    oxygenSaturation?: number;
    height?: number;
    weight?: number;
  };
  notes?: string;
}

export interface IPDAdmission {
  id: string;
  patientId: string;
  patientName: string;
  mrNumber: string;
  admissionDate: string;
  dischargeDate?: string;
  wardId: string;
  wardName: string;
  bedId: string;
  bedNumber: string;
  roomCategory?: string;
  primaryDoctorId: string;
  primaryDoctorName: string;
  secondaryDoctors?: {
    id: string;
    name: string;
  }[];
  diagnosisOnAdmission: string;
  finalDiagnosis?: string;
  admissionType: "Elective" | "Emergency";
  status: "Admitted" | "Discharged" | "Transferred" | "LAMA" | "Expired";
  advancePayment?: number;
  estimatedStayCost?: number;
  totalBill?: number;
  paymentStatus?: "Fully Paid" | "Partially Paid" | "Pending" | "Insurance";
  insuranceCoverage?: number;
  notes?: string;
}

export interface Ward {
  id: string;
  name: string;
  type:
    | "General"
    | "Semi-Private"
    | "Private"
    | "ICU"
    | "CCU"
    | "Emergency"
    | "Pediatric"
    | "Maternity";
  floor: string;
  totalBeds: number;
  availableBeds: number;
  chargePerDay: number;
}

export interface Bed {
  id: string;
  number: string;
  wardId: string;
  wardName: string;
  status: "Available" | "Occupied" | "Reserved" | "Maintenance";
  currentPatientId?: string;
  currentPatientName?: string;
  admissionId?: string;
  lastDisinfectionDate?: string;
}

export interface Doctor {
  id: string;
  name: string;
  specialization: string;
  department: string;
  firstVisitFee: number;
  followUpFee: number;
  availableDays: string[];
  availableTimeSlots: {
    day: string;
    startTime: string;
    endTime: string;
  }[];
}

export interface IPDService {
  id: string;
  name: string;
  category:
    | "Consultation"
    | "Procedure"
    | "Investigation"
    | "Medication"
    | "Room"
    | "Nursing"
    | "Other";
  cost: number;
  taxable: boolean;
  description?: string;
}

export interface IPDServiceCharge {
  id: string;
  admissionId: string;
  serviceId: string;
  serviceName: string;
  serviceCategory: string;
  quantity: number;
  unitCost: number;
  totalCost: number;
  dateProvided: string;
  providedBy: string;
  notes?: string;
}
