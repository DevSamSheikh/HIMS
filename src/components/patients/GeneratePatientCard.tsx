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

interface GeneratePatientCardProps {
  patient: Patient;
}

const GeneratePatientCard: React.FC<GeneratePatientCardProps> = ({
  patient,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        className="flex items-center gap-2"
        onClick={() => setIsOpen(true)}
      >
        <CreditCard className="h-4 w-4" />
        Generate Card
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

export default GeneratePatientCard;
