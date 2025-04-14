import React, { useState, useEffect } from "react";
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
import { Patient } from "./types";
import {
  generateMRNumber,
  getLastMRNumber,
  saveLastMRNumber,
  getMRConfig,
} from "@/utils/mrNumberGenerator";
import { generateTokenNumber } from "@/utils/tokenGenerator";
import MRNumberSettings, {
  MRNumberConfig,
} from "@/components/settings/MRNumberSettings";
import TokenPrintModal from "./TokenPrintModal";
import ProfileImageUpload from "./ProfileImageUpload";
import PatientCard from "./PatientCard";
import GeneratePatientCardButton from "./GeneratePatientCardButton";

interface PatientRegistrationProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (patient: Patient) => void;
}

const PatientRegistration: React.FC<PatientRegistrationProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [formData, setFormData] = useState<Partial<Patient>>({
    name: "",
    age: 0,
    ageUnit: "Years",
    gender: "",
    contact: "",
    address: "",
    bloodGroup: "",
    email: "",
    cnic: "",
    emergencyContact: "",
    guardianName: "",
    guardianRelation: "",
    guardianContact: "",
    patientType: ["OPD"],
    profileImage: "",
    dateOfBirth: "",
    registrationType: "OPD",
    // IPD specific fields
    ward: "",
    roomCategory: "",
    room: "",
    bed: "",
    attendingDoctor: "",
    registrationFee: "",
    feeStatus: "",
    // OPD specific fields
    vitals: {
      temperature: "",
      bloodPressure: "",
      pulse: "",
      respiratoryRate: "",
      height: "",
      weight: "",
      bmi: "",
    },
    chiefComplaints: "",
    presentingIllness: "",
  });

  // Removed step state as we now have a single form
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [mrNumberSettingsOpen, setMRNumberSettingsOpen] =
    useState<boolean>(false);
  const [mrConfig, setMRConfig] = useState<MRNumberConfig>(getMRConfig());
  const [generatedMRNumber, setGeneratedMRNumber] = useState<string>("");
  const [tokenPrintModalOpen, setTokenPrintModalOpen] =
    useState<boolean>(false);
  const [tokenData, setTokenData] = useState<any>(null);
  const [patientCardOpen, setPatientCardOpen] = useState<boolean>(false);
  const [registeredPatient, setRegisteredPatient] = useState<Patient | null>(
    null,
  );

  // Generate MR number when component mounts
  useEffect(() => {
    const lastNumber = getLastMRNumber();
    const mrNumber = generateMRNumber(lastNumber);
    setGeneratedMRNumber(mrNumber);
  }, []);

  // Debug registered patient
  useEffect(() => {
    if (registeredPatient) {
      console.log("Registered patient:", registeredPatient);
    }
  }, [registeredPatient]);

  // Debug patient card modal state
  useEffect(() => {
    console.log("Patient card modal open:", patientCardOpen);
  }, [patientCardOpen]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name) newErrors.name = "Name is required";
    if (!formData.age || formData.age <= 0)
      newErrors.age = "Valid age is required";
    if (!formData.gender) newErrors.gender = "Gender is required";
    if (!formData.contact) newErrors.contact = "Contact number is required";
    if (!formData.address) newErrors.address = "Address is required";
    if (!formData.bloodGroup) newErrors.bloodGroup = "Blood group is required";

    // Validate IPD specific fields if registration type is IPD
    if (formData.registrationType === "IPD") {
      if (!formData.emergencyContact)
        newErrors.emergencyContact = "Emergency contact is required";
      if (!formData.guardianName)
        newErrors.guardianName = "Guardian name is required";
      if (!formData.guardianRelation)
        newErrors.guardianRelation = "Guardian relation is required";
      if (!formData.guardianContact)
        newErrors.guardianContact = "Guardian contact is required";
      if (!formData.ward) newErrors.ward = "Ward selection is required";
      if (!formData.roomCategory)
        newErrors.roomCategory = "Room category is required";
      if (!formData.room) newErrors.room = "Room selection is required";
      if (!formData.bed) newErrors.bed = "Bed selection is required";
      if (!formData.attendingDoctor)
        newErrors.attendingDoctor = "Attending doctor is required";
      if (!formData.registrationFee)
        newErrors.registrationFee = "Registration fee is required";
      if (!formData.feeStatus) newErrors.feeStatus = "Fee status is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      return; // Don't proceed if validation fails
    }

    // Use the generated MR Number
    const mrNumber = generatedMRNumber;

    // Generate token number
    const tokenNumber = generateTokenNumber();

    // Update the last MR number counter
    const lastNumber = getLastMRNumber();
    saveLastMRNumber(lastNumber + 1);

    const newPatient: Patient = {
      id: Date.now().toString(),
      mrNumber,
      name: formData.name || "",
      age: formData.age || 0,
      ageUnit: formData.ageUnit || "Years",
      gender: formData.gender || "",
      contact: formData.contact || "",
      address: formData.address || "",
      registrationDate: new Date().toISOString().split("T")[0],
      patientType: (formData.patientType as ("OPD" | "IPD")[]) || [],
      registrationType: formData.registrationType || "OPD",
      lastVisit: new Date().toISOString().split("T")[0],
      bloodGroup: formData.bloodGroup || "",
      email: formData.email,
      cnic: formData.cnic,
      emergencyContact: formData.emergencyContact,
      guardianName: formData.guardianName,
      guardianRelation: formData.guardianRelation,
      guardianContact: formData.guardianContact,
      allergies: formData.allergies,
      chronicDiseases: formData.chronicDiseases,
      notes: formData.notes,
      tokenNumber: tokenNumber,
      profileImage: formData.profileImage,
      dateOfBirth: formData.dateOfBirth,
      vitals: formData.vitals,
      chiefComplaints: formData.chiefComplaints,
      presentingIllness: formData.presentingIllness,
      // IPD specific fields
      ward: formData.ward,
      roomCategory: formData.roomCategory,
      room: formData.room,
      bed: formData.bed,
      attendingDoctor: formData.attendingDoctor,
      registrationFee: formData.registrationFee,
      feeStatus: formData.feeStatus,
    };

    // Prepare token data for printing
    const now = new Date();
    setTokenData({
      tokenNumber: tokenNumber,
      patientName: newPatient.name,
      mrNumber: newPatient.mrNumber,
      date: now.toLocaleDateString(),
      time: now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    });

    // Store the registered patient for the card
    setRegisteredPatient(newPatient);
    console.log("Setting registered patient:", newPatient);

    onSuccess(newPatient);

    // Show token print modal
    setTokenPrintModalOpen(true);
  };

  const handleTokenModalClose = () => {
    setTokenPrintModalOpen(false);
    // Ensure we show the patient card after token modal is closed
    setTimeout(() => {
      setPatientCardOpen(true);
    }, 100);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[900px]">
        <DialogHeader>
          <DialogTitle>Patient Registration</DialogTitle>
          <DialogDescription>
            Register a new patient and generate a unique MR number.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto pr-2">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-4">
              <div className="flex-shrink-0">
                <ProfileImageUpload
                  initialImage={formData.profileImage}
                  onImageChange={(imageUrl) =>
                    setFormData({ ...formData, profileImage: imageUrl })
                  }
                  name={formData.name || ""}
                  size="small"
                />
              </div>
              <div>
                <Label className="text-sm text-muted-foreground">
                  MR Number
                </Label>
                <p className="font-medium">{generatedMRNumber}</p>
              </div>
            </div>
            <div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setMRNumberSettingsOpen(true)}
              >
                MR# Settings
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label
                htmlFor="name"
                className={errors.name ? "text-destructive" : ""}
              >
                Full Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className={errors.name ? "border-destructive" : ""}
              />
              {errors.name && (
                <p className="text-xs text-destructive">{errors.name}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="cnic">CNIC / ID Number</Label>
              <Input
                id="cnic"
                value={formData.cnic}
                onChange={(e) =>
                  setFormData({ ...formData, cnic: e.target.value })
                }
                placeholder="00000-0000000-0"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dateOfBirth">Date of Birth</Label>
              <Input
                id="dateOfBirth"
                type="date"
                value={formData.dateOfBirth || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    dateOfBirth: e.target.value,
                  })
                }
                max={new Date().toISOString().split("T")[0]}
              />
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="age"
                className={errors.age ? "text-destructive" : ""}
              >
                Age <span className="text-destructive">*</span>
              </Label>
              <div className="flex space-x-2">
                <div className="flex-1">
                  <Input
                    id="age"
                    type="number"
                    value={formData.age || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        age: parseInt(e.target.value),
                      })
                    }
                    className={errors.age ? "border-destructive" : ""}
                  />
                </div>
                <Select
                  value={formData.ageUnit}
                  onValueChange={(value) =>
                    setFormData({
                      ...formData,
                      ageUnit: value as "Years" | "Months",
                    })
                  }
                >
                  <SelectTrigger className="w-[110px]">
                    <SelectValue placeholder="Years" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Years">Years</SelectItem>
                    <SelectItem value="Months">Months</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {errors.age && (
                <p className="text-xs text-destructive">{errors.age}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="gender"
                className={errors.gender ? "text-destructive" : ""}
              >
                Gender <span className="text-destructive">*</span>
              </Label>
              <Select
                value={formData.gender}
                onValueChange={(value) =>
                  setFormData({ ...formData, gender: value })
                }
              >
                <SelectTrigger
                  id="gender"
                  className={errors.gender ? "border-destructive" : ""}
                >
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="Female">Female</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
              {errors.gender && (
                <p className="text-xs text-destructive">{errors.gender}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <Label
                htmlFor="bloodGroup"
                className={errors.bloodGroup ? "text-destructive" : ""}
              >
                Blood Group <span className="text-destructive">*</span>
              </Label>
              <Select
                value={formData.bloodGroup}
                onValueChange={(value) =>
                  setFormData({ ...formData, bloodGroup: value })
                }
              >
                <SelectTrigger
                  id="bloodGroup"
                  className={errors.bloodGroup ? "border-destructive" : ""}
                >
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
                  <SelectItem value="Unknown">Unknown</SelectItem>
                </SelectContent>
              </Select>
              {errors.bloodGroup && (
                <p className="text-xs text-destructive">{errors.bloodGroup}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label
                htmlFor="contact"
                className={errors.contact ? "text-destructive" : ""}
              >
                Contact Number <span className="text-destructive">*</span>
              </Label>
              <Input
                id="contact"
                value={formData.contact}
                onChange={(e) =>
                  setFormData({ ...formData, contact: e.target.value })
                }
                className={errors.contact ? "border-destructive" : ""}
                placeholder="+92 300 1234567"
              />
              {errors.contact && (
                <p className="text-xs text-destructive">{errors.contact}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                placeholder="patient@example.com"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="address"
              className={errors.address ? "text-destructive" : ""}
            >
              Address <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="address"
              value={formData.address}
              onChange={(e) =>
                setFormData({ ...formData, address: e.target.value })
              }
              className={errors.address ? "border-destructive" : ""}
              placeholder="Enter patient's full address"
            />
            {errors.address && (
              <p className="text-xs text-destructive">{errors.address}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="space-y-2">
              <Label htmlFor="registrationType" className="text-sm font-medium">
                Registration Type <span className="text-destructive">*</span>
              </Label>
              <Select
                value={formData.registrationType as string}
                onValueChange={(value) =>
                  setFormData({
                    ...formData,
                    registrationType: value,
                    patientType: [value as "OPD" | "IPD"],
                  })
                }
              >
                <SelectTrigger id="registrationType">
                  <SelectValue placeholder="Select registration type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="OPD">OPD Registration</SelectItem>
                  <SelectItem value="IPD">IPD Registration</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Registration Type specific fields */}
          {formData.registrationType === "OPD" && (
            <div className="grid grid-cols-2 gap-4 mb-4 p-3 bg-muted/30 rounded-md">
              <div className="space-y-2">
                <Label htmlFor="doctor">Doctor</Label>
                <Select defaultValue="dr-smith">
                  <SelectTrigger id="doctor">
                    <SelectValue placeholder="Select doctor" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dr-smith">Dr. Smith</SelectItem>
                    <SelectItem value="dr-johnson">Dr. Johnson</SelectItem>
                    <SelectItem value="dr-williams">Dr. Williams</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="appointmentDate">Appointment Date</Label>
                <Input
                  id="appointmentDate"
                  type="date"
                  defaultValue={new Date().toISOString().split("T")[0]}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="checkupType">Checkup Type</Label>
                <Select defaultValue="general">
                  <SelectTrigger id="checkupType">
                    <SelectValue placeholder="Select checkup type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="first-time">First Time Only</SelectItem>
                    <SelectItem value="followup">Follow-up</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="fee">Consultation Fee</Label>
                <Input
                  id="fee"
                  type="number"
                  defaultValue="500"
                  placeholder="Enter fee amount"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="feeStatus">Fee Status</Label>
                <Select defaultValue="paid">
                  <SelectTrigger id="feeStatus">
                    <SelectValue placeholder="Select fee status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="paid">Paid</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="waived">Waived</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {formData.registrationType === "IPD" && (
            <div className="grid grid-cols-2 gap-4 mb-4 p-3 bg-muted/30 rounded-md">
              <div className="space-y-2">
                <Label htmlFor="emergencyContact">
                  Emergency Contact <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="emergencyContact"
                  value={formData.emergencyContact}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      emergencyContact: e.target.value,
                    })
                  }
                  placeholder="+92 300 1234567"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="guardianName">
                  Guardian Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="guardianName"
                  value={formData.guardianName}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      guardianName: e.target.value,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="guardianRelation">
                  Guardian Relation <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="guardianRelation"
                  value={formData.guardianRelation}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      guardianRelation: e.target.value,
                    })
                  }
                  placeholder="e.g., Father, Mother, Spouse"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="guardianContact">
                  Guardian Contact <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="guardianContact"
                  value={formData.guardianContact}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      guardianContact: e.target.value,
                    })
                  }
                  placeholder="+92 300 1234567"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="ward">
                  Ward <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={formData.ward || ""}
                  onValueChange={(value) =>
                    setFormData({
                      ...formData,
                      ward: value,
                    })
                  }
                >
                  <SelectTrigger id="ward">
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
                <Label htmlFor="roomCategory">
                  Room Category <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={formData.roomCategory || ""}
                  onValueChange={(value) =>
                    setFormData({
                      ...formData,
                      roomCategory: value,
                    })
                  }
                >
                  <SelectTrigger id="roomCategory">
                    <SelectValue placeholder="Select room category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="standard">Standard</SelectItem>
                    <SelectItem value="deluxe">Deluxe</SelectItem>
                    <SelectItem value="suite">Suite</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="room">
                  Room <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={formData.room || ""}
                  onValueChange={(value) =>
                    setFormData({
                      ...formData,
                      room: value,
                    })
                  }
                >
                  <SelectTrigger id="room">
                    <SelectValue placeholder="Select room" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="room-101">Room 101</SelectItem>
                    <SelectItem value="room-102">Room 102</SelectItem>
                    <SelectItem value="room-103">Room 103</SelectItem>
                    <SelectItem value="room-104">Room 104</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bed">
                  Bed <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={formData.bed || ""}
                  onValueChange={(value) =>
                    setFormData({
                      ...formData,
                      bed: value,
                    })
                  }
                >
                  <SelectTrigger id="bed">
                    <SelectValue placeholder="Select bed" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bed-1">Bed 1</SelectItem>
                    <SelectItem value="bed-2">Bed 2</SelectItem>
                    <SelectItem value="bed-3">Bed 3</SelectItem>
                    <SelectItem value="bed-4">Bed 4</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="attendingDoctor">
                  Attending Doctor <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={formData.attendingDoctor || ""}
                  onValueChange={(value) =>
                    setFormData({
                      ...formData,
                      attendingDoctor: value,
                    })
                  }
                >
                  <SelectTrigger id="attendingDoctor">
                    <SelectValue placeholder="Select doctor" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dr-smith">Dr. Smith</SelectItem>
                    <SelectItem value="dr-johnson">Dr. Johnson</SelectItem>
                    <SelectItem value="dr-williams">Dr. Williams</SelectItem>
                    <SelectItem value="dr-brown">Dr. Brown</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="registrationFee">
                  Registration Fee <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="registrationFee"
                  type="number"
                  value={formData.registrationFee || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      registrationFee: e.target.value,
                    })
                  }
                  placeholder="Enter fee amount"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="feeStatus">
                  Fee Status <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={formData.feeStatus || ""}
                  onValueChange={(value) =>
                    setFormData({
                      ...formData,
                      feeStatus: value,
                    })
                  }
                >
                  <SelectTrigger id="feeStatus">
                    <SelectValue placeholder="Select fee status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="paid">Paid</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="waived">Waived</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {/* OPD specific vitals section */}
          {formData.registrationType === "OPD" && (
            <div className="mt-4 border-t pt-4">
              <h3 className="text-lg font-medium mb-4">OPD Vitals</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="temperature">Temperature</Label>
                  <Input
                    id="temperature"
                    value={formData.vitals?.temperature || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        vitals: {
                          ...formData.vitals,
                          temperature: e.target.value,
                        },
                      })
                    }
                    placeholder="98.6 °F"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bloodPressure">Blood Pressure</Label>
                  <Input
                    id="bloodPressure"
                    value={formData.vitals?.bloodPressure || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        vitals: {
                          ...formData.vitals,
                          bloodPressure: e.target.value,
                        },
                      })
                    }
                    placeholder="120/80 mmHg"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pulse">Pulse</Label>
                  <Input
                    id="pulse"
                    value={formData.vitals?.pulse || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        vitals: {
                          ...formData.vitals,
                          pulse: e.target.value,
                        },
                      })
                    }
                    placeholder="72 bpm"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="respiratoryRate">Respiratory Rate</Label>
                  <Input
                    id="respiratoryRate"
                    value={formData.vitals?.respiratoryRate || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        vitals: {
                          ...formData.vitals,
                          respiratoryRate: e.target.value,
                        },
                      })
                    }
                    placeholder="16 breaths/min"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="height">Height</Label>
                  <Input
                    id="height"
                    value={formData.vitals?.height || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        vitals: {
                          ...formData.vitals,
                          height: e.target.value,
                        },
                      })
                    }
                    placeholder="175 cm"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="weight">Weight</Label>
                  <Input
                    id="weight"
                    value={formData.vitals?.weight || ""}
                    onChange={(e) => {
                      const weight = e.target.value;
                      const height = formData.vitals?.height || "";
                      let bmi = "";

                      // Calculate BMI if both height and weight are available
                      if (weight && height) {
                        const weightKg = parseFloat(weight);
                        const heightCm = parseFloat(height);
                        if (
                          !isNaN(weightKg) &&
                          !isNaN(heightCm) &&
                          heightCm > 0
                        ) {
                          const heightM = heightCm / 100;
                          bmi = (weightKg / (heightM * heightM)).toFixed(1);
                        }
                      }

                      setFormData({
                        ...formData,
                        vitals: {
                          ...formData.vitals,
                          weight: weight,
                          bmi: bmi,
                        },
                      });
                    }}
                    placeholder="70 kg"
                  />
                </div>
              </div>

              {formData.vitals?.weight && formData.vitals?.height && (
                <div className="space-y-2 mt-4">
                  <Label htmlFor="bmi">BMI</Label>
                  <Input
                    id="bmi"
                    value={formData.vitals?.bmi || ""}
                    readOnly
                    className="bg-muted"
                  />
                </div>
              )}

              <div className="space-y-2 mt-4">
                <Label htmlFor="chiefComplaints">Chief Complaints</Label>
                <Textarea
                  id="chiefComplaints"
                  value={formData.chiefComplaints || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      chiefComplaints: e.target.value,
                    })
                  }
                  placeholder="Patient's main complaints"
                />
              </div>

              <div className="space-y-2 mt-4">
                <Label htmlFor="presentingIllness">Presenting Illness</Label>
                <Textarea
                  id="presentingIllness"
                  value={formData.presentingIllness || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      presentingIllness: e.target.value,
                    })
                  }
                  placeholder="Description of the presenting illness"
                />
              </div>
            </div>
          )}

          {/* Common fields for both IPD and OPD */}
          <div className="mt-4 border-t pt-4">
            <h3 className="text-lg font-medium mb-4">Additional Information</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="allergies">Allergies (if any)</Label>
                <Textarea
                  id="allergies"
                  value={formData.allergies?.join(", ")}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      allergies: e.target.value.split(", "),
                    })
                  }
                  placeholder="List any allergies, separated by commas"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="chronicDiseases">
                  Chronic Diseases (if any)
                </Label>
                <Textarea
                  id="chronicDiseases"
                  value={formData.chronicDiseases?.join(", ")}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      chronicDiseases: e.target.value.split(", "),
                    })
                  }
                  placeholder="List any chronic diseases, separated by commas"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Additional Notes</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData({ ...formData, notes: e.target.value })
                  }
                  placeholder="Any additional information about the patient"
                />
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="button" onClick={handleSubmit}>
            Register Patient
          </Button>
        </DialogFooter>

        {/* MR Number Settings Modal */}
        {mrNumberSettingsOpen && (
          <MRNumberSettings
            isOpen={mrNumberSettingsOpen}
            onClose={() => setMRNumberSettingsOpen(false)}
            onSave={(newConfig) => {
              // Save the new configuration
              setMRConfig(newConfig);
              localStorage.setItem("mrNumberConfig", JSON.stringify(newConfig));

              // Regenerate MR number with new config
              const lastNumber = getLastMRNumber();
              const mrNumber = generateMRNumber(lastNumber);
              setGeneratedMRNumber(mrNumber);

              setMRNumberSettingsOpen(false);
            }}
            currentSettings={mrConfig}
          />
        )}

        {/* Token Print Modal */}
        {tokenPrintModalOpen && tokenData && (
          <TokenPrintModal
            isOpen={tokenPrintModalOpen}
            onClose={handleTokenModalClose}
            tokenData={tokenData}
          />
        )}

        {/* Direct Patient Card Button - For immediate access */}
        {registeredPatient && (
          <div className="fixed bottom-4 right-4 z-50">
            <GeneratePatientCardButton
              patient={registeredPatient}
              variant="secondary"
              className="shadow-lg"
            />
          </div>
        )}

        {/* Patient Card Modal */}
        {patientCardOpen && registeredPatient && (
          <Dialog
            open={patientCardOpen}
            onOpenChange={(open) => {
              setPatientCardOpen(open);
              if (!open) {
                onClose();
              }
            }}
          >
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Patient Identification Card</DialogTitle>
                <DialogDescription>
                  Print this card for the patient to use for future visits
                </DialogDescription>
              </DialogHeader>
              <PatientCard
                patient={registeredPatient}
                onClose={() => setPatientCardOpen(false)}
              />
            </DialogContent>
          </Dialog>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default PatientRegistration;
