import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CreditCard } from "lucide-react";
import { Patient } from "./types";
import PatientCard from "./PatientCard";

interface GeneratePatientCardButtonProps {
  patient: Patient;
  variant?:
    | "default"
    | "outline"
    | "secondary"
    | "ghost"
    | "link"
    | "destructive";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
}

const GeneratePatientCardButton: React.FC<GeneratePatientCardButtonProps> = ({
  patient,
  variant = "default",
  size = "default",
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button
        variant={variant}
        size={size}
        className={`flex items-center gap-2 ${className}`}
        onClick={() => setIsOpen(true)}
      >
        <CreditCard className="h-4 w-4" />
        Generate Patient Card
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Patient Identification Card</DialogTitle>
            <DialogDescription>
              Print this card for the patient to use for future visits
            </DialogDescription>
          </DialogHeader>
          <PatientCard patient={patient} onClose={() => setIsOpen(false)} />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default GeneratePatientCardButton;
