import React, { useState } from "react";
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
    patientType: [],
  });

  const [step, setStep] = useState<number>(1);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateStep1 = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name) newErrors.name = "Name is required";
    if (!formData.age || formData.age <= 0)
      newErrors.age = "Valid age is required";
    if (!formData.gender) newErrors.gender = "Gender is required";
    if (!formData.contact) newErrors.contact = "Contact number is required";
    if (!formData.address) newErrors.address = "Address is required";
    if (!formData.bloodGroup) newErrors.bloodGroup = "Blood group is required";
    if (formData.patientType?.length === 0)
      newErrors.patientType = "Select at least one patient type";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep1()) {
      setStep(2);
    }
  };

  const handleBack = () => {
    setStep(1);
  };

  const handleSubmit = () => {
    // Generate MR Number
    const year = new Date().getFullYear();
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const mrNumber = `MR-${year}-${randomNum}`;

    const newPatient: Patient = {
      id: Date.now().toString(),
      mrNumber,
      name: formData.name || "",
      age: formData.age || 0,
      gender: formData.gender || "",
      contact: formData.contact || "",
      address: formData.address || "",
      registrationDate: new Date().toISOString().split("T")[0],
      patientType: (formData.patientType as ("OPD" | "IPD")[]) || [],
      lastVisit: new Date().toISOString().split("T")[0],
      bloodGroup: formData.bloodGroup || "",
      email: formData.email,
      cnic: formData.cnic,
      emergencyContact: formData.emergencyContact,
      guardianName: formData.guardianName,
      guardianRelation: formData.guardianRelation,
      guardianContact: formData.guardianContact,
      insuranceProvider: formData.insuranceProvider,
      insuranceId: formData.insuranceId,
      allergies: formData.allergies,
      chronicDiseases: formData.chronicDiseases,
      notes: formData.notes,
    };

    onSuccess(newPatient);
  };

  const handlePatientTypeChange = (type: "OPD" | "IPD") => {
    const currentTypes = formData.patientType || [];
    if (currentTypes.includes(type)) {
      setFormData({
        ...formData,
        patientType: currentTypes.filter((t) => t !== type),
      });
    } else {
      setFormData({
        ...formData,
        patientType: [...currentTypes, type],
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Patient Registration</DialogTitle>
          <DialogDescription>
            Register a new patient and generate a unique MR number.
          </DialogDescription>
        </DialogHeader>

        {step === 1 ? (
          <div className="grid gap-4 py-4">
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
                <Label
                  htmlFor="age"
                  className={errors.age ? "text-destructive" : ""}
                >
                  Age <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="age"
                  type="number"
                  value={formData.age || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, age: parseInt(e.target.value) })
                  }
                  className={errors.age ? "border-destructive" : ""}
                />
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
                  <p className="text-xs text-destructive">
                    {errors.bloodGroup}
                  </p>
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

            <div className="space-y-2">
              <Label className={errors.patientType ? "text-destructive" : ""}>
                Patient Type <span className="text-destructive">*</span>
              </Label>
              <div className="flex space-x-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="opd"
                    checked={formData.patientType?.includes("OPD")}
                    onCheckedChange={() => handlePatientTypeChange("OPD")}
                  />
                  <Label htmlFor="opd" className="font-normal">
                    OPD (Outpatient)
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="ipd"
                    checked={formData.patientType?.includes("IPD")}
                    onCheckedChange={() => handlePatientTypeChange("IPD")}
                  />
                  <Label htmlFor="ipd" className="font-normal">
                    IPD (Inpatient)
                  </Label>
                </div>
              </div>
              {errors.patientType && (
                <p className="text-xs text-destructive">{errors.patientType}</p>
              )}
            </div>
          </div>
        ) : (
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="emergencyContact">Emergency Contact</Label>
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
                <Label htmlFor="guardianName">Guardian Name</Label>
                <Input
                  id="guardianName"
                  value={formData.guardianName}
                  onChange={(e) =>
                    setFormData({ ...formData, guardianName: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="guardianRelation">Guardian Relation</Label>
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
                <Label htmlFor="guardianContact">Guardian Contact</Label>
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
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="insuranceProvider">Insurance Provider</Label>
                <Input
                  id="insuranceProvider"
                  value={formData.insuranceProvider}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      insuranceProvider: e.target.value,
                    })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="insuranceId">Insurance ID</Label>
                <Input
                  id="insuranceId"
                  value={formData.insuranceId}
                  onChange={(e) =>
                    setFormData({ ...formData, insuranceId: e.target.value })
                  }
                />
              </div>
            </div>

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
              <Label htmlFor="chronicDiseases">Chronic Diseases (if any)</Label>
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
        )}

        <DialogFooter>
          {step === 2 && (
            <Button
              type="button"
              variant="outline"
              onClick={handleBack}
              className="mr-auto"
            >
              Back
            </Button>
          )}
          {step === 1 ? (
            <Button type="button" onClick={handleNext}>
              Next
            </Button>
          ) : (
            <Button type="button" onClick={handleSubmit}>
              Register Patient
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PatientRegistration;
