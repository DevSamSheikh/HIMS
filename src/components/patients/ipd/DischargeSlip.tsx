import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Printer } from "lucide-react";

interface DischargeSlipProps {
  discharge: {
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
  };
  onClose: () => void;
}

const DischargeSlip: React.FC<DischargeSlipProps> = ({
  discharge,
  onClose,
}) => {
  const handlePrint = () => {
    const printContent = document.getElementById("discharge-slip");
    const originalContents = document.body.innerHTML;

    if (printContent) {
      document.body.innerHTML = printContent.innerHTML;
      window.print();
      document.body.innerHTML = originalContents;
      window.location.reload();
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Discharge Summary</h2>
        <Button onClick={handlePrint} className="flex items-center gap-2">
          <Printer className="h-4 w-4" />
          Print Discharge Slip
        </Button>
      </div>

      <div id="discharge-slip" className="bg-white p-6 rounded-lg border">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-primary">
            Healthcare Information Management System
          </h1>
          <h2 className="text-xl font-semibold">DISCHARGE SUMMARY</h2>
          <p className="text-muted-foreground">
            123 Medical Center Drive, Healthcare City
          </p>
        </div>

        <Separator className="my-4" />

        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold">Patient Information</h3>
              <div className="grid grid-cols-2 gap-2 mt-2">
                <div className="text-muted-foreground">Patient Name:</div>
                <div className="font-medium">{discharge.patientName}</div>
                <div className="text-muted-foreground">Patient ID:</div>
                <div className="font-medium">{discharge.patientId}</div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold">Admission Details</h3>
              <div className="grid grid-cols-2 gap-2 mt-2">
                <div className="text-muted-foreground">Admission Date:</div>
                <div className="font-medium">{discharge.admissionDate}</div>
                <div className="text-muted-foreground">Discharge Date:</div>
                <div className="font-medium">{discharge.dischargeDate}</div>
                <div className="text-muted-foreground">Ward:</div>
                <div className="font-medium">{discharge.ward}</div>
                <div className="text-muted-foreground">Bed:</div>
                <div className="font-medium">{discharge.bed}</div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold">Medical Information</h3>
              <div className="grid grid-cols-2 gap-2 mt-2">
                <div className="text-muted-foreground">Attending Doctor:</div>
                <div className="font-medium">{discharge.doctor}</div>
                <div className="text-muted-foreground">Diagnosis:</div>
                <div className="font-medium">
                  {discharge.diagnosis || "Not specified"}
                </div>
                <div className="text-muted-foreground">Discharge Type:</div>
                <div className="font-medium">
                  <Badge variant="outline">
                    {discharge.dischargeType || "Normal Discharge"}
                  </Badge>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold">Follow-up Information</h3>
              <div className="grid grid-cols-2 gap-2 mt-2">
                <div className="text-muted-foreground">Follow-up Date:</div>
                <div className="font-medium">
                  {discharge.followUpDate || "To be scheduled"}
                </div>
              </div>
            </div>
          </div>
        </div>

        <Separator className="my-4" />

        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold">Treatment Summary</h3>
            <p className="mt-2 p-3 bg-muted/50 rounded-md">
              {discharge.treatmentSummary ||
                discharge.reason ||
                "No treatment summary provided."}
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold">Discharge Notes</h3>
            <p className="mt-2 p-3 bg-muted/50 rounded-md">
              {discharge.notes || "No additional notes."}
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold">Medications</h3>
            {discharge.medications && discharge.medications.length > 0 ? (
              <ul className="list-disc pl-5 mt-2">
                {discharge.medications.map((med, index) => (
                  <li key={index}>{med}</li>
                ))}
              </ul>
            ) : (
              <p className="mt-2 p-3 bg-muted/50 rounded-md">
                No medications prescribed.
              </p>
            )}
          </div>
        </div>

        <Separator className="my-4" />

        <div className="mt-8 grid grid-cols-2 gap-8">
          <div className="space-y-8">
            <div className="text-center">
              <div className="border-t border-dashed pt-2 w-48 mx-auto"></div>
              <p className="text-muted-foreground">Doctor's Signature</p>
            </div>
          </div>
          <div className="space-y-8">
            <div className="text-center">
              <div className="border-t border-dashed pt-2 w-48 mx-auto"></div>
              <p className="text-muted-foreground">Hospital Authority</p>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>
            This is an official discharge document of Healthcare Information
            Management System
          </p>
          <p>
            Document ID: {discharge.id} • Generated on:{" "}
            {new Date().toLocaleDateString()}
          </p>
        </div>
      </div>

      <div className="flex justify-end">
        <Button variant="outline" onClick={onClose}>
          Close
        </Button>
      </div>
    </div>
  );
};

export default DischargeSlip;
